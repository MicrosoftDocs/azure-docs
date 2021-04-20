---
title: Azure Automation account authentication overview
description: This article provides an overview of Azure Automation account authentication.
keywords: automation security, secure automation; automation authentication
services: automation
ms.subservice: process-automation
ms.date: 04/14/2021
ms.topic: conceptual
---

# Azure Automation account authentication overview

Azure Automation allows you to automate tasks against resources in Azure, on-premises, and with other cloud providers such as Amazon Web Services (AWS). You can use runbooks to automate your tasks, or a Hybrid Runbook Worker if you have business or operational processes to manage outside of Azure. Working in any one of these environments require permissions to securely access the resources with the minimal rights required.

This article covers authentication scenarios supported by Azure Automation and tells how to get started based on the environment or environments that you need to manage.

## Automation account

When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources, runbooks, assets, and configurations from the resources of other accounts. You can use Automation accounts to separate resources into separate logical environments or delegated responsibilities. For example, you might use one account for development, another for production, and another for your on-premises environment. Or you might dedicate an Automation account to manage operating system updates across all of your machines with [Update Management](update-management/overview.md). 

An Azure Automation account is different from your Microsoft account or accounts created in your Azure subscription. For an introduction to creating an Automation account, see [Create an Automation account](automation-quickstart-create-account.md).

## Automation resources

The Automation resources for each Automation account are associated with a single Azure region, but the account can manage all the resources in your Azure subscription. The main reason to create Automation accounts in different regions is if you have policies that require data and resources to be isolated to a specific region.

All tasks that you create against resources using Azure Resource Manager and the PowerShell cmdlets in Azure Automation must authenticate to Azure using Azure Active Directory (Azure AD) organizational identity credential-based authentication.

## Managed identities (preview)

A managed identity from Azure Active Directory (Azure AD) allows your runbook to easily access other Azure AD-protected resources. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more information about managed identities in Azure AD, see [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview).

Here are some of the benefits of using managed identities:

- You can use managed identities to authenticate to any Azure service that supports Azure AD authentication. They can be used for cloud as well as hybrid jobs. Hybrid jobs can use managed identities when run on a Hybrid Runbook Worker that's running on an Azure or non-Azure VM.

- Managed identities can be used without any additional cost.

- You don’t have to renew the certificate used by the Automation Run As account.

- You don't have to specify the Run As connection object in your runbook code. You can access resources using your Automation account's managed identity from a runbook without creating certificates, connections, Run As accounts, etc.

An Automation account can be granted two types of identities:

- A system-assigned identity is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.

- A user-assigned identity is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities.

>[!NOTE]
> User assigned identities are not supported yet.

For details on using managed identities, see [Enable managed identity for Azure Automation (preview)](enable-managed-identity-for-automation.md).

## Run As accounts

Run As accounts in Azure Automation provide authentication for managing Azure Resource Manager resources or resources deployed on the classic deployment model. There are two types of Run As accounts in Azure Automation:

* Azure Run As account: Allows you to manage Azure resources based on the Azure Resource Manager deployment and management service for Azure.
* Azure Classic Run As account: Allows you to manage Azure classic resources based on the Classic deployment model.

To learn more about the Azure Resource Manager and Classic deployment models, see [Resource Manager and classic deployment](../azure-resource-manager/management/deployment-models.md).

>[!NOTE]
>Azure Cloud Solution Provider (CSP) subscriptions support only the Azure Resource Manager model. Non-Azure Resource Manager services are not available in the program. When you are using a CSP subscription, the Azure Classic Run As account is not created, but the Azure Run As account is created. To learn more about CSP subscriptions, see [Available services in CSP subscriptions](/azure/cloud-solution-provider/overview/azure-csp-available-services).

When you create an Automation account, the Run As account is created by default at the same time. If you chose not to create it along with the Automation account, it can be created individually at a later time. An Azure Classic Run As Account is optional, and is created separately if you need to manage classic resources.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWwtF3]

### Run As account

When you create a Run As account, it performs the following tasks:

