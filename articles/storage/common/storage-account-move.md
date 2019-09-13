---
title: Move an Azure Storage account to another region | Microsoft Docs
description: Shows you how to move an Azure Storage account to another region.
services: storage
author: normesta
ms.service: storage
ms.subservice: common
ms.topic: article
ms.date: 09/13/2019
ms.author: normesta 
ms.reviewer: dineshm
---

# Move an Azure Storage account to another region

To move a storage account, create a copy of your storage account in another region, and then move data to that account by using AzCopy or another of your choice.

This article shows you how to do this by using Azure portal and PowerShell. 

## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.
- For preview features, ensure that your subscription is whitelisted for the target region.

## Prepare

To get started, export, and then modify a Resource Manager template. 

### Export a template

This template contains settings that describe your storage account. 

# [Portal](#tab/azure-portal)

To export a template by using Azure portal:

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Select **All resources** and then select your storage account.

3. Select > **Settings** > **Export template**.

4. Choose **Download** in the **Export template** blade.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that comprise the template and scripts to deploy the template.

# [PowerShell](#tab/azure-powershell)

To export a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:

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

    ![Azure Resource Manager templates library](./media/storage-account-move/azure-resource-manager-template-library.png)

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

    You can obtain region codes by running the [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) command.

    ```azurepowershell-interactive
    Get-AzLocation | format-table 
    ```
---

## Move

Deploy the template to create a new storage account in the target region. 

# [Portal](#tab/azure-portal)

1. Save the **template.json** file.

2. Enter or select the property values:

- **Subscription**: Select an Azure subscription.

- **Resource group**: Select **Create new** and give the resource group a name.

- **Location**: Select an Azure location.

3. Click the **I agree to the terms and conditions stated above** checkbox, and then click the **Select Purchase** button.

# [PowerShell](#tab/azure-powershell)

1. Obtain the subscription ID where you want to deploy the target public IP with [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):

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

### Configure the new storage account

Some features won't export to a template, so you'll have to add them to the new storage account. 

The following table lists these features along with guidance for adding them to your new storage account.

| Feature    | Guidance    |
|--------|-----------|
| **Lifecycle management policies** | link |
| **Static websites** | [Manage the Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts#azure-portal-code-view) |
| **Event subscriptions** | [Host a static website in Azure Storage](../blobs/storage-blob-static-website-how-to.md) |
| **Alerts** | [Create, view, and manage activity log alerts by using Azure Monitor](../../azure-monitor/platform/alerts-activity-log.md) |
| **Content Delivery Network (CDN)** | [Use Azure CDN to access blobs with custom domains over HTTPS](../blobs/storage-https-custom-domain-cdn.md) |

>[!NOTE] If you set up a CDN for the source storage account, just change the origin of your existing CDN to the primary blob service endpoint (or the primary static website endpoint) of your new account. 

### Move data to the new storage account

AzCopy v10 is a command-line tool that presents easy-to-use commands that are optimized for performance.

Follow the guidance in this section of the AzCopy v10 documentation: [Copy blobs between storage accounts](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-blobs?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#copy-blobs-between-storage-accounts).

---

## Discard or Clean up

After the deployment, if you wish to start over or discard the target storage account, you can delete it. 

To commit the changes and complete the move of a storage account, delete the source storage account.

# [Portal](#tab/azure-portal)

To remove a storage account by using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Storage accounts*** to display the list of your storage accounts.

2. Locate the target storage account to delete, and right-click the **More** button (**...**) on the right side of the listing.

3. Select **Delete**, and confirm.

# [PowerShell](#tab/azure-powershell)

To remove the resource group and its associated resources, including the new storage account, use the [Remove-AzStorageAccount](/powershell/module/az.resources/remove-azstorageaccount) command:

```powershell
Remove-AzStorageAccount -ResourceGroupName  $resourceGroup -AccountName $storageAccount
```
---

## Next steps

In this tutorial, you moved an Azure storage account from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)