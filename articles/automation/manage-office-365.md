---
title: Manage Office 365 services using Azure Automation
description: This article tells how to use Azure Automation to manage Office 365 subscription services.
services: automation
ms.date: 11/05/2020
ms.topic: conceptual
ms.custom: has-azure-ad-ps-ref, azure-ad-ref-level-one-done
---

# Manage Office 365 services

You can use Azure Automation for management of Office 365 subscription services, for products such as Microsoft Word and Microsoft Outlook. Interactions with Office 365 are enabled by [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md). See [Use Microsoft Entra ID in Azure Automation to authenticate to Azure](automation-use-azure-ad.md).

## Prerequisites

You need the following to manage Office 365 subscription services in Azure Automation.

* An Azure subscription. See [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).
* An Automation object in Azure to hold the user account credentials and runbooks. See [An introduction to Azure Automation](./automation-intro.md).
* Microsoft Entra ID. See [Use Microsoft Entra ID in Azure Automation to authenticate to Azure](automation-use-azure-ad.md).
* An Office 365 tenant, with an account. See [Set up your Office 365 tenant](/sharepoint/dev/spfx/set-up-your-developer-tenant).

## Install Microsoft Graph PowerShell

Use of Office 365 within Azure Automation requires the Microsoft Graph PowerShell module.

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser
```

>[!NOTE]
>To use Microsoft Graph PowerShell, you must be a member of Microsoft Entra ID. Guest users can't use the module.

## Create an Azure Automation account

To complete the steps in this article, you need an account in Azure Automation. See [Create an Azure Automation account](./quickstarts/create-azure-automation-account-portal.md).
 
## Create a credential asset (optional)

It's optional to create a credential asset for the Office 365 administrative user who has permissions to run your script. It can help, though, to keep from exposing user names and passwords inside PowerShell scripts. For instructions, see [Create a credential asset](automation-use-azure-ad.md#create-a-credential-asset).

## Create an Office 365 service account

To run Office 365 subscription services, you need an Office 365 service account with permissions to do what you want. You can use one global administrator account, one account per service, or have one function or script to execute. In any case, the service account requires a complex and secure password. See [Set up Office 365 for business](/microsoft-365/admin/setup/setup).

<a name='connect-to-the-azure-ad-online-service'></a>

## Connect to the Microsoft Entra online service

>[!NOTE]
>To use the Microsoft Graph PowerShell module cmdlets, you must run them from Windows PowerShell. PowerShell Core does not support these cmdlets.

You can connect to Microsoft Entra ID from the Office 365 subscription. The connection uses an Office 365 user name and password or uses multi-factor authentication (MFA). You can connect using the Azure portal or a Windows PowerShell command prompt (does not have to be elevated).

A PowerShell example is shown below. For more information, see [Connect-MgGraph](/powershell/module/microsoft.graph.authentication/connect-mggraph).

```powershell
Connect-MgGraph -Scopes "Directory.Read.All"
```

If you don't receive any errors, you've connected successfully. A quick test is to run an Office 365 cmdlet, for example, [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser), and see the results.

## Create a PowerShell runbook from an existing script

You access Office 365 functionality from a PowerShell script.

```powershell
$emailFromAddress = "admin@TenantOne.com"
$emailToAddress = "servicedesk@TenantOne.com"
$emailSMTPServer = "outlook.office365.com"
$emailSubject = "Office 365 License Report"
$credObject = Get-AutomationPSCredential -Name "Office-Credentials"

Connect-MgGraph -Scopes "Directory.Read.All"

$O365Licenses = Get-MgSubscribedSku | Out-String
Send-MailMessage -Credential $credObject -From $emailFromAddress -To $emailToAddress -Subject $emailSubject -Body $O365Licenses -SmtpServer $emailSMTPServer -UseSSL
```

## Run the script in a runbook

You can use your script in an Azure Automation runbook. For example purposes, we'll use the PowerShell runbook type.

1. Create a new PowerShell runbook. Refer to [Create an Azure Automation runbook](./learn/powershell-runbook-managed-identity.md).
2. From your Automation account, select **Runbooks** under **Process Automation**.
3. Select the new runbook and click **Edit**.
4. Copy your script and paste it into the textual editor for the runbook.
5. Select **ASSETS**, then expand **Credentials** and verify that the Office 365 credential is there.
6. Click **Save**.
7. Select **Test pane**, then click **Start** to begin testing your runbook. See [Manage runbooks in Azure Automation](./manage-runbooks.md).
8. When testing is complete, exit from the Test pane.

## Publish and schedule the runbook

To publish and then schedule your runbook, see [Manage runbooks in Azure Automation](./manage-runbooks.md).

## Next steps

* For details of credential use, see [Manage credentials in Azure Automation](shared-resources/credentials.md).
* For information about modules, see [Manage modules in Azure Automation](shared-resources/modules.md).
* If you need to start a runbook, see [Start a runbook in Azure Automation](start-runbooks.md).
* For PowerShell details, see [PowerShell Docs](/powershell/scripting/overview).
