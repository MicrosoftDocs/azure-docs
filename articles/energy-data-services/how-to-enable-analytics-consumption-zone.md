---
title: How to enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy
description: Learn how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy instance. Configure user-assigned managed identity, storage, and permissions for ACZ.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 05/17/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to enable the Analytics Consumption Zone so that I can export Azure Data Manager for Energy data to ADLS Gen2.

---

# How to enable the Analytics Consumption Zone (ACZ)

This article explains how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy resource. Enablement is a one-time setup process that configures your Azure Data Manager for Energy resource, user-assigned managed identity, and storage account. After enablement, you can create multiple ACZs to sync different Azure Data Manager for Energy data sets to your Azure Data Lake Storage (ADLS) Gen2 account.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> During the preview, ACZ is only available on Developer Tier instances and requires allowlisting. To enable ACZ on your Azure Data Manager for Energy resource, complete the steps in this article and contact your Microsoft representative.

## Setup overview

The setup configures a managed identity that enables ACZ to access Azure Data Manager for Energy data and write to ADLS Gen2.

Complete the following one-time setup tasks to enable ACZ on your Azure Data Manager for Energy resource. After enablement, you can create multiple ACZs using the APIs.

> [!TIP]
> **Planning your ACZ configuration**  
> Before creating an ACZ, decide whether you need:
> - **All catalog data**: Set `allCatalogSync: true` (outside the configuration section) to export all catalog entity types from your partition
> - **Specific entity types**: Use `catalogKinds` array in the configuration section to export only selected kinds (for example, Wells, Wellbores, Fields)
>
> Note: When `allCatalogSync` is true, the `catalogKinds` and `wellboreDDMSKinds` arrays are ignored for catalog data. Wellbore Domain Data Management Service (DDMS) bulk file downloads only occur for kinds listed in `wellboreDDMSKinds`.
>
> See [Tutorial: Use Analytics Consumption Zone (ACZ) APIs](tutorial-analytics-consumption-zone-apis.md) for configuration examples.

| Step | Task |
|------|------|
| 1 | Create or use existing ADLS Gen2 storage account |
| 2 | Create user-assigned managed identity for ACZ |
| 3 | Assign user-assigned managed identity to Azure Data Manager for Energy resource |
| 4 | Verify user has entitlement group access |
| 5 | Grant user-assigned managed identity storage permissions |
| 6 | Share user-assigned managed identity and Azure Data Manager for Energy instance details with Microsoft |

## Prerequisites

