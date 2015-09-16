<properties 
	pageTitle=".NET Samples for DocumentDB | Microsoft Azure" 
	description="Find .NET Samples for common tasks in DocumentDB, including CRUD operations for database accounts, databases, and collections." 
	services="documentdb" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/16/2015" 
	ms.author="mimig"/>


# .NET samples

Samples for common operations on DocumentDB resources are included in the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) GitHub repository.

## Prerequisites

1. [An Azure DocumentDB account](https://azure.microsoft.com/en-us/documentation/articles/documentdb-create-account/)
2. [Microsoft.Azure.DocumentDB NuGet package](http://www.nuget.org/packages/Microsoft.Azure.DocumentDB/) 

## Database samples

Samples for the following database tasks are included in the [azure-documentdb-net/samples/code-samples/DatabaseManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DatabaseManagement/Program.cs) file.

- Create a database
- Retrieve a database
- List databases for an account
- Retrieve the DocumentDB endpointUrl, primary and secondary authorization keys
- Delete a database

## Collection samples 

Samples for the following collection tasks are included in the [azure-documentdb-net/samples/code-samples/ CollectionManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/CollectionManagement/Program.cs) file.

- Create a collection
- Create a collection with a custom index policy
- Retrieve the performance tier of the collection
- Update the performance tier of a collection
- Delete a collection


