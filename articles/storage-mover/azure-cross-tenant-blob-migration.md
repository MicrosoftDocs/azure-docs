---
title: Get started with cross-tenant Azure Blob container migration in Azure Storage Mover
description: The cross-tenant migration feature enables you to transfer data between Azure Blob containers in different Microsoft Entra tenants managed by different organizations or directories.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: quickstart
ms.date: 09/14/2026
---

# Get started with cross-tenant Azure Blob container migration in Azure Storage Mover

Azure Storage Mover enables you to transfer data between Azure Blob containers in storage accounts that belong to different Microsoft Entra tenants. Use cross-tenant migration when the source and target storage accounts are managed by different organizations or directories.

This article guides you through configuring Storage Mover to migrate data between two Blob containers across tenants. The process consists of creating a Storage Mover resource and endpoint in each tenant, granting each endpoint access to its local storage account, and creating and running a migration job in the source tenant.

For migration between storage accounts in the same tenant, see [Get started with Azure Blob container-to-container migration](azure-to-azure-migration.md).

> [!IMPORTANT]
> This article uses Azure CLI to call the Storage Mover REST API. Cross-tenant configuration isn't available through the Azure portal, the Azure PowerShell Storage Mover module, or the Azure CLI storage-mover command group. Current examples use az rest.

## Prerequisites

Before you begin, ensure that you have: 

- Two different Microsoft Entra tenants, with an Azure subscription in each tenant.
- Existing source and target storage accounts, each containing a Blob container. The steps in this article don't create storage accounts or containers.
- Access to both tenants. Use separate operators in each tenant, or one account that has the required access in both tenants using a main and a guest account.
- Permission to create Storage Mover resources in each tenant, such as Contributor on the relevant resource group. Creating a resource group and registering a resource provider requires the corresponding subscription-level permissions.
- Permission to assign Azure Role Based Access Control (RBAC) permissions on each storage account, such as Administrator or User Access Administrator at the appropriate scope. Contributor alone doesn't grant permission to create role assignments. Ensure any role-assignment conditions permit the roles used in this article.
- [Azure CLI](/cli/azure/install-azure-cli) and a PowerShell shell. The examples use PowerShell line continuation with a backtick, but invoke Azure CLI commands instead of Azure PowerShell cmdlets.

Create one Storage Mover resource in each tenant in this article. Although the storage accounts can be in different regions, both Storage Mover resources must be in the same Azure region. A storage account can be in a different subscription or resource group from its Storage Mover resource, but must belong to the same tenant.

## Limits

The Azure Blob container-to-container cross-tenant transfer feature has the following limits:

- Each migration job supports up to 500 million objects.
- Each subscription supports up to 10 concurrent jobs. To request more concurrent jobs, create a support request.
- Storage Mover doesn't automatically rehydrate archived blobs. Restore data in the Archive tier and wait for rehydration to complete before starting a migration job.
- The source and target must refer to different Blob containers.
- Blobs are copied, not removed from the source. The source container and its data remain after migration completes.
- Source and target Storage Mover resources must be in the same Azure region.

For cross-tenant migration, both endpoints must explicitly enable cross-tenant transfer and allow the partner storage account. You create the project, job definition, and job run in the source Storage Mover resource. Don't create a second job in the target tenant.

## Cross-tenant migration flow

This section illustrates the relationships between the Azure resources used in a cross-tenant migration, and the associated migration workflow.

### Azure resources and their relationships

Each tenant contains a Storage Mover resource, an endpoint with its own managed identity, and a storage account with a Blob container. The source Storage Mover also contains the project, job definition, and job run. The following visual shows resource ownership, access, and the logical transfer direction.

:::image type="content" source="media/azure-cross-tenant-blob-migration/azure-resource-relationship-sml.png" alt-text="A graphical representation illustrating the relationship between resource ownership, access, and the logical transfer direction of a cross-tenant migration." lightbox="media/azure-cross-tenant-blob-migration/azure-resource-relationship-lrg.png":::

### Set up and start the migration

Follow the flow below to set up and start a cross-tenant blob-to-blob migration. The step numbers correspond to the detailed procedures later in this article.

:::image type="content" source="media/azure-cross-tenant-blob-migration/azure-cross-tenant-migration-workflow-sml.png" alt-text="A graphical representation illustrating the a cross-tenant migration workflow." lightbox="media/azure-cross-tenant-blob-migration/azure-cross-tenant-migration-workflow-lrg.png":::

