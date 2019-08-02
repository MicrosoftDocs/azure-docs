---
title: VMware Solution by CloudSimple service 
description: Describes the overview of CloudSimple service and concepts. 
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 04/24/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple service overview

With the CloudSimple service, you can use Azure VMware Solution by CloudSimple. After you create the service, you can provision nodes, reserve nodes, and create private clouds. You create the CloudSimple service in each Azure region where the CloudSimple service is available. The service defines the edge network of Azure VMware Solution by CloudSimple. The edge network supports services that include VPN, Azure ExpressRoute, and internet connectivity to your private clouds.

## Gateway subnet

A gateway subnet is required per CloudSimple service and is unique to the region in which it's created. The gateway subnet is used when you create the edge network and requires a /28 CIDR block. The gateway subnet address space must be unique. It must not overlap with any network that communicates with the CloudSimple environment. The networks that communicate with CloudSimple include on-premises networks and Azure virtual networks. A gateway subnet can't be deleted after it's created. The gateway subnet is removed when the service is deleted.

## Next steps

* Learn how to [create a CloudSimple service on Azure](quickstart-create-cloudsimple-service.md).
