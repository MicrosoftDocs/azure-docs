---
title: 'Tutorial: Use Analytics Consumption Zone APIs in Azure Data Manager for Energy'
description: Learn how to use the Analytics Consumption Zone APIs to create, list, get details of, and delete Analytics Consumption Zone instances in Azure Data Manager for Energy.
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 05/17/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to use Analytics Consumption Zone APIs so that I can create and manage Analytics Consumption Zone instances programmatically.

---

# Tutorial: Use Analytics Consumption Zone APIs

This tutorial shows how to use the Analytics Consumption Zone (ACZ) management APIs in Azure Data Manager for Energy. You create, list, retrieve, and delete ACZ instances by using cURL.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. For legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

During the preview, ACZ is available only on Developer tier instances and requires the use of allow lists. Follow the guidance in [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md), and contact your Microsoft representative.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an ACZ instance.
> * List all ACZ instances in a data partition.
> * Get details of a specific ACZ instance.
> * Delete an ACZ instance.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy (Developer tier) instance in your Azure subscription. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- ACZ enabled for your instance. See [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md).
- The Azure CLI installed and authenticated (`az login`).
- cURL (for Bash examples) or PowerShell 5.1+ (for PowerShell examples).

> [!TIP]
> **Explore the API interactively:** You can view the complete ACZ API specification and test endpoints by using the Swagger UI at `https://{instance-name}.energy.azure.com/api/acz/v1/docs`. Replace `{instance-name}` with your Azure Data Manager for Energy instance name.

## Get your Azure Data Manager for Energy instance details

Gather these details from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/).

## Before you begin

The code examples in this tutorial use placeholder values in `{curly-braces}` format. Replace these placeholders with your actual values when you run the commands.

All API calls require authentication. The Bash and PowerShell examples show inline token generation by using the Azure CLI. For alternative authentication methods, see [Generate an auth token](how-to-generate-auth-token.md).

## Create an ACZ instance

Use the Create ACZ API to set up a new ACZ instance for a data partition.

#### API

`POST /api/acz/v1/aczs`

#### Key points

- A maximum of three ACZ instances per data partition (preview limit).
- The ACZ name must be unique within the partition.
- The user-assigned managed identity must be:
  - Assigned to your Azure Data Manager for Energy resource (see [Enable Analytics Consumption Zone](how-to-enable-analytics-consumption-zone.md)).
  - Granted the Storage Blob Data Contributor role on the destination Azure Data Lake Storage Gen2 storage account.
- A Data Lake Storage Gen2 storage account with a hierarchical namespace enabled is required.

### [Bash](#tab/bash)

```bash
# Get auth app ID for your Azure Data Manager for Energy instance
AUTH_APP_ID=$(az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv)

# Get access token
TOKEN=$(az account get-access-token --resource $AUTH_APP_ID --query accessToken -o tsv)

# Create ACZ instance
curl --request POST \
  --url https://{base-url}/api/acz/v1/aczs \
  --header "Authorization: Bearer $TOKEN" \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: {data-partition-id}' \
  --data '{
    "name": "{acz-name}",
    "aczType": "{acz-type}",
    "targetFormat": "DELTA_PARQUET",
    "allCatalogSync": false,
    "sink": {
      "storageType": "microsoft.storage/storageaccounts",
      "storageId": "{storage-resource-id}",
      "basePath": "{base-path}"
    },
    "configuration": {
      "catalogKinds": ["{catalog-kinds}"],
      "wellboreDDMSKinds": ["{wellbore-ddms-kinds}"]
    }
  }'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your Azure Data Manager for Energy instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# Build request body
$body = @{
    name = "{acz-name}"
    aczType = "{acz-type}"
    targetFormat = "DELTA_PARQUET"
    allCatalogSync = $false
    sink = @{
        storageType = "microsoft.storage/storageaccounts"
        storageId = "{storage-resource-id}"
        basePath = "{base-path}"
    }
    configuration = @{
        catalogKinds = @("{catalog-kinds}")
        wellboreDDMSKinds = @("{wellbore-ddms-kinds}")
    }
} | ConvertTo-Json -Depth 10

# Create ACZ instance
Invoke-RestMethod -Uri "https://{base-url}/api/acz/v1/aczs" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "data-partition-id" = "{data-partition-id}"
} -Body $body
```

