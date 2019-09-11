---
title: Move an Azure Storage account to another region | Microsoft Docs
description: Shows you how to move an Azure Storage account to another region.
services: storage
author: normesta
ms.service: storage
ms.subservice: common
ms.topic: article
ms.date: 09/09/2019
ms.author: normesta 
ms.reviewer: dineshm
---

# Move an Azure Storage account to another region

Put something here.

## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.
- For preview features, ensure that target subscription is whitelisted for the target regions.

## Prepare

The following steps show how to prepare the storage account for the move using an Resource Manager template, and move the storage account settings to the target region using the portal.

### Export the template

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Select **All resources** and then select your storage account.

3. Select > **Settings** > **Export template**.

4. Choose **Download** in the **Export template** blade.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that comprise the template and scripts to deploy the template.

### Modify the template 

Azure requires that each Azure service has a unique name. The deployment could fail if you entered a storage account name that already exists. To avoid this issue, you modify the template to use a template function call `uniquestring()` to generate a unique storage account name.

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
    ``` 

4. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `eastus`.

    ```json
    "resources": [{
         "type": "Microsoft.Storage/storageAccounts",
         "apiVersion": "2019-04-01",
         "name": "[parameters('storageAccounts_mysourceaccount_name')]",
         "location": "eastus"
         }]          
    ```

    To obtain region location codes, open a PowerShell window, and sign in to your Azure subscription by using the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command. Then run the [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) command.

    ```azurepowershell-interactive
    Get-AzLocation | format-table 
    ```

## Move

1. Save the **template.json** file.

2. Enter or select the property values:

- **Subscription**: Select an Azure subscription.

- **Resource group**: Select **Create new** and give the resource group a name.

- **Location**: Select an Azure location.

3. Click the **I agree to the terms and conditions stated above** checkbox, and then click the **Select Purchase** button.

### Add settings to the target storage account

These settings don't export to a template, so you'll have to add them to your new account.

- Lifecycle management policies. See [Manage the Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts#azure-portal-code-view).

- Static websites. See [Host a static website in Azure Storage](../blobs/storage-blob-static-website-how-to.md).

- Event subscriptions. See [Reacting to Blob storage events](../blobs/storage-blob-event-overview.md).

- Alerts. See [Create, view, and manage activity log alerts by using Azure Monitor](../../azure-monitor/platform/alerts-activity-log.md).

If you set up a Content Delivery Network (CDN) in the source account, just change the origin of your existing CDN to the static website or blob URL in your new account. See [Use Azure CDN to access blobs with custom domains over HTTPS](../blobs/storage-https-custom-domain-cdn.md).

### Move data to the new storage account

See [Copy blobs between storage accounts](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-blobs?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#copy-blobs-between-storage-accounts).

## Discard or Clean up

After the deployment, if you wish to start over or discard the target storage account, you can delete it. 

To commit the changes and complete the move of a storage account, delete the source storage account.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Storage accounts*** to display the list of your storage accounts.

2. Locate the target storage account to delete, and right-click the **More** button (**...**) on the right side of the listing.

3. Select **Delete**, and confirm.

## Next steps

In this tutorial, you moved an Azure storage account from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)