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

Up till this point in our series of tutorials, results are returned and displayed in the order that the data is located. This is somewhat random, and rarely the best user experience. In this tutorial, we will go into how to order results based on a primary property, and then for results that have the same primary property, how to order that selection on a secondary property. We will also go a bit deeper into the display of _complex types_.

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

There is no need to modify any of the models to enable ordering. Only the view and the controller need to be modified. Start by opening the home controller.

### Add the OrderBy property to the search parameters

1. All that it takes to order results based on a single numerical property, is to set the **OrderBy** parameter to the name of the property. In the **Index(SearchData model)** method, change the search parameters to the following code.

    ```cs
        OrderBy = new[] { "Rating desc" },
    ```

2. Now run the app. The results may or may not be in the correct order, as neither the developer, not the user, has any easy way of verifying the results.

3. Let's make it clear the results are ordered on rating. First, replace the **.box1** and **.box2** classes in the hotels.css file with the following classes (these are all the classes we need for this tutorial).

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

4. Add the **Rating** property to the **Select** parameter, in the **Index(SearchData model)** method.

    ```cs
    Select = new[] { "HotelName", "Description", "Rating"},
    ```

5. Open the view (index.cshtml) and replace the rendering loop with the following code.

    ```cs
                <!-- Show the hotel data. -->
                @for (var i = 0; i < Model.resultList.Results.Count; i++)
                {
                    var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                    // Display the hotel name and description.
                    @Html.TextArea("name", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                    @Html.TextArea("rating", ratingText, new { @class = "box1B" })
                    @Html.TextArea("desc", Model.resultList.Results[i].Document.Description, new { @class = "box3" })
                }
    ```

6. The rating needs to be available both in the first displayed page, and in the subsequent pages that are called via the infinite scroll. For the latter of these two we need to update the **Next** action in the controller, and the scrolled function in the view. Starting with the controller, change the **Next** method to the following code.

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

7. Now update the **scrolled** function in the view.

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

    Image

    You will notice that several hotels have an identical rating, and so their appearance in the display is again the order in which the data is found, which is arbitary.

    Before we look into adding a second level of ordering, let's add some code to display the range of room rates. We are adding this to both show extracting data from a _complex type_, and also so we can discuss perhaps ordering results based on price (cheapest first perhaps).

### Add the range of room rates to the view

1. Add the **Rooms** property to the **Select** parameter in the **Index(SearchData model)** method of the controller.

    ```cs
    Select = new[] { "HotelName", "Description", "Rooms", "Rating" },
    ```

2. Change the rendering loop in the view to calculate the rate range for the first page of results.

    ```cs
                <!-- Show the hotel data. -->
                @for (var i = 0; i < Model.resultList.Results.Count; i++)
                {
                    <!-- Find the range of room prices -->
                    var cheapest = 10000d;
                    var expensive = 0d;

                    @for (var r = 0; r < Model.resultList.Results[i].Document.Rooms.Length; r++)
                    {
                        var rate = Model.resultList.Results[i].Document.Rooms[r].BaseRate;
                        if (rate < cheapest)
                        {
                            cheapest = (double)rate;
                        }
                        if (rate > expensive)
                        {
                            expensive = (double)rate;
                        }
                    }

                    var rateText = $"Rates from ${cheapest} to ${expensive}";
                    var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                    // Display the hotel details.
                    @Html.TextArea("name", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                    @Html.TextArea("rating", ratingText, new { @class = "box1B" })
                    @Html.TextArea("rates", rateText, new { @class = "box2A" })
                    @Html.TextArea("desc", Model.resultList.Results[i].Document.Description, new { @class = "box3" })
                }
    ```

3. Change the **Next** method in the home controller to calculate the rate range for subsequent pages of results.

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
                // Calculate room rates.
                var cheapest = 10000d;
                var expensive = 0d;

                for (var r = 0; r < model.resultList.Results[n].Document.Rooms.Length; r++)
                {
                    var rate = model.resultList.Results[n].Document.Rooms[r].BaseRate;
                    if (rate < cheapest)
                    {
                        cheapest = (double)rate;
                    }
                    if (rate > expensive)
                    {
                        expensive = (double)rate;
                    }
                }

                var ratingText = $"Rating: {model.resultList.Results[n].Document.Rating}";
                var rateText = $"Rates from ${cheapest} to ${expensive}";

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