---

#### Replace the placeholders

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where your Azure Data Manager for Energy instance resides. |
| `{resource-group}` | Resource group that contains your Azure Data Manager for Energy instance. |
| `{adme-instance-name}` | Your Azure Data Manager for Energy instance name. |
| `{base-url}` | Your Azure Data Manager for Energy instance URL (for example, `myinstance.energy.azure.com`). |
| `{data-partition-id}` | Your data partition ID (for example, `opendes`). |
| `{acz-name}` | Display name for the ACZ instance (1-100 characters, for example, `my-acz-wells-and-logs`). |
| `{acz-type}` | Optional: `LATEST_VERSION` (default) exports only the latest version, and `ALL_VERSIONS` exports all versions. |
| `{storage-resource-id}` | Azure resource ID of the destination Data Lake Storage Gen2 storage account (for example, `/subscriptions/xxx.../storageAccounts/mystorageacct`). |
| `{base-path}` | Optional: Base path within the storage account for ACZ data output (for example, `acz-output`). |
| `allCatalogSync` | Optional (default: `false`). When set to `true`, exports all catalog kinds from the partition. Specified *outside* the `configuration` section. When `true`, `catalogKinds` and `wellboreDDMSKinds` in configuration are ignored for catalog data. |
| `{catalog-kinds}` | Optional: OSDU® catalog kind strings to sync (for example, `["osdu:wks:master-data--Well:*"]`). Ignored if `allCatalogSync` is `true`. |
| `{wellbore-ddms-kinds}` | Optional: Wellbore Domain Data Management Service (DDMS) kind strings to sync (for example, `["osdu:wks:work-product-component--WellLog:*"]`). File downloads occur only for kinds listed here. |

> [!TIP]
> **Export all catalog data:**  Set `"allCatalogSync": true` (outside the `configuration` section) to export all catalog kinds from your data partition. When enabled, the `catalogKinds` and `wellboreDDMSKinds` arrays in configuration are ignored for catalog data. Wellbore DDMS bulk file downloads still occur only for kinds listed in `wellboreDDMSKinds`.

You must provide at least one of the following options:

- Set `"allCatalogSync": true` (outside configuration).
- Provide `catalogKinds` array in configuration with at least one kind pattern.  
- Provide `wellboreDDMSKinds` array in configuration with at least one kind pattern.

#### Sample response (201 Created)

```json
{
  "aczId": "acz-abc123def456",
  "name": "my-acz-wells-and-logs",
  "status": "ACTIVE",
  "aczType": "LATEST_VERSION",
  "targetFormat": "DELTA_PARQUET",
  "sink": {
    "storageType": "microsoft.storage/storageaccounts",
    "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
    "basePath": "acz-output"
  },
  "allCatalogSync": false,
  "configuration": {
    "catalogKinds": [
      "osdu:wks:master-data--Well:*",
      "osdu:wks:reference-data--UnitOfMeasure:*"
    ],
    "wellboreDDMSKinds": [
      "osdu:wks:work-product-component--WellLog:*"
    ]
  },
  "historicalSnapshotStatus": "PROCESSING",
  "createdTs": "2026-03-31T10:00:00Z",
  "updatedTs": "2026-03-31T10:00:00Z",
  "createdBy": "user@contoso.com"
}
```

After you create the ACZ instance, it begins the historical snapshot with the `PROCESSING` state. Use the Get ACZ API to check the status.

## List ACZ instances

Use the List ACZs API to get all ACZ instances in a data partition.

#### API

`GET /api/acz/v1/aczs`

### [Bash](#tab/bash)

