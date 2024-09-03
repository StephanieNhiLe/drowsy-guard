from transformers import AutoModelForImageClassification, AutoFeatureExtractor
import torch
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()
hf_token = os.getenv('HUGGINGFACE_TOKEN')

class drowsinessDetector:
    def __init__(self, model_name="vp13/drowsiness"):
        self.model_name = model_name
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.feature_extractor = None
        self.class_names = ["Alert", "Drowsy"]
        self.setup_model()

    def setup_model(self):
        print(f"Loading model from {self.model_name}...")
        self.model = AutoModelForImageClassification.from_pretrained(self.model_name, use_auth_token=hf_token)
        self.feature_extractor = AutoFeatureExtractor.from_pretrained(self.model_name, use_auth_token=hf_token)
        self.model.to(self.device)
        self.model.eval()
        print("Model loaded successfully.")

    def predict(self, image):
        if not isinstance(image, Image.Image):
            image = Image.open(image).convert('RGB')
        
        inputs = self.feature_extractor(images=image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)

        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
        predicted_class = self.class_names[predicted_class_idx]
        
        return predicted_class