4. Update the **scrolled** function in the view, to handle the room rates text.

    ```cs
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

5. Run the app, and verify the room rate ranges are displayed.

Image

## Order results based on multiple values

The question now is how to differentiate between hotels with the same rating. Perhaps a good way would be to order on the basis of the last time the hotel was renovated. In other words, the more recently the hotel was renovated, the higher the hotel appears in the results.

1. To add a second level of ordering, change the **OrderBy** and **Select** properties in the **Index(SearchData model)** method to include the **LastRenovationDate** property.

    ```cs
    OrderBy = new[] { "Rating desc", "LastRenovationDate desc" },
    Select = new[] { "HotelName", "Description", "Rooms", "Rating", "LastRenovationDate" },
    ```

2. Again we need to see the date in the view, just to be certain the ordering is correct. For such a thing as a renovation, perhaps just the year is required. Change the rendering loop to the following code, in the view.

    ```cs
                <!-- Show the hotel data. -->
                @for (var i = 0; i < Model.resultList.Results.Count; i++)
                {
                    <!-- Find the range of room prices -->
                    var cheapest = 10000d;
                    var expensive = 0d;

                    @for (var r = 0; r < Model.resultList.Results[i].Document.Rooms.Length; r++)
                    {
                        var rate = Model.resultList.Results[i].Document.Rooms[r].BaseRate;
                        if (rate < cheapest)
                        {
                            cheapest = (double)rate;
                        }
                        if (rate > expensive)
                        {
                            expensive = (double)rate;
                        }
                    }

                    var rateText = $"Rates from ${cheapest} to ${expensive}";
                    var lastRenovatedText = $"Last renovated: { Model.resultList.Results[i].Document.LastRenovationDate.Value.Year}";
                    var ratingText = $"Rating: {Model.resultList.Results[i].Document.Rating}";

                    // Display the hotel details.
                    @Html.TextArea("name", Model.resultList.Results[i].Document.HotelName, new { @class = "box1A" })
                    @Html.TextArea("rating", ratingText, new { @class = "box1B" })
                    @Html.TextArea("rates", rateText, new { @class = "box2A" })
                    @Html.TextArea("renovation", lastRenovatedText, new { @class = "box2B" })
                    @Html.TextArea("desc", Model.resultList.Results[i].Document.Description, new { @class = "box3" })
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
                // Calculate room rates.
                var cheapest = 10000d;
                var expensive = 0d;

                for (var r = 0; r < model.resultList.Results[n].Document.Rooms.Length; r++)
                {
                    var rate = model.resultList.Results[n].Document.Rooms[r].BaseRate;
                    if (rate < cheapest)
                    {
                        cheapest = (double)rate;
                    }
                    if (rate > expensive)
                    {
                        expensive = (double)rate;
                    }
                }

                var ratingText = $"Rating: {model.resultList.Results[n].Document.Rating}";
                var rateText = $"Rates from ${cheapest} to ${expensive}";
                var lastRenovatedText = $"Last renovated: {model.resultList.Results[n].Document.LastRenovationDate.Value.Year}";

                // Add five strings to the list.
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

4. Change the **scrolled** function in the view to handle the renovation text.

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

Image

## Filter results based on a distance from a geographical point

Rating, and renovation date, are examples of properties that are best displayed in a descending order. An alphabetical listing would be an example of a good use of ascending order (for example, if there was just one **OrderBy** property, and it was set to **HotelName** then an alphabetical order would be displayed). However, for our sample data, perhaps distance from a geographical point would be more appropriate.

To display results based on geographical distance, several steps are required.

1. Filter out all hotels that are outside of a specified radius from the given point. Do this by entering a filter with longitude, latitude, and radius parameters. Note that longitude is given first.

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

3. Although the results were returned by Azure Search using a distance filter, the calculated distance between the data and the specified point is _not_ returned. You have to re-calculate this value in the view, or controller if you want to display it in the results.

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

4. Now you have to tie this all together. However, this is as far as our tutorial goes - building a map based app is left as an exercise for the reader!

## Take ordering even further

The examples given in the tutorial so far show how to order on numerical values, which is certainly an exact process of ordering. However, some searches and some data do not lend themselves to such an easy comparison between two data elements. Azure Search includes the concept of _scoring_. _Scoring profiles_ can be specified for a set of data that can be used to provide more complex and qualitative comparisons, that should be most valuable when, say, comparing two documents to decide which should be displayed first.

Scoring is outside the realm of this tutorial. For more details refer to the following resources.
* scoring
* scoring profiles



## Takeaways

Consider the following takeaways from this project:

* Users will expect search results to be ordered, most relevant first.
* The data needs to be structured so that ordering is easy. We were not able to sort on "cheapest" first easily, as the data is not structured to enable this to be done without additional code.
* There can be many levels to ordering, to differentiate between results that have the same value at a higher level of ordering.
* It is natural for some results to be ordered in ascending order (say, distance away from a point), and some in descending order (say, guest's rating).
* Scoring profiles can be defined when numerical comparisons are not available for a data set. Scoring each result will help to order and display them intelligently.

## Next steps

You have completed this series of C# tutorials - you should have gained valuable knowledge of the Azure Search APIs.

For further reference and tutorials, consider browsing [Microsoft Learn](https://docs.microsoft.com/learn/browse/?products=azure), or the other tutorials in the [Azure Search Documentation](https://docs.microsoft.com/azure/search/).
