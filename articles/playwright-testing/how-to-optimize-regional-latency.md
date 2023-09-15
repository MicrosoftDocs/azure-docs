---
title: Optimize regional latency
description: Learn how to optmize regional latency for a Microsoft Playwright Testing Preview workspace. Choose to run tests on remote browsers in an Azure region nearest to you, or in a fixed region.
ms.topic: how-to
ms.date: 09/27/2023
ms.custom: playwright-testing-preview
---

# Optimize regional latency for a workspace in Microsoft Playwright Testing Preview

Learn how to minimize the network latency between the client machine and the remote browsers for a Microsoft Playwright Testing Preview workspace.

Microsoft Playwright Testing lets you run your Playwright tests on hosted browsers in the Azure region that's nearest to your client machine (*region affinity*). The service collects the test results in the Azure region of the remote browsers, and then transfers the results to the workspace region.

By default, when you create a new workspace, the service runs tests in an Azure region closest to the client machine. When you disable this setting on the workspace, the service uses remote browsers in the Azure region of the workspace.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configure region affinity for a workspace

You can configure the region affinity setting on the workspace in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Microsoft Playwright Testing workspace.

1. Select **Regional Affinity** in the left pane.

    :::image type="content" source="./media/how-to-optimize-regional-latency/configure-workspace-region-affinity.png" alt-text="Screenshot that shows the Regional Affinity page in the Azure portal.":::

1. Enable or disable region affinity for the workspace by selecting the corresponding action.

    By default, region affinity is enabled when you create a new workspace.

## Related content

- [Manage a Microsoft Playwright Testing workspace](./how-to-manage-playwright-workspace.md)
- [Understand how Microsoft Playwright Testing works](./overview-what-is-microsoft-playwright-testing.md#how-it-works)
