<properties 
	pageTitle="DocumentDB .NET SDK | Microsoft Azure" 
	description="Learn all about the .NET SDK including release dates, retirement dates, and changes made between each version of the DocumentDB .NET SDK." 
	services="documentdb" 
	documentationCenter=".net" 
	authors="aliuy" 
	manager="jhubbard" 
	editor="cgronlun"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="07/22/2016" 
	ms.author="rnagpal"/>

# DocumentDB SDK

> [AZURE.SELECTOR]
- [.NET SDK](documentdb-sdk-dotnet.md)
- [Node.js SDK](documentdb-sdk-node.md)
- [Java SDK](documentdb-sdk-java.md)
- [Python SDK](documentdb-sdk-python.md)

## DocumentDB .NET SDK

<table>
<tr><td>**Download**</td><td>[NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/)</td></tr>
<tr><td>**Documentation**</td><td>[.NET SDK Reference Documentation](https://msdn.microsoft.com/library/azure/dn948556.aspx)</td></tr>
<tr><td>**Samples**</td><td>[.NET Code Samples](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/code-samples)</td></tr>
<tr><td>**Get Started**</td><td>[Get started with the DocumentDB .NET SDK](documentdb-get-started.md)</td></tr>
<tr><td>**Current Supported Framework**</td><td>[Microsoft .NET Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653)</td></tr>
</table></br>

## Release Notes

### <a name="1.9.1"/>[1.9.1](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.9.1)
> [AZURE.IMPORTANT] A backwards compatibility issue has been found with this release. DocumentDB .NET SDK version 1.9.2 will be released shortly to address this issue. 
  - Added support for SELECT VALUE for parallel queries, cross-partition TOP queries, and cross-partition ORDER BY queries.
  - Improved the performance of cross-partition TOP and ORDER BY queries.
  - Updated an error message to clarify that if you receive an unhandled System.NotSupportedException when running queries against    partitioned collections, uncheck the "Prefer 32-bit" option in your project properties window, on the Build tab, to avoid the error.
  - Fixed the missing references to DocumentDB.Spatial.Sql.dll and Microsoft.Azure.Documents.ServiceInterop.dll that are required when referencing a DocumentDB project with a reference to the DocumentDB Nuget package.
  - Fixed the ability to use parameters of different types when using user defined functions in LINQ. 


### <a name="1.9.0"/>[1.9.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.9.0)
> [AZURE.IMPORTANT] A backwards compatibility issue has been found with this release. DocumentDB .NET SDK version 1.9.2 will be released shortly to address this issue.
  - Changed the default connection mode for the .NET client to ConnectionMode.Direct to improve performance by using Direct connectivity with TCP. Deprecated the ConnectionPolicy.ConnectionProtocol property and added a DirectHttps value to the ConnectionMode enumeration.
  - Fixed a bug for globally replicated accounts where Upsert calls were being directed to read locations instead of write locations.
  - Added methods to the IDocumentClient interface that were missing which include: UpsertAttachmentAsync method that takes mediaStream and options as parameters, CreateAttachmentAsync method that takes options as a parameter, and CreateOfferQuery method that takes querySpec as a parameter.
  - Unsealed public classes that are exposed in the IDocumentClient interface.
  - Added support for parallel queries for partitioned collections.
  - Added cross partition Order By support for partitioned collections.
  

### <a name="1.8.0"/>[1.8.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.8.0)
  - Added the support for multi-region database accounts.
  - Added support for retry on throttled requests.  User can customize the number of retries and the max wait time by configuring the ConnectionPolicy.RetryOptions property.
  - Added a new IDocumentClient interface that defines the signatures of all DocumenClient properties and methods.  As part of this change, also changed extension methods that create IQueryable and IOrderedQueryable to methods on the DocumentClient class itself.
  - Added configuration option to set the ServicePoint.ConnectionLimit for a given DocumentDB endpoint Uri.  Use ConnectionPolicy.MaxConnectionLimit to change the default value, which is set to 50.
  - Deprecated IPartitionResolver and its implementation.  Support for IPartitionResolver is now obsolete. It's recommended that you use Partitioned Collections for higher storage and throughput.


### <a name="1.7.1"/>[1.7.1](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.7.1)
  - Added an overload to Uri based ExecuteStoredProcedureAsync method that takes RequestOptions as a parameter.
  
### <a name="1.7.0"/>[1.7.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.7.0)
  - Added time to live (TTL) support for documents.

### <a name="1.6.3"/>[1.6.3](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.6.3)
  - Fixed a bug in Nuget packaging of .NET SDK for packaging it as part of a Azure Cloud Service solution.
  
### <a name="1.6.2"/>[1.6.2](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.6.2)
  - Implemented [partitioned collections](documentdb-partition-data.md) and [user-defined performance levels](documentdb-performance-levels.md). 

### <a name="1.5.3"/>[1.5.3](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.5.3)
  - **[Fixed]** Querying DocumentDB endpoint throws: 'System.Net.Http.HttpRequestException: Error while copying content to a stream.

### <a name="1.5.2"/>[1.5.2](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.5.2)
  - Expanded LINQ support including new operators for paging, conditional expressions and range comparison.
    - Take operator to enable SELECT TOP behavior in LINQ
    - CompareTo operator to enable string range comparisons
    - Conditional (?) and coalesce operators (??)
  - **[Fixed]** ArgumentOutOfRangeException when combining Model projection with Where-In in linq query.  [#81](https://github.com/Azure/azure-documentdb-dotnet/issues/81)

### <a name="1.5.1"/>[1.5.1](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.5.1)
 - **[Fixed]** If Select is not the last expression the LINQ Provider assumed no projection and produced SELECT * incorrectly.  [#58](https://github.com/Azure/azure-documentdb-dotnet/issues/58)

### <a name="1.5.0"/>[1.5.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.5.0)
 - Implemented Upsert, Added UpsertXXXAsync methods
 - Performance improvements for all requests
 - LINQ Provider support for conditional, coalesce and CompareTo methods for strings
 - **[Fixed]** LINQ provider --> Implement Contains method on List to generate the same SQL as on IEnumerable and Array
 - **[Fixed]** BackoffRetryUtility uses the same HttpRequestMessage again instead of creating a new one on retry
 - **[Obsolete]** UriFactory.CreateCollection --> should now use UriFactory.CreateDocumentCollection
 
### <a name="1.4.1"/>[1.4.1](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.4.1)
 - **[Fixed]** Localization issues when using non en culture info such as nl-NL etc. 
 
### <a name="1.4.0"/>[1.4.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.4.0)
  - ID Based Routing
    - New UriFactory helper to assist with constructing ID based resource links
    - New overloads on DocumentClient to take in URI
  - Added IsValid() and IsValidDetailed() in LINQ for geospatial
  - LINQ Provider support enhanced
    - **Math** - Abs, Acos, Asin, Atan, Ceiling, Cos, Exp, Floor, Log, Log10, Pow, Round, Sign, Sin, Sqrt, Tan, Truncate
    - **String** - Concat, Contains, EndsWith, IndexOf, Count, ToLower, TrimStart, Replace, Reverse, TrimEnd, StartsWith, SubString, ToUpper
    - **Array** - Concat, Contains, Count
    - **IN** operator

### <a name="1.3.0"/>[1.3.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.3.0)
  - Added support for modifying indexing policies
    - New ReplaceDocumentCollectionAsync method in DocumentClient
    - New IndexTransformationProgress property in ResourceResponse<T> for tracking percent progress of index policy changes
    - DocumentCollection.IndexingPolicy is now mutable
  - Added support for spatial indexing and query
    - New Microsoft.Azure.Documents.Spatial namespace for serializing/deserializing spatial types like Point and Polygon
    - New SpatialIndex class for indexing GeoJSON data stored in DocumentDB
  - **[Fixed]** : Incorrect SQL query generated from linq expression [#38](https://github.com/Azure/azure-documentdb-net/issues/38)

### <a name="1.2.0"/>[1.2.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.2.0)
- Dependency on Newtonsoft.Json v5.0.7 
- Changes to support Order By
  - LINQ provider support for OrderBy() or OrderByDescending()
  - IndexingPolicy to support Order By 
  
		**NB: Possible breaking change** 
  
    	If you have existing code that provisions collections with a custom indexing policy, then your existing code will need to be updated to support the new IndexingPolicy class. If you have no custom indexing policy, then this change does not affect you.

### <a name="1.1.0"/>[1.1.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.1.0)
- Support for partitioning data by using the new HashPartitionResolver and RangePartitionResolver classes and the IPartitionResolver
- DataContract serialization
- Guid support in LINQ provider
- UDF support in LINQ

### <a name="1.0.0"/>[1.0.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.0.0)
- GA SDK

> [AZURE.NOTE]
There was a change of NuGet package name between preview and GA. We moved from **Microsoft.Azure.Documents.Client** to **Microsoft.Azure.DocumentDB**
<br/>


### <a name="0.9.x-preview"/>[0.9.x-preview](https://www.nuget.org/packages/Microsoft.Azure.Documents.Client)
- Preview SDKs [Obsolete]

## Release & Retirement Dates
Microsoft will provide notification at least **12 months** in advance of retiring an SDK in order to smooth the transition to a newer/supported version.

New features and functionality and optimizations are only added to the current SDK, as such it is  recommend that you always upgrade to the latest SDK version as early as possible. 

Any request to DocumentDB using a retired SDK will be rejected by the service.

> [AZURE.WARNING]
All versions of the Azure DocumentDB SDK for .NET prior to version **1.0.0** will be retired on **February 29, 2016**. 
 
<br/>
 
| Version | Release Date | Retirement Date 
| ---	  | ---	         | ---
| [1.9.1](#1.9.1) | July 20, 2016 |---
| [1.9.0](#1.9.0) | July 9, 2016 |---
| [1.8.0](#1.8.0) | June 14, 2016 |---
| [1.7.1](#1.7.1) | May 06, 2016 |---
| [1.7.0](#1.7.0) | April 26, 2016 |---
| [1.6.3](#1.6.3) | April 08, 2016 |---
| [1.6.2](#1.6.2) | March 29, 2016 |---
| [1.5.3](#1.5.3) | February 19, 2016 |---
| [1.5.2](#1.5.2) | December 14, 2015 |---
| [1.5.1](#1.5.1) | November 23, 2015 |---
| [1.5.0](#1.5.0) | October 05, 2015 |---
| [1.4.1](#1.4.1) | August 25, 2015 |---
| [1.4.0](#1.4.0) | August 13, 2015 |---
| [1.3.0](#1.3.0) | August 05, 2015 |---
| [1.2.0](#1.2.0) | July 06, 2015 |---
| [1.1.0](#1.1.0) | April 30, 2015 |---
| [1.0.0](#1.0.0) | April 08, 2015 |---
| [0.9.3-prelease](#0.9.x-preview) | March 12, 2015 | February 29, 2016
| [0.9.2-prelease](#0.9.x-preview) | January , 2015 | February 29, 2016
| [.9.1-prelease](#0.9.x-preview) | October 13, 2014 | February 29, 2016
| [0.9.0-prelease](#0.9.x-preview) | August 21, 2014 | February 29, 2016

## FAQ
[AZURE.INCLUDE [documentdb-sdk-faq](../../includes/documentdb-sdk-faq.md)]

## See Also

To learn more about DocumentDB, see [Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) service page. 
