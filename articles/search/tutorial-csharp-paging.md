---
title: Tutorial on paging the results of an Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial with the choice of two types of paging. The first paging system uses a range of page numbers as well as next and previous options. The second paging system uses infinite paging, triggered by vertical scrolling.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Page the results of an Azure Search

Learn how to implement two different systems of paging, the first based on page numbers and the second on infinite paging. This tutorial builds on the Create your first app in Azure Search tutorial. Both systems of paging are popular across the internet and selecting the right one can depend on the type of search that is being carried out and the user experience you would like with the results.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Page results with first/previous/next/last options in addition to a range of page numbers
> * Page results based on a vertical scroll, often called "infinite paging"

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Create your first app in Azure Search](tutorial-csharp-create-first-app.md) project up and running.

## Extend your app to add numbered paging

Numbered paging is the paging system of choice of the main internet search engines and most other search websites. Numbered paging typically includes a "next" and "previous" option in addition to a range of actual page numbers. Also a "first page" and "last page" option might also be available. This certainly gives a user a lot of control over navigating through page based results.

We will add a system that includes first, previous, next, and last options, along with page numbers that do not start from 1, but instead surround the current page the user is on (so, for example, if the user is looking at page 10, perhaps page numbers 8, 9, 10, 11, and 12 are displayed).

The system will be flexible enough to allow the number of visible page numbers to be set in a global variable.

The system will treat the left-most and right-most page number buttons as special, meaning they will trigger changing the range of page numbers displayed. For example, if page numbers 8, 9, 10, 11 and 12 are displayed, and the user clicks on 8, then the range of page numbers displayed changes to 6, 7, 8, 9, and 10. And there is a similar shift to the right if they selected 12.


### Start with the first Azure Search app

1. If you created it yourself and have the project handy, start from there. Alternatively download the first app from here.
xxxx

2. Run the project to make sure it works!

### Add paging fields to the model

1. Open the SearchData.cs model file.

2. First add some global variables. **MaxPageRange** determines the number of visible page numbers on the view. **PageRangeDelta** determines how many pages left or right the page range should be shifted when the left-most or right-most page number is selected. Typically this latter number might be around half of **MaxPageRange**.

```cs
        public static int MaxPageRange
        {
            get
            {
                return 5;
            }
        }

        public static int PageRangeDelta
        {
            get
            {
                return 2;
            }
        }
```

3. Add three more paging fields to the **SearchData** class, say, after the **pageCount** field.

```cs
        // The left-most page number to display.
        public int leftMostPage { get; set; }

        // The number of pages to display - which can be less than MaxPageRange towards the end of the results.
        public int pageRange { get; set; }

        // Used when page numbers, or next or prev buttons, have been selected.
        public string paging { get; set; }
```

### Add a table of paging options to the view

1. Replace the paging options (starting with **@if (Model != null && Model.pageCount > 1)** and ending with **}** before the final &lt;/body&gt; tag) with the following code. This new code presents a table of paging options: first, previous, 1, 2, 3, 4, 5, next, last.

```cs
@if (Model != null && Model.pageCount > 1)
{
    // If there is more than one page of results, show the paging buttons.
    <table>
        <tr>
            <td>
                @if (Model.currentPage > 0)
                {
                    <p class="pageButton">
                        @Html.ActionLink("|<", "Page", "Home", new { paging = "0" }, null)
                    </p>
                }
                else
                {
                    <p class="pageButtonDisabled">|&lt;</p>
                }
            </td>

            <td>
                @if (Model.currentPage > 0)
                {
                    <p class="pageButton">
                        @Html.ActionLink("<", "Page", "Home", new { paging = "prev" }, null)
                    </p>
                }
                else
                {
                    <p class="pageButtonDisabled">&lt;</p>
                }
            </td>

            @for (var pn = Model.leftMostPage; pn < Model.leftMostPage + Model.pageRange; pn++)
            {
                <td>
                    @if (Model.currentPage == pn)
                    {
                        // Convert displayed page numbers to 1-based and not 0-based.
                        <p class="pageSelected">@(pn + 1)</p>
                    }
                    else
                    {
                        <p class="pageButton">
                            @Html.ActionLink((pn + 1).ToString(), "Page", "Home", new { paging = @pn }, null)
                        </p>
                    }
                </td>
            }

            <td>
                @if (Model.currentPage < Model.pageCount - 1)
                {
                    <p class="pageButton">
                        @Html.ActionLink(">", "Page", "Home", new { paging = "next" }, null)
                    </p>
                }
                else
                {
                    <p class="pageButtonDisabled">&gt;</p>
                }
            </td>

            <td>
                @if (Model.currentPage < Model.pageCount - 1)
                {
                    <p class="pageButton">
                        @Html.ActionLink(">|", "Page", "Home", new { paging = Model.pageCount - 1 }, null)
                    </p>
                }
                else
                {
                    <p class="pageButtonDisabled">&gt;|</p>
                }
            </td>
        </tr>
    </table>
}
```

