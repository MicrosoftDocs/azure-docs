---
title: Get started with azureblobcontainer-to-azureblobcontainer migration in Azure Storage Mover
description: The Blob-to-Blob Migration feature in Azure Storage mover allows you to securely transfer data from a Blob container in Azure Storage to another Blob container in any storage account in a global Azure region.
author: madhurinms
ms.author: madhn
ms.service: azure-storage-mover
ms.topic: quickstart
ms.date: 12/04/2025
---

# Get started with blob-to-blob migration in Azure Storage Mover

The Azure-to-Azure Migration feature in Azure Storage Mover allows you to securely transfer large datasets between Blob containers across different Azure storage accounts and regions.

This article guides you through the complete process of configuring Storage Mover to migrate your data between two Blob containers. The process consists of configuring endpoints, and creating and running a migration job.

## Prerequisites

Before you begin, ensure that you have: 

- A [Storage Mover resource](storage-mover-create.md) deployed in your Azure subscription.

## Limits

The Azure Blob container-to-container transfer feature in Azure Storage Mover has the following limits:

- Each migration job supports the transfer of 500 million objects.
- A maximum of 10 concurrent jobs is supported per subscription. If you need to run more than 10, create a support request.
- Azure Storage Mover doesn't support automatic rehydration of archived objects. You must restore data stored in Azure Blob Archive before migration. Initiate migration jobs only after the data is fully restored.
- Blob container-to-container migration doesn't allow you to select the same Source and Target Endpoint in the same Migration Job Creation.
- Blobs aren't truly moved but copied. The Blob container continues to exist in its current location along with the Target location set.


## Configure source and target endpoints
In the context of the Azure Storage Mover service, an *endpoint* is a resource that contains the path to either a source or target location and other relevant information. Storage Mover *job definitions* use endpoints to define the source and target locations for copy operations.

Follow the steps in this section to configure an Azure Blob container source and target endpoints. To learn more about Storage Mover endpoints, refer to the [Manage Azure Storage Mover endpoints](endpoint-manage.md) article.

### Configure an Azure Blob storage source endpoint

### [Azure portal](#tab/portal)
1. Go to your Storage Mover instance in Azure.
1. From the **Resource management** group in the left navigation, select **Storage endpoints**. Select the **Source endpoints** tab, and then select **Add endpoint** to open the **Create source endpoint** pane.
1. In the **Create source endpoint** pane:

    - Select **Blob container** as the **Source type**.
    - Optionally, provide a description for the endpoint in the **Description** field.
    - Select your subscription and storage account from the respective **Subscription** and **Storage account** drop-down lists.
    - Choose the **Blob container** you want to migrate from the **Blob container** drop-down list.
    - Optionally, provide a description for the endpoint in the **Description** field.
    - Verify that your selections are correct and select **Create** to create the endpoint as shown in the following image.

         :::image type="content" source="./media/azure-to-azure/endpoint-source-create.png" alt-text="Screenshot of the Endpoints page showing the Create Source Endpoint pane with required fields displayed." lightbox="./media/azure-to-azure/endpoint-source-create.png":::
      

### [Azure PowerShell](#tab/powershell)

Use the `New-AzStorageMoverAzStorageContainerEndpoint` command to create an Azure Blob storage source endpoint:

```powershell
New-AzStorageMoverAzStorageContainerEndpoint `
    -Name <String> `
    -ResourceGroupName <String> `
    -StorageMoverName <String> `
    -BlobContainerName <String> `
    -StorageAccountResourceId <String>
```

**Parameters:**

- **Name**: The name of the Azure Blob storage endpoint.
- **ResourceGroupName**: The name of the resource group containing the Storage Mover resource.
- **StorageMoverName**: The name of the Storage Mover resource.
- **BlobContainerName**: The name of the blob container in the storage account from where you want to migrate data.
- **StorageAccountResourceId**: The Azure resource ID of the storage account that contains the blob container.


**Example:**

```powershell
New-AzStorageMoverAzStorageContainerEndpoint `
    -Name "my-source-blob-endpoint" `
    -ResourceGroupName "c2c-pvt-ecy-rg" `
    -StorageMoverName "myStorageMover" `
    -BlobContainerName "migration-container" `
    -StorageAccountResourceId "/subscriptions/<subscription-id>/resourceGroups/c2c-pvt-ecy-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
```

### [Azure CLI](#tab/CLI)
Use the `az storage-mover endpoint create-for-storage-container` command to create an Azure Blob storage source endpoint:

