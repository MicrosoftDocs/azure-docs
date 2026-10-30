---
title: Enable Analytics Consumption Zone in Azure Data Manager for Energy
description: Learn how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy instance. Configure user-assigned managed identity, storage, and permissions for ACZ instances.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 10/30/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to enable the Analytics Consumption Zone capability so that I can export Azure Data Manager for Energy data to Azure Data Lake Storage Gen2.

---

# Enable Analytics Consumption Zone

Native analytics capabilities in Azure Data Manager for Energy, delivered through an analytics consumption zone (ACZ), make energy data readily accessible for analytics and AI. ADME synchronizes selected OSDU® data into customer-owned storage in open Delta Parquet format, enabling use with Microsoft Fabric, Azure Databricks, Snowflake, and other compatible analytics platforms without the need to build and maintain custom data pipelines.

This article explains how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy resource. Enablement is a one-time setup process that configures your Azure Data Manager for Energy resource, user-assigned managed identity, and storage account. After enablement, you can create multiple ACZ instances to sync different Azure Data Manager for Energy datasets to your Azure Data Lake Storage Gen2 account.

To enable ACZ on your Azure Data Manager for Energy resource, follow the steps in this article.

## Setup overview

Setting up ACZ has two parts:

1. Enable ACZ on your Azure Data Manager for Energy resource in the Azure portal. Do this step once for each resource.
1. Create one or more ACZ instances by using the ACZ APIs. An ACZ instance defines which data ACZ exports and the storage location that it writes to. You can create up to three ACZ instances in each data partition.

ACZ doesn't export any data until you create an ACZ instance.

The setup configures a managed identity that enables ACZ to access Azure Data Manager for Energy data and write to Data Lake Storage Gen2.

Finish the following one-time setup tasks to enable ACZ on your Azure Data Manager for Energy resource. After enablement, you can create multiple ACZ instances by using the APIs.

> [!TIP]
> **Plan your ACZ configuration:** Before you create an ACZ instance, decide whether you need:
>
> - **All catalog data**: Set `allCatalogSync: true` (outside the configuration section) to export all catalog entity types from your partition.
> - **Specific entity types**: Use the `catalogKinds` array in the configuration section to export only selected kinds (for example, Wells, Wellbores, or Fields).
>
> When `allCatalogSync` is `true`, the `catalogKinds` and `wellboreDDMSKinds` (preview) arrays are ignored for catalog data. Wellbore Domain Data Management Service (DDMS) bulk file downloads occur only for kinds listed in `wellboreDDMSKinds`.
>
> For configuration examples, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md).

| Step | Task |
|------|------|
| 1 | Create or use an existing Data Lake Storage Gen2 storage account. |
| 2 | Create a user-assigned managed identity for ACZ. |
| 3 | Enable ACZ and assign the user-assigned managed identity in the Azure portal. |
| 4 | Verify that the user has entitlement group access. |
| 5 | Grant user-assigned managed identity storage permissions. |

> [!TIP]
> To export OSDU entitlement membership data for row-level filtering in your analytics platform, see [Entitlements export in Analytics Consumption Zone (preview)](concepts-analytics-consumption-zone-entitlements.md).

## Prerequisites

