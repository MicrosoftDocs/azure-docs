---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/26/2023
 ms.author: cherylmc
---

To help you understand the relative performance of SKUs using different algorithms, we used publicly available iPerf and CTSTraffic tools to measure performances for site-to-site connections. 

The table in this section lists the results of performance tests for VpnGW SKUs. A VPN tunnel connects to a VPN gateway instance. Each instance throughput is mentioned in the throughput table in the previous section and is available aggregated across all tunnels connecting to that instance. The table shows the observed bandwidth and packets per second throughput per tunnel for the different gateway SKUs. All testing was performed between gateways (endpoints) within Azure across different regions with 100 connections and under standard load conditions.

* The best performance was obtained when we used the GCMAES256 algorithm for both IPsec Encryption and Integrity.
* Average performance was obtained when using AES256 for IPsec Encryption and SHA256 for Integrity.
* The lowest performance was obtained when we used DES3 for IPsec Encryption and SHA256 for Integrity.

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
