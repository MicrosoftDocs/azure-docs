---
ms.author: cherylmc
author: cherylmc
ms.date: 03/06/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

### Can I create a new gateway that uses a Standard or High Performance SKU after the deprecation announcement on November 30, 2023?
  
No. As of December 1, 2023, you can't create gateways that use Standard or High Performance SKUs. You can create gateways that use VpnGw1 and VpnGw2 SKUs for the same price as the Standard and High Performance SKUs, listed respectively on the [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/).

### How long will my existing gateways be supported on the Standard and High Performance SKUs?

All existing gateways that use the Standard or High Performance SKU will be supported until September 30, 2025.

### Do I need to migrate my gateways from the Standard or High Performance SKU right now?
  
No, there's no action required right now. You can migrate your gateways starting in December 2024. We'll send communication with detailed documentation about the migration steps.

### Which SKU can I migrate my gateway to?

When gateway SKU migration becomes available, SKUs can be migrated as follows:

* Standard to VpnGw1
* High Performance to VpnGw2

### What if I want to migrate to an AZ SKU?

You can't migrate your deprecated SKU to an AZ SKU. However, all gateways that are still using the Standard or High Performance SKU after September 30, 2025, will be migrated and upgraded automatically to the AZ SKUs as follows:

* Standard to VpnGw1AZ
* High Performance to VpnGw2AZ

You can use this strategy to have your SKUs automatically migrated and upgraded to an AZ SKU. You can then resize your SKU within that SKU family if necessary. For AZ SKU pricing, see the [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/). For throughput information by SKU, see [About gateway SKUs](https://go.microsoft.com/fwlink/?linkid=2256302).

### Will there be any pricing difference for my gateways after migration?

If you migrate your SKUs by September 30, 2025, there will be no pricing difference. VpnGw1 and VpnGw2 SKUs are offered at the same price as Standard and High Performance SKUs, respectively.

If you don't migrate by that date, your SKUs will automatically be migrated and upgraded to AZ SKUs. In that case, there's a pricing difference.

### Will there be any performance impact on my gateways with this migration?

Yes. You get better performance with VpnGw1 and VpnGw2. Currently, VpnGw1 at 650 Mbps provides a 6.5x performance improvement at the same price as the Standard SKU. VpnGw2 at 1 Gbps provides a 5x performance improvement at the same price as the High Performance SKU. For more information about SKU throughput, see [About gateway SKUs](https://go.microsoft.com/fwlink/?linkid=2256302).

### What happens if I don't migrate by September 30, 2025?

All gateways that still use the Standard or High Performance SKU will be migrated automatically and upgraded to the following AZ SKUs:

* Standard to VpnGw1AZ
* High Performance to VpnGw2AZ

We'll send communication before initiating migration on any gateways.

### Is the VPN Gateway Basic SKU also retiring?

No, the VPN Gateway Basic SKU is not retiring. You can create a VPN gateway by using the Basic SKU via Azure PowerShell or the Azure CLI.

Currently, the VPN Gateway Basic SKU supports only the Basic SKU public IP address resource (which is on a path to retirement). We're working on adding support for the Standard SKU public IP address resource to the VPN Gateway Basic SKU.
