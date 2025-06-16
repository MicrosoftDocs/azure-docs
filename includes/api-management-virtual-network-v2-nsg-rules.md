---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 06/16/2025
ms.author: danlep
---

A network security group (NSG) must be associated with the subnet. To set up a network security group, see [Create a network security group](../articles/virtual-network/manage-network-security-group.md). 

* Configure an outbound NSG rule to allow access to Azure Storage on port 443. 
* Configure other outbound rules you need for the gateway to reach your API backends. 
* NSG rules can also be used to block outbound traffic to the internet and access only resources in your virtual network. 



