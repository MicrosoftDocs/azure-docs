---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/22/2019
 ms.author: cherylmc
 ms.custom: include file
---

|**SKU**   | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br> SSTP Connections** | **P2S<br> IKEv2/OpenVPN Connections** | **Aggregate<br>Throughput Benchmark** | **BGP** | **Zone-redundant** |
|---       | ---        | ---       | ---            | ---       | --- | --- |
|**Basic** | Max. 10    | Max. 128  | Not Supported  | 100 Mbps  | Not Supported| No |
|**VpnGw1**| Max. 30*   | Max. 128  | Max. 250       | 650 Mbps  | Supported | No |
|**VpnGw2**| Max. 30*   | Max. 128  | Max. 500       | 1 Gbps    | Supported | No |
|**VpnGw3**| Max. 30*   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | No |
|**VpnGw1AZ**| Max. 30*   | Max. 128  | Max. 250       | 650 Mbps  | Supported | Yes |
|**VpnGw2AZ**| Max. 30*   | Max. 128  | Max. 500       | 1 Gbps    | Supported | Yes |
|**VpnGw3AZ**| Max. 30*   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | Yes |

(*) Use [Virtual WAN](../articles/virtual-wan/virtual-wan-about.md) if you need more than 30 S2S VPN tunnels.

* These connection limits are separate. For example, you can have 128 SSTP connections and also 250 IKEv2 connections on a VpnGw1 SKU.

* Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page.

* SLA (Service Level Agreement) information can be found on the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway/) page.

* VpnGw1, VpnGw2, VpnGw3, VpnGw1AZ, VpnGw2AZ and VpnGw3AZ are supported for VPN gateways using the Resource Manager deployment model only.

* The Basic SKU is considered a legacy SKU. The Basic SKU has certain feature limitations. You can't resize a gateway that uses a Basic SKU to one of the new gateway SKUs, you must instead change to a new SKU, which involves deleting and recreating your VPN gateway. Verify that the feature that you need is supported before you use the Basic SKU.

* Aggregate Throughput Benchmark is based on measurements of multiple tunnels aggregated through a single gateway. The Aggregate Throughput Benchmark for a VPN Gateway is S2S + P2S combined. **If you have a lot of P2S connections, it can negatively impact a S2S connection due to throughput limitations.** The Aggregate Throughput Benchmark is not a guaranteed throughput due to Internet traffic conditions and your application behaviors.

* To help our customers understand the relative performance of VpnGw SKUs, we used publicly available iPerf and CTSTraffic tools to measure performances. Below table lists the results of performance tests using different algorithms. As you can see, the best performance is obtained when we used GCMAES256 algorithm for both IPsec Encryption and Integrity. We got average performance when using AES256 for IPsec Encryption and SHA256 for Integrity. When we used DES3 for IPsec Encryption and SHA256 for Integrity we got lowest performance.

|**SKU**   | **Algorithms<br>used** | **Throughput<br>observed** | **Packets per second<br>observed** |
|---       | ---                 | ---            | ---                    |
|**VpnGw1**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>120 Mbps   | 58,000<br>50,000<br>50,000|
|**VpnGw2**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1 Gbps<br>500 Mbps<br>120 Mbps | 90,000<br>80,000<br>55,000|
|**VpnGw3**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>120 Mbps | 105,000<br>90,000<br>60,000|
|**VpnGw1AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>120 Mbps   | 58,000<br>50,000<br>50,000|
|**VpnGw2AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1 Gbps<br>500 Mbps<br>120 Mbps | 90,000<br>80,000<br>55,000|
|**VpnGw3AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>120 Mbps | 105,000<br>90,000<br>60,000|