```bash
az storage-mover endpoint create-for-storage-container \
    --container-name <String> \
    --endpoint-name <String> \
    --resource-group <String> \
    --storage-account-id <String> \
    --storage-mover-name <String> \
```

**Parameters:**

- **container-name**: The name of the blob container from where you want to migrate data.
- **endpoint-name**: The name of the endpoint to create.
- **resource-group**: The name of the resource group containing the Storage Mover resource.
- **storage-account-id**: The Azure resource ID of the storage account that contains the blob container.
- **storage-mover-name**: The name of the Storage Mover resource.

**Example:**

```Bash
az storage-mover endpoint create-for-storage-container \
    --container-name "migration-container" \
    --endpoint-name "my-source-blob-endpoint" \
    --resource-group "c2c-pvt-ecy-rg" \
    --storage-account-id "/subscriptions/<subscription-id>/resourceGroups/c2c-pvt-ecy-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount" \
    --storage-mover-name "myStorageMover"
```

---

### Configure an Azure Blob storage tTarget endpoint

### [Azure portal](#tab/portal)
1. From the **Resource management** group in the left navigation, select **Storage endpoints**. Select the **Target endpoints** tab, and then select **Add endpoint** to open the **Create target endpoint** pane.
1. In the **Create target endpoint** pane:
 
    - Select your subscription and storage account from the respective **Subscription** and **Storage account** drop-down lists.
    - Select *Blob container* from the **Target type** field.
    - Choose the **Blob container** to which you want to migrate from the **Blob container** drop-down list.
    - Optionally, provide a description for the endpoint in the **Description** field.
    - Verify that your selections are correct and select **Create** to create the endpoint as shown in the following image.

        :::image type="content" source="./media/azure-to-azure/endpoint-target-create.png" alt-text="Screenshot of the Endpoints page showing the Create Target Endpoint pane with required fields displayed." lightbox="./media/azure-to-azure/endpoint-target-create.png":::


### [Azure PowerShell](#tab/powershell)

Use the `New-AzStorageMoverAzStorageContainerEndpoint` command to create an Azure Blob Storage target endpoint:

```powershell
New-AzStorageMoverAzStorageContainerEndpoint `
    -Name <String> `
    -ResourceGroupName <String> `
    -StorageMoverName <String> `
    -BlobContainerName <String> `
    -StorageAccountResourceId <String>
```

**Parameters:**

- **Name**: The name of the Azure Blob Storage endpoint.
- **ResourceGroupName**: The name of the resource group containing the Storage Mover resource.
- **StorageMoverName**: The name of the Storage Mover resource.
- **BlobContainerName**: The name of the blob container in the storage account where you want to migrate data.
- **StorageAccountResourceId**: The Azure resource ID of the storage account that contains the blob container.

**Example:**

```powershell
New-AzStorageMoverAzStorageContainerEndpoint `
    -Name "my-blob-endpoint" `
    -ResourceGroupName "c2c-pvt-ecy-rg" `
    -StorageMoverName "myStorageMover" `
    -BlobContainerName "migration-container" `
    -StorageAccountResourceId "/subscriptions/<subscription-id>/resourceGroups/c2c-pvt-ecy-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
```

### [Azure CLI](#tab/CLI)

Use the `az storage-mover endpoint create-for-storage-container` command to create an Azure Blob Storage target endpoint:

```bash
az storage-mover endpoint create-for-storage-container \
    --container-name <String> \
    --endpoint-name <String> \
    --resource-group <String> \
    --storage-account-id <String> \
    --storage-mover-name <String>
```

**Parameters:**

- **container-name**: The name of the blob container where you want to migrate data.
- **endpoint-name**: The name of the endpoint to create.
- **resource-group**: The name of the resource group containing the Storage Mover resource.
- **storage-account-id**: The Azure resource ID of the storage account that contains the blob container.
- **storage-mover-name**: The name of the Storage Mover resource.

**Example:**

```bash
az storage-mover endpoint create-for-storage-container \
    --container-name "migration-container" \
    --endpoint-name "my-blob-endpoint" \
    --resource-group "c2c-pvt-ecy-rg" \
    --storage-account-id "/subscriptions/<subscription-id>/resourceGroups/c2c-pvt-ecy-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount" \
    --storage-mover-name "myStorageMover"
```

---      

### Assign RBAC role to source and target endpoints

### [Azure portal](#tab/portal)

When you create an Azure Blob Storage source or target endpoint through the Azure portal, the **Storage Blob Data Owner** RBAC role is automatically assigned to the system-assigned managed identity of the endpoint. No other steps are required.


### [Azure PowerShell](#tab/powershell)

