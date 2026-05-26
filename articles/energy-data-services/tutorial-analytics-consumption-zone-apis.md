---
title: 'Tutorial: Use Analytics Consumption Zone (ACZ) APIs in Azure Data Manager for Energy'
description: Learn how to use the ACZ APIs to create, list, get details of, and delete Analytics Consumption Zones in Azure Data Manager for Energy.
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 05/17/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to use ACZ APIs so that I can create and manage Analytics Consumption Zones programmatically.

---

# Tutorial: Use Analytics Consumption Zone (ACZ) APIs


This tutorial shows how to use the ACZ management APIs in Azure Data Manager for Energy. You create, list, retrieve, and delete ACZ instances by using cURL.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> During the preview, ACZ is only available on Developer Tier instances and requires allowlisting. Follow the guidance in [How to enable the Analytics Consumption Zone (ACZ)](how-to-enable-analytics-consumption-zone.md) and contact your Microsoft representative.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Analytics Consumption Zone
> * List all ACZs in a data partition
> * Get details of a specific ACZ
> * Delete an ACZ

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy (Developer Tier) instance in your Azure subscription. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- ACZ enabled for your instance. See [How to enable the Analytics Consumption Zone (ACZ)](how-to-enable-analytics-consumption-zone.md).
- An Azure Data Lake Storage (ADLS) Gen2 storage account with hierarchical namespace enabled, where user-assigned managed identity allow listed for ACZ operations has **Storage Blob Data Contributor** role.
- Your user account must belong to the `users@{data-partition-id}.dataservices.energy` entitlement group to call ACZ APIs. See [How to manage users](how-to-manage-users.md).
- cURL installed on your machine (for bash examples) or PowerShell 5.1+ (for PowerShell examples).
- Azure CLI installed and authenticated.
- An access token for authentication. See [How to generate auth token](how-to-generate-auth-token.md).

> [!TIP]
> **Explore the API interactively**  
> You can view the complete ACZ API specification and test endpoints using Swagger UI at `https://{instance-name}.energy.azure.com/api/acz/v1/docs`. Replace `{instance-name}` with your Azure Data Manager for Energy instance name.

## Get your Azure Data Manager for Energy instance details

