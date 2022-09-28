const leaderBoard = document.getElementById("leaderboard");
const form = document.getElementById("form");
const firstName = document.getElementById("fname");
const lastName = document.getElementById("lname");
const score = document.getElementById("score");
const country = document.getElementById("country");
const errorMessage = document.querySelector(".error-msg");

// to store all the leaders
const namesArray = [];


class User {
  constructor(fname, lname, country, score) {
    this.fname = fname.toUpperCase()
    this.lname = lname.toUpperCase()
    this.country = country.toUpperCase()
    this.score = score
  }
}

document.addEventListener("DOMContentLoaded", displayNamesFromLocalStorage());

form.addEventListener("submit", e => {
  e.preventDefault();

  if(firstName.value == "" || lastName.value == "" || country.value == "" || score.value == ""){
    errorMessage.textContent = "All fields are required";
    errorMessage.style.display = "block";
  } else {
    addToLeaderBoard(firstName.value, lastName.value, country.value, score.value);
    clearFields();
  }

  // to clear the error message after 3secs
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);

})


// add the user's details to the leaderboard
function addToLeaderBoard(fname, lname, country, score) {
  // instantiate a new user with the details given
  let user = new User(fname, lname, country, score);

  const userContainer = document.createElement("div");
  userContainer.className = "person-container";
  leaderBoard.appendChild(userContainer);

  userContainer.innerHTML = `
        <div class="name-date">
            <p class="name">${user.fname} ${user.lname}</p>
            <p class="date">${getDate()}</p>
        </div>

        <div class="output-country">
            <p>${user.country}</p>
        </div>

        <div class="output-score">
            <p>${user.score}</p>
        </div>

        <div class="icons">
            <div class="trash" onclick="trash(this)">
                <svg class="trash-icon" fill="none" stroke="red" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                </svg>
            </div>
            <div class="add" onclick="addFiveToScore(this)">
                <p>+5</p>
            </div>
                <div class="minus" onclick="subtractFiveFromScore(this)">
                    <p>-5</p>
                </div>
            </div>
        </div>
    `

  sortScores(user.score, userContainer, "add");
  storeLocalStorage(user);
}


// to get the day's date
function getDate() {
  const newDate = new Date();
  let hour = addZero(newDate.getHours());
  let min = addZero(newDate.getMinutes());
  let day = addZero(newDate.getDate());
  let year = newDate.getFullYear();
  let month = newDate.getMonth();

  // changing the month to calender months
  switch (month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sept";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
    default:
      month = "Noth a calender month";
  }

  return `${month.toUpperCase()} ${day}, ${year} ${hour}:${min}`
}


// to add a zero to a number if it is less than 10
function addZero(arg) {
  if (Number(arg) < 10) {
    arg = "0" + arg;
  }

  return arg;
}

// sorting the scores 
function sortScores(newScore, user, sign) {
  // get all the scores present in the DOM
  let currentHtmlScoreList = document.querySelectorAll(".output-score p");
  let currentScores = [];
  const personContainerArray = leaderBoard.querySelectorAll(".person-container");

  for (let x of currentHtmlScoreList) {
    currentScores.push(x.textContent);
  }

  // sort the scores present on the leaderBoard
  currentScores.sort((a, b) => b - a);

  // find the index of the first number who is less than the new score
  const currentScoreIndex = currentScores.findIndex(score => Number(newScore) >= Number(score));

  // insert the user div before/after the score that is less than it's score for add and subtract calls respectively
  sign == "add" ? personContainerArray[currentScoreIndex].before(user) : personContainerArray[currentScoreIndex].after(user);
}


// to remove the user 
function trash(elem){
  // get the parent parent element of the trash icon clicked
  const parentContainer = elem.parentElement.parentElement;
  parentContainer.style.display = "none";

  // to remove the leader name from the localstorage
  removeLocalStorage(elem);
}


// to add five to the score
function addFiveToScore(elem){
  // select the score value that the element belongs to
  let scoreValue = elem.parentElement.previousElementSibling.firstElementChild

  // add 5 to that value
  scoreValue.innerHTML = Number(scoreValue.innerHTML) + 5;

  // sort the new score and change it's position on the leaderboard
  sortScores(scoreValue.innerHTML, elem.parentElement.parentElement, "add");

  // update the score on the localStorage
  updateLocalStorage(scoreValue);
}


// to subtract five from the score
function subtractFiveFromScore(elem){
  // select the score value that the element belongs to
  let scoreValue = elem.parentElement.previousElementSibling.firstElementChild

  // subtract 5 from that value
  scoreValue.innerHTML = Number(scoreValue.innerHTML) - 5;

  // sort the new score and change it's position on the leaderboard
  sortScores(scoreValue.innerHTML, elem.parentElement.parentElement, "subtract");

  // update the score on the localStorage
  updateLocalStorage(scoreValue);
}

// displaying the data in localstorage when DOM is loaded
function displayNamesFromLocalStorage(){
  // get all the leaders in the localStorage
  let leaders = JSON.parse(localStorage.getItem("leaders"));
  
  leaders.forEach((leader) => {
    addToLeaderBoard(leader.fname, leader.lname, leader.country, leader.score);
  })
}

// store data to local storage
function storeLocalStorage(usersName){
  namesArray.push(usersName);

  localStorage.setItem("leaders", JSON.stringify(namesArray));
}

// updating the local storage with the new score after adding/subtracting 5
function updateLocalStorage(elem){
  let usersName = elem.parentElement.parentElement.firstElementChild.firstElementChild.textContent
  
  // change the score value and change it on the array
  namesArray.forEach((leader) => {
    if(usersName == (leader.fname + " " + leader.lname)){
      leader.score = elem.innerHTML;
    }
  });

  // add the new array to the localStorage for update
  localStorage.setItem("leaders", JSON.stringify(namesArray));
}

// removing from the local storage
function removeLocalStorage(elem){
  // find the person's name
  let usersName = elem.parentElement.parentElement.firstElementChild.firstElementChild.textContent;

  // remove from the array
  namesArray.forEach((leader, index) => {
    if(usersName == (leader.fname + " " + leader.lname)){
      namesArray.splice(index, 1)
    }
  });

  // add the new array to the localStorage
  localStorage.setItem("leaders", JSON.stringify(namesArray));
}

// clear form fields after submitting
function clearFields(){
  firstName.value = ""
  lastName.value = ""
  country.value = ""
  score.value = ""
}
