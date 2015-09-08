<properties
	pageTitle="Use Chrome Postman with Azure Search | Microsoft Azure"
	description="Use Chrome Postman with Azure Search. Install and configure Postman. Create an Azure Search index. Post documents to and query the index with Postman."
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
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="08/25/2015"
	ms.author="heidist"/>

# How to use Chrome Postman with Azure Search #

[Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm "Chrome Postman") is a tool provided as part of Google Chrome that allows developers to work efficiently with REST-based API services such as Azure Search. You can use Postman to quickly create and query your search indexes by sending API calls through Postman, without having to write any code. This approach is an efficient way to learn the API and try out new features.

![][1]

## Requirements ##

You must have an Azure Search service. As with any custom application that uses Azure Search, you will need the URL to your service, plus an admin `api-key` so that you can create the index. For instructions on how to get the values for your search service, see [Create a service in the portal](search-create-service-portal.md).

## To install Postman ##
To download Postman, visit the [Google Chrome Store](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm). The link from this page allows you to download and install the REST client for Postman. After it is installed, you can launch Postman from the Chrome App Launcher.

![][2]

## To configure Postman to query Azure Search ##
To configure Postman, follow these steps:

1. Enter your Azure Search service URL where it says "Enter request URL here".  
2. Append to the URL: `?api-version=2015-02-28`. You could also specify a different API version. See [Azure Search service versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) for details.
3. Ensure that `GET` is chosen.
4. Click the **Headers** button.
5. Enter values for:
	- `api-key`:  [Admin Key]
	- `Content-Type`: `application/json; charset=utf-8`
6. Click **Send** to issue the REST call to Azure Search and display the JSON response.

![][3]

## To create an Azure Search index with Postman ##

Next, we will expand on what we completed in the last step by issuing a REST call to create a new Azure Search index. Unlike the previous call, the index creation requires an HTTP PUT and a JSON document with the definition of the index schema. For this sample, we are going to create an index that will store a list of hiking trails. To do this:

1. Change the URL to: `https://[SEARCH SERVICE].search.windows.net/indexes/trails?api-version=2015-02-28` using your search service name.
2. Change the request type from `GET` to `PUT`.
3. In the RAW body content, enter the following JSON:

	    {
	    "name": "trails",
	    "fields": [
	    {"name": "id", "type": "Edm.String", "key": true, "searchable": false},
	    {"name": "name", "type": "Edm.String"},
	    {"name": "county", "type": "Edm.String"},
	    {"name": "elevation", "type": "Edm.Int32"},
	    {"name": "location", "type": "Edm.GeographyPoint"} ]
	    }

4. Click **Send**.

![][4]

## To post documents to an Azure Search index with Postman ##
Now that the index is created, we can load documents into it. To do this, we'll post a group of documents in a batch, using data for five trails from the United States Geological Survey (USGS) dataset:

1. Change the URL to: `https://[SEARCH SERVICE].windows.net/indexes/trails/docs/index?api-version=2015-02-28` using your search service name. Notice that the URL includes a path to the index you just created.
2. Change the HTTP type to `POST`.
3. In the RAW body content, enter the following JSON:

	    {
	      "value": [
		    {"@search.action": "upload", "id": "233358", "name": "Pacific Crest National Scenic Trail", "county": "San Diego", "elevation":1294, "location": { "type": "Point", "coordinates": [-120.802102,49.00021] }},
		    {"@search.action": "upload", "id": "801970", "name": "Lewis and Clark National Historic Trail", "county": "Richland", "elevation":584, "location": { "type": "Point", "coordinates": [-104.8546903,48.1264084] }},
		    {"@search.action": "upload", "id": "1144102", "name": "Intake Trail", "county": "Umatilla", "elevation":1076, "location": { "type": "Point", "coordinates": [-118.0468873,45.9981939] }},
		    {"@search.action": "upload", "id": "1509897", "name": "Burke Gilman Trail", "county": "King", "elevation":10, "location": { "type": "Point", "coordinates": [-122.2754036,47.7059315] }},
		    {"@search.action": "upload", "id": "1517508", "name": "Cavanaugh-Oso Truck Trail", "county": "Skagit", "elevation":339, "location": { "type": "Point", "coordinates": [-121.9470829,48.2981608] }}
	      ]
	    }

4. Click **Send**.

![][5]

## To query the index with Postman ##
The final step is to query the index and issue a simple full-text search request for the word *trail*.

1. Enter the following in the URL: `https://[SEARCH SERVICE].search.windows.net/indexes/trails/docs?api-version=2015-02-28&search=trail` using your search service name. Notice that the URL includes the `search` query parameter and a search term of *trail*.
2. Change the HTTP request type to `GET`.
3. Click **Send**.

In the response, you should see the JSON search results returned from Azure Search.

![][6]

## Next steps ##
Now that we have walked through all the basics of using Azure Search with Postman, there are few things to help you with the next steps:

1. Postman supports `Collections`, which are a convenient way to save commonly issued requests. You can share collections with other people, to be issued in their own copy of Postman.
2. In the Azure Search documentation, make sure to make note of the HTTP request type (`GET`, `PUT`, and so forth) associated with each call and change as appropriate in Postman.

Documentation for the REST API can be found on [MSDN](https://msdn.microsoft.com/library/azure/dn798935.aspx).

You can also visit the [Video and tutorial list](search-video-demo-tutorial-list.md) for more examples.

<!-- Image References -->
[1]: ./media/search-chrome-postman/full_postman_client.png
[2]: ./media/search-chrome-postman/postman.png
[3]: ./media/search-chrome-postman/configure.png
[4]: ./media/search-chrome-postman/create_index.png
[5]: ./media/search-chrome-postman/upload_documents.png
[6]: ./media/search-chrome-postman/query.png
