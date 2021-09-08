---
title:  Overview of DICOM Change Feed - Azure Healthcare APIs
description: In this article, you'll learn the concepts of DICOM Change Feed.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/04/2021
ms.author: aersoy
---

# Change Feed Overview

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Change Feed provides logs of all the changes that occur in the DICOM service. The Change Feed provides ordered, guaranteed, immutable, and read-only logs of these changes. The Change Feed offers the ability to go through the history of the DICOM service and acts upon the creates and deletes in the service.

Client applications can read these logs at any time, either in streaming, or in batch mode. The Change Feed enables you to build efficient and scalable solutions that process change events that occur in your DICOM service.

You can process these change events asynchronously, incrementally or in-full. Any number of client applications can independently read the Change Feed, in parallel, and at their own pace.

Make sure to specify the version as part of the URL when making requests. More information can be found in the [API Versioning for DICOM service Documentation](api-versioning-dicom-service.md).

## API Design

The API exposes two `GET` endpoints for interacting with the Change Feed. A typical flow for consuming the Change Feed is [provided below](#example-usage-flow).

Verb | Route              | Returns     | Description
:--- | :----------------- | :---------- | :---
GET  | /changefeed        | JSON Array  | [Read the Change Feed](#read-change-feed)
GET  | /changefeed/latest | JSON Object | [Read the latest entry in the Change Feed](#get-latest-change-feed-item)

### Object model

Field               | Type      | Description
:------------------ | :-------- | :---
Sequence            | int       | The sequence ID that can be used for paging (via offset) or anchoring
StudyInstanceUid    | string    | The study instance UID
SeriesInstanceUid   | string    | The series instance UID
SopInstanceUid      | string    | The sop instance UID
Action              | string    | The action that was performed - either `create` or `delete`
Timestamp           | datetime  | The date and time the action was performed in UTC
State               | string    | [The current state of the metadata](#states)
Metadata            | object    | Optionally, the current DICOM metadata if the instance exists

#### States

State    | Description
:------- | :---
current  | This instance is the current version.
replaced | This instance has been replaced by a new version.
deleted  | This instance has been deleted and is no longer available in the service.

### Read Change Feed

**Route**: /changefeed?offset={int}&limit={int}&includemetadata={**true**|false}
```
[
    {
        "Sequence": 1,
        "StudyInstanceUid": "{uid}",
        "SeriesInstanceUid": "{uid}",
        "SopInstanceUid": "{uid}",
        "Action": "create|delete",
        "Timestamp": "2020-03-04T01:03:08.4834Z",
        "State": "current|replaced|deleted",
        "Metadata": {
            "actual": "metadata"
        }
    },
    {
        "Sequence": 2,
        "StudyInstanceUid": "{uid}",
        "SeriesInstanceUid": "{uid}",
        "SopInstanceUid": "{uid}",
        "Action": "create|delete",
        "Timestamp": "2020-03-05T07:13:16.4834Z",
        "State": "current|replaced|deleted",
        "Metadata": {
            "actual": "metadata"
        }
    }
    ...
]
```
#### Parameters

Name            | Type | Description
:-------------- | :--- | :---
offset          | int  | The number of records to skip before the values to return
limit           | int  | The number of records to return (default: 10, min: 1, max: 100)
includemetadata | bool | Whether or not to include the metadata (default: true)

### Get latest Change Feed item

**Route**: /changefeed/latest?includemetadata={**true**|false}

```
{
    "Sequence": 2,
    "StudyInstanceUid": "{uid}",
    "SeriesInstanceUid": "{uid}",
    "SopInstanceUid": "{uid}",
    "Action": "create|delete",
    "Timestamp": "2020-03-05T07:13:16.4834Z",
    "State": "current|replaced|deleted",
    "Metadata": {
        "actual": "metadata"
    }
}
```

#### Parameters

Name            | Type | Description
:-------------- | :--- | :---
includemetadata | bool | Whether or not to include the metadata (default: true)

## Usage

### Example usage flow

Below is the usage flow for an example application that does other processing on the instances within the DICOM service.

1. Application that wants to monitor the Change Feed starts.
2. It determines if there's a current state that it should start with:
   * If it has a state, it uses the offset (sequence) stored.
   * If it has never started and wants to start from beginning, it uses `offset=0`.  
   * If it only wants to process from now, it queries `/changefeed/latest` to obtain the last sequence.
3. It queries the Change Feed with the given offset `/changefeed?offset={offset}`
4. If there are entries:
   * It performs extra processing.  
   * It updates its current state.  
   * It starts again above at step 2.
5. If there are no entries, it sleeps for a configured amount of time and starts back at step 2.

### Other potential usage patterns

Change Feed support is well suited for scenarios that process data based on objects that have changed. For example, it can be used to:

* Build connected application pipelines like ML that react to change events or schedule executions based on created or deleted instance.
* Extract business analytics insights and metrics, based on changes that occur to your objects.
* Poll the Change Feed to create an event source for push notifications.

## Summary

In this article, we reviewed the REST API design of Change Feed and potential usage scenarios. For information on Change Feed, see [Pull changes from Change Feed](pull-dicom-changes-from-change-feed.md).

## Next steps

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)

