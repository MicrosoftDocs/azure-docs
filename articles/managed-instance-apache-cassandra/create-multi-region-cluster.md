---
title: Quickstart - Configure a multi-region cluster with Azure Managed Instance for Apache Cassandra
description: This quickstart shows how to configure a multi-region cluster with Azure Managed Instance for Apache Cassandra.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 11/02/2021
ms.custom: ignite-fall-2021, mode-other, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a multi-region cluster with Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. This service helps you accelerate hybrid scenarios and reduce ongoing maintenance.

This quickstart demonstrates how to use the Azure CLI commands to configure a multi-region cluster in Azure.  

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires the Azure CLI version 2.30.0 or higher. If you are using Azure Cloud Shell, the latest version is already installed.

* [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) with connectivity to your self-hosted or on-premise environment. For more information on connecting on premises environments to Azure, see the [Connect an on-premises network to Azure](/azure/architecture/reference-architectures/hybrid-networking/) article.

## <a id="create-account"></a>Setting up the network environment

As all datacenters provisioned with this service must be deployed into dedicated subnets using VNet injection, it is necessary to configure appropriate network peering in advance of deployment to ensure that your multi-region cluster will function properly. We are going to create a cluster with two datacenters in separate regions: East US and East US 2. First, we need to create the Virtual Networks for each region. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Create a resource group named "cassandra-mi-multi-region"

   ```azurecli-interactive
   az group create -l eastus2 -n cassandra-mi-multi-region
   ```

1. Create the first VNet in East US 2 with a dedicated subnet:

   ```azurecli-interactive
   az network vnet create \
     -n vnetEastUs2 \
     -l eastus2 \
     -g cassandra-mi-multi-region \
     --address-prefix 10.0.0.0/16 \
     --subnet-name dedicated-subnet
   ```

1. Now create the second VNet in East US, also with a dedicated subnet:

   ```azurecli-interactive
    az network vnet create \
      -n vnetEastUs \
      -l eastus \
      -g cassandra-mi-multi-region \
      --address-prefix 192.168.0.0/16 \
      --subnet-name dedicated-subnet
   ```

   > [!NOTE]
   > We explicitly add different IP address ranges to ensure no errors when peering. 

1. Now we need to peer the first VNet to the second VNet:

   ```azurecli-interactive
   az network vnet peering create \
     -g cassandra-mi-multi-region \
     -n MyVnet1ToMyVnet2 \
     --vnet-name vnetEastUs2 \
     --remote-vnet vnetEastUs \
     --allow-vnet-access \
     --allow-forwarded-traffic
   ```

1. In order to connect the two VNets, create another peering between the second VNet and the first:

   ```azurecli-interactive
   az network vnet peering create \
     -g cassandra-mi-multi-region \
     -n MyVnet2ToMyVnet1 \
     --vnet-name vnetEastUs \
     --remote-vnet vnetEastUs2 \
     --allow-vnet-access \
     --allow-forwarded-traffic  
   ```

   > [!NOTE]
   > If adding more regions, each VNet will require peering from it to all other VNets, and from all other VNets to it. 

1. Check the output of the previous command, and make sure the value of "peeringState" is now "Connected". You can also check this by running the following command:

   ```azurecli-interactive
   az network vnet peering show \
     --name MyVnet1ToMyVnet2 \
     --resource-group cassandra-mi-multi-region \
     --vnet-name vnetEastUs2 \
     --query peeringState
   ``` 

1. Next, apply some special permissions to both Virtual Networks, which are required by Azure Managed Instance for Apache Cassandra. Run the following and make sure to replace `<SubscriptionID>` with your subscription ID:

   ```azurecli-interactive
   az role assignment create \
     --assignee a232010e-820c-4083-83bb-3ace5fc29d0b \
     --role 4d97b98b-1d4f-4787-a291-c67834d212e7 \
     --scope /subscriptions/<SubscriptionID>/resourceGroups/cassandra-mi-multi-region/providers/Microsoft.Network/virtualNetworks/vnetEastUs2

   az role assignment create     \
     --assignee a232010e-820c-4083-83bb-3ace5fc29d0b \
     --role 4d97b98b-1d4f-4787-a291-c67834d212e7 \
     --scope /subscriptions/<SubscriptionID>/resourceGroups/cassandra-mi-multi-region/providers/Microsoft.Network/virtualNetworks/vnetEastUs
    ```
   > [!NOTE]
   > The `assignee` and `role` values in the previous command are fixed values, enter these values exactly as mentioned in the command. Not doing so will lead to errors when creating the cluster. If you encounter any errors when executing this command, you may not have permissions to run it, please reach out to your admin for permissions.

## <a id="create-account"></a>Create a multi-region cluster

1. Now that we have the appropriate networking in place, we are ready to deploy the cluster resource (replace `<Subscription ID>` with your subscription ID). The can take between 5-10 minutes:

   ```azurecli-interactive
   resourceGroupName='cassandra-mi-multi-region'
   clusterName='test-multi-region'
   location='eastus2'
   delegatedManagementSubnetId='/subscriptions/<SubscriptionID>/resourceGroups/cassandra-mi-multi-region/providers/Microsoft.Network/virtualNetworks/vnetEastUs2/subnets/dedicated-subnet'
   initialCassandraAdminPassword='myPassword'
        
    az managed-cassandra cluster create \
      --cluster-name $clusterName \
      --resource-group $resourceGroupName \
      --location $location \
      --delegated-management-subnet-id $delegatedManagementSubnetId \
      --initial-cassandra-admin-password $initialCassandraAdminPassword \
      --debug
   ```

