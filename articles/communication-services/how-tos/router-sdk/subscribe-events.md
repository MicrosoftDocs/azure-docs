---
title: Subscribe to events in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to subscribe to Job Router events from Event Grid
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/14/2021
ms.custom: template-how-to

---

# Subscribe to Job Router events

This guide outlines the steps to set up a subscription for Job Router events and how to receive them.

For more details on Event Grid, see the [Event Grid documentation][event-grid-overview].

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Create an Event Grid subscription

This template deploys an Event Grid subscription on a Storage Queue for Job Router events.
If the storage account, queue or system topic doesn't exist, they'll be created as well.

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoftDocs%2Fazure-docs%2Fmain%2Farticles%2Fcommunication-services%2Fhow-tos%2Frouter-sdk%2Fmedia%2Fdeploy-subscription.json)

### Parameters

- **Azure Communication Services Resource Name**: The name of your Azure Communication Services resource. For example, if the endpoint to your resource is `https://contoso.communication.azure.net`, then set to `contoso`.
- **Storage Name**: The name of your Azure Storage Account. If it doesn't exist, it will be created.
- **Event Sub Name**: The name of the event subscription to create.
- **System Topic Name**: If you have existing event subscriptions on your Azure Communication Services resource, find the `System Topic` name in the `Events` tab of your Azure Communication Services resource. Otherwise, specify a unique name such as the Azure Communication Services resource name itself.
- **Queue Name**: The name of your Queue within your Storage Account. If it doesn't exist, it will be created.

### Deployed resources

The following resources are deployed as part of the solution

- **Storage Account**: If the storage account name doesn't exist.
- **Storage Queue**: If the queue doesn't exist within the storage account.
- **Event Grid System Topic**: If the topic doesn't exist.
- **Event Grid Subscription**: A subscription for all Job Router events on the storage queue.

## Quick-start: Receive Event Grid events via an Azure Storage Queue

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `EventReceiver`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o EventReceiver
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd EventReceiver
dotnet build
```

### Install the packages

Install the Azure Storage Queues and Event Grid packages.

```console
dotnet add package Azure.Storage.Queues
dotnet add package Azure.Messaging.EventGrid
```

### Receive messages from the queue

Copy the following code snippet and paste into source file: **Program.cs**

```csharp
using Azure.Storage.Queues;
using Azure.Messaging.EventGrid;

// For more detailed tutorials on storage queues, see: https://learn.microsoft.com/azure/storage/queues/storage-tutorial-queues

var queueClient = new QueueClient("<Storage Account Connection String>", "router-events");

