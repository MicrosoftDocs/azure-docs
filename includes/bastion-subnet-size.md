---
author: cherylmc
ms.author: cherylmc
ms.date: 06/02/2023
ms.service: bastion
ms.topic: include

---
* The smallest subnet AzureBastionSubnet size you can create is /26. We recommend that you create a /26 or larger size to accommodate host scaling.
  * For more information about scaling, see [Configuration settings - Host scaling](../articles/bastion/configuration-settings.md#instance).
  * For more information about settings, see [Configuration settings - AzureBastionSubnet](../articles/bastion/configuration-settings.md#instance).
* Create the **AzureBastionSubnet** without any route tables or delegations. 
* If you use Network Security Groups on the **AzureBastionSubnet**, refer to the [Work with NSGs](../articles/bastion/bastion-nsg.md) article.
