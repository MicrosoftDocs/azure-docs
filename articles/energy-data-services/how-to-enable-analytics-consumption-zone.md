---
title: How to enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy
description: Learn how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy instance. Configure managed identity, storage, and permissions for ACZ.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 03/31/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to enable the Analytics Consumption Zone so that I can export ADME data to ADLS Gen2.

---

# How to enable the Analytics Consumption Zone (ACZ)

This article explains how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy (ADME) instance. Enablement is a one-time setup process that configures your ADME instance, managed identity, and storage account. After enablement, you can create multiple ACZs to sync different ADME data sets to your Azure Data Lake Storage (ADLS) Gen2 account.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Setup overview

Complete the following one-time setup tasks to enable ACZ on your ADME instance. After enablement, you can create multiple ACZs using the APIs.

| Step | Task | When to skip |
|------|------|-------------|
| 1 | Create or use existing ADLS Gen2 storage account | Required for ACZ destination |
| 2 | Create or use existing managed identity | Skip if reusing CMEK/EDS identity |
| 3 | Assign managed identity to ADME | Skip if reusing CMEK/EDS identity |
| 4 | Verify user has entitlement group access | Required to call ACZ APIs |
| 5 | Grant managed identity storage permissions | Required for ACZ to write data |
| 6 | Share managed identity and ADME instance details with Microsoft | Preview requirement |

## Prerequisites