while (true)
{
    var msg = await queueClient.ReceiveMessageAsync();
    if (msg.Value == null)
    {
        await Task.Delay(TimeSpan.FromSeconds(1));
        continue;
    }
    var json = Convert.FromBase64String(msg.Value.Body.ToString());
    var evt = EventGridEvent.Parse(BinaryData.FromBytes(json));

    Console.WriteLine($"Received event: {evt.EventType} - {evt.Subject} - {evt.Data}");

    await queueClient.DeleteMessageAsync(msg.Value.MessageId, msg.Value.PopReceipt);
}
```

### Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

## Events Catalog

## Router Events

| Events | Subdomain | Description |
|------|:------------:| ---------- |
| [`RouterJobReceived`](#microsoftcommunicationrouterjobreceived) | `Job` | A new job was created for routing |
| [`RouterJobClassified`](#microsoftcommunicationrouterjobclassified)| `Job` | The classification policy was applied to a job |
| [`RouterJobQueued`](#microsoftcommunicationrouterjobqueued)  | `Job` | A job has been successfully enqueued |
| [`RouterJobClassificationFailed`](#microsoftcommunicationrouterjobclassificationfailed) | `Job` | Router failed to classify job using classification policy |
| [`RouterJobCompleted`](#microsoftcommunicationrouterjobcompleted) | `Job` | A job was completed and enters wrap-up |
| [`RouterJobClosed`](#microsoftcommunicationrouterjobclosed) | `Job` | A job was closed and wrap-up is finished |
| [`RouterJobCancelled`](#microsoftcommunicationrouterjobcancelled) | `Job` | A job was canceled |
| [`RouterJobExceptionTriggered`](#microsoftcommunicationrouterjobexceptiontriggered) | `Job` | A job exception has been triggered |
| [`RouterJobWorkerSelectorsExpired`](#microsoftcommunicationrouterjobworkerselectorsexpired)  | `Job` |  One or more worker selectors on a job have expired  |
| [`RouterJobUnassigned`](#microsoftcommunicationrouterjobunassigned)  | `Job` |  An already assigned job  has been unassigned from a worker |
| [`RouterJobWaitingForActivation`](#microsoftcommunicationrouterjobwaitingforactivation)  | `Job` |  A scheduled job's requested scheduled time has arrived, Router is waiting on contoso to act on the job |
| [`RouterJobSchedulingFailed`](#microsoftcommunicationrouterjobschedulingfailed)  | `Job` |  A scheduled job was requested however, Router failed to create one |
| [`RouterJobDeleted`](#microsoftcommunicationrouterjobdeleted)  | `Job` |  A job has been deleted |
| [`RouterWorkerOfferIssued`](#microsoftcommunicationrouterworkerofferissued) | `Worker` | A job was offered to a worker |
| [`RouterWorkerOfferAccepted`](#microsoftcommunicationrouterworkerofferaccepted) | `Worker` | An offer to a worker was accepted |
| [`RouterWorkerOfferDeclined`](#microsoftcommunicationrouterworkerofferdeclined) | `Worker` | An offer to a worker was declined |
| [`RouterWorkerOfferRevoked`](#microsoftcommunicationrouterworkerofferrevoked)  | `Worker` | An offer to a worker was revoked |
| [`RouterWorkerOfferExpired`](#microsoftcommunicationrouterworkerofferexpired)  | `Worker` | An offer to a worker has expired |
| [`RouterWorkerRegistered`](#microsoftcommunicationrouterworkerregistered)  | `Worker` | A worker has been registered (status changed from inactive/draining to active) |
| [`RouterWorkerDeregistered`](#microsoftcommunicationrouterworkerderegistered)  | `Worker` | A worker has been deregistered (status changed from active to inactive/draining) |
| [`RouterWorkerDeleted`](#microsoftcommunicationrouterworkerdeleted)  | `Worker` | A worker has been deleted |

### Microsoft.Communication.RouterJobReceived

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "acdf8fa5-8ab4-4a65-874a-c1d2a4a97f2e",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "jobStatus": "PendingClassification",
    "channelId": "FooVoiceChannelId",
    "classificationPolicyId": "test-policy",
    "queueId": "queue-id",
    "priority": 0,
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "requestedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttlSeconds": 50,
        "expirationTime": "2022-02-17T00:58:25.1736293Z"
      }
    ],
    "scheduledOn": "3/28/2007 7:13:50 PM +00:00",
    "unavailableForMatching": false
  },
  "eventType": "Microsoft.Communication.RouterJobReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable | Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
| jobStatus| `enum` | ❌ | Possible values PendingClassification, Queued | When this event is sent out, classification process is yet to have been executed or job was created with an associated queueId.
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ✔️ | | `null` when `queueId` is specified for a job
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job
| priority | `int` | ✔️ | | Null when `classificationPolicyId` is specified. Non-null value in case of direct queue assignment.
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| requestedWorkerSelectors | `List<WorkerSelector>` | ✔️ | | Based on user input
| scheduledOn | `DateTimeOffset` | ✔️ | | Based on user input
| unavailableForMatching | `bool` | ✔️ | | Based on user input

### Microsoft.Communication.RouterJobClassified

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/queue/{queue-id}",
  "data": {
    "queueDetails": {
      "id": "625fec06-ab81-4e60-b780-f364ed96ade1",
      "name": "Queue 1",
      "labels": {
        "Language": "en",
        "Product": "Office",
        "Geo": "NA"
      }
    },
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "classificationPolicyId": "test-policy",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "priority": 5,
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "attachedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ]
  },
  "eventType": "Microsoft.Communication.RouterJobClassified",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable | Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| queueDetails | `QueueDetails` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ❌ | |
| queueId | `string` | ✔️ | | `null` when `classificationPolicy` is not used for queue selection
| priority | `int` | ✔️ | | `null` when `classificationPolicy` is not used for applying priority on job
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| attachedWorkerSelectors | `List<WorkerSelector>` | ✔️ | | List of worker selectors attached by a classification policy

### Microsoft.Communication.RouterJobQueued

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/queue/{queue-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "priority": 1,
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "requestedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ],
    "attachedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ]
  },
  "eventType": "Microsoft.Communication.RouterJobQueued",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ✔️ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ | |
| priority | `int` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| requestedWorkerSelectors | `List<WorkerSelector>` | ✔️ | | Based on user input while creating job
| attachedWorkerSelectors | `List<WorkerSelector>` | ✔️ | | List of worker selectors attached by a classification policy

### Microsoft.Communication.RouterJobClassificationFailed

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/classificationpolicy/{classificationpolicy-id}",
  "data": {
    "errors": [
      {
        "code": null,
        "message": "Classification failed due to <reason>",
        "target": null,
        "innerError": null,
        "details": null
      }
    ],
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "classificationPolicyId": "test-policy",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterJobClassificationFailed",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| errors| `List<CommunicationError>` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ❌ | |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input

### Microsoft.Communication.RouterJobCompleted

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/assignment/{assignment-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "queue-id",
    "assignmentId": "6f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "workerId": "e3a3f2f9-3582-4bfe-9c5a-aa57831a0f88"
  },
  "eventType": "Microsoft.Communication.RouterJobCompleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ | |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| assignmentId| `string` | ❌ | |
| workerId | `string` | ❌ | |

### Microsoft.Communication.RouterJobClosed

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/assignment/{assignment-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "",
    "dispositionCode": "",
    "workerId": "",
    "assignmentId": "",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterJobClosed",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ | |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| dispositionCode| `string` | ✔️ | | Based on user input
| workerId | `string` | ❌ | |
| assignmentId | `string` | ❌ | |

### Microsoft.Communication.RouterJobCancelled

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/disposition/{disposition-code}",
  "data": {
    "note": "Cancelled due to <reason>",
    "dispositionCode": "100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "queueId": ""
  },
  "eventType": "Microsoft.Communication.RouterJobCancelled",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| note| `string` | ✔️ | | Based on user input
| dispositionCode| `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| queueId | `string` | ✔️ | |

