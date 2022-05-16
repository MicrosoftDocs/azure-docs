---
title: Perform operational readiness review
description: "TODO: Perform operational readiness review"
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Perform operational readiness review

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Once you build a Synapse Analytics solution and it is ready to deploy, it is important to ensure the operational readiness of that solution. Performing an Operational Readiness Review helps evaluate the solution for its preparedness to provide optimal services to its users. Organizations that invest time and resources in assessing the operational readiness of their solutions before launch have a much higher rate of satisfaction than those who don't. It is also important to conduct an Operational Readiness Review periodically (once a year, for example) post deployment, to ensure there is no drift in operational expectations.

## Process and focus areas

### Service operational goals

Service Expectations: Document service expectations from customer's point of view. Get a buy-in from the business on these service expectations. Make any modifications as necessary to meet business goals and objectives of the service.

SLAs/OLAs: Service Level Objectives (SLAs) of each Azure service varies based on the service. For example, we guarantee that, at least 99.9% of the time client operations executed on a Synapse Analytics database will succeed. We have similar SLAs defined for each of the Azure services [here](https://azure.microsoft.com/support/legal/sla/). Ensure these SLAs match with your own business SLAs and document any gaps as needed. It is also important to define any Operational Level Agreements (OLAs) between different teams and ensure that these align with the SLAs.

### Solution readiness

Architecture Description: Describe/Document the architecture end to end, calling out critical functionalities of differnet components of the architecture and how they interact with each other.

Scalability: Describe/Document scalability aspects of your solution. This should include aspects like what is the effort involved in scaling and what is the impact of it on business, can it handle sudden surges of user activity etc. Azure Synapse Analytics provides functionality for scaling with minimal downtime.

Reliability: Identify and document any single points of failure in your  solution, along with how to remediate when such failures occur. This should include the impact of such failures on dependent services and to minimize the impact.

Dependencies: List all dependent services on the solution and their impact.

### Security

Authentication: Ensure AAD (Azure Active Directory) authentication is being used where possible. If non-AAD authentication is in place, ensure strong password mechanisms in place and passwords are being rotated at regular intervals. Check the link below for a Microsoft whitepaper on password guidance:

[Password Guidance - Microsoft Research](https://www.microsoft.com/research/publication/password-guidance/)

Also, ensure monitoring is in place for suspicious actions related to user authentication. Azure Identity Protection is a feature that helps detecting potential vulnerabilities and suspicious actions related to identities.

[Security best practices for your Azure assets - Azure security | Microsoft Docs](../../security/fundamentals/operational-best-practices.md)

Access Control: Ensure proper access controls are in place following the principle of least privileges. Use security features available with Azure services to properly tighten the security of your solution. For example, Azure Synapse Analytics provides granular security features such as RLS (Row-level Security), CLS (Column Level Security), DDM (Dynamic Data Masking) etc. to properly secure your data with absolute minimum privileges needed.

[Azure security baseline for Azure Synapse dedicated SQL pool (formerly SQL DW) | Microsoft Docs](/security/benchmark/azure/baselines/synapse-analytics-security-baseline)

Threats: Ensure proper threat detection mechanisms in place to prevent, detect and respond to threats. Azure Security Center provides integrated security monitoring across your Azure subscriptions and help detect threats that might otherwise go unnoticed.

[TODO](../../security-center/security-center-introduction.md)

Adopt a centralized Security Information and Event Management (SIEM) solution that meets your organizational security needed. Azure Sentinel is one such scalable, cloud-native SIEM solution that provides intelligent security analytics and threat intelligence via alert detection, threat visibility, proactive hunting and automated threat response.

[What is Azure Sentinel? | Microsoft Docs](../../sentinel/overview.md)

### Monitoring

Expectations: Set and document expectations on the monitoring readiness with your business. These expectations should include things like, how do you monitor end-to-end user experience, does the monitoring include single-user experience, how do you notify on poor user experience, what metrics from each service do you monitor etc. You should also include details on your pro-active health checks and any mechanisms in place to take automatic actions for reactive incidents (Ex: raising a ticket automatically).

Azure Monitor provides base-level infrastructure metrics, alerts, and logs for most of the Azure services. [Azure Monitor | Microsoft Azure](https://azure.microsoft.com/services/monitor/).

Metrics: List all the important metrics you monitor for each service in your solution along with their acceptable thresholds. For example, the following are the important metrics to monitor for a Synapse Dedicated SQL Pool:

- DWULimit
- DWUUsed
- AdaptiveCacheHitPercent
- AdaptiveCacheUsedPercent
- LocalTempDBUsedPercent
- ActiveQueries
- QueuedQueries

Check the link below for a more comprehensive list of metrics for each component of the Azure Synapse Analytics:

[How to monitor Synapse Analytics using Azure Monitor - Azure Synapse Analytics | Microsoft Docs](../monitoring/how-to-monitor-using-azure-monitor.md)

In addition, utilize Azure Service Heath service to get notified on Azure service incidents and planned maintenance. [Azure Service Health | Microsoft Azure](https://azure.microsoft.com/features/service-health/)

Notifications: Ensure proper notifications are in-place to notify appropriate personnel when incidents occur. The incidents could be proactive such as certain metric exceeded a pre-set threshold or reactive such as a failure of a component/service.

[Overview of alerting and notification monitoring in Azure - Azure Monitor | Microsoft Docs](../../azure-monitor/alerts/alerts-overview.md)

### HA/DR

High Availability: Define and document RTO (Recovery Time Objective) and RPO (Recovery Point Objective) for your data. Each of the Azure services publish a set of guidelines and metrics on the expected High Availability of the service. Ensure these HA metrics maps to your business expectations. If not, customization may be necessary to meet your HA requirements. For example, Synapse dedicated SQL pool supports an eight-hour RPO with automatic restore points. If that RPO is not
sufficient for your business, user-defined restore points may need to be setup with appropriate frequency to meet your RPO needs.

[Backup and restore - snapshots, geo-redundant - Azure Synapse Analytics | Microsoft Docs](../sql-data-warehouse/backup-and-restore.md)

### Disaster Recovery

Define and document a well-defined process for DR scenarios, such as failover process, communication mechanisms, escalation process, war room setup etc. Also document process for identifying the causes of outages and the steps to be taken to recover from the disasters. Utilize the built-in DR mechanisms available with Azure services for building your DR process. For example, Azure Synapse Analytics performs a standard geo-backup of SQL dedicated pools once every day to a paired data
center. These geo-backups can be used to recover from a disaster at the primary location. Azure Data Lake storage can be configured to copy data to another Azure region that is hundreds of miles apart. In case of a disaster at primary location, a failover can be initiated to transform the secondary storage location into primary.

[TODO](../../storage/common/storage-disaster-recovery-guidance.md#unsupported-features-and-services)

## Conclusion

Utilizing the guidance in this document ensures the operational readiness of your Azure Synapse Analytics solution.

## Next steps

TODO
