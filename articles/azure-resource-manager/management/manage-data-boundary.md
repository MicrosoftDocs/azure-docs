---
title: Configure data boundary
description: Learn how to configure data boundary.
ms.topic: how-to
ms.date: 11/11/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an Azure user, I want to create a new data boundary.
---

# Configure data boundary

The only data boundary configuration currently supported, aside from the default Global configuration, is for the European Union (EU). The EU Data Boundary is a geographically defined boundary within which Microsoft has committed to store and process personal data for Microsoft enterprise online services, including Azure, Dynamics 365, Power Platform, and Microsoft 365, subject to limited circumstances where personal data continue to be transferred outside the EU Data Boundary. For more information, see [Overview of the EU Data Boundary](/privacy/eudb/eu-data-boundary-learn).

Azure Resource Manager is the deployment and management service for Azure. To provide maximum availability and performance, Azure Resource Manager was architected to distribute all data it stores and processes globally across the Azure cloud. As part of the EU Data Boundary and Microsoft's regional data residency commitments, Azure Resource Manager has been rearchitected to allow Customer Data and pseudonymized personal data to be stored and processed regionally. This documentation provides details on how customers can configure Azure Resource Manager for use in the EU Data Boundary.

A data boundary can only be established in new tenants that have no existing subscriptions or deployed resources. Once in place, the data boundary configuration can't be removed or modified, and existing subscriptions and resources can't be moved into or out of a tenant with a data boundary. Each tenant is limited to one data boundary, and after it's established, Azure Resource Manager will restrict resource deployments to regions within that boundary. Customers can opt their tenants into a data boundary by deploying a `Microsoft.Resources/dataBoundaries` resource at the tenant level.

The `DataBoundaryTenantAdministrator` built-in role is required to configure data boundary. For more information, see [Assign Azure roles](../../role-based-access-control/role-assignments-powershell.yml).

To opt your tenant into an Azure EU Data Boundary:

- Create a new tenant within an EU country to configure a Microsoft Entra EU Data Boundary.
- Before creating any new subscriptions or resources, deploy a `Microsoft.Resources/dataBoundaries` resource with an EU configuration.
- Create a subscription and deploy Azure resources.  

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
PUT https://management.azure.com/providers/ Microsoft.Resources/dataBoundaries/default?api-version=2024-08-01 
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

Data boundary geo currently have two options:

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
