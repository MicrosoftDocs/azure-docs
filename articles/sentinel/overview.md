---
title: What is Azure Sentinel?| Microsoft Docs
description: Learn about Azure Sentinel, its key capabilities, and how it works.
services: sentinel
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 10cce91a-421b-4959-acdf-7177d261f6f2
ms.service: sentinel
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# What is Azure Sentinel?

Microsoft Azure Sentinel is the first SIEM+SOAR (Security information and event management + Security Orchestration and Automated response) solution built into a public cloud platform to deliver intelligent security analytics across your enterprise, and automatic scalability to meet ever evolving needs. 

Security can be a never-ending saga, a chronicle of increasingly sophisticated attacks, volumes of alerts, and long resolution timeframes. As the first fully cloud-based SIEM, Azure Sentinel harnesses the power, speed, and scale of the cloud to overcome these challenges. 

Azure Sentinel is your birds-eye view across your enterprise. 

Building on the full range of existing Azure services, Azure Sentinel natively incorporates powerful engines that have already been tried and tested, like Log Analytics. Azure Sentinel enriches your investigation and detection with AI, and provides both Microsoft's threat intelligence stream, as well as external threat intelligence streams. 

 
## Connect to all your data

Azure Sentinel enables you to connect to and collect data from all your sources whether business applications, other security products, or home-grown tools, and use your own machine-learning models. You can stream data from your Microsoft products in just a few clicks, including ingest Office 365 data for free.

![Azure Sentinel core capabilities](./media/intro/core-capabilities.png)

Azure Sentinel enables:

- **Seamless data collection from services in the Microsoft ecosystem, including native service-to-service integration of all Microsoft solutions and their raw data:**
    - Azure Information Protection
    - Azure Security Center
    - Azure Advanced Threat Protection
    - Cloud App Security
    - Office 365 
    - Azure AD audit logs and sign-ins
    - Azure Activity
    - Servers and endpoints:
- **Integration with other clouds**:
    - AWS
- **Integration with cloud and on-prem data from**:
    - Windows Servers 
    - Linux servers
    - Windows Event Forwarding
    - DNS Logs
**Integration with any solution supporting Syslog, CEF, and REST API**
    - Firewalls
    - Proxy servers
    - DLP solutions

## Built-in intelligence

Find, investigate, and respond to real threats in minutes, with built-in machine learning and knowledge that’s based on trillions of signals analyzed daily by Microsoft's security analysts. Microsoft employs over 3,500 security experts to design and implement machine learning algorithms and threat intelligence based on:
- 400 billion emails scanned every month by Outlook.com and Office 365 email services
- 1.2 billion devices scanned every month by Windows Defender 
- Over 450 billion monthly authentications across all Microsoft cloud services 
- 18 billion web pages scanned by Bing every month 
- More than 200 global cloud, consumer, and commercial services  

With **native integration of Machine Learning (ML), and User and Entity Behavioral Analysis (UEBA) models**, Azure Sentinel can help detect threats quickly. Connecting the dots by combining low fidelity alerts about different entities into potential high-fidelity security incidents. To help you reduce noise and minimize the number of alerts you have to review and investigate, Azure Sentinel uses a fusion technique to correlate alerts into cases. **Cases** are groups of related alerts that together create an actionable incident that you can investigate and resolve. Use the built-in correlation rules as-is, or use them as a starting point to build your own. Azure Sentinel also provides machine learning rules map your network behavior and then look for anomalies across your resources.

### Investigation

The Azure Sentinel dashboards provide customized views of data ingested to Azure Sentinel. Azure Sentinel deep investigation tools include interactive visualization and advanced analytics that help you lower the bar to understand what to investigate and help you understand the scope of the incident. You can create custom alert policies that enable your security analysts to define alerts based on data that is ingested in Azure Sentinel.

Azure Sentinel provides interactive visualization using advanced analytics to help security analysts get a better understanding of what’s going on during an attack. The investigation tools enable you to deep dive on any field, from any data, to rapidly develop threat context.


## Automate & orchestrate responses

Automate your common tasks and simplify security orchestration with playbooks that integrate with Azure services as well as your existing tools. Built on the foundation of Azure Logic Apps, the Azure Sentinel's automation and orchestration solution provides a highly-extensible architecture that enables scalable automation as new technologies and threats emerge. To build solutions with Azure Logic Apps, you can choose from a growing gallery with [200+ connectors](https://docs.microsoft.com/azure/connectors/apis-list), that include services such as Azure Service Bus, Functions, and Storage, SQL, Office 365, Dynamics, Salesforce, BizTalk, SAP, Oracle DB, and file shares. 

For example, if you use ServiceNow, you can use the tools provided to use Azure Logic Apps to automate your workflows and open a ticket in ServiceNow each time a particular event is detected.

## Hunting

Use Azure Sentinel's powerful hunting search-and-query tools, based on the MITRE framework, enable you to proactively hunt for security threats across your organization’s data sources, before an alert is triggered. After you discover which hunting query provides high value insights into possible attacks, you can also create custom detection rules based on your query and surface those insights as alerts to your security incident responders. While hunting, you can create bookmarks for interesting events, enabling you to return to them later, share them with others, and group them with other correlating events to create a compelling case for investigation.

With Azure Sentinel hunting, you can take advantage of the following capabilities:

-   **Query examples**: To get you started, Azure Sentinel provides pre-loaded query examples designed to get you started and get you familiar with the tables and the query language. Notebooks are also available to step you through recommended hunting scenarios. 

-   **Powerful query language with IntelliSense**: Hunting is built on top of the Kusto query language that gives you the flexibility you need to take hunting to the next level.

-   **Query the stored data**: The data is accessible in tables for you to query. For example, you can query process creation, DNS events, and many other event types.

## Community

The Azure Sentinel community is a powerful resource for threat detection and automation. Our Microsoft security analysts constantly create and add new dashboards, playbooks, and notebooks, and post them to the community for you to use in your environment. You can download sample content from the private community GitHub [repository](https://aka.ms/asicommunity) to create custom dashboards, hunting queries, notebooks, and playbooks for Azure Sentinel. The GitHub repository contains dashboards, notebooks, and playbooks created by other customers that can also be leveraged in your environment. 


## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
