---
author: cherylmc
ms.author: cherylmc
ms.date: 04/26/2024
ms.service: bastion
ms.topic: include
---

The Bastion Developer SKU is a free, lightweight SKU. This SKU is ideal for Dev/Test users who want to securely connect to their VMs, but don't need additional Bastion features or host scaling. With the Developer SKU, you can connect to one Azure VM at a time directly through the virtual machine connect page.

When you deploy Bastion using the Developer SKU, the deployment requirements are different than when you deploy using other SKUs. Typically when you create a bastion host, a host is deployed to the AzureBastionSubnet in your virtual network. The Bastion host is dedicated for your use. When you use the Developer SKU, a bastion host isn't deployed to your virtual network and you don't need an AzureBastionSubnet. However, the Developer SKU bastion host isn't a dedicated resource. Instead, it's part of a shared pool.

Because the Developer SKU bastion resource isn't dedicated, the features for the Developer SKU are limited. See the Bastion configuration settings [SKU](../articles/bastion/configuration-settings.md) section for features listed by SKU. You can always upgrade the Developer SKU to a higher SKU if you need to support more features. See [Upgrade a SKU](../articles/bastion/upgrade-sku.md).
