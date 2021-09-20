---
title: Create a Private Inbound Cluster in Azure HDInsight (preview)
description: Learn to remove access to all outbound public IP addresses
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/20/2021
---

# Create a Private Inbound Cluster in Azure HDInsight (preview)

In Azure HDInsight's [default virtual network architecture](./hdinsight-virtual-network-architecture.md), the HDInsight resource provider (RP) communicates with the cluster using public IP addresses. Some scenarios require complete network isolation with no use of public IP addresses. In this article, you learn about the advanced controls you can use to create a private HDInsight cluster. For information on how to restrict traffic to and from your cluster without complete network isolation, see [Control network traffic in Azure HDInsight](./control-network-traffic.md).

You can create private HDInsight clusters by configuring specific network properties in an Azure Resource Manager (ARM) template. Begin by removing access to all public IP addresses by setting `resourceProviderConnection` to outbound. Optionally, you can also enable [Azure Private Link](./hdinsight-private-link.md) and use [Private Endpoints](../private-link/private-endpoint-overview.md) by setting `privateLink` to enabled.

>[!NOTE]
>Removing outbound public IP addresses is a prerequisite for enabling Azure Private Link

## Initialize a Private Inbound Cluster

By default, the HDInsight RP uses an *inbound* connection to the cluster using public IPs. When the `resourceProviderConnection` network property is set to *outbound* (this is the only configuration you need to change to create a private inbound cluster), it reverses the connections to the HDInsight RP so that the connections are always initiated from inside the cluster out to the RP. Without an inbound connection, there is no need for the inbound service tags or public IP addresses.

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

## Using Firewall (optional)

The basic load balancers used in the default virtual network architecture automatically provide public NAT (network address translation) to access the required outbound dependencies, such as the HDInsight RP. If you want to restrict outbound connectivity to the public internet, you can [configure a firewall](./hdinsight-restrict-outbound-traffic.md), but it's not a requirement.

## Leveraging Private Endpoints (optional)
Configuring `resourceProviderConnection` to outbound also allows you to access cluster-specific resources, such as Azure Data Lake Storage Gen2 or external metastores, using private endpoints. Using private endpoints for these resources is not mandatory, but if you plan to have private endpoints for these resources, you must configure the private endpoints and DNS entries `before` you create the HDInsight cluster. We recommend you create and provide all of the external SQL databases you need, such as Apache Ranger, Ambari, Oozie and Hive metastores, at cluster creation time. The requirement is that all of these resources must be accessible from inside the cluster subnet, either through their own private endpoint or otherwise.

When connecting to Azure Data Lake Storage Gen2 over Private Endpoint, make sure the Gen2 storage account has an endpoint set for both ‘blob’ and ‘dfs’. For more information please see [Creating a Private Endpoint](../storage/common/storage-private-endpoints.md).

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
