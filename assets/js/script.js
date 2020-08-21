let userFromEl = document.querySelector('#user-form');
let nameInputEl = document.querySelector('#username');
let repoSearchTerm = document.querySelector('#repo-search-term');
let repoContainerEl = document.querySelector('#repos-container');
let languageButtonsEl = document.querySelector('#language-buttons')

function getUserRepos(user) {
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user)
                })
            } else {
                alert(`Error: User ${response.statusText}`)
            }
        })
        .catch(function(error) {
            alert('Unable to connect to GitHub')
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
    // check if api returned any repos 
    if (repos.length === 0) {
        repoContainerEl.textContent = "This user has no repositioreis.";
        return; 
    };
    // to clear out old content before displaying new content
    repoContainerEl.textContent = '';
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        let repoName = `${repos[i].owner.login}/${repos[i].name}`;

        // create a container for each repo
        let repoEl = document.createElement('a');
        repoEl.classList = 'list-item flex-row justify-space-between align-center';
        repoEl.setAttribute('href', `./single-repo.html?repo=${repoName}`);
        repoEl.setAttribute('target', '_blank');

        // create a span to hold repository name
        let titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // create a status element
        let statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = `<i class = "fas fa-times status-icon icon-danger"></i> ${repos[i].open_issues_count}`
        } else {
            statusEl.innerHTML = `<i class = "fas fa-check-square status-icon" style="color:blue;"></i>`
        }

        repoEl.appendChild(titleEl);
        repoEl.appendChild(statusEl);
        repoContainerEl.appendChild(repoEl)
    }
};

function getFeaturedRepos(language) {
    let apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data.items, language);
                })
            } else {
                alert("Error: " + response.statusText);
            }
        })
        
};

function buttonClickHandler(event) {
    let language = event.target.getAttribute('data-language');
    
    if (language) { 
        getFeaturedRepos(language);
        
        // clear old content
        repoContainerEl.textContent = ''; 
    }
}

userFromEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);

