---
title: 'Tutorial: Use a managed identity to access Azure Cosmos DB - Windows'
description: A tutorial that walks you through the process of using a system-assigned managed identity on a Windows VM, to access Azure Cosmos DB.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: 
ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurepowershell, ignite-2022
ROBOTS: NOINDEX
---

# Tutorial: Use a Windows VM system-assigned managed identity to access Azure Cosmos DB

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a system-assigned managed identity for a Windows virtual machine (VM) to access Azure Cosmos DB. You learn how to:

> [!div class="checklist"]
> * Create an Azure Cosmos DB account
> * Grant a Windows VM system-assigned managed identity access to the Azure Cosmos DB account access keys
> * Get an access token using the Windows VM system-assigned managed identity to call Azure Resource Manager
> * Get access keys from Azure Resource Manager to make Azure Cosmos DB calls

## Prerequisites

- If you're not familiar with the managed identities for Azure resources feature, see this [overview](overview.md). 
- If you don't have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- To perform the required resource creation and role management, your account needs "Owner" permissions at the appropriate scope (your subscription or resource group). If you need assistance with role assignment, see [Assign Azure roles to manage access to your Azure subscription resources](../../role-based-access-control/role-assignments-portal.md).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell)
- You also need a Windows Virtual machine that has system assigned managed identities enabled.
  - If you need to create  a virtual machine for this tutorial, you can follow the article titled [Create a virtual machine with system-assigned identity enabled](./qs-configure-portal-windows-vm.md#system-assigned-managed-identity)

## Create an Azure Cosmos DB account 

If you don't already have one, create an Azure Cosmos DB account. You can skip this step and use an existing Azure Cosmos DB account. 

1. Click the **+ Create a resource** button found on the upper left-hand corner of the Azure portal.
2. Click **Databases**, then **Azure Cosmos DB**, and a new "New account" panel  displays.
3. Enter an **ID** for the Azure Cosmos DB account, which you use later.  
4. **API** should be set to "SQL." The approach described in this tutorial can be used with the other available API types, but the steps in this tutorial are for the SQL API.
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.  Select a **Location** where Azure Cosmos DB is available.
6. Click **Create**.

### Create a collection 

Next, add a data collection in the Azure Cosmos DB account that you can query in later steps.

1. Navigate to your newly created Azure Cosmos DB account.
2. On the **Overview** tab click the **+/Add Collection** button, and an "Add Collection" panel slides out.
3. Give the collection a database ID, collection ID, select a storage capacity, enter a partition key, enter a throughput value, then click **OK**.  For this tutorial, it is sufficient to use "Test" as the database ID and collection ID, select a fixed storage capacity and lowest throughput (400 RU/s).  


## Grant access

This section shows how to grant Windows VM system-assigned managed identity access to the Azure Cosmos DB account access keys. Azure Cosmos DB does not natively support Microsoft Entra authentication. However, you can use a system-assigned managed identity to retrieve an Azure Cosmos DB access key from Resource Manager, and use the key to access Azure Cosmos DB. In this step, you grant your Windows VM system-assigned managed identity access to the keys to the Azure Cosmos DB account.

To grant the Windows VM system-assigned managed identity access to the Azure Cosmos DB account in Azure Resource Manager using PowerShell, update the following values:

- `<SUBSCRIPTION ID>`
- `<RESOURCE GROUP>`
- `<COSMOS DB ACCOUNT NAME>`

Azure Cosmos DB supports two levels of granularity when using access keys:  read/write access to the account, and read-only access to the account.  Assign the `DocumentDB Account Contributor` role if you want to get read/write keys for the account, or assign the `Cosmos DB Account Reader Role` role if you want to get read-only keys for the account.  For this tutorial, assign the `Cosmos DB Account Reader Role`:

```azurepowershell
$spID = (Get-AzVM -ResourceGroupName myRG -Name myVM).identity.principalid
New-AzRoleAssignment -ObjectId $spID -RoleDefinitionName "Cosmos DB Account Reader Role" -Scope "/subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.DocumentDb/databaseAccounts/<COSMOS DB ACCOUNT NAME>"
```

>[!NOTE]
> Keep in mind that if you are unable to perform an operation you may not have the right permissions. If you want write access to keys you need to use an Azure role such as DocumentDB Account Contributor or create a custom role. For more information review [Azure role-based access control in Azure Cosmos DB](../../cosmos-db/role-based-access-control.md)

## Access data

This section shows how to call Azure Resource Manager using an access token for the Windows VM system-assigned managed identity. For the remainder of the tutorial, we will work from the VM we created earlier. 

You need to install the latest version of [Azure CLI](/cli/azure/install-azure-cli) on your Windows VM.

### Get an access token

1. In the Azure portal, navigate to **Virtual Machines**, go to your Windows virtual machine, then from the **Overview** page click **Connect** at the top. 
2. Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3. Now that you have created a **Remote Desktop Connection** with the virtual machine, open PowerShell in the remote session.
4. Using PowerShell’s Invoke-WebRequest, make a request to the local managed identities for Azure resources endpoint to get an access token for Azure Resource Manager.

   ```powershell
   $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -Method GET -Headers @{Metadata="true"}
   ```

   > [!NOTE]
   > The value of the "resource" parameter must be an exact match for what is expected by Microsoft Entra ID. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    
   Next, extract the "Content" element, which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object. 
    
   ```powershell
   $content = $response.Content | ConvertFrom-Json
   ```
   Next, extract the access token from the response.
    
   ```powershell
   $ArmToken = $content.access_token
   ```

### Get access keys 

This section shows how to get access keys from Azure Resource Manager to make Azure Cosmos DB calls. We are using PowerShell to call Resource Manager using the access token we got earlier to retrieve the Azure Cosmos DB account access key. Once we have the access key, we can query Azure Cosmos DB. Use your own values to replace the entries below:

- `<SUBSCRIPTION ID>`
- `<RESOURCE GROUP>`
- `<COSMOS DB ACCOUNT NAME>` 
- Replace the `<ACCESS TOKEN>` value with the access token you retrieved earlier. 

>[!NOTE]
>If you want to retrieve read/write keys, use key operation type `listKeys`.  If you want to retrieve read-only keys, use the key operation type `readonlykeys`. If you are unable to use 'listkeys' verify that you assigned the [appropriate role](../../role-based-access-control/built-in-roles.md#cosmos-db-account-reader-role) to the managed identity.

```powershell
Invoke-WebRequest -Uri 'https://management.azure.com/subscriptions/<SUBSCRIPTION-ID>/resourceGroups/<RESOURCE-GROUP>/providers/Microsoft.DocumentDb/databaseAccounts/<COSMOS DB ACCOUNT NAME>/readonlykeys/?api-version=2016-03-31' -Method POST -Headers @{Authorization="Bearer $ARMToken"}
```
The response gives you the list of Keys.  For example, if you get read-only keys:

```powershell
{"primaryReadonlyMasterKey":"bWpDxS...dzQ==",
"secondaryReadonlyMasterKey":"38v5ns...7bA=="}
```

Now that you have the access key for the Azure Cosmos DB account you can pass it to an Azure Cosmos DB SDK and make calls to access the account.

## Disable

[!INCLUDE [msi-tut-disable](../../../includes/active-directory-msi-tut-disable.md)]

## Next steps

In this tutorial, you learned how to use a Windows VM system-assigned identity to access Azure Cosmos DB. To learn more about Azure Cosmos DB, see:

> [!div class="nextstepaction"]
>[Azure Cosmos DB overview](../../cosmos-db/introduction.md)
