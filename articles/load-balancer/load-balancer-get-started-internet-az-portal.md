---
title: Create a zone-redundant Public Load Balancer Standard with the Azure portal | Microsoft Docs
description: Learn how to create zone-redundant Public Load Balancer Standard with the Azure portal
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/20/2017
ms.author: kumud
---

#  Create a zone-redundant Public Load Balancer Standard with the Azure portal

This article steps through creating a Public Load Balancer Standard with a zone-redundant frontend Public IP Standard address. An availability zone (../availability-zones/az-overview.md) is a physically separate zone in an Azure region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Register for Availability Zones, Load Balancer Standard, and Public IP Standard Preview

Availability zones are currently in preview release. Before selecting a zone or zone-redundant option for the frontend Public IP Address for the Load Balancer, you must first complete the steps in [register for the availability zones preview](https://docs.microsoft.com/azure/availability-zones/az-overview).
 
The Standard SKU is in preview release. Before creating a Standard SKU public IP address, you must first complete the steps in [register for the standard SKU preview](https://review.docs.microsoft.com/en-us/azure/virtual-network/virtual-network-public-ip-address?branch=pr-en-us-23006#register-for-the-standard-sku-preview) and create the public IP address in a supported location (region). For a list of supported locations, see [Region availability](https://review.docs.microsoft.com/en-us/azure/load-balancer/load-balancer-standard-overview?toc=%2fazure%2fvirtual-network%2ftoc.json) and monitor the [Azure Virtual Network](https://azure.microsoft.com/en-us/updates/?product=virtual-network) updates page for additional region support 

## Log in to Azure 

Log in to the Azure portal at https://portal.azure.com.

## Create a zone redundant load balancer

1. From a browser navigate to the Azure portal: [http://portal.azure.com](http://portal.azure.com) and login with your Azure account.
2. On the top left-hand side of the screen, select **New** > **Networking** > **Load Balancer.**
3. In the **Create load balancer, under **Name** type **myPublicLB**.
4. Under **Type**, select **Public**.
5. Under SKU, select **Standard (Preview)**.
6. Click **Public IP address**, click **Create new**, on the **Create a public IP address** page, under name, type **myPublicIPStandard**, and for **Availability zone (Preview)**, select **Zone-redundant**.
7. Under **Location**, select **East US2**, and then click **OK**. The load balancer then starts to deploy and takes a few minutes to successfully complete deployment.

    ![create zone-redundant Load Balancer Standard with the Azure portal](./media/load-balancer-get-started-internet-az-portal/create-zone-redundant-load-balancer-standard.png)
## Next steps
- Learn how [create a Public IP in an availability zone](create-public-ip-availability-zone-portal.md)



