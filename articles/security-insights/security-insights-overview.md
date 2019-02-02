---
title: What is Azure Security Insights?| Microsoft Docs
description: Learn about Azure Security insights, its key capabilities, and how it works.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 59f327ab-ad93-4904-82ce-885820796a54
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2018
ms.author: rkarlin

---
# What is Azure Security Insights?

Azure Security Insights is the first SIEM-as-a-Service that brings the power of the cloud and artificial intelligence to help security operations teams efficiently identify and stop cyber attacks before they cause harm. While the number and type of threats continues to grow, and there's a shortage of security analysts. With so many different providers, it's a challenge for security teams to import and analyze the range of data logs, and traditional SIEMs are hard to maintain and scale. And after the difficult integration, you're left with mountains of unprioritized data that never gets touched. 

Security Insights harnesses the strength of the cloud to make this SIEM easier to update and manage. Building on the full range of existing Azure services, Security Insights natively incorporates powerful engines that have already been tried and tested, like Log Analytics. Security Insights enriches your investigation and detection by providing both Microsoft's threat intelligence stream as well as external threat intelligence streams. Security Insights makes this easier for you, by providing a single dashboard in which to perform investigation and remediation, and provide automation to move smoothly between detection and remediation and to help save you time performing complex investigation. 

## Security Insights connections
Azure Security Insights enables seamless data collection from services in the Microsoft ecosystem as well as third-party data sources like servers, network equipment, and security appliances like firewalls. Security Insights enables data collection in real time to allow for immediate analysis. Data collection methods include agents that are installed directly on monitored event source, collection of data using APIs provided by monitored event source and real-time syslog stream collection.

![Security Insights core capabilities](./media/security-insights-intro/core-capabilities.png)

Security Insights enables connection of:
- Native service-to-service integration of all Microsoft solutions and their raw data.
   - Alerts from Microsoft solutions:
        - Azure Active Directory Identity Protection
        - Azure Security Center
        - Azure Advanced Threat Protection
        - Office ATP 
        - Cloud App Security
        - Windows Defender ATP
    - Microsoft raw data
        - Office 365 Audit Logs
        - Azure AD Audit Logs and Signings
        - Azure Activity
        - SQL auditing

    - Servers and endpoints:
        - Windows Servers 
        - Linux Servers
        - IIS logs
        - Windows Event Forwarding
        - DNS Logs
        - DHCP
    - Security solutions via CEF
        - Firewall
        - Proxy Servers
        - DLP
    - Syslog
    - Third-party solutions via REST API

## Detections and analytics

Security Insights provides you with custom alerts. You can use the built-in correlation rules designed by Microsoft analysts or use the simple tools that enable you to build your own. Security Insights also provides machine learning rules that look for anomalies across your resources.

## Investigation

The Security Insights dashboards provide customized views of data ingested to Azure Security Insights.
Security Insights deep investigation tools include interactive visualization and advanced analytics that help you lower the bar to understand what to investigate and help you understand the scope of the incident. You can create custom alert policies that enable your security analysts to define alerts based on data that is ingested in Security Insights.

Security insights provides interactive visualization using advanced analytics to help security analysts get a better understanding of what’s going on during an attack. The investigation tools enable you to deep dive on any field from any data to rapidly develop threat context.


## Automate & orchestrate responses

Built on the foundation of Azure Logic Apps, the Security Insights automation and orchestration solution provides a highly extensible architecture that enables scalable automation as new technologies and threats emerge. To build solutions with Azure Logic Apps, you can choose from a growing gallery with [200+ connectors](https://docs.microsoft.com/en-us/azure/connectors/apis-list), that include services such as Azure Service Bus, Functions, and Storage, SQL, Office 365, Dynamics, Salesforce, BizTalk, SAP, Oracle DB and file shares. 

For example, if you use ServiceNow, you can use the tools provided to use Azure Logic Apps to automate your workflows and open a ticket in ServiceNow each time a particular event is detected.

## Hunting

Use Security Insights' powerful hunting search and query tools to proactively hunt for security threats across your organization’s data sources. After you discover which hunting
query provides high value insights into possible attacks, you can also create custom detection rules based on your query and surface those insights as alerts to your security incident responders.

With Security Insights hunting, you can take advantage of the following capabilities:

-   **Query examples**: To get you started, Security Insights provides preloaded query examples designed to get you started and get you familiar with the tables and the query language.

-   **Powerful query language with IntelliSense**: Hunting is built on top of a query language that gives you the flexibility you need to take hunting to the next level.

-   **Query the stored telemetry**: The telemetry data is accessible in tables for you to query. For example, you can query process creation, DNS events, and many other event types.

## Community

The Security Insights community is a powerful resource for threat detection and automation. Our Microsoft security analysts constantly create and add new dashboards and playbooks and post them to the community for you to use in your environment. You can download sample content from the private community GitHub [repository](https://aka.ms/asicommunity) to create custom dashboards, hunting
queries, and playbooks for Azure Security Insights. The GitHub repository contains dashboards and playbooks created by other customers that can also be leveraged in your environment. 


## Next steps

- To get started with Security Inisghts, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).

