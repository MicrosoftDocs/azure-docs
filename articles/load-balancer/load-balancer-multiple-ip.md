---
title: 'Tutorial: Load balance multiple IP configurations'
titleSuffix: Azure Load Balancer
description: In this article, learn about load balancing across primary and secondary NIC configurations using the Azure portal, Azure CLI, and Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
ms.topic: tutorial
ms.date: 05/06/2025
ms.custom: template-tutorial, engagement-fy23
zone_pivot_groups: load-balancer-multiple-ip-pv
---

# Tutorial: Load balance multiple IP configurations

To host multiple websites, you can use another network interface associated with a virtual machine. Azure Load Balancer supports deployment of load-balancing to support the high availability of the websites.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure a virtual network, subnet, and NAT gateway.
> * Create two Windows server virtual machines
> * Create a secondary NIC and network configurations for each virtual machine
> * Create two Internet Information Server (IIS) websites on each virtual machine
> * Bind the websites to the network configurations
> * Create and configure an Azure Load Balancer
> * Test the load balancer


::: zone pivot="azure-portal"
[!INCLUDE [load-balancer-multi-ip-portal](../../includes/load-balancer-multi-ip-portal.md)]
::: zone-end 

::: zone pivot="azure-cli"
[!INCLUDE [load-balancer-multi-ip-cli](../../includes/load-balancer-multi-ip-cli.md)]
::: zone-end

::: zone pivot="azure-powershell"
[!INCLUDE [load-balancer-multi-ip-powershell](../../includes/load-balancer-multi-ip-powershell.md)]
::: zone-end

## Next steps

Advance to the next article to learn how to create a cross-region load balancer:

> [!div class="nextstepaction"]
> [Create an Azure Global Load Balancer](/azure/load-balancer/tutorial-cross-region-portal?tabs=azureportal)

