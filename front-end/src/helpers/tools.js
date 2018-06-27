export const voicePrompt = (prompt) => {
    // message.success('The Message has been sent successfully!');
    let utterThis = new window.SpeechSynthesisUtterance(prompt);
    window.speechSynthesis.speak(utterThis);
};

export const weekArray = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];

// export const socket = io.connect('http://127.0.0.1:5000/transcript');
