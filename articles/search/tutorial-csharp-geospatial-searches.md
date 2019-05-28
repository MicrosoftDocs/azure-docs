---
title: Tutorial on geospatial queries in Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial and the paging tutorial, to add geospatial searches (searches based on the distance a location is away from a given latitude and longitude).
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Add geospatial filters to an Azure Search

Learn how to implement a geospatial filter, searching both on text and on a latitude, longitude and a radius from that point. If a geographical location of every piece of data (hotel, in our example) is known, then very valuable searches for your users can be carried out trying to locate a suitable result.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Search based on text then filtered on a given latitude, longitude and radius
> * Order results based on distance from a specified location and other criteria

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

## Install and run the project from GitHub


## Build a geospatial filter into an Azure Search

### Add code to calculate distances

Although when you request a geospatial search, the distance between the data points and the point you specify is calculated, these distances are not returned in the response. 

1. You must calculate the distances in the client if you want to display them to your user. To do this, add the following code to your home controller.

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

We'll need to add more code to the controller, but let's update the models and views first to see how this information is communicated and displayed.

2. In order to communicate this distance to the client, add the following field to the Hotel class in the Hotel.cs file.

```cs
        public double DistanceInKilometers { get; set; }
```

3. Change the **AddHotel** method in the SearchData.cs file to set the **DistanceInKilometers** variable.

```cs
        public void AddHotel(string name, string desc, double rate, string bedOption, string[] tags, double distanceInKm)
        {
            // Populate a new Hotel class, but only with the data that has been provided.
            Hotel hotel = new Hotel();
            hotel.HotelName = name;
            hotel.Description = desc;
            hotel.Tags = new string[tags.Length];
            for (int i = 0; i < tags.Length; i++)
            {
                hotel.Tags[i] = new string(tags[i]);
            }
            hotel.DistanceInKilometers = distanceInKm;

            // Create just a single room for the hotel, containing the sample rate and room description.
            Room room = new Room();
            room.BaseRate = rate;
            room.BedOptions = bedOption;

            hotel.Rooms = new Room[1];
            hotel.Rooms[0] = room;

            hotel.LastRenovationDate = lastUpdated;

            hotels.Add(hotel);
        }
```

4. In the **GetHotelDescription** method change the setting of **firstLine** to the following.

```cs
            var firstLine = "Distance: " + h.DistanceInKilometers.ToString("0.#") + " Km.";
            firstLine += " Sample room: ";
            firstLine += h.Rooms[0].BedOptions;
            firstLine += " $" + h.Rooms[0].BaseRate;
            firstLine += "\n" + fullDescription;
            return firstLine;
```

5. Finally add some public properties for the latitude, longitude and radius variables, to the **SearchData** class. These will be used to communicate the user's input from the view to the controller.

```cs
        public string lat { get; set; }
        public string lon { get; set; }
        public string radius { get; set; }
```

. 
### Add html to handle the input of lat-lon co-ordinates

For this sample we need three numbers in addition to the search text. This means defining a few new styles to accommodate the numbers.

1. Add the following styles to the &lt;head&gt; section of the index.cshtml file.

```cs
       .geoForm {
            width: 820px;
            box-shadow: 0 0 0 1px rgba(0,0,0,.1), 0 2px 4px 0 rgba(0,0,0,.16);
            display: inline-block;
            border-collapse: collapse;
            border-spacing: 0;
            list-style: none;
            color: #666;
        }

        .geoBox {
            width: 150px;
            font-size: 16px;
            margin: 5px 0 1px 20px;
            padding: 0 10px 0 0;
            max-height: 30px;
            outline: none;
            box-sizing: content-box;
            height: 35px;
            vertical-align: top;
            border-color: lightgoldenrodyellow;
            border-style: solid;
        }

        .geoTextBox {
            width: 660px;
            font-size: 16px;
            margin: 5px 0 1px 20px;
            padding: 0 10px 0 0;
            max-height: 30px;
            outline: none;
            box-sizing: content-box;
            height: 35px;
            vertical-align: top;
            border-color: lightgoldenrodyellow;
            border-style: solid;
        }
```

2. Now replace the &lt;body&gt; section of the view file with the following code.

