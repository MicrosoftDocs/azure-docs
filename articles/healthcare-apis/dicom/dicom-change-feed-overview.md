---
title:  Overview of DICOM change feed - Azure Health Data Services
description: In this article, you'll learn the concepts of DICOM change feed.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 10/9/2023
ms.author: mmitrik
---

# Change feed Overview

The change feed provides logs of all the changes that occur in the DICOM&reg; service. The change feed provides ordered, guaranteed, immutable, and read-only logs of these changes. The change feed offers the ability to go through the history of DICOM service and acts upon the creates and deletes in the service.

Client applications can read these logs at any time in batches of any size. The change feed enables you to build efficient and scalable solutions that process change events that occur in your DICOM service.

You can process these change events asynchronously, incrementally or in-full. Any number of client applications can independently read the change feed, in parallel, and at their own pace.

As of v2 of the API, the change feed can be queried for a particular time window.

Make sure to specify the version as part of the URL when making requests. More information can be found in the [API Versioning for DICOM service Documentation](api-versioning-dicom-service.md).

## API Design

The API exposes two `GET` endpoints for interacting with the change feed. A typical flow for consuming the change feed is [provided below](#usage).

Verb | Route              | Returns     | Description
:--- | :----------------- | :---------- | :---
GET  | /changefeed        | JSON Array  | [Read the change feed](#change-feed)
GET  | /changefeed/latest | JSON Object | [Read the latest entry in the change feed](#latest-change-feed)

### Object model

Field               | Type      | Description
:------------------ | :-------- | :---
Sequence            | long      | The unique ID per change event
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

## Change feed

The change feed resource is a collection of events that have occurred within the DICOM server.

### Version 2

#### Request
```http
GET /changefeed?startTime={datetime}&endtime={datetime}&offset={int}&limit={int}&includemetadata={bool} HTTP/1.1
Accept: application/json
Content-Type: application/json
```

#### Response
```json
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
            // DICOM JSON
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
            // DICOM JSON
        }
    },
    //...
]
```
#### Parameters

Name            | Type     | Description | Default | Min | Max |
:-------------- | :------- | :---------- | :------ | :-- | :-- |
offset          | long     | The number of events to skip from the beginning of the result set | `0` | `0` | |
limit           | int      | The maximum number of events to return | `100` | `1` | `200` |
startTime       | DateTime | The inclusive start time for change events | `"0001-01-01T00:00:00Z"` | `"0001-01-01T00:00:00Z"` | `"9999-12-31T23:59:59.9999998Z"`|
endTime         | DateTime | The exclusive end time for change events | `"9999-12-31T23:59:59.9999999Z"` | `"0001-01-01T00:00:00.0000001"` | `"9999-12-31T23:59:59.9999999Z"` |
includeMetadata | bool     | Indicates whether or not to include the DICOM metadata | `true` | | |

### Version 1

#### Request
```http
GET /changefeed?offset={int}&limit={int}&includemetadata={bool} HTTP/1.1
Accept: application/json
Content-Type: application/json
```

#### Response
```json
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
            // DICOM JSON
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
            // DICOM JSON
        }
    },
    // ...
]
```

#### Parameters
Name            | Type     | Description | Default | Min | Max |
:-------------- | :------- | :---------- | :------ | :-- | :-- |
offset          | long     | The exclusive starting sequence number for events | `0` | `0` | |
limit           | int      | The maximum value of the sequence number relative to the offset. For example, if the offset is 10 and the limit is 5, then the maximum sequence number returned will be 15. | `10` | `1` | `100` |
includeMetadata | bool     | Indicates whether or not to include the DICOM metadata | `true` | | |

## Latest change feed
The latest change feed resource represents the latest event that has occurred within the DICOM Server.

### Request
```http
GET /changefeed/latest?includemetadata={bool} HTTP/1.1
Accept: application/json
Content-Type: application/json
```

### Response
```json
{
    "Sequence": 2,
    "StudyInstanceUid": "{uid}",
    "SeriesInstanceUid": "{uid}",
    "SopInstanceUid": "{uid}",
    "Action": "create|delete",
    "Timestamp": "2020-03-05T07:13:16.4834Z",
    "State": "current|replaced|deleted",
    "Metadata": {
        //DICOM JSON
    }
}
```

### Parameters

Name            | Type | Description | Default |
:-------------- | :--- | :---------- | :------ |
includeMetadata | bool | Indicates whether or not to include the metadata | `true` |

## Usage

### User application

#### Version 2

1. An application regularly queries the change feed on some time interval
    * For example, if querying every hour, a query for the change feed may look like `/changefeed?startTime=2023-05-10T16:00:00Z&endTime=2023-05-10T17:00:00Z`
    * If starting from the beginning, the change feed query may omit the `startTime` to read all of the changes up to, but excluding, the `endTime`
        * E.g. `/changefeed?endTime=2023-05-10T17:00:00Z`
2. Based on the `limit` (if provided), an application continues to query for additional pages of change events if the number of returned events is equal to the `limit` (or default) by updating the offset on each subsequent query
    * For example, if the `limit` is `100`, and 100 events are returned, then the subsequent query would include `offset=100` to fetch the next "page" of results. The below queries demonstrate the pattern:
        * `/changefeed?offset=0&limit=100&startTime=2023-05-10T16:00:00Z&endTime=2023-05-10T17:00:00Z`
        * `/changefeed?offset=100&limit=100&startTime=2023-05-10T16:00:00Z&endTime=2023-05-10T17:00:00Z`
        * `/changefeed?offset=200&limit=100&startTime=2023-05-10T16:00:00Z&endTime=2023-05-10T17:00:00Z`
    * If fewer events than the `limit` are returned, then the application can assume that there are no more results within the time range

#### Version 1

1. An application determines from which sequence number it wishes to start reading change events:
    * To start from the first event, the application should use `offset=0`
    * To start from the latest event, the application should specify the `offset` parameter with the value of `Sequence` from the latest change event using the `/changefeed/latest` resource
2. On some regular polling interval, the application performs the following actions:
    * Fetches the latest sequence number from the `/changefeed/latest` endpoint
    * Fetches the next set of changes for processing by querying the change feed with the current offset
        * For example, if the application has currently processed up to sequence number 15 and it only wants to process at most 5 events at once, then it should use the URL `/changefeed?offset=15&limit=5`
    * Processes any entries return by the `/changefeed` resource
    * Updates its current sequence number to either:
        1. The maximum sequence number returned by the `/changefeed` resource
        2. The `offset` + `limit` if no change events were returned from the `/changefeed` resource, but the latest sequence number returned by `/changefeed/latest` is greater than the current sequence number used for `offset`

### Other potential usage patterns

Change feed support is well suited for scenarios that process data based on objects that have changed. For example, it can be used to:

* Build connected application pipelines like ML that react to change events or schedule executions based on created or deleted instance.
* Extract business analytics insights and metrics, based on changes that occur to your objects.
* Poll the change feed to create an event source for push notifications.

## Next steps

[Pull changes from the change feed](pull-dicom-changes-from-change-feed.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]