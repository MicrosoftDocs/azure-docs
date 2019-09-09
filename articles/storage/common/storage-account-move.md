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
- For preview features, ensure that target subscription is whitelisted for the target regions


## Prepare and move

The following steps show how to prepare the storage account for the move using an Resource Manager template, and move the storage account settings to the target region using the portal and a script.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the subscription ID where you want to deploy the target public IP with [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):

    ```azurepowershell-interactive
    Get-AzSubscription

### Export the storage account template

1. Login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
2. Locate the resource group that contains the source storage account, and then click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Download** in the **Export template** blade.
5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.  

   This zip file contains the .json files that comprise the template and scripts to deploy the template.

### Modify the template

2. To edit the parameter of the storage account name, open the **parameters.json** file and edit the **value** property:
    
    ```json
    {
       "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
       "contentVersion": "1.0.0.0",
       "parameters": {
           "storageAccounts_mysourceaccount_name": {
               "value": null
           }
       }
    }
    ```

3. Change the **null** value in the .json file to a name of your choice for the target storage account. Save the parameters.json file. Ensure you enclose the name in quotes.

4. To edit the target region where the storage account will be moved, open the **template.json** file:

       ```json
       "resources": [
            {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-04-01",
            "name": "[parameters('storageAccounts_mysourceaccount_name')]",
            "location": "eastus"
            }
         ]          
       ```
  
4. Edit the **location** property in the **template.json** file to the target region. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive
    Get-AzLocation | format-table 
    ```

5. Lifecycle management policies do not automatically export with this template. If your storage account has lifecycle management policies, you'll have to add them to this template manually. To do that, select > **Blob service** > **LifeCycle Management**, and then choose **Code View**. Copy and paste the code in that view into the **properties** section of the template json file and enclose that block with a policy block. This example adds a lifecycle management policy to the template:

    ```json
            "type": "Microsoft.Storage/storageAccounts/blobServices",
            "apiVersion": "2019-04-01",
            "name": "[concat(parameters('storageAccounts_mysourceaccount_name'), '/default')]",
            "dependsOn": [
                "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccounts_mysourceaccount_name'))]"
            ],
            "properties": {
                "policy": 
                    {
                        "rules": [
                            {
                                "enabled": true,
                                "name": "myrule",
                                "type": "Lifecycle",
                                "definition": {
                                    "actions": {
                                        "baseBlob": {
                                            "tierToCool": {
                                                "daysAfterModificationGreaterThan": 200
                                            },
                                            "delete": {
                                                "daysAfterModificationGreaterThan": 300
                                            }
                                        }
                                    },
                                    "filters": {
                                        "blobTypes": [
                                            "blockBlob"
                                        ]
                                    }
                                }
                            }
                        ]
                    },
    ```
To learn more, see [Azure Resource Manager template with lifecycle management policy](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts#azure-resource-manager-template-with-lifecycle-management-policy).

6. Save the **template.json** file.

### Deploy the template

    ```
3. Change to the directory where you unzipped the template files and saved the parameters.json file and run the following command to deploy the template and virtual network into the target region:

    ```azurepowershell-interactive
    ./deploy.ps1 -subscription "Azure Subscription" -resourceGroupName myresourcegroup -resourceGroupLocation targetregion  
    ```
### Add back settings that don't export with the template

Add static website - that creates a container for web files and the new address. Then point CDNs or custom domains to the new URL.
Add RBAC roles. RBAC role assignments are specific to an account.
Create new event subscription. A subscription is between an account and endpoint.
CDNs. Just change the origin of the CDN to point to the new account.
Remove alerts or redirect them to the new storage account (if possible)

### Move data to the new storage account

Put AzCopy steps in here.

## Discard 

After the deployment, if you wish to start over or discard the storage account in the target, delete the resource group that was created in the target and the moved storage account will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0):

```azurepowershell-interactive
Remove-AzResourceGroup -Name <resource-group-name>
```

## Clean up

To commit the changes and complete the move of the storage account, delete the source storage account or resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0) or [Remove-AzStorageAccount](https://docs.microsoft.com/powershell/module/az.storage/remove-azstorageaccount?view=azps-2.6.0):

```azurepowershell-interactive
Remove-AzResourceGroup -Name <resource-group-name>
```

``` azurepowershell-interactive
Remove-AzPublicIpAddress -Name <public-ip> -ResourceGroupName <resource-group-name>
```

## Next steps

In this tutorial, you moved an Azure storage account from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)