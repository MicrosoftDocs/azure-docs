---
title: Automation in Microsoft Sentinel | Microsoft Docs
description: Learn about Microsoft Sentinel security orchestration, automation, and response (SOAR) capabilities and components, including automation rules and playbooks.
ms.topic: conceptual
author: batamig
ms.author: bagol
ms.date: 04/28/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
#Customer intent: As a SOC analyst, I want to automate incident response and remediation tasks using SOAR capabilities so that I can focus on investigating advanced threats and reduce the risk of missed alerts.

---

# Automation in Microsoft Sentinel: Security orchestration, automation, and response (SOAR)

Security information and event management (SIEM) and security operations center (SOC) teams are typically inundated with security alerts and incidents on a regular basis, at volumes so large that available personnel are overwhelmed. This results all too often in situations where many alerts are ignored and many incidents aren't investigated, leaving the organization vulnerable to attacks that go unnoticed.

Microsoft Sentinel, in addition to being a SIEM system, is also a platform for security orchestration, automation, and response (SOAR). One of its primary purposes is to automate any recurring and predictable enrichment, response, and remediation tasks that are the responsibility of your security operations center and personnel (SOC/SecOps), freeing up time and resources for more in-depth investigation of, and hunting for, advanced threats.

This article describes Microsoft Sentinel's SOAR capabilities, and shows how using automation rules and playbooks in response to security threats increases your SOC's effectiveness and saves you time and resources.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Automation rules

Microsoft Sentinel uses automation rules to allow users to manage incident handling automation from a central location. Use automation rules to:

- Assign more advanced automation to incidents and alerts, using [playbooks](#playbooks)
- Automatically tag, assign, or close incidents without a playbook
- Automate responses for multiple [analytics rules](../detect-threats-built-in.md) at once
- Create lists of tasks for your analysts to perform when triaging, investigating, and remediating incidents
- Control the order of actions that are executed

We recommend that you apply automation rules when incidents are created or updated to further streamline the automation and simplify complex workflows for your incident orchestration processes.

For more information, see [Automate threat response in Microsoft Sentinel with automation rules](../automate-incident-handling-with-automation-rules.md).

## Playbooks

A playbook is a collection of response and remediation actions and logic that can be run from Microsoft Sentinel as a routine. A playbook can:

- Help automate and orchestrate your threat response
- Integrate with other systems, both internal and external
- Be configured to run automatically in response to specific alerts or incidents, or run manually on-demand, such as in response to new alerts

In Microsoft Sentinel, playbooks are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise. This means that playbooks can take advantage of all the power and customizability of Logic Apps' integration and orchestration capabilities and easy-to-use design tools, and the scalability, reliability, and service level of a Tier 1 Azure service.

For more information, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).

## Automation in the Microsoft Defender portal

Note the following details about how automation works for Microsoft Sentinel in the Defender portal. If you're an existing customer who's transitioning from the Azure portal to the Defender portal, you may note differences in the way automation functions in your workspace after onboarding to the Defender portal.

[!INCLUDE [automation-in-defender](../includes/automation-in-defender.md)]
 
## Related content

- [Automate threat response in Microsoft Sentinel with automation rules](../automate-incident-handling-with-automation-rules.md)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Create and use Microsoft Sentinel automation rules to manage response](../create-manage-use-automation-rules.md)
