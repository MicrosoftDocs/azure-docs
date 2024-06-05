---
title: Optimize regional latency
description: Learn how to optimize regional latency for a Microsoft Playwright Testing Preview workspace. Choose to run tests on remote browsers in an Azure region nearest to you, or in a fixed region.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Optimize regional latency for a workspace in Microsoft Playwright Testing Preview

Learn how to minimize the network latency between the client machine and the remote browsers for a Microsoft Playwright Testing Preview workspace.

Microsoft Playwright Testing lets you run your Playwright tests on hosted browsers in the Azure region that's nearest to your client machine. The service collects the test results in the Azure region of the remote browsers, and then transfers the results to the workspace region.

By default, when you create a new workspace, the service runs tests in an Azure region closest to the client machine. When you disable this setting on the workspace, the service uses remote browsers in the Azure region of the workspace.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configure regional settings for a workspace

You can configure the regional settings for your workspace in the Azure portal.

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select the workspace settings icon, and then go to the **General** page to view the workspace settings.

    :::image type="content" source="./media/how-to-optimize-regional-latency/playwright-testing-general-settings.png" alt-text="Screenshot that shows the workspace settings page in the Playwright Testing portal." lightbox="./media/how-to-optimize-regional-latency/playwright-testing-general-settings.png":::

1. Select **Select region** to go to your workspace in the Azure portal.

    Alternately, you can go directly to the Azure portal and select your workspace:

    1. Sign in to the [Azure portal](https://portal.azure.com/).
    1. Enter **Playwright Testing** in the search box, and then select **Playwright Testing** in the **Services** category.
    1. Select your Microsoft Playwright Testing workspace from the list.

1. In your workspace, select **Region Management** in the left pane.

    :::image type="content" source="./media/how-to-optimize-regional-latency/configure-workspace-region-management.png" alt-text="Screenshot that shows the Region Management page in the Azure portal." lightbox="./media/how-to-optimize-regional-latency/configure-workspace-region-management.png":::

1. Choose the corresponding  region selection option.

    By default, the service uses remote browsers in the Azure region that's closest to the client machine to minimize latency.

## Related content

- Learn more about how to [determine the optimal configuration for optimizing test suite completion](./concept-determine-optimal-configuration.md).

- [Manage a Microsoft Playwright Testing workspace](./how-to-manage-playwright-workspace.md)

- [Understand how Microsoft Playwright Testing works](./overview-what-is-microsoft-playwright-testing.md#how-it-works)
