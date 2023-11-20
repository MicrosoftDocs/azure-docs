---
title: Update DICOM files in the DICOM service
description: Learn how to use the bulk update API in Azure Health Data Services to modify DICOM attributes for multiple files in the DICOM service. This article explains the benefits, requirements, and steps of the bulk update operation.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: how-to
ms.date: 10/27/2023
ms.author: mmitrik
---

# Update DICOM files

The bulk update operation allows you to make changes to imaging metadata for multiple files stored in the DICOM&reg; service. For example, bulk update enables you to modify DICOM attributes for one or more studies in a single, asynchronous operation. You can use this API to perform updates to patient demographic changes and avoid the costs of repeating time-consuming uploads. 

Beyond the efficiency gains, the bulk update capability preserves a record of the changes in the [change feed](dicom-change-feed-overview.md) and persists the original, unmodified instances for future retrieval. 

## Use the bulk update operation
Bulk update is an asynchronous, long-running operation available at the studies endpoint. The request payload includes one or more studies to update, the set of attributes to update, and the new values for those attributes. 

### Update instances in multiple studies
The bulk update endpoint starts a long-running operation that updates all instances in each study with the specified attributes.

```http
POST {dicom-service-url}/{version}/studies/$bulkUpdate
```

```http
POST {dicom-service-url}/{version}/partitions/{PartitionName}/studies/$bulkUpdate
```

#### Request header

| Name         | Required  | Type   | Description                     |
| ------------ | --------- | ------ | ------------------------------- |
| Content-Type | False     | string | `application/json` is supported |

#### Request body

The request body contains the specification for studies to update. Both the `studyInstanceUids` and `changeDataset` are required.

```json
{
    "studyInstanceUids": ["1.113654.3.13.1026"],
    "changeDataset": { 
        "00100010": { 
            "vr": "PN", 
            "Value": 
            [
                { 
                    "Alphabetic": "New Patient Name 1" 
                }
            ] 
        } 
    }
}
```

