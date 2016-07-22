<properties
	pageTitle="Efficient list queries in Azure Batch | Microsoft Azure"
	description="Increase performance by filtering your queries when requesting information on Batch entities such as pools, jobs, tasks, and compute nodes."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="07/25/2016"
	ms.author="marsma" />

# Query the Azure Batch service efficiently

Here you'll learn how to increase your Azure Batch application's performance by reducing the amount of data that is returned by the service when you query jobs, tasks, and compute nodes with the [Batch .NET][api_net] library.

Nearly all Batch applications need to perform some type of monitoring or other operation that queries the Batch service, often at regular intervals. For example, to determine whether there are any queued tasks remaining in a job, you must get data on every task within the job. To determine the status of the nodes in your pool, you must get data on every node in the pool. This article explains how to execute these types of queries in the most efficient way.

## Meet the DetailLevel

In a production Batch application, entities like jobs, tasks, and compute nodes can number in the thousands. Obtaining information for these can therefore generate a large amount of data that must "cross the wire" from the service to your application on each query. By limiting the number of items and the type of information that is returned by a query, you can increase the speed of your queries, and therefore the performance of your application.

This [Batch .NET][api_net] API code snippet lists *every* task that is associated with a job, along with *all* of the properties of each task:

```csharp
// Get a collection of all of the tasks and all of their properties for job-001
IPagedEnumerable<CloudTask> allTasks =
	batchClient.JobOperations.ListTasks("job-001");
```

You can perform a much more efficient list query, however, by applying a "detail level" to your query. You do this by supplying an [ODATADetailLevel][odata] object to the [JobOperations.ListTasks][net_list_tasks] method. This snippet returns only the ID, command line, and compute node information properties of completed tasks:

```csharp
// Configure an ODATADetailLevel specifying a subset of tasks and their properties to return
ODATADetailLevel detailLevel = new ODATADetailLevel();
detailLevel.FilterClause = "state eq 'completed'";
detailLevel.SelectClause = "id,commandLine,nodeInfo";

// Supply the ODATADetailLevel to the ListTasks method
IPagedEnumerable<CloudTask> completedTasks = batchClient.JobOperations.ListTasks("job-001", detailLevel);
```

