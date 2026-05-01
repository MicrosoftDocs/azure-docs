---
title: How to enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy
description: Learn how to set up and enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy. Sync Azure Data Manager for Energy (ADME) data to Azure Data Lake Storage.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 03/31/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to enable the Analytics Consumption Zone so that I can export ADME data to ADLS Gen2.

---

# How to enable the Analytics Consumption Zone (ACZ)


This article explains how to set up and enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy (ADME). ACZ syncs selected ADME entity data to your Azure Data Lake Storage (ADLS) Gen2 account.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Setup overview

Complete the following tasks to enable ACZ. Some steps can be skipped depending on your existing setup.

| Step | Task | When to skip |
|------|------|-------------|
| 1 | Create or use existing ADLS Gen2 storage account | Never - required for ACZ destination |
| 2 | Create or use existing managed identity | Skip if reusing CMEK/EDS identity |
| 3 | Assign managed identity to ADME | Skip if reusing CMEK/EDS identity |
| 4 | Grant managed identity storage permissions | Never - required for ACZ to write data |
| 5 | Add managed identity to entitlement group | Never - required for ACZ operations |
| 6 | Share managed identity details with Microsoft | Never - preview requirement |
| 7 | Verify your setup | Recommended before creating ACZ |
| 8 | Create an ACZ using the API | Never - required to start sync |

**Estimated time to complete**: 30-45 minutes

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

> [!NOTE]
> The storage account must have hierarchical namespace enabled. ACZ doesn't support standard Azure Blob Storage accounts.

> [!IMPORTANT]
> You're responsible for selecting an in-geo destination storage account if you have data residency requirements. ACZ exports data to the ADLS Gen2 storage account you specify, regardless of location.

## Step 2: Create or use an existing managed identity

ACZ uses a user-assigned managed identity to write data to ADLS Gen2.

