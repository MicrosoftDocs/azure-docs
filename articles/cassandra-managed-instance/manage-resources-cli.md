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

- This article requires version 2.12.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

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

# You can override cluster name of the original name is not legal for an Azure resource:
# overrideClusterName='ClusterNameIllegalForAzureResource'

az cassandra-mi cluster create \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
    --delegatedManagementSubnetId $delegatedManagementSubnetId \
    --cassandraVersion $cassandraVersion \
    --initialCassandraAdminPassword $initialCassandraAdminPassword \
    --externalSeedNodes 10.52.221.2,10.52.221.3,10.52.221.4
    --clientCertificates 'BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----','BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
    --externalGossipCertificates 'BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----','BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
```

### <a id="delete-cluster"></a>Delete a managed instance cluster

Delete a cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster delete \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
```

### <a id="get-cluster-details"></a>Get the cluster details

Get cluster details:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster get \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
```

### <a id="update-cluster"></a>Update an existing managed instance cluster

Update an existing managed Cassandra cluster:

```azurecli-interactive
subscriptionId='MySubscriptionId'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster update \
    --subscriptionId $subscriptionId 
```

### <a id="list-clusters-resource-group"></a>List the clusters by resource group

List clusters by resource group:

```azurecli-interactive
subscriptionId='MySubscriptionId'
resourceGroupName='MyResourceGroup'

az cassandra-mi list-clusters \
    --subscriptionId $subscriptionId \
    --resourceGroupName $resourceGroupName \
```

### <a id="list-clusters-subscription"></a>List clusters by subscription ID

List clusters by subscription ID:

```azurecli-interactive
subscriptionId='MySubscriptionId'

az cassandra-mi list-clusters \
    --subscriptionId $subscriptionId \
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

az cassandra-mi datacenter create \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName \
    --dataCenterLocation $dataCenterLocation \
    --delegatedSubnetId $delegatedSubnetId \
    --nodeCount 9 
```

### <a id="delete-datacenter"></a>Delete a datacenter

Delete a datacenter:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az cassandra-mi datacenter delete \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName 
```

### <a id="get-datacenter-details"></a>Get datacenter details

Get datacenter details:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'

az cassandra-mi datacenter get \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName 
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
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName \
    --nodeCount 13 
```

### <a id="get-datacenters-cluster"></a>Get the datacenters in a cluster

Get datacenters in a cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi list-datacenters \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName
```

## Next steps

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)