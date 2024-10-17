---
title: Support for url customization for the DICOM service in Azure Health Data Services
description: Learn how to customize the url of the image location that is in response object.
author: varunbms
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: overview
ms.date: 10/17/2024
ms.author: buchvarun
---

# What is URL manipulation
URl manipulation allows customizing url of the image location that is in response object.

Dicom service returns the fully qualified url of the image location in response object under dicom tag (UR) in the response object of following api operations:
1. Retrieve Instance 
2. Retrieve WorkItems
3. Retrieve OperationStatus
4. Resolve QueryTag
5. Resolve QueryTagError

An example of fully qualified image location of url in the standard response for a stow operation for a dicom service that has data partition enabled with partition name "foo" is as below:

`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

 To breakdown the structure of the above url, it consists of following three parts:
 1. hostname -> `https://localhost:63838` (the hostname of dicom service)
 2. path -> `v2/partitions/foo` (path that represents the version of dicom service being used and the datapartition name if it enabled)
 3. Dicom web standard path -> `studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

 This feature will allow to customize the path of the image url, if directed by client based on the request headers they have provided.

 # How it works
The modified url will be based on following two headers:
1. X-Forwarded-Host: This represents the domain name of the original host (the one the client requested before the proxy or load balancer handled the request). Example: `X-Forwarded-Host: www.example.com`

2. X-Forwarded-Prefix: This represents the original URL path or prefix that was part of the client’s request before the proxy forwarded or changed the request.
Example:
   `X-Forwarded-Prefix: /prefix`


These headers are a part of [.net core standard forwarded headers](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-8.0#forwarded-headers). 

If x-forwarded-host header is present in the request object, it would replace the host name with the value provided.

if x-forwarded-prefix header is present in the request object, it would replace the path with the value provided.

 # List of API that can use forwarded headers for url manipulation

 ### STOW, WADO, worklist, operation status, querytag and querytagerror APIs

Details of a request header for a stow operation with the forwarded headers:

* Path: ../studies/{study}
* Method: POST
* Headers:
    * Accept: application/dicom+json
    * Content-Type: multipart/related; type="application/dicom"
    * Authorization: Bearer {token value}
    * X-Forwarded-Host: {Domain name of the original host}
    * X-Forwarded-Prefix: {the original url path}
* Body:
    * Content-Type: application/dicom for each file uploaded, separated by a boundary value

## Example:
### Value of dicom tag with VR = UR for a stow operation when the above headers are not provided:
`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

### Value of dicom tag with VR = UR for a stow operation when the above headers are provided:

Sample Request object:
 * Path: https://localhost:63838/v2/partitions/foo/studies/studies/{study}
* Method: POST
* Headers:
    * Accept: application/dicom+json
    * Content-Type: multipart/related; type="application/dicom"
    * Authorization: Bearer {token value}
    * X-Forwarded-Host: api.powershare.com
    * X-Forwarded-Prefix: /newbasePath
* Body:
    * Content-Type: application/dicom for each file uploaded, separated by a boundary value


Url of image:
 `https://api.powershare.com/newbasePath/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.12714725698140337137334606354172323212`


 # Things to remember
 1. Forwarded headers donot have to be used together. If there is a need to just replace hostname and not path, only forwarded host header can be used. Similarly, if there is a need to just replace path, only forwared prefix header can be used.

 2. Client is responsible for mapping the hostname and path provided in forwarded headers with correct dicom service hostname and pathbase.

 [!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