```bash
# Get auth app ID for your Azure Data Manager for Energy instance
AUTH_APP_ID=$(az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv)

# Get access token
TOKEN=$(az account get-access-token --resource $AUTH_APP_ID --query accessToken -o tsv)

# List ACZ instances
curl --request GET \
  --url https://{base-url}/api/acz/v1/aczs \
  --header "Authorization: Bearer $TOKEN" \
  --header 'Accept: application/json' \
  --header 'data-partition-id: {data-partition-id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your Azure Data Manager for Energy instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# List ACZ instances
Invoke-RestMethod -Uri "https://{base-url}/api/acz/v1/aczs" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "data-partition-id" = "{data-partition-id}"
}
```

---

#### Replace the placeholders

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where your Azure Data Manager for Energy instance resides. |
| `{resource-group}` | Resource group that contains your Azure Data Manager for Energy instance. |
| `{adme-instance-name}` | Your Azure Data Manager for Energy instance name. |
| `{base-url}` | Your Azure Data Manager for Energy instance URL (for example, `myinstance.energy.azure.com`). |
| `{data-partition-id}` | Your data partition ID (for example, `opendes`). |

#### Sample response (200 OK)

```json
{
  "items": [
    {
      "aczId": "acz-abc123def456",
      "name": "my-acz-wells-and-logs",
      "status": "ACTIVE",
      "aczType": "LATEST_VERSION",
      "targetFormat": "DELTA_PARQUET",
      "sink": {
        "storageType": "microsoft.storage/storageaccounts",
        "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
        "basePath": "acz-output"
      },
      "allCatalogSync": false,
      "configuration": {
        "catalogKinds": [
          "osdu:wks:master-data--Well:*"
        ]
      },
      "historicalSnapshotStatus": "PROCESSING",
      "createdTs": "2026-03-31T10:00:00Z",
      "updatedTs": "2026-03-31T10:00:00Z",
      "createdBy": "user@contoso.com"
    },
    {
      "aczId": "acz-xyz789ghi012",
      "name": "all-catalog-sync-example",
      "status": "ACTIVE",
      "aczType": "LATEST_VERSION",
      "targetFormat": "DELTA_PARQUET",
      "sink": {
        "storageType": "microsoft.storage/storageaccounts",
        "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
        "basePath": "acz-output"
      },
      "allCatalogSync": true,
      "configuration": {
        "wellboreDDMSKinds": [
          "osdu:wks:work-product-component--WellLog:*"
        ]
      },
      "historicalSnapshotStatus": "COMPLETED",
      "createdTs": "2026-03-31T09:00:00Z",
      "updatedTs": "2026-03-31T09:45:00Z",
      "createdBy": "user@contoso.com"
    }
  ],
  "count": 2
}
```

The response lists all ACZ instances in any status: `ACTIVE`, `FAILED`, or `ACCESS_DENIED`. This response shows two ACZ instances: one using selective catalog sync (`allCatalogSync: false` with specific kinds) and another using `allCatalogSync: true` to export all catalog kinds.

## Get ACZ details

Use the Get ACZ API to get details for a specific ACZ instance.

#### API

`GET /api/acz/v1/aczs/{acz-id}`

### [Bash](#tab/bash)

```bash
# Get auth app ID for your Azure Data Manager for Energy instance
AUTH_APP_ID=$(az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv)

# Get access token
TOKEN=$(az account get-access-token --resource $AUTH_APP_ID --query accessToken -o tsv)

# Get ACZ details
curl --request GET \
  --url https://{base-url}/api/acz/v1/aczs/{acz-id} \
  --header "Authorization: Bearer $TOKEN" \
  --header 'Accept: application/json' \
  --header 'data-partition-id: {data-partition-id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your Azure Data Manager for Energy instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# Get ACZ details
Invoke-RestMethod -Uri "https://{base-url}/api/acz/v1/aczs/{acz-id}" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "data-partition-id" = "{data-partition-id}"
}
```

---

