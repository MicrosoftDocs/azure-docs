<properties 
	pageTitle="Get started with Azure Search | Microsoft Azure | Hosted cloud search service" 
	description="Get started with Azure Search, a cloud hosted search service on Microsoft Azure." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""
    tags="azure-portal"/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="01/11/2016" 
	ms.author="heidist"/>

# Get started with Azure Search

Microsoft Azure Search is a hosted cloud search service that allows you to embed search functionality into custom applications. It provides the search engine and storage for your data, which you access and manage using a .NET library or a REST API.

This article gets you started with the Azure Search REST API. 

An alternative approach for .NET developers is to use the Azure Search.NET SDK. See [Get started with Azure Search in .NET](search-get-started-dotnet.md) or [How to use the Azure Search .NET SDK](search-howto-dotnet-sdk.md) for details.


> [AZURE.NOTE] Completing this tutorial requires an [Azure subscription](../includes/free-trial-note.md). If you aren't ready to sign up for a trial subscription, you can skip this tutorial and opt for [Try Azure App Service](https://tryappservice.azure.com/) instead. This alternative option gives you Azure Search with an ASP.NET Web app for free - one hour per session - no subscription required.
 
<a id="sub-1"></a>
## Start with the free service

As an administrator, you can add Search service to an existing subscription at no cost when choosing the shared service, or at a reduced rate when opting in for dedicated resources. 

Subscribers automatically get free access to a shared, multitenant Search service that you can use for learning purposes, proof-of-concept testing, or small development search projects. Sign up for the free version using these steps.

