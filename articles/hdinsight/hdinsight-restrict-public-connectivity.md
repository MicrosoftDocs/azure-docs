---
title: Restrict public connectivity in Azure HDInsight
description: Learn how to remove access to all outbound public IP addresses.
ms.service: hdinsight
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 12/31/2022
---

# Restrict public connectivity in Azure HDInsight

In the [default virtual network architecture](./hdinsight-virtual-network-architecture.md) of Azure HDInsight, the HDInsight resource provider communicates with the cluster over a public network. In this article, you learn about the advanced controls that you can use to create a restricted HDInsight cluster where inbound connectivity is restricted to a private network. 

If you want public connectivity between your HDInsight cluster and dependent resources, consider restricting the connectivity of your cluster by following the guidelines in [Control network traffic in Azure HDInsight](./control-network-traffic.md). In addition to restricting public connectivity, you can configure Azure Private Link-enabled dependency resources to use with HDInsight clusters.

The following diagram shows what a potential HDInsight virtual network architecture might look like when `resourceProviderConnection` is set to *outbound*:

:::image type="content" source="media/hdinsight-private-link/outbound-resource-provider-connection-only.png" alt-text="Diagram of the HDInsight architecture using an outbound resource provider connection.":::

> [!NOTE]
> Restricting public connectivity is a prerequisite for enabling Private Link and shouldn't be considered the same capability.

## Initialize a restricted cluster

By default, the HDInsight resource provider uses an *inbound* connection to the cluster by using public IP addresses. When the `resourceProviderConnection` network property is set to *outbound*, it reverses the connections to the HDInsight resource provider so that the connections are always initiated from inside the cluster and go out to the resource provider. 

In this configuration, without an inbound connection, there's no need to configure inbound service tags in the network security group. There's also no need to bypass the firewall or network virtual appliance via user-defined routes.

> [!NOTE]
> Implementations in Microsoft Azure Government may still require the inbound service tags in the network security group and user defined routes.

After you create your cluster, set up proper DNS resolution by adding DNS records that are needed for your restricted HDInsight cluster. The following canonical name DNS record (CNAME) is created in the Azure-managed public DNS zone: `azurehdinsight.net`.

```dns
<clustername>    CNAME    <clustername>-int
```

To access the cluster by using fully qualified domain names (FQDNs), you can use either of these techniques as appropriate for your needs:

- Use the internal load balancer's private IP addresses directly.
- Use your own private DNS zone to override the cluster endpoints. In this case, the zone name must be `azurehdinsight.net`.

For example, for your private DNS zone `azurehdinsight.net`, you can add your private IP addresses as needed:

```dns
<clustername>        A   10.0.0.1
<clustername-ssh>    A   10.0.0.2
```

> [!NOTE]
> We don't recommend putting restricted clusters in the same virtual network (with a private DNS zone for `azurehdinsight.net`) as other clusters where public connectivity is enabled. It might cause unintended DNS resolution behavior or conflicts.

To make your DNS setup easier, we return the FQDNs and corresponding private IP addresses as part of the cluster `GET` response. You can use this PowerShell snippet to get started:

```powershell
<#
    This script is an example to help you get started with automation and can be adjusted based on your needs.
    This script assumes:
    - The HDInsight cluster has already been created, and the context where this script is run has permissions to read/write resources in the same resource group.
    - The private DNS zone resource exists in the same subscription as the HDInsight cluster.
We recommend that you use the latest version of the Az.HDInsight module.

#>
$subscriptionId = "<Replace with subscription for deploying HDInsight clusters, and containing private DNS zone resource>"

$clusterName = "<Replace with cluster name>"
$clusterResourceGroupName = "<Replace with resource group name>"

# For example, azurehdinsight.net for public cloud.
$dnsZoneName = "<Replace with private DNS zone name>"
$dnsZoneResourceGroupName = "<Replace with private DNS zone resource group name>"

Connect-AzAccount -SubscriptionId $subscriptionId

# 1. Get cluster endpoints
$clusterEndpoints = $(Get-AzHDInsightCluster -ClusterName $clusterName ` -ResourceGroupName $clusterResourceGroupName).ConnectivityEndpoints

