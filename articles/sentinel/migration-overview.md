---
title: Plan your migration to Microsoft Sentinel | Microsoft Docs
description: Discover the reasons for migrating from a legacy SIEM, and learn how to plan out the different phases of your migration.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Plan your migration to Microsoft Sentinel

Security operations center (SOC) teams use centralized security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solutions to protect their increasingly decentralized digital estate. While legacy SIEMs can maintain good coverage of on-premises assets, on-premises architectures may have insufficient coverage for cloud assets, such as in Azure, Microsoft 365, AWS, or Google Cloud Platform (GCP). In contrast, Microsoft Sentinel can ingest data from both on-premises and cloud assets, ensuring coverage over the entire estate.

This article discusses the reasons for migrating from a legacy SIEM, and describes how to plan out the different phases of your migration.

## Migration steps

This section describes how to migrate your legacy SIEM to Microsoft Sentinel.

[TBD - list or table of sections]

## What is Microsoft Sentinel?

Microsoft Sentinel is a scalable, cloud-native, security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution. Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for attack detection, threat visibility, proactive hunting, and threat response. Learn more about [Microsoft Sentinel](overview.md).

## Why migrate from a legacy SIEM?

SOC teams face a set of challenges when managing a legacy SIEM:

- **Slow response to threats**: Legacy SIEMs use correlation rules, which are difficult to maintain and ineffective for identifying emerging threats. SOC analysts, faced with large amounts of false positives, alerts from many different security components, and increasingly high volumes of logs, are slower to uncover and respond to critical threats in the environment.
- **High costs and scaling challenges**: Legacy SIEMs charge per ingested data and include storage limits. As data ingestion rates grow, SOC teams must constantly expand their resources and budgets in order to scale their SIEM. 
- **Manual analysis and response**: SOC teams need highly skilled analysts to manually process large amounts of alerts. Teams become overworked and new analysts are hard to find.
- **Complex and inefficient management**: SOC teams typically oversee orchestration and infrastructure, manage connections between the SIEM and various data sources, and perform updates and patches. These tasks are often at the expense of critical triage and analysis.

A cloud-native SIEM addresses these challenges. Microsoft Sentinel collects data automatically and at scale, detects unknown threats, investigates threats with artificial intelligence, and responds to incidents rapidly with built-in automation.

## Planning your migration