```cs
<body>
    <h1 class="sampleTitle">
        <img src="~/images/azure-logo.png" width="80" />
        Geospatial filtering in Azure Search
    </h1>


    @using (Html.BeginForm("Geo", "Home", FormMethod.Post))
    {
        // Display the search text box, with the search icon to the right of it.

        <br />

        <div id="geoinput" class="geoForm">
            <table>
                <tr>
                    <td>&nbsp;&nbsp;</td>
                    <td><b>Text:</b></td>
                    <td colspan="7">@Html.TextBoxFor(m => m.searchText, new { @class = "geoTextBox", @id = "geotext" })</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;</td>
                    <td><b>Latitude:</b></td>
                    <td>@Html.TextBoxFor(m => m.lat, new { @class = "geoBox", @id = "geolat" })</td>
                    <td><b>Longitude:</b></td>
                    <td>@Html.TextBoxFor(m => m.lon, new { @class = "geoBox", @id = "geolon" })</td>
                    <td><b>Radius:</b></td>
                    <td>@Html.TextBoxFor(m => m.radius, new { @class = "geoBox", @id = "georadius" })</td>
                    <td><input value="" class="searchBoxSubmit" type="submit"></td>
                    <td>&nbsp;&nbsp;</td>
                </tr>
            </table>
        </div>
        @if (Model != null)
        {
            // Show the result count.
            <p class="sampleText">
                @Html.DisplayFor(m => m.resultCount) Results
            </p>

            <div id="myDiv" style="width: 800px; height: 450px; overflow-y: scroll;" onscroll="scrolled()">
                <!-- Show the hotel data. All pages will have ResultsPerPage entries, except for the last page. -->
                @for (var i = 0; i < Model.hotels.Count; i++)
                {
                    // Display the hotel name.
                    @Html.TextAreaFor(m => Model.GetHotel(i).HotelName, new { @class = "box1" })
                    <br />
                    // Display the hotel sample room and description.
                    @Html.TextArea("idh", Model.GetHotelDescription(i), new { @class = "box2" })
                    <br /> <br />
                }
            </div>

            <script>
                function scrolled() {
                    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
                        $.getJSON("/Home/NextGeo", function (data) {
                            var div = document.getElementById('myDiv');

                            // Append the returned data to the current list of hotels.
                            for (var i = 0; i < data.length; i += 2) {
                                div.innerHTML += '\n<textarea class="box1">' + data[i] + '</textarea>';
                                div.innerHTML += '\n<textarea class="box2">' + data[i + 1] + '</textarea><br /><br />';
                            }
                        });
                    }
                }
            </script>
        }
    }
</body>

Notice how the first search from the view triggers the **Geo** action in the controller and that subsequent calls from the view are triggered using the infinite paging method (when the scroll bar reaches the limit) and they call the **GeoNext** action.

The next task is to implement these two actions.

```

### Add code to handle the actions in the home controller

1. The first call to the controller that contains text, latitude, longitude and a radius is a call to the **Geo** action. This is a substantial method that must set a number of temporary variables and set defaults for the four inputs if none are provided.

```cs
       public async Task<ActionResult> Geo(SearchData model)
        {
            try
            {
                // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
                _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
                _configuration = _builder.Build();

                _serviceClient = CreateSearchServiceClient(_configuration);
                _indexClient = _serviceClient.Indexes.GetClient("hotels");
           
                int page = 0;

                if (model.paging != null && model.paging == "next")
                {
                    // Increment the page
                    page = (int)TempData["page"] + 1;

                    // Recover the geo info
                    model.lat = (string)TempData["lat"];
                    model.lon = (string)TempData["lon"];
                    model.radius = (string)TempData["radius"];

                    // Recover the search text.
                    model.searchText = TempData["searchfor"].ToString();
                } else
                {
                    // First call. Check for valid lat/lon/radius input
                    if (model.lat == null)
                    {
                        model.lat = "0";
                    }
                    if (model.lon == null)
                    {
                        model.lon = "0";
                    }
                    if (model.radius == null)
                    {
                        // Find everything.
                        model.radius = "21000";
                    }
                    if (model.searchText == null)
                    {
                        model.searchText = "";
                    }
                }

                // Call suggest API and return results
                SearchParameters sp = new SearchParameters()
                {
                    // "Location" must match the field name in the Hotel class.
                    // Distance (the radius) is in kilometers.
                    // Point order is Longitude then Latitude.
                    Filter = $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') le {model.radius}",

                    // Must return the Location to calculate the distance.
                    Select = new[] { "HotelName", "Description", "Tags", "Rooms", "Location", "LastRenovationDate" },
                    SearchMode = SearchMode.All,
                };

                DocumentSearchResult<Hotel> results = await _indexClient.Documents.SearchAsync<Hotel>(model.searchText, sp);

                if (results.Results == null)
                {
                    model.resultCount = 0;
                }
                else
                {
                    // Record the total number of results.
                    model.resultCount = (int)results.Results.Count;

                    int start = page * GlobalVariables.ResultsPerPage;
                    int end = Math.Min(model.resultCount, (page + 1) * GlobalVariables.ResultsPerPage);
                    double distanceInKm;

                    for (int i = start; i < end; i++)
                    {
                        distanceInKm = DistanceInKm(double.Parse(model.lat), double.Parse(model.lon), results.Results[i].Document.Location.Latitude, results.Results[i].Document.Location.Longitude);

                        // Check for hotels with no room data provided.
                        if (results.Results[i].Document.Rooms.Length > 0)
                        {
                            // Add a hotel with sample room data (an example of a "complex type").
                            model.AddHotel(results.Results[i].Document.HotelName,
                                 results.Results[i].Document.Description,
                                 (double)results.Results[i].Document.Rooms[0].BaseRate,
                                 results.Results[i].Document.Rooms[0].BedOptions,
                                 results.Results[i].Document.Tags,
                                 distanceInKm);
                        }
                        else
                        {
                            // Add a hotel with no sample room data.
                            model.AddHotel(results.Results[i].Document.HotelName,
                                results.Results[i].Document.Description,
                                0d,
                                "No room data provided",
                                results.Results[i].Document.Tags,
                                distanceInKm);
                        }
                    }

                    // Ensure Temp data is stored for the next call.
                    TempData["page"] = page;
                    TempData["lat"] = model.lat;
                    TempData["lon"] = model.lon;
                    TempData["radius"] = model.radius;
                    TempData["searchfor"] = model.searchText;
                }
            }
            catch
            {
                return View("Error", new ErrorViewModel { RequestId = "2" });
            }
            return View("Index", model);
        }
```

