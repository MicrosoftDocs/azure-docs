---
title: Intro to authentication in Azure Automation
description: This article provides an overview of Automation security and the different authentication methods available for Automation Accounts in Azure Automation.
keywords: automation security, secure automation; automation authentication
services: automation
ms.subservice: process-automation
ms.date: 04/23/2020
ms.topic: conceptual
---

# Introduction to authentication in Azure Automation

Azure Automation allows you to automate tasks against resources in Azure, on-premises, and with other cloud providers such as Amazon Web Services (AWS). In order for a runbook to perform its required actions, it must have permissions to securely access the resources with the minimal rights required within the subscription.

This article will cover the various authentication scenarios supported by Azure Automation and how to get started based on the environment or environments you need to manage.  

## Automation Account overview

When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources (runbooks, assets, configurations) from the resources contained in other Automation accounts. You can use Automation accounts to separate resources into separate logical environments. For example, you might use one account for development, another for production, and another for your on-premises environment. An Azure Automation account is different from your Microsoft account or accounts created in your Azure subscription.

The Automation resources for each Automation account are associated with a single Azure region, but Automation accounts can manage all the resources in your subscription. The main reason to create Automation accounts in different regions would be if you have policies that require data and resources to be isolated to a specific region.

All of the tasks that you perform against resources using Azure Resource Manager and the Azure cmdlets in Azure Automation must authenticate to Azure using Azure Active Directory organizational identity credential-based authentication. Run As accounts in Azure Automation provide authentication for managing resources in Azure using the Azure cmdlets. When you create a Run As account, it creates a new service principal user in Azure Active Directory (AD) and assigns the Contributor role to this user at the subscription level. For runbooks that use Hybrid Runbook Workers on Azure virtual machines, you can use [runbook authentication with managed identities](automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead of Run As accounts to authenticate to your Azure resources.

The service principal for a Run as Account does not have permissions to read Azure AD by default. If you want to add permissions to read or manage Azure AD, you'll need to grant the permissions on the service principal under **API permissions**. To learn more, see [Add permissions to access web APIs](../active-directory/develop/quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

Role-based access control is available with Azure Resource Manager to grant permitted actions to an Azure AD user account and Run As account, and authenticate that service principal. Read [Role-based access control in Azure Automation article](automation-role-based-access-control.md) for further information to help develop your model for managing Automation permissions.  

Runbooks running on a Hybrid Runbook Worker in your data center or against computing services in other cloud environments like AWS, cannot use the same method that is typically used for runbooks authenticating to Azure resources. This is because those resources are running outside of Azure and therefore, requires their own security credentials defined in Automation to authenticate to resources that they access locally. For more information about runbook authentication with runbook workers, see [Authenticate runbooks for Hybrid Runbook Workers](automation-hrw-run-runbooks.md). 

## Next steps

* [Create an Automation account from the Azure portal](automation-create-standalone-account.md).

* [Create an Automation account using Azure Resource Manager template](automation-create-account-template.md).

* [Authenticate with Amazon Web Services (AWS)](automation-config-aws-account.md).
