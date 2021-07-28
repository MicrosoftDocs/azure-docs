---
title: Security controls for Azure Spring Cloud Service
description: Use security controls built in into Azure Spring Cloud Service.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 04/23/2020
ms.custom: devx-track-java
---

# Security controls for Azure Spring Cloud Service

**This article applies to:** ✔️ Java ✔️ C#

Security controls are built in into Azure Spring Cloud Service.

A security control is a quality or feature of an Azure service that contributes to the service's ability to prevent, detect, and respond to security vulnerabilities.  For each control, we use *Yes* or *No* to indicate whether it is currently in place for the service.  We use *N/A* for a control that is not applicable to the service. 

**Data protection security controls**

| Security control | Yes/No | Notes | Documentation |
|:-------------|:-------|:-------------------------------|:----------------------|
| Server-side encryption at rest: Microsoft-managed keys | Yes | User uploaded source and artifacts, config server settings, app settings, and data in persistent storage are stored in Azure Storage, which automatically encrypts the content at rest.<br><br>Config server cache, runtime binaries built from uploaded source, and application logs during the application lifetime are saved to Azure managed disk, which automatically encrypts the content at rest.<br><br>Container images built from user uploaded source are saved in Azure Container Registry, which automatically encrypts the image content at rest. | [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)<br><br>[Server-side encryption of Azure managed disks](../virtual-machines/disk-encryption.md)<br><br>[Container image storage in Azure Container Registry](../container-registry/container-registry-storage.md) |
| Encryption in transient | Yes | User app public endpoints use HTTPS for inbound traffic by default. |  |
| API calls encrypted | Yes | Management calls to configure Azure Spring Cloud service occur via Azure Resource Manager calls over HTTPS. | [Azure Resource Manager](../azure-resource-manager/index.yml) |

**Network access security controls**

| Security control | Yes/No | Notes | Documentation |
|:-------------|:-------|:-------------------------------|:----------------------|
| Service Tag | Yes | Use **AzureSpringCloud** service tag to define outbound network access controls on [network security groups](../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md), to allow traffic to Azure Spring Cloud applications. | [Service tags](../virtual-network/service-tags-overview.md) |

## Next steps

* [Quickstart: Deploy your first Azure Spring Cloud application](./quickstart.md)