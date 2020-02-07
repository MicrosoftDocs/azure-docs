--- 
title: Azure VMware Solutions (AVS) - Service 
description: Provides an overview of AVS service and concepts. 
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/20/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# AVS service overview

The AVS service allows you to consume Azure VMware Solution by AVS. Creating the service allows you to purchase nodes, reserve nodes, and create AVS Private Clouds. You create the AVS service in each Azure region where the AVS service is available. The service defines the edge network of Azure VMware Solution by AVS. The edge network supports services that include VPN, ExpressRoute, and internet connectivity to your AVS Private Clouds.

## Gateway subnet

A gateway subnet is required per AVS service and is unique to the region in which it's created. The gateway subnet is used when creating the edge network and requires a /28 CIDR block. The gateway subnet address space must be unique. It must not overlap with any network that communicates with the AVS environment. The networks that communicate with AVS include on-premises networks and Azure virtual network. A gateway subnet can't be deleted once it's created. The gateway subnet is removed when the service is deleted.

## Next steps

* Learn how to [create a AVS service on Azure](quickstart-create-cloudsimple-service.md).
