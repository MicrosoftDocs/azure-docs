---
title: Create and manage a storage discovery workspace
titleSuffix: Azure Storage Discovery
description: Learn how to create an discovery workspace.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: how-to
ms.author: pthippeswamy
ms.date: 06/10/2025
---

# Create and manage a storage discovery workspace

The Azure Storage Discovery Workspace (ASDW) is a central resource within the Azure Storage Discovery platform designed to help users manage and visualize storage data across various scopes—such as tenants, subscriptions, and resource groups.

This article helps you create an ASDW resource.

## [Portal](#tab/azure-portal)

### Create an ASDW from Portal

Click on **Create**

> [!div class="mx-imgBorder"]
> ![Screenshot of the create ASDW page.](../media/create/create1.png)

Choose a **Subscription** and **Resource group** to create the discovery workspace

The following table describes each element.

| Element | Description |
|---|--|
| `Name` | The name of the Discovery workspace resource. |
| `Description` | Optional. Description of the Discovery workspace resource. |
| `Region` | Azure region where the Discovery resource will be created.<sup>1</sup>|
| `Pricing plan` | Storage Discovery pricing plan.<sup>2</sup>|

<sup>1</sup> For information on regions covered, see [Storage Discovery Regions](regionalCoverage.md).
<sup>2</sup> For information on Storage Discovery pricing plan, see [Understand Storage Discovery Pricing](discovery-pricing.md).

### Define WorkspaceRoots 
WorkspaceRoots specifies the top-level Azure resource identifiers - such as subscriptions or resource groups - where Storage Discovery initiates its scan for storage accounts. These identifiers serve as the root of the discovery process, defining the overall scope and boundaries of your Azure estate that will be analyzed. Select the subscriptions and/or resource groups that need to be included in the workspace.

> [!NOTE]
> - Ensure that the user or service principal deploying the workspace has at least **Reader** access to each specified root.
> - Up to 100 resources - subscriptions and/or resource groups can be included in one ASDW.

> [!div class="mx-imgBorder"]
> ![Screenshot of the workspaceRoots.](../media/create/workspaceRoots.png)

Once the subscriptions, resource groups or tenant is added to the workspace, an access check is run to verify if the user has Microsoft.Storage/storageAccounts/read on the added resources. As the checks are running, status of the run is as shown below:

> [!div class="mx-imgBorder"]
> ![Screenshot of the access check on workspaceRoots.](../media/create/create_access.png)

If you do not have Microsoft.Storage/storageAccounts/read on any of the resources added, remove the resource from the workSpaceRoots to proceed with the creation of workspace or resolve the access issue and try again.

### Create Scope
Scopes are logical groupings of storage accounts within the defined workspaceRoots.They allow you to filter and organize data using tags and resource types. This enables targeted insights - you can create scopes for different departments, environments, or compliance zones.

> [!div class="mx-imgBorder"]
> ![Screenshot of scope](../media/create/scope.png)

> [!IMPORTANT]
> **Default Scope** is added automatically which would include all storage accounts within the subscriptions or resource groups added in the **workspaceRoots**

Add tags, if needed on the ASDW resource and click on Review and Create.

If the access check on the workspaceRoots resources is not yet complete, the *Review and Create* tab will show the informational message that the access check is in progress and resource cannot be deployed when the access check is in progress.

> [!div class="mx-imgBorder"]
> ![Screenshot of access checks.](../media/create/reviewAndCreate.png)

> [!NOTE]
> Please note that Discovery resource creation will fail if the access checks on any added subscription or resource group or tenant is not successful.

When the access checks completes successfully, resource can be deployed.

> [!div class="mx-imgBorder"]
> ![Screenshot of deployment complete.](../media/create/deploy.png)

> [!NOTE]
> Please note that it will take upto 24 hours for the metrics to start appearing in the Reports after the scope has been created.

## Next steps

- [View insights on Storage Discovery Reports](discovery-reports.md)