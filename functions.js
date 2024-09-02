export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
  <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div>  

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

    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7085/api/v1/Restaurant/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        console.log(data);
        attachRestaurants(data.restaurantList);
    }).catch(error => {
        load.classList = "";
        console.error('Error fetching data:', error);
        appendAlert(error, "danger");
    });

    button.addEventListener("click", (eve) => {
        CreateAddRestaurantPage();
    });

    table.addEventListener("click", (eve) => {

        if (eve.target.classList.contains("updateRes")) {
            api(`https://localhost:7085/api/v1/Restaurant/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let restaurant = {
                    name: data.name,
                    location: data.location,
                    rating: data.rating
                }

                CreateUpdatePage(restaurant, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("Restaurant has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("Restaurant has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("Restaurant has been ADDED with success!", "success");
    }

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
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateRestaurant("create");
    })

}

export function CreateUpdatePage(restaurant, idRes) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Restaurant</h1>
    <form>
        <p>
            <label for="name">Name</label>
            <input name="name" type="text" id="name" value="${restaurant.name}">
             <a class="nameErr">Name required!</a>
        </p>
        <p>
            <label for="location">Location</label>
            <input name="location" type="text" id="location" value="${restaurant.location}">
             <a class="locationErr">Location required!</a>
        </p>
        <p>
            <label for="rating">Rating</label>
            <input name="rating" type="text" id="rating" value="${restaurant.rating}">
             <a class="ratingErr">Rating required!</a>
        </p>

        <div class="submitUpdate">
         <a href="#">Update Restaurant</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete Restaurant</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let nameinput = document.getElementById("name");
    let locationinput = document.getElementById("location");

    nameinput.disabled = true;
    locationinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateRestaurant("update", idRes);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7085/api/v1/Restaurant/delete/${idRes}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(res) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td class="updateRes">${res.id}</td>
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

function createUpdateRestaurant(request, idRes) {

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

        if (request === "create") {
            api("https://localhost:7085/api/v1/Restaurant/create", "POST", restaurant)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7085/api/v1/Restaurant/update/${idRes}`, "PUT", restaurant)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
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