#### Responses
When a bulk update operation starts successfully, the API returns a `202` status code. The body of the response contains a reference to the operation.

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
{
    "id": "1323c079a1b64efcb8943ef7707b5438",
    "href": "../v1/operations/1323c079a1b64efcb8943ef7707b5438"
}
```

If the operation fails to start successfully, the response will include information about the failure in the errors list, including UIDs of the failing instance(s). 

```http
{
    "operationId": "1323c079a1b64efcb8943ef7707b5438",
    "type": "update",
    "createdTime": "2023-05-08T05:01:30.1441374Z",
    "lastUpdatedTime": "2023-05-08T05:01:42.9067335Z",
    "status": "failed",
    "percentComplete": 100,
    "results": {
        "studyUpdated": 0,
        "studyFailed": 1,
        "instanceUpdated": 0,
        "errors": [
            "Failed to update instances for study 1.113654.3.13.1026"
        ]
    }
}
```

| Name              | Type                | Description                                                  |
| ----------------- | ------------------- | ------------------------------------------------------------ |
| 202 (Accepted)    | Operation Reference | A long-running operation has been started to update DICOM attributes |
| 400 (Bad Request) |                     | Request body has invalid data                                |

### Operation Status
The `href` URL can be polled for the current status of the update operation until completion. A return code of `200` indicates the operation completed successfully.

```http
GET {dicom-service-url}/{version}/operations/{operationId}
```

#### URI Parameters

| Name        | In   | Required | Type   | Description      |
| ----------- | ---- | -------- | ------ | ---------------- |
| operationId | path | True     | string | The operation ID |

#### Responses

```json
{
    "operationId": "1323c079a1b64efcb8943ef7707b5438",
    "type": "update",
    "createdTime": "2023-05-08T05:01:30.1441374Z",
    "lastUpdatedTime": "2023-05-08T05:01:42.9067335Z",
    "status": "completed",
    "percentComplete": 100,
    "results": {
        "studyUpdated": 1,
        "instanceUpdated": 16,
        // Errors will go here
    }
}
```

| Name            | Type      | Description                                  |
| --------------- | --------- | -------------------------------------------- |
| 200 (OK)        | Operation | The operation with the specified ID has completed |
| 202 (Accepted)  | Operation | The operation with the specified ID is running |
| 404 (Not Found) |           | Operation not found                   |

## Retrieving study versions
The [Retrieve (WADO-RS)](dicom-services-conformance-statement-v2.md#retrieve-wado-rs) transaction allows you to retrieve both the original and latest version of a study, series, or instance. The latest version of a study, series, or instance is always returned by default. The original version is returned by setting the `msdicom-request-original` header to `true`. Here's an example request:

```http 
GET {dicom-service-url}/{version}/studies/{study}/series/{series}/instances/{instance}
Accept: multipart/related; type="application/dicom"; transfer-syntax=*
msdicom-request-original: true
Content-Type: application/dicom
 ```

## Delete
The [delete](dicom-services-conformance-statement-v2.md#delete) method deletes both the original and latest version of a study, series, or instance.

## Change feed
The [change feed](dicom-change-feed-overview.md) records update actions in the same manner as create and delete actions. 

## Supported DICOM modules
Any attributes in the [Patient Identification Module](https://dicom.nema.org/dicom/2013/output/chtml/part03/sect_C.2.html#table_C.2-2) and [Patient Demographic Module](https://dicom.nema.org/dicom/2013/output/chtml/part03/sect_C.2.html#table_C.2-3) that aren't sequences can be updated using the bulk update operation. Supported attributes are called out in the tables.

#### Patient identification module attributes
| Attribute Name   | Tag           | Description           |
| ---------------- | --------------| --------------------- |
| Patient's Name   | (0010,0010)   | Patient's full name   |
| Patient ID       | (0010,0020)   | Primary hospital identification number or code for the patient. |
| Other Patient IDs| (0010,1000) | Other identification numbers or codes used to identify the patient. 
| Type of Patient ID| (0010,0022) |  The type of identifier in this item. Enumerated Values: TEXT RFID BARCODE Note The identifier is coded as a string regardless of the type, not as a binary value. 
| Other Patient Names| (0010,1001) | Other names used to identify the patient. 
| Patient's Birth Name| (0010,1005) | Patient's birth name. 
| Patient's Mother's Birth Name| (0010,1060) | Birth name of patient's mother. 
| Medical Record Locator | (0010,1090)| An identifier used to find the patient's existing medical record (for example, film jacket). 

#### Patient demographic module attributes
| Attribute Name   | Tag           | Description           |
| ---------------- | --------------| --------------------- |
| Patient's Age | (0010,1010) | Age of the Patient. |
| Occupation | (0010,2180) | Occupation of the Patient. |
| Confidentiality Constraint on Patient Data Description | (0040,3001) | Special indication to the modality operator about confidentiality of patient information (for example, that they shouldn't use the patients name where other patients are present). |
| Patient's Birth Date | (0010,0030) | Date of birth of the named patient  |
| Patient's Birth Time | (0010,0032) | Time of birth of the named patient  |
| Patient's Sex | (0010,0040) | Sex of the named patient. |
| Quality Control Subject |(0010,0200) | Indicates whether or not the subject is a quality control phantom. |
| Patient's Size | (0010,1020) | Patient's height or length in meters  |
| Patient's Weight | (0010,1030) | Weight of the patient in kilograms  |
| Patient's Address | (0010,1040) | Legal address of the named patient  |
| Military Rank | (0010,1080) | Military rank of patient  |
| Branch of Service | (0010,1081) | Branch of the military. The country allegiance may also be included (for example, U.S. Army). |
| Country of Residence | (0010,2150) | Country in which patient currently resides  |
| Region of Residence | (0010,2152) | Region within patient's country of residence  |
| Patient's Telephone Numbers | (0010,2154) | Telephone numbers at which the patient can be reached  |
| Ethnic Group | (0010,2160) | Ethnic group or race of patient  |
| Patient's Religious Preference | (0010,21F0) | The religious preference of the patient  |
| Patient Comments | (0010,4000) | User-defined comments about the patient | 
| Responsible Person | (0010,2297) | Name of person with medical decision making authority for the patient. |
| Responsible Person Role | (0010,2298) | Relationship of Responsible Person to the patient. |
| Responsible Organization | (0010,2299) | Name of organization with medical decision making authority for the patient. |
| Patient Species Description | (0010,2201) | The species of the patient. |
| Patient Breed Description | (0010,2292) | The breed of the patient.See Section C.7.1.1.1.1. |
| Breed Registration Number | (0010,2295) | Identification number of a veterinary patient within the registry. |

## Limitations
There are a few limitations when you use the bulk update operation:

- A maximum of 50 studies can be updated in a single operation.
- Only one bulk update operation can be performed at a time.
- You can't delete only the latest version of a study or revert back to the original version. 

[!INCLUDE [DICOM trademark statements](../includes/healthcare-apis-dicom-trademark.md)]
