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

This guide outlines the steps to setup a subscription for Job Router events and how to receive them.

For more details on Event Grid, please see the [Event Grid documentation][event-grid-overview].

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Create an Event Grid subscription

> [!NOTE]
> Since Job Router is still in preview, the events are not included in the portal UI. You have to use an Azure Resource Manager (ARM) template to create a subscription that references them.

This template deploys an EventGrid subscription on a Storage Queue for Job Router events.
If the storage account, queue or system topic do not exist, they will be created as well.

:::code language="json" source="media/deploy-subscription.json":::

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fdocs.microsoft.com%2Fazure%2Fcommunication-services%2Fhow-tos%2Frouter-sdk%2Fmedia%2Fdeploy-subscription.json)

### Parameters

- **Azure Communication Services Resource Name**: The name of your Azure Communication Services resource. For example, if the endpoint to your resource is https://contoso.communication.azure.net, then set to `contoso`.
- **Storage Name**: The name of your Azure Storage Account. If it does not exist, it will be created.
- **Event Sub Name**: The name of the event subscription to create.
- **System Topic Name**: If you have existing event subscriptions on your ACS resource, find the `System Topic` name in the `Events` tab of your ACS resource. Otherwise, specify a unique name such as the ACS resource name itself.
- **Queue Name**: The name of your Queue within your Storage Account. If it does not exist, it will be created.

### Deployed resources

The following resources are deployed as part of the solution

- **Storage Account**: If the storage account name does not exist.
- **Storage Queue**: If the queue does not exist within the storage account.
- **Event Grid System Topic**: If the topic does not exist.
- **Event Grid Subscription**: A subscription for all Job Router events on the storage queue.

## Quick-start: Receive EventGrid events via an Azure Storage Queue

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

Install the Azure Storage Queues and EventGrid packages.

```console
dotnet add package Azure.Storage.Queues
dotnet add package Azure.Messaging.EventGrid
```

### Receive messages from the queue

Copy the following code snippet and paste into source file: **Program.cs**

```csharp
using Azure.Storage.Queues;
using Azure.Messaging.EventGrid;

// For more detailed tutorials on storage queues, see: https://docs.microsoft.com/azure/storage/queues/storage-tutorial-queues

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

| Events | Subdomain | Description |
|------|:------------:| ---------- |
| [`RouterJobReceived`](#microsoftcommunicationrouterjobreceived) | `Job` | A new job was created for routing |
| [`RouterJobClassified`](#microsoftcommunicationrouterjobclassified)| `Job` | The classification policy was applied to a job |
| [`RouterJobLabelsUpdated`](#microsoftcommunicationrouterjoblabelsupdated) | `Job` | The labels of the job were changed |
| [`RouterJobClassificationFailed`](#microsoftcommunicationrouterjobclassificationfailed) | `Job` | Router failed to classify job using classification policy |
| [`RouterJobCompleted`](#microsoftcommunicationrouterjobcompleted) | `Job` | A job was completed and enters wrap-up |
| [`RouterJobClosed`](#microsoftcommunicationrouterjobclosed) | `Job` | A job was closed and wrap-up is finished |
| [`RouterJobCancelled`](#microsoftcommunicationrouterjobcancelled) | `Job` | A job was canceled |
| [`RouterJobExceptionTriggered`](#microsoftcommunicationrouterjobexceptiontriggered) | `Job` | A job exception has been triggered |
| [`RouterJobExceptionCleared`](#microsoftcommunicationrouterjobexceptioncleared) | `Job` | A job exception has cleared |
| [`RouterWorkerOfferIssued`](#microsoftcommunicationrouterworkerofferissued) | `Worker` | A job was offered to a worker |
| [`RouterWorkerOfferAccepted`](#microsoftcommunicationrouterworkerofferaccepted) | `Worker` | An offer to a worker was accepted |
| [`RouterWorkerOfferDeclined`](#microsoftcommunicationrouterworkerofferdeclined) | `Worker` | An offer to a worker was declined |
| [`RouterWorkerOfferRevoked`](#microsoftcommunicationrouterworkerofferrevoked)  | `Worker` | An offer to a worker was revoked |
| [`RouterWorkerOfferExpired`](#microsoftcommunicationrouterworkerofferexpired)  | `Worker` | An offer to a worker has expired |
| [`RouterWorkerRegistered`](#microsoftcommunicationrouterworkerregistered)  | `Worker` | A worker has been registered |
| [`RouterWorkerDeregistered`](#microsoftcommunicationrouterworkerderegistered)  | `Worker` | A worker has been deregistered |

## Router Events

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
    }
  },
  "eventType": "Microsoft.Communication.RouterJobReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
| jobStatus| `enum` | ❌ | Possible values <ul> <li>PendingClassification</li> </ul> | When this event is sent out, the classification process is yet to have been executed. |
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ✔️ | | `null` when `queueId` is specified for a job |
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job |
| priority | `int` | ✔️ | | Null when `classificationPolicyId` is specified. Non-null value if there is a direct queue assignment. |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

### Microsoft.Communication.RouterJobClassified

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/queue/{queue-id}",
  "data": {
    "queueInfo": {
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
    }
  },
  "eventType": "Microsoft.Communication.RouterJobClassified",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| queueInfo | `QueueInfo` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ✔️ | | `null` when `queueId` is specified for a job (direct queue assignment) |
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job |
| priority | `int` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

### Microsoft.Communication.RouterJobLabelsUpdated

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "b6d8687a-5a1a-42ae-b8b5-ff7ec338c872",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}",
  "data": {
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "jobStatus": "Queued",
    "channelId": "FooVoiceChannelId",
    "classificationPolicyId": "test-policy",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "priority": 5,
    "labelsAddedOrChanged": {
      "English": "5",
      "Office": "7"
    },
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken",
      "English": "5",
      "Office": "7"
    }
  },
  "eventType": "Microsoft.Communication.RouterJobLabelsUpdated",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
| jobStatus| `enum` | ❌ | Possible values <ul> <li>PendingClassification</li> <li>Queued</li> <li>Assigned</li> <li>Completed</li> <li>Closed</li> <li>Canceled</li> <li>ClassificationFailed</li> </ul> |
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ✔️ | | `null` when `queueId` is specified for a job |
| queueId | `string` | ✔️ | | `null` when `classificationPolicyId` is specified for a job |
| priority | `int` | ❌ |
| labelsAddedOrChanged | `Dictionary<string, object>` | ✔️ | | Labels added or changed based on user input. |
| labels | `Dictionary<string, object>` | ✔️ | | Complete set of labels associated with job. |

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
    }
  },
  "eventType": "Microsoft.Communication.RouterJobClassificationFailed",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| errors| `List<CommunicationError>` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| classificationPolicyId | `string` | ❌ | |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

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
    }
    "workerId": ""
  },
  "eventType": "Microsoft.Communication.RouterJobCompleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ | |
| assignmentId| `string` | ❌ | |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |
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
    }
  },
  "eventType": "Microsoft.Communication.RouterJobClosed",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ | |
| dispositionCode| `string` | ✔️ | | Based on user input |
| workerId | `string` | ❌ | |
| assignmentId | `string` | ❌ | |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

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
    "queueId": ""
  },
  "eventType": "Microsoft.Communication.RouterJobCancelled",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:30Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| note| `string` | ✔️ | | Based on user input |
| dispositionCode| `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ✔️ | | Non-null when job is canceled after successful classification. |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

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
    }
  },
  "eventType": "Microsoft.Communication.RouterJobExceptionTriggered",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| ruleKey | `string` | ❌ | |
