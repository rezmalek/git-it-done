let userFromEl = document.querySelector('#user-form');
let nameInputEl = document.querySelector('#username');
let repoSearchTerm = document.querySelector('#repo-search-term');
let repoContainerEl = document.querySelector('#repos-container');

function getUserRepos(user) {
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
             displayRepos(data, user)
        })
    })
};

function formSubmitHandler(event) {
    event.preventDefault();
    
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = '';
    } else {
        alert('Please enter a valid Github username')
    }
};

function displayRepos(repos, searchTerm) {
    // to clear out old content before displaying new content
    repoContainerEl.textContent = '';
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        let repoName = `${repos[i].owner.login}/${repos[i].name}`;

        // create a container for each repo
        let repoEl = document.createElement('div');
        repoEl.classList = 'list-item flex-row justify-space-between';

        // create a span to hold repository name
        let titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        repoEl.appendChild(titleEl);
        repoContainerEl.appendChild(repoEl)
    }
}

userFromEl.addEventListener('submit', formSubmitHandler);

