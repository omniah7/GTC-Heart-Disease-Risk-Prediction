function goToForm() {
    document.getElementById("landingCard").classList.remove("active");
    document.getElementById("formCard").classList.add("active");
}

function goBack() {
    document.getElementById("formCard").classList.remove("active");
    document.getElementById("landingCard").classList.add("active");
    document.getElementById("result").style.display = "none";
}

document.getElementById("riskForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const msgBox = document.getElementById("result");
    msgBox.style.display = "none";

    // Collect data
    const data = {
    age: document.getElementById("age").value,
    sex: document.getElementById("sex").value,
    cp: document.getElementById("cp").value,
    trestbps: document.getElementById("trestbps").value,
    chol: document.getElementById("chol").value,
    fbs: document.getElementById("fbs").value,
    restecg: document.getElementById("restecg").value,
    thalach: document.getElementById("thalach").value,
    exang: document.getElementById("exang").value,
    oldpeak: document.getElementById("oldpeak").value,
    slope: document.getElementById("slope").value,
    ca: document.getElementById("ca").value,
    thal: document.getElementById("thal").value,
    };

    // Validation: Ensure no empty fields
    for (let key in data) {
    if (data[key] === "" || data[key] === null) {
        msgBox.className = "result error";
        msgBox.style.display = "block";
        msgBox.innerHTML = "⚠️ Please fill in all fields before submitting.";
        return;
    }
    }

    // Convert to correct types
    const formattedData = {
    age: parseInt(data.age),
    sex: parseInt(data.sex),
    cp: parseInt(data.cp),
    trestbps: parseInt(data.trestbps),
    chol: parseInt(data.chol),
    fbs: parseInt(data.fbs),
    restecg: parseInt(data.restecg),
    thalach: parseInt(data.thalach),
    exang: parseInt(data.exang),
    oldpeak: parseFloat(data.oldpeak),
    slope: parseInt(data.slope),
    ca: parseInt(data.ca),
    thal: parseInt(data.thal),
    };

    try {
    const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
    });

    const result = await res.json();
    msgBox.style.display = "block";

    if (result.prediction === 1) {
        msgBox.className = "result danger";
        msgBox.innerHTML = `⚠️ ${result.message}<br>Please consult a cardiologist as soon as possible.`;
    } else {
        msgBox.className = "result success";
        msgBox.innerHTML = `✅ ${result.message}<br>Keep a healthy lifestyle with regular exercise and balanced diet.`;
    }
    msgBox.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {
    msgBox.className = "result error";
    msgBox.style.display = "block";
    msgBox.innerHTML = "Error connecting to server.";
    }
});