- An active Azure subscription. [Create a subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy instance (Developer or Standard tier) with at least one data partition. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- The [Azure CLI](/cli/azure/install-azure-cli) installed on your machine, or access to [Azure Cloud Shell](../cloud-shell/overview.md).

## Step 1: Create or use an existing Data Lake Storage Gen2 storage account

ACZ requires an Azure Data Lake Storage Gen2 storage account with hierarchical namespace enabled to store the synchronized data. If you don't already have one, create it.

1. In the [Azure portal](https://portal.azure.com/), select **Create a resource** > **Storage account**.
1. On the **Basics** tab, select your subscription and resource group.
1. Enter a storage account name and select your preferred region.
1. On the **Advanced** tab, select **Enable hierarchical namespace**.
1. Select **Review + create**, and then select **Create**.

> [!IMPORTANT]
> ACZ exports data to the Data Lake Storage Gen2 storage account that you specify, regardless of its location. If the storage account is in a different Azure region than your Azure Data Manager for Energy resource, your data is copied outside the resource's region. For recommended placement, use a storage account in the same region as your Azure Data Manager for Energy resource. ACZ doesn't enforce a same-region restriction. If you have data residency requirements, ensure that you select a storage account in the appropriate region.

> [!NOTE]
> ACZ currently requires the destination storage account to allow public network access. Storage accounts that restrict access by using firewall IP rules, disabled public network access, or private endpoints aren't supported. This requirement applies only to the destination storage account. ACZ APIs are available on Azure Data Manager for Energy instances that use [private endpoints](how-to-set-up-private-links.md).

## Step 2: Create a user-assigned managed identity for ACZ

ACZ uses a user-assigned managed identity to write data to Data Lake Storage Gen2, so you need to create a dedicated identity for ACZ.

> [!IMPORTANT]
> Microsoft recommends that you create a dedicated user-assigned managed identity for ACZ rather than reusing identities from other services like customer-managed keys (CMKs) or external data sources (EDS). A dedicated identity provides:
>
> - **Clear audit trails**: Separate identity makes it easier to track ACZ-specific operations in audit logs.
> - **Independent lifecycle management**: Independent control lets you rotate, update, or remove ACZ identity without affecting other services.
> - **Granular access control**: ACZ identity gets only the permissions it needs (Storage Blob Data Contributor) without inheriting unnecessary permissions.
> - **Simplified troubleshooting**: Issues with ACZ permissions don't affect CMKs, EDS, or other services.

To create a user-assigned managed identity:

1. In the [Azure portal](https://portal.azure.com/), search for **Managed Identities** and select it.
1. Select **+ Create**.
1. Select your subscription, resource group, and region, and provide a name for the identity.
1. Select **Review + create**, and then select **Create**.

## Step 3: Enable ACZ and assign the user-assigned managed identity

Enable ACZ on your Azure Data Manager for Energy resource and select the user-assigned managed identity that you created in Step 2.

> [!NOTE]
> Analytics Consumption Zone is an optional, billable feature. Charges begin when you enable it. [View pricing](https://azure.microsoft.com/pricing/details/energy-data-services/).

1. Go to your Azure Data Manager for Energy resource in the Azure portal.
1. In the left menu, under **Advanced**, select **Analytics Consumption Zone**.
1. Select the checkbox to **Enable Analytics Consumption Zone**.
1. Next to **User-assigned identity**, select **Select a user identity** to open the form.
1. Select the subscription and the user-assigned managed identity that you created in Step 2, and then select **Add**. You can select only one identity. If you're reusing an existing identity, select that identity instead.

    :::image type="content" source="media/how-to-enable-analytics-consumption-zone/enable-analytics-consumption-zone-select-identity.png" alt-text="Screenshot of the Analytics Consumption Zone page with Enable Analytics Consumption Zone selected and the Select user assigned managed identity pane open, showing a selected identity and the Add button." lightbox="media/how-to-enable-analytics-consumption-zone/enable-analytics-consumption-zone-select-identity.png":::

1. Select **Save** to apply the configuration.

    :::image type="content" source="media/how-to-enable-analytics-consumption-zone/enable-analytics-consumption-zone-save.png" alt-text="Screenshot of the Analytics Consumption Zone page with a user-assigned identity selected and the Save button highlighted." lightbox="media/how-to-enable-analytics-consumption-zone/enable-analytics-consumption-zone-save.png":::

After the configuration is saved, **Enable Analytics Consumption Zone** appears selected and unavailable, and **User-assigned identity** shows the selected identity.

> [!IMPORTANT]
> After you enable ACZ, you can't disable it in the Azure portal. To disable ACZ on an Azure Data Manager for Energy resource, [create a support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade).

> [!IMPORTANT]
> Enabling ACZ doesn't start exporting data. To start exporting, complete the remaining steps, and then [create an ACZ instance](#create-an-acz-instance).

## Step 4: Verify that the user has entitlement group access

To call ACZ APIs, you (the user) must be a member of the following entitlement groups:

- `users@{data-partition-id}.dataservices.energy`
- `users.datalake.ops@{data-partition-id}.dataservices.energy`
- `service.entitlements.user@{data-partition-id}.dataservices.energy`

This step verifies that *you* (the user calling ACZ APIs) have access, not the user-assigned managed identity. The user-assigned managed identity created in Step 2 is used only by ACZ to write data to storage. It doesn't need entitlement group membership.

If you're not already a member of these entitlement groups, have an Azure Data Manager for Energy administrator add your user account. For detailed instructions, see [Manage users in Azure Data Manager for Energy](how-to-manage-users.md).

To verify that you have access, use the Entitlements Service API to check your membership in all three groups.

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

# Check service.entitlements.user group membership
curl --http1.1 --request GET \
  --url https://{base_url}/api/entitlements/v2/groups/service.entitlements.user@{data-partition-id}.dataservices.energy/members \
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

# Check service.entitlements.user group membership
Invoke-RestMethod -Uri "https://{base_url}/api/entitlements/v2/groups/service.entitlements.user@{data-partition-id}.dataservices.energy/members" -Method Get -Headers @{
    "Authorization" = "Bearer {access_token}"
    "data-partition-id" = "{data-partition-id}"
}
```

---

#### Replace the placeholders

| Placeholder | Description |
|---|---|
| `{base_url}` | Your Azure Data Manager for Energy resource URL (for example, `myinstance.energy.azure.com`). |
| `{access_token}` | Your personal access token for Azure Data Manager for Energy APIs. See [Generate an auth token](how-to-generate-auth-token.md). |
| `{data-partition-id}` | Your data partition ID (for example, `dp1`). |

#### Sample response

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

All three responses should include your user account in the `members` array. If you're not listed in any of the groups, contact your Azure Data Manager for Energy administrator to add you to all three required groups.

## Step 5: Grant the user-assigned managed identity permissions on the Data Lake Storage Gen2 container

Grant the user-assigned managed identity write access to the Data Lake Storage Gen2 storage account. The ACZ identity needs Storage Blob Data Contributor permissions to write Delta Parquet files.

1. Go to your Data Lake Storage Gen2 storage account in the [Azure portal](https://portal.azure.com/).
1. Select **Access control (IAM)** from the left menu.
1. Select **+ Add** > **Add role assignment**.
1. On the **Role** tab, search for **Storage Blob Data Contributor**, select it, and then select **Next**.
1. On the **Members** tab, for **Assign access to**, select **Managed identity**.
1. Choose **+ Select members**.
1. In the **Managed identity** dropdown list, select **User-assigned managed identity**.
1. Select the user-assigned managed identity that you created in Step 2, and then choose **Select**. If you're reusing an existing identity, such as the identity that you use for [customer-managed keys (CMK)](how-to-manage-data-security-and-encryption.md) or [External Data Services (EDS)](how-to-enable-external-data-services.md), select that identity instead.
1. Select **Review + assign** to finish the role assignment.

## Create an ACZ instance

After you finish the enablement steps, you can create one or more ACZ instances to sync your Azure Data Manager for Energy data to Data Lake Storage Gen2. You can configure each ACZ instance to sync different data types.

> [!NOTE]
> You can't edit an existing ACZ definition, for example to add or remove kinds. To change a definition, create a new ACZ with the configuration you need. Each ACZ has its own identifier and output path, so update any downstream tables, shortcuts, or external locations to point to the new ACZ.

### Call the ACZ Create API

Use the ACZ Create API to create an ACZ instance. For a full walkthrough, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md).

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

#### Replace the placeholders

| Placeholder | Description |
|---|---|
| `{base_url}` | Your Azure Data Manager for Energy resource URL (for example, `myinstance.energy.azure.com`). |
| `{access_token}` | The access token for Azure Data Manager for Energy APIs. See [Generate an auth token](how-to-generate-auth-token.md). |
| `{data_partition_id}` | Your data partition ID (for example, `dp1`). |
| `{sub-id}` | The subscription ID where the Data Lake Storage Gen2 storage account resides. |
| `{rg}` | The resource group where the Data Lake Storage Gen2 storage account resides. |
| `{account}` | The name of the Data Lake Storage Gen2 storage account. |

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

Make a note of the `aczId` value. You need it to manage and query the ACZ instance by using APIs, and to find your data in storage as described in the following table.

The optional `basePath` property determines where ACZ writes data in your storage account:

| `basePath` | Data location |
| --- | --- |
| Not specified | `<aczId>/<aczId>/` |
| `analytics` | `analytics/<aczId>/` |
| `analytics/workbench` | `analytics/workbench/<aczId>/` |

The first segment of the data location is the container. ACZ uses the first segment of `basePath` as the container name, or the `aczId` if you don't specify a base path, and creates the container if it doesn't exist. The first segment must be a valid container name. For naming rules, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata). Any additional `basePath` segments are created as folders in that container. The first segment must follow [container naming rules](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names): 3 to 63 characters, using lowercase letters, numbers, and hyphens.

> [!TIP]
> If you create an ACZ from the Swagger UI or a sample request, replace the placeholder `basePath` value. For example, the Swagger default value `string` creates a container named `string`.

After you create an ACZ instance, ACZ takes a historical snapshot of the data that you selected. To check progress, call the Get ACZ API and check the `status` and `historicalSnapshotStatus` fields. When `historicalSnapshotStatus` is `COMPLETED`, the initial export is finished, and ACZ continues to sync new changes. For details, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md#get-acz-details).

## Related content

- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)
- [Entitlements export in Analytics Consumption Zone (preview)](concepts-analytics-consumption-zone-entitlements.md)