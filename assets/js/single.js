let issueContainerEl = document.querySelector('#issues-container');
let limitWarningEl = document.querySelector('#limit-warning');
let repoNameEl = document.querySelector('#repo-name');

function getRepoName() {
    let queryString = document.location.search;
    let repoName = queryString.split('=')[1];

    getRepoIssues(repoName);

    repoNameEl.textContent = repoName;
}

function getRepoIssues(repo) {
    let apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;

    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    displayIssues(data);

                    // check if api has paginated issues 
                    if (response.headers.get('Link')) {
                        displayWarning(repo);
                    }
                })
            } else {
                alert("There was a problem with your request!");
            }
        })
};

function displayIssues(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!"; return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        let issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute = ('href', issues[i].html_url);
        issueEl.setAttribute = ('target', '_blank');

        // create span to hold issue title
        let titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;

        issueEl.appendChild(titleEl);

        // create a type element
        typeEl = document.createElement('span');

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

function displayWarning(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    let linkEl = document.createElement('a'); 
    
    linkEl.textContent = "GitHub.com"; 
    linkEl.setAttribute('href', `https://github.com/${repo}/issues`); 
    linkEl.setAttribute('target', '_blank');
    
    limitWarningEl.appendChild(linkEl);
}

getRepoName()
