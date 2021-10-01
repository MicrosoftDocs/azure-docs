---
title: Restrict Public Connectivity in Azure HDInsight (preview)
description: Learn to remove access to all outbound public IP addresses
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/20/2021
---

# Restrict Public Connectivity in Azure HDInsight (preview)

In Azure HDInsight's [default virtual network architecture](./hdinsight-virtual-network-architecture.md), the HDInsight resource provider (RP) communicates with the cluster using public IP addresses over public network. In this article, you learn about the advanced controls you can use to create a restricted HDInsight cluster where inbound connectivity is restricted to the private network. In certain scenarios, you may opt to have public connectivity to/within your HDInsight cluster(s) and dependent resources, consider restricting connectivity of your cluster by following guidelines from [control network traffic in Azure HDInsight](./control-network-traffic.md). Private inbound clusters also have support for private link enabled dependency resources that can be configured to use with these clusters.
The following diagram shows what a potential HDInsight virtual network architecture could look like when `resourceProviderConnection` is set to *outbound*:

:::image type="content" source="media/hdinsight-private-link/outbound-resource-provider-connection-only.png" alt-text="Diagram of HDInsight architecture using an outbound resource provider connection":::

> [!NOTE] Restricting public connectivity is a prerequisite for enabling Private Link and should not be considered as the same capability.

## Initialize a Restricted Cluster

By default, the HDInsight RP uses an *inbound* connection to the cluster using public IPs. When the `resourceProviderConnection` network property is set to *outbound* (this is the only configuration you need to change to create a cluster with inbound public connectivity disabled), it reverses the connections to the HDInsight RP so that the connections are always initiated from inside the cluster out to the RP. In this configuration, without an inbound connection, there is no need to configure inbound service tags in the NSG or bypass firewall/network virtual appliance via UDR rules.
After creating your cluster, you should set up proper DNS resolution by adding DNS records that are needed for configuring access to your private inbound HDInsight cluster. The following canonical name DNS record (CNAME) is created on the Azure-managed Public DNS Zone: `azurehdinsight.net`

```dns
<clustername>    CNAME    <clustername>-int
```

To access the cluster using cluster FQDNs, you can either use the internal load balancer private IPs directly or use your own Private DNS Zone (in which case, the zone name must be `azurehdinsight.net`) to override the cluster endpoints as appropriate for your needs. For example, for you Private DNS Zone, `azurehdinsight.net`. you can add your private IPs as needed:

```dns
<clustername>        A   10.0.0.1
<clustername-ssh>    A   10.0.0.2
```

> [!NOTE] Creating both public and private inbound clusters under a VNet configured with a private DNS zone for `azurehdinsight.net` is discouraged as it may cause unintended DNS resolution behavior/conflict.

To make setting us DNS easier, we return the FQDNS and corresponding Private IP addresses as part of the cluster `GET` response. You can use this PowerShell snippet to get started.

```powershell
<#
    This script is offered as an example to help get started with automation and can be adjusted based on your needs.
    This script assumes your HDInsight cluster has already been created and the context where this script is run has permissions to read/write resources in the same resource group.
#>
$subscriptionId = "<Replace with subscription ID>"
$resourceGroupName = "<Replace with resource group name>"
$clusterName = "<Replace with cluster name>"

Select-AzSubscription -Subscription $subscriptionId

# 1. Get cluster object

$clusterObj = Get-AzHDInsightCluster `
                -ClusterName $clusterName `
                -ResourceGroupName $resourceGroupName

# 2. Find private IP of SSH and HTTPS endpoints

$clusterConnectivityEndpoints = $clusterObj.ConnectivityEndpoints

$httpsEndpointIp = ""
$sshEndpointIp = ""

foreach($endpoint in $clusterConnectivityEndpoints)
{
    if($endpoint.Name -eq "SSH")
    {
        $sshEndpointIp = $endpoint.PrivateIPAddress
    }
    elseif($endpoint.Name -eq "HTTPS")
    {
        $httpsEndpointIp = $endpoint.PrivateIPAddress
    }
}


# 3. Create private DNS zone and populate DNS entries

$isolationDns = New-AzPrivateDnsZone `
                    -ResourceGroupName $resourceGroupName `
                    -Name "azurehdinsight.net"


$httpsPrivateDnsConfig = New-AzPrivateDnsRecordSet `
                            -ResourceGroupName $resourceGroupName `
                            -ZoneName $isolationDns.Name `
                            -Name $clusterName `
                            -RecordType A `
                            -Ttl 3600 `
                            -PrivateDnsRecord (New-AzPrivateDnsRecordConfig -Ipv4Address $httpsEndpointIp)

$sshPrivateDnsConfig = New-AzPrivateDnsRecordSet `
                        -ResourceGroupName $resourceGroupName `
                        -ZoneName $isolationDns.Name `
                        -Name "$clusterName-ssh" `
                        -RecordType A `
                        -Ttl 3600 `
                        -PrivateDnsRecord (New-AzPrivateDnsRecordConfig -Ipv4Address $sshEndpointIp)


# 4. Link the private DNS zone with cluster VNET

$isolationDnsVnetLink = New-AzPrivateDnsVirtualNetworkLink `
                            -ResourceGroupName $resourceGroupName `
                            -ZoneName $isolationDns.Name `
                            -Name "$clusterName-vnet-link" `
                            -VirtualNetworkId $clusterObj.VirtualNetworkId
```

## Adding private link connectivity (Private Endpoints) to cluster dependent resources (optional)

Configuring `resourceProviderConnection` to *outbound* also allows you to access cluster-specific resources, such as Storage (Azure Data Lake Storage Gen2 and Windows Azure Storage Blob), SQL meta stores (Apache Ranger, Ambari, Oozie and Hive), and Azure Key Vault using private endpoints. It is not mandatory to use private endpoints for these resources, but if you plan to use private endpoints for these resources, you must create these resources, configure the private endpoints and DNS entries before you create the HDInsight cluster. All these resources should be accessible from inside the cluster subnet, either through a private endpoint or otherwise.
When connecting to Azure Data Lake Storage Gen2 over Private Endpoint, make sure the Gen2 storage account has an endpoint set for both ‘blob’ and ‘dfs’. For more information please see [creating a Private Endpoint](../private-link/create-private-endpoint-portal).

## Using Firewall (optional)
HDInsight clusters are still able to connect to the public internet to get outbound dependencies. If you want to restrict even further, you can [configure a firewall](./hdinsight-restrict-outbound-traffic.md), but it's not a requirement.

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

* [Enable Private Link on your cluster](./hdinsight-private-link.md)
* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)