- An active Azure subscription. [Create a subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy instance with at least one data partition. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
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

## Step 2: Create or use an existing managed identity

ACZ uses a user-assigned managed identity to write data to ADLS Gen2.

> [!TIP]
> If your ADME instance already has a user-assigned managed identity (for example, from Customer-Managed Encryption Keys (CMEK) or External Data Sources (EDS)), you can reuse it for ACZ. Note the managed identity **Resource ID** from **Settings** > **Properties**, then skip Step 3 and proceed to Step 4.

If you don't have a user-assigned managed identity or want to use a dedicated one for ACZ, create one:

1. In the [Azure portal](https://portal.azure.com/), search for **Managed Identities** and select it.
2. Select **+ Create**.
3. Select your subscription, resource group, region, and provide a name for the identity.
4. Select **Review + create**, then select **Create**.
5. After creation, open the managed identity and note the **Object (principal) ID** from the **Overview** page. You need this Object ID value in Step 4.

> [!TIP]
> You'll also need the managed identity's **Resource ID** in Step 6. While you're on the managed identity page, select **Settings** > **Properties** and copy the **Resource ID** (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`). Save this value for later.

> [!NOTE]
> The managed identity is used by the ACZ service to write data to your ADLS Gen2 storage account. It is NOT used for calling ACZ APIs—you (the user) need to be in the entitlement group for that (see Step 4).

## Step 2.5: Record the managed identity Resource ID

Before proceeding, ensure you have saved the managed identity's **Resource ID** from Step 2. This full Azure Resource ID is required in Step 6 to complete the ACZ enablement process.

**To find the Resource ID:**

1. In the [Azure portal](https://portal.azure.com/), navigate to your managed identity.
2. Select **Settings** > **Properties** from the left menu.
3. Copy the **Resource ID** value (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`).
4. Save this value in a secure location—you'll provide it to Microsoft in Step 6.

## Step 3: Assign the managed identity to your ADME instance

If you created a new managed identity in Step 2, assign it to your ADME instance.

> [!NOTE]
> If you reuse an existing managed identity from CMEK or EDS, skip this step (the identity is already assigned to ADME). Proceed to Step 4 to verify you have entitlement group access.

Use the Azure Management API to update your ADME instance with the managed identity:

```bash
curl --request PUT \
  --url 'https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name}?api-version=2025-09-22-preview' \
  --header 'Authorization: Bearer {management-api-token}' \
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

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{subscription-id}` | Your Azure subscription ID |
| `{resource-group}` | The resource group containing your ADME instance |
| `{adme-instance-name}` | Your ADME instance name |
| `{management-api-token}` | Azure Management API access token. See [Get access token](/rest/api/azure/#acquire-an-access-token) |
| `{location}` | Azure region of your ADME instance (for example, `southcentralus`) |
| `{auth-app-id}` | Application ID used for ADME authentication |
| `{data-partition-name}` | Name of your data partition (for example, `dp1`) |
| `{sub-id}` | Subscription ID where the managed identity resides |
| `{rg}` | Resource group where the managed identity resides |
| `{identity-name}` | Name of the user-assigned managed identity from Step 2 |

**To get the Management API access token**, use Azure CLI:

```bash
TOKEN=$(az account get-access-token --resource "https://management.core.windows.net/" --query accessToken -o tsv)
```

> [!IMPORTANT]
> - If you already have other user-assigned managed identities on the instance, include them all in the `userAssignedIdentities` object to avoid removing them.
> - If your instance uses system-assigned identity, set `"type": "UserAssigned, SystemAssigned"` instead.
> - This operation updates the entire instance configuration. Ensure all existing properties are included in the request body.

After the operation completes, verify the identity is assigned using Azure CLI:

```bash
az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query identity.userAssignedIdentities
```

The output should include your managed identity's resource ID.

## Step 4: Verify user has entitlement group access

To call ACZ APIs, you (the user) must be a member of the `users@{data-partition-id}.dataservices.energy` entitlement group.

> [!IMPORTANT]
> This step verifies that YOU (the user calling ACZ APIs) have access, not the managed identity. The managed identity created in Step 2 is only used by the ACZ service to write data to storage—it does not need entitlement group membership.

If you're not already a member of the users entitlement group, have an ADME administrator add your user account. See [How to manage users](how-to-manage-users.md) for detailed instructions.

**To verify you have access**, use the Entitlements Service API to check your membership:

```bash
curl --request GET \
  --url https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data-partition-id}'
```

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{base_url}` | Your ADME instance URL (for example, `myinstance.energy.azure.com`) |
| `{access_token}` | Your personal access token for ADME APIs. See [How to generate auth token](how-to-generate-auth-token.md) |
| `{data-partition-id}` | Your data partition ID (for example, `dp1`) |

**To get your ADME API access token**, use Azure CLI:

```bash
TOKEN=$(az account get-access-token --resource {auth-app-id} --query accessToken -o tsv)
```

Replace `{auth-app-id}` with your ADME authentication application ID.

The response should include your user account in the members list. If you're not listed, contact your ADME administrator to add you to the users group.

## Step 5: Grant the managed identity permissions on the ADLS Gen2 container

Grant the managed identity write access to the ADLS Gen2 storage account. This step is required even if you reuse an existing CMEK or EDS identity.

1. Navigate to your ADLS Gen2 storage account in the [Azure portal](https://portal.azure.com/).
2. Select **Access control (IAM)** from the left menu.
3. Select **+ Add** > **Add role assignment**.
4. On the **Role** tab, search for **Storage Blob Data Contributor**, select it, then select **Next**.
5. On the **Members** tab, select **Managed identity** for **Assign access to**.
6. Select **+ Select members**.
7. In the **Managed identity** dropdown, select **User-assigned managed identity**.
8. Select the managed identity you created in Step 2 (or your existing CMEK/EDS identity), then select **Select**.
9. Select **Review + assign** to complete the role assignment.

## Step 6: Share managed identity details with Microsoft (Preview requirement)

> [!IMPORTANT]
> During the preview, managed identities must be allowlisted by Microsoft before they can be used for ACZ operations. Share the following details with your Microsoft contact to allowlist the managed identity.

Provide the following information to your Microsoft representative:

| Information | Description |
|---|---|
| **Azure Data Manager for Energy instance name** | Your ADME instance name (for example, `my-adme-instance`). |
| **Managed identity Resource ID** | The full Azure Resource ID of the user-assigned managed identity. In the Azure portal, go to your managed identity and select **Settings** > **Properties** to find the **Resource ID** (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`). |

After Microsoft adds your managed identity to the allow list, ACZ is enabled on your ADME instance.

## Create an Analytics Consumption Zone

After completing the enablement steps above, you can create one or more ACZs to sync your ADME data to ADLS Gen2. Each ACZ can be configured to sync different data types.

### Verify your setup

Before creating your first ACZ, verify your configuration:

Check the following items before creating an ACZ:

1. **ADME instance is accessible**: Confirm your instance is running and you can get an access token. See [How to generate auth token](how-to-generate-auth-token.md).

2. **Data partition exists**: Confirm you have at least one data partition. Check the **Overview** page of your instance in the Azure portal.

3. **Entitlements group membership**: Confirm your user belongs to the `users@{data-partition-id}.dataservices.energy` group. See [How to manage users](how-to-manage-users.md).

4. **Managed identity assigned to ADME**: Verify the managed identity is assigned to your ADME instance using Azure CLI:
   ```bash
   az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query identity.userAssignedIdentities
   ```
   The output should include your managed identity's resource ID. If not configured, see [Step 3](#step-3-assign-the-managed-identity-to-your-adme-instance).

5. **Storage account access**: Verify the managed identity has **Storage Blob Data Contributor** on the ADLS Gen2 storage account.
   - In the [Azure portal](https://portal.azure.com/), navigate to your ADLS Gen2 storage account.
   - Select **Access control (IAM)** from the left menu.
   - Select **Role assignments** and search for your managed identity name.
   - Confirm the managed identity has the **Storage Blob Data Contributor** role assigned.
   - If not configured, see [Step 5](#step-5-grant-the-managed-identity-permissions-on-the-adls-gen2-container).

6. **ACZ enabled on ADME instance**: Confirm with your Microsoft contact that ACZ is enabled on your ADME instance and that the managed identity is on the allow list.

### Call the ACZ Create API

Use the ACZ Create API to create an Analytics Consumption Zone. For a full walkthrough, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md).

The following example uses cURL:

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
        "osdu:wks:master-data--Field:*"
      ],
      "wellboreDDMSKinds": [
        "osdu:wks:work-product-component--WellLog:*"
      ]
    }
  }'
```

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{base_url}` | Your ADME instance URL (for example, `myinstance.energy.azure.com`) |
| `{access_token}` | Access token for ADME APIs. See [How to generate auth token](how-to-generate-auth-token.md) |
| `{data_partition_id}` | Your data partition ID (for example, `dp1`) |
| `{sub-id}` | Subscription ID where the ADLS Gen2 storage account resides |
| `{rg}` | Resource group where the ADLS Gen2 storage account resides |
| `{account}` | Name of the ADLS Gen2 storage account |

**To get the ADME API access token**, use Azure CLI:

```bash
TOKEN=$(az account get-access-token --resource {auth-app-id} --query accessToken -o tsv)
```

Replace `{auth-app-id}` with your ADME authentication application ID.

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
      "osdu:wks:master-data--Field:*"
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

