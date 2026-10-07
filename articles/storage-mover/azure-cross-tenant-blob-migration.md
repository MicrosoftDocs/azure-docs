---
title: Get started with cross-tenant Azure Blob container migration in Azure Storage Mover
description: The cross-tenant migration feature enables you to transfer data between Azure Blob containers in different Microsoft Entra tenants managed by different organizations or directories.
author: rajsinghmsa
ms.author: singra
ms.service: azure-storage-mover
ms.topic: quickstart
ms.date: 10/05/2026
---

# Get started with cross-tenant Azure Blob container migration in Azure Storage Mover

Azure Storage Mover enables you to transfer data between Azure Blob containers in storage accounts that belong to different Microsoft Entra tenants. Use cross-tenant migration when the source and target storage accounts are managed by different organizations or directories.

This article guides you through configuring Storage Mover to migrate data between two Blob containers across tenants. The process consists of creating a Storage Mover resource and endpoint in each tenant, granting each endpoint access to its local storage account, and creating and running a migration job in the source tenant.

Each step in this article includes instructions for two options: the **Azure portal**, using the guided **Get started** flow of the Storage Mover resource, and **Azure CLI**, calling the Storage Mover REST API with `az rest`.

For migration between storage accounts in the same tenant, see [Get started with blob-to-blob migration in Azure Storage Mover](azure-to-azure-migration.md).

> [!NOTE]
> Cross-tenant configuration is available through the Azure portal and through the Storage Mover REST API. It isn't available through the Azure PowerShell Storage Mover module or the Azure CLI `storage-mover` command group, so the Azure CLI examples in this article use `az rest`.

## Prerequisites

Before you begin, ensure that you have:

- Two different Entra tenants, with an Azure subscription in each tenant.
- Existing source and target storage accounts, each containing a Blob container. The steps in this article don't create storage accounts or containers.
- Access to both tenants. Use separate operators in each tenant, or one account that has the required access in both tenants using a main and a guest account.
- Permission to create Storage Mover resources in each tenant, such as Contributor on the relevant resource group. Creating a resource group and registering a resource provider requires the corresponding subscription-level permissions.
- Permission to assign Azure role-based access control (RBAC) roles on each storage account, such as Role Based Access Control Administrator or User Access Administrator at the appropriate scope. Contributor alone doesn't grant permission to create role assignments. Ensure any role-assignment conditions permit the roles used in this article.
- For the Azure portal option: access to the Azure portal in each tenant. If you use one account for both tenants, switch between them by selecting **Settings** > **Directories + subscriptions**.
- For the Azure CLI option: [Azure CLI](/cli/azure/install-azure-cli) and a PowerShell shell. The examples use PowerShell line continuation with a backtick, but invoke Azure CLI commands instead of Azure PowerShell cmdlets.

Create one Storage Mover resource in each tenant in this article. Both Storage Mover resources must be in the same Azure region, although the storage accounts can be in different regions. A storage account can be in a different subscription or resource group from its Storage Mover resource, but must belong to the same tenant as that Storage Mover resource.

## Limits

The Azure Blob container-to-container cross-tenant transfer feature has the following limits:

- Each migration job supports up to 500 million objects.
- Each subscription supports up to 10 concurrent jobs. To request more concurrent jobs, create a support request.
- Storage Mover doesn't automatically rehydrate archived blobs. Restore data in the Archive tier and wait for rehydration to complete before starting a migration job.
- The source and target must refer to different Blob containers.
- Blobs are copied, not removed from the source. The source container and its data remain after migration completes.
- Source and target Storage Mover resources must be in the same Azure region. This limit doesn't apply to the storage accounts, which can be in different Azure regions.

For cross-tenant migration, both endpoints must explicitly enable cross-tenant transfer and allow the partner storage account. You create the project, job definition, and job run in the source Storage Mover resource. Don't create a second job in the target tenant.

## Cross-tenant migration flow

This section illustrates the relationships between the Azure resources used in a cross-tenant migration, and the associated migration workflow.

### Azure resources and their relationships

Each tenant contains a Storage Mover resource, an endpoint with its own managed identity, and a storage account with a Blob container. The source Storage Mover resource also contains the project, job definition, and job run. The following visual shows resource ownership, access, and the logical transfer direction. Both Storage Mover resources contain their respective Storage Mover endpoints. These endpoints are granted required RBAC permissions on to the Storage Account that these endpoints point to. The RBAC permissions required for the cross-tenant migration are Storage Account Contributor (on the Storage Account) and Storage Blob Data Owner (on the blob container inside the Storage Account).

:::image type="content" source="media/azure-cross-tenant-blob-migration/azure-resource-relationship-sml.png" alt-text="Screenshot of a diagram showing the source and target tenants, each with a Storage Mover resource, an endpoint with a system-assigned identity, and a storage account. The source project owns the job definition and job run, and blobs are copied from source to target." lightbox="media/azure-cross-tenant-blob-migration/azure-resource-relationship-lrg.png":::

### Set up and start the migration

Follow the flow in the diagram to set up and start a cross-tenant blob-to-blob migration. The step numbers correspond to the detailed procedures later in this article.

:::image type="content" source="media/azure-cross-tenant-blob-migration/cross-tenant-migration-workflow.png" alt-text="Screenshot of a diagram of the cross-tenant migration flow. Steps S1 through S5 run in the source tenant and steps T1 through T4 run in parallel in the target tenant. The flows merge at S6, create the cross-tenant job definition, followed by S7, start the migration job run, and S8, monitor migration." lightbox="media/azure-cross-tenant-blob-migration/cross-tenant-migration-workflow.png":::

## Cross-tenant migration steps

