---
title: How to enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy
description: Learn how to set up and enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy. Sync OSDU data to Azure Data Lake Storage.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 03/31/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to enable the Analytics Consumption Zone so that I can export ADME data to ADLS Gen2.

---

# How to enable the Analytics Consumption Zone (ACZ)


This article explains how to set up and enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy. ACZ syncs selected Azure Data Manager for Energy entity data to your Azure Data Lake Storage (ADLS) Gen2 account.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An active Azure subscription. [Create a subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy instance with at least one data partition. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- An Azure Data Lake Storage Gen2 storage account with [hierarchical namespace enabled](../storage/blobs/data-lake-storage-namespace.md).
- A user-assigned managed identity.
- The [Azure CLI](/cli/azure/install-azure-cli) installed on your machine, or access to [Azure Cloud Shell](../cloud-shell/overview.md).

## Step 1: Create or configure an ADLS Gen2 storage account

If you don't already have an ADLS Gen2 storage account, create one:

1. In the [Azure portal](https://portal.azure.com/), select **Create a resource** > **Storage account**.
2. On the **Basics** tab, select your subscription and resource group.
3. Enter a storage account name and select your preferred region.
4. On the **Advanced** tab, select **Enable hierarchical namespace**.
5. Select **Review + create**, then select **Create**.

> [!NOTE]
> The storage account must have hierarchical namespace enabled. ACZ doesn't support standard Azure Blob Storage accounts.

> [!IMPORTANT]
> You're responsible for selecting an in-geo destination storage account if you have data residency requirements. ACZ exports data to the ADLS Gen2 storage account you specify, regardless of location.

## Step 2: Create a managed identity

ACZ uses a managed identity to write data to ADLS Gen2. Create a user-assigned managed identity:

1. In the [Azure portal](https://portal.azure.com/), search for **Managed Identities** and select it.
2. Select **+ Create**.
3. Select your subscription, resource group, region, and provide a name for the identity.
4. Select **Review + create**, then select **Create**.
5. After creation, open the managed identity and note the **Client ID** and **Object (principal) ID** from the **Overview** page.

## Step 3: Assign the managed identity to your ADME instance

If you don't already have a managed identity assigned to your Azure Data Manager for Energy instance (for example, from Customer-Managed Encryption Keys (CMEK) or External Data Sources (EDS)), you must assign the user-assigned managed identity you created in Step 2.

> [!NOTE]
> If your ADME instance already has user-assigned managed identities configured for CMEK or EDS, you can skip this step and proceed to Step 4.

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

After the operation completes, verify the identity is assigned:

1. In the [Azure portal](https://portal.azure.com/), navigate to your ADME instance.
2. Select **Identity** from the left menu.
3. Under **User assigned**, confirm your managed identity appears in the list.

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

5. **Managed identity assigned to ADME**: Verify the managed identity is assigned to your ADME instance. In the [Azure portal](https://portal.azure.com/), navigate to your ADME instance, select **Identity** from the left menu, then confirm your managed identity appears under **User assigned**.

6. **ACZ enabled on ADME instance**: Confirm with your Microsoft representative that ACZ has been enabled on your ADME instance and the managed identity has been allow-listed for ACZ operations.

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

A successful response returns status `201` with the ACZ details. The response includes the ACZ ID and an initial status of `ACTIVE`.

## Related content

- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)

