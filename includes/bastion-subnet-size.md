---
author: cherylmc
ms.author: cherylmc
ms.date: 03/01/2021
ms.service: bastion
ms.topic: include

---
 > [!IMPORTANT]
 > For Azure Bastion resources deployed on or after November 2, 2021, the minimum AzureBastionSubnet size is /26 or larger (/25, /24, etc.). All Azure Bastion resources deployed in subnets of size /27 prior to this date are unaffected by this change and will continue to work, but we highly recommend increasing the size of any existing AzureBastionSubnet to /26 in case you choose to take advantage of [host scaling](../articles/bastion/configure-host-scaling.md) in the future.

* The smallest subnet AzureBastionSubnet size you can create is /26. We recommend that you create a /26 or larger size to accommodate host scaling.
  * For more information about scaling, see [Configuration settings - Host scaling](../articles/bastion/configuration-settings.md#instance).
  * For more information about settings, see [Configuration settings - AzureBastionSubnet](../articles/bastion/configuration-settings.md#instance).
* Create the **AzureBastionSubnet** without any route tables or delegations. 
* If you use Network Security Groups on the **AzureBastionSubnet**, refer to the [Work with NSGs](../articles/bastion/bastion-nsg.md) article.
