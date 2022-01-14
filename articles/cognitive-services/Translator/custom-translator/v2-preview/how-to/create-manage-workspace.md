---
title: How to manage workspaces - Custom Translator
titleSuffix: Azure Cognitive Services
description: Workspaces are places to manage your documents, projects, models. 
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 01/13/2022
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to view system test results, so that I can review test results and analyze my training.
---

# Manage workspace | Preview

> [!IMPORTANT]
> Custom Translator v2.1 is currently in public preview. Some features may not be supported or have constrained capabilities.

The first step before building a custom model is to prepare starting with the prerequisites below and then creating a workspace. Workspaces are places to manage your documents, projects, models. When you create a workspace, you can choose to use the workspace independently, share it with teammates or you can divide up the work and create multiple workspaces.

## Create workspace

Review [how to create a workspace](../quickstart.md#create-workspace) to learn the steps.

## Manage workspace settings

Select a workspace and navigate to 'Workspace settings' where you can manage your workspace:

* Change or delete the resource key in the global resource region. If using a specific region resource key, you will need to create a new workspace.
* Change the workspace name
* Share the workspace with others
* Delete the workspace

### Share workspace for collaboration

The person who creates the Workspace is the owner. Within the 'Workspace settings', an owner can designate three different roles for collaborative workspaces:

* Owner: An owner has full permission to the workspace.
* Editor: An editor in the workspace will be able to add documents, train models, and delete documents and projects. They can add a subscription key, but cannot modify who the workspace is shared with, delete the workspace, or change the workspace name.
* Reader: A reader in the workspace will be able to view (and download if available) all information in the workspace.

### Share workspace steps

1. Select *Share workspace*
2. Fill in the email address
3. Select role from the dropdown list
4. Select *Add*

:::image type="content" source="../media/quickstart/manage-workspace-settings-1.png" alt-text="Screenshot illustrating how to share a workspace.":::

:::image type="content" source="../media/quickstart/manage-workspace-settings-2.png" alt-text="Screenshot illustrating share workspace settings.":::

### Unshare workspace steps

1. Select *Share workspace*
2. Select the `X` icon next to the *Role* of the email you want to remove

:::image type="content" source="../media/quickstart/manage-workspace-settings-3.png" alt-text="Screenshot illustrating how to unshare a workspace.":::

## Next Steps

* Learn [How to manage projects](manage-projects.md) to build high quality custom translation systems.
