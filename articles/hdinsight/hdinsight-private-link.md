---
title: Enable Private Link on an Azure HDInsight cluster
description: Learn how to connect to an outside HDInsight cluster by using Azure Private Link.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/15/2020
---

# Enable Private Link on an HDInsight cluster

In this article, you'll learn about using Azure Private Link to connect to an HDInsight cluster privately across networks over the Microsoft backbone network. This article is an extension of the article [Restrict cluster connectivity in Azure HDInsight](./hdinsight-restrict-public-connectivity.md), which focuses on restricting public connectivity. If you want public connectivity to or within your HDInsight clusters and dependent resources, consider restricting the connectivity of your cluster by following guidelines in [Control network traffic in Azure HDInsight](./control-network-traffic.md).

Private Link can be used in cross-network scenarios where virtual network peering is not available or enabled. For example, you want to integrate Azure Data Factory with Azure HDInsight, and you need to have Azure Data Factory connect to HDInsight clusters over a private network (that is, Private Link) for compliance and security reasons.

> [!NOTE]
> Restricting public connectivity is a prerequisite for enabling Private Link and shouldn't be considered the same capability.

The use of Private Link to connect to an HDInsight cluster is an optional feature and is disabled by default. The feature is available only when the `resourceProviderConnection` network property is set to *outbound*, as described in the article [Restrict cluster connectivity in Azure HDInsight](./hdinsight-restrict-public-connectivity.md).

When `privateLink` is set to *enabled*, internal [standard load balancers](../load-balancer/load-balancer-overview.md) (SLBs) are created, and an Azure Private Link service is provisioned for each SLB. The Private Link service is what allows you to access the HDInsight cluster from private endpoints.

## Prerequisites

Standard load balancers don't automatically provide [public outbound NAT](../load-balancer/load-balancer-outbound-connections.md) as basic load balancers do. You must provide your own NAT solution, such as a NAT gateway or a NAT provided by your [firewall](./hdinsight-restrict-outbound-traffic.md), to connect to outbound, public HDInsight dependencies. 

Your HDInsight cluster still needs access to its outbound dependencies. If these outbound dependencies are not allowed, cluster creation might fail. 

### Configure a default network security group on the subnet

Create and add a network security group (NSG) on the subnet where you intend to deploy the HDInsight cluster. An NSG is required for enabling outbound connectivity.

### Disable network policies for the Private Link service

For the successful creation of a Private Link service, you must explicitly [disable network policies for Private Link services](../private-link/disable-private-link-service-network-policy.md).

### Configure a NAT gateway on the subnet

You can opt to use a NAT gateway if you don't want to configure a firewall or a network virtual appliance (NVA) for NAT. Otherwise, skip to the next prerequisite.

To get started, add a NAT gateway (with a new public IP address in your virtual network) to the configured subnet of your virtual network. This gateway is responsible for translating your private internal IP address to public addresses when traffic needs to go outside your virtual network.

### Configure a firewall (optional)
For a basic setup to get started:

1. Add a new subnet named *AzureFirewallSubnet* to your virtual network. 
1. Use the new subnet to configure a new firewall and add your firewall policies. 
1. Use the new firewall's private IP address as the `nextHopIpAddress` value in your route table. 
1. Add the route table to the configured subnet of your virtual network.

For more information on setting up a firewall, see [Control network traffic in Azure HDInsight](./control-network-traffic.md).

The following diagram shows an example of the networking configuration that's required before you create a cluster. In this example, all outbound traffic is forced to Azure Firewall through a user-defined route. The required outbound dependencies should be allowed on the firewall before cluster creation. For Enterprise Security Package clusters, virtual network peering can provide the network connectivity to Azure Active Directory Domain Services.

:::image type="content" source="media/hdinsight-private-link/before-cluster-creation.png" alt-text="Diagram of the Private Link environment before cluster creation.":::

## Manage private endpoints for Azure HDInsight

You can use [private endpoints](../private-link/private-endpoint-overview.md) for your Azure HDInsight clusters to allow clients on a virtual network to securely access your cluster over [Private Link](../private-link/private-link-overview.md). Network traffic between the clients on the virtual network and the HDInsight cluster traverses over the Microsoft backbone network, eliminating exposure from the public internet.

:::image type="content" source="media/hdinsight-private-link/private-endpoint-experience.png" alt-text="Diagram of the private endpoint management experience.":::

A Private Link service consumer (for example, Azure Data Factory) can choose from two connection approval methods:

* **Automatic**: If the service consumer has Azure role-based access control (RBAC) permissions on the HDInsight resource, the consumer can choose the automatic approval method. In this case, when the request reaches the HDInsight resource, no action is required from the HDInsight resource and the connection is automatically approved.
* **Manual**: If the service consumer doesn't have Azure RBAC permissions on the HDInsight resource, the consumer can choose the manual approval method. In this case, the connection request appears on the HDInsight resources as **Pending**. The HDInsight resource needs to manually approve the request before connections can be established. 

To manage private endpoints, in your cluster view in the Azure portal, go to the **Networking** section under **Security + Networking**. Here, you can see all existing connections, connection states, and private endpoint details.

You can also approve, reject, or remove existing connections. When you create a private connection, you can specify which HDInsight subresource (for example, gateway or head node) you also want to connect to.

The following table shows the various HDInsight resource actions and the resulting connection states for private endpoints. An HDInsight resource can also change the connection state of the private endpoint connection at a later time without consumer intervention. The action will update the state of the endpoint on the consumer side.

| Service provider action | Service consumer private endpoint state | Description |
| --------- | --------- | --------- |
| None | Pending | Connection is created manually and is pending approval by the Private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the Private Link resource owner. |
| Remove | Disconnected | Connection was removed by the Private Link resource owner. The private endpoint becomes informative and should be deleted for cleanup. |

## Configure DNS to connect over private endpoints

After you've set up the networking, you can create a cluster with an outbound resource provider connection and Private Link enabled.

To access private clusters, you can use Private Link DNS extensions and private endpoints. When `privateLink` is set to *enabled*, you can create private endpoints and configure DNS resolution through private DNS zones.

The Private Link entries created in the Azure-managed public DNS zone `azurehdinsight.net` are as follows:

```dns
<clustername>        CNAME    <clustername>.privatelink
<clustername>-int    CNAME    <clustername>-int.privatelink
<clustername>-ssh    CNAME    <clustername>-ssh.privatelink
```
The following image shows an example of the private DNS entries configured to enable access to a cluster from a virtual network that isn't peered or doesn't have a direct line of sight to the cluster. You can use an Azure DNS private zone to override `*.privatelink.azurehdinsight.net` fully qualified domain names (FQDNs) and resolve private endpoints' IP addresses in the client's network. The configuration is only for `<clustername>.azurehdinsight.net` in the example, but it also extends to other cluster endpoints.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of the Private Link architecture.":::

## Create clusters

The following JSON code snippet includes the two network properties that you must configure in your Azure Resource Manager template to create a private HDInsight cluster:

```json
networkProperties: {
    "resourceProviderConnection": "Inbound" | "Outbound"
}
```

For a complete template with many of the HDInsight enterprise security features, including Private Link, see [HDInsight enterprise security template](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/ESP-HIB-PL-Template).

To create a cluster by using PowerShell, see the [example](/powershell/module/az.hdinsight/new-azhdinsightcluster#example-4--create-an-azure-hdinsight-cluster-with-relay-outbound-and-private-link-feature).

To create a cluster by using the Azure CLI, see the [example](/cli/azure/hdinsight#az_hdinsight_create-examples).

## Next steps

* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)