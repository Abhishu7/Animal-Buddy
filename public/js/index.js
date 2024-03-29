// The API object contains methods for each kind of request we'll make
var API = {
  savePost: function(post) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/posts",
      data: JSON.stringify(post)
    });
  },
  getPosts: function() {
    return $.ajax({
      url: "/api/posts",
      type: "GET"
    });
  },
  deletePost: function(id) {
    return $.ajax({
      url: "/api/posts/" + id,
      type: "DELETE"
    });
  },
  getByCategory: function(category) {
    console.log(category);
    return $.ajax({
      url: "/api/posts/category/" + category,
      type: "GET"
    });
  },
  getById: function(id) {
    console.log(id);
    return $.ajax({
      url: "/api/posts/id/" + id,
      type: "GET"
    });
  }
};

var latitude;
var longitude;

var getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(storePosition);
  } else {
    throw new Error("Geolocation required.");
  }
};

function storePosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log(latitude, longitude);
}

var refreshCategory = function(category) {
  console.log(category);
  API.getByCategory(category).then(function(data) {
    console.log(data);
    var $posts = data.map(function(post) {
      console.log(post);
      var $a = $("<a>")
        .text(post.animal_name)
        .attr("href", "/posts/" + post.id);

      var $location = $("<h4>")
        .text(post.location)
        .attr("class", "animal-location");

      var $image = $("<img>").attr({ src: post.img, class: "animal-image" });

      var $caption = $("<p>")
        .text(post.caption)
        .attr("class", "animal-caption");

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": post.id
        })
        .append($a)
        .append($location)
        .append($image)
        .append($caption);

      console.log($li);

      return $li;
    });

    console.log($posts);

    $("#animal-list").empty();
    $("#animal-list").prepend($posts);
  });
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshPosts = function() {
  API.getPosts().then(function(data) {
    var $posts = data.map(function(post) {
      console.log(post);
      var $a = $("<a>")
        .text(post.animal_name)
        .attr("href", "/posts/" + post.id);

      var $location = $("<h4>")
        .text(post.location)
        .attr("class", "animal-location");

      var $image = $("<img class='animal-image'>").attr("src", post.img);

      var $caption = $("<p>")
        .text(post.caption)
        .attr("class", "animal-caption");

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": post.id
        })
        .append($a)
        .append($location)
        .append($image)
        .append($caption);

      console.log($li);

      return $li;
    });

    console.log($posts);

    $("#animal-list").empty();
    $("#animal-list").prepend($posts);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {

$("#submit").on("click", function(event) {
  event.preventDefault();

  console.log("submitting");

  var post = {
    animal_name: $("#inputAnimal")
      .val()
      .trim(),
    location: $("#inputLocation")
      .val()
      .trim(),
    img: $("#imageUrl")
      .val()
      .trim(),
    caption: $("#caption")
      .val()
      .trim(),
    category: $("#category")
      .val()
      .trim(),
    latitude: latitude,
    longitude: longitude
  };

  console.log(post);

  // if (!(post.text && post.description)) {
  //   alert("You must enter an example text and description!");
  //   return;
  // }

  API.savePost(post).then(function() {
    // refreshPosts();
    console.log("posted");
    $("#inputAnimal").val("");
    $("#inputLocation").val("");
    $("#imageUrl").val("");
    $("#caption").val("");
    $("#category").val("");
    window.location.href = "/view";
  });
});

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deletePost(idToDelete).then(function() {
    refreshPosts();
  });
};

// Add event listeners to the submit and delete buttons
$(".delete").on("click", handleDeleteBtnClick);
$(".category-select").on("click", function() {
  console.log($(this).val());
  newVal = $(this).val();
  refreshCategory(newVal);
});

getLocation();
refreshPosts();
