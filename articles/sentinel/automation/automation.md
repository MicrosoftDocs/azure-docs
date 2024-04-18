---
title: Automation in Microsoft Sentinel | Microsoft Docs
description: Learn about Microsoft Sentinel security orchestration, automation, and response (SOAR) capabilities and components, including automation rules and playbooks.
ms.topic: overview
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

---

# Automation in Microsoft Sentinel: security orchestration, automation, and response (SOAR)

This article describes Microsoft Sentinel's security orchestration, automation, and response (SOAR) capabilities, and shows how using automation rules and playbooks in response to security threats increases your SOC's effectiveness and saves you time and resources.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Microsoft Sentinel as a SOAR solution

SIEM/SOC teams are typically inundated with security alerts and incidents on a regular basis, at volumes so large that available personnel are overwhelmed. This results all too often in situations where many alerts are ignored and many incidents aren't investigated, leaving the organization vulnerable to attacks that go unnoticed.

Microsoft Sentinel, in addition to being a security information and event management (SIEM) system, is also a platform for security orchestration, automation, and response (SOAR). One of its primary purposes is to automate any recurring and predictable enrichment, response, and remediation tasks that are the responsibility of your security operations center and personnel (SOC/SecOps), freeing up time and resources for more in-depth investigation of, and hunting for, advanced threats. Automation takes a few different forms in Microsoft Sentinel, from automation rules that centrally manage the automation of incident handling and response, to playbooks that run predetermined sequences of actions to provide powerful and flexible advanced automation to your threat response tasks.

## Automation rules

Automation rules allow users to centrally manage the automation of incident handling. Besides letting you assign playbooks to incidents and alerts, automation rules also allow you to automate responses for multiple analytics rules at once, automatically tag, assign, or close incidents without the need for playbooks, create lists of tasks for your analysts to perform when triaging, investigating, and remediating incidents, and control the order of actions that are executed. Automation rules also allow you to apply automations when an incident is updated, as well as when it's created. This new capability will further streamline automation use in Microsoft Sentinel and will enable you to simplify complex workflows for your incident orchestration processes.

For more information, see [Automate threat response in Microsoft Sentinel with automation rules](../automate-incident-handling-with-automation-rules.md).

## Playbooks

A playbook is a collection of response and remediation actions and logic that can be run from Microsoft Sentinel as a routine. A playbook can help automate and orchestrate your threat response, it can integrate with other systems both internal and external, and it can be set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an automation rule, respectively. It can also be run manually on-demand, in response to alerts, from the incidents page.

Playbooks in Microsoft Sentinel are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise. This means that playbooks can take advantage of all the power and customizability of Logic Apps' integration and orchestration capabilities and easy-to-use design tools, and the scalability, reliability, and service level of a Tier 1 Azure service.

For more information, see a[Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).

## Automation with the unified security operations platform

After onboarding your Microsoft Sentinel workspace to the unified security operations platform, note the following differences in the way automation functions in your workspace:

| Functionality | Description  |
| --------- | --------- |
| **Automation rules with alert triggers** | In the unified security operations platform, automation rules with alert triggers act only on Microsoft Sentinel alerts. <br><br>For more information, see [Alert create trigger](../automate-incident-handling-with-automation-rules.md#alert-create-trigger). |
| **Automation rules with incident triggers** | In both the Azure portal and the unified security operations platform, the **Incident provider** condition property is removed, as all incidents have *Microsoft Defender XDR* as the incident provider (the value in the *ProviderName* field). <br><br>At that point, any existing automation rules run on both Microsoft Sentinel and Microsoft Defender XDR incidents, including those where the **Incident provider** condition is set to only *Microsoft Sentinel* or *Microsoft 365 Defender*. <br><br>However, automation rules that specify a specific analytics rule name will run only on the incidents that were created by the specified analytics rule. This means that you can define the **Analytic rule name** condition property to an analytics rule that exists only in Microsoft Sentinel to limit your rule to run on incidents only in Microsoft Sentinel. <br><br>For more information, see [Incident trigger conditions](../automate-incident-handling-with-automation-rules.md#conditions). |
| **Changes to existing incident names** | In the unified SOC operations platform, the Defender portal uses a unique engine to correlate incidents and alerts. When onboarding your workspace to the unified SOC operations platform, existing incident names might be changed if the correlation is applied. To ensure that your automation rules always run correctly, we therefore recommend that you avoid using incident titles in your automation rules, and suggest the use of tags instead. |
| ***Updated by* field** | <li>After onboarding your workspace, the **Updated by** field has a [new set of supported values](../automate-incident-handling-with-automation-rules.md#incident-update-trigger), which no longer include *Microsoft 365 Defender*. In existing automation rules, *Microsoft 365 Defender* is replaced by a value of *Other* after onboarding your workspace. <br><br><li>If multiple changes are made to the same incident in a 5-10 minute period, a single update is sent to Microsoft Sentinel, with only the most recent change. <br><br>For more information, see [Incident update trigger](../automate-incident-handling-with-automation-rules.md#incident-update-trigger). |
| **Automation rules that add incident tasks** | If an automation rule adds an incident task, the task is shown only in the Azure portal. |
| **Microsoft incident creation rules** | Microsoft incident creation rules aren't supported in the unified security operations platform. <br><br>For more information, see [Microsoft Defender XDR incidents and Microsoft incident creation rules](../microsoft-365-defender-sentinel-integration.md#microsoft-defender-xdr-incidents-and-microsoft-incident-creation-rules). |
| **Running automation rules from the Defender portal** | It might take up to 10 minutes from the time that an alert is triggered and an incident is created or updated in the Defender portal to when an automation rule is run. This time lag is because the incident is created in the Defender portal and then forwarded to Microsoft Sentinel for the automation rule. |
| **Active playbooks tab** | After onboarding to the unified security operations platform, by default the **Active playbooks** tab shows a predefined filter with onboarded workspace's subscription. Add data for other subscriptions using the subscription filter.  <br><br>For more information, see [Create and customize Microsoft Sentinel playbooks from content templates](use-playbook-templates.md). |
| **Running playbooks manually on demand** | The following procedures aren't currently supported in the unified security operations platform:  <br><li>[Run a playbook manually on an alert](run-playbooks.md#run-a-playbook-manually-on-an-alert)<br><li>[Run a playbook manually on an entity (Preview)](run-playbooks.md#run-a-playbook-manually-on-an-entity-preview)    |
| **Running playbooks on incidents requires Microsoft Sentinel sync** | If you try to run a playbook on an incident from the unified security operations platform and see the message *"Can't access data related to this action. Refresh the screen in a few minutes."* message, this means that the incident isn't yet synchronized to Microsoft Sentinel. <br><br>Refresh the incident page after the incident is synchronized to run the playbook successfully. |


## Related content

- [Automate threat response in Microsoft Sentinel with automation rules](../automate-incident-handling-with-automation-rules.md)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Create and use Microsoft Sentinel automation rules to manage response](../create-manage-use-automation-rules.md)
- [Tutorial: Respond to threats by using playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
