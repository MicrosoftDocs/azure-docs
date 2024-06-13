---
title: Azure Managed Instance for Apache Cassandra customer-managed keys
description: Learn how to implement customer-managed keys in Azure Managed Instance for Apache Cassandra by using Azure Key Vault.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: conceptual
ms.date: 10/29/2021
ms.custom: references_regions, devx-track-azurecli

---

# Customer-managed keys in Azure Managed Instance for Apache Cassandra

In Azure Managed Instance for Apache Cassandra, you can use your own key to encrypt data on disk. This article describes how to implement customer-managed keys by using Azure Key Vault.

## Prerequisites

- Set up a secret by using Azure Key Vault. For more information, see [About Azure Key Vault secrets](../key-vault/secrets/about-secrets.md).
- Deploy a virtual network in your resource group.
- Apply the Network Contributor role with the Azure Cosmos DB service principal as a member. Use the following command:

  ```azurecli-interactive  
      az role assignment create \
      --assignee a232010e-820c-4083-83bb-3ace5fc29d0b \
      --role 4d97b98b-1d4f-4787-a291-c67834d212e7 \
      --scope /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>
  ```

  Applying the appropriate role to your virtual network helps you avoid failure when you deploy an Azure Managed Instance for Apache Cassandra cluster. For more information, see [Create an Azure Managed Instance for Apache Cassandra cluster by using the Azure CLI](create-cluster-cli.md).

This article requires Azure CLI version 2.30.0 or later. If you're using Azure Cloud Shell, the latest version is already installed.

## <a id="create-cluster"></a>Create a cluster with a system-assigned identity

1. Create a cluster by using the following command. Replace `<subscriptionID>`, `<resourceGroupName>`, `<vnetName>`, and `<subnetName>` with the appropriate values.

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

1. Get the identity information of the created cluster:

    ```azurecli-interactive
    az managed-cassandra cluster show -c $cluster -g $group
    ```

    The output includes an identity section like the following example. Copy the `principalId` value for later use.

    ```shell
      "identity": {
        "principalId": "1aa51c7f-196a-4013-a656-1ccabfdc54e0",
        "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "type": "SystemAssigned"
      }
    ```

1. In the Azure portal, go to your key vault and select **Access policies**. Then select **Add Access Policy** to create an access policy for your keys.

   :::image type="content" source="./media/cmk/key-vault-access-policy-1.png" alt-text="Screenshot that shows the pane for access policies in the Azure portal." lightbox="./media/cmk/key-vault-access-policy-1.png" border="true":::

1. For **Key permissions**, select **get**, **wrap**, and **unwrap**. Select the **Select principal** box to open the **Principal** pane. Enter the cluster's `principalId` value that you retrieved earlier, and then select the **Select** button. (In the portal, you can also look up the principal ID of the cluster by the cluster's name.)

   :::image type="content" source="./media/cmk/key-vault-access-policy-2.png" alt-text="Screenshot that shows an example of adding a principal for an access policy." lightbox="./media/cmk/key-vault-access-policy-2.png" border="true":::

   > [!WARNING]
   > Make sure that the key vault has purge protection turned on. Datacenter deployments will fail without it.

1. Select **Add** to add the access policy, and then select **Save**.

   :::image type="content" source="./media/cmk/save.png" alt-text="Screenshot that shows the button for saving an access policy." lightbox="./media/cmk/key-vault-access-policy-2.png" border="true":::

1. To get the key identifier, select **Keys**, and then select your key.

   :::image type="content" source="./media/cmk/select-key.png" alt-text="Screenshot that shows the pane for selecting a key." lightbox="./media/cmk/key-identifier-1.png" border="true":::

1. Select the current version.

   :::image type="content" source="./media/cmk/current-version.png" alt-text="Screenshot that shows the box for selecting the current version of a key." lightbox="./media/cmk/key-identifier-1.png" border="true":::

1. Save the key identifier for later use.

   :::image type="content" source="./media/cmk/key-identifier-2.png" alt-text="Screenshot that shows copying a key identifier to the clipboard." lightbox="./media/cmk/key-identifier-1.png" border="true":::

1. Create the datacenter by replacing `<key identifier>` with the same key (the URI that you copied in the previous step) for both managed disk (`managed-disk-customer-key-uri`) and backup storage (`backup-storage-customer-key-uri`) encryption. Use the same value for `subnet` that you used earlier.

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

You can also assign an identity to an existing cluster with no identity information:

```azurecli-interactive
az managed-cassandra cluster update --identity-type SystemAssigned -g $group -c $cluster
```

## <a id="update-cluster"></a>Rotate the key

To update the key, use this command:

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
