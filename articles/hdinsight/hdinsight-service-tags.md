---
title: Azure HDInsight service tags
description: Use HDInsight service tags to allow inbound traffic to your cluster from HDInsight health and management services nodes, without explicitly adding IP addresses to your Azure firewall.
author: hrasheed-msft
ms.author: hrasheed
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 09/12/2019
---
# HDInsight service tags

HDInsight service tags for Azure firewall are groups of IP addresses for health and management services, which help minimize complexity for security rule creation. [Service tags](../firewall/service-tags.md) provide an alternative method for allowing inbound traffic from specific IP addresses without entering each of the [management IP addresses](hdinsight-management-ip-addresses.md) in your Azure firewall.

These service tags are created and managed by the HDInsight service. You can't create your own service tag, or modify an existing tag. Microsoft manages the address prefixes that match to the service tag, and automatically updates the service tag as addresses change.

## HDInsight service tag option one

The easiest way to begin using service tags with your HDInsight cluster is to add the tag `HDInsight` to your Azure Firewall.

This tag contains the IP addresses of health and management services for all of the public regions and will ensure that your cluster can communicate with the necessary health and management services no matter where it is created.

## HDInsight service tag option two

If option one won't work because you need more restrictive permissions for your firewall, then you can allow only the service tags applicable for your region. The applicable service tags may be one, two, or three service tags, depending on the region where your cluster is created.

To find out which service tags to add for your region, read the following sections of the document.

### Allow only a regional service tag

If you prefer service tag option two, and your cluster is located in one of the regions listed in this table, then you only need to add a single regional service tag to your firewall.

| Country | Region | Service tag |
| ---- | ---- | ---- |
| Australia | Australia East | HDInsight.AustraliaEast |
| &nbsp; | Australia Southeast | HDInsight.AustraliaSoutheast |
| &nbsp; | Australia Central | HDInsight.AustraliaCentral |
| China | China East | HDInsight.ChinaEast |
| &nbsp; | China North 2 | HDInsight.ChinaNorth2 |
| &nbsp; | North Central US | HDInsight.NorthCentralUS |
| &nbsp; | West US 2 | HDInsight.WestUS2 |
| &nbsp; | West Central US | HDInsight.WestCentralUS |
| Canada | Canada East | HDInsight.CanadaEast |
| Brazil | Brazil South | HDInsight.BrazilSouth |
| Korea | Korea Central | HDInsight.KoreaCentral |
| &nbsp; | Korea South | HDInsight.KoreaSouth |
| India | Central India | HDInsight.CentralIndia |
| &nbsp; | South India | HDInsight.SouthIndia |
| Japan | Japan West | HDInsight.JapanWest |
| France | France Central| HDInsight.FranceCentral |
| &nbsp; | UK South | HDInsight.UKSouth |
| United States | North Central US   | HDInsight.NorthCentralUS |
| &nbsp; | USDoD Central   | HDInsight.USDoDCentral |
| &nbsp; | USGov Texas | HDInsight.USGovTexas |
| &nbsp; | UsDoD East | HDInsight.USDoDEast |

### Allow regional and global service tags

If you prefer service tag option two, and the region where your cluster is created was not listed above, then you need to allow one regional service tag and one or more global service tags. The remaining regions are divided into groups based on which global service tags they use.

#### Group 1

If your cluster is created in one of the regions in the table below, allow the service tags `HDInsight.WestUS` and `HDInsight.EastUS` in addition to the regional service tag listed. Regions in this section require three service tags.

| Country | Region | Service tag |
| ---- | ---- | ---- |
| United States | East US 2 | HDInsight.EastUS2 |
| &nbsp; | Central US | HDInsight.CentralUS |
| &nbsp; | NorthCentral US | HDInsight. NorthCentralUS |
| &nbsp; | South Central US | HDInsight.SouthCentralUS |
| &nbsp; | East US | HDInsight.EastUS |
| &nbsp; | West US | HDInsight.WestUS |
| Japan | Japan East | HDInsight.JapanEast |
| Europe | North Europe | HDInsight.NorthEurope |
| &nbsp; | West Europe| HDInsight.WestEurope |
| Asia | East Asia | HDInsight.EastAsia |
| &nbsp; | Southeast Asia | HDInsight.SoutheastAsia |
| Australia | Australia East | HDInsight.AustraliaEast |

#### Group 2

Clusters in the regions of **China North** and **China East**, need to allow two service tags: `HDInsight.ChinaNorth` and `HDInsight.ChinaEast`.

#### Group 3

Clusters in the regions of **US Gov Iowa** and **US Gov Virginia**, need to allow two service tags: `HDInsight.USGovIowa` and `HDInsight.USGovVirginia`.

#### Group 4

Clusters in the regions of **Germany Central** and ***Germany Northeast**, need to allow two service tags: `HDInsight.GermanyCentral` and `HDInsight.GermanyNorthEast`.

## Next steps

* [Azure Firewall service tags](../firewall/service-tags.md)
* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md)
