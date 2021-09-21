---
title: Enable Private Link on a Private Inbound Cluster (preview)
description: Learn how to connect outside HDInsight cluster using Azure Private Link.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/15/2020
---

# Enable Private Link on a Private Inbound Cluster

In this article, you will learn about leveraging Azure Private Link to connect ourside your HDInsight cluster securely. For information on how to restrict traffic to and from your cluster without complete network isolation, see [Control network traffic in Azure HDInsight](./control-network-traffic.md). This article is an extension of our main article "[Create a Private Inbound Cluster in Azure HDInsight](./hdinsight-private-inbound-cluster.md)" where we focus on basics of creating a private inbound cluster.

>[!NOTE]
>Removing outbound public IP addresses is a prerequisite for enabling Private Link and should not be considered as same capability

Private Link, which is disabled by 
, requires extensive networking knowledge to setup User Defined Routes (UDR) and firewall rules properly before you create a cluster. Using this setting is optional but it is only available when the `resourceProviderConnection` network property is set to *outbound* as described in the previous article [Create a Private Inbound Cluster in Azure HDInsight](./hdinsight-private-inbound-cluster.md).

When `privateLink` is set to *enable*, internal [standard load balancers](../load-balancer/load-balancer-overview.md) (SLB) are created, and an Azure Private Link Service is provisioned for each SLB. The Private Link Service is what allows you to access the HDInsight cluster from private endpoints.

## Ways to Enable Private link

Standard load balancers do not automatically provide the [public outbound NAT](../load-balancer/load-balancer-outbound-connections.md) like basic load balancers do. You must provide your own NAT solution, such as [Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) or a [firewall](./hdinsight-restrict-outbound-traffic.md), for outbound dependencies. Your HDInsight cluster still needs access to its outbound dependencies. If these outbound dependencies are not allowed, the cluster creation may fail.

### Using NAT Gateway
To get started with this option, you can simply add a NAT gateway (with a new public IP address in your virtual network) to the configured subnet of your virtual network. This gateway is responsible for translating your private internal IP address to public addresses when traffic needs to go outside of your virtual network via private link.

### Using Firewall or Network Virtual Appliance (NVAs) for NAT
Here you will begin by adding a new subnet "AzureFirewallSubnet" to your virtual network. Once created, use this subnet to configure a new firewall and add your firewall policies. After your firewall is setup, use this firewalls private IP as a next hop address for a route in a new route table. Add this route table to the configured subnet of your virtual network.

The following diagram shows an example of the networking configuration required before you create a cluster. In this example, all outbound traffic is [forced](../firewall/forced-tunneling.md) to Azure Firewall using UDR and the required outbound dependencies should be "allowed" on the firewall before creating a cluster. For Enterprise Security Package clusters, the network connectivity to Azure Active Directory Domain Services can be provided by VNet peering.

:::image type="content" source="media/hdinsight-private-link/before-cluster-creation.png" alt-text="Diagram of private link environment before cluster creation":::

## Subnet Configuration
Once you have either added NAT Gateway or a route table (with firewall) to your configured subnet, you need to create and add a standard Network Security Group to this subnet to finish setup.

## Disable network policies for private link service
For successfully creation of private link services, you must explicitly [disable network policies for private link service](../private-link/disable-private-link-service-network-policy.md).

## Access a private cluster

Once you've set up the networking, you can create a cluster with outbound resource provider connection and private link enabled, as shown in the following figure. In this configuration, there are no public IPs and Private Link Service is provisioned for each standard load balancer.

:::image type="content" source="media/hdinsight-private-link/after-cluster-creation.png" alt-text="Diagram of private link environment after cluster creation":::

To access private clusters, you can use the internal load balancer private IPs directly, or you can use Private Link DNS extensions and Private Endpoints. When the `privateLink` setting is set to enabled, you can create your own private endpoints and configure DNS resolution through private DNS zones.

The Private Link entries created in the Azure-managed Public DNS Zone `azurehdinsight.net` are as follows:

```dns
<clustername>        CNAME    <clustername>.privatelink
<clustername>-int    CNAME    <clustername>-int.privatelink
<clustername>-ssh    CNAME    <clustername>-ssh.privatelink
```

The following image shows an example of the private DNS entries required to access the cluster from a virtual network that is not peered or doesn't have a direct line of sight to the cluster load balancers. You can use Azure Private Zone to override `*.privatelink.azurehdinsight.net` FQDNs and resolve to your own private endpoints IP addresses.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of private link architecture":::

## How to Create Clusters?
### Use ARM template properties

The following JSON code snippet includes the two network properties you need to configure in your ARM template to create a private HDInsight cluster.

```json
networkProperties: {
    "resourceProviderConnection": "Inbound" | "Outbound",
    "privateLink": "Enabled" | "Disabled"
}
```

For a complete template with many of the HDInsight enterprise security features, including Private Link, see [HDInsight enterprise security template](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/ESP-HIB-PL-Template).

### Use Azure PowerShell

To use PowerShell, see the example [here](/powershell/module/az.hdinsight/new-azhdinsightcluster#example-4--create-an-azure-hdinsight-cluster-with-relay-outbound-and-private-link-feature).

### Use Azure CLI
To use Azure CLI, see the example [here](/cli/azure/hdinsight#az_hdinsight_create-examples).

## Next steps

* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)
