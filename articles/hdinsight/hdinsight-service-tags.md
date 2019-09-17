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

## Get started with HDInsight service tags

The easiest way to begin using service tags with your HDInsight cluster is to add the tag `HDInsight` to your Azure Firewall.

This tag contains the IP addresses of health and management services for all of the public regions and will ensure that your cluster can communicate with the necessary health and management services no matter where it is created.

## Health and management services: Specific regions

If you have stricter security requirements and need more restrictive whitelisting for your firewall, then you can add only the service tags applicable for your region.

To find out which service tags to add for your region, please consult the following sections.

### Whitelist only a regional service tag

If your cluster is located in one of the regions listed in this table, then you will only need to add the corresponding regional service tag next to it.

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

### Whitelist regional and global service tags

If your HDInsight cluster is created in one of the following Azure regions, then you need to whitelist a regional and global service tag. 

#### Group 1

All of these regions will need to whitelist the following global service tags in addition to their regional one:

* HDInsight.WestUS
* HDInsight.EastUS

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

The regions of **China North** and **China East** will need to whitelist all of the following service tags:

* HDInsight.ChinaNorth
* HDInsight.ChinaEast

#### Group 3

The regions of **US Gov Iowa** and **US Gov Virginia**, need to whitelist all of the following service tags:

* HDInsight.USGovIowa
* HDInsight.USGovVirginia

#### Group 4

The regions of **Germany Central** and ***Germany Northeast** need to whitelist all of the following service tags:

* HDInsight.GermanyCentral
* HDInsight.GermanyNorthEast

## Next steps

* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md)