| exceptionRuleId| `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
| channelId | `string` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

### Microsoft.Communication.RouterJobExceptionCleared

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "job/{job-id}/channel/{channel-id}/exceptionrule/{rulekey}",
  "data": {
    "ruleKey": "r100",
    "jobId": "7f1df17b-570b-4ae5-9cf5-fe6ff64cc712",
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "labels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterJobExceptionCleared",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| ruleKey | `string` | ❌ | |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
| channelId | `string` | ❌ |
| labels | `Dictionary<string, object>` | ✔️ | | Based on user input |

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
    "offerTimeUtc": "2021-06-23T02:43:30.3847144Z",
    "expiryTimeUtc": "2021-06-23T02:44:30.3847674Z",
    "jobPriority": 5,
    "jobLabels": {
      "Locale": "en-us",
      "Segment": "Enterprise",
      "Token": "FooToken"
    }
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferIssued",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| jobId| `string` | ❌ |
| channelReference | `string` | ❌ |
|channelId | `string` | ❌ |
| queueId | `string` | ❌ |
| offerId| `string` | ❌ |
| offerTimeUtc | `DateTimeOffset` | ❌ |
| expiryTimeUtc| `DateTimeOffset` | ❌ |
| jobPriority| `int` | ❌ |
| jobLabels | `Dictionary<string, object>` | ✔️ | | Based on user input |

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
    "channelReference": "test-abc",
    "channelId": "FooVoiceChannelId",
    "queueId": "625fec06-ab81-4e60-b780-f364ed96ade1",
    "offerId": "565fec06-ab81-4e60-b780-f364ed96ade1",
    "assignmentId": "765fec06-ab81-4e60-b780-f364ed96ade1"
  },
  "eventType": "Microsoft.Communication.RouterWorkerOfferAccepted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| jobId| `string` | ❌ |
| jobPriority| `int` | ❌ |
| jobLabels | `Dictionary<string, object>` | ✔️ | | Based on user input |
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
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

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
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

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
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| offerId | `string` | ❌ |
| workerId | `string` | ❌ |
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
        "capacityCostPerJob": 10
      }
    ]
  },
  "eventType": "Microsoft.Communication.RouterWorkerRegistered",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:31Z"
}
```

**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |
| totalCapacity | `int` | ❌ |
| queueAssignments| `List<QueueInfo>` | ❌ |
| labels| `Dictionary<string, object>` | ✔️ | | Based on user input |
| channelConfigurations| `List<ChannelConfiguration>` | ❌ |

### Microsoft.Communication.RouterWorkerDeregistered

[Back to Event Catalog](#events-catalog)

```json
{
  "id": "1027db4a-17fe-4a7f-ae67-276c3120a29f",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "worker/{worker-id}",
  "data": {
    "workerId": "worker3",
  },
  "eventType": "Microsoft.Communication.RouterWorkerDeregistered",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2021-06-23T02:43:31Z"
}
```
**Attribute list**

| Attribute | Type | Nullable |Description | Notes |
|:--------- |:-----:|:-------:|-------------|-------|
| workerId | `string` | ❌ |

<!-- LINKS -->
[event-grid-overview]: https://docs.microsoft.com/azure/event-grid/overview
[filter-events]: https://docs.microsoft.com/azure/event-grid/how-to-filter-events
