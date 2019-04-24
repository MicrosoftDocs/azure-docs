---
title: Azure VMware Solution by CloudSimple Quickstart - Create service 
description: Learn how to create the CloudSimple service, purchase nodes, and reserve nodes  
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Quickstart - Create service

To get started, create the Azure VMware Solution by CloudSimple in the Azure portal.

## VMware Solution by CloudSimple - Service overview

The CloudSimple service allows you to consume Azure VMware Solution by CloudSimple.  Creating the service allows you to purchase nodes, reserve nodes, and create private clouds.  You add the CloudSimple service in each Azure region where the CloudSimple service is available.  The service defines the edge network of Azure VMware Solution by CloudSimple.  This edge network is used for services that include VPN, ExpressRoute, and Internet connectivity to your private clouds.

To add the CloudSimple service, you must create a gateway subnet. The gateway subnet is used when creating the edge network and requires a /28 CIDR block. The gateway subnet address space must be unique. It can't overlap with any of your on-premises network address spaces or Azure virtual network address space.

## Create the service

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the side menu, click **Create Resource**.
3. Search for and select **Azure VMware Solution by CloudSimple**.
4. Click **Add**.
5. Select the type of subscription.
6. Select the resource group for the service. To add a new resource group, click **Create New**.
7. Enter name to identify the service.
8. Enter the CIDR for the service gateway.

   * Specify a /28 subnet that doesn’t overlap with any of your on-premises subnets, Azure subnets, or planned CloudSimple subnets.
   * You can't change the CIDR after the service is created.

9. Click **OK**.

The service is created and added to the list of services.

## Purchase nodes

To set up pay-as-you go capacity for a CloudSimple Private Cloud environment, first provision nodes in the Azure portal.

1. In the [Azure portal](https://portal.azure.com) left navigation menu, select **Dedicated VMware Cloud Nodes**.
2. Select **Add Node**.
3. Select the type of subscription.
4. Enter a resource group for the node. To add a new resource group, click **Create New**.
5. Enter a name or prefix to identify the node.
6. Select the Azure region to host the node.
7. Select the node location.
8. Select the node type. You can choose the [CS28 or CS36 option](cloudsimple-node.md#vmware-solution-by-cloudsimple-nodes-sku). The latter option includes the maximum compute and memory capacity.
9. Select the number of nodes to provision.
10. Select **Next: Review**.
11. Review the settings. To modify any settings, click **Previous**.
12. Select **Add nodes**.

## Next steps

* [Create Private Cloud and configure environment](quickstart-create-private-cloud.md)