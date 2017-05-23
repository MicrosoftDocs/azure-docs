---
title: Azure container registry repositories | Microsoft Docs
description: How to use Azure Container Registry repositories for Docker images
services: container-registry
documentationcenter: ''
author: cristy
manager: balans
editor: dlepow


ms.service: container-registry
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/22/2017
ms.author: cristyg

---
# Azure container registry repositories

Azure Container Registries are compatible with a multitude of services and orchestrators. In order to make it easier to track the source services and agents from which ACR is used, we have started using the Docker header field in the Docker.config file.



## Viewing repositories in the Portal

The ACR headers will follow the format:
```
Source-client: <cloud>/<service>/<optionalservicename>
```

* Cloud: Public Azure, Azure Stack, or other government or country-specific Azure clouds (currently not supported for ACR).
* Service: name of the service.
* Optionalservicename: optional parameter for services with subservices, or to specify a SKU (ex: web apps would be Azure/app-service/web-apps).

Partner services and orchestrators will be encouraged to use specific header values to help with our telemetry. Users can also modify the value passed to the header if they so desire.

Below are the key-value pairs we are encouraging ACR partners to use:

| Service Name              | Header                                |
| ------------------------- | ------------------------------------- |
| Azure Container Service   | azure/compute/azure-container-service |
| App Service - Web Apps    | azure/app-service/web-apps            |
| App Service - Logic Apps  | azure/app-service/logic-apps          |
| Batch                     | azure/compute/batch                   |
| Cloud Console             | azure/cloud-console                   |
| C-Series                  | azure/compute/c-series                |
| Functions                 | azure/compute/functions               |
| HDInsight                 | azure/data/hdinsight                  |
| Jenkins                   | azure/jenkins                         |
| Service Fabric            | azure/compute/service-fabric          |
| VSTS                      | azure/vsts                            |


## Next steps
[Learn more about registries and the supported services and orchestrators](container-registry-intro.md)
