---
title: Update SOC processes | Microsoft Docs
description: Learn how to update your SOC and analyst processes as part of your migration to Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Update SOC processes

A security operations center (SOC) is a centralized function within an organization that integrates people, processes, and technology. A SOC implements the organization's overall cybersecurity framework, and acts as the central point of collaboration in the organizational efforts to monitor, alert, prevent, detect, analyze, and respond to cybersecurity incidents. SOC teams, usually led by a SOC manager, may include incident responders, SOC analysts at levels 1, 2, and 3, threat hunters, and incident response managers.

SOC teams: 
- Are responsible for many organizational assets, including personnel data, business systems, intellectual and brand integrity.
- Use telemetry from across the organization's IT infrastructure, including networks, devices, applications, behaviors, appliances, and information stores.
- Co-relate and analyze the data, to determine how to manage the data and which actions to take. 

To successfully migrate to Microsoft Sentinel, you need to update not only the technology the SOC uses, but also the SOC tasks and processes. 

This article describes how to update your SOC and analyst processes as part of your migration to Microsoft Sentinel. 

## Update analyst workflow 

Microsoft Sentinel offers a range of tools that map to a typical analyst workflow, from incident assignment to closure. Analysts can flexibly leverage some or all of the available tools to triage and investigate incidents. As your organization migrates to Microsoft Sentinel, your analysts need to adapt to these new toolsets, features, and workflows. 

##### Incidents in Microsoft Sentinel

In Microsoft Sentinel, an incident is a collection of alerts that Microsoft Sentinel determines have sufficient fidelity to trigger the incident. Hence, with Microsoft Sentinel, the analyst triages incidents in the **Incidents** page first, and then moves to analyzing alerts, if a deeper dive is needed. This table compares the incident terminology and management areas in the different SIEMs.

|ArcSight  |QRadar  |Splunk  |Microsoft Sentinel  |
|---------|---------|---------|---------|
|Pipeline     |Offences tab         |Incident Review         |**Incident** page         |

#### Analyst workflow stages

This table describes the key stages in the analyst workflow, and highlights the specific tools relevant to each activity in the workflow.

