---
title: Azure HDInsight management IP addresses
description: Learn which IP addresses you must allow inbound traffic from, in order to properly configure network security groups and user-defined routes for virtual networking with Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 07/12/2023
---
# HDInsight management IP addresses

This article lists the IP addresses used by Azure HDInsight health and management services. If you use network security groups (NSGs) or user-defined routes (UDRs), you may need to add some of these IP addresses to the allowlist for inbound network traffic.

## Introduction
 
> [!Important]
> In most cases, you can now use [service tags](hdinsight-service-tags.md) for network security groups, instead of manually adding IP addresses. IP addresses will not be published for new Azure regions, and they will only have published service tags. The static IP addresses for management IP addresses will eventually be deprecated.

If you use network security groups (NSGs) or user-defined routes (UDRs) to control inbound traffic to your HDInsight cluster, you must ensure that your cluster can communicate with critical Azure health and management services.  Some of the IP addresses for these services are region-specific, and some of them apply to all Azure regions. You may also need to allow traffic from the Azure DNS service if you aren't using custom DNS.

If you need IP addresses for a region not listed here, you can use the [Service Tag Discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) to find IP addresses for your region. If you're unable to use the API, download the [service tag JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) and search for your desired region.

HDInsight does validation for these rules with cluster creation and scaling to prevent further errors. If validation doesn't pass, creation and scaling fail.

The following sections discuss the specific IP addresses that must be allowed.

## Azure DNS service

If you're using the Azure-provided DNS service, allow access to __168.63.129.16__ on port 53 for both TCP and UDP. For more information, see the [Name resolution for VMs and Role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) document. If you're using custom DNS, skip this step.

## Health and management services: All regions

Allow traffic from the following IP addresses for Azure HDInsight health and management services, which apply to all Azure regions:

| Source IP address | Destination  | Direction |
| ---- | ----- | ----- |
| 168.61.49.99 | \*:443 | Inbound |
| 23.99.5.239 | \*:443 | Inbound |
| 168.61.48.131 | \*:443 | Inbound |
| 138.91.141.162 | \*:443 | Inbound |

## Health and management services: Specific regions

Allow traffic from the IP addresses listed for the Azure HDInsight health and management services in the specific Azure region where your resources are located, refer the following note:

> [!IMPORTANT]  
> We recommend to use [service tag](hdinsight-service-tags.md) feature for network security groups. If you require region specific service tags, please refer the [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/confirmation.aspx?id=56519)

For information on the IP addresses to use for Azure Government, see the [Azure Government Intelligence + Analytics](../azure-government/compare-azure-government-global-azure.md) document.

For more information, see [Control network traffic](./control-network-traffic.md).

If you're using user-defined routes (UDRs), you should specify a route and allow outbound traffic from the virtual network to the above IPs with the next hop set to "Internet."

## Next steps

* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md)
* [Network security group (NSG) service tags for Azure HDInsight](hdinsight-service-tags.md)
