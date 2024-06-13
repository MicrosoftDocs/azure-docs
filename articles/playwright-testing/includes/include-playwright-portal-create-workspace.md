---
title: "Include file"
description: "Include file"
ms.custom: "include file"
ms.topic: "include"
ms.date: 10/04/2023
---

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. If you already have a workspace, select an existing workspace, and move to the next step.
    
    > [!TIP]
    > If you have multiple workspaces, you can switch to another workspace by selecting the workspace name at the top of the page, and then select **Manage all workspaces**.

1. If you don't have a workspace yet, select **+ New workspace**, and then provide the following information:

    |Field  |Description  |
    |---------|---------|
    |**Workspace name**     | Enter a unique name to identify your workspace.<BR>The name can only consist of alphanumerical characters, and have a length between 3 and 64 characters. |
    |**Azure subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace. |
    |**Region**     | Select a geographic location to host your workspace. <BR>This is the location where the test run data is stored for the workspace. |

    :::image type="content" source="../media/include-playwright-portal-create-workspace/playwright-testing-create-workspace.png" alt-text="Screenshot that shows the 'Create workspace' page in the Playwright portal." lightbox="../media/include-playwright-portal-create-workspace/playwright-testing-create-workspace.png":::

1. Select **Create workspace** to create the workspace in your subscription.

    During the workspace creation, a new resource group and a Microsoft Playwright Testing Azure resource are created in your Azure subscription.
