document.addEventListener("DOMContentLoaded", function() {
  // -----------------------
  // Authentication Logic
  // -----------------------
  const authPageWrapper = document.getElementById("authPageWrapper");
  const authPage = document.getElementById("authPage");
  const mainPage = document.getElementById("mainPage");
  const authForm = document.getElementById("authForm");
  const formTitle = document.getElementById("formTitle");
  const toggleText = document.getElementById("toggleText");
  const toggleLink = document.getElementById("toggleLink");
  let isLogin = true;
  
  toggleLink.addEventListener("click", function(e) {
    e.preventDefault();
    isLogin = !isLogin;
    if (isLogin) {
      formTitle.textContent = "Login";
      toggleText.textContent = "Don't have an account?";
      toggleLink.textContent = "Sign Up";
    } else {
      formTitle.textContent = "Sign Up";
      toggleText.textContent = "Already have an account?";
      toggleLink.textContent = "Login";
    }
  });
  
  authForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email && password) {
      // Dummy auth: store a flag and show main page
      localStorage.setItem("loggedIn", "true");
      authPageWrapper.style.display = "none"; // Hide the auth background
      mainPage.style.display = "block";       // Show main content
      document.body.style.background = "#f0f4f8"; // Switch body background
    } else {
      alert("Please fill in both fields.");
    }
  });
  
  // If user refreshes while "loggedIn" is true, skip login
  if (localStorage.getItem("loggedIn") === "true") {
    authPageWrapper.style.display = "none";
    mainPage.style.display = "block";
    document.body.style.background = "#f0f4f8";
  }
  
  // -----------------------
  // Main Page Logic
  // -----------------------
  const logoutBtn = document.getElementById("logoutBtn");
  const topicBoxes = document.querySelectorAll(".topic-box");
  const difficultySelect = document.getElementById("difficultySelect");
  const generateBtn = document.getElementById("generateBtn");
  const selectionPage = document.getElementById("selectionPage");
  const problemPage = document.getElementById("problemPage");
  const problemTitle = document.getElementById("problemTitle");
  const problemText = document.getElementById("problemText");
  const backBtn = document.getElementById("backBtn");
  const hintBtn = document.getElementById("hintBtn");
  const hintSection = document.getElementById("hintSection");
  const submitCodeBtn = document.getElementById("submitCode");
  const newQuestionBtn = document.getElementById("newQuestion");
  
  let selectedTopic = "";
  let selectedDifficulty = "";
  let editor;
  
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("loggedIn");
    location.reload();
  });
  
  // Select topic from grid
  topicBoxes.forEach(function(box) {
    box.addEventListener("click", function() {
      topicBoxes.forEach(function(b) {
        b.classList.remove("active");
      });
      box.classList.add("active");
      selectedTopic = box.textContent;
    });
  });
  
  // Dummy problem generator (replace with your LLM integration if needed)
  function generateProblem(topic, difficulty) {
    return (
      "Problem for " + topic + " [" + difficulty + "]:\n\n" +
      "Write a function to solve a problem related to " + topic + ".\n" +
      "Consider edge cases and optimize your solution.\n\n" +
      "(Placeholder text. Integrate your LLM or custom logic here.)"
    );
  }
  
  // Clears the CodeMirror editor
  function clearEditor() {
    if (editor) {
      editor.setValue("");
    }
  }
  
  // Sets the problem text in the UI
  function setProblem(topic, difficulty) {
    const problem = generateProblem(topic, difficulty);
    problemTitle.textContent = topic + " - " + difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    problemText.textContent = problem;
    clearEditor();
  }
  
  // Generate button: pick new problem & show problem page
  generateBtn.addEventListener("click", function() {
    selectedDifficulty = difficultySelect.value;
    if (!selectedTopic || !selectedDifficulty) {
      alert("Please select a topic and a difficulty level.");
      return;
    }
    // If editor not yet created, create it
    if (!editor) {
      editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
        lineNumbers: true,
        lineWrapping: true,
        mode: "python",
        theme: "material-darker",
        indentUnit: 4,
        tabSize: 4
      });
    }
    
    setProblem(selectedTopic, selectedDifficulty);
    selectionPage.style.display = "none";
    problemPage.style.display = "block";
  });
  
  // Back button: return to selection page, reset code
  backBtn.addEventListener("click", function() {
    hintSection.style.display = "none";
    hintBtn.textContent = "Show Hint";
    clearEditor();
    problemPage.style.display = "none";
    selectionPage.style.display = "block";
  });
  
  // Toggle hint
  hintBtn.addEventListener("click", function() {
    if (hintSection.style.display === "none" || hintSection.style.display === "") {
      hintSection.style.display = "block";
      hintBtn.textContent = "Hide Hint";
    } else {
      hintSection.style.display = "none";
      hintBtn.textContent = "Show Hint";
    }
  });
  
  // Submit code
  submitCodeBtn.addEventListener("click", function() {
    if (editor) {
      const userCode = editor.getValue();
      // Replace this with your own submission logic or API call
      alert("Code submitted:\n" + userCode);
    }
  });
  
  // New Question: same topic/difficulty, but new problem text
  newQuestionBtn.addEventListener("click", function() {
    if (!selectedTopic || !selectedDifficulty) {
      alert("No topic/difficulty selected.");
      return;
    }
    setProblem(selectedTopic, selectedDifficulty);
  });
});
