---
title: Create a Transit Hub from the Azure portal
description: Create a Transit Hub from the Azure portal
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---
# Create a Transit Hub from the Azure portal

## Prerequisites

- To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

- All access to Azure Virtual Enclaves takes place through a Community or an enclave. For this how-to article, create a [community](./create-community-azure-portal.md) and [enclave](./create-enclave-azure-portal.md) using the Azure portal.

## Sign-in to Azure
Sign-in to the Azure portal at https://portal.azure.com.

## Create a Transit Hub

1. Navigate to an existing Community within your Azure subscription, select the `Transit Hubs` tab, and select `Create`

![image1.png](./media/image-d4151745-cd57-4bec-929b-00ddb93e16be.png)

1. Provide a name and type for the Transit Hub.  

Refer to this guidance for more information on the different types of Transit Hub connections:

- [vNet Peering](../virtual-network/tutorial-connect-virtual-networks-portal.md)
- [VPN Gateway](../virtual-wan/virtual-wan-site-to-site-portal.md)
- [Express Route](../virtual-wan/virtual-wan-expressroute-portal.md)

![image2.png](./media/image-14edd692-5097-4194-9c4b-a05c238c576b.png)

1. Select `next`, add any tags, and select `Review + Create`.

1. Select `Review + Create` and select `Create`

![image3.png](./media/image-9ee9d2cd-617a-45ee-9470-5214b1fc5481.png)

> [!NOTE]
> 
> Transit Hub connectivity may be a "break-glass" scenario due to configuration variability of transit connections. 
