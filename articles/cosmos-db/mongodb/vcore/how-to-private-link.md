---
title: Use Azure Private Link
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use Azure Private Link to connect to Azure Cosmos DB for MongoDB vCore over a private endpoint in a virtual network.
author: khelanmodi
ms.author: khelanmodi
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom: ignite-2023, devx-track-azurecli
ms.topic: how-to
ms.date: 11/01/2023
# CustomerIntent: As a security administrator, I want to use Azure Private Link so that I can ensure that database connections occur over privately-managed virtual network endpoints.
---

# Enable Private access in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure Private Link is a powerful service that allows users to connect to Azure Cosmos DB for MongoDB vCore through a designated private endpoint. This private endpoint consists of private IP addresses located in a subnet within your own virtual network. The endpoint enables you to restrict access to the Azure Cosmos DB for MongoDB vCore product solely over private IPs. The risk of data exfiltration is substantially reduced, by integrating Private Link with stringent NSG policies. For a deeper understanding of private endpoints, consider checking out [What is Azure Private Link?](../../../private-link/private-endpoint-overview.md).

> [!NOTE]
> Private Link secures your connection, however, it doesn't prevent your Azure Cosmos DB endpoints from being resolved by public DNS. The filtration of incoming requests is handled at the application level, not at the transport or network level.

Private Link offers the flexibility to access the Azure Cosmos DB for MongoDB vCore either from within your virtual network or from any connected peered virtual network. Additionally, resources linked to Private Link are accessible on-premises via private peering, through VPN or Azure ExpressRoute.

To establish a connection, Azure Cosmos DB for MongoDB vCore with Private Link supports both automatic and manual approval methods. For more information, see [private endpoints in Azure Cosmos DB](../../how-to-configure-private-endpoints.md).

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).


## Create a cluster with a private endpoint by using the Azure portal

Follow these steps to create a new Azure Cosmos DB for MongoDB vCore cluster with a private endpoint by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), then select **Create a resource** in the upper left-hand corner of the Azure portal. 

1. On the **Create a resource** page, select **Databases** and then select **Azure Cosmos DB**.

1. On the Select API option page, on the **MongoDB** tile, select Create.

1. Choose the **vCore cluster** resource type.

1. On the **Create an Azure Cosmos DB for MongoDB vCore** cluster page, select or create a **Resource group**, enter a **Cluster name** and Location, and enter and confirm the administrator Password.

1. Select Next: **Networking**.

1. Select **Networking** tab, for Connectivity method, select **Private access**.

1. On the Create private endpoint screen, enter or select appropriate values for:

    | Setting | Value |
    | ------- | ----- |
    | Resource group | Select a resource group.|
    | Name | Enter any name for your private endpoint. If this name is taken, create a unique one. |
    | Network Interface name | Enter any name for your Network Interface. If this name is taken, create a unique one. |
    | Location | Select the region where you want to deploy Private Link. Create the private endpoint in the same location where your virtual network exists.|
    | Target subresource | Select the type of subresource for the resource selected previously that your private endpoint should have the ability to access. |
    | Virtual network | Select your virtual network. |
    | Subnet | Select your subnet. |
    | Integrate with private DNS zone | Select **Yes**. To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a private DNS zone. You can also use your own DNS servers or create DNS records by using the host files on your virtual machines. When you select yes for this option, a private DNS zone group is also created. DNS zone group is a link between the private DNS zone and the private endpoint. This link helps you to auto update the private DNS zone when there's an update to the private endpoint. For example, when you add or remove regions, the private DNS zone is automatically updated. |
    | Configuration name |Select your subscription and resource group. The private DNS zone is determined automatically. You can't change it by using the Azure portal.|

1. Select **Ok**. 

1. Select **Next: Tags** > **Review + create**. On the **Review + create** page, then select **Create**.

## Enable private access on an existing cluster

To create a private endpoint to a node in an existing cluster, open the
**Networking** page for the cluster.

1. Select **Add private endpoint**.

   :::image type="content" source="media/howto-private-access/networking.jpg" alt-text="Screenshot of selecting Add private endpoint on the Networking screen.":::

