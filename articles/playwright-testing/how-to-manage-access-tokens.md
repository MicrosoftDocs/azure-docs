---
title: Manage workspace access keys
description: Learn how to create & manage access keys to authenticate requests to Microsoft Playwright Testing. Access keys provide secure access to the Microsoft Playwright Testing API and to run tests in your workspace.
ms.topic: how-to
ms.date: 09/04/2023
ms.custom: playwright-testing-preview
---

# Manage workspace access keys in Microsoft Playwright Testing Preview

In this article, you'll learn how to manage workspace access keys in Microsoft Playwright Testing Preview. You use access keys to authenticate and authorize access to your workspace.

Access keys are associated with a user account and workspace. You can create multiple access keys per workspace.

To run Playwright tests with Microsoft Playwright Testing, you specify the workspace access key in the service configuration file. Learn how to [set up your service configuration](./quickstart-run-end-to-end-tests.md#set-up-your-environment).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Microsoft Playwright Testing workspace. To create a workspace, see [Quickstart: Run Playwright tests at scale](./quickstart-run-end-to-end-tests.md).
- To create or revoke access keys, your Azure account needs to have the [Contributor](/azure/role-based-access-control/built-in-roles#owner) or [Owner](/azure/role-based-access-control/built-in-roles#contributor) role at the workspace level. Learn more about [managing access to a workspace](./how-to-manage-workspace-access.md).

## Protect your access keys

Your workspace access keys are similar to a password for your Microsoft Playwright Testing workspace. Always be careful to protect your access keys. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others.

Revoke and recreate your keys if you believe they may have been compromised.

## Create an access key

Create an access key to authorize access to your Microsoft Playwright Testing workspace, and to run existing Playwright tests in your workspace. You can create an access key from the Microsoft Playwright Testing portal.

To create a new workspace access key: 

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select your workspace.

1. Select **Generate key** to generate a new access key for your account and workspace.

    :::image type="content" source="./media/how-to-manage-access-tokens/playwright-testing-generate-key.png" alt-text="Screenshot that shows setup guide in the Playwright Testing portal, highlighting the 'Generate key' button.":::

1. Copy the access key for the workspace.

    :::image type="content" source="./media/how-to-manage-access-tokens/playwright-testing-copy-access-key.png" alt-text="Screenshot that shows how to copy the generated access key in the Playwright Testing portal.":::
    
    > [!IMPORTANT]
    > You can only access the key value immediately after you've created it. You can't access the key value anymore at a later time.

## Related content

- Learn more about [managing access to a workspace](./how-to-manage-workspace-access.md).
