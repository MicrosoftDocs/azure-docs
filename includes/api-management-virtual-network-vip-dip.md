---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 03/26/2024
ms.author: danlep
---

### VIP and DIP addresses

Dynamic IP (DIP) addresses will be assigned to each underlying virtual machine in the service and used to access endpoints and resources in the VNet and in peered VNets. The API Management service's public virtual IP (VIP) address will be used to access public-facing resources. 

If IP restriction lists secure resources within the VNet or peered VNets, we recommend specifying the entire subnet range where the API Management service is deployed to grant or restrict access from the service.

Learn more about the [recommended subnet size](../articles/api-management/virtual-network-injection-resources.md#subnet-size).


