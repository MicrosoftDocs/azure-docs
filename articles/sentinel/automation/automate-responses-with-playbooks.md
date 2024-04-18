---
title: Automate threat response with playbooks in Microsoft Sentinel | Microsoft Docs
description: This article explains automation in Microsoft Sentinel, and shows how to use playbooks to automate threat prevention and response.
ms.topic: conceptual
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

---

# Automate threat response with playbooks in Microsoft Sentinel

SOC analysts deal with numerous security alerts and incidents. The sheer volume can overwhelm teams, leading to ignored alerts and uninvestigated incidents.

Many alerts and incidents can be addressed by the same sets of defined remediation actions, which are also assigned to the analysts. Automating repetitive tasks can make the SOC more efficient, freeing up analysts for deeper investigations.

Playbooks are sets of remediation actions run from Microsoft Sentinel as a routine, to help [automate and orchestrate your threat response](tutorial-respond-threats-playbook.md). Run playbooks manually and on-demand, for a particular entity or alert, or automatically, in response to specific alerts and incidents that trigger a configured [automation rule](automate-incident-handling-with-automation-rules.md).

For example, if an account and machine are compromised, a playbook can automatically isolate the machine from the network and block the account by the time the SOC team is notified of the incident.

Microsoft Sentinel playbooks use the [Azure Logic Apps](/azure/logic-apps/logic-apps-overview) platform, which provides hundreds of actions and triggers to support almost any automation scenario.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Recommended use cases

The following table lists use cases where we recommend using Microsoft playbooks to automate your threat response:

|Use case  |Description  |
|---------|---------|
|**Enrichment**     |    Collect data and attach it to an incident to help your team make smarter decisions.   |
|**Bi-directional sync**     | Sync Microsoft Sentinel incidents with other ticketing system. For example, create an automation rule for all incident creation, and attach a playbook that opens a ticket in ServiceNow.        |
|**Orchestration**     | Use the SOC chat platform to better control the incidents queue. For example, send a message to your security operations channel in Microsoft Teams or Slack to make sure your security analysts are aware of the incident.      |
|**Response**     |  Immediately respond to threats, with minimal human dependencies, such as when a compromised user or machine is indicated. Alternately, manually trigger a series of automated steps during an investigation or while hunting.     |

For more information, see [Recommended playbook use cases, templates, and examples](playbooks/playbooks-recommendations.md).

## Prerequisites

The following roles are required to use Azure Logic Apps to create and run playbooks in Microsoft Sentinel.

[!INCLUDE [playbooks-roles](../includes/playbooks-roles.md)]

### Extra permissions required for Microsoft Sentinel to run playbooks

[!INCLUDE [playbooks-service-account-permissions](../includes/playbooks-service-account-permissions.md)]

## Playbook templates (Preview)

> [!IMPORTANT]
> Playbook templates are currently in PREVIEW. See the **[Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)** for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Playbook templates are prebuilt, tested, and ready-to-use workflows that aren't useable as playbooks themselves, but are ready for you to customize to meet your needs. We also recommend that you use playbook templates as a reference of best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Access playbook templates from the following sources:

|Location  |Description  |
|---------|---------|
|**Microsoft Sentinel Automation page**     |  The **Playbook templates** tab lists all installed playbooks. Create one or more active playbooks using the same templates.  <br><br>When we publish a new version of a template, any active playbooks created from that template show up in the **Active playbooks** tab with a label that indicates that an update is available.    |
|**Microsoft Sentinel Content hub page**     |   Playbook templates are available as part of product solutions or standalone content installed from the **Content hub**.  <br><br>For more information, see [About Microsoft Sentinel content and solutions](../sentinel-solutions.md) and [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).|
|**GitHub**     |    The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) contains many playbook templates. They can be deployed to an Azure subscription by selecting the Deploy to Azure button.     |
	
Technically, a playbook template is an [Azure Resource Manager (ARM) template](/azure/azure-resource-manager/templates/), which consists of several resources: an Azure Logic Apps workflow and API connections for each connection involved.

For more information, see:

- [Create and customize Microsoft Sentinel playbooks from content templates](use-playbook-templates.md)
- [Recommended playbook templates](playbook-recommendations.md#recommended-playbook-templates)
- [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md)

## Playbook creation and usage workflow

Use the following workflow to create and run Microsoft Sentinel playbooks:

1. Define your automation scenario. We recommend that you review [recommended playbooks use cases](playbooks/playbooks-recommendations.md#recommended-playbook-use-cases) and [playbook templates](playbooks/playbooks-recommendations.md#recommended-playbook-templates) to start.

1. If you're not using a template, create your playbook and build your logic app. For more information, see [Create and manage Microsoft Sentinel playbooks](playbooks/create-playbooks.md).

1. Test your logic app by running it manually. For more information, see [Run a playbook manually, on demand](playbooks/run-playbooks.md#run-a-playbook-manually-on-demand).

1. Configure your playbook to run automatically on a new alert or incident creation, or run it manually as needed for your processes. For more information, see [Respond to threats with Microsoft Sentinel playbooks](playbooks/run-playbooks.md).

## Related content

- [Azure Logic Apps for Microsoft Sentinel playbooks](playbooks/logic-apps-playbooks.md)
- [Create and manage Microsoft Sentinel playbooks](playbooks/create-playbooks.md)
- [Respond to threats with Microsoft Sentinel playbooks](playbooks/run-playbooks.md)
- [Create and customize Microsoft Sentinel playbooks from content templates](use-playbook-templates.md)

