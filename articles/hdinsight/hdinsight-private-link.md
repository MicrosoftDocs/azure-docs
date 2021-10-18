---
title: Enable Private Link on a Azure HDInsight cluster
description: Learn how to connect outside HDInsight cluster using Azure Private Link.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/15/2020
---

# Enable Private Link on HDInsight cluster

## Overview
In this article, you will learn about leveraging Azure Private Link to connect to your HDInsight cluster privately across networks over the Microsoft backbone network. This article is an extension of our main article [restrict cluster connectivity in Azure HDInsight](./hdinsight-restrict-public-connectivity.md) where we focused on restricting public connectivity. In the case where you may opt to have public connectivity to/within your HDInsight cluster(s) and dependent resources, consider restricting connectivity of your cluster by following guidelines from [control network traffic in Azure HDInsight](./control-network-traffic.md)

Private Link can be leveraged in cross virtual network scenarios where virtual network peering is not available or enabled.

> [!NOTE]
> Restricting public connectivity is a prerequisite for enabling Private Link and should not be considered as the same capability.

Private Link is an optional feature and is disabled by default. The feature is only available when the `resourceProviderConnection` network property is set to *outbound* as described in the article [restrict cluster connectivity in Azure HDInsight](./hdinsight-restrict-public-connectivity.md).

When `privateLink` is set to *enabled*, internal [standard load balancers](../load-balancer/load-balancer-overview.md) (SLB) are created, and an Azure Private Link Service is provisioned for each SLB. The Private Link Service is what allows you to access the HDInsight cluster from private endpoints.

## Prerequisites

Standard load balancers do not automatically provide [public outbound NAT](../load-balancer/load-balancer-outbound-connections.md) as basic load balancers do. You must provide your own NAT solution, such as a NAT gateway, or NAT provided by your [firewall](./hdinsight-restrict-outbound-traffic.md), to connect to outbound, public HDInsight dependencies. Your HDInsight cluster still needs access to its outbound dependencies. If these outbound dependencies are not allowed, cluster creation may fail. A Network Security Group must also be configured on the subnet to enable outbound connectivity.

### 1.	Configure a default Network Security Group (NSG) on the subnet

Create and add a Network Security Group on the subnet where you intend to deploy the HDInsight cluster.

### 2.	Disable network policies for private link service

For the successful creation of private link services, you must explicitly [disable network policies for private link services](../private-link/disable-private-link-service-network-policy.md).

### 3.	Configure a NAT Gateway on the subnet

You can opt to use NAT gateway if you don’t want to configure Firewall or Network Virtual Appliance (NVAs) for NAT, otherwise, skip to the next prerequisite.

To get started, simply add a NAT gateway (with a new public IP address in your virtual network) to the configured subnet of your virtual network. This gateway is responsible for translating your private internal IP address to public addresses when traffic needs to go outside of your virtual network.

### 4.	Using Firewall or Network Virtual Appliance (NVAs) for NAT (Optional)
For a basic setup to get started, begin by adding a new subnet "AzureFirewallSubnet" to your virtual network. Once created, use this subnet to configure a new firewall and add your firewall policies. After your firewall is set up, use this firewall's private IP as the `nextHopIpAddress` in your route table. Add this route table to the configured subnet of your virtual network.
For additional details on setting up a firewall, see [control network traffic in Azure HDInsight](./control-network-traffic.md)

The following diagram shows an example of the networking configuration required before you create a cluster. In this example, all outbound traffic is forced to Azure Firewall using UDR and the required outbound dependencies should be "allowed" on the firewall before creating a cluster. For Enterprise Security Package clusters, the network connectivity to Azure Active Directory Domain Services can be provided by VNet peering.

:::image type="content" source="media/hdinsight-private-link/before-cluster-creation.png" alt-text="Diagram of private link environment before cluster creation":::

## Manage private endpoints for Azure HDInsight

You can use [private endpoints](../private-link/private-endpoint-overview.md) for your Azure HDInsight clusters to allow clients on a virtual network (VNet) to securely access your cluster over [private link](../private-link/private-link-overview.md). Network traffic between the clients on the VNet and the HDInsight cluster traverses over Microsoft backbone network, eliminating exposure from the public internet.

:::image type="content" source="media/hdinsight-private-link/private-endpoint-experience.png" alt-text="Diagram of private endpoint management experience":::

There are two connection approval methods that a Private Link service consumer can choose from:
* **Automatic**: If the service consumer has Azure RBAC permissions on the HDInsight resource the consumer can choose the automatic approval method. In this case, when the request reaches the HDInsight resource, no action is required from the HDInsight resource and the connection is automatically approved.
* **Manual**: On the contrary, if the service consumer doesn’t have Azure RBAC permissions on the HDInsight resource, the consumer can choose the manual approval method. In this case, the connection request appears on the HDInsight resources as Pending. The request needs to be manually approved by HDInsight resource before connections can be established. 

To manage private endpoints, in your cluster view in Azure Portal, navigate to Networking section under Security + Networking. Here you will be able to see all existing connections, connection states, and private endpoint details.
You can also approve, reject or remove existing connections. When creating a private connection, you can specify which HDInsight sub-resource (Gateway, Headnode. etc.) you want to connect to as well.

The table below shows the various HDInsight resource actions and the resulting connection states for private endpoints. HDInsight resource can also change the connection state of the private endpoint connection at a later time without consumer intervention. The action will update the state of the endpoint on the consumer side.

| Service Provider Action | Service Consumer Private Endpoint State | Description |
| --------- | --------- | --------- |
| None | Pending | Connection is created manually and is pending approval by the Private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the private link resource owner. |
| Remove | Disconnected | Connection was removed by the private link resource owner; the private endpoint becomes informative and should be deleted for cleanup. |

## Configure DNS to connect over private endpoints

Once you've set up the networking, you can create a cluster with outbound resource provider connection and private link enabled, as shown in the following figure.
To access private clusters, you can use Private Link DNS extensions and Private Endpoints. When the `privateLink` setting is set to enabled, you can create private endpoints and configure DNS resolution through private DNS zones.
The Private Link entries created in the Azure-managed Public DNS Zone `azurehdinsight.net` are as follows:

```dns
<clustername>        CNAME    <clustername>.privatelink
<clustername>-int    CNAME    <clustername>-int.privatelink
<clustername>-ssh    CNAME    <clustername>-ssh.privatelink
```
The following image shows an example of the private DNS entries configured to enable access to a cluster from a virtual network that is not peered or doesn't have a direct line of sight to the cluster. You can use Azure Private Zone to override `*.privatelink.azurehdinsight.net` FQDNs and resolve private endpoints IP addresses in the client’s network.
This is shown only for `<clustername>.azurehdinsight.net` but it extends to other cluster endpoints as well.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of private link architecture":::

## How to Create Clusters?
### Use ARM template properties

The following JSON code snippet includes the two network properties you need to configure in your ARM template to create a private HDInsight cluster.

```json
networkProperties: {
    "resourceProviderConnection": "Inbound" | "Outbound",
    "privateLink": "Enabled"
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