$endpointMapping = @{}

foreach($endpoint in $clusterEndpoints)
{
    $label = $endpoint.Location.ToLower().Replace(".$dnsZoneName".ToLower(), "")
    $ip = $endpoint.PrivateIPAddress

    $endpointMapping.Add($label, $ip)
}

# 2. Confirm that the DNS zone exists.
Get-AzPrivateDnsZone -ResourceGroupName $dnsZoneResourceGroupName -Name $dnsZoneName -ErrorAction Stop

# 3. Update DNS entries for the cluster in the private DNS zone:
#    - If the entries already exist, update to the new IP.
#    - If the entries don't exist, create them.
$recordSets = Get-AzPrivateDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $dnsZoneResourceGroupName -RecordType A

foreach($label in $endpointMapping.Keys)
{
    $updateRecord = $null

    foreach($record in $recordSets)
    {
        if($record.Name -eq $label)
        {
            $updateRecord = $record
            break;
        }
        
    }

    if($null -ne $updateRecord)
    {
        $updateRecord.Records[0].Ipv4Address = $endpointMapping[$label]
        Set-AzPrivateDnsRecordSet -RecordSet $updateRecord | Out-Null
    }
    else
    {
        New-AzPrivateDnsRecordSet `
            -ResourceGroupName $dnsZoneResourceGroupName `
            -ZoneName $dnsZoneName `
            -Name $label `
            -RecordType A `
            -Ttl 3600 `
            -PrivateDnsRecord (New-AzPrivateDnsRecordConfig -Ipv4Address $endpointMapping[$label]) | Out-Null
    }
}

```

## Add Private Link connectivity to cluster-dependent resources (optional)

Configuring `resourceProviderConnection` to *outbound* also allows you to access cluster-specific resources by using private endpoints. These resources include:

- Storage: Azure Data Lake Storage Gen2 and Azure Blob Storage
- SQL metastores: Apache Ranger, Ambari, Oozie, and Hive
- Azure Key Vault 

It isn't mandatory to use private endpoints for these resources. But if you plan to use private endpoints for these resources, you must create the resources and configure the private endpoints and DNS entries before you create the HDInsight cluster. All these resources should be accessible from inside the cluster subnet, either through a private endpoint or otherwise. If you're planning to use a private endpoint, it's recommended to leverage the cluster subnet.

When you connect to Azure Data Lake Storage Gen2 over a private endpoint, make sure that the Gen2 storage account has an endpoint set for both `blob` and `dfs`. For more information, see [Create a private endpoint](../private-link/create-private-endpoint-portal.md).

## Use a firewall (optional)
HDInsight clusters can still connect to the public internet to get outbound dependencies. If you want to restrict access, you can [configure a firewall](./hdinsight-restrict-outbound-traffic.md), but it's not a requirement.

## Create clusters

The following JSON code snippet includes the two network properties that you must configure in your Azure Resource Manager template to create a private HDInsight cluster:

```json
networkProperties: {
    "resourceProviderConnection": "Outbound"
}
```

For a complete template with many of the HDInsight enterprise security features, including Private Link, see [HDInsight enterprise security template](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/ESP-HIB-PL-Template).

To create a cluster by using PowerShell, see the [example](/powershell/module/az.hdinsight/new-azhdinsightcluster#example-4--create-an-azure-hdinsight-cluster-with-relay-outbound-and-private-link-feature).

To create a cluster by using the Azure CLI, see the [example](/cli/azure/hdinsight#az-hdinsight-create-examples).

## Next steps

* [Enable Private Link on your cluster](./hdinsight-private-link.md)
* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [General information and guidelines for enterprise security in Azure HDInsight](./domain-joined/general-guidelines.md)
