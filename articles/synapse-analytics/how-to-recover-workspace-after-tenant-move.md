---
title: Recovering Synapse Analytics workspace after transferring a subscription to a different Azure AD directory 
description: This article provides steps to recover the Synapse Analytics workspace after moving a subscription to a different Azure AD directory (tenant)
services: synapse-analytics 
ms.service:  synapse-analytics 
ms.topic: how-to
# ms.subservice: spark
ms.date: 04/11/2022
author: matt1883
ms.author: mahi
ms.reviewer: wiassaf
---

# Recovering Synapse Analytics workspace after transferring a subscription to a different Azure AD directory (tenant)

This article describes how to recover the Synapse Analytics workspace after transferring its subscription to a different Azure AD directory. The Synapse Analytics workspace will not be accessible after transferring a subscription to a different Azure AD directory (tenant). 

When you try to launch the Synapse studio after the move, you will see the error: "Failed to load one or more resources due to no access, error code 403."

:::image type="content" source="media/how-to-tenant-move/azure-synapse-analytics-identity-403-error-tenantmove.png" alt-text="Screenshot of Synapse Studio Error 403 after tenant migration.":::

Follow the steps in this article after transferring a subscription across tenant to recover the Synapse Analytics workspace.

Transferring a subscription to a different Azure AD directory (tenant) is a complex process that must be carefully planned and executed. Azure Synapse Analytics require security principals (identities) to operate normally. When a subscription is moved to a different tenant, all principal IDs change, role assignments are deleted from Azure resource, and system assigned managed identities are dropped.

To understand the impact of transferring a subscription to another tenant see [Transfer an Azure subscription to a different Azure AD directory](../role-based-access-control/transfer-subscription.md)

This article covers the steps involved in recovering a Synapse Analytics workspace after moving the subscription across tenants.

## Pre-requisites

