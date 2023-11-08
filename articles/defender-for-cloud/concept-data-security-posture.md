---
title: Data-aware security posture 
description: Learn how Defender for Cloud helps improve data security posture in a multicloud environment.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 09/05/2023
---
# About data-aware security posture

As digital transformation accelerates, organizations move data to the cloud at an exponential rate using multiple data stores such as object stores and managed/hosted databases. The dynamic and complex nature of the cloud has increased data threat surfaces and risks. This causes challenges for security teams around data visibility and protecting the cloud data estate.

Data-aware security in Microsoft Defender for Cloud helps you to reduce risk to data, and respond to data breaches. Using data-aware security posture you can:

- Automatically discover sensitive data resources across multiple clouds.
- Evaluate data sensitivity, data exposure, and how data flows across the organization.
- Proactively and continuously uncover risks that might lead to data breaches.
- Detect suspicious activities that might indicate ongoing threats to sensitive data resources.

## Automatic discovery

Data-aware security posture automatically and continuously discovers managed and shadow data resources across clouds, including different types of objects stores and databases.

- Discover sensitive data using the sensitive data discovery extension included in the Defender Cloud Security Posture Management (CSPM) and Defender for Storage plans.
- In addition, you can discover hosted databases and data flows in Cloud Security Explorer and Attack Paths. This functionality is available in the Defender CSPM plan, and isn't dependent on the sensitive data discovery extension.

## Smart sampling

Defender for Cloud uses smart sampling to discover a selected number of assets in your cloud data stores. Smart sampling results discover evidence of sensitive data issues, while saving on discovery costs and time.

## Data security in Defender CSPM

Defender CSPM provides visibility and contextual insights into your organizational security posture. The addition of data-aware security posture to the Defender CSPM plan enables you to proactively identify and prioritize critical data risks, distinguishing them from less risky issues.

### Attack paths

Attack path analysis helps you to address security issues that pose immediate threats, and have the greatest potential for exploit in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate the risks.

You can discover risk of data breaches by attack paths of internet-exposed VMs that have access to sensitive data stores. Hackers can exploit exposed VMs to move laterally across the enterprise to access these stores. Review [attack paths](attack-path-reference.md#attack-paths).

### Cloud Security Explorer

Cloud Security Explorer helps you identify security risks in your cloud environment by running graph-based queries on Cloud Security Graph (Defender for Cloud's context engine). You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.

You can use Cloud Security Explorer query templates, or build your own queries, to find insights about misconfigured data resources that are publicly accessible and contain sensitive data, across multicloud environments. You can run queries to examine security issues, and to get environment context into your asset inventory, exposure to the internet, access controls, data flows, and more. Review [cloud graph insights](attack-path-reference.md#cloud-security-graph-components-list).

## Data security in Defender for Storage

Defender for Storage monitors Azure storage accounts with advanced threat detection capabilities. It detects potential data breaches by identifying harmful attempts to access or exploit data, and by identifying suspicious configuration changes that could lead to a breach.

When early suspicious signs are detected, Defender for Storage generates security alerts, allowing security teams to quickly respond and mitigate.

By applying sensitivity information types and Microsoft Purview sensitivity labels on storage resources, you can easily prioritize the alerts and recommendations that focus on sensitive data.

[Learn more about sensitive data discovery](defender-for-storage-data-sensitivity.md) in Defender for Storage.

## Data sensitivity settings

Data sensitivity settings define what's considered sensitive data in your organization. Data sensitivity values in Defender for Cloud are based on:

- **Predefined sensitive information types**: Defender for Cloud uses the built-in sensitive information types in [Microsoft Purview](/microsoft-365/compliance/sensitive-information-type-learn-about). This ensures consistent classification across services and workloads. Some of these types are enabled by default in Defender for Cloud. You can [modify these defaults](data-sensitivity-settings.md). Of these built-in sensitive information types, there's a subset supported by sensitive data discovery. You can view a [reference list](sensitive-info-types.md) of this subset, which also lists which information types are supported by default.  
- **Custom information types/labels**: You can optionally import custom sensitive information types and [labels](/microsoft-365/compliance/sensitivity-labels) that you defined in the Microsoft Purview compliance portal.
- **Sensitive data thresholds**: In Defender for Cloud, you can set the threshold for sensitive data labels. The threshold determines minimum confidence level for a label to be marked as sensitive in Defender for Cloud. Thresholds make it easier to explore sensitive data.

When discovering resources for data sensitivity, results are based on these settings.

When you enable data-aware security capabilities with the sensitive data discovery component in the Defender CSPM or Defender for Storage plans, Defender for Cloud uses algorithms to identify data resources that appear to contain sensitive data. Resources are labeled in accordance with data sensitivity settings.

Changes in sensitivity settings take effect the next time that resources are discovered.

## Next steps

- [Prepare and review requirements](concept-data-security-posture-prepare.md) for data-aware security posture management.
- [Understanding data aware security posture - Defender for Cloud in the Field video](episode-thirty-one.md).
