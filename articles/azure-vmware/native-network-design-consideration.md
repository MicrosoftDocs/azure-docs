---
title: Azure VMware Solution in an Azure Virtual Network design consideration (Public preview)
description: Learn about Azure VMware Solution in an Azure Virtual Network design consideration.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 4/3/2025
# customer intent: As a cloud administrator, I want to learn about Azure VMware Solution in an Azure Virtual Network design consideration so that I can make informed decisions about my Azure VMware Solution deployment.
---

# Azure VMware Solution in an Azure Virtual Network design consideration (Public preview)

In this article, you learn about design considerations for Azure VMware Solution in an Azure Virtual Network. It discusses what this solution offers in a VMware private cloud environment that your applications can access from on-premises and Azure-based environments or resources. There are several considerations to review before you set up your Azure VMware Solution private cloud in an Azure Virtual Network. This article provides solutions for use cases that you might encounter when you're using the private cloud type.

> [!Note]
> This is currently a public preview offering. For more information, see our [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Limitations during public preview

The following functionality is limited during this time. These limitations will be lifted in the future:

- You can't delete your Resource Group, which contains your Private Cloud.
- You can only deploy **1 Private Cloud** per Azure Virtual Network.
- You can only create **1 SDDC** per Resource Group. Multiple Private Clouds in a single Resource Group aren't supported. 
- Your Private Cloud and Virtual Network for your Private Cloud must be in the same Resource Group.
- You can not move your Private Cloud from one Resource Group to another after the Private Cloud is created.
- Virtual Network Service Endpoints direct connectivity from Azure VMware Solution workloads isn't supported.
- **vCloud Director** using Private Endpoints is supported. However, vCloud Director using Public Endpoints isn't supported.
- **vSAN Stretched Clusters** isn't supported.
- Public IP down to the NSX Microsoft Edge for configuring internet won't be supported.
- Support for **AzCLI**, **PowerShell**, and **.NET SDK** aren't available during Public Preview.
- **Run Commands** interacting with customer segments aren't supported including run commands interacting with Zerto, Jetstream, and other 3rd-party integrations.

## Unsupported integrations during public preview

The following 1st-party and 3rd-party integrations won't be available during Public Preview:

- **ElasticSAN**
- **Zerto**
- **Jetstream**