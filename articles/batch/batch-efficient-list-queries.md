---
title: Design efficient list queries
description: Increase performance by filtering your queries when requesting information on Batch resources like pools, jobs, tasks, and compute nodes.
ms.topic: how-to
ms.date: 06/18/2020
ms.custom: "seodec18, devx-track-csharp"
---

# Create queries to list Batch resources efficiently

Nearly all Batch applications need to perform some type of monitoring or other operation that queries the Batch service, often at regular intervals. For example, to determine whether there are any queued tasks remaining in a job, you must get data on every task in the job. To determine the status of nodes in your pool, you must get data on every node in the pool. This article explains how to execute such queries in the most efficient way.

You can increase your Azure Batch application's performance by reducing the amount of data that is returned by the service when you query jobs, tasks, compute nodes, and other resources with the [Batch .NET](/dotnet/api/microsoft.azure.batch) library.

> [!NOTE]
> The Batch service provides API support for the common scenarios of counting tasks in a job, and counting compute nodes in Batch pool. Instead of using a list query for these, you can call the [Get Task Counts](/rest/api/batchservice/job/gettaskcounts) and [List Pool Node Counts](/rest/api/batchservice/account/listpoolnodecounts) operations. These operations are more efficient than a list query, but return more limited information that may not always be up to date. For more information, see [Count tasks and compute nodes by state](batch-get-resource-counts.md).

## Specify a detail level

In a production Batch application, entities like jobs, tasks, and compute nodes can number in the thousands. When you request information on these resources, a potentially large amount of data must "cross the wire" from the Batch service to your application on each query. By limiting the number of items and type of information that is returned by a query, you can increase the speed of your queries, and therefore the performance of your application.

This [Batch .NET](/dotnet/api/microsoft.azure.batch) API code snippet lists *every* task that is associated with a job, along with *all* of the properties of each task:

```csharp
// Get a collection of all of the tasks and all of their properties for job-001
IPagedEnumerable<CloudTask> allTasks =
    batchClient.JobOperations.ListTasks("job-001");
```

You can perform a much more efficient list query, however, by applying a "detail level" to your query. You do this by supplying an [ODATADetailLevel](/dotnet/api/microsoft.azure.batch.odatadetaillevel) object to the [JobOperations.ListTasks](/dotnet/api/microsoft.azure.batch.joboperations) method. This snippet returns only the ID, command line, and compute node information properties of completed tasks:

```csharp
// Configure an ODATADetailLevel specifying a subset of tasks and
// their properties to return
ODATADetailLevel detailLevel = new ODATADetailLevel();
detailLevel.FilterClause = "state eq 'completed'";
detailLevel.SelectClause = "id,commandLine,nodeInfo";

// Supply the ODATADetailLevel to the ListTasks method
IPagedEnumerable<CloudTask> completedTasks =
    batchClient.JobOperations.ListTasks("job-001", detailLevel);
```

