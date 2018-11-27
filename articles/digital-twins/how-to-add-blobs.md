---
title: Add blobs to objects in Azure Digital Twins | Microsoft Docs
description: Understanding how to add blobs to objects in Azure Digital Twins
author: kingdomofends
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: adgera
---

# Add blobs to objects in Azure Digital Twins

Blobs are unstructured representations of common file types, like pictures and logs. Blobs keep track of what kind of data they represent by using a MIME type (for example: "image/jpeg") and metadata (name, description, type, and so on).

Azure Digital Twins supports attaching blobs to devices, spaces, and users. Blobs can represent a profile picture for a user, a device photo, a video, a map, or a log.

> [!NOTE]
> This article assumes:
> * That your instance is correctly configured to receive Management API requests.
> * That you've correctly authenticated by using a REST client of your choice.

## Uploading blobs: an overview

You can use multipart requests to upload blobs to specific endpoints and their respective functionalities.

> [!IMPORTANT]
> Multipart requests require three pieces of information. For Azure Digital Twins:
> * A **Content-Type** header:
>   * `application/json; charset=utf-8`
>   * `multipart/form-data; boundary="USER_DEFINED_BOUNDARY"`
> * A **Content-Disposition**: `form-data; name="metadata"`
> * The file content to upload
>
> The **Content-Type** and **Content-Disposition** information can vary depending on the use scenario.

Multipart requests made to the Azure Digital Twins Management APIs have two parts:

* Blob metadata such as an associated MIME type, as shown in the **Content-Type** and **Content-Disposition** information

* Blob contents (the unstructured contents of the file)  

Neither of the two parts is required for **PATCH** requests. Both are required for **POST** or create operations.

### Blob metadata

In addition to **Content-Type** and **Content-Disposition**, multipart requests must specify the correct JSON body. Which JSON body to submit depends on the kind of HTTP request operation that's being performed.

The four main JSON schemas are:

![JSON schemas][1]

The Swagger documentation describes these model schemas in full detail.

[!INCLUDE [Digital Twins Swagger](../../includes/digital-twins-swagger.md)]

Learn about using the reference documentation by reading [How to use Swagger](./how-to-use-swagger.md).

### Examples

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

To make a **POST** request that uploads a text file as a blob and associates it with a space:

```plaintext
POST YOUR_MANAGEMENT_API_URL/spaces/blobs HTTP/1.1
Content-Type: multipart/form-data; boundary="USER_DEFINED_BOUNDARY"

--USER_DEFINED_BOUNDARY
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
--USER_DEFINED_BOUNDARY
Content-Disposition: form-data; name="contents"; filename="myblob.txt"
Content-Type: text/plain

This is my blob content. In this case, some text, but I could also be uploading a picture, an JSON file, a firmware zip, etc.

--USER_DEFINED_BOUNDARY--
```

| Parameter value | Replace with |
| --- | --- |
| *USER_DEFINED_BOUNDARY* | A multipart content boundary name |

The following code is a .NET implementation of the same blob upload, using the class [MultipartFormDataContent](https://docs.microsoft.com/dotnet/api/system.net.http.multipartformdatacontent):

```csharp
//Supply your metadata in a suitable format
var multipartContent = new MultipartFormDataContent("USER_DEFINED_BOUNDARY");

var metadataContent = new StringContent(JsonConvert.SerializeObject(metaData), Encoding.UTF8, "application/json");
metadataContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json; charset=utf-8");
multipartContent.Add(metadataContent, "metadata");

var fileContents = new StringContent("MY_BLOB.txt");
fileContents.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
multipartContent.Add(fileContents, "contents");

var response = await httpClient.PostAsync("spaces/blobs", multipartContent);
```

## API endpoints

The following sections walk you through core endpoints and their functionalities.

### Devices

You can attach blobs to devices. The following image shows the Swagger reference documentation for your Management APIs. It specifies device-related API endpoints for blob consumption and any required path parameters to pass into them.

![Device blobs][2]

For example, to update or create a blob and attach the blob to a device, make a **PATCH** request to:

```plaintext
YOUR_MANAGEMENT_API_URL/devices/blobs/YOUR_BLOB_ID
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_BLOB_ID* | The desired blob ID |

Successful requests return a **DeviceBlob** JSON object in the response. **DeviceBlob** objects conform to the following JSON schema:

| Attribute | Type | Description | Examples |
| --- | --- | --- | --- |
| **DeviceBlobType** | String | A blob category that can be attached to a device | `Model` and `Specification` |
| **DeviceBlobSubtype** | String | A blob subcategory that's more specific than **DeviceBlobType** | `PhysicalModel`, `LogicalModel`, `KitSpecification`, and `FunctionalSpecification` |

> [!TIP]
> Use the preceding table to handle successfully returned request data.

### Spaces

You can also attach blobs to spaces. The following image lists all space API endpoints responsible for handling blobs. It also lists any path parameters to pass into those endpoints.

![Space blobs][3]

For example, to return a blob attached to a space, make a **GET** request to:

```plaintext
YOUR_MANAGEMENT_API_URL/spaces/blobs/YOUR_BLOB_ID
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_BLOB_ID* | The desired blob ID |

Making a **PATCH** request to the same endpoint enables you to update a metadata description and create a new version of the blob. The HTTP request is made through the **PATCH** method, along with any necessary meta and multipart form data.

Successful operations return a **SpaceBlob** object that conforms to the following schema. You can use it to consume returned data.

| Attribute | Type | Description | Examples |
| --- | --- | --- | --- |
| **SpaceBlobType** | String | A blob category that can be attached to a space | `Map` and `Image` |
| **SpaceBlobSubtype** | String | A blob subcategory that's more specific than **SpaceBlobType** | `GenericMap`, `ElectricalMap`, `SatelliteMap`, and `WayfindingMap` |

### Users

You can attach blobs to user models (for example, to associate a profile picture). The following image shows relevant user API endpoints and any required path parameters, like `id`:

![User blobs][4]

For example, to fetch a blob attached to a user, make a **GET** request with any required form data to:

```plaintext
YOUR_MANAGEMENT_API_URL/users/blobs/YOUR_BLOB_ID
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_BLOB_ID* | The desired blob ID |

The returned JSON (**UserBlob** objects) conforms to the following JSON models:

| Attribute | Type | Description | Examples |
| --- | --- | --- | --- |
| **UserBlobType** | String | A blob category that can be attached to a user | `Image` and `Video` |
| **UserBlobSubtype** |  String | A blob subcategory that's more specific than **UserBlobType** | `ProfessionalImage`, `VacationImage`, and `CommercialVideo` |

## Common errors

A common error is not including the correct header information:

```JSON
{
    "error": {
        "code": "400.600.000.000",
        "message": "Invalid media type in first section."
    }
}
```

## Next steps

To learn more about Swagger reference documentation for Azure Digital Twins, read [Use Azure Digital Twins Swagger](how-to-use-swagger.md).

<!-- Images -->
[1]: media/how-to-add-blobs/blob-models.PNG
[2]: media/how-to-add-blobs/blobs-device-api.PNG
[3]: media/how-to-add-blobs/blobs-space-api.PNG
[4]: media/how-to-add-blobs/blobs-users-api.PNG
