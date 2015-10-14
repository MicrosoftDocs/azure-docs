<properties
	pageTitle="Efficient list queries in Azure Batch | Microsoft Azure"
	description="Learn to reduce the amount of data returned and increase performance when querying Azure Batch pools, jobs, tasks, compute nodes, and more."
	services="batch"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="Batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="09/24/2015"
	ms.author="davidmu;v-marsma"/>

# Efficient Batch list queries

Azure Batch is big compute, and in a production environment, entities like jobs, tasks, and compute nodes can number in the thousands. Obtaining information on these items can therefore generate a large amount of data that must be transferred on each query. Limiting the number of items and type of information returned for each will increase the speed of your queries and therefore the performance of your application.

The following [Batch .NET](https://msdn.microsoft.com/library/azure/mt348682.aspx) API methods are examples of operations that virtually every application using Azure Batch must perform, often frequently:

- [ListTasks](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listtasks.aspx)
- [ListJobs](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listjobs.aspx)
- [ListPools](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listpools.aspx)
- [ListComputeNodes](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listcomputenodes.aspx)

Monitoring is a common use case--determining the capacity and status of a pool requires that all compute nodes (VMs) in a pool be queried, for example. Another example is to query a job's tasks to determine if any of those tasks are still queued. In some cases, a rich set of data is required, but in others, only a count of the total number of items or a collection of items that are in a certain state is required.

It is important to note that both the number of items returned and the amount of data required to represent those items can be very large. Simply querying for lots of items resulting in large responses can lead to a number of problems:

- Batch API response times can become too slow. The larger the number of items, the longer the query time required by the Batch service. Large numbers of items have to be broken into chunks, and therefore the client library may need to make multiple API calls to the service to obtain all of the items for a single list.
- API processing by the application calling Batch will take longer when there are more items to process.
- More memory will be consumed by the application calling Batch when there are more and/or larger items.
- More and/or larger items will lead to increased network traffic. This will take longer to transfer and, depending on application architecture, may result in increased network charges for data transferred outside of the region of the Batch account.

> [AZURE.IMPORTANT]
> It is *highly* recommended that you *always* use filter and select clauses for your list API calls to ensure maximum efficiency and performance for your application. These clauses and their usage are described below.

For all Batch APIs the following apply:

- Each property name is a string that maps to the property of the object
- All property names are case sensitive, but property values are case insensitive
- Property names and casing are as the elements appear in the Batch REST API
- Date/time strings may be specified in one of two formats, and must be preceded with DateTime
	- W3CDTF (e.g. *creationTime gt DateTime'2011-05-08T08:49:37Z'*)
	- RFC1123 (e.g. *creationTime gt DateTime'Sun, 08 May 2011 08:49:37 GMT'*)
- Boolean strings are either "true" or "false"
- Specifying an invalid property or operator will result in a "400 (Bad Request)" error

## Efficient querying in Batch .NET

The Batch .NET API provides the ability to reduce both the number of items returned in a list and the amount of information returned for each item by specifying the [DetailLevel](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.detaillevel.aspx) of a query. DetailLevel is an abstract base class, and an [ODATADetailLevel][odata] object actually needs to be created and passed as the parameter to appropriate methods.

An ODataDetailLevel object has three public string properties that can be specified either in the constructor or set directly:

- [FilterClause](#filter) – filter and potentially reduce the number of returned items
- [SelectClause](#select) – specify a subset of property values to be returned for each item, reducing the item and response size
- [ExpandClause](#expand) – return all required data in one call as opposed to multiple calls

> [AZURE.TIP] An instance of DetailLevel configured with Select and Expand clauses can also be passed to appropriate Get methods such as [PoolOperations.GetPool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.getpool.aspx) to limit the amount of data returned.

### <a id="filter"></a> FilterClause

The number of items returned can be reduced by a filter string. One or more property values with qualifiers can be specified to ensure only the items relevant to your query are returned. For example, perhaps you wish to list only the running tasks for a job, or list only the compute nodes that are ready to run tasks.

 [FilterClause](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.filterclause.aspx) is a string consisting of one or more expressions, with an expression consisting of a *property name*, *operator*, and *value*. The properties that can be specified are specific to each API call, as are the operators supported for each property. Multiple expressions can be combined using the logical operators **and** and **or**.

For example, this filter string returns only running tasks whose *displayName* starts with "MyTask":

	startswith(displayName, 'MyTask') and (state eq 'Running')

Each Batch REST API article below contains a table specifying the supported properties and operations on those properties for the different list operations.

- [List the pools in an account](https://msdn.microsoft.com/library/azure/dn820101.aspx)
- [List the compute nodes in a pool](https://msdn.microsoft.com/library/azure/dn820159.aspx)
- [List the jobs in an account](https://msdn.microsoft.com/library/azure/dn820117.aspx)
- [List the status of the job preparation and job release tasks for a job](https://msdn.microsoft.com/library/azure/mt282170.aspx)
- [List the job schedules in an account](https://msdn.microsoft.com/library/azure/mt282174.aspx)
- [List the jobs associated with a job schedule](https://msdn.microsoft.com/library/azure/mt282169.aspx)
- [List the tasks associated with a job](https://msdn.microsoft.com/library/azure/dn820187.aspx)
- [List the files associated with a task](https://msdn.microsoft.com/library/azure/dn820142.aspx)
- [List the certificates in an account](https://msdn.microsoft.com/library/azure/dn820154.aspx)
- [List the files on a node](https://msdn.microsoft.com/library/azure/dn820151.aspx)

> [AZURE.IMPORTANT] When specifying properties in any of the three clause types, ensure that the property name and case matches that of their Batch REST API element counterparts. For example, when working with the .NET [CloudTask](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask), you must specify **state** instead of **State** even though the .NET property is [CloudTask.State](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.state). To verify proper name and case for the **state** property, for example, you'd check the element name in [Get information about a task](https://msdn.microsoft.com/library/azure/dn820133.aspx) in the Batch REST API documentation.

### <a id="select"></a> SelectClause

The property values that are returned for each item can be limited by using a select string. A list of properties for an item can be specified, and then only those property values are returned.

A [SelectClause](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.selectclause.aspx) is a string consisting of a comma-separated list of property names. Any combination of properties available for an item returned by a list operation may be specified.

	"name, state, stateTransitionTime"

### <a id="expand"></a> ExpandClause

The number of API calls can be reduced with an expand clause. More detailed information for each list item can be obtained with a single API call as opposed to first obtaining the list and then iterating over the list, making a call for each item in the list.

An [ExpandClause](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.expandclause.aspx) is similar to the select clause in that it controls whether certain data is returned in the results. The expand clause is supported only for job list, task list, and pool list, and currently only supports statistics information. When all properties are required and no select clause has been specified, then the expand clause must be used to get statistics information. If a select clause is used to obtain a subset of properties, then "stats" can also be specified in the select clause and the expand clause may be left null.

## Efficient query example

Below you'll find a code snippet that uses the Batch .NET API to efficiently query the Batch service for the statistics of a specific set of pools. In this scenario, the Batch user has both test and production pools, with their test pool IDs prefixed with "test" and production pool IDs prefixed with "prod". In the snippet, *myBatchClient* is a properly initialized instance of [BatchClient](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient).

	// First we need an ODATADetailLevel instance on which to set the expand, filter, and select
	// clause strings
	ODATADetailLevel detailLevel = new ODATADetailLevel();

	// Specify the ExpandClause so that the .NET API pulls the statistics for the CloudPools in a single
	// underlying REST API call. Note that we use the pool's REST API element name "stats" here as opposed
	// to "Statistics" as it appears in the .NET API (CloudPool.Statistics)
	detailLevel.ExpandClause = "stats";

	// We want to pull only the "test" pools, so we limit the items returned by using a Filterclause and
	// specifying that the pool IDs must start with "test"
	detailLevel.FilterClause = "startswith(id, 'test')";

	// To further limit the data that crosses the wire, configure the SelectClause to limit the
	// properties returned on each CloudPool object to only CloudPool.Id and CloudPool.Statistics
	detailLevel.SelectClause = "id, stats";

	// Now get our collection of pools, minimizing the amount of data returned by specifying the
	// detail level we configured above
	List<CloudPool> testPools = myBatchClient.PoolOperations.ListPools(detailLevel).ToList();

## Sample project

Check out the [EfficientListQueries][efficient_query_sample] sample project on GitHub to see how efficient list querying can affect performance in an application. This C# console application creates and adds a large number of tasks to a job, then queries the Batch service using different [ODATADetailLevel][odata] specifications, displaying output similar to the following:

		Adding 5000 tasks to job jobEffQuery...
		5000 tasks added in 00:00:47.3467587, hit ENTER to query tasks...

		4943 tasks retrieved in 00:00:04.3408081 (ExpandClause:  | FilterClause: state eq 'active' | SelectClause: id,state)
		0 tasks retrieved in 00:00:00.2662920 (ExpandClause:  | FilterClause: state eq 'running' | SelectClause: id,state)
		59 tasks retrieved in 00:00:00.3337760 (ExpandClause:  | FilterClause: state eq 'completed' | SelectClause: id,state)
		5000 tasks retrieved in 00:00:04.1429881 (ExpandClause:  | FilterClause:  | SelectClause: id,state)
		5000 tasks retrieved in 00:00:15.1016127 (ExpandClause:  | FilterClause:  | SelectClause: id,state,environmentSettings)
		5000 tasks retrieved in 00:00:17.0548145 (ExpandClause: stats | FilterClause:  | SelectClause: )

		Sample complete, hit ENTER to continue...

As is shown in the elapsed time information, limiting the properties and the number of items returned can greatly lower query response times. You can find this and other sample projects in the [azure-batch-samples][github_samples] repository on GitHub.

## Next steps

1. If you haven't already, be sure to check out the Batch API documentation relevant to your development scenario
    - [Batch REST](https://msdn.microsoft.com/library/azure/dn820158.aspx)
    - [Batch .NET](https://msdn.microsoft.com/library/azure/dn865466.aspx)
2. Grab the [Azure Batch samples](https://github.com/Azure/azure-batch-samples) on GitHub and dig into the code

[efficient_query_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/EfficientListQueries
[github_samples]: https://github.com/Azure/azure-batch-samples
[odata]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.aspx
