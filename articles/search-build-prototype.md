<properties 
	pageTitle="Build a prototype application for Azure Search" 
	description="Create your first application prototype to get started with Azure Search." 
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

# Build a prototype application for Azure Search

Integrating a new software component into your solution stack is a serious decision that almost always begins with a prototype that establishes the value of a particular technology's contribution.
In this article, we give you a few building blocks to speed up the prototyping process.

- A visual studio C# project that include data.json and schema.json files. Having sample data lets you immediately build and run the solution, confirming the solution works on your system before you write one line of code.

- Advice on how to structure the data you'll upload to Azure Search. You need one dataset, which can be uploaded in one or more data.json files, to populate a search index. The data must be JSON data, but it does not have to be a local file in your solution. We provided local data files to keep the prototype simple.

- Instructions for pulling it all together, building and running the application so that at the end, you have an operational Azure Search index that you can access from your application code.

- Lastly, we'll point you to a few additional features that will take your prototype to the next level, incorporating search-specific features like faceted navigation, scoring profiles for tuning results, type-ahead or auto-complete queries, and search page-related functionality that isn't available in strictly full-text search alternative.

In the end, you will have a prototype application, using your data, to demonstrate a robust search experience using Azure Search. 

## Prepare the data

Search operations are performed against a search index that you create on Azure Search. An index has multiple parts, including scoring profiles and suggesters, but the bulk of an index consists of data fields used in search operations. 

You can think of this index as a flat data file. If your organizational data is in a relational database, you will need to identify or create a single view or table that can be used to load data into your index, where each field in your dataset maps to an equivalent field in the index.

To create a dataset that can be uploaded using the code in this prototype sample, you will need to put it into JSON format.

> [AZURE.NOTE] You can load multiple data files, perhaps to upload data in batches, but the structure of the data has to be the same for every data file you upload. 

## Test the prototype solution on your system

1. [Create an Azure Search service in the Azure portal](search-create-service-portal.md).

	> [AZURE.NOTE] You can add a shared (free) version of the service to any existing Azure subscription. The shared service is often used for prototypes. Keep in mind that the shared service provides 50 MB of data or 10,000 documents total, whichever comes first. Additionally, data and documents can be spread across a maximum of 3 indexes. 
	> 
	> Running the prototype sample application, with the built-in sample data files, will create in one index named "musicstoreindex", containing 246 documents, at 278 KB on your Azure Search service. Later in this walkthrough, you'll replace this index with a new one using Adventure Works data that will consume up to ## documents and ## MB.

2. [Download the prototype builder solution]( http://go.microsoft.com/fwlink/p/?LinkId=536479). This is a Visual Studio 2013 solution in C# that builds a console application used to create, load, and query an index. If you don't have Visual Studio, you can get the free [Visual Studio 2013 Express edition](http://www.visualstudio.com/products/visual-studio-express-vs.aspx) version.

3. Edit app.config to add configuration settings that target your Search service and api-key. 

	> [AZURE.NOTE] You can get the URL and the admin api-key from [service dashboard in the portal](search-create-service-portal.md). For the URL, type the full path of the service name, including the https prefix and the `search.windows.net` domain.

4. Build the solution to ensure there are no build errors. You might need to update packages to resolve build errors. Right-click **Manage NuGet packages** on the solution to update the packages.

5. Run the solution using the built-in schema and data files. This step is optional, but it confirms the solution works before you invest any time into adding your own data. The console outputs the following messages:

	- Index deleted (occurs only if an index of the name "musicstoreindex" exists)
	- Index created (a new index named "musicstoreindex" is created in your service)
	- Documents posted (one message for each JSON file)
	- Waiting 5 seconds (allows indexing to complete before issuing the first query)
	- Search Results for search term 'best' with no boosting (runs a simple query proving the data is loaded in the index)

6. Stop the application and delete the index to make room for yours. 

    > [AZURE.TIP] You can use [the portal](https://portal.azure.com) to delete the index. Click the index name to open the index blade and use the **Delete** command.

## Replace the schema and data JSON files with your data

In the prototype solution, there is one schema file and three data files: data1.json, data2.json, and data3.json. The schema file should be replaced with a schema that describes your data. 

Similarly, if you can get your data into JSON files, you can overwrite the existing files with your data, and then run the application to create and load an index. Distributing data across multiple files helps demonstrate a batch upload operation. 

### Edit the query

The default query built into the solution references fields and structures from the built-in data files. Once you have overwritten the data files to use your data, you can either comment out the query code or modify it to use fields from your schema. For more information on search query syntax, see [Search Documents](https://msdn.microsoft.com/library/azure/dn798927.aspx).

### Build and run the application

Press **F5** to run the app. As before, you should see messages indicating the index is created, loaded, and queryable.

You now have an operational index which you can use as the basis for further investigation.

At this point, you might want to switch to [Fiddler](search-fiddler.md) or [Chrome Postman](search-chrome-postman.md) to run queries, modify any of the sample applications to use your Search service and index, or add custom code that provides data visualization.

## Add a scoring profile

We suggest that you experiment with [scoring profiles](search-get-started-scoring-profiles.md) either through the portal or through code. Scoring profiles boost the importance of a search term being found in a specific field. For example, if the search term is a city name, you would expect documents having *Seattle* in the City field to appear higher in the results than documents having the *Seattle* in a Description field.

Adding a scoring profile changes the index; you will need to rebuild and reload the index whenever you modify the schema. For this reason, consider adding scoring profile code segments to your prototype (or modify scoring profile samples to use your indexing code).

See [Add a scoring profile](https://msdn.microsoft.com/library/dn798928.aspx) for the reference documentation on scoring profiles.

## Add a suggesters

Suggesters refers to the popular search feature that projects a list of possible search terms based on text inputs from the user (typing "wea" prompts a list of autocomplete search terms for "weather", "weather channel", "weather underground", and so forth).

To add suggesters, add a section to the index schema that specifies which fields are used to build autocomplete or typeahead queries. Fields containing names or shorter strings having non-repetitive values tend to work the best. See [Create Index](https://msdn.microsoft.com/library/dn798928.aspx) for more information.

## Try a language analyzer

Language analyzers provide the linguistic rules for distinguishing between essential and non-essential words, root forms, and even synonyms. By default, Azure Search uses the Lucene language analyzer for English. You can specify different analyzers as an index attribute on specific fields, which allows you to build schemas and documents that include fields using different analyzers (for example, a multilingual application might combine French and English fields side by side in the same document). See [Language Support](https://msdn.microsoft.com/library/dn879793.aspx) for more details.

## Next steps

In the previous sections, you modified the index to add more functionality to your prototype. At this point, your index changes are mostly complete (we didn't cover enabling CORS, which is the only remaining schema change you could make).

Further prototyping will now potentially lead you in two different directions: an outward focus on the UI, perhaps adding faceted navigation or other filters that help narrow the search, or further exploration on the data synchronization aspects of your solution. Many solutions have volatile data. For many developers, synchronizing data updates between transactional database systems and an Azure Search index is the next priority once basic search behaviors are verified.

Visit these links to learn more:

- [Typical workflows for development projects using Azure Search](search-workflow.md)

- [Azure Search Indexer Customization](search-indexers-customization.md)

- [Faceted navigation in Azure Search](search-faceted-navigation.md) 

- [Paging search results in Azure Search](search-pagination-page-layout.md)