- To know more about service or resources impacted by tenant move see [Transfer an Azure subscription to a different Azure AD directory](../role-based-access-control/transfer-subscription.md).
- Save all the role assignment for Azure Active Directory (Azure AD) users, groups, and managed identities. This information can be used to assign the required permissions on Azure resources like Azure Synapse Analytics and ADLS Gen2 after tenant move. See [Step 1: Prepare for the transfer](../role-based-access-control/transfer-subscription.md#step-1-prepare-for-the-transfer)
- Save all the permissions necessary for Azure AD users in dedicated and serverless SQL pool. Azure AD users will be deleted from the dedicated and serverless SQL pools after tenant move.


## Steps for recovering Synapse Analytics workspace

After transferring the subscription to another tenant, follow the below steps to recover the Azure Synapse Analytics workspace.

1. [Disable and re-enable the system Assigned Managed Identity](#disablereenable). More information later in this article.
2. [Assign Azure RBAC (role based access control) permissions to the required Azure AD users, groups, and managed identities](../role-based-access-control/transfer-subscription.md#step-3-re-create-resources) on the Synapse Analytics workspace and required Azure resources.
3. [Set the SQL Active Directory admin.](/azure/azure-sql/database/authentication-aad-configure?tabs=azure-powershell#provision-azure-ad-admin-sql-database)
4. Re-create [Azure AD users and groups](sql/sql-authentication.md?tabs=provisioned#non-administrator-users) based on their equivalent users and groups in the new Azure AD tenant for the dedicated and serverless SQL pools.
5. Assign Azure RBAC to Azure AD users, groups to Synapse Analytics workspace. This step should be first step after recovering the workspace. Without this step, launching Synapse Studio will throw 403 messages, due to Azure AD users not having permissions on the workspace:
   ```JSON
   {"error":{"code":"Unauthorized","message":"The principal '<subscriptionid>' does not    have the required Synapse RBAC permission to perform this action. Required permission:    Action: Microsoft.Synapse/workspaces/read, Scope: workspaces/tenantmove-ws-1/*."}}
   ```
6. Assign Azure RBAC roles to Azure AD users, groups, service principals to all the resources used in the workspace artifacts, such as ADLS Gen2. For more information on Azure RBAC in ADLS Gen2, see [Role-based access control (Azure RBAC)](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control-azure-rbac).
7. Add Synapse RBAC role assignments to Azure AD users and groups. For more information, see [How to manage Synapse RBAC role assignments in Synapse Studio](security/how-to-manage-synapse-rbac-role-assignments.md) 
8. Recreate all the Azure AD logins and users in dedicated and serverless SQL pool. For more information, see [SQL Authentication in Azure Synapse Analytics](sql/sql-authentication.md)
9. Recreate all user assigned managed identity and assign user-assigned managed identity to the Synapse Analytics workspace. For more information, see [Credentials in Azure Data Factory and Azure Synapse](../data-factory/credentials.md)

> [!NOTE]
> Ensure the following steps are executed only after confirming subscription is successfully moved to another tenant.  

## <a id="disablereenable"></a> Disable and re-enable the system assigned managed identity for the Synapse Analytics workspace

This section shows you how to use Azure CLI or Azure PowerShell to disable and re-enable the System-assigned Managed Identity for your Azure Synapse Analytics workspace. Consider the following steps in either Azure CLI or Azure PowerShell.

### [Azure CLI](#tab/azurecli)

```azurecli
$resourceGroupName="Provide the Resource group name"
$workspaceName="Provide the workspace name"
$subscriptionId="Provide the subscription Id"

$url = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Synapse/workspaces/$workspaceName\?api-version=2021-06-01"
```

This next sample disables System Assigned Managed Identity for the workspace.

```azurecli
az rest --method patch --headers  Content-Type=application/json   `
--url  $url `
--body '{ \"identity\":{\"type\":\"None\"}}'
```

Workspace `provisioningState` should be **Succeeded** and the identity type should **None** after preceding command is executed. If you execute the following command, `provisioningState` value might be shown as Provisioning and will take few minutes to change the status to Succeeded. Value of the `provisioningState` should be Succeeded before re-enabling the System Assigned Managed Identity for the workspace.

To get the status of the workspace to get the provisioning status and identity type, use the following code snippet:
```azurecli
az rest --method GET --uri $uri
```

The resulting JSON should be similar to:

```JSON
   {
  "id": "/subscriptions/<subscriptionid>/resourceGroups/TenantMove-RG/providers/Microsoft Synapse/workspaces/tenantmove-ws",
  "identity": {
    "type": "None"
  },
  "location": "eastus",
  "name": "tenantmove-ws",
  "properties": {
    "connectivityEndpoints": {
      "dev": "https://tenantmove-ws.dev.azuresynapse.net",
      "sql": "tenantmove-ws.sql.azuresynapse.net",
      "sqlOnDemand": "tenantmove-ws-ondemand.sql.azuresynapse.net",
      "web": "https://web.azuresynapse.net?workspace=%2fsubscriptions%2<subscriptionid>b%2fresourceGroups%2fTenantMove-RG%2fproviders%2fMicrosoft.Synapse%2fworkspaces%2ftenantmove-ws"
    },
    "cspWorkspaceAdminProperties": {
      "initialWorkspaceAdminObjectId": "<object id>"
    },
    "defaultDataLakeStorage": {
      "accountUrl": "https://tenantmovedemowsstorage.dfs.core.windows.net",
      "filesystem": "demo",
      "resourceId": "/subscriptions/<subscriptionid>/resourceGroups/TenantMove-RG/providers/Microsoft.Storage/storageAccounts/tenantmovedemowsstorage"
    },
    "encryption": {
      "doubleEncryptionEnabled": false
    },
    "extraProperties": {
      "WorkspaceType": "Normal"
    },
    "managedResourceGroupName": "tenantmove-ws-managed-rg",
    "privateEndpointConnections": [],
    "provisioningState": "Succeeded",
    "publicNetworkAccess": "Enabled",
    "sqlAdministratorLogin": "sqladminuser",
    "trustedServiceBypassEnabled": false,
    "workspaceUID": "<workspace UID>"
  },
  "resourceGroup": "TenantMove-RG",
  "tags": {},
  "type": "Microsoft.Synapse/workspaces"
}
```

The next command will re-enable the System Assigned Managed Identity for the workspace:

```azurecli
az rest --method patch --headers  Content-Type=application/json   `
--url  $url `
--body '{ \"identity\":{\"type\":\"SystemAssigned\"}}'
```

The next command will get you workspace status. The `provisioningState` value should be Succeeded. The `provisioningState` value will change from Provisioning to Succeeded. Identity type will be changed to **SystemAssigned**.

```azurecli
az rest --method GET --uri $uri
```

### [Azure PowerShell](#tab/azurepowershell)


```azurepowershell
Connect-AzAccount
$subscriptionId="Provide the subscription ID (GUID) of the subscription containing your Azure Synapse Analytics workspace"
$resourceGroupName="Provide the name of the resource group containing your workspace"
$workspaceName="Provide the name of your workspace"

$token = (Get-AzAccessToken -ResourceUrl "https://management.azure.com/").Token
$header = @{Authorization="Bearer $token"}

$url = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Synapse/workspaces/$workspaceName\?api-version=2021-06-01" 
```

The below command will get the status of the workspace.

```azurepowershell
(Invoke-WebRequest -Method GET -Uri $url -ContentType $contentType -Headers $header).Content|ConvertFrom-Json
```

:::image type="content" source="media/how-to-tenant-move/azure-synapse-analytics-workspace-status.png" alt-text="Screenshot of the Workspace Status PowerShell.":::

Run the following command to disable the System Assigned Managed Identity for the workspace.

```azurepowershell
$bodyJson = @{identity= @{type='None'}}| ConvertTo-Json
Invoke-RestMethod -Method PATCH -Uri $url -ContentType $contentType -Headers $header -Body  $bodyJson;
``` 
:::image type="content" source="media/how-to-tenant-move/azure-synapse-analytics-workspace-put-none.png" alt-text="Screen shot of how to Disable SAMI PowerShell.":::

In the previous screenshot, the `provisioningState` value is Provisioning and not Succeeded. It takes few minutes to change the status to Succeeded. Before re-enabling the System Assigned Managed Identity for the workspace, the `provisioningState` value should be Succeeded.

Run the following command to re-enable the System Assigned Managed Identity for the workspace.

```azurepowershell
$bodyJson = @{identity= @{type='SystemAssigned'}}| ConvertTo-Json

Invoke-RestMethod -Method PATCH -Uri $url -ContentType $contentType -Headers $header -Body  $bodyJson
```

Execute the following command to check the provisioningState value and the Identity type for the workspace.

```azurepowershell
(Invoke-WebRequest -Method GET -Uri $url -ContentType $contentType -Headers $header).Content|ConvertFrom-Json
```

:::image type="content" source="media/how-to-tenant-move/azure-synapse-analytics-identity-type-systemassigned.png" alt-text="Screenshot of an Identity type System Assigned.":::

---

## Next steps

- [Transfer an Azure subscription to a different Azure AD directory](../role-based-access-control/transfer-subscription.md)
- [Move an Azure Synapse Analytics workspace from one region to another](how-to-move-workspace-from-one-region-to-another.md)
- [Assign Azure RBAC (role based access control) permissions to the required Azure AD users, groups, and managed identities](../role-based-access-control/transfer-subscription.md#step-3-re-create-resources)
- [How to manage Synapse RBAC role assignments in Synapse Studio](security/how-to-manage-synapse-rbac-role-assignments.md) 