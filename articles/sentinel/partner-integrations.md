---
title: Partner integrations with Microsoft Sentinel
description: This article describes best practices for creating your own integrations with Microsoft SEntinelhow run big data queries in Azure Synapse Analytics with Microsoft Sentinel notebooks.
services: sentinel
author: batamig
ms.author: bagol
ms.assetid: 1721d0da-c91e-4c96-82de-5c7458df566b
ms.service: sentinel
ms.subservice: sentinel
ms.topic: conceptual
ms.date: 11/09/2021
---

# Best practices for partners integrating with Microsoft Sentinel

This article reviews best practices and references for creating your own integration solutions with Microsoft Sentinel.

Security Operations (SOC) teams use Microsoft Sentinel to generate detections and investigate and remediate threats. Offering your data, detections, automation, analysis, and packaged expertise to customers by integrating with Microsoft Sentinel provides SOC teams with the information they need to act on informed security responses.

For example, your integration may add value for any of the following goals:

- **Creating detections** out of semi-structured data. For example, your integration might bring new log data, actionable intelligence, analytics rules, hunting rules, guided hunting experiences, or machine learning analysis

- **Contribute to Microsoft Sentinel investigations**. For example, your integration might add new detections, queries, or historical and supporting data, such as extra databases, vulnerability data, compliance, data, and so on.

- **Automation in Microsoft Sentinel**. For example, your integration might include rules for enrichment, remediation, or orchestration security activities within the customer’s environment and infrastructure.

We recommend that you create your integration using Microsoft Sentinel [solutions](sentinel-solutions.md) so that joint customers can discover, deploy, and maximize the value of your partner integration.

## Integrations to collect data

Most Microsoft Sentinel integrations are based on data, and use both the general detection engine and the full-featured investigative engine. Both engines run over data ingested into the Microsoft Sentinel data repository.

Microsoft Sentinel works with the following types of data:

|Type  |Descripton  |
|---------|---------|
|**Unprocessed data**     |  Supports detections and hunting processes. <br><br>Analyze raw operational data in which signs of malicious activity may be present. Bring unprocessed data to Microsoft Sentinel to use Microsoft Sentinel's built-in hunting and detection features to identify new threats and more. <br><br>Examples: Syslog data, CEF data over Syslog, application, firewall, authentication, or access logs, and more.      |
|**Security conclusions**     | Creates alert visibility and opportunity for correlation. <br><br>Alerts and detections are conclusions that have already been made about threats.  Putting detections in context with all the activities and other detections visible in Microsoft Sentinel investigations, saves time for analysts and creates a more complete picture of an incident, resulting in better prioritization and better decisions.    <br><br>Examples: anti-malware alerts, suspicious processes, communication with known bad hosts, network traffic that was blocked and why, suspicious logons, detected password spray attacks, identified phishing attacks, data exfiltration events, and more.    |
|**Reference data**     | Builds context with referenced environments, saving investigation effort and increasing efficiency. <br><br>Examples: CMDBs, high value asset databases, application dependency databases, IP assignment logs, threat intelligence collections for enrichment, and more.|
|**Threat intelligence**     | Powers threat detection by contributing indicators of known threats. <br><br>Threat intelligence can include current indicators that represent immediate threats or historical indicators that are retained for future prevention. Historical data sets are often large and are best referenced ad-hoc, in place, instead of importing them directly to Microsoft Sentinel.|
|     |         |

Each type of data supports different activities in Microsoft Sentinel, and many security products work with multiple types of data at the same time.

For more information, see:

- [Data collection best practices](best-practices-data.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)

## Integrations to monitor and detect

Microsoft Sentinel's monitoring and detection features create automated detections to help customers scale their SOC team's expertise.

The following sections describe monitoring and detection elements that you can include in your integration solution:

### Threat detection rules

Threat detection, or analytics rules are sophisticated detections that can create accurate, meaningful alerts.

Add analytics rules to your integration to help your customers benefit from data from your system in Microsoft Sentinel. For example, analytics rules can help provide expertise and insight about the activities that can be detected in the data your integration delivers.

Analytics are query-based rules that run over the data in the customer's Microsoft Sentinel workspace, and can:

- Output alerts, which are notable events
- Output incidents, which are units of investigation
- Trigger automation playbooks

You can add analytics rules by including them in a solution and via the Microsoft Sentinel  ThreatHunters community. Contribute via the community to encourage community creativity over partner-sourced data, helping customers with more reliable and effective detections.

For more information, see:

[Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
[Investigate incidents with Microsoft Sentinel](investigate-cases.md)
[Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)

### Hunting rules and notebooks

Microsoft Sentinel provides a rich set of hunting abilities that you can use to help customers find unknown threats in the data you supply. You can include tactical hunting queries in your integration to highlight specific knowledge, and even complete, guided hunting experiences.

For more information, see:

- [Hunt for threats with Microsoft Sentinel](hunting.md)
- [Manage hunting and livestream queries in Microsoft Sentinel using REST API](hunting-with-rest-api.md)
- [Use Jupyter notebooks to hunt for security threats](notebooks.md)

### Visualization

The integration you create can also include visualizations to help customers manage and understand your data, by including graphical views of how well data flows into Microsoft Sentinel, and how effectively it contributes to detections.

The clarity provided by visualizations on customizable dashboards can highlight your partner value to customers.

For more information, see [Visualize collected data](get-visibility.md).

## Integrations for investigations

The Microsoft Sentinel investigation graph provides investigators with relevant data when they need it, providing visibility about security incidents and alerts via connected entities. Investigators can use the investigation graph to find relevant or related, contributing events to the threat that's under investigation.

Partners can contribute to the investigation graph by providing:

- **Microsoft Sentinel alerts and incidents**, created via analytics rules in partner solutions
- **Custom exploration queries** for partner-supplied data. Custom exploration queries provide rich exploration and connectivity between data and insights for security investigators.

For more information, see [Investigate incidents with Microsoft Sentinel](investigate-cases.md).

## Integrations for response

Microsoft Sentinel's coordination and remediation features support customers who need to orchestrate and activate remediations quickly and accurately.

Include automation playbooks in your integration solution to support workflows with rich automation, running security-related tasks across customer environments. For example, integration playbooks can help in any of the following ways, and more:

- Helping customers configure security policies in partner products
- Gathering extra data to inform investigative decisions
- Linking Microsoft Sentinel incidents to external management systems
- Integrating alert lifecycle management across partner solutions

For more information, see:

- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Create and customize Microsoft Sentinel playbooks from built-in templates](use-playbook-templates.md)
 
