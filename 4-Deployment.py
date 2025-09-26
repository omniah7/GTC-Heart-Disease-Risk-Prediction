from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
MODEL_PATH = os.path.join(BASE_DIR, "data", "heart_disease_model.pkl")

model = joblib.load(MODEL_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # --- 1.---
        age = data["age"]
        sex = data["sex"]
        cp = data["cp"]          # 0-3
        trestbps = data["trestbps"]
        chol = data["chol"]
        fbs = data["fbs"]
        restecg = data["restecg"]  # 0-2
        thalach = data["thalach"]
        exang = data["exang"]
        oldpeak = data["oldpeak"]
        slope = data["slope"]      # 0-2
        ca = data["ca"]
        thal = data["thal"]        # 1-3

        # --- 2. Feature Engineering ---
        Age_BP_Interaction = age * trestbps
        Age_Chol_Interaction = age * chol
        Chol_BP_Interaction = chol * trestbps
        BP_Chol_Ratio = trestbps / chol if chol != 0 else 0
        Age_Squared = age ** 2
        Chol_Squared = chol ** 2

        # --- 3. One-Hot Encoding  ---
        cp_1, cp_2, cp_3 = 0, 0, 0
        if cp == 1: cp_1 = 1
        elif cp == 2: cp_2 = 1
        elif cp == 3: cp_3 = 1

        restecg_1, restecg_2 = 0, 0
        if restecg == 1: restecg_1 = 1
        elif restecg == 2: restecg_2 = 1

        thal_2, thal_3 = 0, 0
        if thal == 2: thal_2 = 1
        elif thal == 3: thal_3 = 1

        # --- 4. feature vector ---
        features = np.array([[
            age, trestbps, chol, thalach, oldpeak,
            Age_BP_Interaction, Age_Chol_Interaction,
            Chol_BP_Interaction, BP_Chol_Ratio,
            Age_Squared, Chol_Squared,
            sex, fbs, exang, ca, slope,
            cp_1, cp_2, cp_3,
            restecg_1, restecg_2,
            thal_2, thal_3
        ]])

        # --- 5. Prediction ---
        prediction = int(model.predict(features)[0])
        probability = float(model.predict_proba(features)[0][1])

        message = "High risk of heart disease" if prediction == 1 else "Low risk of heart disease"

        return jsonify({
            "prediction": int(prediction),
            "probability": round(float(probability), 4),
            "message": message
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