## Source and target endpoints

An endpoint is a Storage Mover resource that describes a source or target location and its access configuration. A job definition uses endpoints to identify the locations for a copy operation. For more information, see [Manage Azure Storage Mover endpoints](endpoint-manage.md).

> [!IMPORTANT]
> These examples use Storage Mover API version `2026-05-01`. 
> 
> These examples are direct creation requests, not an idempotent setup script. Use new resource names or verify existing resources before reusing them. 
> 
> Don't use a PUT request to overwrite an existing endpoint or job unintentionally. 
> 
> After a failed command, resolve the error before proceeding.
> 
> If a create request returns an in-progress provisioning state, don't create independent resources. Instead, repeat that resource's URL with `--method GET` until provisioning succeeds.

Use the following placeholder conventions:

- `source-tenant-id` and `target-tenant-id` identify the two Microsoft Entra directories.
- `source-mover-subscription-id` and `target-mover-subscription-id` identify the subscriptions containing the Storage Mover resources. The mover resource groups and mover names are separate from the storage account resource groups and names.
- `source-storage-subscription-id` and `target-storage-subscription-id` identify the subscriptions containing the storage accounts. Use the mover subscription ID here only if both resources are in the subscription bearing the same ID.
- `mover-region` is the common region for both Storage Mover resources. `source-management-host` and `target-management-host` are the approved management host names for those resources, but without "https://". In the regional endpoint pattern used here, the host is `<mover-region>.management.azure.com`. Confirm the host for your release and region. The token audience remains `https://management.azure.com/`.
- `source-endpoint-principal-id` and `target-endpoint-principal-id` are values returned after endpoint creation. They aren't the tenant IDs, role IDs, or identities of the parent Storage Mover resources.

### Configure the source tenant

1. Prepare the source tenant

    Sign in to the source tenant and select the subscription for the source Storage Mover resource. Register `Microsoft.StorageMover` in that subscription. Add `--use-device-code` to `az login` if your environment requires device-code sign-in.

    ```azurecli
    
    az cloud set --name "AzureCloud"
    az login --tenant "<source-tenant-id>" --output none
    az account set --subscription "<source-mover-subscription-id>"
    az provider register --namespace Microsoft.StorageMover `
      --subscription "<source-mover-subscription-id>" --wait
        
    ```

    ```Sample
    
    az cloud set --name "AzureCloud"
    az login --tenant "00001111-aaaa-2222-bbbb-3333cccc4444" --output none
    az account set --subscription "11112222-bbbb-3333-cccc-4444dddd5555"
    az provider register --namespace Microsoft.StorageMover `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --wait
    
    ```

    If the resource group for the source Storage Mover doesn't exist, create it. The resource group's metadata location doesn't determine the Storage Mover resource's region.
    
    ```azurecli
    
    az group create --name "<source-mover-resource-group>" `
      --location "<resource-group-region>" `
      --subscription "<source-mover-subscription-id>" --output json
    
    ```
    
    ```Sample
    
    az group create --name "contoso-migration-rg" `
        --location "eastus2" `
        --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json
    
    ```

1. Create the source Storage Mover resource

    Create the source Storage Mover in the region you selected for both Storage Mover resources.

    ```azurecli

    az rest --method PUT `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" `
      --headers "Content-Type=application/json" `
      --body "@source-mover.json" --output json
    
    ```

    ```Sample

    az rest --method PUT `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
      --headers "Content-Type=application/json" `
      --body "@source-mover.example.json" --output json

    ```

    ```Payload
        source-mover.example.json
        {
            "location": "eastus2",
            "properties": {
                "description": "Source Storage Mover for cross-tenant migration."
            }
        }
    ```

