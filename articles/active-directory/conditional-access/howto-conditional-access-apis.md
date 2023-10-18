---
title: Conditional Access APIs and PowerShell
description: Using the Microsoft Entra Conditional Access APIs and PowerShell to manage policies like code

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 09/10/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: videor, jeevanb

ms.collection: M365-identity-device-management
---
# Conditional Access: Programmatic access

Many organizations have expressed their need to manage as much of their environments like code as possible. Using Microsoft Graph you can treat Conditional Access policies like any other piece of code in your environment.

Microsoft Graph provides a unified programmability model that organizations can use to interact with data in Microsoft 365, Windows 10, and Enterprise Mobility + Security. For more information about Microsoft Graph, see the article, [Overview of Microsoft Graph](/graph/overview).

![An image showing the primary resources and relationships that are part of the graph](./media/howto-conditional-access-apis/microsoft-graph.png)

The following examples are provided as is with no support. You can use these examples as a basis for tooling in your organization. 

Many of the following examples use tools like [Managed Identities](../managed-identities-azure-resources/overview.md), [Logic Apps](/azure/logic-apps/logic-apps-overview), [OneDrive](https://www.microsoft.com/microsoft-365/onedrive/online-cloud-storage), [Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software/), and [Azure Key Vault](/azure/key-vault/general/overview).

## Configure

### PowerShell

> [!IMPORTANT]
> Due to the planned deprecation of older PowerShell modules no further updates are planned for these modules to support new Conditional Access features. See recent announcements for more information: https://aka.ms/AzureADPowerShellDeprecation. New Conditional Access features may not be available or may not be functional within these PowerShell modules as a result of this announcement. Please consider [migrating to Microsoft Graph PowerShell](https://aka.ms/MigrateMicrosoftGraphPowerShell). Additional guidance and examples will be released soon.

For many administrators, PowerShell is already an understood scripting tool. The following example shows how to use the [Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD) to manage Conditional Access policies.

- [Configure Conditional Access policies with Azure AD PowerShell commands](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/01-configure/powershell)

### Microsoft Graph APIs

This example shows the basic Create, Read, Update, and Delete (CRUD) options available in the Conditional Access APIs in Microsoft Graph. The example also includes some JSON templates you can use to create some sample policies.

- [Configure Conditional Access policies with Microsoft Graph API calls](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/01-configure/graphapi)

### Configure using templates

Use Conditional Access APIs to deploy Conditional Access policies in your pre-production environment using a template.

- [Configure Conditional Access policies with Microsoft Graph API templates](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/01-configure/templates)

## Test

This example models safer deployment practices with approval workflows that can copy Conditional Access policies from one environment, like pre-production, to another, like your production environment.

- [Promote Conditional Access policies from test environments](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/02-test)

## Deploy

This example provides a mechanism to perform a staged deployment Conditional Access policies gradually to your user population, allowing you to manage support impact and spot issues early.

- [Deploy Conditional Access policies to production environments with approval workflows](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/03-deploy)

## Monitor

This example provides a mechanism to monitor Conditional Access policy changes over time and can trigger alerts when key policies are changed.

- [Monitor deployed Conditional Access policies for changes and trigger alerts](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/04-monitor)

## Manage

### Backup and restore

Automate the backup and restoration of Conditional Access policies with approvals in Teams using this example.

- [Manage the backup and restore process of Conditional Access policies using Microsoft Graph API calls](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/05-manage/01-backup-restore)

### Emergency access accounts

Multiple administrators may create Conditional Access policies and may forget to add your [emergency access accounts](../roles/security-emergency-access.md) as an exclusion to those policies. This example ensures that all policies are updated to include your designated emergency access accounts.

- [Manage the assignment of emergency access accounts to Conditional Access policies using Microsoft Graph API calls](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/05-manage/02-emergency-access)

### Contingency planning

Things don't always work the way you want, when that happens you need a way to get back to a state where work can continue. The following example provides you a way to revert your policies to a known good contingency plan and disable other Conditional Access policies.

- [Manage the activation of Conditional Access contingency policies using Microsoft Graph API calls](https://github.com/Azure-Samples/azure-ad-conditional-access-apis/tree/main/05-manage/03-contingency)

## Community contribution

These samples are available in our [GitHub repository](https://github.com/Azure-Samples/azure-ad-conditional-access-apis). We are happy to support community contributions through GitHub Issues and Pull Requests.

## Next steps

- [Overview of Microsoft Graph](/graph/overview)

- [Conditional Access API](/graph/api/resources/conditionalaccesspolicy)

- [Named location API](/graph/api/resources/namedlocation)
