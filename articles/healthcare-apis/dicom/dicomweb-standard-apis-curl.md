---
title:  Use cURL and DICOMweb Standard APIs in Azure Health Data Services
description: Use cURL and DICOMweb Standard APIs to store, retrieve, search, and delete DICOM files in the DICOM service.  
author: varunbms
ms.service: azure-health-data-services
ms.subservice: dicom-service
ms.topic: tutorial
ms.date: 10/18/2023
ms.author: buchvarun
---

# Use DICOMweb Standard APIs with cURL

This article shows how to work with the DICOMweb service using cURL and sample .dcm DICOM&reg; files.

Use these sample files:

- blue-circle.dcm
- dicom-metadata.csv
- green-square.dcm
- red-triangle.dcm

The filename, studyUID, seriesUID, and instanceUID of the sample DICOM files are:

| File | StudyUID | SeriesUID | InstanceUID |
| --- | --- | --- | ---|
|green-square.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652|1.2.826.0.1.3680043.8.498.12714725698140337137334606354172323212|
|red-triangle.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652|1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395|
|blue-circle.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207|1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114|

>[!NOTE]
>Each of these files represents a single instance and is part of the same study. Also, the green-square and red-triangle are part of the same series, while the blue-circle is in a separate series.

## Prerequisites

To use the DICOM Standard APIs, you must have an instance of the DICOM service deployed. For more information, see [Deploy the DICOM service using the Azure portal](deploy-dicom-services-in-azure.md).

After deploying an instance of the DICOM service, retrieve the URL for your App service.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search **Recent resources** and select your DICOM service instance.
3. Copy the **Service URL** of your DICOM service. 
4. If you need an access token, see [Get access token for the DICOM service](dicom-get-access-token-azure-cli.md). 

For this code, we access a Public Preview Azure service. It's important that you don't upload any private health information (PHI).


## Work with the DICOM service
 
The DICOMweb Standard makes heavy use of `multipart/related` HTTP requests combined with DICOM specific accept headers. Developers familiar with other REST-based APIs often find working with the DICOMweb Standard awkward. However, after you get it up and running, it's easy to use. It just takes a little familiarity to get started.

The cURL commands each contain at least one, and sometimes two, variables that must be replaced. To simplify running the commands, search and replace the following variables your specific values.

* {Service URL} The service URL is the URL to access your DICOM service that you provisioned in the Azure portal, for example, ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the version as part of the url when making requests. More information can be found in the [API Versioning for DICOM service Documentation](api-versioning-dicom-service.md).
* {path-to-dicoms} - The path to the directory that contains the red-triangle.dcm file, such as `C:/dicom-server/docs/dcms`
    * Ensure using forward slashes as separators and end the directory _without_ a trailing forward slash.


## Upload DICOM instances (STOW)

### Store instances using multipart/related

This request intends to demonstrate how to upload DICOM files using multipart/related. 

>[!NOTE]
>The DICOM service is more lenient than the DICOM standard. However, the example demonstrates a POST request that complies tightly to the standard.

_Details:_

* Path: ../studies
* Method: POST
* Headers:
    * Accept: application/dicom+json
    * Content-Type: multipart/related; type="application/dicom"
    * Authorization: Bearer {token value}
* Body:
    * Content-Type: application/dicom for each file uploaded, separated by a boundary value

Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those tools, you might need to use a slightly modified Content-Type header. The following tools can be used successfully.
* Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234
* Content-Type: multipart/related; boundary=ABCD1234
* Content-Type: multipart/related

```
curl --location --request POST "{Service URL}/v{version}/studies"
--header "Accept: application/dicom+json"
--header "Content-Type: multipart/related; type=\"application/dicom\""
--header "Authorization: Bearer {token value}"
--form "file1=@{path-to-dicoms}/red-triangle.dcm;type=application/dicom"
--trace-ascii "trace.txt"
```

### Store instances for a specific study

This request demonstrates how to upload DICOM files using multipart/related to a designated study.

_Details:_
* Path: ../studies/{study}
* Method: POST
* Headers:
    * Accept: application/dicom+json
    * Content-Type: multipart/related; type="application/dicom"
    * Authorization: Bearer {token value}
* Body:
    * Content-Type: application/dicom for each file uploaded, separated by a boundary value

Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those languages and tools, you might need to use a slightly modified Content-Type header. The following tools can be used successfully.

 * Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234
 * Content-Type: multipart/related; boundary=ABCD1234
 * Content-Type: multipart/related

```
curl --request POST "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420"
--header "Accept: application/dicom+json"
--header "Content-Type: multipart/related; type=\"application/dicom\""
--header "Authorization: Bearer {token value}"
--form "file1=@{path-to-dicoms}/blue-circle.dcm;type=application/dicom"
```

### Store-single-instance

