---
title: Support for url manipulation for the DICOM service in Azure Health Data Services
description: Learn how to customize or manipulate the url of the image location that is in response object.
author: varunbms
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: overview
ms.date: 03/26/2024
ms.author: buchvarun
---

# What is URL manipulation
URl manipulation allows customizing the url of the image location that is in response object.

The Dicom service returns the fully qualified url of the imae location in the response object in the dicom tag (UR) in following api resonse:
1. Retrieve Instance 
2. Retrieve WorkItems
3. Retrieve OperationStatus
4. Resolve QueryTag
5. Resolve QueryTagError

An example of a standard response for a stow operatoin is as below:

`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

Here, the url in the response contains a dicom tag "UR" with the value represents the location of the image.

 The hostname of this Url represents the dicom service that is being used. 

 To breakdown the structure of the above urlm it consists of
 1. hostname -> `https://localhost:63838`
 2. path -> `v2/partitions/foo`
 3. Dicom web standard path -> `studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

 The feature allows to manipuate the hostname and the path of the response object if needed.

 # How it works
 This feature will allow modify the path of response url if directed by client based on the request headers they provided.
The modified header will be based on following two headers:
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

 2. This is only url manipulation. Client is responsible for mapping the headers and path provided in forwarded headers with the actual dicom service hostname and pathbase.



 [!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
