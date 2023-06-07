---
title: Partner integrations with Microsoft Sentinel
description: This article describes best practices for creating your own integrations with Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 01/09/2023
---

# Best practices for partners integrating with Microsoft Sentinel

This article reviews best practices and references for creating your own integration solutions with Microsoft Sentinel.

Security Operations (SOC) teams use Microsoft Sentinel to generate detections and investigate and remediate threats. Offering your data, detections, automation, analysis, and packaged expertise to customers by integrating with Microsoft Sentinel provides SOC teams with the information they need to act on informed security responses.

For example, your integration may add value for any of the following goals:

- **Creating detections** out of semi-structured data. For example, your integration might bring new log data, actionable intelligence, analytics rules, hunting rules, guided hunting experiences, or machine-learning analysis

- **Contribute to Microsoft Sentinel investigations**. For example, your integration might add new detections, queries, or historical and supporting data, such as extra databases, vulnerability data, compliance, data, and so on.

- **Automation in Microsoft Sentinel**. For example, your integration might include rules for enrichment, remediation, or orchestration security activities within the customer’s environment and infrastructure.

We recommend that you package and publish your integration as a Microsoft Sentinel [solutions](sentinel-solutions.md) so that joint customers can discover, deploy, and maximize the value of your partner integration.  Microsoft Sentinel solutions are published in Azure Marketplace and appear in the Microsoft Sentinel Content hub.

## Integrations to collect data

Most Microsoft Sentinel integrations are based on data, and use both the general detection engine and the full-featured investigative engine. Both engines run over data ingested into the Microsoft Sentinel data repository.

Microsoft Sentinel works with the following types of data:

|Type  |Description  |
|---------|---------|
|**Unprocessed data**     |  Supports detections and hunting processes. <br><br>Analyze raw operational data in which signs of malicious activity may be present. Bring unprocessed data to Microsoft Sentinel to use Microsoft Sentinel's built-in hunting and detection features to identify new threats and more. <br><br>Examples: Syslog data, CEF data over Syslog, application, firewall, authentication, or access logs, and more.      |
|**Security conclusions**     | Creates alert visibility and opportunity for correlation. <br><br>Alerts and detections are conclusions that have already been made about threats.  Putting detections in context with all the activities and other detections visible in Microsoft Sentinel investigations, saves time for analysts and creates a more complete picture of an incident, resulting in better prioritization and better decisions.    <br><br>Examples: anti-malware alerts, suspicious processes, communication with known bad hosts, network traffic that was blocked and why, suspicious logons, detected password spray attacks, identified phishing attacks, data exfiltration events, and more.    |
|**Reference data**     | Builds context with referenced environments, saving investigation effort and increasing efficiency. <br><br>Examples: CMDBs, high value asset databases, application dependency databases, IP assignment logs, threat intelligence collections for enrichment, and more.|
|**Threat intelligence**     | Powers threat detection by contributing indicators of known threats. <br><br>Threat intelligence can include current indicators that represent immediate threats or historical indicators that are kept for future prevention. Historical data sets are often large and are best referenced ad-hoc, in place, instead of importing them directly to Microsoft Sentinel.|


Each type of data supports different activities in Microsoft Sentinel, and many security products work with multiple types of data at the same time.



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

### Hunting rules and notebooks

Microsoft Sentinel provides a rich set of hunting abilities that you can use to help customers find unknown threats in the data you supply. You can include tactical hunting queries in your integration to highlight specific knowledge, and even complete, guided hunting experiences.


### Visualization

The integration you create can also include visualizations to help customers manage and understand your data, by including graphical views of how well data flows into Microsoft Sentinel, and how effectively it contributes to detections.

The clarity provided by visualizations on customizable dashboards can highlight your partner value to customers.


## Integrations for investigations

The Microsoft Sentinel investigation graph provides investigators with relevant data when they need it, providing visibility about security incidents and alerts via connected entities. Investigators can use the investigation graph to find relevant or related, contributing events to the threat that's under investigation.

