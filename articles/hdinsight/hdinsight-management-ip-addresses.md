---
title: Azure HDInsight management IP addresses
description: Learn which IP addresses you must allow inbound traffic from, in order to properly configure network security groups and user-defined routes for virtual networking with Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 03/03/2020
---

# HDInsight management IP addresses

> [!Important]
> In most cases, you can now use the [service tag](hdinsight-service-tags.md) feature for network security groups, instead of manually adding IP addresses. New regions will only be added for service tags and the static IP addresses will eventually be deprecated.

If you use network security groups (NSGs) or user-defined routes (UDRs) to control inbound traffic to your HDInsight cluster, you must ensure that your cluster can communicate with critical Azure health and management services.  Some of the IP addresses for these services are region-specific, and some of them apply to all Azure regions. You may also need to allow traffic from the Azure DNS service if you aren't using custom DNS.

The following sections discuss the specific IP addresses that must be allowed.

## Azure DNS service

If you're using the Azure-provided DNS service, allow access from __168.63.129.16__ on port 53. For more information, see the [Name resolution for VMs and Role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) document. If you're using custom DNS, skip this step.

## Health and management services: All regions

Allow traffic from the following IP addresses for Azure HDInsight health and management services, which apply to all Azure regions:

| Source IP address | Destination  | Direction |
| ---- | ----- | ----- |
| 168.61.49.99 | \*:443 | Inbound |
| 23.99.5.239 | \*:443 | Inbound |
| 168.61.48.131 | \*:443 | Inbound |
| 138.91.141.162 | \*:443 | Inbound |

## Health and management services: Specific regions

Allow traffic from the IP addresses listed for the Azure HDInsight health and management services in the specific Azure region where your resources are located:

> [!IMPORTANT]  
> If the Azure region you are using is not listed, then use the [service tag](hdinsight-service-tags.md) feature for network security groups.

| Country | Region | Allowed Source IP addresses | Allowed Destination | Direction |
| ---- | ---- | ---- | ---- | ----- |
| Asia | East Asia | 23.102.235.122</br>52.175.38.134 | \*:443 | Inbound |
| &nbsp; | Southeast Asia | 13.76.245.160</br>13.76.136.249 | \*:443 | Inbound |
| Australia | Australia East | 104.210.84.115</br>13.75.152.195 | \*:443 | Inbound |
| &nbsp; | Australia Southeast | 13.77.2.56</br>13.77.2.94 | \*:443 | Inbound |
| Brazil | Brazil South | 191.235.84.104</br>191.235.87.113 | \*:443 | Inbound |
| Canada | Canada East | 52.229.127.96</br>52.229.123.172 | \*:443 | Inbound |
| &nbsp; | Canada Central | 52.228.37.66</br>52.228.45.222 |\*: 443 | Inbound |
| China | China North | 42.159.96.170</br>139.217.2.219</br></br>42.159.198.178</br>42.159.234.157 | \*:443 | Inbound |
| &nbsp; | China East | 42.159.198.178</br>42.159.234.157</br></br>42.159.96.170</br>139.217.2.219 | \*:443 | Inbound |
| &nbsp; | China North 2 | 40.73.37.141</br>40.73.38.172 | \*:443 | Inbound |
| &nbsp; | China East 2 | 139.217.227.106</br>139.217.228.187 | \*:443 | Inbound |
| Europe | North Europe | 52.164.210.96</br>13.74.153.132 | \*:443 | Inbound |
| &nbsp; | West Europe| 52.166.243.90</br>52.174.36.244 | \*:443 | Inbound |
| France | France Central| 20.188.39.64</br>40.89.157.135 | \*:443 | Inbound |
| Germany | Germany Central | 51.4.146.68</br>51.4.146.80 | \*:443 | Inbound |
| &nbsp; | Germany Northeast | 51.5.150.132</br>51.5.144.101 | \*:443 | Inbound |
| India | Central India | 52.172.153.209</br>52.172.152.49 | \*:443 | Inbound |
| &nbsp; | South India | 104.211.223.67<br/>104.211.216.210 | \*:443 | Inbound |
| Japan | Japan East | 13.78.125.90</br>13.78.89.60 | \*:443 | Inbound |
| &nbsp; | Japan West | 40.74.125.69</br>138.91.29.150 | \*:443 | Inbound |
| Korea | Korea Central | 52.231.39.142</br>52.231.36.209 | \*:443 | Inbound |
| &nbsp; | Korea South | 52.231.203.16</br>52.231.205.214 | \*:443 | Inbound
| United Kingdom | UK West | 51.141.13.110</br>51.141.7.20 | \*:443 | Inbound |
| &nbsp; | UK South | 51.140.47.39</br>51.140.52.16 | \*:443 | Inbound |
| United States | Central US | 13.89.171.122</br>13.89.171.124 | \*:443 | Inbound |
| &nbsp; | East US | 13.82.225.233</br>40.71.175.99 | \*:443 | Inbound |
| &nbsp; | North Central US | 157.56.8.38</br>157.55.213.99 | \*:443 | Inbound |
| &nbsp; | West Central US | 52.161.23.15</br>52.161.10.167 | \*:443 | Inbound |
| &nbsp; | West US | 13.64.254.98</br>23.101.196.19 | \*:443 | Inbound |
| &nbsp; | West US 2 | 52.175.211.210</br>52.175.222.222 | \*:443 | Inbound |
| &nbsp; | UAE North | 65.52.252.96</br>65.52.252.97 | \*:443 | Inbound |

For information on the IP addresses to use for Azure Government, see the [Azure Government Intelligence + Analytics](https://docs.microsoft.com/azure/azure-government/documentation-government-services-intelligenceandanalytics) document.

For more information, see [Control network traffic](./control-network-traffic.md).

If you're using user-defined routes (UDRs), you should specify a route and allow outbound traffic from the virtual network to the above IPs with the next hop set to "Internet".

## Next steps

* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md)
* [Network security group (NSG) service tags for Azure HDInsight](hdinsight-service-tags.md)
