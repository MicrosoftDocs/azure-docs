---
title: Data-aware security posture in Microsoft Defender for Cloud
description: Learn how Defender for Cloud helps improve data security posture in a multi-cloud environment.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/09/2023
---
# About data-aware security posture (preview)

As digital transformation accelerates, organizations move data to the cloud at an exponential rate using multiple data stores such as object stores and managed/hosted databases. The dynamic and complex nature of the cloud has increased data threat surfaces and risk. This causes challenges for security teams around data visibility and protecting the cloud data estate.

Data-aware security in Microsoft Defender for Cloud helps you to reduce data risk, and respond to data breaches. Using data-aware security posture you can:

- Automatically discover sensitive data resources across multiple clouds.
- Evaluate data sensitivity, data exposure, and how data flows across the organization.
- Proactively and continuously uncover risks that might lead to data breaches.
- Detect suspicious activities that might indicate ongoing threats to sensitive data resources.

## Automatic discovery

Data-aware security posture automatically and continuously discovers managed and shadow data resources across clouds, including different types of objects stores and databases.

- You can discover sensitive data using the sensitive data discovery extension that's included in the Defender Cloud Security Posture Management (CSPM) and Defender for Storage plans.
- Discovery of hosted databases and data flows is available in Cloud Security Explorer and Attack Paths. This functionality is available in the Defender for CSPM plan, and isn't dependent on the extension.

## Data security in Defender CSPM

Defender CSPM provides visibility and contextual insights into your organizational security posture. The addition of data-aware security posture to the Defender CSPM plan enables you to proactively identify and prioritize critical data risks, distinguishing them from less risky issues.

### Attack paths

Attack path analysis helps you to address security issues that pose immediate threats, and have the greatest potential for exploit in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate the risks.

You can discover risk of data breaches by attack paths of internet-exposed VMs that have access to sensitive data stores. Hackers can exploit exposed VMs to move laterally across the enterprise to access these stores. Review [attack paths](attack-path-reference.md#attack-paths).

### Cloud Security Explorer

Cloud Security Explorer helps you identify security risks in your cloud environment by running graph-based queries on Cloud Security Graph (Defender for Cloud's context engine). You can prioritize your security team's concerns, while taking your organization's specific context and conventions into account.

You can leverage Cloud Security Explorer query templates, or build your own queries, to find insights about misconfigured data resources that are publicly accessible and contain sensitive data, across multi-cloud environments. You can run queries to examine security issues, and to get environment context into your asset inventory, exposure to internet, access controls, data flows, and more. Review [cloud graph insights](attack-path-reference.md#cloud-security-graph-components-list).


## Data security in Defender for Storage

Defender for Storage monitors Azure storage accounts with advanced threat detection capabilities. It detects potential data breaches by identifying harmful attempts to access or exploit data, and by identifying suspicious configuration changes that could lead to a breach.

When early suspicious signs are detected, Defender for Storage generates security alerts, allowing security teams to quickly respond and mitigate.

By applying sensitivity settings on storage resources, you can prioritize alerts that focus on sensitive data.

## Scanning with smart sampling

Defender for Cloud uses smart sampling to scan a selected number of files in your cloud datastores. The sampling results discover evidence of sensitive data issues, while saving on scanning costs and time.

## Data sensitivity settings

Data sensitivity settings define what's considered sensitive data in your organization. Defender for Cloud provides built-in sensitivity information types that are the same as those provided by [Microsoft Purview](/microsoft-365/compliance/sensitive-information-type-learn-about), to ensure consistent classification across services and workloads.  

Defender for Cloud turns some of these sensitive information types on by default (finance, PII, and credentials). You can modify the default settings, and add additional sensitive information types as needed.

:::image type="content" source="./media/concept-data-security-posture/data-sensitivity.png" alt-text="Graphic showing data sensitivity settings.":::

If you're using Microsoft Purview, you can add custom sensitive information types that you've defined in the Purview portal.

Changes in sensitivity settings take effect the next time that resources are scanned.

### Sensitivity labels

if you're using Microsoft Purview's automatic labelling rules to assign labels to files based on specific conditions, you can set a minimum sensitivity label threshold in Defender for Cloud. When setting a threshold, you select a minimum label in the labelling rank order. All resources that have this minimum label or higher are presumed to contain sensitive data in the Defender CSPM cloud security graph. For example:

When you select **Confidential** as minimum. **Highly Confidential** is also considered as sensitive. **General**, **Public**, and **Non-Business** aren't.

:::image type="content" source="./media/concept-data-security-posture/sensitivity-threshold.png" alt-text="Graphic showing the sensitivity threshold.":::

During scanning, Defender for Cloud dynamically caךculates which label a resource should have, in accordance with labelling rules. It then displays the highest level label in the resource. Note that:

- The aim of the threshold is to make it easier to explore sensitive data.
- It doesn't indicate that the scanned resource has a file with a specific label applied on it.



## Next steps

[Prepare and review requirements](concept-data-security-posture-prepare.md) for data-aware security posture management.