1. Sign in to [Azure Portal](https://portal.azure.com) using your existing subscription. To follow step-by-step instructions, see [Create an Azure Search service in the portal](search-create-service-portal.md). 

After the service is created, you can return to the configuration settings to get the URL and api-keys. Connections to your Search service requires that you have both the URL and an api-key to authenticate the call. Here's how to quickly find these values:

14. Go to **Home** to open the dashboard. Click the Search service to open the service dashboard. 

  	![][13]

15.	On the service dashboard, you'll see tiles for **PROPERTIES** and **KEYS**, and usage information that shows resource usage at a glance. 

Continue on to [Test service operations](#sub-3) for instructions on how to connect to the service using these values.

<a id="sub-3"></a>
## Test service operations

Next, confirm that your service is operational and accessible from a client application. This procedure uses Fiddler, available as a [free download from Telerik](http://www.telerik.com/fiddler), to issue HTTP requests and view responses. By using Fiddler, you can test the API immediately, without having to write any code. 

In the steps below, you'll create an index, upload documents, query the index, and then query the system for service information.

### Create an index

1. Start Fiddler. On the File menu, turn off **Capture Traffic** to hide extraneous HTTP activity that is unrelated to the current task. On the Composer tab, you'll formulate a request that looks like this: 

  	![][16]

2. Select **PUT**.

3. Enter a URL that specifies the service URL (which you can find on the Properties page), request attributes and the api-version. A few pointers to keep in mind:
   + Use HTTPS as the prefix
   + Request attribute is "/indexes/hotels". This tells Search to create an index named 'hotels'.
   + Api-version is lower-case, specified as "?api-version=2015-02-28". API versions are important because Azure Search deploys updates regularly. On rare occasions, a service update may introduce a breaking change to the API. Using API versions, you can continue to use your existing version and upgrade to the newer one when it is convenient.

    The full URL should look similar to the following example:

         https://my-app.search.windows.net/indexes/hotels?api-version=2015-02-28

4.	Specify the request header, replacing the host and api-key with values that are valid for your service.

        User-Agent: Fiddler
        host: my-app.search.windows.net
        content-type: application/json
        api-key: 1111222233334444

5.	In Request Body, paste in the fields that make up the index definition.

         {
        "name": "hotels",  
        "fields": [
          {"name": "hotelId", "type": "Edm.String", "key":true, "searchable": false},
          {"name": "baseRate", "type": "Edm.Double"},
          {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
          {"name": "hotelName", "type": "Edm.String", "suggestions": true},
          {"name": "category", "type": "Edm.String"},
          {"name": "tags", "type": "Collection(Edm.String)"},
          {"name": "parkingIncluded", "type": "Edm.Boolean"},
          {"name": "smokingAllowed", "type": "Edm.Boolean"},
          {"name": "lastRenovationDate", "type": "Edm.DateTimeOffset"},
          {"name": "rating", "type": "Edm.Int32"},
          {"name": "location", "type": "Edm.GeographyPoint"}
         ] 
        }

6.	Click **Execute**.

In a few seconds, you should see an HTTP 201 response in the session list, indicating the index was created successfully. 

If you get HTTP 504, verify the URL specifies HTTPS. If you see HTTP 400 or 404, check the request body to verify there were no copy-paste errors. An HTTP 403 typically indicates a problem with the api-key (either an invalid key or a syntax problem with how the api-key is specified).

### Load documents

On the Composer tab, your request to post documents will look like the following. The body of the request contains the search data for 4 hotels.

   ![][17]

1. Select **POST**.

2.	Enter a URL that starts with HTTPS, followed by your service URL, followed by "/indexes/<'indexname'>/docs/index?api-version=2015-02-28". The full URL should look similar to the following example:

        https://my-app.search.windows.net/indexes/hotels/docs/index?api-version=2015-02-28

3.	Request Header should be the same as before. Remember that you replaced the host and api-key with values that are valid for your service.

        User-Agent: Fiddler
        host: my-app.search.windows.net
        content-type: application/json
        api-key: 1111222233334444

4.	The Request Body contains four documents to be added to the hotels index.

        {
        "value": [
        {
        	"@search.action": "upload",
        	"hotelId": "1",
        	"baseRate": 199.0,
        	"description": "Best hotel in town",
        	"hotelName": "Fancy Stay",
        	"category": "Luxury",
        	"tags": ["pool", "view", "wifi", "concierge"],
        	"parkingIncluded": false,
        	"smokingAllowed": false,
        	"lastRenovationDate": "2010-06-27T00:00:00Z",
        	"rating": 5,
        	"location": { "type": "Point", "coordinates": [-122.131577, 47.678581] }
          },
          {
        	"@search.action": "upload",
        	"hotelId": "2",
        	"baseRate": 79.99,
        	"description": "Cheapest hotel in town",
        	"hotelName": "Roach Motel",
        	"category": "Budget",
        	"tags": ["motel", "budget"],
        	"parkingIncluded": true,
        	"smokingAllowed": true,
        	"lastRenovationDate": "1982-04-28T00:00:00Z",
        	"rating": 1,
        	"location": { "type": "Point", "coordinates": [-122.131577, 49.678581] }
          },
          {
        	"@search.action": "upload",
        	"hotelId": "3",
        	"baseRate": 279.99,
        	"description": "Surprisingly expensive",
        	"hotelName": "Dew Drop Inn",
        	"category": "Bed and Breakfast",
        	"tags": ["charming", "quaint"],
        	"parkingIncluded": true,
        	"smokingAllowed": false,
        	"lastRenovationDate": null,
        	"rating": 4,
        	"location": { "type": "Point", "coordinates": [-122.33207, 47.60621] }
          },
          {
        	"@search.action": "upload",
        	"hotelId": "4",
        	"baseRate": 220.00,
        	"description": "This could be the one",
        	"hotelName": "A Hotel for Everyone",
        	"category": "Basic hotel",
        	"tags": ["pool", "wifi"],
        	"parkingIncluded": true,
        	"smokingAllowed": false,
        	"lastRenovationDate": null,
        	"rating": 4,
        	"location": { "type": "Point", "coordinates": [-122.12151, 47.67399] }
          }
         ]
        }

8.	Click **Execute**.

In a few seconds, you should see an HTTP 200 response in the session list. This indicates the documents were created successfully. If you get a 207, at least one document failed to upload. If you get a 404, you have a syntax error in either the header or body of the request.

### Query the index

Now that an index and documents are loaded, you can issue queries against them.  On the Composer tab, a GET command that queries your service will look similar to the following:

   ![][18]

1.	Select **GET**.

2.	Enter a URL that starts with HTTPS, followed by your service URL, followed by "/indexes/<'indexname'>/docs?", followed by query parameters. By way of example, use the following URL, replacing the sample host name with one that is valid for your service.

        https://my-app.search.windows.net/indexes/hotels/docs?search=motel&facet=category&facet=rating,values:1|2|3|4|5&api-version=2015-02-28

    This query searches on the term “motel” and retrieves facet categories for ratings.

3.	Request Header should be the same as before. Remember that you replaced the host and api-key with values that are valid for your service.

        User-Agent: Fiddler
        host: my-app.search.windows.net
        content-type: application/json
        api-key: 1111222233334444

The response code should be 200, and the response output should look similar to the following illustration.
 
   ![][19]

The following example query is from the [Search Index operation (Azure Search API)](http://msdn.microsoft.com/library/dn798927.aspx) on MSDN. Many of the example queries in this topic include spaces, which are not allowed in Fiddler. Replace each space with a + character before pasting in the query string before attempting the query in Fiddler: 

**Before spaces are replaced:**

        GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2015-02-28

**After spaces are replaced with +:**

        GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate+desc&api-version=2015-02-28
### Query the system

You can also query the system to get document counts and storage consumption. On the Composer tab, your request will look similar to the following, and the response will return a count for the number of documents and space used.

   ![][20]

1.	Select **GET**.

2.	Enter a URL that includes your service URL, followed by "/indexes/hotels/stats?api-version=2015-02-28":

        https://my-app.search.windows.net/indexes/hotels/stats?api-version=2015-02-28 

3.	Specify the request header, replacing the host and api-key with values that are valid for your service.

        User-Agent: Fiddler
        host: my-app.search.windows.net
        content-type: application/json
        api-key: 1111222233334444

4.	Leave the request body empty.

5.	Click **Execute**. You should see an HTTP 200 status code in the session list. Select the entry posted for your command.

6.	Click the Inspectors tab | Headers, and select the JSON format. You should see the document count and storage size (in KB).

 	![][21]

<a id="sub-4"></a>
## Explore Search service dashboard

If you need a refresher on where to find the configuration pages, follow these steps to locate the service dashboard.

1.	Sign in to [Azure Portal](https://portal.azure.com) using your existing subscription. 
2.	Click **Home** and then click the tile for your Search service.

 	![][22]

4.	Clicking the tile opens the service dashboard. Notice that **Start**, **Stop**, and **Delete** commands are at the top. 

5.	Notice the service URL is near the top of the page. You will need this URL in to connect to your Azure Search service.
	
7.	Click the **KEYS** icon to view the api-keys. You will need an Admin key to authenticate to the service. You can use either the primary or secondary. Optionally, you can create query keys for read-only access to the service.


<!--Next steps and links -->
<a id="next-steps"></a>
## Try it out

Ready for the next step? The following links take you to additional material that shows you how to build and manage search applications that use Azure Search.

- [Create an Azure Search GeoSearch Sample](search-create-geospatial.md)

- [Manage your search solution in Microsoft Azure](search-manage.md) 

- [What is Azure Search?](search-what-is-azure-search.md)

- [Azure Search Service REST API](http://msdn.microsoft.com/library/dn798935.aspx)

- [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx)

- [Channel 9 video: Introduction to Azure Search](http://channel9.msdn.com/Shows/Data-Exposed/Introduction-To-Azure-Search)

- [Channel 9 video: Azure Search and Geospatial Data](http://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data)

- [Cloud Cover episode 152: Generate an index in Azure Search](http://channel9.msdn.com/Shows/Cloud+Cover/Cloud-Cover-152-Azure-Search-with-Liam-Cavanagh)

<!--Anchors-->
[Start with the free service]: #sub-1
[Upgrade to standard search]: #sub-2
[Test service operations]: #sub-3
[Explore Search service dashboard]: #sub-4
[Try it out]: #next-steps

<!--Image references-->
[6]: ./media/search-get-started/AzureSearch_Configure1_1_New.PNG
[7]: ./media/search-get-started/AzureSearch_Configure1_2_Everything.PNG
[8]: ./media/search-get-started/Azuresearch_Configure1_3a_Gallery.PNG
[9]: ./media/search-get-started/AzureSearch_Configure1_4_GallerySeeAll.PNG
[10]: ./media/search-get-started/AzureSearch_Configure1_5_SearchTile.PNG
[11]: ./media/search-get-started/AzureSearch_Configure1_6_URL.PNG
[12]: ./media/search-get-started/AzureSearch_Configure1_7a_Free.PNG
[13]: ./media/search-get-started/AzureSearch_Configure1_17_HomeDashboard.PNG
[14]: ./media/search-get-started/AzureSearch_Configure1_9_Standard.PNG
[15]: ./media/search-get-started/AzureSearch_Configure1_10_ScaleUp.PNG
[16]: ./media/search-get-started/AzureSearch_Configure1_11_PUTIndex.PNG
[17]: ./media/search-get-started/AzureSearch_Configure1_12_POSTDocs.PNG
[18]: ./media/search-get-started/AzureSearch_Configure1_13_GETQuery.PNG
[19]: ./media/search-get-started/AzureSearch_Configure1_14_GETQueryResponse.PNG
[20]: ./media/search-get-started/AzureSearch_Configure1_15_Stats.PNG
[21]: ./media/search-get-started/AzureSearch_Configure1_16_StatsResponse.PNG
[22]: ./media/search-get-started/AzureSearch_Configure1_17_HomeDashboard.PNG
[23]: ./media/search-get-started/AzureSearch_Configure1_18_Explore.PNG


<!--Link references-->
[Manage your search solution in Microsoft Azure]: search-manage.md
[Azure Search development workflow]: search-workflow.md
[Create your first azure search solution]: search-create-first-solution.md
[Create a geospatial search app using Azure Search]: search-create-geospatial.md
