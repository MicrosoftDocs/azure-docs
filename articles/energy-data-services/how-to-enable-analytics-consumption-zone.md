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

Complete the following one-time setup tasks to enable ACZ on your Azure Data Manager for Energy resource. After enablement, you can create multiple ACZs using the APIs.

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

> [!IMPORTANT]
> **Different token required for this step!**  
> This step uses an **Azure Resource Manager (ARM) token** (not your Azure Data Manager for Energy auth token) to update the instance configuration via the ARM control plane API. The following script generates the correct ARM token automatically.

Assign the user-assigned managed identity you created in Step 2 to your Azure Data Manager for Energy resource.

Use the Azure Management API to update your Azure Data Manager for Energy resource with the user-assigned managed identity:

> [!TIP]
> **Automated script option available**  
> For a simplified approach with minimal prompts, you can use an automated script instead of the manual commands below. See [Use automated script](#use-automated-script-for-step-3) at the end of this step. Otherwise, continue with the manual steps.

 > [!IMPORTANT]
> **Preserve existing managed identities!**  
> If your Azure Data Manager for Energy instance includes user-assigned managed identities (for example, for Customer-Managed Encryption Keys or External Data Sources), you **must include all existing identities** in the `userAssignedIdentities` object. The PUT operation replaces the entire identity configuration—omitting existing identities removes them from the instance.
>
> To preserve existing identities, first retrieve the current configuration:
> ```bash
> az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query identity.userAssignedIdentities
> ```
> Then include all returned identity resource identifiers along with your new ACZ identity in the following `userAssignedIdentities` object.

### [Bash](#tab/bash)

```bash
# Get Azure Resource Manager token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv)

# Update Azure Data Manager for Energy instance with managed identity
curl --request PUT \
  --url 'https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name}?api-version=2025-09-22-preview' \
  --header "Authorization: Bearer $TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{
    "location": "{location}",
    "properties": {
      "authAppId": "{auth-app-id}",
      "dataPartitionNames": [
        {
          "name": "{data-partition-name}"
        }
      ]
    },
    "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
        "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}": {}
      }
    }
  }'
```

### [PowerShell](#tab/powershell)

```powershell
# Get Azure Resource Manager token
$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv

# Build request body
$body = @{
    location = "{location}"
    properties = @{
        authAppId = "{auth-app-id}"
        dataPartitionNames = @(
            @{ name = "{data-partition-name}" }
        )
    }
    identity = @{
        type = "UserAssigned"
        userAssignedIdentities = @{
            "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}" = @{}
        }
    }
} | ConvertTo-Json -Depth 10

# Update Azure Data Manager for Energy instance with managed identity
$uri = "https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name}?api-version=2025-09-22-preview"

Invoke-RestMethod -Uri $uri -Method Put -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -Body $body
```

---

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Subscription ID where Azure Data Manager for Energy resides |
| `{resource-group}` | The resource group containing your Azure Data Manager for Energy resource |
| `{adme-instance-name}` | Your Azure Data Manager for Energy resource name |
| `{location}` | Azure region of your Azure Data Manager for Energy resource (for example, `southcentralus`) |
| `{auth-app-id}` | Application ID used for Azure Data Manager for Energy authentication |
| `{data-partition-name}` | Name of your data partition (for example, `dp1`) |
| `{sub-id}` | Subscription ID where the user-assigned managed identity resides |
| `{rg}` | Resource group where the user-assigned managed identity resides |
| `{identity-name}` | Name of the user-assigned managed identity from Step 2 |

After the operation completes, verify the identity is assigned using Azure CLI:

```bash
az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query identity.userAssignedIdentities
```

**Sample response:**

```json
{
  "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-acz-identity": {
    "clientId": "abcd1234-ab12-cd34-ef56-abcdef123456",
    "principalId": "98765432-9876-5432-1098-987654321098"
  }
}
```

The output should include your user-assigned managed identity's resource ID with its `clientId` and `principalId`.

### Use automated script for Step 3

As an alternative to the manual commands above, you can use an automated script that handles the identity assignment with minimal user input. The script preserves existing identities automatically and requires only three inputs.

**What the script does:**
- Retrieves current ADME instance configuration
- Preserves any existing managed identities
- Adds your new ACZ identity to the configuration
- Updates the instance via ARM API

#### [PowerShell](#tab/powershell-script)

**Prerequisites:**
- Azure CLI installed and authenticated (`az login`)
- PowerShell 5.1 or later

**Download and run:**

```powershell
# Download the script
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Azure/azure-docs/main/articles/energy-data-services/scripts/attach-managed-identity.ps1" -OutFile "attach-managed-identity.ps1"

# Run the script
.\attach-managed-identity.ps1
```

**You will be prompted for:**
1. Subscription ID where your ADME instance resides
2. ADME instance name
3. Managed identity name (from Step 2)

The script automatically detects the resource group, preserves existing identities, and assigns the new identity.

**Script source code:**

```powershell
<#
.SYNOPSIS
    Attach a user-assigned managed identity to an Azure Data Manager for Energy instance.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$true)]
    [string]$AdmeInstanceName,
    
    [Parameter(Mandatory=$true)]
    [string]$ManagedIdentityName
)

Write-Host "Attaching managed identity to ADME instance..." -ForegroundColor Cyan

# Set subscription
az account set --subscription $SubscriptionId

# Get ADME instance
$adme = az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --name $AdmeInstanceName --query "[0]" | ConvertFrom-Json

if (-not $adme) {
    Write-Host "Error: ADME instance '$AdmeInstanceName' not found" -ForegroundColor Red
    exit 1
}

$resourceGroup = $adme.resourceGroup
$location = $adme.location
$authAppId = $adme.properties.authAppId
$dataPartitionName = $adme.properties.dataPartitionNames[0].name

# Get managed identity
$mi = az identity list --query "[?name=='$ManagedIdentityName']" | ConvertFrom-Json
if (-not $mi) {
    Write-Host "Error: Managed identity '$ManagedIdentityName' not found" -ForegroundColor Red
    exit 1
}

$miResourceId = $mi[0].id

# Build user-assigned identities object (preserve existing)
$identities = @{}
if ($adme.identity.userAssignedIdentities) {
    foreach ($key in $adme.identity.userAssignedIdentities.PSObject.Properties.Name) {
        $identities[$key] = @{}
    }
}
$identities[$miResourceId] = @{}

# Build request body
$body = @{
    location = $location
    properties = @{
        authAppId = $authAppId
        dataPartitionNames = @(
            @{ name = $dataPartitionName }
        )
    }
    identity = @{
        type = "UserAssigned"
        userAssignedIdentities = $identities
    }
} | ConvertTo-Json -Depth 10

# Get ARM token and update ADME instance
$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv
$uri = "https://management.azure.com$($adme.id)?api-version=2025-09-22-preview"

Invoke-RestMethod -Uri $uri -Method Put -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -Body $body

Write-Host "Successfully attached managed identity to ADME instance" -ForegroundColor Green
```

#### [Bash](#tab/bash-script)

**Prerequisites:**
- Azure CLI installed and authenticated (`az login`)
- Bash shell (Linux, macOS, WSL, or Git Bash on Windows)

**Download and run:**

```bash
# Download the script
curl -o attach-managed-identity.sh https://raw.githubusercontent.com/Azure/azure-docs/main/articles/energy-data-services/scripts/attach-managed-identity.sh
chmod +x attach-managed-identity.sh

# Run the script
./attach-managed-identity.sh
```

**You will be prompted for:**
1. Subscription ID where your ADME instance resides
2. ADME instance name
3. Managed identity name (from Step 2)

The script automatically detects the resource group, preserves existing identities, and assigns the new identity.

**Script source code:**

```bash
#!/bin/bash
set -e

# Attach a user-assigned managed identity to an Azure Data Manager for Energy instance

echo "Enter Subscription ID: "
read SUBSCRIPTION_ID

echo "Enter ADME Instance Name: "
read ADME_INSTANCE_NAME

echo "Enter Managed Identity Name: "
read MANAGED_IDENTITY_NAME

echo "Attaching managed identity to ADME instance..."

# Set subscription
az account set --subscription "$SUBSCRIPTION_ID"

# Get ADME instance
ADME_JSON=$(az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --name "$ADME_INSTANCE_NAME" --query "[0]" -o json)

if [ -z "$ADME_JSON" ] || [ "$ADME_JSON" = "null" ]; then
    echo "Error: ADME instance '$ADME_INSTANCE_NAME' not found"
    exit 1
fi

RESOURCE_GROUP=$(echo "$ADME_JSON" | jq -r '.resourceGroup')
ADME_ID=$(echo "$ADME_JSON" | jq -r '.id')
LOCATION=$(echo "$ADME_JSON" | jq -r '.location' | tr -d '\r')
AUTH_APP_ID=$(echo "$ADME_JSON" | jq -r '.properties.authAppId' | tr -d '\r')
DATA_PARTITION_NAME=$(echo "$ADME_JSON" | jq -r '.properties.dataPartitionNames[0].name' | tr -d '\r')

# Get managed identity
MI_JSON=$(az identity list --query "[?name=='$MANAGED_IDENTITY_NAME']" -o json)
MI_ID=$(echo "$MI_JSON" | jq -r '.[0].id' | tr -d '\r')

if [ -z "$MI_ID" ] || [ "$MI_ID" = "null" ]; then
    echo "Error: Managed identity '$MANAGED_IDENTITY_NAME' not found"
    exit 1
fi

# Build user-assigned identities (preserve existing)
EXISTING_IDENTITIES=$(echo "$ADME_JSON" | jq -r '.identity.userAssignedIdentities | keys[]' 2>/dev/null | tr -d '\r')
USER_ASSIGNED_IDENTITIES="\"$MI_ID\": {}"

if [ -n "$EXISTING_IDENTITIES" ]; then
    for identity in $EXISTING_IDENTITIES; do
        if [ "$identity" != "$MI_ID" ]; then
            USER_ASSIGNED_IDENTITIES="$USER_ASSIGNED_IDENTITIES, \"$identity\": {}"
        fi
    done
fi

# Get ARM token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv | tr -d '\r')

# Update ADME instance
curl --request PUT \
  --url "https://management.azure.com${ADME_ID}?api-version=2025-09-22-preview" \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{
    \"location\": \"$LOCATION\",
    \"properties\": {
      \"authAppId\": \"$AUTH_APP_ID\",
      \"dataPartitionNames\": [
        {
          \"name\": \"$DATA_PARTITION_NAME\"
        }
      ]
    },
    \"identity\": {
      \"type\": \"UserAssigned\",
      \"userAssignedIdentities\": {
        $USER_ASSIGNED_IDENTITIES
      }
    }
  }"

echo "Successfully attached managed identity to ADME instance"
```

---

## Step 4: Verify user has entitlement group access

To call ACZ APIs, you (the user) must be a member of the `users@{data-partition-id}.dataservices.energy` entitlement group.

> [!IMPORTANT]
> This step verifies that YOU (the user calling ACZ APIs) have access, not the user-assigned managed identity. The user-assigned managed identity created in Step 2 is only used by the ACZ service to write data to storage—it doesn't need entitlement group membership.

If you're not already a member of the users entitlement group, have an Azure Data Manager for Energy administrator add your user account. See [How to manage users](how-to-manage-users.md) for detailed instructions.

**To verify you have access**, use the Entitlements Service API to check your membership:

### [Bash](#tab/bash)

```bash
curl --request GET \
  --url https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data-partition-id}'
```

### [PowerShell](#tab/powershell)

```powershell
Invoke-RestMethod -Uri "https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members" -Method Get -Headers @{
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

The response should include your user account in the `members` array. If you're not listed, contact your Azure Data Manager for Energy administrator to add you to the users group.

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
curl --request POST \
  --url https://{base_url}/api/acz/v1/aczs \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: {data_partition_id}' \
  --data '{
    "name": "my-first-acz",
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

