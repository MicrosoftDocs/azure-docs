---
title: Azure VMware Solutions (AVS) Quickstart - Create service 
description: Learn how to create the AVS service, purchase nodes, and reserve nodes  
titleSuffix: Azure VMware Solutions (AVS)

author: sharaths-cs 
ms.author: dikamath 
ms.date: 08/16/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Quickstart - Create Azure VMware Solutions (AVS) service

To get started, create the Azure VMware Solutions (AVS) in the Azure portal.

## VMware Solutions (AVS) - Service overview

The AVS service allows you to consume Azure VMware Solution by AVS. Creating the service allows you to provision nodes, reserve nodes, and create AVS Private Clouds. You add the AVS service in each Azure region where the AVS service is available. The service defines the edge network of Azure VMware Solution by AVS. This edge network is used for services that include VPN, ExpressRoute, and Internet connectivity to your AVS Private Clouds.

To add the AVS service, you must create a gateway subnet. The gateway subnet is used when creating the edge network and requires a /28 CIDR block. The gateway subnet address space must be unique. It can't overlap with any of your on-premises network address spaces or Azure virtual network address space.

## Before you begin

Allocate a /28 CIDR block for gateway subnet. A gateway subnet is required per AVS service and is unique to the region in which it's created. The gateway subnet is used for Azure VMware Solution by AVS edge network services and requires a /28 CIDR block. The gateway subnet address space must be unique. It must not overlap with any network that communicates with the AVS environment. The networks that communicate with AVS include on-premises networks and Azure virtual networks.

Review [Networking Prerequisites](cloudsimple-network-checklist.md). 

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create the service

1. Select **All services**.
2. Search for **AVS Service**.

    ![Search AVS Service](media/create-cloudsimple-service-search.png)

3. Select **AVS Services**.
4. Click **Add** to create a new service.

    ![Add AVS Service](media/create-cloudsimple-service-add.png)

5. Select the subscription where you want to create the AVS service.
6. Select the resource group for the service. To add a new resource group, click **Create New**.
7. Enter name to identify the service.
8. Enter the CIDR for the service gateway. Specify a /28 subnet that doesn't overlap with any of your  on-premises subnets, Azure subnets, or planned AVS subnets. You can't change the CIDR after the service is created.

    ![Creating the AVS service](media/create-cloudsimple-service.png)

9. Click **OK**.

The service is created and added to the list of services.

## Provision nodes

To set up pay-as-you go capacity for an AVS Private Cloud environment, first provision nodes in the Azure portal.

1. Select **All services**.
2. Search for **AVS Nodes**.

    ![Search AVS Nodes](media/create-cloudsimple-node-search.png)

3. Select **AVS Nodes**.
4. Click **Add** to create nodes.

    ![Add AVS Nodes](media/create-cloudsimple-node-add.png)

5. Select the subscription where you want to provision AVS nodes.
6. Select the resource group for the nodes. To add a new resource group, click **Create New**.
7. Enter the prefix to identify the nodes.
8. Select the location for the node resources.
9. Select the dedicated location to host the node resources.
10. Select the [node type](cloudsimple-node.md).
11. Select the number of nodes to provision.
12. Select **Review + Create**.
13. Review the settings. To modify any settings, click **Previous**.
14. Select **Create**.

## Next steps

* [Create AVS Private Cloud and configure environment](quickstart-create-private-cloud.md)
* Learn more about [AVS service](https://docs.azure.cloudsimple.com/cloudsimple-service)
