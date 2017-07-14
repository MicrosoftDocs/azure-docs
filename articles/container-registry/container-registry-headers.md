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

Azure Container Registries are compatible with a multitude of services and orchestrators. To make it easier to track the source services and agents from which ACR is used, we have started using the Docker header field in the Docker.config file.



## Viewing repositories in the Portal

The ACR headers follow the format:
```
X-Meta-Source-Client: <cloud>/<service>/<optionalservicename>
```

* Cloud: Azure, Azure Stack, or other government or country-specific Azure clouds. Although Azure Stack and government clouds are not currently supported, this parameter enables future support.
* Service: name of the service.
* Optionalservicename: optional parameter for services with subservices, or to specify a SKU (ex: web apps correspond with Azure/app-service/web-apps).

Partner services and orchestrators are encouraged to use specific header values to help with our telemetry. Users can also modify the value passed to the header if they so desire.

The values we want ACR partners to use to populate the "X-Meta-Source-Client" field are below:

| Service Name              | Header                                |
| ------------------------- | ------------------------------------- |
| Azure Container Service   | azure/compute/azure-container-service |
| App Service - Web Apps    | azure/app-service/web-apps            |
| App Service - Logic Apps  | azure/app-service/logic-apps          |
| Batch                     | azure/compute/batch                   |
| Cloud Console             | azure/cloud-console                   |
| Functions                 | azure/compute/functions               |
| Internet of Things - Hub  | azure/iot/hub                         |
| HDInsight                 | azure/data/hdinsight                  |
| Jenkins                   | azure/jenkins                         |
| Machine Learning          | azure/data/machile-learning           |
| Service Fabric            | azure/compute/service-fabric          |
| VSTS                      | azure/vsts                            |


## Next steps
[Learn more about registries and the supported services and orchestrators](container-registry-intro.md)
