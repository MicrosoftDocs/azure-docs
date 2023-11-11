---
title:  DICOM extended query tags overview - Azure Health Data Services
description: In this article, you'll learn the concepts of Extended Query Tags.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: conceptual
ms.date: 10/9/2023
ms.author: mmitrik
---

# Extended query tags

By default, the DICOM&reg; service supports querying on the DICOM tags specified in the [conformance statement](dicom-services-conformance-statement-v2.md#searchable-attributes). By enabling extended query tags, the list of tags can easily be expanded based on the application's needs. 

Using the APIs listed below, users can index their DICOM studies, series, and instances on both standard and private DICOM tags such that they can be specified in QIDO-RS queries.

## APIs

### Version: v1

To help manage the supported tags in a given DICOM service instance, the following API endpoints have been added.

| API                                               | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| POST       .../extendedquerytags                  | [Add Extended Query Tags](#add-extended-query-tags)          |
| GET         .../extendedquerytags                 | [List Extended Query Tags](#list-extended-query-tags)        |
| GET         .../extendedquerytags/{tagPath}       | [Get Extended Query Tag](#get-extended-query-tag)            |
| DELETE  .../extendedquerytags/{tagPath}           | [Delete Extended Query Tag](#delete-extended-query-tag)      |
| PATCH   .../extendedquerytags/{tagPath}           | [Update Extended Query Tag](#update-extended-query-tag)      |
| GET        .../extendedquerytags/{tagPath}/errors | [List Extended Query Tag Errors](#list-extended-query-tag-errors) |
| GET        .../operations/{operationId}           | [Get Operation](#get-operation)                              |

### Add extended query tags 

Adds one or more extended query tags and starts a long-running operation that reindexes current DICOM instances with the specified tag(s).

```http
POST .../extendedquerytags
```

#### Request header

| Name         | Required | Type   | Description                     |
| ------------ | -------- | ------ | ------------------------------- |
| Content-Type | True     | string | `application/json` is supported |

#### Request body

| Name | Required | Type                                                         | Description |
| ---- | -------- | ------------------------------------------------------------ | ----------- |
| body |          | [Extended Query Tag for Adding](#extended-query-tag-for-adding)`[]` |             |

#### Limitations

The following VR types are supported:

| VR   | Description           | Single Value Matching | Range Matching | Fuzzy Matching |
| ---- | --------------------- | --------------------- | -------------- | -------------- |
| AE   | Application Entity    | X                     |                |                |
| AS   | Age String            | X                     |                |                |
| CS   | Code String           | X                     |                |                |
| DA   | Date                  | X                     | X              |                |
| DS   | Decimal String        | X                     |                |                |
| DT   | Date Time             | X                     | X              |                |
| FD   | Floating Point Double | X                     |                |                |
| FL   | Floating Point Single | X                     |                |                |
| IS   | Integer String        | X                     |                |                |
| LO   | Long String           | X                     |                |                |
| PN   | Person Name           | X                     |                | X              |
| SH   | Short String          | X                     |                |                |
| SL   | Signed Long           | X                     |                |                |
| SS   | Signed Short          | X                     |                |                |
| TM   | Time                  | X                     | X              |                |
| UI   | Unique Identifier     | X                     |                |                |
| UL   | Unsigned Long         | X                     |                |                |
| US   | Unsigned Short        | X                     |                |                |

> [!NOTE]
> Sequential tags, which are tags under a tag of type Sequence of Items (SQ), are currently not supported.
> You can add up to 128 extended query tags.

#### Responses

| Name              | Type                                        | Description                                                  |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------ |
| 202 (Accepted)    | [Operation Reference](#operation-reference) | Extended query tag(s) have been added, and a long-running operation has been started to reindex existing DICOM instances |
| 400 (Bad Request) |                                             | Request body has invalid data                                |
| 409 (Conflict)    |                                             | One or more requested query tags already are supported       |

### List extended query tags

Lists of all extended query tag(s).

```http
GET .../extendedquerytags
```

#### Responses

| Name     | Type                                          | Description                 |
| -------- | --------------------------------------------- | --------------------------- |
| 200 (OK) | [Extended Query Tag](#extended-query-tag)`[]` | Returns extended query tags |

### Get extended query tag

Get an extended query tag.

```http
GET .../extendedquerytags/{tagPath}
```

#### URI parameters

| Name    | In   | Required | Type   | Description                                                  |
| ------- | ---- | -------- | ------ | ------------------------------------------------------------ |
| tagPath | path | True     | string | tagPath is the path for the tag, which can be either tag or keyword. For example, Patient ID is represented by `00100020` or `PatientId` |

####  Responses

| Name              | Type                                      | Description                                            |
| ----------------- | ----------------------------------------- | ------------------------------------------------------ |
| 200 (OK)          | [Extended Query Tag](#extended-query-tag) | The extended query tag with the specified `tagPath`    |
| 400 (Bad Request) |                                           | Requested tag path is invalid                          |
| 404 (Not Found)   |                                           | Extended query tag with requested tagPath isn't found |

### Delete extended query tag

Delete an extended query tag.

```http
DELETE .../extendedquerytags/{tagPath}
```

#### URI parameters

| Name    | In   | Required | Type   | Description                                                  |
| ------- | ---- | -------- | ------ | ------------------------------------------------------------ |
| tagPath | path | True     | string | tagPath is the path for the tag, which can be either tag or keyword. For example, Patient ID is represented by `00100020` or `PatientId` |

#### Responses

| Name              | Type | Description                                                  |
| ----------------- | ---- | ------------------------------------------------------------ |
| 204 (No Content)  |      | Extended query tag with requested tagPath has been successfully deleted. |
| 400 (Bad Request) |      | Requested tag path is invalid.                               |
| 404 (Not Found)   |      | Extended query tag with requested tagPath isn't found       |

### Update extended query tag

Update an extended query tag.

```http
PATCH .../extendedquerytags/{tagPath}
```

#### URI parameters

| Name    | In   | Required | Type   | Description                                                  |
| ------- | ---- | -------- | ------ | ------------------------------------------------------------ |
| tagPath | path | True     | string | tagPath is the path for the tag, which can be either tag or keyword. For example, Patient ID is represented by `00100020` or `PatientId` |

#### Request header

| Name         | Required | Type   | Description                      |
| ------------ | -------- | ------ | -------------------------------- |
| Content-Type | True     | string | `application/json` is supported. |

#### Request body

| Name | Required | Type                                                         | Description |
| ---- | -------- | ------------------------------------------------------------ | ----------- |
| body |          | [Extended Query Tag for Updating](#extended-query-tag-for-updating) |             |

#### Responses

| Name              | Type                                      | Description                                            |
| ----------------- | ----------------------------------------- | ------------------------------------------------------ |
| 20 (OK)           | [Extended Query Tag](#extended-query-tag) | The updated extended query tag                         |
| 400 (Bad Request) |                                           | Requested tag path or body is invalid                  |
| 404 (Not Found)   |                                           | Extended query tag with requested tagPath isn't found |

### List extended query tag errors

Lists errors on an extended query tag.

```http
GET .../extendedquerytags/{tagPath}/errors
```

#### URI parameters

| Name    | In   | Required | Type   | Description                                                  |
| ------- | ---- | -------- | ------ | ------------------------------------------------------------ |
| tagPath | path | True     | string | tagPath is the path for the tag, which can be either tag or keyword. For example, Patient ID is represented by `00100020` or `PatientId` |

####  Responses

| Name              | Type                                                       | Description                                               |
| ----------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| 200 (OK)          | [Extended Query Tag Error](#extended-query-tag-error) `[]` | List of extended query tag errors associated with the tag |
| 400 (Bad Request) |                                                            | Requested tag path is invalid                             |
| 404 (Not Found)   |                                                            | Extended query tag with requested tagPath isn't found    |

### Get operation

Get a long-running operation.

```http
GET .../operations/{operationId}
```

#### URI parameters

| Name        | In   | Required | Type   | Description      |
| ----------- | ---- | -------- | ------ | ---------------- |
| operationId | path | True     | string | The operation ID |

#### Responses

| Name            | Type                    | Description                                  |
| --------------- | ----------------------- | -------------------------------------------- |
| 200 (OK)        | [Operation](#operation) | The completed operation for the specified ID |
| 202 (Accepted)  | [Operation](#operation) | The running operation for the specified ID   |
| 404 (Not Found) |                         | The operation isn't found                   |

## QIDO with extended query tags

### Tag status

The [Status](#extended-query-tag-status) of extended query tag indicates current status. When an extended query tag is first added, its status is set to `Adding`, and a long-running operation is kicked off to reindex existing DICOM instances. After the operation is completed, the tag status is updated to `Ready`. The extended query tag can now be used in [QIDO](dicom-services-conformance-statement-v2.md#search-qido-rs). 

For example, if the tag Manufacturer Model Name (0008,1090) is added, and in `Ready` status, hereafter the following queries can be used to filter stored instances by the Manufacturer Model Name.

```http
../instances?ManufacturerModelName=Microsoft
```

They can also be used with existing tags. For example:

```http
../instances?00081090=Microsoft&PatientName=Jo&fuzzyMatching=true
```

### Tag query status

[QueryStatus](#extended-query-tag-status) indicates whether QIDO is allowed for the tag. When a reindex operation fails to process one or more DICOM instances for a tag, that tag's QueryStatus is set to `Disabled` automatically. You can choose to ignore indexing errors and allow queries to use this tag by setting the `QueryStatus` to `Enabled` via  [Update Extended Query Tag](#update-extended-query-tag) API. Any QIDO requests that reference at least one manually enabled tag will include the set of tags with indexing errors in the response header `erroneous-dicom-attributes`.

For example, suppose the extended query tag `PatientAge` had errors during reindexing, but it was enabled manually. For the following query, you would be able to see `PatientAge` in the `erroneous-dicom-attributes` header.

```http
../instances?PatientAge=035Y
```

## Definitions

### Extended query tag

A DICOM tag that will be supported for QIDO-RS.

| Name           | Type                                                         | Description                                                  |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Path           | string                                                       | Path of tag, normally composed of group ID and element ID. for example, `PatientId` (0010,0020) has path 00100020 |
| VR             | string                                                       | Value representation of this tag                             |
| PrivateCreator | string                                                       | Identification code of the implementer of this private tag   |
| Level          | [Extended Query Tag Level](#extended-query-tag-level)        | Level of extended query tag                                  |
| Status         | [Extended Query Tag Status](#extended-query-tag-status)      | Status of the extended query tag                             |
| QueryStatus    | [Extended Query Tag Query Status](#extended-query-tag-query-status) | Query status of extended query tag                           |
| Errors         | [Extended Query Tag Errors Reference](#extended-query-tag-errors-reference) | Reference to extended query tag errors                       |
| Operation      | [Operation Reference](#operation-reference)                  | Reference to a long-running operation                        |

Code **example 1** is a standard tag (0008,0070) in `Ready` status.

```json
{
    "status": "Ready",
    "level": "Instance",
    "queryStatus": "Enabled",
    "path": "00080070",
    "vr": "LO"
}
```

Code **example 2** is a standard tag (0010,1010) in `Adding` status.  An operation with ID `1a5d0306d9624f699929ee1a59ed57a0` is running on it, and 21 errors has occurred so far.

```json
{
    "status": "Adding",
    "level": "Study",
    "errors": {
        "count": 21,
        "href": "https://localhost:63838/extendedquerytags/00101010/errors"
    },
    "operation": {
        "id": "1a5d0306d9624f699929ee1a59ed57a0",
        "href": "https://localhost:63838/operations/1a5d0306d9624f699929ee1a59ed57a0"
    },
    "queryStatus": "Disabled",
    "path": "00101010",
    "vr": "AS"
}
```

### Operation reference

Reference to a long-running operation.

| Name | Type   | Description          |
| ---- | ------ | -------------------- |
| ID   | string | operation ID         |
| Href | string | Uri to the operation |

### Operation

Represents a long-running operation.

| Name            | Type                                  | Description                                                  |
| --------------- | ------------------------------------- | ------------------------------------------------------------ |
| OperationId     | string                                | The operation ID                                             |
| OperationType   | [Operation Type](#operation-type)     | Type of  the long running operation                          |
| CreatedTime     | string                                | Time when the operation was created                          |
| LastUpdatedTime | string                                | Time when the operation was updated last time                |
| Status          | [Operation Status](#operation-status) | Represents run time status of operation                      |
| PercentComplete | Integer                               | Percentage of work that has been completed by the operation  |
| Resources       | string`[]`                            | Collection of resources locations that the operation is creating or manipulating |

The following code **example** is a running reindex operation. 

```json
{
    "resources": [
        "https://localhost:63838/extendedquerytags/00101010"
    ],
    "operationId": "a99a8b51-78d4-4fd9-b004-b6c0bcaccf1d",
    "type": "Reindex",
    "createdTime": "2021-10-06T16:40:02.5247083Z",
    "lastUpdatedTime": "2021-10-06T16:40:04.5152934Z",
    "status": "Running",
    "percentComplete": 10
}
```

### Operation status

Represents a run time status of long running operation.

| Name       | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| NotStarted | string | The operation isn't started                                 |
| Running    | string | The operation is executing and hasn't yet finished          |
| Completed  | string | The operation has finished successfully                      |
| Failed     | string | The operation has stopped prematurely after encountering one or more errors |

### Extended query tag error

An error that occurred during an extended query tag indexing operation.

| Name              | Type   | Description                                       |
| ----------------- | ------ | ------------------------------------------------- |
| StudyInstanceUid  | string | Study instance UID where indexing errors occurred  |
| SeriesInstanceUid | string | Series instance UID where indexing errors occurred |
| SopInstanceUid    | string | Sop instance UID where indexing errors occurred    |
| CreatedTime       | string | Time when error occurred(UTC)                      |
| ErrorMessage      | string | Error message                                     |

The following code **example** contains an unexpected value length error on a DICOM instance. It occurred at 2021-10-06T16:41:44.4783136.

```json
{
    "studyInstanceUid": "2.25.253658084841524753870559471415339023884",
    "seriesInstanceUid": "2.25.309809095970466602239093351963447277833",
    "sopInstanceUid": "2.25.225286918605419873651833906117051809629",
    "createdTime": "2021-10-06T16:41:44.4783136",
    "errorMessage": "Value length is not expected."
}
```

### Extended query tag errors reference

Reference to extended query tag errors.

| Name  | Type    | Description                                      |
| ----- | ------- | ------------------------------------------------ |
| Count | Integer | Total number of errors on the extended query tag |
| Href  | string  | URI to extended query tag errors                 |

### Operation type

The type of  a long-running operation.

| Name    | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| Reindex | string | A reindex operation that updates the indices for previously added data based on new tags |

### Extended query tag status

The status of  extended query tag.

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| Adding   | string | The extended query tag has been added, and a long-running operation is reindexing existing DICOM instances |
| Ready    | string | The extended query tag  is ready for QIDO-RS                 |
| Deleting | string | The extended query tag  is being deleted                     |

### Extended query tag level

The level of the DICOM information hierarchy where this tag applies.

| Name     | Type   | Description                                              |
| -------- | ------ | -------------------------------------------------------- |
| Instance | string | The extended query tag is relevant at the instance level |
| Series   | string | The extended query tag is relevant at the series level   |
| Study    | string | The extended query tag is relevant at the study level    |

### Extended query tag query status

The query status of extended query tag.

| Name     | Type   | Description                                         |
| -------- | ------ | --------------------------------------------------- |
| Disabled | string | The extended query tag isn't allowed to be queried |
| Enabled  | string | The extended query tag is allowed to be queried     |

> [!NOTE]
> Errors during the reindex operation disables QIDO on the extended query tag. You can call the [Update Extended Query Tag](#update-extended-query-tag) API to enable it.

### Extended query tag for updating

Represents extended query tag for updating.

| Name        | Type                                                         | Description                            |
| ----------- | ------------------------------------------------------------ | -------------------------------------- |
| QueryStatus | [Extended Query Tag Query Status](#extended-query-tag-query-status) | The query status of extended query tag |

### Extended query tag for adding

Represents extended query tag for adding.

| Name           | Required | Type                                                  | Description                                                  |
| -------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| Path           | True     | string                                                | Path of tag, normally composed of the group ID and element ID that's the `PatientId` (0010,0020) has path 00100020 |
| VR             |          | string                                                | Value representation of this tag.  It's optional for standard tag, and required for private tag |
| PrivateCreator |          | string                                                | Identification code of the implementer of this private tag. Only set when the tag is a private tag |
| Level          | True     | [Extended Query Tag Level](#extended-query-tag-level) | Represents the hierarchy at which this tag is relevant. Should be one of Study, Series or Instance |

Code **example 1** `MicrosoftPC` is defining the private tag (0401,1001) with the `SS` value representation on the instance level.

```json
{
    "Path": "04011001",
    "VR": "SS",
    "PrivateCreator": "MicrosoftPC",
    "Level": "Instance"
}
```

Code **example 2** uses the standard tag with keyword `ManufacturerModelName` with the `LO` value representation that's defined on the series level.

```json
{
    "Path": "ManufacturerModelName",
    "VR": "LO",
    "Level": "Series"
}
```

 Code **example 3** uses the standard tag (0010,0040) and is defined on studies. The value representation is already defined by the DICOM standard.

```json
{
    "Path": "00100040",
    "Level": "Study"
}
```

## Summary

This conceptual article provided you with an overview of the Extended Query Tag feature within the DICOM service.
 
## Next steps

[Deploy the DICOM service to Azure](deploy-dicom-services-in-azure.md)

[Use DICOMweb APIs with the DICOM service](dicomweb-standard-apis-with-dicom-services.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]