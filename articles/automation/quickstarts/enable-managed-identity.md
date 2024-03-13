---
title: Quickstart - Enable managed identities for your Automation account using the Azure portal
description: This quickstart helps you enable managed identities for your Automation account using the Azure portal
services: automation
ms.date: 09/30/2023
ms.topic: quickstart
ms.subservice: process-automation
ms.custom: mode-ui
#Customer intent: As an administrator, I want to enable managed identities for my Automation account so that I can securely access other Azure resources.
---

# Quickstart: Enable managed identities for your Automation account using the Azure portal

This Quickstart shows you how to enable managed identities for an Azure Automation account. For more information on how managed identities work with Azure Automation, see [Managed identities](../automation-security-overview.md#managed-identities).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Automation account. For instructions, see [Create an Automation account](./create-azure-automation-account-portal.md).

- A user-assigned managed identity. For instructions, see [Create a user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity). The user-assigned managed identity and the target Azure resources that your runbook manages using that identity must be in the same Azure subscription.

## Enable system-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Automation account.

1. Under **Account Settings**, select **Identity (Preview)**.

   :::image type="content" source="media/enable-managed-identity/managed-identity-portal.png" alt-text="Navigating to Identity in portal.":::

1. Set the system-assigned **Status** option to **On** and then press **Save**. When you're prompted to confirm, select **Yes**.

   Your Automation account can now use the system-assigned identity, that is registered with Microsoft Entra ID and is represented by an object ID.

   :::image type="content" source="media/enable-managed-identity/system-assigned-object-id.png" alt-text="Managed identity object ID.":::

## Add user-assigned managed identity

This section continues from where the last section ended.

1. Select the **User assigned** tab, and then select **+ Add** or **Add user assigned managed identity** to open the **Add user assigned managed i...** page.

   :::image type="content" source="media/enable-managed-identity/user-assigned-portal.png" alt-text="User-assigned tab in portal.":::

1. From the **Subscription** drop-down list, select the subscription for your user-assigned managed identity.

   :::image type="content" source="media/enable-managed-identity/add-user-assigned.png" alt-text="Add user-assigned page in portal.":::

1. Under **User assigned managed identities**, select your existing user-assigned managed identity and then select **Add**. You'll then be returned to the **User assigned** tab.

   :::image type="content" source="media/enable-managed-identity/added-user-identity-portal.png" alt-text="Added user-assigned in portal.":::

## Clean up resources

If you no longer need the user-assigned managed identity attached to your Automation account, perform the following steps:

1. From the **User assigned** tab, select your user-assigned managed identity.

1. From the top menu, select **Remove**, and then select **Yes** when prompted for confirmation.

If you no longer need the system-assigned managed identity enabled for your Automation account, perform the following steps:

1. From the **System assigned** tab, under **Status**, select **Off**.

1. From the top menu, select **Save**, and then select **Yes** when prompted for confirmation.

## Next steps

In this Quickstart, you enabled managed identities for an Azure Automation account. To use your Automation account with managed identities to execute a runbook, see.

> [!div class="nextstepaction"]
> [Tutorial: Create Automation PowerShell runbook using managed identity](../learn/powershell-runbook-managed-identity.md)
