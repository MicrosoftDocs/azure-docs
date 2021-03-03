---
title: Quickstart - Use CLI to create Azure Managed Instance for Apache Cassandra cluster
description: Use this quickstart to create an Azure Managed Instance for Apache Cassandra cluster using Azure CLI.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 03/02/2021
---

# Quickstart: Create an Azure Managed Instance for Apache Cassandra cluster using Azure CLI (Preview)

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra datacenters. This service helps you accelerate hybrid scenarios and reduce ongoing maintenance.

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This quickstart demonstrates how to use the Azure CLI commands to create a cluster with Azure Managed Instance for Apache Cassandra. It also shows to create a datacenter, and scale nodes up or down within the datacenter.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires the Azure CLI version 2.12.1 or higher. If you are using Azure Cloud Shell, the latest version is already installed.

* [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) with connectivity to your self-hosted or on-premise environment. For more information on connecting on premises environments to Azure, see the [Connect an on-premises network to Azure](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/) article.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## <a id="create-cluster"></a>Create a managed instance cluster

1. Sign in to the [Azure portal](https://portal.azure.com/)

1. Set your subscription ID in Azure CLI:

   ```azurecli-interactive
   az account set -s <Subscription_ID>
   ```

1. Next, create a Virtual Network with a dedicated subnet in your resource group:

   ```azurecli-interactive
   az network vnet create -n <VNet_Name> -l eastus2 -g <Resource_Group_Name> --subnet-name <Subnet Name>
   ```

1. Apply some special permissions to the Virtual Network and the subnet, which are required by the managed instance. To do so, you have to get the resource ID for your existing Virtual Network. Run the following command and copy the value of `Resource ID` parameter:

   ```azurecli-interactive
   # get the resource ID of the Virtual Network
   az network vnet show -n <VNet_name> -g <Resource_Group_Name> --query "id" --output tsv

1. Now apply the special permissions by using the `az role assignment create` command. Use the `Resource ID` parameter from the output of previous command to the `scope` parameter:

   ```azurecli-interactive
   az role assignment create --assignee e5007d2c-4b13-4a74-9b6a-605d99f03501 --role 4d97b98b-1d4f-4787-a291-c67834d212e7 --scope <Resource ID>
   ```

   > [!NOTE]
   > The `assignee` and `role` values in the previous command are fixed service principle and role identifiers respectively.

1. Next create the cluster in your newly created Virtual Network. Run the following command and make sure that you use the `Resource ID` value retrieved in the previous command as the value of `delegatedManagementSubnetId` variable:

   ```azurecli-interactive
   resourceGroupName='<Resource_Group_Name>'
   clusterName='<Cluster_Name>'
   location='eastus2'
   delegatedManagementSubnetId='<Resource_ID>'
   initialCassandraAdminPassword='myPassword'
    
   az managed-cassandra cluster create \
      --cluster-name $clusterName \
      --resource-group $resourceGroupName \
      --location $location \
      --delegated-management-subnet-id $delegatedManagementSubnetId \
      --initial-cassandra-admin-password $initialCassandraAdminPassword \
      --debug
   ```

1. Finally, create a datacenter for the cluster, with three nodes:

   ```azurecli-interactive
   dataCenterName='dc1'
   dataCenterLocation='eastus2'
   delegatedSubnetId='<Resource_ID>'
    
   az managed-cassandra datacenter create \
      --resource-group $resourceGroupName \
      --cluster-name $clusterName \
      --data-center-name $dataCenterName \
      --data-center-location $dataCenterLocation \
      --delegated-subnet-id $delegatedSubnetId \
      --node-count 3 
   ```

1. Once the datacenter is created, if you want to scale up, or scale down the nodes in the datacenter, run the following command. Change the value of `node-count` parameter to the desired value:

   ```azurecli-interactive
   resourceGroupName='<Resource_Group_Name>'
   clusterName='<Cluster Name>'
   dataCenterName='dc1'
   dataCenterLocation='eastus2'
   delegatedSubnetId= '<Resource_ID>'
    
   az managed-cassandra datacenter update \
      --resource-group $resourceGroupName \
      --cluster-name $clusterName \
      --data-center-name $dataCenterName \
      --node-count 9 
   ```

## Connect to your cluster

Azure Managed Instance for Apache Cassandra does not create nodes with public IP addresses. To connect to your newly created Cassandra cluster, you must create another resource inside the virtual network. This resource can be an application, or a virtual machine with Apache's open-source query tool [CQLSH](https://cassandra.apache.org/doc/latest/tools/cqlsh.html) installed. You can use a [Resource Manager template](https://azure.microsoft.com/resources/templates/101-vm-simple-linux/) to deploy an Ubuntu virtual machine. After it's deployed, use SSH to connect to the machine and install CQLSH as shown in the following commands:

```bash
# Install default-jre and default-jdk
sudo apt update
sudo apt install openjdk-8-jdk openjdk-8-jre

# Install the Cassandra libraries in order to get CQLSH:
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -
sudo apt-get update
sudo apt-get install cassandra

# Export the SSL variables:
export SSL_VERSION=TLSv1_2
export SSL_VALIDATE=false

# Connect to CQLSH (replace <IP> with the private IP addresses of the nodes in your Datacenter):
host=("<IP>" "<IP>" "<IP>")
cqlsh $host 9042 -u cassandra -p cassandra --ssl
```

## Clean up resources

When no longer needed, you can use the `az group delete` command to remove the resource group, the managed instance, and all related resources:

```azurecli-interactive
az group delete --name <Resource_Group_Name>
```

## Next steps

In this quickstart, you learned how to create an Azure Managed Instance for Apache Cassandra cluster using Azure CLI. You can now start working with the cluster:

> [!div class="nextstepaction"]
> [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
