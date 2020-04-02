---
title: Manage Office 365 services using Azure Automation
description: Tells how to use Azure Automation to manage Office 365 subscription services.
services: automation
ms.date: 04/01/2020
ms.topic: conceptual
---

# Manage Office 365 services using Azure Automation

You can use Azure Automation for management of Office 365 subscription services, for products such as Microsoft Word and Microsoft Outlook. Interactions with Office 365 are enabled by [Azure Active Directory (Azure AD)](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis). See [Use Azure AD in Azure Automation to authenticate to Azure](automation-use-azure-ad.md).

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). For your Automation account, you can update your modules to the latest version using [How to update Azure PowerShell modules in Azure Automation](automation-update-azure-modules.md).

## Prerequisites

You need the following to manage Office 365 subscription services in Azure Automation.

* An Azure subscription. See [Subscription decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/subscriptions/).
* An Automation object in Azure to hold the user account credentials and runbooks. See [An introduction to Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro).
* Azure AD. See [Use Azure AD in Azure Automation to authenticate to Azure](automation-use-azure-ad.md).
* An Office 365 tenant, with an account. See [Set up your Office 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant).

## Installing the MSOnline and MSOnlineExt modules

Use of Office 365 within Azure Automation requires Microsoft Azure Active Directory for Windows PowerShell (`MSOnline` module). You'll also need the module [`MSOnlineExt`](https://www.powershellgallery.com/packages/MSOnlineExt/1.0.35), which simplifies Azure AD management in single- and multi-tenant environments. Install the modules as described in [Use Azure AD in Azure Automation to authenticate to Azure](automation-use-azure-ad.md).

>[!NOTE]
>To use MSOnline PowerShell, you must be a member of Azure AD. Guest users can't use the module.

## Creating an Azure Automation account

To complete the steps in this article, you need an account in Azure Automation. See [Create an Azure Automation account](automation-quickstart-create-account.md).
 
## Adding MSOnline and MSOnlineExt as assets

Now add the installed MSOnline and MSOnlineExt modules to enable Office 365 functionality. Refer to [Manage modules in Azure Automation](shared-resources/modules.md).

1. In the Azure portal, select **Automation Accounts**.
2. Choose your Automation account.
3. Select **Modules Gallery** under **Shared Resources**.
4. Search for MSOnline.
5. Select the `MSOnline` PowerShell module and click **Import** to import the module as an asset.
6. Repeat steps 4 and 5 to locate and import the `MSOnlineExt` module. 

## Creating a credential asset (optional)

It's optional to create a credential asset for the Office 365 administrative user who has permissions to run your script. It can help, though, to keep from exposing user names and passwords inside PowerShell scripts. For instructions, see [Creating a credential asset](automation-use-azure-ad.md#creating-a-credential-asset).

## Creating an Office 365 service account

To run Office 365 subscription services, you need an Office 365 service account with permissions to do what you want. You can use one global administrator account, one account per service, or have one function or script to execute. In any case, the service account requires a complex and secure password. See [Set up Office 365 for business](https://docs.microsoft.com/microsoft-365/admin/setup/setup?view=o365-worldwide). 

## Connecting to the Azure AD online service

>[!NOTE]
>To use the MSOnline module cmdlets, you must run them from Windows PowerShell. PowerShell Core does not support these cmdlets.

You can use the MSOnline module to connect to Azure AD from the Office 365 subscription. The connection uses an Office 365 user name and password or uses multi-factor authentication (MFA). You can connect using the Azure portal or a Windows PowerShell command prompt (does not have to be elevated).

A PowerShell example is shown below. The [Get-Credential](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/get-credential?view=powershell-7) cmdlet prompts for credentials and stores them in the `Msolcred` variable. Then the [Connect-MsolService](https://docs.microsoft.com/powershell/module/msonline/connect-msolservice?view=azureadps-1.0) cmdlet uses the credentials to connect to the Azure directory online service. If you want to connect to a specific Azure environment, use the `AzureEnvironment` parameter.

```powershell
$Msolcred = Get-Credential
Connect-MsolService -Credential $MsolCred -AzureEnvironment "AzureCloud"
```

If you don't receive any errors, you've connected successfully. A quick test is to run an Office 365 cmdlet, for example, `Get-MsolUser`, and see the results. If you receive errors, note that a common problem is an incorrect password.

>[!NOTE]
>You can also use the AzureRM module or the Az module to connect to Azure AD from the Office 365 subscription. The main connection cmdlet is [Connect-AzureAD](https://docs.microsoft.com/powershell/module/azuread/connect-azuread?view=azureadps-2.0). This cmdlet supports the `AzureEnvironmentName` parameter for specific Office 365 environments.

## Creating a PowerShell runbook from an existing script

You access Office 365 functionality from a PowerShell script. Here's an example of a script for a credential named `Office-Credentials` with user name of `admin@TenantOne.com`. It uses `Get-AutomationPSCredential` to import the Office 365 credential.

```powershell
$emailFromAddress = "admin@TenantOne.com" 
$emailToAddress = "servicedesk@TenantOne.com" 
$emailSMTPServer = "outlook.office365.com" 
$emailSubject = "Office 365 License Report" 

$credObject = Get-AutomationPSCredential -Name "Office-Credentials" 
Connect-MsolService -Credential $credObject

$O365Licenses = Get-MsolAccountSku | Out-String 
Send-MailMessage -Credential $credObject -From $emailFromAddress -To $emailToAddress -Subject $emailSubject -Body 

$O365Licenses -SmtpServer $emailSMTPServer -UseSSL
```

## Running the script in a runbook

You can use your script in an Azure Automation runbook. For example purposes, we'll use the PowerShell runbook type.

1. Create a new PowerShell runbook. Refer to [Create an Azure Automation runbook](https://docs.microsoft.com/azure/automation/automation-quickstart-create-runbook).
2. From your Automation account, select **Runbooks** under **Process Automation**.
3. Select the new runbook and click **Edit**.
4. Copy your script and paste it into the textual editor for the runbook.
5. Select **ASSETS**, then expand **Credentials** and verify that the Office 365 credential is there.
6. Click **Save**.
7. Select **Test pane**, then click **Start** to begin testing your runbook. See [Manage runbooks in Azure Automation](https://docs.microsoft.com/azure/automation/manage-runbooks).
8. When testing is complete, exit from the Test pane.

## Publishing and scheduling the runbook

To publish and then schedule your runbook, see [Manage runbooks in Azure Automation](https://docs.microsoft.com/azure/automation/manage-runbooks).

## Next steps

* You can find information about Automation credential assets in [Credential assets in Azure Automation](shared-resources/credentials.md).
* See [Manage modules in Azure Automation](shared-resources/modules.md) to find out how to work with Automation modules.
* For an overview of runbook management, see [Manage runbooks in Azure Automation](https://docs.microsoft.com/azure/automation/manage-runbooks).
* To learn more about the methods that can be used to start a runbook in Azure Automation, see [Starting a runbook in Azure Automation](automation-starting-a-runbook.md).
* For more information about PowerShell, including language reference and learning modules, see the [PowerShell Docs](https://docs.microsoft.com/powershell/scripting/overview).