<properties 
	pageTitle="Create a geospatial search app using Azure Search" 
	description="Create a geospatial search app using Bing and Azure Search" 
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
	ms.date="04/16/2015" 
	ms.author="heidist"/>

# Create a geospatial search app using Azure Search

This tutorial demonstrates how to add geospatial search to web applications using Azure Search and Bing Maps. Using geo-search, you can find search targets within a certain distance of a point (such as finding all restaurants within 5 KM of my current location). The geo-spatial capability in Azure Search supports commonly used mapping techniques. For example, if you want to use polygon shapes in a real estate app showing houses for sale within a polygon boundary, you can easily do that using either OData or our simple search syntax.

For more overview, watch this Channel 9 video about [Azure Search and Geospatial Data](http://channel9.msdn.com/Shows/Data-Exposed/Azure-Search-and-Geospatial-Data).

![][7]

To create the application, we'll leverage the Bing mapping service to geocode addresses loaded from a CSV file, and then store the resulting data in a Search index. 

This tutorial builds on the [Azure Search – Adventure Works Demo](http://azuresearchadventureworksdemo.codeplex.com). If you haven’t walked through that demo yet, start there to get some experience in creating an index and calling the Azure Search API from a web app.  

<a id="sub-1"></a>
## Prerequisites

+	Visual Studio 2012 or higher with ASP.NET MVC 4 and SQL Server installed. You can download the free Express editions if you don't already have the software installed: [Visual Studio 2013 Express](http://www.visualstudio.com/products/visual-studio-express-vs.aspx) and [Microsoft SQL Server 2014 Express](http://msdn.microsoft.com/evalcenter/dn434042.aspx).
+	An Azure Search service. You'll need the Search service name, plus the admin key. See [Get started with Azure Search](search-get-started.md) for details.
+	A Bing map service and a key to access it. Instructions are provided in the next section
+	[Azure Search GeoSearch Sample on CodePlex](https://azuresearchgeospatial.codeplex.com/). On the Source tab, click **Download** to get a zip file of the solution. 

    ![][12]

This solution contains two projects:

+	**StoreIndexer** creates an Azure Search index and loads data.
+	**AdventureWorksWebGeo** is an MVC4-based application that queries the Azure Search index and shows store locations on a Bing map.

[AZURE.INCLUDE [You need an Azure account to complete this tutorial:](../includes/free-trial-note.md)]

<a id="sub-2"></a>
## Bing Maps

We are going to use the Bing Maps API for two things.

+ **Geocoding Addresses:** In the data, we have addresses (city, state, zip), but we also want the longitude and latitude coordinates of an address so that we can do geospatial searches. To get the cooridnates, we'll use the Bing Maps DataFlow API to send up a batch of addresses for geocoding. Using the Bing Trial account, we are limited to 50 addresses at one time, but that will be sufficient for this tutorial.

+ **Bing Maps:** When the app runs, we’ll use Bing Maps to display store locations, overlayed on top of a Bing Map.

### Create an account for Bing Maps

1. Go to the [Bing Maps Portal](https://www.bingmapsportal.com/) and create a new account. Enter the details to create the account.

2. After the account is created, choose **Create or view keys** and enter the details to create a key.  For this demo, you can choose **Trial Key**.

3. Click **Submit**. you should see the key details for your Bing maps application. Make a note of this key, as we will be using it later.

<a id="sub-3"></a>
## Geocoding Addresses in C# using Bing Maps DataFlow API

In this step, we use the Bing Maps DataFlow API to geocode some addresses for various bike stores around the world. 

This data comes from a CSV file called store_locations.csv located in the source you downloaded earlier. If you open up this file in a text editor or Excel, you’ll see that it has an ID column for each store, the name of the store, and its address.

Let's walk through the code that explains how this works.

1. Open the AdventureWorksGeo solution in Visual Studio, expand the project **StoreIndexer** in the Solution Explorer and open Program.cs. Since we already covered index creation in the [Azure Search – Adventure Works Demo](http://azuresearchadventureworksdemo.codeplex.com/), we'll skip the discussion on how that works in Program.cs.

2. Go to the **Main** function and notice that it calls **ApplyStoreData**.  Move to this function and walk through the code.  

3. **ApplyStoreData** loads data from a CSV file called "store_locations.csv" into a System.Data.DataTable.  

    This file contains all of the stores, including their addresses we want to load into Azure Search.  By iterating through each row in this file, we can create a set of **indexOperations** that are then inserted into an Azure Search index (previously created in the **CreateStoresIndex()** function).  

    If you look carefully at the index afterwards, you will notice that the **GeoPt** field that will contain the longitude and latitude of each store is empty. This leads us to the next step of the **Main** function.

5. Move to the function **ExtractAddressInfoToXML()**. This function extracts the address information from the store_locations.csv file and loads it into an XML file that is formatted in a way that Bing Maps can accept for geocoding. Once the file is created, it is then sent for processing to Bing Maps DataFlow by calling the function **GeoCoding.CreateJob**.

6. Since the process of geocoding can take some time, there is a loop that calls **GeoCoding.CheckStatus** every 10 seconds to see if the job is complete. Once complete, the results are downloaded by calling **GeoCoding.DownloadResults** into an addresses class.

7. The final step is to take these geocoded addresses and send them up to Azure Search. Let's take a closer look at how this is done by opening the **UpdateStoreData** function.

  **UpdateStoreData** uses the action **@search.action: merge** to update the location field of type Edm.GeographyPoint with the geocoded longitude and latitude coordinates that were just downloaded from Bing Maps. It does this by looking up the storeId which is the unique key for the document in the "stores" index and merging this new data into the existing document.

8. Before running the application, add your Azure Search and Bing Maps API information by opening App.config and update the values for "SearchServiceName", "SearchServiceApiKey" and "BingMapsAPI" to those of your Azure Search service and Bing Maps API. For Search service name, if your service is "mysearch.search.windows.net", you would enter "mysearch".

9. Right-click on the **StoreIndexer** project and choose **Debug** | **Start New Instance** to run it.

<a id="sub-4"></a>
## Add Mapping to an MVC4 Application using Azure Search and Bing Maps

In this step, you'll build and run the search application in a web browser that will load search for stores and then plot them on top of a Bing Map.

1.	In Visual Studio, open up the Azure Search Demo Solution named AdventureWorksGeo.sln. 
	
2.	Right-click **AdventureWorksWebGeo** in the Solution Explorer and select **Set as startup project**.
	
3.	Open Web.config in this project and update the values for "SearchServiceName", "SearchServiceApiKey" and "BingMapsAPI" to those of your Azure Search service and Bing Maps API. For Search service name, if your service is "mysearch.search.windows.net", you would enter "mysearch".

4.	Save Web.config.
	
5.	Press **F5** to launch the project. Follow these [Troubleshooting](#err-mvc) steps if you get a build error.

Notice how the stores are overlayed as points on the map. Click on one of the stores and you will see a pop-up that outlines the details of the store. All of this information is coming from an Azure Search index called "stores" that was created in the previous steps. 

<a id="sub-5"></a>
## Explore AdventureWorksWebGeo

The project **AdventureWorksWebGeo** shows us how ASP.NET MVC 4 can be used to interact with Azure Search to build a mapping application that leverages geosearch. In this section, we'll review individual parts of the application code to see what they do.

1.	In Solution Explorer, expand **AdventureWorksWebGeo** | **Controller** and open HomeController.cs. The **Index()** function is called when the application starts and the Index page loads. In this function the Bing Maps API is loaded from the Web.config and passed to the Index view as ViewBag.BingAPI.

2.	Open Index.cshtml from **Views** | **Home**.

3.	This file follows the typical way that you would add Bing Maps to a web application, however a few things to point out are:

+	The ViewBag from the controller is used to load the credentials for the map using: credentials: '@ViewBag.BingAPI' 

+	Once the map is loaded a JQuery $.post is made to the HomeController **Search** function by referring to: /home/search

+	The **Search** function retrieves the store locations which are then received and added as PushPins to the Bing Map. 

4.	Open HomeController.cs under **Controllers** and look at the **Search** function. Notice how it makes a call to _storeSearch.Search(lat, lon, 10000). This will cause a query to be executed to find all stores within 10,000 KM of the specified latitude (lat) and longitude (lon). The results of this query are processed and then sent back to the Index view to be processed as PushPins overlayed on the Bing Map.

This concludes the demo. You have now walked through all of the main operations that you'll need to know before building out a Map based ASP.NET MVC4 application using Azure Search.


<a id="err-mvc"></a>
## How to resolve "Could not load file or assembly 'System.Web.Mvc"

When building AdventureWorksWeb, if you get "Could not load file or assembly 'System.Web.Mvc, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' or one of its dependencies", try these steps to resolve the error.

1. Open the Package Manager Console: **Tools** | **NuGet Package Manager** | **Package Manager Console**
2. At the PM> prompt, enter "Update-package -reinstall Microsoft.AspNet.Mvc"
3. When asked to reload the file, choose **Yes to All**.
4. Rebuild the solution and try **F5** again.

<a id="next-steps"></a>
## Next steps

For additional self-study, consider adding more capabilities to the mapping application. For example, you might want to add:

+ Search box, to allow users to search for specific stores.

+ Facets to allow users to filter by country or province.  

+ User-drawn selection areas that let users specify regions to be searched by draing an area on the map. The area is then filtered by Azure Search using the geo-intersect API and plotted on the map.


<!--Anchors-->
[Prerequisites]: #sub-1
[Bing Maps]: #sub-2
[Geocode Addresses in C# using Bing Maps DataFlow API]: #sub-3
[Add Mapping to an MVC4 Application using Azure Search and Bing Maps]: #sub-4
[Explore AdventureWorksWebGeo]: #sub-5
[Next steps]: #next-steps


<!--Image references-->
[7]: ./media/search-create-geospatial/AzureSearch-geo1-App.PNG
[12]: ./media/search-create-geospatial/AzureSearch_Create2_CodeplexDownload.PNG