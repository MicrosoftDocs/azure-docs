---
title: Azure Automation migration to managed identities FAQ
description: This article gives answers to frequently asked questions when you're migrating from a Run As account to a managed identity.
services: automation
ms.subservice: process-automation
ms.topic: conceptual
ms.date: 07/25/2021
ms.custom:
#Customer intent: As an implementer, I want answers to various questions.
---

#  FAQ for migrating from a Run As account to managed identities

The following FAQ can help you migrate from a Run As account to a Managed identity in Azure Automation. If you have any other questions about the capabilities, post them on the [discussion forum](https://aka.ms/retirement-announcement-automation-runbook-start-using-managed-identities). When a question is frequently asked, we add it to this article so that it benefits everyone.

## How long will you support a Run As account?
 
Automation Run As accounts will be supported until *30 September 2023*. Moreover, starting 01 April 2023, creation of **new** Run As accounts in Azure Automation will not be possible. Renewing of certificates for existing Run As accounts would be possible only till the end of support.

## Will existing runbooks that use the Run As account be able to authenticate?
Yes, they'll be able to authenticate. There will be no impact to existing runbooks that use a Run As account. After 30 September 2023, all runbook executions using RunAs accounts, including Classic Run As accounts wouldn't be supported. Hence, you must migrate all runbooks to use Managed identities before that date.

## My Run as account will expire soon, how can I renew it?
If your Run As account certificate is going to expire soon, it's a good time to start using Managed identities for authentication instead of renewing the certificate. However, if you still want to renew it, you would be able to do it through the portal only till 30 September 2023.

## Can I create new Run As accounts?
From 1 April 2023, creation of new Run As accounts wouldn't be possible. We strongly recommend that you start using Managed identities for authentication instead of creating new Run As accounts.
 
## Will runbooks that still use the Run As account be able to authenticate after September 30, 2023?
Yes, the runbooks will be able to authenticate until the Run As account certificate expires. After 30 September 2023, all runbook executions using RunAs accounts wouldn't be supported.

## Are Connections and Credentials assets retiring on 30th Sep 2023?

Automation Run As accounts will not be supported after **30 September 2023**. Connections and Credentials assets don't come under the purview of this retirement. For more secure way of authentication, we recommend you to use [Managed Identities](automation-security-overview.md#managed-identities).


## What is a managed identity?
Applications use managed identities in Microsoft Entra ID when they're connecting to resources that support Microsoft Entra authentication. Applications can use managed identities to obtain Microsoft Entra tokens without managing credentials, secrets, certificates, or keys. 

For more information about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). 

## What can I do with a managed identity in Automation accounts? 
An Azure Automation managed identity from Microsoft Entra ID allows your runbook to access other Microsoft Entra protected resources easily. This identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. 

Key benefits are:
- You can use managed identities to authenticate to any Azure service that supports Microsoft Entra authentication.
- Managed identities eliminate the overhead associated with managing Run As accounts in your runbook code. You can access resources via a managed identity of an Automation account from a runbook without worrying about creating the service principal, Run As certificate, Run As connection, and so on.
- You don't have to renew the certificate that the Automation Run As account uses.
 
## Are managed identities more secure than a Run As account?
A Run As account creates a Microsoft Entra app that's used to manage the resources within the subscription through a certificate that has contributor access at the subscription level by default. A malicious user could use this certificate to perform a privileged operation against resources in the subscription, leading to potential vulnerabilities. 

Run As accounts also have a management overhead that involves creating a service principal, Run As certificate, Run As connection, certificate renewal, and so on. Managed identities eliminate this overhead by providing a secure method for users to authenticate and access resources that support Microsoft Entra authentication without worrying about any certificate or credential management.

## Can a managed identity be used for both cloud and hybrid jobs?
Azure Automation supports [system-assigned managed identities](./automation-security-overview.md#managed-identities) for both cloud and hybrid jobs. Currently, Azure Automation [user-assigned managed identities](./automation-security-overview.md) can be used for cloud jobs only and can't be used for jobs that run on a hybrid worker.

## How can I migrate from an existing Run As account to a managed identity?
Follow the steps in [Migrate an existing Run As account to a managed identity](./migrate-run-as-accounts-managed-identity.md).

## How do I see the runbooks that are using a Run As account and know what permissions are assigned to that account?
Use [this script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/Check-AutomationRunAsAccountRoleAssignments.ps1) to find out which Automation accounts are using a Run As account. If your Azure Automation accounts contain a Run As account, it will have the built-in contributor role assigned to it by default. You can use the script to check the Azure Automation Run As accounts and determine if their role assignment is the default one or if it has been changed to a different role definition.

## Next steps

If your question isn't answered here, you can refer to the following sources for more questions and answers:

- [Azure Automation](/answers/topics/azure-automation.html)
- [Feedback forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c)
