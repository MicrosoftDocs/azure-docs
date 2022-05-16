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

## Plan your migration

During the planning phase, you identify your existing SIEM components, existing SOC processes, and design and plan new use cases. It’s important that each phase includes clear goals for each phase, key activities and the outcome of that phase by specifying the deliverables. Learn about [migration phases](#migration-phases). Thorough planning allows you to maintain protection for both your cloud-based assets—Microsoft Azure, AWS, or GCP—and your SaaS solutions, such as Microsoft Office 365. 

## Plan migration phases

This section describes the high-level phases that a typical migration includes. Each phase includes clear goals, activities, and specified outcomes and deliverables. 

The phases below are a guideline to a complete and typical migration procedure. An actual migration may not include some phases or may include additional phases. Rather than reviewing the full set of phases, the following sections in this guide review specific tasks and steps that are especially important to a Microsoft Sentinel migration.

:::image type="content" source="media/migration-overview/migration-phases.png" alt-text="Screenshot of the Microsoft Sentinel Edit watchlist items screen, showing an example list of watchlist items." lightbox="media/migration-overview/migration-phases.png":::

|Phase |Key activities  |Deliverables |Considerations |
|---------|---------|---------|---------|
|**Discover**<br><br>Collect information about your current SIEM and environment to better understand the state of your current SIEM, and collect monitoring and alerting use cases and requirements. |<ul><li>[Identify use cases](#identify-use-cases)</li><li>Identify your existing automation and remediation tools.</li><li>Identify your existing SOC processes, including investigation, automation, and remediation.</li><li> integrations with IT service management (ITSM), threat intelligence, and automation solutions.</li></ul> |<ul><li>Project plan</li><li>Current state analysis</li><li>Business and technical requirements</li><li>Use cases</li></ul>    |          |
|**Design**<br><br>Create a comprehensive migration design that aligns with your current security portfolio and existing data sources.       |<ul><li>Design the Microsoft and third-party log sources.</li><li>Map rules from your existing SIEM to Microsoft Sentinel [built-in threat detection rules](detect-threats-built-in.md).</li><li>Map your existing dashboard to Microsoft Sentinel [built-in workbooks](monitor-your-data.md).</li><li>Map your existing automation to Microsoft Sentinel [built-in playbooks](automate-responses-with-playbooks.md).</li><li>Create a list of use cases for custom alerts, automation, and dashboards to create in Microsoft Sentinel.</li><li>If you need to migrate your SIEM's historical logs, review the available [target platforms](migration-ingestion-target-platform.md) and [data ingestion tools](migration-ingestion-tool.md).</li></ul>    |<ul><li>Design workshop conclusions</li><li>Design documentation that covers data source integration, automation, and custom alerting</li></ul>         |Define a detailed design and architecture for your Microsoft Sentinel implementation. You will use this information to get approval from the relevant stakeholders before you start the implementation phase.    | 
|**Implement**<br><br>Integrate data sources that connect to Microsoft Sentinel, and validate that Microsoft Sentinel operates as designed.          |Perform these key activities based on the design phase:<br><br><ul><li>Use Microsoft Sentinel connectors to connect Microsoft sources, additional cloud logs such as AWS or GCP, network devices, and other third-party security solutions.</li><li>Deploy the Azure Monitor Agent to collect logs from Windows or Linux VMs and network devices.</li><li>Deploy log collectors to collect logs from VM groups and/or network security devices.</li><li>Enable Microsoft Sentinel custom analytics rules, based on the log sources and use cases defined in the design phase.</li><li>Use the MITRE ATT&CK blade to review your [MITRE coverage](https://docs.microsoft.com/en-us/azure/sentinel/mitre-coverage).</li><li>Convert any remaining detection rules to Microsoft Sentinel custom analytics rules.</li><li>Deploy relevant playbooks and automation rules, and create custom playbooks or automations, as defined in the design phase.</li><li>Deploy and optionally create playbooks to integrate with ITSM platforms (such as ServiceNow), SOAR, and threat intelligence platforms.</li><li>Deploy the workbooks.</li><li>Convert dashboards to workbooks.</li></ul>    |<ul><li>Microsoft Sentinel POC plan</li><li>Successfully connected Microsoft data sources</li><li>Successfully connected external data sources</li><li>Successfully deployed Microsoft Sentinel agent</li><li>Successfully implemented Microsoft Sentinel workbooks and playbooks</li></ul>    |As you implement Microsoft Sentinel components according to the design phase, and before you convert your entire infrastructure, we recommend that you leverage Sentinel out-of-the-box content. You can begin using Microsoft Sentinel gradually, starting with a minimum viable product (MVP) for several use cases. As you add more use cases, you can use Microsoft Sentinel as a user acceptance testing (UAT) environment to validate the use cases.          |
|**Operationalize**<br><br>Operationalize Microsoft Sentinel within your existing security monitoring, alerting, and incident response processes.         |         |<ul><li>Implemented Microsoft Sentinel configuration according to your organization's needs</li><li>Documentation covering your Microsoft Sentinel workbooks, playbooks, custom alerts, and Kusto Query Language (KQL) queries</li></ul>         |You migrate your content and SOC processes to ensure that the existing analyst experience is not disrupted. Make sure that your training considers the current environment as a starting point, and define the training accordingly, for example: "Microsoft Sentinel for SIEM X users".     |

## Identify your migration priorities

Use these questions to pin down your migration priorities:
- What are the most critical infrastructure components, systems, apps, and data in your business?
- Who are your stakeholders in the migration? SIEM migration is likely to touch many areas of your business.
- What drives your priorities? For example, greatest business risk, compliance requirements, business priorities, and so on.
- What is your migration scale and timeline? What factors affect your dates and deadlines. Are you migrating an entire legacy system?
- Do you have the skills you need? Are you security staff trained and ready for the migration?
- Are there any specific blockers in your organization? Are they issues that specifically affect migration planning and scheduling, such as staffing and training requirements, license dates, hard stops, specific business needs, and so on?

Before you begin migration, identify key use cases, detection rules, data, and automation in your current SIEM. Approach your migration as a gradual process. Be intentional and thoughtful about what you migrate first, what you deprioritize, and what doesn’t actually need to be migrated. Your team might have an overwhelming number of detections and use cases running in your current SIEM. Before beginning migration, decide which ones are actively useful to your business.

## Identify use cases 

When planning the discover phase, use the following guidance to identify your use cases.
- Identify and analyze your current use cases by threat, operating system, product, and so on.
- What’s the scope? Do you want to migrate all use cases, or use some prioritization criteria?
- Conduct a [Crown Jewel Analysis](https://www.mitre.org/research/technology-transfer/technology-licensing/crown-jewels-analysis).
- What use cases are effective? A good starting place is to look at which detections have produced results within the last year (false positive versus positive rate). 
- What are the business priorities that affect use case migration? What are the biggest risks to your business? What type of issues put your business most at risk?
- Prioritize by use case characteristics.
    - Consider setting lower and higher priorities. We recommend to focus on detections that would enforce 90 percent true positive on alert feeds, while use cases that cause a high false positive might be a lower priority for your business.
    - Select use cases that justify rule migration in terms of business priority and efficacy:
        - Review rules that haven’t triggered any alerts in the last 6 to 12 months.
        - Eliminate low-level threats or alerts you routinely ignore.
- Prepare a validation process. Define test scenarios and build a test script.
- Can you apply a methodology to prioritize use cases? You can follow a methodology such as MoSCoW to prioritize a leaner set of use cases for migration.