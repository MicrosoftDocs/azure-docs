<properties
	pageTitle="Import data to Azure Search using the portal | Microsoft Azure | Hosted cloud search service"
	description="How to upload data to an index in Azure Search using the portal"
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="Azure portal"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/09/2015"
	ms.author="heidist"/>

# Import data to Azure Search using the portal
> [AZURE.SELECTOR]
- [Overview](search-what-is-data-import.md)
- [Portal](search-import-data-portal.md)
- [.NET](search-import-data-dotnet.md)
- [REST API](search-import-data-rest-api.md)
- [Indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)

Azure Portal includes an **Import Data** command on the Azure Search dashboard that helps you import data into an index in Azure Search. The command uses the built-in indexers feature that crawls an existing data source, creating and uploading documents based on the rowset found in the data source.

To use an indexer or the **Import Data** command, your data has to reside in a supported data source. Supported data sources include Azure SQL Database, SQL Server relational databases on an Azure VM, or Azure DocumentDB.

You can only import from a single table, view, or equivalent data structure. You might need to create this data structure in your application data source to provide the right values to Azure Search.

