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

Learn how to implement a geospatial filter, searching both on text and on a geographical area defined by a latitude, longitude, and a radius from that point. If a geographical location of every piece of data (hotels, in our example) is known, then valuable searches for your users can be carried out trying to locate suitable results.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Search based on text then filter on a given latitude, longitude and radius
> * Order results based on specified criteria, including distance from a specified point

## Prerequisites

To complete this tutorial, you need to:

Have the infinite scrolling variant of the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

## Install and run the project from GitHub

TBD

Image

## Build a geospatial filter into an Azure Search

A geospatial search removes all data items that are outside of a specified radius of a certain point. In order to implement this, we need to accept three new inputs: latitude, longitude, and radius. Also, providing the distance back to the user with the results would seem to be an obvious requirement of our view of the results. Because of the strict ordering based on distance, using an infinite scrolling system seems to make sense for this scenario.

### Add code to calculate distances

Although when you request a geospatial filter, the distance between the data points and the point you specify must be calculated by Azure Search, these distances are not returned in the response. You must calculate these distances in the client if you want to display them to your user.

1. Add the following code to your home controller, it calculates distances between two points in kilometers.

```cs
        // Earth radius in kilometers.
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

3. Change the **AddHotel** method in the SearchData.cs file to set the **DistanceInKilometers** field.

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

            hotels.Add(hotel);
        }
```

4. In the **GetFullHotelDescription** method, change the setting of **fullDescription** so that the distance will be displayed to the user.

```cs
            var fullDescription = "Distance: " + h.DistanceInKilometers.ToString("0.#") + " Km.";
            fullDescription += " Sample room: ";
            fullDescription += h.Rooms[0].BedOptions;
            fullDescription += " $" + h.Rooms[0].BaseRate;
            fullDescription += "\n" + description;
            return fullDescription;
```

5. Finally, add some public properties for the latitude, longitude, and radius values to the **SearchData** class, perhaps after the **paging** field. These will be used to communicate the user's input from the view to the controller.

```cs
        public string lat { get; set; }
        public string lon { get; set; }
        public string radius { get; set; }
```

### Add HTML to handle the input of lat-lon coordinates

For this sample, we need three numbers in addition to the search text. This means defining a few new styles to accommodate the numbers.

1. Add the following styles to the **&lt;style&gt;** section of the index.cshtml file.

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

2. Now replace the entire **&lt;body&gt;** section of the view file with the following code.

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

                    // Display the hotel sample room and description.
                    @Html.TextArea("idh", Model.GetFullHotelDescription(i), new { @class = "box2" })
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
                                div.innerHTML += '\n<textarea class="box2">' + data[i + 1] + '</textarea>';
                            }
                        });
                    }
                }
            </script>
        }
    }
</body>
```

Notice how the first search from the view triggers the **Geo** action in the controller and that subsequent calls from the view are triggered using the infinite scrolling method (when the vertical scroll bar reaches the lower limit) and they call the **GeoNext** action.

The next task is to implement these two actions.



### Add code to handle the actions in the home controller

1. First, delete the unused methods **Index(searchData model)** and **Next(searchData model)** (but not **Index()**).

2. The first call to the controller that contains text, latitude, longitude, and a radius is a call to the **Geo** action. This is a substantial method that must set a number of temporary variables and set defaults for the four inputs if none are provided. In the home controller, add this action.

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
                    // The user has triggered a scroll so increment the page.
                    page = (int)TempData["page"] + 1;

                    // Recover the geo info.
                    model.lat = (string)TempData["lat"];
                    model.lon = (string)TempData["lon"];
                    model.radius = (string)TempData["radius"];

                    // Recover the search text.
                    model.searchText = TempData["searchfor"].ToString();
                } else
                {
                    // The first call. Check for valid lat/lon/radius input.
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
                        // Find everything!
                        model.radius = "21000";
                    }
                    if (model.searchText == null)
                    {
                        model.searchText = "";
                    }
                }

                // Call the search API and return results.
                SearchParameters sp = new SearchParameters()
                {
                    // "Location" is a field name and must match a field name in the Hotel class.
                    // Distance (the radius) is in kilometers.
                    // Point order is Longitude then Latitude.
                    Filter = $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') le {model.radius}",

                    // Request the return of the Location field to calculate the distance.
                    Select = new[] { "HotelName", "Description", "Tags", "Rooms", "Location" },
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

3. Now add the code for **NextGeo**, a short method that just specifies that the next page is needed. Then, instead of returning a view, a list of items to append to the current view is returned.

```cs
        public async Task<ActionResult> NextGeo(SearchData model)
        {
            model.paging = "next";
            await Geo(model);

            List<string> hotels = new List<string>();
            for (int n = 0; n < model.hotels.Count; n++)
            {
                hotels.Add(model.GetHotel(n).HotelName);
                hotels.Add(model.GetFullHotelDescription(n));
            }
            return new JsonResult(hotels);
        } 
