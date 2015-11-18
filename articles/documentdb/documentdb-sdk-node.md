<properties 
	pageTitle="DocumentDB Node.js SDK | Microsoft Azure" 
	description="Learn all about the Node.js SDK including release dates, retirement dates, and changes made between each version of the DocumentDB Node.js SDK." 
	services="documentdb" 
	documentationCenter="nodejs" 
	authors="ryancrawcour" 
	manager="jhubbard" 
	editor="cgronlun"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="11/16/2015" 
	ms.author="ryancraw"/>

# DocumentDB SDK

> [AZURE.SELECTOR]
- [.NET SDK](documentdb-sdk-dotnet.md)
- [Node.js SDK](documentdb-sdk-node.md)
- [Java SDK](documentdb-sdk-java.md)
- [Python SDK](documentdb-sdk-python.md)

##DocumentDB Node.js SDK

<table>
<tr><td>**Download**</td><td>[NPM](https://www.npmjs.com/package/documentdb)</td></tr>
<tr><td>**Contribute**</td><td>[GitHub](https://github.com/Azure/azure-documentdb-node/tree/master/source)</td></tr>
<tr><td>**Documentation**</td><td>[Node.js SDK Reference Documentation](http://azure.github.io/azure-documentdb-node/)</td></tr>
<tr><td>**Samples**</td><td>[Node.js Code Samples](https://github.com/Azure/azure-documentdb-node/tree/master/samples)</td></tr>
<tr><td>**Get Started**</td><td>[Get started with the Node.js SDK](https://azure.microsoft.com/en-us/documentation/articles/documentdb-nodejs-get-started/)</td></tr>
</table></br>

## Release Notes

### <a name="1.4.0"/>1.4.0</a>

- Implement Upsert. New upsertXXX methods on documentClient. 

### <a name="1.3.0"/>1.3.0</a>

- Skipped to bring version numbers in alignment with other SDKs

### <a name="1.2.2"/>1.2.2</a>

- Split Q promises wrapper to new repository
- Update to package file for npm registry

### <a name="1.2.1"/>1.2.1</a>

- Implements ID Based Routing
- Fixes Issue [#49](https://github.com/Azure/azure-documentdb-node/issues/49) - current property conflicts with method current()

### <a name="1.2.0"/>1.2.0</a>

- Added support for GeoSpatial index.
- Validates id property for all resources. Ids for resources cannot contain ?, /, #, \\, characters or end with a space. 
- Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"/>1.1.0</a>

- Implements V2 indexing policy

### <a name="1.0.3"/>1.0.3</a>

- Issue [#40] (https://github.com/Azure/azure-documentdb-node/issues/40) - Implemented eslint and grunt configurations in the core and promise SDK

### <a name="1.0.2"/>1.0.2</a>

- Issue [#45](https://github.com/Azure/azure-documentdb-node/issues/45) - Promises wrapper does not include header with error.

### <a name="1.0.1"/>1.0.1</a>

- Implemented ability to query for conflicts by adding readConflicts, readConflictAsync, queryConflicts;
- Updated API documentation
- Issue [#41](https://github.com/Azure/azure-documentdb-node/issues/41) - client.createDocumentAsync error  

### <a name="1.0.0"/>1.0.0</a>

- GA SDK

## Release & Retirement Dates
Microsoft will provide notification at least **12 months** in advance before retiring an SDK in order to smooth the transition to a newer/supported version.

We strongly recommend that you upgrade to the latest version as early as possible. 
It is recommended that you begin application upgrades now in order to avoid being impacted when the earlier service versions are removed.

| Version | Release Date | Retirement Date 
| ---	  | ---	         | ---
| [1.4.0](#1.4.0) | October 06 2015 |---
| [1.3.0](#1.3.0) | October 06 2015 |---
| [1.2.2](#1.2.2) | September 10 2015 |---
| [1.2.1](#1.2.1) | August 15 2015 |---
| [1.2.0](#1.2.0) | August 05 2015 |---
| [1.1.0](#1.1.0) | July 09 2015 |---
| [1.0.3](#1.0.3) | June 04 2015 |---
| [1.0.2](#1.0.2) | May 23 2015 |---
| [1.0.1](#1.0.1) | May 15 2015 |---
| [1.0.0](#1.0.0) | April 08 2015 |---
| 0.9.4-prelease | April 06 2015 | ---
| 0.9.3-prelease | January 14 2015 | ---
| 0.9.2-prelease | December 18 2014 | ---
| 0.9.1-prelease | August 22 2014 | ---
| 0.9.0-prelease | August 21 2014 | ---


## FAQ
[AZURE.INCLUDE [documentdb-sdk-faq](../../includes/documentdb-sdk-faq.md)]

## See Also

To learn more about DocumentDB, see [Microsoft Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) service page. 
