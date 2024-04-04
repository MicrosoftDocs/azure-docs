---
title: Microsoft Playwright Testing free trial
description: Learn how to get started for free with Microsoft Playwright Testing Preview free trial.
ms.topic: how-to
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Try Microsoft Playwright Testing Preview for free

Microsoft Playwright Testing Preview is a fully managed service for end-to-end testing built on top of Playwright. With the free trial, you can try Microsoft Playwright Testing for free for 30 days and 100 test minutes. In this article, you learn about the limits of the free trial, how to get started, and how to track your free trial usage.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).

## Limits to free trial

The following table lists the limits for the Microsoft Playwright Testing free trial.

| Resource | Limit |
|-|-|
| Duration of trial | 30 days |
| Total test minutes¹ | 100 minutes |
| Number of workspaces²³ | 1 |

¹ If you run a test that exceeds the free trial test minute limit, only the overage test minutes account towards the pay-as-you-go billing model.

² These limits only apply to the *first* workspace you create in your Azure subscription. Any subsequent workspaces you create in the subscription automatically uses the pay-as-you-go billing model.

³ If you delete the free trial workspace, you can't create a new free trial workspace anymore.

> [!CAUTION]
> If you exceed any of these limits, the workspace is automatically converted to the pay-as-you-go billing model. Learn more about the [Microsoft Playwright Testing pricing](https://aka.ms/mpt/pricing).

## Create a workspace

The first time you create a workspace in your Azure subscription, the workspace is automatically enrolled in the free trial. 

To create a workspace in the Playwright portal:

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select **Create workspace**.

    If this is the first workspace you create in the Azure subscription, you see a message that the workspace is eligible for the free trial.

    :::image type="content" source="./media/how-to-try-playwright-testing-free/playwright-testing-create-free-trial.png" alt-text="Screenshot that shows the create workspace experience in the Playwright portal, showing the free trial message." lightbox="./media/how-to-try-playwright-testing-free/playwright-testing-create-free-trial.png":::

1. Provide the following information to create the workspace:

    |Field  |Description  |
    |---------|---------|
    |**Workspace name**     | Enter a unique name to identify your workspace.<BR>The name can only consist of alphanumerical characters, and have a length between 3 and 64 characters. |
    |**Azure subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace. |
    |**Region**     | Select a geographic location to host your workspace. <BR>This location is where the test run data is stored for the workspace. |

1. Select **Create workspace**.

## Track your free trial usage

You can track the usage of the free trial for a workspace in either of these ways:

- Select the settings icon and then select **Billing**.

    :::image type="content" source="./media/how-to-try-playwright-testing-free/playwright-testing-billing-details.png" alt-text="Screenshot that shows the Billing setting page in the Playwright portal." lightbox="./media/how-to-try-playwright-testing-free/playwright-testing-billing-details.png":::

- Select the **In free trial** menu item.

    :::image type="content" source="./media/how-to-try-playwright-testing-free/playwright-testing-free-trial-menu.png" alt-text="Screenshot that shows the free trial status menu item in the Playwright portal, to track the free trial usage." lightbox="./media/how-to-try-playwright-testing-free/playwright-testing-free-trial-menu.png":::

In the list of all workspaces, you can view a banner message that indicates if a workspace is in the free trial.

:::image type="content" source="./media/how-to-try-playwright-testing-free/playwright-portal-workspaces.png" alt-text="Screenshot that shows the list of workspaces in the Playwright portal, highlighting the free trial banner message for a workspace." lightbox="./media/how-to-try-playwright-testing-free/playwright-portal-workspaces.png":::


## Upgrade your workspace

When you exceed any of the limits of the free trial, your workspace is automatically converted to the pay-as-you-go billing model. 

All test runs, access tokens, and other artifacts linked to your workspace remain available.

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
