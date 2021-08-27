---
title: Azure Policy for Azure Active Directory only authentication
description: This article provides information on how to enforce an Azure policy to create an Azure SQL Database or Azure SQL Managed Instance with Azure Active Directory (Azure AD) only authentication enabled
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 08/31/2021
---

# Azure Policy for Azure Active Directory only authentication with Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!NOTE]
> The **Azure AD-only authentication** feature discussed in this article is in **public preview**. 

Azure Policy can enforce the creation of an Azure SQL Database or Azure SQL Managed Instance with [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) enabled during provisioning. With this policy in place, any attempts to create a SQL logical server will fail if it isn't created with Azure AD-only authentication enabled.

The Azure Policy can be applied to the whole Azure subscription, or just within a resource group.

Two new built-in policies have been introduced in Azure Policy:

- Azure SQL Database should have Azure Active Directory Only Authentication enabled
- Azure SQL Managed Instance should have Azure Active Directory Only Authentication enabled

For more information on Azure Policy, see [What is Azure Policy?](/azure/governance/policy/overview) and [Azure Policy definition structure](/azure/governance/policy/concepts/definition-structure).

## Permissions

For an overview of the permissions needed to manage Azure Policy, see [Azure RBAC permissions in Azure Policy](/azure/governance/policy/overview#azure-rbac-permissions-in-azure-policy).

### Actions

If you're using a custom role to manage Azure Policy, the following [Actions](/azure/role-based-access-control/role-definitions#actions) are needed.

- */read
- Microsoft.Authorization/policyassignments/*
- Microsoft.Authorization/policydefinitions/*
- Microsoft.Authorization/policyexemptions/*
- Microsoft.Authorization/policysetdefinitions/*
- Microsoft.PolicyInsights/*

For more information on custom roles, see [Azure custom roles](/azure/role-based-access-control/custom-roles).

## Manage Azure Policy for Azure AD-only authentication

The Azure AD-only authentication policies can be managed by going to the [Azure portal](https://portal.azure.com), and searching for the **Policy** service. Under **Definitions**, search for *Azure Active Directory only authentication*.

:::image type="content" source="media/authentication-azure-ad-only-authentication-policy/policy-azure-ad-only-authentication.png" alt-text="Screenshot of Azure Policy for Azure AD-only authentication":::

For a guide on how to add an Azure Policy for Azure AD-only authentication, see [Using Azure Policy to enforce Azure Active Directory only authentication with Azure SQL](authentication-azure-ad-only-authentication-policy-how-to.md).

There are three effects for these policies:

- **Audit** - The default setting, and will only capture an audit report in the Azure Policy activity logs
- **Deny** - Prevents logical server creation without [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) enabled
- **Disabled** - Will disable the policy, and won't restrict users from creating a logical server without Azure AD-only authentication enabled

If the Azure Policy for Azure AD-only authentication is set to **Deny**, Azure SQL logical server creation will fail. The details of this failure will be recorded in the **Activity log** of the resource group.

## Policy compliance

You can view the **Compliance** setting under the **Policy** service to see the compliance state. The **Compliance state** will tell you whether the server is currently in compliance with having Azure AD-only authentication enabled. 

The Azure Policy can prevent a new SQL logical server from being created without having Azure AD-only authentication enabled, but the feature can be changed after server creation. If a user has disabled Azure AD-only authentication after the server was created, the compliance state will be `Non-compliant` if the Azure Policy is set to **Deny**.

:::image type="content" source="media/authentication-azure-ad-only-authentication-policy/check-compliance-policy-azure-ad-only-authentication.png" alt-text="Screenshot of Azure Policy Compliance menu for Azure AD-only authentication":::

## Limitations

- Currently, you can't create a SQL logical server in the Azure portal with Azure AD-only authentication enabled. You can create a SQL logical server with Azure AD-only authentication enabled using The Azure CLI, PowerShell, Rest API, or with an ARM template. For more information, see [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md).
- For more remarks and known issues, see [Azure AD-only authentication](authentication-azure-ad-only-authentication.md#remarks).

## Next steps

> [!div class="nextstepaction"]
> [Using Azure Policy to enforce Azure Active Directory only authentication with Azure SQL](authentication-azure-ad-only-authentication-policy-how-to.md)