3. Create the source endpoint

    Create a source endpoint under the source Storage Mover resource. Set `storageAccountResourceId` to the source storage account, and `blobContainerName` to the existing source blob container. Set `endpointKind` to `Source` and `enableCrossTenantTransfer` to `true`. In `allowedStorageAccounts`, specify the full resource ID of the target storage account.

    ```azurecli
    
    az rest --method PUT `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/endpoints/<source-endpoint-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" `
      --headers "Content-Type=application/json" `
      --body "@source-endpoint.json" --output json

    ```

    ```Sample

    az rest --method PUT `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/endpoints/contoso-source-endpoint?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
      --headers "Content-Type=application/json" `
      --body "@source-endpoint.example.json" --output json

    ```

    ```Payload

    source-endpoint.example.json
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

4. Assign RBAC roles to the source endpoint

    Assign *Storage Account Contributor* and *Storage Blob Data Owner* RBAC roles to the source endpoint's system-assigned managed identity, scoped to the source storage account. Retrieve the identity's principal ID to perform this action.

    > [!IMPORTANT]
    > In this cross-tenant workflow, each endpoint identity needs both RBAC permissions on its own storage account.

    ```azurecli
    
    az rest --method GET `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/endpoints/<source-endpoint-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" `
      --query identity.principalId --output tsv

    ```

    ```Sample
    
    az rest --method GET `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/endpoints/contoso-source-endpoint?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
      --query identity.principalId --output tsv

    ```

    Use the returned principal ID value for `source-endpoint-principal-id` in both commands. If no principal ID is returned, wait for the endpoint provisioning to complete and repeat the `GET` request. Don't proceed with an empty principal ID.

    ```azurecli
    
    az role assignment create `
      --assignee-object-id "<source-endpoint-principal-id>" `
      --assignee-principal-type ServicePrincipal `
      --role "Storage Account Contributor" `
      --scope "/subscriptions/<source-storage-subscription-id>/resourceGroups/<source-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<source-storage-account-name>" `
      --subscription "<source-storage-subscription-id>" --output json

    az role assignment create `
      --assignee-object-id "<source-endpoint-principal-id>" `
      --assignee-principal-type ServicePrincipal `
      --role "Storage Blob Data Owner" `
      --scope "/subscriptions/<source-storage-subscription-id>/resourceGroups/<source-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<source-storage-account-name>" `
      --subscription "<source-storage-subscription-id>" --output json

    ```

    ```Sample

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
     --scope "/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-storage-rg/providers/Microsoft.Storage/storageAccounts/contososource001" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json

    ```

### Configure the target tenant

5. Prepare the target tenant

    Sign in to the target tenant, select the subscription for the target Storage Mover, and register `Microsoft.StorageMover`. If a different operator manages this tenant, that operator runs steps 5 through 8.

    ```azurecli
    
    az login --tenant "<target-tenant-id>" --output none
    az account set --subscription "<target-mover-subscription-id>"
    az provider register --namespace Microsoft.StorageMover `
      --subscription "<target-mover-subscription-id>" --wait

    ```

    ```Sample

    az login --tenant "33dd33dd-ee44-ff55-aa66-77bb77bb77bb" --output none
    az account set --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee"
    az provider register --namespace Microsoft.StorageMover `
      --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --wait

    ```

    If the target Storage Mover resource group doesn't exist, create it:

    ```azurecli
    
    az group create --name "<target-mover-resource-group>" `
      --location "<resource-group-region>" `
      --subscription "<target-mover-subscription-id>" --output json

    ```

    ```Sample

    az group create --name "fabrikam-migration-rg" `
      --location "eastus2" `
      --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --output json

    ```

6. Create the target Storage Mover resource

    Create a Storage Mover resource in the target tenant. Use the same mover-region value as the source Storage Mover.

    ```azurecli

    az rest --method PUT `
      --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<target-mover-subscription-id>" `
      --headers "Content-Type=application/json" `
      --body "@target-mover.json" --output json
    
    ```

    ```Sample command 
    
    az rest --method PUT `
      --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
      --headers "Content-Type=application/json" `
      --body "@target-mover.example.json" --output json
    
    ```
    
    ```Payload
    
    target-mover.example.json
    {
      "location": "eastus2",
      "properties": {
        "description": "Target Storage Mover for cross-tenant migration."
      }
    }
    
    ```

