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

Azure Policy can enforce the creation of an Azure SQL Database or Azure SQL Managed Instance with [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) enabled during provisioning. With this policy in place, any attempts to create a SQL logical server will fail if it is not created with Azure AD-only authentication enabled.

The Azure Policy can be applied to the whole Azure subscription, or just within a resource group.

Two new built-in policies have been introduced in Azure Policy:

- Azure SQL Database should have Azure Active Directory Only Authentication enabled
- Azure SQL Managed Instance should have Azure Active Directory Only Authentication enabled

For more information on Azure Policy, see [What is Azure Policy?](/azure/governance/policy/overview) and [Azure Policy definition structure](/azure/governance/policy/concepts/definition-structure).

## Permissions

For an overview of the permissions needed to manage Azure Policy, see [Azure RBAC permissions in Azure Policy](/azure/governance/policy/overview#azure-rbac-permissions-in-azure-policy).

### Actions

If you are using a custom role to manage Azure Policy, the following [Actions](/azure/role-based-access-control/role-definitions#actions) are needed.

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

There are 3 effects for these policies:

- **Audit** - This is the default setting, and will only capture an audit report in the Azure Policy log
- **Deny** - Prevents server creation without [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) enabled
- **Disabled** - This will make the policy disabled, and will not restrict users from creating creating a server without Azure AD-only authentication enabled

## Limitations

- Currently, you cannot create a SQL logical server in the Azure portal with Azure AD-only authentication enabled. If the Azure Policy for Azure AD-only authentication is enabled, server creation will fail. You can create an Azure SQL logical server with Azure AD-only authentication enabled using The Azure CLI, PowerShell, Rest API, or with an ARM template. For more information, see [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md).
- For more remarks and known issues, see [Azure AD-only authentication](authentication-azure-ad-only-authentication.md#remarks).

## Next steps

> [!div class="nextstepaction"]
> [Using Azure Policy to enforce Azure Active Directory only authentication with Azure SQL](authentication-azure-ad-only-authentication-policy-how-to.md)