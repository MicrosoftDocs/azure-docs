---
title: Azure Automation migration to managed identity FAQ
description: This article gives answers to frequently asked questions when you're migrating from Run As account to managed identity
services: automation
ms.subservice: process-automation
ms.topic: conceptual
ms.date: 07/25/2021
ms.custom: devx-track-azurepowershell
#Customer intent: As an implementer, I want answers to various questions.
---

#  Frequently asked questions when migrating from Run As account to managed identities 

This Microsoft FAQ is a list of commonly asked questions when you're migrating from Run As account to Managed Identity. If you have any other questions about the capabilities, go to the [discussion forum](https://aka.ms/retirement-announcement-automation-runbook-start-using-managed-identities) and post your questions. When a question is frequently asked, we add it to this article so that it benefits all.

## How long will you support Run As account?
 
Automation Run As account will be supported for the next one year until **September 30, 2023**. While we continue to support existing users, we recommend all new users to use Managed identities as the preferred way of runbook authentication. Existing users can still create the Run As account, see the  account properties and renew the certificate upon expiration till **January 30, 2023**. After this date, you won't be able to create a Run As account from the Azure portal. You will still be able to create a Run As account through [PowerShell script](/azure/automation/create-run-as-account#create-account-using-powershell) until the supported time of one year. You can [use this script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/RunAsAccountAssessAndRenew.ps1) to renew the certificate post **January 30, 2023** until **September 30, 2023**. This script will assess automation account which has configured Run As accounts and renews the certificate if the user chooses to do so. On confirmation, it will renew the key credentials of Azure-AD App and upload new self-signed certificate to the Azure-AD App.


## Will existing runbooks that use the Run As account be able to authenticate?
Yes, they will be able to authenticate and there will be no impact to the existing runbooks using Run As account.

## How can I renew the existing Run as accounts post January 30, 2023 when portal support to renew the account to removed?
You can [use this script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/RunAsAccountAssessAndRenew.ps1) to renew the Run As account certificate post January 30, 2023 until September 30, 2023.

## Can Run As account still be created post September 30, 2023 when Run As account will retire?
Yes, you can still create the Run As account using the [PowerShell script](../automation/create-run-as-account.md#create-account-using-powershell). However, this would be an unsupported scenario.

## Can Run As accounts still be renewed post September 30, 2023 when Run As account will retire?
You can [use this script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/RunAsAccountAssessAndRenew.ps1) to renew the Run As account certificate post September 30, 2023 when Run As account will retire. However, it would be an unsupported scenario.

## Will the runbooks that still use the Run As account be able to authenticate even after September 30, 2023?
Yes, the runbooks will be able to authenticate until the Run As account certificate expires.

## What is managed identity?
Managed identities provide an automatically managed identity in Azure Active Directory for applications to use when connecting to resources that support Azure Active Directory (Azure AD) authentication. Applications can use managed identities to obtain Azure AD tokens without managing credentials, secrets, certificates or keys. 

For more information about managed identities in Azure AD, see [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview). 

## What can I do with a managed identity in Automation accounts? 
An Azure Automation managed identity from Azure Active Directory (Azure AD) allows your runbook to access other Azure AD-protected resources easily. This identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Key benefits are:
- You can use managed identities to authenticate to any Azure service that supports Azure AD authentication.
- Managed identities eliminate the management overhead associated with managing Run As account in your runbook code. You can access resources via a managed identity of an Automation account from a runbook without worrying about creating the service principal, Run As Certificate, Run As Connection and so on.
- You don’t have to renew the certificate used by the Automation Run As account.
 
## Are Managed identities more secure than Run As account?
Run As account creates an Azure AD app used to manage the resources within the subscription through a certificate having contributor access at the subscription level by default. A malicious user could use this certificate to perform a privileged operation against resources in the subscription leading to potential vulnerabilities. Run As accounts also have a management overhead associated that involves creating a service principal, RunAsCertificate, RunAsConnection, certificate renewal and so on.

Managed identities eliminate this overhead by providing a secure method for the users to authenticate and access resources that support Azure AD authentication without worrying about any certificate or credential management.

## Can managed identity be used for both cloud and hybrid jobs?
Azure Automation supports [System-assigned managed identities](/azure/automation/automation-security-overview#managed-identities) for both cloud and Hybrid jobs. Currently, Azure Automation [User-assigned managed identities](/azure/automation/automation-security-overview#managed-identities-preview) can only be used for cloud jobs only and cannot be used for jobs run on a Hybrid Worker.

## Can I use Run as account for new Automation account?
Yes, only in a scenario when Managed identities aren't supported for specific on-premises resources. We'll allow the creation of Run As account through [PowerShell script](/azure/automation/create-run-as-account#create-account-using-powershell).

## How can I migrate from existing Run As account to managed identities?
Follow the steps mentioned in [migrate Run As accounts to Managed identity](/azure/automationmigrate-run-as-accounts-managed-identity).

## How do I see the runbooks that are using Run As account and know what permissions are assigned to the Run As account?
Use the [script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/Check-AutomationRunAsAccountRoleAssignments.ps1) here to find out which Automation accounts are using Run As account. If your Azure Automation accounts contain a Run As account, it will by default, have the built-in contributor role assigned to it. You can use this script to check the role assignments of your Azure Automation Run As accounts and determine if their role assignment is the default one or if it has been changed to a different role definition.

## Next steps

If your question isn't answered here, you can refer to the following sources for more questions and answers.

- [Azure Automation](https://docs.microsoft.com/answers/topics/azure-automation.html)
- [Feedback forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c)
