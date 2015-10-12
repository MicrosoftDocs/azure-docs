<properties
	pageTitle="Efficient list queries in Azure Batch | Microsoft Azure"
	description="Increase performance by reducing the amount of data returned when querying Azure Batch entities such as pools, jobs, tasks, and compute nodes."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="10/12/2015"
	ms.author="v-marsma"/>

# Query the Azure Batch service efficiently

Learn how to reduce the number of items and amount of data returned when using the [Batch .NET][api_net] API  to query the Batch service for lists of jobs, tasks, compute nodes, and more.

Azure Batch is big compute, and in a production environment, entities like jobs, tasks, and compute nodes can number in the thousands. Obtaining information on these items can therefore generate a large amount of data that must be transferred on each query. Limiting the number of items and type of information returned for each will increase the speed of your queries and therefore the performance of your application.

Listing jobs, tasks, compute nodes--these are examples of operations that nearly every application using Azure Batch must perform, often quite frequently. Monitoring is a common use case. Determining the capacity and status of a pool, for example, requires that all compute nodes in that pool be queried. Another example is querying a job's tasks to determine if any of those tasks are still queued.

This [Batch .NET][api_net] API code snippet retrieves all of the tasks associated with a job, along with the full suite of those tasks' properties:

```
// Get a collection of all of the tasks and all of their properties for job-001
IEnumerable<CloudTask> allTasks = batchClient.JobOperations.ListTasks("job-001");
```

A much more efficient list query can be performed, however, by supplying an [ODATADetailLevel][odata] to the [JobOperations.ListTasks][net_list_tasks] method. This snippet returns just the ID, command line, and compute node information properties of completed tasks only:

```
// Configure an ODATADetailLevel specifying a subset of tasks and their properties to return
ODATADetailLevel detailLevel = new ODATADetailLevel();
detailLevel.FilterClause = "state eq 'completed'";
detailLevel.SelectClause = "id,commandLine,nodeInfo";

// Supply the ODATADetailLevel to the ListTasks method
IEnumerable<CloudTask> completedTasks = batchClient.JobOperations.ListTasks("job-001", detailLevel);
```

If, in the above example scenario, there are thousands of tasks in the job, the results from the second query will typically be returned much quicker than the first. More about using an ODATADetailLevel when listing items with the Batch .NET API appears below.

> [AZURE.IMPORTANT]
> It is highly recommended that you **always** supply an ODATADetailLevel to your .NET API list calls to ensure maximum efficiency and performance of your application. Specifying a detail level helps to lower Batch service response times, improve network utilization, and minimize memory usage by client applications.

## Tools for efficient querying

The [Batch .NET][api_net] and [Batch REST][api_rest] APIs provide the ability to reduce both the number of items returned in a list as well as the amount of information returned for each by specifying *filter*, *select*, and *expand* strings when performing list queries.

- **filter** - The *filter string* is an expression that reduces the number of items returned. For example, list only the running tasks for a job, or list only compute nodes that are ready to run tasks.
  - A filter string consists of one or more expressions, with an expression consisting of a property name, operator, and value. The properties that can be specified are specific to each API call type as are the operators supported for each property.
  - Multiple expressions can be combined using the logical operators `and` and `or`.
  - Example filter string listing only running render tasks: `startswith(id, 'renderTask') and (state eq 'running')`
- **select** - The *select string* limits the property values that are returned for each item. A list of properties for an item can be specified in the select string, and then only those property values are returned for each item with the list query results.
  - A select string consists of a comma-separated list of property names. Any of the properties of an item returned by the list operation may be specified.
  - Example select string specifying only three properties to be returned for each task: `id, state, stateTransitionTime`
- **expand** - The *expand string* reduces the number of API calls required to obtain certain information. More detailed information for each list item can be obtained with a single list API call as opposed to obtaining the list and then making a call for each item in the list.
  - Similar to the select string, the expand string controls whether certain data is included in list query results.
  - The expand string is only supported when listing jobs, job schedules, tasks, and pools, and currently only supports statistics information.
  - Example expand string specifying that statistics information should be returned for each item: `stats`
  - When all properties are required and no select string is specified, the expand string *must* be used to get statistics information. If a select string is used to obtain a subset of properties, then `stats` can be specified in the select string and the expand string need not be specified.

> [AZURE.NOTE] When constructing any of the three query strings types (filter, select, expand), you must ensure that the property names and case match that of their REST API element counterparts. For example, when working with the .NET [CloudTask](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask), you must specify **state** instead of **State** even though the .NET property is [CloudTask.State](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.state). See the tables below for property mappings between the .NET and REST APIs.

### Filter, select, and expand string specifications

- Properties specified in filter, select, and expand strings equate to the property names as they appear in the [Batch REST][api_rest] API--this is even the case when using the [Batch .NET][api_net] library.
- All property names are case sensitive, but property values are case insensitive
- Date/time strings can be one of two formats, and must be preceded with `DateTime`
  - W3CDTF format example: `creationTime gt DateTime'2011-05-08T08:49:37Z'`
  - RFC1123 format example: `creationTime gt DateTime'Sun, 08 May 2011 08:49:37 GMT'`
- Boolean strings are either `true` or `false`
- If an invalid property or operator is specified, a `400 (Bad Request)` error will result

## Efficient querying in Batch .NET

