---
title: "Microsoft Sentinel migration: Update SOC and analyst processes | Microsoft Docs"
description: Learn how to update your SOC and analyst processes as part of your migration to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Update SOC processes

A security operations center (SOC) is a centralized function within an organization that integrates people, processes, and technology. A SOC implements the organization's overall cybersecurity framework. The SOC collaborates the organizational efforts to monitor, alert, prevent, detect, analyze, and respond to cybersecurity incidents. SOC teams, led by a SOC manager, may include incident responders, SOC analysts at levels 1, 2, and 3, threat hunters, and incident response managers.

SOC teams use telemetry from across the organization's IT infrastructure, including networks, devices, applications, behaviors, appliances, and information stores. The teams then co-relate and analyze the data, to determine how to manage the data and which actions to take. 

To successfully migrate to Microsoft Sentinel, you need to update not only the technology that the SOC uses, but also the SOC tasks and processes. This article describes how to update your SOC and analyst processes as part of your migration to Microsoft Sentinel. 

## Update analyst workflow 

Microsoft Sentinel offers a range of tools that map to a typical analyst workflow, from incident assignment to closure. Analysts can flexibly use some or all of the available tools to triage and investigate incidents. As your organization migrates to Microsoft Sentinel, your analysts need to adapt to these new toolsets, features, and workflows. 

### Incidents in Microsoft Sentinel