#### Replace the placeholders

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where your Azure Data Manager for Energy instance resides. |
| `{resource-group}` | Resource group that contains your Azure Data Manager for Energy instance. |
| `{adme-instance-name}` | Your Azure Data Manager for Energy instance name. |
| `{base-url}` | Your Azure Data Manager for Energy instance URL (for example, `myinstance.energy.azure.com`). |
| `{data-partition-id}` | Your data partition ID (for example, `opendes`). |
| `{acz-id}` | ACZ identifier from the Create or List response (for example, `acz-abc123def456`). |

#### Sample response (200 OK)

```json
{
  "aczId": "acz-abc123def456",
  "name": "my-acz-wells-and-logs",
  "status": "ACTIVE",
  "aczType": "LATEST_VERSION",
  "targetFormat": "DELTA_PARQUET",
  "sink": {
    "storageType": "microsoft.storage/storageaccounts",
    "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
    "basePath": "acz-output"
  },
  "allCatalogSync": false,
  "configuration": {
    "catalogKinds": [
      "osdu:wks:master-data--Well:*",
      "osdu:wks:reference-data--UnitOfMeasure:*"
    ],
    "wellboreDDMSKinds": [
      "osdu:wks:work-product-component--WellLog:*"
    ]
  },
  "historicalSnapshotStatus": "COMPLETED",
  "createdTs": "2026-03-31T10:00:00Z",
  "updatedTs": "2026-03-31T10:30:00Z",
  "createdBy": "user@contoso.com"
}
```

To track ACZ provisioning, check the `status` and `historicalSnapshotStatus` fields.

## Delete an ACZ instance

Use the Delete ACZ API to remove an ACZ configuration.

#### API

`DELETE /api/acz/v1/aczs/{acz-id}`

> [!WARNING]
> This delete action can't be undone. It removes all ACZ configuration and stops sync. Data already in the destination Data Lake Storage Gen2 storage account stays intact.

### [Bash](#tab/bash)

```bash
# Get auth app ID for your Azure Data Manager for Energy instance
AUTH_APP_ID=$(az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv)

# Get access token
TOKEN=$(az account get-access-token --resource $AUTH_APP_ID --query accessToken -o tsv)

# Delete ACZ instance
curl --request DELETE \
  --url https://{base-url}/api/acz/v1/aczs/{acz-id} \
  --header "Authorization: Bearer $TOKEN" \
  --header 'Accept: application/json' \
  --header 'data-partition-id: {data-partition-id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your Azure Data Manager for Energy instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# Delete ACZ instance
Invoke-RestMethod -Uri "https://{base-url}/api/acz/v1/aczs/{acz-id}" -Method Delete -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "data-partition-id" = "{data-partition-id}"
}
```

---

#### Replace the placeholders

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where your Azure Data Manager for Energy instance resides. |
| `{resource-group}` | Resource group that contains your Azure Data Manager for Energy instance. |
| `{adme-instance-name}` | Your Azure Data Manager for Energy instance name. |
| `{base-url}` | Your Azure Data Manager for Energy instance URL (for example, `myinstance.energy.azure.com`). |
| `{data-partition-id}` | Your data partition ID (for example, `opendes`). |
| `{acz-id}` | ACZ identifier from the Create or List response (for example, `acz-abc123def456`). |

#### Sample response (204 No Content)

A successful delete returns HTTP `204` with no response body. The ACZ status changes to `DELETING` while cleanup runs.

## Error responses

The ACZ APIs return the following error codes.

| HTTP status | Description |
|---|---|
| `400` | Bad request. Check the request body for validation errors. |
| `401` | Unauthorized. The Bearer token is missing or not valid. |
| `403` | Forbidden. The user doesn't belong to the required entitlements group. |
| `404` | Not found. The specified ACZ ID doesn't exist. |
| `422` | Validation failed. The request body has values that aren't valid. |
| `500` | Internal server error. Contact support if this error persists. |

## Related content

- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
