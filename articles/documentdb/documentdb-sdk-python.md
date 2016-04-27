<properties 
	pageTitle="DocumentDB Python SDK | Microsoft Azure" 
	description="Learn all about the Python SDK including release dates, retirement dates, and changes made between each version of the DocumentDB Python SDK." 
	services="documentdb" 
	documentationCenter="python" 
	authors="aliuy" 
	manager="jhubbard" 
	editor="cgronlun"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="04/18/2016" 
	ms.author="rnagpal"/>

# DocumentDB SDK

> [AZURE.SELECTOR]
- [.NET SDK](documentdb-sdk-dotnet.md)
- [Node.js SDK](documentdb-sdk-node.md)
- [Java SDK](documentdb-sdk-java.md)
- [Python SDK](documentdb-sdk-python.md)

##DocumentDB Python SDK

<table>
<tr><td>**Download**</td><td>[PyPI](https://pypi.python.org/pypi/pydocumentdb)</td></tr>
<tr><td>**Contribute**</td><td>[GitHub](https://github.com/Azure/azure-documentdb-python)</td></tr>
<tr><td>**Documentation**</td><td>[Python SDK Reference Documentation](http://azure.github.io/azure-documentdb-python/)</td></tr>
<tr><td>**Get Started**</td><td>[Get started with the Python SDK](documentdb-python-application.md)</td></tr>
<tr><td>**Current Supported Platform**</td><td>[Python 2.7](https://www.python.org/download/releases/2.7/)</td></tr>
</table></br>

## Release notes

### <a name="1.6.1"/>[1.6.1](https://pypi.python.org/pypi/pydocumentdb/1.6.1)
- Bug fixes related to server side partitioning to allow special characters in partitionkey path.

### <a name="1.6.0"/>[1.6.0](https://pypi.python.org/pypi/pydocumentdb/1.6.0)
- Implemented [partitioned collections](documentdb-partition-data.md) and [user-defined performance levels](documentdb-performance-levels.md). 

### <a name="1.5.0"/>[1.5.0](https://pypi.python.org/pypi/pydocumentdb/1.5.0)
- Add Hash & Range partition resolvers to assist with sharding applications across multiple partitions.

### <a name="1.4.2"/>[1.4.2](https://pypi.python.org/pypi/pydocumentdb/1.4.2)
- Implement Upsert. New UpsertXXX methods added to support Upsert feature.
- Implement ID Based Routing. No public API changes, all changes internal.

### <a name="1.2.0"/>[1.2.0](https://pypi.python.org/pypi/pydocumentdb/1.2.0)
- Supports GeoSpatial index.
- Validates id property for all resources. Ids for resources cannot contain ?, /, #, \, characters or end with a space.
- Adds new header "index transformation progress" to ResourceResponse.

### <a name="1.1.0"/>[1.1.0](https://pypi.python.org/pypi/pydocumentdb/1.1.0)
- Implements V2 indexing policy

### <a name="1.0.1"/>[1.0.1](https://pypi.python.org/pypi/pydocumentdb/1.0.1)
- Supports proxy connection

### <a name="1.0.0"/>[1.0.0](https://pypi.python.org/pypi/pydocumentdb/1.0.0)
- GA SDK

## Release & retirement dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is  recommend that you always upgrade to the latest SDK version as early as possible. 

Any request to DocumentDB using a retired SDK will be rejected by the service.

> [AZURE.WARNING]
All versions of the Azure DocumentDB SDK for Python prior to version **1.0.0** will be retired on **February 29, 2016**. 

<br/>

| Version | Release Date | Retirement Date 
| ---	  | ---	         | ---
| [1.6.1](#1.6.1) | April 08, 2016 |---
| [1.6.0](#1.6.0) | March 29, 2016 |---
| [1.5.0](#1.5.0) | January 03, 2016 |---
| [1.4.2](#1.4.2) | October 06, 2015 |---
| [1.4.1](#1.4.1) | October 06, 2015 |---
| [1.2.0](#1.2.0) | August 06, 2015 |---
| [1.1.0](#1.1.0) | July 09, 2015 |---
| [1.0.1](#1.0.1) | May 25, 2015 |---
| [1.0.0](#1.0.0) | April 07, 2015 |---
| 0.9.4-prelease | January 14, 2015 | February 29, 2016
| 0.9.3-prelease | December 09, 2014 | February 29, 2016
| 0.9.2-prelease | November 25, 2014 | February 29, 2016
| 0.9.1-prelease | September 23, 2014 | February 29, 2016
| 0.9.0-prelease | August 21, 2014 | February 29, 2016

## FAQ
[AZURE.INCLUDE [documentdb-sdk-faq](../../includes/documentdb-sdk-faq.md)]

## See also

To learn more about DocumentDB, see [Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) service page. 
