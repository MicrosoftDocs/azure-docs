<properties
	pageTitle="How to use Fiddler to evaluate and test Azure Search REST APIs | Microsoft Azure | Hosted cloud search service"
	description="Use Fiddler for a code-free approach to verifying Azure Search availability and trying out the REST APIs."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="06/08/2016"
	ms.author="heidist"/>

# Use Fiddler to evaluate and test Azure Search REST APIs
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Search Explorer](search-explorer.md)
- [Fiddler](search-fiddler.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

This article explains how to use Fiddler, available as a [free download from Telerik](http://www.telerik.com/fiddler), to issue HTTP requests to and view responses using the Azure Search REST API, without having to write any code. Azure Search is fully-managed, hosted cloud search service on Microsoft Azure, easily programmable through .NET and REST APIs. The Azure Search service REST APIs are documented on [MSDN](https://msdn.microsoft.com/library/azure/dn798935.aspx).

In the following steps, you'll create an index, upload documents, query the index, and then query the system for service information.

To complete these steps, you will need an Azure Search service and `api-key`. See [Create an Azure Search service in the portal](search-create-service-portal.md) for instructions on how to get started.

## Create an index

1. Start Fiddler. On the **File** menu, turn off **Capture Traffic** to hide extraneous HTTP activity that is unrelated to the current task.

3. On the **Composer** tab, you'll formulate a request that looks like the following screen shot.

  	![][1]

2. Select **PUT**.

3. Enter a URL that specifies the service URL, request attributes, and the api-version. A few pointers to keep in mind:
   + Use HTTPS as the prefix.
   + Request attribute is "/indexes/hotels". This tells Search to create an index named 'hotels'.
   + Api-version is lowercase, specified as "?api-version=2015-02-28". API versions are important because Azure Search deploys updates regularly. On rare occasions, a service update may introduce a breaking change to the API. For this reason, Azure Search requires an api-version on each request so that you are in full control over which one is used.

    The full URL should look similar to the following example.

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
		      {"name": "hotelName", "type": "Edm.String"},
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

## Load documents

On the **Composer** tab, your request to post documents will look like the following. The body of the request contains the search data for 4 hotels.

   ![][2]

1. Select **POST**.

2.	Enter a URL that starts with HTTPS, followed by your service URL, followed by "/indexes/<'indexname'>/docs/index?api-version=2015-02-28". The full URL should look similar to the following example.

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

## Query the index

Now that an index and documents are loaded, you can issue queries against them.  On the **Composer** tab, a **GET** command that queries your service will look similar to the following screen shot.

   ![][3]

1.	Select **GET**.

2.	Enter a URL that starts with HTTPS, followed by your service URL, followed by "/indexes/<'indexname'>/docs?", followed by query parameters. By way of example, use the following URL, replacing the sample host name with one that is valid for your service.
	
	        https://my-app.search.windows.net/indexes/hotels/docs?search=motel&facet=category&facet=rating,values:1|2|3|4|5&api-version=2015-02-28

    This query searches on the term “motel” and retrieves facet categories for ratings.

3.	Request Header should be the same as before. Remember that you replaced the host and api-key with values that are valid for your service.

	        User-Agent: Fiddler
	        host: my-app.search.windows.net
	        content-type: application/json
	        api-key: 1111222233334444

The response code should be 200, and the response output should look similar to the following screen shot.

   ![][4]

The following example query is from the [Search Index operation (Azure Search API)](http://msdn.microsoft.com/library/dn798927.aspx) on MSDN. Many of the example queries in this topic include spaces, which are not allowed in Fiddler. Replace each space with a + character before pasting in the query string before attempting the query in Fiddler.

**Before spaces are replaced:**

        GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2015-02-28

**After spaces are replaced with +:**

        GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate+desc&api-version=2015-02-28

## Query the system

You can also query the system to get document counts and storage consumption. On the **Composer** tab, your request will look similar to the following, and the response will return a count for the number of documents and space used.

 ![][5]

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

6.	Click the **Inspectors** tab, click the **Headers** tab, and then select the JSON format. You should see the document count and storage size (in KB).

## Next steps

See [Manage your Search service on Azure](search-manage.md) for a no-code approach to managing and using Azure Search.


<!--Image References-->
[1]: ./media/search-fiddler/AzureSearch_Fiddler1_PutIndex.png
[2]: ./media/search-fiddler/AzureSearch_Fiddler2_PostDocs.png
[3]: ./media/search-fiddler/AzureSearch_Fiddler3_Query.png
[4]: ./media/search-fiddler/AzureSearch_Fiddler4_QueryResults.png
[5]: ./media/search-fiddler/AzureSearch_Fiddler5_QueryStats.png