Assign the **Storage Blob Data Owner** RBAC role on the source and target blob storage container to the system-assigned managed identity of the target endpoint. First, retrieve the principal ID of the target endpoint's managed identity by using the `Get-AzStorageMoverAzStorageContainerEndpoint` command:

```powershell
$endpoint = Get-AzStorageMoverAzStorageContainerEndpoint `
    -ResourceGroupName <String> `
    -StorageMoverName <String> `
    -Name <String>

$principalId = $endpoint.Identity.PrincipalId
```

Then, use the `New-AzRoleAssignment` command to assign the role:

```powershell
New-AzRoleAssignment `
    -ObjectId <String> `
    -RoleDefinitionName "Storage Blob Data Owner" `
    -Scope <String>
```

**Parameters:**

- **ObjectId**: The object ID (principal ID) of the system-assigned managed identity of the target endpoint.
- **RoleDefinitionName**: Set to **"Storage Blob Data Owner"**.
- **Scope**: The Azure resource ID of the source or target blob storage container.

**Example:**

```powershell
# Get the source or target endpoint
$endpoint = Get-AzStorageMoverEndpoint `
    -ResourceGroupName "c2c-pvt-ecy-rg" `
    -StorageMoverName "myStorageMover" `
    -Name "my-blob-endpoint"

# Assign the RBAC role using the principal ID
New-AzRoleAssignment `
    -ObjectId $endpoint.Identity.PrincipalId `
    -RoleDefinitionName "Storage Blob Data Owner" `
    -Scope "/subscriptions/<subscription-id>/resourceGroups/c2c-pvt-ecy-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount/blobServices/default/containers/migration-container"
```

### [Azure CLI](#tab/CLI)

First, retrieve the principal ID of the source or target endpoint's managed identity by using the `az storage-mover endpoint show` command:

```bash
az storage-mover endpoint show \
    --resource-group <String> \
    --storage-mover-name <String> \
    --name <String> \
    --query identity.principalId \
    --output tsv
```

Then, use the `az role assignment create` command to assign the role:

```bash
az role assignment create \
    --assignee-object-id <String> \
    --assignee-principal-type ServicePrincipal \
    --role "Storage Blob Data Owner" \
    --scope <String>
```

**Parameters:**

- **assignee-object-id**: The object ID (principal ID) of the system-assigned managed identity of the target endpoint.
- **assignee-principal-type**: Set to **"ServicePrincipal"**.
- **role**: Set to **"Storage Blob Data Owner"**.
- **scope**: The Azure resource ID of the source or target blob storage container.

**Example:**

```Bash
# Get the principal ID
PRINCIPAL_ID=$(az storage-mover endpoint show \
    --resource-group "c2c-pvt-ecy-rg" \
    --storage-mover-name "myStorageMover" \
    --name "my-blob-endpoint" \
    --query identity.principalId \
    --output tsv)

# Assign the RBAC role using the principal ID
az role assignment create \
    --assignee-object-id $PRINCIPAL_ID \
    --assignee-principal-type ServicePrincipal \
    --role "Storage Blob Data Owner" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/c2c-pvt-ecy-rg/providers/Microsoft.Storage/storageAccounts/mystorageaccount/blobServices/default/containers/migration-container"
```

---

### Create a migration project and job definition

After you define source and target endpoints for your migration, the next steps are to create a Storage Mover migration project and job definition.

By using a *migration project*, you can organize large migrations into smaller, more manageable units that make sense for your use case. A *job definition* describes resources and migration options for a specific set of copy operations undertaken by the Storage Mover service. These resources include, for example, the source and target endpoints, and any migration settings you want to apply.

Follow the steps in this section to create a migration project and run a migration job.


### Create a project

### [Azure portal](#tab/portal)

1. Go to the **Project explorer** tab in your Storage Mover instance and select **Create project**.
1. Enter values for the following fields:
    - **Name**: A meaningful name for the migration project.
    - **Project description**: A useful description for the project.

    Select **Create** to create the project. It might take a moment for the newly created project to appear in the project explorer.

    :::image type="content" source="./media/azure-to-azure/project-create.png" alt-text="Screenshot of the Project Explorer page with the Create a Project pane's fields visible." lightbox="./media/azure-to-azure/project-create.png":::


### [Azure PowerShell](#tab/powershell)

Use the `New-AzStorageMoverProject` command to create a migration project:

```powershell
New-AzStorageMoverProject `
    -Name <String> `
    -ResourceGroupName <String> `
    -StorageMoverName <String>
