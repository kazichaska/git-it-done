
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
}

var getUserRepos = function(user) {
    // format the github API url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
        } else {
            alert("Error: Github User Not Found");
        }
        })
        .catch(function(error) {
            // notice this `.catch()` getting chained on the end of the `.then()` method
            alert("Unable to connect to Github");
        });
};

userFormEl.addEventListener("submit", formSubmitHandler);

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length == 0){
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // In the for loop, we're taking each repository (repos[i]) and writing some of its data to 
    // the page. First we format the appearance of the name and repository name. Next we create and 
    // style a <div> element. Then we create a <span> to hold the formatted repository name. We add 
    // that to the <div> and add the entire <div> to the container we created earlier.

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};


