---
title: Configure Azure Blob Storage on Azure HDInsight 
description: Learn how to Configure Azure Blob storage on Azure HDInsight.
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 11/25/2024

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
1. For Example, 

    ```
    { 

    "type": "UserAssigned", 

    "userAssignedIdentities": { 

      "/subscriptions/test-subscription/resourcegroups/test-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/test-msi": {} 

     } 

    } 
    ```  

## MSI based Script Action using primary Azure Blob Storage storage 

Previously while adding the primary storage as Azure Blob Storage storage in the Azure HDInsight cluster, you can't provide MSI for authentication. 
Also to access a script action that isn't accessible anonymously, you need to mention the SAS Key in the script action parameters, so the Azure HDInsight Cluster can access the script for execution.

Now, you can add Azure Blob Storage storage in Azure HDInsight cluster as a primary storage using MSI. 

Hence there's no need to provide the SAS key in the script action parameters, while adding the script action, if the script uploaded to the  primary Azure Blob Storage storage account. 

The script is downloaded and implemented. This will work even if the script isn't publicly accessible. 

The new feature specifically supports scripts that aren't publicly accessible but don't require a SAS key or token. This provides an additional layer of security for scripts that need to be kept private. 

The conventional script action in which is anonymously accessible or if a SAS key is passed along with the script URI, still works without any changes. For more information, see [Customize Azure HDInsight clusters by using script actions](./hdinsight-hadoop-customize-cluster-linux.md)     

## Next steps

* [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](./hdinsight-managed-identities.md)