1. When the cluster resource is created, you are ready to create a data center. First, create a datacenter in East US 2 (replace `<SubscriptionID>` with your subscription ID). This can take up to 10 minutes:

   ```azurecli-interactive
   resourceGroupName='cassandra-mi-multi-region'
   clusterName='test-multi-region'
   dataCenterName='dc-eastus2'
   dataCenterLocation='eastus2'
   delegatedManagementSubnetId='/subscriptions/<SubscriptionID>/resourceGroups/cassandra-mi-multi-region/providers/Microsoft.Network/virtualNetworks/vnetEastUs2/subnets/dedicated-subnet'
        
    az managed-cassandra datacenter create \
       --resource-group $resourceGroupName \
       --cluster-name $clusterName \
       --data-center-name $dataCenterName \
       --data-center-location $dataCenterLocation \
       --delegated-subnet-id $delegatedManagementSubnetId \
       --node-count 3
   ```

1. Next, create a datacenter in East US (replace `<SubscriptionID>` with your subscription ID):

   ```azurecli-interactive
   resourceGroupName='cassandra-mi-multi-region'
   clusterName='test-multi-region'
   dataCenterName='dc-eastus'
   dataCenterLocation='eastus'
   delegatedManagementSubnetId='/subscriptions/<SubscriptionID>/resourceGroups/cassandra-mi-multi-region/providers/Microsoft.Network/virtualNetworks/vnetEastUs/subnets/dedicated-subnet'
   virtualMachineSKU='Standard_D8s_v4'
   noOfDisksPerNode=4
        
    az managed-cassandra datacenter create \
      --resource-group $resourceGroupName \
      --cluster-name $clusterName \
      --data-center-name $dataCenterName \
      --data-center-location $dataCenterLocation \
      --delegated-subnet-id $delegatedManagementSubnetId \
      --node-count 3 
      --sku $virtualMachineSKU \
      --disk-capacity $noOfDisksPerNode \
      --availability-zone false
   ```

   > [!NOTE]
   > The value for `--sku` can be chosen from the following available SKUs:
   >
   > - Standard_E8s_v4
   > - Standard_E16s_v4 
   > - Standard_E20s_v4
   > - Standard_E32s_v4 
   > - Standard_DS13_v2
   > - Standard_DS14_v2
   > - Standard_D8s_v4
   > - Standard_D16s_v4
   > - Standard_D32s_v4 
   > 
   > Note also that `--availability-zone` is set to `false`. To enable availability zones, set this to `true`. Availability zones increase the availability SLA of the service. For more details, review the full SLA details [here](https://azure.microsoft.com/support/legal/sla/managed-instance-apache-cassandra/v1_0/).

   > [!WARNING]
   > Availability zones are not supported in all regions. Deployments will fail if you select a region where Availability zones are not supported. See [here](../availability-zones/az-overview.md#azure-regions-with-availability-zones) for supported regions. The successful deployment of availability zones is also subject to the availability of compute resources in all of the zones in the given region. Deployments may fail if the SKU you have selected, or capacity, is not available across all zones. 

1. Once the second datacenter is created, get the node status to verify that all the Cassandra nodes came up successfully:

    ```azurecli-interactive
    resourceGroupName='cassandra-mi-multi-region'
    clusterName='test-multi-region'
    
    az managed-cassandra cluster node-status \
       --cluster-name $clusterName \
       --resource-group $resourceGroupName
    ```

1. Finally, [connect to your cluster](create-cluster-cli.md#connect-to-your-cluster) using CQLSH, and use the following CQL query to update the replication strategy in each keyspace to include all datacenters across the cluster:

   ```bash
   ALTER KEYSPACE "ks" WITH REPLICATION = {'class': 'NetworkTopologyStrategy', 'dc-eastus2': 3, 'dc-eastus': 3};
   ```
   You also need to update the password tables:

   ```bash
    ALTER KEYSPACE "system_auth" WITH REPLICATION = {'class': 'NetworkTopologyStrategy', 'dc-eastus2': 3, 'dc-eastus': 3}
   ```

## Troubleshooting

If you encounter an error when applying permissions to your Virtual Network using Azure CLI, such as *Cannot find user or service principal in graph database for 'e5007d2c-4b13-4a74-9b6a-605d99f03501'*, you can apply the same permission manually from the Azure portal. Learn how to do this [here](add-service-principal.md).

> [!NOTE] 
> The Azure Cosmos DB role assignment is used for deployment purposes only. Azure Managed Instanced for Apache Cassandra has no backend dependencies on Azure Cosmos DB.  

## Clean up resources

If you're not going to continue to use this managed instance cluster, delete it with the following steps:

1. From the left-hand menu of Azure portal, select **Resource groups**.
1. From the list, select the resource group you created for this quickstart.
1. On the resource group **Overview** pane, select **Delete resource group**.
1. In the next window, enter the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to create a multi-region cluster using Azure CLI and Azure Managed Instance for Apache Cassandra. You can now start working with the cluster.

> [!div class="nextstepaction"]
> [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
