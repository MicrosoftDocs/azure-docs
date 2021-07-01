---
title: Best practices for incident management and response in Azure Sentinel
description: Learn about best practices for managing and responding to incidents in Azure Sentinel.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 06/21/2021
---

# Best practices for incident management and response

This article reviews best practices for managing and responding to incidents in Azure Sentinel.

## Incident management process

If an incident has been created in Azure Sentinel, following the following steps to respond and manage the risk:

- Triage
- Preparation
- Remediation
- Eradication
- Post incident activities

This process allows for a direct and concise lifecycle of an incident within the SOC and provides direction for how the flow of actions should be. 

## Incidents Page and Investigation Graph

Within Azure Sentinel, all incidents that have been generated will be located within the Incidents page. This page serves to be the location for triage and early investigation. This page will show the title, severity, related alerts, related logs, and entities of interest. These incidents also provide a quick way to jump into the logs collected and related tools that factor into the incident. This page works in tandem with the investigation graph, which is an interactive UI that allows users to explore and expand an alert to show the full scope of an attack, construct a timeline of events, and discover the extent of a threat chain. 
The best practice when an incident is created is to begin the triage process within Azure Sentinel on the incidents page. This page will show key items like the entities (account, URL, IP, Host name, etc) involved, the activities that took place, and the time it happened. This can immediately lead to the discovery that an incident is a false positive and the incident can be closed. The Investigation Graph can assist in this process by allowing for the SOC Analyst to dive into the events and related information within the graph that can lead to the decision on whether an incident is true positive or not.
If the incident is a true positive, there are options within the incident page that the SOC analysts can use: investigate logs, investigate entities, jump into the investigation graph to explore the threat chain and create a timeline, and more. Once the threat has been identified and a plan of action is made, the analysts can begin to use tools within Azure Sentinel, Azure, or external tools for the investigation.

## Incidents with Workbooks

A Workbook’s primary purpose is to visualize and display information and trends but they can also be used as investigative tools. For example, using the Investigation Insights workbook can assist in investigating specified incidents, while presenting the entities and alerts associated with them. Within the workbook, there is a section that allows for deeper investigation into the entities chosen by showing related logs, actions, and alerts. It is best to use or build these types of Workbooks when looking to use tools during an investigation.

## Incidents with Threat Hunting

Threat Hunting can come into play while performing an investigation and assist with pointing out possible root causes. A best practice with Threat Hunting during an investigation is to run the out-of-the-box queries to show if there are results that may show indicators of compromise. During or after the investigation, the Livestream feature within Threat Hunting can be used to monitor if malicious events are still taking place. Livestream will take a query and run it constantly while showing results in real time. This will show if an attacker is still performing tasks to comprise the environment or if there are lingering malicious events after remediation and eradication was performed.

## Incidents with Entity Behavior

Entity Behavior is a newer feature that allows users to review and investigate actions and alerts for specific entities. In this case, Entity Behavior allows for investigations into accounts and host names. The best practice for using Entity Behavior is to take the entities from the incident and review the alerts and actions for each individual entity listed. Entity Behavior will streamline the effort and lead to a more efficient investigation by showing all related information and alerts for a single item instead of all associated items.

## Incidents with Watchlists/TI

When looking to utilize the Threat Intelligence that Azure Sentinel provides, it is best to connect the data sources required by the Fusion and TI Map alerts in order to maximize Threat Intelligence based detections. Another best practice is to ingest indicators from TAXII or MISP platforms, or to use the Microsoft Threat Intelligence Connector to begin ingesting IOCs that are available to utilize in detection rules. The IOCs can be used when threat hunting, investigating logs, or generating additional incidents.

For Watchlists, it is best to have a combination of lists that cover both data from the logs that are being ingested and external data that might not be in the logs but enrich the ingested data. Examples would be to have a list of IP ranges that are used by the organization, recently terminated employees, and more. Watchlists can also be used within Playbooks to gather enrichment data based on items such as malicious IP and add the IP to a Watchlist that can be used in detections, threat hunting, and investigations. During an incident, Watchlists can be used to contain investigation data to use within Sentinel features then deleted after the investigation is completed in order to make sure that sensitive data does not remain in view.
