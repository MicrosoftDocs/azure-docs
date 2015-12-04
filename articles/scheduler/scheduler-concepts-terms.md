<properties
 pageTitle="Scheduler concepts, terms, and entities | Microsoft Azure"
 description="Azure Scheduler concepts, terminology, and entity hierarchy, including jobs and job collections.  Shows a comprehensive example of a scheduled job."
 services="scheduler"
 documentationCenter=".NET"
 authors="krisragh"
 manager="dwrede"
 editor=""/>
<tags
 ms.service="scheduler"
 ms.workload="infrastructure-services"
 ms.tgt_pltfrm="na"
 ms.devlang="dotnet"
 ms.topic="get-started-article"
 ms.date="08/04/2015"
 ms.author="krisragh"/>

# Scheduler concepts, terminology, + entity hierarchy

## Scheduler entity hierarchy

The following table describes the main resources exposed or used by the Scheduler API:

|Resource | Description |
|---|---|
|**Cloud service**|Conceptually, a cloud service represents an application. A subscription may have several cloud services.|
|**Job collection**|A job collection contains a group of jobs and maintains settings, quotas, and throttles that are shared by jobs within the collection. A job collection is created by a subscription owner and groups jobs together based on usage or application boundaries. It’s constrained to one region. It also allows the enforcement of quotas to constrain the usage of all jobs in that collection. The quotas include MaxJobs and MaxRecurrence.|
|**Job**|A job defines a single recurrent action, with simple or complex strategies for execution. Actions may include HTTP requests or storage queue requests.|
|**Job history**|A job history represents details for an execution of a job. It contains success vs. failure, as well as any response details.|

## Scheduler entity management

At a high level, the scheduler and the service management API expose the following operations on the resources:

|Capability|Description and URI address|
|---|---|
|**Cloud service management**|GET, PUT, and DELETE support for creating and modifying cloud services <p>`https://management.core.windows.net/{subscriptionId}/cloudservices/{cloudServiceName}`</p>|
|**Job collection management**|GET, PUT, and DELETE support for creating and modifying job collections and the jobs contained therein. A job collection is a container for jobs and maps to quotas and shared settings. Examples of quotas, described later, are maximum number of jobs and smallest recurrence interval. <p>PUT and DELETE: `https://management.core.windows.net/{subscriptionId}/cloudservices/{cloudServiceName}/resources/scheduler/jobcollections/{jobCollectionName}`</p><p>GET: `https://management.core.windows.net/{subscriptionId}/cloudservices/{cloudServiceName}/resources/scheduler/~/jobcollections/{jobCollectionName}`</p>
|**Job management**|GET, PUT, POST, PATCH, and DELETE support for creating and modifying jobs. All jobs must belong to a job collection that already exists, so there is no implicit creation. <p>`https://management.core.windows.net/{subscriptionId}/cloudservices/{cloudServiceName}/resources/scheduler/~/jobcollections/{jobCollectionName}/jobs/{jobId}`</p>|
|**Job history management**|GET support for fetching 60 days of job execution history, such as job elapsed time and job execution results. Adds query string parameter support for filtering based on state and status. <P>`https://management.core.windows.net/{subscriptionId}/cloudservices/{cloudServiceName}/resources/scheduler/~/jobcollections/{jobCollectionName}/jobs/{jobId}/history`</p>|

## Job types

There are two types of jobs: HTTP jobs (including HTTPS jobs that support SSL) and storage queue jobs. HTTP jobs are ideal if you have an endpoint of an existing workload or service. You can use storage queue jobs to post messages to storage queues, so those jobs are ideal for workloads that use storage queues.

## The "job" entity in detail

At a basic level, a scheduled job has several parts:

- The action to perform when the job timer fires  

- (Optional) The time to run the job  

- (Optional) When and how often to repeat the job  

- (Optional) An action to fire if the primary action fails  

Internally, a scheduled job also contains system-provided data such as the next scheduled execution time.

The following code provides a comprehensive example of a scheduled job. Details are provided in subsequent sections.

	{
		"startTime": "2012-08-04T00:00Z",               // optional
		"action":
		{
			"type": "http",
			"retryPolicy": { "retryType":"none" },
			"request":
			{
				"uri": "http://contoso.com/foo",        // required
				"method": "PUT",                        // required
				"body": "Posting from a timer",         // optional
				"headers":                              // optional

				{
					"Content-Type": "application/json"
				},
			},
		   "errorAction":
		   {
			   "type": "http",
			   "request":
			   {
				   "uri": "http://contoso.com/notifyError",
				   "method": "POST",
			   },
		   },
		},
		"recurrence":                                   // optional
		{
			"frequency": "week",                        // can be "year" "month" "day" "week" "minute"
			"interval": 1,                              // optional, how often to fire (default to 1)
			"schedule":                                 // optional (advanced scheduling specifics)
			{
				"weekDays": ["monday", "wednesday", "friday"],
				"hours": [10, 22]
			},
			"count": 10,                                 // optional (default to recur infinitely)
			"endTime": "2012-11-04",                     // optional (default to recur infinitely)
		},
		"state": "disabled",                           // enabled or disabled
		"status":                                       // controlled by Scheduler service
		{
			"lastExecutionTime": "2007-03-01T13:00:00Z",
			"nextExecutionTime": "2007-03-01T14:00:00Z ",
			"executionCount": 3,
											    "failureCount": 0,
												"faultedCount": 0
		},
	}