|Assign  |Triage  |Investigate  |Respond  |
|---------|---------|---------|---------|
|**[Assign incidents](#assign)**:<br>• Manually, in the **Incidents** page <br>• Automatically, using playbooks or automation rules  |**[Triage incidents](#triage)**<br>• In the Incident Detail page<br>• In the Entity page<br>• Using Sentinel Notebooks.     |**[Investigate incidents](#investigate)**:<br>• The investigation graph<br>• Workbooks<br>• The Log Analytics query window.      |**[Responds to incidents](#respond)**:<br>• Playbooks and automation rules.<br>• Microsoft Teams War Room.  |

The next sections map both the terminology and end-to-end analyst workflow to specific Microsoft Sentinel features.

##### Assign

Use the Microsoft Sentinel **Incidents** page to assign incidents. The **Incidents** page includes an incident preview, and a detailed view for single incidents. 

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-incidents.png" alt-text="Screenshot of Incidents page." lightbox="media/migration-analyst-workflow/analyst-workflow-incidents.png":::

To assign an incident:
- **Manually**. Set the **Owner** field to the relevant user name. 
- **Automatically**. [Use a custom solution based on Microsoft Teams and Logic Apps](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/automate-incident-assignment-with-shifts-for-teams/ba-p/2297549), or an automation rule. You can also use the **Incident-Assignment-Shifts** playbook template in the **Automation** blade templates gallery. 

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-assign-incidents.png" alt-text="Screenshot of assigning an owner in the Incidents page." lightbox="media/migration-analyst-workflow/analyst-workflow-assign-incidents.png":::

##### Triage

To conduct a triage exercise in Microsoft Sentinel, you can start with a variety of Microsoft Sentinel features, depending on your level of expertise and the nature of the incident under investigation. As a typical starting point, select **View full details** in the **Incident** page. You can now examine the alerts that comprise the incident, review bookmarks, select entities to drill down further into specific entities, or add comments.

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-incident-details.png" alt-text="Screenshot of View full details view in Incidents page." lightbox="media/migration-analyst-workflow/analyst-workflow-incidents.png":::

Here are additional actions to continue your incident review:
- Select **Investigation** for a visual representation of the relationships between the incidents and the relevant entities. 
- Leverage a [Jupyter notebook](notebooks.md), to perform an in-depth triage exercise for a particular entity. You can use the **Incident triage** notebook for this exercise. The notebook includes the following steps.

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-incident-triage-notebook.png" alt-text="Screenshot of View full details view in Incidents page." lightbox="media/migration-analyst-workflow/analyst-workflow-incident-triage-notebook.png":::

###### Expedite triage

Use these features and capabilities to expedite triage:

- For quick filtering, in the **Incidents** page, [search for incidents](investigate-cases#search-for-incidents.md) associated to a specific entity. This is a much faster method than filtering by the entity column in legacy SIEM incident queues. 
- For faster triage, use the **[Alert details](customize-alert-details.md)** screen to include key incident information in the incident name and description, such as the related user name, IP address, or account. For example, an incident could be dynamically renamed to `Ransomware activity detected in DC01`, where `DC01` is a critical asset, dynamically identified via the customizable alert properties.  
- For accurate and accessible data, in the **Incidents page**, select an incident and select **Events** under **Evidence** to view specific events that triggered the incident. The event data is visible as the output of the query associated with the analytics rule, rather than the raw event. This allows the rule migration engineer to ensure that the analyst gets the correct data. If your analyst might need more information than the query can return, refer to .  
- For detailed entity information, in the **Incidents page**, select an incident and select an entity name under **Entities** to view the entity's directory information, timeline, and insights. Learn how to [map entities](map-data-fields-to-entities.md).
- To link to relevant workbooks, select **Incident preview**. You can customize the workbook to display additional information about the incident, or associated entities and custom fields.

#### Investigate

Use the investigation graph to deeply investigate incidents. From the **Incidents** page, select an incident and select **Investigate** to view the [investigation graph](#investigate-cases#use-the-investigation-graph-to-deep-dive.md).

With the investigation graph, you can:
- Understand the scope and identify the root cause of potential security threats by correlating relevant data with any involved entity. 
- Dive deeper into entities, and choose between different expansion options. 
- Easily see connections across different data sources by viewing relationships extracted automatically from the raw data.
- Expand your investigation scope using built-in exploration queries to surface the full scope of a threat. 
- Use predefined exploration options to help you ask the right questions while investigating a threat. 

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-investigation-graph.png" alt-text="Screenshot of the investigation graph." lightbox="media/migration-analyst-workflow/analyst-workflow-investigation-graph":::

From the investigation graph, you can also pivot to workbooks and use to further support your investigation efforts. Microsoft Sentinel includes several workbook templates that you can customize to suit your specific use case. 

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-investigation-workbooks.png" alt-text="Screenshot of View full details view in Incidents page." lightbox="media/migration-analyst-workflow/analyst-workflow-investigation-workbooks.png":::

#### Respond

Use Microsoft Sentinel automated response capabilities to respond to complex threats and reduce alert fatigue. Microsoft Sentinel provides automated response using [Logic Apps playbooks and automation rules](automate-responses-with-playbooks.md). 

Use one of the following options to access playbooks:
- Use the **Playbook templates** tab under the **Automation** blade
- The content hub 
- The Microsoft Sentinel GitHub repo  

These sources include a wide range of security-oriented playbooks to cover a substantial portion of use cases of varying complexity. To streamline your work with playbooks, use the templates under **Automation > Playbook templates** in Microsoft Sentinel. Using this source, you can easily deploy playbooks into the Microsoft Sentinel instance, and then modify the playbooks to suit your organization's needs.

:::image type="content" source="media/migration-analyst-workflow/analyst-workflow-playbooks.png" alt-text="Screenshot of Playbook templates tab in Automation blade." lightbox="media/migration-analyst-workflow/analyst-workflow-playbooks.png":::

See the [SOC Process Framework](https://github.com/Azure/Azure-Sentinel/wiki/SOC-Process-Framework) to map SOC process to Microsoft Sentinel capabilities.