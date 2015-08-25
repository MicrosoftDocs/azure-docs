<properties
	pageTitle="Get started with Azure Search in NodeJS | Microsoft Azure"
	description="Walk through building a custom Azure Search application using NodeJS as your programming language."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor="v-lincan"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="hero-article"
	ms.tgt_pltfrm="na"
	ms.date="08/18/2015"
	ms.author="heidist"/>

# Get started with Azure Search in NodeJS

Learn how to build a custom NodeJS search application that uses Azure Search for its search experience. This tutorial uses the [Azure Search Service REST API](https://msdn.microsoft.com/library/dn798935.aspx) to construct the objects and operations used in this exercise.

We used [NodeJS](https://nodejs.org) and NPM, [Sublime Text 3](http://www.sublimetext.com/3), and Windows PowerShell on Windows 8.1 to develop and test this code.

To run this sample, you need an Azure Search service, which you can sign up for in the [Azure portal](https://portal.azure.com).

> [AZURE.TIP] Download the source code for this tutorial at [AzureSearchNodeJSIndexerDemo](http://go.microsoft.com/fwlink/p/?LinkId=530198).

## About the data

This sample application uses data from the [United States Geological Services (USGS)](http://geonames.usgs.gov/domestic/download_data.htm), filtered on the state of Rhode Island to reduce the dataset size. We'll use this data to build a search application that returns landmark buildings such as hospitals and schools, as well as geological features like streams, lakes, and summits.

In this application, the **DataIndexer** program builds and loads the index using an [Indexer](https://msdn.microsoft.com/library/azure/dn798918.aspx) construct, retrieving the filtered USGS dataset from a public Azure SQL Database. Credentials and connection  information to the online data source is provided in the program code. No further configuration is necessary.

> [AZURE.NOTE] We applied a filter on this dataset to stay under the 10,000 document limit of the free pricing tier. If you use the standard tier, this limit does not apply. For details about capacity for each pricing tier, see [Limits and constraints](https://msdn.microsoft.com/library/azure/dn798934.aspx).

## Create the service

1. Sign in to [Azure portal](https://portal.azure.com).

2. In the Jumpbar, click **New** > **Data + Storage** > **Search**.

     ![][1]

3. Configure the service name, pricing tier, resource group, subscription and location. These settings are required and cannot be changed once the service is provisioned.

     ![][2]

	- **Service name** must be unique, lower-case, under 15 characters, with no spaces. This name becomes part of the endpoint of your Azure Search service. See [Naming Rules](https://msdn.microsoft.com/library/azure/dn857353.aspx) for more information about naming conventions.

	- **Pricing Tier** determines capacity and billing. Both tiers provide the same features, but at different resource levels.

		- **Free**  runs on clusters that are shared with other subscribers. It offers enough capacity to try out tutorials and write proof-of-concept code, but is not intended for production applications. Deploying a free service typically only takes a few minutes.
		- **Standard** runs on dedicated resources and is highly scalable. Initially, a standard service is provisioned with one replica and one partition, but you can adjust capacity once the service is created. Deploying a standard service takes longer, usually about fifteen minutes.

	- **Resource Groups** are containers for services and resources used for a common purpose. For example, if you're building a custom search application based on Azure Search, Azure Websites, Azure BLOB storage, you could create a resource group that keeps these services together in the portal management pages.

	- **Subscription** allows you to choose among multiple subscriptions, if you have more than one subscription.

	- **Location** is the data center region. Currently, all resources must run in the same data center. Distributing resources across multiple data centers is not supported.

4. Click **Create** to provision the service.

Watch for notifications in the Jumpbar. A notice appears when the service is ready to use.

<a id="sub-2"></a>
## Find the service name and api-key of your Azure Search service

After you create the service, return to the portal to get the URL or `api-key`. Connections to your Search service require that you have both the URL and an `api-key` to authenticate the call.

1. In the Jumpbar, click **Home** and then click the Search service to open the service dashboard.

2. On the service dashboard, you'll see tiles for essential information, as well as the key icon for accessing the admin keys.

  	![][3]

3. Copy the service URL, an admin key, and a query key. You'll need all three later, when you add them to the config.js file.

## Download the sample files

Use either one of the following approaches to download the sample.

1. Go to [AzureSearchNodeJSIndexerDemo](http://go.microsoft.com/fwlink/p/?LinkId=530198).
2. Click **Download ZIP**, save the .zip file, and then extract all the files it contains.

All subsequent file modifications and run statements will be made against files in this folder.

Alternatively, if you have GIT in your path statement, you can open a PowerShell window and type `git clone https://github.com/EvanBoyle/AzureSearchNodeJSIndexerDemo.git`

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
2. Type `npm install -g http-server`.

## Build the index and run the application

1. Type `npm run indexDocuments`.
2. Type `npm run build`.
3. Type `npm run start_server`.
4. Direct your browser at `http://localhost:8080/index.html`

## Search on USGS data

The USGS data set includes records that are relevant to the state of Rhode Island. If you click **Search** on an empty search box, you will get the top 50 entries, which is the default.

Entering a search term will give the search engine something to go on. Try entering a regional name. "Roger Williams" was the first governor of Rhode Island. Numerous parks, buildings, and schools are named after him.

![][9]

You could also try any of these terms:

- Pawtucket
- Pembroke
- goose +cape


## Next steps

This is the first Azure Search tutorial based on NodeJS and the USGS dataset. Over time, we'll extend this tutorial to demonstrate additional search features you might want to use in your custom solutions.

If you already have some background in Azure Search, you can use this sample as a springboard for trying suggesters (type-ahead or autocomplete queries), filters, and faceted navigation. You can also improve upon the search results page by adding counts and batching documents so that users can page through the results.

New to Azure Search? We recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](http://azure.microsoft.com/documentation/services/search/) to find more resources. You can also view the links in our [Video and Tutorial list](https://msdn.microsoft.com/library/azure/dn798933.aspx) to access more information.

<!--Image references-->
[1]: ./media/search-get-started-nodejs/create-search-portal-1.PNG
[2]: ./media/search-get-started-nodejs/create-search-portal-2.PNG
[3]: ./media/search-get-started-nodejs/create-search-portal-3.PNG
[5]: ./media/search-get-started-nodejs/AzSearch-NodeJS-configjs.png
[9]: ./media/search-get-started-nodejs/rogerwilliamsschool.png