As seen in the sample scheduled job above, a job definition has several parts:

- Start time (“startTime”)  

- Action (“action”), which includes error action (“errorAction”)

- Recurrence (“recurrence”)  

- State (“state”)  

- Status (“status”)  

- Retry policy (“retryPolicy”)  

Let’s examine each of these in detail:

## startTime

The "startTime” is the start time and allows the caller to specify a time zone offset on the wire in [ISO-8601 format](http://en.wikipedia.org/wiki/ISO_8601).

## action and errorAction

The “action” is the action invoked on each occurrence and describes a type of service invocation. The action is what will be executed on the provided schedule. Scheduler supports HTTP and storage queue actions.

The action in the example above is an HTTP action. Below is an example of a storage queue action:

	{
			"type": "storageQueue",
			"queueMessage":
			{
				"storageAccount": "myStorageAccount",  // required
				"queueName": "myqueue",                // required
				"sasToken": "TOKEN",                   // required
				"message":                             // required
					"My message body",
			},
	}

The “errorAction” is the error handler, the action invoked when the primary action fails. You can use this variable to call an error-handling endpoint or send a user notification. This can be used for reaching a secondary endpoint in the case that the primary is not available (e.g., in the case of a disaster at the endpoint’s site) or can be used for notifying an error handling endpoint. Just like the primary action, the error action can be simple or composite logic based on other actions. To learn how to create a SAS token, refer to [Create and Use a Shared Access Signature](https://msdn.microsoft.com/library/azure/jj721951.aspx).

## recurrence

Recurrence has several parts:

- Frequency: One of minute, hour, day, week, month, year  

- Interval: Interval at the given frequency for the recurrence  

- Prescribed schedule: Specify minutes, hours, weekdays, months, and monthdays of the recurrence  

- Count: Count of occurrences  

- End time: No jobs will execute after the specified end time  

A job is recurring if it has a recurring object specified in its JSON definition. If both count and endTime are specified, the completion rule that occurs first is honored.

## state

The state of the job is one of four values: enabled, disabled, completed, or faulted. You can PUT or PATCH jobs so as to update them to the enabled or disabled state. If a job has been completed or faulted, that is a final state that cannot be updated (though the job can still be DELETED). An example of the state property is as follows:


    	"state": "disabled", // enabled, disabled, completed, or faulted
Completed and faulted jobs are deleted after 60 days.

## status

Once a Scheduler job has started, information will be returned about the current status of the job. This object is not settable by the user—it’s set by the system. However, it is included in the job object (rather than a separate linked resource) so that one can obtain the status of a job easily.

Job status includes the time of the previous execution (if any), the time of the next scheduled execution (for in-progress jobs), and the execution count of the job.

## retryPolicy

If a Scheduler job fails, it is possible to specify a retry policy to determine whether and how the action is retried. This is determined by the **retryType** object—it is set to **none** if there is no retry policy, as shown above. Set it to **fixed** if there is a retry policy.

To set a retry policy, two additional settings may be specified: a retry interval (**retryInterval**) and the number of retries (**retryCount**).

The retry interval, specified with the **retryInterval** object, is the interval between retries. Its default value is 1 minute, its minimum value is 1 minute, and its maximum value is 18 months. It is defined in the ISO 8601 format. Similarly, the value of the number of retries is specified with the **retryCount** object; it is the number of times a retry is attempted. Its default value is 5, and its maximum value is 20\. Both **retryInterval** and **retryCount** are optional. They are given their default values if **retryType** is set to **fixed** and no values are specified explicitly.

## See also

 [What is Scheduler?](scheduler-intro.md)

 [Get started using Azure Scheduler in the Azure portal](scheduler-get-started-portal.md)

 [Plans and billing in Azure Scheduler](scheduler-plans-billing.md)

 [How to build complex schedules and advanced recurrence with Azure Scheduler](scheduler-advanced-complexity.md)

 [Azure Scheduler REST API reference](https://msdn.microsoft.com/library/dn528946)

 [Azure Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)

 [Azure Scheduler high-availability and reliability](scheduler-high-availability-reliability.md)

 [Azure Scheduler limits, defaults, and error codes](scheduler-limits-defaults-errors.md)

 [Azure Scheduler outbound authentication](scheduler-outbound-authentication.md)
