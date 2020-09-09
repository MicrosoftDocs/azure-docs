--- 
title: Azure VMware Solution by CloudSimple - Create CloudSimple service 
description: Learn how to create the CloudSimple service in the Azure portal. Review required configuration before you begin.
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/19/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Create the Azure VMware Solution by CloudSimple service

To get started with Azure VMware Solution by CloudSimple, create the Azure VMware Solution by CloudSimple service in the Azure portal.

## Before you begin

Allocate a /28 CIDR block for the gateway subnet. A gateway subnet is required per CloudSimple service and is unique to the region in which it's created. The gateway subnet is used for edge network services and requires a /28 CIDR block. The gateway subnet address space must be unique. It must not overlap with any network that communicates with the CloudSimple environment. The networks that communicate with CloudSimple include on-premises networks and Azure virtual networks.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the service

1. Select **All services**.
2. Search for **CloudSimple Services**.
    ![Search CloudSimple Service](media/create-cloudsimple-service-search.png)
3. Select **CloudSimple Services**.
4. Click **Add** to create a new service.
    ![Add CloudSimple Service](media/create-cloudsimple-service-add.png)
5. Select the subscription where you want to create the CloudSimple service.
6. Select the resource group for the service. To add a new resource group, click **Create New**.
7. Enter name to identify the service.
8. Enter the CIDR for the service gateway. Specify a /28 subnet that doesn’t overlap with any of your  on-premises subnets, Azure subnets, or planned CloudSimple subnets. You can't change the CIDR after the service is created.

    ![Creating the CloudSimple service](media/create-cloudsimple-service.png)
9. Click **OK**.

The service is created and added to the list of services.

## Next steps

* Learn how to [provision nodes](create-nodes.md)
* Learn how to [create a private cloud](create-private-cloud.md)
* Learn how to [configure a private cloud environment](quickstart-create-private-cloud.md)
