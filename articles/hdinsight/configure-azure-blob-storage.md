---
title: Configure Azure Blob Storage on Azure HDInsight 
description: Learn how to Configure Azure Blob storage on Azure HDInsight.
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 11/15/2023

---
# Configure Azure Blob Storage as primary storage account in Azure HDInsight

Learn how to use managed identities to authenticate Blob storage while configuring primary storage during HDInsight cluster creation.  

## Enable Managed Identity using Azure portal

1. Select **Primary storage** type from the dropdown list.

1. Choose the Selection method as **Select from list**.

1. Click **Enable Managed Identity** to authenticate for HDInsight cluster creation. 

1. Select the **Managed Identity** from the dropdown list.

1. Click on **Next**.

   :::image type="content" source="./media/configure-azure-blob-storage/basic-tab.png" alt-text="Screenshot showing the basic tab." border="true" lightbox="./media/configure-azure-blob-storage/basic-tab.png":::

1. On the Security & Networking tab, select **User assigned managed identity** as the same Managed Identity which during cluster creation in the Basic tab. 

     :::image type="content" source="./media/configure-azure-blob-storage/network-tab.png" alt-text="Screenshot showing the network tab." border="true" lightbox="./media/configure-azure-blob-storage/network-tab.png":::  

## Use ARM template  

You can use managed identities to authenticate Azure blob storage by using ARM template while you create HDInsight cluster. 

Same thing can be achieved via ARM request if that is how you want to create HDInsight cluster. 

1. Earlier for Azure Storage based clusters, you would provide storage key for the Azure Storage Account in  

    ```
    properties -> storageProfile -> storageaccounts -> key
    ```

1. Field of the arm request and following field would remain null 

    ```
    properties -> storageProfile -> storageaccounts -> msiResourceId 
    ```
1. To set the key as null, and `msiResourceId` as full path of the MSI you want to use. 

    ```
    /subscriptions/test-subscription/resourcegroups/test-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test-msi 
    ```
1. Add one more field in the ARM request which would otherwise be null, which is  

    `identity`

1. The content should have following fields.

    ```
    { 

    "type": "UserAssigned", 

    "userAssignedIdentities": { 

    "<full path of the MSI>": {} 

    } 
    ```
1. For Exapmple, 

    ```
    { 

    "type": "UserAssigned", 

    "userAssignedIdentities": { 

      "/subscriptions/test-subscription/resourcegroups/test-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test-msi": {} 

     } 

    } 
    ```  
     
## Next steps

* [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](./hdinsight-managed-identities.md)
