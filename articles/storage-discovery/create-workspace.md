---
title: Create and manage an Azure Storage Discovery Workspace
titleSuffix: Azure Storage Discovery
description: Learn how to create an Azure Storage Discovery Workspace.
author: fauhse
ms.service: azure-storage-discovery
ms.topic: how-to
ms.date: 10/09/2025
ms.author: fauhse
---

# Deploy the Azure Storage Discovery service

To deploy the Azure Storage Discovery service, you need to create a Discovery workspace resource in one of your resource groups. With this resource, you define which storage resources you want to cover across your Microsoft Entra tenant and how you want to segment reporting for them. The workspace offers prebuilt reports in the Azure portal that you can use to retrieve the insights you need about your storage resources.

Follow the steps in this article to create an Azure Storage Discovery workspace resource.

## Create a storage discovery workspace

You can create a storage discovery workspace using the Azure portal, Azure PowerShell, or the Azure CLI.

### [Azure portal](#tab/portal)

Create an Azure Storage Discovery Workspace resource in the Azure portal by selecting **Create** as shown in the following image.

:::image source="media/create-workspace/create-resource-sml.png" alt-text="Screenshot of the Create workspace page."  lightbox="media/create-workspace/create-resource.png":::

Choose the **Subscription** and **Resource group** in which to create the discovery workspace. The following table describes each element.

| Element        | Description                                                       |
|----------------|-------------------------------------------------------------------|
| `Name`         | The name of the Discovery workspace resource.                     |
| `Description`  | Optional. Description of the Discovery workspace resource.        |
| `Region`       | Azure region where the Discovery resource is created.<sup>1</sup> |
| `Pricing plan` | Storage Discovery pricing plan.<sup>2</sup>                       |

<sup>1</sup> For information on regions covered, see [Storage Discovery workspace regions](deployment-planning.md). 
<sup>2</sup> For information on Storage Discovery pricing plan, see [Understand Storage Discovery Pricing](pricing.md).

## Define workspaceRoots

A workspaceRoot specifies the top-level Azure resource identifiers where Storage Discovery initiates its scan for storage accounts. These identifiers are typically subscriptions or resource groups, and serve as the root of the discovery process. WorkspaceRoots define the overall scope and boundaries of your Azure estate for analysis.

Select the subscriptions and/or resource groups you want to include in the workspace.

> [!NOTE]
> - Ensure that the user or service principal deploying the workspace is granted at least **Reader** access to each specified root.
> - Up to 100 resources - subscriptions and/or resource groups can be included in one workspace.
> - The default limit of 100 resources per workspace can be increased. Reach out [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). Provide the tenantID, SubscriptionID where you would want this limit to be increased.

:::image source="media/create-workspace/workspace-roots-checks-sml.png" alt-text="Screenshot of the workspaceRoots."  lightbox="media/create-workspace/workspace-roots-checks.png":::

After you add your subscriptions or resource groups to your workspace, the service runs an access check to verify that the user has `Microsoft.Storage/storageAccounts/read` on the added resources. The following image provides an example of an access check failure with the associated status message.

:::image source="media/create-workspace/create-access-sml.png" alt-text="Screenshot of the access check on workspaceRoots."  lightbox="media/create-workspace/create-access.png":::

If you don't have `Microsoft.Storage/storageAccounts/read` on any of the resources added, remove the resource from the workSpaceRoots to proceed with the creation of workspace or resolve the access issue and try again.

## Create a Scope
Scopes are logical groupings of storage accounts within the defined workspaceRoots. Scopes allow you to filter and organize data using tags and resource types, enabling targeted insights. For example, you can create scopes for individual departments, environments, or compliance zones.

:::image source="media/create-workspace/create-scope-sml.png" alt-text="Screenshot of a scope."  lightbox="media/create-workspace/create-scope.png":::

> [!IMPORTANT]
> A **default Scope** is added automatically, which includes all storage accounts within subscriptions or resource groups added in the **workspaceRoots**.

You can optionally add tags to this workspace resource. Then select **Review and Create**. If the access validation is still running, you can't create the workspace resource yet. Wait for this check to finish, correct any issues, then confirm by selecting **Create**.

:::image source="media/create-workspace/access-check-sml.png" alt-text="Screenshot of access checks running."  lightbox="media/create-workspace/access-check.png":::

> [!NOTE]
> Discovery resource creation fails if the access checks on any subscription or resource group isn't successful.

After the access checks complete successfully, the resource can be deployed as shown in the following sample image.

:::image source="media/create-workspace/deploy-resource-sml.png" alt-text="Screenshot of the deployment complete."  lightbox="media/create-workspace/deploy-resource.png":::

### [Azure PowerShell](#tab/powershell)

Create an Azure Storage Discovery workspace resource in the Azure portal by modifying the variables in the following PowerShell script to include your resource group, workspace name, and location. Verify that your values are correct, and then run the script in the Azure PowerShell console.

```powershell

# First, set variables for the resources
$resGroupName   = "myResourceGroup"
$workSpaceName  = "myStorageDiscoveryWorkspace"
$location       = "East US"
$DiscoveryScopeLevel1 = "myScopeLevel1"
$DiscoveryScopeLevel2 = "myScopeLevel2"

# Next, prepare a DiscoveryScope object
$scope1 =  New-AzStorageDiscoveryScopeObject -DisplayName "test1" `
            -ResourceType "Microsoft.Storage/storageAccounts"  `
            -TagKeysOnly "e2etest1" -Tag @{"tag1" = "value1"; "tag2" = "value2" }
$scope2 =  New-AzStorageDiscoveryScopeObject -DisplayName "test2" `
            -ResourceType "Microsoft.Storage/storageAccounts"  `
            -TagKeysOnly "e2etest2" -Tag @{"tag3" = "value3" }

# Finally, create the discovery workspace
New-AzStorageDiscoveryWorkspace -Name $workSpaceName  -ResourceGroupName $resGroupName `
-Location $location -Description 123 -WorkspaceRoot $DiscoveryScopeLevel1 `
-Sku Standard   -Scope $scope1

```

### [Azure CLI](#tab/cli)

Create an Azure Storage Discovery workspace resource using CLI.

```cli

az storage-discovery workspace create \
            --resource-group <your-resource-group> \
            --name <your-workspace-name> \
            --location <azure-region> \
            --workspace-roots "/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>" \
            --scopes '[{"displayName":"basic","resourceTypes":["Microsoft.Storage/storageAccounts"]}]' \
            --sku Standard \
            --description "Optional description"

```
#### Required parameters

| Parameter | Description |
|-----------|-------------|
| resource-group | The resource group where the workspace is created. |
| name | The name of the workspace. |
| location | Azure region for deployment. |
| workspace-roots | The workspace root designates the storage resources to get insights for. This `string[]` can contain a combination of subscription IDs and resource group IDs. You may mix and match these resource types. The identity under which you deploy the workspace [must have permissions](deployment-planning.md#permissions-to-your-storage-resources) to all resources you list at the time of deployment. |
| scopes | You can create several scopes in a workspace. A scope allows you to filter the storage resources the workspace covers and obtain different reports for each of these scopes. Filtering is based on ARM resource tags on your storage resources. This property expects a `JSON` object containing sections for `tag key name` : `value` combinations or `tag key names` only. When your storage resources have matching ARM resource tags, they're included in this scope. |
| sku | Pricing tier (Free or Standard). |

#### Optional parameters

| Parameter | Description |
|-----------|-------------|
| description | Optional metadata for the workspace. |

---

> [!NOTE]
> It can take up to 24 hours after scope creation for metrics to begin appearing in reports.
