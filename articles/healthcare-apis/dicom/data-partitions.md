---
title: Enable data partitioning for the DICOM service in Azure Health Data Services
description: Encrypt your data with customer-managed keys (CMK) in the DICOM service in Azure Health Data Services. Get tips on requirements, best practices, limitations, and troubleshooting.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 03/26/2024
ms.author: mmitrik
---

# Enable data partitioning

Data partitioning allows you to set up a lightweight data partition scheme to store multiple copies of the same image with the same unique identifier (UID) in a single DICOM instance. 

Although UIDs should be [unique across all contexts](http://dicom.nema.org/dicom/2013/output/chtml/part05/chapter_9.html), it's common practice for healthcare providers to write DICOM files to portable storage media and then give them to a patient. The patient then gives the files to another healthcare provider, who then transfers the files into a new DICOM storage system. Therefore, multiple copies of one DICOM file do commonly exist in isolated DICOM systems. Data partitioning provides an on-ramp for your existing data stores and workflows. 

## Enable data partitions on initial deployment of the DICOM service

You enable data partitions feature by selecting **Enable data partitions** when you deploy a new DICOM service. After data partioning is turned on, it can't be turned off. In addtion, data partitions can't be turned on for any DICOM service that has already been deployed.

After the data partitions setting is enabled, the capability modifies the API surface of the DICOM server and makes any previous data accessible under the `Microsoft.Default` partition. 

> [!IMPORTANT]
> Data partitions can't be disabled if partitions other than `Microsoft.Default` are present. In this case, the system throws a `DataPartitionsFeatureCannotBeDisabledException` error on startup.

## API changes

All unique resource identifies (URIs) assume an implicit DICOM service base URI. For example, the base URI of a DICOM server running locally is `https://localhost:63838/`.
Example requests can be sent in the [Postman collection](../resources/Conformance-as-Postman.postman_collection.json) by providing a value for the `partitionName` collection variable.

### List all data partitions
This command Lists all data partitions:

```http
GET /partitions
```

#### Request header

| Name         | Required  | Type   | Description                     |
| ------------ | --------- | ------ | ------------------------------- |
| Content-Type | False     | string | `application/json` is supported |

#### Responses

| Name              | Type                          | Description                           |
| ----------------- | ----------------------------- | ------------------------------------- |
| 200 (OK)          | [Partition](#partition)`[]`   | A list of partitions is returned.      |
| 204 (No Content)  |                               | No partitions exist.                   |
| 400 (Bad Request) |                               | Data partitions capability is disabled.   |

### STOW, WADO, QIDO, Delete, Export update and worklist APIs

After partitions are enabled, STOW, WADO, QIDO, Delete, export, update and worklist requests must include a data partition URI segment after the base URI, with the form `/partitions/{partitionName}`, where `partitionName` is:

 - Up to 64 characters long
 - Composed of any combination of alphanumeric characters, `.`, `-`, and `_`, to allow both DICOM UID and GUID formats, as well as human-readable identifiers.

| Action  | Example URI                                                         |
| ------- | ------------------------------------------------------------------- |
| STOW    | `POST /partitions/myPartition-1/studies`                            |
| WADO    | `GET /partitions/myPartition-1/studies/2.25.0000`                   |
| QIDO    | `GET /partitions/myPartition1/studies?StudyInstanceUID=2.25.0000`   |
| Delete  | `DELETE /partitions/myPartition1/studies/2.25.0000`                 |
| Export  | `POST /partitions/myPartition1/export`                              |
| Update  | `POST /partitions/myPartition-1/studies/$bulkUpdate`                |

#### New responses

| Name              | Message                                                   |
| ----------------- | --------------------------------------------------------- |
| 400 (Bad Request) | Data partitions capability is disabled.                       |
| 400 (Bad Request) | `PartitionName` value is missing in the route segment.      |
| 400 (Bad Request) | Specified `PartitionName` {PartitionName} does not exist.   |

### Other APIs
All other APIs, including [extended query tags](../how-to-guides/extended-query-tags.md), [operations](../how-to-guides/extended-query-tags.md#get-operation), and [change feed](change-feed.md) continue to be accessed at the base URI. 

## Manage data partitions

The only management operation supported for partitions is an implicit creation during STOW and workitem create requests. If the partition specified in the URI doesn't exist, it's created implicitly and the response returns a retrieve URI including the partition path. 

## Limitations

 - After you enable data partitions, the capability can't be turned off.
 - Querying across partitions isn't supported.
 - Updating and deleting partitions isn't supported.

## Definitions

### Partition
A unit of logical isolation and data uniqueness.

| Name          | Type   | Description                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| PartitionKey  | int    | System-assigned identifier.                                                       |
| PartitionName | string | Client-assigned unique name, up to 64 alphanumeric characters, `.`, `-`, or `_`.  |
| CreatedDate   | string | The date and time when the partition was created. |