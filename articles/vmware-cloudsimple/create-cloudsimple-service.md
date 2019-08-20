--- 
title: Azure VMware Solution by CloudSimple - Create CloudSimple service 
description: Describes how to create the CloudSimple service in the Azure portal 
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

> [!IMPORTANT]
> Before you create the CloudSimple service, you must register the Microsoft.VMwareCloudSimple resource provider on your Azure subscription. Follow the steps in [Enable the Microsoft.VMwareCloudSimple resource provider on your Azure subscription](enable-cloudsimple-service.md).

## Sign in to Azure

Sign in to the [Azure portal](http://portal.azure.com).

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

* Learn how to [create a Private Cloud](create-private-cloud.md)
* Learn how to [configure a Private Cloud environment](quickstart-create-private-cloud.md)
