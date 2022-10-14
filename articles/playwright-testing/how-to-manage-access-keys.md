---
title: Authenticate requests
titleSuffix: Microsoft Playwright Testing
description: Learn how to create & manage access keys to authenticate requests to Microsoft Playwright Testing. Access keys provide secure access to the Microsoft Playwright Testing API and to run tests in your workspace.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 08/23/2022
---

# Authenticate requests to Microsoft Playwright Testing Preview

In this article, you'll learn how to manage access keys to authenticate requests to Microsoft Playwright Testing Preview. Access keys provide secure access to the Microsoft Playwright Testing API and to run tests in your workspace.

To run existing Playwright tests with Microsoft Playwright Testing, you specify the workspace access key in the Playwright configuration file. Learn how to [use your access key to grant access](#use-your-access-key-to-grant-access).

Access keys have a fixed duration expiration period that ranges from seven days to one year. When an access key expires, processes that use this key are no longer authorized to run tests. You'll create a new access key and replace the access key value in the client processes.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Microsoft Playwright Testing workspace. To create a workspace, see [Quickstart: Run web UI tests at scale](./quickstart-run-end-to-end-tests.md).
- To create or delete access keys, your Azure account needs to have the Contributor or Owner role at the workspace level. Learn more about [managing access to a workspace](./how-to-assign-roles.md).

<!-- TODO: use link to manage workspaces instead -->

## Protect your access keys

Your workspace access keys are similar to a password for your Microsoft Playwright Testing workspace. Always be careful to protect your access keys. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others.

Delete and recreate your keys if you believe they may have been compromised.

## View workspace access keys

You can view the list of workspace access keys from the Microsoft Playwright Testing portal. The portal shows the key expiration date and expiration status, and enables you to [delete the key](#delete-your-access-key). The access key value is no longer accessible after you've created it.


To view the list of access keys in your workspace from the Microsoft Playwright Testing portal:

1. Open the [Microsoft Playwright Testing portal](https://dashboard.playwright-ppe.io/) and sign in with your Azure credentials.

1. Access the **Menu > Manage Access keys** menu in the top-right of the screen.

    :::image type="content" source="./media/how-to-manage-access-keys/access-key-menu.png" alt-text="Screenshot that shows the Access Key menu in the Microsoft Playwright Testing portal.":::

1. View the list of workspace access keys. You can filter the list by expiration status.

    :::image type="content" source="./media/how-to-manage-access-keys/access-key-list.png" alt-text="Screenshot that shows the list of access keys in the Microsoft Playwright Testing portal.":::

## Create an access key

Create an access key to authorize access to your Microsoft Playwright Testing workspace, and to run existing Playwright tests in your workspace. You can create an access key from the Microsoft Playwright Testing portal.

To create a new workspace access key: 

1. In the [Microsoft Playwright Testing portal](https://dashboard.playwright-ppe.io/), access the **Menu > Manage Access keys** menu in the top-right of the screen.

1. Select **Generate a new key**.

    :::image type="content" source="./media/how-to-manage-access-keys/access-key-list-generate-new-key.png" alt-text="Screenshot that shows the list of access keys in the Microsoft Playwright Testing portal, highlighting the Generate a new key button.":::

1. Enter a **Key name**, select an **Expiration** duration, and then select **Generate key**.

    :::image type="content" source="./media/how-to-manage-access-keys/create-access-key.png" alt-text="Screenshot that shows the New access key page in the Microsoft Playwright Testing portal.":::

1. In the list of access keys, select **Copy** to copy the generated key value.

    :::image type="content" source="./media/how-to-manage-access-keys/copy-access-key-value.png" alt-text="Screenshot that shows how to copy the access key functionality in the Microsoft Playwright Testing portal.":::
    
    > [!IMPORTANT]
    > You can only access the key value immediately after you've created it. You can't access the key value anymore at a later time.

## Use your access key to grant access

To use your access key to run your Playwright tests, specify the `PlaywrightService.accessKey` property in the `playwright.config.ts` Playwright configuration file. 

Use an environment variable or use a secret when running in a CI/CD workflow, to avoid sharing the access key with others.

```typescript
// playwright.config.ts
var playwrightServiceConfig = new PlaywrightService({{
    accessKey: process.env.ACCESS_KEY || ""
    }
})
```

Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).

## Delete your access key

You can delete a workspace access key from the Microsoft Playwright Testing portal. Delete a key when it has expired, to replace an access key that you believe has been compromised, or when you no longer need it.

> [!IMPORTANT]
> You won't be able to restore the access key once it has been deleted. Any processes that depend on this key to run tests, will no longer work.

To delete an existing workspace access key:

1. In the [Microsoft Playwright Testing portal](https://dashboard.playwright-ppe.io/), access the **Menu > Manage Access keys** menu in the top-right of the screen.

1. Select **Delete** for the access key you want to delete.

    :::image type="content" source="./media/how-to-manage-access-keys/access-key-list-delete-key.png" alt-text="Screenshot that shows the list of access keys in the Microsoft Playwright Testing portal, highlighting the Delete button for an item in the list.":::

1. Select **Delete** in the **Delete Key** confirmation popup window, to delete the access key.

## Next steps

- Learn more about [managing access to a workspace](./how-to-assign-roles.md).
- Learn more about [identifying app issues with web UI tests](./tutorial-identify-issues-with-end-to-end-tests.md).
- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn more about [running cross-platform tests](./how-to-cross-platform-tests.md).
