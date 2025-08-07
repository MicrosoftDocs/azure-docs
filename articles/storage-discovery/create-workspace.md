---
title: Create and manage an Azure Storage Discovery Workspace
titleSuffix: Azure Storage Discovery
description: Learn how to create an Azure Storage Discovery Workspace.
author: fauhse

ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 07/22/2025
ms.author: fauhse
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: IN PROGRESS

REVIEW Stephen/Fabian: IN PROGRESS
EDIT PASS: IN PROGRESS

Document score: 100 - 495/0 (words, issues)

!########################################################
-->

# Create and manage a storage discovery preview workspace

The Azure Storage Discovery workspace is a central resource within the Azure Storage Discovery (preview) platform. A discovery workspace is designed to help users manage and visualize storage data across various scopes such as tenants, subscriptions, and resource groups.

Follow the steps in this article to create an Azure Storage Discovery workspace resource.

## Create a storage discovery workspace

You can create a storage discovery workspace using the Azure portal, Azure PowerShell, or the Azure CLI.

### [Azure portal](#tab/portal)

Create an Azure Storage Discovery Workspace resource in the Azure portal by selecting **Create** as shown in the following image.

:::image source="media/create-workspace/create-resource-sml.png" alt-text="Screenshot of the Create ASDW page."  lightbox="media/create-workspace/create-resource.png":::

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
> - Up to 100 resources - subscriptions and/or resource groups can be included in one ASDW.

:::image source="media/create-workspace/workspace-roots-checks-sml.png" alt-text="Screenshot of the workspaceRoots."  lightbox="media/create-workspace/workspace-roots-checks.png":::

After you add your subscriptions, resource groups, or tenant to your workspace, the service runs an access check to verify that the user has `Microsoft.Storage/storageAccounts/read` on the added resources. The following image provides an example of an access check failure with the associated status message.

:::image source="media/create-workspace/create-access-sml.png" alt-text="Screenshot of the access check on workspaceRoots."  lightbox="media/create-workspace/create-access.png":::

If you don't have `Microsoft.Storage/storageAccounts/read` on any of the resources added, remove the resource from the workSpaceRoots to proceed with the creation of workspace or resolve the access issue and try again.

## Create a Scope
Scopes are logical groupings of storage accounts within the defined workspaceRoots. Scopes allow you to filter and organize data using tags and resource types, enabling targeted insights. For example, you can create scopes for individual departments, environments, or compliance zones.

:::image source="media/create-workspace/create-scope-sml.png" alt-text="Screenshot of a scope."  lightbox="media/create-workspace/create-scope.png":::

> [!IMPORTANT]
> A **default Scope** is added automatically, which includes all storage accounts within subscriptions or resource groups added in the **workspaceRoots**.

Add tags on the ASDW resource, if needed, and select **Review and Create**. You aren't able to deploy the resource until an access validation is complete. If the check for the workspaceRoots resources isn't complete, a message is displayed.

:::image source="media/create-workspace/access-check-sml.png" alt-text="Screenshot of access checks running."  lightbox="media/create-workspace/access-check.png":::

> [!NOTE]
> Discovery resource creation fails if the access checks on any subscription, resource group, or tenant isn't successful.

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

---

> [!NOTE]
> It can take up to 24 hours after scope creation for metrics to begin appearing in reports.
