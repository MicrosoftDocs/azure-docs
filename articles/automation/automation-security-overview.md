<properties
   pageTitle="Azure Automation Security"
   description="This article provides an overview of automation security and the different authentication methods available for Automation Accounts in Azure Automation."
   services="automation"
   documentationCenter=""
   authors="MGoedtel"
   manager="jwhit"
   editor="tysonn"
   keywords="automation security, secure automation" />
<tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/26/2016"
   ms.author="magoedte" />

# Azure Automation security
Azure Automation allows you to automate tasks against resources in Azure, on-premises, and with other cloud providers such as Amazon Web Services (AWS).  In order for a runbook to perform its required actions, it must have permissions to securely access the resources with the minimal rights required within the subscription.  
This article will cover the various authentication scenarios supported by Azure Automation and will show you how to get started based on the environment or environments you need to manage.  

## Automation Account overview
When you start Azure Automation for the first time, you must create at least one Automation account. Automation accounts allow you to isolate your Automation resources (runbooks, assets, configurations) from the resources contained in other Automation accounts. You can use Automation accounts to separate resources into separate logical environments. For example, you might use one account for development, another for production, and another for your on-premises environment.  An Azure Automation account is different from your Microsoft account or accounts created in your Azure subscription.

The Automation resources for each Automation account are associated with a single Azure region, but Automation accounts can manage resources in any region. The main reason to create Automation accounts in different regions would be if you have policies that require data and resources to be isolated to a specific region.

>[AZURE.NOTE]Automation accounts, and the resources they contain that are created in the Azure portal, cannot be accessed in the Azure classic portal. If you want to manage these accounts or their resources with Windows PowerShell, you must use the Azure Resource Manager modules.

All of the tasks that you perform against resources using Azure Resource Manager (ARM) and the Azure cmdlets in Azure Automation must authenticate to Azure using Azure Active Directory organizational identity credential-based authentication.  Certificate-based  authentication was the original authentication method with Azure Service Management (ASM) mode, but it was complicated to setup.  Authenticating to Azure with Azure AD user was introduced back in 2014 to not only simplify the process to configure an Authentication account, but also support the ability to non-interactively authenticate to Azure with a single user account that worked with both ASM and ARM mode.   

We recently released another update, where we now automatically create an Azure AD service principal object and clasic Run As account when the Automation account is created. This is the default authentication method for runbook automation with Azure Resource Manager, and optional for Azure Service Management and classic resources.     

Role-based access control is available in ARM mode to grant permitted actions to an Azure AD user account and service principal, and authenticate that service principal.  Please read [Role-based access control in Azure Automation article](../automation/automation-role-based-access-control.md) for further information to help develop your model for managing Automation permissions.  

Runbooks running on a Hybrid Runbook Worker in your datacenter or against computing services in AWS cannot use the same method that is typically used for runbooks authenticating to Azure resources.  This is because those resources are running outside of Azure and therefore, will require their own security credentials defined in Automation to authenticate to resources that they will access locally.  

## Authentication methods

The following table summarizes the different authentication methods for each environment supported by Azure Automation and the article describing how to setup authentication for your runbooks.

Method  |  Environment  | Article
----------|----------|----------
Azure AD User Account | Azure Resource Manager and Azure Service Management | [Authenticate Runbooks with Azure AD User account](../automation/automation-sec-configure-aduser-account.md)
Azure AD Service Principal object | Azure Resource Manager | [Authenticate Runbooks with Azure Run As account](../automation/automation-sec-configure-azure-runas-account.md)
Azure classic Run As Account | Azure Service Management | [Authenticate Runbooks with Azure Run As account](../automation/automation-sec-configure-azure-runas-account.md)
Windows Authentication | On-Premises Datacenter | [Authenticate Runbooks for Hybrid Runbook Workers](../automation/automation-hybrid-runbook-worker.md)
AWS Credentials | Amazon Web Services | [Authenticate Runbooks with Amazon Web Services (AWS)](../automation/automation-sec-configure-aws-account.md)



