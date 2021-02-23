---
title: Quickstart - Create Azure Managed Instance for Apache Cassandra cluster from the Azure portal
description: This quickstart shows how to create an Azure Managed Instance for Apache Cassandra cluster using the Azure portal.
author: TheovanKraay
ms.author: thvankra
ms.service: cassandra-managed-instance
ms.topic: quickstart
ms.date: 03/02/2021
---
# Quickstart: Configure a hybrid cluster with Azure Managed Instance for Apache Cassandra (Preview)
 
Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters, accelerating hybrid scenarios and reducing ongoing maintenance.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This quickstart demonstrates how to use the Azure CLI commands to configure a hybrid cluster, where you have existing datacenters in an on premises or self-hosted environment, and want to use Azure Managed Instance for Apache Cassandra to deploy additional cloud datacenters into that cluster.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.12.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- We assume you have an Azure [VNet](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) with connectivity to your self-hosted or on premises environment. For more information on connecting on premises environments to Azure, consult our article on how to [Connect an on-premises network to Azure](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/).

## <a id="create-account"></a>Confure a hybrid cluster

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your VNet resource. 

1. Click on the subnets tab, and create a new subnet:

   :::image type="content" source="./media/configure-hybrid-cluster/subnet.png" alt-text="Configure a new subnet" lightbox="./media/configure-hybrid-cluster/subnet.png" border="true":::

1. Go back to the subnets tab, then in the address bar after "subnets", type the name of your new dedicated subnet, followed by "overview", e.g. /subnets/cassandra-managed-instance/overview:

   :::image type="content" source="./media/configure-hybrid-cluster/subnet-overview.png" alt-text="Get overview" lightbox="./media/configure-hybrid-cluster/subnet.png" border="true":::

1. Navigate to that page, and copy the Resource ID for later:

   :::image type="content" source="./media/configure-hybrid-cluster/resource-id.png" alt-text="Copy resource id" lightbox="./media/configure-hybrid-cluster/resource-id.png" border="true":::

1. Now we are going to configure resources for our hybrid cluster, using Azure CLI. Since you already have a cluster, the cluster name here will only be a bookmarking (logical) resource, so that we can identify the name of the existing cluster. Hence, you should use the name of your existing cluster when defining `clusterName` and `clusterNameOverride` below. You will also need to provide the seed nodes, public client certificates, and gossip certificates in your existing cluster, in the fields provided below. You will also need to use the resource id you copied above for `delegatedManagementSubnetId`.
    
    ```azurecli-interactive
    resourceGroupName='MyResourceGroup'
    clusterName='cassandra-hybrid-cluster-legal-name'
    clusterNameOverride='cassandra-hybrid-cluster-illegal-name'
    location='West US'
    delegatedManagementSubnetId = '/subscriptions/<Subscription_ID>/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/management'
    cassandraVersion='3.11'
    initialCassandraAdminPassword='myPassword'
    
    # You can override cluster name of the original name is not legal for an Azure resource:
    # overrideClusterName='ClusterNameIllegalForAzureResource'
    # the default cassandra version will be v3.11
    
    az cassandra-mi cluster create \
        --cluster-name $clusterName \
        --resource-group $resourceGroupName \
        --delegated-management-subnet-id $delegatedManagementSubnetId \
        --initial-cassandra-admin-password $initialCassandraAdminPassword \
        --external-seed-nodes 10.52.221.2,10.52.221.3,10.52.221.4
        --client-certificates 'BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----','BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
        --external-gossip-certificates 'BEGIN CERTIFICATE-----\n...Base64 encoded certificate 1...\n-----END CERTIFICATE-----','BEGIN CERTIFICATE-----\n...Base64 encoded certificate 2...\n-----END CERTIFICATE-----' \
    ```

1. Once the cluster resource has been created, run the following command to get the cluster setup details. 

    ```azurecli-interactive
    resourceGroupName='MyResourceGroup'
    clusterName='cassandra-hybrid-cluster'
    
    az cassandra-mi cluster get \
        --cluster-name $clusterName \
        --resource-group $resourceGroupName \
    ```

1. The above command will return information about the Azure Managed Instance for Apache Cassandra environment. You will need the public certificates and gossip certificate, as these are the corresponding artefacts that will be used in the managed instance datacenters you will create:

   :::image type="content" source="./media/configure-hybrid-cluster/get-cluster.png" alt-text="Copy resource id" lightbox="./media/configure-hybrid-cluster/get-cluster.png" border="true":::

1. Next, you can create a new datacenter in the hybrid cluster, ensuring that you specify the appropriate details:

    ```azurecli-interactive
    resourceGroupName='MyResourceGroup'
    clusterName='cassandra-hybrid-cluster'
    dataCenterName='dc1'
    dataCenterLocation='West US'
    delegatedSubnetId= '/subscriptions/<Subscription_ID>/resourceGroups/customer-vnet-rg/providers/Microsoft.Network/virtualNetworks/customer-vnet/subnets/dc1-subnet'
    
    # available regions in public preview are: East Us, West Us, East US 2, West US 2, Central US, 
    # South Central US, North Europe, West Europe, South East Asia, Australia East
    
    az cassandra-mi datacenter create \
        --resource-group $resourceGroupName \
        --cluster-name $clusterName \
        --data-center-name $dataCenterName \
        --data-center-location $dataCenterLocation \
        --delegated-subnet-id $delegatedSubnetId \
        --node-count 9 
    ```

1. Now that the new datacenter has been created, run the get datacenter command in CLI:

    ```azurecli-interactive
    resourceGroupName='MyResourceGroup'
    clusterName='cassandra-hybrid-cluster'
    dataCenterName='dc1'
    
    az cassandra-mi datacenter get \
        --resource-group $resourceGroupName \
        --cluster-name $clusterName \
        --data-center-name $dataCenterName 
    ```

1. The above command will bring back the new datacenter's seed nodes, which you will need to add to your existing datacenter's cassandra.yaml (along with the public certificates, and gossip certificates, that you collected earlier):


   :::image type="content" source="./media/configure-hybrid-cluster/get-datacenter.png" alt-text="Copy resource id" lightbox="./media/configure-hybrid-cluster/get-datacenter.png" border="true":::

1. Finally, you will need to update the replication strategy to include both datacenters across the cluster:

    ```SQL
    ALTER KEYSPACE "ks" WITH REPLICATION = {'class': 'NetworkTopologyStrategy', ‘on-premise-dc': 3, ‘managed-instance-dc': 3};
    ```


* [Overview of Azure Managed Instance for Apache Cassandra](introduction.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)