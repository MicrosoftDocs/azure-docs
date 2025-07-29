---
title: 'Guidance on publishing high quality solutions for Microsoft Sentinel'
description: This article guides you through the process of publishing high quality solutions for Microsoft Sentinel.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual
ms.date: 10/08/2024

#CustomerIntent: As a ISV partner, I want clear guidance on how I can build and publish high quality solutions to Microsoft Sentinel so that customers can get a truly out-of-the-box experience using my solution.
---

# Guidance on publishing high quality solutions for Microsoft Sentinel

Microsoft Sentinel is a scalable, cloud-native security information event management (SIEM) and security orchestration automated response (SOAR) solution. It provides intelligent security analytics and threat intelligence across the enterprise. This document outlines the requirements and best practices to be considered when building solutions for Microsoft Sentinel. Some of the recommendations, such as using Codeless Connector Framework (CCF) for building data connectors, is a requirement that the partners must meet to have their code certified in GitHub by the Microsoft Sentinel team. These requirements are classified as must-haves in this document. This document also provides best practices that, while not mandatory, are highly recommended to help customers maximize the benefits of their solutions and encourage the use of your products and services.

A Microsoft Sentinel solution consists of multiple content items, each serving a specific purpose. Together, they enable customers to configure the solution quickly and begin monitoring their security infrastructure within minutes. Listed next are the key components that make up Microsoft Sentinel solutions: 

- **Data connectors** A good Microsoft Sentinel solution begins with robust integration capabilities that allow seamless ingestion of data from various sources, including cloud services, on-premises systems, and third-party solutions. It's essential to ensure that all relevant logs and telemetry data are collected to provide comprehensive visibility into potential threats. Ensure that the data is organized into tables whose schema is intuitive and easy to understand.
-	**Analytics rules** are essential for identifying suspicious activities and potential threats. Analytical rules, which are written in Kusto Query Language (KQL), run on the data pulled by the data connectors to identify anomalies and potential issues. The alerts created are aggregated to create incidents in Microsoft Sentinel. As a product owner, since no one knows your data more than you, it's important to ensure that you create a good set of analytic rules that identify key threats. The predefined analytic rules that you ship as part of your solution inspires customers to create their own. 
-	**Playbooks** automate response actions to identified threats (through analytic rules), ensuring swift and consistent remediation. Playbooks are critical to ensure that the SOC analysts aren't overburdened by tactical items and can focus on the more strategic and deeper root cause of the vulnerabilities. As you design your solution, think of the automated actions that can be taken to resolve incidents created by the analytic rules defined in your solution. 
-	**Hunting queries** enable SOC analysts to proactively look for new anomalies that aren't detected by the currently scheduled analytics rules. Hunting queries guide SOC analysts into asking the right questions to find issues from the data that is already available in Microsoft Sentinel and helps them identify potential threat scenarios. As a product owner, creating hunting queries enable SOC analysts to understand the underlying schema better and inspire them to think of new scenarios. 
-	**Parsers** are KQL functions which transform custom data from third-party products into a normalized ASIM schema. Normalization ensures that SOC analysts don’t have to learn details about new schemas and instead build analytic rules and hunting queries on the normalized schema that they're already familiar with. Review the available ASIM schemas provided by Microsoft Sentinel to identify relevant ASIM schemas (one or more) for your data to ensure easier onboarding for SOC analysts and to ensure that the existing security content written for the ASIM schema is applicable out-of-the-box for your product data. For more information on the available ASIM schemas, see Advanced Security Information Model (ASIM) schemas | Microsoft Learn
- **Workbooks** provide interactive reports and dashboards that help users to visualize security data and identify patterns within data. The need for workbooks is subjective and depends on the specific use case at hand. As you design your solution, think of scenarios which might be best explained visually, particularly for scenarios to track performance post hoc.

## Data connectors

**Partners are required to use the Codeless Connector Framework (CCF) for building data connectors.** The Codeless Connector Framework (CCF) provides partners, advanced users, and developers the ability to create custom connectors for ingesting data to Microsoft Sentinel. Connectors created using the CCF require no service installations and the entire infrastructure for polling and pulling data is managed behind the scenes by Microsoft Sentinel. CCF comes with inbuilt health monitoring, full support from Microsoft Sentinel, and scales automatically to support varying ingestion sizes. With the CCF platform, customers have a simple UI interface through which they can configure ingestion, without having to deploy resources in Azure. Customers aren't charged for the compute capacity required to poll and ingest data into Microsoft Sentinel and are only charged for data that is ingested into Microsoft Sentinel.

