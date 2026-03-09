---
ms.author: cherylmc
author: cherylmc
ms.date: 01/12/2025
ms.service: azure-vpn-gateway
ms.topic: include
---

### Can I create a new gateway that uses a Standard or High Performance SKU after the deprecation?
  
No. You can create gateways that use VpnGw1 and VpnGw2 SKUs for the same price as the Standard and High Performance SKUs, listed respectively on the [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/).

### How long will my existing gateways be supported on the Standard and High Performance SKUs?

All existing gateways that use the Standard or High Performance SKU will be supported until February 28, 2026.

### Will my IP address change when my legacy VPN gateway SKU is migrated?

No, the IP address won't change when you migrate by using the Azure portal. You can choose to migrate a Basic SKU IP address to a Standard SKU IP address. For more information, see [About migrating a Basic SKU public IP address to Standard SKU for VPN Gateway](../articles/vpn-gateway/basic-public-ip-migrate-about.md).

### Do I need to migrate my gateways from the Standard or High Performance SKU right now?
  
No. You must migrate the Basic IP address on your gateway by using the Azure portal, if you want to retain the IP address. As part of this migration, your gateways are automatically migrated to gateway SKUs that are supported by availability zones.

### Will there be any pricing difference for my gateways after migration?

Your SKUs are automatically migrated and upgraded to SKUs that are supported by availability zones, as part of Basic IP address migration. See [VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) for more details.

### Will there be any performance impact on my gateways with this migration?

Yes. You get better performance with the VpnGw1AZ and VpnGw2AZ SKUs. For more information about SKU throughput, see [About gateway SKUs](https://go.microsoft.com/fwlink/?linkid=2256302).

### What happens if I don't migrate by February 28, 2026?

To ensure a smooth transition, we strongly recommend that customers use the Basic IP migration tool to migrate their Basic IPs and associated gateways. After March 2026, we'll attempt to migrate automatically all gateways that still use the Standard or High Performance SKU:

* Gateways on the Standard SKU will be automatically upgraded to VpnGw1AZ.
* Gateways on the High Performance SKU will be automatically upgraded to VpnGw2AZ.

If we encounter limitations such as insufficient subnet size, we won't be able to complete the gateway migration automatically. In this case, you'll need to take appropriate steps to resolve.

### Is the VPN Gateway Basic SKU also retiring?

No, the VPN Gateway Basic SKU isn't retiring. You can create a VPN gateway by using the Basic SKU via Azure PowerShell or the Azure CLI. The VPN Gateway Basic SKU currently supports only the Basic SKU public IP address resource.
