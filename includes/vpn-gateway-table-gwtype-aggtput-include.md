---
 author: duongau
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 06/08/2026
 ms.author: duau
---

The following SKUs can be used to deploy new VPN gateways. They have zone-redundant options and are recommended for all new deployments.

| **VPN<br>Gateway<br>Generation** | **SKU** | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br> SSTP Connections** | **P2S<br> IKEv2/OpenVPN Connections** | **Aggregate<br>Throughput Benchmark** | **BGP** | **Zone-redundant** | **Supported Number of VMs in the Virtual Network** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|**Generation1**|**Basic**   | Max. 10    | Max. 128  | Not Supported  | 100 Mbps  | Not Supported| No | 200 |
|**Generation1**|**VpnGw1AZ**| Max. 30    | Max. 128  | Max. 250       | 650 Mbps  | Supported | Yes | 1000 |
|**Generation1**|**VpnGw2AZ**| Max. 30    | Max. 128  | Max. 500       | 1 Gbps    | Supported | Yes | 2000 |
|**Generation1**|**VpnGw3AZ**| Max. 30    | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | Yes | 5000 |
| | | | | | | | | |
|**Generation2**|**VpnGw2AZ**| Max. 30    | Max. 128  | Max. 500       | 1.25 Gbps | Supported | Yes | 2000 |
|**Generation2**|**VpnGw3AZ**| Max. 30    | Max. 128  | Max. 1000      | 2.5 Gbps  | Supported | Yes | 3300 |
|**Generation2**|**VpnGw4AZ**| Max. 100*  | Max. 128  | Max. 5000      | 5 Gbps    | Supported | Yes | 4400 |
|**Generation2**|**VpnGw5AZ**| Max. 100*  | Max. 128  | Max. 10000     | 10 Gbps   | Supported | Yes | 9000 |


VpnGw1~5 are slated for migration and should not be used to create new VPN gateways. For more information, see [VPN Gateway SKU consolidation and migration](../articles/vpn-gateway/gateway-sku-consolidation.md).

| **VPN<br>Gateway<br>Generation** | **SKU** | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br> SSTP Connections** | **P2S<br> IKEv2/OpenVPN Connections** | **Aggregate<br>Throughput Benchmark** | **BGP** | **Zone-redundant** | **Supported Number of VMs in the Virtual Network** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|**Generation1**|**VpnGw1**  | Max. 30    | Max. 128  | Max. 250    | 650 Mbps  | Supported | No | 450 |
|**Generation1**|**VpnGw2**  | Max. 30    | Max. 128  | Max. 500    | 1 Gbps    | Supported | No | 1300 |
|**Generation1**|**VpnGw3**  | Max. 30    | Max. 128  | Max. 1000   | 1.25 Gbps | Supported | No | 4000 |
| | | | | | | | | |
|**Generation2**|**VpnGw2**  | Max. 30    | Max. 128  | Max. 500    | 1.25 Gbps | Supported | No | 685 |
|**Generation2**|**VpnGw3**  | Max. 30    | Max. 128  | Max. 1000   | 2.5 Gbps  | Supported | No | 2240 |
|**Generation2**|**VpnGw4**  | Max. 100*  | Max. 128  | Max. 5000   | 5 Gbps    | Supported | No | 5300 |
|**Generation2**|**VpnGw5**  | Max. 100*  | Max. 128  | Max. 10000  | 10 Gbps   | Supported | No | 6700 |

> [!NOTE]
> "Supported Number of VMs in the Virtual Network" refers to the count of resources that communicate through the gateway. This includes:
> - Virtual Machines in the hub and peered spoke virtual networks
> - Private Endpoints
> - Network Virtual Appliances (such as Application Gateway, Azure Firewall)
> - Backend instances of PaaS services deployed in virtual networks (such as SQL Managed Instance, App Service Environment)
