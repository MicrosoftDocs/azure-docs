---
title: Migrate Splunk SOAR automation to Microsoft Sentinel | Microsoft Docs
description: Learn how to identify SOAR use cases, and how to migrate your Splunk SOAR automation to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Migrate Splunk SOAR automation to Microsoft Sentinel

Microsoft Sentinel provides Security Orchestration, Automation, and Response (SOAR) capabilities with [automation rules](automate-incident-handling-with-automation-rules.md) and [playbooks](tutorial-respond-threats-playbook.md). Automation rules automate incident handling and response, and playbooks run predetermined sequences of actions to response and remediate threats. This article discusses how to identify SOAR use cases, and how to migrate your Splunk SOAR automation to Microsoft Sentinel.

Automation rules simplify complex workflows for your incident orchestration processes, and allow you to centrally manage your incident handling automation. 

With automation rules, you can: 
- Perform simple automation tasks without necessarily using playbooks. For example, you can assign, tag incidents, change status, and close incidents. 
- Automate responses for multiple analytics rules at once. 
- Control the order of actions that are executed. 
- Run playbooks for those cases where more complex automation tasks are necessary. 

## Identify SOAR use cases

Here’s what you need to think about when migrating SOAR use cases from Splunk.
- **Use case quality**. Choose good use cases for automation. Use cases should be based on procedures that are clearly defined, with minimal variation, and a low false-positive rate. Automation should work with efficient use cases.
- **Manual intervention**. Automated response can have wide ranging effects and high impact automations should have human input to confirm high impact actions before they’re taken.
- **Binary criteria**. To increase response success, decision points within an automated workflow should be as limited as possible, with binary criteria. Binary criteria reduces the need for human intervention, and enhances outcome predictability.
- **Accurate alerts or data**. Response actions are dependent on the accuracy of signals such as alerts. Alerts and enrichment sources should be reliable. Microsoft Sentinel resources such as watchlists and reliable threat intelligence can enhance reliability.
- **Analyst role**. While automation where possible is great, reserve more complex tasks for analysts, and provide them with the opportunity for input into workflows that require validation. In short, response automation should augment and extend analyst capabilities. 

## Migrate SOAR workflow

This section shows how key Splunk SOAR concepts translate to Microsoft Sentinel components, and provides general guidelines for how to migrate each step or component in the SOAR workflow.

:::image type="content" source="media/migration-splunk-automation/splunk-sentinel-soar-workflow-new.png" alt-text="Diagram displaying the Splunk and Microsoft Sentinel SOAR workflows." lightbox="media/migration-splunk-automation/splunk-sentinel-soar-workflow-new.png" border="false":::

|Step (in diagram) |Splunk  |Microsoft Sentinel |
|---------|---------|
|1 |Ingest events into main index.     |Ingest events into the Log Analytics workspace.     |
|2 |Create containers.     |Tag incidents using the [custom details feature](surface-custom-details-in-alerts.md).   |
|3 |Create cases. |Microsoft Sentinel can automatically group incidents according to user-defined criteria, such as shared entities or severity. These alerts then generate incidents.  |
|4 |Create playbooks. |Azure Logic Apps uses several connectors to orchestrate activities across Microsoft Sentinel, Azure, third party and hybrid cloud environments. |
|4 |Create workbooks. |Microsoft Sentinel executes playbooks either in isolation or as part of an ordered automation rule. You can also execute playbooks manually against alerts or incidents, according to a predefined Security Operations Center (SOC) procedure. |

## Map SOAR components 

Review which Microsoft Sentinel or Azure Logic Apps features map to the main Splunk SOAR components.

|Splunk  |Microsoft Sentinel/Azure Logic Apps  |
|---------|---------|
|Playbook editor |[Logic App designer](../logic-apps/logic-apps-overview.md) |
|Trigger     |[Trigger](../logic-apps/logic-apps-overview.md)         |
|• Connectors<br>• App<br>• Automation broker |• [Connector](tutorial-respond-threats-playbook.md)<br>• [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md) |
|Action blocks |[Action](../logic-apps/logic-apps-overview.md) |
|Connectivity broker |[Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md) |
|Community |• [Automation > Templates tab](use-playbook-templates.md)<br>• [Content hub catalog](sentinel-solutions-catalog.md)<br>• [GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Block-OnPremADUser) | 
|Decision |[Conditional control](../logic-apps/logic-apps-control-flow-conditional-statement.md) |
|Code |[Azure Function connector](../logic-apps/logic-apps-azure-functions.md) |
|Prompt |[Send approval email](../logic-apps/tutorial-process-mailing-list-subscriptions-workflow.md) |
|Format |[Data operations](../logic-apps/logic-apps-perform-data-operations.md) |
|Input playbooks |Obtain variable inputs from results of previously executed steps or explicitly declared [variables](../logic-apps/logic-apps-create-variables-store-values.md) |
|Set parameters with Utility block API utility |Manage Incidents with the [API](/rest/api/securityinsights/stable/incidents/get) |

## Operationalize playbooks and automation rules in Microsoft Sentinel

Most of the playbooks that you use with Microsoft Sentinel are available in either the [Automation > Templates tab](use-playbook-templates.md), the [Content hub catalog](sentinel-solutions-catalog.md), or [GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Block-OnPremADUser). In some cases, however, you might need to create playbooks from scratch or from existing templates.

You typically build your custom logic app using the Azure Logic App Designer feature. The logic apps code is based on [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md), which facilitate development, deployment and portability of Azure Logic Apps across multiple environments. To convert your custom playbook into a portable ARM template, you can use the [ARM template generator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/export-microsoft-sentinel-playbooks-or-azure-logic-apps-with/ba-p/3275898).

Use these resources for cases where you need to build your own playbooks either from scratch or from existing templates.
- [Automate incident handling in Microsoft Sentinel](automate-incident-handling-with-automation-rules.md)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
- [How to use Microsoft Sentinel for Incident Response, Orchestration and Automation](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/how-to-use-azure-sentinel-for-incident-response-orchestration/ba-p/2242397)
- [Adaptive Cards to enhance incident response in Microsoft Sentinel](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-microsoft-teams-adaptive-cards-to-enhance-incident/ba-p/3330941)

## SOAR post migration best practices

Here are best practices you should take into account after your SOAR migration:

- After you migrate your playbooks, test the playbooks extensively to ensure that the migrated actions work as expected.
- Periodically review your automations to explore ways to further simplify or enhance your SOAR. Microsoft Sentinel constantly adds new connectors and actions that can help you to further simplify or increase the effectiveness of your current response implementations.
- Monitor the performance of your playbooks using the [Playbooks health monitoring workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-monitoring-your-logic-apps-playbooks-in-azure/ba-p/1873211).
- Use managed identities and service principals: Authenticate against various Azure services within your Logic Apps, store the secrets in Azure Key Vault, and obscure the flow execution output. We also recommend that you  [monitor the activities of these service principals](https://techcommunity.microsoft.com/t5/azure-sentinel/non-interactive-logins-minimizing-the-blind-spot/ba-p/2287932).

## Next steps

In this article, you learned how to map your SOAR automation from Splunk to Microsoft Sentinel. 

> [!div class="nextstepaction"]
> [Export your historical data](migration-splunk-historical-data.md)