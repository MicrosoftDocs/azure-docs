---
title: Move an Azure Batch account to another region
description: Learn how to move an Azure Batch account to a different region.
ms.topic: how-to
ms.date: 05/05/2021
ms.custom: subject-moving-resources
---

# Move an Azure Batch account to another region

There are scenarios in which it might be helpful to move an existing [Batch account](accounts.md) from one region to another. For example, you may want to move to another region as part of disaster recovery planning.

Azure Batch accounts can't be directly moved from one region to another. You can, however, use an Azure Resource Manager template to export the existing configuration of your Batch account. You can then stage the resource in another region by exporting the Batch account to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. You can then recreate jobs and other features in the account.

 For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

This topic explains how to move a Batch account between regions by using the Azure portal.

## Prerequisites

- Move the storage account associated with your Batch account to the new target region by following the steps in [Move an Azure Storage account to another region](../storage/common/storage-account-move.md). If you prefer, you can leave the storage account in the original region; however, we recommend moving it, as you'll generally see better performance if it's in the same region as your Batch account. The instructions below assume you have already migrated your storage account.
- Ensure that the services and features that your Batch account uses are supported in the target region.

## Prepare

To get started, you'll need to export and then modify a Resource Manager template.

### Export a template

First, export a template that contains settings and information for your Batch account.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All resources** and then select your Batch account.

3. Select > **Automation** > **Export template**.

4. Choose **Download** in the **Export template** blade.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that comprise the template and scripts to deploy the template.

### Modify the template

Next, load and modify the template so you can create a new Batch account in the target region.

1. In the Azure portal, select **Create a resource**.

1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.

1. Select **Template deployment (deploy using custom templates)**.

1. Select **Create**.

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then select the **template.json** file that you downloaded in the last section.

1. In the uploaded **template.json** file, name the target Batch account by entering a new **defaultValue** for the Batch account name. This example sets the **defaultValue** of the Batch account name to `mytargetaccount`. and replaces the string in **defaultValue** with the resource ID for `mytargetstorageaccount`.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "batchAccounts_mysourceaccount_name": {
                "defaultValue": "mytargetaccount",
                "type": "String"
            }
        },
   ```

1. Next, update the **defaultValue** of the storage account with your migrated storage account's resource ID. To get this value, navigate to the storage account in the Azure portal, select **JSON View** near the top fo the screen, and then copy the value shown under **Resource ID**. This example uses the resource ID for a storage account named `mytargetstorageaccount` in the resource group `mytargetresourcegroup`.

   ```json
           "storageAccounts_mysourcestorageaccount_externalid": {
            "defaultValue": "/subscriptions/{subscriptionID}/resourceGroups/mytargetresourcegroup/providers/Microsoft.Storage/storageAccounts/mytargetstorageaccount",
            "type": "String"
        }
    },
   ```

1. Finally, edit the **location** property to use your target region. This example sets the target region to `centralus`.

```json
    {
        "resources": [
            {
                "type": "Microsoft.Batch/batchAccounts",
                "apiVersion": "2021-01-01",
                "name": "[parameters('batchAccounts_mysourceaccount_name')]",
                "location": "centralus",  
```

To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces. For example, **Central US** = **centralus**.

## Move

Deploy the template to create a new Batch account in the target region.

1. Now that you've made your modifications, select **Save** below the **template.json** file.

1. Enter or select the property values:
   - **Subscription**: Select an Azure subscription.
   - **Resource group**: Select the resource group that you created when moving the associated storage account.
   - **Region**: Select the Azure region to which you are moving the account.

1. Select **Review and create**, then select **Create**.

### Configure the new Batch account

Some features won't export to a template, so you'll have to recreate them in the new Batch account. These include the following:

- Jobs
- Job schedules
- Certificates
- Application packages

Be sure to configure these as needed in the new account as needed. You can look at how you've configured these features in your source Batch account for reference.

## Discard or clean up

Once you've confirmed that your new Batch account is successfully working in the new region, and you've restored the necessary features, you can delete the source Batch account.

To remove a Batch account by using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Batch accounts**.

2. Locate the Batch account to delete, and right-click the **More** button (**...**) on the right side of the listing. Be sure that this is the original source Batch account, not the new one you created.

3. Select **Delete**, then confirm.

## Next steps

- Learn more about [moving resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).
- Learn how to [move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md).
