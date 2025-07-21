---
title: Configure data boundary
description: Learn how to configure data boundary.
ms.topic: how-to
ms.date: 04/01/2025
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an Azure user, I want to create a new data boundary.
---

# Configure data boundary

This documentation provides details on how customers can configure Azure Resource Manager for use in a data boundary. The only data boundary configuration currently supported, aside from the default Global configuration, is for the European Union (EU). The EU Data Boundary is a geographically defined boundary within which Microsoft has committed to store and process Customer Data and pseudonymized personal data, and store Professional Services Data for Microsoft enterprise online services, including Azure, Dynamics 365, Power Platform, and Microsoft 365, subject to limited circumstances where personal data continue to be transferred outside the EU Data Boundary. For more information, see [Overview of the EU Data Boundary](/privacy/eudb/eu-data-boundary-learn).

> [!IMPORTANT]
> To store Professional Services Data in the EU Data Boundary for Azure, customers must configure Azure Resource Manager to the EU Data Boundary. This documentation provides details on how customers can configure Azure Resource Manager for use in the EU Data Boundary.  

A data boundary can only be established in new tenants that have no existing subscriptions or deployed resources. Once a tenant is opted into a data boundary, the data boundary configuration cannot be removed or modified. Subscriptions and resources created under a tenant with a data boundary cannot be moved out of that tenant. Existing subscriptions and resources cannot be moved into a tenant with a data boundary. Each tenant is limited to one data boundary, and after the data boundary is configured, Azure Resource Manager will restrict resource deployments to regions within that boundary. A Global data boundary has no restrictions on the regions a resource can deploy to. Customers can opt their tenants into a data boundary by deploying a `Microsoft.Resources/dataBoundaries` resource at the tenant level.

The `DataBoundaryTenantAdministrator` built-in role is required to configure data boundary. For more information, see [Permissions required](#permissions-required).

To opt your tenant into an Azure EU Data Boundary:

1. Create a new tenant within an EU country or region to configure a Microsoft Entra EU Data Boundary. For more information on how to create a new tenant within an EU country or region, see [Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).
1. Before creating any new subscriptions or resources, deploy a Microsoft.Resources/dataBoundaries resource with an EU configuration.
1. Create a subscription and deploy Azure resources.

## Permissions required

To configure data boundary, the `DataBoundaryTenantAdministrator` built-in role is required at the tenant scope.  Use the following steps to assign the role:

1. Elevate access to manage all Azure subscriptions and management groups. For more information, see [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md).
1. With the User Access Administrator privilege, grant yourself the `DataBoundaryTenantAdministrator` role at the tenant scope (`/`) by using Azure CLI or Azure PowerShell or REST API.

    ### [Azure portal](#tab/azure-portal)

    Not supported by the Azure portal. Use Azure CLI or Azure PowerShell or REST API instead.

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli
    DATA_BOUNDARY_TENANT_ADMINISTRATOR_ROLE_ID="d1a38570-4b05-4d70-b8e4-1100bcf76d12"
    
    az role assignment create --assignee "{assignee}" --role DATA_BOUNDARY_TENANT_ADMINISTRATOR_ROLE_ID --scope "/"
    ```

    ### [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    $dataBoundaryTenantAdministratorRoleDefinitionId = "d1a38570-4b05-4d70-b8e4-1100bcf76d12"
    
    New-AzRoleAssignment -ObjectId <objectId> -RoleDefinitionId $dataBoundaryTenantAdministratorRoleDefinitionId -Scope "/"
    ```

    ### [REST API](#tab/rest-api)

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

    Response body:

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

Data boundary geo currently has two options:

|Data boundary geo | Description |
|------|-------------|
|Global| By default, all tenants have a global data boundary. |
|EU    | Establish an EU data boundary. |

To opt in a tenant to data boundary, use the following commands.

### [Azure portal](#tab/azure-portal)

Use these steps to create a data boundary:

1. Open the [Azure portal](https://portal.azure.com).
1. In the search box, type **azure data boundaries**, and then select **Azure Data Boundaries**.
1. In **Boundary region**, select data boundary geo, either `Global` or `EU`, and then select **Save**.

    :::image type="content" source="./media/manage-data-boundary/azure-tenant-configure-data-boundary.png" alt-text="Screenshot of configuring data boundary.":::

  The `Boundary region` can only be configured for empty tenants.

### [Azure CLI](#tab/azure-cli)

```azurecli
az data-boundary create --data-boundary <data-boundary-geo> --default default
```

The `--default` switch is currently mandatory but will be phased out in the future.

For more information, see [Azure CLI Reference](/cli/azure/reference-index).

### [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzDataBoundary -DataBoundary <data-boundary-geo>
```

For more information, see [Azure PowerShell Reference](/powershell/module/az.resources).

### [REST API](#tab/rest-api)

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

## Read data boundary

To get data boundary at specified scopes. The scopes include:

| Scope | Value |
|-------|-------|
|Tenant | (empty) |
|Subscription | subscriptions/{subscriptionId} |
|Resource group | subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName} |

# [Azure portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com).
1. In the search box, type **azure data boundaries**, and then select **Azure Data Boundaries**. The following screenshot shows a `Global` data boundary.

    :::image type="content" source="./media/manage-data-boundary/azure-tenant-read-data-boundary.png" alt-text="Screenshot of showing data boundary.":::

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

## Troubleshooting

The following table lists the data boundary related error messages:

| Error code | Error message | Explanation |
|------------|---------------|-------------|
| NonEmptyTenantCannotChangeDataBoundary | Tenant \<tenant-name> already contains subscriptions. Data boundary update for non-empty tenants is not supported. | Customers can only apply an Azure data boundary to a brand new tenant with no management groups, subscriptions, or resources. |
| AuthorizationFailed | The client \<client-name> with object ID \<object-id> does not have authorization to perform action `Microsoft.Resources/dataBoundaries/write` over scope \<scope-name> or the scope is invalid. If access was recently granted, please refresh your credentials. | Ensure you have the Data Boundary Administrator role at the tenant scope. See [Permissions Required](#permissions-required). |
| InvalidResourceLocation <br/> InvalidResourceGroupLocation | Invalid resource group location \<region-name>. The tenant ID for the given subscription is opted into the \<data-boundary-geo> data boundary. The resource group location is restricted by the data boundary. List of regions in the data boundary is: \<region-list>. | Once a data boundary applies to a tenant, users can only create resources in regions within the data boundary. For example, users cannot create resources in *WestUS* if an EU data boundary is applied to the tenant. To resolve this error, pick a region from the list returned in the error message. |
| InvalidSubscriptionMoveDataBoundary | Transfer action failed. Transfer of this subscription is not allowed due to data boundary restrictions on the tenant. | It is not possible to move a subscription if the source or target tenants have a non-global data boundary. Subscription move is blocked even if the source and target tenants have the same data boundary. |

## Next steps

For more information, see [Overview of the EU Data Boundary](/privacy/eudb/eu-data-boundary-learn).