7. Create the target endpoint

    Create the target endpoint under the target Storage Mover resource. Set `storageAccountResourceId` to the target account, `blobContainerName` to the existing target container, and `endpointKind` to `Target`. Enable cross-tenant transfer and add the source storage account resource ID to `allowedStorageAccounts`.

    ```azurecli
        
    az rest --method PUT `
      --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<target-mover-subscription-id>" `
      --headers "Content-Type=application/json" `
      --body "@target-endpoint.json" --output json
    
    ```
    
    ```Sample
    
    az rest --method PUT `
      --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
      --headers "Content-Type=application/json" `
      --body "@target-endpoint.example.json" --output json
    
    ```
    
    ```Payload
    target-endpoint.example.json
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

8. Assign RBAC roles to the target endpoint

    Retrieve the principal ID of the target endpoint's system-assigned managed identity and assign both RBAC permissions scoped to target Storage Account as done in source endpoint.

    ```azurecli
    
    az rest --method GET `
      --url "https://<target-management-host>/subscriptions/<target-mover-subscription-id>/resourceGroups/<target-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<target-mover-name>/endpoints/<target-endpoint-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<target-mover-subscription-id>" `
      --query identity.principalId --output tsv
    
    ```
    
    ```Sample
    az rest --method GET `
      --url "https://eastus2.management.azure.com/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" `
      --query identity.principalId --output tsv
    
    ```
    
    Use the returned value for target-endpoint-principal-id. Assign both roles at the target storage account scope:
    
    ```azurecli
    
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
      --scope "/subscriptions/<target-storage-subscription-id>/resourceGroups/<target-storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<target-storage-account-name>" `
      --subscription "<target-storage-subscription-id>" --output json
    
    ```
    
    ```Sample command 
    
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
      --scope "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-storage-rg/providers/Microsoft.Storage/storageAccounts/fabrikamtarget001" `
      --subscription "66aa66aa-bb77-cc88-dd99-00ee00ee00ee" --output json
    
    ```

    Allow time for role assignments to propagate before starting the job. Both endpoint allow lists and both sets of role assignments are required. Provide the target tenant ID and the full resource ID of the target endpoint to the source tenant operator for step 10.

## Create a migration project and job definition in source tenant

A *migration project* organizes migrations into manageable units. A *job definition* specifies the source and target endpoints and the copy settings. In a cross-tenant migration, you create both migration projects and job definitions within the context of the source Storage Mover.

### Create a project

9. Return to the source tenant and create a project

    Sign in to the source tenant again and select the source Storage Mover subscription. You need to switch tenants if you used the same CLI session for target setup.

    ```azurecli

    az login --tenant "<source-tenant-id>" --output none
    az account set --subscription "<source-mover-subscription-id>"

    ```

    ```Sample

    az login --tenant "00001111-aaaa-2222-bbbb-3333cccc4444" --output none
    az account set --subscription "11112222-bbbb-3333-cccc-4444dddd5555"

    ```

    ```azurecli
    
    az rest --method PUT `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" `
      --headers "Content-Type=application/json" `
      --body "@source-project.json" --output json

    ```

    ```Sample

    az rest --method PUT `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
      --headers "Content-Type=application/json" `
      --body "@source-project.example.json" --output json

    ```

    ```Payload

    source-project.example.json
    {
      "properties": {
        "description": "Source project for cross-tenant Blob migration."
      }
    }

    ```

## Create a job definition

10. Create the cross-tenant job definition

    Create the job definition in the source project. The example uses *Additive* mode and the root of each container.

    The following properties define the migration:
    - `copyMode`: Set to `Additive` to copy data without deleting target-only blobs, or `Mirror` to make the target match the source within the selected scope. Additive operations can overwrite matching blobs; Mirror operations can delete items in target that you deleted from the source.
    - `jobType`: Set to CloudToCloud.
    - `sourceName` and `targetName`: The names of the source and target endpoints, respectively. The source endpoint is local to the source Storage Mover; the target endpoint is in the target tenant.
    - `sourceSubpath` and `targetSubpath`: Set to `/` for the container root, or specify the subpath for the portion of each container involved in the migration. Preserve the case and intended scope of each path.
    - `isCrossTenantJob`: Set to `true`.
    - `crossTenantEndpointTenantId`: The target tenant's Microsoft Entra tenant ID.
    - `crossTenantEndpointResourceId`: The full resource ID of the target Storage Mover endpoint. Use the endpoint ID, not the target storage account ID. Its endpoint name must match `targetName`.
    
    > [!WARNING]
    > Passing a `copyMode` value of `Mirror` deletes data in the target scope that doesn't exist in the source scope. Review the selected containers, subpaths, and copy mode before creating or running the job. Use `Mirror` only when you intend to delete those items.

    ```azurecli
    
    az rest --method PUT `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" `
      --headers "Content-Type=application/json" `
      --body "@source-job-definition.json" --output json

    ```

    ```Sample

    az rest --method PUT `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" `
      --headers "Content-Type=application/json" `
      --body "@source-job-definition.example.json" --output json

    ```

    ```Payload

    source-job-definition.example.json
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
      "crossTenantEndpointResourceId": "/subscriptions/66aa66aa-bb77-cc88-dd99-00ee00ee00ee/resourceGroups/fabrikam-migration-rg/    providers/Microsoft.StorageMover/storageMovers/fabrikam-mover/endpoints/fabrikam-target-endpoint"
      }
    }

    ```

