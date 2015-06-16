<properties 
	pageTitle="Efficient List Queries" 
	description="Learn to reduce the number of items returned in a list as well as reduce the amount of information returned for each item" 
	services="batch" 
	documentationCenter="" 
	authors="davidmu1" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="multiple" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="vm-windows" 
	ms.workload="multiple"
	ms.date="05/09/2015" 
	ms.author="davidmu"/>

# Efficient List Queries

The following methods are examples of operations that virtually every application using Azure Batch has to perform and often has to perform frequently:

- [ListTasks](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.iworkitemmanager.listtasks.aspx)
- [ListJobs](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.iworkitemmanager.listjobs.aspx)
- [ListWorkitems](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.iworkitemmanager.listworkitems.aspx)
- [ListPools](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.ipoolmanager.listpools.aspx)
- [ListCertificates](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.icertificatemanager.listcertificates.aspx)

Monitoring is a common use case; determining the capacity and status of a pool will require that all pool VM’s to be queried, for example.  Another example would be to query the tasks for a job to determine if any tasks are still queued.  In some cases a rich set of data is required, but in other cases only a count of the total number of items or items in a certain state is required.

It is important to realize that the number of items that can be returned can be very large and the size of data required to represent the list of items can also be very large.  Simply querying for lots of items that results in large responses can lead to a number of problems:

- Batch API response times can become too slow.  The larger the number of items the longer the query time required by the Batch service.  Large numbers of items have to be broken into chunks and therefore multiple service API calls may have to be made by the client library to the service to obtain all items for the one list.
- API processing by the application calling Batch will take longer the more items there are to process.
- More memory will be consumed in the application calling Batch as there are more items and/or larger items.
- More items and/or larger items will lead to increased network traffic.  This will take longer to transfer and, depending on application architecture, may result in increased network charges for data transferred outside of the region of the Batch account.

The Batch API provides the ability to both reduce the number of items returned in a list as well as reduce the amount of information returned for each item. A parameter of type [DetailLevel](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.detaillevel.aspx) can be specified for list operations. DetailLevel is an abstract base class and an [ODATADetailLevel](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.aspx) object actually needs to be created and passed as the parameter.

For all API’s the following apply:

- Each property name is a string that maps to the property of the object
- All property names are case sensitive, but property values are case insensitive
- Date/time strings can have one of two formats and need to be preceded with DateTime
	- W3CDTF (e.g. creationTime gt DateTime’2011-05-08T08:49:37Z’)
	- RFC1123 (e.g. creationTime gt DateTime’Sun, 08 May 2011 08:49:37 GMT’)
- Boolean strings are either "true" or "false"
- If an invalid property or operator is specified then an exception will be created with a "400 (Bad Request)" inner exception.
- DetailLevel parameter with Select and Expand clauses can also be passed to appropriate “Get” methods; e.g. IPoolManager.GetPool()

The ODataDetailLevel object has three public properties that can either be specified in the constructor or set directly.  The three properties are all strings:

- [FilterClause](#filter) – filter and potentially reduce the number of returned items
- [SelectClause](#select) – specify the specific property values that are returned, reducing the item and response size
- [ExpandClause](#expand) – return all required data in one call as opposed to multiple calls

### <a id="filter"></a> FilterClause

The number of items returned can be reduced by a filter string.  One or more property values can be specified to ensure only required items are returned.  For example, list only active work items, list only running tasks for a job, list only VM’s that are ready to run tasks.

A [FilterClause](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.filterclause.aspx) is a string consisting of one or more expressions, with an expression consisting of a property name, operator, and value.  The properties that can be specified are specific to each API call as are the operators supported for each property. Multiple expressions can be combined using logical operators “and” and “or”.

For example, a filter for listing tasks could be:

	startswith(name, 'MyTask') and (state eq 'Running')

### <a id="select"></a> SelectClause

The property values that are returned for each item can be limited by using a select string.  A list of properties for an item can be specified and then only those property values are returned.

A [SelectClause](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.selectclause.aspx) is a string consisting of a comma-separated list of property names.  All properties in the item returned by the list operation can be specified.

	"name, state, stateTransitionTime"

### <a id="expand"></a> ExpandClause

The number of API calls can be reduced with an expand string.  More detailed information for each list item can be obtained with the one list API call as opposed to obtaining the list and then making a call for each item in the list.

An [ExpandClause](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.expandclause.aspx) is similar to the Select clause, the Expand clause controls whether certain data is returned in the results. The Expand clause is only supported for workitem list, task list, pool list, and job list; it currently only supports statistics information. When all properties are required and there is not a select clause, then the expand clause must be used to get statistics information.  If a select clause is used to obtain a subset of properties, then statistics can be specified in the select clause and the expand clause can be left null.

> [AZURE.NOTE]
> It is recommended that you always use filter and select clauses for your list API calls to ensure maximum efficiency and the best performance for your application.