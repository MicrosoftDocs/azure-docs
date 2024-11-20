---
title: Configure data boundary
description: Learn how to configure data boundary.
ms.topic: how-to
ms.date: 11/20/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an Azure user, I want to create a new data boundary.
---

# Configure data boundary

This article explains how customers can configure Azure Resource Manager to operate within a data boundary. A global data boundary has no restrictions on the regions a resource can deploy to. However a nonglobal data boundary restricts resource deployments to regions within that boundary. The only nonglobal data boundary currently supported is for the European Union (EU). The EU Data Boundary is a geographically defined boundary within which Microsoft commits to store and process customer data and pseudonymized personal data, and store professional services data for Microsoft enterprise online services, including Azure, Dynamics 365, Power Platform, and Microsoft 365, subject to limited circumstances where personal data continue to be transferred outside the EU Data Boundary. For more information, see [Overview of the EU Data Boundary](/privacy/eudb/eu-data-boundary-learn).

A global data boundary can only be established in a new tenant that has no existing subscriptions or deployed resources. To opt a new tenant into a data boundary, deploy a `Microsoft.Resources/dataBoundaries` resource at the tenant level. Each tenant is limited to one data boundary. Once a tenant is opted into a data boundary, the data boundary configuration can't be removed or modified. Subscriptions and resources created under a tenant with a data boundary can't be moved out of that tenant.

To opt your tenant into an Azure EU Data Boundary:

- Create a new tenant within an EU country or region for configuring a Microsoft Entra EU Data Boundary. For more information, see [Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).
- Before creating any new subscriptions or resources under the tenant, deploy a `Microsoft.Resources/dataBoundaries` resource with an EU configuration.
- Create a subscription and deploy Azure resources.  

## Permissions required

To configure data boundary, the `DataBoundaryTenantAdministrator` built-in role is required at the tenant scope.  Use the following steps to assign the role:

- Elevate access to manage all Azure subscriptions and management groups. For more information, see [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md).
- With the User Access Administrator privilege, grant yourself the `DataBoundaryTenantAdministrator` role at the tenant scope (`/`) by using Azure CLI or Azure PowerShell or REST API.

  # [Azure CLI](#tab/azure-cli)

  ```azurecli
  DATA_BOUNDARY_TENANT_ADMINISTRATOR_ROLE_ID="d1a38570-4b05-4d70-b8e4-1100bcf76d12"
  
  az role assignment create --assignee "{assignee}" --role DATA_BOUNDARY_TENANT_ADMINISTRATOR_ROLE_ID --scope "/"
  ```

  # [PowerShell](#tab/azure-powershell)

  ```azurepowershell
  $dataBoundaryTenantAdministratorRoleDefinitionId = "d1a38570-4b05-4d70-b8e4-1100bcf76d12"
  
  New-AzRoleAssignment -ObjectId <objectId> -RoleDefinitionId $dataBoundaryTenantAdministratorRoleDefinitionId -Scope "/"
  ```

  # [REST API](#tab/rest-api)
  
  ```http
  PUT https://management.azure.com/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}?api-version=2020-04-01-preview
  ```
  
  Request body:
  
  ```json
  {
    "properties": {
      "roleDefinitionId": "/providers/Microsoft.Authorization/roleDefinitions/d1a38570-4b05-4d70-b8e4-1100bcf76d12",
      "principalId": "{assignee}"
    }
  }
  ```
  
  ```Response body:
  
  ```json 
  {
    "id": "/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}",
    "type": "Microsoft.Authorization/roleAssignments",
    "name": "{roleAssignmentName}",
    "properties": {
      "roleDefinitionId": "/providers/Microsoft.Authorization/roleDefinitions/d1a38570-4b05-4d70-b8e4-1100bcf76d12",
      "principalId": "{assignee}",
      "principalType": "User", // Could also be "Group", "ServicePrincipal", etc.
    }
  }
  ```

  ---

For more information, see [Assign Azure roles](../../role-based-access-control/role-assignments-powershell.md).

## Create data boundary

To opt in a tenant to data boundary, use the following commands.

# [Azure CLI](#tab/azure-cli)

```azurecli
az data-boundary create --data-boundary <data-boundary-geo> --default default
```

The `--default` switch is currently mandatory but will be phased out in the future.

For more information, see [Azure CLI Reference](/cli/azure/reference-index).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzDataBoundary -DataBoundary <data-boundary-geo>
```

For more information, see [Azure PowerShell Reference](/powershell/module/az.resources).

# [REST API](#tab/rest-api)

```http
PUT https://management.azure.com/providers/Microsoft.Resources/dataBoundaries/default?api-version=2024-08-01 
```

Request body:

```json
{ 
  "properties": { 
    "dataBoundary": "<data-boundary-geo>" 
  } 
} 
```

```Response body:

```json
{ 
  "name": "{tenantId}", 
  "id": " /providers/Microsoft.Resources/dataBoundaries/{tenantId}",   
  "properties": { 
    "dataBoundary": "{dataBoundaryGeo}", 
    "provisioningState": "Created" 
  } 
} 
```

For more information, see [Azure REST API Reference](/rest/api/azure/).

---

Data boundary geo currently has two options:

|Data boundary geo | Description |
|------|-------------|
|Global| By default, all tenants have a global data boundary. |
|EU    | Establish an EU data boundary. |

## Read data boundary

To get data boundary at specified scopes. The scopes include:

| Scope | Value |
|-------|-------|
|Tenant | (empty) |
|Subscription | subscriptions/{subscriptionId} |
|Resource group | subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName} |

# [Azure CLI](#tab/azure-cli)

```azurecli
az data-boundary show --scope <scope-path> --default default
```

Get data boundary of tenant:

```azurecli
az data-boundary show-tenant --default default
```

The `--default` switch is currently mandatory but will be phased out in the future.

For more information, see [Azure CLI Reference](/cli/azure/reference-index).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzDataBoundaryScope -Scope <scope-path>
```

Get data boundary of tenant:

```azurepowershell
Get-AzDataBoundaryTenant
```

For more information, see [Azure PowerShell Reference](/powershell/module/az.resources).

# [REST API](#tab/rest-api)

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Resources/dataBoundaries/default?api-version=2024-08-01 
```

Response body:

```json
{ 
  "name": "{tenantId}", 
  "id": " /providers/Microsoft.Resources/dataBoundaries/{tenantId}",   
  "properties": { 
    "dataBoundary": "{dataBoundaryGeo}", 
    "provisioningState": "Succeeded" 
  } 
} 
```

For more information, see [Azure REST API Reference](/rest/api/azure/).

---

## Next steps

For more information, see [Overview of the EU Data Boundary](/privacy/eudb/eu-data-boundary-learn).
