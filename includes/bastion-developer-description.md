---
author: abell
ms.author: cherylmc
ms.date: 01/22/2026
ms.service: azure-bastion
ms.topic: include
---

When you connect with Bastion Developer, the deployment requirements are different than when you deploy using other SKUs. Typically when you create a bastion host, a host is deployed to the AzureBastionSubnet in your virtual network. The Bastion host is dedicated for your use, whereas Bastion Developer isn't. Because the Bastion Developer resource isn't dedicated, the features for Bastion Developer are limited. You can always upgrade Bastion Developer to a specific [SKU](../articles/bastion/bastion-sku-comparison.md) if you need to support more features. See [Upgrade a SKU](../articles/bastion/upgrade-sku.md).