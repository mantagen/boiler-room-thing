let state = {}

const updateState = data => state => cb => {
  state = Object.assign({}, state, data)
  cb(state)
}

const fetchFavourites = cb => fetch('/favourites')
.then(res => {
  if (!res.ok) {
    throw Error(response.statusText)
  }
  return res.json()
})
.then(cb)
.catch(err => console.err)

const receiveFavourites = results => updateState({ 'favourites': results })

const favouriteListItem = ({ title, artist, venue, city }) => `
  <article>
    <header>
      <h2>${title}</h2>
    </header>
    <section>
      <h3>Artist: ${artist}</h3>
      <h3>Venue: ${venue}</h3>
      <h3>City: ${city}</h3>
    </section>
  </article>
`

const favouriteList = favourites => `
  <section>
    <header><h1>Favourites</h1></header>
    ${favourites.map(favouriteListItem).join('')}
  </section>
`

const render = dom => id => state => {
  dom.getElementById(id).innerHTML = favouriteList(state.favourites)
}

const init = () => {
  const dom = document
  const id = 'main'
  const renderToDom = render(dom)(id)
  fetchFavourites(faves => receiveFavourites(faves)(state)(renderToDom))
}

init()
