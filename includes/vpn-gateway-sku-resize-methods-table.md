---
author: cherylmc
ms.author: cherylmc
ms.date: 10/24/2023
ms.service: vpn-gateway
ms.topic: include
---

| Starting SKU | Target SKU | Resize| Change|
| --- | --- |--- | --- |
| Basic SKU | Any other SKU | No | [Yes](../articles/vpn-gateway/gateway-sku-change.md) |
| Standard SKU | New Azure SKUs | No | [Yes](../articles/vpn-gateway/gateway-sku-change.md) |
| Standard SKU | HighPerformance SKU | [Yes](../articles/vpn-gateway/gateway-sku-resize.md) | Not required |
| HighPerformance | New Azure SKUs | No | [Yes](../articles/vpn-gateway/gateway-sku-change.md) |
| Generation 1 SKU | Generation 1 SKU | [Yes](../articles/vpn-gateway/gateway-sku-resize.md)| Not required |
| Generation 1 SKU | Generation 1 AZ SKU | No | [Yes](../articles/vpn-gateway/gateway-sku-change.md) |
| Generation 1 AZ SKU | Generation 1 AZ SKU | [Yes](../articles/vpn-gateway/gateway-sku-resize.md) | Not required |
| Generation 1 AZ SKU | Generation 2 AZ SKU | No | [Yes](../articles/vpn-gateway/gateway-sku-change.md) |
| Generation 2 SKU | Generation 2 SKU | [Yes](../articles/vpn-gateway/gateway-sku-resize.md) | Not required |
| Generation 2 SKU | Generation 2 AZ SKU | No | [Yes](../articles/vpn-gateway/gateway-sku-change.md) |
| Generation 2 AZ SKU | Generation 2 AZ SKU |[Yes](../articles/vpn-gateway/gateway-sku-resize.md) | Not required |
