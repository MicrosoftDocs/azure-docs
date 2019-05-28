---
title: Tutorial on autocompletion and suggestions in an Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial and the paging tutorial, to add autocompletion and suggestions.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Add autocompletion and suggestions to an Azure Search

Learn how to implement autocompletion (type-ahead and suggestions) when a user starts typing into your search box. In this tutorial we will show type-ahead results and suggestion results separately, then show a method of combining them to create a richer user experience. A user may only have to type two or three keys to locate all the results that are available.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Add a drop down list of suggestions for your user in an Azure Search
> * Add a drop down list of autocompleted words in an Azure Search
> * Combine suggestions and autocompletion to further improve the user experience

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

## Install and run the project from GitHub

## Add suggestions to an Azure Search

Let's start with the simplest case of offering up alternatives to the user: simply a drop-down list of suggestions.

1. In the index.cshtml file, change the **TextBoxFor** statement to the following.

```cs
     @Html.TextBoxFor(m => m.searchText, new { @class = "searchBox", @id = "azureautosuggest" }) <input value="" class="searchBoxSubmit" type="submit">
```

The key here is that we have set the **id** of the search box to **azureautosuggest**.

2. Following this call, enter this script.

```cs
<script>
        $("#azureautosuggest").autocomplete({
            source: "/Home/Suggest?highlights=false&fuzzy=false",
            minLength: 2,
            position: {
                my: "left top",
                at: "left-23 bottom+10"
            }
        });
    </script>
```

Note that we have connected this script to the search box via the same id. Also, a minimum of two characters is needed to trigger the search, and we call the **Suggest** action in the home controller with two query parameters: **highlights** and **fuzzy**, both set to false in this instance.

3. In the home controller add the **Suggest** action.

```cs
        public async Task<ActionResult> Suggest(bool highlights, bool fuzzy, string term)
        {
            // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
            _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
            _configuration = _builder.Build();

            _serviceClient = CreateSearchServiceClient(_configuration);
            _indexClient = _serviceClient.Indexes.GetClient("hotels");

            // Call suggest API and return results
            SuggestParameters sp = new SuggestParameters()
            {
                UseFuzzyMatching = fuzzy,
                Top = 8,
            };

            if (highlights)
            {
                sp.HighlightPreTag = "<b>";
                sp.HighlightPostTag = "</b>";
            }

            // Only one suggester can be specified per index. The name of the suggester is set when the suggester is specified by other API calls.
            // The suggester for the hotel database is called "sg" and simply searches the hotel name.
            DocumentSuggestResult<Hotel> suggestResult = await _indexClient.Documents.SuggestAsync<Hotel>(term, "sg", sp);

            // Convert the suggest query results to a list that can be displayed in the client.
            List<string> suggestions = suggestResult.Results.Select(x => x.Text).ToList();
            return new JsonResult((object)suggestions);
        }
```

The **Top** parameter specifies how many results to return, in this case 8 (the default is 5). A "suggester" has to be specified on the Azure index, which is done when the data is set up. In this case the suggester is called "sg" and simply searches the **HotelName** field - nothing else. Fuzzy matching allows "near misses" to be included in the output.

Note too that if the **highlights** parameter is set to true (not in this first example) that bold html tags are added to the output.

4. Run the app. Do you get a range of options when you enter "pa", for example?

Image

## Add suggestions with highlighting

We can improve the appearance of the suggestions to the user a bit by setting the **highlights** parameter to true. However, first we need to add some code to the view to display the bolded text.

1. In the view, add the following script (no need to delete the **azureautosuggest** script, as we are using different ids).

```cs
<script>
        var updateTextbox = function (event, ui) {
            var result = ui.item.value.replace(/<\/?[^>]+(>|$)/g, "");
            $("#azuresuggesthighlights").val(result);
            return false;
        };

        $("#azuresuggesthighlights").autocomplete({
            html: true,
            source: "/home/suggest?highlights=true&fuzzy=false&",
            minLength: 2,
            position: {
                my: "left top",
                at: "left-23 bottom+10"
            },
            select: updateTextbox,
            focus: updateTextbox
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a>" + item.label + "</a>")
                .appendTo(ul);
        };
    </script>
```

2. Now change the id of the text display so it reads as follows.

```cs
@Html.TextBoxFor(m => m.searchText, new { @class = "searchBox", @id = "azuresuggesthighlights" }) <input value="" class="searchBoxSubmit" type="submit">
```

3. Run the app again, and you should see your entered text bolded in the suggestions.
 
Image
 

## Add autocompletion to an Azure Search

Another variation that is slightly different from suggestions is autocompletion. Again we will start with the simplest implementation before moving onto improving the user experience.

1. Enter the following script into the view.

```cs
<script>
        $("#azureautocompletebasic").autocomplete({
            source: "/Home/Autocomplete",
            minLength: 2,
            position: {
                my: "left top",
                at: "left-23 bottom+10"
            }
        });
    </script>
```

