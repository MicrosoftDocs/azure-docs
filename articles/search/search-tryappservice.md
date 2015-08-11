<properties 
   pageTitle="Try Azure App Service with Azure Search" 
   description="Try Azure Search for free, up to one hour, using the TryAzureAppService template." 
   services="search" 
   documentationCenter="" 
   authors="HeidiSteen" 
   manager="mblythe" 
   editor=""/>

<tags
   ms.service="search"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="search" 
   ms.date="07/13/2015"
   ms.author="heidist"/>

# Try Azure App Service with Azure Search

[Try Azure App Service](https://tryappservice.azure.com/) is a new, entirely free way to test-drive selected Azure Services, including Azure Search, for up to one hour with no Azure subscription sign-up required. 

The site gives you several templates to choose from. When you select the ASP.NET template that includes Azure Search, you gain one hour of access to a fully functional web site, backed by the services you selected. You won't be able to update or delete any of the data managed by Azure Search – but you can execute queries and make any number of code changes that reshapes the user experience. If the session expires before you’re done exploring, you can always start over with another session, or move on to a trial or full subscription if your goal is to create or load an index directly.

On the [Try Azure App Service](https://tryappservice.azure.com/) site, Azure Search is part of the Web App template – providing a rich, full-text search experience along with a slew of search-centric features available only in this service on the Azure platform.

Although other Azure services such as SQL Database offer full-text search, a service like Azure Search gives you tuning control, pagination and counts, hit highlighting, auto-complete query suggestions, natural language support, faceted navigation, filtering and more. As several of our [samples](https://github.com/AzureSearch) demonstrate, it’s possible to develop a full-featured search-based application using just Azure Search and ASP.NET.

As part of the [Try Azure App Service](https://tryappservice.azure.com/) offering, the Azure Search service you’ll use is read-only – which means you will need to use the search corpus provided in the session. You cannot upload or use your own index or data. The data you’ll work with is from the [United States Geological Survey (USGS)](), consisting of about 3 million rows of landmarks, historical sites, buildings, and other landmark features across the US.

To help you get the most out of your one hour session, the following instructions will walk you through queries and code. 

Before moving ahead, you might want to take a few minutes review a few key points about the code, service, and searchable data. Having a little background could prove useful if you’re not already familiar with Azure Search. 

##Facts about the code and Azure Search

Azure Search is a service-plus-data [PaaS](https://en.wikipedia.org/wiki/Platform_as_a_service) offering, consisting of a fully managed search service, plus searchable data that you upload when using an unconstrained instance of Azure Search (i.e., when you are not using the Try Azure App Service option).

Data used in search operations is stored with your search service in Azure, where proximity of data to operations ensures low latency and consistent search behaviors. There is currently no support for offline or remote storage of searchable data. Drilling into this a bit further:

- Search data is stored in an index managed by Azure Search, populated by documents, one document per searchable item. 
- Most indexes are loaded from a single dataset, prepared in advance by you to include only those fields that are useful in the context of search operations. 
- The schema that defines your index is user-defined and will specify searchable fields, non-searchable fields that could be useful in a filter expression, and constructs like scoring profiles for tuning results.
- Data can be auto-loaded by an Indexer (supported for Azure SQL Database or Azure DocumentDB only), or pushed to a search index via one of the Azure Search APIs. When you use the API, you can push data from any data source, as long as it’s in JSON format.

In the [Try Azure App Service](https://tryappservice.azure.com/) option, the ASP.NET + Azure Search Site template provides source code for the Web application, modifiable in Visual Studio Online (available as a part of the one-hour session). No separate development tools are required to view or change the code.

Code is written in C#, using the [Azure Search .NET client library](https://msdn.microsoft.com/library/dn951165.aspx) to execute queries against the index, provide faceted navigation, and display counts and search results in a web page.

Other code, not included in the template, was used to build and load the USGS search index. Because the service is read-only, all operations requiring write-access had to be completed in advance. You can see a [copy of the schema](#schema) used to build the schema at the end of this article.

##Get started

If you haven’t started your 1-hour session yet, follow these steps to get started.

1. Go to [https://tryappservice.azure.com](https://tryappservice.azure.com/) and scroll down to select **Web App**. 
2. Click **Next**.
3. Choose the **ASP.NET + Azure Search Site** template.

    ![][1]

4. Click **Create**.
5. Choose a login method and provide the username and password.

    ![][2]

6. Wait while the site is provisioned. When it’s ready, you will see a page similar to this one. Each page shows a running clock so that you always know how much time you have left.

    ![][3]

7. Choose **Edit with Visual Studio Online** to view the solution and browse the site. 
9. In Visual Studio Online, expand the session options at the top of the page, and then click **Browse Web Site**.

    ![][4]

10. You should see the getting started page for your Azure Search web site. Click the **Get Started** button to open the site.

    ![][5]

11. An ASP.NET web site opens in the browser, providing a search box. Enter a familiar term to search on, such as *Yellowstone* or a well-known mountain like *Mount Rainier*. Starting with a familiar landmark makes it easier to evaluate the results.

    ![][6]


##What to do first
Since the search index is fully operational, a good first step is to try out a few queries. Azure 
Search supports all of the standard search operators (+, -, |), quotation marks for literal matches, wildcard (*), and precedence operators. You can review the query syntax reference for the full list of operators.

- Start with a wildcard search by adding an asterisk (`*`). This tells you how many documents are found in the index: 2,262,578.
- Next, enter "Yellowstone", then add "+center", "+building", and "-ND" to progressively narrow search results to just the Yellowstone visitor centers, excluding those in North Dakota: `Yellowstone +center +building -ND`.  
- Try a search phrase that combines precedence operators and string matching: `statue+(park+MT)`. You should see results similar to the screenshot below. Notice that facet categories appear under Feature Class, offering self-directed filtering through faceted navigation, a feature commonly found in most search applications.

    ![][7]

Ready to move on? Let’s change a few lines of code to see the impact on full-text search operations.

##Change searchMode.All

Azure Search has a configurable **searchMode** property that you can use to control search operator behavior. Valid values for this property are `Any` (default) or `All`. See [Simple Query Syntax](https://msdn.microsoft.com/library/dn798920.aspx) for more guidance on setting these options.

- **searchMode.Any** stipulates that any match on a search term is sufficient to include an item in the search results. If your search phrase is `Yellowstone visitor center`, then any document containing any of these terms is included in the search results. This mode is biased towards *recall*.
- **searchModel.All**, used in this sample, requires that all of the specified terms be present in the document. This mode is more stringent than **searchMode.Any**, but if you favor *precision* over recall, it is probably the right choice for your application. 

> [AZURE.NOTE] **searchMode.Any** works best when query construction consists mostly of phrases, with minimal use of operators. A general rule of thumb is that people searching consumer applications, such as e-commerce sites, tend to use just terms, whereas people searching on content or data are more likely to include operators in the search phrase. If you believe searches are likely to include operators, particularly the `NOT (-)` operator, start with **searchModel.All**. In contrast, your other choice, **searchMode.Any** will `OR` the `NOT` operator with other search terms, which can dramatically expand rather than trim results. The example below can help you understand the difference.

In this task, you will change the **searchMode** and compare search outcomes based on mode.

1. Open the browser window containing the sample application, choose **Connect to Visual Studio Online**.

    ![][8]

2. Open **Search.cshtml**, find `searchMode.All` on line 39 and change it to `searchMode.Any`.

    ![][9]

3. In the jump bar to the right, click **Run**.

    ![][10]
 
In the rebuilt application window, enter a search term that you’ve used before, such as `Yellowstone +center +building -ND`, and compare the before-and-after results of changes to **searchMode**.

It’s a pretty big difference. Instead of seven search results, you get over two million. 

   ![][11]
 
The behavior you’re observing is due to the inclusion `NOT` operator (in this case, "-ND"), which is *OR'd* rather than *AND'd* when **searchMode** is set to `Any`.

Given this configuration, the search results include hits for the search terms `Yellowstone`, `center`, and `building`, but also every document that is `NOT North Dakota`. Since there are only 13,081 documents containing the phrase `North Dakota`, almost all of the dataset is returned.

Admittedly, this is perhaps an unlikely scenario, but it illustrates the effects of **searchMode** on search phrases that include the `NOT` operator, so it’s useful to understand why the behavior occurs and how to change it if this is not what you want.

To continue with this tutorial, revert **searchMode** back to its original value (set to `All` on line 39), run the program, and use the rebuilt app for the remaining tasks.
 
##Add a global filter for Washington State

Normally, if you wanted to search over a subset of available data, you would set the filter at the data source when importing data. For learning purposes, working with read-only data, we’ll set the filter in our application to return just the documents that include Washington State.

1. Open Search.cshtml, find the **SearchParameters** code block (starting on line 36) and add a comment line plus filter.

        var sp = new SearchParameters
        {
            //Add a filter for _Washington State
            Filter = "STATE_ALPHA eq 'WA'",
            // Specify whether Any or All of the search terms 
            SearchMode = SearchMode.All,
            // Include a count of results in the query result
            IncludeTotalResultCount = true,
            // Return an aggregated count of feature classes based on the specified query
            Facets = new[] { "FEATURE_CLASS" },
            // Limit the results to 20 documents
            Top = 20
        };


Filters are specified using OData syntax and are frequently used with faceted navigation or included in the query string to constrain the query. See [OData Filter Syntax](https://msdn.microsoft.com/library/azure/dn798921.aspx) for more information.

2. Click **Run**.

3. Open the application.

4. Type the wildcard (*) to return a count. Notice that the results are now limited to 42,411 items, which are all of the documents for all of the geographical features in Washington State.

   ![][12]

##Add Hit Highlighting

Now that you have made a series of one-line code changes, you might want to try deeper modifications that require code changes in multiple places. The following version of **Search.cshtml** can be pasted right over the Search.cshtml file in your current session. 

The following code adds hit-highlighting. Notice the new properties declared in the [SearchParameters](https://msdn.microsoft.com/library/microsoft.azure.search.models.searchparameters_properties.aspx). There is also a new function that iterates over the collection of results to get the documents that need highlighting, plus HTML that renders the result. 

When you run this code sample, search term inputs that have a corresponding match in specified fields are highlighted in bold font.

   ![][14]

You might want to save a copy of the original **Search.cshtml** file to see how both versions compare.

> [AZURE.NOTE] Comments have been trimmed to reduce the size of the file.
 
    @using System.Collections.Specialized
    @using System.Configuration
    @using Microsoft.Azure.Search
    @using Microsoft.Azure.Search.Models
    
    @{
    Layout = "~/_SiteLayout.cshtml";
    }
    
    @{
    // This modified search.cshtml file adds hit-highlighting
    
    string searchText = Request.Unvalidated["q"];
    string filterExpression = Request.Unvalidated["filter"];
    
    DocumentSearchResponse response = null;
    if (!string.IsNullOrEmpty(searchText))
    {
    searchText = searchText.Trim();
    
    // Retrieve search service name and an api key from configuration
    string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
    string apiKey = ConfigurationManager.AppSettings["SearchServiceApiKey"];
    
    var searchClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));
    var indexClient = searchClient.Indexes.GetClient("geonames");
    
    // Set the Search parameters used when executing the search request
    var sp = new SearchParameters
    {
    // Specify whether Any or All of the search terms must be matched in order to count the document as a match.
    SearchMode = SearchMode.All,
    // Include a count of results in the query result
    IncludeTotalResultCount = true,
    // Return an aggregated count of feature classes based on the specified query
    Facets = new[] { "FEATURE_CLASS" },
    // Limit the results to 20 documents
    Top = 20,
    // Enable hit-highlighting
    HighlightFields = new[] { "FEATURE_NAME", "DESCRIPTION", "FEATURE_CLASS", "COUNTY_NAME", "STATE_ALPHA" },
    HighlightPreTag = "<b>",
    HighlightPostTag = "</b>",
    };
    
    if (!string.IsNullOrEmpty(filterExpression))
    {
    // Add a search filter that will limit the search terms based on a specified expression.
    // This is often used with facets so that when a user selects a facet, the query is re-executed,
    // but limited based on the chosen facet value to further refine results
    sp.Filter = filterExpression;
    }
    
    // Execute the search query based on the specified search text and search parameters
    response = indexClient.Documents.Search(searchText, sp);
    }
    }
    
    @functions
    {
    private string GetFacetQueryString(string facetKey, string facetValue)
    {
    NameValueCollection queryString = HttpUtility.ParseQueryString(Request.Url.Query);
    queryString["filter"] = string.Format("{0} eq '{1}'", HttpUtility.UrlEncode(facetKey), HttpUtility.UrlEncode(facetValue));
    return queryString.ToString();
    }
    
    private HtmlString RenderHitHighlightedString(SearchResult item, string fieldName)
    {
    if (item.Highlights != null && item.Highlights.ContainsKey(fieldName))
    {
    string highlightedResult = string.Join("...", item.Highlights[fieldName]);
    return new HtmlString(highlightedResult);
    }
    return new HtmlString(item.Document[fieldName].ToString());
    }
    }
    
    <!-- Form to allow user to enter search terms -->
    <form class="form-inline" role="search">
    <div class="form-group">
    <input type="search" name="q" id="q" autocomplete="off" size="80" placeholder="Type something to search, i.e. 'park'." class="form-control" value="@searchText" />
    <button type="submit" id="search" class="btn btn-primary">Search</button>
    </div>
    </form>
    @if (response != null)
    {
    if (response.Count == 0)
    {
    <p style="padding-top:20px">No results found for "@searchText"</p>
    <h3>Suggestions:</h3>
    <ul>
    <li>Ensure words are spelled correctly.</li>
    <li>Try rephrasing keywords or using synonyms.</li>
    <li>Try less specific keywords.</li>
    </ul>
    }
    else
    {
    <div class="col-xs-3 col-md-2">
    <h3>Feature Class</h3>
    <ul class="list-unstyled">
    @if (!string.IsNullOrEmpty(filterExpression))
    {
    <li><a href="?q=@HttpUtility.UrlEncode(searchText)">All</a></li>
    }
    <!-- Cycle through the facet results and show the values and counts -->
    @foreach (var facet in response.Facets["FEATURE_CLASS"])
    {
    <li><a href="?@GetFacetQueryString("FEATURE_CLASS", (string)facet.Value)">@facet.Value (@facet.Count)</a></li>
    }
    </ul>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-10">
    <p style="padding-top:20px">1 - @response.Results.Count of @response.Count results for "@searchText"</p>
    
    <ul class="list-unstyled">
    <!-- Cycle through the search results -->
    @foreach (var item in response.Results)
    {
    <li>
    <h3>@RenderHitHighlightedString(item, "FEATURE_NAME")</h3>
    <p>@RenderHitHighlightedString(item, "DESCRIPTION")</p>
    <p>@RenderHitHighlightedString(item, "FEATURE_CLASS"), elevation: @item.Document["ELEV_IN_M"] meters</p>
    <p>@RenderHitHighlightedString(item, "COUNTY_NAME") County, @RenderHitHighlightedString(item, "STATE_ALPHA")</p>
    <br />
    </li>
    }
    </ul>
    </div>
    }
    }


##Next steps

Using the read-only service provided in [Try Azure App Service](https://tryappservice.azure.com/) site, you have seen the query syntax and full-text search in action, learned about searchMode and filters, and added hit-highlighting to your search application. As your next step, consider moving on to creating and updating indexes. This adds the ability to:

- [Define scoring profiles](https://msdn.microsoft.com/library/dn798928.aspx) used for tuning search scores so that high-value items show up first.
- [Define Suggesters](https://msdn.microsoft.com/library/mt131377.aspx) that add auto-complete or type-ahead query suggestions in response to user input.
- [Define indexers](https://msdn.microsoft.com/library/dn946891.aspx) that update your index automatically whenever the data source is Azure SQL Database or Azure DocumentDB.

To perform all these tasks, you’ll need an Azure subscription so that you can create and populate indexes in a service. For more information about how to sign up for a free trial, visit [https://azure.microsoft.com/pricing/free-trial](https://azure.microsoft.com/pricing/free-trial/).

To learn more about Azure Search, visit our [documentation page](http://azure.microsoft.com/documentation/services/search/) on [http://azure.microsoft.com](http://azure.microsoft.com) or check out any number of [samples and videos](https://msdn.microsoft.com/library/dn818681.aspx) that explore the full range of Azure Search functionality.

<a name="Schema"></a>
##About the schema

The following screenshot shows the schema used to create the index used in this template.
 
   ![][13]

###Schema.json file

    {
      "@odata.context": "https://tryappservice.search.windows.net/$metadata#indexes/$entity",
      "name": "geonames",
      "fields": [
    {
      "name": "FEATURE_ID",
      "type": "Edm.String",
      "searchable": false,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false,
      "key": true,
      "analyzer": null
    },
    {
      "name": "FEATURE_NAME",
      "type": "Edm.String",
      "searchable": true,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": false,
      "key": false,
      "analyzer": null
    },
    {
      "name": "FEATURE_CLASS",
      "type": "Edm.String",
      "searchable": true,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "STATE_ALPHA",
      "type": "Edm.String",
      "searchable": true,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "STATE_NUMERIC",
      "type": "Edm.Int32",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "COUNTY_NAME",
      "type": "Edm.String",
      "searchable": true,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "COUNTY_NUMERIC",
      "type": "Edm.Int32",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "ELEV_IN_M",
      "type": "Edm.Int32",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "ELEV_IN_FT",
      "type": "Edm.Int32",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "MAP_NAME",
      "type": "Edm.String",
      "searchable": true,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": false,
      "key": false,
      "analyzer": null
    },
    {
      "name": "DESCRIPTION",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false,
      "key": false,
      "analyzer": null
    },
    {
      "name": "HISTORY",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false,
      "key": false,
      "analyzer": null
    },
    {
      "name": "DATE_CREATED",
      "type": "Edm.DateTimeOffset",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    },
    {
      "name": "DATE_EDITED",
      "type": "Edm.DateTimeOffset",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true,
      "key": false,
      "analyzer": null
    }
      ],
      "scoringProfiles": [
    
      ],
      "defaultScoringProfile": null,
      "corsOptions": {
    "allowedOrigins": [
      "*"
    ],
    "maxAgeInSeconds": 300
      },
      "suggesters": [
    {
      "name": "AUTO_COMPLETE",
      "searchMode": "analyzingInfixMatching",
      "sourceFields": [
    "FEATURE_NAME",
    "FEATURE_CLASS",
    "COUNTY_NAME",
    "DESCRIPTION"
      ]
    }
      ]
    }


<!--Image references-->
[1]: ./media/search-tryappservice/AzSearch-TryAppService-TemplateTile.png
[2]: ./media/search-tryappservice/AzSearch-TryAppService-LoginAccount.png
[3]: ./media/search-tryappservice/AzSearch-TryAppService-AppCreated.png
[4]: ./media/search-tryappservice/AzSearch-TryAppService-BrowseSite.png
[5]: ./media/search-tryappservice/AzSearch-TryAppService-GetStarted.png
[6]: ./media/search-tryappservice/AzSearch-TryAppService-QueryWA.png
[7]: ./media/search-tryappservice/AzSearch-TryAppService-QueryPrecedence.png
[8]: ./media/search-tryappservice/AzSearch-TryAppService-VSOConnect.png
[9]: ./media/search-tryappservice/AzSearch-TryAppService-cSharpSample.png
[10]: ./media/search-tryappservice/AzSearch-TryAppService-RunBtn.png
[11]: ./media/search-tryappservice/AzSearch-TryAppService-searchmodeany.png
[12]: ./media/search-tryappservice/AzSearch-TryAppService-searchmodeWAState.png
[13]: ./media/search-tryappservice/AzSearch-TryAppService-Schema.png
[14]: ./media/search-tryappservice/AzSearch-TryAppService-HitHighlight.png