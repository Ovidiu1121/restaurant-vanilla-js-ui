export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
    	<h1>Restaurants</h1>

    <button class="button">Add restaurant</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Name</th>
				<th>Location</th>
				<th>Rating</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `

    api("https://localhost:7085/api/v1/Restaurant/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachRestaurants(data.restaurantList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddRestaurantPage();
    });

}

export function CreateAddRestaurantPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Restaurant</h1>
    <form>
        <p class="name-container">
            <label for="name">Name</label>
            <input name="name" type="text" id="name">
            <a class="nameErr">Name required!</a>
        </p>
        <p class="location-container">
            <label for="location">Location</label>
            <input name="location" type="text" id="location">
            <a class="locationErr">Location required!</a>
        </p>
        <p class="rating-container">
            <label for="rating">Rating</label>
            <input name="rating" type="text" id="rating">
            <a class="ratingErr">Rating required!</a>
        </p>
        <div class="createRestaurant">
         <a href="#">Create New Restaurant</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createRestaurant");

    button.addEventListener("click", (eve) => {
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createRestaurant();
    })

}

function createRow(res) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${res.id}</td>
				<td>${res.name}</td>
				<td>${res.location}</td>
				<td>${res.rating}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachRestaurants(restaurants) {

    let lista = document.querySelector("thead");

    restaurants.forEach(res => {

        let tr = createRow(res);
        lista.appendChild(tr);

    });

    return lista;

}

function createRestaurant() {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

    let name = document.getElementById("name").value;
    let location = document.getElementById("location").value;
    let rating = document.getElementById("rating").value;

    let nameError = document.querySelector(".nameErr");
    let locationError = document.querySelector(".locationErr");
    let ratingError = document.querySelector(".ratingErr");

    let errors = [];

    if (name == '') {

        errors.push("Name");

    } else if (nameError.classList.contains("beDisplayed") && name !== '') {

        errors.pop("Name");
        nameError.classList.remove("beDisplayed");
    }

    if (location == '') {

        errors.push("Location");

    } else if (locationError.classList.contains("beDisplayed") && location !== '') {

        errors.pop("Location");
        locationError.classList.remove("beDisplayed");
    }

    if (rating == '') {

        errors.push("Rating");

    } else if (ratingError.classList.contains("beDisplayed") && rating !== '') {

        errors.pop("Rating");
        ratingError.classList.remove("beDisplayed");

    }

    if (!isNumber(rating) && rating != '') {

        errors.push("Rating2");
    }
    else if (isNumber(rating)) {

        errors.pop("Rating2");

    } else if (ratingError.classList.contains("beDisplayed") && rating !== '') {

        errors.pop("Rating2");
        ratingError.classList.remove("beDisplayed");
    }

    if (errors.length == 0) {

        let restaurant = {
            name: name,
            location: location,
            rating: rating
        }


        api("https://localhost:7085/api/v1/Restaurant/create", "POST", restaurant)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {

        errors.forEach(err => {

            if (err.includes("Name")) {

                nameError.classList.add("beDisplayed");
            }

            if (err.includes("Location")) {

                locationError.classList.add("beDisplayed");
            }

            if (err.includes("Rating")) {

                ratingError.classList.add("beDisplayed");
            }

            if (err.includes("Rating2")) {
                ratingError.classList.add("beDisplayed")
                ratingError.textContent = "Only numbers";
            }

        })

    }

}