2. Now change the id of the text display so it reads as follows.

```cs
@Html.TextBoxFor(m => m.searchText, new { @class = "searchBox", @id = "azureautocompletebasic" }) <input value="" class="searchBoxSubmit" type="submit">
```

3. In the home controller we need to enter the **Autocomplete** action.

```cs
public async Task<ActionResult> AutoComplete(string term)
        {
            // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
            _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
            _configuration = _builder.Build();

            _serviceClient = CreateSearchServiceClient(_configuration);
            _indexClient = _serviceClient.Indexes.GetClient("hotels");

            //Call autocomplete API and return results
            AutocompleteParameters ap = new AutocompleteParameters()
            {
                AutocompleteMode = AutocompleteMode.OneTermWithContext,
                UseFuzzyMatching = false,
                Top = 6
            };
            AutocompleteResult autocompleteResult = await _indexClient.Documents.AutocompleteAsync(term, "sg", ap);

            // Convert the autocompleteResult results to a list that can be displayed in the client.
            List<string> autocomplete = autocompleteResult.Results.Select(x => x.Text).ToList();

            return new JsonResult((object)autocomplete);
        }
```

Notice that we are using the same *suggester* function called "sg" in the autocomplete search (so we are only trying to autocomplete the hotel names).

There are a range of **AutocompleteMode** settings and we are using **OneTermWithContext**. Refer to [Azure Autocomplete](https://docs.microsoft.com/en-us/rest/api/searchservice/autocomplete) for a description of the range of options here.

4. Run the app. Notice how the range of options are just single words. 

Image

5. Try setting **Fuzzy** to true and see what range of options you get.

Image

To make autocompletion more user-friendly it is best added to the suggestion search.

## Combine autocompletion and suggestions in an Azure Search

This is the most complex of our autocompletion/suggestion options and probably provides the best user experience. What we want is to display, inline with the text that is being typed, the first choice for auto-completing a word. Also, we want a drop-down list of a range of suggestions.

There are libraries that offer this functionality - often called "inline autocompletion" or a similar name. However, we are going to natively implement this feature so you can see what is going on.

1. We need to add an action to the controller than returns just one autocompletion result, along with a specified number of suggestions. We will call this action **AutocompleteAndSuggest**.

```cs
        public async Task<ActionResult> AutocompleteAndSuggest(string term)
        {
            // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
            _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
            _configuration = _builder.Build();

            _serviceClient = CreateSearchServiceClient(_configuration);
            _indexClient = _serviceClient.Indexes.GetClient("hotels");

            //Call autocomplete API and return results
            AutocompleteParameters ap = new AutocompleteParameters()
            {
                AutocompleteMode = AutocompleteMode.OneTermWithContext,
                UseFuzzyMatching = false,
                Top = 1,
            };
            AutocompleteResult autocompleteResult = await _indexClient.Documents.AutocompleteAsync(term, "sg", ap);

            // Call suggest API and return results
            SuggestParameters sp = new SuggestParameters()
            {
                UseFuzzyMatching = false,
                Top = 8,
            };

            // Only one suggester can be specified per index. The name of the suggester is set when the suggester is specified by other API calls.
            // The suggester for the hotel database is called "sg" and simply searches the hotel name.
            DocumentSuggestResult<Hotel> suggestResult = await _indexClient.Documents.SuggestAsync<Hotel>(term, "sg", sp);

            List<string> results = new List<string>();
            if (autocompleteResult.Results.Count > 0)
            {
                results.Add(autocompleteResult.Results[0].Text);
            } else
            {
                results.Add("");
            }
            for (int n=0; n<suggestResult.Results.Count; n++)
            {
                results.Add(suggestResult.Results[n].Text);
            }
            return new JsonResult((object)results);
        }
```

Note how the autocompletion option is returned at the top of the list, followed by the suggestions. We now need to implement a script to handle this.

2. In the view, first we implement a trick so that a light gray autocompletion word is rendered right under bolder text being entered by the user. Html includes relative positioning for this purpose. Change the **TextBoxFor** statement to the following, noting that a second search box identified as **underneath** is right under our normal search box, by pulling this search box 39 pixels off of its default location!

```cs
    <div id="underneath" class="searchBox" style="position: relative; left: 0; top: 0">
    </div>

    <div id="searchinput" class="searchBoxForm" style="position: relative; left: 0; top: -39px">
        @Html.TextBoxFor(m => m.searchText, new { @class = "searchBox", @id = "azureautocomplete" }) <input value="" class="searchBoxSubmit" type="submit">
    </div>
```

3. Also in the view, enter the following script. There is quite a lot to it.

```cs
<script>
        $('#azureautocomplete').autocomplete({
            delay: 500,
            minLength: 2,
            position: {
                my: "left top",
                at: "left-23 bottom+10"
            },

            // Use Ajax to set up a "success" function.
            source: function (request, response) {
                var controllerUrl = "/Home/AutoCompleteAndSuggest?term=" + $("#azureautocomplete").val();
                $.ajax({
                    url: controllerUrl,
                    dataType: "json",
                    success: function (data) {
                        if (data && data.length > 0) {

                            // Show the autocomplete suggestion
                            document.getElementById("underneath").innerHTML = data[0];

                            // Remove the top suggestion as it is used for inline autocomplete.
                            var array = new Array();
                            for (var n = 1; n < data.length; n++) {
                                array[n - 1] = data[n];
                            }

                            // Show the drop-down list of suggestions.
                            response(array);
                        } else {

                            // Nothing is returned, so clear the autocomplete suggestion.
                            document.getElementById("underneath").innerHTML = "";
                        }
                    }
                });
            }
        });

        // Complete on TAB.
        // Clear on ESC.
        // Clear if backspace to less than 2 characters.
        // Clear if any arrow key hit as user is navigating the suggestions.
        $("#azureautocomplete").keydown(function (evt) {

            var suggestedText = document.getElementById("underneath").innerHTML;
            if (evt.keyCode === 9 /* TAB */ && suggestedText.length > 0) {
                $("#azureautocomplete").val(suggestedText);
                return false;
            } else if (evt.keyCode === 27 /* ESC */) {
                document.getElementById("underneath").innerHTML = "";
                $("#azureautocomplete").val("");
            } else if (evt.keyCode === 8 /* Backspace */) {
                if ($("#azureautocomplete").val().length < 2) {
                    document.getElementById("underneath").innerHTML = "";
                }
            } else if (evt.keyCode >= 37 && evt.keyCode <= 40 /* Any arrow key */) {
                document.getElementById("underneath").innerHTML = "";
            }
        });

        // Character replace function.
        function setCharAt(str, index, chr) {
            if (index > str.length - 1) return str;
            return str.substr(0, index) + chr + str.substr(index + 1);
        }

        // This function is needed to clear the "underneath" text when the user clicks on a suggestion, and to
        // correct the case of the autocomplete option when it does not match the case of the user input.
        // The interval function is activated with the input, blur, change, or focus events.
        $("#azureautocomplete").on("input blur change focus", function (e) {

            // Set a 2 second interval duration.
            var intervalDuration = 2000, 
                interval = setInterval(function () {

                    // Compare the autocorrect suggestion with the actual typed string.
                    var inputText = document.getElementById("azureautocomplete").value;
                    var autoText = document.getElementById("underneath").innerHTML;

                    // If the typed string is longer than the suggestion, then clear the suggestion.
                    if (inputText.length > autoText.length) {
                        document.getElementById("underneath").innerHTML = "";
                    } else {

                        // If the strings match, change the case of the suggestion to match the case of the typed input.
                        if (autoText.toLowerCase().startsWith(inputText.toLowerCase())) {
                            for (var n = 0; n < inputText.length; n++) {
                                autoText = setCharAt(autoText, n, inputText[n]);
                            }
                            document.getElementById("underneath").innerHTML = autoText;

                        } else {
                            // The strings do not match, so clear the suggestion.
                            document.getElementById("underneath").innerHTML = "";
                        }
                    }

                    // If the element loses focus, stop the interval checking.
                    if (!$input.is(':focus')) clearInterval(interval);

                }, intervalDuration);
        });
    </script>
```

Notice the clever use of the **interval** function to both clear the underlying text when it no longer matches what the user is typing, but also to set the same case as the user is typing (as "pa" matches "PA", "pA", "Pa" when searching) so that the overlaid text is neat.

Read through the comments in the script to get a fuller understanding.

4. Now run the app. Enter "pa" into the search box. Do you get "palace" as the autocomplete suggestion, along with two hotels that contain "pa"?

Image

5. Try tabbing to accept the autocomplete suggestion, and try selecting suggestions using the arrow keys and tab, and try again using the mouse and a single click. Verify that the script handles all these situations neatly.

Of course you may decide that it is simpler to load in a library that offers this feature for you, but now you know at least one way of how it works!

## Takeaways

A third tutorial completed, great work!

You should consider the following takeaways from this project:

* Autocompletion (also known as "type-ahead") and suggestions enable the user to just type a few keys to locate exactly what they want.
* Working with the UI can test your limits and patience with javascript/HTML/JQuery and other UI technologies.
* Autocompletion and suggestions working together can provide a rich user experience.

## Next steps

One of the issues with autocompletion and suggestions is that they involve repeated calls to the server. If this results in slower than expected responses then the user experience diminishes. Facets are an interesting alternative to avoid these repeated calls, which we will look at next.

> [!div class="nextstepaction"]
> [C# Tutorial: Use facets to improve the efficiency of an Azure Search](tutorial-csharp-facets.md)