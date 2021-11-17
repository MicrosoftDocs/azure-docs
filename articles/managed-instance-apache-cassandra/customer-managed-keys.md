---
title: Azure Managed Instance for Apache Cassandra Customer-managed keys
description: Customer-managed keys
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: conceptual
ms.date: 10/29/2021
ms.custom: references_regions, devx-track-azurecli

---

# Customer-managed keys - overview

Azure Managed Instance for Apache Cassandra provides the capability to encrypt data on disk using your own key. This article describes how to implement customer-managed keys with Azure Key Vault.

## Prerequisites

- Set up a secret using Azure Key Vault. Learn more about Azure Key Vault [here](../key-vault/secrets/about-secrets.md).
- Deployed a virtual network in your resource group, and applied the network contributor role with the Azure Cosmos DB service principal as a member. See [Create an Azure Managed Instance for Apache Cassandra cluster using Azure CLI](create-cluster-cli.md) for more detail. 

> [!IMPORTANT]
> This article requires the Azure CLI version 2.30.0 or higher. If you are using Azure Cloud Shell, the latest version is already installed.

## <a id="create-cluster"></a>Create a cluster with system assigned identity

   > [!NOTE]
   > As mentioned in pre-requisites, to avoid deployment failure, make sure you have applied the appropriate role to your virtual network before attempting to deploy a managed instance cluster:
   > ```azurecli-interactive  
   >     az role assignment create \
   >     --assignee a232010e-820c-4083-83bb-3ace5fc29d0b \
   >     --role 4d97b98b-1d4f-4787-a291-c67834d212e7 \
   >     --scope /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>
   > ```

1. Create a cluster by specifying identity type as SystemAssigned, replacing `<subscriptionID>`, `<resourceGroupName>`, `<vnetName>`, and `<subnetName>` with the appropriate values:

    ```azurecli-interactive    
    subnet="/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
    cluster="thvankra-cmk-test-wcus"
    group="thvankra-nova-cmk-test"
    region="westcentralus"
    password="PlaceholderPassword"
    
    az managed-cassandra cluster create \
        --identity-type SystemAssigned \
        --resource-group $group \
        --location $region \
        --cluster-name $cluster \
        --delegated-management-subnet-id $subnet \
        --initial-cassandra-admin-password $password
    ```

1. Get the identity information of the created cluster

    ```azurecli-interactive
    az managed-cassandra cluster show -c $cluster -g $group
    ```

    The output will include an identity section like the below. Copy `principalId` for later use:

    ```shell
      "identity": {
        "principalId": "1aa51c7f-196a-4013-a656-1ccabfdc54e0",
        "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "type": "SystemAssigned"
      }
    ```
 
1. In Azure Key Vault, create an access policy to your keys:

   :::image type="content" source="./media/cmk/key-vault-access-policy-1.png" alt-text="Key Vault Access policy 1" lightbox="./media/cmk/key-vault-access-policy-1.png" border="true":::

1. Assign `get`, `wrap` and `unwrap` key permissions on the key vault to the cluster's `principalId` retrieved above. In the portal, you can also look up the Principal ID of the cluster by the cluster's name:
 

   :::image type="content" source="./media/cmk/key-vault-access-policy-2.png" alt-text="Key Vault Access policy 2" lightbox="./media/cmk/key-vault-access-policy-2.png" border="true":::

   > [!WARNING]
   > Make sure the key vault has Purge Protection enabled. Datacenter deployments will fail without it. 

1. After you click on `add` to add the access policy, make sure you save it:

   :::image type="content" source="./media/cmk/save.png" alt-text="Save Access policy" lightbox="./media/cmk/key-vault-access-policy-2.png" border="true":::

1. To get the key identifier, select your key:

   :::image type="content" source="./media/cmk/select-key.png" alt-text="Select key" lightbox="./media/cmk/key-identifier-1.png" border="true":::

1. Click on current version:

   :::image type="content" source="./media/cmk/current-version.png" alt-text="Select current version" lightbox="./media/cmk/key-identifier-1.png" border="true":::

1. Save the key identifier for later use:

   :::image type="content" source="./media/cmk/key-identifier-2.png" alt-text="Key identifier step 2" lightbox="./media/cmk/key-identifier-1.png" border="true":::


1. Create the datacenter by replacing `<key identifier>` with the same key (the uri you copied in previous step) for both managed disk (managed-disk-customer-key-uri) and backup storage (backup-storage-customer-key-uri) encryption as shown below (use the same value for `subnet` you used earlier): 

    ```azurecli-interactive
    managedDiskKeyUri = "<key identifier>"
    backupStorageKeyUri = "<key identifier>"
    group="thvankra-nova-cmk-test"
    region="westcentralus"
    cluster="thvankra-cmk-test-2"
    dc="dc1"
    nodecount=3
    subnet="/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
        
    az managed-cassandra datacenter create \
        --resource-group $group \
        --cluster-name $cluster \
        --data-center-name $dc \
        --managed-disk-customer-key-uri $managedDiskKeyUri \
        --backup-storage-customer-key-uri $backupStorageKeyUri \
        --node-count $nodecount \
        --delegated-subnet-id $subnet \
        --data-center-location $region \
        --sku Standard_DS14_v2
    ```

1. An existing cluster with no identity information can be assigned an identity as shown below:

    ```azurecli-interactive
    az managed-cassandra cluster update --identity-type SystemAssigned -g $group -c $cluster
    ```

## <a id="update-cluster"></a>Rotating the key

1. Below is the command to update the key:

    ```azurecli-interactive
    managedDiskKeyUri = "<key identifier>"
    backupStorageKeyUri = "<key identifier>"
    
    az managed-cassandra datacenter update \
        --resource-group $group \
        --cluster-name $cluster \ 
        --data-center-name $dc \
        --managed-disk-customer-key-uri $managedDiskKeyUri \
        --backup-storage-customer-key-uri $backupStorageKeyUri
    ```