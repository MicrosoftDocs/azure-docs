---
title: Azure Automation account authentication overview
description: This article provides an overview of Azure Automation account authentication.
keywords: automation security, secure automation; automation authentication
services: automation
ms.subservice: process-automation
ms.date: 10/04/2023
ms.topic: conceptual 
ms.custom:
---

# Azure Automation account authentication overview

> [!IMPORTANT]
> Azure Automation Run as accounts, including  Classic Run as accounts have retired on **30 September 2023** and replaced with [Managed Identities](automation-security-overview.md#managed-identities). You would no longer be able to create or renew Run as accounts through the Azure portal. For more information, see [migrating from an existing Run As accounts to managed identity](migrate-run-as-accounts-managed-identity.md?tabs=run-as-account#sample-scripts).

Azure Automation allows you to automate tasks against resources in Azure, on-premises, and with other cloud providers such as Amazon Web Services (AWS). You can use runbooks to automate your tasks, or a Hybrid Runbook Worker if you have business or operational processes to manage outside of Azure. Working in any one of these environments require permissions to securely access the resources with the minimal rights required.

This article covers authentication scenarios supported by Azure Automation and tells how to get started based on the environment or environments that you need to manage.


## Automation account

When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources, runbooks, assets, and configurations from the resources of other accounts. You can use Automation accounts to separate resources into separate logical environments or delegated responsibilities. For example, you might use one account for development, another for production, and another for your on-premises environment. Or you might dedicate an Automation account to manage operating system updates across all of your machines with [Update Management](update-management/overview.md).

An Azure Automation account is different from your Microsoft account or accounts created in your Azure subscription. For an introduction to creating an Automation account, see [Create an Automation account](./quickstarts/create-azure-automation-account-portal.md).

## Automation resources

The Automation resources for each Automation account are associated with a single Azure region, but the account can manage all the resources in your Azure subscription. The main reason to create Automation accounts in different regions is if you have policies that require data and resources to be isolated to a specific region.

All tasks that you create against resources using Azure Resource Manager and the PowerShell cmdlets in Azure Automation must authenticate to Azure using Azure Active Directory (Azure AD) organizational identity credential-based authentication.

## Managed identities

A managed identity from Azure Active Directory (Azure AD) allows your runbook to easily access other Azure AD-protected resources. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. For more information about managed identities in Azure AD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Managed identities are the recommended way to authenticate in your runbooks, and is the default authentication method for your Automation account.

Here are some of the benefits of using managed identities:

- Using a managed identity instead of the Automation Run As account simplifies management. 
- Managed identities can be used without any additional cost.

- You don't have to specify the Run As connection object in your runbook code. You can access resources using your Automation account's managed identity from a runbook without creating certificates, connections, etc.

An Automation account can authenticate using two types of managed identities:

- A system-assigned identity is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.

- A user-assigned identity is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities.

> [!NOTE]
> User-assigned identities are supported for cloud jobs only. To learn more about the different managed identities, see [Manage identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

For details on using managed identities, see [Enable managed identity for Azure Automation](enable-managed-identity-for-automation.md).

### Subscription permissions

You need the `Microsoft.Authorization/*/Write` permission. This permission is obtained through membership of one of the following Azure built-in roles:

- [Owner](../role-based-access-control/built-in-roles.md#owner)
- [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)

To learn more about classic subscription permissions, see [Azure classic subscription administrators](../role-based-access-control/classic-administrators.md#add-a-co-administrator).

### Azure AD permissions

To renew the service principal, you need to be a member of one of the following Azure AD built-in roles:

- [Application Administrator](../active-directory/roles/permissions-reference.md#application-administrator)
- [Application Developer](../active-directory/roles/permissions-reference.md#application-developer)

Membership can be assigned to **ALL** users in the tenant at the directory level, which is the default behavior. You can grant membership to either role at the directory level. For more information, see [Who has permission to add applications to my Azure AD instance?](../active-directory/develop/how-applications-are-added.md#who-has-permission-to-add-applications-to-my-azure-ad-instance).

### Automation account permissions

To update the Automation account, you need to be a member of one of the following Automation account roles:

- [Owner](./automation-role-based-access-control.md#owner)
- [Contributor](./automation-role-based-access-control.md#contributor)

To learn more about the Azure Resource Manager and Classic deployment models, see [Resource Manager and classic deployment](../azure-resource-manager/management/deployment-models.md).

>[!NOTE]
>Azure Cloud Solution Provider (CSP) subscriptions support only the Azure Resource Manager model. Non-Azure Resource Manager services are not available in the program. When you are using a CSP subscription, the Azure Classic Run As account is not created, but the Azure Run As account is created. To learn more about CSP subscriptions, see [Available services in CSP subscriptions](/azure/cloud-solution-provider/overview/azure-csp-available-services).

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWwtF3]

## Role-based access control

Role-based access control is available with Azure Resource Manager to grant permitted actions to an Azure AD user account and Run As account, and authenticate the service principal. Read [Role-based access control in Azure Automation article](automation-role-based-access-control.md) for further information to help develop your model for managing Automation permissions.

If you have strict security controls for permission assignment in resource groups, you need to assign the Run As account membership to the **Contributor** role in the resource group.

> [!NOTE]
> We recommend you don't use the **Log Analytics Contributor** role to execute Automation jobs. Instead, create the Azure Automation Contributor custom role and use it for actions related to the Automation account.

## Runbook authentication with Hybrid Runbook Worker

Runbooks running on a Hybrid Runbook Worker in your datacenter or against computing services in other cloud environments like AWS, can't use the same method that is typically used for runbooks authenticating to Azure resources. This is because those resources are running outside of Azure and therefore, requires their own security credentials defined in Automation to authenticate to resources that they access locally. For more information about runbook authentication with runbook workers, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

For runbooks that use Hybrid Runbook Workers on Azure VMs, you can use [runbook authentication with managed identities](automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead of Run As accounts to authenticate to your Azure resources.

## Next steps

* To create an Automation account from the Azure portal, see [Create a standalone Azure Automation account](automation-create-standalone-account.md).
* If you prefer to create your account using a template, see [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md).
* For authentication using Amazon Web Services, see [Authenticate runbooks with Amazon Web Services](automation-config-aws-account.md).
* For a list of Azure services that support the managed identities for Azure resources feature, see [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).
