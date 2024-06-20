---
title: Relocate Azure Storage Account to another region
description: Learn how to relocate Azure Storage Account to another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/25/2024
ms.service: azure-storage
ms.topic: concept-article
ms.custom: subject-relocation, devx-track-azurepowershell
---


# Relocate Azure Storage Account to another region

This article shows you how to relocate an Azure Storage Account to a new region by creating a copy of your storage account into another region. You also learn how to relocate your data to that account by using AzCopy, or another tool of your choice.


## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.
- For preview features, ensure that your subscription is allowlisted for the target region. 
- Depending on your Storage Account deployment, the following dependent resources may need to be deployed and configured in the target region *prior* to relocation:

    - [Virtual Network, Network Security Groups, and User Defined Route](./relocation-virtual-network.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Automation](./relocation-automation.md)
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link Service](./relocation-private-link.md)

## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).


## Prepare

To prepare, you must export and then modify a Resource Manager template.

### Export a template

A Resource Manager template contains settings that describe your storage account.

# [Portal](#tab/azure-portal)

To export a template by using Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All resources** and then select your storage account.

3. Select > **Automation** > **Export template**.

4. Choose **Download** in the **Export template** blade.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that comprise the template and scripts to deploy the template.

# [PowerShell](#tab/azure-powershell)

To export a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that you want to move.

   ```azurepowershell-interactive
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

3. Export the template of your source storage account. These commands save a json template to your current directory.

   ```azurepowershell-interactive
   $resource = Get-AzResource `
     -ResourceGroupName <resource-group-name> `
     -ResourceName <storage-account-name> `
     -ResourceType Microsoft.Storage/storageAccounts
   Export-AzResourceGroup `
     -ResourceGroupName <resource-group-name> `
     -Resource $resource.ResourceId
   ```

---


### Modify the template

Modify the template by changing the storage account name and region.

# [Portal](#tab/azure-portal)

To deploy the template by using Azure portal:

1. In the Azure portal, select **Create a resource**.

2. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.

3. Select **Template deployment**.

    ![Azure Resource Manager templates library](../storage/common/media/storage-account-move/azure-resource-manager-template-library.png)

4. Select **Create**.

5. Select **Build your own template in the editor**.

6. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.

7. In the **template.json** file, name the target storage account by setting the default value of the storage account name. This example sets the default value of the storage account name to `mytargetaccount`.

    ```json
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageAccounts_mysourceaccount_name": {
            "defaultValue": "mytargetaccount",
            "type": "String"
        }
    },

8. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `centralus`.

    ```json
    "resources": [{
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2019-04-01",
         "name": "[parameters('storageAccounts_mysourceaccount_name')]",
         "location": "centralus"
         }]          
    ```

    To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

# [PowerShell](#tab/azure-powershell)

To deploy the template by using PowerShell:

1. In the **template.json** file, name the target storage account by setting the default value of the storage account name. This example sets the default value of the storage account name to `mytargetaccount`.

    ```json
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageAccounts_mysourceaccount_name": {
            "defaultValue": "mytargetaccount",
            "type": "String"
        }
    },
    ```

2. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `eastus`.

    ```json
    "resources": [{
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2019-04-01",
         "name": "[parameters('storageAccounts_mysourceaccount_name')]",
         "location": "eastus"
         }]          
    ```

    You can obtain region codes by running the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

    ```azurepowershell-interactive
    Get-AzLocation | format-table 
    ```

---

## Redeploy

Deploy the template to create a new storage account in the target region.

# [Portal](#tab/azure-portal)

1. Save the **template.json** file.

2. Enter or select the property values:

   - **Subscription**: Select an Azure subscription.

   - **Resource group**: Select **Create new** and give the resource group a name.

   - **Location**: Select an Azure location.

3. Select **I agree to the terms and conditions stated above**, and then select **Select Purchase**.

# [PowerShell](#tab/azure-powershell)

1. Obtain the subscription ID where you want to deploy the target public IP with [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription):

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

2. Use these commands to deploy your template:

   ```azurepowershell-interactive
   $resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
   $location = Read-Host -Prompt "Enter the location (i.e. centralus)"

   New-AzResourceGroup -Name $resourceGroupName -Location "$location"
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "<name of your local template file>"  
   ```

---

> [!TIP]
> If you receive an error which states that the XML specified is not syntactically valid, compare the JSON in your template with the schemas described in the [Azure Resource Manager documentation](/azure/templates/microsoft.storage/allversions).

### Configure the new storage account

Some features won't export to a template, so you'll have to add them to the new storage account.

The following table lists these features along with guidance for adding them to your new storage account.

| Feature    | Guidance    |
|--------|-----------|
| **Lifecycle management policies** | [Manage the Azure Blob storage lifecycle](../storage/blobs/storage-lifecycle-management-concepts.md) |
| **Static websites** | [Host a static website in Azure Storage](../storage/blobs/storage-blob-static-website-how-to.md) |
| **Event subscriptions** | [Reacting to Blob storage events](../storage/blobs/storage-blob-event-overview.md) |
| **Alerts** | [Create, view, and manage activity log alerts by using Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md) |
| **Content Delivery Network (CDN)** | [Use Azure CDN to access blobs with custom domains over HTTPS](../storage/blobs/storage-https-custom-domain-cdn.md) |

> [!NOTE]
> If you set up a CDN for the source storage account, just change the origin of your existing CDN to the primary blob service endpoint (or the primary static website endpoint) of your new account.

### Move data to the new storage account

AzCopy is the preferred tool to move your data over due to its performance optimization.  With AzCopy, data is copied directly between storage servers, and so it doesn't use the network bandwidth of your computer. You can run AzCopy at the command line or as part of a custom script. For more information, see [Copy blobs between Azure storage accounts by using AzCopy](/azure/storage/common/storage-use-azcopy-blobs-copy?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json&branch=pr-en-us-259662).

You can also use Azure Data Factory to move your data over. To learn how to use Data Factory to relocate your data see one of the following guides:

- [Copy data to or from Azure Blob storage by using Azure Data Factory](/azure/data-factory/connector-azure-blob-storage)
  - [Copy data to or from Azure Data Lake Storage Gen2 using Azure Data Factory](/azure/data-factory/connector-azure-data-lake-storage)
  - [Copy data from or to Azure Files by using Azure Data Factory](/azure/data-factory/connector-azure-file-storage)
  - [Copy data to and from Azure Table storage by using Azure Data Factory](/azure/data-factory/connector-azure-table-storage)



## Discard or clean up

After the deployment, if you want to start over, you can delete the target storage account, and repeat the steps described in the [Prepare](#prepare) and [Redeploy](#redeploy) sections of this article.

To commit the changes and complete the move of a storage account, delete the source storage account.

# [Portal](#tab/azure-portal)

To remove a storage account by using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Storage accounts** to display the list of your storage accounts.

2. Locate the target storage account to delete, and right-click the **More** button (**...**) on the right side of the listing.

3. Select **Delete**, and confirm.

# [PowerShell](#tab/azure-powershell)

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzStorageAccount](/powershell/module/az.storage/remove-azstorageaccount) command:

```powershell
Remove-AzStorageAccount -ResourceGroupName  $resourceGroup -AccountName $storageAccount
```

---

## Next steps

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