> [!NOTE]
> This is a non-standard API that allows the upload of a single DICOM file without the need to configure the POST for multipart/related. Although cURL handles multipart/related well, this API allows tools like Postman to upload files to the DICOM service.

The following method is required to upload a single DICOM file.

_Details:_
* Path: ../studies
* Method: POST
* Headers:
   * Accept: application/dicom+json
   * Content-Type: application/dicom
   * Authorization: Bearer {token value}
* Body:
    * Contains a single DICOM file as binary bytes.

```
curl --location --request POST "{Service URL}/v{version}/studies"
--header "Accept: application/dicom+json"
--header "Content-Type: application/dicom"
--header "Authorization: Bearer {token value}"
--data-binary "@{path-to-dicoms}/green-square.dcm"
```

### Upsert instances using multipart/related

> [!NOTE]
> This is a non-standard API that allows the upsert of DICOM files using multipart/related. 

_Details:_

* Path: ../studies
* Method: PUT
* Headers:
    * Accept: application/dicom+json
    * Content-Type: multipart/related; type="application/dicom"
    * Authorization: Bearer {token value}
* Body:
    * Content-Type: application/dicom for each file uploaded, separated by a boundary value

Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those tools, you might need to use a slightly modified Content-Type header. The following tools can be used successfully.
* Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234
* Content-Type: multipart/related; boundary=ABCD1234
* Content-Type: multipart/related

```
curl --location --request PUT "{Service URL}/v{version}/studies"
--header "Accept: application/dicom+json"
--header "Content-Type: multipart/related; type=\"application/dicom\""
--header "Authorization: Bearer {token value}"
--form "file1=@{path-to-dicoms}/red-triangle.dcm;type=application/dicom"
--trace-ascii "trace.txt"
```

### Upsert instances for a specific study

> [!NOTE]
> This is a non-standard API that allows the upsert of DICOM files using multipart/related to a designated study. 

_Details:_
* Path: ../studies/{study}
* Method: PUT
* Headers:
    * Accept: application/dicom+json
    * Content-Type: multipart/related; type="application/dicom"
    * Authorization: Bearer {token value}
* Body:
    * Content-Type: application/dicom for each file uploaded, separated by a boundary value

Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those languages and tools, you might need to use a slightly modified Content-Type header. The following tools can be used successfully.

 * Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234
 * Content-Type: multipart/related; boundary=ABCD1234
 * Content-Type: multipart/related

```
curl --request PUT "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420"
--header "Accept: application/dicom+json"
--header "Content-Type: multipart/related; type=\"application/dicom\""
--header "Authorization: Bearer {token value}"
--form "file1=@{path-to-dicoms}/blue-circle.dcm;type=application/dicom"
```

### Upsert single instance

> [!NOTE]
> This is a non-standard API that allows the upsert of a single DICOM file. 

Use this method to upload a single DICOM file.

_Details:_
* Path: ../studies
* Method: PUT
* Headers:
   * Accept: application/dicom+json
   * Content-Type: application/dicom
   * Authorization: Bearer {token value}
* Body:
    * Contains a single DICOM file as binary bytes.

```
curl --location --request PUT "{Service URL}/v{version}/studies"
--header "Accept: application/dicom+json"
--header "Content-Type: application/dicom"
--header "Authorization: Bearer {token value}"
--data-binary "@{path-to-dicoms}/green-square.dcm"
```

## Retrieve DICOM (WADO)

### Retrieve all instances within a study

This request retrieves all instances within a single study and returns them as a collection of multipart/related bytes.

_Details:_
* Path: ../studies/{study}
* Method: GET
* Headers:
   * Accept: multipart/related; type="application/dicom"; transfer-syntax=*
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420"
--header "Accept: multipart/related; type=\"application/dicom\"; transfer-syntax=*"
--header "Authorization: Bearer {token value}"
--output "suppressWarnings.txt"
```

This cURL command shows the downloaded bytes in the output file (suppressWarnings.txt), but they aren't direct DICOM files, only a text representation of the multipart/related download.

### Retrieve metadata of all instances in study

This request retrieves the metadata for all instances within a single study.

_Details:_
* Path: ../studies/{study}/metadata
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

This cURL command shows the downloaded bytes in the output file (suppressWarnings.txt), but they aren't direct DICOM files, only a text representation of the multipart/related download.

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/metadata"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Retrieve all instances within a series

This request retrieves all instances within a single series, and returns them as a collection of multipart/related bytes.

_Details:_
* Path: ../studies/{study}/series/{series}
* Method: GET
* Headers:
   * Accept: multipart/related; type="application/dicom"; transfer-syntax=*
   * Authorization: Bearer {token value}

This cURL command shows the downloaded bytes in the output file (suppressWarnings.txt), but it's not the DICOM file, only a text representation of the multipart/related download.

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"
--header "Accept: multipart/related; type=\"application/dicom\"; transfer-syntax=*"
--header "Authorization: Bearer {token value}"
--output "suppressWarnings.txt"
```

