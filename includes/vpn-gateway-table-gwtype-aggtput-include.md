---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/04/2022
 ms.author: cherylmc
---

|**VPN<br>Gateway<br>Generation** |**SKU**   | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br> SSTP Connections** | **P2S<br> IKEv2/OpenVPN Connections** | **Aggregate<br>Throughput Benchmark** | **BGP** | **Zone-redundant** |
|---            |---         | ---        | ---       | ---            | ---       | ---       | ---|
|**Generation1**|**Basic**   | Max. 10    | Max. 128  | Not Supported  | 100 Mbps  | Not Supported| No |
|**Generation1**|**VpnGw1**  | Max. 30   | Max. 128  | Max. 250       | 650 Mbps  | Supported | No |
|**Generation1**|**VpnGw2**  | Max. 30   | Max. 128  | Max. 500       | 1 Gbps    | Supported | No |
|**Generation1**|**VpnGw3**  | Max. 30   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | No |
|**Generation1**|**VpnGw1AZ**| Max. 30   | Max. 128  | Max. 250       | 650 Mbps  | Supported | Yes |
|**Generation1**|**VpnGw2AZ**| Max. 30   | Max. 128  | Max. 500       | 1 Gbps    | Supported | Yes |
|**Generation1**|**VpnGw3AZ**| Max. 30   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported | Yes |
|        |            |            |           |                |           |           |     |
|**Generation2**|**VpnGw2**  | Max. 30   | Max. 128  | Max. 500       | 1.25 Gbps | Supported | No |
|**Generation2**|**VpnGw3**  | Max. 30   | Max. 128  | Max. 1000      | 2.5 Gbps  | Supported | No |
|**Generation2**|**VpnGw4**  | Max. 100*   | Max. 128  | Max. 5000      | 5 Gbps    | Supported | No |
|**Generation2**|**VpnGw5**  | Max. 100*   | Max. 128  | Max. 10000      | 10 Gbps   | Supported | No |
|**Generation2**|**VpnGw2AZ**| Max. 30   | Max. 128  | Max. 500       | 1.25 Gbps | Supported | Yes |
|**Generation2**|**VpnGw3AZ**| Max. 30   | Max. 128  | Max. 1000      | 2.5 Gbps  | Supported | Yes |
|**Generation2**|**VpnGw4AZ**| Max. 100*   | Max. 128  | Max. 5000      | 5 Gbps    | Supported | Yes |
|**Generation2**|**VpnGw5AZ**| Max. 100*   | Max. 128  | Max. 10000      | 10 Gbps   | Supported | Yes |

(*) Use [Virtual WAN](../articles/virtual-wan/virtual-wan-about.md) if you need more than 100 S2S VPN tunnels.

* The resizing of VpnGw SKUs is allowed within the same generation, except resizing of the Basic SKU. The Basic SKU is a legacy SKU and has feature limitations. In order to move from Basic to another SKU, you must delete the Basic SKU VPN gateway and create a new gateway with the desired Generation and SKU size combination. (see [Working with Legacy SKUs](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md)).

* These connection limits are separate. For example, you can have 128 SSTP connections and also 250 IKEv2 connections on a VpnGw1 SKU.

* Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page.

* SLA (Service Level Agreement) information can be found on the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway/) page.

* If you have a lot of P2S connections, it can negatively impact your S2S connections. The Aggregate Throughput Benchmarks were tested by maximizing a combination of S2S and P2S connections. A single P2S or S2S connection can have a much lower throughput.
* Note that all benchmarks aren't guaranteed due to Internet traffic conditions and your application behaviors

To help our customers understand the relative performance of SKUs using different algorithms, we used publicly available iPerf and CTSTraffic tools to measure performances for site-to-site connections. The table below lists the results of performance tests for VpnGw SKUs. As you can see, the best performance is obtained when we used GCMAES256 algorithm for both IPsec Encryption and Integrity. We got average performance when using AES256 for IPsec Encryption and SHA256 for Integrity. When we used DES3 for IPsec Encryption and SHA256 for Integrity we got lowest performance.

A VPN tunnel connects to a VPN gateway instance. Each instance throughput is mentioned in the above throughput table and is available aggregated across all tunnels connecting to that instance.

The table below shows the observed bandwidth and packets per second throughput per tunnel for the different gateway SKUs. All testing was performed between gateways (endpoints) within Azure across different regions with 100 connections and under standard load conditions.

|**Generation**|**SKU**   | **Algorithms<br>used** | **Throughput<br>observed per tunnel** | **Packets per second per tunnel<br>observed** |
|---           |---       | ---                 | ---            | ---                    |
|**Generation1**|**VpnGw1**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>130 Mbps   | 62,000<br>47,000<br>12,000|
|**Generation1**|**VpnGw2**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.2 Gbps<br>650 Mbps<br>140 Mbps | 100,000<br>61,000<br>13,000|
|**Generation1**|**VpnGw3**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>700 Mbps<br>140 Mbps | 120,000<br>66,000<br>13,000|
|**Generation1**|**VpnGw1AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 650 Mbps<br>500 Mbps<br>130 Mbps   | 62,000<br>47,000<br>12,000|
|**Generation1**|**VpnGw2AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.2 Gbps<br>650 Mbps<br>140 Mbps | 110,000<br>61,000<br>13,000|
|**Generation1**|**VpnGw3AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>700 Mbps<br>140 Mbps | 120,000<br>66,000<br>13,000|
| | |
|**Generation2**|**VpnGw2**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>130 Mbps | 120,000<br>52,000<br>12,000|
|**Generation2**|**VpnGw3**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.5 Gbps<br>700 Mbps<br>140 Mbps | 140,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw4**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw5**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw2AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.25 Gbps<br>550 Mbps<br>130 Mbps | 120,000<br>52,000<br>12,000|
|**Generation2**|**VpnGw3AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 1.5 Gbps<br>700 Mbps<br>140 Mbps | 140,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw4AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
|**Generation2**|**VpnGw5AZ**| GCMAES256<br>AES256 & SHA256<br>DES3 & SHA256| 2.3 Gbps<br>700 Mbps<br>140 Mbps | 220,000<br>66,000<br>13,000|
