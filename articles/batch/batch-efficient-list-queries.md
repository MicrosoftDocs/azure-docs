---
title: Design efficient list queries for Batch resources
description: Learn how to create more efficient list queries for your Batch resources to improve application performance.
ms.topic: how-to
ms.date: 05/20/2026
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
# Customer intent: As a developer, I want to create efficient queries for Batch resources, so that I can optimize application performance by reducing data retrieval and improving response times.
---

# Create queries to list Batch resources efficiently

Most Azure Batch applications do monitoring or other operations that query the Batch service. Such list queries often happen at regular intervals. For example, before you can check for queued tasks in a job, you must get data on every task in that job. Reducing the amount of data that the Batch service returns for queries improves your application's performance. This article explains how to create and execute such queries in an efficient way. You can create filtered queries for Batch jobs, tasks, compute nodes, and other resources with the [Azure.Compute.Batch](/dotnet/api/azure.compute.batch) library.

> [!NOTE]
> The Batch service provides API support for the common scenarios of counting tasks in a job, and counting compute nodes in Batch pool. You can call the operations [Get Task Counts](/rest/api/batchservice/job/gettaskcounts) and [List Pool Node Counts](/rest/api/batchservice/account/listpoolnodecounts) instead of using a list query. However, these more efficient operations return more limited information that might not be up to date. For more information, see [Count tasks and compute nodes by state](batch-get-resource-counts.md).

## Specify a detail level

There can be thousands of entities like jobs, tasks, and compute nodes in a production Batch application. For each query you make about the resources, a potentially large amount of data goes from the Batch service to your application. Limit how many items and what information your query returns to improve performance.

This [Azure.Compute.Batch](/dotnet/api/azure.compute.batch) API code snippet lists *every* task that is associated with a job, along with *all* of the properties of each task.

```C# Snippet:list_queries_all_tasks
// Get a collection of all of the tasks and all of their properties for job-001
AsyncPageable<BatchTask> allTasks = batchClient.GetTasksAsync("job-001");
```

Apply a detail level to your query to list information more efficiently. Pass `filter`, `select`, and `expand` strings to the [BatchClient.GetTasks](/dotnet/api/azure.compute.batch.batchclient) method. This snippet returns only the ID, command line, and compute node information properties of completed tasks.

```C# Snippet:list_queries_filter_select
// Specify filter and select strings to return only a subset of tasks and their properties.
AsyncPageable<BatchTask> completedTasks = batchClient.GetTasksAsync(
    jobId: "job-001",
    filter: "state eq 'completed'",
    select: new[] { "id", "commandLine", "nodeInfo" });
```

