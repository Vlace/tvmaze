/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	let response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
	return [ response ];
}

//Once Episodes have been fetched, attach them to the DOM and show the episodes portion of the site
function populateEpisodes(arr) {
	for (let elements of arr) {
		let list = $(`<li>${elements.name} (Season ${elements.season}: Number ${elements.number})</li>`);
		$('#episodes-list').append(list);
		$('#episodes-area').show();
	}
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();
	let arrayNum = 0;

	for (let show of shows) {
		const getShowData = show.data[arrayNum].show;
		console.log(getShowData);
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.data[arrayNum].show.id}">
         <div class="card" data-show-id="${show.data[arrayNum].show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.data[arrayNum].show.name}</h5>
             <p class="card-text">${show.data[arrayNum].show.summary}</p>
             <button id="getEpisodes">Episodes List</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
		//if image is not available, don't attaach one.
		if (getShowData.image.original) {
			$item.append(`<img class="card-img-top" src="${getShowData.image.original}">`);
		}
		//fetch the episodes when episodes button is clicked
		$('#getEpisodes').on('click', async function() {
			let showId = $('.card').attr('data-show-id');

			let episodesData = await getEpisodes(showId);
			console.log(episodesData);
			episodesArray = [];
			for (let episodes of episodesData) {
				let episodesObj = {
					name: episodes.name,
					season: episodes.season,
					number: episodes.number
				};
				episodesArray.push(episodesObj);
			}
			let episodesfinished = await episodesArray;
			populateEpisodes(episodesfinished);
		});
		arrayNum += 1;
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;
	searchShows(query);

	$('#episodes-area').hide();

	let shows = await searchShows(query);
	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
	let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	return response.data;
}
