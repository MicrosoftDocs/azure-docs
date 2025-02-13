---
title: DICOM Conformance Statement version 1 for Azure Health Data Services
description: Read about the features and specifications of the DICOM service v1 API, which supports a subset of the DICOMweb Standard for medical imaging data. A DICOM Conformance Statement is a technical document that describes how a device or software implements the DICOM standard.
services: healthcare-apis
author: varunbms
ms.service: azure-health-data-services
ms.subservice: dicom-service
ms.topic: reference
ms.date: 10/13/2023
ms.author: buchvarun
---

# DICOM Conformance Statement v1

> [!NOTE]
> API version 2 is the latest API version and should be used in place of v1. See the [DICOM Conformance Statement v2](dicom-services-conformance-statement-v2.md) for details.

The Medical Imaging Server for DICOM&reg; supports a subset of the DICOMweb Standard. Support includes:

* [Studies Service](#studies-service)
    * [Store (STOW-RS)](#store-stow-rs)
    * [Retrieve (WADO-RS)](#retrieve-wado-rs)
    * [Search (QIDO-RS)](#search-qido-rs)
    * [Delete](#delete)
* [Worklist Service (UPS Push and Pull SOPs)](#worklist-service-ups-rs)
    * [Create Workitem](#create-workitem)
    * [Retrieve Workitem](#retrieve-workitem)
    * [Update Workitem](#update-workitem)
    * [Change Workitem State](#change-workitem-state)
    * [Request Cancellation](#request-cancellation)
    * [Search Workitems](#search-workitems)

Additionally, the following nonstandard APIs are supported:

* [Change Feed](change-feed-overview.md)
* [Extended Query Tags](dicom-extended-query-tags-overview.md)
* [Bulk update](update-files.md)
* [Bulk import](import-files.md)
* [Export](export-dicom-files.md)

The service uses REST API versioning. The version of the REST API must be explicitly specified as part of the base URL, as in the following example:

`https://<service_url>/v<version>/studies`

This version of the conformance statement corresponds to the `v1` version of the REST APIs.  

For information on how to specify the version when making requests, see the [API Versioning Documentation](api-versioning-dicom-service.md).

You can find example requests for supported transactions in the Postman collection.

## Preamble Sanitization

The service ignores the 128-byte File Preamble, and replaces its contents with null characters. This behavior ensures that no files passed through the service are vulnerable to the [malicious preamble vulnerability](https://dicom.nema.org/medical/dicom/current/output/chtml/part10/sect_7.5.html). However, this preamble sanitization also means that [preambles used to encode dual format content](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6489422/) such as TIFF can't be used with the service.

## Studies Service

The [Studies Service](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#chapter_10) allows users to store, retrieve, and search for DICOM Studies, Series, and Instances. We added the nonstandard Delete transaction to enable a full resource lifecycle.

### Store (STOW-RS)

This transaction uses the POST or PUT method to store representations of studies, series, and instances contained in the request payload.

| Method | Path               | Description |
| ------ | ------------------ | ----------- |
| POST   | ../studies         | Store instances. |
| POST   | ../studies/{study} | Store instances for a specific study. |
| PUT    | ../studies         | Upsert instances. |
| PUT    | ../studies/{study} | Upsert instances for a specific study. |

The parameter `study` corresponds to the DICOM attribute `StudyInstanceUID`. If specified, any instance that doesn't belong to the provided study is rejected with a `43265` warning code.

The following `Accept` header for the response is supported:

* `application/dicom+json`

The following `Content-Type` headers are supported:

* `multipart/related; type="application/dicom"`
* `application/dicom`

> [!NOTE]
> The server won't coerce or replace attributes that conflict with existing data for POST requests. All data is stored as provided. For upsert (PUT) requests, the existing data is replaced by the new data received. 

#### Store required attributes
The following DICOM elements are required to be present in every DICOM file attempting to be stored:

* `StudyInstanceUID`
* `SeriesInstanceUID`
* `SOPInstanceUID`
* `SOPClassUID`
* `PatientID`

> [!NOTE]
> All UIDs must be between 1 and 64 characters long, and only contain alpha numeric characters or the following special characters: `.`, `-`. `PatientID` is validated based on its `LO` `VR` type.

Each file stored must have a unique combination of `StudyInstanceUID`, `SeriesInstanceUID`, and `SopInstanceUID`. The warning code `45070` is returned if a file with the same identifiers already exists.

Only transfer syntaxes with explicit Value Representations are accepted.

#### Store response status codes

| Code      | Description |
| --------- | ----------- |
| `200 (OK)`                     | All the SOP instances in the request are stored. |
| `202 (Accepted)`               | Some instances in the request are stored but others failed. |
| `204 (No Content)`             | No content was provided in the store transaction request. |
| `400 (Bad Request)`            | The request was badly formatted. For example, the provided study instance identifier didn't conform to the expected UID format. |
| `401 (Unauthorized)`           | The client isn't authenticated. |
| `403 (Forbidden)`              | The user isn't authorized. |
| `406 (Not Acceptable)`         | The specified `Accept` header isn't supported. |
| `409 (Conflict)`               | None of the instances in the store transaction request were stored. |
| `415 (Unsupported Media Type)` | The provided `Content-Type` isn't supported. |
| `503 (Service Unavailable)`    | The service is unavailable or busy. Try again later. |

### Store response payload

The response payload populates a DICOM dataset with the following elements.

| Tag          | Name                  | Description |
| ------------ | --------------------- | ----------- |
| (0008, 1190) | `RetrieveURL`           | The Retrieve URL of the study, if the `StudyInstanceUID` was provided in the store request and at least one instance is successfully stored |
| (0008, 1198) | `FailedSOPSequence`     | The sequence of instances that failed to store |
| (0008, 1199) | `ReferencedSOPSequence` | The sequence of stored instances |

Each dataset in the `FailedSOPSequence` has the following elements (if the DICOM file attempting to be stored could be read).

| Tag          | Name                     | Description |
| ------------ | ------------------------ | ----------- |
| (0008, 1150) | `ReferencedSOPClassUID`    | The SOP class unique identifier of the instance that failed to store |
| (0008, 1155) | `ReferencedSOPInstanceUID` | The SOP instance unique identifier of the instance that failed to store |
| (0008, 1197) | `FailureReason`            | The reason code why this instance failed to store |
| (0074, 1048) | `FailedAttributesSequence` | The sequence of `ErrorComment` that includes the reason for each failed attribute |

Each dataset in the `ReferencedSOPSequence` has the following elements.

| Tag          | Name                     | Description |
| ------------ | ------------------------ | ----------- |
| (0008, 1150) | `ReferencedSOPClassUID`    | The SOP class unique identifier of the instance that failed to store |
| (0008, 1155) | `ReferencedSOPInstanceUID` | The SOP instance unique identifier of the instance that failed to store |
| (0008, 1190) | `RetrieveURL`              | The retrieve URL of this instance on the DICOM server |

An example response with `Accept` header `application/dicom+json`:

```json
{
  "00081190":
  {
    "vr":"UR",
    "Value":["http://localhost/studies/d09e8215-e1e1-4c7a-8496-b4f6641ed232"]
  },
  "00081198":
  {
    "vr":"SQ",
    "Value":
    [{
      "00081150":
      {
        "vr":"UI","Value":["cd70f89a-05bc-4dab-b6b8-1f3d2fcafeec"]
      },
      "00081155":
      {
        "vr":"UI",
        "Value":["22c35d16-11ce-43fa-8f86-90ceed6cf4e7"]
      },
      "00081197":
      {
        "vr":"US",
        "Value":[43265]
      }
    }]
  },
  "00081199":
  {
    "vr":"SQ",
    "Value":
    [{
      "00081150":
      {
        "vr":"UI",
        "Value":["d246deb5-18c8-4336-a591-aeb6f8596664"]
      },
      "00081155":
      {
        "vr":"UI",
        "Value":["4a858cbb-a71f-4c01-b9b5-85f88b031365"]
      },
      "00081190":
      {
        "vr":"UR",
        "Value":["http://localhost/studies/d09e8215-e1e1-4c7a-8496-b4f6641ed232/series/8c4915f5-cc54-4e50-aa1f-9b06f6e58485/instances/4a858cbb-a71f-4c01-b9b5-85f88b031365"]
      }
    }]
  }
}
```

#### Store failure reason codes

| Code  | Description |
| ----- | ----------- |
| `272`   | The store transaction didn't store the instance because of a general failure in processing the operation. |
| `43264` | The DICOM instance failed the validation. |
| `43265` | The provided instance `StudyInstanceUID` didn't match the specified `StudyInstanceUID` in the store request. |
| `45070` | A DICOM instance with the same `StudyInstanceUID`, `SeriesInstanceUID`, and `SopInstanceUID` is already stored. If you want to update the contents, delete this instance first. |
| `45071` | A DICOM instance is being created by another process, or the previous attempt to create failed and the cleanup process isn't complete. Delete the instance first before attempting to create again. |

#### Store warning reason codes
| Code  | Description |
| ----- | ----------- |
| `45063` | A DICOM instance Data Set doesn't match SOP Class. The Studies Store Transaction (Section 10.5) observed that the Data Set didn't match the constraints of the SOP Class during storage of the instance. |

### Store Error Codes

| Code  | Description |
| ----- | ----------- |
| `100`   | The provided instance attributes didn't meet the validation criteria. |

### Retrieve (WADO-RS)

This Retrieve Transaction offers support for retrieving stored studies, series, instances, and frames by reference.

| Method | Path   | Description |
| ------ | -------| ----------- |
| GET    | ../studies/{study}    | Retrieves all instances within a study |
| GET    | ../studies/{study}/metadata     | Retrieves the metadata for all instances within a study |
| GET    | ../studies/{study}/series/{series}    | Retrieves all instances within a series |
| GET    | ../studies/{study}/series/{series}/metadata  | Retrieves the metadata for all instances within a series |
| GET    | ../studies/{study}/series/{series}/instances/{instance} | Retrieves a single instance |
| GET    | ../studies/{study}/series/{series}/instances/{instance}/metadata | Retrieves the metadata for a single instance |
| GET | ../studies/{study}/series/{series}/instances/{instance}/rendered | Retrieves an instance rendered into an image format |
| GET    | ../studies/{study}/series/{series}/instances/{instance}/frames/{frames} | Retrieves one or many frames from a single instance; To specify more than one frame, use a comma to separate each frame to return. For example, `/studies/1/series/2/instance/3/frames/4,5,6`. |
| GET | ../studies/{study}/series/{series}/instances/{instance}/frames/{frame}/rendered | Retrieves a single frame rendered into an image format |

#### Retrieve instances within study or series

The following `Accept` headers are supported for retrieving instances within a study or a series.

* `multipart/related; type="application/dicom"; transfer-syntax=*`
* `multipart/related; type="application/dicom";` (when transfer-syntax isn't specified, 1.2.840.10008.1.2.1 is used as default)
* `multipart/related; type="application/dicom"; transfer-syntax=1.2.840.10008.1.2.1`
* `multipart/related; type="application/dicom"; transfer-syntax=1.2.840.10008.1.2.4.90`
- `*/*` (when transfer-syntax isn't specified, `*` is used as default and mediaType defaults to `application/dicom`)

#### Retrieve an Instance

The following `Accept` headers are supported for retrieving a specific instance:

* `application/dicom; transfer-syntax=*`
* `multipart/related; type="application/dicom"; transfer-syntax=*`
* `application/dicom;` (when transfer-syntax isn't specified, `1.2.840.10008.1.2.1` is used as default)
* `multipart/related; type="application/dicom"` (when transfer-syntax isn't specified, `1.2.840.10008.1.2.1` is used as default)
* `application/dicom; transfer-syntax=1.2.840.10008.1.2.1`
* `multipart/related; type="application/dicom"; transfer-syntax=1.2.840.10008.1.2.1`
* `application/dicom; transfer-syntax=1.2.840.10008.1.2.4.90`
* `multipart/related; type="application/dicom"; transfer-syntax=1.2.840.10008.1.2.4.90`
- `*/*` (when transfer-syntax isn't specified, `*` is used as default and mediaType defaults to `application/dicom`)

#### Retrieve Frames

The following `Accept` headers are supported for retrieving frames.

* `multipart/related; type="application/octet-stream"; transfer-syntax=*`
* `multipart/related; type="application/octet-stream";` (when transfer-syntax isn't specified, `1.2.840.10008.1.2.1` is used as default)
* `multipart/related; type="application/octet-stream"; transfer-syntax=1.2.840.10008.1.2.1`
* `multipart/related; type="image/jp2";` (when transfer-syntax isn't specified, `1.2.840.10008.1.2.4.90` is used as default)
* `multipart/related; type="image/jp2";transfer-syntax=1.2.840.10008.1.2.4.90`
- `*/*` (when transfer-syntax isn't specified, `*` is used as default and mediaType defaults to `application/octet-stream`)

#### Retrieve transfer syntax

When the requested transfer syntax is different from original file, the original file is transcoded to the requested transfer syntax. The original file needs to be one of the following formats for transcoding to succeed, otherwise transcoding might fail.

* 1.2.840.10008.1.2 (Little Endian Implicit)
* 1.2.840.10008.1.2.1 (Little Endian Explicit)
* 1.2.840.10008.1.2.2 (Explicit VR Big Endian)
* 1.2.840.10008.1.2.4.50 (JPEG Baseline Process 1)
* 1.2.840.10008.1.2.4.57 (JPEG Lossless)
* 1.2.840.10008.1.2.4.70 (JPEG Lossless Selection Value 1)
* 1.2.840.10008.1.2.4.90 (JPEG 2000 Lossless Only)
* 1.2.840.10008.1.2.4.91 (JPEG 2000)
* 1.2.840.10008.1.2.5 (RLE Lossless)

An unsupported `transfer-syntax` results in `406 Not Acceptable`.

### Retrieve metadata (for study, series, or instance)

The following `Accept` header is supported for retrieving metadata for a study, a series, or an instance.

* `application/dicom+json`

Retrieving metadata doesn't return attributes with the following value representations.

| VR Name | Description            |
| :------ | :--------------------- |
| OB      | Other Byte             |
| OD      | Other Double           |
| OF      | Other Float            |
| OL      | Other Long             |
| OV      | Other 64-Bit Very Long |
| OW      | Other Word             |
| UN      | Unknown                |

### Retrieve metadata cache validation (for study, series, or instance)

Cache validation is supported using the `ETag` mechanism. In the response to a metadata request, ETag is returned as one of the headers. This ETag can be cached and added as `If-None-Match` header in the later requests for the same metadata. Two types of responses are possible if the data exists:

* Data is unchanged since the last request: the `HTTP 304 (Not Modified)` response is sent with no response body.
* Data has changed since the last request: the `HTTP 200 (OK)` response is sent with updated ETag. Required data is also returned as part of the body.

### Retrieve rendered image (for instance or frame)
The following `Accept` headers are supported for retrieving a rendered image an instance or a frame.

- `image/jpeg`
- `image/png`

In the case that no `Accept` header is specified, the service renders an `image/jpeg` by default.

The service only supports rendering of a single frame. If rendering is requested for an instance with multiple frames, then by default only the first frame is rendered as an image.

When specifying a particular frame to return, frame indexing starts at 1.

The `quality` query parameter is also supported. An integer value from `1` to `100` inclusive (1 being worst quality, and 100 being best quality) might be passed as the value for the query parameter. This parameter is used for images rendered as `jpeg`, and is ignored for `png` render requests. If not specified, the parameter defaults to `100`.

### Retrieve response status codes

| Code                         | Description |
| ---------------------------- | ----------- |
| `200 (OK)`                     | All requested data was retrieved. |
| `304 (Not Modified)`           | The requested data hasn't been modified since the last request. In this case, content isn't added to the response body. For more information, see the preceding section **Retrieve Metadata Cache Validation (for Study, Series, or Instance)**. |
| `400 (Bad Request)` | The request was badly formatted. For example, the provided study instance identifier didn't conform to the expected UID format, or the requested transfer-syntax encoding isn't supported. |
| `401 (Unauthorized)`           | The client isn't authenticated. |
| `403 (Forbidden)`              | The user isn't authorized. |
| `404 (Not Found)`              | The specified DICOM resource couldn't be found, or for a rendered request the instance didn't contain pixel data. |
| `406 (Not Acceptable)`         | The specified `Accept` header isn't supported, or for rendered and transcodes requests the file requested was too large. |
| `503 (Service Unavailable)`    | The service is unavailable or busy. Try again later. |

### Search (QIDO-RS)

Query based on ID for DICOM Objects (QIDO) enables you to search for studies, series, and instances by attributes.

| Method | Path   | Description         |
| ------ | ------ | ------------------- |
| *Search for Studies* | | |
| GET    | ../studies?...   | Search for studies   |
| *Search for Series* | | |
| GET    | ../series?...    | Search for series   |
| GET    |../studies/{study}/series?...      | Search for series in a study      |
| *Search for Instances* | | |
| GET    |../instances?...   | Search for instances  |
| GET    |../studies/{study}/instances?...   | Search for instances in a study   |
| GET    |../studies/{study}/series/{series}/instances?... | Search for instances in a series  |

The following `Accept` header is supported for searching:

* `application/dicom+json`

### Supported search parameters

The following parameters for each query are supported.

| Key    | Support Values    | Allowed Count | Description |
| ------ | ------ | ------------- | ----------- |
| `{attributeID}=` | `{value}`     | 0...N    | Search for attribute/ value matching in query |
| `includefield=`  | `{attributeID}`<br/>`all`   | 0...N   | The other attributes to return in the response; Both public and private tags are supported.<br/>When `all` is provided. Refer to [Search Response](#search-response) for more information about which attributes are returned for each query type.<br/>If a mixture of `{attributeID}` and `all` is provided, the server defaults to using `all`. |
| `limit=`  | `{value}`  | 0..1   | Integer value to limit the number of values returned in the response; <br/>Value can be between the range 1 >= x <= 200, defaulted to 100. |
| `offset=`     | `{value}`  | 0..1  | Skip `{value}` results; <br/>If an offset larger than the number of search query results is provided, a `204 (no content)` response is returned. |
| `fuzzymatching=` | `true` / `false`  | 0..1    | If true fuzzy matching is applied to PatientName attribute; It does a prefix word match of any name part inside PatientName value. For example, if PatientName is "John^Doe", then "joh", "do", "jo do", "Doe" and "John Doe" all match. However, "ohn" doesn't match. |

#### Searchable attributes

We support searching the following attributes and search types.

| Attribute Keyword | All Studies | All Series | All Instances | Study's Series | Study's Instances | Study Series' Instances |
| ----------------- | ----- | ------ | -------- | ----- | ------ | -------- |
| `StudyInstanceUID` | X | X | X |  |  |  |
| `PatientName` | X | X | X |  |  |  |
| `PatientID` | X | X | X |  |  |  |
| `PatientBirthDate` | X | X | X |  |  |  |
| `AccessionNumber` | X | X | X |  |  |  |
| `ReferringPhysicianName` | X | X | X |  |  |  |
| `StudyDate` | X | X | X |  |  |  |
| `StudyDescription` | X | X | X |  |  |  |
| `ModalitiesInStudy` | X | X | X |  |  |  |
| `SeriesInstanceUID` |  | X | X | X | X |  |
| `Modality` |  | X | X | X | X |  |
| `PerformedProcedureStepStartDate` |  | X | X | X | X |  |
| `ManufacturerModelName` | | X | X | X | X |  |
| `SOPInstanceUID` |  |  | X |  | X | X |

#### Search matching

We support the following matching types.

| Search Type | Supported Attribute | Example |
| ----------- | ------------------- | ------- |
| Range Query | `StudyDate`/`PatientBirthDate` | `{attributeID}={value1}-{value2}`. For date/time values, we support an inclusive range on the tag, which is mapped to `attributeID >= {value1} AND attributeID <= {value2}`. If `{value1}` isn't specified, all occurrences of dates/times prior to and including `{value2}` are matched. Likewise, if `{value2}` isn't specified, all occurrences of `{value1}` and subsequent dates/times are matched. However, one of these values has to be present. `{attributeID}={value1}-` and `{attributeID}=-{value2}` are valid, however, `{attributeID}=-` is invalid. |
| Exact Match | All supported attributes | `{attributeID}={value1}` |
| Fuzzy Match | `PatientName`, `ReferringPhysicianName` | Matches any component of the name that starts with the value. |

#### Attribute ID

Tags can be encoded in several ways for the query parameter. We have partially implemented the standard as defined in [PS3.18 6.7.1.1.1](http://dicom.nema.org/medical/dicom/2019a/output/chtml/part18/sect_6.7.html#sect_6.7.1.1.1). The following encodings for a tag are supported.

| Value            | Example          |
| ---------------- | ---------------- |
| `{group}{element}` | `0020000D`         |
| `{dicomKeyword}`   | `StudyInstanceUID` |

Here's an example query searching for instances:

`../instances?Modality=CT&00280011=512&includefield=00280010&limit=5&offset=0`

### Search response

The response is an array of DICOM datasets. Depending on the resource, by *default* the following attributes are returned.

#### Default Study tags

| Tag          | Attribute Name |
| ------------ | -------------- |
| (0008, 0005) | `SpecificCharacterSet` |
| (0008, 0020) | `StudyDate` |
| (0008, 0030) | `StudyTime` |
| (0008, 0050) | `AccessionNumber` |
| (0008, 0056) | `InstanceAvailability` |
| (0008, 0090) | `ReferringPhysicianName` |
| (0008, 0201) | `TimezoneOffsetFromUTC` |
| (0010, 0010) | `PatientName` |
| (0010, 0020) | `PatientID` |
| (0010, 0030) | `PatientBirthDate` |
| (0010, 0040) | `PatientSex` |
| (0020, 0010) | `StudyID` |
| (0020, 000D) | `StudyInstanceUID` |

#### Default Series tags

| Tag          | Attribute Name |
| ------------ | -------------- |
| (0008, 0005) | `SpecificCharacterSet` |
| (0008, 0060) | `Modality` |
| (0008, 0201) | `TimezoneOffsetFromUTC` |
| (0008, 103E) | `SeriesDescription` |
| (0020, 000E) | `SeriesInstanceUID` |
| (0040, 0244) | `PerformedProcedureStepStartDate` |
| (0040, 0245) | `PerformedProcedureStepStartTime` |
| (0040, 0275) | `RequestAttributesSequence` |

#### Default Instance tags

| Tag          | Attribute Name |
| ------------ | -------------- |
| (0008, 0005) | `SpecificCharacterSet` |
| (0008, 0016) | `SOPClassUID` |
| (0008, 0018) | `SOPInstanceUID` |
| (0008, 0056) | `InstanceAvailability` |
| (0008, 0201) | `TimezoneOffsetFromUTC` |
| (0020, 0013) | `InstanceNumber` |
| (0028, 0010) | `Rows` |
| (0028, 0011) | `Columns` |
| (0028, 0100) | `BitsAllocated` |
| (0028, 0008) | `NumberOfFrames` |

If `includefield=all`, the following attributes are included along with default attributes. Along with the default attributes, this is the full list of attributes supported at each resource level.

#### Extra Study tags

| Tag          | Attribute Name |
| ------------ | -------------- |
| (0008, 1030) | `Study Description` |
| (0008, 0063) | `AnatomicRegionsInStudyCodeSequence` |
| (0008, 1032) | `ProcedureCodeSequence` |
| (0008, 1060) | `NameOfPhysiciansReadingStudy` |
| (0008, 1080) | `AdmittingDiagnosesDescription` |
| (0008, 1110) | `ReferencedStudySequence` |
| (0010, 1010) | `PatientAge` |
| (0010, 1020) | `PatientSize` |
| (0010, 1030) | `PatientWeight` |
| (0010, 2180) | `Occupation` |
| (0010, 21B0) | `AdditionalPatientHistory` |

#### Other Series tags

| Tag          | Attribute Name |
| ------------ | -------------- |
| (0020, 0011) | `SeriesNumber` |
| (0020, 0060) | `Laterality` |
| (0008, 0021) | `SeriesDate` |
| (0008, 0031) | `SeriesTime` |

The following attributes are returned:

* All the match query parameters and UIDs in the resource url.
* `IncludeField` attributes supported at that resource level.
* If the target resource is `All Series`, then `Study` level attributes are also returned.
* If the target resource is `All Instances`, then `Study` and `Series` level attributes are also returned.
* If the target resource is `Study's Instances`, then `Series` level attributes are also returned.
* `NumberOfStudyRelatedInstances` aggregated attribute is supported in `Study` level `includeField`.
* `NumberOfSeriesRelatedInstances` aggregated attribute is supported in `Series` level `includeField`.

### Search response codes

The query API returns one of the following status codes in the response.

| Code                      | Description |
| ------------------------- | ----------- |
| `200 (OK)`                  | The response payload contains all the matching resources. |
| `204 (No Content)`          | The search completed successfully but returned no results. |
| `400 (Bad Request)`         | The server was unable to perform the query because the query component was invalid. The response body contains details of the failure. |
| `401 (Unauthorized)`        | The client isn't authenticated. |
| `403 (Forbidden)`              | The user isn't authorized. |
| `503 (Service Unavailable)` | The service is unavailable or busy. Try again later. |

### Other notes

* Querying using the `TimezoneOffsetFromUTC (00080201)` isn't supported.
* The query API doesn't return `413 (request entity too large)`. If the requested query response limit is outside of the acceptable range, a bad request is returned. Anything requested within the acceptable range is resolved.
* When the target resource is Study/Series, there's a potential for inconsistent study/series level metadata across multiple instances. For example, two instances could have different patientName. In this case, the latest wins, and you can search only on the latest data.
* Paged results are optimized to return the matched _newest_ instance first, this might result in duplicate records in subsequent pages if newer data matching the query was added.
* Matching is _not_ case sensitive, and  _not_ accent sensitive for PN VR types.
* Matching is _not_ case sensitive, and _is_ accent sensitive for other string VR types.
* Only the first value is indexed if a single valued data element incorrectly has multiple values.

### Delete

This transaction isn't part of the official DICOMwe Standard. It uses the DELETE method to remove representations of Studies, Series, and Instances from the store.

| Method | Path                                                    | Description |
| ------ | ------------------------------------------------------- | ----------- |
| DELETE | ../studies/{study}                                      | Delete all instances for a specific study |
| DELETE | ../studies/{study}/series/{series}                      | Delete all instances for a specific series within a study |
| DELETE | ../studies/{study}/series/{series}/instances/{instance} | Delete a specific instance within a series |

The parameters `study`, `series`, and `instance` correspond to the DICOM attributes `StudyInstanceUID`, `SeriesInstanceUID`, and `SopInstanceUID` respectively.

There are no restrictions on the request's `Accept` header, `Content-Type` header or body content.

> [!NOTE]
> After a Delete transaction, the deleted instances will not be recoverable.

### Response status codes

| Code                         | Description |
| ---------------------------- | ----------- |
| `204 (No Content)`             | When all the SOP instances are deleted |
| `400 (Bad Request)`            | The request was badly formatted |
| `401 (Unauthorized)`           | The client isn't authenticated |
| `403 (Forbidden)`              | The user isn't authorized |
| `404 (Not Found)`              | When the specified series wasn't found within a study, or the specified instance wasn't found within the series |
| `503 (Service Unavailable)`    | The service is unavailable or busy. Try again later. |

### Delete response payload

The response body is empty. The status code is the only useful information returned.

## Worklist Service (UPS-RS)

The DICOM service supports the Push and Pull SOPs of the [Worklist Service (UPS-RS)](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#chapter_11). The Worklist service provides access to one Worklist containing Workitems, each of which represents a Unified Procedure Step (UPS).

Throughout, the variable `{workitem}` in a URI template stands for a Workitem UID.

Available UPS-RS endpoints include:

|Verb|	Path |	Description |
|---- |---- |---- |
|POST|	{s}/workitems{?AffectedSOPInstanceUID}|	Create a work item |
|POST|	{s}/workitems/{instance}{?transaction}|	Update a work item |
|GET|	{s}/workitems{?query*}	| Search for work items |
|GET|	{s}/workitems/{instance}|	Retrieve a work item |
|PUT|	{s}/workitems/{instance}/state|	Change work item state |
|POST|	{s}/workitems/{instance}/cancelrequest	| Cancel work item |
|POST	|{s}/workitems/{instance}/subscribers/{AETitle}{?deletionlock}	| Create subscription|
|POST|	{s}/workitems/1.2.840.10008.5.1.4.34.5/ |	Suspend subscription|
|DELETE	| {s}/workitems/{instance}/subscribers/{AETitle}	| Delete subscription |
|GET |	{s}/subscribers/{AETitle}| Open subscription channel |

### Create Workitem

This transaction uses the POST method to create a new Workitem.

| Method | Path               | Description |
| ------ | ------------------ | ----------- |
| POST   | ../workitems         | Create a Workitem |
| POST   | ../workitems?{workitem} | Creates a Workitem with the specified UID. |

If not specified in the URI, the payload dataset must contain the Workitem in the `SOPInstanceUID` attribute.

The `Accept` and `Content-Type` headers are required in the request, and must both have the value `application/dicom+json`.

There are several requirements related to DICOM data attributes in the context of a specific transaction. Attributes might be
required to be present, required to not be present, required to be empty, or required to not be empty. These requirements can be
found [in this table](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#table_CC.2.5-3).

> [!NOTE]
> Although the reference table says that SOP Instance UID shouldn't be present, this guidance is specific to the DIMSE protocol and is handled differently in DICOMWeb. The SOP Instance UID should be present in the dataset if not in the URI.

> [!NOTE]
> All the conditional requirement codes including 1C and 2C are treated as optional.

#### Create response status codes

| Code                           | Description |
| ------------------------------ | ----------- |
| `201 (Created)`                | The target Workitem was successfully created. |
| `400 (Bad Request)`            | There was a problem with the request. For example, the request payload didn't satisfy the requirements. |
| `401 (Unauthorized)`           | The client isn't authenticated. |
| `403 (Forbidden)`              | The user isn't authorized. |
| `409 (Conflict)`               | The Workitem already exists. |
| `415 (Unsupported Media Type)` | The provided `Content-Type` isn't supported. |
| `503 (Service Unavailable)`    | The service is unavailable or busy. Try again later. |

#### Create response payload

A success response has no payload. The `Location` and `Content-Location` response headers contain a URI reference to the created Workitem.

A failure response payload contains a message describing the failure.

### Request cancellation

This transaction enables the user to request cancellation of a nonowned Workitem.

There are [four valid Workitem states](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#table_CC.1.1-1).

* `SCHEDULED`
* `IN PROGRESS`
* `CANCELED`
* `COMPLETED`

This transaction only succeeds against Workitems in the `SCHEDULED` state. Any user can claim ownership of a Workitem by setting its Transaction UID and changing its state to `IN PROGRESS`. From then on, a user can only modify the Workitem by providing the correct Transaction UID. While UPS defines Watch and Event SOP classes that allow cancellation requests and other events to be forwarded, this DICOM service doesn't implement these classes, and so cancellation requests on workitems that are `IN PROGRESS` return a failure. An owned Workitem can be canceled via the [Change Workitem State](#change-workitem-state) transaction.

| Method  | Path                                            | Description                                      |
| ------- | ----------------------------------------------- | ------------------------------------------------ |
| POST    | ../workitems/{workitem}/cancelrequest           | Request the cancellation of a scheduled Workitem |

The `Content-Type` header is required, and must have the value `application/dicom+json`.

The request payload might include Action Information as [defined in the DICOM Standard](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#table_CC.2.2-1).

#### Request cancellation response status codes

| Code                         | Description |
| ---------------------------- | ----------- |
| `202 (Accepted)`               | The request was accepted by the server, but the Target Workitem state is unchanged. |
| `400 (Bad Request)`            | There was a problem with the syntax of the request. |
| `401 (Unauthorized)`           | The client isn't authenticated. |
| `403 (Forbidden)`              | The user isn't authorized. |
| `404 (Not Found)`              | The Target Workitem wasn't found. |
| `409 (Conflict)`               | The request is inconsistent with the current state of the Target Workitem. For example, the Target Workitem is in the `SCHEDULED` or `COMPLETED` state. |
| `415 (Unsupported Media Type)` | The provided `Content-Type` isn't supported. |

#### Request cancellation response payload

A success response has no payload, and a failure response payload contains a message describing the failure.
If the Workitem Instance is already in a canceled state, the response includes the following HTTP Warning header:
`299: The UPS is already in the requested state of CANCELED.`

### Retrieve Workitem

This transaction retrieves a Workitem. It corresponds to the UPS DIMSE N-GET operation.

Refer to: https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_11.5

If the Workitem exists on the origin server, the Workitem is returned in an Acceptable Media Type. The returned Workitem won't contain the Transaction UID (0008,1195) Attribute. This is necessary to preserve the attribute's role as an access lock.

| Method  | Path                    | Description   |
| ------- | ----------------------- | ------------- |
| GET     | ../workitems/{workitem}	| Request to retrieve a Workitem	|

The `Accept` header is required and must have the value `application/dicom+json`.

#### Retrieve Workitem response status codes

| Code                         	| Description |
| ----------------------------- | ----------- |
| 200 (OK) | Workitem Instance was successfully retrieved. |
| 400 (Bad Request) | There was a problem with the request.	|
| 401 (Unauthorized) | The client isn't authenticated. |
| 403 (Forbidden) | The user isn't authorized. |
| 404 (Not Found) | The Target Workitem wasn't found. |

#### Retrieve Workitem response payload

* A success response has a single part payload containing the requested Workitem in the Selected Media Type.
* The returned Workitem won't contain the Transaction UID (0008, 1195) attribute of the Workitem, since that should only be known to the Owner.

### Update Workitem

This transaction modifies attributes of an existing Workitem. It corresponds to the UPS DIMSE N-SET operation.

Refer to: https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_11.6

To update a Workitem currently in the `SCHEDULED` state, the `Transaction UID` attribute shouldn't be present. For a Workitem in the `IN PROGRESS` state, the request must include the current Transaction UID as a query parameter. If the Workitem is already in the `COMPLETED` or `CANCELED` states, the response is `400 (Bad Request)`.

| Method  | Path                            | Description           |
| ------- | ------------------------------- | --------------------- |
| POST     | ../workitems/{workitem}?{transaction-uid}	| Update Workitem Transaction	|

The `Content-Type` header is required, and must have the value `application/dicom+json`.

The request payload contains a dataset with the changes to be applied to the target Workitem. When a sequence is modified, the request must include all Items in the sequence, not just the Items to be modified.
When multiple Attributes need to be updated as a group, do the update as multiple Attributes in a single request, not as multiple requests.

There are many requirements related to DICOM data attributes in the context of a specific transaction. Attributes might be
required to be present, required to not be present, required to be empty, or required to not be empty. These requirements can be
found in [this table](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#table_CC.2.5-3).

> [!NOTE]
> All the conditional requirement codes including 1C and 2C are treated as optional.

> [!NOTE]
> The request can't set the value of the Procedure Step State (0074,1000) attribute. Procedure Step State is managed using the Change State transaction, or the Request Cancellation transaction.

#### Update Workitem transaction response status codes

| Code                        	| Description |
| ----------------------------- | ----------- |
| `200 (OK)`              		| The Target Workitem was updated. |
| `400 (Bad Request)`         	| There was a problem with the request. For example: (1) The Target Workitem was in the `COMPLETED` or `CANCELED` state. (2) The Transaction UID is missing. (3) The Transaction UID is incorrect. (4) The dataset didn't conform to the requirements. |
| `401 (Unauthorized)`         	| The client isn't authenticated. |
| `403 (Forbidden)`             | The user isn't authorized. |
| `404 (Not Found)`            	| The Target Workitem wasn't found. |
| `409 (Conflict)`             	| The request is inconsistent with the current state of the Target Workitem. |
| `415 (Unsupported Media Type)` | The provided `Content-Type` isn't supported. |

#### Update Workitem transaction response payload

The origin server supports header fields as required in [Table 11.6.3-2](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_11.6.3-2).

A success response has either no payload, or a payload containing a Status Report document.

A failure response payload might contain a Status Report describing any failures, warnings, or other useful information.

### Change Workitem state

This transaction is used to change the state of a Workitem. It corresponds to the UPS DIMSE N-ACTION operation "Change UPS State". State changes are used to claim ownership, complete, or cancel a Workitem.

Refer to: https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_11.7

If the Workitem exists on the origin server, the Workitem is returned in an Acceptable Media Type. The returned Workitem won't contain the Transaction UID (0008,1195) attribute. This is necessary to preserve this Attribute's role as an access lock as described [here.](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#sect_CC.1.1)

| Method  | Path                            | Description           |
| ------- | ------------------------------- | --------------------- |
| PUT     | ../workitems/{workitem}/state	| Change Workitem State	|

The `Accept` header is required, and must have the value `application/dicom+json`.

The request payload contains the Change UPS State Data Elements. These data elements are:

* **Transaction UID (0008, 1195)**. The request payload includes a Transaction UID. The user agent creates the Transaction UID when requesting a transition to the `IN PROGRESS` state for a given Workitem. The user agent provides that Transaction UID in subsequent transactions with that Workitem.
* **Procedure Step State (0074, 1000)**. The legal values correspond to the requested state transition. They are: `IN PROGRESS`, `COMPLETED`, or `CANCELED`.

#### Change Workitem state response status codes

| Code                         	| Description |
| ----------------------------- | ----------- |
| `200 (OK)`               		| The Workitem Instance was successfully retrieved. |
| `400 (Bad Request)`           | The request can't be performed for one of the following reasons. (1) The request isn't valid given the current state of the Target Workitem. (2) The Transaction UID is missing. (3) The Transaction UID is incorrect |
| `401 (Unauthorized)`          | The client isn't authenticated. |
| `403 (Forbidden)`             | The user isn't authorized. |
| `404 (Not Found)`             | The Target Workitem wasn't found. |
| `409 (Conflict)`              | The request is inconsistent with the current state of the Target Workitem. |

#### Change Workitem state response payload

* Responses include the header fields specified in [section 11.7.3.2](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_11.7.3.2).
* A success response has no payload.
* A failure response payload might contain a Status Report describing any failures, warnings, or other useful information.

### Search Workitems

This transaction enables you to search for Workitems by attributes.

| Method | Path                                            | Description                       |
| ------ | ----------------------------------------------- | --------------------------------- |
| GET    | ../workitems?                                   | Search for Workitems              |

The following `Accept` header is supported for searching.

* `application/dicom+json`

#### Supported Search Parameters

The following parameters for each query are supported.

| Key              | Support Values              | Allowed Count | Description |
| ---------------- | ----------------------------- | ------------- | ----------- |
| `{attributeID}=` | `{value}`                     | 0...N         | Search for attribute/ value matching in query |
| `includefield=`  | `{attributeID}`<br/>`all`     | 0...N         | The other attributes to return in the response; Only top-level attributes can be included - not attributes that are part of sequences. Both public and private tags are supported. When `all` is provided, see [Search Response](#search-response) for more information about which attributes are returned for each query type. If a mixture of `{attributeID}` and `all` is provided, the server defaults to using 'all'. |
| `limit=`         | `{value}`                     | 0...1          | Integer value to limit the number of values returned in the response; The Value can be between the range `1 >= x <= 200`, defaulted to `100`. |
| `offset=`        | `{value}`                     | 0...1          | Skip {value} results; If an offset larger than the number of search query results is provided, a `204 (no content)` response is returned. |
| `fuzzymatching=` | `true` \| `false`             | 0...1          | If true fuzzy matching is applied to any attributes with the Person Name (PN) Value Representation (VR); A prefix word match of any name part inside these attributes is performed. For example, if `PatientName` is `John^Doe`, then `joh`, `do`, `jo do`, `Doe` and `John Doe` all match. However `ohn` does **not** match. |

##### Searchable Attributes

We support searching on these attributes.

|Attribute Keyword|
|----| 
|`PatientName`|
|`PatientID`|
|`ReferencedRequestSequence.AccessionNumber`|
|`ReferencedRequestSequence.RequestedProcedureID`|
|`ScheduledProcedureStepStartDateTime`|
|`ScheduledStationNameCodeSequence.CodeValue`|
|`ScheduledStationClassCodeSequence.CodeValue`|
|`ScheduledStationGeographicLocationCodeSequence.CodeValue`|
|`ProcedureStepState`|
|`StudyInstanceUID`|

##### Search Matching

We support these matching types.

| Search Type | Supported Attribute | Example |
| ----------- | ------------------- | ------- |
| Range Query | `Scheduled​Procedure​Step​Start​Date​Time` | `{attributeID}={value1}-{value2}`. For date/time values, we support an inclusive range on the tag. This is mapped to `attributeID >= {value1} AND attributeID <= {value2}`. If `{value1}` isn't specified, all occurrences of dates/times prior to and including `{value2}` are matched. Likewise, if `{value2}` isn't specified, all occurrences of `{value1}` and subsequent dates/times are matched. However, one of these values must be present. `{attributeID}={value1}-` and `{attributeID}=-{value2}` are valid, however, `{attributeID}=-` is invalid. |
| Exact Match | All supported attributes | `{attributeID}={value1}` |
| Fuzzy Match | `PatientName` | Matches any component of the name that starts with the value |

> [!NOTE]
> While we don't support full sequence matching, we do support exact match on the attributes listed that are contained in a sequence.

##### Attribute ID

Tags can be encoded in many ways for the query parameter. We partially implemented the standard as defined in [PS3.18 6.7.1.1.1](http://dicom.nema.org/medical/dicom/2019a/output/chtml/part18/sect_6.7.html#sect_6.7.1.1.1). The following encodings for a tag are supported.

| Value              | Example          |
| ------------------ | ---------------- |
| `{group}{element}` | `00100010` |
| `{dicomKeyword}`   | `PatientName` |

Example query: 

`../workitems?PatientID=K123&0040A370.00080050=1423JS&includefield=00404005&limit=5&offset=0`

#### Search Response

The response is an array of `0...N` DICOM datasets with the following attributes returned:

* All attributes in [DICOM PowerShell 3.4 Table CC.2.5-3](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#table_CC.2.5-3) with a Return Key Type of 1 or 2.
* All attributes in [DICOM PowerShell 3.4 Table CC.2.5-3](https://dicom.nema.org/medical/dicom/current/output/html/part04.html#table_CC.2.5-3) with a Return Key Type of 1C for which the conditional requirements are met.
* All other Workitem attributes passed as match parameters.
* All other Workitem attributes passed as `includefield` parameter values.

#### Search Response Codes

The query API returns one of the following status codes in the response.

| Code                        | Description |
| --------------------------- | ----------- |
| `200 (OK)`                  | The response payload contains all the matching resource. |
| `206 (Partial Content)`     | The response payload contains only some of the search results, and the rest can be requested through the appropriate request. |
| `204 (No Content)`          | The search completed successfully but returned no results. |
| `400 (Bad Request)`         | There was a problem with the request. For example, invalid Query Parameter syntax. The response body contains details of the failure. |
| `401 (Unauthorized)`        | The client isn't authenticated. |
| `403 (Forbidden)`           | The user isn't authorized. |
| `503 (Service Unavailable)` | The service is unavailable or busy. Try again later. |

#### Other Notes

The query API doesn't return `413 (request entity too large)`. If the requested query response limit is outside of the acceptable range, a bad request is returned. Anything requested within the acceptable range is resolved.

* Paged results are optimized to return matched newest instance first, which might result in duplicate records in subsequent pages if newer data matching the query was added.
* Matching is _not_ case sensitive, and _not_ accent sensitive for PN VR types.
* Matching is _not_ case sensitive, and _is_ accent sensitive for other string VR types.
* If there's a scenario where canceling a Workitem and querying the same Workitem happens at the same time, then the query likely excludes the Workitem that's getting updated, and the response code is `206 (Partial Content)`.

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]

