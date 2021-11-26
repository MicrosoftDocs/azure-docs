---
title: Recovering Synapse Workspace after transferring a subscription to a different Azure AD directory 
description: This article provides steps to recover the Synapse workspace after moving a subscription to a different Azure AD directory(Tenant)
services: synapse-analytics 
author:  phanir
ms.service:  synapse-analytics 
ms.topic: how-to
# ms.subservice: spark
ms.date: 11/23/2021
ms.author: phanir
ms.reviewer: 
---

# Recovering Synapse Workspace after transferring a subscription to a different Azure AD directory (Tenant)

Synapse workspace will not accessible after transferring a subscription to a different Azure AD directory(tenant). When you try to launch the Synapse studio after the move, you will see the below error.
:::image type="content" source="media/how-to-tenant-move/403Error-TenantMove.png" alt-text="SynapseStudioError":::

There are set of steps mentioned in this article, which should be followed after transferring a subscription across tenant to recover the Synapse workspace. 

Transferring a subscription to a different Azure AD directory(tenant) is a complex process that must be carefully planned and executed. Azure Synapse Analytics require security principals (identities) to operate normally. When a subscription is moved to a different tenant, then all principal Id's changes, role assignments are deleted from Azure resource and System assigned managed identity will be dropped as well.

To understand the impact of transferring a subscription to another tenant see [Transfer an Azure subscription to a different Azure AD directory](../role-based-access-control/transfer-subscription.md)

This article covers the steps involved in recovering a Synapse Workspace after moving the subscription across tenants.

## Pre-requisites

