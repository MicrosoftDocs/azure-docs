---
title: Manage resources with the Azure CLI - Azure Resource Manager
description: Learn about the common commands to automate the management of Azure Managed Instance for Apache Cassandra by using the Azure CLI.
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 11/02/2021
ms.author: thvankra
ms.custom: devx-track-azurecli, seo-azure-cli, devx-track-arm-template
keywords: azure resource manager cli
---

# Manage Azure Managed Instance for Apache Cassandra resources by using the Azure CLI

This article describes common commands to automate the management of your Azure Managed Instance for Apache Cassandra clusters and datacenters by using the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

This article requires Azure CLI version 2.30.0 or later. If you're using Azure Cloud Shell, the latest version is already installed.

> [!IMPORTANT]
> You can't rename Manage Azure Managed Instance for Apache Cassandra resources. Renaming these resources violates how Azure Resource Manager works with resource URIs.

## Manage clusters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra clusters:

* [Create a cluster](#create-cluster)
* [Delete a cluster](#delete-cluster)
* [Get cluster details](#get-cluster-details)
* [Get the cluster node status](#get-cluster-status)
* [List clusters by resource group](#list-clusters-resource-group)
* [List clusters by subscription ID](#list-clusters-subscription)

### <a id="create-cluster"></a>Create a cluster

Create an Azure Managed Instance for Apache Cassandra cluster by using the [az managed-cassandra cluster create](/cli/azure/managed-cassandra/cluster#az-managed-cassandra-cluster-create) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
location='West US'
delegatedManagementSubnetId='/subscriptions/<subscription id>/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/management'
initialCassandraAdminPassword='myPassword'

# You can override the cluster name if the original name is not legal for an Azure resource:
# overrideClusterName='ClusterNameIllegalForAzureResource'
# The default Cassandra version is v3.11

az managed-cassandra cluster create \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName \
    --location $location \
    --delegated-management-subnet-id $delegatedManagementSubnetId \
    --initial-cassandra-admin-password $initialCassandraAdminPassword \
```

### <a id="delete-cluster"></a>Delete a cluster

Delete a cluster by using the [az managed-cassandra cluster delete](/cli/azure/managed-cassandra/cluster#az-managed-cassandra-cluster-delete) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az managed-cassandra cluster delete \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName
```

### <a id="get-cluster-details"></a>Get cluster details

Get cluster details by using the [az managed-cassandra cluster show](/cli/azure/managed-cassandra/cluster#az-managed-cassandra-cluster-show) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az managed-cassandra cluster show \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName
```

### <a id="get-cluster-status"></a>Get the cluster node status

Get the status of cluster nodes by using the [az managed-cassandra cluster node-status](/cli/azure/managed-cassandra/cluster#az-managed-cassandra-cluster-node-status) command:

```azurecli-interactive
clusterName='cassandra-hybrid-cluster'
resourceGroupName='MyResourceGroup'

az managed-cassandra cluster status \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName
```

### <a id="list-clusters-resource-group"></a>List clusters by resource group

List clusters by resource group by using the [az managed-cassandra cluster list](/cli/azure/managed-cassandra/cluster#az-managed-cassandra-cluster-list) command:

```azurecli-interactive
subscriptionId='MySubscriptionId'
resourceGroupName='MyResourceGroup'

az managed-cassandra cluster list\
    --resource-group $resourceGroupName
```

### <a id="list-clusters-subscription"></a>List clusters by subscription ID

List clusters by subscription ID by using the [az managed-cassandra cluster list](/cli/azure/managed-cassandra) command:

```azurecli-interactive
# Set your subscription ID
az account set -s <subscriptionID>

az managed-cassandra cluster list
```

## <a id="managed-instance-datacenter"></a>Manage datacenters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra datacenters:

* [Create a datacenter](#create-datacenter)
* [Delete a datacenter](#delete-datacenter)
* [Get datacenter details](#get-datacenter-details)
* [Get datacenters in a cluster](#get-datacenters-cluster)
* [Update or scale a datacenter](#update-datacenter)
* [Get the Cassandra configuration](#get-yaml)
* [Update the Cassandra configuration](#update-yaml)

### <a id="create-datacenter"></a>Create a datacenter

Create a datacenter by using the [az managed-cassandra datacenter create](/cli/azure/managed-cassandra/datacenter#az-managed-cassandra-datacenter-create) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='eastus2'
delegatedSubnetId='/subscriptions/<SubscriptionID>/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'
virtualMachineSKU='Standard_D8s_v4'
noOfDisksPerNode=4

az managed-cassandra datacenter create \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName \
    --data-center-location $dataCenterLocation \
    --delegated-subnet-id $delegatedSubnetId \
    --node-count 3 
    --sku $virtualMachineSKU \
    --disk-capacity $noOfDisksPerNode \
    --availability-zone false
```

Choose the value for `--sku` from the following available virtual machine (VM) options:

* Standard_E8s_v4
* Standard_E16s_v4
* Standard_E20s_v4
* Standard_E32s_v4
* Standard_DS13_v2
* Standard_DS14_v2
* Standard_D8s_v4
* Standard_D16s_v4
* Standard_D32s_v4
* Standard_L8s_v3
* Standard_L16s_v3
* Standard_L32s_v3
* Standard_L8as_v3
* Standard_L16as_v3
* Standard_L32as_v3

Currently, Azure Managed Instance for Apache Cassandra doesn't support transitioning across VM families. For instance, if you currently have a Standard_DS13_v2 VM and are interested in upgrading to a larger VM such as Standard_DS14_v2, this option isn't available. However, you can open a support ticket to request the upgrade.

In the preceding command, `--availability-zone` is set to `false`. To enable availability zones, set this value to `true`. Availability zones increase the service-level agreement (SLA) for availability of the service. For more information, review the [full SLA details](https://azure.microsoft.com/support/legal/sla/managed-instance-apache-cassandra/v1_0/).

> [!WARNING]
> Azure Managed Instance for Apache Cassandra doesn't support availability zones in all regions. If you select a region where availability zones aren't supported, deployments will fail. See the [list of supported regions](../availability-zones/az-overview.md#azure-regions-with-availability-zones).
>
> The successful deployment of availability zones is also subject to the availability of compute resources in all of the zones in a region. Deployments might fail if the VM or the capacity that you selected isn't available across all zones.

### <a id="delete-datacenter"></a>Delete a datacenter

Delete a datacenter by using the [az managed-cassandra datacenter delete](/cli/azure/managed-cassandra/datacenter#az-managed-cassandra-datacenter-delete) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az managed-cassandra datacenter delete \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName 
```

> [!WARNING]
> If you have more than one datacenter in your cluster, you must remove any references to the datacenter that you're trying to delete in any [keyspace replication strategy settings](https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/operations/opsChangeKSStrategy.html) first. This command will fail if any keyspaces within your cluster still have references to the datacenter.

### <a id="get-datacenter-details"></a>Get datacenter details

Get datacenter details by using the [az managed-cassandra datacenter show](/cli/azure/managed-cassandra/datacenter#az-managed-cassandra-datacenter-show) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az managed-cassandra datacenter show \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName 
```

### <a id="update-datacenter"></a>Update or scale a datacenter

Update or scale a datacenter by using the [az managed-cassandra datacenter update](/cli/azure/managed-cassandra/datacenter#az-managed-cassandra-datacenter-update) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az managed-cassandra datacenter update \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName \
    --node-count 13 
```

To scale a datacenter, change the `--node-count` value.

### <a id="get-yaml"></a>Get the Cassandra configuration

Get the current YAML configuration of a node by using the [az managed-cassandra cluster invoke-command](/cli/azure/managed-cassandra/cluster#az-managed-cassandra-invoke-command) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
commandName='get-cassandra-yaml'
 
az managed-cassandra cluster invoke-command \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --host <ip address> \
    --command-name 'get-cassandra-yaml'
```

You can make the output more readable by using the following commands:

```azurecli-interactive
$output = az managed-cassandra cluster invoke-command \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --host <ip address> \
    --command-name 'get-cassandra-yaml' \
    | ConvertFrom-Json
$output.commandOutput
```

### <a id="update-yaml"></a>Update the Cassandra configuration

Change the Cassandra configuration on a datacenter by using the [az managed-cassandra datacenter update](/cli/azure/managed-cassandra/datacenter#az-managed-cassandra-datacenter-update) command. You need to Base64 encode the YAML fragment by using an [online tool](https://www.base64encode.org/).

For example, consider the following YAML fragment:

```yaml
column_index_size_in_kb: 16
read_request_timeout_in_ms: 10000
```

When it's encoded, the YAML is converted to:
`Y29sdW1uX2luZGV4X3NpemVfaW5fa2I6IDE2CnJlYWRfcmVxdWVzdF90aW1lb3V0X2luX21zOiAxMDAwMA==`.

Here's the `az managed-cassandra datacenter update` command with the encoded YAML fragment:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='eastus'
yamlFragment='Y29sdW1uX2luZGV4X3NpemVfaW5fa2I6IDE2CnJlYWRfcmVxdWVzdF90aW1lb3V0X2luX21zOiAxMDAwMA=='

az managed-cassandra datacenter update \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName \
    --base64-encoded-cassandra-yaml-fragment $yamlFragment
```

> [!IMPORTANT]
> Ensure that the Cassandra YAML settings that you provide are appropriate for your version of Cassandra. See the [Cassandra v3.11 settings](https://github.com/apache/cassandra/blob/cassandra-3.11/conf/cassandra.yaml) and the [Cassandra v4.0 settings](https://github.com/apache/cassandra/blob/cassandra-4.0/conf/cassandra.yaml). You're *not* allowed to update the following YAML settings:
>
> * `cluster_name`
> * `seed_provider`
> * `initial_token`
> * `autobootstrap`
> * `client_encryption_options`
> * `server_encryption_options`
> * `transparent_data_encryption_options`
> * `audit_logging_options`
> * `authenticator`
> * `authorizer`
> * `role_manager`
> * `storage_port`
> * `ssl_storage_port`
> * `native_transport_port`
> * `native_transport_port_ssl`
> * `listen_address`
> * `listen_interface`
> * `broadcast_address`
> * `hints_directory`
> * `data_file_directories`
> * `commitlog_directory`
> * `cdc_raw_directory`
> * `saved_caches_directory`
> * `endpoint_snitch`
> * `partitioner`
> * `rpc_address`
> * `rpc_interface`

### <a id="get-datacenters-cluster"></a>Get the datacenters in a cluster

Get datacenters in a cluster by using the [az managed-cassandra datacenter list](/cli/azure/managed-cassandra/datacenter#az-managed-cassandra-datacenter-list) command:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az managed-cassandra datacenter list \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName
```

## Next steps

* [Create an Azure Managed Instance for Apache Cassandra cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a managed Apache Spark cluster with Azure Databricks](deploy-cluster-databricks.md)
