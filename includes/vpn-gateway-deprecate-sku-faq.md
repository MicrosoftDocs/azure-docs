---
ms.author: cherylmc
author: cherylmc
ms.date: 01/12/2025
ms.service: azure-vpn-gateway
ms.topic: include
---

### Can I create a new gateway that uses a Standard or High Performance SKU after the deprecation announcement on November 30, 2023?
  
No. As of December 1, 2023, you can't create gateways that use Standard or High Performance SKUs. You can create gateways that use VpnGw1 and VpnGw2 SKUs for the same price as the Standard and High Performance SKUs, listed respectively on the [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/).

### How long will my existing gateways be supported on the Standard and High Performance SKUs?

All existing gateways that use the Standard or High Performance SKU will be supported until February 28, 2026 (extended from initial September 30, 2025 timeline).

### Will my IP address change when my Legacy VPN gateway SKU (Standard or HighPerformance) is migrated as part of Basic IP address migration initiated through Azure portal?

No, the IP address won't change when you migrate Basic IP using Azure portal experience. You can choose to migrate the Basic SKU IP address to Standard SKU IP address through a customer controlled portal experience. For more information about Basic SKU IP migration, see [About migrating a Basic SKU public IP address to Standard SKU for VPN Gateway](../articles/vpn-gateway/basic-public-ip-migrate-about.md) article.

### Do I need to migrate my gateways from the Standard or High Performance SKU right now?
  
No, you're required to migrate the Basic IP address on your gateway using the portal experience if you want to retain the IP address. As part of this migration, your gateways are automatically migrated to AZ SKUs.

### Will there be any pricing difference for my gateways after migration?

Your SKUs are automatically migrated and upgraded to AZ SKUs as part of Basic IP migration. See [VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) for more details.

### Will there be any performance impact on my gateways with this migration?

Yes. You get better performance with VpnGw1AZ and VpnGw2AZ. For more information about SKU throughput, see [About gateway SKUs](https://go.microsoft.com/fwlink/?linkid=2256302).

### What happens if I don't migrate by February 28, 2026?

To ensure a smooth transition, we strongly recommend that customers use the Basic IP Migration tool to migrate their Basic IPs and associated gateways. All gateways that still use the Standard or High Performance SKU after March will be attempted to migrate automatically and after migration:

* Gateways on the Standard SKU will be automatically upgraded to VpnGw1AZ
* Gateways on the High Performance SKU will be automatically upgraded to VpnGw2AZ

**Note: If we encounter **limitations - such as insufficient subnet size, we won’t be able to complete the gateway migration automatically, and customer action will be required.**

To avoid delays, please migrate your gateways using the Basic IP Migration tool in advance. This helps ensure your environment is ready for the AZ SKU upgrades and prevents last-minute issues.

### Is the VPN Gateway Basic SKU also retiring?

No, the VPN Gateway Basic SKU isn't retiring. You can create a VPN gateway by using the Basic SKU via Azure PowerShell or the Azure CLI.

Currently, the VPN Gateway Basic SKU supports only the Basic SKU public IP address resource (which is on a path to retirement). We're working on adding support for the Standard SKU public IP address resource to the VPN Gateway Basic SKU.
