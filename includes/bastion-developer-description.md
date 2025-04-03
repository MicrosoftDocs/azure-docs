---
author: cherylmc
ms.author: cherylmc
ms.date: 03/14/2025
ms.service: azure-bastion
ms.topic: include
---

Bastion Developer is a free, lightweight offering of the Azure Bastion service. This offering is ideal for Dev/Test users who want to securely connect to their VMs, but don't need additional Bastion features or host scaling. With Bastion Developer, you can connect to one Azure VM at a time directly through the virtual machine connect page.

When you connect with Bastion Developer, the deployment requirements are different than when you deploy using other SKUs. Typically when you create a bastion host, a host is deployed to the AzureBastionSubnet in your virtual network. The Bastion host is dedicated for your use, whereas Bastion Developer isn't. Because the Bastion Developer resource isn't dedicated, the features for Bastion Developer are limited. You can always upgrade Bastion Developer to a specific [SKU](../articles/bastion/configuration-settings.md#skus) if you need to support more features. See [Upgrade a SKU](../articles/bastion/upgrade-sku.md).