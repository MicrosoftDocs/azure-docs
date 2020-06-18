---
title:  Concept - Security controls for Azure Spring Cloud Service
description: Use security controls built in into Azure Spring Cloud Service.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 04/23/2020
---

# Security controls for Azure Spring Cloud Service
Security controls are built in into Azure Spring Cloud Service.

A security control is a quality or feature of an Azure service that contributes to the service's ability to prevent, detect, and respond to security vulnerabilities.  For each control, we use *Yes* or *No* to indicate whether it is currently in place for the service.  We use *N/A* for a control that is not applicable to the service. 

**Data protection security controls**

| Security control | Yes/No | Notes | Documentation |
|:-------------|:-------|:-------------------------------|:----------------------|
| Server-side encryption at rest: Microsoft-managed keys | Yes | User uploaded source and artifacts, config server settings, app settings, and data in persistent storage are stored in Azure Storage, which automatically encrypts the content at rest.<br><br>Config server cache, runtime binaries built from uploaded source, and application logs during the application lifetime are saved to Azure-Managed Disk, which automatically encrypts the content at rest.<br><br>Container images built from user uploaded source are saved in Azure Container Registry, which automatically encrypts the image content at rest. | [Azure Storage encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)<br><br>[Server-side encryption of Azure managed disks](https://docs.microsoft.com/azure/virtual-machines/linux/disk-encryption)<br><br>[Container image storage in Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-storage) |
| Encryption in transient | Yes | User app public endpoints use HTTPS for inbound traffic by default. |  |
| API calls encrypted | Yes | Management calls to configure Azure Spring Cloud service occur via Azure Resource Manager calls over HTTPS. | [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/) |