Note the use of an HTML table to align things neatly. However all the action comes from the **@Html.ActionLink** statements, each calling the controller with a **new** model created with different entries to the **paging** field we added earlier.

The first and last page options do not send strings such as "first" and "last", but instead send the correct page numbers.

2. Add the **pageSelected** class to the list of HTML styles (perhaps after **.pageButton**). This class is there simply to identify the page the user is on (by turning the number bold) in the list of page numbers.

```cs
    .pageSelected {
            border: none;
            color: black;
            font-weight: bold;
            width: 50px;
        }
```

### Add a Page action to the controller

1. Open the HomeController.cs file and delete the old page actions **Next** and **Prev**.

2. In their place, add the **Page** action. This action responds to any of the page options selected.

```cs
        public async Task<ActionResult> Page(SearchData model)
        {
            try
            {
                int page;

                switch (model.paging)
                {
                    case "prev":
                        page = (int)TempData["page"] - 1;
                        break;

                    case "next":
                        page = (int)TempData["page"] + 1;
                        break;

                    default:
                        page = int.Parse(model.paging);
                        break;
                }

                // Recover the leftMostPage
                int leftMostPage = (int)TempData["leftMostPage"];

                // Recover the search text and search for the data for the new page.
                model.searchText = TempData["searchfor"].ToString();

                await RunQueryAsync(model, page, leftMostPage);

                // Ensure Temp data is stored for next call, as TempData only stored for one call.
                TempData["page"] = (object)page;
                TempData["searchfor"] = model.searchText;
                TempData["leftMostPage"] = model.leftMostPage;
            }

            catch
            {
                return View("Error", new ErrorViewModel { RequestId = "2" });
            }
            return View("Index", model);
        }
```

Note that the **RunQueryAsync** method shows a syntax error, this is because of the third parameter which we will come to in a bit.

3. The **Index(model)** action needs to be updated to store the **leftMostPage** temporary variable and add the left-most page parameter to the **RunQueryAsync** call.

```cs
        public async Task<ActionResult> Index(SearchData model)
        {
            try
            {
                // Ensure the search string is valid.
                if (model.searchText == null)
                {
                    model.searchText = "";
                }

                // Make the Azure Search call for the first page.
                await RunQueryAsync(model, 0, 0);

                // Ensure temporary data is stored for the next call.
                TempData["page"] = 0;
                TempData["leftMostPage"] = 0;
                TempData["searchfor"] = model.searchText;
            }

            catch
            {
                return View("Error", new ErrorViewModel { RequestId = "1" });
            }
            return View(model);
        }
```

4. The **RunQueryAsync** method needs to be updated to calculate the page variables. To make things easy, replace the entire method with the following code.

```cs
        private async Task<ActionResult> RunQueryAsync(SearchData model, int page, int leftMostPage)
        {
            // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
            _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
            _configuration = _builder.Build();

            _serviceClient = CreateSearchServiceClient(_configuration);
            _indexClient = _serviceClient.Indexes.GetClient("hotels");

            SearchParameters parameters;
            DocumentSearchResult<Hotel> results;

            parameters =
               new SearchParameters()
               {
                   // Enter Hotel property names into this list so only these values will be returned.
                   // If Select is empty, all values will be returned, which can be inefficient.
                   Select = new[] { "HotelName", "Description", "Tags", "Rooms" }
               };

            // For efficiency, the search call should ideally be asynchronous, so we use the
            // SearchAsync call rather than the Search call.
            results = await _indexClient.Documents.SearchAsync<Hotel>(model.searchText, parameters);

            if (results.Results == null)
            {
                model.resultCount = 0;
            }
            else
            {
                // Record the total number of results.
                model.resultCount = (int)results.Results.Count;

                // Calculate the range of current page results.
                int start = page * GlobalVariables.ResultsPerPage;
                int end = Math.Min(model.resultCount, (page + 1) * GlobalVariables.ResultsPerPage);

                for (int i = start; i < end; i++)
                {
                    // Check for hotels with no room data provided.
                    if (results.Results[i].Document.Rooms.Length > 0)
                    {
                        // Add a hotel with sample room data (an example of a "complex type").
                        model.AddHotel(results.Results[i].Document.HotelName,
                             results.Results[i].Document.Description,
                             (double)results.Results[i].Document.Rooms[0].BaseRate,
                             results.Results[i].Document.Rooms[0].BedOptions,
                             results.Results[i].Document.Tags);
                    }
                    else
                    {
                        // Add a hotel with no sample room data.
                        model.AddHotel(results.Results[i].Document.HotelName,
                            results.Results[i].Document.Description,
                            0d,
                            "No room data provided",
                            results.Results[i].Document.Tags);
                    }
                }

                // Calculate the page count.
                model.pageCount = (model.resultCount + GlobalVariables.ResultsPerPage - 1) / GlobalVariables.ResultsPerPage;

                // Calculate the range of page numbers to display.
                model.currentPage = page;

                if (page == 0)
                {
                    leftMostPage = 0;
                }
                else
                   if (page <= leftMostPage)
                {
                    // Trigger a switch to a lower page range.
                    leftMostPage = Math.Max(page - GlobalVariables.PageRangeDelta, 0);
                }
                else
                if (page >= leftMostPage + GlobalVariables.MaxPageRange - 1)
                {
                    // Trigger a switch to a higher page range.
                    leftMostPage = Math.Min(leftMostPage + GlobalVariables.PageRangeDelta, model.pageCount - GlobalVariables.MaxPageRange);
                }
                model.leftMostPage = leftMostPage;

                // Calculate the number of page numbers to display.
                model.pageRange = Math.Min(model.pageCount - leftMostPage, GlobalVariables.MaxPageRange);
            }
            return View("Index", model);
        }
```