> [!CAUTION]
> Partners are required to use the Codeless Connector Framework (CCF), instead of Azure functions, for all new data connectors. If you find any blockers during the development of your data connector due to limitations in the CCF framework, log an issue with title "CCF Limitations" at https://github.com/Azure/Azure-Sentinel/issues. The Microsoft Sentinel team will work with you to resolve the issue or provide a workaround. If the issue is a blocker, the Microsoft Sentinel team will work with you to create an exception for your data connector.

## Analytics rules
**Partners must create at least one analytic rule as part of their Sentinel solution** Analytic rules are at the core of the value a Microsoft Sentinel solution can offer to customers. Getting the data into Microsoft Sentinel is only the first step. However, it's important for customers to monitor their security infrastructure and get notified of any issues. Getting data into Microsoft Sentinel without any detections written on the data wouldn't add any value for customers. To ensure that customers can deploy a Microsoft Sentinel solution and get started with monitoring their security infrastructure, it's important to have prebuilt analytic rules as part of the solution. This ensures that customers get value out-of-the-box as soon as they install and configure the Microsoft Sentinel solution, without any extra development effort by the customers.

Analytic rules must have appropriate MITRE mappings to ensure that customers can monitor and visualize their threat coverage across their security infrastructure. For more information, see [View MITRE coverage for your organization from Microsoft Sentinel | Microsoft Learn](/azure/sentinel/mitre-coverage?tabs=azure-portal). **Analytic rules without MITRE mapping will be rejected during certification.**

When creating analytic rules, it's important to ensure that the rules are scoped to cover all key data columns that are being pulled by the data connector. As customers pay for the data they ingest, it's important to ensure that the analytic rules are scoped to cover all the data that is being pulled by the data connector. This ensures that customers aren't charged for data that isn't being used.

When creating analytic rules, where applicable ensure that entities are mapped to the rule output. Mapping rule output to standardized entities ensures that the rule output can be correlated with other data points in Microsoft Sentinel in order to provide a more comprehensive threat story to SOC analysts. Some common examples of entities are user accounts, hosts, mailboxes, IP addresses, files, cloud applications, processes, and URLs. To know more about entities in Microsoft Sentinel, see [Entities in Microsoft Sentinel | Microsoft Learn](/azure/sentinel/entities)

> [!CAUTION]
> Solutions are required to have at least one analytic rule. If you have a valid reason for not including analytic rules in your solution, provide your reasoning in the comments section of the pull request. The Microsoft Sentinel team will review your PR and provide feedback accordingly.

## Playbooks

Playbooks are built using Azure Logic Apps, which allows for easy integration with various services and applications. This flexibility enables organizations to create custom workflows that align with their specific incident response processes. By using playbooks, security teams can automate repetitive tasks, such as sending notifications, creating tickets, or executing remediation actions, reducing the manual effort required to respond to incidents.

Playbooks can be triggered by specific alerts or incidents, allowing for a tailored response to each situation. For example, if a high-severity alert is detected, a playbook can automatically initiate a series of actions, such as notifying the security team, isolating affected systems, and gathering relevant logs for further analysis. This automation not only speeds up the response time but also ensures that critical actions are taken consistently and without delay. 

> [!NOTE]
> Although we don't mandate the availability of playbooks as part of the solution, we strongly recommend that you include playbooks as part of your solution. Playbooks are critical to ensure that the SOC analysts aren't overburdened by tactical items and can focus on the more strategic and deeper root cause of the vulnerabilities. As you design your solution, think of the automated actions that can be taken to resolve incidents created by the analytic rules defined in your solution.

## Hunting queries
Hunting queries are KQL queries that are used to proactively search for potential threats and anomalies in the data ingested into Microsoft Sentinel. These queries allow security analysts to explore the data and identify patterns or behaviors that may indicate malicious activity. By using hunting queries, organizations can stay ahead of emerging threats and enhance their overall security posture.

When building Hunting queries, consider the following best practices:
- Use MITRE framework to identify potential threats: The MITRE framework provides a comprehensive set of tactics, techniques, and procedures (TTPs) that can be used to identify potential threats in your data. By using the MITRE framework, you can ensure that your hunting queries are aligned with industry best practices and can help you identify potential threats more effectively.
- Create queries that cover all important data columns that are being pulled by the data connector. This ensures that your hunting queries are comprehensive and also provide guidance on whether new data points have to be added to the data connector or if any of the existing data points have to remove.
- Incorporating Threat intelligence (TI) can provide valuable context for your hunting queries. Incorporating threat intelligence available in Microsoft Sentinel into your hunting queries ensure that the SOC analysts have valuable context to identify potential threats. For more information on threat intelligence in Microsoft Sentinel, see [Threat intelligence in Microsoft Sentinel | Microsoft Learn](/azure/sentinel/understand-threat-intelligence). 

