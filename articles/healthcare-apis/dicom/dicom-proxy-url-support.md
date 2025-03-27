---
title: Support for URL customization for the DICOM service in Azure Health Data Services
description: Learn how to customize the URL of the image location that is in response object.
author: varunbms
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: overview
ms.date: 10/17/2024
ms.author: buchvarun
---

# What is URL manipulation
Using URL manipulation allows you to customize the URL of the image location that is in the response object.

For the following API operations the DICOM service returns the fully qualified URL of the image location in the response object under a DICOM tag (UR) in the response object.
- Retrieve Instance 
- Retrieve WorkItems
- Retrieve OperationStatus
- Resolve QueryTag
- Resolve QueryTagError

Here's an example of a fully qualified image location URL. The URL could be found in the standard response for a STOW operation for a DICOM service that has data partition enabled, with partition name "foo".

`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

 The preceding URL consists of three parts:
 - hostname -> `https://localhost:63838` (the hostname of DICOM service)
 - path -> `v2/partitions/foo` (the path that represents the version of DICOM service being used and the datapartition name, if enabled)
 - The DICOM web standard path -> `studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

 This feature allows you to customize the path of the image URL, if directed by the client, based on the request headers provided.

## How it works
The modified URL is based on following two headers.
- X-Forwarded-Host: The domain name of the original host (the one the client requested before the proxy or load balancer handled the request). For example: `X-Forwarded-Host: www.example.com`

- X-Forwarded-Prefix:  the original URL path or prefix that was part of the client’s request before the proxy forwarded or changed the request. For example: `X-Forwarded-Prefix: /prefix`

These headers are a part of .NET core standard forwarded headers.

If `x-forwarded-host` header is present in the request object, it replaces the host name with the value provided.

If `x-forwarded-prefix` header is present in the request object, it replaces the path with the value provided.

## List of services that can use forwarded headers for URL manipulation

 - Store(STOW-RS): Upload DICOM objects to the server.
 - Retrieve(WADO-RS): Download DICOM objects from the server.
 - Worklist Service (UPS Push and Pull SOPs): Manage and track medical imaging workflows.
 - Extended query tags: Define custom tags for querying DICOM data.
 - Operation Status

Here are the details of a request header for a STOW operation with the forwarded headers:
* Path: ../studies/{study}
* Method: POST
* Headers:
    * Accept: application/DICOM+json
    * Content-Type: multipart/related; type="application/DICOM"
    * Authorization: Bearer {token value}
    * X-Forwarded-Host: {Domain name of the original host}
    * X-Forwarded-Prefix: {the original URL path}
* Body:
    * Content-Type: application/DICOM for each file uploaded, separated by a boundary value

### Example:
An example of a DICOM tag with VR = UR for a STOW operation when the forwarded headers aren't provided is shown below.

`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

An example of a DICOM tag with VR = UR for a STOW operation when the forwarded headers are provided is shown below.

Sample Request object:
* Path: https://localhost:63838/v2/partitions/foo/studies/studies/{study}
* Method: POST
* Headers:
    * Accept: application/DICOM+json
    * Content-Type: multipart/related; type="application/DICOM"
    * Authorization: Bearer {token value}
    * X-Forwarded-Host: API.powershare.com
    * X-Forwarded-Prefix: /newbasePath
* Body:
    * Content-Type: application/DICOM for each file uploaded, separated by a boundary value


URL of image:
 `https://API.powershare.com/newbasePath/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.12714725698140337137334606354172323212`


 ## Things to remember
 - Forwarded headers don't have to be used together. If there's a need to, replace hostname and not path. Only the forwarded host header can be used. Similarly, if there's a need to replace the path, only the forwarded prefix header can be used.
 - The client is responsible for mapping the hostname and path provided in forwarded headers to the correct DICOM service hostname and pathbase.

 [!INCLUDE [DICOM trademark statement](../includes/healthcare-APIs-DICOM-trademark.md)]