In the above example scenario, if there are thousands of tasks in the job, the results from the second query will typically be returned much quicker than the first. More information about using ODATADetailLevel when you list items with the Batch .NET API is included [below](#efficient-querying-in-batch-net).

> [AZURE.IMPORTANT]
> We highly recommend that you *always* supply an ODATADetailLevel object to your .NET API list calls to ensure maximum efficiency and performance of your application. By specifying a detail level, you can help to lower Batch service response times, improve network utilization, and minimize memory usage by client applications.

## Filter, select, and expand

The [Batch .NET][api_net] and [Batch REST][api_rest] APIs provide the ability to reduce both the number of items that are returned in a list, as well as the amount of information that is returned for each. You do so by specifying **filter**, **select**, and **expand strings** when performing list queries.

### Filter
The filter string is an expression that reduces the number of items that are returned. For example, list only the running tasks for a job, or list only compute nodes that are ready to run tasks.

- The filter string consists of one or more expressions, with an expression that consists of a property name, operator, and value. The properties that can be specified are specific to each entity type that you query, as are the operators that are supported for each property.
- Multiple expressions can be combined by using the logical operators `and` and `or`.
- This example filter string lists only the running "render" tasks: `(state eq 'running') and startswith(id, 'renderTask')`.

### Select
The select string limits the property values that are returned for each item. You specify a list of property names, and only those property values are returned for the items in the query results.

- The select string consists of a comma-separated list of property names. You can specify any of the properties for the entity type you are querying.
- This example select string specifies that only three property values should be returned for each task: `id, state, stateTransitionTime`.

### Expand
The expand string reduces the number of API calls that are required to obtain certain information. When you use an expand string, more information about each item can be obtained with a single API call. Rather than first obtaining the list of entities, then requesting information for each item in the list, you use an expand string to obtain the same information in a single API call. Less API calls means better performance.

- Similar to the select string, the expand string controls whether certain data is included in list query results.
- The expand string is only supported when it is used in listing jobs, job schedules, tasks, and pools. Currently, it only supports statistics information.
- When all properties are required and no select string is specified, the expand string *must* be used to get statistics information. If a select string is used to obtain a subset of properties, then `stats` can be specified in the select string, and the expand string does not need to be specified.
- This example expand string specifies that statistics information should be returned for each item in the list: `stats`.

> [AZURE.NOTE] When constructing any of the three query string types (filter, select, and expand), you must ensure that the property names and case match that of their REST API element counterparts. For example, when working with the .NET [CloudTask](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask) class, you must specify **state** instead of **State**, even though the .NET property is [CloudTask.State](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.state). See the tables below for property mappings between the .NET and REST APIs.

### Rules for filter, select, and expand strings

- Properties names in filter, select, and expand strings should appear as they do in the [Batch REST][api_rest] API--even when you use the [Batch .NET][api_net] library.
- All property names are case sensitive, but property values are case insensitive.
- Date/time strings can be one of two formats, and must be preceded with `DateTime`.

  - W3C-DTF format example: `creationTime gt DateTime'2011-05-08T08:49:37Z'`.
  - RFC 1123 format example: `creationTime gt DateTime'Sun, 08 May 2011 08:49:37 GMT'`.
- Boolean strings are either `true` or `false`.
- If an invalid property or operator is specified, a `400 (Bad Request)` error will result.

## Efficient querying in Batch .NET

Within the [Batch .NET][api_net] API, the [ODATADetailLevel][odata] class is used for supplying filter, select, and expand strings to list operations. The ODataDetailLevel class has three public string properties that can be specified in the constructor, or set directly on the object. You then pass the ODataDetailLevel object as a parameter to the various list operations such as [ListPools][net_list_pools], [ListJobs][net_list_jobs], and [ListTasks][net_list_tasks].

- [ODATADetailLevel][odata].[FilterClause][odata_filter]: Limit the number of items that are returned.
- [ODATADetailLevel][odata].[SelectClause][odata_select]: Specify which property values are returned with each item.
- [ODATADetailLevel][odata].[ExpandClause][odata_expand]: Retrieve data for all items in a single API call instead of separate calls for each item.

The following code snippet uses the Batch .NET API to efficiently query the Batch service for the statistics of a specific set of pools. In this scenario, the Batch user has both test and production pools. The test pool IDs are prefixed with "test", and the production pool IDs are prefixed with "prod". In the snippet, *myBatchClient* is a properly initialized instance of the [BatchClient](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient) class.

```csharp
// First we need an ODATADetailLevel instance on which to set the filter, select,
// and expand clause strings
ODATADetailLevel detailLevel = new ODATADetailLevel();

// We want to pull only the "test" pools, so we limit the number of items returned
// by using a FilterClause and specifying that the pool IDs must start with "test"
detailLevel.FilterClause = "startswith(id, 'test')";

// To further limit the data that crosses the wire, configure the SelectClause to
// limit the properties that are returned on each CloudPool object to only
// CloudPool.Id and CloudPool.Statistics
detailLevel.SelectClause = "id, stats";

// Specify the ExpandClause so that the .NET API pulls the statistics for the
// CloudPools in a single underlying REST API call. Note that we use the pool's
// REST API element name "stats" here as opposed to "Statistics" as it appears in
// the .NET API (CloudPool.Statistics)
detailLevel.ExpandClause = "stats";

// Now get our collection of pools, minimizing the amount of data that is returned
// by specifying the detail level that we configured above
List<CloudPool> testPools =
	await myBatchClient.PoolOperations.ListPools(detailLevel).ToListAsync();
```

> [AZURE.TIP] An instance of [ODATADetailLevel][odata] that is configured with Select and Expand clauses can also be passed to appropriate Get methods, such as [PoolOperations.GetPool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.getpool.aspx), to limit the amount of data that is returned.

## Batch REST to .NET API mappings

Property names in filter, select, and expand strings *must* reflect their REST API counterparts, both in name and case. The tables below provide mappings between the .NET and REST API counterparts.

### Mappings for filter strings

- **.NET list methods**: Each of the .NET API methods in this column accepts an [ODATADetailLevel][odata] object as a parameter.
- **REST list requests**: Each REST API page linked to in this column contains a table that specifies the properties and operations that are allowed in *filter* strings. You will use these property names and operations when you construct an [ODATADetailLevel.FilterClause][odata_filter] string.

| .NET list methods | REST list requests |
|---|---|
| [CertificateOperations.ListCertificates][net_list_certs] | [List the certificates in an account][rest_list_certs]
| [CloudTask.ListNodeFiles][net_list_task_files] | [List the files associated with a task][rest_list_task_files]
| [JobOperations.ListJobPreparationAndReleaseTaskStatus][net_list_jobprep_status] | [List the status of the job preparation and job release tasks for a job][rest_list_jobprep_status]
| [JobOperations.ListJobs][net_list_jobs] | [List the jobs in an account][rest_list_jobs]
| [JobOperations.ListNodeFiles][net_list_nodefiles] | [List the files on a node][rest_list_nodefiles]
| [JobOperations.ListTasks][net_list_tasks] | [List the tasks associated with a job][rest_list_tasks]
| [JobScheduleOperations.ListJobSchedules][net_list_job_schedules] | [List the job schedules in an account][rest_list_job_schedules]
| [JobScheduleOperations.ListJobs][net_list_schedule_jobs] | [List the jobs associated with a job schedule][rest_list_schedule_jobs]
| [PoolOperations.ListComputeNodes][net_list_compute_nodes] | [List the compute nodes in a pool][rest_list_compute_nodes]
| [PoolOperations.ListPools][net_list_pools] | [List the pools in an account][rest_list_pools]

### Mappings for select strings

- **Batch .NET types**: Batch .NET API types.
- **REST API entities**: Each page in this column contains one or more tables that list the REST API property names for the type. These property names are used when you construct *select* strings. You will use these same property names when you construct an [ODATADetailLevel.SelectClause][odata_select] string.

| Batch .NET types | REST API entities |
|---|---|
| [Certificate][net_cert] | [Get information about a certificate][rest_get_cert] |
| [CloudJob][net_job] | [Get information about a job][rest_get_job] |
| [CloudJobSchedule][net_schedule] | [Get information about a job schedule][rest_get_schedule] |
| [ComputeNode][net_node] | [Get information about a node][rest_get_node] |
| [CloudPool][net_pool] | [Get information about a pool][rest_get_pool] |
| [CloudTask][net_task] | [Get information about a task][rest_get_task] |

## Example: construct a filter string

When you construct a filter string for [ODATADetailLevel.FilterClause][odata_filter], consult the table above under "Mappings for filter strings" to find the REST API documentation page that corresponds to the list operation that you wish to perform. You will find the filterable properties and their supported operators in the first multirow table on that page. If you wish to retrieve all tasks whose exit code was nonzero, for example, this row on [List the tasks associated with a job][rest_list_tasks] specifies the applicable property string and allowable operators:

| Property | Operations allowed | Type |
| :--- | :--- | :--- |
| `executionInfo/exitCode` | `eq, ge, gt, le , lt` | `Int` |

Thus, the filter string for listing all tasks with a nonzero exit code would be:

`(executionInfo/exitCode lt 0) or (executionInfo/exitCode gt 0)`

## Example: construct a select string

To construct [ODATADetailLevel.SelectClause][odata_select], consult the table above under "Mappings for select strings" and navigate to the REST API page that corresponds to the type of entity that you are listing. You will find the selectable properties and their supported operators in the first multirow table on that page. If you wish to retrieve only the ID and command line for each task in a list, for example, you will find these rows in the applicable table on [Get information about a task][rest_get_task]:

| Property | Type | Notes |
| :--- | :--- | :--- |
| `id` | `String` | `The ID of the task.` |
| `commandLine` | `String` | `The command line of the task.` |

The select string for including only the ID and command line with each listed task would then be:

`id, commandLine`

## Code samples

### Efficient list queries code sample

Check out the [EfficientListQueries][efficient_query_sample] sample project on GitHub to see how efficient list querying can affect performance in an application. This C# console application creates and adds a large number of tasks to a job. Then, it makes multiple calls to the [JobOperations.ListTasks][net_list_tasks] method and passes [ODATADetailLevel][odata] objects that are configured with different property values to vary the amount of data to be returned. It produces output similar to the following:

```
Adding 5000 tasks to job jobEffQuery...
5000 tasks added in 00:00:47.3467587, hit ENTER to query tasks...

4943 tasks retrieved in 00:00:04.3408081 (ExpandClause:  | FilterClause: state eq 'active' | SelectClause: id,state)
0 tasks retrieved in 00:00:00.2662920 (ExpandClause:  | FilterClause: state eq 'running' | SelectClause: id,state)
59 tasks retrieved in 00:00:00.3337760 (ExpandClause:  | FilterClause: state eq 'completed' | SelectClause: id,state)
5000 tasks retrieved in 00:00:04.1429881 (ExpandClause:  | FilterClause:  | SelectClause: id,state)
5000 tasks retrieved in 00:00:15.1016127 (ExpandClause:  | FilterClause:  | SelectClause: id,state,environmentSettings)
5000 tasks retrieved in 00:00:17.0548145 (ExpandClause: stats | FilterClause:  | SelectClause: )

Sample complete, hit ENTER to continue...
```

As shown in the elapsed times, you can greatly lower query response times by limiting the properties and the number of items that are returned. You can find this and other sample projects in the [azure-batch-samples][github_samples] repository on GitHub.

### BatchMetrics library and code sample

In addition to the EfficientListQueries code sample above, you can find the [BatchMetrics][batch_metrics] project in the [azure-batch-samples][github_samples] GitHub repository. The BatchMetrics sample project demonstrates how to efficiently monitor Azure Batch job progress using the Batch API.

The [BatchMetrics][batch_metrics] sample includes a .NET class library project which you can incorporate into your own projects, and a simple command line program to exercise and demonstrate the use of the library.

The sample application within the project demonstrates the following operations:

1. Selecting specific attributes in order to download only the fields you need
2. Filtering on state transition times in order to download only changes since the last query

## Next steps

### Parallel node tasks

[Maximize Azure Batch compute resource usage with concurrent node tasks](batch-parallel-node-tasks.md) is another article related to Batch application performance. Some types of workloads can benefit from executing parallel tasks on larger--but fewer--compute nodes. Check out the [example scenario](batch-parallel-node-tasks.md#example-scenario) in the article for details on such a scenario.

### Batch Forum

The [Azure Batch Forum][forum] on MSDN is a great place to discuss Batch and ask questions about the service. Head on over for helpful "sticky" posts, and post your questions as they arise while you build your Batch solutions.


[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_listjobs]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listjobs.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_metrics]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchMetrics
[efficient_query_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/EfficientListQueries
[forum]: https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azurebatch
[github_samples]: https://github.com/Azure/azure-batch-samples
[odata]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.aspx
[odata_ctor]: https://msdn.microsoft.com/library/azure/dn866178.aspx
[odata_expand]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.expandclause.aspx
[odata_filter]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.filterclause.aspx
[odata_select]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.odatadetaillevel.selectclause.aspx

[net_list_certs]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.certificateoperations.listcertificates.aspx
[net_list_compute_nodes]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listcomputenodes.aspx
[net_list_job_schedules]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.jobscheduleoperations.listjobschedules.aspx
[net_list_jobprep_status]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listjobpreparationandreleasetaskstatus.aspx
[net_list_jobs]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listjobs.aspx
[net_list_nodefiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listnodefiles.aspx
[net_list_pools]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.listpools.aspx
[net_list_schedule_jobs]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.jobscheduleoperations.listjobs.aspx
[net_list_task_files]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.listnodefiles.aspx
[net_list_tasks]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listtasks.aspx

[rest_list_certs]: https://msdn.microsoft.com/library/azure/dn820154.aspx
[rest_list_compute_nodes]: https://msdn.microsoft.com/library/azure/dn820159.aspx
[rest_list_job_schedules]: https://msdn.microsoft.com/library/azure/mt282174.aspx
[rest_list_jobprep_status]: https://msdn.microsoft.com/library/azure/mt282170.aspx
[rest_list_jobs]: https://msdn.microsoft.com/library/azure/dn820117.aspx
[rest_list_nodefiles]: https://msdn.microsoft.com/library/azure/dn820151.aspx
[rest_list_pools]: https://msdn.microsoft.com/library/azure/dn820101.aspx
[rest_list_schedule_jobs]: https://msdn.microsoft.com/library/azure/mt282169.aspx
[rest_list_task_files]: https://msdn.microsoft.com/library/azure/dn820142.aspx
[rest_list_tasks]: https://msdn.microsoft.com/library/azure/dn820187.aspx

[rest_get_cert]: https://msdn.microsoft.com/library/azure/dn820176.aspx
[rest_get_job]: https://msdn.microsoft.com/library/azure/dn820106.aspx
[rest_get_node]: https://msdn.microsoft.com/library/azure/dn820168.aspx
[rest_get_pool]: https://msdn.microsoft.com/library/azure/dn820165.aspx
[rest_get_schedule]: https://msdn.microsoft.com/library/azure/mt282171.aspx
[rest_get_task]: https://msdn.microsoft.com/library/azure/dn820133.aspx

[net_cert]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.certificate.aspx
[net_job]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_node]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_schedule]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjobschedule.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
