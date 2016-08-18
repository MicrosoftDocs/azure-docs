<properties 
	pageTitle="DocumentDB: How do I? | Microsoft Azure" 
	description="Get answers to frequently asked questions about DocumentDB development. Learn how to perform aggregate functions using stored procedures." 
	keywords="aggregate functions, count, aggregation"
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
	ms.date="08/18/2016" 
	ms.author="mimig"/>


# How do I? Development FAQ for DocumentDB

This article provides answers to commonly asked questions about developing with DocumentDB. There is a separate [FAQ article](documentdb-faq.md) for general questions about DocumentDB. 

Do you have a common question that should be shown here? If so, add a Disqus comment below with a link to the thread on [StackOverflow](http://stackoverflow.com/questions/tagged/azure-documentdb) or the [MSDN forum](http://go.microsoft.com/fwlink/?LinkId=631655).

## How do I get a count of documents or perform aggregate functions?

Although aggregate functions are not supported by the native DocumentDB SQL syntax, you can achieve the same results using different methods.  

On read:

- If you are using a non-partitioned collection, you can use the [x-ms-resource-usage header](https://msdn.microsoft.com/library/mt489071.aspx). This header currently only displays accurate results for non-partitioned collections and displays `x-ms-resource-usage: documentSize=0;documentsSize=0;collectionSize=0;` for partitioned collections.
- You can perform aggregates by pulling the collection client-side and doing a count locally, or by using a stored procedure (to minimize network latency on repeated round trips). For a sample stored procedure that calculates the count for a given filter query, see [Count.js](https://github.com/Azure/azure-documentdb-js-server/blob/master/samples/stored-procedures/Count.js).
- It’s advised to use a query projection (for example, SELECT VALUE 1 FROM c) rather than a simple “SELECT * FROM c” to maximize the number of documents processed in each page of results (there is a page size limit of ~1 mb). 

On write:

- Set up a trigger using the [UpdateaMetadata.js](https://github.com/Azure/azure-documentdb-js-server/blob/master/samples/triggers/UpdateMetadata.js) sample, which updates the minSize, maxSize, and totalSize of the metadata document for the collection. The sample can be extended to update a counter, sum, etc.
 
## Next steps
If you have a question that belongs here, please add a Disqus comment with a link to the thread on [StackOverflow](http://stackoverflow.com/questions/tagged/azure-documentdb) or the [MSDN forum](http://go.microsoft.com/fwlink/?LinkId=631655). 

If you have a detailed question and would like to get in touch with the DocumentDB engineering team, please send us an [e-mail](mailto:askdocdb@microsoft.com). Include your subscription information if your question is specific to your account.

If you have an issue that requires immediate assistance, please [file a support ticket]() in the [Azure portal](https://portal.azure.com) by clicking **Help + Support**, **New support request**.