* Creates an Azure AD application with a self-signed certificate, creates a service principal account for the application in Azure AD, and assigns the [Contributor](../role-based-access-control/built-in-roles.md#contributor) role for the account in your current subscription. You can change the certificate setting to [Reader](../role-based-access-control/built-in-roles.md#reader) or any other role. For more information, see [Role-based access control in Azure Automation](automation-role-based-access-control.md).

* Creates an Automation certificate asset named `AzureRunAsCertificate` in the specified Automation account. The certificate asset holds the certificate private key that the Azure AD application uses.

* Creates an Automation connection asset named `AzureRunAsConnection` in the specified Automation account. The connection asset holds the application ID, tenant ID, subscription ID, and certificate thumbprint.

### Azure Classic Run As account

When you create an Azure Classic Run As account, it performs the following tasks:

> [!NOTE]
> You must be a co-administrator on the subscription to create or renew this type of Run As account.

* Creates a management certificate in the subscription.

* Creates an Automation certificate asset named `AzureClassicRunAsCertificate` in the specified Automation account. The certificate asset holds the certificate private key used by the management certificate.

* Creates an Automation connection asset named `AzureClassicRunAsConnection` in the specified Automation account. The connection asset holds the subscription name, subscription ID, and certificate asset name.

## Service principal for Run As account

The service principal for a Run As account does not have permissions to read Azure AD by default. If you want to add permissions to read or manage Azure AD, you must grant the permissions on the service principal under **API permissions**. To learn more, see [Add permissions to access your web API](../active-directory/develop/quickstart-configure-app-access-web-apis.md#add-permissions-to-access-your-web-api).

## <a name="permissions"></a>Run As account permissions

This section defines permissions for both regular Run As accounts and Classic Run As accounts.

* To create or update a Run As account, an Application administrator in Azure Active Directory and an Owner in the subscription can complete all the tasks.
* To configure or renew Classic Run As accounts, you must have the Co-administrator role at the subscription level. To learn more about classic subscription permissions, see [Azure classic subscription administrators](../role-based-access-control/classic-administrators.md#add-a-co-administrator).

In a situation where you have separation of duties, the following table shows a listing of the tasks, the equivalent cmdlet, and permissions needed:

|Task|Cmdlet  |Minimum Permissions  |Where you set the permissions|
|---|---------|---------|---|
|Create Azure AD Application|[New-AzADApplication](/powershell/module/az.resources/new-azadapplication)     | Application Developer role<sup>1</sup>        |[Azure AD](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app)</br>Home > Azure AD > App Registrations |
|Add a credential to the application.|[New-AzADAppCredential](/powershell/module/az.resources/new-azadappcredential)     | Application Administrator or Global Administrator<sup>1</sup>         |[Azure AD](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app)</br>Home > Azure AD > App Registrations|
|Create and get an Azure AD service principal|[New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal)</br>[Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal)     | Application Administrator or Global Administrator<sup>1</sup>        |[Azure AD](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app)</br>Home > Azure AD > App Registrations|
|Assign or get the Azure role for the specified principal|[New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment)</br>[Get-AzRoleAssignment](/powershell/module/Az.Resources/Get-AzRoleAssignment)      | User Access Administrator or Owner, or have the following permissions:</br></br><code>Microsoft.Authorization/Operations/read</br>Microsoft.Authorization/permissions/read</br>Microsoft.Authorization/roleDefinitions/read</br>Microsoft.Authorization/roleAssignments/write</br>Microsoft.Authorization/roleAssignments/read</br>Microsoft.Authorization/roleAssignments/delete</code></br></br> | [Subscription](../role-based-access-control/role-assignments-portal.md)</br>Home > Subscriptions > \<subscription name\> - Access Control (IAM)|
|Create or remove an Automation certificate|[New-AzAutomationCertificate](/powershell/module/Az.Automation/New-AzAutomationCertificate)</br>[Remove-AzAutomationCertificate](/powershell/module/az.automation/remove-azautomationcertificate)     | Contributor on resource group         |Automation account resource group|
|Create or remove an Automation connection|[New-AzAutomationConnection](/powershell/module/az.automation/new-azautomationconnection)</br>[Remove-AzAutomationConnection](/powershell/module/az.automation/remove-azautomationconnection)|Contributor on resource group |Automation account resource group|

<sup>1</sup> Non-administrator users in your Azure AD tenant can [register AD applications](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app) if the Azure AD tenant's **Users can register applications** option on the **User settings** page is set to **Yes**. If the application registration setting is **No**, the user performing this action must be as defined in this table.

If you aren't a member of the subscription's Active Directory instance before you're added to the Global Administrator role of the subscription, you're added as a guest. In this situation, you receive a `You do not have permissions to create…` warning on the **Add Automation account** page.

To verify that the situation producing the error message has been remedied:

1. From the Azure Active Directory pane in the Azure portal, select **Users and groups**.
2. Select **All users**.
3. Choose your name, then select **Profile**.
4. Ensure that the value of the **User type** attribute under your user's profile is not set to **Guest**.

## Role-based access control

Role-based access control is available with Azure Resource Manager to grant permitted actions to an Azure AD user account and Run As account, and authenticate the service principal. Read [Role-based access control in Azure Automation article](automation-role-based-access-control.md) for further information to help develop your model for managing Automation permissions.

If you have strict security controls for permission assignment in resource groups, you need to assign the Run As account membership to the **Contributor** role in the resource group.

## Runbook authentication with Hybrid Runbook Worker

Runbooks running on a Hybrid Runbook Worker in your datacenter or against computing services in other cloud environments like AWS, cannot use the same method that is typically used for runbooks authenticating to Azure resources. This is because those resources are running outside of Azure and therefore, requires their own security credentials defined in Automation to authenticate to resources that they access locally. For more information about runbook authentication with runbook workers, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

For runbooks that use Hybrid Runbook Workers on Azure VMs, you can use [runbook authentication with managed identities](automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead of Run As accounts to authenticate to your Azure resources.

## Next steps

* To create an Automation account from the Azure portal, see [Create a standalone Azure Automation account](automation-create-standalone-account.md).
* If you prefer to create your account using a template, see [Create an Automation account using an Azure Resource Manager template](quickstart-create-automation-account-template.md).
* For authentication using Amazon Web Services, see [Authenticate runbooks with Amazon Web Services](automation-config-aws-account.md).
* For a list of Azure services that support the managed identities for Azure resources feature, see [Services that support managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities).
