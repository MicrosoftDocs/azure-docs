---
title: Automate Threat Response with Playbooks in Microsoft Sentinel
description: Learn how to automate threat response in Microsoft Sentinel using playbooks to efficiently manage security alerts and incidents.
ms.topic: conceptual
author: batamig
ms.author: bagol
ms.date: 05/27/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
#Customer intent: As a SOC analyst, I want to automate threat response using playbooks so that I can efficiently manage security alerts and incidents, reducing manual intervention and focusing on deeper investigations.

---

# Automate threat response with playbooks in Microsoft Sentinel

Security operations centers (SOCs) face a constant stream of security alerts and incidents. Managing these efficiently is critical to keeping your organization’s security strong. Microsoft Sentinel playbooks are automated workflows that help you respond to threats quickly and consistently. This article shows how to use playbooks in Microsoft Sentinel to automate threat response, cut manual effort, and let your team focus on deeper investigations.

Use Microsoft Sentinel playbooks to run preconfigured sets of remediation actions and [automate and orchestrate your threat response](tutorial-respond-threats-playbook.md). Run playbooks automatically in response to specific alerts and incidents that trigger a configured [automation rule](../automate-incident-handling-with-automation-rules.md), or run them manually for a particular entity or alert.

For example, if an account and machine are compromised, a playbook can automatically isolate the machine from the network and block the account before the SOC team gets notified of the incident.

> [!NOTE]
> Because playbooks use Azure Logic Apps, additional charges can apply. Go to the [Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/) pricing page for more details.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Recommended use cases

The following table lists common use cases where Microsoft Sentinel playbooks help automate threat response:

|Use case  |Description  |
|---------|---------|
|**Enrichment**     |    Collect data and attach it to an incident so your team can make better decisions.   |
|**Bi-directional sync**     | Sync Microsoft Sentinel incidents with other ticketing systems. For example, create an automation rule for all new incidents, and attach a playbook that opens a ticket in ServiceNow.        |
|**Orchestration**     | Use the SOC team's chat platform to manage the incident queue. For example, send a message to your security operations channel in Microsoft Teams or Slack so your security analysts know about the incident.      |
|**Response**     |  Respond to threats right away with minimal human involvement, such as when a compromised user or machine is detected. Or, manually trigger automated steps during an investigation or while hunting.     |

For more information, see [Recommended playbook use cases, templates, and examples](playbook-recommendations.md).

## Prerequisites

You need the following roles to use Azure Logic Apps to create and run playbooks in Microsoft Sentinel.

[!INCLUDE [playbooks-roles](../includes/playbooks-roles.md)]

### Extra permissions required for Microsoft Sentinel to run playbooks

[!INCLUDE [playbooks-service-account-permissions](../includes/playbooks-service-account-permissions.md)]

## Playbook templates (preview)

> [!IMPORTANT]
> Playbook templates are currently in PREVIEW. See the **[Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)** for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Playbook templates are prebuilt, tested, and ready-to-use workflows that aren't usable as playbooks themselves, but are ready for you to customize to meet your needs. We also recommend that you use playbook templates as a reference of best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Get playbook templates from these sources:

|Location  |Description  |
|---------|---------|
|**Microsoft Sentinel Automation page**     |  The **Playbook templates** tab shows all installed playbooks. Create one or more active playbooks using the same template.  <br><br>When a new version of a template is published, any active playbooks created from that template get an extra label in the **Active playbooks** tab to show that an update is available.    |
|**Microsoft Sentinel Content hub page**     |   Playbook templates are part of product solutions or standalone content you install from the **Content hub**.  <br><br>For more information, see: <br> [About Microsoft Sentinel content and solutions](../sentinel-solutions.md) <br>[Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md)|
|**GitHub**     |    The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) has many other playbook templates. Select **Deploy to Azure** to deploy a template to your Azure subscription.|

A playbook template is an [Azure Resource Manager (ARM) template](/azure/azure-resource-manager/templates/) that includes several resources: an Azure Logic Apps workflow and API connections for each connection involved.

For more information, see:

- [Create and customize Microsoft Sentinel playbooks from content templates](use-playbook-templates.md)
- [Recommended playbook templates](playbook-recommendations.md#recommended-playbook-templates)
- [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md)

## Playbook creation and usage workflow

Follow these steps to create and run Microsoft Sentinel playbooks:

1. Define your automation scenario. Review [recommended playbooks use cases](playbook-recommendations.md#recommended-playbook-use-cases) and [playbook templates](playbook-recommendations.md#recommended-playbook-templates) to get started.

1. If you're not using a template, create your playbook and build your logic app. For more information, see [Create and manage Microsoft Sentinel playbooks](create-playbooks.md).

    Test your logic app by running it manually. For more information, see [Run a playbook manually, on demand](run-playbooks.md#run-a-playbook-manually-on-demand).

1. Set up your playbook to run automatically when a new alert or incident is created, or run it manually as needed for your process. For more information, see [Respond to threats with Microsoft Sentinel playbooks](run-playbooks.md).

## Related content

- [Create and customize Microsoft Sentinel playbooks from content templates](use-playbook-templates.md)
- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
- [Respond to threats with Microsoft Sentinel playbooks](run-playbooks.md)
- [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md)
