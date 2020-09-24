---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 11/12/2019
 ms.author: cherylmc
 ms.custom: include file
---

|**VPN<br>Gateway<br>Generation** |**SKU**   | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br> SSTP Connections** | **P2S<br> IKEv2/OpenVPN Connections** | **Aggregate<br>Throughput Benchmark** | **BGP** | **Zone-redundant** |
|---            |---         | ---        | ---       | ---            | ---       | ---       | ---|
|**Generation1**|**Basic**   | Max. 10    | Max. 128  | Not Supported  | 100 Mbps  | Not Supported| No |
|**Generation1**|**VpnGw1**  | Max. 30*   | Max. 128  | Max. 250       | 650 Mbps  | Supported | No |
|**Generation1**|**VpnGw2**  | Max. 30*   | Max. 128  | Max. 500       | 1 Gbps    | Supported | No |
|**Generation1**|**VpnGw3**  | Max. 30*   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | No |
|**Generation1**|**VpnGw1AZ**| Max. 30*   | Max. 128  | Max. 250       | 650 Mbps  | Supported | Yes |
|**Generation1**|**VpnGw2AZ**| Max. 30*   | Max. 128  | Max. 500       | 1 Gbps    | Supported | Yes |
|**Generation1**|**VpnGw3AZ**| Max. 30*   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | Yes |
|        |            |            |           |                |           |           |     |
|**Generation2**|**VpnGw2**  | Max. 30*   | Max. 128  | Max. 500       | 1.25 Gbps | Supported | No |
|**Generation2**|**VpnGw3**  | Max. 30*   | Max. 128  | Max. 1000      | 2.5 Gbps  | Supported | No |
|**Generation2**|**VpnGw4**  | Max. 30*   | Max. 128  | Max. 5000      | 5 Gbps    | Supported | No |
|**Generation2**|**VpnGw5**  | Max. 30*   | Max. 128  | Max. 10000      | 10 Gbps   | Supported | No |
|**Generation2**|**VpnGw2AZ**| Max. 30*   | Max. 128  | Max. 500       | 1.25 Gbps | Supported | Yes |
|**Generation2**|**VpnGw3AZ**| Max. 30*   | Max. 128  | Max. 1000      | 2.5 Gbps  | Supported | Yes |
|**Generation2**|**VpnGw4AZ**| Max. 30*   | Max. 128  | Max. 5000      | 5 Gbps    | Supported | Yes |
|**Generation2**|**VpnGw5AZ**| Max. 30*   | Max. 128  | Max. 10000      | 10 Gbps   | Supported | Yes |

(*) Use [Virtual WAN](../articles/virtual-wan/virtual-wan-about.md) if you need more than 30 S2S VPN tunnels.

* The resizing of VpnGw SKUs is allowed within the same generation, except resizing of the Basic SKU. The Basic SKU is a legacy SKU and has feature limitations. In order to move from Basic to another VpnGw SKU, you must delete the Basic SKU VPN gateway and create a new gateway with the desired Generation and SKU size combination.

* These connection limits are separate. For example, you can have 128 SSTP connections and also 250 IKEv2 connections on a VpnGw1 SKU.

* Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page.

* SLA (Service Level Agreement) information can be found on the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway/) page.

* On a single tunnel a maximum of 1 Gbps throughput can be achieved. Aggregate Throughput Benchmark in the above table is based on measurements of multiple tunnels aggregated through a single gateway. The Aggregate Throughput Benchmark for a VPN Gateway is S2S + P2S combined. **If you have a lot of P2S connections, it can negatively impact a S2S connection due to throughput limitations.** The Aggregate Throughput Benchmark is not a guaranteed throughput due to Internet traffic conditions and your application behaviors.

To help our customers understand the relative performance of SKUs using different algorithms, we used publicly available iPerf and CTSTraffic tools to measure performances. The table below lists the results of performance tests for Generation 1, VpnGw SKUs. As you can see, the best performance is obtained when we used GCMAES256 algorithm for both IPsec Encryption and Integrity. We got average performance when using AES256 for IPsec Encryption and SHA256 for Integrity. When we used DES3 for IPsec Encryption and SHA256 for Integrity we got lowest performance.

|**Generation**|**SKU**   | **Algorithms<br>used** | **Throughput<br>observed** | **Packets per second<br>observed** |
|---           |---       | ---                 | ---            | ---                    |
|**Generation1**|**VpnGw1**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>120 Mbps   | 58,000<br>50,000<br>50,000|
|**Generation1**|**VpnGw2**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1 Gbps<br>500 Mbps<br>120 Mbps | 90,000<br>80,000<br>55,000|
|**Generation1**|**VpnGw3**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>120 Mbps | 105,000<br>90,000<br>60,000|
|**Generation1**|**VpnGw1AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>120 Mbps   | 58,000<br>50,000<br>50,000|
|**Generation1**|**VpnGw2AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1 Gbps<br>500 Mbps<br>120 Mbps | 90,000<br>80,000<br>55,000|
|**Generation1**|**VpnGw3AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>120 Mbps | 105,000<br>90,000<br>60,000|
