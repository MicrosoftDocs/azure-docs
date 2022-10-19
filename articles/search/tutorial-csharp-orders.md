---
title: C# tutorial on ordering results
titleSuffix: Azure Cognitive Search
description: This C# tutorial demonstrates how to order search results. It builds on a previous hotels project, sorting by primary property, secondary property, and includes a scoring profile to add boosting criteria.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: csharp
ms.topic: tutorial
ms.date: 01/26/2021
ms.custom: "devx-track-js, devx-track-csharp"
---

# Tutorial: Order search results using the .NET SDK

Throughout this tutorial series, results have been returned and displayed in a [default order](index-add-scoring-profiles.md#what-is-default-scoring). In this tutorial, you will add primary and secondary sort criteria. As an alternative to ordering based on numerical values, the final example shows how to rank results based on a custom scoring profile. We will also go a bit deeper into the display of _complex types_.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Order results based on one property
> * Order results based on multiple properties
> * Order results based on a scoring profile

## Overview

This tutorial extends the infinite scrolling project created in the [Add paging to search results](tutorial-csharp-paging.md) tutorial.

A finished version of the code in this tutorial can be found in the following project:

* [5-order-results (GitHub)](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/v11/5-order-results)

## Prerequisites

* [2b-add-infinite-scroll (GitHub)](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/v11/2b-add-infinite-scroll) solution. This project can either be your own version built from the previous tutorial or a copy from GitHub.

This tutorial has been updated to use the [Azure.Search.Documents (version 11)](https://www.nuget.org/packages/Azure.Search.Documents/) package. For an earlier version of the .NET SDK, see [Microsoft.Azure.Search (version 10) code sample](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/v10).

## Order results based on one property

When ordering results based on one property, such as hotel rating, we not only want the ordered results, we also want confirmation that the order is correct. Adding the Rating field to the results allows us to confirm the results are sorted correctly.

In this exercise, we will also add a bit more to the display of results: the cheapest room rate, and the most expensive room rate, for each hotel.

There is no need to modify any of the models to enable ordering. Only the view and the controller require updates. Start by opening the home controller.

### Add the OrderBy property to the search parameters

1. In HomeController.cs, add the **OrderBy** option and include the Rating property, with a descending sort order. In the **Index(SearchData model)** method, add the following line to the search parameters.

    ```cs
    options.OrderBy.Add("Rating desc");
    ```

    >[!Note]
    > The default order is ascending, though you can add `asc` to the property to make this clear. Descending order is specified by adding `desc`.

1. Now run the app, and enter any common search term. The results may or may not be in the correct order, as neither you as the developer, not the user, has any easy way of verifying the results!

1. Let's make it clear the results are ordered on rating. First, replace the **box1** and **box2** classes in the hotels.css file with the following classes (these classes are all the new ones we need for this tutorial).

    ```html
    textarea.box1A {
        width: 324px;
        height: 32px;
        border: none;
        background-color: azure;
        font-size: 14pt;
        color: blue;
        padding-left: 5px;
        text-align: left;
    }

    textarea.box1B {
        width: 324px;
        height: 32px;
        border: none;
        background-color: azure;
        font-size: 14pt;
        color: blue;
        text-align: right;
        padding-right: 5px;
    }

    textarea.box2A {
        width: 324px;
        height: 32px;
        border: none;
        background-color: azure;
        font-size: 12pt;
        color: blue;
        padding-left: 5px;
        text-align: left;
    }

    textarea.box2B {
        width: 324px;
        height: 32px;
        border: none;
        background-color: azure;
        font-size: 12pt;
        color: blue;
        text-align: right;
        padding-right: 5px;
    }

    textarea.box3 {
        width: 648px;
        height: 100px;
        border: none;
        background-color: azure;
        font-size: 12pt;
        padding-left: 5px;
        margin-bottom: 24px;
    }
    ```

    > [!Tip]
    > Browsers usually cache css files, and this can lead to an old css file being used, and your edits ignored. A good way round this is to add a query string with a version parameter to the link. For example:
    >
    >```html
    >   <link rel="stylesheet" href="~/css/hotels.css?v1.1" />
    >```
    >
    > Update the version number if you think an old css file is being used by your browser.

1. Add the **Rating** property to the **Select** parameter, in the **Index(SearchData model)** method so that results include the following three fields:

    ```cs
    options.Select.Add("HotelName");
    options.Select.Add("Description");
    options.Select.Add("Rating");
    ```

1. Open the view (index.cshtml) and replace the rendering loop (**&lt;!-- Show the hotel data. --&gt;**) with the following code.

    ```cs
    <!-- Show the hotel data. -->
    @for (var i = 0; i < result.Count; i++)
    {
        var ratingText = $"Rating: {result[i].Document.Rating}";

        // Display the hotel details.
        @Html.TextArea($"name{i}", result[i].Document.HotelName, new { @class = "box1A" })
        @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
        @Html.TextArea($"desc{i}", fullDescription, new { @class = "box3" })
    }
    ```

1. The rating needs to be available both in the first displayed page, and in the subsequent pages that are called via the infinite scroll. For the latter of these two situations, we need to update both the **Next** action in the controller, and the **scrolled** function in the view. Starting with the controller, change the **Next** method to the following code. This code creates and communicates the rating text.

    ```cs
    public async Task<ActionResult> Next(SearchData model)
    {
        // Set the next page setting, and call the Index(model) action.
        model.paging = "next";
        await Index(model);

        // Create an empty list.
        var nextHotels = new List<string>();

        // Add a hotel details to the list.
        await foreach (var result in model.resultList.GetResultsAsync())
        {
            var ratingText = $"Rating: {result.Document.Rating}";
            var rateText = $"Rates from ${result.Document.cheapest} to ${result.Document.expensive}";
    
            string fullDescription = result.Document.Description;
    
            // Add strings to the list.
            nextHotels.Add(result.Document.HotelName);
            nextHotels.Add(ratingText);
            nextHotels.Add(fullDescription);
        }

        // Rather than return a view, return the list of data.
        return new JsonResult(nextHotels);
    }
    ```

1. Now update the **scrolled** function in the view, to display the rating text.

    ```javascript
    <script>
        function scrolled() {
            if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
                $.getJSON("/Home/Next", function (data) {
                    var div = document.getElementById('myDiv');

                    // Append the returned data to the current list of hotels.
                    for (var i = 0; i < data.length; i += 3) {
                        div.innerHTML += '\n<textarea class="box1A">' + data[i] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box1B">' + data[i + 1] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box3">' + data[i + 2] + '</textarea>';
                    }
                });
            }
        }
    </script>
    ```

1. Now run the app again. Search on any common term, such as "wifi", and verify that the results are ordered by descending order of hotel rating.

    ![Ordering based on rating](./media/tutorial-csharp-create-first-app/azure-search-orders-rating.png)

    You will notice that several hotels have an identical rating, and so their appearance in the display is again the order in which the data is found, which is arbitrary.

    Before we look into adding a second level of ordering, let's add some code to display the range of room rates. We are adding this code to both show extracting data from a _complex type_, and also so we can discuss ordering results based on price (cheapest first perhaps).

### Add the range of room rates to the view

1. Add properties containing the cheapest and most expensive room rate to the Hotel.cs model.

    ```cs
    // Room rate range
    public double cheapest { get; set; }
    public double expensive { get; set; }
    ```

1. Calculate the room rates at the end of the **Index(SearchData model)** action, in the home controller. Add the calculations after the storing of temporary data.

    ```cs
    // Ensure TempData is stored for the next call.
    TempData["page"] = page;
    TempData["searchfor"] = model.searchText;

    // Calculate the room rate ranges.
    await foreach (var result in model.resultList.GetResultsAsync())
    {
        var cheapest = 0d;
        var expensive = 0d;

        foreach (var room in result.Document.Rooms)
        {
            var rate = room.BaseRate;
            if (rate < cheapest || cheapest == 0)
            {
                cheapest = (double)rate;
            }
            if (rate > expensive)
            {
                expensive = (double)rate;
            }
        }
        model.resultList.Results[n].Document.cheapest = cheapest;
        model.resultList.Results[n].Document.expensive = expensive;
    }
    ```

1. Add the **Rooms** property to the **Select** parameter in the **Index(SearchData model)** action method of the controller.

    ```cs
    options.Select.Add("Rooms");
    ```

1. Change the rendering loop in the view to display the rate range for the first page of results.

    ```cs
    <!-- Show the hotel data. -->
    @for (var i = 0; i < result.Count; i++)
    {
        var rateText = $"Rates from ${result[i].Document.cheapest} to ${result[i].Document.expensive}";
        var ratingText = $"Rating: {result[i].Document.Rating}";

        string fullDescription = result[i].Document.Description;

        // Display the hotel details.
        @Html.TextArea($"name{i}", result[i].Document.HotelName, new { @class = "box1A" })
        @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
        @Html.TextArea($"rates{i}", rateText, new { @class = "box2A" })
        @Html.TextArea($"desc{i}", fullDescription, new { @class = "box3" })
    }
    ```

1. Change the **Next** method in the home controller to communicate the rate range, for subsequent pages of results.

    ```cs
    public async Task<ActionResult> Next(SearchData model)
    {
        // Set the next page setting, and call the Index(model) action.
        model.paging = "next";
        await Index(model);

        // Create an empty list.
        var nextHotels = new List<string>();

        // Add a hotel details to the list.
        await foreach (var result in model.resultList.GetResultsAsync())
        {
            var ratingText = $"Rating: {result.Document.Rating}";
            var rateText = $"Rates from ${result.Document.cheapest} to ${result.Document.expensive}";

            string fullDescription = result.Document.Description;

            // Add strings to the list.
            nextHotels.Add(result.Document.HotelName);
            nextHotels.Add(ratingText);
            nextHotels.Add(rateText);
            nextHotels.Add(fullDescription);
        }

        // Rather than return a view, return the list of data.
        return new JsonResult(nextHotels);
    }
    ```

1. Update the **scrolled** function in the view, to handle the room rates text.

    ```javascript
    <script>
        function scrolled() {
            if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
                $.getJSON("/Home/Next", function (data) {
                    var div = document.getElementById('myDiv');

                    // Append the returned data to the current list of hotels.
                    for (var i = 0; i < data.length; i += 4) {
                        div.innerHTML += '\n<textarea class="box1A">' + data[i] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box1B">' + data[i + 1] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box2A">' + data[i + 2] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box3">' + data[i + 4] + '</textarea>';
                    }
                });
            }
        }
    </script>
    ```

1. Run the app, and verify the room rate ranges are displayed.

    ![Displaying room rate ranges](./media/tutorial-csharp-create-first-app/azure-search-orders-rooms.png)

The **OrderBy** property of the search parameters will not accept an entry such as **Rooms.BaseRate** to provide the cheapest room rate, even if the rooms were already sorted on rate. In this case, the rooms are not sorted on rate. In order to display hotels in the sample data set, ordered on room rate, you would have to sort the results in your home controller, and send these results to the view in the desired order.

## Order results based on multiple values

The question now is how to differentiate between hotels with the same rating. One approach might be a secondary ordering based the last time the hotel was renovated so that more recently renovated hotels appear higher in the results.

1. To add a second level of ordering, add **LastRenovationDate** to the search results and to **OrderBy** in the **Index(SearchData model)** method.

    ```cs
    options.Select.Add("LastRenovationDate");

    options.OrderBy.Add("LastRenovationDate desc");
    ```

    >[!Tip]
    > Any number of properties can be entered in the **OrderBy** list. If hotels had the same rating and renovation date, a third property could be entered to differentiate between them.

1. Again, we need to see the renovation date in the view, just to be certain the ordering is correct. For such a thing as a renovation, probably just the year is sufficient. Change the rendering loop in the view to the following code.

    ```cs
    <!-- Show the hotel data. -->
    @for (var i = 0; i < result.Count; i++)
    {
        var rateText = $"Rates from ${result[i].Document.cheapest} to ${result[i].Document.expensive}";
        var lastRenovatedText = $"Last renovated: { result[i].Document.LastRenovationDate.Value.Year}";
        var ratingText = $"Rating: {result[i].Document.Rating}";

        string fullDescription = result[i].Document.Description;

        // Display the hotel details.
        @Html.TextArea($"name{i}", result[i].Document.HotelName, new { @class = "box1A" })
        @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
        @Html.TextArea($"rates{i}", rateText, new { @class = "box2A" })
        @Html.TextArea($"renovation{i}", lastRenovatedText, new { @class = "box2B" })
        @Html.TextArea($"desc{i}", fullDescription, new { @class = "box3" })
    }
    ```

1. Change the **Next** method in the home controller, to forward the year component of the last renovation date.

    ```cs
        public async Task<ActionResult> Next(SearchData model)
        {
            // Set the next page setting, and call the Index(model) action.
            model.paging = "next";
            await Index(model);

            // Create an empty list.
            var nextHotels = new List<string>();

            // Add a hotel details to the list.
            await foreach (var result in model.resultList.GetResultsAsync())
            {
                var ratingText = $"Rating: {result.Document.Rating}";
                var rateText = $"Rates from ${result.Document.cheapest} to ${result.Document.expensive}";
                var lastRenovatedText = $"Last renovated: {result.Document.LastRenovationDate.Value.Year}";

                string fullDescription = result.Document.Description;

                // Add strings to the list.
                nextHotels.Add(result.Document.HotelName);
                nextHotels.Add(ratingText);
                nextHotels.Add(rateText);
                nextHotels.Add(lastRenovatedText);
                nextHotels.Add(fullDescription);
            }

            // Rather than return a view, return the list of data.
            return new JsonResult(nextHotels);
        }
    ```

1. Change the **scrolled** function in the view to display the renovation text.

    ```javascript
    <script>
        function scrolled() {
            if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
                $.getJSON("/Home/Next", function (data) {
                    var div = document.getElementById('myDiv');

                    // Append the returned data to the current list of hotels.
                    for (var i = 0; i < data.length; i += 5) {
                        div.innerHTML += '\n<textarea class="box1A">' + data[i] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box1B">' + data[i + 1] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box2A">' + data[i + 2] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box2B">' + data[i + 3] + '</textarea>';
                        div.innerHTML += '\n<textarea class="box3">' + data[i + 4] + '</textarea>';
                    }
                });
            }
        }
    </script>
    ```

1. Run the app. Search on a common term, such as "pool" or "view", and verify that hotels with the same rating are now displayed in descending order of renovation date.

    ![Ordering on renovation date](./media/tutorial-csharp-create-first-app/azure-search-orders-renovation.png)

## Order results based on a scoring profile

The examples given in the tutorial so far show how to order on numerical values (rating and renovation date), providing an _exact_ sequence of ordering. However, some searches and some data do not lend themselves to such an easy comparison between two data elements. For full text search queries, Cognitive Search includes the concept of _ranking_. _Scoring profiles_ can be specified to influence how results are ranked, providing more complex and qualitative comparisons.

[Scoring profiles](index-add-scoring-profiles.md) are defined in the index schema. Several scoring profiles have been set up on the hotels data. Let's look at how a scoring profile is defined, then try writing code to search on them.

### How scoring profiles are defined

Scoring profiles are defined in a search index at design time. The read-only hotels index that's hosted by Microsoft has three scoring profiles. This section explores the scoring profiles and shows you to how to use the in code.

1. Below is the default scoring profile for the hotels data set, used when you do not specify any **OrderBy** or **ScoringProfile** parameter. This profile boosts the _score_ for a hotel if the search text is present in the hotel name, description, or list of tags (amenities). Notice how the weights of the scoring favor certain fields. If the search text appears in another field, not listed below, it will have a weight of 1. Obviously, the higher the score, the higher a result appears in the view.

     ```cs
    {
        "name": "boostByField",
        "text": {
            "weights": {
                "Tags": 3,
                "HotelName": 2,
                "Description": 1.5,
                "Description_fr": 1.5,
            }
        }
    }
    ```

1. The following alternative scoring profile boosts the score significantly if a supplied parameter includes one or more of the list of tags (which we are calling "amenities"). The key point of this profile is that a parameter _must_ be supplied, containing text. If the parameter is empty, or is not supplied, an error will be thrown.

    ```cs
    {
        "name":"boostAmenities",
        "functions":[
            {
            "fieldName":"Tags",
            "freshness":null,
            "interpolation":"linear",
            "magnitude":null,
            "distance":null,
            "tag":{
                "tagsParameter":"amenities"
            },
            "type":"tag",
            "boost":5
            }
        ],
        "functionAggregation":0
    },
    ```

1. In this third profile, the hotel rating gives a significant boost to the score. The last renovated date will also boost the score, but only if that data falls within 730 days (2 years) of the current date.

    ```cs
    {
        "name":"renovatedAndHighlyRated",
        "functions":[
            {
            "fieldName":"Rating",
            "freshness":null,
            "interpolation":"linear",
            "magnitude":{
                "boostingRangeStart":0,
                "boostingRangeEnd":5,
                "constantBoostBeyondRange":false
            },
            "distance":null,
            "tag":null,
            "type":"magnitude",
            "boost":20
            },
            {
            "fieldName":"LastRenovationDate",
            "freshness":{
                "boostingDuration":"P730D"
            },
            "interpolation":"quadratic",
            "magnitude":null,
            "distance":null,
            "tag":null,
            "type":"freshness",
            "boost":10
            }
        ],
        "functionAggregation":0
    }
    ```

    Now, let us see if these profiles work as we think they should.

### Add code to the view to compare profiles

1. Open the index.cshtml file, and replace the &lt;body&gt; section with the following code.

    ```html
    <body>

    @using (Html.BeginForm("Index", "Home", FormMethod.Post))
    {
        <table>
            <tr>
                <td></td>
                <td>
                    <h1 class="sampleTitle">
                        <img src="~/images/azure-logo.png" width="80" />
                        Hotels Search - Order Results
                    </h1>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <!-- Display the search text box, with the search icon to the right of it. -->
                    <div class="searchBoxForm">
                        @Html.TextBoxFor(m => m.searchText, new { @class = "searchBox" }) <input class="searchBoxSubmit" type="submit" value="">
                    </div>

                    <div class="searchBoxForm">
                        <b>&nbsp;Order:&nbsp;</b>
                        @Html.RadioButtonFor(m => m.scoring, "Default") Default&nbsp;&nbsp;
                        @Html.RadioButtonFor(m => m.scoring, "RatingRenovation") By numerical Rating&nbsp;&nbsp;
                        @Html.RadioButtonFor(m => m.scoring, "boostAmenities") By Amenities&nbsp;&nbsp;
                        @Html.RadioButtonFor(m => m.scoring, "renovatedAndHighlyRated") By Renovated date/Rating profile&nbsp;&nbsp;
                    </div>
                </td>
            </tr>

            <tr>
                <td valign="top">
                    <div id="facetplace" class="facetchecks">

                        @if (Model != null && Model.facetText != null)
                        {
                            <h5 class="facetheader">Amenities:</h5>
                            <ul class="facetlist">
                                @for (var c = 0; c < Model.facetText.Length; c++)
                                {
                                    <li> @Html.CheckBoxFor(m => m.facetOn[c], new { @id = "check" + c.ToString() }) @Model.facetText[c] </li>
                                }

                            </ul>
                        }
                    </div>
                </td>
                <td>
                    @if (Model != null && Model.resultList != null)
                    {
                        // Show the total result count.
                        <p class="sampleText">
                            @Html.DisplayFor(m => m.resultList.Count) Results <br />
                        </p>

                        <div id="myDiv" style="width: 800px; height: 450px; overflow-y: scroll;" onscroll="scrolled()">

                            <!-- Show the hotel data. -->
                            @for (var i = 0; i < Model.resultList.Results.Count; i++)
                            {
                                var rateText = $"Rates from ${Model.resultList.Results[i].Document.cheapest} to ${Model.resultList.Results[i].Document.expensive}";
                                var lastRenovatedText = $"Last renovated: { Model.resultList.Results[i].Document.LastRenovationDate.Value.Year}";
                                var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                                string amenities = string.Join(", ", Model.resultList.Results[i].Document.Tags);
                                string fullDescription = Model.resultList.Results[i].Document.Description;
                                fullDescription += $"\nAmenities: {amenities}";

                                // Display the hotel details.
                                @Html.TextArea($"name{i}", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                                @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
                                @Html.TextArea($"rates{i}", rateText, new { @class = "box2A" })
                                @Html.TextArea($"renovation{i}", lastRenovatedText, new { @class = "box2B" })
                                @Html.TextArea($"desc{i}", fullDescription, new { @class = "box3" })
                            }
                        </div>

                        <script>
                            function scrolled() {
                                if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
                                    $.getJSON("/Home/Next", function (data) {
                                        var div = document.getElementById('myDiv');

                                        // Append the returned data to the current list of hotels.
                                        for (var i = 0; i < data.length; i += 5) {
                                            div.innerHTML += '\n<textarea class="box1A">' + data[i] + '</textarea>';
                                            div.innerHTML += '<textarea class="box1B">' + data[i + 1] + '</textarea>';
                                            div.innerHTML += '\n<textarea class="box2A">' + data[i + 2] + '</textarea>';
                                            div.innerHTML += '<textarea class="box2B">' + data[i + 3] + '</textarea>';
                                            div.innerHTML += '\n<textarea class="box3">' + data[i + 4] + '</textarea>';
                                        }
                                    });
                                }
                            }
                        </script>
                    }
                </td>
            </tr>
        </table>
    }
    </body>
    ```

1. Open the SearchData.cs file, and replace the **SearchData** class with the following code.

    ```cs
    public class SearchData
    {
        public SearchData()
        {
        }

        // Constructor to initialize the list of facets sent from the controller.
        public SearchData(List<string> facets)
        {
            facetText = new string[facets.Count];

            for (int i = 0; i < facets.Count; i++)
            {
                facetText[i] = facets[i];
            }
        }

        // Array to hold the text for each amenity.
        public string[] facetText { get; set; }

        // Array to hold the setting for each amenitity.
        public bool[] facetOn { get; set; }

        // The text to search for.
        public string searchText { get; set; }

        // Record if the next page is requested.
        public string paging { get; set; }

        // The list of results.
        public DocumentSearchResult<Hotel> resultList;

        public string scoring { get; set; }       
    }
    ```

1. Open the hotels.css file, and add the following HTML classes.

    ```html
    .facetlist {
        list-style: none;
    }
    
    .facetchecks {
        width: 250px;
        display: normal;
        color: #666;
        margin: 10px;
        padding: 5px;
    }

    .facetheader {
        font-size: 10pt;
        font-weight: bold;
        color: darkgreen;
    }
    ```

### Add code to the controller to specify a scoring profile

1. Open the home controller file. Add the following **using** statement (to aid with creating lists).

    ```cs
    using System.Linq;
    ```

1. For this example, we need the initial call to **Index** to do a bit more than just return the initial view. The method now searches for up to 20 amenities to display in the view.

    ```cs
        public async Task<ActionResult> Index()
        {
            InitSearch();

            // Set up the facets call in the search parameters.
            SearchOptions options = new SearchOptions();
            // Search for up to 20 amenities.
            options.Facets.Add("Tags,count:20");

            SearchResults<Hotel> searchResult = await _searchClient.SearchAsync<Hotel>("*", options);

            // Convert the results to a list that can be displayed in the client.
            List<string> facets = searchResult.Facets["Tags"].Select(x => x.Value.ToString()).ToList();

            // Initiate a model with a list of facets for the first view.
            SearchData model = new SearchData(facets);

            // Save the facet text for the next view.
            SaveFacets(model, false);

            // Render the view including the facets.
            return View(model);
        }
    ```

1. We need two private methods to save the facets to temporary storage, and to recover them from temporary storage and populate a model.

    ```cs
        // Save the facet text to temporary storage, optionally saving the state of the check boxes.
        private void SaveFacets(SearchData model, bool saveChecks = false)
        {
            for (int i = 0; i < model.facetText.Length; i++)
            {
                TempData["facet" + i.ToString()] = model.facetText[i];
                if (saveChecks)
                {
                    TempData["faceton" + i.ToString()] = model.facetOn[i];
                }
            }
            TempData["facetcount"] = model.facetText.Length;
        }

        // Recover the facet text to a model, optionally recoving the state of the check boxes.
        private void RecoverFacets(SearchData model, bool recoverChecks = false)
        {
            // Create arrays of the appropriate length.
            model.facetText = new string[(int)TempData["facetcount"]];
            if (recoverChecks)
            {
                model.facetOn = new bool[(int)TempData["facetcount"]];
            }

            for (int i = 0; i < (int)TempData["facetcount"]; i++)
            {
                model.facetText[i] = TempData["facet" + i.ToString()].ToString();
                if (recoverChecks)
                {
                    model.facetOn[i] = (bool)TempData["faceton" + i.ToString()];
                }
            }
        }
    ```

1. We need to set the **OrderBy** and **ScoringProfile** parameters as necessary. Replace the existing **Index(SearchData model)** method, with the following.

    ```cs
    public async Task<ActionResult> Index(SearchData model)
    {
        try
        {
            InitSearch();

            int page;

            if (model.paging != null && model.paging == "next")
            {
                // Recover the facet text, and the facet check box settings.
                RecoverFacets(model, true);

                // Increment the page.
                page = (int)TempData["page"] + 1;

                // Recover the search text.
                model.searchText = TempData["searchfor"].ToString();
            }
            else
            {
                // First search with text. 
                // Recover the facet text, but ignore the check box settings, and use the current model settings.
                RecoverFacets(model, false);

                // First call. Check for valid text input, and valid scoring profile.
                if (model.searchText == null)
                {
                    model.searchText = "";
                }
                if (model.scoring == null)
                {
                    model.scoring = "Default";
                }
                page = 0;
            }

            // Setup the search parameters.
            var options = new SearchOptions
            {
                SearchMode = SearchMode.All,

                // Skip past results that have already been returned.
                Skip = page * GlobalVariables.ResultsPerPage,

                // Take only the next page worth of results.
                Size = GlobalVariables.ResultsPerPage,

                // Include the total number of results.
                IncludeTotalCount = true,
            };
            // Select the data properties to be returned.
            options.Select.Add("HotelName");
            options.Select.Add("Description");
            options.Select.Add("Tags");
            options.Select.Add("Rooms");
            options.Select.Add("Rating");
            options.Select.Add("LastRenovationDate");

            List<string> parameters = new List<string>();
            // Set the ordering based on the user's radio button selection.
            switch (model.scoring)
            {
                case "RatingRenovation":
                    // Set the ordering/scoring parameters.
                    options.OrderBy.Add("Rating desc");
                    options.OrderBy.Add("LastRenovationDate desc");
                    break;

                case "boostAmenities":
                    {
                        options.ScoringProfile = model.scoring;

                        // Create a string list of amenities that have been clicked.
                        for (int a = 0; a < model.facetOn.Length; a++)
                        {
                            if (model.facetOn[a])
                            {
                                parameters.Add(model.facetText[a]);
                            }
                        }

                        if (parameters.Count > 0)
                        {
                            options.ScoringParameters.Add($"amenities-{ string.Join(',', parameters)}");
                        }
                        else
                        {
                            // No amenities selected, so set profile back to default.
                            options.ScoringProfile = "";
                        }
                    }
                    break;

                case "renovatedAndHighlyRated":
                    options.ScoringProfile = model.scoring;
                    break;

                default:
                    break;
            }

            // For efficiency, the search call should be asynchronous, so use SearchAsync rather than Search.
            model.resultList = await _searchClient.SearchAsync<Hotel>(model.searchText, options);

            // Ensure TempData is stored for the next call.
            TempData["page"] = page;
            TempData["searchfor"] = model.searchText;
            TempData["scoring"] = model.scoring;
            SaveFacets(model, true);

            // Calculate the room rate ranges.
            await foreach (var result in model.resultList.GetResultsAsync())
            {
                var cheapest = 0d;
                var expensive = 0d;

                foreach (var room in result.Document.Rooms)
                {
                    var rate = room.BaseRate;
                    if (rate < cheapest || cheapest == 0)
                    {
                        cheapest = (double)rate;
                    }
                    if (rate > expensive)
                    {
                        expensive = (double)rate;
                    }
                }

                result.Document.cheapest = cheapest;
                result.Document.expensive = expensive;
            }
        }
        catch
        {
            return View("Error", new ErrorViewModel { RequestId = "1" });
        }

        return View("Index", model);
    }
    ```

    Read through the comments for each of the **switch** selections.

1. We do not need to make any changes to the **Next** action, if you completed the additional code for the previous section on ordering based on multiple properties.

### Run and test the app

1. Run the app. You should see a full set of amenities in the view.

1. For ordering, selecting "By numerical Rating" will give you the numerical ordering you have already implemented in this tutorial, with renovation date deciding among hotels of equal rating.

   ![Ordering "beach" based on rating](./media/tutorial-csharp-create-first-app/azure-search-orders-beach.png)

1. Now try the "By amenities" profile. Make various selections of amenities, and verify that hotels with those amenities are promoted up the results list.

   ![Ordering "beach" based on profile](./media/tutorial-csharp-create-first-app/azure-search-orders-beach-profile.png)

1. Try the "By Renovated date/Rating profile" to see if you get what you expect. Only recently renovated hotels should get a _freshness_ boost.

### Resources

For more information, see the following [Add scoring profiles to an Azure Cognitive Search index](./index-add-scoring-profiles.md).

## Takeaways

Consider the following takeaways from this project:

* Users will expect search results to be ordered, most relevant first.
* Data needs structured so that ordering is easy. We were not able to sort on "cheapest" first easily, as the data is not structured to enable ordering to be done without additional code.
* There can be many levels to ordering, to differentiate between results that have the same value at a higher level of ordering.
* It is natural for some results to be ordered in ascending order (say, distance away from a point), and some in descending order (say, guest's rating).
* Scoring profiles can be defined when numerical comparisons are not available, or not smart enough, for a data set. Scoring each result will help to order and display the results intelligently.

## Next steps

You have completed this series of C# tutorials - you should have gained valuable knowledge of the Azure Cognitive Search APIs.

For further reference and tutorials, consider browsing the [Microsoft Learn training catalog](/training/browse/?products=azure) or the other tutorials in the [Azure Cognitive Search documentation](./index.yml).
