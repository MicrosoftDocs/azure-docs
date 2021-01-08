---
title:  "Customer responsibilities running Azure Spring Cloud in vnet"
description: This article describes customer repsonsibilities running Azure Spring Cloud in vnet.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 12/02/2020
ms.custom: devx-track-java, devx-track-azurecli
---

# Customer responsibilities for running Azure Spring Cloud in VNET
This document includes specifications for use of Azure Spring Cloud in a virtual network.

## Rules and prohibited actions

- Please *do not* modify resource groups created and owned by Azure Spring Cloud.
  - By default, these resource groups are named as *azure-spring-cloud-service-runtime_[SERVICE-INSTANCE-NAME]_[REGION]* and *azure-spring-cloud-app_[SERVICE-INSTANCE-NAME]_[REGION]*.
- Please *do not* modify subnets used by Azure Spring Cloud.
- Please *do not* create more than one Azure Spring Cloud service instance in the same subnet.
- When using a firewall to control traffic, *do not* block the following egress traffic to Azure Spring Cloud components that operate, maintain, and support the service instance.

- Azure Spring Cloud required network rules

  | Destination Endpoint | Port | Use |
  |------|------|------|
  | *:1194 *Or* [ServiceTag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) - AzureCloud:1194 | UDP:1194 | Underlying Kubernetes Cluster management. |
  | *:443 *Or* [ServiceTag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) - AzureCloud:443 | TCP:443 | Azure Spring Cloud service management. |
  | *:9000 *Or* [ServiceTag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) - AzureCloud:9000 | TCP:9000 | Underlying Kubernetes Cluster management. |
  | *:123 *Or* ntp.ubuntu.com:123 | UDP:123 | NTP time synchronization on Linux nodes. |
  | *.azure.io:443 *Or* [ServiceTag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) - AzureContainerRegistry:443 | TCP:443 | Azure Container Registry. |
  | *.file.core.windows.net:445 *Or* [ServiceTag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) - Storage:445 | TCP:445 | Azure File Storage. |

## Azure Spring Cloud required FQDN / application rules

Azure Firewall provides a fully qualified domain name (FQDN) tag **AzureKubernetesService** to simplify the following configurations.

  | Destination FQDN | Port | Use |
  |------|------|------|
  | *.azmk8s.io | HTTPS:443 | Underlying Kubernetes Cluster management. |
  | <i>mcr.microsoft.com</i> | HTTPS:443 | Microsoft Container Registry (MCR). |
  | *.cdn.mscr.io | HTTPS:443 | MCR storage backed by the Azure CDN. |
  | *.data.mcr.microsoft.com | HTTPS:443 | MCR storage backed by the Azure CDN. |
  | <i>management.azure.com</i> | HTTPS:443 | Underlying Kubernetes Cluster management. ​|
  | <i>login.microsoftonline.com</i> | HTTPS:443 | Azure Active Directory authentication.​ |
  |<i>packages.microsoft.com</i>    | HTTPS:443 | Microsoft packages repository. |
  | <i>acs-mirror.azureedge.net</i> | HTTPS:443 | Repository required to install required binaries like kubenet and Azure CNI.​ |

## See also
[Access your application in private network](spring-cloud-access-app-virtual-network.md)
[Expose apps using Application Gateway and Azure Firewall](spring-cloud-expose-apps-gateway-azure-firewall.md) 
