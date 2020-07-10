---
title: Concepts, terms, and entities
description: Learn the concepts, terminology, and entity hierarchy, including jobs and job collections, in Azure Scheduler
services: scheduler
ms.service: scheduler
ms.suite: infrastructure-services
author: derek1ee
ms.author: deli
ms.reviewer: klam, estfan
ms.topic: conceptual
ms.date: 08/18/2016
---

# Concepts, terminology, and entities in Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) is replacing Azure Scheduler, which is 
> [being retired](../scheduler/migrate-from-scheduler-to-logic-apps.md#retire-date). 
> To continue working with the jobs that you set up in Scheduler, please 
> [migrate to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md) as soon as possible. 
>
> Scheduler is no longer available in the Azure portal, but the [REST API](/rest/api/scheduler) 
> and [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) remain available 
> at this time so that you can manage your jobs and job collections.

## Entity hierarchy

The Azure Scheduler REST API exposes and uses these main entities, or resources:

| Entity | Description |
|--------|-------------|
| **Job** | Defines a single recurring action with simple or complex strategies for execution. Actions might include HTTP, Storage queue, Service Bus queue, or Service Bus topic requests. | 
| **Job collection** | Contains a group of jobs and maintains settings, quotas, and throttles that are shared by jobs in the collection. As an Azure subscription owner, you can create job collections and group jobs together based on their usage or application boundaries. A job collection has these attributes: <p>- Constrained to one region. <br>- Lets you enforce quotas so you can constrain usage for all jobs in a collection. <br>- Quotas include MaxJobs and MaxRecurrence. | 
| **Job history** | Describes details for a job execution, for example, status and any response details. |
||| 

## Entity management

At a high-level, the Scheduler REST API exposes these operations for managing entities.

### Job management

Supports operations for creating and editing jobs. 
All jobs must belong to an existing job collection, 
so there's no implicit creation. For more information, see 
[Scheduler REST API - Jobs](https://docs.microsoft.com/rest/api/scheduler/jobs). 
Here's the URI address for these operations:

```
https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Scheduler/jobCollections/{jobCollectionName}/jobs/{jobName}
```

### Job collection management

Supports operations for creating and editing jobs and job collections, 
which map to quotas and shared settings. For example, quotas specify 
the maximum number of jobs and smallest recurrence interval. 
For more information, see [Scheduler REST API - Job Collections](https://docs.microsoft.com/rest/api/scheduler/jobcollections). 
Here's the URI address for these operations:

```
https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Scheduler/jobCollections/{jobCollectionName}
```

### Job history management

Supports the GET operation for fetching 60 days of job execution history, 
for example, job elapsed time and job execution results. 
Includes query string parameter support for filtering based on state and status. 
For more information, see [Scheduler REST API - Jobs - List Job History](https://docs.microsoft.com/rest/api/scheduler/jobs/listjobhistory). 
Here's the URI address for this operation:

```
https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Scheduler/jobCollections/{jobCollectionName}/jobs/{jobName}/history
```

## Job types

Azure Scheduler supports multiple job types: 

* HTTP jobs, including HTTPS jobs that support TLS, 
for when you have the endpoint for an existing service or workload
* Storage queue jobs for workloads that use Storage queues, 
such as posting messages to Storage queues
* Service Bus queue jobs for workloads that use Service Bus queues
* Service Bus topic jobs for workloads that use Service Bus topics

## Job definition

At the high level, a Scheduler job has these basic parts:

* The action that runs when the job timer fires
* Optional: The time to run the job
* Optional: When and how often to repeat the job
* Optional: An error action that runs if the primary action fails

The job also includes system-provided data such as the job's next scheduled run time. 
The job's code definition is an object in JavaScript Object Notation (JSON) format, 
which has these elements:

| Element | Required | Description | 
|---------|----------|-------------| 
| [**startTime**](#start-time) | No | The start time for the job with a time zone offset in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) | 
| [**action**](#action) | Yes | The details for the primary action, which can include an **errorAction** object | 
| [**errorAction**](#error-action) | No | The details for the secondary action that runs if the primary action fails |
| [**recurrence**](#recurrence) | No | The details such as frequency and interval for a recurring job | 
| [**retryPolicy**](#retry-policy) | No | The details for how often to retry an action | 
| [**state**](#state) | Yes | The details for the job's current state |
| [**status**](#status) | Yes | The details for the job's current status, which is controlled by the service |
||||

Here's an example that shows a comprehensive job definition for an 
HTTP action with fuller element details described in later sections: 

```json
"properties": {
   "startTime": "2012-08-04T00:00Z",
   "action": {
      "type": "Http",
      "request": {
         "uri": "http://contoso.com/some-method", 
         "method": "PUT",          
         "body": "Posting from a timer",
         "headers": {
            "Content-Type": "application/json"
         },
         "retryPolicy": { 
             "retryType": "None" 
         },
      },
      "errorAction": {
         "type": "Http",
         "request": {
            "uri": "http://contoso.com/notifyError",
            "method": "POST"
         }
      }
   },
   "recurrence": {
      "frequency": "Week",
      "interval": 1,
      "schedule": {
         "weekDays": ["Monday", "Wednesday", "Friday"],
         "hours": [10, 22]
      },
      "count": 10,
      "endTime": "2012-11-04"
   },
   "state": "Disabled",
   "status": {
      "lastExecutionTime": "2007-03-01T13:00:00Z",
      "nextExecutionTime": "2007-03-01T14:00:00Z ",
      "executionCount": 3,
      "failureCount": 0,
      "faultedCount": 0
   }
}
```

<a name="start-time"></a>

## startTime

In the **startTime** object, you can specify the start time and a time 
zone offset in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601).

<a name="action"></a>

## action

Your Scheduler job runs a primary **action** based on the specified schedule. 
Scheduler supports HTTP, Storage queue, Service Bus queue, and Service Bus 
topic actions. If the primary **action** fails, Scheduler can run a 
secondary [**errorAction**](#erroraction) that handles the error. 
The **action** object describes these elements:

* The action's service type
* The action's details
* An alternative **errorAction**

The previous example describes an HTTP action. 
Here's an example for a Storage queue action:

```json
"action": {
   "type": "storageQueue",
   "queueMessage": {
      "storageAccount": "myStorageAccount",  
      "queueName": "myqueue",                
      "sasToken": "TOKEN",                   
      "message": "My message body"
    }
}
```

Here's an example for a Service Bus queue action:

```json
"action": {
   "type": "serviceBusQueue",
   "serviceBusQueueMessage": {
      "queueName": "q1",  
      "namespace": "mySBNamespace",
      "transportType": "netMessaging", // Either netMessaging or AMQP
      "authentication": {  
         "sasKeyName": "QPolicy",
         "type": "sharedAccessKey"
      },
      "message": "Some message",  
      "brokeredMessageProperties": {},
      "customMessageProperties": {
         "appname": "FromScheduler"
      }
   }
},
```

Here's an example for a Service Bus topic action:

```json
"action": {
   "type": "serviceBusTopic",
   "serviceBusTopicMessage": {
      "topicPath": "t1",  
      "namespace": "mySBNamespace",
      "transportType": "netMessaging", // Either netMessaging or AMQP
      "authentication": {
         "sasKeyName": "QPolicy",
         "type": "sharedAccessKey"
      },
      "message": "Some message",
      "brokeredMessageProperties": {},
      "customMessageProperties": {
         "appname": "FromScheduler"
      }
   }
},
```

For more information about Shared Access Signature (SAS) tokens, see 
[Authorize with Shared Access Signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

<a name="error-action"></a>

## errorAction

If your job's primary **action** fails, Scheduler can run 
an **errorAction** that handles the error. In the primary 
**action**, you can specify an **errorAction** object 
so Scheduler can call an error-handling endpoint or send a user notification. 

For example, if a disaster happens at the primary endpoint, 
you can use **errorAction** for calling a secondary endpoint, 
or for notifying an error handling endpoint. 

Just like the primary **action**, you can have the error action 
use simple or composite logic based on other actions. 

<a name="recurrence"></a>

## recurrence

A job recurs if the job's JSON definition includes the **recurrence** object, for example:

```json
"recurrence": {
   "frequency": "Week",
   "interval": 1,
   "schedule": {
      "hours": [10, 22],
      "minutes": [0, 30],
      "weekDays": ["Monday", "Wednesday", "Friday"]
   },
   "count": 10,
   "endTime": "2012-11-04"
},
```

| Property | Required | Value | Description | 
|----------|----------|-------|-------------| 
| **frequency** | Yes, when **recurrence** is used | "Minute", "Hour", "Day", "Week", "Month", "Year" | The time unit between occurrences | 
| **interval** | No | 1 to 1000 inclusively | A positive integer that determines the number of time units between each occurrence based on **frequency** | 
| **schedule** | No | Varies | The details for more complex and advanced schedules. See **hours**, **minutes**, **weekDays**, **months**, and **monthDays** | 
| **hours** | No | 1 to 24 | An array with the hour marks for when to run the job | 
| **minutes** | No | 0 to 59 | An array with the minute marks for when to run the job | 
| **months** | No | 1 to 12 | An array with the months for when to run the job | 
| **monthDays** | No | Varies | An array with the days of the month for when to run the job | 
| **weekDays** | No | "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" | An array with days of the week for when to run the job | 
| **count** | No | <*none*> | The number of recurrences. The default is to recur infinitely. You can't use both **count** and **endTime**, but the rule that finishes first is honored. | 
| **endTime** | No | <*none*> | The date and time for when to stop the recurrence. The default is to recur infinitely. You can't use both **count** and **endTime**, but the rule that finishes first is honored. | 
||||

For more information about these elements, see 
[Build complex schedules and advanced recurrences](../scheduler/scheduler-advanced-complexity.md).

<a name="retry-policy"></a>

## retryPolicy

For the case when a Scheduler job might fail, you can set up a retry policy, 
which determines whether and how Scheduler retries the action. By default, 
Scheduler retries the job four more times at 30-second intervals. 
You can make this policy more or less aggressive, for example, 
this policy retries an action two times per day:

```json
"retryPolicy": { 
   "retryType": "Fixed",
   "retryInterval": "PT1D",
   "retryCount": 2
},
```

| Property | Required | Value | Description | 
|----------|----------|-------|-------------| 
| **retryType** | Yes | **Fixed**, **None** | Determines whether you specify a retry policy (**fixed**) or not (**none**). | 
| **retryInterval** | No | PT30S | Specifies the interval and frequency between retry attempts in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). The minimum value is 15 seconds, while the maximum value is 18 months. | 
| **retryCount** | No | 4 | Specifies the number of retry attempts. The maximum value is 20. | 
||||

For more information, see 
[High availability and reliability](../scheduler/scheduler-high-availability-reliability.md).

<a name="status"></a>

## state

A job's state is either **Enabled**, **Disabled**, 
**Completed**, or **Faulted**, for example: 

`"state": "Disabled"`

To change jobs to **Enabled** or **Disabled** state, 
you can use the PUT or PATCH operation on those jobs.
However, if a job has **Completed** or **Faulted** state, 
you can't update the state, although you can perform 
the DELETE operation on the job. Scheduler deletes 
completed and faulted jobs after 60 days. 

<a name="status"></a>

## status

After a job starts, Scheduler returns information 
about the job's status through the **status** object, 
which only Scheduler controls. However, you can find 
the **status** object inside the **job** object. 
Here's the information that a job's status includes:

* Time for the previous execution, if any
* Time for the next scheduled execution for jobs in progress
* The number of job executions
* The number of failures, if any
* The number of faults, if any

For example:

```json
"status": {
   "lastExecutionTime": "2007-03-01T13:00:00Z",
   "nextExecutionTime": "2007-03-01T14:00:00Z ",
   "executionCount": 3,
   "failureCount": 0,
   "faultedCount": 0
}
```

## Next steps

* [Build complex schedules and advanced recurrence](scheduler-advanced-complexity.md)
* [Azure Scheduler REST API reference](/rest/api/scheduler)
* [Azure Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)
* [Limits, quotas, default values, and error codes](scheduler-limits-defaults-errors.md)