> [!NOTE]
> Although we don't mandate the availability of hunting queries as part of the solution, we strongly recommend that you include hunting queries as part of your solution. Creating hunting queries enable SOC analysts to understand the underlying schema better and inspire them to think of new scenarios.

## Parsers
Parsers are KQL functions that transform custom data from third-party products into a normalized ASIM schema. Normalization ensures that SOC analysts don’t have to learn details about new schemas and instead build analytic rules and hunting queries on the normalized schema that they're already familiar with. Review the available ASIM schemas provided by Microsoft Sentinel to identify relevant ASIM schemas (one or more) for your data to ensure easier onboarding for SOC analysts and to ensure that the existing security content written for the ASIM schema is applicable out-of-the-box for your product data. For more information on the available ASIM schemas, see [Advanced Security Information Model (ASIM) schemas | Microsoft Learn](/azure/sentinel/normalization-about-schemas).

Microsoft Sentinel provides several built-in, source-specific parsers for many of the data sources. You may want to modify, or develop new parsers in the following situations:
- When your device provides events that fit an ASIM schema, but a source-specific parser for your device and the relevant schema isn't available in Microsoft Sentinel.
- When ASIM source-specific parsers are available for your device, but your device sends events in a method or a format different than expected by the ASIM parsers. For example:
- Your source device may be configured to send events in a nonstandard way.
- Your device may have a different version than the one supported by the ASIM parser.
- The events might be collected, modified, and forwarded by an intermediary system.
- understand how parsers fit within the ASIM architecture, refer to the ASIM architecture diagram.

> [!NOTE]
> We don't mandate the availability of parsers in your solution. However if our certification team identifies that your data maps closely to an existing ASIM schema, our team may mandate the creation of parsers to avail the benefits of normalization.

## Workbooks
Workbooks provide a way for users to visualize data about security in a visual manner and are effective at identifying trends and anomalies, which can be used to measure security posture as well as to identify potential issues. Workbooks can be used to create dashboards that provide a high-level overview of security data, allowing users to quickly identify areas of concern. They can also be used to drill down into specific data points, providing a more detailed view of security events and incidents.
Workbooks can be customized to meet the specific needs of an organization, allowing users to create tailored views of security data that are relevant to their roles and responsibilities. This customization can include filtering data by specific criteria, such as time range, severity level, or data source. By providing a flexible and customizable way to visualize security data, workbooks can help organizations improve their security posture and respond more effectively to potential threats.

When creating workbooks, consider the following best practices:
- **Use clear and concise titles and descriptions**: Ensure that the titles and descriptions of your workbooks are clear and concise, making it easy for users to understand the purpose of each workbook.
- **Use appropriate visualizations**: Choose the right type of visualization for the data being presented. For example, use line charts for trends over time, bar charts for comparisons, and tables for detailed data.
- **Use filters and parameters**: Incorporate filters and parameters to allow users to customize the data displayed in the workbook. This can help users focus on specific time ranges, data sources, or other criteria relevant to their needs.
- **Optimize performance**: If your workbooks handle vast amounts of data, it may impact performance negatively. In these instances, it's advisable to aggregate the data using summary rules and ensure that the workbooks operate on the summarized data instead of the underlying raw data.
- **Provide documentation**: Include documentation or tooltips within the workbook to help users understand how to use it effectively. This can include explanations of the data sources, visualizations, and any filters or parameters available.

> [!NOTE]
> We don't mandate the availability of workbooks in your solution as they're use case dependent. However, if you do create workbooks, ensure that they're relevant to the data being ingested and provide value to the customers. 

## Maintaining solutions
Once your solution is published, it's important to ensure that the solution is maintained and updated regularly. This includes:
Solution Maintenance
- **Account for deprecated features:** If a feature used by a solution is deprecated, Microsoft recommends the solution be updated to account for the deprecation six months prior to the end of life or end of service event. 
- **Ensure Solution Description page is accurate and functioning as expected:** The solution description page should be updated as needed to ensure it's accurate and fully functional. Any links that become broken should be fixed. 
- **Address GitHub CodeQL alerts:** If the solution publisher identifies GitHub CodeQL alerts, they should be addressed in a timely manner. 
