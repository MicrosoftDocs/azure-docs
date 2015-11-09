<properties 
	pageTitle="DocumentDB .NET SDK | Microsoft Azure" 
	description="Learn all about the .NET SDK including release dates, retirement dates, and changes made between each version of the DocumentDB .NET SDK." 
	services="documentdb" 
	documentationCenter=".net" 
	authors="ryancrawcour" 
	manager="jhubbard" 
	editor="cgronlun"/>


<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="11/06/2015" 
	ms.author="ryancraw"/>

# DocumentDB .NET SDK

> [AZURE.SELECTOR]
- [.NET](documentdb-sdk-dotnet.md)
- [Node.js](documentdb-sdk-node.md)
- [JavaScript Client](documentdb-sdk-js.md)
- [Java](documentdb-sdk-java.md)
- [Python](documentdb-sdk-python.md)

Download and install the [NuGet](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/) package for the latest version of the DocumentDB Client Library for .NET. This approach is recommended for ensuring that you have the most up-to-date client libraries.

For reference documentation, refer to [.NET SDK Reference Documentation](https://msdn.microsoft.com/library/azure/dn948556.aspx)

To get started with this SDK in code, refer to [Get started with the DocumentDB .NET SDK](https://azure.microsoft.com/en-us/documentation/articles/documentdb-get-started/)

## Release & Retirement Dates
Microsoft will provide notification at least 12 months in advance before retiring an SDK in order to smooth the transition to a newer/supported version.

All versions of the Azure DocumentDB SDK for .NET prior to version **1.0.0** will be retired on **January 15, 2016**, as announced in this [Microsoft Azure DocumentDB Blog post](). Any application attempting to connect to DocumentDB using a retired SDK will be blocked. 

New features and functionality will only be available in the latest version of the SDK.

**This includes the following versions:** 

•	0.9.x (released prior to GA)

We strongly recommend that you upgrade to the latest version as early as possible. 
It is recommended that you begin application upgrades now in order to avoid being impacted when the earlier service versions are removed.


| Version                                                                      | Release Date                | Retirement Date |
| ---------------------------------------------------------------------------- | --------------------------- | --------------- |
| [1.5.0]()                  												   | Monday, October 05 2015     |                 |
| [1.4.1]()                  												   | Tuesday, August 25 2015     |                 |
| [1.4.0]()                  												   | Thursday, August 13 2015    |                 |
| [1.3.0]()                  												   | Wednesday, August 05 2015   |                 |
| [1.2.0]()                  												   | Monday, July 06 2015        |                 |
| [1.1.0]()                  												   | Thursday, April 30 2015     |                 |
| [0.9.3-prelease]()           												   | Wednesday, April 08 2015    | Friday, January 15 2015 |
| [0.9.2-prelease]()                  										   | Wednesday, January 14 2015  | Friday, January 15 2015 |
| [0.9.1-prelease]()                  										   | Monday, October 13 2014     | Friday, January 15 2015 |
| [0.9.0-prelease]()                  										   | Thursday, August 21 2014    | Friday, January 15 2015 |

## Release Notes

### [1.5.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.5.0)
 - Implemented Upsert, Added UpsertXXXAsync methods
 - Performance improvements for all requests
 - LINQ Provider support for conditional, coalesce and CompareTo methods for strings
 - **[Fixed]** LINQ provider --> Contains method on a List. (now generates the same SQL as on IEnumerable and Array)
 - **[Obsolete]** UriFactory.CreateCollection --> should now use UriFactory.CreateDocumentCollection
 
### [1.4.1](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.4.1)
 - Fixing localization issues when using non en culture info such as nl-NL etc. 
 
### [1.4.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.4.0)
  - ID Based Routing
    - New UriFactory helper to assist with constructing ID based resource links
    - New overloads on DocumentClient to take in URI
  - Added IsValid() and IsValidDetailed() in LINQ for geospatial
  - LINQ Provider support enhanced
    - **Math** - Abs, Acos, Asin, Atan, Ceiling, Cos, Exp, Floor, Log, Log10, Pow, Round, Sign, Sin, Sqrt, Tan, Truncate
    - **String** - Concat, Contains, EndsWith, IndexOf, Count, ToLower, TrimStart, Replace, Reverse, TrimEnd, StartsWith, SubString, ToUpper
    - **Array** - Concat, Contains, Count
    - **IN** operator

### [1.3.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.3.0)
  - Added support for modifying indexing policies
    - New ReplaceDocumentCollectionAsync method in DocumentClient
    - New IndexTransformationProgress property in ResourceResponse<T> for tracking percent progress of index policy changes
    - DocumentCollection.IndexingPolicy is now mutable
  - Added support for spatial indexing and query
    - New Microsoft.Azure.Documents.Spatial namespace for serializing/deserializing spatial types like Point and Polygon
    - New SpatialIndex class for indexing GeoJSON data stored in DocumentDB
  - Fixed : Incorrect SQL query generated from linq expression [#38](https://github.com/Azure/azure-documentdb-net/issues/38)

### [1.2.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.2.0)
- Dependency on Newtonsoft.Json v5.0.7 
- Changes to support Order By
  - LINQ provider support for OrderBy() or OrderByDescending()
  - IndexingPolicy to support Order By 
  
		**NB: Possible breaking change** 
  
    	If you have existing code that provisions collections with a custom indexing policy, then your existing code will need to be updated to support the new IndexingPolicy class. If you have no custom indexing policy, then this change does not affect you.

### [1.1.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.1.0)
- Support for partitioning data by using the new HashPartitionResolver and RangePartitionResolver classes and the IPartitionResolver
- DataContract serialization
- Guid support in LINQ provider
- UDF support in LINQ

#### [1.0.0](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/1.0.0)
- GA SDK

## FAQ

**1. How will customers be notified of the retiring SDK?**

Microsoft will provide 12 month advance notification to the end of support of the retiring SDK in order to facilitate a smooth transition to a supported SDK. Further, customers will be notified through various communication channels – Azure Management Portal, Developer Center, blog post, and direct communication to assigned service administrators.

**2. Can customers author applications using a "to-be" retired DocumentDB SDK during the 12 month period?** 

Yes, customers will have full access to author, deploy and modify applications using the "to-be" retired DocumentDB SDK during the 12 month grace period. During the 12 month grace period, customers are advised to migrate to a newer supported version of DocumentDB SDK as appropriate.

**3. Can customers author and modify applications using a retired DocumentDB SDK after the 12 month notification period?**

After the 12 month notification period, the SDK will be retired. Any access to DocumentDB by an applications using a retired SDK will not be permitted by the DocumentDB platform. Further, Microsoft will not provide customer support on the retired SDK.

**4. What happens to Customer’s running applications that are using unsupported DocumentDB SDK version?**

Any attempts made to connect to the DocumentDB service with a retired SDK version will be rejected. 

**5. Will new features and functionality be applied to all non-retired SDKs**

New features and functionality will only be added to new versions. If you are using an old, non-retired, version of the SDK your requests to DocumentDB will still function as previous but you will not have access to any new capabilities.  

## See Also

To learn more about DocumentDB, see [Microsoft Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) service page. 
