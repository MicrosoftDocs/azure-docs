---
title: Azure Automation account authentication overview
description: This article provides an overview of Azure Automation account authentication.
keywords: automation security, secure automation; automation authentication
services: automation
ms.subservice: process-automation
ms.date: 04/23/2020
ms.topic: conceptual
---
# Automation account authentication overview

Azure Automation allows you to automate tasks against resources in Azure, on-premises, and with other cloud providers such as Amazon Web Services (AWS). You can use runbooks to automate your tasks, or a Hybrid Runbook Worker if you have non-Azure tasks to manage. Either environment requires permissions to securely access the resources with the minimal rights required within the Azure subscription.

This article covers authentication scenarios supported by Azure Automation and tells how to get started based on the environment or environments that you need to manage.

## Automation account 

When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources, runbooks, assets, configurations, from the resources of other accounts. You can use Automation accounts to separate resources into separate logical environments. For example, you might use one account for development, another for production, and another for your on-premises environment. An Azure Automation account is different from your Microsoft account or accounts created in your Azure subscription. For an introduction to creating an Automation account, see [Create an Automation account](automation-quickstart-create-account.md).

## Automation resources

The Automation resources for each Automation account are associated with a single Azure region, but the account can manage all the resources in your Azure subscription. The main reason to create Automation accounts in different regions is if you have policies that require data and resources to be isolated to a specific region.

All tasks that you create against resources using Azure Resource Manager and the PowerShell cmdlets in Azure Automation must authenticate to Azure using Azure Active Directory (Azure AD) organizational identity credential-based authentication. 

## Run As account

Run As accounts in Azure Automation provide authentication for managing Azure resources using PowerShell cmdlets. When you create a Run As account, it creates a new service principal user in Azure AD and assigns the Contributor role to this user at the subscription level. For runbooks that use Hybrid Runbook Workers on Azure VMs, you can use [runbook authentication with managed identities](automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead of Run As accounts to authenticate to your Azure resources.

## Service principal for Run As account

The service principal for a Run As account does not have permissions to read Azure AD by default. If you want to add permissions to read or manage Azure AD, you must grant the permissions on the service principal under **API permissions**. To learn more, see [Add permissions to access web APIs](../active-directory/develop/quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

## Role-based access control

Role-based access control is available with Azure Resource Manager to grant permitted actions to an Azure AD user account and Run As account, and authenticate the service principal. Read [Role-based access control in Azure Automation article](automation-role-based-access-control.md) for further information to help develop your model for managing Automation permissions.  

## Runbook authentication with Hybrid Runbook Worker 

Runbooks running on a Hybrid Runbook Worker in your datacenter or against computing services in other cloud environments like AWS, cannot use the same method that is typically used for runbooks authenticating to Azure resources. This is because those resources are running outside of Azure and therefore, requires their own security credentials defined in Automation to authenticate to resources that they access locally. For more information about runbook authentication with runbook workers, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md). 

## Next steps

* To create an Automation account from the Azure portal, see [Create a standalone Azure Automation account](automation-create-standalone-account.md).
* If you prefer to create your account using a template, see [Create an Automation account using an Azure Resource Manager template](automation-create-account-template.md).
* For authentication using Amazon Web Services, see [Authenticate runbooks with Amazon Web Services](automation-config-aws-account.md).