- To know more about service or resources impacted by tenant move see [Transfer an Azure subscription to a different Azure AD directory](../role-based-access-control/transfer-subscription.md) .
- Save all the role assignment for AAD users, groups, and Managed Identities. This information can be used to assign the required permissions on Azure resources like Azure Synapse Analytics, ADLS gen-2 after tenant move. See [Step 1: Prepare for the transfer](../role-based-access-control/transfer-subscription.md#step-1-prepare-for-the-transfer)
- Save all the permissions give to AAD users in dedicated and serverless SQL pool. AAD users will be deleted from the dedicated and Serverless SQL pool after tenant move.


## Steps for recovering Synapse Workspace

After transferring the subscription to another tenant, follow the below steps to recover the Azure Synapse workspace.

1. Disable  System Assigned Managed Identity.
1. Re-enable System Assigned Managed Identity.
1. Assign the RBAC to the required AAD users, groups on the Synapse Workspace and required Azure resources.
1. Set the SQL Active Directory admin.
1. Create Azure AD users and groups in dedicated and Serverless SQL pool.

> [!NOTE]
> Ensure the following steps are executed only after confirming subscription is successfully moved to another tenant.  

## Disable and Re-enable System Assigned Managed Identity for Synapse workspace

### Azure CLI

This section shows you how to use Azure CLI to disable and re-enable System Assigned Managed Identity for Synapse workspace.

```azurecli
$resourceGroupName="Provide the Resource group name"
$workspaceName="Provide the workspace name"
$subscriptionId="Provide the subscription Id"

$url = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Synapse/workspaces/$workspaceName\?api-version=2021-06-01"

# Disables System Assigned Managed Identity for the workspace
az rest --method patch --headers  Content-Type=application/json   `
--url  $url `
--body '{ \"identity\":{\"type\":\"None\"}}'
```
Workspace ProvisioningState should be **Succeeded** and the identity type should **None** after preceding command is executed. If you execute the following command, provisioningState value might be shown as Provisioning and will take few minutes to change the status to Succeeded. Value of the provisioningState should be Succeeded before re-enabling the System Assigned Managed Identity for the workspace.

```azurecli
# Get the status of the workspace to get the provisioning status and identity type.
az rest --method GET --uri $uri

```
```JSON
   {
  "id": "/subscriptions/7000-35c5-00e-00-000/resourceGroups/TenantMove-RG/providers/Microsoft Synapse/workspaces/tenantmove-ws",
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
      "web": "https://web.azuresynapse.net?workspace=%2fsubscriptions%27000-35c5-00e-00-000b%2fresourceGroups%2fTenantMove-RG%2fproviders%2fMicrosoft.Synapse%2fworkspaces%2ftenantmove-ws"
    },
    "cspWorkspaceAdminProperties": {
      "initialWorkspaceAdminObjectId": "94bcefe7-5fe0-4327-9ab7-3044f469d238"
    },
    "defaultDataLakeStorage": {
      "accountUrl": "https://tenantmovedemowsstorage.dfs.core.windows.net",
      "filesystem": "demo",
      "resourceId": "/subscriptions/7000-35c5-00e-00-000/resourceGroups/TenantMove-RG/providers/Microsoft.Storage/storageAccounts/tenantmovedemowsstorage"
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
    "workspaceUID": "fc823420-13e6-418b-a85a-435a2dd215eb"
  },
  "resourceGroup": "TenantMove-RG",
  "tags": {},
  "type": "Microsoft.Synapse/workspaces"
}

   ```

Below command will re-enable the System Assigned Managed Identity for the workspace.

```azurecli
az rest --method patch --headers  Content-Type=application/json   `
--url  $url `
--body '{ \"identity\":{\"type\":\"SystemAssigned\"}}'
```

Below command will give you workspace status. ProvisioningState value should be **succeeded**. ProvisioningState value will be changing from provisioning to Succeeded. Identity type will be changed to **SystemAssigned** 

```azurecli
az rest --method GET --uri $uri
```

### Azure PowerShell 

This section shows you how to use Azure PowerShell to disable and re-enable System Assigned Managed Identity for Synapse workspace.

```azurepowershell

$AppId="Provide App Id"
$AppSecret="Provide App secret"
$TenantId="Provide the Tenant Id" 
$resourceGroupName="Provide the Resource Group name having Synapse Workspace"
$workspaceName="Provide the Workspace Name"
$subscriptionId="Provide Subscription Id"

function getBearerToken()
{
  $tokenEndpoint = {https://login.microsoftonline.com/{0}/oauth2/token} -f $TenantId
  $resourceURL = "https://management.azure.com/";

  $Body = @{
          'resource'= $resourceURL
          'client_id' = $AppId
          'grant_type' = 'client_credentials'
          'client_secret' = $AppSecret
          
  }

  $params = @{
      ContentType = 'application/x-www-form-urlencoded'
      Headers = @{'accept'='application/json'}
      Body = $Body
      Method = 'Post'
      URI = $tokenEndpoint
  }

  $token = Invoke-RestMethod @params

  Return "Bearer " + ($token.access_token).ToString()
}

$contentType = "application/json"      
$basicAuth = getBearerToken
$header = @{
     "authorization" = "$basicAuth"
};

$url = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Synapse/workspaces/$workspaceName\?api-version=2021-06-01" 

# Below command will get the status of the workspace.

(Invoke-WebRequest -Method GET -Uri $url -ContentType $contentType -Headers $header).Content|ConvertFrom-Json

```
:::image type="content" source="media/how-to-tenant-move/Workspace_Status.png" alt-text="Workspace Status PowerShell":::

Run the following command to disable the System Assigned Managed Identity for the workspace.

```azurepowershell
$bodyJson = @{identity= @{type='None'}}| ConvertTo-Json
Invoke-RestMethod -Method PATCH -Uri $url -ContentType $contentType -Headers $header -Body  $bodyJson;
``` 
:::image type="content" source="media/how-to-tenant-move/Workspace_Put_None.png" alt-text="Disable SAMI PowerShell":::

As you can see from the above screenshot that the ProvisioningState value is Provisioning and not Succeeded. It takes few minutes to change the status to Succeeded. Before re-enabling the System Assigned Managed Identity for the workspace, the ProvisioningState value should be Succeeded.

Run the following command to re-enable the System Assigned Managed Identity for the workspace.

```azurepowershell
$bodyJson = @{identity= @{type='SystemAssigned'}}| ConvertTo-Json

Invoke-RestMethod -Method PATCH -Uri $url -ContentType $contentType -Headers $header -Body  $bodyJson

```
Execute the following command to check the ProvisioningState value and the Identity type for the workspace.
```azurepowershell
(Invoke-WebRequest -Method GET -Uri $url -ContentType $contentType -Headers $header).Content|ConvertFrom-Json
```
:::image type="content" source="media/how-to-tenant-move/Identity_Type_SystemAssigned.png" alt-text="Identity type System Assigned":::

## Next steps

After recovering the Synapse workspace perform the following steps.

- Assign RBAC to AAD users, groups to Synapse Workspace. This step should be first step after recovering the workspace. Without this step, launching the Synapse studio will throw 403 messages due to AAD users not having permissions on the workspace. 
``` Error
{"error":{"code":"Unauthorized","message":"The principal '94bcefe7-5fe0-4327-9ab7-3044f469d238' does not have the required Synapse RBAC permission to perform this action. Required permission: Action: Microsoft.Synapse/workspaces/read, Scope: workspaces/tenantmove-ws-1/*."}}
```
- Assign RBAC to AAD users, groups, service principals to all the resources used in the workspace artifacts like ADLS Gen-2. For RBAC on ADLS Gen-2 see [Role-based access control (Azure RBAC)](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control-azure-rbac).
- Add Synapse RBAC role assignments to AAD users, groups. For more information, see [How to manage Synapse RBAC role assignments in Synapse Studio](security/how-to-manage-synapse-rbac-role-assignments.md) 
- Recreate all the AAD logins and Users in dedicated and Serverless SQL pool. For more information, see [SQL Authentication](sql/sql-authentication.md)
- Recreate all user assigned managed identity and assign user-assigned managed identity to the Synapse workspace. For more details,see [Credentials in Azure Data Factory and Azure Synapse](../data-factory/credentials.md)