```



### Test the code so far

1. If you compile and run the project, enter some text such as "bar" and coordinates such as "47" for latitude "-122" for longitude and an excessive "2000" for the radius (so we get plenty of results).

Image

You should get some results, and check they are all within the 2000 Km radius, but are they in the logical order you would expect (nearest first)?

2. Try some other text and coordinates and verify that the results are not in the order you would expect.

The current order of results we have does not make much sense.

## Add code to order Azure Search results

1. We need to make an addition to our Azure Search parameters to specify that the results should be ordered on the distance they are from the point the user has specified, so set the **OrderBy** parameter. Change the **SearchParameters** initialization (in the **Geo** action of the home controller) to the following.

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

                    // Must return the Location to calculate the distance in the client.
                    Select = new[] { "HotelName", "Description", "Tags", "Rooms", "Location" },
                    SearchMode = SearchMode.All,
                };
```

Notice that **OrderBy** takes a list of strings, so we could add multiple criteria for ordering which would come into play if several returned objects had the same value for the first in the list. This is a bit unlikely with floating point distances, so we will leave our entry with just ordering on the basis of distance.

The **geo.distance** function embedded in the **OrderBy** string takes two parameters. In our case the first is the name of a field containing lat/lon data (**Location** in the hotels database). If there were multiple fields containing position data, we could choose which field to compare. The second parameter is a known input for the geo.distance function (**geography'POINT(...)'**). In this latter case, we enter the longitude and latitude (note the order of these two) entered by the user. The two parameters to **geo.distance** could both be field names, both geography points, or one of each as we have in our example.

In order to calculate the distance again in the client, we have to return **Location** as one of our **Select** parameters.

2. Now run the app and search with the same parameters as you did in the last section. You should see that the results are all precisely ordered on distance. Use the infinite scroll to check all results.

Image

3. Try changing the **asc** (ascending) text in the **OrderBy** string to **desc** (descending) and verify the order of distances is longest first. The ascending setting is actually the default, so there is no need to enter it explicitly.

4. Just to educate yourself on the **OrderBy** parameter, comment out the existing line and try the following **OrderBy** statement.

```cs
        OrderBy = new[] { "HotelName" },
```

5. Running the app should now display all hotels in alphabetical order. 
 
A more realistic alternative than alphabetic ordering of display results would be descending order of hotel rating. In addition to specifying **Rating** in the **OrderBy** call, this would require returning the rating in the **Select** set of fields, then storing the value in the **SearchData** class and adding this value to the description for display in the view. Perhaps a distance ordering could be the second criteria so the nearest hotel of any rating appears before others of the same rating but that are further away. No need to do this now, but something to consider if you want to take ordering further. The search parameters would change to the following.

```cs
     Select = new[] { "HotelName", "Description", "Tags", "Rooms", "Location", "Rating" },
     OrderBy = new[] { "Rating desc", $"geo.distance(Location, geography'POINT({model.lon} {model.lat})') asc" },
```

## Takeaways

Great job finishing the fifth and final tutorial in this series.

You should consider the following takeaways from this project:

* Geospatial filters provide valuable context to many user searches. Location is important to most users.
* Ordering should rarely, if ever, be left to the order of the data. Entering one or more **OrderBy** criteria is good practice.

Entering latitude and longitude is not the preferred user experience for most people. To take this example further, consider either entering a city name with a radius, or even locating a point on a map and selecting a radius. These options are not built into Azure Search, so to investigate them try the following resources:

* [Azure Maps Documentation](https://docs.microsoft.com/en-us/azure/azure-maps/)
* [Find an address using the Azure Maps search service](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-search-for-address)


## Next steps

You have completed this series of C# tutorials - you should have gained valuable knowledge of the Azure Search APIs.

For further reference and tutorials, consider browsing [Microsoft Learn](https://docs.microsoft.com/en-us/learn/browse/?products=azure) or the other tutorials in the [Azure Search Documentation](https://docs.microsoft.com/en-us/azure/search/).
