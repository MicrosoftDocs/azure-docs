<properties 
	pageTitle="Get started with Azure Search | Microsoft Azure" 
	description="Get started with Azure Search" 
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
	ms.date="04/09/2015" 
	ms.author="heidist"/>

# Get started with Azure Search

Microsoft Azure Search is a new service that allows you to embed search functionality into custom applications. It provides the search engine and storage for your data, which you access and manage using a .NET SK or a REST API. To read more about why you would use Azure Search, see [Azure Search Scenarios and Capabilities](http://azure.microsoft.com/blog/2014/08/28/azure-search-scenarios-and-capabilities/).  

As an administrator, you can add Search service to an existing subscription at no cost when choosing the shared service, or at a reduced rate when opting in for dedicated resources. This article has the following sections:

<a id="sub-1"></a>
## Start with the free service

Subscribers automatically get free access to a shared, multitenant Search service that you can use for learning purposes, proof-of-concept testing, or small development search projects. Sign up for the free version using these steps.

1. Sign in to [Azure portal](https://portal.azure.com) using your existing subscription. Notice that this URL takes you to the Preview portal. Using the Preview portal is a requirement. 

2. Click **New** at the bottom of the page.
 
  	![][6]

3. Click **Data + Storage** | **Search**.

	- Type a lower-case service name to use in the service URL, avoiding spaces, and staying within the 15 character string limit.

	- Click the arrow in **Pricing Tier** to select a pricing option. Choose **FREE** and then click **SELECT** at the bottom of the page. The free version offers enough capacity to try out tutorials and write proof-of-concept code, but is not intended for production applications. 

	- Click the arrow in **Resource Group** to pick an existing group or create a new one. Resource groups are containers for services and resources used for a common purpose. For example, if you're building a custom search application based on Azure Search, Azure Websites, Azure BLOB storage, you could create a resource group that keeps these services together in the portal management pages.

	- Click the arrow in **Subscription** if you have multiple subscriptions and you want to use a different subscription for this search service.

	- Click the arrow in **Location** to choose a data center region. In this preview, you can choose from West US, East US, North Europe, and Southeast Asia. Later, when other regions are online, choose one region for the service you are creating. Distributing resources across multiple data centers will not be a supported configuration for public preview.

4. Click **CREATE** to provision the service. Notice that **CREATE** is enabled only after you fill in all required values. 

In a few minutes, the service is created. You can return to the configuration settings to get the URL or api-keys. Connections to your Search service requires that you have both the URL and an api-key to authenticate the call. Here's how to quickly find these values:

14. Go to **Home** to open the dashboard. Click the Search service to open the service dashboard. 

  	![][13]

15.	On the service dashboard, you'll see tiles for **PROPERTIES** and **KEYS**, and usage information that shows resource usage at a glance. 

Continue on to [Test service operations](#sub-3) for instructions on how to connect to the service using these values.

<a id="sub-2"></a>
## Upgrade to standard search

Standard search gets you dedicated resources in an Azure data center that can be used only by you. Search workloads require both storage and service replicas. When you sign up for standard search, you can optimize service configuration to use more of whichever resource is the most important to your scenario.

Having dedicated resources will give you more scale and better performance, but not additional features. Both shared and standard search offer the same features.

To use standard search, create a new Search service, choosing the Standard pricing tier. Notice that upgrade is not an in-place upgrade of the free version. Switching to standard, with its potential for scale, requires a new service. You will need to reload the indexes and documents used by your search application.

Setting up dedicated resources can take a while (15 minutes or longer). 

**Step 1 - Create a new service with Pricing Tier set to Standard**

1. Sign in to [Azure portal](https://portal.azure.com) using your existing subscription. 

2. Click **New** at the bottom of the page.

4. From the Gallery, click **Data + Storage** | **Search**.

7. Fill in the service configuration settings and then click **CREATE**.

8. In **Pricing Tier** to select a pricing option. Choose **STANDARD** and then click **SELECT** at the bottom of the page.

**Step 2 - Adjust search units based on scale requirements**

Standard search starts with one replica and partition each, but can be easily re-scaled at higher resource levels.

1.	Once the service is created, return to the service dashboard, click the **Scale** tile.

2.	Use the sliders to add replicas, partitions, or both. 

Additional replicas and partitions are billed in search units. The total search units required to support any particular resource configuration is shown on the page, as you add resources. 

You can check [Pricing Details](http://go.microsoft.com/fwlink/p/?LinkID=509792) to get the per-unit billing information. See [Limits and constraints](http://msdn.microsoft.com/library/azure/dn798934.aspx) for help in deciding how to configure partition and replica combinations.

 ![][15]

<a id="sub-3"></a>
## Test service operations

Confirming that your service is operational and accessible from a client application is the final step in configuring Search. This procedure uses Fiddler, available as a [free download from Telerik](http://www.telerik.com/fiddler), to issue HTTP requests and view responses. By using Fiddler, you can test the API immediately, without having to write any code. 

The following procedure works for both shared and standard search. In the steps below, you'll create an index, upload documents, query the index, and then query the system for service information.

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

1.	Sign in to [Azure portal](https://portal.azure.com) using your existing subscription. 
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

- [Azure Search Technical Overview](http://msdn.microsoft.com/library/dn798933.aspx)

- [Azure Search REST API](http://msdn.microsoft.com/library/dn798935.aspx)

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
