<properties 
	pageTitle="NoSQL Python examples for DocumentDB | Microsoft Azure" 
	description="Find NoSQL Python examples on github for common tasks in DocumentDB, including CRUD operations for JSON documents in NoSQL databases." 
	keywords="python examples"
	services="documentdb" 
	authors="aliuy" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter="python"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/18/2016" 
	ms.author="andrl"/>


# DocumentDB Python examples

> [AZURE.SELECTOR]
- [.NET Examples](documentdb-dotnet-samples.md)
- [Node.js Examples](documentdb-nodejs-samples.md)
- [Python Examples](documentdb-python-samples.md)
- [Azure Code Sample Gallery](https://azure.microsoft.com/documentation/samples/?service=documentdb)

Sample solutions that perform CRUD operations and other common operations on Azure DocumentDB resources are included in the [azure-documentdb-python](https://github.com/Azure/azure-documentdb-python/tree/master/samples) GitHub repository. This article provides:

- Links to the tasks in each of the Python example project files. 
- Links to the related API reference content.

**Prerequisites**

1. You need an Azure account to use these Python examples:
    - You can [open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
   - You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.
2. You also need the [Python SDK](documentdb-sdk-python.md). 

    > [AZURE.NOTE] Each sample is self-contained, it sets itself up and cleans up after itself. As such, the samples issue multiple calls to [document_client.CreateCollection](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html). Each time this is done your subscription will be billed for 1 hour of usage per the performance tier of the collection being created. 

## Database examples

The [Program.py](https://github.com/Azure/azure-documentdb-python/tree/master/samples/DatabaseManagement/Program.py) file of the [DatabaseManagement](https://github.com/Azure/azure-documentdb-python/tree/master/samples/DatabaseManagement) project shows how to perform the following tasks.

Task | API reference
--- | ---
[Create a database](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/DatabaseManagement/Program.py#L65-L76) | [document_client.CreateDatabase](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html)
[Query an account for a database](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/DatabaseManagement/Program.py#L49-L62) | [document_client.QueryDatabases](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html)
[Read a database by Id](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/DatabaseManagement/Program.py#L79-L96) | [document_client.ReadDatabase](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html)
[List databases for an account](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/DatabaseManagement/Program.py#L99-L110) | [document_client.ReadDatabases](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html)
[Delete a database](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/DatabaseManagement/Program.py#L113-L126) | [document_client.DeleteDatabase](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html)

## Collection examples 

The [Program.py](https://github.com/Azure/azure-documentdb-python/tree/master/samples/CollectionManagement/Program.py) file of the [CollectionManagement](https://github.com/Azure/azure-documentdb-python/tree/master/samples/CollectionManagement) project shows how to perform the following tasks.

Task | API reference
--- | ---
[Create a collection](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/CollectionManagement/Program.py#L84-L135) | [document_client.CreateCollection](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html#CreateCollection)
[Read a list of all collections in a database](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/CollectionManagement/Program.py#L198-L225) | [document_client.ListCollections](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html#CreateCollection)
[Get a collection by Id](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/CollectionManagement/Program.py#L178-L195) | [document_client.ReadCollection](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html#CreateCollection)
[Get performance tier of a collection](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/CollectionManagement/Program.py#L139-L161) | [DocumentQueryable.QueryOffers](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html#CreateCollection)
[Change performance tier of a collection](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/CollectionManagement/Program.py#L163-L175) | [document_client.ReplaceOffer](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html#CreateCollection)
[Delete a collection](https://github.com/Azure/azure-documentdb-python/blob/d78170214467e3ab71ace1a7400f5a7fa5a7b5b0/samples/CollectionManagement/Program.py#L212-L225) | [document_client.DeleteCollection](http://azure.github.io/azure-documentdb-python/api/pydocumentdb.document_client.html#CreateCollection)