2. Now add the code for **NextGeo**, a short method that just specifies that the next page is needed. Then, instead of returning a view, a list of items to append to the current view is returned.

```cs
        public async Task<ActionResult> NextGeo(SearchData model)
        {
            model.paging = "next";
            await Geo(model);

            List<string> hotels = new List<string>();
            for (int n = 0; n < model.hotels.Count; n++)
            {
                hotels.Add(model.GetHotel(n).HotelName);
                hotels.Add(model.GetHotelDescription(n));
            }
            return new JsonResult(hotels);
        } 
```

## Test the code so far

1. If you compile and run the project, enter some text such as "bar" and coordinates such as "47" for latitude "-122" for longitude and "1000" for the radius.

2. You should get some results, and they are all within the 1000 Km radius, but are they in the logical order you would expect (nearest first)?

3. Try some other text using the same coordinates and verify that the results are not in the order you would expect.

## Add code to order Azure Search results

1. We need to make an addition to our Azure Search parameters to specify that the results should be ordered on the distance they are from the point the user has indicated. We do this by setting the **OrderBy** parameter. Change the **SearchParameters** initialization to the following.

```cs
                SearchParameters sp = new SearchParameters()
                {
                    // "Location" must match the field name in the Hotel class.
                    // Distance (the radius) is in kilometers.
                    // Point order is Longitude then Latitude.
                    Filter = $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') le {model.radius}",

                    // If OrderBy is not specified, the returned order is simply as the data is found.
                    // As the user has specified a distance, seems right to return the data in distance order.
                    OrderBy = new[] { $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') asc" },

                    // Must return the Location to calculate the distance.
                    Select = new[] { "HotelName", "Description", "Tags", "Rooms", "Location" },
                    SearchMode = SearchMode.All,
                };
```

Notice that **OrderBy** takes a list of strings, so we could add multiple criteria for ordering which would come into play if several returned objects had the same value for the first in the list. This is a bit unlikely with floating point distances, so we will leave our entry with just ordering on the basis of distance.

The **geo.distance** function embedded in the **OrderBy** string takes two parameters. The first is the name of a field containing lat/lon data (**Location** in this case). If there were multiple fields containing position data, we could choose which field to compare. The second parameter is a keyword for the geo.distance function (**geography'POINT(...)'**). In this latter case we entry the longitude and latitude (note the order of these two) entered by the user. The two parameters to **geo.distance** could both be field names, both geography points, or one of each as we have in our example.

In order to calculate the distance again in the client, we have to return **Location** as one of our **Select** parameters.

2. Now run the app and search with the same parameters as you did in the last section. You should see that the results are all precisely ordered on distance. To verify this, enter very large and unrealistic radius parameters to locate a lot of results, and use the infinite scroll to check the distances are correctly in order.

3. Try changing the **asc** (ascending) text in the **OrderBy** string to **desc** (descending) and verify the order of distances is longest first. The ascending setting is actually the default, so there is no need to enter it explicitly.

4. Try changing the **OrderBy** statement to the following.

```cs
        OrderBy = new[] { "HotelName" },
```

5. Running the app should now display all hotels in alphabetical order. Perhaps a more realistic search would display a search in descending order of hotel rating. This would require returning the rating in the **Select** set of fields, then storing it in the **SearchData** class and adding the rating to the description for display in the view. This is left as an exercise for you!

## Takeaways

Great job finishing the fifth and final tutorial in this series.

You should consider the following takeaways from this project:

* Geospatial filters provide a lot of valuable context to many user searches. Location is important.
* To fully develop spatial filters additional APIs providing city locations should be investigated, so a user can search on "20 kilometers from the center of New York" rather than having to know and enter latitude and longitude.
* Ordering should rarely, if ever, be left to the order of the data. Entering one or more **OrderBy** criteria is good practice.

Of course, entering latitude and longitude is not the preferred user experience for most people. To take this example further consider either entering a city name with a radius, or perhaps even locating a point on a map and selecting a radius. To investigate these options try the following resources:

* [Azure Maps Documentation](https://docs.microsoft.com/en-us/azure/azure-maps/)
* [Find an address using the Azure Maps search service](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-search-for-address)


## Next steps

You have completed this series of C# tutorials, well done!

For further reference and tutorials, consider browsing [Microsoft Learn](https://docs.microsoft.com/en-us/learn/browse/) or the other tutorials in the [Azure Search Documentation](https://docs.microsoft.com/en-us/azure/search/).
