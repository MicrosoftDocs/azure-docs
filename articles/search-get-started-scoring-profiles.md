<properties 
	pageTitle="How to use scoring profiles in Azure Search" 
	description="Get started with scoring profiles in Azure Search" 
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
	ms.date="04/27/2015" 
	ms.author="heidist"/>

# How to use scoring profiles in Azure Search

Scoring profiles are a feature of Microsoft Azure Search that customize the calculation of search scores, influencing how items are ranked in a search results list. You can think of scoring profiles as a way to model relevance, by boosting items that meet predefined criteria. For example, suppose your application is an online hotel reservation site. By boosting the `location` field, searches that include a term like Seattle will result in higher scores for items that have Seattle in the `location` field. Note that you can have more than one scoring profile, or none at all, if the default scoring is sufficient for your application.

To help you experiment with scoring profiles, you can download a sample application that uses scoring profiles to change the rank order of search results. The sample is a console application – perhaps not very realistic for real-world application development – but useful nonetheless as  a learning tool. 

The sample application demonstrates scoring behaviors using fictional data, called the `musicstoreindex`. The simplicity of the sample app makes it easy to modify scoring profiles and queries, and then see the immediate effects on rank order when the program is executed.

<a id="sub-1"></a>
## Prerequisites

The sample application is written in C# using Visual Studio 2013. Try the free [Visual Studio 2013 Express edition](http://www.visualstudio.com/products/visual-studio-express-vs.aspx) if you don't already have a copy of Visual Studio.

You will need an Azure subscription and an Azure Search service to complete the tutorial. See [Create a Search service in the portal](search-create-service-portal.md) for help with setting up the service.

[AZURE.INCLUDE [You need an Azure account to complete this tutorial:](../includes/free-trial-note.md)]

<a id="sub-2"></a>
## Download the sample application

Go to [Azure Search Scoring Profiles Demo](https://azuresearchscoringprofiles.codeplex.com/) on codeplex to download the sample application described in this tutorial.

On the Source Code tab, click **Download** to get a zip file of the solution. 

 ![][12]

<a id="sub-3"></a>
## Edit app.config

1. After you extract the files, open the solution in Visual Studio to edit the configuration file.
1. In Solution Explorer, double-click **app.config**. This file specifies the service endpoint and an `api-key` used to authenticate the request. You can obtain these values from the management portal.
1. Sign in to the [Azure Portal](https://portal.azure.com).
1. Go to the service dashboard for Azure Search.
1. Click the **Properties** tile to copy the service URL
1. Click the **Keys** tile to copy the `api-key`.

When you are finished adding the URL and `api-key` to app.config, application settings should look like this:

   ![][11]


<a id="sub-4"></a>
## Explore the application

You're almost ready to build and run the app, but before you do, take a look at the JSON files used to create and populate the index.

**Schema.json** defines the index, including the scoring profiles that are emphasized in this demo. Notice that the schema defines all of the fields used in the index, including non-searchable fields, such as `margin`, that you can use in a scoring profile. Scoring profile syntax is documented in [Add a scoring profile to an Azure Search index](http://msdn.microsoft.com/library/azure/dn798928.aspx).

**Data1-3.json** provides the data, 246 albums across a handful of genres. The data is a combination of actual album and artist information, with fictional fields like `price` and `margin` used to illustrate search operations. The data files conform to the index and are uploaded to your Azure Search service. After the data is uploaded and indexed, you can issue queries against it.

**Program.cs** performs the following operations:

- Opens a console window.

- Connects to Azure Search using the service URL and `api-key`.

- Deletes the `musicstoreindex` if it exists.

- Creates a new `musicstoreindex` using the schema.json file.

- Populates the index using the data files.

- Queries the index using four queries. Notice that the scoring profiles are specified as a query parameter. All of the queries search for the same term, 'best'. The first query demonstrates default scoring. The remaining three queries use a scoring profile.

<a id="sub-5"></a>
## Build and run the application

To rule out connectivity or assembly reference problems, build and run the application to ensure there are no issues to work out first. You should see a console application open in the background. All four queries execute in sequence without pausing. On many systems, the entire program executes in under 15 seconds. If the console application includes a message stating “Complete. Press enter to continue”, the program completed successfully. 

To compare query runs, you can mark-copy-paste the query results from the console and paste them into an Excel file. 

The following illustration shows results from the first three queries side-by-side. All of the queries use the same search term, 'best', which appears in numerous album titles.

   ![][10]

The first query uses default scoring. Since the search term appears only in album titles, and no other criteria is specified, items having 'best' in the album title are returned in the order in which the search service finds them. 

The second query uses a scoring profile, but notice that the profile had no effect. The results are identical to those of the first query. This is because the scoring profile boosts a field ('genre') that is not germane to the query. The search term 'best' does not exist in any 'genre' field of any document. When a scoring profile has no effect, the results are the same as default scoring.  

The third query is the first evidence of scoring profile impact. The search term is still 'best' so we are working with the same set of albums, but because the scoring profile provides additional criteria that boosts 'rating' and 'last-updated', some items are propelled higher in the list.

The next illustration shows the fourth and final query, boosted by 'margin'. The 'margin' field is non-searchable and cannot be returned in search results. The 'margin' value was manually added to the spreadsheet to help illustrate the point that items with higher margins show up higher in the search results list. 

   ![][9]

Now that you have experimented with scoring profiles, try changing the program to use different query syntax, scoring profiles, or richer data. Links in the next section provide more information.

<a id="next-steps"></a>
## Next steps

Learn more about scoring profiles. See [Add a scoring profile to an Azure Search index](http://msdn.microsoft.com/library/azure/dn798928.aspx) for details.

Learn more about search syntax and query parameters. See [Search Documents (Azure Search REST API)](http://msdn.microsoft.com/library/azure/dn798927.aspx) for details.

Need to step back and learn more about index creation? [Watch this video](http://channel9.msdn.com/Shows/Cloud+Cover/Cloud-Cover-152-Azure-Search-with-Liam-Cavanagh) to understand the basics.

<!--Anchors-->
[Prerequisites]: #sub-1
[Download the sample application]: #sub-2
[Edit app.config]: #sub-3
[Explore the application]: #sub-4
[Build and run the application]: #sub-5
[Next steps]: #next-steps

<!--Image references-->
[12]: ./media/search-get-started-scoring-profiles/AzureSearch_CodeplexDownload.PNG
[11]: ./media/search-get-started-scoring-profiles/AzureSearch_Scoring_AppConfig.PNG
[10]: ./media/search-get-started-scoring-profiles/AzureSearch_XLSX1.PNG
[9]: ./media/search-get-started-scoring-profiles/AzureSearch_XLSX2.PNG