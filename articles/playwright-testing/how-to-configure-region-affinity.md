---
title: Configure region affinity
description: Learn how to configure region affinity for a Microsoft Playwright Testing workspace. Choose to run tests on browsers in an Azure region nearest to you, or in a fixed region.
ms.topic: how-to
ms.date: 08/23/2023
ms.custom: playwright-testing-preview
---

# Configure region affinity for a Microsoft Playwright Testing workspace

Learn how to configure region affinity for a Microsoft Playwright Testing workspace. With region affinity, you can minimize the network latency between the client machine and the remote browsers.

Region affinity lets you run your Playwright tests on hosted browsers in the Azure region nearest the client machine. Microsoft Playwright Testing collects the test results in Azure region of the remote browsers, and then transfers the results to the workspace region.

When you create a new workspace, the region affinity setting is enabled by default. When region affinity isn't enabled, the service uses remote browsers in the Azure region of the workspace.

## Configure region affinity in the Azure portal

You can configure the region affinity setting on the workspace in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Microsoft Playwright Testing workspace.

1. Select **Regional Affinity** in the left pane.

    :::image type="content" source="./media/how-to-configure-region-affinity/configure-workspace-region-affinity.png" alt-text="Screenshot that shows the Regional Affinity page in the Azure portal.":::

1. Enable or disable region affinity for the workspace by selecting the corresponding action.

    By default, region affinity is enabled when you create a new workspace.

## Related content

- [Manage a Microsoft Playwright Testing workspace](./how-to-manage-playwright-workspace.md)
- [Understand how Microsoft Playwright Testing works](./overview-what-is-microsoft-playwright-testing.md#how-it-works)
