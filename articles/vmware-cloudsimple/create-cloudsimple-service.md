--- 
title: Azure VMware Solutions (AVS) - Create AVS service 
description: Describes how to create the AVS service in the Azure portal 
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/19/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Create the Azure VMware Solutions (AVS) service

To get started with Azure VMware Solutions (AVS), create the Azure VMware Solutions (AVS) service in the Azure portal.

## Before you begin

Allocate a /28 CIDR block for the gateway subnet. A gateway subnet is required per AVS service and is unique to the region in which it's created. The gateway subnet is used for edge network services and requires a /28 CIDR block. The gateway subnet address space must be unique. It must not overlap with any network that communicates with the AVS environment. The networks that communicate with AVS include on-premises networks and Azure virtual networks.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the service

1. Select **All services**.
2. Search for **AVS Services**.
    ![Search AVS Service](media/create-cloudsimple-service-search.png)
3. Select **AVS Services**.
4. Click **Add** to create a new service.
    ![Add AVS Service](media/create-cloudsimple-service-add.png)
5. Select the subscription where you want to create the AVS service.
6. Select the resource group for the service. To add a new resource group, click **Create New**.
7. Enter name to identify the service.
8. Enter the CIDR for the service gateway. Specify a /28 subnet that doesn’t overlap with any of your  on-premises subnets, Azure subnets, or planned AVS subnets. You can't change the CIDR after the service is created.

    ![Creating the AVS service](media/create-cloudsimple-service.png)
9. Click **OK**.

The service is created and added to the list of services.

## Next steps

* Learn how to [provision nodes](create-nodes.md)
* Learn how to [create an AVS Private Cloud](create-private-cloud.md)
* Learn how to [configure an AVS Private Cloud environment](quickstart-create-private-cloud.md)