### Compile and run the app

Now select **Start Without Debugging** (or press the F5 key).

1. Search on some text that will give plenty of results (such as "bar" or "pool"). Can you page neatly through the results?

2. Try clicking on the right-most and later left-most page numbers. Do the page numbers adjust appropriately to center the page you are on?

3. Are the "first" and "last" options useful? Some popular web searches use these options, and others do not!

Now save off this project and let's try an alternative to this form of paging.

## Extend your app to add infinite paging

Infinite paging is triggered when a user scrolls to the end of the results being displayed. In this event a call to the server is made for the next page of results. If there are no more results, nothing is returned and the vertical scroll bar does not change. If there are more results, these are appended to the current page and the scroll bar changes to show that more results are available.

The important point here is that the page being displayed is not replaced, but appended to with the new results. A user can always scroll back up to the very first results of the search.

To implement infinite paging, let's start with the project before adding any of the page number scrolling elements.

### Start with the first Azure Search app

1. If you created it yourself and have the project handy, start from there. Alternatively download the first app from here.

TBD

2. Run the project to make sure it works!

### Add a paging field to the model

1. Add a **paging** field to the **SearchData** class (in the SearchData.cs) model file, perhaps just after the **pageCount** field.

```cs 
 public string paging { get; set; }
```

This variable is a string which will simply hold "next" if the next page of results should be sent, or be null for the first page of a search.

### Add a vertical scroll bar to the view

1. Locate the section of the index.cshtml file that displays the results (it starts with the **@for (var i = 0; i < Model.hotels.Count; i++)** ).
2. Replace the entire loop with the **&lt;div&gt;** section below. The **&lt;div&gt;** section is around the area that should be scroll-able and adds both an **overflow-y** attribute and a call to an **onscroll** function called "scrolled()" (or any name you want to give it), like so.

```cs
        <div id="myDiv" style="width: 800px; height: 440px; overflow-y: scroll;" onscroll="scrolled()">
            <!-- Show the hotel data. All pages will have ResultsPerPage entries, except for the last page. -->
            @for (var i = 0; i < Model.hotels.Count; i++)
            {
                // Display the hotel name.
                @Html.TextAreaFor(m => Model.GetHotel(i).HotelName, new { @class = "box1" })
                <br />

                // Display the hotel sample room and description.
                @Html.TextArea("idh", Model.GetFullHotelDescription(i), new { @class = "box2" })
                <br /> <br />
            }
        </div>
```

3. Directly underneath this, say after the &lt;/div&gt; tag, in the index.cshtml file, add the scroll function.

```cs
        <script>
            function scrolled() {
                if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
                    $.getJSON("/Home/Next", function (data) {
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
```

Note the call in the script above that tests to see if the user has scrolled to the bottom of the results list. If they have a call to the **Home** controller is make to an action called **Next**. No other information is needed by the controller, it will simply return the next page of data. This data is then formatted using identical styles as the original page. If no results are returned nothing is appended and things stay as they are.

4. Delete the old page handling section that begins with **@if (Model != null && Model.pageCount > 1)** and ends just before the end &lt;/body&gt; tag. No need for this with our infinite page system!

### Handle the next action

There are only three actions that can be sent to the controller: the first running of the app which calls **Index()**, the first search by the user which calls **Index(model)** and the calls for more results via **Next(model)**.

1. Open the home controller file and delete the old actions **Next** and **Prev** and the **RunQueryAsync** method from the original tutorial.

