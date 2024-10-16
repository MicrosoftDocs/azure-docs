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

The Dicom service returns the fully qualified url of the imae location in the response object in the dicom tag (UR)  for following operations:
1. Retrieve Instance 
2. Retrieve WorkItems
3. Retrieve OperationStatus
4. Resolve QueryTag
5. Resolve QueryTagError

An example of a standard response for a stow operatoin is as below:
![alt text](image.png)

Here, the url in the response contains a dicom tag "UR" with the value represents the location of the image.

`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

 The hostname of this Url represents the dicom service that is being used. 

 To breakdown the structure of the above urlm it consists of
 1. hostname -> https://localhost:63838
 2. path -> v2/partitions/foo
 3. Dicom web standard path -> studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114

 The feature allows to manipuate the hostname and the path of the response object if needed.

 # How it works
 This feature will allow modify the path of response url if directed by client based on the request headers they provided.
The modified header will be based on following two headers:
1. x-Forwarded-Host
2. x-Forwarded-Prefix

These headers are a part of [.net core standard forwarded headers](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-8.0#forwarded-headers). 

If x-forwarded-host header is present in the request object, it would replace the host name with the value provided.

if x-forwarded-prefix header is present in the request object, it would replace the path with the value provided.

## Example:
### Response of stow operation of dicom service when the above headers are not provided:
`https://localhost:63838/v2/partitions/foo/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.77033797676425927098669402985243398207/instances/1.2.826.0.1.3680043.8.498.13273713909719068980354078852867170114`

### Response of stow operation of dicom service when the above headers are provided:

![alt text](image-1.png)

 `https://api.powershare.com/newbasePath/studies/1.2.826.0.1.3680043.8.498.13230779778012324449356534479549187420/series/1.2.826.0.1.3680043.8.498.45787841905473114233124723359129632652/instances/1.2.826.0.1.3680043.8.498.12714725698140337137334606354172323212`

 # Things to remember
 1. Forwarded headers donot have to be used together. If there is a need to just replace hostname and not path, only forwarded host header can be used. Similarly, if there is a need to just replace path, only forwared prefix header can be used.

 2. These headers follow the standard .netcore structure. 