- An active Azure subscription. [Create a subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy instance (Developer Tier) with at least one data partition. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- The [Azure CLI](/cli/azure/install-azure-cli) installed on your machine, or access to [Azure Cloud Shell](../cloud-shell/overview.md).

## Step 1: Create or use an existing ADLS Gen2 storage account

ACZ requires an Azure Data Lake Storage Gen2 storage account with hierarchical namespace enabled to store the synchronized data. If you don't already have one, create it:

1. In the [Azure portal](https://portal.azure.com/), select **Create a resource** > **Storage account**.
2. On the **Basics** tab, select your subscription and resource group.
3. Enter a storage account name and select your preferred region.
4. On the **Advanced** tab, select **Enable hierarchical namespace**.
5. Select **Review + create**, then select **Create**.

> [!IMPORTANT]
> You're responsible for selecting an in-geo destination storage account if you have data residency requirements. ACZ exports data to the ADLS Gen2 storage account you specify, regardless of location.

## Step 2: Create a user-assigned managed identity for ACZ

ACZ uses a user-assigned managed identity to write data to ADLS Gen2. Create a dedicated identity for ACZ:

> [!IMPORTANT]
> Microsoft recommends creating a dedicated user-assigned managed identity for ACZ rather than reusing identities from other services like Customer-Managed Encryption Keys (CMEK) or External Data Sources (EDS). A dedicated identity provides:
> - **Clear audit trails**: Separate identity makes it easier to track ACZ-specific operations in audit logs
> - **Independent lifecycle management**: You can rotate, update, or remove ACZ identity without affecting other services
> - **Granular access control**: ACZ identity gets only the permissions it needs (Storage Blob Data Contributor) without inheriting unnecessary permissions
> - **Simplified troubleshooting**: Issues with ACZ permissions don't affect CMEK, EDS, or other services

To create a user-assigned managed identity:

1. In the [Azure portal](https://portal.azure.com/), search for **Managed Identities** and select it.
2. Select **+ Create**.
3. Select your subscription, resource group, region, and provide a name for the identity.
4. Select **Review + create**, then select **Create**.

## Step 3: Assign the user-assigned managed identity to your Azure Data Manager for Energy resource

Assign the user-assigned managed identity you created in Step 2 to your Azure Data Manager for Energy resource.

> [!IMPORTANT]
> This step uses Azure Resource Manager PUT operations, which **replace the entire resource configuration**. You must include ALL existing properties (CORS, encryption, network settings, tags, and identities) in your PUT request—omitting properties deletes them from your instance.

Follow these three substeps to safely attach the managed identity:

### Step 3.1: Get current configuration

First, retrieve your complete Azure Data Manager for Energy instance configuration.

#### [Bash](#tab/bash)

```bash
# Set your Azure Data Manager for Energy instance details
SUBSCRIPTION_ID="{subscription-id}"
RESOURCE_GROUP="{resource-group}"
ADME_INSTANCE_NAME="{adme-instance-name}"

# Get Azure Resource Manager token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv | tr -d '\r')

# Get current Azure Data Manager for Energy instance configuration
curl --http1.1 --request GET \
  --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-12-15" \
  --header "Authorization: Bearer $TOKEN" \
  > adme-config.json

# View the configuration
cat adme-config.json | jq .
```

#### [PowerShell](#tab/powershell)

```powershell
# Set your Azure Data Manager for Energy instance details
$subscriptionId = "{subscription-id}"
$resourceGroup = "{resource-group}"
$admeInstanceName = "{adme-instance-name}"

# Get Azure Resource Manager token
$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv

# Get current Azure Data Manager for Energy instance configuration
$uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$admeInstanceName`?api-version=2025-12-15"

Invoke-RestMethod -Uri $uri -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" } `
  | ConvertTo-Json -Depth 10 `
  | Out-File adme-config.json

# View the configuration (displays full JSON without truncation)
Get-Content adme-config.json
```

---

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where Azure Data Manager for Energy resides |
| `{resource-group}` | The resource group containing your Azure Data Manager for Energy resource |
| `{adme-instance-name}` | Your Azure Data Manager for Energy resource name |

> [!TIP]
> The command displays the full JSON configuration without truncation. Review the `adme-config.json` file content carefully, as you need to copy specific values from it for Step 3.2.

### Step 3.2: Update configuration with managed identity

Update the configuration by adding your managed identity while preserving all existing properties.

#### [Bash](#tab/bash)

```bash
# Set your Azure Data Manager for Energy instance details
SUBSCRIPTION_ID="{subscription-id}"
RESOURCE_GROUP="{resource-group}"
ADME_INSTANCE_NAME="{adme-instance-name}"
MI_RESOURCE_ID="{managed-identity-resource-id}"

# Get Azure Resource Manager token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv | tr -d '\r')

# Update Azure Data Manager for Energy instance with managed identity
# IMPORTANT: Replace {paste-entire-properties-block-from-GET} with the complete "properties" object from adme-config.json
# IMPORTANT: Replace {paste-all-existing-identities-from-GET} with all entries from identity.userAssignedIdentities, then add new MI
# IMPORTANT: Replace {paste-tags-from-GET} with the complete "tags" object from adme-config.json (or {} if no tags exist)
curl --http1.1 --request PUT \
  --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-12-15" \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "location": "{use-location-from-GET}",
    "properties": {paste-entire-properties-block-from-GET},
    "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
        {paste-all-existing-identities-from-GET},
        "'"$MI_RESOURCE_ID"'": {}
      }
    },
    "tags": {paste-tags-from-GET}
  }'
```

#### [PowerShell](#tab/powershell)

```powershell
# Set your Azure Data Manager for Energy instance details
$subscriptionId = "{subscription-id}"
$resourceGroup = "{resource-group}"
$admeInstanceName = "{adme-instance-name}"
$miResourceId = "{managed-identity-resource-id}"

# Get Azure Resource Manager token
$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv

# Update Azure Data Manager for Energy instance with managed identity
# IMPORTANT: Replace {paste-entire-properties-block-from-GET} with the complete "properties" object from adme-config.json
# IMPORTANT: Replace {paste-all-existing-identities-from-GET} with all entries from identity.userAssignedIdentities, then add new MI
# IMPORTANT: Replace {paste-tags-from-GET} with the complete "tags" object from adme-config.json (or {} if no tags exist)
$uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$admeInstanceName`?api-version=2025-12-15"

$body = @"
{
  "location": "{use-location-from-GET}",
  "properties": {paste-entire-properties-block-from-GET},
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      {paste-all-existing-identities-from-GET},
      "$miResourceId": {}
    }
  },
  "tags": {paste-tags-from-GET}
}
"@

Invoke-RestMethod -Uri $uri -Method Put `
  -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
  -Body $body
```

---

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where Azure Data Manager for Energy resides |
| `{resource-group}` | The resource group containing your Azure Data Manager for Energy resource |
| `{adme-instance-name}` | Your Azure Data Manager for Energy resource name |
| `{managed-identity-resource-id}` | Full resource ID of the user-assigned managed identity from Step 2 (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`) |
| `{use-location-from-GET}` | The `location` value from the response in Step 3.1 |
| `{paste-entire-properties-block-from-GET}` | The complete `properties` object from the response in Step 3.1 (copy the entire JSON block) |
| `{paste-all-existing-identities-from-GET}` | All entries from `identity.userAssignedIdentities` in the response (for example, `"/subscriptions/.../identities/existing-mi": {},`) |
| `{paste-tags-from-GET}` | The complete `tags` object from the response in Step 3.1, or `{}` if no tags exist |

### Step 3.3: Verify managed identity attachment

> [!IMPORTANT]
> This verification should be performed only after the Azure Data Manager for Energy instance provisioning state is marked as **Succeeded**. The PUT operation in Step 3.2 may take several minutes to complete. Wait for the instance to finish updating before running this verification step.

Confirm the managed identity was successfully attached to your Azure Data Manager for Energy instance.

#### [Bash](#tab/bash)

```bash
# Set your Azure Data Manager for Energy instance details (if not already set from previous steps)
SUBSCRIPTION_ID="{subscription-id}"
RESOURCE_GROUP="{resource-group}"
ADME_INSTANCE_NAME="{adme-instance-name}"

# Get Azure Resource Manager token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv | tr -d '\r')

# Get current managed identities
curl --http1.1 --request GET \
  --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-12-15" \
  --header "Authorization: Bearer $TOKEN" \
  | jq '.identity.userAssignedIdentities | keys'
```

#### [PowerShell](#tab/powershell)

```powershell
# Set your Azure Data Manager for Energy instance details (if not already set from previous steps)
$subscriptionId = "{subscription-id}"
$resourceGroup = "{resource-group}"
$admeInstanceName = "{adme-instance-name}"

# Get Azure Resource Manager token
$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv

# Set URI
$uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$admeInstanceName`?api-version=2025-12-15"

# Get current managed identities
$config = Invoke-RestMethod -Uri $uri -Method Get `
  -Headers @{ "Authorization" = "Bearer $token" }

$config.identity.userAssignedIdentities.PSObject.Properties.Name
```

---

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where Azure Data Manager for Energy resides (same as Step 3.1) |
| `{resource-group}` | The resource group containing your Azure Data Manager for Energy resource (same as Step 3.1) |
| `{adme-instance-name}` | Your Azure Data Manager for Energy resource name (same as Step 3.1) |

> [!NOTE]
> If you're running all substeps in the same terminal session, the variables are already set from Step 3.1 and Step 3.2.

**Sample output:**

```json
[
  "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-acz-identity"
]
```

The output should include your managed identity's resource ID. If you have other identities (CMEK, EDS) attached, they also appear in the list.

## Step 4: Verify user has entitlement group access

To call ACZ APIs, you (the user) must be a member of the following entitlement groups:
- `users@{data-partition-id}.dataservices.energy`
- `users.datalake.ops@{data-partition-id}.dataservices.energy`

> [!IMPORTANT]
> This step verifies that YOU (the user calling ACZ APIs) have access, not the user-assigned managed identity. The user-assigned managed identity created in Step 2 is only used by the ACZ service to write data to storage—it doesn't need entitlement group membership.

If you're not already a member of these entitlement groups, have an Azure Data Manager for Energy administrator add your user account. See [How to manage users](how-to-manage-users.md) for detailed instructions.

**To verify you have access**, use the Entitlements Service API to check your membership in both groups:

### [Bash](#tab/bash)

```bash
# Check users group membership
curl --http1.1 --request GET \
  --url https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data-partition-id}'

# Check users.datalake.ops group membership
curl --http1.1 --request GET \
  --url https://{base_url}/api/entitlements/v2/groups/users.datalake.ops@{data-partition-id}.dataservices.energy/members \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data-partition-id}'
```

### [PowerShell](#tab/powershell)

```powershell
# Check users group membership
Invoke-RestMethod -Uri "https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members" -Method Get -Headers @{
    "Authorization" = "Bearer {access_token}"
    "data-partition-id" = "{data-partition-id}"
}

# Check users.datalake.ops group membership
Invoke-RestMethod -Uri "https://{base_url}/api/entitlements/v2/groups/users.datalake.ops@{data-partition-id}.dataservices.energy/members" -Method Get -Headers @{
    "Authorization" = "Bearer {access_token}"
    "data-partition-id" = "{data-partition-id}"
}
```

---

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{base_url}` | Your Azure Data Manager for Energy resource URL (for example, `myinstance.energy.azure.com`) |
| `{access_token}` | Your personal access token for Azure Data Manager for Energy APIs. See [How to generate auth token](how-to-generate-auth-token.md) |
| `{data-partition-id}` | Your data partition ID (for example, `dp1`) |

**Sample response:**

```json
{
  "desId": "users@dp1.dataservices.energy",
  "name": "users@dp1.dataservices.energy",
  "description": "Datalake users",
  "email": "users@dp1.dataservices.energy",
  "members": [
    {
      "email": "user@example.com",
      "role": "MEMBER"
    },
    {
      "email": "admin@example.com",
      "role": "OWNER"
    }
  ]
}
```

Both responses should include your user account in the `members` array. If you're not listed in either group, contact your Azure Data Manager for Energy administrator to add you to both required groups.

## Step 5: Grant the user-assigned managed identity permissions on the ADLS Gen2 container

Grant the user-assigned managed identity write access to the ADLS Gen2 storage account. The ACZ identity needs Storage Blob Data Contributor permissions to write Delta Parquet files.

1. Navigate to your ADLS Gen2 storage account in the [Azure portal](https://portal.azure.com/).
2. Select **Access control (IAM)** from the left menu.
3. Select **+ Add** > **Add role assignment**.
4. On the **Role** tab, search for **Storage Blob Data Contributor**, select it, then select **Next**.
5. On the **Members** tab, select **Managed identity** for **Assign access to**.
6. Select **+ Select members**.
7. In the **Managed identity** dropdown, select **User-assigned managed identity**.
8. Select the user-assigned managed identity you created in Step 2 (or your existing CMEK/EDS identity), then select **Select**.
9. Select **Review + assign** to complete the role assignment.

## Step 6: Share user-assigned managed identity and Azure Data Manager for Energy instance details with Microsoft (Preview requirement)

> [!IMPORTANT]
> During the preview, ACZ access requires allowlisting. Microsoft must enable the ACZ capability on your Azure Data Manager for Energy instance and configure it with your user-assigned managed identity. Share the following details with your Microsoft contact to complete the ACZ enablement.

Provide the following information to your Microsoft representative:

| Information | Description |
|---|---|
| **Azure Data Manager for Energy resource name** | Your Azure Data Manager for Energy resource name (for example, `my-adme-instance`). |
| **User-assigned managed identity Resource ID** | The full Azure Resource ID of the user-assigned managed identity. In the Azure portal, go to your user-assigned managed identity and select **Settings** > **Properties** to find the **Resource ID** (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`). |

After Microsoft adds your user-assigned managed identity to the allow list, ACZ is enabled on your Azure Data Manager for Energy resource.

## Create an Analytics Consumption Zone

After completing the enablement steps, you can create one or more ACZs to sync your Azure Data Manager for Energy data to ADLS Gen2. Each ACZ can be configured to sync different data types.

### Call the ACZ Create API

Use the ACZ Create API to create an Analytics Consumption Zone. For a full walkthrough, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md).

### [Bash](#tab/bash)

```bash
curl --http1.1 --request POST \
  --url https://{base_url}/api/acz/v1/aczs \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: {data_partition_id}' \
  --data '{
    "name": "my-first-acz",
    "allCatalogSync": false,
    "sink": {
      "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}"
    },
    "configuration": {
      "catalogKinds": [
        "osdu:wks:master-data--Well:*",
        "osdu:wks:reference-data--UnitOfMeasure:*"
      ],
      "wellboreDDMSKinds": [
        "osdu:wks:work-product-component--WellLog:*"
      ]
    }
  }'
```

### [PowerShell](#tab/powershell)

```powershell
# Build request body
$body = @{
    name = "my-first-acz"
    allCatalogSync = $false
    sink = @{
        storageId = "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}"
    }
    configuration = @{
        catalogKinds = @(
            "osdu:wks:master-data--Well:*",
            "osdu:wks:reference-data--UnitOfMeasure:*"
        )
        wellboreDDMSKinds = @(
            "osdu:wks:work-product-component--WellLog:*"
        )
    }
} | ConvertTo-Json -Depth 10

# Create ACZ
Invoke-RestMethod -Uri "https://{base_url}/api/acz/v1/aczs" -Method Post -Headers @{
    "Authorization" = "Bearer {access_token}"
    "Content-Type" = "application/json"
    "data-partition-id" = "{data_partition_id}"
} -Body $body
```

---

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{base_url}` | Your Azure Data Manager for Energy resource URL (for example, `myinstance.energy.azure.com`) |
| `{access_token}` | Access token for Azure Data Manager for Energy APIs. See [How to generate auth token](how-to-generate-auth-token.md) |
| `{data_partition_id}` | Your data partition ID (for example, `dp1`) |
| `{sub-id}` | Subscription ID where the ADLS Gen2 storage account resides |
| `{rg}` | Resource group where the ADLS Gen2 storage account resides |
| `{account}` | Name of the ADLS Gen2 storage account |

A successful response returns HTTP status `201` with the ACZ details:

```json
{
  "aczId": "acz-8a0aa7433085",
  "name": "my-first-acz",
  "status": "ACTIVE",
  "targetFormat": "DELTA_PARQUET",
  "aczType": "LATEST_VERSION",
  "sink": {
    "storageType": "microsoft.storage/storageaccounts",
    "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
    "basePath": ""
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
  "createdTs": "2026-05-01T12:00:00.000000",
  "updatedTs": "2026-05-01T12:00:00.000000",
  "createdBy": "your-user-object-id"
}
```

Note the `aczId` value (format: `acz-<identifier>`). You need this ACZ identifier to:
- Manage and query the ACZ using APIs
- Locate your data in ADLS Gen2 storage at `<container>/<aczId>/` or `<container>/<basePath>/<aczId>/` if you specified a base path

## Related content

- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)