### Retrieve metadata of all instances within a series

This request retrieves the metadata for all instances within a single study.

_Details:_
* Path: ../studies/{study}/series/{series}/metadata
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/metadata"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```
 
### Retrieve a single instance within a series of a study

This request retrieves a single instance, and returns it as a DICOM formatted stream of bytes.

_Details:_
* Path: ../studies/{study}/series{series}/instances/{instance}
* Method: GET
* Headers:
   * Accept: application/dicom; transfer-syntax=*
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"
--header "Accept: application/dicom; transfer-syntax=*"
--header "Authorization: Bearer {token value}"
--output "suppressWarnings.txt"
```

### Retrieve metadata of a single instance within a series of a study

This request retrieves the metadata for a single instance within a single study and series.

_Details:_
* Path: ../studies/{study}/series/{series}/instances/{instance}/metadata
* Method: GET
* Headers:
  * Accept: application/dicom+json
  * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395/metadata"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Retrieve one or more frames from a single instance

This request retrieves one or more frames from a single instance, and returns them as a collection of multipart/related bytes. Multiple frames can be retrieved by passing a comma-separated list of frame numbers.  All DICOM instances with images have at minimum one frame, which is often simply the image associated with the instance itself.

_Details:_
* Path: ../studies/{study}/series{series}/instances/{instance}/frames/1,2,3
* Method: GET
* Headers:
   * Accept: multipart/related; type="application/octet-stream"; transfer-syntax=1.2.840.10008.1.2.1 (Default) or
   * Accept: multipart/related; type="application/octet-stream"; transfer-syntax=* or
   * Accept: multipart/related; type="application/octet-stream";
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395/frames/1"
--header "Accept: multipart/related; type=\"application/octet-stream\"; transfer-syntax=1.2.840.10008.1.2.1"
--header "Authorization: Bearer {token value}"
--output "suppressWarnings.txt"
```

## Query DICOM (QIDO)

In the following examples, we search for items using their unique identifiers. You can also search for other attributes, such as `PatientName`.

### Search for studies

This request enables searches for one or more studies by DICOM attributes.

For more information about the supported DICOM attributes, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).

_Details:_
* Path: ../studies?StudyInstanceUID={study}
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies?StudyInstanceUID=1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Search for series

This request enables searches for one or more series by DICOM attributes.

For more information about the supported DICOM attributes, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).

_Details:_
* Path: ../series?SeriesInstanceUID={series}
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/series?SeriesInstanceUID=1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Search for series within a study

This request enables searches for one or more series within a single study by DICOM attributes.

For more information about the supported DICOM attributes, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).

_Details:_
* Path: ../studies/{study}/series?SeriesInstanceUID={series}
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series?SeriesInstanceUID=1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Search for instances

This request enables searches for one or more instances by DICOM attributes.

For more information about the supported DICOM attributes, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).

_Details:_
* Path: ../instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/instances?SOPInstanceUID=1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Search for instances within a study

This request enables searches for one or more instances within a single study by DICOM attributes.

For more information about the supported DICOM attributes, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md).

_Details:_
* Path: ../studies/{study}/instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value} 

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/instances?SOPInstanceUID=1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```

### Search for instances within a study and series

This request enables searches for one or more instances within a single study and single series by DICOM attributes.

For more information about the supported DICOM attributes, see the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md)

_Details:_
* Path: ../studies/{study}/series/{series}/instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * Accept: application/dicom+json
   * Authorization: Bearer {token value}

```
curl --request GET "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances?SOPInstanceUID=1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"
--header "Accept: application/dicom+json"
--header "Authorization: Bearer {token value}"
```


## Delete DICOM 

### Delete a specific instance within a study and series

This request deletes a single instance within a single study and single series.

Delete isn't part of the DICOM standard, but is added for convenience.

_Details:_
* Path: ../studies/{study}/series/{series}/instances/{instance}
* Method: DELETE
* Headers:
   * Authorization: Bearer {token value}  

```
curl --request DELETE "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"
--header "Authorization: Bearer {token value}"
```

### Delete a specific series within a study

This request deletes a single series (and all child instances) within a single study.

Delete isn't part of the DICOM standard, but is added for convenience.

_Details:_
* Path: ../studies/{study}/series/{series}
* Method: DELETE
* Headers:
   * Authorization: Bearer {token value}

```
curl --request DELETE "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"
--header "Authorization: Bearer {token value}"
```

### Delete a specific study

This request deletes a single study (and all child series and instances).

Delete isn't part of the DICOM standard, but is added for convenience.

_Details:_
* Path: ../studies/{study}
* Method: DELETE
* Headers:
   * Authorization: Bearer {token value}

```
curl--request DELETE "{Service URL}/v{version}/studies/1.2.826.0.1.3680043.8.498
--header "Authorization: Bearer {token value}"
```

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
