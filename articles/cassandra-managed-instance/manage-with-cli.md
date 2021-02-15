---
title: Manage Azure Managed Instance for Apache Cassandra using Azure CLI
description: Manage Azure Managed Instance for Apache Cassandra using Azure CLI. 
author: TheovanKraay
ms.service: cassandra-managed-instance
ms.topic: how-to
ms.date: 02/02/2021
ms.author: thvankra

---
# Manage Azure Managed Instance for Apache Cassandra using Azure CLI

The following guide describes common commands to automate management of your Azure Managed Instance for Apache Cassandra clusters using Azure CLI. 

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.12.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

> [!IMPORTANT]
> Manage Azure Managed Instance for Apache Cassandra resources cannot be renamed as this violates how Azure Resource Manager works with resource URIs.

## Azure Managed Instance for Apache Cassandra clusters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra clusters, including:

* [Create a managed Cassandra cluster](#create-a-managed-cassandra-cluster)
* [Delete a managed Cassandra cluster](#delete-a-managed-cassandra-cluster)
* [Get cluster details](#get-cluster-details)
* [Update an existing managed Cassandra cluster](#update-an-existing-managed-cassandra-cluster)
* [List clusters by resource group](#list-clusters-by-resource-group)
* [List clusters by subscription id](#list-clusters-by-subscription-id)


### Create a managed Cassandra cluster

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

### Delete a managed Cassandra cluster

Delete a cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster delete \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
```

### Get cluster details

Get cluster details:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster get \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
```

### Update an existing managed Cassandra cluster

Update an existing managed Cassandra cluster:

```azurecli-interactive
subscriptionId='MySubscriptionId'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi cluster update \
    --subscriptionId $subscriptionId 
```

### List clusters by resource group

List clusters by resource group:

```azurecli-interactive
subscriptionId='MySubscriptionId'
resourceGroupName='MyResourceGroup'

az cassandra-mi list-clusters \
    --subscriptionId $subscriptionId \
    --resourceGroupName $resourceGroupName \
```

### List clusters by subscription id

List clusters by subscription id:

```azurecli-interactive
subscriptionId='MySubscriptionId'

az cassandra-mi list-clusters \
    --subscriptionId $subscriptionId \
```


## Azure Managed Instance for Apache Cassandra datacenters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra datacenters, including:

* [Create a datacenter](#create-a-datacenter)
* [Delete a datacenter](#delete-a-datacenter)
* [Get datacenter details](#get-datacenter-details)
* [Update or scale a datacenter](#update-or-scale-a-datacenter)
* [Get datacenters in a cluster](#get-datacenters-in-a-cluster)


### Create a datacenter

Create a datacenter:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='West US'
delegatedSubnetId= '/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'

az cassandra-mi datacenter create \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName \
    --dataCenterLocation $dataCenterLocation \
    --delegatedSubnetId $delegatedSubnetId \
    --nodeCount 9 
```

### Delete a datacenter

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

### Get datacenter details

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

### Update or scale a datacenter

Update or scale a datacenter (to scale change nodeCount value):

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='West US'
delegatedSubnetId= '/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'

az cassandra-mi datacenter update \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName \
    --nodeCount 13 
```

### Get datacenters in a cluster

Get datacenters in a cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi list-datacenters \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName
```

## Next steps

For more information on the Azure CLI, see:

* [Install Azure CLI](/cli/azure/install-azure-cli)