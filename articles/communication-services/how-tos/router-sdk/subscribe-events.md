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

This guide outlines the steps to subscribe to Job Router events from your Azure Communication Services Event Grid subscription. Receiving events is a critical capability your custom applications will need to perform. The actions Job Router will perform on Jobs you submit happen asynchronously and while the SDK provides endpoints to query the status and state of objects in the system, building a reactive event-driven custom application has significant benefits.

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)
- Install the [Azure Resource Manager (ARM) client](https://github.com/projectkudu/ARMClient)
- Review the [GitHub sample project using a customized version of the Event Grid Viewer for Job Router](https://github.com/Azure/communication-preview/tree/master/samples/Job-Router/Event-Grid-Viewer)

## Create an Event Grid subscription

> [!NOTE]
> The following scripts are being executed using PowerShell

**Log into your Azure account**

```powershell
armclient azlogin
```

**Set subscription and resource group name**
```powershell
$env:SUB = 'subscriptions/<insert_subscription_id>'
$env:RG = 'resourcegroups/<insert_resource_group_name>'
```

**List all ACS resources in subscription**
```powershell
armclient get "/$env:SUB/$env:RG/providers/Microsoft.Communication/communicationservices?api-version=2020-08-20"
```
**Output**

:::image type="content" source="media/create-subscription-output.png" alt-text="Output of PowerShell command":::

As we can see, there is currently only one Azure Communication Services resource under the given subscription and resource group.

**Set PowerShell variables**

Set the name of your Azure Communication Services resource. For example, if the endpoint to your resource is `https://contoso.communication.azure.net`, then set `ACS_RESOURCE_NAME` to the prefix of the DNS name; `contoso`.

```powershell
$env:ACS_RESOURCE_NAME = "<insert_acs_resource_name>"
$env:ACS_RESOURCE_ARM_ID = "/$env:SUB/$env:RG/providers/Microsoft.Communication/CommunicationServices/$env:ACS_RESOURCE_NAME"
$env:API_VERSION = "?api-version=2020-06-01"
$env:EVENT_SUBSCRIPTIONS_PATH = "providers/Microsoft.EventGrid/eventSubscriptions"
$env:EVENT_SUBSCRIPTION_NAME = "RouterEventsSubScription_All"
```

**Create a new event subscription for Router events**

Copy and paste the following json payload in a text file named `test.json`.

*Sample payload*
```json
{
  "properties": {
    "destination": {
      "endpointType": "WebHook",
      "properties": {
        "endpointUrl": "<insert_webhook_path_here>"
      }
    },
    "filter": {
      "includedEventTypes": [
        "Microsoft.Communication.RouterJobReceived",
        "Microsoft.Communication.RouterJobClassified",
        "Microsoft.Communication.RouterJobLabelsUpdated",
        "Microsoft.Communication.RouterJobClassificationFailed",
        "Microsoft.Communication.RouterJobCompleted",
        "Microsoft.Communication.RouterJobClosed",
        "Microsoft.Communication.RouterJobCancelled",
        "Microsoft.Communication.RouterJobExceptionTriggered",
        "Microsoft.Communication.RouterWorkerOfferIssued",
        "Microsoft.Communication.RouterWorkerOfferAccepted",
        "Microsoft.Communication.RouterWorkerOfferDeclined",
        "Microsoft.Communication.RouterWorkerOfferRevoked",
        "Microsoft.Communication.RouterWorkerOfferExpired",
        "Microsoft.Communication.RouterWorkerRegistered",
        "Microsoft.Communication.RouterWorkerDeregistered"
      ],
      "subjectBeginsWith": "",
      "subjectEndsWith": ""
    }
  }
}
```

**Create the event subscription**
```powershell
armclient put "$env:ACS_RESOURCE_ARM_ID/$env:EVENT_SUBSCRIPTIONS_PATH/$env:EVENT_SUBSCRIPTION_NAME/$env:API_VERSION" .\test.json
```
**Output**

:::image type="content" source="media/create-subscription.png" alt-text="Create event subscription":::

As we can see, the event subscription is being created and is currently in a state of `Creating`. It generally takes a few seconds to create.

**Verify the event subscription was successfully created**
```powershell
armclient get "$env:ACS_RESOURCE_ARM_ID/$env:EVENT_SUBSCRIPTIONS_PATH/$env:API_VERSION"
```

**Output**

:::image type="content" source="media/verify-subscription-created.png" alt-text="Verify subscription was created":::

As we can see the event subscription has been successfully created now for all Router events.

## Creating a subscription with filters

While setting up event subscriptions, you can also use advanced filters controlling the exact events that needs to sent to a particular subscription. For example, given the sample below, only `RouterJobCancelled` events are subscribed to and sent to the webhook under the following conditions:

- The job **priority** is greater than `5`
- The job was assigned to an escalation queue
- The job was canceled due to inactivity
- The disposition code for canceled Jobs ends with `_JobCancelledDueToInactivity`
- The Queue ID ends with the name `EscalationQueue`

```json
{
  "properties": {
    "destination": {
      "endpointType": "WebHook",
      "properties": {
        "endpointUrl": "<insert_webhook_path_here>",
        "maxEventsPerBatch": 1,
        "preferredBatchSizeInKilobytes": 64
      }
    },
    "filter": {
      "subjectEndsWith": "_JobCancelledDueToInactivity",
      "isSubjectCaseSensitive": true,
      "includedEventTypes": [
        "Microsoft.Communication.RouterJobCancelled"
      ],
      "advancedFilters": [
        {
          "operatorType": "NumberGreaterThan",
          "key": "data.priority",
          "value": 5
        },
        {
          "operatorType": "StringEndsWith",
          "key": "data.queueId",
          "values": [
            "EscalationQueue"
          ]
        }
      ],
      "enableAdvancedFilteringOnArrays": true
    }
  }
}
```

Copy and paste the above json payload in a text and name it `test-with-advanced-filters.json` then execute the following PowerShell code:

```powershell
$env:API_VERSION = "?api-version=2020-10-15-preview"
$env:EVENT_SUBSCRIPTION_NAME = "RouterEventsSubScription_WithFilters"
armclient put "$env:ACS_RESOURCE_ARM_ID/$env:EVENT_SUBSCRIPTIONS_PATH/$env:EVENT_SUBSCRIPTION_NAME/$env:API_VERSION" .\test-with-advanced-filters.json
```

**Output**

:::image type="content" source="media/advanced-filters.png" alt-text="Advanced filters output":::

> [!NOTE]
> For a complete list of operators that can be used while creating subscriptions, refer to [Event Grid | Event Filtering - Operators](../../../event-grid/event-filtering.md)

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
