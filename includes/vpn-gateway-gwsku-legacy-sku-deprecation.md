---
author: aybatra
ms.service: vpn-gateway
ms.topic: include
ms.date: 10/25/2023	
ms.author: aybatra
---

We are planning to deprecate the Standard and HighPerformace VPN Gateway SKUs by 30 September, 2025. These SKU's today use only Basic IP and as Basic IP is [announced to deprecate](https://azure.microsoft.com/en-in/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/#:~:text=On%2030%20September%202025%2C%20Basic%20SKU%20public%20IP,to%20create%20new%20ones%20after%2031%20March%202025.) in September 2025, we will be deprecating these SKUs at the same time. 

Starting Dec 1, 2023, you will not be able to create Standard/HighPerformance on Azure VPN Gateway. You can create new VPN gateway using VPNGw1 and VPNGW2 for the same price as Standard/HighPerformance respectively listed [here.](vpn-gateway-gwsku-legacy-include.md) There are no price changes as part of this migration and you will be able to initiate this migration from portal post Dec 2024. 

The gateways on Standard/HighPerformance SKUs will be migrated by 30 September, 2025 as follows:
* Standard -> VPNGw1
* HighPerformance -> VPNGw2 

Please see below FAQ's for any questions:
* Can I create a new Standard/HighPerformance SKU after deprecation announcement on Nov 30, 2023?  
    No, it will not be possible to create new gateways with Standard/HighPerformance starting Dec 1, 2023.

* How long will my existing gateways be supported on Standard/HighPerformance? 
    All the existing gateways on Standard/Highperformance will be supported until 30 Sep, 2025.

* Do I need to migrate my Standard/HighPerformance gateways right now?  
    No, there is no action required. You will be able to upgrade your SKU starting Dec 2024. There will be communications sent with detailed documentation on the migration step. 

* Will there be any pricing difference for my gateways after migration? 
    No, the price will remmain the same. VPNGw1 and VPNGW2 SKU is offered at the same price as Standard and HighPerformance respectively.   

* Will there be any performance impact on my gateways with this migration? 
    Yes, you will get better performance with the migrated SKUs. VpnGw1 at 650 Mbps provides a 6.5x and VpnGw2 at 1Gbps provides a 5x performance improvement at the same price as the old Standard and High Performance gateways, respectively. More details are listed [here.](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings#benchmark)

* What happens if I don't engage in migration until 30 September 2025?  
    All the Standard/HighPerformance gateways will be migrated automatically to VPNGw1 (Standard) and VPNGw2 (High-Performance). Final Communications will be sent before initiating migration on any gateways.  

* Will I see a sudden stop in my gateway flow after the announcement? 
    No, there will be no impact on existing gateways. 

* Will there be any downtime on my gateways when migration is initiated? 
    Post Dec 2024, you will be able to migrate your gateways to applicable SKUs. The gateway will be down for 45 mins maintenance whenever you initiate the migration.

