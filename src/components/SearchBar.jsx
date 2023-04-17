import React from "react"

const SearchBar = () => {
    return (
        <div className="search-bar">
            <form>
                <input type="text" placeholder="Search"></input>

                <button type="submit"> Rechercher </button>
            </form>

        </div>
    )
}

export default SearchBar;