## What to include in your integration?

The following sections describes common partner integration scenarios, and recommendations for what to include in a solution for each scenario.

### Your product generates data that is important to security investigations

**Scenario**: Your product generates data that can inform or is otherwise important for security investigations. Your product may or many not include out-of-the-box detections.

**Example**: Products that supply some form of log data include firewalls, cloud application security brokers, physical access systems, Syslog output, commercially available and enterprise-built LOB applications, servers, network metadata, anything deliverable over Syslog in Syslog or CEF format, or over REST API in JSON format.

**How to use data in Microsoft Sentinel**: Import your product's data into Microsoft Sentinel via a data connector to provide analytics, hunting, investigations, visualizations, and more.

**What to buid**: Include the following elements in your solution:

- A Microsoft Sentinel data connector to deliver the data and link other customizations in the portal.
- Workbooks (recommended)
- Sample queries
- Analytics rules, to build detections based your data in Microsoft Sentinel (recommended)
- Hunting Queries -  Enable hunters with pre-built queries they can use in hunting(Optional)
	Azure Notebooks – Deliver fully guided, repeatable hunting experience. (Optional)


If you provide detections…	Antimalware, Enterprise Detection and Response solutions, Network Detection and Response solutions, Mail Security solutions including anti Phishing products, Vulnerability scanning, Mobile Device Management, UEBA Solutions, Information protection, products, etc.	Making your detection, alert or incident available in Azure Sentinel enables your detections to appear in context with other alerts and incidents.
Consider also delivering the log or metadata that powers your detections as customers routinely ask for it as additional context during investigation.	Build an Azure Sentinel Data connector as above plus:
	Analytics – Create Azure Sentinel Incidents from your detections so they become useable in incident investigations (Recommended)


Supplying Threat Intelligence Indicators	TIP platforms, STIX/TAXII Collections, public or licensed TI Sources.

Reference data: WhoIS, GeoIP, Newly observed Domains, etc.	Current indicators should be delivered to Azure Sentinel for use in Microsoft detection platforms including Sentinel and Defender
Very Large scale or Historical datasets should be used for enrichment scenarios and are best accessed remotely.	Current TI
	Build GSAPI connector to push indicators to Azure Sentinel
	Provide STIX 2.0,2.1 TAXII Server, customers will use built in TAXII data connector.

Historical indicators and/or reference datasets
	Logic app Connector and enrichment workflow playbook


Additional Context	CMDB, High value Asset DB, vIP DBs, Application dependency DBs, Incident Management Systems, Ticketing Systems	Alert and Incident Enrichment.		Logic App connector
	Enrichment workflow playbook
	Potentially external Incident lifecycle management workflow
You can implement security policies 	Firewalls, NDR, EDR, MDM, Identity solutions, Conditional Access solutions, physical access solutions, other products that support block/allow or other actionable security policies	Azure Sentinel actions and workflows enabling remediations and responses to threats 		Logic App connector 
	Action workflow playbook

## References for getting started


Getting Started 
All Azure Sentinel Technical integrations begin with the Azure Sentinel Github Repository and Contribution Guidance.
When you are ready to begin work on your Azure Sentinel Solution. instructions for submitting, packaging and publishing are found in the Guide to Building Azure Sentinel Solutions
Getting to market

Microsoft offers a number of programs to help partners approach Microsoft customers.  

•	Microsoft Partner Network The primary program for partnering with Microsoft is the Microsoft Partner Network.  Membership in MPN is required to become an Azure Marketplace publisher where all Azure Sentinel Solutions are published.

•	Azure Marketplace  Azure Sentinel Solutions are delivered via the Azure Marketplace where customers go to discover and deploy both Microsoft and partner supplied general Azure integrations.  Azure Sentinel Solutions are one many offer types that customers will find.  Azure Sentinel also references your Azure Sentinel Solution Marketplace offers in an embedded Azure Marketplace experience in the Azure Sentinel UI.

•	Microsoft Intelligent Security Association is the program specifically designed to provide Microsoft Security Partners with help creating awareness of partner created integrations with Microsoft customers and helps provide discoverability of your Microsoft Security product integrations.

Joining the MISA program requires a nomination from a participating Microsoft Security Product Team and building the following integrations qualify partners for nomination

	Azure Sentinel Data Connector and associated content – Workbooks, Sample Queries, Analytics Rules
	Published Logic Apps Connector and Azure Sentinel Playbooks.
	API integrations – on a case by case basis.

To request a MISA nomination review or for questions please contact: AzureSentinelPartner@microsoft.com

