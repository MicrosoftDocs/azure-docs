---
title: Azure Private Link for Azure Data Factory
description: Learn about Azure Private Link works in Azure Data Factory.

services: data-factory
ms.author: abnarain
author: nabhishek
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 09/01/2020
---

# Azure Private Link for Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-xxx-md.md)]

Private Link allows you to connect to various PaaS services in Azure via a private endpoint. For a list of PaaS services that support Private Link functionality, go to the [Private Link Documentation page](https://docs.microsoft.com/azure/private-link/). A private endpoint is a private IP address within a specific VNet and subnet.

## Secure communication between customer network and Azure Data Factory service
To protect your Azure resources from attacks in public network or let them securely communicate with each other, you can set up an Azure Virtual Network (VNET) as a logical representation of your network in the cloud. You can also connect an on-premises network to your VNET by setting up IPSec VPN (site-to-site) or ExpressRoute (private peering). The Self-hosted Integration Runtime can be installed on an on- premise machine or virtual machine in Virtual Network to run copy activities between a cloud data store and a data store in a private network or dispatch transform activities against compute resources in an on-premises network or an Azure virtual network. 

There are several communication channels required between Data Factory and customer VNET.


| **Domain** | **Port** | **Description** |
| ---------- | -------- | --------------- |
| `pe-adf.azure.com` | 443 | Control Plane. Required by Data Factory authoring and monitoring. |
| `*.{region}.datafactory.azure.net` | 443 | Required by the Self-hosted Integration Runtime to connect to the Data Factory service. |
| `*.servicebus.windows.net` | 443 | Required by the Self-hosted Integration Runtime for Interactive Authoring. |
| `download.microsoft.com` | 443 | Required by the Self-hosted Integration Runtime for downloading the updates. |


With the support of Azure Private Link for Azure Data Factory, you can create a Private Endpoint (PE) in your VNET and enable the private connection to specific Azure Data Factory. The communications to Azure Data Factory service go through Azure Private Link that provides secured private connectivity. And you don’t need to configure above domain and port in VNET or your corporate firewall that provide a more secure way to protect your resources.  

![ADF Private Link Architecture](./media/data-factory-private-link/private-link-architecture.png)

Here are the benefits for enabling Private Link Service for each of the communication channels depicted above:
1. (Supported) You can do authoring and monitoring of Azure Data Factory in your VNET even you block all outbound communications.
2. (Supported) The command communications between Self-hosted Integration Runtime and Azure Data Factory service can be performed securely in a private network environment. The traffic between Self-hosted Integration Runtime and Azure Data Factory service goes through Private Link. 
3. (To be enabled) Interactive authoring using Self-hosted Integration Runtime go through Private Link such as test connection, browse folder list and table list, get schema and preview data.
4. (To be enabled) The new version of Self-hosted Integration Runtime can be automatically downloaded from the download center if you enable auto-update.
> [!NOTE]
> We currently support item 1 and 2. For item 3 and 4, you still need to configure above domain and port in VNET or your corporate firewall. The support of item 3 and 4 are coming soon.

> [!WARNING]
> When you create Linked Service, please make sure the credential is stored in Azure Key Vault. Otherwise it doesn’t work when you enable Private Link Service in Azure Data Factory.

## How to set up Private Link for Azure Data Factory
Private Endpoints can be created using the Azure portal, PowerShell, or the Azure CLI:

[Portal](https://docs.microsoft.com/azure/private-link/create-private-endpoint-portal)


You can also navigate to your Azure Data Factory in Azure portal and create Private Endpoint (PE):

![Create Private Endpoint](./media/data-factory-private-link/create-private-endpoint.png)


If you want to block public access to this Azure Data Factory and only allow access through Private Link, you can disable network access of Azure Data Factory in Azure portal:

![Create Private Endpoint](./media/data-factory-private-link/disable-network-access.png)

> [!NOTE]
> Disabling public network access is only applicable to Self-hosted Integration Runtime, not to Azure Integration Runtime and SSIS Integration Runtime.

> [!NOTE]
> Users can still access ADF Portal through public network after disabling public network access.

## Next steps

- [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md)

- [Introduction to Azure Data Factory](introduction.md)

- [Visual authoring in Azure Data Factory](author-visually.md)