2. On the **Basics** tab of the **Create a private endpoint** screen, confirm the **Subscription**, **Resource group**, and
   **Region**. Enter a **Name** for the endpoint, such as *my-cluster-1*, and a **Network interface name**, such as *my-cluster-1-nic*.

   > [!NOTE]
   >
   > Unless you have a good reason to choose otherwise, we recommend picking a
   > subscription and region that match those of your cluster. The
   > default values for the form fields might not be correct. Check them and
   > update if necessary.

3. Select **Next: Resource**. For **Target sub-resource**, choose the target
   node of the cluster. Usually **coordinator** is the desired node.

4. Select **Next: Virtual Network**. Choose the desired **Virtual network** and
   **Subnet**. Under **Private IP configuration**, select **Statically allocate IP address** or keep the default, **Dynamically allocate IP address**.

5. Select **Next: DNS**.

6. Under **Private DNS integration**, for **Integrate with private DNS zone**, keep the default **Yes** or select **No**.

7. Select **Next: Tags**, and add any desired tags.

8. Select **Review + create**. Review the settings, and select
   **Create** when satisfied.


## Create a private endpoint by using Azure CLI

Run the following Azure CLI script to create a private endpoint named *myPrivateEndpoint* for an existing Azure Cosmos DB account. Replace the variable values with the details for your environment.

```azurecli-interactive
# Resource group where the Azure Cosmos DB account and virtual network resources are located  
ResourceGroupName="myResourceGroup" 

# Name of the existing Azure Cosmos DB account  
MongovCoreClusterName="myMongoCluster" 

# Subscription ID where the Azure Cosmos DB account and virtual network resources are located  
SubscriptionId="<your Azure subscription ID>"  

# API type of your Azure Cosmos DB account: Sql, SqlDedicated, MongoCluster, Cassandra, Gremlin, or Table 
CosmosDbSubResourceType="MongoCluster"  

# Name of the virtual network to create  
VNetName="myVnet"  

# Name of the subnet to create  
SubnetName="mySubnet"  

# Name of the private endpoint to create  
PrivateEndpointName="myPrivateEndpoint"  

# Name of the private endpoint connection to create 
PrivateConnectionName="myConnection" 

az network vnet create \
  --name $VNetName \
  --resource-group $ResourceGroupName \
  --subnet-name $SubnetName 

az network vnet subnet update \
  --name <name> \
  --resource-group $ResourceGroupName \
  --vnet-name $VNetName \
  --disable-private-endpoint-network-policies true 

az network private-endpoint create \
  --name $PrivateEndpointName \
  --resource-group $ResourceGroupName \
  --vnet-name $VNetName \
  --subnet $SubnetName \
  --private-connection-resource-id "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.DocumentDB/mongoClusters/$MongovCoreClusterName" \
  --group-ids MongoCluster --connection-name $PrivateConnectionName 
```

### Integrate the private endpoint with a private DNS zone
After you create the private endpoint, you can integrate it with a private DNS zone by using the following Azure CLI script:

```azurecli-interactive
#Zone name differs based on the API type and group ID you are using. 
zoneName="privatelink.mongocluster.cosmos.azure.com" 

az network private-dns zone create \
  --resource-group $ResourceGroupName \
  --name $zoneName 

az network private-dns link vnet create --resource-group $ResourceGroupName \
  --zone-name $zoneName \
  --name <dns-link-name> \
  --virtual-network $VNetName \
  --registration-enabled false 

#Create a DNS zone group
az network private-endpoint dns-zone-group create \
  --resource-group $ResourceGroupName \
  --endpoint-name <pe-name> \
  --name <zone-group-name> \
  --private-dns-zone $zoneName \
  --zone-name mongocluster 
```

## MongoClusters Commands on Private Link 
```azurecli-interactive
az network private-link-resource list \
  -g <rg-name> \
  -n <resource-name> \
  --type Microsoft.DocumentDB/mongoClusters 
```

## Next step

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for MongoDB vCore](quickstart-portal.md)