In Microsoft Sentinel, an incident is a collection of alerts that Microsoft Sentinel determines have sufficient fidelity to trigger the incident. Hence, with Microsoft Sentinel, the analyst triages incidents in the **Incidents** page first, and then proceeds to analyze alerts, if a deeper dive is needed. [Compare your SIEM's incident terminology and management areas](#compare-siem-concepts) with Microsoft Sentinel.

### Analyst workflow stages

This table describes the key stages in the analyst workflow, and highlights the specific tools relevant to each activity in the workflow.

|Assign  |Triage  |Investigate  |Respond  |
|---------|---------|---------|---------|
|**[Assign incidents](#assign)**:<br>• Manually, in the **Incidents** page <br>• Automatically, using playbooks or automation rules  |**[Triage incidents](#triage)** using:<br>• The incident details in the **Incident** page<br>• Entity information in the **Incident page**, under the **Entities** tab<br>• Jupyter Notebooks     |**[Investigate incidents](#investigate)** using:<br>• The investigation graph<br>• Microsoft Sentinel Workbooks<br>• The Log Analytics query window      |**[Respond to incidents](#respond)** using:<br>• Playbooks and automation rules<br>• Microsoft Teams War Room  |

The next sections map both the terminology and analyst workflow to specific Microsoft Sentinel features.

#### Assign

Use the Microsoft Sentinel **Incidents** page to assign incidents. The **Incidents** page includes an incident preview, and a detailed view for single incidents. 

:::image type="content" source="media/migration-soc-processes/analyst-workflow-incidents.png" alt-text="Screenshot of Microsoft Sentinel Incidents page." lightbox="media/migration-soc-processes/analyst-workflow-incidents.png":::

To assign an incident:
- **Manually**. Set the **Owner** field to the relevant user name. 
- **Automatically**. [Use a custom solution based on Microsoft Teams and Logic Apps](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/automate-incident-assignment-with-shifts-for-teams/ba-p/2297549), [or an automation rule](automate-incident-handling-with-automation-rules.md).

:::image type="content" source="media/migration-soc-processes/analyst-workflow-assign-incidents.png" alt-text="Screenshot of assigning an owner in the Incidents page." lightbox="media/migration-soc-processes/analyst-workflow-assign-incidents.png":::

#### Triage

To conduct a triage exercise in Microsoft Sentinel, you can start with various Microsoft Sentinel features, depending on your level of expertise and the nature of the incident under investigation. As a typical starting point, select **View full details** in the **Incident** page. You can now examine the alerts that comprise the incident, review bookmarks, select entities to drill down further into specific entities, or add comments.

:::image type="content" source="media/migration-soc-processes/analyst-workflow-incident-details.png" alt-text="Screenshot of viewing incident details in the Incidents page." lightbox="media/migration-soc-processes/analyst-workflow-incidents.png":::

Here are suggested actions to continue your incident review:
- Select **Investigation** for a visual representation of the relationships between the incidents and the relevant entities. 
- Use a [Jupyter notebook](notebooks.md) to perform an in-depth triage exercise for a particular entity. You can use the **Incident triage** notebook for this exercise.

:::image type="content" source="media/migration-soc-processes/analyst-workflow-incident-triage-notebook.png" alt-text="Screenshot of Incident triage notebook, including detailed steps in TOC." lightbox="media/migration-soc-processes/analyst-workflow-incident-triage-notebook.png":::

##### Expedite triage

Use these features and capabilities to expedite triage:

- For quick filtering, in the **Incidents** page, [search for incidents](investigate-cases.md#search-for-incidents) associated to a specific entity. Filtering by entity in the **Incidents** page is faster than filtering by the entity column in legacy SIEM incident queues. 
- For faster triage, use the **[Alert details](customize-alert-details.md)** screen to include key incident information in the incident name and description, such as the related user name, IP address, or host. For example, an incident could be dynamically renamed to `Ransomware activity detected in DC01`, where `DC01` is a critical asset, dynamically identified via the customizable alert properties.  
- For deeper analysis, in the **Incidents page**, select an incident and select **Events** under **Evidence** to view specific events that triggered the incident. The event data is visible as the output of the query associated with the analytics rule, rather than the raw event. The rule migration engineer can use this output to ensure that the analyst gets the correct data.
- For detailed entity information, in the **Incidents page**, select an incident and select an entity name under **Entities** to view the entity's directory information, timeline, and insights. Learn how to [map entities](map-data-fields-to-entities.md).
- To link to relevant workbooks, select **Incident preview**. You can customize the workbook to display additional information about the incident, or associated entities and custom fields.

#### Investigate

Use the investigation graph to deeply investigate incidents. From the **Incidents** page, select an incident and select **Investigate** to view the [investigation graph](investigate-cases.md#use-the-investigation-graph-to-deep-dive).

:::image type="content" source="media/migration-soc-processes/analyst-workflow-investigation-graph.png" alt-text="Screenshot of the investigation graph." lightbox="media/migration-soc-processes/analyst-workflow-investigation-graph.png":::

With the investigation graph, you can:
- Understand the scope and identify the root cause of potential security threats by correlating relevant data with any involved entity. 
- Dive deeper into entities, and choose between different expansion options. 
- Easily see connections across different data sources by viewing relationships extracted automatically from the raw data.
- Expand your investigation scope using built-in exploration queries to surface the full scope of a threat. 
- Use predefined exploration options to help you ask the right questions while investigating a threat. 

From the investigation graph, you can also open workbooks to further support your investigation efforts. Microsoft Sentinel includes several workbook templates that you can customize to suit your specific use case. 

:::image type="content" source="media/migration-soc-processes/analyst-workflow-investigation-workbooks.png" alt-text="Screenshot of a workbook opened from the investigation graph." lightbox="media/migration-soc-processes/analyst-workflow-investigation-workbooks.png":::

#### Respond

Use Microsoft Sentinel automated response capabilities to respond to complex threats and reduce alert fatigue. Microsoft Sentinel provides automated response using [Logic Apps playbooks and automation rules](automate-responses-with-playbooks.md). 

:::image type="content" source="media/migration-soc-processes/analyst-workflow-playbooks.png" alt-text="Screenshot of Playbook templates tab in Automation blade." lightbox="media/migration-soc-processes/analyst-workflow-playbooks.png":::

Use one of the following options to access playbooks:
- The [Automation > Playbook templates tab](use-playbook-templates.md)
- The Microsoft Sentinel [Content hub](sentinel-solutions-deploy.md) 
- The Microsoft Sentinel [GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks)  

These sources include a wide range of security-oriented playbooks to cover a substantial portion of use cases of varying complexity. To streamline your work with playbooks, use the templates under **Automation > Playbook templates**. Templates allow you to easily deploy playbooks into the Microsoft Sentinel instance, and then modify the playbooks to suit your organization's needs. 

See the [SOC Process Framework](https://github.com/Azure/Azure-Sentinel/wiki/SOC-Process-Framework) to map your SOC process to Microsoft Sentinel capabilities.

## Compare SIEM concepts

Use this table to compare the main concepts of your legacy SIEM to Microsoft Sentinel concepts. 

| ArcSight | QRadar | Splunk | Microsoft Sentinel |
|--|--|--|--|
| Event | Event | Event | Event |
| Correlation Event | Correlation Event | Notable Event | Alert |
| Incident | Offense | Notable Event | Incident |
|  | List of offenses | Tags | Incidents page |
| Labels | Custom field in SOAR | Tags | Tags |
|  | Jupyter Notebooks | Jupyter Notebooks | Microsoft Sentinel notebooks |
| Dashboards | Dashboards | Dashboards | Workbooks |
| Correlation rules | Building blocks | Correlation rules | Analytics rules |
|Incident queue |Offences tab |Incident review |**Incident** page |

## Next steps

After migration, explore Microsoft's Microsoft Sentinel resources to expand your skills and get the most out of Microsoft Sentinel. 

Also consider increasing your threat protection by using Microsoft Sentinel alongside [Microsoft Defender XDR](./microsoft-365-defender-sentinel-integration.md) and [Microsoft Defender for Cloud](../security-center/azure-defender.md) for [integrated threat protection](https://www.microsoft.com/security/business/threat-protection). Benefit from the breadth of visibility that Microsoft Sentinel delivers, while diving deeper into detailed threat analysis.

For more information, see:

- [Rule migration best practices](https://techcommunity.microsoft.com/t5/azure-sentinel/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417)
- [Webinar: Best Practices for Converting Detection Rules](https://www.youtube.com/watch?v=njXK1h9lfR4)
- [Security Orchestration, Automation, and Response (SOAR) in Microsoft Sentinel](automation.md)
- [Manage your SOC better with incident metrics](manage-soc-with-incident-metrics.md)
- [Microsoft Sentinel learning path](/training/paths/security-ops-sentinel/)
- [SC-200 Microsoft Security Operations Analyst certification](/certifications/exams/sc-200)
- [Microsoft Sentinel Ninja training](https://techcommunity.microsoft.com/t5/azure-sentinel/become-an-azure-sentinel-ninja-the-complete-level-400-training/ba-p/1246310)
- [Investigate an attack on a hybrid environment with Microsoft Sentinel](https://mslearn.cloudguides.com/guides/Investigate%20an%20attack%20on%20a%20hybrid%20environment%20with%20Azure%20Sentinel)
