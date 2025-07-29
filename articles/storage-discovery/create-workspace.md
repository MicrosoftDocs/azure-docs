---
title: Create and manage a storage discovery workspace
titleSuffix: Azure Storage Discovery
description: Learn how to create a discovery workspace.
author: pthippeswamy
ms.service: azure-storage-mover
ms.topic: how-to
ms.author: shaas
ms.date: 08/01/2025
---

# Create and manage a storage discovery workspace

The Azure Storage Discovery Workspace (ASDW) is a central resource within the Azure Storage Discovery platform designed to help users manage and visualize storage data across various scopes—such as tenants, subscriptions, and resource groups.

This article helps you create an ASDW resource.

## Create an ASDW from Azure portal

Click on **Create**

> [!div class="mx-imgBorder"]
> ![Screenshot of the create ASDW page.](./media/create-resource.png)

Choose a **Subscription** and **Resource group** to create the discovery workspace

The following table describes each element.

| Element | Description |
|---|--|
| `Name` | The name of the Discovery workspace resource. |
| `Description` | Optional. Description of the Discovery workspace resource. |
| `Region` | Azure region where the Discovery resource is created.<sup>1</sup>|
| `Pricing plan` | Storage Discovery pricing plan.<sup>2</sup>|

<sup>1</sup> For information on regions covered, see [Storage Discovery workspace regions](deployment-planning.md). 
<sup>2</sup> For information on Storage Discovery pricing plan, see [Understand Storage Discovery Pricing](pricing.md).

### Define workspace root
Workspace root specifies the top-level Azure resource identifiers - such as subscriptions or resource groups - where Storage Discovery initiates its scan for storage accounts. These identifiers serve as the root of the discovery process, defining the overall scope and boundaries of your Azure estate that is analyzed. Select the subscriptions and/or resource groups that need to be included in the workspace.

> [!NOTE]
> - Ensure that the user or service principal deploying the workspace has at least **Reader** access to each specified resource.
> - Up to 100 resources - subscriptions and/or resource groups can be included in one Discovery workspace.

> [!div class="mx-imgBorder"]
> ![Screenshot of the workspace root.](./media/workspace-roots-checks.png)

Once the subscriptions, resource groups or tenant is added to the workspace, an access check is run to verify if the user has Microsoft.Storage/storageAccounts/read on the added resources. As the checks are running, status of the run is as shown:

If you do not have Microsoft.Storage/storageAccounts/read on any of the resources added, remove the resource from the workSpace root to proceed with the creation of workspace or resolve the access issue and try again.

### Create Scope
Scopes are logical groupings of storage accounts within the defined workspace root. They allow you to filter and organize data using tags and resource types. Scope enables targeted insights - you can create scopes for different departments, environments, or compliance zones.

> [!div class="mx-imgBorder"]
> ![Screenshot of scope](./media/scope.png)

> [!IMPORTANT]
> **Default Scope** is added automatically, which would include all storage accounts within the subscriptions or resource groups added in the **workspace root**

Add tags, if needed on the ASDW resource and click on Review and Create.

If the access check for the workspace root resources hasn’t finished yet, the Review and Create tab shows a message saying the check is still in progress. You won’t be able to deploy the resource until the check is complete.

> [!NOTE]
> Note that Discovery resource creation fails if the access checks on any added subscription or resource group or tenant is not successful.

When the access checks complete successfully, resource can be deployed.

> [!NOTE]
> Note that it will take up to 24 hours for the metrics to start appearing in the Reports after the scope is created.