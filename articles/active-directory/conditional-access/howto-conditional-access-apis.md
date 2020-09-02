---
title: Conditional Access APIs and PowerShell - Azure Active Directory
description: Using the Azure AD Conditional Access APIs and PowerShell to manage policies like code

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 09/01/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: videor, jeevanb

ms.collection: M365-identity-device-management
---
# Conditional Access: Programmatic access

Many organizations have expressed their need to manage as much of their environments like code as possible. Using Microsoft Graph you can treat Conditional Access policies like any other piece of code in your environment.

Microsoft Graph provides a unified programmability model that organizations can use to interact with data in Microsoft 365, Windows 10, and Enterprise Mobility + Security. For more information about Microsoft Graph, see the article, [Overview of Microsoft Graph](/graph/overview).

![An image showing the primary resources and relationships that are part of the graph](./media/howto-conditional-access-apis/microsoft-graph.png)

The following examples are provided as is with no support. You can use these examples as a basis for tooling in your organization. 

Many of the following examples use tools like [Managed Identities](../managed-identities-azure-resources/overview.md), [Logic Apps](../../logic-apps/logic-apps-overview.md), [OneDrive](https://www.microsoft.com/microsoft-365/onedrive/online-cloud-storage), [Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software/), and [Azure Key Vault](../../key-vault/general/overview.md).

## Configure

### PowerShell

For many administrators, PowerShell is already an understood scripting tool. The following example shows how to use the [Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD) to manage Conditional Access policies.

https://github.com/videor/AutoPilotConditionalAccess/blob/master/AutoPilotConditionalAccess/azure-quickstart-templates/101-conditionalaccess-apis-tutorial/readme-powershell.md

### Graph API

This example shows the basic Create, Read, Update, and Delete (CRUD) options available in the Conditional Access Graph APIs. The example also includes some JSON templates you can use to create some sample policies. 

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/101-conditionalaccess-apis-tutorial

### Configure using templates

Use Conditional Access APIs to deploy Conditional Access policies in your pre-production environment using a template.

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-policy-template-automation

## Test

This example models safer deployment practices with approval workflows that can copy Conditional Access policies from one environment, like pre-production, to another, like your production environment.

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-policy-copy-paste-automation

## Deploy

This example provides a mechanism to perform a staged deployment Conditional Access policies gradually to your user population, allowing you to manage support impact and spot issues early.

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-policy-blueprint-automation

## Monitor

This example provides a mechanism to monitor Conditional Access policy changes over time and can trigger alerts when key policies are changed. 

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-policy-alert-automation

## Manage

### Backup and restore

Automate the backup and restoration of Conditional Access policies with approvals in Teams using this example. 

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-policy-backup-restore-automation

### Contingency planning

When something happens and you lose access ensure you are able to recover using [emergency access accounts](../users-groups-roles/directory-emergency-access.md), or [fall back to a contingency policy](../authentication/concept-resilient-controls.md) using the following examples. 

Multiple administrators may create Conditional Access policies and may forget to add your emergency access accounts as an exclusion to those policies. This example ensures that all policies are updated to include your designated emergency access accounts.

https://github.com/videor/AutoPilotConditionalAccess/tree/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-policy-emergency-account-automation


Things don't always work the way you want, when that happens you need a way to get back to a state where work can continue. The following example provides you a way to revert your policies to a known good contingency plan and disable other Conditional Access policies. 

https://github.com/videor/AutoPilotConditionalAccess/blob/master/AutoPilotConditionalAccess/azure-quickstart-templates/301-conditionalaccess-contingency-policies-automation/readme.md


## Next steps

- [Overview of Microsoft Graph](/graph/overview)

- [Conditional Access API](/graph/api/resources/conditionalaccesspolicy?view=graph-rest-1.0)

- [Named location API](/graph/api/resources/namedlocation?view=graph-rest-1.0)
