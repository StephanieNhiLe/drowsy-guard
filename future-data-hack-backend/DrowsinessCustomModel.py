import gdown
import torch
from PIL import Image
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn

# Download the model file from Google Drive
file_id = '1iqCRSMsoqjYbqwmTI4fTAULx7psV5WwE'
url = f'https://drive.google.com/uc?id={file_id}'
output = './model/drowsiness_detection_model.pth'
gdown.download(url, output, quiet=False)

class DrowsinessModel:
    def __init__(self, model_path='./model/drowsiness_detection_model.pth'):
        # Define the model architecture
        self.model = models.resnet50(weights='IMAGENET1K_V2')
        
        # Modify the final layer to match the trained model
        num_features = self.model.fc.in_features
        self.model.fc = nn.Sequential(
            nn.Linear(num_features, 1024),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(1024, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 2)
        )
        
        # Load the saved state_dict
        self.model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        self.model.eval()
        
        # Define transformations
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def predict(self, image: Image.Image):
        # Transform image
        image_tensor = self.transform(image).unsqueeze(0)
        
        # Make prediction
        with torch.no_grad():
            outputs = self.model(image_tensor)
            _, predicted = torch.max(outputs, 1)
        
        return 'Drowsy' if predicted.item() == 1 else 'Non-Drowsy'
