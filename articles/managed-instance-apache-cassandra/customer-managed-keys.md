---
title: Customer Managed Keys
description: Customer Managed Keys
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: conceptual
ms.date: 10/29/2021
ms.custom: references_regions, devx-track-azurecli

---

# Customer managed keys - overview

Azure Managed Instance for Apache Cassandra provides the capability to encrypt data on disk using your own key.

## Prerequisites

This article assumes you have already set up a secret using Azure Key Vault. Learn more about Azure Key Vault [here](/azure/key-vault/secrets/about-secrets).


## <a id="create-cluster"></a>Create a managed instance cluster with system assigned identity

1. Create a cluster by specifying identity type as SystemAssigned. This creates a managed identity for the cluster, replacing `<subscriptionID>`, `<resourceGroupName>`, `<vnetName>`, and `<subnetName>` with the appropriate values:

```azurecli-interactive

    subnet="/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
    cluster="thvankra-cmk-test-wcus"
    group="thvankra-nova-cmk-test"
    region="westcentralus"
    password="PlaceholderPassword"

    az managed-cassandra cluster create --identity-type SystemAssigned -g $group -l $region -c $cluster -s $subnet -i $password
```

1. Get the identity information of the created cluster

```azurecli-interactive
    az managed-cassandra cluster show -c $cluster -g $group
```

The output will include an identity section like the below. Copy `principalId` for later use:

```shell
    "identity": {

        "principalId": "ddd749c2-99e7-475f-abed-94e1f8256184",
        "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "type": "SystemAssigned"
    }
```
 
1. In Azure Key Vault, create an access policy to your keys:

   :::image type="content" source="./media/cmk/key-vault-access-policy-1.png" alt-text="Key Vault Access policy 1" lightbox="./media/cmk/key-vault-access-policy-1.png" border="true":::

1. Assign `get`, `wrap` and `unwrap` key permissions on the key vault to the cluster's `principalId` retrieved above. Make sure the key vault has Purge Protection enabled. In the portal, you can also look up the Principal Id of the cluster by the cluster's name:
 


   :::image type="content" source="./media/cmk/key-vault-access-policy-2.png" alt-text="Key Vault Access policy 2" lightbox="./media/cmk/key-vault-access-policy-2.png" border="true":::


1. Get the key identifier, as shown below:

   :::image type="content" source="./media/cmk/key-identifier-2.png" alt-text="Key identifier step 2" lightbox="./media/cmk/key-identifier-1.png" border="true":::


1. Create the datacenter by passing the key for managed disk (-k option) and backup storage (-p option) encryption as shown below (use the same value for `subnet` you used earlier): 

```azurecli-interactive
    managedDiskKeyUri = "https://pall-kv.vault.azure.net/keys/pall-key/83d31743680849d5a4f4f2bba742e270"
    backupStorageKeyUri = "https://pall-kv.vault.azure.net/keys/pall-key/83d31743680849d5a4f4f2bba742e270"
    group="thvankra-nova-cmk-test"
    region="westcentralus"
    cluster="thvankra-cmk-test-2"
    dc="dc1"
    nodecount=3
    subnet="/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
    
    
    az managed-cassandra datacenter create -g $group -c $cluster -d $dc -k $managedDiskKeyUri -p $backupStorageKeyUri -n $nodecount -s $subnet -l $region --sku  Standard_E8s_v4
```

## <a id="update-cluster"></a>Update a managed instance cluster with system assigned identity

1. An existing cluster with no identity information can be assigned an identity as shown below:

```azurecli-interactive
    az managed-cassandra cluster update --identity-type SystemAssigned -g $group -c $cluster
```

1. Below is the command to update the key used for managed disk (-k option) and backup storage (-p option) encryption:

```azurecli-interactive
    managedDiskKeyUri = "https://pall-kv.vault.azure.net/keys/pall-key/2d58b85e699d4266bd3ca5d10ddc20bd"
    backupStorageKeyUri = "https://pall-kv.vault.azure.net/keys/pall-key/2d58b85e699d4266bd3ca5d10ddc20bd"

    az managed-cassandra datacenter update -g $group -c $cluster -d $dc -k $managedDiskKeyUri -p $backupStorageKeyUri
```