In this example scenario, if there are thousands of tasks in the job, the results from the second query typically are returned more quickly than from the first query. For more information about using `filter`, `select`, and `expand` parameters with the Azure.Compute.Batch API, see the section [Efficient querying in Azure.Compute.Batch](#efficient-querying-in-azurecomputebatch).

> [!IMPORTANT]
> We highly recommend that you always supply `filter`, `select`, and (when appropriate) `expand` strings to your .NET API list calls for maximum efficiency and performance of your application. By specifying a detail level, you can help to lower Batch service response times, improve network utilization, and minimize memory usage by client applications.

## Use query strings

You can use the [Azure.Compute.Batch](/dotnet/api/azure.compute.batch) and [Batch REST](/rest/api/batchservice/) APIs to reduce how many items that a query returns, and how much information the query returns for each item. There are three query string types you can use to narrow your query: [$filter](#filter), [$select](#select), and [$expand](#expand).

For the Azure.Compute.Batch API, see the [BatchClient](/dotnet/api/azure.compute.batch.batchclient) reference for the list method whose `filter`, `select`, and `expand` parameters you want to use. Also review the section [Efficient querying in Azure.Compute.Batch](#efficient-querying-in-azurecomputebatch).

For the Batch REST API, see the [Batch REST API reference](/rest/api/batchservice/). Find the **List** reference for the resource you want to query. Then, review the **URI Parameters** section for details about `$filter`, `$select`, and `$expand`. For example, see the [URI parameters for Pool - List](/rest/api/batchservice/pools/create-pool#uri-parameters). Also see [how to make efficient Batch queries with the Azure CLI](batch-cli-get-started.md#query-batch-resources-efficiently).

> [!NOTE]
> When constructing any of the three query string types, you must ensure that the property names and case match that of their REST API element counterparts. For example, when working with the .NET [BatchTask](/dotnet/api/azure.compute.batch.batchtask) class, you must specify **state** instead of **State**, even though the .NET property is [BatchTask.State](/dotnet/api/azure.compute.batch.batchtask). For more information, see the [property mappings between the .NET and REST APIs](#mappings-for-select-strings).

### Filter

The `$filter` expression string reduces the number of items that are returned. For example, you can list only the running tasks for a job, or list only compute nodes that are ready to run tasks.

This string consists of one or more expressions, with an expression that consists of a property name, operator, and value. The properties that can be specified are specific to each entity type that you query, as are the operators that are supported for each property.  Multiple expressions can be combined by using the logical operators `and` and `or`.

This example lists only the running render tasks: `(state eq 'running') and startswith(id, 'renderTask')`.

### Select

The `$select` expression string limits the property values that are returned for each item. You specify a list of comma-separated property names, and only those property values are returned for the items in the query results. You can specify any of the properties for the entity type you're querying.

This example specifies that only three property values should be returned for each task: `id, state, stateTransitionTime`.

### Expand

The `$expand` expression string reduces the number of API calls that are required to obtain certain information. You can use this string to obtain more information about each item with a single API call. This method helps to improve performance by reducing API calls. Use an `$expand` string instead of getting the list of entities and requesting information about each list item.

Similar to `$select`, `$expand` controls whether certain data is included in list query results. When all properties are required and no select string is specified, `$expand` *must* be used to get statistics information. If a select string is used to obtain a subset of properties, then `stats` can be specified in the select string, and `$expand` doesn't need to be specified.

Supported uses of this string include listing jobs, job schedules, tasks, and pools. Currently, the string only supports statistics information.

This example specifies that statistics information should be returned for each item in the list: `stats`.

### Rules for filter, select, and expand strings

- Make sure properties' names in filter, select, and expand strings appear as they do in the [Batch REST](/rest/api/batchservice/) API. This rule applies even when you use [Azure.Compute.Batch](/dotnet/api/azure.compute.batch) or one of the other Batch SDKs.
- All property names are case-sensitive, but property values are case insensitive.
- Date/time strings can be one of two formats, and must be preceded with `DateTime`.
  - W3C-DTF format example: `creationTime gt DateTime'2011-05-08T08:49:37Z'`
  - RFC 1123 format example: `creationTime gt DateTime'Sun, 08 May 2011 08:49:37 GMT'`
- Boolean strings are either `true` or `false`.
- If an invalid property or operator is specified, a `400 (Bad Request)` error will result.

## Efficient querying in Azure.Compute.Batch

In the [Azure.Compute.Batch](/dotnet/api/azure.compute.batch) API, the list methods on [BatchClient](/dotnet/api/azure.compute.batch.batchclient) accept `filter`, `select`, and `expand` parameters directly:

- `filter`: Limit the number of items that are returned.
- `select`: Specify which property values are returned with each item.
- `expand`: Retrieve data for all items in a single API call instead of separate calls for each item.

The following code snippet uses the Azure.Compute.Batch API to query the Batch service efficiently for the statistics of a specific set of pools. The Batch user has both test and production pools. The test pool IDs are prefixed with "test", and the production pool IDs are prefixed with "prod". *myBatchClient* is a properly initialized instance of the [BatchClient](/dotnet/api/azure.compute.batch.batchclient) class.

```C# Snippet:list_queries_pools_expand
// Pull only the "test" pools, and limit the data crossing the wire by selecting only
// the Id and Statistics properties. Use expand="stats" so the .NET API pulls the
// statistics for the BatchPools in a single underlying REST API call. Note that we
// use the pool's REST API element name "stats" here as opposed to "Statistics" as it
// appears in the .NET API (BatchPool.Statistics).
List<BatchPool> testPools = new List<BatchPool>();
await foreach (BatchPool pool in myBatchClient.GetPoolsAsync(
    filter: "startswith(id, 'test')",
    select: new[] { "id", "stats" },
    expand: new[] { "stats" }))
{
    testPools.Add(pool);
}
```

> [!TIP]
> The same `filter`, `select`, and `expand` parameters can also be passed to appropriate Get methods, such as [BatchClient.GetPool](/dotnet/api/azure.compute.batch.batchclient.getpool), to limit the amount of data that is returned.

## Batch REST to .NET API mappings

Property names in filter, select, and expand strings must reflect their REST API counterparts, both in name and case. The tables below provide mappings between the .NET and REST API counterparts.

### Mappings for filter strings

- **.NET list methods**: Each of the .NET API methods in this column accepts `filter`, `select`, and `expand` string parameters.
- **REST list requests**: Each REST API page listed in this column contains a table with the properties and operations allowed in filter strings. You can use these property names and operations when you construct a `filter` string.

| .NET list methods | REST list requests |
| --- | --- |
| [BatchAccountResource.GetBatchAccountCertificates](/dotnet/api/azure.resourcemanager.batch.batchaccountresource) |[List the certificates in an account](/rest/api/batchmanagement/certificate/list-by-batch-account) |
| [BatchClient.GetTaskFiles](/dotnet/api/azure.compute.batch.batchclient) |[List the files associated with a task](/rest/api/batchservice/file/listfromtask) |
| [BatchClient.GetJobPreparationAndReleaseTaskStatuses](/dotnet/api/azure.compute.batch.batchclient) |[List the status of the job preparation and job release tasks for a job](/rest/api/batchservice/job/listpreparationandreleasetaskstatus) |
| [BatchClient.GetJobs](/dotnet/api/azure.compute.batch.batchclient) |[List the jobs in an account](/rest/api/batchservice/jobs/list-jobs-from-schedule) |
| [BatchClient.GetNodeFiles](/dotnet/api/azure.compute.batch.batchclient) |[List the files on a node](/rest/api/batchservice/file/listfromcomputenode) |
| [BatchClient.GetTasks](/dotnet/api/azure.compute.batch.batchclient) |[List the tasks associated with a job](/rest/api/batchservice/tasks/list-tasks) |
| [BatchClient.GetJobSchedules](/dotnet/api/azure.compute.batch.batchclient) |[List the job schedules in an account](/rest/api/batchservice/jobschedule/list) |
| [BatchClient.GetJobsFromSchedule](/dotnet/api/azure.compute.batch.batchclient) |[List the jobs associated with a job schedule](/rest/api/batchservice/job/listfromjobschedule) |
| [BatchClient.GetNodes](/dotnet/api/azure.compute.batch.batchclient) |[List the compute nodes in a pool](/rest/api/batchservice/nodes/list-nodes) |
| [BatchClient.GetPools](/dotnet/api/azure.compute.batch.batchclient) |[List the pools in an account](/rest/api/batchservice/pools/list-pools) |

### Mappings for select strings

- **Azure.Compute.Batch types**: Azure.Compute.Batch API types.
- **REST API entities**: Each page in this column contains one or more tables that list the REST API property names for the type. These property names are used when you construct *select* strings. You use these same property names when you construct a `select` string.

| Azure.Compute.Batch types | REST API entities |
| --- | --- |
| [BatchCertificate](/dotnet/api/azure.resourcemanager.batch.models.batchaccountcertificatedata) |[Get information about a certificate](/rest/api/batchmanagement/certificate/get) |
| [BatchJob](/dotnet/api/azure.compute.batch.batchjob) |[Get information about a job](/rest/api/batchservice/jobs/get-job) |
| [BatchJobSchedule](/dotnet/api/azure.compute.batch.batchjobschedule) |[Get information about a job schedule](/rest/api/batchservice/jobs/get-job) |
| [BatchNode](/dotnet/api/azure.compute.batch.batchnode) |[Get information about a node](/rest/api/batchservice/computenode/get) |
| [BatchPool](/dotnet/api/azure.compute.batch.batchpool) |[Get information about a pool](/rest/api/batchservice/pools/get-pool) |
| [BatchTask](/dotnet/api/azure.compute.batch.batchtask) |[Get information about a task](/rest/api/batchservice/tasks/get-task) |

## Example: construct a filter string

To construct a filter string for a list method's `filter` parameter, find the [corresponding REST API page](#mappings-for-filter-strings). Selectable properties and their supported operators are in the first multi-row table. For example, to retrieve all tasks whose exit code was nonzero, check [List the tasks associated with a job](/rest/api/batchservice/tasks/list-tasks) for the applicable property string and allowable operators:

| Property | Operations allowed | Type |
|:--- |:--- |:--- |
| `executionInfo/exitCode` |`eq, ge, gt, le , lt` |`Int` |

The related filter string is:

`(executionInfo/exitCode lt 0) or (executionInfo/exitCode gt 0)`

## Example: construct a select string

To construct a `select` string, find the [corresponding REST API page](#mappings-for-filter-strings) for the entity that you're listing. Selectable properties and their supported operators are in the first multi-row table. For example, to retrieve only the ID and command line for each task in a list, check [Get information about a task](/rest/api/batchservice/tasks/get-task):

| Property | Type | Notes |
|:--- |:--- |:--- |
| `id` |`String` |`The ID of the task.` |
| `commandLine` |`String` |`The command line of the task.` |

The related select string is:

`id, commandLine`

## Code samples

### Efficient list queries

The [EfficientListQueries](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/ArticleProjects/EfficientListQueries) sample project shows how efficient list querying affects application performance. This C# console application creates and adds a large number of tasks to a job. Then, the application makes multiple calls to the [BatchClient.GetTasks](/dotnet/api/azure.compute.batch.batchclient) method and passes different `filter`, `select`, and `expand` parameter values to vary the amount of data to be returned. This sample produces output similar to:

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

The example shows you can greatly lower query response times by limiting the properties and the number of items that are returned. You can find this and other sample projects in the [azure-batch-samples](https://github.com/Azure-Samples/azure-batch-samples) repository on GitHub.

### BatchMetrics library

The following [BatchMetrics](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp/BatchMetrics) sample project demonstrates how to efficiently monitor Azure Batch job progress using the Batch API.

This sample includes a .NET class library project, which you can incorporate into your own projects. There's also a simple command-line program to exercise and demonstrate the use of the library.

The sample application within the project demonstrates these operations:

- Selecting specific attributes to download only the properties you need
- Filtering on state transition times to download only changes since the last query

For example, the following method appears in the BatchMetrics library. It returns a tuple containing `select` and `filter` strings that specify only the `id` and `state` properties should be obtained for the entities that are queried, and that only entities whose state has changed since the specified `DateTime` parameter should be returned.

```C# Snippet:list_queries_only_changed_after
return (
    Filter: string.Format("stateTransitionTime gt DateTime'{0:o}'", time),
    Select: new[] { "id", "state" });
```

## Next steps

- [Maximize Azure Batch compute resource usage with concurrent node tasks](batch-parallel-node-tasks.md). Some types of workloads can benefit from executing parallel tasks on larger (but fewer) compute nodes. Check out the [example scenario](batch-parallel-node-tasks.md#example-scenario) in the article for details on such a scenario.
- [Monitor Batch solutions by counting tasks and nodes by state](batch-get-resource-counts.md)
