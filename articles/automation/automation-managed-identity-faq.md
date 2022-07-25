---
title: Azure Automation Migration to Managed Identity FAQ
description: This article gives answers to frequently asked questions when you are migrating from Run As account to Managed Identity
services: automation
ms.subservice: 
ms.topic: conceptual
ms.date: 07/25/2021
ms.custom: devx-track-azurepowershell
#Customer intent: As an implementer, I want answers to various questions.
---

#  Frequently asked questions when migrating from Run As account to Managed identities 

This Microsoft FAQ is a list of commonly asked questions when you are migrating from Run As account to Managed Identity. If you have any other questions about the capabilities, go to the [discussion forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c) and post your questions. When a question is frequently asked, we add it to this article so that it benefits all.

## How long will you support Run As account?
 
Automation Run As account would be supported for the next three years until September 14, 2025. While we continue to support for exisiting users, we recommend all new users to use Managed identities as the preferred way of runbook authentication. Existing users can see the Run As account properties and renew the certificate upon expiration, but users will not be able to create a new Run As account from the Azure portal. Users could still create a new Run As account through [PowerShell script](/azure/automation/create-run-as-account#create-account-using-powershell) until the supported time.

## What is Managed Identity?
Managed identities provide an automatically managed identity in Azure Active Directory for applications to use when connecting to resources that support Azure Active Directory (Azure AD) authentication. Applications can use managed identities to obtain Azure AD tokens without managing credentials, secrets, certificates or keys. 

For more information about managed identities in Azure AD, see [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview). 


## What can I do with a Managed identity in Automation accounts? 
An Azure Automation managed identity from Azure Active Directory (Azure AD) allows your runbook to access other Azure AD-protected resources easily. This identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Key benefits are:
- You can use managed identities to authenticate to any Azure service that supports Azure AD authentication.
- Managed identities eliminate the management overhead associated with managing Run As account in your runbook code. You can access resources via a managed identity of an Automation account from a runbook without worrying about creating the service principal, Run As Certificate, Run As Connection and so on.
- You don’t have to renew the certificate used by the Automation Run As account.
 
## What is the difference between Run As account and Managed Identity?
In Run As accounts, you must manage credentials (certificate). Whereas , in Managed identity, you don't have to do it.

## Are Managed identities more secure than Run As account?
Run As account creates an Azure AD app used to manage the resources within the subscription through a certificate having contributor access at the subscription level by default. A malicious user could use this certificate to perform a privileged operation against resources in the subscription leading to potential vulnerabilities. Run As accounts also has a management overhead associated that involves creating a service principal, RunAsCertificate, RunAsConnection, certificate renewal and so on.

Managed identities eliminate this overhead by providing a secure method for the users to authenticate and access resources that supports Azure AD authentication via the managed identity of an Automation account without worrying about any certificate or credential management.

## Can Managed Identity be used for both cloud and hybrid jobs?
Azure Automation supports [System-assigned managed identities](/azure/automation/automation-security-overview#managed-identities) for both cloud and Hybrid jobs. Hybrid jobs could be running on a Hybrid runbook worker running on an Azure or non-Azure VM. Currently, Azure Automation supports [User-assigned managed identities](/azure/automation/automation-security-overview#managed-identities-preview) for cloud jobs only.

## Can I use Run as account for new Automation account?
Yes, only in a scenario when Managed identities are not supported for specific on-premise resources. We will allow the creation of Run As account through [PowerShell script](/azure/automation/create-run-as-account#create-account-using-powershell).

## How can I migrate from existing Run As account to Managed identities?
Follow the steps mentioned in [migrate Run As accounts to Managed identity](/azure/automationmigrate-run-as-accounts-managed-identity).

## Can we audit and enforce Managed identities through Azure Policy?
Yes, you can audit and enforce the Managed identities through Azure Policy. 

## How do I see the runbooks that are using Run As account?
Use the script here to find out which Automation accounts are using Run As account

## Next steps

If your question isn't answered here, you can refer to the following sources for more questions and answers.

- [Azure Automation](/answers/topics/azure-automation.html)
- [Feedback forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c)
