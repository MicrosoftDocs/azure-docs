---
title: Create a Transit Hub from the Azure Portal
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

## Prerequisites

- To access Azure Virtual Enclaves, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- All access to Azure Virtual Enclaves takes place through a Community or an enclave. For this how-to article, create a [community](docs/How%20To%20Guides/Create-a-Community-in-the-Azure-portal) and [enclave](docs/How%20To%20Guides/Create-an-Enclave-in-the-Azure-Portal) using the Azure portal.

## Sign-in to Azure
Sign-in to the Azure portal at https://portal.azure.com. For our MVP and Private Preview experience, you will have to navigate to the [RC Azure Portal](https://aka.ms/ave/privatepreview).

## Create a Transit Hub

1. Navigate to an existing Community within your Azure subscription, select the **Transit Hubs** tab, and select **Create**

![image.png](/assets/image-d4151745-cd57-4bec-929b-00ddb93e16be.png)

1. Provide a name and type for the Transit Hub.  

Refer to the guidance below for more information on the different types of Transit Hub connections:

- **vNet Peering**:
https://learn.microsoft.com/en-us/azure/virtual-network/tutorial-connect-virtual-networks-portal
- **VPN Gateway**:
https://learn.microsoft.com/en-us/azure/virtual-wan/virtual-wan-site-to-site-portal
- **Express Route**:
https://learn.microsoft.com/en-us/azure/virtual-wan/virtual-wan-expressroute-portal

![image.png](/assets/image-14edd692-5097-4194-9c4b-a05c238c576b.png)

1. Click next, add any tags, and click review + create.

1. Click **Review + Create** and click **Create**

![image.png](/assets/image-9ee9d2cd-617a-45ee-9470-5214b1fc5481.png)

`
Note: Transit Hub connectivity may be a "break-glass" scenario due to configuration variability of transit connections. 
`
