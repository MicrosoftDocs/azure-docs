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

## Azure Managed Instance for Apache Cassandra hybrid clusters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra hybrid clusters, including:

* [Create a hybrid cluster](#create-a-hybrid-cluster)
* [Delete a hybrid cluster](#delete-a-hybrid-cluster)
* [Get hybrid cluster details](#get-hybrid-cluster-details)
* [List hybrid clusters by resource group](#list-hybrid-clusters-by-resource-group)
* [List hybrid clusters by subscription id](#list-hybrid-clusters-by-subscription-id)
* [Patch hybrid cluster](#list-hybrid-clusters-by-subscription-id)

### Create a hybrid cluster

Create an Azure Managed Instance for Apache Cassandra cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
location='West US'
delegatedManagementSubnetId='/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/management'
cassandraVersion='3.11'
initialCassandraAdminPassword='myPassword'
overrideClusterName='ClusterNameIllegalForAzureResource'

az cassandra-mi create-cluster \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
    --delegatedManagementSubnetId $delegatedManagementSubnetId \
    --cassandraVersion $cassandraVersion \
    --initialCassandraAdminPassword $initialCassandraAdminPassword
    --overrideClusterName $overrideClusterName
    --externalSeedNodes ipAddress='10.52.221.2' \
    --externalSeedNodes ipAddress='10.52.221.3' \
    --externalSeedNodes ipAddress='10.52.221.4' \
    --clientCertificates pem='BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----' \
    --clientCertificates pem='BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
    --externalGossipCertificates pem='BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----' \
    --externalGossipCertificates pem='BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' 
```

### Delete a hybrid cluster

Delete a hybrid cluster:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi delete-cluster \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
```

### Get hybrid cluster details

Get hybrid cluster details:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi get-cluster \
    --clusterName $clusterName \
    --resourceGroupName $resourceGroupName \
```

### List hybrid clusters by resource group

List hybrid clusters by resource group:

```azurecli-interactive
resourceGroupName='MyResourceGroup'

az cassandra-mi list-cluster-by-resource\
    --resourceGroupName $resourceGroupName \
```

### List hybrid clusters by subscription id

List hybrid clusters by subscription id:

```azurecli-interactive
subscriptionId='MySubscriptionId'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi list-cluster-by-subscription \
    --subscriptionId $subscriptionId \
```

### Patch hybrid cluster

Patch hybrid cluster:

```azurecli-interactive
subscriptionId='MySubscriptionId'
clusterName='cassandra-hybrid-cluster'

az cassandra-mi patch cluster \
    --subscriptionId $subscriptionId 
```


## Azure Managed Instance for Apache Cassandra datacenters

The following sections demonstrate how to manage Azure Managed Instance for Apache Cassandra datacenters, including:

* [Create a datacenter](#create-a-datacenter)
* [Delete a datacenter](#delete-a-datacenter)
* [Get datacenter details](#get-datacenter-details)
* [Get datacenters in a cluster](#get-datacenters-in-a-cluster)
* [Scale a datacenter](#scale-a-datacenter)

### Create a datacenter

Create a datacenter:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='West US'
delegatedSubnetId= '/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'

az cassandra-mi create-datacenter \
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

az cassandra-mi delete-datacenter \
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

az cassandra-mi get-datacenter \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName 
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

### Scale a datacenter

Scale a datacenter:

```azurecli-interactive
resourceGroupName='MyResourceGroup'
clusterName='cassandra-hybrid-cluster'
dataCenterName='dc1'
dataCenterLocation='West US'
delegatedSubnetId= '/subscriptions/536e130b-d7d6-4ac7-98a5-de20d69588d2/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'

az cassandra-mi scale-datacenter \
    --resourceGroupName $resourceGroupName \
    --clusterName $clusterName \
    --dataCenterName $dataCenterName \
    --dataCenterLocation $dataCenterLocation \
    --delegatedSubnetId $delegatedSubnetId \
    --nodeCount 9 
```

## Next steps

For more information on the Azure CLI, see:

* [Install Azure CLI](/cli/azure/install-azure-cli)