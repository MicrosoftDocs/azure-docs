<properties 
	pageTitle="Azure Search Indexer Customization" 
	description="Learn how to customize settings and policies of Azure Search indexers." 
	services="search" 
	documentationCenter="" 
	authors="chaosrealm" 
	manager="pablocas" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="04/25/2015" 
	ms.author="eugenesh"/>

#Azure Search Indexer Customization#

In this article, you will learn how to use Azure Search indexers to implement these scenarios: 

- Rename fields between a datasource and a target index 
- Transform strings from a database table into string collections
- Switch the change detection policy on a datasource 
- URL-encode document keys that contain URL-unsafe characters 
- Tolerate failures to index some documents 

If you’re not familiar with Azure Search indexers, you might want to take a look at the following articles first:

- [Connecting Azure SQL Database to Azure Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)
- [Connecting DocumentDB with Azure Search using indexers](documentdb-search-indexer.md)
- [.NET SDK with support for indexers](https://msdn.microsoft.com/library/dn951165.aspx) or 
- [Indexers REST API reference](https://msdn.microsoft.com/library/azure/dn946891.aspx)

##Rename fields between a datasource and a target index##

**Field mappings** are properties that reconcile differences between field definitions. The most common examples are found in field names that violate Azure Search naming rules. Consider a source table where one or more field names start with a leading underscore (such as `_id`). Azure Search doesn't allow field names to lead with an underscore, thus the field must be renamed. 

The following example illustrates updating an indexer to include a field mapping that "renames" `_id` field of the datasource into `id` field in the target index:

	PUT https://[service name].search.windows.net/indexers/myindexer?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]
    {
        "dataSourceName" : "mydatasource",
        "targetIndexName" : "myindex",
        "fieldMappings" : [ { "sourceFieldName" : "_id", "targetFieldName" : "id" } ] 
    } 

**NOTE:** You need to use a preview API version 2015-02-28-Preview to use field mappings. 

You can specify multiple field mappings: 

	"fieldMappings" : [ 
		{ "sourceFieldName" : "_id", "targetFieldName" : "id" },
        { "sourceFieldName" : "_timestamp", "targetFieldName" : "timestamp" },
	 ]

Both source and target field names are case-insensitive.

##Transform strings from a database table into string collections##

Field mappings can also be used to transform source field values using *mapping functions*.

One such function, `jsonArrayToStringCollection`, parses a field that contains a string formatted as JSON array into a Collection(Edm.String) field in the target index. It is intended for use with Azure SQL indexer in particular, since SQL doesn't have a native collection data type. It can be used as follows: 

	"fieldMappings" : [ { "sourceFieldName" : "tags", "mappingFunction" : { "name" : "jsonArrayToStringCollection" } } ] 

For example, if the source field contains the string `["red", "white", "blue"]`, then the target field of type `Collection(Edm.String)` will be populated with the three values `"red"`, `"white"` and `"blue"`.

Note that the `targetFieldName` property is optional; if left out, the `sourceFieldName` value is used.

##Switching the change detection policy on a datasource##
  
In Azure Search, the decision of which change detection policy to go with is largely determined by what is supported by your datasource and data schema. Over time, especially if you upgrade or migrate databases, you might want to switch a change detection policy to another type. For example, perhaps you have just updated your Azure SQL Database to a newer version that supports Integrated Change Tracking, so you want to switch from the high water mark policy to the integrated change tracking policy. Or perhaps you decided to use a different column as your high water mark.

If you simply call the PUT datasource REST API to update your datasource, you might get a 400 response back with an error message similar to the following:


	"Change detection policy cannot be changed for data source '…' because indexer '…' references this data source and has a non-empty change tracking state. You can use Reset API to reset the indexer's change tracking state, and retry this call."

 You’d probably wonder what this means and how to work around it. This error occurs because Azure Search maintains internal state associated with your change detection policy. When policy is changed, the existing state is invalidated since it doesn’t apply to the new policy. This means that the indexer has to start indexing your data source from scratch using the new policy, which has potential implications for you (e.g., additional load on the database, or additional networking bandwidth charges). That is why Azure Search asks you call the [Reset Indexer API]( https://msdn.microsoft.com/library/azure/dn946897.aspx) to reset the state associated with the current change detection policy, after which the policy can be changed with a regular PUT datasource call. Of course, Azure Search could do the reset for you automatically, but we felt it was important for you to explicitly acknowledge your understanding of the implications by calling the Reset API.

##URL-encode document keys that contain URL-unsafe characters##

Azure Search restricts characters inside a document key field to URL-safe characters, because users must be able to look up documents by their keys. So what happens when the documents you need to index contain such characters in the key field? If you’re indexing documents yourself using a client SDK or REST API, you can URL-encode the keys. With indexers, you can tell Azure Search to URL-encode your keys by setting **base64EncodeKeys** parameter to `true` when creating or updating the indexer:

    PUT https://[service name].search.windows.net/indexers/myindexer?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]
    {
        "dataSourceName" : "mydatasource",
        "targetIndexName" : "myindex",
        "parameters" : { "base64EncodeKeys": true }
    }

For details of encoding, see this [MSDN article](http://msdn.microsoft.com/library/system.web.httpserverutility.urltokenencode.aspx). 

NOTE: If you need to search or filter on key values, you’ll have to similarly encode the keys used in your requests, so that your request matches the encoded value stored in the search index.


##Tolerate failures to index some documents##

By default, an Azure Search indexer stops indexing as soon as even as single document fails to be indexed. Depending on your scenario, you can choose to tolerate some failures (for example, if you repeatedly re-index your entire datasource). Azure Search provides two indexer parameters to fine- tune this behavior: 

- **maxFailedItems**: The number of items that can fail indexing before an indexer execution is considered as failure. Default is 0.
- **maxFailedItemsPerBatch**: The number of items that can fail indexing in a single batch before an indexer execution is considered as failure. Default is 0.

You can change these values at any time by specifying one or both of these parameters when creating or updating your indexer:

	PUT https://[service name].search.windows.net/indexers/myindexer?api-version=[api-version]
	Content-Type: application/json
	api-key: [admin key]
    {
        "dataSourceName" : "mydatasource",
        "targetIndexName" : "myindex",
        "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 5 }
    }

Even if you choose to tolerate some failures, information about which documents failed is returned by the [Get Indexer Status API](https://msdn.microsoft.com/library/azure/dn946884.aspx).

That’s it for now. If you have any thoughts or suggestions for future content ideas, tweet us using #AzureSearch hashtag, or submit your ideas on our [UserVoice page](http://feedback.azure.com/forums/263029-azure-search).    
