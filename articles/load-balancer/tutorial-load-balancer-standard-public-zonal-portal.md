---
title: "Tutorial: Load balance VMs within an availability zone - Azure portal"
titleSuffix: Azure Load Balancer
description: This tutorial demonstrates how to create a Standard Load Balancer with zonal frontend to load balance VMs within an availability zone by using Azure portal.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: tutorial
ms.date: 12/04/2023
ms.author: mbender
ms.custom: template-tutorial
# Customer intent: As an IT administrator, I want to create a load balancer that load balances incoming internet traffic to virtual machines within a specific zone in a region.
---

# Tutorial: Load balance VMs within an availability zone by using the Azure portal

This tutorial creates a public [load balancer](https://aka.ms/azureloadbalancerstandard) with a zonal IP. In the tutorial, you specify a zone for your frontend and backend instances.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network with an Azure Bastion host for management.
> * Create a NAT gateway for outbound internet access of the resources in the virtual network.
> * Create a load balancer with a health probe and traffic rules.
> * Create zonal virtual machines (VMs) and attach them to a load balancer.
> * Create a basic Internet Information Services (IIS) site.
> * Test the load balancer.

For more information about availability zones and a standard load balancer, see [Standard load balancer and availability zones](load-balancer-standard-availability-zones.md).

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [load-balancer-create-bastion](../../includes/load-balancer-create-bastion.md)]

[!INCLUDE [load-balancer-nat-gateway-subnet-add](../../includes/load-balancer-nat-gateway-subnet-add.md)]

[!INCLUDE [load-balancer-public-create](../../includes/load-balancer-public-create.md)]

[!INCLUDE [load-balancer-create-virtual-machine-zonal](../../includes/load-balancer-create-virtual-machine-zonal.md)]

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

[!INCLUDE [load-balancer-install-iis](../../includes/load-balancer-install-iis.md)]

[!INCLUDE [load-balancer-cleanup-resources](../../includes/load-balancer-cleanup-resources.md)]

## Next steps

Advance to the next article to learn how to load balance VMs across availability zones:
> [!div class="nextstepaction"]
> [Load balance VMs across availability zones](./quickstart-load-balancer-standard-public-portal.md)
