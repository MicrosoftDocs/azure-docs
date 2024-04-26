---
ms.author: cherylmc
author: cherylmc
ms.date: 03/06/2024
ms.service: vpn-gateway
ms.topic: include
---

### Can I create a new Standard/High Performance SKU after the deprecation announcement on November 30, 2023?
  
No. Starting December 1, 2023 you can't create new gateways with Standard or High Performance SKUs. You can create new gateways using VpnGw1 and VpnGw2 for the same price as the Standard and High Performance SKUs, listed respectively on our [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/).

### How long will my existing gateways be supported on Standard/High Performance SKUs?

All existing gateways using Standard or High Performance SKUs will be supported until September 30, 2025.

### Do I need to migrate my Standard/High Performance gateway SKUs right now?
  
No, there's no action required right now. You'll be able to migrate your SKUs starting December 2024. We'll send communication with detailed documentation about the migration steps.

### Which SKU can I migrate my gateway to?

When gateway SKU migration becomes available, SKUs can be migrated as follows:

* Standard -> VpnGw1
* High Performance -> VpnGw2

### What if I want to migrate to an AZ SKU?

You can't migrate your legacy SKU to an AZ SKU. However, note that all gateways that are still using Standard or High Performance SKUs after September 30, 2025 will be migrated and upgraded automatically to the following SKUs:

* Standard -> VpnGw1AZ
* High Performance -> VpnGw2AZ

You can use this strategy to have your SKUs automatically migrated and upgraded to an AZ SKU. You can then resize your SKU within that SKU family if necessary. See our [pricing page](https://azure.microsoft.com/pricing/details/vpn-gateway/) for AZ SKU pricing. For throughput information by SKU, see [About gateway SKUs](https://go.microsoft.com/fwlink/?linkid=2256302).

### Will there be any pricing difference for my gateways after migration?

If you migrate your SKUs by September 30, 2025, there will be no pricing difference. VpnGw1 and VpnGw2 SKUs are offered at the same price as Standard and High Performance SKUs, respectively. If you don't migrate by that date, your SKUs will automatically be migrated and upgraded to AZ SKUs. In that case, there's a pricing difference.

### Will there be any performance impact on my gateways with this migration?

Yes, you get better performance with VpnGw1 and VpnGw2. Currently, VpnGw1 at 650 Mbps provides a 6.5x and VpnGw2 at 1 Gbps provides a 5x performance improvement at the same price as the legacy Standard and High Performance gateways, respectively. For more SKU throughput information, see [About gateway SKUs](https://go.microsoft.com/fwlink/?linkid=2256302).

### What happens if I don't migrate SKUs by September 30, 2025?

All gateways that are still using Standard or High Performance SKUs will be migrated automatically and upgraded to the following AZ SKUs:

* Standard -> VpnGw1AZ
* High Performance -> VpnGw2AZ

Final communication will be sent before initiating migration on any gateways.

### Is VPN Gateway Basic SKU retiring as well?

No, the VPN Gateway Basic SKU is here to stay. You can create a VPN gateway using the Basic gateway SKU via PowerShell or CLI. Currently, VPN Gateway Basic gateway SKUs only support the Basic SKU public IP address resource (which is on a path to retirement). We're working on adding support to the VPN Gateway Basic gateway SKU for the Standard SKU public IP address resource.