The numbered steps match the [flow above](#set-up-and-start-the-migration). The source tenant operator performs steps [S1](#s1-prepare-the-source-tenant) through [S8](#s8-monitor-migration-progress), and the target tenant operator performs steps [T1](#t1-prepare-the-target-tenant) through [T4](#t4-assign-rbac-roles-to-the-target-endpoint). You can run steps S1 through S5 and T1 through T4 in parallel, but T1 through T4 must be complete before S6, because S6 needs the target tenant ID and target endpoint resource ID from T4. For each step, follow either the **Azure portal** instructions or the **Azure CLI** instructions.

### Before you begin

An endpoint is a Storage Mover resource that describes a source or target location and its access configuration. A job definition uses endpoints to identify the locations for a copy operation. For more information, see [Manage Azure Storage Mover endpoints](endpoint-manage.md).

### [Azure portal](#tab/portal)

Each Storage Mover resource has a guided **Get started** experience under **Plan + run migrations** > **Projects**. When you select **Azure to Azure**, **Azure Blob container**, and a cross-tenant destination, the portal shows the cross-tenant path as a series of steps:

- In the source tenant (**To another tenant**): **Prerequisite** > **Source** > **RBAC** > **Project** > **Migration job**.
- In the target tenant (**From another tenant**): **Prerequisite** > **Target** > **RBAC** > **Migration job**.

:::image type="content" source="media/azure-cross-tenant-blob-migration/source-get-started.png" alt-text="Screenshot of the Get started tab in the source Storage Mover with Azure to Azure, Azure Blob container, and To another tenant selected, and the Prerequisite card displayed." lightbox="media/azure-cross-tenant-blob-migration/source-get-started.png":::

You can also create endpoints and assign access outside of the **Get started** flow. See [Create source and target endpoints without the Get started flow](#create-source-and-target-endpoints-without-the-get-started-flow) and [Assign access to an endpoint](#assign-access-to-an-endpoint) later in this article.

### [Azure CLI](#tab/CLI)

Use the following placeholder conventions:

- `source-tenant-id` and `target-tenant-id` identify the two Entra directories.
- `source-mover-subscription-id` and `target-mover-subscription-id` identify the subscriptions containing the Storage Mover resources. The mover resource groups and mover names are separate from the storage account resource groups and names.
- `source-storage-subscription-id` and `target-storage-subscription-id` identify the subscriptions containing the storage accounts. Use the mover subscription ID here only if both resources are in that subscription.
- `mover-region` is the common region for both Storage Mover resources. `source-management-host` and `target-management-host` are the approved management host names for those resources, without `https://`. In the regional endpoint pattern used here, the host is `<mover-region>.management.azure.com`. Confirm the host for your release and region. The token audience remains `https://management.azure.com/`.
- `source-endpoint-principal-id` and `target-endpoint-principal-id` are values returned after endpoint creation. They aren't the tenant IDs, role IDs, or identities of the parent Storage Mover resources.

> [!IMPORTANT]
> These examples use Storage Mover API version `2026-05-01`.
>
> These examples are direct creation requests, not an idempotent setup script. Use new resource names or verify existing resources before reusing them. Don't use a PUT request to overwrite an existing endpoint or job unintentionally.
>
> After a failed command, resolve the error before proceeding. If a create request returns an in-progress provisioning state, repeat that resource's URL with `--method GET` until provisioning succeeds before creating dependent resources.

---

## Source tenant steps

In the source tenant, perform steps S1 through S8.

### S1. Prepare the source tenant

### [Azure portal](#tab/portal)

1. Sign in to the Azure portal with an account in the source tenant. If your account has access to several directories, select **Settings** > **Directories + subscriptions** and switch to the source tenant.
1. Search for and select **Subscriptions**, and then select the subscription that contains the source Storage Mover resource.
1. Under **Settings**, select **Resource providers**. Filter for `Microsoft.StorageMover`. If the status isn't **Registered**, select the provider and then select **Register**. Wait until the status shows **Registered**.
1. If the resource group for the source Storage Mover doesn't exist, create it while you create the Storage Mover resource in the next step.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/source-resource-provider-registered.jpg" alt-text="Screenshot of the Resource providers page of the source subscription, showing the Microsoft.StorageMover resource provider with a status of Registered." lightbox="media/azure-cross-tenant-blob-migration/source-resource-provider-registered.jpg":::

### [Azure CLI](#tab/CLI)

Sign in to the source tenant and select the subscription for the source Storage Mover resource. Register `Microsoft.StorageMover` in that subscription. Add `--use-device-code` to `az login` if your environment requires device-code sign-in.

**Azure CLI command**

```azurecli
az cloud set --name "AzureCloud"
az login --tenant "<source-tenant-id>" --output none
az account set --subscription "<source-mover-subscription-id>"
az provider register --namespace Microsoft.StorageMover `
  --subscription "<source-mover-subscription-id>" --wait
```

**Example command**

```azurecli
az cloud set --name "AzureCloud"
az login --tenant "00001111-aaaa-2222-bbbb-3333cccc4444" --output none
az account set --subscription "11112222-bbbb-3333-cccc-4444dddd5555"
az provider register --namespace Microsoft.StorageMover `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --wait
```

If the resource group for the source Storage Mover doesn't exist, create it. The resource group's metadata location doesn't determine the Storage Mover resource's region.

**Azure CLI command**

```azurecli
az group create --name "<source-mover-resource-group>" `
  --location "<resource-group-region>" `
  --subscription "<source-mover-subscription-id>" --output json
```

**Example command**

```azurecli
az group create --name "contoso-migration-rg" `
  --location "eastus2" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json
```

---

### S2. Create the source Storage Mover resource

### [Azure portal](#tab/portal)

1. Search for and select **Storage movers**, select **Create**.
1. On the **Basics** tab, select the source **Subscription**. For **Resource group**, select an existing resource group, or select **Create new**, enter a name, and select **OK**.
1. Enter a **Name** for the source Storage Mover and select the **Region**. Use the same region that you'll use for the target Storage Mover resource in step [T2](#t2-create-the-target-storage-mover-resource).
1. Select **Review + create**, and then select **Create**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/source-storage-mover-create.png" alt-text="Screenshot of the Basics tab for creating the source Storage Mover resource, including the subscription, a new resource group, the name, and the region." lightbox="media/azure-cross-tenant-blob-migration/source-storage-mover-create.png":::

### [Azure CLI](#tab/CLI)

Create the source Storage Mover in the region you selected for both Storage Mover resources.

**Azure CLI command**

```azurecli
az rest --method PUT `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" `
  --headers "Content-Type=application/json" `
  --body "@source-mover.json" --output json
```

**Generic payload: `source-mover.json`**

```json
{
  "location": "<mover-region>",
  "properties": {
    "description": "Source Storage Mover for cross-tenant migration."
  }
}
```

**Example command**

```azurecli
az rest --method PUT `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
  --headers "Content-Type=application/json" `
  --body "@source-mover.example.json" --output json
```

**Example payload: `source-mover.example.json`**

```json
{
  "location": "eastus2",
  "properties": {
    "description": "Source Storage Mover for cross-tenant migration."
  }
}
```

---

### S3. Create the source endpoint

### [Azure portal](#tab/portal)

1. Open the source Storage Mover resource. Under **Plan + run migrations**, select **Projects**, and then select the **Get started** tab.
1. For **What is your migration type?**, select **Azure to Azure**. For **What is your source type?**, select **Azure Blob container**. For **Where is your data moving?**, select **To another tenant**.
1. Review the **Prerequisite** card. A Storage Mover resource must exist in the partner tenant in the same Azure region, and both endpoints must allow-list the storage account in the other tenant. You need the target storage account resource ID for this step. See [Copy the resource IDs to share between tenants](#copy-the-resource-ids-to-share-between-tenants).

    :::image type="content" source="media/azure-cross-tenant-blob-migration/source-get-started.png" alt-text="Screenshot of the Get started tab in the source Storage Mover with Azure to Azure, Azure Blob container, and To another tenant selected, and the Prerequisite card displayed." lightbox="media/azure-cross-tenant-blob-migration/source-get-started.png":::

1. Select **Source**, and then select **Create source endpoint**. If you already created a cross-tenant source endpoint, select **Select existing source endpoint** instead.
1. In the **Create source endpoint** pane, **Migration type** and **Source type** are prefilled. Select the **Subscription**, **Storage account**, and **Azure blob container** of the source data. Optionally, enter a **Source description**.
1. **Is this a cross-tenant migration?** is selected. Under **Allow list**, select **Add**, and paste the full resource ID of the target storage account.
1. Select **Create**. The endpoint is created with a system-assigned managed identity.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/source-endpoint-create.png" alt-text="Screenshot of the Create source endpoint pane with cross-tenant migration selected and the target storage account resource ID in the allow list." lightbox="media/azure-cross-tenant-blob-migration/source-endpoint-create.png":::

### [Azure CLI](#tab/CLI)

Create a source endpoint under the source Storage Mover resource. Set `storageAccountResourceId` to the source storage account, and `blobContainerName` to the existing source blob container. Set `endpointKind` to `Source` and `enableCrossTenantTransfer` to `true`. In `allowedStorageAccounts`, specify the full resource ID of the target storage account.

**Azure CLI command**

```azurecli
az rest --method PUT `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/endpoints/<source-endpoint-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" `
  --headers "Content-Type=application/json" `
  --body "@source-endpoint.json" --output json
```

**Generic payload: `source-endpoint.json`**

```json
{
  "identity": { "type": "SystemAssigned" },
  "properties": {
    "description": "Source container for cross-tenant migration.",
    "endpointType": "AzureStorageBlobContainer",
    "endpointKind": "Source",
    "storageAccountResourceId": "/subscriptions/<source-storage-subscription-id>/resourceGroups/<source-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<source-storage-account-name>",
    "blobContainerName": "<source-container-name>",
    "enableCrossTenantTransfer": true,
    "allowedStorageAccounts": [
      "/subscriptions/<target-storage-subscription-id>/resourceGroups/<target-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<target-storage-account-name>"
    ]
  }
}
```

**Example command**

```azurecli
az rest --method PUT `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/endpoints/contoso-source-endpoint?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
  --headers "Content-Type=application/json" `
  --body "@source-endpoint.example.json" --output json
```

**Example payload: `source-endpoint.example.json`**

```json
{
  "identity": { "type": "SystemAssigned" },
  "properties": {
    "description": "Source container for cross-tenant migration.",
    "endpointType": "AzureStorageBlobContainer",
    "endpointKind": "Source",
    "storageAccountResourceId": "/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-storage-rg/providers/Microsoft.Storage/storageAccounts/contososource001",
    "blobContainerName": "contoso-source",
    "enableCrossTenantTransfer": true,
    "allowedStorageAccounts": [
      "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-storage-rg/providers/Microsoft.Storage/storageAccounts/fabrikamtarget001"
    ]
  }
}
```

---

### S4. Assign RBAC roles to the source endpoint

### [Azure portal](#tab/portal)

1. In the same **Get started** flow, select **RBAC**, and then select **Assign access**.
1. Storage Mover assigns roles to the source endpoint's managed identity: **Storage Account Contributor** on the source storage account, and **Storage Blob Data Owner** on the source blob container.
1. Confirm that each role shows **Successfully assigned**, and then select **Done**. If an assignment fails, ensure your account can create role assignments (see [Prerequisites](#prerequisites)), and then retry or follow the steps in [Assign access to an endpoint](#assign-access-to-an-endpoint).

    :::image type="content" source="media/azure-cross-tenant-blob-migration/source-endpoint-assign-access.png" alt-text="Screenshot of the RBAC step showing the Storage Account Contributor and Storage Blob Data Owner roles successfully assigned to the source endpoint's managed identity." lightbox="media/azure-cross-tenant-blob-migration/source-endpoint-assign-access.png":::

### [Azure CLI](#tab/CLI)

Assign the *Storage Account Contributor* RBAC role to the source endpoint's system-assigned managed identity, scoped to the source storage account, and the *Storage Blob Data Owner* RBAC role scoped to the source blob container inside the source storage account. Retrieve the identity's principal ID to perform this action. Use the returned principal ID value for `source-endpoint-principal-id` in both commands. If no principal ID is returned, wait for the endpoint provisioning to complete and repeat the `GET` request. Don't proceed with an empty principal ID.

> [!IMPORTANT]
> In this cross-tenant workflow, each endpoint identity needs both RBAC roles: *Storage Account Contributor* on its storage account and *Storage Blob Data Owner* on its blob container.

**Azure CLI command**

```azurecli
$sourcePrincipalId = az rest --method GET `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/endpoints/<source-endpoint-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" `
  --query identity.principalId --output tsv

az role assignment create `
  --assignee-object-id $sourcePrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Account Contributor" `
  --scope "/subscriptions/<source-storage-subscription-id>/resourceGroups/<source-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<source-storage-account-name>" `
  --subscription "<source-storage-subscription-id>" --output json

az role assignment create `
  --assignee-object-id $sourcePrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Owner" `
  --scope "/subscriptions/<source-storage-subscription-id>/resourceGroups/<source-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<source-storage-account-name>/blobServices/default/containers/<source-container-name>" `
  --subscription "<source-storage-subscription-id>" --output json
```

**Example command**

```azurecli
$sourcePrincipalId = az rest --method GET `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/endpoints/contoso-source-endpoint?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
  --query identity.principalId --output tsv

az role assignment create `
  --assignee-object-id $sourcePrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Account Contributor" `
  --scope "/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-storage-rg/providers/Microsoft.Storage/storageAccounts/contososource001" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json

az role assignment create `
  --assignee-object-id $sourcePrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Owner" `
  --scope "/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-storage-rg/providers/Microsoft.Storage/storageAccounts/contososource001/blobServices/default/containers/contoso-source" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json
```

---

### S5. Create a project

A *migration project* organizes migrations into manageable units. A *job definition* specifies the source and target endpoints and the copy settings. In a cross-tenant migration, you create both the migration project and the job definition in the source Storage Mover.

### [Azure portal](#tab/portal)

Select **Project** in the **Get Started flow** to open the **Create a project** pane. Enter a **Project name**. You can't change the project name later. Optionally, enter a **Project description**, and then select **Create**.

:::image type="content" source="media/azure-cross-tenant-blob-migration/project-create.png" alt-text="Screenshot of the Project step in the Get started flow of the source Storage Mover, with the Create project pane open." lightbox="media/azure-cross-tenant-blob-migration/project-create.png":::

### [Azure CLI](#tab/CLI)

Create a migration project in the source Storage Mover resource using the following command.

**Azure CLI command**

```azurecli
az rest --method PUT `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" `
  --headers "Content-Type=application/json" `
  --body "@source-project.json" --output json
```

**Generic payload: `source-project.json`**

```json
{
  "properties": {
    "description": "Source project for cross-tenant Blob migration."
  }
}
```

**Example command**

```azurecli
az rest --method PUT `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
  --headers "Content-Type=application/json" `
  --body "@source-project.example.json" --output json
```

**Example payload: `source-project.example.json`**

```json
{
  "properties": {
    "description": "Source project for cross-tenant Blob migration."
  }
}
```

---

### S6. Create the cross-tenant job definition

> [!IMPORTANT]
> Complete steps [T1](#t1-prepare-the-target-tenant)–[T4](#t4-assign-rbac-roles-to-the-target-endpoint) in the target tenant before you start this step. You need the target tenant ID and the target endpoint resource ID that the target tenant operator shares at the end of step [T4](#t4-assign-rbac-roles-to-the-target-endpoint).

> [!WARNING]
> The *Mirror* copy mode deletes data in the target scope that doesn't exist in the source scope. Review the selected containers, subpaths, and copy mode before creating or running the job. Use *Mirror* only when you intend to delete those items.

### [Azure portal](#tab/portal)

1. On the **Get started** tab, select **Migration job**, and then select **Create Migration job**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/migration-job-step.png" alt-text="Screenshot of the Migration job step of the Get started flow in the source tenant, with the Create Migration job button." lightbox="media/azure-cross-tenant-blob-migration/migration-job-step.png":::

1. On the **Basics** tab, enter a **Name** and an optional **Description** for the job.
1. Under **Source**, the **Source endpoint** created in step [S3](#s3-create-the-source-endpoint) is prefilled. Optionally, enter a **Sub-path** to migrate only part of the container, and verify the **Full source path**.
1. Under **Target**, enter the **Target tenant ID** and the **Target endpoint ID** that you received from the target tenant in step [T4](#t4-assign-rbac-roles-to-the-target-endpoint). Use the endpoint resource ID, not the storage account resource ID. Select **Next**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/job-basics-tab.png" alt-text="Screenshot of the Basics tab of the migration job, showing the source endpoint, the target tenant ID, and the target endpoint ID." lightbox="media/azure-cross-tenant-blob-migration/job-basics-tab.png":::

1. On the **Schedule** tab, select the **Migration frequency**: **No schedule**, **One-time schedule**, or **Recurring schedule** (you need to start the migration manually for the first time regardless of the schedule). Select **Next**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/job-schedule-tab.png" alt-text="Screenshot of the Schedule tab of the migration job, with options for no schedule, a one-time schedule, or a recurring schedule." lightbox="media/azure-cross-tenant-blob-migration/job-schedule-tab.png":::

1. On the **Settings** tab, select the **Copy mode**. **Merge content into target** corresponds to the *Additive* copy mode: files are kept in the target even if they don't exist in the source, and files with matching names and paths are updated. Review the **Migration outcomes**, and then select **Next**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/job-settings-tab.png" alt-text="Screenshot of the Settings tab of the migration job, showing the copy mode and the expected migration outcomes." lightbox="media/azure-cross-tenant-blob-migration/job-settings-tab.png":::

1. On the **Review** tab, verify the settings, and then create the job.
1. On the **Projects** tab, the job appears under the project with the status **Never ran**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/job-definition-created.png" alt-text="Screenshot of the Projects tab of the source Storage Mover, showing the cross-tenant job definition in the project with a status of Never ran." lightbox="media/azure-cross-tenant-blob-migration/job-definition-created.png":::

### [Azure CLI](#tab/CLI)

If you start a new CLI session, or if you used the same session for the target tenant steps, sign in to the source tenant again and select the source Storage Mover subscription.

**Azure CLI command**

```azurecli
az login --tenant "<source-tenant-id>" --output none
az account set --subscription "<source-mover-subscription-id>"
```

**Example command**

```azurecli
az login --tenant "00001111-aaaa-2222-bbbb-3333cccc4444" --output none
az account set --subscription "11112222-bbbb-3333-cccc-4444dddd5555"
```

Create the job definition in the source project. The example uses *Additive* mode and the root of each container.

The following properties define the migration:

- `copyMode`: Set to `Additive` to copy data without deleting target-only blobs, or `Mirror` to make the target match the source within the selected scope. Additive operations can overwrite matching blobs; Mirror operations can delete items in the target that you deleted from the source.
- `jobType`: Set to `CloudToCloud`.
- `sourceName` and `targetName`: The names of the source and target endpoints, respectively. The source endpoint is local to the source Storage Mover; the target endpoint is in the target tenant.
- `sourceSubpath` and `targetSubpath`: Set to `/` for the container root, or specify the subpath for the portion of each container involved in the migration. Preserve the case and intended scope of each path.
- `isCrossTenantJob`: Set to `true`.
- `crossTenantEndpointTenantId`: The target tenant's Entra tenant ID.
- `crossTenantEndpointResourceId`: The full resource ID of the target Storage Mover endpoint. Use the endpoint ID, not the target storage account ID. Its endpoint name must match `targetName`.

**Azure CLI command**

```azurecli
az rest --method PUT `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" `
  --headers "Content-Type=application/json" `
  --body "@source-job-definition.json" --output json
```

**Generic payload: `source-job-definition.json`**

```json
{
  "properties": {
    "description": "Cross-tenant Azure Blob migration.",
    "copyMode": "Additive",
    "jobType": "CloudToCloud",
    "sourceName": "<source-endpoint-name>",
    "sourceSubpath": "/",
    "targetName": "<target-endpoint-name>",
    "targetSubpath": "/",
    "isCrossTenantJob": true,
    "crossTenantEndpointTenantId": "<target-tenant-id>",
    "crossTenantEndpointResourceId": "/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>"
  }
}
```

**Example command**

```azurecli
az rest --method PUT `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
  --headers "Content-Type=application/json" `
  --body "@source-job-definition.example.json" --output json
```

**Example payload: `source-job-definition.example.json`**

```json
{
  "properties": {
    "description": "Cross-tenant Azure Blob migration.",
    "copyMode": "Additive",
    "jobType": "CloudToCloud",
    "sourceName": "contoso-source-endpoint",
    "sourceSubpath": "/",
    "targetName": "fabrikam-target-endpoint",
    "targetSubpath": "/",
    "isCrossTenantJob": true,
    "crossTenantEndpointTenantId": "33dd33dd-ee44-ff55-aa66-77bb77bb77bb",
    "crossTenantEndpointResourceId": "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint"
  }
}
```

---

### S7. Start the migration job in the source tenant

### [Azure portal](#tab/portal)

1. On the **Projects** tab, select the project, and then select the job. Review the **Properties**: the source container, storage account, and subscription, and the target tenant, subscription, resource group, Storage Mover name, and target endpoint ID.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/job-properties.png" alt-text="Screenshot of the migration job Properties tab, showing source and target details before the job is started." lightbox="media/azure-cross-tenant-blob-migration/job-properties.png":::

1. Select **Start job**. In the **Start job** pane, Storage Mover checks and assigns the RBAC permissions for the source endpoint.
1. Because the target resources are in a different tenant, their RBAC permissions for the target resources can't be verified from the source tenant. Storage Mover verifies target access when the job starts. If any required permission is missing, the job stops before any data is moved.
1. Select **Start**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/start-job-pane.png" alt-text="Screenshot of the Start job pane for a cross-tenant job, showing the source endpoint role checks and a note that target permissions are verified when the job starts." lightbox="media/azure-cross-tenant-blob-migration/start-job-pane.png":::

### [Azure CLI](#tab/CLI)

Confirm that the endpoint identities have the required permissions and that the job definition is ready. If you start the job in a new CLI session, sign in to the source tenant and select the source Storage Mover subscription again.

**Azure CLI command**

```azurecli
az login --tenant "<source-tenant-id>" --output none
az account set --subscription "<source-mover-subscription-id>"
```

**Example command**

```azurecli
az login --tenant "00001111-aaaa-2222-bbbb-3333cccc4444" --output none
az account set --subscription "11112222-bbbb-3333-cccc-4444dddd5555"
```

Read the job definition before submitting a job run. Verify its endpoint bindings, copy mode, and subpaths. If it has a `latestJobRunResourceId`, inspect that run as described in step [S8](#s8-monitor-migration-progress). Don't submit a new run while a previous run is active.

**Azure CLI command**

```azurecli
az rest --method GET `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" --output json
```

**Example command**

```azurecli
az rest --method GET `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json
```

Start the job by calling the `startJob` action.

**Azure CLI command**

```azurecli
az rest --method POST `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>/startJob?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" --output json
```

**Example command**

```azurecli
az rest --method POST `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer/startJob?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json
```

The response includes `jobRunResourceId`, the resource ID of the job run. Retain this ID to monitor progress. An accepted request doesn't mean that the migration is complete. If the request times out or the response is uncertain, inspect the existing runs before calling `startJob` again. Don't blindly retry the action.

---

### S8. Monitor migration progress

### [Azure portal](#tab/portal)

In the source Storage Mover, go to **Projects**, select the project, and then select the job. The job status is shown at the top of the job page. Select the **Run history** tab to see each run and its status, and select a run for details such as the number of processed and failed items.

:::image type="content" source="media/azure-cross-tenant-blob-migration/job-monitoring.png" alt-text="Screenshot of the Monitoring tab for a successful migration job, showing processed files and folders, data volume, and migration progress." lightbox="media/azure-cross-tenant-blob-migration/job-monitoring.png":::

### [Azure CLI](#tab/CLI)

Monitor the migration job run from the source tenant. Replace `job-run-resource-id` with the complete `jobRunResourceId` returned by the `startJob` operation, beginning with `/subscriptions/`. Don't add a second slash between the management host and this resource ID.

If you don't have the run ID, list the job's runs:

**Azure CLI command**

```azurecli
$jobRunResourceId = az rest --method GET `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>/jobRuns?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" --output json

az rest --method GET `
  --url "https://<source-management-host>${jobRunResourceId}?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" --output json
```

**Example command**

```azurecli
$jobRunResourceId = az rest --method GET `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
  --query properties.latestJobRunResourceId --output tsv

az rest --method GET `
  --url "https://eastus2.management.azure.com${jobRunResourceId}?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json
```

Inspect `properties.status` and any error information in the response. Repeat the `GET` request as needed. `Succeeded`, `Failed`, and `Canceled` are terminal statuses; an in-progress status isn't evidence of completed migration. A successful job run should still be followed by data validation.

---

When you configure logging, copy logs and job run logs help you investigate migration errors and the results for individual blobs. For logging configuration, see [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).

## Target tenant steps

Perform steps T1 through T4 in the target tenant.

### T1. Prepare the target tenant

### [Azure portal](#tab/portal)

1. Sign in to the Azure portal with an account in the target tenant, or switch to the target tenant by selecting **Settings** > **Directories + subscriptions**. If a different operator manages the target tenant, that operator performs steps [T1](#t1-prepare-the-target-tenant) through [T4](#t4-assign-rbac-roles-to-the-target-endpoint).
1. Register the `Microsoft.StorageMover` resource provider in the target subscription, as described in step [S1](#s1-prepare-the-source-tenant).

### [Azure CLI](#tab/CLI)

Sign in to the target tenant, select the subscription for the target Storage Mover, and register `Microsoft.StorageMover`. If a different operator manages this tenant, that operator runs steps [T1](#t1-prepare-the-target-tenant) through [T4](#t4-assign-rbac-roles-to-the-target-endpoint).

**Azure CLI command**

```azurecli
az login --tenant "<target-tenant-id>" --output none
az account set --subscription "<target-mover-subscription-id>"
az provider register --namespace Microsoft.StorageMover `
  --subscription "<target-mover-subscription-id>" --wait
```

**Example command**

```azurecli
az login --tenant "33dd33dd-ee44-ff55-aa66-77bb77bb77bb" --output none
az account set --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee"
az provider register --namespace Microsoft.StorageMover `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --wait
```

If the target Storage Mover resource group doesn't exist, create it:

**Azure CLI command**

```azurecli
az group create --name "<target-mover-resource-group>" `
  --location "<resource-group-region>" `
  --subscription "<target-mover-subscription-id>" --output json
```

**Example command**

```azurecli
az group create --name "fabrikam-migration-rg" `
  --location "eastus2" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --output json
```

---

### T2. Create the target Storage Mover resource

### [Azure portal](#tab/portal)

1. Search for and select **Storage movers**, and then select **Create**.
1. Select the target **Subscription** and **Resource group**, or create a new resource group.
1. Enter a **Name** for the target Storage Mover. For **Region**, select the *same region* as the source Storage Mover resource.
1. Select **Review + create**, and then select **Create**.

### [Azure CLI](#tab/CLI)

Create a Storage Mover resource in the target tenant. Use the same `mover-region` value as the source Storage Mover.

**Azure CLI command**

```azurecli
az rest --method PUT `
  --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<target-mover-subscription-id>" `
  --headers "Content-Type=application/json" `
  --body "@target-mover.json" --output json
```

**Generic payload: `target-mover.json`**

```json
{
  "location": "<mover-region>",
  "properties": {
    "description": "Target Storage Mover for cross-tenant migration."
  }
}
```

**Example command**

```azurecli
az rest --method PUT `
  --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
  --headers "Content-Type=application/json" `
  --body "@target-mover.example.json" --output json
```

**Example payload: `target-mover.example.json`**

```json
{
  "location": "eastus2",
  "properties": {
    "description": "Target Storage Mover for cross-tenant migration."
  }
}
```

---

### T3. Create the target endpoint

### [Azure portal](#tab/portal)

1. Open the target Storage Mover resource. Under **Plan + run migrations**, select **Projects** > **Get started**.
1. Select **Azure to Azure** and **Azure Blob container**. For **Where is your data moving?**, select **From another tenant**. The path shows **Prerequisite**, **Target**, **RBAC**, and **Migration job**. You need the source storage account resource ID for this step. See [Copy the resource IDs to share between tenants](#copy-the-resource-ids-to-share-between-tenants).

    :::image type="content" source="media/azure-cross-tenant-blob-migration/target-get-started.png" alt-text="Screenshot of the Get started tab in the target Storage Mover with From another tenant selected, showing the Prerequisite, Target, RBAC, and Migration job steps." lightbox="media/azure-cross-tenant-blob-migration/target-get-started.png":::

1. Select **Target**, and then select **Create target endpoint**. If you already created a cross-tenant target endpoint, select **Select existing target endpoint** instead.
1. In the **Create target endpoint** pane, select the **Subscription**, **Storage account**, and **Azure blob container** of the target. **Target type** is prefilled as **Azure blob container**.
1. Select **Is this a cross-tenant migration?**. Under **Allow list**, select **Add**, and paste the full resource ID of the source storage account.
1. Select **Create**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/target-endpoint-create.png" alt-text="Screenshot of the Create target endpoint pane with cross-tenant migration selected and the source storage account resource ID in the allow list." lightbox="media/azure-cross-tenant-blob-migration/target-endpoint-create.png":::

    When the endpoint is created, the **Target** step shows a check mark and **Target endpoint created**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/target-endpoint-created.png" alt-text="Screenshot of the Get started flow in the target Storage Mover, with a check mark on the Target step and a Target endpoint created message." lightbox="media/azure-cross-tenant-blob-migration/target-endpoint-created.png":::

### [Azure CLI](#tab/CLI)

Create the target endpoint under the target Storage Mover resource. Set `storageAccountResourceId` to the target account, `blobContainerName` to the existing target container, and `endpointKind` to `Target`. Enable cross-tenant transfer and add the source storage account resource ID to `allowedStorageAccounts`.

**Azure CLI command**

```azurecli
az rest --method PUT `
  --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<target-mover-subscription-id>" `
  --headers "Content-Type=application/json" `
  --body "@target-endpoint.json" --output json
```

**Generic payload: `target-endpoint.json`**

```json
{
  "identity": { "type": "SystemAssigned" },
  "properties": {
    "description": "Target container for cross-tenant migration.",
    "endpointType": "AzureStorageBlobContainer",
    "endpointKind": "Target",
    "storageAccountResourceId": "/subscriptions/<target-storage-subscription-id>/resourceGroups/<target-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<target-storage-account-name>",
    "blobContainerName": "<target-container-name>",
    "enableCrossTenantTransfer": true,
    "allowedStorageAccounts": [
      "/subscriptions/<source-storage-subscription-id>/resourceGroups/<source-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<source-storage-account-name>"
    ]
  }
}
```

**Example command**

```azurecli
az rest --method PUT `
  --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
  --headers "Content-Type=application/json" `
  --body "@target-endpoint.example.json" --output json
```

**Example payload: `target-endpoint.example.json`**

```json
{
  "identity": { "type": "SystemAssigned" },
  "properties": {
    "description": "Target container for cross-tenant migration.",
    "endpointType": "AzureStorageBlobContainer",
    "endpointKind": "Target",
    "storageAccountResourceId": "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-storage-rg/providers/Microsoft.Storage/storageAccounts/fabrikamtarget001",
    "blobContainerName": "fabrikam-target",
    "enableCrossTenantTransfer": true,
    "allowedStorageAccounts": [
      "/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-storage-rg/providers/Microsoft.Storage/storageAccounts/contososource001"
    ]
  }
}
```

---

### T4. Assign RBAC roles to the target endpoint

### [Azure portal](#tab/portal)

1. On the **Get started** tab, select **RBAC**, and then select **Assign access**.
1. Storage Mover assigns roles to the target endpoint's managed identity: **Storage Account Contributor** on the target storage account, and **Storage Blob Data Owner** on the target blob container. Confirm that each role shows **Successfully assigned**, and then select **Done**.
1. Select **Migration job**. In the target tenant, this step doesn't create a job; migration jobs are created in the source tenant. Under **Your IDs to share**, use the copy buttons to copy the **Target tenant ID** and the **Target endpoint Resource ID**.
1. Give both values to the source tenant operator for step [S6](#s6-create-the-cross-tenant-job-definition). If you manage both tenants, switch to the source tenant and continue with that step.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/target-ids-to-share.png" alt-text="Screenshot of the Migration job step in the target tenant, showing the target tenant ID and target endpoint resource ID under Your IDs to share." lightbox="media/azure-cross-tenant-blob-migration/target-ids-to-share.png":::

### [Azure CLI](#tab/CLI)

Retrieve the principal ID of the target endpoint's system-assigned managed identity. Assign both RBAC roles, as you did for the source endpoint. Use the returned value for `target-endpoint-principal-id`. Assign *Storage Account Contributor* at the target storage account scope and *Storage Blob Data Owner* at the target blob container scope.

**Azure CLI command**

```azurecli
az rest --method GET `
  --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<target-mover-subscription-id>" `
  --query identity.principalId --output tsv

az role assignment create `
  --assignee-object-id "<target-endpoint-principal-id>" `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Account Contributor" `
  --scope "/subscriptions/<target-storage-subscription-id>/resourceGroups/<target-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<target-storage-account-name>" `
  --subscription "<target-storage-subscription-id>" --output json

az role assignment create `
  --assignee-object-id "<target-endpoint-principal-id>" `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Owner" `
  --scope "/subscriptions/<target-storage-subscription-id>/resourceGroups/<target-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<target-storage-account-name>/blobServices/default/containers/<target-container-name>" `
  --subscription "<target-storage-subscription-id>" --output json
```

**Example command**

```azurecli
$targetPrincipalId = az rest --method GET `
  --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
  --query identity.principalId --output tsv

az role assignment create `
  --assignee-object-id $targetPrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Account Contributor" `
  --scope "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-storage-rg/providers/Microsoft.Storage/storageAccounts/fabrikamtarget001" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --output json

az role assignment create `
  --assignee-object-id $targetPrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Owner" `
  --scope "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-storage-rg/providers/Microsoft.Storage/storageAccounts/fabrikamtarget001/blobServices/default/containers/fabrikam-target" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --output json
```

Allow time for role assignments to propagate before starting the job. Both endpoint allow lists and both sets of role assignments are required. Provide the target tenant ID and the full resource ID of the target endpoint to the source tenant operator for step [S6](#s6-create-the-cross-tenant-job-definition). To retrieve these values, see [Copy the target endpoint resource ID and target tenant ID](#copy-the-target-endpoint-resource-id-and-target-tenant-id).

---

[!INCLUDE [post-migration-validation](includes/post-migration-validation.md)]

For example, after the job completes, the target container contains the same virtual directory structure as the source container.

:::image type="content" source="media/azure-cross-tenant-blob-migration/validation-source-container.png" alt-text="Screenshot of the source blob container in the source tenant, showing its virtual directories." lightbox="media/azure-cross-tenant-blob-migration/validation-source-container.png":::

:::image type="content" source="media/azure-cross-tenant-blob-migration/validation-target-container.png" alt-text="Screenshot of the target blob container in the target tenant after migration, showing the same virtual directories as the source container." lightbox="media/azure-cross-tenant-blob-migration/validation-target-container.png":::

## Copy the resource IDs to share between tenants

The operators of the two tenants need to exchange a few identifiers. Each operator can only see resources in their own tenant, so copy these values and share them with the partner operator.

| Value | Provided by | Used in |
| --- | --- | --- |
| Target storage account resource ID | Target tenant operator | Allow list of the source endpoint (step [S3](#s3-create-the-source-endpoint)) |
| Source storage account resource ID | Source tenant operator | Allow list of the target endpoint (step [T3](#t3-create-the-target-endpoint)) |
| Target tenant ID | Target tenant operator | Job definition: **Target tenant ID** / `crossTenantEndpointTenantId` (step [S6](#s6-create-the-cross-tenant-job-definition)) |
| Target endpoint resource ID | Target tenant operator | Job definition: **Target endpoint ID** / `crossTenantEndpointResourceId` (step [S6](#s6-create-the-cross-tenant-job-definition)) |

### Copy a storage account resource ID

A storage account resource ID uses the following format: `/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>`.

### [Azure portal](#tab/portal)

1. In the tenant that owns the storage account, open the storage account in the Azure portal.
1. On **Overview**, select **JSON View** in the upper-right corner of the **Essentials** section.
1. In the **Resource JSON** pane, select the copy button next to **Resource ID**.
1. Share the value with the partner tenant operator, who pastes it into the **Allow list** of their endpoint.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/storage-account-resource-id.png" alt-text="Screenshot of the Resource JSON pane of a storage account, with the copy button next to the Resource ID." lightbox="media/azure-cross-tenant-blob-migration/storage-account-resource-id.png":::

### [Azure CLI](#tab/CLI)

**Azure CLI command**

```azurecli
az storage account show --name "<storage-account-name>" `
  --resource-group "<storage-resource-group>" `
  --subscription "<storage-subscription-id>" --query id --output tsv
```

**Example command**

```azurecli
az storage account show --name "fabrikamtarget001" `
  --resource-group "fabrikam-storage-rg" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --query id --output tsv
```

---

### Copy the target endpoint resource ID and target tenant ID

The target endpoint resource ID has the format `/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>`. It identifies the Storage Mover endpoint, not the target storage account.

### [Azure portal](#tab/portal)

1. In the target tenant, open the target Storage Mover and go to **Projects** > **Get started**, with **From another tenant** selected.
1. Select **Migration job**. Under **Your IDs to share**, copy the **Target tenant ID** and the **Target endpoint Resource ID**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/target-ids-to-share.png" alt-text="Screenshot of the Migration job step in the target tenant, showing the target tenant ID and target endpoint resource ID under Your IDs to share." lightbox="media/azure-cross-tenant-blob-migration/target-ids-to-share.png":::

### [Azure CLI](#tab/CLI)

Run these commands while signed in to the target tenant.

**Azure CLI command**

```azurecli
az account show --query tenantId --output tsv

az rest --method GET `
  --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<target-mover-subscription-id>" `
  --query id --output tsv
```

**Example command**

```azurecli
az account show --query tenantId --output tsv

az rest --method GET `
  --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
  --query id --output tsv
```

---

## Create source and target endpoints without the Get started flow

You can create cross-tenant endpoints directly from the **Storage endpoints** page of a Storage Mover resource, without the **Get started** flow. Later, in **Get started**, choose **Select existing source endpoint** or **Select existing target endpoint** to use them. Assign access separately to endpoints created this way; see [Assign access to an endpoint](#assign-access-to-an-endpoint).

### Create a source endpoint

### [Azure portal](#tab/portal)

1. In the source tenant, open the source Storage Mover. Under **Resource management**, select **Storage endpoints**, and then select the **Source endpoints** tab.
1. Select **Create endpoint** (or **Create source endpoint** if the list is empty).
1. Set **Migration type** to **Azure to Azure** and **Source type** to **Azure Blob container**. Select the **Subscription**, **Storage account**, and **Azure blob container**, and optionally enter a description.
1. Select **Is this a cross-tenant migration?**.
1. Under **Allow list**, select **Add**, and paste the resource ID of the target storage account.
1. Select **Create**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/storage-endpoints-source-create.png" alt-text="Screenshot of the Storage endpoints page with the Create source endpoint pane open, cross-tenant migration selected, and the target storage account in the allow list." lightbox="media/azure-cross-tenant-blob-migration/storage-endpoints-source-create.png":::

### [Azure CLI](#tab/CLI)

Use the `az rest --method PUT` request and the `source-endpoint.json` payload in step [S3](#s3-create-the-source-endpoint). Set `endpointKind` to `Source`, `enableCrossTenantTransfer` to `true`, and add the target storage account resource ID to `allowedStorageAccounts`.

---

### Create a target endpoint

### [Azure portal](#tab/portal)

1. In the target tenant, open the target Storage Mover. Under **Resource management**, select **Storage endpoints**, and then select the **Target endpoints** tab.
1. Select **Create endpoint**.
1. Select the **Subscription**, **Storage account**, **Target type** (**Azure blob container**), and **Azure blob container**, and optionally enter a description.
1. Select **Is this a cross-tenant migration?**.
1. Under **Allow list**, select **Add**, and paste the resource ID of the source storage account.
1. Select **Create**. In the endpoint list, the **Cross tenant** column shows **Yes** for the new endpoint.

### [Azure CLI](#tab/CLI)

Use the `az rest --method PUT` request and the `target-endpoint.json` payload in step [T3](#t3-create-the-target-endpoint). Set `endpointKind` to `Target`, `enableCrossTenantTransfer` to `true`, and add the source storage account resource ID to `allowedStorageAccounts`.

---

## Assign access to an endpoint

Each endpoint has a system-assigned managed identity. Before a job can run, that identity needs RBAC roles on the storage account and container that the endpoint points to. Assign access in the tenant that owns the endpoint: the source tenant operator can't assign roles for the target endpoint, and the target tenant operator can't assign roles for the source endpoint.

### [Azure portal](#tab/portal)

1. Open the Storage Mover resource in the tenant that owns the endpoint. Under **Resource management**, select **Storage endpoints**, and then select the **Source endpoints** or **Target endpoints** tab.
1. Select the check box of the endpoint, and then select **Assign access**.

    :::image type="content" source="media/azure-cross-tenant-blob-migration/storage-endpoints-assign-access.png" alt-text="Screenshot of the Target endpoints tab of the Storage endpoints page, with an endpoint selected and the Assign access button highlighted." lightbox="media/azure-cross-tenant-blob-migration/storage-endpoints-assign-access.png":::

1. In the **Check and assign access** pane, Storage Mover checks the existing RBAC permissions of the endpoint's managed identity and assigns any missing RBAC permissions. Confirm that each role shows **Successfully assigned**, and then select **Done**.

The **RBAC** step of the **Get started** flow (steps [S4](#s4-assign-rbac-roles-to-the-source-endpoint) and [T4](#t4-assign-rbac-roles-to-the-target-endpoint)) performs the same assignment. For the source endpoint, the **Start job** pane also checks and assigns the source RBAC permissions before the job starts.

### [Azure CLI](#tab/CLI)

Get the principal ID of the endpoint's managed identity and create the role assignments: *Storage Account Contributor* at the storage account scope and *Storage Blob Data Owner* at the blob container scope, as shown in step [S4](#s4-assign-rbac-roles-to-the-source-endpoint) (source endpoint) and step [T4](#t4-assign-rbac-roles-to-the-target-endpoint) (target endpoint). Allow time for role assignments to propagate before starting the job.

---

## Frequently asked questions

### Can a cross-tenant endpoint also work as an intra-tenant endpoint?

Yes. An endpoint with cross-tenant transfer enabled and an allow list can also be used in job definitions for migrations within the same tenant.

### Do I need to enable Allow cross-tenant replication on the storage accounts?

No. **Allow cross-tenant replication** is a storage account setting for object replication. Storage Mover doesn't use it, so the setting can remain **Disabled** on both the source and target storage accounts (`allowCrossTenantReplication: false`).

### Do I need a user account in both tenants?

No. Each tenant operator configures their own side: the source tenant operator performs steps [S1](#s1-prepare-the-source-tenant)–[S8](#s8-monitor-migration-progress), and the target tenant operator performs steps [T1](#t1-prepare-the-target-tenant)–[T4](#t4-assign-rbac-roles-to-the-target-endpoint). The operators only need to exchange the storage account resource IDs, the target tenant ID, and the target endpoint resource ID. You can also use one account that has access to both tenants, for example through a guest account.

[!INCLUDE [troubleshooting-support](includes/troubleshooting-support.md)]

## Related content

The following articles can help you become more familiar with the Storage Mover service.

- [Get started with blob-to-blob migration in Azure Storage Mover](azure-to-azure-migration.md)
- [Manage Azure Storage Mover endpoints](endpoint-manage.md)
- [Enable Azure Storage Mover copy and job logs](log-monitoring.md)
- [Azure Storage Mover REST API reference](/rest/api/storagemover/)
- [Assign Azure roles using Azure CLI](../role-based-access-control/role-assignments-cli.md)
