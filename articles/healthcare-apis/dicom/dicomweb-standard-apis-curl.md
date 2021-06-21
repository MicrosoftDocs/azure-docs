---
title:  Using DICOMweb&trade;Standard APIs with cURL - Azure Healthcare APIs 
description: In this tutorial, you'll learn how to use DICOMweb&trade;Standard APIs with cURL. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 06/21/2021
ms.author: aersoy
---

# Using DICOMWeb&trade; Standard APIs with cURL

This tutorial uses cURL to demonstrate working with the DICOM Service.

In this tutorial, we'll use these [sample DICOM files](../dcms). The file name, studyUID, seriesUID, and instanceUID of the sample DICOM files is as follows:

| File | StudyUID | SeriesUID | InstanceUID |
| --- | --- | --- | ---|
|green-square.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652|1.2.826.0.1.3680043.8.498.12714725698140337137334606354172323212|
|red-triangle.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652|1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395|
|blue-circle.dcm|1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420|1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207|1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114|

> [!NOTE]
> Each of these files represent a single instance and are part of the same study. Also, the green-square and red-triangle are part of the same series, while the blue-circle is in a separate series.

## Prerequisites

To use the DICOMWeb&trade; Standard APIs, you must have an instance of the DICOM Service deployed. If you haven't already deployed an instance of the DICOM Service, see [Deploy DICOM Services using the Azure portal](deploy-dicom-services-in-azure.md).

Once you've deployed an instance of the DICOM Service, retrieve the URL for your App Service:

1. Sign into the [Azure portal](https://ms.portal.azure.com/).
1. Search **Recent resources** and select your DICOM Service instance.
1. Copy the **Service URL** of your DICOM Service.

For this code, we'll be accessing an unsecured dev/test service. As a safe guard, don't upload any private health information (PHI).


## Working with the DICOM Service
 
The DICOMweb&trade; Standard makes heavy use of `multipart/related` HTTP requests combined with DICOM specific accept headers. Developers familiar with other REST-based APIs often find working with the DICOMweb&trade; Standard awkward. However, once you have it up and running, it's easy to use. It just takes a little familiarity to get started.

The cURL commands each contain at least one, and sometimes two, variables that much be replaced. To simplify running the commands, search and replace the following variables by replacing them with your specific values:

* {service-name} - The name of your App Service (without the `.azurewebsites.net`), such as `mydicomserver`
* {path-to-dicoms} - The path to the directory that contains the red-triangle.dcm file, such as `C:/dicom-server/docs/dcms`
    * Ensure to use forward slashes as separators and end the directory _without_ a trailing forward slash.     

---
## Uploading DICOM Instances (STOW)
---
### Store-instances-using-multipart/related

This request intends to demonstrate how to upload DICOM files using multipart/related. 

> [!NOTE]
> The DICOM Service is more lenient than the DICOM standard. However, the example below demonstrates a POST request that complies tightly to the standard.

_Details:_

* Path: ../studies
* Method: POST
* Headers:
    * `Accept: application/dicom+json`
    * `Content-Type: multipart/related; type="application/dicom"`
* Body:
    * `Content-Type: application/dicom` for each file uploaded, separated by a boundary value

> Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those, you may need to use a slightly modified Content-Type header. The following have been used successfully.
 > * `Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234`
 > * `Content-Type: multipart/related; boundary=ABCD1234`
 > * `Content-Type: multipart/related`

`curl --location --request POST "http://{service-name}.azurewebsites.net/studies" --header "Accept: application/dicom+json" --header "Content-Type: multipart/related; type=\"application/dicom\"" --form "file1=@{path-to-dicoms}/red-triangle.dcm;type=application/dicom" --trace-ascii "trace.txt"`

---

### Store-instances-for-a-specific-study

This request demonstrates how to upload DICOM files using multipart/related to a designated study. 

_Details:_
* Path: ../studies/{study}
* Method: POST
* Headers:
    * `Accept: application/dicom+json`
    * `Content-Type: multipart/related; type="application/dicom"`
* Body:
    * `Content-Type: application/dicom` for each file uploaded, separated by a boundary value

> Some programming languages and tools behave differently. For instance, some require you to define your own boundary. For those, you may need to use a slightly modified Content-Type header. The following have been used successfully.
 > * `Content-Type: multipart/related; type="application/dicom"; boundary=ABCD1234`
 > * `Content-Type: multipart/related; boundary=ABCD1234`
 > * `Content-Type: multipart/related`

`curl --request POST "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420" --header "Accept: application/dicom+json" --header "Content-Type: multipart/related; type=\"application/dicom\"" --form "file1=@{path-to-dicoms}/blue-circle.dcm;type=application/dicom"`

---

### Store-single-instance

> [!NOTE]
> This is a non-standard API that allows the upload of a single DICOM file without the need to configure the POST for multipart/related. Although cURL handles multipart/related well, this API allows tools like Postman to upload files to the DICOM Service.

The following is required to upload a single DICOM file.

_Details:_
* Path: ../studies
* Method: POST
* Headers:
   *  `Accept: application/dicom+json`
   *  `Content-Type: application/dicom`
* Body:
    * Contains a single DICOM file as binary bytes.

`curl --location --request POST "http://{service-name}.azurewebsites.net/studies" --header "Accept: application/dicom+json" --header "Content-Type: application/dicom" --data-binary "@{path-to-dicoms}/green-square.dcm"`

---
## Retrieving DICOM (WADO)
---
### Retrieve-all-instances-within-a-study

This request retrieves all instances within a single study and returns them as a collection of multipart/related bytes.

_Details:_
* Path: ../studies/{study}
* Method: GET
* Headers:
   * `Accept: multipart/related; type="application/dicom"; transfer-syntax=*`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420" --header "Accept: multipart/related; type=\"application/dicom\"; transfer-syntax=*" --output "suppressWarnings.txt"`

> This cURL command will show the downloaded bytes in the output file (suppressWarnings.txt), but these are not direct DICOM files, only a text representation of the multipart/related download.

---
### Retrieve-metadata-of-all-instances-in-study

This request retrieves the metadata for all instances within a single study.

_Details:_
* Path: ../studies/{study}/metadata
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

> This cURL command will show the downloaded bytes in the output file (suppressWarnings.txt), but these are not direct DICOM files, only a text representation of the multipart/related download.

`curl --request GET "http://sjbpostman.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/metadata" --header "Accept: application/dicom+json"`

---
### Retrieve-all-instances-within-a-series

This request retrieves all instances within a single series, and returns them as a collection of multipart/related bytes.

_Details:_
* Path: ../studies/{study}/series/{series}
* Method: GET
* Headers:
   * `Accept: multipart/related; type="application/dicom"; transfer-syntax=*`

> This cURL command will show the downloaded bytes in the output file (suppressWarnings.txt), but it is not the DICOM file, only a text representation of the multipart/related download.

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652" --header "Accept: multipart/related; type=\"application/dicom\"; transfer-syntax=*" --output "suppressWarnings.txt"`

---
### Retrieve-metadata-of-all-instances-within-a-series

This request retrieves the metadata for all instances within a single study.

_Details:_
* Path: ../studies/{study}/series/{series}/metadata
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/metadata" --header "Accept: application/dicom+json"`

---
### Retrieve-a-single-instance-within-a-series-of-a-study

This request retrieves a single instance, and returns it as a DICOM formatted stream of bytes.

_Details:_
* Path: ../studies/{study}/series{series}/instances/{instance}
* Method: GET
* Headers:
   * `Accept: application/dicom; transfer-syntax=*`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395" --header "Accept: application/dicom; transfer-syntax=*" --output "suppressWarnings.txt"`

---
### Retrieve-metadata-of-a-single-instance-within-a-series-of-a-study

This request retrieves the metadata for a single instance within a single study and series.

_Details:_
* Path: ../studies/{study}/series/{series}/instances/{instance}/metadata
* Method: GET
* Headers:
  * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395/metadata" --header "Accept: application/dicom+json"`

---
### Retrieve-one-or-more-frames-from-a-single-instance

This request retrieves one or more frames from a single instance, and returns them as a collection of multipart/related bytes. Multiple frames can be retrieved by passing a comma-separated list of frame numbers.  All DICOM instances with images have at minimum one frame, which is often just the image associated with the instance itself.

_Details:_
* Path: ../studies/{study}/series{series}/instances/{instance}/frames/1,2,3
* Method: GET
* Headers:
   * `Accept: multipart/related; type="application/octet-stream"; transfer-syntax=1.2.840.10008.1.2.1` (Default) or
   * `Accept: multipart/related; type="application/octet-stream"; transfer-syntax=*` or
   * `Accept: multipart/related; type="application/octet-stream";`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395/frames/1" --header "Accept: multipart/related; type=\"application/octet-stream\"; transfer-syntax=1.2.840.10008.1.2.1" --output "suppressWarnings.txt"`

---
## Query DICOM (QIDO)

In the following examples, we'll search for items using their unique identifiers. You can also search for other attributes, such as PatientName.

---
### Search-for-studies

This request enables searches for one or more studies by DICOM attributes.

> Refer to the [DICOM Conformance Statement](dicom-conformance-statement.md) file for supported DICOM attributes.

_Details:_
* Path: ../studies?StudyInstanceUID={study}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/studies?StudyInstanceUID=1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420" --header "Accept: application/dicom+json"`

---
### Search-for-series

This request enables searches for one or more series by DICOM attributes.

> Refer to the [DICOM Conformance Statement](dicom-conformance-statement.md) file for supported DICOM attributes.

_Details:_
* Path: ../series?SeriesInstanceUID={series}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/series?SeriesInstanceUID=1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652" --header "Accept: application/dicom+json"`

---
### Search-for-series-within-a-study

This request enables searches for one or more series within a single study by DICOM attributes.

> Refer to the [DICOM Conformance Statement](dicom-conformance-statement.md) file for supported DICOM attributes.

_Details:_
* Path: ../studies/{study}/series?SeriesInstanceUID={series}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series?SeriesInstanceUID=1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652" --header "Accept: application/dicom+json"`

---
### Search-for-instances

This request enables searches for one or more instances by DICOM attributes.

> Refer to the [DICOM Conformance Statement](dicom-conformance-statement.md) file for supported DICOM attributes.

_Details:_
* Path: ../instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/instances?SOPInstanceUID=1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395" --header "Accept: application/dicom+json"`

---
### Search-for-instances-within-a-study

This request enables searches for one or more instances within a single study by DICOM attributes.

> Refer to the [DICOM Conformance Statement](dicom-conformance-statement.md) file for supported DICOM attributes.

_Details:_
* Path: ../studies/{study}/instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/instances?SOPInstanceUID=1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395" --header "Accept: application/dicom+json"`

---
### Search-for-instances-within-a-study-and-series

This request enables searches for one or more instances within a single study and single series by DICOM attributes.

> Please see the [Conformance.md](../docs/resources/conformance-statement.md) file for supported DICOM attributes.

_Details:_
* Path: ../studies/{study}/series/{series}/instances?SOPInstanceUID={instance}
* Method: GET
* Headers:
   * `Accept: application/dicom+json`

`curl --request GET "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances?SOPInstanceUID=1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395" --header "Accept: application/dicom+json"`

---
## Delete DICOM 
---
### Delete-a-specific-instance-within-a-study-and-series

This request deletes a single instance within a single study and single series.

> Delete is not part of the DICOM standard, but has been added for convenience.

_Details:_
* Path: ../studies/{study}/series/{series}/instances/{instance}
* Method: DELETE
* Headers: No special headers needed

`curl --request DELETE "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"`

---
### Delete-a-specific-series-within-a-study

This request deletes a single series (and all child instances) within a single study.

> Delete is not part of the DICOM standard, but has been added for convenience.

_Details:_
* Path: ../studies/{study}/series/{series}
* Method: DELETE
* Headers: No special headers needed

`curl --request DELETE "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"`

---
### Delete-a-specific-study

This request deletes a single study (and all child series and instances).

> Delete is not part of the DICOM standard, but it has been added for convenience.

_Details:_
* Path: ../studies/{study}
* Method: DELETE
* Headers: No special headers needed

`curl--request DELETE "http://{service-name}.azurewebsites.net/studies/1.2.826.0.1.3680043.8.498

### Next Steps

For more information about DICOM Services, see 

>[!div class="nextstepaction"]
>[Overview of DICOM Services](concepts_dicom_overview.md)