In this example scenario, if there are thousands of tasks in the job, the results from the second query will typically be returned much quicker than the first. More information about using ODATADetailLevel when you list items with the Batch .NET API is included [below](#efficient-querying-in-batch-net).

> [!IMPORTANT]
> We highly recommend that you always supply an ODATADetailLevel object to your .NET API list calls to ensure maximum efficiency and performance of your application. By specifying a detail level, you can help to lower Batch service response times, improve network utilization, and minimize memory usage by client applications.

## Filter, select, and expand

The [Batch .NET](/dotnet/api/microsoft.azure.batch) and [Batch REST](/rest/api/batchservice/) APIs provide the ability to reduce both the number of items that are returned in a list, as well as the amount of information that is returned for each. You do so by specifying **filter**, **select**, and **expand strings** when performing list queries.

### Filter

The filter string is an expression that reduces the number of items that are returned. For example, you can list only the running tasks for a job, or list only compute nodes that are ready to run tasks.

The filter string consists of one or more expressions, with an expression that consists of a property name, operator, and value. The properties that can be specified are specific to each entity type that you query, as are the operators that are supported for each property.  Multiple expressions can be combined by using the logical operators `and` and `or`.

This example filter string lists only the running "render" tasks: `(state eq 'running') and startswith(id, 'renderTask')`.

### Select

The select string limits the property values that are returned for each item. You specify a list of comma-separated property names, and only those property values are returned for the items in the query results.You can specify any of the properties for the entity type you are querying.

This example select string specifies that only three property values should be returned for each task: `id, state, stateTransitionTime`.

### Expand

The expand string reduces the number of API calls that are required to obtain certain information. When you use an expand string, more information about each item can be obtained with a single API call. Rather than first obtaining the list of entities, then requesting information for each item in the list, you use an expand string to obtain the same information in a single API call, helping to improve performance by reducing API calls.

Similar to the select string, the expand string controls whether certain data is included in list query results. When all properties are required and no select string is specified, the expand string *must* be used to get statistics information. If a select string is used to obtain a subset of properties, then `stats` can be specified in the select string, and the expand string does not need to be specified.

The expand string is only supported when it is used in listing jobs, job schedules, tasks, and pools. Currently, it only supports statistics information.

This example expand string specifies that statistics information should be returned for each item in the list: `stats`.

> [!NOTE]
> When constructing any of the three query string types (filter, select, and expand), you must ensure that the property names and case match that of their REST API element counterparts. For example, when working with the .NET [CloudTask](/dotnet/api/microsoft.azure.batch.cloudtask) class, you must specify **state** instead of **State**, even though the .NET property is [CloudTask.State](/dotnet/api/microsoft.azure.batch.cloudtask.state#Microsoft_Azure_Batch_CloudTask_State). See the tables below for property mappings between the .NET and REST APIs.

### Rules for filter, select, and expand strings

- Properties names in filter, select, and expand strings should appear as they do in the [Batch REST](/rest/api/batchservice/) API, even when you use [Batch .NET](/dotnet/api/microsoft.azure.batch) or one of the other Batch SDKs.
- All property names are case-sensitive, but property values are case insensitive.
- Date/time strings can be one of two formats, and must be preceded with `DateTime`.
  
  - W3C-DTF format example: `creationTime gt DateTime'2011-05-08T08:49:37Z'`
  - RFC 1123 format example: `creationTime gt DateTime'Sun, 08 May 2011 08:49:37 GMT'`
- Boolean strings are either `true` or `false`.
- If an invalid property or operator is specified, a `400 (Bad Request)` error will result.

## Efficient querying in Batch .NET

Within the [Batch .NET](/dotnet/api/microsoft.azure.batch) API, the [ODATADetailLevel](/dotnet/api/microsoft.azure.batch.odatadetaillevel) class is used for supplying filter, select, and expand strings to list operations. The ODataDetailLevel class has three public string properties that can be specified in the constructor, or set directly on the object. You then pass the ODataDetailLevel object as a parameter to the various list operations such as [ListPools](/dotnet/api/microsoft.azure.batch.pooloperations), [ListJobs](/dotnet/api/microsoft.azure.batch.joboperations), and [ListTasks](/dotnet/api/microsoft.azure.batch.joboperations).

- [ODATADetailLevel.FilterClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.filterclause): Limit the number of items that are returned.
- [ODATADetailLevel.SelectClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.selectclause): Specify which property values are returned with each item.
- [ODATADetailLevel.ExpandClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.expandclause): Retrieve data for all items in a single API call instead of separate calls for each item.

The following code snippet uses the Batch .NET API to efficiently query the Batch service for the statistics of a specific set of pools. In this scenario, the Batch user has both test and production pools. The test pool IDs are prefixed with "test", and the production pool IDs are prefixed with "prod". In the snippet, *myBatchClient* is a properly initialized instance of the [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient) class.

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

> [!TIP]
> An instance of [ODATADetailLevel](/dotnet/api/microsoft.azure.batch.odatadetaillevel) that is configured with Select and Expand clauses can also be passed to appropriate Get methods, such as [PoolOperations.GetPool](/dotnet/api/microsoft.azure.batch.pooloperations.getpool#Microsoft_Azure_Batch_PoolOperations_GetPool_System_String_Microsoft_Azure_Batch_DetailLevel_System_Collections_Generic_IEnumerable_Microsoft_Azure_Batch_BatchClientBehavior__), to limit the amount of data that is returned.

## Batch REST to .NET API mappings

Property names in filter, select, and expand strings must reflect their REST API counterparts, both in name and case. The tables below provide mappings between the .NET and REST API counterparts.

### Mappings for filter strings

- **.NET list methods**: Each of the .NET API methods in this column accepts an [ODATADetailLevel](/dotnet/api/microsoft.azure.batch.odatadetaillevel) object as a parameter.
- **REST list requests**: Each REST API page linked to in this column contains a table that specifies the properties and operations that are allowed in *filter* strings. You  use these property names and operations when you construct an [ODATADetailLevel.FilterClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.filterclause) string.

| .NET list methods | REST list requests |
| --- | --- |
| [CertificateOperations.ListCertificates](/dotnet/api/microsoft.azure.batch.certificateoperations) |[List the certificates in an account](/rest/api/batchservice/certificate/list) |
| [CloudTask.ListNodeFiles](/dotnet/api/microsoft.azure.batch.cloudtask) |[List the files associated with a task](/rest/api/batchservice/file/listfromtask) |
| [JobOperations.ListJobPreparationAndReleaseTaskStatus](/dotnet/api/microsoft.azure.batch.joboperations) |[List the status of the job preparation and job release tasks for a job](/rest/api/batchservice/job/listpreparationandreleasetaskstatus) |
| [JobOperations.ListJobs](/dotnet/api/microsoft.azure.batch.joboperations) |[List the jobs in an account](/rest/api/batchservice/job/list) |
| [JobOperations.ListNodeFiles](/dotnet/api/microsoft.azure.batch.joboperations) |[List the files on a node](/rest/api/batchservice/file/listfromcomputenode) |
| [JobOperations.ListTasks](/dotnet/api/microsoft.azure.batch.joboperations) |[List the tasks associated with a job](/rest/api/batchservice/task/list) |
| [JobScheduleOperations.ListJobSchedules](/dotnet/api/microsoft.azure.batch.jobscheduleoperations) |[List the job schedules in an account](/rest/api/batchservice/jobschedule/list) |
| [JobScheduleOperations.ListJobs](/dotnet/api/microsoft.azure.batch.jobscheduleoperations) |[List the jobs associated with a job schedule](/rest/api/batchservice/job/listfromjobschedule) |
| [PoolOperations.ListComputeNodes](/dotnet/api/microsoft.azure.batch.pooloperations) |[List the compute nodes in a pool](/rest/api/batchservice/computenode/list) |
| [PoolOperations.ListPools](/dotnet/api/microsoft.azure.batch.pooloperations) |[List the pools in an account](/rest/api/batchservice/pool/list) |

### Mappings for select strings

- **Batch .NET types**: Batch .NET API types.
- **REST API entities**: Each page in this column contains one or more tables that list the REST API property names for the type. These property names are used when you construct *select* strings. You use these same property names when you construct an [ODATADetailLevel.SelectClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.selectclause) string.

| Batch .NET types | REST API entities |
| --- | --- |
| [Certificate](/dotnet/api/microsoft.azure.batch.certificate) |[Get information about a certificate](/rest/api/batchservice/certificate/get) |
| [CloudJob](/dotnet/api/microsoft.azure.batch.cloudjob) |[Get information about a job](/rest/api/batchservice/job/get) |
| [CloudJobSchedule](/dotnet/api/microsoft.azure.batch.cloudjobschedule) |[Get information about a job schedule](/rest/api/batchservice/jobschedule/get) |
| [ComputeNode](/dotnet/api/microsoft.azure.batch.computenode) |[Get information about a node](/rest/api/batchservice/computenode/get) |
| [CloudPool](/dotnet/api/microsoft.azure.batch.cloudpool) |[Get information about a pool](/rest/api/batchservice/pool/get) |
| [CloudTask](/dotnet/api/microsoft.azure.batch.cloudtask) |[Get information about a task](/rest/api/batchservice/task/get) |

## Example: construct a filter string

When you construct a filter string for [ODATADetailLevel.FilterClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.filterclause), consult the table above under "Mappings for filter strings" to find the REST API documentation page that corresponds to the list operation that you wish to perform. You will find the filterable properties and their supported operators in the first multirow table on that page. If you wish to retrieve all tasks whose exit code was nonzero, for example, this row on [List the tasks associated with a job](/rest/api/batchservice/task/list) specifies the applicable property string and allowable operators:

| Property | Operations allowed | Type |
|:--- |:--- |:--- |
| `executionInfo/exitCode` |`eq, ge, gt, le , lt` |`Int` |

Thus, the filter string for listing all tasks with a nonzero exit code would be:

`(executionInfo/exitCode lt 0) or (executionInfo/exitCode gt 0)`

## Example: construct a select string

To construct [ODATADetailLevel.SelectClause](/dotnet/api/microsoft.azure.batch.odatadetaillevel.selectclause), consult the table above under "Mappings for select strings" and navigate to the REST API page that corresponds to the type of entity that you are listing. You will find the selectable properties and their supported operators in the first multirow table on that page. If you wish to retrieve only the ID and command line for each task in a list, for example, you will find these rows in the applicable table on [Get information about a task](/rest/api/batchservice/task/get):

| Property | Type | Notes |
|:--- |:--- |:--- |
| `id` |`String` |`The ID of the task.` |
| `commandLine` |`String` |`The command line of the task.` |

The select string for including only the ID and command line with each listed task would then be:

`id, commandLine`

## Code samples

### Efficient list queries code sample

The [EfficientListQueries](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/ArticleProjects/EfficientListQueries) sample project on GitHub shows how efficient list querying can affect performance in an application. This C# console application creates and adds a large number of tasks to a job. Then, it makes multiple calls to the [JobOperations.ListTasks](/dotnet/api/microsoft.azure.batch.joboperations) method and passes [ODATADetailLevel](/dotnet/api/microsoft.azure.batch.odatadetaillevel) objects that are configured with different property values to vary the amount of data to be returned. It produces output similar to the following:

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

As shown in the elapsed times, you can greatly lower query response times by limiting the properties and the number of items that are returned. You can find this and other sample projects in the [azure-batch-samples](https://github.com/Azure-Samples/azure-batch-samples) repository on GitHub.

### BatchMetrics library and code sample

In addition to the EfficientListQueries code sample above, the [BatchMetrics](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/BatchMetrics) sample project demonstrates how to efficiently monitor Azure Batch job progress using the Batch API.

The [BatchMetrics](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/BatchMetrics) sample includes a .NET class library project which you can incorporate into your own projects, and a simple command-line program to exercise and demonstrate the use of the library.

The sample application within the project demonstrates the following operations:

1. Selecting specific attributes in order to download only the properties you need
2. Filtering on state transition times in order to download only changes since the last query

For example, the following method appears in the BatchMetrics library. It returns an ODATADetailLevel that specifies that only the `id` and `state` properties should be obtained for the entities that are queried. It also specifies that only entities whose state has changed since the specified `DateTime` parameter should be returned.

```csharp
internal static ODATADetailLevel OnlyChangedAfter(DateTime time)
{
    return new ODATADetailLevel(
        selectClause: "id, state",
        filterClause: string.Format("stateTransitionTime gt DateTime'{0:o}'", time)
    );
}
```

## Next steps

- Learn how to [Maximize Azure Batch compute resource usage with concurrent node tasks](batch-parallel-node-tasks.md). Some types of workloads can benefit from executing parallel tasks on larger (but fewer) compute nodes. Check out the [example scenario](batch-parallel-node-tasks.md#example-scenario) in the article for details on such a scenario.
- Learn how to [Monitor Batch solutions by counting tasks and nodes by state](batch-get-resource-counts.md)


[api_net]: /dotnet/api/microsoft.azure.batch
[api_net_listjobs]: /dotnet/api/microsoft.azure.batch.joboperations
[api_rest]: /rest/api/batchservice/
[batch_metrics]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchMetrics
[efficient_query_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/EfficientListQueries
[github_samples]: https://github.com/Azure/azure-batch-samples
[odata]: /dotnet/api/microsoft.azure.batch.odatadetaillevel
[odata_ctor]: /dotnet/api/microsoft.azure.batch.odatadetaillevel
[odata_expand]: /dotnet/api/microsoft.azure.batch.odatadetaillevel
[odata_filter]: /dotnet/api/microsoft.azure.batch.odatadetaillevel
[odata_select]: /dotnet/api/microsoft.azure.batch.odatadetaillevel

[net_list_certs]: /dotnet/api/microsoft.azure.batch.certificateoperations
[net_list_compute_nodes]: /dotnet/api/microsoft.azure.batch.pooloperations
[net_list_job_schedules]: /dotnet/api/microsoft.azure.batch.jobscheduleoperations
[net_list_jobprep_status]: /dotnet/api/microsoft.azure.batch.joboperations
[net_list_jobs]: /dotnet/api/microsoft.azure.batch.joboperations
[net_list_nodefiles]: /dotnet/api/microsoft.azure.batch.joboperations
[net_list_pools]: /dotnet/api/microsoft.azure.batch.pooloperations
[net_list_schedule_jobs]: /dotnet/api/microsoft.azure.batch.jobscheduleoperations
[net_list_task_files]: /dotnet/api/microsoft.azure.batch.cloudtask
[net_list_tasks]: /dotnet/api/microsoft.azure.batch.joboperations

[rest_list_certs]: /rest/api/batchservice/certificate/list
[rest_list_compute_nodes]: /rest/api/batchservice/computenode/list
[rest_list_job_schedules]: /rest/api/batchservice/jobschedule/list
[rest_list_jobprep_status]: /rest/api/batchservice/job/listpreparationandreleasetaskstatus
[rest_list_jobs]: /rest/api/batchservice/job/list
[rest_list_nodefiles]: /rest/api/batchservice/file/listfromcomputenode
[rest_list_pools]: /rest/api/batchservice/pool/list
[rest_list_schedule_jobs]: /rest/api/batchservice/job/listfromjobschedule
[rest_list_task_files]: /rest/api/batchservice/file/listfromtask
[rest_list_tasks]: /rest/api/batchservice/task/list

[rest_get_cert]: /rest/api/batchservice/certificate/get
[rest_get_job]: /rest/api/batchservice/job/get
[rest_get_node]: /rest/api/batchservice/computenode/get
[rest_get_pool]: /rest/api/batchservice/pool/get
[rest_get_schedule]: /rest/api/batchservice/jobschedule/get
[rest_get_task]: /rest/api/batchservice/task/get

[net_cert]: /dotnet/api/microsoft.azure.batch.certificate
[net_job]: /dotnet/api/microsoft.azure.batch.cloudjob
[net_node]: /dotnet/api/microsoft.azure.batch.computenode
[net_pool]: /dotnet/api/microsoft.azure.batch.cloudpool
[net_schedule]: /dotnet/api/microsoft.azure.batch.cloudjobschedule
[net_task]: /dotnet/api/microsoft.azure.batch.cloudtask

[rest_get_task_counts]: /rest/api/batchservice/get-the-task-counts-for-a-job
[rest_get_node_counts]: /rest/api/batchservice/account/listpoolnodecounts