Partners can contribute to the investigation graph by providing:

- **Microsoft Sentinel alerts and incidents**, created via analytics rules in partner solutions
- **Custom exploration queries** for partner-supplied data. Custom exploration queries provide rich exploration and connectivity between data and insights for security investigators.


## Integrations for response

Microsoft Sentinel's coordination and remediation features support customers who need to orchestrate and activate remediations quickly and accurately.

Include automation playbooks in your integration solution to support workflows with rich automation, running security-related tasks across customer environments. For example, integration playbooks can help in any of the following ways, and more:

- Helping customers configure security policies in partner products
- Gathering extra data to inform investigative decisions
- Linking Microsoft Sentinel incidents to external management systems
- Integrating alert lifecycle management across partner solutions


## What to include in your integration?

The following sections describe common partner integration scenarios, and recommendations for what to include in a solution for each scenario.

### Your product generates data that is important to security investigations

**Scenario**: Your product generates data that can inform or is otherwise important for security investigations. Your product may or may not include out-of-the-box detections.

**Example**: Products that supply some form of log data include firewalls, cloud application security brokers, physical access systems, Syslog output, commercially available and enterprise-built LOB applications, servers, network metadata, anything deliverable over Syslog in Syslog or CEF format, or over REST API in JSON format.

**How to use your data in Microsoft Sentinel**: Import your product's data into Microsoft Sentinel via a data connector to provide analytics, hunting, investigations, visualizations, and more.

**What to build**: For this scenario, include the following elements in your solution:

|Type  |Elements to include  |
|---------|---------|
|**Required**     |  - A Microsoft Sentinel data connector to deliver the data and link other customizations in the portal.  <br><br>Sample data queries     |
|**Recommended**     | - Workbooks <br><br>- Analytics rules, to build detections based your data in Microsoft Sentinel       |
|**Optional**     |  - Hunting queries, to provide hunters with out-of-the-box queries to use when hunting <br><br>- Notebooks, to deliver a fully guided, repeatable hunting experience       |


### Your product provides detections

**Scenario**: Your product provides detections that complement alerts and incidents from other systems

**Examples**: Antimalware, enterprise detection and response solutions, network detection and response solutions, mail security solutions such as anti-phishing products, vulnerability scanning, mobile device management solutions, UEBA solutions, information protection services, and so on.

**How to use your data in Microsoft Sentinel**: Make your detections, alerts, or incidents available in Microsoft Sentinel to show them in context with other alerts and incidents that may be occurring in your customers' environments. Also consider delivering the logs and metadata that power your detections, as extra context for investigations.

**What to build**: For this scenario, include the following elements in your solution:

|Type  |Elements to include  |
|---------|---------|
|**Required**     |  A Microsoft Sentinel data connector to deliver the data and link other customizations in the portal.   |
|**Recommended**     | Analytics rules, to create Microsoft Sentinel incidents from your detections that are helpful in investigations |



### Your product supplies threat intelligence indicators

**Scenario**: Your product supplies threat intelligence indicators that can provide context for security events occurring in customers' environments

**Examples**: TIP platforms, STIX/TAXII collections, and public or licensed threat intelligence sources. Reference data, such as WhoIS, GeoIP, or newly observed domains.


**How to use your data in Microsoft Sentinel**: Deliver current indicators to Microsoft Sentinel for use across Microsoft detection platforms. Use large scale or historical datasets for enrichment scenarios, via remote access.

**What to build**: For this scenario, include the following elements in your solution:

|Type  |Elements to include  |
|---------|---------|
|**Current threat intelligence**     |  Build a GSAPI data connector to push indicators to Microsoft Sentinel. <br><br>Provide a STIX 2.0 or 2.1 TAXII Server that customers can use with the out-of-the-box TAXII data connector. |
|**Historical indicators and/or reference datasets**     | Provide a logic app connector to access the data and an enrichment workflow playbook that directs the data to the correct places.|


