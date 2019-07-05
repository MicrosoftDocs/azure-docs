---
title: 'Node.js Quickstart: Create, load, and query indexes using Azure Search REST APIs - Azure Search'
description: Explains how to create an index, load data, and run queries using Node.js and the Azure Search REST APIs.
author: jj09
manager: jlembicz
services: search
ms.service: search
ms.topic: conceptual
ms.date: 04/26/2017
ms.author: jjed
ms.custom: seodec2018
---
# Quickstart: Create an Azure Search index in Node.js
> [!div class="op_single_selector"]
> * [Portal](search-get-started-portal.md)
> * [.NET](search-howto-dotnet-sdk.md)
> 
> 

Learn how to build a custom Node.js search application that uses Azure Search for its search experience. This tutorial uses the [Azure Search Service REST API](https://msdn.microsoft.com/library/dn798935.aspx) to construct the objects and operations used in this exercise.

We used [Node.js](https://Nodejs.org) and NPM, [Sublime Text 3](https://www.sublimetext.com/3), and Windows PowerShell on Windows 8.1 to develop and test this code.

To run this sample, you must have an Azure Search service, which you can sign up for in the [Azure portal](https://portal.azure.com). See [Create an Azure Search service in the portal](search-create-service-portal.md) for step-by-step instructions.

## About the data
This sample application uses data from the [United States Geological Services (USGS)](https://geonames.usgs.gov/domestic/download_data.htm), filtered on the state of Rhode Island to reduce the dataset size. We'll use this data to build a search application that returns landmark buildings such as hospitals and schools, as well as geological features like streams, lakes, and summits.

In this application, the **DataIndexer** program builds and loads the index using an [Indexer](https://msdn.microsoft.com/library/azure/dn798918.aspx) construct, retrieving the filtered USGS dataset from an Azure SQL Database. Credentials and connection information to the online data source is provided in the program code. No further configuration is necessary.

> [!NOTE]
> We applied a filter on this dataset to stay under the 10,000 document limit of the free pricing tier. If you use the standard tier, this limit does not apply. For details about capacity for each pricing tier, see [Search service limits](search-limits-quotas-capacity.md).
> 
> 

<a id="sub-2"></a>

## Find the service name and api-key of your Azure Search service
After you create the service, return to the portal to get the URL or `api-key`. Connections to your Search service require that you have both the URL and an `api-key` to authenticate the call.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the jump bar, click **Search service** to list all Azure Search services provisioned for your subscription.
3. Select the service you want to use.
4. On the service dashboard, you should see tiles for essential information, such as the key icon for accessing the admin keys.
5. Copy the service URL, an admin key, and a query key. You need all three later when you add them to the config.js file.

## Download the sample files
Use either one of the following approaches to download the sample.

1. Go to [search-node-indexer-demo](https://github.com/Azure-Samples/search-node-indexer-demo).
2. Click **Download ZIP**, save the .zip file, and then extract all the files it contains.

All subsequent file modifications and run statements are made against files in this folder.

## Update the config.js. with your Search service URL and api-key
Using the URL and api-key that you copied earlier, specify the URL, admin-key, and query-key in configuration file.

Admin keys grant full control over service operations, including creating or deleting an index and loading documents. In contrast, query keys are for read-only operations, typically used by client applications that connect to Azure Search.

In this sample, we include the query key to help reinforce the best practice of using the query key in client applications.

The following screenshot shows **config.js** open in a text editor, with the relevant entries demarcated so that you can see where to update the file with the values that are valid for your search service.

![][5]

## Host a runtime environment for the sample
The sample requires an HTTP server, which you can install globally using npm.

Use a PowerShell window for the following commands.

1. Navigate to the folder that contains the **package.json** file.
2. Type `npm install`.
3. Type `npm install -g http-server`.

## Build the index and run the application
1. Type `npm run indexDocuments`.
2. Type `npm run build`.
3. Type `npm run start_server`.
4. Direct your browser at `http://localhost:8080/index.html`

## Search on USGS data
The USGS data set includes records that are relevant to the state of Rhode Island. If you click **Search** on an empty search box, you get the top 50 entries, which is the default.

Entering a search term gives the search engine something to go on. Try entering a regional name. "Roger Williams" was the first governor of Rhode Island. Numerous parks, buildings, and schools are named after him.

![][9]

You could also try any of these terms:

* Pawtucket
* Pembroke
* goose +cape

## Next steps
This is the first Azure Search tutorial based on Node.js and the USGS dataset. Over time, we'll extend this tutorial to demonstrate additional search features you might want to use in your custom solutions.

If you already have some background in Azure Search, you can use this sample as a springboard for trying suggesters (type-ahead or autocomplete queries), filters, and faceted navigation. You can also improve upon the search results page by adding counts and batching documents so that users can page through the results.

New to Azure Search? We recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](https://azure.microsoft.com/documentation/services/search/) to find more resources. 

<!--Image references-->
[1]: ./media/search-get-started-Nodejs/create-search-portal-1.PNG
[2]: ./media/search-get-started-Nodejs/create-search-portal-2.PNG
[3]: ./media/search-get-started-Nodejs/create-search-portal-3.PNG
[5]: ./media/search-get-started-Nodejs/AzSearch-Nodejs-configjs.png
[9]: ./media/search-get-started-Nodejs/rogerwilliamsschool.png
