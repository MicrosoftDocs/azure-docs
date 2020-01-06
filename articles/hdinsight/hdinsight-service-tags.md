---
title: Network security group (NSG) service tags for Azure HDInsight
description: Use HDInsight service tags to allow inbound traffic to your cluster from HDInsight health and management services nodes, without explicitly adding IP addresses to your network security groups.
author: hrasheed-msft
ms.author: hrasheed
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/05/2019
---

# Network security group (NSG) service tags for Azure HDInsight

HDInsight service tags for network security groups (NSGs) are groups of IP addresses for health and management services. These groups help minimize complexity for security rule creation. [Service tags](../virtual-network/security-overview.md#service-tags) provide an alternative method for allowing inbound traffic from specific IP addresses without entering each of the [management IP addresses](hdinsight-management-ip-addresses.md) in your network security groups.

These service tags are created and managed by the HDInsight service. You can't create your own service tag, or modify an existing tag. Microsoft manages the address prefixes that match to the service tag, and automatically updates the service tag as addresses change.

## Getting started with service tags

You have two options for using service tags in your network security groups:

1. Use a single HDInsight service tag - this option will open your virtual network to all of the IP Addresses that the HDInsight service is using to monitor clusters across all regions. This option is the simplest method, but may not be appropriate if you have restrictive security requirements.

1. Use multiple regional service tags - this option will open your virtual network to only the IP Addresses that HDInsight is using in that specific region. However, if you're using multiple regions, then you'll need to add multiple service tags to your virtual network.

## Use a single global HDInsight service tag

The easiest way to begin using service tags with your HDInsight cluster is to add the global tag `HDInsight` to a network security group rule.

1. From the [Azure portal](https://portal.azure.com/), select your network security group.

1. Under **Settings**, select **Inbound security rules**, and then select **+ Add**.

1. From the **Source** drop-down list, select **Service Tag**.

1. From the **Source service tag** drop-down list, select **HDInsight**.

    ![Azure portal add service tag](./media/hdinisght-service-tags/azure-portal-add-service-tag.png)

This tag contains the IP addresses of health and management services for all of the regions where HDInsight is available, and will ensure that your cluster can communicate with the necessary health and management services no matter where it's created.

## Use regional HDInsight service tags

If option one won't work because you need more restrictive permissions, then you can allow only the service tags applicable for your region. The applicable service tags may be one, two, or three service tags, depending on the region where your cluster is created.

To find out which service tags to add for your region, read the following sections of the document.

### Use a single regional service tag

If you prefer service tag option two, and your cluster is located in one of the regions listed in this table, then you only need to add a single regional service tag to your network security group.

| Country | Region | Service tag |
| ---- | ---- | ---- |
| Australia | Australia East | HDInsight.AustraliaEast |
| &nbsp; | Australia Southeast | HDInsight.AustraliaSoutheast |
| &nbsp; | Australia Central | HDInsight.AustraliaCentral |
| China | China East 2 | HDInsight.ChinaEast2 |
| &nbsp; | China North 2 | HDInsight.ChinaNorth2 |
| United States | North Central US | HDInsight.NorthCentralUS |
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
| UK | UK South | HDInsight.UKSouth |
| Azure Government | USDoD Central   | HDInsight.USDoDCentral |
| &nbsp; | USGov Texas | HDInsight.USGovTexas |
| &nbsp; | UsDoD East | HDInsight.USDoDEast |

### Use multiple regional service tags

If you prefer service tag option two, and the region where your cluster is created wasn't listed above, then you need to allow multiple regional service tags. The need to use more than one is due to differences in the arrangement of resource providers for the various regions.

The remaining regions are divided into groups based on which regional service tags they use.

#### Group 1

If your cluster is created in one of the regions in the table below, allow the service tags `HDInsight.WestUS` and `HDInsight.EastUS` in addition to the regional service tag listed. Regions in this section require three service tags.

For example, if your cluster is created in the `East US 2` region, then you'll need to add the following service tags to your network security group:

- `HDInsight.EastUS2`
- `HDInsight.WestUS`
- `HDInsight.EastUS`

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

Clusters in the regions of **Germany Central** and **Germany Northeast**, need to allow two service tags: `HDInsight.GermanyCentral` and `HDInsight.GermanyNorthEast`.

## Next steps

- [Network security groups - service tags](../virtual-network/security-overview.md#security-rules)
- [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md)
