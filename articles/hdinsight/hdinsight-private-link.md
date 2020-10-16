---
title: Secure and isolate Azure HDInsight clusters with Private Link (preview)
description: Learn how to isolate Azure HDInsight clusters in a virtual network using Azure Private Link.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/15/2020
---

# Secure and isolate Azure HDInsight clusters with Private Link (preview)

In Azure HDInsight's [default virtual network architecture](./hdinsight-virtual-network-architecture.md), the HDInsight resource provider (RP) communicates with the cluster using public IP addresses. Some scenarios require complete network isolation with no use of public IP addresses. In this article, you learn about the advanced controls you can use to create a private HDInsight cluster. For information on how to restrict traffic to and from your cluster without complete network isolation, see [Control network traffic in Azure HDInsight](./control-network-traffic.md).

You can create private HDInsight clusters by configuring specific network properties in an Azure Resource Manager (ARM) template. There are two properties that you use to create private HDInsight clusters:

* Remove public IP addresses by setting `resourceProviderConnection` to outbound.
* Enable Azure Private Link and use [Private Endpoints](../private-link/private-endpoint-overview.md) by setting `privateLink` to enabled.

## Remove public IP addresses

By default, the HDInsight RP uses an *inbound* connection to the cluster using public IPs. When the `resourceProviderConnection` network property is set to *outbound*, it reverses the connections to the HDInsight RP so that the connections are always initiated from inside the cluster out to the RP. Without an inbound connection, there is no need for the inbound service tags or public IP addresses.

The basic load balancers used in the default virtual network architecture automatically provide public NAT (network address translation) to access the required outbound dependencies, such as the HDInsight RP. If you want to restrict outbound connectivity to the public internet, you can [configure a firewall](./hdinsight-restrict-outbound-traffic.md), but it's not a requirement.

Configuring `resourceProviderConnection` to outbound also allows you to access cluster-specific resources, such as Azure Data Lake Storage Gen2 or external metastores, using private endpoints. You must configure the private endpoints and DNS entries before you create the HDInsight cluster. We recommend you create and provide all the external SQL databases you need, such as Apache Ranger, Ambari, Oozie and Hive metastores, during cluster creation.

Private endpoints for Azure Key Vault are not supported. If you're using Azure Key Vault for CMK encryption at rest, the Azure Key Vault endpoint must be accessible from within the HDInsight subnet with no private endpoint.

The following diagram shows what a potential HDInsight virtual network architecture could look like when `resourceProviderConnection` is set to outbound:

:::image type="content" source="media/hdinsight-private-link/outbound-resource-provider-connection-only.png" alt-text="Diagram of HDInsight architecture using an outbound resource provider connection":::

After creating your cluster, you should set up proper DNS resolution. The following canonical name DNS record (CNAME) is created on the Azure-managed Public DNS Zone: `azurehdinsight.net`.

```dns
<clustername>    CNAME    <clustername>-int
```

To access the cluster using cluster FQDNs, you can either use the internal load balancer private IPs directly or use your own Private DNS Zone to override the cluster endpoints as appropriate for your needs. For example, you can have a Private DNS Zone, `azurehdinsight.net`. and add your private IPs as needed:

```dns
<clustername>        A   10.0.0.1
<clustername-ssh>    A   10.0.0.2
```

## Enable Private Link

Private Link, which is disabled by default, requires extensive networking knowledge to setup User Defined Routes (UDR) and firewall rules  properly before you create a cluster. Private Link access to the cluster is only available when the `resourceProviderConnection` network property is set to *outbound* as described in the previous section.

When `privateLink` is set to *enable*, internal [standard load balancers](../load-balancer/load-balancer-overview.md) (SLB) are created, and an Azure Private Link Service is provisioned for each SLB. The Private Link Service is what allows you to access the HDInsight cluster from private endpoints.

Standard load balancers do not automatically provide the public outbound NAT like basic load balancers do. You must provide your own NAT solution, such as [Virtual Network NAT](../virtual-network/nat-overview.md) or a [firewall](./hdinsight-restrict-outbound-traffic.md), for outbound dependencies. Your HDInsight cluster still needs access to its outbound dependencies. If these outbound dependencies are not allowed, the cluster creation may fail.

### Prepare your environment

The following diagram shows an example of the networking configuration required before you create a cluster. In this example, all outbound traffic is [forced](../firewall/forced-tunneling.md) to Azure Firewall using UDR and the required outbound dependencies should be "allowed" on the firewall before creating a cluster. For Enterprise Security Package clusters, the network connectivity to Azure Active Directory Domain Services can be provided by VNet peering.

:::image type="content" source="media/hdinsight-private-link/before-cluster-creation.png" alt-text="Diagram of private link environment before cluster creation":::

Once you've set up the networking, you can create a cluster with outbound resource provider connection and private link enabled, as shown in the following figure. In this configuration, there are no public IPs and Private Link Service is provisioned for each standard load balancer.

:::image type="content" source="media/hdinsight-private-link/after-cluster-creation.png" alt-text="Diagram of private link environment after cluster creation":::

### Access a private cluster

To access private clusters, you can use the internal load balancer private IPs directly, or you can use Private Link DNS extensions and Private Endpoints. When the `privateLink` setting is set to enabled, you can create your own private endpoints and configure DNS resolution through private DNS zones.

The Private Link entries created in the Azure-managed Public DNS Zone `azurehdinsight.net` are as follows:

```dns
<clustername>        CNAME    <clustername>.privatelink
<clustername>-int    CNAME    <clustername>-int.privatelink
<clustername>-ssh    CNAME    <clustername>-ssh.privatelink
```

The following image shows an example of the private DNS entries required to access the cluster from a virtual network that is not peered or doesn't have a direct line of sight to the cluster load balancers. You can use Azure Private Zone to override `*.privatelink.azurehdinsight.net` FQDNs and resolve to your own private endpoints IP addresses.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of private link architecture":::

## ARM template properties

The following JSON code snippet includes the two network properies you need to configure in your ARM template to create a private HDInsight cluster.

```json
networkProperties: {
    "resourceProviderConnection": "Inbound" | "Outbound",
    "privateLink": "Enabled" | "Disabled"
}
```

For a complete template with many of the HDInsight enterprise security features, including Private Link, see [HDInsight enterprise security template](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/ESP-HIB-PL-Template).

## Next steps

* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)
