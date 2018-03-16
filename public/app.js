function showModal() {
    console.log("working");
    $("#modal_" + $(this).attr("data-id")).show();

    function closeModal() {
        $("#modal_" + $(this).attr("data-id")).hide();
    };

    $(document).on("click", ".modalClose", closeModal);
};
$(document).on("click", ".note-button", showModal);


$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  console.log("click firing");
  var thisId = $(this).attr("data-id");
  console.log("pre-note-body");
  var noteBody = $("#bodyinput-"+$(this).attr("data-id")).val();
  console.log(noteBody);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: noteBody
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      location.reload();
    });
    
});

$(document).on("click", "#deletenote", function() {
  console.log("working");
  var id = $(this).attr("data-note");
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + id,
    data: {
    }
  })

    .done(function(data) {

      console.log(data);

      location.reload();
    });
});

$(document).on("click", ".save-button", function() {
  var id = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + id,
    data: {
    }
  })

    .done(function(data) {

      console.log(data);

      location.reload();
    });
});

$(document).on("click", ".unsave-button", function() {
  var id = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/unsave/" + id,
    data: {
    }
  })

    .done(function(data) {

      console.log(data);

      location.reload();
    });
});