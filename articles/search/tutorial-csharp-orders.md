---
title: C# tutorial on ordering results - Azure Search
description: This tutorial builds on the "Search results pagination - Azure Search" project, to add the ordering of search results. Learn how to order results on a primary property, and for results that have the same primary property, how to order results on a secondary property.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 06/21/2019
---

# C# tutorial: Order the results - Azure Search

Up until this point in our series of tutorials, results are returned and displayed in the order that the data is located. This order is arbitrary, and rarely the best user experience. In this tutorial, we will go into how to order results based on a primary property, and then for results that have the same primary property, how to order that selection on a secondary property. We will also go a bit deeper into the display of _complex types_.

In order to compare returned results easily, this project builds onto the infinite scrolling project created in the [C# Tutorial: Search results pagination - Azure Search](tutorial-csharp-paging.md) tutorial.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Order results based on one property
> * Order results based on multiple properties
> * Filter results based on a distance from a geographical point
> * Take ordering even further

## Prerequisites

To complete this tutorial, you need to:

Have the infinite scrolling version of the [C# Tutorial: Search results pagination - Azure Search](tutorial-csharp-paging.md) project up and running. This can either be your own version, or install it from GitHub: [Create first app](https://github.com/Azure-Samples/azure-search-dotnet-samples).

## Order results based on one property

When we order results based on one property, say hotel rating, we not only want the ordered results, we also want confirmation that the order is correct. In other words, if we order on rating, we should display the rating in the view.

In this tutorial, we will also add a bit more to the display of results, the cheapest room rate, and the most expensive room rate, for each hotel. As we delve into ordering, we will also be adding values to make sure what we are ordering on is also displayed in the view.

There is no need to modify any of the models to enable ordering. The view and the controller need updated. Start by opening the home controller.

### Add the OrderBy property to the search parameters

1. All that it takes to order results based on a single numerical property, is to set the **OrderBy** parameter to the name of the property. In the **Index(SearchData model)** method, add the following line to the search parameters.

    ```cs
        OrderBy = new[] { "Rating desc" },
    ```

    >[!Note]
    > The default order is ascending, though you can add **asc** to the property to make this clear. Descending order is specified by adding **desc**.

2. Now run the app, and enter any common search term. The results may or may not be in the correct order, as neither you as the developer, not the user, has any easy way of verifying the results!

3. Let's make it clear the results are ordered on rating. First, replace the **box1** and **box2** classes in the hotels.css file with the following classes (these classes are all the new ones we need for this tutorial).

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

    >[!Tip]
    >Browsers usually cache css files, and this can lead to an old css file being used, and your edits ignored. A good way round this is to add a query string with a version parameter to the link. For example:
    >
    >```html
    >   <link rel="stylesheet" href="~/css/hotels.css?v1.1" />
    >```
    >
    >Update the version number if you think an old css file is being used by your browser.

4. Add the **Rating** property to the **Select** parameter, in the **Index(SearchData model)** method.

    ```cs
    Select = new[] { "HotelName", "Description", "Rating"},
    ```

5. Open the view (index.cshtml) and replace the rendering loop (**&lt;!-- Show the hotel data. --&gt;**) with the following code.

    ```cs
                <!-- Show the hotel data. -->
                @for (var i = 0; i < Model.resultList.Results.Count; i++)
                {
                    var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                    // Display the hotel details.
                    @Html.TextArea($"name{i}", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                    @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
                    @Html.TextArea($"desc{i}", Model.resultList.Results[i].Document.Description, new { @class = "box3" })
                }
    ```

6. The rating needs to be available both in the first displayed page, and in the subsequent pages that are called via the infinite scroll. For the latter of these two situations, we need to update both the **Next** action in the controller, and the **scrolled** function in the view. Starting with the controller, change the **Next** method to the following code. This code creates and communicates the rating text.

    ```cs
        public async Task<ActionResult> Next(SearchData model)
        {
            // Set the next page setting, and call the Index(model) action.
            model.paging = "next";
            await Index(model);

            // Create an empty list.
            var nextHotels = new List<string>();

            // Add a hotel details to the list.
            for (int n = 0; n < model.resultList.Results.Count; n++)
            {
                var ratingText = $"Rating: {model.resultList.Results[n].Document.Rating}";

                // Add three strings to the list.
                nextHotels.Add(model.resultList.Results[n].Document.HotelName);
                nextHotels.Add(ratingText);
                nextHotels.Add(model.resultList.Results[n].Document.Description);
            }

            // Rather than return a view, return the list of data.
            return new JsonResult(nextHotels);
        }
    ```

7. Now update the **scrolled** function in the view, to display the rating text.

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

8. Now run the app again. Search on any common term, such as "wifi", and verify that the results are ordered by descending order of hotel rating.

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

2. Calculate the room rates at the end of the **Index(SearchData model)** action, in the home controller. Add the calculations after the storing of temporary data.

    ```cs
                // Ensure TempData is stored for the next call.
                TempData["page"] = page;
                TempData["searchfor"] = model.searchText;

                // Calculate the room rate ranges.
                for (int n = 0; n < model.resultList.Results.Count; n++)
                {
                    // Calculate room rates.
                    var cheapest = 0d;
                    var expensive = 0d;

                    for (var r = 0; r < model.resultList.Results[n].Document.Rooms.Length; r++)
                    {
                        var rate = model.resultList.Results[n].Document.Rooms[r].BaseRate;
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

3. Add the **Rooms** property to the **Select** parameter in the **Index(SearchData model)** method of the controller.

    ```cs
     Select = new[] { "HotelName", "Description", "Rating", "Rooms" },
    ```

4. Change the rendering loop in the view to display the rate range for the first page of results.

    ```cs
                <!-- Show the hotel data. -->
                @for (var i = 0; i < Model.resultList.Results.Count; i++)
                {
                    var rateText = $"Rates from ${Model.resultList.Results[i].Document.cheapest} to ${Model.resultList.Results[i].Document.expensive}";
                    var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                    // Display the hotel details.
                    @Html.TextArea($"name{i}", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                    @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
                    @Html.TextArea($"rates{i}" , rateText, new { @class = "box2A" })
                    @Html.TextArea($"desc{i}", Model.resultList.Results[i].Document.Description, new { @class = "box3" })
                }
    ```

5. Change the **Next** method in the home controller to communicate the rate range, for subsequent pages of results.

    ```cs
        public async Task<ActionResult> Next(SearchData model)
        {
            // Set the next page setting, and call the Index(model) action.
            model.paging = "next";
            await Index(model);

            // Create an empty list.
            var nextHotels = new List<string>();

            // Add a hotel details to the list.
            for (int n = 0; n < model.resultList.Results.Count; n++)
            {
                var ratingText = $"Rating: {model.resultList.Results[n].Document.Rating}";
                var rateText = $"Rates from ${model.resultList.Results[n].Document.cheapest} to ${model.resultList.Results[n].Document.expensive}";

                // Add strings to the list.
                nextHotels.Add(model.resultList.Results[n].Document.HotelName);
                nextHotels.Add(ratingText);
                nextHotels.Add(rateText);
                nextHotels.Add(model.resultList.Results[n].Document.Description);
            }

            // Rather than return a view, return the list of data.
            return new JsonResult(nextHotels);
        }
    ```

6. Update the **scrolled** function in the view, to handle the room rates text.

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

7. Run the app, and verify the room rate ranges are displayed.

    ![Displaying room rate ranges](./media/tutorial-csharp-create-first-app/azure-search-orders-rooms.png)

The **OrderBy** property of the search parameters will not accept an entry such as **Rooms.BaseRate** to provide the cheapest room rate, even if the rooms were already sorted on rate (which they are not). In order to display hotels in the sample data set, ordered on room rate, you would have to sort the results in your home controller, and send these results to the view in the desired order.

## Order results based on multiple values

The question now is how to differentiate between hotels with the same rating. One good way would be to order on the basis of the last time the hotel was renovated. In other words, the more recently the hotel was renovated, the higher the hotel appears in the results.

1. To add a second level of ordering, change the **OrderBy** and **Select** properties in the **Index(SearchData model)** method to include the **LastRenovationDate** property.

    ```cs
    OrderBy = new[] { "Rating desc", "LastRenovationDate desc" },
    Select = new[] { "HotelName", "Description", "Rating", "Rooms", "LastRenovationDate" },
    ```

    >[!Tip]
    >Any number of properties can be entered in the **OrderBy** list. If hotels had the same rating and renovation date, a third property could be entered to differentiate between them.

2. Again, we need to see the renovation date in the view, just to be certain the ordering is correct. For such a thing as a renovation, probably just the year is required. Change the rendering loop in the view to the following code.

    ```cs
                <!-- Show the hotel data. -->
                @for (var i = 0; i < Model.resultList.Results.Count; i++)
                {
                    var rateText = $"Rates from ${Model.resultList.Results[i].Document.cheapest} to ${Model.resultList.Results[i].Document.expensive}";
                    var lastRenovatedText = $"Last renovated: { Model.resultList.Results[i].Document.LastRenovationDate.Value.Year}";
                    var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                    // Display the hotel details.
                    @Html.TextArea($"name{i}", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                    @Html.TextArea($"rating{i}", ratingText, new { @class = "box1B" })
                    @Html.TextArea($"rates{i}" , rateText, new { @class = "box2A" })
                    @Html.TextArea($"renovation{i}", lastRenovatedText, new { @class = "box2B" })
                    @Html.TextArea($"desc{i}", Model.resultList.Results[i].Document.Description, new { @class = "box3" })
                }
    ```

3. Change the **Next** method in the home controller, to forward the year component of the last renovation date.

    ```cs
        public async Task<ActionResult> Next(SearchData model)
        {
            // Set the next page setting, and call the Index(model) action.
            model.paging = "next";
            await Index(model);

            // Create an empty list.
            var nextHotels = new List<string>();

            // Add a hotel details to the list.
            for (int n = 0; n < model.resultList.Results.Count; n++)
            {
                var ratingText = $"Rating: {model.resultList.Results[n].Document.Rating}";
                var rateText = $"Rates from ${model.resultList.Results[n].Document.cheapest} to ${model.resultList.Results[n].Document.expensive}";
                var lastRenovatedText = $"Last renovated: {model.resultList.Results[n].Document.LastRenovationDate.Value.Year}";

                // Add strings to the list.
                nextHotels.Add(model.resultList.Results[n].Document.HotelName);
                nextHotels.Add(ratingText);
                nextHotels.Add(rateText);
                nextHotels.Add(lastRenovatedText);
                nextHotels.Add(model.resultList.Results[n].Document.Description);
            }

            // Rather than return a view, return the list of data.
            return new JsonResult(nextHotels);
        }
    ```

4. Change the **scrolled** function in the view to display the renovation text.

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

5. Run the app. Search on a common term, such as "pool" or "view", and verify that hotels with the same rating are now displayed in descending order of renovation date.

    ![Ordering on renovation date](./media/tutorial-csharp-create-first-app/azure-search-orders-renovation.png)

## Filter results based on a distance from a geographical point

Rating, and renovation date, are examples of properties that are best displayed in a descending order. An alphabetical listing would be an example of a good use of ascending order (for example, if there was just one **OrderBy** property, and it was set to **HotelName** then an alphabetical order would be displayed). However, for our sample data, distance from a geographical point would be more appropriate.

To display results based on geographical distance, several steps are required.

1. Filter out all hotels that are outside of a specified radius from the given point, by entering a filter with longitude, latitude, and radius parameters. Longitude is given first to the POINT function. Radius is in kilometers.

    ```cs
        // "Location" must match the field name in the Hotel class.
        // Distance (the radius) is in kilometers.
        // Point order is Longitude then Latitude.
        Filter = $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') le {model.radius}",
    ```

2. The above filter does _not_ order the results based on distance, it just removes the outliers. To order the results, enter an **OrderBy** setting that specifies the geoDistance method.

    ```cs
    OrderBy = new[] { $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') asc" },
    ```

3. Although the results were returned by Azure Search using a distance filter, the calculated distance between the data and the specified point is _not_ returned. Recalculate this value in the view, or controller, if you want to display it in the results.

    The following code will calculate the distance between two lat/lon points.

    ```cs
        const double EarthRadius = 6371;

        public static double Degrees2Radians(double deg)
        {
            return deg * Math.PI / 180;
        }

        public static double DistanceInKm( double lat1,  double lon1, double lat2, double lon2)
        {
            double dlon = Degrees2Radians(lon2 - lon1);
            double dlat = Degrees2Radians(lat2 - lat1);

            double a = (Math.Sin(dlat / 2) * Math.Sin(dlat / 2)) + Math.Cos(Degrees2Radians(lat1)) * Math.Cos(Degrees2Radians(lat2)) * (Math.Sin(dlon / 2) * Math.Sin(dlon / 2));
            double angle = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return angle * EarthRadius;
        }
    ```

4. Now you have to tie these concepts together. However, these code snippets are as far as our tutorial goes, building a map-based app is left as an exercise for the reader. To take this example further, consider either entering a city name with a radius, or locating a point on a map, and selecting a radius. To investigate these options further, see the following resources:

* [Azure Maps Documentation](https://docs.microsoft.com/en-us/azure/azure-maps/)
* [Find an address using the Azure Maps search service](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-search-for-address)

## Take ordering even further

The examples given in the tutorial so far show how to order on numerical values, providing an exact process of ordering. However, some searches and some data do not lend themselves to such an easy comparison between two data elements. Azure Search includes the concept of _scoring_. _Scoring profiles_ can be specified for a set of data that can be used to provide more complex and qualitative comparisons, that should be most valuable when, say, comparing two documents to decide which should be displayed first.

Scoring is outside the realm of this tutorial. For more information, see the following [Add scoring profiles to an Azure Search index](https://docs.microsoft.com/en-us/azure/search/index-add-scoring-profiles).

## Takeaways

Consider the following takeaways from this project:

* Users will expect search results to be ordered, most relevant first.
* Data needs structured so that ordering is easy. We were not able to sort on "cheapest" first easily, as the data is not structured to enable ordering to be done without additional code.
* There can be many levels to ordering, to differentiate between results that have the same value at a higher level of ordering.
* It is natural for some results to be ordered in ascending order (say, distance away from a point), and some in descending order (say, guest's rating).
* Scoring profiles can be defined when numerical comparisons are not available for a data set. Scoring each result will help to order and display them intelligently.

## Next steps

You have completed this series of C# tutorials - you should have gained valuable knowledge of the Azure Search APIs.

For further reference and tutorials, consider browsing [Microsoft Learn](https://docs.microsoft.com/learn/browse/?products=azure), or the other tutorials in the [Azure Search Documentation](https://docs.microsoft.com/azure/search/).
