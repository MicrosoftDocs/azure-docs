---
title: Data security posture management
description: Explore how Microsoft Defender for Cloud enhances data security posture management across multicloud environments, ensuring comprehensive protection.
ms.author: dacurwin
author: dcurwin
ms.service: defender-for-cloud
ms.topic: concept-article
ms.date: 08/04/2024
#customer intent: As a security professional, I want to understand how Defender for Cloud enhances data security in a multicloud environment so that I can effectively protect sensitive data.
---

# About data security posture management

As digital transformation accelerates, organizations move data to the cloud at an exponential rate using multiple data stores such as object stores and managed/hosted databases. The dynamic and complex nature of the cloud increases data threat surfaces and risks. This causes challenges for security teams around data visibility and protecting the cloud data estate.

Data security posture management in Microsoft Defender for Cloud helps you to reduce risk to data, and respond to data breaches. Using data security posture management you can:

- Automatically discover sensitive data resources across multiple clouds.
- Evaluate data sensitivity, data exposure, and how data flows across the organization.
- Proactively and continuously uncover risks that might lead to data breaches.
- Detect suspicious activities that might indicate ongoing threats to sensitive data resources.

## Automatic discovery

Data security posture management automatically and continuously discovers managed and shadow data resources across clouds, including different types of objects stores and databases.

- Discover sensitive data using the sensitive data discovery extension included in the Defender Cloud Security Posture Management (CSPM) and Defender for Storage plans.
- In addition, you can discover hosted databases and data flows in Cloud Security Explorer and Attack Paths. This functionality is available in the Defender CSPM plan, and isn't dependent on the sensitive data discovery extension.

## Smart sampling

Defender for Cloud uses smart sampling to discover a selected number of assets in your cloud data stores. Smart sampling results discover evidence of sensitive data issues, while saving on discovery costs and time.

## Data security posture management in Defender CSPM

Defender CSPM provides visibility and contextual insights into your organizational security posture. The addition of data security posture management to the Defender CSPM plan enables you to proactively identify and prioritize critical data risks, distinguishing them from less risky issues.

### Attack paths

Attack path analysis helps you to address security issues that pose immediate threats, and have the greatest potential for exploit in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate the risks.

You can discover risk of data breaches by attack paths of internet-exposed VMs that have access to sensitive data stores. Hackers can exploit exposed VMs to move laterally across the enterprise to access these stores.

### Cloud Security Explorer

Cloud Security Explorer helps you identify security risks in your cloud environment by running graph-based queries on Cloud Security Graph (Defender for Cloud's context engine). You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.

You can use Cloud Security Explorer query templates, or build your own queries, to find insights about misconfigured data resources that are publicly accessible and contain sensitive data, across multicloud environments. You can run queries to examine security issues, and to get environment context into your asset inventory, exposure to the internet, access controls, data flows, and more. Review [cloud graph insights](attack-path-reference.md#cloud-security-graph-components-list).

## Data security posture management in Defender for Storage

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

When you enable data security posture management capabilities with the sensitive data discovery component in the Defender CSPM or Defender for Storage plans, Defender for Cloud uses algorithms to identify data resources that appear to contain sensitive data. Resources are labeled in accordance with data sensitivity settings.

Changes in sensitivity settings take effect the next time that resources are discovered.

## Sensitive data discovery

Sensitive data discovery identifies sensitive resources and their related risk and then helps to prioritize and remediate those risks.

Defender for Cloud considers a resource sensitive if a Sensitive Information Type (SIT) is detected in it and you have configured the SIT to be considered sensitive. Check out [the list of SITs that are considered sensitive by default](sensitive-info-types.md).

The sensitive data discovery process operates by taking samples of the resource’s data. The sample data is then used to identify sensitive resources with high confidence without performing a full scan of all assets in the resource.

The sensitive data discovery process is powered by the Microsoft Purview classification engine that uses a common set of SITs and labels for all datastores, regardless of their type or hosting cloud vendor.

Sensitive data discovery detects the existence of sensitive data at the cloud workload level. Sensitive data discovery aims to identify various types of sensitive information, but it might not detect all types.

To get complete data cataloging scanning results with all SITs available in the cloud resource, we recommend you use the scanning features from Microsoft Purview. 

### For cloud storage

Defender for Cloud's scanning algorithm selects containers that might contain sensitive information and samples up to 20MBs for each file scanned within the container.

### For cloud Databases

Defender for Cloud selects certain tables and samples between 300 to 1,024 rows using nonblocking queries. 

## Next step

> [!div class="nextstepaction"]
> [Prepare and review requirements for data security posture management.](concept-data-security-posture-prepare.md) 
