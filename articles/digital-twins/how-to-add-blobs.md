---
title: How to add blobs to objects in Azure Digital Twins | Microsoft Docs
description: Understanding how to add blobs to objects in Azure Digital Twins
author: kingdomofends
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 11/9/2018
ms.author: adgera
---

# How to add blobs to objects in Azure Digital Twins

Blobs are unstructured representations of common file types (like pictures and logs). Blobs keep track of what kind of data they represent using a MIME type (for example: "image/jpeg") and metadata (name, description, type, etc.).

Azure Digital Twins supports attaching **Blobs** to **Devices**, **Spaces**, and **Users**. **Blobs** can represent a profile picture for a **User**, a **Device** photo, a video, or a log.

> [!NOTE]
> This article assumes:
> * That your instance is correctly configured to receive Management API requests.
> * That you've correctly authenticated using a REST client of your choice.

## Uploading blobs: an overview

Multi-part requests are used to upload Blobs to specific endpoints and their respective functionalities.

> [!IMPORTANT]
> Multi-part requests require three essential pieces of information. For Azure Digital Twins:
> * A **Content-Type** header:
>   * `application/json; charset=utf-8`
>   * `multipart/form-data; boundary="thisismywellchosenboundary"`.
> * A **Content-Disposition**: `form-data; name="metadata"`.
> * The file content to upload.
>
> The exact **Content-Type** and **Content-Disposition** may vary depending on use scenario.

Each multi-part request is broken into several chunks. Multi-part requests made to the Azure Digital Twins Management APIs are broken into **two** (**2**) such parts:

1. The first part is required and contains Blob metadata such as an associated MIME type per the **Content-Type** and **Content-Disposition** above.

1. The second part contains the actual Blob contents (the unstructured contents of the file).  

Neither of the two parts are required for **PATCH** requests. Both are required for **POST** or create operations.

### Blob metadata

In addition to **Content-Type** and **Content-Disposition**, multi-part requests must also specify the correct JSON body. Which JSON body to submit depends on the kind of HTTP request operation being performed.

The four main JSON schemas used are:

![Space blobs][1]

These model schemas are described in full detail in the supplied Swagger documentation.

> [!TIP]
> A Swagger sneak preview is provided to demonstrate the API feature set.
> It's hosted at [docs.westcentralus.azuresmartspaces.net/management/swagger](https://docs.westcentralus.azuresmartspaces.net/management/swagger).

You can access your own generated Management API Swagger documentation at:

```plaintext
https://yourInstanceName.yourLocation.azuresmartspaces.net/management/swagger
```

| Custom name | Replace with |
| --- | --- |
| yourInstanceName | The name of your Azure Digital Twins instance |
| yourLocation | Which server region your instance is hosted on |

Learn about using the supplied reference documentation by reading [How to use Swagger](./how-to-use-swagger.md).

### Examples

In the examples below, `yourManagementApiUrl` refers to the URI of the Digital Twins APIs:

```plaintext
https://yourInstanceName.yourLocation.azuresmartspaces.net/management/api/v1.0/
```

| Custom name | Replace with |
| --- | --- |
| yourInstanceName | The name of your Azure Digital Twins instance |
| yourLocation | Which server region your instance is hosted on |

To make a POST request that uploads a text file as a Blob and associates it with a Space:

```plaintext
POST yourManagementApiUrl/spaces/blobs HTTP/1.1
Content-Type: multipart/form-data; boundary="thisismywellchosenboundary"

--thisismywellchosenboundary
Content-Type: application/json; charset=utf-8
Content-Disposition: form-data; name="metadata"

{
  "ParentId": "54213cf5-285f-e611-80c3-000d3a320e1e",
  "Name": "My First Blob",
  "Type": "Map",
  "SubType": "GenericMap",
  "Description": "A well chosen description",
  "Sharing": "None"
}
--thisismywellchosenboundary
Content-Disposition: form-data; name="contents"; filename="myblob.txt"
Content-Type: text/plain

This is my blob content. In this case, some text, but I could also be uploading a picture, an JSON file, a firmware zip, etc.

--thisismywellchosenboundary--
```

| Header name | Replace with |
| --- | --- |
| thisismywellchosenboundary | The desired multi-part boundary |