```

**Parameters:**

- **Name**: The name of the migration project.
- **ResourceGroupName**: The name of the resource group containing the Storage Mover resource.
- **StorageMoverName**: The name of the Storage Mover resource.

**Example:**

```powershell
New-AzStorageMoverProject `
    -Name "my-migration-project" `
    -ResourceGroupName "c2c-pvt-ecy-rg" `
    -StorageMoverName "myStorageMover"
```

### [Azure CLI](#tab/CLI)

Use the `az storage-mover project create` command to create a migration project:

```bash
az storage-mover project create \
    --name <string> \
    --resource-group <string> \
    --storage-mover-name <string>
```

**Parameters:**

- **--name**: The name of the migration project.
- **--resource-group**: The name of the resource group containing the Storage Mover resource.
- **--storage-mover-name**: The name of the Storage Mover resource.

**Example:**

```bash
az storage-mover project create \
    --name "my-migration-project" \
    --resource-group "c2c-pvt-ecy-rg" \
    --storage-mover-name "myStorageMover"
```

---

### Create a job definition and run the job

### [Azure portal](#tab/portal)

1.  Select the project after it appears, and then select **Create job definition**. The **Create a Migration Job** page opens to the **Basics** tab. Provide values for the following fields:
    - **Name**: A meaningful name for the migration job.
    - **Migration type**: Select `Azure to Azure`.
    
    :::image type="content" source="./media/azure-to-azure/create-job.png" alt-text="Screenshot of basics tab with option to choose migration type." lightbox="./media/azure-to-azure/create-job.png":::

1. In the **Source** tab, select the **Existing endpoint** option for the **Endpoint** field. Next, select the **Select an existing endpoint as a source** link to open the **Select an existing endpoint** pane. 

    :::image type="content" source="./media/azure-to-azure/create-source.png" alt-text="Screenshot of source tab with endpoint options." lightbox="./media/azure-to-azure/create-source.png":::

    Choose the Azure Blob source endpoint created in the previous section and select **Select** to save your changes.

    :::image type="content" source="./media/azure-to-azure/select-source.png" alt-text="Screenshot of the Select an Existing Source Endpoint pane." lightbox="./media/azure-to-azure/select-source.png":::

1. In the **Target** tab, select the **Select an existing endpoint reference** option for the **Target endpoint** field. Next, select the **Select an existing endpoint as a target** link to open the **Select an existing endpoint** pane. 

    :::image type="content" source="./media/azure-to-azure/create-target.png" alt-text="Screenshot of the Create a Migration Job page with the Target tab selected and the required fields displayed." lightbox="./media/azure-to-azure/create-target.png"::: 

    Next, select the **Select an existing endpoint as a target** link to open the **Select an existing target endpoint** pane. Choose the Azure Blob Storage target endpoint created in the previous section and select **Select** to save your changes. Verify that the correct target endpoint is displayed in the **Existing target endpoint** field and then select **Next** to continue to the **Settings** tab.

    :::image type="content" source="./media/azure-to-azure/select-target.png" alt-text="Screenshot of the Create a Migration Job page with the Select an Existing Target Endpoint pane displayed." lightbox="./media/azure-to-azure/select-target.png":::

1. In the **Settings** tab, select **Mirror source to target** from the **Copy mode** drop-down list. Verify that the **Migration outcomes** results are appropriate for your use case, then select **Next** and review your settings.

    :::image type="content" source="./media/azure-to-azure/project-settings.png" alt-text="Screenshot of the Create a Migration Job page with the Settings tab selected and migration outcomes displayed." lightbox="./media/azure-to-azure/project-settings.png":::

1. After confirming that your settings are correct within the **Review** tab, select **Create** to deploy the migration job. You're redirected to the **Project explorer** after the job's deployment begins. After completion, the job appears within the associated migration project.

    :::image type="content" source="./media/azure-to-azure/job-review.png" alt-text="Screenshot of the Create a Migration Job page with the Review tab selected and all settings displayed." lightbox="./media/azure-to-azure/job-review.png":::

### [Azure PowerShell](#tab/powershell)

Not applicable

### [Azure CLI](#tab/CLI)

Not applicable

---

### Run a migration job

1. Go to the **Migration Jobs** tab. The **Migration Jobs** tab shows all migration jobs you created in your Storage Mover resource, including the one you just created. It might take a moment for the new migration job to show up in the list. Refresh the page if needed. 

    :::image type="content" source="./media/azure-to-azure/migration-jobs.png" alt-text="Screenshot of the Migration Jobs page with the Migration Jobs tab selected and all Migration Jobs displayed." lightbox="./media/azure-to-azure/migration-jobs.png":::

