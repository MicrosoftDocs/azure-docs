---
title: Create a zone-redundant Public Load Balancer Standard with the Azure CLI | Microsoft Docs
description: Learn how to create zone-redundant Public Load Balancer Standard with the Azure CLI
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

#  Create a zone-redundant Public Load Balancer Standard with the Azure CLI

This article steps through creating a Public Load Balancer Standard with a zone-redundant frontend Public IP Standard address. An availability zone (../availability-zones/az-overview.md) is a physically separate zone in an Azure region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Register for Availability Zones, Load Balancer Standard, and Public IP Standard Preview

Availability zones are currently in preview release. Before selecting a zone or zone-redundant option for the frontend Public IP Address for the Load Balancer, you must first complete the steps in [register for the availability zones preview](https://docs.microsoft.com/azure/availability-zones/az-overview).
 
The Standard SKU is in preview release. Before creating a Standard SKU public IP address, you must first complete the steps in [register for the standard SKU preview](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview#preview-sign-up) and create the public IP address in a supported location (region). For a list of supported locations, see [Region availability](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview#region-availability) and monitor the [Azure Virtual Network](https://azure.microsoft.com/en-us/updates/?product=virtual-network) updates page for additional region support 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI greater than version 2.0.17. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

> [!NOTE]
> Availability zones are in preview and are ready for your development and test scenarios. Support is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Next steps
- Learn how [create a Public IP in an availability zone](../virtual-network/create-public-ip-availability-zone-cli.md)



