---
title: Configure a lifecycle management policy
titleSuffix: Azure Storage
description: Create automated rules for moving data between hot, cool, and archive tiers.
author: tamram

ms.author: tamram
ms.date: 08/17/2021
ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.reviewer: yzheng 
ms.custom: "devx-track-azurepowershell, references_regions"
---

# Configure a lifecycle management policy

## Add or remove a policy

You can add, edit, or remove a policy by using any of the following methods:

- The Azure portal
- Azure PowerShell
    - [Add-AzStorageAccountManagementPolicyAction](/powershell/module/az.storage/add-azstorageaccountmanagementpolicyaction)
    - [New-AzStorageAccountManagementPolicyFilter](/powershell/module/az.storage/new-azstorageaccountmanagementpolicyfilter)
    - [New-AzStorageAccountManagementPolicyRule](/powershell/module/az.storage/new-azstorageaccountmanagementpolicyrule)
    - [Set-AzStorageAccountManagementPolicy](/powershell/module/az.storage/set-azstorageaccountmanagementpolicy)
    - [Remove-AzStorageAccountManagementPolicy](/powershell/module/az.storage/remove-azstorageaccountmanagementpolicy)
- [Azure CLI](/cli/azure/storage/account/management-policy)
- [REST APIs](/rest/api/storagerp/managementpolicies)

A policy can be read or written in full. Partial updates are not supported.

> [!NOTE]
> If you enable firewall rules for your storage account, lifecycle management requests may be blocked. You can unblock these requests by providing exceptions for trusted Microsoft services. For more information, see the **Exceptions** section in [Configure firewalls and virtual networks](../common/storage-network-security.md#exceptions).

This article shows how to manage policy by using the portal and PowerShell methods.

# [Portal](#tab/azure-portal)

There are two ways to add a policy through the Azure portal.

- [Azure portal List view](#azure-portal-list-view)
- [Azure portal Code view](#azure-portal-code-view)

#### Azure portal List view

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and select your storage account.

1. Under **Data management**, select **Lifecycle Management** to view or change your rules.

1. Select the **List View** tab.

1. Select **Add a rule** and name your rule on the **Details** form. You can also set the **Rule scope**, **Blob type**, and **Blob subtype** values. The following example sets the scope to filter blobs. This causes the **Filter set** tab to be added.

   :::image type="content" source="media/lifecycle-management-policy-configure/lifecycle-management-details.png" alt-text="Lifecycle management add a rule details page in Azure portal":::

1. Select **Base blobs** to set the conditions for your rule. In the following example, blobs are moved to cool storage if they haven't been modified for 30 days.

   :::image type="content" source="media/lifecycle-management-policy-configure/lifecycle-management-base-blobs.png" alt-text="Lifecycle management base blobs page in Azure portal":::

   > [!IMPORTANT]
   > The last access time tracking preview is for non-production use only. Production service-level agreements (SLAs) are not currently available.

   To use the **Last accessed** option, select **Access tracking enabled** on the **Lifecycle Management** page in the Azure portal. For more information about the **Last accessed** option, see [Move data based on last accessed date (preview)](#move-data-based-on-last-accessed-date-preview).

1. If you selected **Limit blobs with filters** on the **Details** page, select **Filter set** to add an optional filter. The following example filters on blobs in the *mylifecyclecontainer* container that begin with "log".

   :::image type="content" source="media/lifecycle-management-policy-configure/lifecycle-management-filter-set.png" alt-text="Lifecycle management filter set page in Azure portal":::

1. Select **Add** to add the new policy.

#### Azure portal Code view

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and select your storage account.

1. Under **Blob service**, select **Lifecycle Management** to view or change your policy.

1. The following JSON is an example of a policy that can be pasted into the **Code View** tab.

   ```json
   {
     "rules": [
       {
         "enabled": true,
         "name": "move-to-cool",
         "type": "Lifecycle",
         "definition": {
           "actions": {
             "baseBlob": {
               "tierToCool": {
                 "daysAfterModificationGreaterThan": 30
               }
             }
           },
           "filters": {
             "blobTypes": [
               "blockBlob"
             ],
             "prefixMatch": [
               "mylifecyclecontainer/log"
             ]
           }
         }
       }
     ]
   }
   ```

1. Select **Save**.

1. For more information about this JSON example, see the [Policy](#policy) and [Rules](#rules) sections.

# [PowerShell](#tab/azure-powershell)

The following PowerShell script can be used to add a policy to your storage account. The `$rgname` variable must be initialized with your resource group name. The `$accountName` variable must be initialized with your storage account name.

```powershell
#Install the latest module
Install-Module -Name Az -Repository PSGallery

#Initialize the following with your resource group and storage account names
$rgname = ""
$accountName = ""

#Create a new action object
$action = Add-AzStorageAccountManagementPolicyAction -BaseBlobAction Delete -daysAfterModificationGreaterThan 2555
$action = Add-AzStorageAccountManagementPolicyAction -InputObject $action -BaseBlobAction TierToArchive -daysAfterModificationGreaterThan 90
$action = Add-AzStorageAccountManagementPolicyAction -InputObject $action -BaseBlobAction TierToCool -daysAfterModificationGreaterThan 30
$action = Add-AzStorageAccountManagementPolicyAction -InputObject $action -SnapshotAction Delete -daysAfterCreationGreaterThan 90

# Create a new filter object
# PowerShell automatically sets BlobType as “blockblob” because it is the only available option currently
$filter = New-AzStorageAccountManagementPolicyFilter -PrefixMatch ab,cd

#Create a new rule object
#PowerShell automatically sets Type as “Lifecycle” because it is the only available option currently
$rule1 = New-AzStorageAccountManagementPolicyRule -Name Test -Action $action -Filter $filter

#Set the policy
Set-AzStorageAccountManagementPolicy -ResourceGroupName $rgname -StorageAccountName $accountName -Rule $rule1
```

# [Template](#tab/template)

You can define lifecycle management by using Azure Resource Manager templates. Here is a sample template to deploy a RA-GRS GPv2 storage account with a lifecycle management policy.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {
    "storageAccountName": "[uniqueString(resourceGroup().id)]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "apiVersion": "2019-04-01",
      "sku": {
        "name": "Standard_RAGRS"
      },
      "kind": "StorageV2",
      "properties": {
        "networkAcls": {}
      }
    },
    {
      "name": "[concat(variables('storageAccountName'), '/default')]",
      "type": "Microsoft.Storage/storageAccounts/managementPolicies",
      "apiVersion": "2019-04-01",
      "dependsOn": [
        "[variables('storageAccountName')]"
      ],
      "properties": {
        "policy": {...}
      }
    }
  ],
  "outputs": {}
}
```

---

## See also

[Configure a lifecycle management policy](lifecycle-management-policy-configure.md)