> [!TIP]
> If your ADME instance already has a user-assigned managed identity (for example, from CMEK or EDS), you can reuse it for ACZ. To reuse an existing identity:
> - Note the **Object (principal) ID** from the managed identity's **Overview** page. You need this in Step 5.
> - Skip the rest of Step 2 (don't create a new identity).
> - Skip Step 3 (the identity is already assigned to your ADME instance).
> - Complete Step 4 to grant the identity **Storage Blob Data Contributor** permissions on your ACZ destination storage account.
> - Complete Step 5 to add the identity to the entitlement group.

If you don't have a user-assigned managed identity or want to use a dedicated one for ACZ, create one:

1. In the [Azure portal](https://portal.azure.com/), search for **Managed Identities** and select it.
2. Select **+ Create**.
3. Select your subscription, resource group, region, and provide a name for the identity.
4. Select **Review + create**, then select **Create**.
5. After creation, open the managed identity and note the **Object (principal) ID** from the **Overview** page. You need this value in Step 5.

## Step 3: Assign the managed identity to your ADME instance

If you created a new managed identity in Step 2, assign it to your ADME instance.

> [!NOTE]
> If you're reusing an existing managed identity from CMEK or EDS, skip this step (it's already assigned). Proceed to Step 4.

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

> [!IMPORTANT]
> - If you already have other user-assigned managed identities on the instance, include them all in the `userAssignedIdentities` object to avoid removing them.
> - If your instance uses system-assigned identity, set `"type": "UserAssigned, SystemAssigned"` instead.
> - This operation updates the entire instance configuration. Ensure all existing properties are included in the request body.

After the operation completes, verify the identity is assigned using Azure CLI:

```bash
az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query identity.userAssignedIdentities
```

The output should include your managed identity's resource ID.

## Step 4: Grant the managed identity permissions on the ADLS Gen2 container

Grant the managed identity write access to the ADLS Gen2 storage account.

1. Navigate to your ADLS Gen2 storage account in the [Azure portal](https://portal.azure.com/).
2. Select **Access control (IAM)** from the left menu.
3. Select **+ Add** > **Add role assignment**.
4. On the **Role** tab, search for **Storage Blob Data Contributor**, select it, then select **Next**.
5. On the **Members** tab, select **Managed identity** for **Assign access to**.
6. Select **+ Select members**.
7. In the **Managed identity** dropdown, select **User-assigned managed identity**.
8. Select the managed identity you created in Step 2, then select **Select**.
9. Select **Review + assign** to complete the role assignment.

## Step 5: Add user to the entitlement group

The managed identity must be a member of the `users@{data-partition-id}.dataservices.energy` entitlement group to perform ACZ operations.

Use the Entitlements Service API to add the managed identity to the users group:

```bash
curl --request POST \
  --url https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'data-partition-id: {data-partition-id}' \
  --data '{
    "email": "{managed-identity-object-id}",
    "role": "MEMBER"
  }'
```

A successful response returns HTTP status `200` with the member details:

```json
{
  "email": "12345678-1234-1234-1234-123456789abc",
  "role": "MEMBER"
}
```

**Replace the placeholders:**

| Placeholder | Description |
|---|---|
| `{base_url}` | Your ADME instance URL (for example, `myinstance.energy.azure.com`) |
| `{access_token}` | Access token for ADME APIs. See [How to generate auth token](how-to-generate-auth-token.md) |
| `{data-partition-id}` | Your data partition ID (for example, `dp1`) |
| `{managed-identity-object-id}` | The Object (principal) ID of the managed identity from Step 2 |

Verify the managed identity was added successfully:

```bash
curl --request GET \
  --url https://{base_url}/api/entitlements/v2/groups/users@{data-partition-id}.dataservices.energy/members \
  --header 'Authorization: Bearer {access_token}' \
  --header 'data-partition-id: {data-partition-id}'
```

The response should include the managed identity in the members list.

## Step 6: Share managed identity details with Microsoft (Preview requirement)

> [!IMPORTANT]
> During the preview, there's no self-service UX to enable ACZ. Share the following details with your Microsoft contact to enable ACZ for your ADME instance and to allow list the managed identity for ACZ operations.

Provide the following information to your Microsoft representative:

| Information | Description |
|---|---|
| **Azure Data Manager for Energy instance name** | Your ADME instance name (for example, `my-adme-instance`). |
| **Managed identity Resource ID** | The full Azure Resource ID of the user-assigned managed identity. In the Azure portal, go to your managed identity and select **Settings** > **Properties** to find the **Resource ID** (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`). |

After Microsoft adds your managed identity to the allow list, you can create an ACZ through the APIs.

> [!NOTE]
> Allow-listing propagation may take up to 15 minutes. Wait before attempting to create an ACZ.

## Step 7: Verify your setup

Before you call the ACZ APIs, check these items:

1. **ADME instance is accessible**: Confirm your instance is running and you can get an access token. See [How to generate auth token](how-to-generate-auth-token.md).

2. **Data partition exists**: Confirm you have at least one data partition. Check the **Overview** page of your instance in the Azure portal.

3. **Entitlements group membership**: Confirm your user belongs to the `users@{data-partition-id}.dataservices.energy` group. See [How to manage users](how-to-manage-users.md).

4. **Storage account access**: Verify the managed identity has **Storage Blob Data Contributor** on the ADLS Gen2 storage account.
   - In the [Azure portal](https://portal.azure.com/), navigate to your ADLS Gen2 storage account.
   - Select **Access control (IAM)** from the left menu.
   - Select **Role assignments** and search for your managed identity name.
   - Confirm the managed identity has the **Storage Blob Data Contributor** role assigned.
   - If not configured, see [Step 4](#step-4-grant-the-managed-identity-permissions-on-the-adls-gen2-container).

5. **Managed identity assigned to ADME**: Verify the managed identity is assigned to your ADME instance using Azure CLI:
   ```bash
   az resource show --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.OpenEnergyPlatform/energyServices/{adme-instance-name} --query identity.userAssignedIdentities
   ```
   The output should include your managed identity's resource ID. If not configured, see [Step 3](#step-3-assign-the-managed-identity-to-your-adme-instance).

6. **ACZ enabled on ADME instance**: Confirm with your Microsoft contact that ACZ is enabled on your ADME instance. Also verify that the managed identity is on the allow list for ACZ operations.

## Step 8: Create an ACZ using the API

After allow-listing, use the ACZ Create API to set up your Analytics Consumption Zone. For a full walkthrough, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md).

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

A successful response returns HTTP status `201` with the ACZ details:

```json
{
  "aczId": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "my-first-acz",
  "status": "ACTIVE",
  "sink": {
    "storageType": "microsoft.storage/storageaccounts",
    "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
    "basePath": "acz-data"
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
  "createdAt": "2026-05-01T12:00:00Z"
}
```

Note the `aczId` value - you need this ACZ identifier to manage and query the ACZ.

## Related content

- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)