2. Replace the **Index(model)** action with the following code. It now handles the **paging** field when it is null or set to "next" and handles the calls to Azure Search.

```cs
        public async Task<ActionResult> Index(SearchData model)
        {
            try
            {
                // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
                _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
                _configuration = _builder.Build();

                _serviceClient = CreateSearchServiceClient(_configuration);
                _indexClient = _serviceClient.Indexes.GetClient("hotels");

                int page;

                if (model.paging != null && model.paging == "next")
                {
                    // Increment the page.
                    page = (int)TempData["page"] + 1;

                    // Recover the search text.
                    model.searchText = TempData["searchfor"].ToString();
                } else
                {
                    // First call. Check for valid text input.
                    if (model.searchText == null)
                    {
                        model.searchText = "";
                    }
                    page = 0;
                }

                // Call the search API and return results.
                SearchParameters sp = new SearchParameters()
                {
                    Select = new[] { "HotelName", "Description", "Tags", "Rooms" },
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

                    for (int i = start; i < end; i++)
                    {
                        // Check for hotels with no room data provided.
                        if (results.Results[i].Document.Rooms.Length > 0)
                        {
                            // Add a hotel with sample room data (an example of a "complex type").
                            model.AddHotel(results.Results[i].Document.HotelName,
                                 results.Results[i].Document.Description,
                                 (double)results.Results[i].Document.Rooms[0].BaseRate,
                                 results.Results[i].Document.Rooms[0].BedOptions,
                                 results.Results[i].Document.Tags);
                        }
                        else
                        {
                            // Add a hotel with no sample room data.
                            model.AddHotel(results.Results[i].Document.HotelName,
                                results.Results[i].Document.Description,
                                0d,
                                "No room data provided",
                                results.Results[i].Document.Tags);
                        }
                    }

                    // Ensure Temp data is stored for the next call.
                    TempData["page"] = page;
                    TempData["searchfor"] = model.searchText;
                }
            }
            catch
            {
                return View("Error", new ErrorViewModel { RequestId = "1" });
            }
            return View("Index", model);
        }
```

3. Add the **Next** action to the home controller. Note how it returns a list, each hotel adding two elements to the list: a hotel name and a hotel description. This format is set to match the **scrolled** function's use of the returned data in the view.

```cs
        public async Task<ActionResult> Next(SearchData model)
        {
            model.paging = "next";
            await Index(model);

            List<string> hotels = new List<string>();
            for (int n = 0; n < model.hotels.Count; n++)
            {
                hotels.Add(model.GetHotel(n).HotelName);
                hotels.Add(model.GetFullHotelDescription(n));
            }
            return new JsonResult(hotels);
        }
```

4. Notice that you are getting a syntax error on **List<string>**. We need to add the following **using** directive to the head of the controller file.

```cs
using System.Collections.Generic;
```

### Compile and run your project

Now select **Start Without Debugging** (or press the F5 key).

1. Enter a term that will give plenty of results (such as "wifi") and then test the vertical scroll bar. Does it trigger a new page of results? If the scroll bar is not scroll-able and there are more than one page worth of results, then it might just be that the scroll-able height is a bit too large for one page of entries. You want it slightly too small so that a scroll bar is available on the first page. In this case, consider reducing the height of the scroll-able area by a few pixels in the statement **<div id="myDiv" style="width: 800px; height: 440px; overflow-y: scroll;" onscroll="scrolled()">** in the view file.

2. Scroll down all the way to the bottom of the results. Note how all information is now on the one view page as you can scroll all the way back to the top without triggering any server calls.

More sophisticated infinite paging systems might use the mouse wheel or similar other mechanism to trigger the loading of a new page of results. We will not be taking infinite paging any further in these tutorials, but it has a certain charm to it as it avoids extra mouse clicks and you might want to investigate other options further!

## Takeaways

Good job on finishing this tutorial.

You should consider the following takeaways from this project:

* Numbered paging is perhaps the most robust for searches where the order of the results is somewhat arbitrary, meaning there may well be something of interest to your users on the later pages.
* Infinite paging is perhaps most robust when the order of results is particularly important. For example, if the results are ordered on the distance from the center of a destination city.
* Numbered paging allows for some better navigation, for example, a user can remember that an interesting result was on page 6, whereas no such easy navigation exists in infinite paging.
* Infinite paging has an easy appeal, just scrolling down with no fussy page numbers to click on.
* A key feature of infinite paging is that you are appending to an existing page, not replacing that page. This keeps it efficient.


## Next steps

The next two tutorials use numbered paging. The later tutorial on geospatial filtering uses infinite paging.

> [!div class="nextstepaction"]
> [C# Tutorial: Add autocompletion and suggestions to an Azure Search](tutorial-csharp-type-ahead-and-suggestions.md)
