---
title: Microsoft Sentinel Solution for MS Business Apps
description: Learn about the Microsoft Sentinel solution for MS Business Apps, including Microsoft Power Platform, Microsoft Dynamics 365 Customer Engagement, and Microsoft Dynamics 365 Finance and Operations.
author: batamig
ms.author: bagol
ms.service: microsoft-sentinel
ms.topic: overview #Don't change
ms.date: 11/13/2024

#customer intent: As a system architect, I want to understand the Microsoft Sentinel solution for Microsoft Business Apps so that I can can plan on how to better protect our Microsoft Power Platform, Microsoft Dynamics 365 Customer Engagement, and Microsoft Dynamics 365 Finance and Operations environments.
---

# What is the Microsoft Sentinel solution for Microsoft Business Apps?

The Microsoft Sentinel solution for Microsoft Business Apps helps you monitor and protect your Microsoft Power Platform, Microsoft Dynamics 365 Customer Engagement, and Microsoft Dynamics 365 Finance and Operations. environments. It provides security insights and threat detection by collecting audit and activity logs to detect threats, suspicious activities, illegitimate activities, and more.

- [Microsoft Power Platform](/power-platform/) is a suite of applications, connectors, and a data platform (Dataverse) that provides a rapid application development environment to build custom apps for your business needs. Power Platform enables users to analyze data, build solutions, automate processes, and create virtual agents.
- [Microsoft Dynamics 365 Customer Engagement](/dynamics365/customerengagement/) is a cloud-based suite of customer relationship management (CRM) applications designed to streamline and automate business processes across sales, customer service, field service, project service automation, and marketing
- [Microsoft Dynamics 365 for Finance and Operations](/dynamics365/finance) is a comprehensive Enterprise Resource Planning (ERP) solution that combines financial and operational capabilities to help businesses manage their day-to-day operations. It offers a range of features that enable businesses to streamline workflows, automate tasks, and gain insights into operational performance.

> [!IMPORTANT]
>
> - The Microsoft Sentinel solution for Microsoft Business Apps is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

## Securing Power Platform and Microsoft Dynamics 365 Customer Engagement activities

The Microsoft Sentinel solution for Microsoft Business Apps helps you secure your Power Platform by allowing you to:

- Monitor and detect suspicious or malicious activities in your Power Platform environment
- Monitor and secure your Dynamics 365 Customer Engagement environment, which uses the Microsoft Dataverse common data store known as . 

The solution collects activity logs from different Power Platform components and inventory data, and analyzes those activity logs to detect threats and suspicious activities, such as:

- Power Apps execution from unauthorized geographies
- Suspicious data destruction by Power Apps
- Mass deletion of Power Apps
- Phishing attacks made possible through Power Apps
- Power Automate flows activity by departing employees
- Suspicious and anomalous activities in Microsoft Dataverse

## Securing Dynamics 365 for Finance and Operations activities

Finance and operations applications enable important business processes like finance, procurement, operations, and supply chain. They store and process sensitive business data, like payments, orders, account receivables, and suppliers, and might be administered by nonsecurity savvy administrators and used by both internal and external users.

The Microsoft Sentinel solution for Microsoft Business apps helps you secure your Dynamics 365 Finance and Operations environment by providing:

- **Visibility to user activities**, like user logins and sign-ins, Create, Read, Update, Delete (CRUD) activities, configurations changes, or activities by external applications and APIs. 
- **The ability to detect suspicious or illegitimate activities**, like suspicious logins, illegitimate changes of settings and user permissions, data exfiltration, or bypassing of SOD policies. 
- **The ability to investigate and respond to related incidents**, like limiting user access, notifying business admins, or rolling back changes.

## Data connectors

The Microsoft Sentinel solution for Microsoft Business Apps includes the following data connectors:

|Connector name  |Data collected  |Log Analytics tables |
|---------|---------|---------|
|Microsoft Power Platform Admin Activity (Preview)|Power Platform administrator activity logs includes the following workloads: <br>- Power Apps<br>- Power Pages<br>- Power Platform Connectors<br>- Power Platform DLP<br><br>For more information, see [View Power Platform administrative logs using auditing solutions in Microsoft Purview (preview)](/power-platform/admin/admin-activity-logging).|PowerPlatformAdminActivity|
|Microsoft Dataverse (Preview) |Dataverse and model-driven apps activity logging (including Dynamics 365 Customer Engagement) <br><br>For more information, see [Microsoft Dataverse and model-driven apps activity logging](/power-platform/admin/enable-use-comprehensive-auditing).<br><br>If you use the data connector for Dynamics 365, migrate to the data connector for Microsoft Dataverse. <br><br>This data connector replaces the legacy data connector for Dynamics 365 and supports data collection rules.  |   DataverseActivity      |
| Dynamics 365 F&O |Dynamics 365 Finance and Operations admin activities and audit logs<br><br>Business process and application activity logs | FinanceOperationsActivity_CL |

## Analytics rules

The Microsoft Sentinel solution for Microsoft Business Apps includes the analytics rules to help you detect threats and suspicious activities in your Power Platform and Dynamics 365 Finance and Operations environments. The rules are based on best practices and industry standards, and are designed to help you identify and respond to security incidents.

- **Analytics rules for Power Platform and Microsoft Dynamics 365 Customer Engagement** cover activities like Power Apps being run from unauthorized geographies, suspicious data destruction by Power Apps, mass deletion of Power Apps, and more.

- **Analytics rules for Dynamics 365 Finance and Operations** cover suspicious activities like changes in bank account details, multiple user account updates or deletions, suspicious sign-in events, changes to workload identities, and more.

## Hunting queries

The Microsoft Sentinel solution for Microsoft Business Apps includes Hunting Queries, enabling the SOC to proactively uncover potential threats and suspicious activities by applying advanced hunting techniques to analyze available data.

## Playbooks

The Microsoft Sentinel solution for Microsoft Business Apps includes Playbooks, which are integral to Sentinel's SOAR capabilities. These playbooks enable automated security responses for Dynamics and Power Platform, streamlining workflows and improving collaboration between SOC analysts and Business Applications experts.

## Workbooks

The Microsoft Sentinel solution for Microsoft Business Apps includes workbooks designed to present security data visually, making it easier to detect anomalies and uncover patterns through interactive visualizations.

## Parsers

The Microsoft Sentinel solution for Microsoft Business Apps includes parsers that that are used to access data from the raw data tables from Power Platform. Parsers ensure that the correct data is returned with a consistent schema. When available, we recommend that you use the parsers instead of directly querying the inventory tables and watchlists.


## Related content

For more information, see:

- **Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement**: [Deployment procedure](deploy-power-platform-solution.md) | [Security content reference](power-platform-solution-security-content.md)
- **Microsoft Dynamics 365 Finance and Operations**: [Deployment procedure](../dynamics-365/deploy-dynamics-365-finance-operations-solution.md) | [Security content reference](../dynamics-365/dynamics-365-finance-operations-security-content.md)