A .NET implementation of the same Blob upload is provided below using the class [MultipartFormDataContent](https://docs.microsoft.com/dotnet/api/system.net.http.multipartformdatacontent):

```csharp
//Supply your metaData in a suitable format
var multipartContent = new MultipartFormDataContent("thisismywellchosenboundary");

var metadataContent = new StringContent(JsonConvert.SerializeObject(metaData), Encoding.UTF8, "application/json");
metadataContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json; charset=utf-8");
multipartContent.Add(metadataContent, "metadata");

var fileContents = new StringContent("myblob.txt");
fileContents.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
multipartContent.Add(fileContents, "contents");

var response = await httpClient.PostAsync("spaces/blobs", multipartContent);
```

## API endpoints

Below, a walkthrough of core end-points and their specific functionalities is provided.

### Devices

Blobs can be attached to Devices. The image below (depicting the Swagger reference documentation for your Management APIs) specifies Device-related API endpoints for Blob consumption and any required path parameters to pass into them:

![Device blobs][2]

For example, to update or create a Blob and attach the Blob to a Device, a PATCH request is made to:

```plaintext
yourManagementApiUrl/devices/blobs/{id}
```

| Path parameter | Replace with |
| --- | --- |
| *id* | The desired Blob ID |

Successful requests will return a DeviceBlob JSON object in the response. DeviceBlobs conform to the following JSON schema:

| Attribute name | Type | Description | Examples |
| --- | --- | --- | --- |
| DeviceBlobType | String | A Blob category that can be attached to a Device | `Model` and `Specification` |
| DeviceBlobSubtype* | String | A Blob subcategory that is more granular than DeviceBlobType | `PhysicalModel`, `LogicalModel`, `KitSpecification`, and `FunctionalSpecification` |

> [!TIP]
> Use the table above to handle successfully returned request data.

### Spaces

Blobs can also be attached to Spaces. The image below lists all Space API endpoints responsible for handling Blobs along with any path parameters to pass into them:

![Space blobs][3]

For example, to return a Blob attached to a Space, make a GET request to:

```plaintext
yourManagementApiUrl/spaces/blobs/{id}
```

| Path parameter | Replace with |
| --- | --- |
| *id* | The desired Blob ID |

Making PATCH request to the same endpoint will allow you to update a metadata description and create a new version of the Blob. The HTTP request is made using the PATCH method along with any necessary meta and multipart form-data.

Successful operations will return a SpaceBlob that conforms to the following schema and can be used to consume returned data:

| Attribute name | Type | Description | Examples |
| --- | --- | --- | --- |
| SpaceBlobType | String | A Blob category that can be attached to a Space | `Map` and `Image` |
| SpaceBlobSubtype | String | A Blob subcategory that is more granular than SpaceBlobType | `GenericMap`, `ElectricalMap`, `SatelliteMap`, and `WayfindingMap` |

### Users

Blobs can be attached to User models (to say associate a profile picture). The image below depicts relevant Users API endpoints and any required path parameters like an `id`:

![User blobs][4]

For example, to fetch a Blob attached to a User, make a GET request with any required form-data to:

```plaintext
yourManagementApiUrl/users/blobs/{id}
```

| Path parameter | Replace with |
| --- | --- |
| *id* | The desired Blob ID |

Returned JSON (UserBlobs) will conform to the following JSON models:

| Attribute name | Type | Description | Examples |
| --- | --- | --- | --- |
| UserBlobType | String | A Blob category that can be attached to a User | `Image` and `Video` |
| UserBlobSubtype |  String | A Blob subcategory that is more granular than UserBlobType | `ProfessionalImage`, `VacationImage`, and `CommercialVideo` |

## Common errors

Not including the correct header information:

```JSON
{
    "error": {
        "code": "400.600.000.000",
        "message": "Invalid media type in first section."
    }
}
```

## Next steps

To learn more about supplied Azure Digital Twins Swagger reference documentation, read [How to use Digital Twins Swagger](how-to-use-swagger.md).

<!-- Images -->
[1]: media/how-to-add-blobs/blob-models.PNG
[2]: media/how-to-add-blobs/blobs-device-api.PNG
[3]: media/how-to-add-blobs/blobs-space-api.PNG
[4]: media/how-to-add-blobs/blobs-users-api.PNG