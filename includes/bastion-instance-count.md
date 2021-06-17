---
author: cherylmc
ms.author: mialdrid
ms.date: 06/11/2021
ms.service: bastion
ms.topic: include

---
Azure Bastion supports manual host scaling. You can configure the number of host instances in order to manage the number of concurrent RDP/SSH connections that Azure Bastion can support. Increasing the number of host instances lets Azure Bastion manage more concurrent sessions. Decreasing the number of instances decreases the number of concurrent supported sessions. Azure Bastion supports up to 50 host instances. This feature is available for the Azure Bastion Standard SKU only. For more information about SKUs, see [Configuration settings](../articles/bastion/configuration-settings.md#sku).