### Microsoft.Communication.RouterJobExceptionTriggered

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/exceptionrule/{rulekey}",
  "data": {
    "ruleKey": "r100",
    "exceptionRuleId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterJobExceptionTriggered",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| ruleKey | `string` | ❌ | |
| exceptionRuleId| `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
| channelId | `string` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input

### Microsoft.Communication.RouterJobWorkerSelectorsExpired

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/queue/{queue-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "requestedWorkerSelectorsExpired": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ],
    "attachedWorkerSelectorsExpired": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ]
  },
  "eventType": "Microsoft.Communication.RouterJobWorkerSelectorsExpired",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ✔️ |
| queueId | `string` | ❌ | |
| channelId | `string` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| requestedWorkerSelectorsExpired | `List<WorkerSelector>` | ✔️ | | Based on user input while creating a job
| attachedWorkerSelectorsExpired | `List<WorkerSelector>` | ✔️ | | List of worker selectors attached by a classification policy

### Microsoft.Communication.RouterJobUnassigned

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "acdf8fa5-8ab4-4a65-874a-c1d2a4a97f2e",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/assignment/{assignment-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "assignmentId": "",
    "workerId": "",
    "channelId": "FooVoiceChannelId",
    "channelReference": "test-abc",
    "queueId": "queue-id",    
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterJobUnassigned",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| assignmentId | `string` | ❌ |
| workerId | `string` | ❌ |
| channelId | `string` | ❌ |
| channelReference | `string` | ❌ |
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input

### Microsoft.Communication.RouterJobWaitingForActivation

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "acdf8fa5-8ab4-4a65-874a-c1d2a4a97f2e",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelId": "FooVoiceChannelId",
    "channelReference": "test-abc",
    "queueId": "queue-id",    
    "priority": 1,
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "requestedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ],
    "attachedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ],
    "scheduledOn": "2022-02-17T00:55:25.1736293Z",
    "unavailableForMatching": false
  },
  "eventType": "Microsoft.Communication.RouterJobWaitingForActivation",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelId | `string` | ❌ |
| channelReference | `string` | ❌ |
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| requestedWorkerSelectorsExpired | `List<WorkerSelector>` | ✔️ | | Based on user input while creating a job
| attachedWorkerSelectorsExpired | `List<WorkerSelector>` | ✔️ | | List of worker selectors attached by a classification policy
| scheduledOn | `DateTimeOffset` |✔️ | | Based on user input while creating a job
| unavailableForMatching | `bool` |✔️ | | Based on user input while creating a job
| priority| `int` | ❌ | | Based on user input while creating a job

### Microsoft.Communication.RouterJobSchedulingFailed

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "acdf8fa5-8ab4-4a65-874a-c1d2a4a97f2e",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelId": "FooVoiceChannelId",
    "channelReference": "test-abc",
    "queueId": "queue-id",    
    "priority": 1,
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "requestedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ],
    "attachedWorkerSelectors": [
      {
        "key": "string",
        "labelOperator": "equal",
        "value": 5,
        "ttl": "P3Y6M4DT12H30M5S"
      }
    ],
    "scheduledOn": "2022-02-17T00:55:25.1736293Z",
    "failureReason": "Error"
  },
  "eventType": "Microsoft.Communication.RouterJobSchedulingFailed",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelId | `string` | ❌ |
| channelReference | `string` | ❌ |
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input
| requestedWorkerSelectorsExpired | `List<WorkerSelector>` | ✔️ | | Based on user input while creating a job
| attachedWorkerSelectorsExpired | `List<WorkerSelector>` | ✔️ | | List of worker selectors attached by a classification policy
| scheduledOn | `DateTimeOffset` |✔️ | | Based on user input while creating a job
| failureReason | `string` |✔️ | | System determined
| priority| `int` |❌ | | Based on user input while creating a job

### Microsoft.Communication.RouterJobDeleted

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "acdf8fa5-8ab4-4a65-874a-c1d2a4a97f2e",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "queueId": ""
  },
  "eventType": "Microsoft.Communication.RouterJobDeleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |

## Worker Events

### Microsoft.Communication.RouterWorkerOfferIssued

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}/job/{job-id}",
  "data": {
    "workerId": "w100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "offerId": "525fec06-ab81-4e60-b780-f364ed96ade1",
    "offeredOn": "2021-06-23T02:43:30.3847144Z",
    "expiresOn": "2021-06-23T02:44:30.3847674Z",
    "jobPriority": 5,
    "jobLabels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "jobTags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferIssued",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ |
| offerId| `string` | ❌ |
| offeredOn | `DateTimeOffset` | ❌ |
| expiresOn | `DateTimeOffset` | ❌ |
| jobPriority| `int` | ❌ |
| jobLabels | `Dictionary<string, object>` | ✔️ | | Based on user input
| jobTags | `Dictionary<string, object>` | ✔️ | | Based on user input

### Microsoft.Communication.RouterWorkerOfferAccepted

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}/job/{job-id}",
  "data": {
    "workerId": "w100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "jobPriority": 5,
    "jobLabels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "jobTags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    },
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "offerId": "565fec06-ab81-4e60-b780-f364ed96ade1",
    "assignmentId": "765fec06-ab81-4e60-b780-f364ed96ade1"
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferAccepted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| jobId| `string` | ❌ |
| jobPriority| `int` | ❌ |
| jobLabels | `Dictionary<string, object>` | ✔️ | | Based on user input
| jobTags | `Dictionary<string, object>` | ✔️ | | Based on user input
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ |
| offerId | `string` | ❌ |
| assignmentId | `string` | ❌ |

### Microsoft.Communication.RouterWorkerOfferDeclined

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}/job/{job-id}",
  "data": {
    "workerId": "w100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "offerId": "565fec06-ab81-4e60-b780-f364ed96ade1",
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferDeclined",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ |
| offerId | `string` | ❌ |

### Microsoft.Communication.RouterWorkerOfferRevoked

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}/job/{job-id}",
  "data": {
    "offerId": "565fec06-ab81-4e60-b780-f364ed96ade1",
    "workerId": "w100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1"
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferRevoked",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| offerId | `string` | ❌ |
| workerId | `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ |

### Microsoft.Communication.RouterWorkerOfferExpired

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}/job/{job-id}",
  "data": {
    "offerId": "565fec06-ab81-4e60-b780-f364ed96ade1",
    "workerId": "w100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1"
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferExpired",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| offerId | `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ |

### Microsoft.Communication.RouterWorkerRegistered

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}",
  "data": {
    "workerId": "worker3",
    "totalCapacity": 100,
    "queueAssignments": [
      {
        "id": "MyQueueId2",
        "name": "Queue 3",
        "labels": {
          "Language": "en",
          "Product": "Office",
          "Geo": "NA"
        }
      }
    ],
    "labels": {
      "x": "111",
      "y": "111"
    },
    "channelConfigurations": [
      {
        "channelId": "FooVoiceChannelId",
        "capacityCostPerJob": 10,
        "maxNumberOfJobs": 5
      }
    ],
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterWorkerRegistered",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable | Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| totalCapacity | `int` | ❌ |
| queueAssignments | `List<QueueDetails>` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| channelConfigurations| `List<ChannelConfiguration>` | ❌ |
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input

### Microsoft.Communication.RouterWorkerDeregistered

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}",
  "data": {
    "workerId": "worker3"
  },
  "eventType": "Microsoft.Communication.RouterWorkerDeregistered",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |

