---
title: Using Azure Policy to enforce Azure Active Directory only authentication
description: This article guides you through using Azure Policy to enforce Azure Active Directory (Azure AD) only authentication with Azure SQL Database and Azure SQL Managed Instance
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
ms.service: sql-db-mi
ms.subservice: security
ms.topic: how-to
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 09/22/2021
---

# Using Azure Policy to enforce Azure Active Directory only authentication with Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!NOTE]
> The **Azure AD-only authentication** and associated Azure Policy feature discussed in this article is in **public preview**. 

This article guides you through creating an Azure Policy that would enforce Azure AD-only authentication when users create an Azure SQL Managed Instance, or a [logical server](logical-servers.md) for Azure SQL Database. To learn more about Azure AD-only authentication during resource creation, see [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md).

In this article, you learn how to:

> [!div class="checklist"]
> - Create an Azure Policy that enforces logical server or managed instance creation with [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) enabled
> - Check Azure Policy compliance

## Prerequisite

- Have permissions to manage Azure Policy. For more information, see [Azure RBAC permissions in Azure Policy](../../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy).

## Create an Azure Policy

Start off by creating an Azure Policy enforcing SQL Database or Managed Instance provisioning with Azure AD-only authentication enabled.

1. Go to the [Azure portal](https://portal.azure.com).
1. Search for the service **Policy**.
1. Under the Authoring settings, select **Definitions**.
1. In the **Search** box, search for *Azure Active Directory only authentication*.

   There are two built-in policies available to enforce Azure AD-only authentication. One is for SQL Database, and the other is for Managed Instance.

   - Azure SQL Database should have Azure Active Directory Only Authentication enabled
   - Azure SQL Managed Instance should have Azure Active Directory Only Authentication enabled

   :::image type="content" source="media/authentication-azure-ad-only-authentication-policy/policy-azure-ad-only-authentication.png" alt-text="Screenshot of Azure Policy for Azure AD-only authentication":::

1. Select the policy name for your service. In this example, we'll use Azure SQL Database. Select **Azure SQL Database should have Azure Active Directory Only Authentication enabled**.
1. Select **Assign** in the new menu.

   > [!NOTE]
   > The JSON script in the menu shows the built-in policy definition that can be used as a template to build a custom Azure Policy for SQL Database. The default is set to `Audit`.

   :::image type="content" source="media/authentication-azure-ad-only-authentication-policy/assign-policy-azure-ad-only-authentication.png" alt-text="Screenshot of assigning Azure Policy for Azure AD-only authentication":::

1. In the **Basics** tab, add a **Scope** by using the selector (**...**) on the side of the box.

   :::image type="content" source="media/authentication-azure-ad-only-authentication-policy/selecting-scope-policy-azure-ad-only-authentication.png" alt-text="Screenshot of selecting Azure Policy scope for Azure AD-only authentication":::

1. in the **Scope** pane, select your **Subscription** from the drop-down menu, and select a **Resource Group** for this policy. Once you're done, use the **Select** button to save the selection.

   > [!NOTE]
   > If you do not select a resource group, the policy will apply to the whole subscription.

   :::image type="content" source="media/authentication-azure-ad-only-authentication-policy/adding-scope-policy-azure-ad-only-authentication.png" alt-text="Screenshot of adding Azure Policy scope for Azure AD-only authentication":::

1. Once you're back on the **Basics** tab, customize the **Assignment name** and provide an optional **Description**. Make sure the **Policy enforcement** is **Enabled**.
1. Go over to the **Parameters** tab. Unselect the option **Only show parameters that require input**.
1. Under **Effect**, select **Deny**. This setting will prevent a logical server creation without Azure AD-only authentication enabled.

   :::image type="content" source="media/authentication-azure-ad-only-authentication-policy/deny-policy-azure-ad-only-authentication.png" alt-text="Screenshot of  Azure Policy effect parameter for Azure AD-only authentication":::

1. In the **Non-compliance messages** tab, you can customize the policy message that displays if a violation of the policy has occurred. The message will let users know what policy was enforced during server creation.

   :::image type="content" source="media/authentication-azure-ad-only-authentication-policy/non-compliance-message-policy-azure-ad-only-authentication.png" alt-text="Screenshot of Azure Policy non-compliance message for Azure AD-only authentication":::

1. Select **Review + create**. Review the policy and select the **Create** button.

> [!NOTE]
> It may take some time for the newly created policy to be enforced.

## Check policy compliance

You can check the **Compliance** setting under the **Policy** service to see the compliance state.

Search for the assignment name that you have given earlier to the policy.

:::image type="content" source="media/authentication-azure-ad-only-authentication-policy/compliance-policy-azure-ad-only-authentication.png" alt-text="Screenshot of Azure Policy compliance for Azure AD-only authentication":::

Once the logical server is created with Azure AD-only authentication, the policy report will increase the counter under the **Resources by compliance state** visual. You'll be able to see which resources are compliant, or non-compliant.

If the resource group that the policy was chosen to cover contains already created servers, the policy report will indicate those resources that are compliant and non-compliant.

> [!NOTE]
> Updating the compliance report may take some time. Changes related to resource creation or Azure AD-only authentication settings are not reported immediately.    

## Provision a server

You can then try to provision a logical server or managed instance in the resource group that you assigned the Azure Policy. If Azure AD-only authentication is enabled during server creation, the provision will succeed. When Azure AD-only authentication isn't enabled, the provision will fail.

For more information, see [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md).

## Next steps

- Overview of [Azure Policy for Azure AD-only authentication](authentication-azure-ad-only-authentication-policy.md)
- [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md)
- Overview of [Azure AD-only authentication](authentication-azure-ad-only-authentication.md)