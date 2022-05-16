---
title: Use the REST API to add upload storage account configuration in Azure IoT Central
description: How to use the IoT Central REST API to add upload storage account configuration in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 05/12/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to upload a file

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage [device templates](concepts-device-templates.md) in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

## Upload storage account configuration

IoT Central lets you upload media and other files from connected devices to cloud storage. You configure the file upload capability in your IoT Central application, and then implement file uploads in your device code.

## Upload File REST API

The IoT Central REST API lets you:

* Add a file upload storage account configuration
* Update a file upload storage account configuration
* Get the file upload storage account configuration
* Delete the file upload storage configuration

## Add a file upload storage account configuration

Use the following request to create a file upload Blob Storage account configuration

```http
PUT https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```

The request body has the following fields:

* `account`: The storage account name where to upload the file to.
* `connectionString`:  The connection string used to configure the storage account.
* `container`:The name of the container inside the storage account.
* `etag`:ETag to prevent conflict with multiple uploads
* `sasTtl`: ISO 8601 duration standard, The amount of time the device’s request to upload a file is valid before it expires.

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container",
  "sasTtl": "PT1H"
}
```

The response to this request looks like the following example: 

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container",
  "sasTtl": "PT1H",
  "state": "pending",
  "etag": "\"7502ac89-0000-0300-0000-627eaf100000\""

}

```

## Get the file upload storage account configuration

Use the following request to retrieve details of a storage account configuration:

```http
GET https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```

The response to this request looks like the following example:

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container",
  "state": "succeeded",
  "etag": "\"7502ac89-0000-0300-0000-627eaf100000\""

}
```

## Update the file upload storage account configuration

```http
PATCH https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container2",
  "sasTtl": "PT1H"
}
```

The response to this request looks like the following example:

```json

{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;EndpointSuffix=core.windows.net",
  "container": "container",
  "sasTtl": "PT1H",
    "state": "succeeded",
    "etag": "\"7502ac89-0000-0300-0000-627eaf100000\""
```

## Remove the file upload storage account configuration

Use the following request to delete a  storage account configuration:

```http
DELETE https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```


## Next steps

Now that you've learned how to manage device templates with the REST API, a suggested next step is to [How to create device templates from IoT Central GUI.](howto-set-up-template.md#create-a-device-template)
