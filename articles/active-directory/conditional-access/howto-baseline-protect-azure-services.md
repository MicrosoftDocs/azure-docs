---
title: 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/16/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Protecting privileged actions in your organization (preview)

You might be using a variety of Azure services in your organization. These services can be managed through Azure Resource Manager (ARM) API:

* Azure Portal
* Azure PowerShell
* Azure CLI

Using ARM to manage your services is a highly privileged action. ARM can alter tenant-wide configurations, such as service settings and subscription billing. Single factor authentication is vulnerable to a variety of attacks like phishing and password spray. Therefore, it’s important to verify the identity of the user wanting to access ARM and update configurations by requiring multi-factor authentication before allowing access.

**Baseline policy: Require MFA for service management** is a Baseline Protection policy that will require MFA for any user accessing Azure Portal, Azure PowerShell and Azure CLI. This policy applies to all users accessing ARM, regardless of if they’re an administrator.  

Once this policy is enabled in a tenant, all users logging into Azure management resources will be challenged with multi-factor authentication. If the user is not registered for MFA, the user will be required to register using the Microsoft Authenticator App in order to proceed.

Azure PowerShell
To perform interactive sign-in using Azure Powershell, use the Connect-AzAccount cmdlet.
Azure PowerShellCopyTry It
Connect-AzAccount
When run, this cmdlet will present a token string. To sign in, copy this string and paste it into https://microsoft.com/devicelogin in a browser. Your PowerShell session will be authenticated to connect to Azure.

Azure CLI
To perform interactive sign-in using Azure CLI, Run the login command.
Azure CLICopyTry It
az login
If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser page and follow the instructions on the command line to enter an authorization code after navigating to https://aka.ms/devicelogin in your browser. Afterwards, sign in with your account credentials in the browser.

## Deployment Considerations

Because Require MFA for admins applies to all critical administrators, several considerations that need to be made to ensure a smooth deployment. These considerations include identifying users and service principles in Azure AD that cannot or should not perform MFA, as well as applications and clients used by your organization that do not support modern authentication.
Exclude Users
This baseline policy provides you the option to exclude users. Before enabling the policy for your tenant, we recommend excluding the following accounts:
emergency-access administrative or break-glass accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant and turn off the policy.
Service accounts and service principles, such as Azure AD Connect Sync Account. Service accounts are non-interactive accounts that are not tied to any particular user. They are normally used by back-end services and allow programmatic access for applications. Service accounts need to be excluded since MFA can’t be completed programmatically.
If you have privileged accounts that are used in your scripts, you should replace them with managed identities for Azure resources or service principals with certificates. As a temporary workaround, you can exclude specific user accounts from the baseline policy.
Users who will not be able to register for MFA using their mobile devices – this policy will require administrators to register for MFA using the Authenticator App
Users without smart mobile phones
Users who cannot use mobile phones during work

## Enable Require MFA for service management

Baseline policy: Require MFA for service management comes pre-configured and will show up at the top when you navigate to the Conditional Access blade in Azure portal.
To enable this policy and protect your privileged actions:
Sign in to the Azure portal as global administrator, security administrator, or conditional access administrator.
In the Azure portal, on the left navigation bar, click Azure Active Directory.
On the Azure Active Directory page, in the Security section, click Conditional access.
Baseline policies will automatically appear at the top. Click on Baseline policy: Require MFA for admins
To enable the policy, click Use policy immediately.
You can test the policy with up to 50 users by clicking on Select users. Under the Include tab, click Select users and then use the Select option to choose which administrators you want this policy to apply to.
Click Save and you’re ready to go.