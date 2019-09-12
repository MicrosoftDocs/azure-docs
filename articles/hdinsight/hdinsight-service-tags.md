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

HDInsight service tags for Azure firewall are groups of IP addresses for health and management services, which help minimize complexity for security rule creation. Service tags provides an alternative method for allowing inbound traffic from specific IP addresses without entering each of the [management IP addresses](hdinsight-management-ip-addresses.md) in your Azure firewall.

These service tags are created and managed by the HDInsight service. You can't create your own service tag, or modify an existing tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

Some of the HDInsight service tags are region specific, and some of them apply to all Azure regions. 

The following sections list the HDInsight service tags for each region.

## Health and management services: All regions

Use the following service tags to allow traffic from the IP addresses for Azure HDInsight health and management services which apply to all Azure regions:

| Azure cloud | Service tag |
| ---- | ----- | ----- |
| Public | HDInsight.WestUS |
| Public | HDInsight.EastUS |
| Mooncake | HDInsight.ChinaNorth |
| Mooncake | HDInsight.ChinaEast |
| Fairfax | HDInsight.USGovVirginia |
| Fairfax | HDInsight.USGovIowa |
| Blackforest | HDInsight.GermanyCentral |
| Blackforest | HDInsight.GermanyNorthEast |

## Health and management services: Specific regions

Use the following service tags to allow traffic from the IP addresses for the Azure HDInsight health and management services in the specific Azure region where your resources are located:

> [!IMPORTANT]  
> If the Azure region you are using is not listed, then only use the four service tags from the previous section.

| Country | Region | Service tag |
| ---- | ---- | ---- |
| Asia | East Asia | HDInsight.EastAsia |
| &nbsp; | Southeast Asia | HDInsight.SoutheastAsia |
| Australia | Australia East | HDInsight.AustraliaEast |
| &nbsp; | Australia Southeast | HDInsight.AustraliaSoutheast |
| Brazil | Brazil South | HDInsight.BrazilSouth |
| Canada | Canada East | HDInsight.CanadaEast |
| &nbsp; | Canada Central | HDInsight.CanadaCentral |
| China | China North | HDInsight.ChinaNorth |
| &nbsp; | China East | HDInsight.ChinaEast |
| &nbsp; | China North 2 | HDInsight.ChinaNorth2 |
| &nbsp; | China East 2 | HDInsight.ChinaEast2 |
| Europe | North Europe | HDInsight.NorthEurope |
| &nbsp; | West Europe| HDInsight.WestEurope |
| France | France Central| HDInsight.FranceCentral |
| Germany | Germany Central | HDInsight.GermanyCentral |
| &nbsp; | Germany Northeast | HDInsight.GermanyNorthEast |
| India | Central India | HDInsight.CentralIndia |
| &nbsp; | South India | HDInsight.SouthIndia |
| Japan | Japan East | HDInsight.JapanEast |
| &nbsp; | Japan West | HDInsight.JapanWest |
| Korea | Korea Central | HDInsight.KoreaCentral |
| &nbsp; | Korea South | HDInsight.KoreaSouth |
| United Kingdom | UK West | HDInsight.UKWest |
| &nbsp; | UK South | HDInsight.UKSouth |
| United States | Central US | HDInsight.CentralUS |
| &nbsp; | East US | HDInsight.EastUS |
| &nbsp; | North Central US | HDInsight.NorthCentralUS |
| &nbsp; | West Central US | HDInsight.WestCentralUS |
| &nbsp; | West US | HDInsight.WestUS |
| &nbsp; | West US 2 | HDInsight.WestUS2 |

## Next steps

* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md)