Within the [Batch .NET][api_net] API, the [ODATADetailLevel][odata] is used for supplying filter, select, and expand strings to list operations. An ODataDetailLevel object has three public string properties that may be specified in the constructor or set directly, and this object is then passed as a parameter to the various list operations such as [ListPools][net_list_pools], [ListJobs][net_list_jobs], and [ListTasks][net_list_tasks].

- [ODATADetailLevel.FilterClause][odata_filter] – Limit the number of items returned
- [ODATADetailLevel.SelectClause][odata_select] – Specify a subset of property values returned with each item
- [ODATADetailLevel.ExpandClause][odata_expand] – Retrieve item data in a single API call as opposed to issuing calls for each

The follwing code snippet uses the Batch .NET API to efficiently query the Batch service for the statistics of a specific set of pools. In this scenario, the Batch user has both test and production pools, with their test pool IDs prefixed with "test" and production pool IDs prefixed with "prod". In the snippet, *myBatchClient* is a properly initialized instance of [BatchClient](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient).

	// First we need an ODATADetailLevel instance on which to set the expand, filter, and select
	// clause strings
	ODATADetailLevel detailLevel = new ODATADetailLevel();

	// We want to pull only the "test" pools, so we limit the number of items returned by using a
	// FilterClause and specifying that the pool IDs must start with "test"
	detailLevel.FilterClause = "startswith(id, 'test')";

	// To further limit the data that crosses the wire, configure the SelectClause to limit the
	// properties returned on each CloudPool object to only CloudPool.Id and CloudPool.Statistics
	detailLevel.SelectClause = "id, stats";

	// Specify the ExpandClause so that the .NET API pulls the statistics for the CloudPools in a single
	// underlying REST API call. Note that we use the pool's REST API element name "stats" here as opposed
	// to "Statistics" as it appears in the .NET API (CloudPool.Statistics)
	detailLevel.ExpandClause = "stats";

	// Now get our collection of pools, minimizing the amount of data returned by specifying the
	// detail level we configured above
	List<CloudPool> testPools = myBatchClient.PoolOperations.ListPools(detailLevel).ToList();

> [AZURE.TIP] An instance of [ODATADetailLevel][odata] configured with Select and Expand clauses can also be passed to appropriate Get methods such as [PoolOperations.GetPool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.getpool.aspx) to limit the amount of data returned.

## Batch REST to .NET API mappings

Property names in filter, select, and expand strings *must* reflect their REST API counterparts, both in name and case. The tables below provide mappings between .NET and REST API counterparts.

### Mappings for filter strings

- **.NET LIST METHODS** - Each of the .NET API methods in this column accepts an [ODATADetailLevel][odata] object as a parameter.
- **REST LIST REQUESTS** - Each REST API page in this column contains a table specifying the properties and operations allowed in *filter* strings. You will use these property names and operations when constructing an [ODATADetailLevel.FilterClause][odata_filter] string.

| .NET List Methods | REST List Requests |
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

- **BATCH .NET TYPES** - Batch .NET API types
- **REST API ENTITIES** - Each page in this column contains one or more tables listing the REST API property names for the type. These property names are used when constructing *select* strings. You will use these same property names and when constructing an [ODATADetailLevel.SelectClause][odata_select] string.

| Batch .NET Types | REST API Entities |
|---|---|
| [Certificate][net_cert] | [Get information about a certificate][rest_get_cert] |
| [CloudJob][net_job] | [Get information about a job][rest_get_job] |
| [CloudJobSchedule][net_schedule] | [Get information about a job schedule][rest_get_schedule] |
| [ComputeNode][net_node] | [Get information about a node][rest_get_node] |
| [CloudPool][net_pool] | [Get information about a pool][rest_get_pool] |
| [CloudTask][net_task] | [Get information about a task][rest_get_task] |

### Example: constructing a filter string

When constructing a filter string for an [ODATADetailLevel.FilterClause][odata_filter], consult the table above under *Mappings for filter strings* to find the REST API documentation page corresponding to the list operation you wish to perform. You will find the filterable properties and their supported operators in the first multi-row table on that page. If you wish to retrieve all tasks whose exit code was non-zero, for example, this row on [List the tasks associated with a job][rest_list_tasks] specifies the applicable property string and allowable operators:

![Task exit code property][1]

Thus, the filter string for listing all tasks with a non-zero exit code would be:

`(executionInfo/exitCode lt 0) or (executionInfo/exitCode gt 0)`

### Example: constructing a select string

To construct an [ODATADetailLevel.SelectClause][odata_select], consult the table above under *Mappings for select strings* and navigate to the REST API page corresponding to the type of entity you are listing. You will find the selectable properties and their supported operators in the first multi-row table on that page. If you wish to retrieve only the ID and command line for each task in a list, for example, you will find these rows in the applicable table on [Get information about a task][rest_get_task]:

![Task ID property][2]

![Task command line property][3]

The select string for including only the ID and command line with each listed task would then be:

`id, commandLine`

## Next steps

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

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_listjobs]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.joboperations.listjobs.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[efficient_query_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/EfficientListQueries
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

[1]: ./media/batch-efficient-list-queries/property_exitcode.png
[2]: ./media/batch-efficient-list-queries/property_id.png
[3]: ./media/batch-efficient-list-queries/property_cmdline.png
