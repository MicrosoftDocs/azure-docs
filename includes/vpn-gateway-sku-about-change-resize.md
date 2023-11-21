---
author: cherylmc
ms.author: cherylmc
ms.date: 11/20/2023
ms.service: vpn-gateway
ms.topic: include
---

When you want to move to another SKU, there are multiple methods to choose from. The method you choose depends on the gateway SKU that you're starting from. 

* **Resize a SKU:** When you resize a SKU, you incur very little downtime. You don't need to follow a workflow to resize a SKU. You can resize a SKU quickly and easily in the Azure portal. Or, you can use PowerShell or the Azure CLI. You don't need to reconfigure your VPN device or your P2S clients.

* **Change a SKU:** If you can't resize your SKU, you can change your SKU using a specific [Workflow](../articles/vpn-gateway/gateway-sku-change.md#workflow). Changing a SKU incurs more downtime than resizing. Additionally, there are multiple resources that need to be reconfigured when using this method.