### Your product provides extra context for investigations

**Scenario**: Your product provides extra, contextual data for investigations based in Microsoft Sentinel.

**Examples**: Extra context CMDBs, high value asset databases, VIP databases, application dependency databases, incident management systems, ticketing systems

**How to use your data in Microsoft Sentinel**: Use your data in Microsoft Sentinel to enrich both alerts and incidents.

**What to build**: For this scenario, include the following elements in your solution:

- A Logic App connector
- An enrichment workflow playbook
- An external incident lifecycle management workflow (optional)

### Your product can implement security policies

**Scenario**: Your product can implement security policies in Azure Policy and other systems

**Examples**: 	Firewalls, NDR, EDR, MDM, Identity solutions, Conditional Access solutions, physical access solutions, or other products that support block/allow or other actionable security policies

**How to use your data in Microsoft Sentinel**: Microsoft Sentinel actions and workflows enabling remediations and responses to threats

**What to build**: For this scenario, include the following elements in your solution:

- A Logic App connector
- An action workflow playbook

## References for getting started

All Microsoft Sentinel technical integrations begin with the [Microsoft Sentinel GitHub Repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions) and [Contribution Guidance](https://github.com/Azure/Azure-Sentinel#contributing).

When you're ready to begin work on your Microsoft Sentinel solution, find instructions for submitting, packaging, and publishing in the [Guide to Building Microsoft Sentinel Solutions](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions#guide-to-building-azure-sentinel-solutions).

### Getting to market

Microsoft offers the programs to help partners approach Microsoft customers:

- [Microsoft Partner Network](https://partner.microsoft.com/) (MPN). The primary program for partnering with Microsoft is the Microsoft Partner Network.  Membership in MPN is required to become an Azure Marketplace publisher, which is where all Microsoft Sentinel solutions are published.

- [Azure Marketplace](https://azure.microsoft.com/marketplace/). Microsoft Sentinel solutions are delivered via the Azure Marketplace, which is where customers go to discover and deploy both Microsoft- and partner-supplied general Azure integrations.

    Microsoft Sentinel solutions are one of many types of offers found in the Marketplace. You can also find the solution offerings embedded in the Microsoft Sentinel [content hub](sentinel-solutions-catalog.md)

- [Microsoft Intelligent Security Association](https://www.microsoft.com/security/partnerships/intelligent-security-association) (MISA). MISA provides Microsoft Security Partners with help in creating awareness about partner-created integrations with Microsoft customers, and helps to provide discoverability for Microsoft Security product integrations.

    Joining the MISA program requires a nomination from a participating Microsoft Security Product Team. Building any of the following integrations can qualify partners for nomination:


    - A Microsoft Sentinel data connector and associated content, such as workbooks, sample queries, and analytics rules
    - Published Logic Apps connector and Microsoft Sentinel playbooks.
    - API integrations, on a case-by-case basis

    To request a MISA nomination review or for questions, contact [AzureSentinelPartner@microsoft.com](mailto:AzureSentinelPartner@microsoft.com).

## Next steps

For more information, see:

**Data collection**:
- [Data collection best practices](best-practices-data.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Understand threat intelligence in Microsoft Sentinel](understand-threat-intelligence.md)


**Threat detection**:
- [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)

**Hunting and notebooks**
- [Hunt for threats with Microsoft Sentinel](hunting.md)
- [Manage hunting and livestream queries in Microsoft Sentinel using REST API](hunting-with-rest-api.md)
- [Use Jupyter notebooks to hunt for security threats](notebooks.md)

**Visualization**: [Visualize collected data](get-visibility.md).

**Investigation**: [Investigate incidents with Microsoft Sentinel](investigate-cases.md).

**Response**:
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Create and customize Microsoft Sentinel playbooks from built-in templates](use-playbook-templates.md)
 

