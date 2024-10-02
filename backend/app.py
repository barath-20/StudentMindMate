import requests
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    # Call the Gemini AI API with the user's message
    response = requests.post(
        'https://generativelanguage.googleapis.com/v1beta/tunedModels/mentalhealthbot-jsj1i67xcqk8:generateContent',
        params={'key': 'AIzaSyC3va7f9mdbCr-nTFQvBJ3IaxB0LLqswlw'}, 
        json={
            "contents": [
                {
                    "parts": [
                        {
                            "text": user_message  # Ensure this matches the API specification
                        }
                    ]
                }
            ]
        }
       
    )

    # Check if the response is successful
    if response.status_code == 200:
        # Extract the reply from the AI response
        ai_reply = response.json()['candidates'][0]['content']['parts'][0]['text']
    else:
        ai_reply = f"I'm having trouble reaching the AI service. Status: {response.status_code}, Response: {response.text}"

    return jsonify({"reply": ai_reply})

if __name__ == '__main__':
    app.run(debug=True)