During the planning phase, you identify your existing SIEM components, existing SOC processes, and design and plan new use cases. It’s important that each phase includes clear goals for each phase, key activities and the outcome of that phase by specifying the deliverables. Learn about [migration phases](#migration-phases). Thorough planning allows you to maintain protection for both your cloud-based assets—Microsoft Azure, AWS, or GCP—and your SaaS solutions, such as Microsoft Office 365. 

## Migration phases

This section describes the high-level phases that a typical migration includes. Each phase includes clear goals, activities, and specified outcomes and deliverables. 

The phases below are a guideline to a complete and typical migration procedure. An actual migration may not include some phases or may include additional phases. Rather than reviewing the full set of phases, the following sections in this guide review specific tasks and steps that are especially important to a Microsoft Sentinel migration.

|Phase  |Description |Key activities  |Deliverables |Considerations |
|---------|---------|---------|---------|---------|
|**Discover** and collect information about your current SIEM and environment |Conduct a discovery to better understand the state of your current SIEM and collect monitoring and alerting use cases and requirements. |<ul><li>Conduct a [Crown Jewel Analysis](https://www.mitre.org/research/technology-transfer/technology-licensing/crown-jewels-analysis).<li>Identify and analyze your current use cases by threat, operating system, product, and so on.<li>Identify your existing automation and remediation tools.</li><li>Identify your existing SOC processes, including investigation, automation, and remediation.</li><li>Identify your existing integrations with IT service management (ITSM), threat intelligence, and automation solutions.</li></ul> |<ul><li>Project plan</li><li>Current state analysis</li><li>Business and technical requirements</li><li>Use cases</li></ul>    |When you review your use cases: <ul><li>Consider the value of your use cases and which use cases require migration. For example, you might choose to migrate only the use cases and data sources you have been using as part of your investigations.</li><li>Consider which use cases trigger many false positives. You may decide to set a lower priority to use cases that generate a high false positive rate.</li><li>If you want guidance on how to create a practical and concise use case list, follow the [MoSCoW method](https://en.wikipedia.org/wiki/MoSCoW_method), a prioritization technique used to reach a common understanding with stakeholders on the importance of each requirement.</li></ul>          |
|**Design** your Microsoft Sentinel implementation    |Create a comprehensive migration design that aligns with your current security portfolio and existing data sources.       |<ul><li>Design the Microsoft and third-party log sources.</li><li>Map rules from your existing SIEM to Microsoft Sentinel [built-in threat detection rules](detect-threats-built-in.md).</li><li>Map your existing dashboard to Microsoft Sentinel [built-in workbooks](monitor-your-data.md).</li><li>Map your existing automation to Microsoft Sentinel [built-in playbooks](automate-responses-with-playbooks.md).</li><li>Create a list of use cases for custom alerts, automation, and dashboards to create in Microsoft Sentinel.</li><li>If you need to migrate your SIEM's historical logs, review the available [target platforms](migration-ingestion-target-platform.md) and [data ingestion tools](migration-ingestion-tool.md).</li></ul>    |<ul><li>Design workshop conclusions</li><li>Design documentation that covers data source integration, automation, and custom alerting</li></ul>         |Define a detailed design and architecture for your Microsoft Sentinel implementation. You will use this information to get approval from the relevant stakeholders before you start the implementation phase.    | 
|**Implement** your Microsoft Sentinel design     |Integrate data sources that connect to Microsoft Sentinel, and validate that Microsoft Sentinel operates as designed.          |Perform these key activities based on the design phase:<br><br><ul><li>Use Microsoft Sentinel connectors to connect Microsoft sources, additional cloud logs such as AWS or GCP, network devices, and other third-party security solutions.</li><li>Deploy the Azure Monitor Agent to collect logs from Windows or Linux VMs and network devices.</li><li>Deploy log collectors to collect logs from VM groups and/or network security devices.</li><li>Enable Microsoft Sentinel custom analytics rules, based on the log sources and use cases defined in the design phase.</li><li>Use the MITRE ATT&CK blade to review your [MITRE coverage](https://docs.microsoft.com/en-us/azure/sentinel/mitre-coverage).</li><li>Convert any remaining detection rules to Microsoft Sentinel custom analytics rules.</li><li>Deploy relevant playbooks and automation rules, and create custom playbooks or automations, as defined in the design phase.</li><li>Deploy and optionally create playbooks to integrate with ITSM platforms (such as ServiceNow), SOAR, and threat intelligence platforms.</li><li>Deploy the workbooks.</li><li>Convert dashboards to workbooks.</li></ul>    |<ul><li>Microsoft Sentinel POC plan</li><li>Successfully connected Microsoft data sources</li><li>Successfully connected external data sources</li><li>Successfully deployed Microsoft Sentinel agent</li><li>Successfully implemented Microsoft Sentinel workbooks and playbooks</li></ul>    |As you implement Microsoft Sentinel components according to the design phase, and before you convert your entire infrastructure, we recommend that you leverage Sentinel out-of-the-box content. You can begin using Microsoft Sentinel gradually, starting with a minimum viable product (MVP) for several use cases. As you add more use cases, you can use Microsoft Sentinel as a user acceptance testing (UAT) environment to validate the use cases.          |
|**Operationalize** Microsoft Sentinel investigation and response      |Operationalize Microsoft Sentinel within your existing security monitoring, alerting, and incident response processes.         |         |<ul><li>Implemented Microsoft Sentinel configuration according to your organization's needs</li><li>Documentation covering your Microsoft Sentinel workbooks, playbooks, custom alerts, and Kusto Query Language (KQL) queries</li></ul>         |You migrate your content and SOC processes to ensure that the existing analyst experience is not disrupted. Make sure that your training considers the current environment as a starting point, and define the training accordingly, for example: "Microsoft Sentinel for SIEM X users".     |