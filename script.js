'use strict';

const searchURL = 'https://api.openbrewerydb.org/breweries';

function formatQueryParams(params) {
    console.log("formatQueryParams function working");
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log("displayResults function working");
    //Clear previous results, if any
    $('#results-list').empty();
    //Looping through response and formatting results
    for (let i = 0; i < responseJson.length; i++) {
        $('#results-list').append(
            `<li>
                <h4>${responseJson[i].name}</h4>
                    <a class="js-link" href="http://maps.google.com/maps?q=${responseJson[i].street}+${responseJson[i].city}+${responseJson[i].state}+${responseJson[i].postal_code}" target="_blank"> </br>
                    ${responseJson[i].street} </br> 
                    ${responseJson[i].city}, ${responseJson[i].state} ${responseJson[i].postal_code}</a> </br> </br>
                    ${responseJson[i].phone}                     
                </br> </br>
                <a href="${responseJson[i].website_url}" target="_blank" class="js-link">${responseJson[i].website_url}</a>
            </li>`
        );
    }
    if (responseJson == 0) {
        $('#results-list').text(`No Results, Please Try Again`);
    };
    //removing hidden class to show results 
    $('#results').removeClass('hidden');
}


function searchBrews(query) {
    console.log("searchBrews function working");
    //Grabbing the value from the datalist for the params
    let option = $("#search-by").val()
    //Setting up params
    const params = {
        [option]: query,
    };
    //Creating the URL string
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);
    //Fetch information, with an error message option
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    console.log("watchForm function working");
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        searchBrews(searchTerm);
    });
}

$(watchForm);