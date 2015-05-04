<properties 
	pageTitle="Create your first Azure Search application in .NET" 
	description="Tutorial on build a solution using the .NET client library from the Azure Search .NET SDK." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="03/05/2015" 
	ms.author="heidist"/>

#Create your first Azure Search application in .NET#

This tutorial builds a custom Web search application in Visual Studio 2013 or later that uses Azure Search for its search experience. The tutorial utilizes the [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx) to build classes for the objects and operations used in the sample.

You can download the sample from codeplex at [Azure Search Demo Using USGS Data](https://azsearchdemos.codeplex.com/SourceControl/latest) to follow the steps in this tutorial. The sample application uses data from the [United States Geological Services (USGS)](http://geonames.usgs.gov/domestic/download_data.htm), filtered on the state of Washington. We'll use this data to build a search application based on data about landmark buildings such as hospitals and schools, as well as geological features like streams, lakes, and summits.

To run this sample, you must have an Azure Search service, which you can sign up for in the [Azure portal](https://portal.azure.com). 

You can begin with [Create a service in the portal](../search-create-service-portal/) if you need help provisioning and verifying service availability. The article also explains how to find the service name and admin-keys used in every tutorial and solution that includes Azure Search.

> [AZURE.TIP] We recommend updating NuGet packages before building any projects to avoid build errors. Right-click the solution and choose **Manage NuGet Packages**. Update all of the packages used in this solution.

##Build the index##

1. Copy the service name and admin-key from the [Azure portal](https://portal.azure.com) and paste it into **DataIndexer** | **App.config**.
1. Right-click the **DataIndexer** project to set it as the start-up project.
1. Build and run the project.

You should see a console window with these messages.

![][1]

In the portal, you should see a new features index with xx and xx.  It can take the portal several minutes to catch up, so plan on refreshing the screen after a few minutes to see the results. 

![][2]

##Build the application##


1. Copy the service name and admin-key from the [Azure portal](https://portal.azure.com) and paste it into **SimpleSearchMVCApp** | **Web.config**.
1. Right-click the **SimpleSearchMVCApp** project to set it as the start-up project.
1. Build and run the project.

You should see a web page in your default browser, providing a search box for accessing USGS data stored in the index in your Azure Search service.

![][3]

##Search on USGS data##

The USGS data set includes records that are relevant to Washington state. If you click **Search** on an empty search box, you will get the top 50 entries, which is the default. 

Entering a search term will give the search engine something to go on. Try entering a regional name. "Snoqualmie" is city in Washington. It is also the name of a river, a scenic waterfall, mountain pass, and state parks.

![][4]

You could also try any of these terms:

- Seattle
- Rainier
- Seattle and Rainier
- Seattle +Rainier -Mount (gets results for landmarks on Rainier avenue, or the Rainier club, all within the city limits of Seattle).

##Explore the code##

To learn the basics of the .NET SDK, take a look at [How to use Azure Search in .NET](../search-howto-dotnet-sdk/) for an explanation of the most commonly used classes in the client library.

The remainder of this section covers a few points about each project. Where appropriate, we'll point you towards some alternative approaches that use more advanced features.

**DataIndexer Project**

To keep things simple, the data is embedded within the solution, in a text file generated from data on the [United States Geological Services (USGS) web site](http://geonames.usgs.gov/domestic/download_data.htm). 

Alternatives to embedding data include [indexers for DocumentDB](documentdb-search-indexer.md) or [indexers for Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md). Indexers pull data into your Azure Search index, which can really simplify the code you have to write and maintain. 

You can also load data from an on premises SQL Server database. [This tutorial](http://azure.microsoft.com/blog/2014/11/10/how-to-sync-sql-server-data-with-azure-search/) shows you how.

The **DataIndexer** program includes a **SearchDocuments** method for searching and filtering data. This method exists as a verification step, supporting the status messages output to the console window, namely those showing search results and filter behaviors. Most likely, you wouldn't need a method like this in code that you write for creating and loading an index. 

**SimpleSearchMVCApp Project**

The MVC project uses a view and controller to route inputs and outputs to the presentation layer. **Index.cshtml** provides the HTML used for rendering the search results. Currently, this is just a simple table that organizes the data from the dataset. While useful for prototyping and testing, you can easily improve upon the presentation. For tips on how to batch results and put counts on a page, see [Page results and pagination in Azure Search](search-pagination-page-layout.md).

Connections to Azure Search, plus execution of a query request, are defined in the **FeatureSearch.cs** file.

As a final note, if you are not yet convinced of the value and simplicity of the .NET SDK, compare the source files of this sample against this one based on the REST API: [Azure Search Adventure Works Demo](https://azuresearchadventureworksdemo.codeplex.com/). The .NET SDK version described in this tutorial is much simpler, with fewer lines of code.

##Next steps##

This is the first Azure Search tutorial based on the USGS dataset. Over time, we'll be extending this tutorial and creating new ones that demonstrate the search features you might want to use in your custom solutions.

If you already have some background in Azure Search, you can use this sample as a springboard for trying suggesters (type-ahead or autocomplete queries), filters, and faceted navigation. You can also improve upon the search results page by adding counts and batching documents so that users can page through the results.

New to Azure Search? We recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](http://azure.microsoft.com/documentation/services/search/) to find more resources. You can also view the links in our [Video and Tutorial list](https://msdn.microsoft.com/library/azure/dn798933.aspx) to access more information.

<!--Image references-->
[1]:./media/search-get-started-20150228/consolemessages.png
[2]:./media/search-get-started-20150228/portalindexstatus.png
[3]:./media/search-get-started-20150228/usgssearchbox.png
[4]:./media/search-get-started-20150228/snoqualmie.png