### Run a migration job

11. Start the migration job in the source tenant

    Confirm that the endpoint identities have the required permissions and that the job definition is ready. If you start the job in a new CLI session, sign in to the source tenant and select the source Storage Mover subscription again.

    ```azurecli
    
    az login --tenant "<source-tenant-id>" --output none
    az account set --subscription "<source-mover-subscription-id>"

    ```

    ```Sample
    
    az login --tenant "00001111-aaaa-2222-bbbb-3333cccc4444" --output none
    az account set --subscription "11112222-bbbb-3333-cccc-4444dddd5555"

    ```

    Read the job definition before submitting a job run. Verify its endpoint bindings, copy mode, and subpaths. If it has a `latestJobRunResourceId`, inspect that run as described in the next section. Don't submit a new run while a previous run is active.

    ```azurecli
    
    az rest --method GET `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" --output json

    ```

    ```Sample

    az rest --method GET `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json

    ```

    Start the job by calling the `startJob` action.

    ```azurecli
    
    az rest --method POST `
      --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>/startJob?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "<source-mover-subscription-id>" --output json

    ```

    ```Sample

    az rest --method POST `
      --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer/startJob?api-version=2026-05-01" `
      --resource "https://management.azure.com/" `
      --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json

    ```

    The response includes `jobRunResourceId`, the resource ID of the job run. Retain this ID to monitor progress. An accepted request doesn't mean that the migration is complete. If the request times out or the response is uncertain, inspect the existing runs before calling `startJob` again. Don't blindly retry the action.

## Monitor migration progress

Monitor the migration job run from the source tenant by using the REST API or view it on the portal within the project status. Replace `job-run-resource-id` with the complete `jobRunResourceId` returned by the `startJob` operation, beginning with *"/subscriptions/"*. Don't add a second slash between the management host and this resource ID.

```azurecli

az rest --method GET `
  --url "https://<source-management-host><job-run-resource-id>?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" --output json

```

```Sample

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

Inspect `properties.status` and any error information in the response. Repeat the GET request as needed. `Succeeded`, `Failed`, and `Canceled` are terminal statuses; an in-progress status isn't evidence of completed migration. A successful job run should still be followed by data validation.

If you don't have the run ID, list the job's runs:

```azurecli

az rest --method GET `
  --url "https://<source-management-host>/subscriptions/<source-mover-subscription-id>/resourceGroups/<source-mover-resource-group>/providers/Microsoft.StorageMover/storageMovers/<source-mover-name>/projects/<project-name>/jobDefinitions/<job-definition-name>/jobRuns?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "<source-mover-subscription-id>" --output json

```

```Sample

az rest --method GET `
  --url "https://eastus2.management.azure.com/subscriptions/11112222-bbbb-3333-cccc-4444dddd5555/resourceGroups/contoso-migration-rg/providers/Microsoft.StorageMover/storageMovers/contoso-mover/projects/contoso-to-fabrikam/jobDefinitions/blob-transfer/jobRuns?api-version=2026-05-01" `
  --resource "https://management.azure.com/" `
  --subscription "11112222-bbbb-3333-cccc-4444dddd5555" --output json

```

Use the run resource ID returned in the last step for the preceding `GET` request. If the list response includes a `nextLink` value, retrieve that URL by using `az rest --method GET` with the same token audience and source subscription to inspect the remaining results. Don't infer that no run exists from only the first page of a paginated response.

When you configure logging, copy logs and job run logs help you investigate migration errors and the results for individual blobs. For logging configuration, see [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).


[!INCLUDE [post-migration-validation](includes/post-migration-validation.md)]

[!INCLUDE [troubleshooting-support](includes/troubleshooting-support.md)]

## Related content

The following articles can help you become more familiar with the Storage Mover service.

- [Get started with same-tenant Azure Blob container migration](azure-to-azure-migration.md)
- [Manage Azure Storage Mover endpoints](endpoint-manage.md)
- [Enable Azure Storage Mover copy and job logs](log-monitoring.md)
- [Azure Storage Mover REST API reference](/rest/api/storagemover/)
- [Assign Azure roles using Azure CLI](../role-based-access-control/role-assignments-cli.md)
