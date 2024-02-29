---
title:  Use C# and DICOMweb Standard APIs in Azure Health Data Services
description: Learn how to use C# and DICOMweb Standard APIs to store, retrieve, search, and delete DICOM files in the DICOM service. 
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: tutorial
ms.date: 10/18/2023
ms.author: mmitrik
---

# Use C# and DICOMweb Standard APIs

This article shows how to work with the DICOMweb service using C# and [sample .dcm DICOM&reg; files](https://github.com/microsoft/dicom-server/tree/main/docs/dcms).

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

> [!NOTE]
> Each of these files represents a single instance and is part of the same study. Also, the green-square and red-triangle are part of the same series, while the blue-circle is in a separate series.

## Prerequisites

To use the DICOMweb Standard APIs, you need an instance of the DICOM service deployed. For more information, see [Deploy DICOM service using the Azure portal](deploy-dicom-services-in-azure.md).

After you deploy an instance of the DICOM service, retrieve the URL for your app service:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search **Recent resources** and select your DICOM service instance.
1. Copy the **Service URL** of your DICOM service. Make sure to specify the version as part of the url when making requests. For more information, see [API versioning for the DICOM service](api-versioning-dicom-service.md).

In your application, install the following NuGet packages:

*  [DICOM Client](https://microsofthealthoss.visualstudio.com/FhirServer/_artifacts/feed/Public/NuGet/Microsoft.Health.Dicom.Client/)

*  [fo-dicom](https://www.nuget.org/packages/fo-dicom/)

## Create a DicomWebClient

After you deploy your DICOM service, you create a DicomWebClient. Run the code snippet to create DicomWebClient, which you use for the rest of this tutorial. Ensure you have both NuGet packages installed. For more information, see [Get access token for the DICOM service using Azure CLI](dicom-get-access-token-azure-cli.md).

```c#
string webServerUrl ="{Your DicomWeb Server URL}"
var httpClient = new HttpClient();
httpClient.BaseAddress = new Uri(webServerUrl);
IDicomWebClient client = new DicomWebClient(httpClient);
client.HttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", “{Your token value}”); 
```
With the DicomWebClient, we can now perform the Store, Retrieve, Search, and Delete operations.

## Store DICOM instances (STOW)

By using the DicomWebClient, we can now store DICOM files.

### Store single instance

Store single instance demonstrates how to upload a single DICOM file.

_Details:_

* POST /studies

```c#
DicomFile dicomFile = await DicomFile.OpenAsync(@"{Path To blue-circle.dcm}");
DicomWebResponse response = await client.StoreAsync(new[] { dicomFile });
```

### Store instances for a specific study

Store instances for a specific study demonstrate how to upload a DICOM file into a specified study.

_Details:_

* POST /studies/{study}

```c#
DicomFile dicomFile = await DicomFile.OpenAsync(@"{Path To red-triangle.dcm}");
DicomWebResponse response = await client.StoreAsync(new[] { dicomFile }, "1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420");
```

Before moving on to the next part of the tutorial, upload the `green-square.dcm` file using either of the preceding methods.

## Retrieve DICOM instance (WADO)

The code snippets show how to perform each of the retrieve queries using the DicomWebClient created previously.

The variables are used throughout the rest of the examples:

```c#
string studyInstanceUid = "1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420"; //StudyInstanceUID for all 3 examples
string seriesInstanceUid = "1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652"; //SeriesInstanceUID for green-square and red-triangle
string sopInstanceUid = "1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395"; //SOPInstanceUID for red-triangle
```

### Retrieve all instances within a study

_Details:_

* GET /studies/{study}

```c#
DicomWebResponse response = await client.RetrieveStudyAsync(studyInstanceUid);
```

All three of the dcm files that you uploaded previously are part of the same study, so the response should return all three instances. Validate that the response has a status code of OK and that all three instances are returned.

### Use the retrieved instances

The following code snippet shows how to access the instances that are retrieved. It also shows how to access some of the fields of the instances, and how to save it as a dcm file.

```c#
DicomWebAsyncEnumerableResponse<DicomFile> response = await client.RetrieveStudyAsync(studyInstanceUid);
await foreach (DicomFile file in response)
{
    string patientName = file.Dataset.GetString(DicomTag.PatientName);
    string studyId = file.Dataset.GetString(DicomTag.StudyID);
    string seriesNumber = file.Dataset.GetString(DicomTag.SeriesNumber);
    string instanceNumber = file.Dataset.GetString(DicomTag.InstanceNumber);

    file.Save($"<path_to_save>\\{patientName}{studyId}{seriesNumber}{instanceNumber}.dcm");
}
```

### Retrieve metadata of all instances in study

This response retrieves the metadata for all instances within a single study.

_Details:_

* GET /studies/{study}/metadata

```c#
DicomWebResponse response = await client.RetrieveStudyMetadataAsync(studyInstanceUid);
```

All three of the dcm files that we uploaded previously are part of the same study, so the response should return the metadata for all three instances. Validate that the response has a status code of OK and that all the metadata is returned.

### Retrieve all instances within a series

This response retrieves all instances within a single series.

_Details:_

* GET /studies/{study}/series/{series}


```c#
DicomWebResponse response = await client.RetrieveSeriesAsync(studyInstanceUid, seriesInstanceUid);
```

This series has two instances (green-square and red-triangle), so the response should return both instances. Validate that the response has a status code of OK and that both instances are returned.

### Retrieve metadata of all instances within a series

This response retrieves the metadata for all instances within a single study.

_Details:_

* GET /studies/{study}/series/{series}/metadata

```c#
DicomWebResponse response = await client.RetrieveSeriesMetadataAsync(studyInstanceUid, seriesInstanceUid);
```

This series has two instances (green-square and red-triangle), so the response should return metadata for both instances. Validate that the response has a status code of OK and that both instances of the metadata are returned.

### Retrieve a single instance within a series of a study

This request retrieves a single instance.

_Details:_

* GET /studies/{study}/series{series}/instances/{instance}

```c#
DicomWebResponse response = await client.RetrieveInstanceAsync(studyInstanceUid, seriesInstanceUid, sopInstanceUid);
```

This response should only return the instance red-triangle. Validate that the response has a status code of OK and that the instance is returned.

### Retrieve metadata of a single instance within a series of a study

This request retrieves the metadata for a single instance within a single study and series.

_Details:_

* GET /studies/{study}/series/{series}/instances/{instance}/metadata

```c#
DicomWebResponse response = await client.RetrieveInstanceMetadataAsync(studyInstanceUid, seriesInstanceUid, sopInstanceUid);
```

This response should only return the metadata for the instance red-triangle. Validate that the response has a status code of OK and that the metadata is returned.

### Retrieve one or more frames from a single instance

This request retrieves one or more frames from a single instance.

_Details:_

* GET /studies/{study}/series/{series}/instances/{instance}/frames/{frames}

```c#
DicomWebResponse response = await client.RetrieveFramesAsync(studyInstanceUid, seriesInstanceUid, sopInstanceUid, frames: new[] { 1 });

```

This response should return the only frame from the red-triangle. Validate that the response has a status code of OK and that the frame is returned.

## Query DICOM (QIDO)

> [!NOTE]
> Refer to the [DICOM Conformance Statement](dicom-services-conformance-statement-v2.md#supported-search-parameters) for supported DICOM attributes.

### Search for studies

This request searches for one or more studies by DICOM attributes.

_Details:_

* GET /studies?StudyInstanceUID={study}

```c#
string query = $"/studies?StudyInstanceUID={studyInstanceUid}";
DicomWebResponse response = await client.QueryAsync(query);
```

Validates that the response includes one study, and that the response code is OK.

### Search for series

This request searches for one or more series by DICOM attributes.

_Details:_

* GET /series?SeriesInstanceUID={series}

```c#
string query = $"/series?SeriesInstanceUID={seriesInstanceUid}";
DicomWebResponse response = await client.QueryAsync(query);
```

Validates that the response includes one series, and that the response code is OK.

### Search for series within a study

This request searches for one or more series within a single study by DICOM attributes.

_Details:_

* GET /studies/{study}/series?SeriesInstanceUID={series}

```c#
string query = $"/studies/{studyInstanceUid}/series?SeriesInstanceUID={seriesInstanceUid}";
DicomWebResponse response = await client.QueryAsync(query);
```

Validates that the response includes one series, and that the response code is OK.

### Search for instances

This request searches for one or more instances by DICOM attributes.

_Details:_

* GET /instances?SOPInstanceUID={instance}

```c#
string query = $"/instances?SOPInstanceUID={sopInstanceUid}";
DicomWebResponse response = await client.QueryAsync(query);
```

Validates that the response includes one instance, and that the response code is OK.

### Search for instances within a study

This request searches for one or more instances within a single study by DICOM attributes.

_Details:_

* GET /studies/{study}/instances?SOPInstanceUID={instance}

```c#
string query = $"/studies/{studyInstanceUid}/instances?SOPInstanceUID={sopInstanceUid}";
DicomWebResponse response = await client.QueryAsync(query);
```

Validates that the response includes one instance, and that the response code is OK.

### Search for instances within a study and series

This request searches for one or more instances within a single study and single series by DICOM attributes.

_Details:_

* GET /studies/{study}/series/{series}instances?SOPInstanceUID={instance}

```c#
string query = $"/studies/{studyInstanceUid}/series/{seriesInstanceUid}/instances?SOPInstanceUID={sopInstanceUid}";
DicomWebResponse response = await client.QueryAsync(query);
```

Validates that the response includes one instance, and that the response code is OK.

## Delete DICOM

> [!NOTE]
> Delete is not part of the DICOM standard, but has been added for convenience.

### Delete a specific instance within a study and series

This request deletes a single instance within a single study and single series.

_Details:_

* DELETE /studies/{study}/series/{series}/instances/{instance}

```c#
string sopInstanceUidRed = "1.2.826.0.1.3680043.8.498.47359123102728459884412887463296905395";
DicomWebResponse response = await client.DeleteInstanceAsync(studyInstanceUid, seriesInstanceUid, sopInstanceUidRed);
```

This repose deletes the red-triangle instance from the server. If it's successful, the response status code contains no content.

### Delete a specific series within a study

This request deletes a single series (and all child instances) within a single study.

_Details:_

* DELETE /studies/{study}/series/{series}

```c#
DicomWebResponse response = await client.DeleteSeriesAsync(studyInstanceUid, seriesInstanceUid);
```

This response deletes the green-square instance (it's the only element left in the series) from the server. If it's successful, the response status code contains no content.

### Delete a specific study

This request deletes a single study (and all child series and instances).

_Details:_

* DELETE /studies/{study}

```c#
DicomWebResponse response = await client.DeleteStudyAsync(studyInstanceUid);
```

This response deletes the blue-circle instance (it's the only element left in the series) from the server. If it's successful, the response status code contains no content.

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]