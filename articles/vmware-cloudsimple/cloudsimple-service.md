---
title: Azure VMware Solutions by CloudSimple - Service 
description: Learn about the CloudSimple service and concepts. 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# VMware Solutions by CloudSimple - Service overview

The CloudSimple service allows you to consume Azure VMware solutions by CloudSimple.  Creating the service allows you to purchase nodes, reserve nodes, and create private clouds.  You add the CloudSimple service in each Azure region where the CloudSimple service is available.  The service defines the edge network of Azure VMware solutions by CloudSimple.  This edge network is used for services that include VPN, ExpressRoute, and Internet connectivity to your private clouds.

Adding the CloudSimple service requires creation of a gateway subnet.  The gateway subnet is used when creating the edge network and requires a /28 CIDR block.  The gateway subnet address space must be unique. It cannot overlap with any of your on-premises network address spaces or Azure virtual network address space.

For more information, see [Create a CloudSimple service on Azure](quickstart-create-cloudsimple-service.md)