### Microsoft.Communication.RouterWorkerDeleted

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}",
  "data": {
    "workerId": "worker3",
    "totalCapacity": 100,
    "queueAssignments": [
      {
        "id": "MyQueueId2",
        "name": "Queue 3",
        "labels": {
          "Language": "en",
          "Product": "Office",
          "Geo": "NA"
        }
      }
    ],
    "labels": {
      "x": "111",
      "y": "111"
    },
    "channelConfigurations": [
      {
        "channelId": "FooVoiceChannelId",
        "capacityCostPerJob": 10,
        "maxNumberOfJobs": 5
      }
    ],
    "tags": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterWorkerDeleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2022-02-17T00:55:25.1736293Z"
}
```

#### Attribute list

| Attribute | Type | Nullable | Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| totalCapacity | `int` | ❌ |
| queueAssignments | `List<QueueDetails>` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input
| channelConfigurations| `List<ChannelConfiguration>` | ❌ |
| tags | `Dictionary<string, object>` | ✔️ | | Based on user input

## Model Definitions

### QueueDetails

```csharp
public class QueueDetails
{
    public string Id { get; set; }
    public string Name { get; set; }
    public Dictionary<string, object>? Labels { get; set; }
}
```

### CommunicationError

```csharp
public class CommunicationError
{
    public string? Code { get; init; }
    public string Message { get; init; }
    public string? Target { get; init; }
    public CommunicationError? InnerError { get; init; }
    public IEnumerable<CommunicationError>? Details { get; init; }
}
```

### ChannelConfiguration

```csharp
public class ChannelConfiguration
{
    public string ChannelId { get; set; }
    public int CapacityCostPerJob { get; set; }
    public int? MaxNumberOfJobs { get; set; }
}
```

### WorkerSelector

```csharp
public class WorkerSelector
{
    public string Key { get; set; }
    public LabelOperator LabelOperator { get; set; }
    public object Value { get; set; }
    public double? TTLSeconds { get; set; }
    public WorkerSelectorState State { get; set; }
    public DateTimeOffset? ExpireTime { get; set; }
}

public enum WorkerSelectorState
{
    Active = 0,
    Expired = 1
}

public enum LabelOperator
{
    Equal,
    NotEqual,
    LessThan,
    LessThanEqual,
    GreaterThan,
    GreaterThanEqual,
}
```

<!-- LINKS -->
[event-grid-overview]: ../../../event-grid/overview.md