1. Select the new job definition to view its details in the **Properties** tab. Select the **Start job** button to open the **Start job** pane for the migration job. 

    :::image type="content" source="./media/azure-to-azure/migration-job.png" alt-text="Screenshot of the Migration Job details page with the Properties tab and the Start Job button highlighted." lightbox="./media/azure-to-azure/migration-job.png":::

    :::image type="content" source="./media/azure-to-azure/migration-job-start.png" alt-text="Screenshot of the Migration Job page's Start Job pane." lightbox="./media/azure-to-azure/migration-job-start.png":::


### Start a job definition

### [Azure portal](#tab/portal)

Not applicable

### [Azure PowerShell](#tab/powershell)

Use the `Start-AzStorageMoverJobDefinition` command to start a migration job:

```powershell
Start-AzStorageMoverJobDefinition `
    -JobDefinitionName <String> `
    -ProjectName <String> `
    -ResourceGroupName <String> `
    -StorageMoverName <String>
```

**Parameters:**

- **JobDefinitionName**: The name of the job definition to start.
- **ProjectName**: The name of the project containing the job definition.
- **ResourceGroupName**: The name of the resource group containing the Storage Mover resource.
- **StorageMoverName**: The name of the Storage Mover resource.

**Example:**

```powershell
Start-AzStorageMoverJobDefinition `
    -JobDefinitionName "my-job-definition" `
    -ProjectName "my-migration-project" `
    -ResourceGroupName "c2c-pvt-ecy-rg" `
    -StorageMoverName "myStorageMover"
```

### [Azure CLI](#tab/CLI)

Use the `az storage-mover job-definition start` command to start a migration job:

```bash
az storage-mover job-definition start \
    --job-definition-name <string> \
    --project-name <string> \
    --resource-group <string> \
    --storage-mover-name <string>
```

**Parameters:**

- **--job-definition-name**: The name of the job definition to start.
- **--project-name**: The name of the project containing the job definition.
- **--resource-group**: The name of the resource group containing the Storage Mover resource.
- **--storage-mover-name**: The name of the Storage Mover resource.

**Example:**

```bash
az storage-mover job-definition start \
    --job-definition-name "my-job-definition" \
    --project-name "my-migration-project" \
    --resource-group "c2c-pvt-ecy-rg" \
    --storage-mover-name "myStorageMover"
```

---

## Monitor migration progress

As you use Storage Mover to migrate your data to your Azure destination targets, monitor the copy operations for potential problems. The **Migration overview** tab displays data about the operations during your migration. This data helps you track the progress of your migration by providing the current status and key information such as progress, speed, and estimated completion time.

When configured, Azure Storage Mover can also provide copy logs and job run logs. These logs are especially useful because they allow you to trace the migration result of job runs and of individual files.

Follow the steps in this section to monitor the progress of a Storage Mover Migration Job. To learn more about Storage Mover copy and job logs, see [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).

1. Go to the **Migration Jobs** tab.
1. Select your job to view **progress, speed, and estimated completion time**.
    :::image type="content" source="./media/azure-to-azure/migration-overview.png" alt-text="Screenshot of the Storage Mover page with the Migration Overview tab selected and all Migration Jobs displayed." lightbox="./media/azure-to-azure/migration-overview.png":::
1. Select **Logs** to check for any errors or warnings.
1. After the migration finishes, verify the data in **Azure Blob Storage**.

## Post-migration validation

Post-migration data validation ensures that your data is accurate and that the transfer from Azure Blob container is complete. This validation process verifies data integrity and consistency by comparing migrated data to the same data from the source. You can also choose to conduct user acceptance tests to further confirm functionality. Validation helps identify and resolve discrepancies, ensuring the migrated data is reliable and meets your business requirements.

Follow the steps in this section to complete manual validation.

- Compare source and destination storage to ensure all files are transferred.
- Enable incremental sync if you need to keep Azure Blob containers in sync over time.
- Delete the source Azure Blob container after migration is fully completed and verified if you don't need it anymore.


## Troubleshooting and support 

Troubleshooting your migration might involve a range of steps, from basic diagnostics to more advanced error handling. If you're encountering problems, start troubleshooting by taking the following steps.

- Migration job failed? Check the logs for error messages.
- Permission problems? Verify that Azure Arc and Access Management (IAM) roles have the correct access.

## Related content

The following articles can help you become more familiar with the Storage Mover service.

- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover resource](storage-mover-create.md)
- [Deploying a Storage Mover agent](agent-deploy.md)