Gather these details from your [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md) in the [Azure portal](https://portal.azure.com/):

| Parameter | Description | Example |
|---|---|---|
| `base_url` | The URL of your Azure Data Manager for Energy instance. | `https://<instance>.energy.azure.com` |
| `data_partition_id` | The data partition name. | `opendes` |
| `storage_resource_id` | The Azure resource ID of the ADLS Gen2 storage account. | `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}` |

Generate an `access_token` for authentication by following the guidance in [How to generate auth token](how-to-generate-auth-token.md).

## Create an ACZ

Use the Create ACZ API to set up a new Analytics Consumption Zone for a data partition.

**API**: `POST /api/acz/v1/aczs`

**Key points**:
- Maximum of three ACZs per data partition (preview limit).
- The ACZ name must be unique within the partition.
- The user-assigned managed identity must be:
  - Assigned to your Azure Data Manager for Energy resource
  - Granted **Storage Blob Data Contributor** role on the destination ADLS Gen2 storage account
- Your user must belong to the `users@{data-partition-id}.dataservices.energy` entitlement group.

### [Bash](#tab/bash)

```bash
curl --request POST \
  --url https://{base-url}/api/acz/v1/aczs \
  --header 'Authorization: Bearer {access-token}' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: {data-partition-id}' \
  --data '{
    "name": "{acz-name}",
    "aczType": "{acz-type}",
    "targetFormat": "DELTA_PARQUET",
    "sink": {
      "storageType": "microsoft.storage/storageaccounts",
      "storageId": "{storage-resource-id}",
      "basePath": "{base-path}"
    },
    "configuration": {
      "catalogKinds": {catalog-kinds},
      "wellboreDDMSKinds": {wellbore-ddms-kinds}
    }
  }'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your ADME instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# Build request body
$body = @{
    name = "{acz-name}"
    aczType = "{acz-type}"
    targetFormat = "DELTA_PARQUET"
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

# Create ACZ
Invoke-RestMethod -Uri "https://{base-url}/api/acz/v1/aczs" -Method Post -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "data-partition-id" = "{data-partition-id}"
} -Body $body
```

---

### Request parameters

| Parameter | Location | Description |
|---|---|---|
| `{base-url}` | URL | Your Azure Data Manager for Energy instance URL (for example, `myinstance.energy.azure.com`) |
| `{access-token}` | Header (Authorization) | Azure Data Manager for Energy access token. See [How to generate auth token](how-to-generate-auth-token.md) |
| `{data-partition-id}` | Header | Your data partition ID (for example, `opendes`) |

### Request body parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `{acz-name}` | string | Yes | Display name for the ACZ (1-100 characters, for example, `my-acz-wells-and-logs`). |
| `{acz-type}` | string | No | `LATEST_VERSION` (default) exports only the latest version. `ALL_VERSIONS` exports all versions. |
| `{storage-resource-id}` | string | Yes | Azure resource ID of the destination ADLS Gen2 storage account (for example, `/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-rg/providers/Microsoft.Storage/storageAccounts/mystorageacct`). |
| `{base-path}` | string | No | Base path within the storage account for ACZ data output (for example, `acz-output`). |
| `{catalog-kinds}` | string[] | No | OSDU® catalog kind strings to sync (for example, `["osdu:wks:master-data--Well:*", "osdu:wks:reference-data--UnitOfMeasure:*"]`). |
| `{wellbore-ddms-kinds}` | string[] | No | Wellbore Domain Data Management Service (DDMS) kind strings to sync (for example, `["osdu:wks:work-product-component--WellLog:*"]`). |

> [!NOTE]
> You must provide at least one of `{catalog-kinds}` or `{wellbore-ddms-kinds}` in the configuration.

### Sample response (201 Created)

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

After you create the ACZ, it begins the historical snapshot with `PROCESSING` state. Use the Get ACZ API to check the status.

## List ACZs

Use the List ACZs API to get all Analytics Consumption Zones in a data partition.

**API**: `GET /api/acz/v1/aczs`

### [Bash](#tab/bash)

```bash
curl --request GET \
  --url https://{base_url}/api/acz/v1/aczs \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Accept: application/json' \
  --header 'data-partition-id: {data_partition_id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your ADME instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# List ACZs
Invoke-RestMethod -Uri "https://{base_url}/api/acz/v1/aczs" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "data-partition-id" = "{data_partition_id}"
}
```

---

### Sample response (200 OK)

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
  ],
  "count": 1
}
```

The response lists all ACZs in any status: `ACTIVE`, `FAILED`, or `ACCESS_DENIED`.

## Get ACZ details

Use the Get ACZ API to get details for a specific ACZ.

**API**: `GET /api/acz/v1/aczs/{acz_id}`

### [Bash](#tab/bash)

```bash
curl --request GET \
  --url https://{base_url}/api/acz/v1/aczs/{acz_id} \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Accept: application/json' \
  --header 'data-partition-id: {data_partition_id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your ADME instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# Get ACZ details
Invoke-RestMethod -Uri "https://{base_url}/api/acz/v1/aczs/{acz_id}" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "data-partition-id" = "{data_partition_id}"
}
```

---

Replace `{acz_id}` with the ACZ identifier from the Create or List response.

### Sample response (200 OK)

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

## Delete an ACZ

Use the Delete ACZ API to remove an ACZ configuration.

**API**: `DELETE /api/acz/v1/aczs/{acz_id}`

> [!WARNING]
> This delete action can't be undone. It removes all ACZ configuration and stops sync. Data already in the destination ADLS storage account stays intact.

### [Bash](#tab/bash)

```bash
curl --request DELETE \
  --url https://{base_url}/api/acz/v1/aczs/{acz_id} \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Accept: application/json' \
  --header 'data-partition-id: {data_partition_id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Get auth app ID for your ADME instance
$authAppId = az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query properties.authAppId -o tsv

# Get access token
$token = az account get-access-token --resource $authAppId --query accessToken -o tsv

# Delete ACZ
Invoke-RestMethod -Uri "https://{base_url}/api/acz/v1/aczs/{acz_id}" -Method Delete -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
    "data-partition-id" = "{data_partition_id}"
}
```

---

### Sample response (204 No Content)

A successful delete returns HTTP `204` with no response body. The ACZ status changes to `DELETING` while cleanup runs.

## Error responses

The ACZ APIs return these error codes:

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

