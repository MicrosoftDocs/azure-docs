---
title: Quickstart - Create an Azure Automation account using the portal
description: This quickstart helps you get started creating an Azure Automation account using the portal
services: automation
ms.date: 09/02/2021
ms.topic: quickstart
ms.subservice: process-automation
ms.custom: mvc
# Customer intent: As an administrator, I want to create an Automation account so that I can further use the Automation services.
---

# Quickstart: Create an Automation account using the Azure portal

You can create an Azure Automation account using the Azure portal, a browser-based user interface allowing access to a number of resources. One Automation account can manage resources across all regions and subscriptions for a given tenant. This quickstart guides you in creating an Automation account.

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create Automation account

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the top menu, select **+ Create a resource**.

1. Under Categories**, select **IT & Management Tools**, and then select **Automation**.

   :::image type="content" source="./media/create-account-portal/automation-account-portal.png" alt-text="Locating Automation accounts in portal.":::

1. From the **Add Automation Account** page, provide the following information:

   | Property | Description |
   |---|---|
   |Name| Enter a name unique for it's location and resource group. Names for Automation accounts that have been deleted might not be immediately available. You can't change the account name once it has been entered in the user interface. |
   |Subscription| From the drop-down list, select the Azure subscription for the account.|
   |Resource group|From the drop-down list, select your existing resource group, or select **Create new**.|
   |Location| From the drop-down list, select a location for the account. For an updated list of locations that you can deploy an Automation account to, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=automation&regions=all)|
   |Create Azure Run As account| Select **No**.  An Azure Run As account in the Automation account is useful for authenticating with Azure; however, managed identities in Automation is now available. [Managed identities](../active-directory/managed-identities-azure-resources/overview.md) provide an identity for applications to use when connecting to resources that support Azure Active Directory (Azure AD) authentication. |

   :::image type="content" source="./media/create-account-portal/add-automation-account-portal.png" alt-text="Required fields for adding the Automation account":::

1. Select **Create** to start the Automation account deployment.

1. When the deployment has completed, click **All Services**.

1. Select **Automation Accounts** and then choose the Automation account you've created.

    ![Automation account overview](./media/create-account-portal/automation-account-overview.png)




## Clean up resources

If you're not going to continue to use the Automation account, delete it with the following steps:

## Next steps

In this quickstart, you’ve deployed an Automation account, started a runbook job, and viewed the job results. To learn more about Azure Automation, continue to the quickstart for creating your first PowerShell runbook.

> [!div class="nextstepaction"]
> [Quickstart - Create an Azure Automation PowerShell runbook](../learn/powershell-runbook-managed-identity.md)

