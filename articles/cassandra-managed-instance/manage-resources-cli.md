---
title: Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI
description: Learn about the common commands to automate the management of your Azure Managed Instance for Apache Cassandra using Azure CLI.
author: TheovanKraay
ms.service: cassandra-managed-instance
ms.topic: how-to
ms.date: 03/02/2021
ms.author: thvankra

---

# Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI (Preview)

This article describes common commands to automate the management of your Azure Managed Instance for Apache Cassandra clusters using Azure CLI.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires the Azure CLI version 2.12.1 or higher. If you are using Azure Cloud Shell, the latest version is already installed.

> [!IMPORTANT]
> Manage Azure Managed Instance for Apache Cassandra resources cannot be renamed as this violates how Azure Resource Manager works with resource URIs.

## Azure Managed Instance for Apache Cassandra clusters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra clusters, including:

* [Create a managed instance cluster](#create-cluster)
* [Delete a managed instance cluster](#delete-cluster)
* [Get the cluster details](#get-cluster-details)
* [Update an existing managed instance cluster](#update-cluster)
* [List clusters by resource group](#list-clusters-resource-group)
* [List clusters by subscription ID](#list-clusters-subscription)

### <a id="create-cluster"></a>Create a managed instance cluster

Create an Azure Managed Instance for Apache Cassandra cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
location='West US'
delegatedManagementSubnetId = '/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/management'
cassandraVersion='3.11'
initialCassandraAdminPassword='myPassword'

# You can override the cluster name if the original name is not legal for an Azure resource.
# overrideClusterName='ClusterNameIllegalForAzureResource'
# the default Cassandra version is v3.11

az cassandra-mi cluster create \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName \
    --delegated-management-subnet-id $delegatedManagementSubnetId \
    --initial-cassandra-admin-password $initialCassandraAdminPassword \
    --external-seed-nodes 10.52.221.2,10.52.221.3,10.52.221.4
    --client-certificates 'BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----','BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
    --external-gossip-certificates 'BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----','BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
```

### <a id="delete-cluster"></a>Delete a managed instance cluster

Delete a cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster delete \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName \
```

### <a id="get-cluster-details"></a>Get the cluster details

Get cluster details:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster get \
    --cluster-name $clusterName \
    --resource-group $resourceGroupName \
```

### <a id="list-clusters-resource-group"></a>List the clusters by resource group

List clusters by resource group:

```azurecli-interactive
subscriptionId='MySubscriptionId'
resourceGroupName='MyResourceGroup'

az cassandra-mi list-clusters \
    --subscription-id $subscriptionId \
    --resource-group $resourceGroupName \
```

### <a id="list-clusters-subscription"></a>List clusters by subscription ID

List clusters by subscription ID:

```azurecli-interactive
subscriptionId='MySubscriptionId'

az cassandra-mi list-clusters \
    --subscription-id $subscriptionId \
```

## <a id="managed-instance-datacenter"></a>The managed instance datacenters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra datacenters, including:

* [Create a datacenter](#create-datacenter)
* [Delete a datacenter](#delete-datacenter)
* [Get datacenter details](#get-datacenter-details)
* [Update or scale a datacenter](#update-datacenter)
* [Get datacenters in a cluster](#get-datacenters-cluster)

### <a id="create-datacenter"></a>Create a datacenter

Create a datacenter:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='West US'
delegatedSubnetId= '/subscriptions/<Subscription_ID>/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'

# available regions in public preview are: East US, West US, East US 2, West US 2, Central US, 
# South Central US, North Europe, West Europe, South East Asia, Australia East

az cassandra-mi datacenter create \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName \
    --data-center-location $dataCenterLocation \
    --delegated-subnet-id $delegatedSubnetId \
    --node-count 9 
```

### <a id="delete-datacenter"></a>Delete a datacenter

Delete a datacenter:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az cassandra-mi datacenter delete \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName 
```

### <a id="get-datacenter-details"></a>Get datacenter details

Get datacenter details:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az cassandra-mi datacenter get \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName 
```

### <a id="update-datacenter"></a>Update or scale a datacenter

Update or scale a datacenter (to scale change nodeCount value):

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='West US'
delegatedSubnetId= '/subscriptions/<Subscription_ID>/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'

az cassandra-mi datacenter update \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName \
    --data-center-name $dataCenterName \
    --node-count 13 
```

### <a id="get-datacenters-cluster"></a>Get the datacenters in a cluster

Get datacenters in a cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi list-datacenters \
    --resource-group $resourceGroupName \
    --cluster-name $clusterName
```

## Next steps

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)