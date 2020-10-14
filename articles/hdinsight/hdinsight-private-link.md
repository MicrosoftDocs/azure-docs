---
title: Secure virtual network traffic with private Azure HDInsight clusters (preview)
description: Learn which IP addresses you must allow inbound traffic from, in order to properly configure network security groups and user-defined routes for virtual networking with Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/13/2020
---

# Secure virtual network traffic with private Azure HDInsight clusters (preview)

In Azure HDInsight's [default virtual network architecture](./hdinsight-virtual-network-architecture.md), the HDInsight resource provider (RP) communicates with the cluster using public IP addresses. Some scenarios require complete network isolation with no use of public IP addresses. In this article, you learn about the advanced controls you can use to create a private HDInsight cluster. For information on how to restrict traffic to and from your cluster without complete network isolation, see [Control network traffic in Azure HDInsight](./control-network-traffic.md).

You can create private HDInsight clusters by configuring specific network properties in your Azure Resource Manager (ARM) template. There are two properties that you use to create private HDInsight clusters:

* Remove public IP addresses by setting `resourceProviderConnection` to outbound.
* Enable Azure Private Link and use [Private Endpoints](../private-link/private-endpoint-overview.md) by setting `privateLink` to enabled.

## Remove public IP addresses

By default, the HDInsight RP uses an *inbound* connection to the cluster using public IPs. When the `resourceProviderConnection` network property is set to *outbound*, it reverses the connections to the HDInsight RP so that the connections are always initiated from inside the cluster out to the RP. Without an inbound connection, there is no need for the inbound service tags or public IP addresses.

The basic load balancers used the in default virtual network architecture automatically provide public NAT (network address translation) to access the required outbound dependencies, such as the HDInsight RP. If you want to restrict outbound connectivity to the public internet, you can [configure a firewall](./hdinsight-restrict-outbound-traffic.md), but it's not a requirement.

Configuring `resourceProviderConnection` to outbound also allows you to access cluster-specific resources, such as Azure Data Lake Storage Gen2 or external metastores, using private endpoints. You must configure the private endpoints and DNS entries before you create the HDInsight cluster. We recommend you create and provide all the external SQL databases you need, such as Apache Ranger, Ambari, Oozie and Hive metastores, during cluster creation.

Private endpoints for Azure Key Vault are not supported. If you're using Azure Key Vault for CMK encryption at rest, the Azure Key Vault endpoint must be accessible from within the HDInsight subnet with no private endpoint.

The following diagram shows what a potential HDInsight virtual network architecture could look like when `resourceProviderConnection` is set to outbound:

:::image type="content" source="media/hdinsight-private-link/outbound-resource-provider-connection-only.png" alt-text="Diagram of HDInsight architecture using an outbound resource provider connection":::

### DNS entries


## Enable Private Link

Private Link, which is disabled by default, requires extensive networking knowledge to configure properly before you create a cluster. Private Link access to the cluster is only available when the `resourceProviderConnection` network property is set to *outbound* as described in the previous section.

When `privateLink` is set to enable*, internal standard load balancers (SLB) are created, and an Azure Private Link Service is provisioned for each SLB. The Private Link Service is what allows you to access the HDInsight cluster from private endpoints.

Standard load balancers do not automatically provide the public outbound NAT like basic load balancers do. You must provide your own NAT solution, such as [Virtual Network NAT](../virtual-network/nat-overview.md) or a [firewall](./hdinsight-restrict-outbound-traffic.md), for outbound dependencies. Your HDInsight cluster still needs access to its outbound dependencies. If these outbound dependencies are not allowed, the cluster creation may fail.

### Prepare your environment

The following diagram shows an example of the networking configuration required before you create a cluster. In this example, all HDInsight traffic is forced to tunnel to an Azure Firewall through a User Defined Route (UDR). Traffic from the firewall is governed by NAT rules. For Enterprise Security Package clusters, the network connectivity to Azure Active Directory Domain Services can be provided by VNet peering.

:::image type="content" source="media/hdinsight-private-link/before-cluster-creation.png" alt-text="Diagram of private link environment before cluster creation":::

Once you've set up the networking, you can create a cluster with outbound resource provider connection and private link enabled, as shown in the following figure. In this configuration, there are no public IPs and Private Link Service is provisioned for each standard load balancer.

:::image type="content" source="media/hdinsight-private-link/after-cluster-creation.png" alt-text="Diagram of private link environment after cluster creation":::

### Public DNS entries

### Access a private cluster

To access private clusters, you can use the internal load balancer private IPs directly, or you can use Private Link DNS extensions and Private Endpoints. When the `privateLink` setting is set to enabled, you can create your own private endpoints and configure DNS resolution through private DNS zones.

The following image shows an example of the private DNS entries required to access the cluster from a virtual network that is not peered or doesn't have a direct line of sight to the cluster load balancers. You can use Azure Private Zone to override `*.privatelink.azurehdinsight.net` FQDNs and resolve to your own private endpoints IP addresses.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of private link architecture":::

## ARM template properties

## Next steps

* 
