---
title: Azure Automation account authentication overview
description: This article provides an overview of Azure Automation account authentication.
keywords: automation security, secure automation; automation authentication
services: automation
ms.subservice: process-automation
ms.date: 09/28/2020
ms.topic: conceptual
---
# Automation account authentication overview

Azure Automation allows you to automate tasks against resources in Azure, on-premises, and with other cloud providers such as Amazon Web Services (AWS). You can use runbooks to automate your tasks, or a Hybrid Runbook Worker if you have business or operational processes to manage outside of Azure. Working in any one of these environments require permissions to securely access the resources with the minimal rights required.

This article covers authentication scenarios supported by Azure Automation and tells how to get started based on the environment or environments that you need to manage.

## Automation account

When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources, runbooks, assets, configurations, from the resources of other accounts. You can use Automation accounts to separate resources into separate logical environments. For example, you might use one account for development, another for production, and another for your on-premises environment. An Azure Automation account is different from your Microsoft account or accounts created in your Azure subscription. For an introduction to creating an Automation account, see [Create an Automation account](automation-quickstart-create-account.md).

## Automation resources

The Automation resources for each Automation account are associated with a single Azure region, but the account can manage all the resources in your Azure subscription. The main reason to create Automation accounts in different regions is if you have policies that require data and resources to be isolated to a specific region.

All tasks that you create against resources using Azure Resource Manager and the PowerShell cmdlets in Azure Automation must authenticate to Azure using Azure Active Directory (Azure AD) organizational identity credential-based authentication.

## Run As accounts

Run As accounts in Azure Automation provide authentication for managing Azure Resource Manager resources or resources deployed on the classic deployment model. There are two types of Run As accounts in Azure Automation:

* Azure Run As account
* Azure Classic Run As account

To learn more about these two deployment models, see [Resource Manager and classic deployment](../azure-resource-manager/management/deployment-models.md).

>[!NOTE]
>Azure Cloud Solution Provider (CSP) subscriptions support only the Azure Resource Manager model. Non-Azure Resource Manager services are not available in the program. When you are using a CSP subscription, the Azure Classic Run As account is not created, but the Azure Run As account is created. To learn more about CSP subscriptions, see [Available services in CSP subscriptions](/azure/cloud-solution-provider/overview/azure-csp-available-services).

### Run As account

The Azure Run As account manages Azure resources based on the Azure Resource Manager deployment and management service for Azure.

When you create a Run As account, it performs the following tasks:

* Creates an Azure AD application with a self-signed certificate, creates a service principal account for the application in Azure AD, and assigns the [Contributor](../role-based-access-control/built-in-roles.md#contributor) role for the account in your current subscription. You can change the certificate setting to Owner or any other role. For more information, see [Role-based access control in Azure Automation](automation-role-based-access-control.md).

* Creates an Automation certificate asset named `AzureRunAsCertificate` in the specified Automation account. The certificate asset holds the certificate private key that the Azure AD application uses.

* Creates an Automation connection asset named `AzureRunAsConnection` in the specified Automation account. The connection asset holds the application ID, tenant ID, subscription ID, and certificate thumbprint.

### Azure Classic Run As Account

The Azure Classic Run As account manages Azure classic resources based on the Classic deployment model. You must be a co-administrator on the subscription to create or renew this type of Run As account.

When you create an Azure Classic Run As account, it performs the following tasks.

* Creates a management certificate in the subscription.

* Creates an Automation certificate asset named `AzureClassicRunAsCertificate` in the specified Automation account. The certificate asset holds the certificate private key used by the management certificate.

* Creates an Automation connection asset named `AzureClassicRunAsConnection` in the specified Automation account. The connection asset holds the subscription name, subscription ID, and certificate asset name.

>[!NOTE]
>Azure Classic Run As account is not created by default at the same time when you create an Automation account. This account is created individually following the steps described in the [Manage Run As account](manage-runas-account.md#create-a-run-as-account-in-azure-portal) article.

## Service principal for Run As account

The service principal for a Run As account does not have permissions to read Azure AD by default. If you want to add permissions to read or manage Azure AD, you must grant the permissions on the service principal under **API permissions**. To learn more, see [Add permissions to access your web API](../active-directory/develop/quickstart-configure-app-access-web-apis.md#add-permissions-to-access-your-web-api).

## Role-based access control

Role-based access control is available with Azure Resource Manager to grant permitted actions to an Azure AD user account and Run As account, and authenticate the service principal. Read [Role-based access control in Azure Automation article](automation-role-based-access-control.md) for further information to help develop your model for managing Automation permissions.

## Runbook authentication with Hybrid Runbook Worker

Runbooks running on a Hybrid Runbook Worker in your datacenter or against computing services in other cloud environments like AWS, cannot use the same method that is typically used for runbooks authenticating to Azure resources. This is because those resources are running outside of Azure and therefore, requires their own security credentials defined in Automation to authenticate to resources that they access locally. For more information about runbook authentication with runbook workers, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

For runbooks that use Hybrid Runbook Workers on Azure VMs, you can use [runbook authentication with managed identities](automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead of Run As accounts to authenticate to your Azure resources.

## Next steps

* To create an Automation account from the Azure portal, see [Create a standalone Azure Automation account](automation-create-standalone-account.md).
* If you prefer to create your account using a template, see [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md).
* For authentication using Amazon Web Services, see [Authenticate runbooks with Amazon Web Services](automation-config-aws-account.md).