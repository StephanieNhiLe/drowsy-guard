import os
import gdown
import torch
from PIL import Image
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn

model_path = './model/drowsiness_detection_model.pth'
if not os.path.exists(model_path):
    print(f"Model file not found at {model_path}. Downloading...")
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    file_id = '1iqCRSMsoqjYbqwmTI4fTAULx7psV5WwE'
    url = f'https://drive.google.com/uc?id={file_id}'
    gdown.download(url, model_path, quiet=False)
else:
    print(f"Model file found at {model_path}.")

class DrowsinessModel:
    def __init__(self, model_path=model_path):
        self.model = models.resnet50(weights='IMAGENET1K_V2')
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
        
        self.model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def predict(self, image: Image.Image):
        image_tensor = self.transform(image).unsqueeze(0)
        with torch.no_grad():
            outputs = self.model(image_tensor)
            _, predicted = torch.max(outputs, 1)
        
        return 'Drowsy' if predicted.item() == 1 else 'Non-Drowsy'
