---
title: VMware Solutions by CloudSimple - Service 
description: Learn about the CloudSimple service and concepts. 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple Service overview

The CloudSimple service allows you to consume Azure VMware solutions by CloudSimple.  Creating the service allows you to purchase nodes, reserve nodes, and create Private Clouds.  You add the CloudSimple service in each Azure region where the CloudSimple service is available.  The service defines the edge network of Azure VMware solutions by CloudSimple.  This edge network is used for services that include VPN, ExpressRoute, and Internet connectivity to your Private Clouds.

Adding the CloudSimple service requires creation of a gateway subnet.  The gateway subnet is used when creating the edge network and requires a /28 CIDR block.  The gateway subnet address space must be unique. It cannot overlap with any of your on-premises network address spaces or Azure virtual network address space.

## Next steps

* Learn how to [Create a CloudSimple service on Azure](quick-create-cs-service.md)