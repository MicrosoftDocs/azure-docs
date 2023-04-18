---
title: "Synapse implementation success methodology: Perform operational readiness review"
description: "Learn how to perform an operational readiness review to evaluate your solution for its preparedness to provide optimal services to users."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Perform operational readiness review

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Once you build an Azure Synapse Analytics solution and it's ready to deploy, it's important to ensure the operational readiness of that solution. Performing an operational readiness review evaluates the solution for its preparedness to provide optimal services to users. Organizations that invest time and resources in assessing operational readiness before launch have a much higher rate of success. It's also important to conduct an operational readiness review periodically post deployment - perhaps annually - to ensure there isn't any drift from operational expectations.

## Process and focus areas

Process and focus areas include service operational goals, solution readiness, security, monitoring, high availability (HA) and disaster recovery (DR).

### Service operational goals

 Document service expectations from the customer's point of view, and get buy-in from the business on these service expectations. Make any necessary modifications to meet business goals and objectives of the service.

The service level agreement (SLA) of each Azure service varies based on the service. For example, Microsoft guarantees a specific monthly uptime percentage. For more information, see [SLA for Azure Synapse Analytics](https://azure.microsoft.com/support/legal/sla/synapse-analytics/). Ensure these SLAs align with your own business SLAs and document any gaps. It's also important to define any operational level agreements (OLAs) between different teams and ensure that they align with the SLAs.

### Solution readiness

It's important to review solution readiness by using the following points.

- Describe the entire solution architecture calling out critical functionalities of different components and how they interact with each other.
- Document scalability aspects of your solution. Include specific details about the effort involved in scaling and the impact of it on business. Consider whether it can respond to sudden surges of user activity. Bear in mind that Azure Synapse provides functionality for scaling with minimal downtime.
- Document any single points of failure in your solution, along with how to recover should such failures occur. Include the impact of such failures on dependent services in order to minimize the impact.
- Document all dependent services on the solution and their impact.

### Security

Data security and privacy are non-negotiable. Azure Synapse implements a multi-layered security architecture for end-to-end protection of your data. Review security readiness by using the following points.

- **Authentication:** Ensure Azure Active Directory (Azure AD) authentication is used whenever possible. If non-Azure AD authentication is used, ensure strong password mechanisms are in place and that passwords are rotated on a regular basis. For more information, see [Password Guidance](https://www.microsoft.com/research/publication/password-guidance/). Ensure monitoring is in place to detect suspicious actions related to user authentication. Consider using [Azure Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md) to automate the detection and remediation of identity-based risks.
- **Access control:** Ensure proper access controls are in place following the [principle of least privilege](../../active-directory/develop/secure-least-privileged-access.md). Use security features available with Azure services to strengthen the security of your solution. For example, Azure Synapse provides granular security features, including row-level security (RLS), column-level security, and dynamic data masking. For more information, see [Azure Synapse Analytics security white paper: Access control](security-white-paper-access-control.md).
- **Threat protection:** Ensure proper threat detection mechanisms are place to prevent, detect, and respond to threats. Azure Synapse provides SQL Auditing, SQL Threat Detection, and Vulnerability Assessment to audit, protect, and monitor databases. For more information, see [Azure Synapse Analytics security white paper: Threat detection](security-white-paper-threat-protection.md).

For more information, see the [Azure Synapse Analytics security white paper](security-white-paper-introduction.md).

### Monitoring

Set and document expectations for monitoring readiness with your business. These expectations should describe:

- How to monitor the entire user experience, and whether it includes monitoring of a single-user experience.
- The specific metrics of each service to monitor.
- How and who to notify about poor user experience.
- Details of proactive health checks.
- Any mechanisms that are in place that automate actions in response to incidents, for example, raising tickets automatically.

Consider using [Azure Monitor](../../azure-monitor/overview.md) to collect, analyze, and act on telemetry data from your Azure and on-premises environments. Azure Monitor helps you maximize performance and availability of your applications by proactively identify problems in seconds.

List all the important metrics to monitor for each service in your solution along with their acceptable thresholds. For example, the following list includes important metrics to monitor for a dedicated SQL pool:

- `DWULimit`
- `DWUUsed`
- `AdaptiveCacheHitPercent`
- `AdaptiveCacheUsedPercent`
- `LocalTempDBUsedPercent`
- `ActiveQueries`
- `QueuedQueries`

Consider using [Azure Service Health](https://azure.microsoft.com/features/service-health/) to notify you about Azure service incidents and planned maintenance. That way, you can take action to mitigate downtime. You can set up customizable cloud alerts and use a personalized dashboard to analyze health issues, monitor the impact to your cloud resources, get guidance and support, and share details and updates.

Lastly, ensure proper notifications are set up to notify appropriate people when incidents occur. Incidents could be proactive, such as when a certain metric exceeds a threshold, or reactive, such as a failure of a component or service. For more information, see [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md).

### High availability

Define and document *recovery time objective (RTO)* and *recovery point objective (RPO)* for your solution. RTO is how soon the service will be available to users, and RPO is how much data loss would occur in the event of a failover.

Each of the Azure services publishes a set of guidelines and metrics on the expected high availability (HA) of the service. Ensure these HA metrics align with your business expectations. when they don't align, customizations may be necessary to meet your HA requirements. For example, Azure Synapse dedicated SQL pool supports an eight-hour RPO with automatic restore points. If that RPO isn't sufficient, you can set up user-defined restore points with an appropriate frequency to meet your RPO needs. For more information, see [Backup and restore in Azure Synapse dedicated SQL pool](../sql-data-warehouse/backup-and-restore.md).

### Disaster recovery

Define and document a detailed process for disaster recovery (DR) scenarios. DR scenarios can include a failover process, communication mechanisms, escalation process, war room setup, and others. Also document the process for identifying the causes of outages and the steps to take to recover from disasters.

Use the built-in DR mechanisms available with Azure services for building your DR process. For example, Azure Synapse performs a standard geo-backup of SQL dedicated pools once every day to a paired data center. You can use a geo-backup to recover from a disaster at the primary location. You can also set up Azure Data Lake Storage (ADLS) to copy data to another Azure region that's hundreds of miles apart. If there's a disaster at the primary location, a failover can be initiated to transform the secondary storage location into the primary storage location. For more information, see [Disaster recovery and storage account failover](../../storage/common/storage-disaster-recovery-guidance.md).

## Next steps

In the [next article](implementation-success-perform-user-readiness-and-onboarding-plan-review.md) in the *Azure Synapse success by design* series, learn how to perform monitoring of your Azure Synapse solution.