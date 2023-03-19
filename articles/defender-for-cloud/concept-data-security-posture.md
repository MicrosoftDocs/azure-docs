---
title: Data-aware Security Posture Management in Microsoft Defender for Cloud
description: Learn how Defender for Cloud can help you identify and remediate data security posture issues in your cloud environment.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/09/2023
---
# Data-aware security posture (preview)

As digital transformation accelerates, organizations move data at an exponential rate to the cloud using multiple data stores, such as object stores, managed and hosted databases. The dynamic and complex nature of the cloud has altered the threat surface and risks related to data, causing security teams to encounter blind spots and significant challenges to protect their cloud data estate.

## Which data security capabilities does Defender for Cloud offer?

Microsoft Defender for Cloud offers data security capabilities which help security teams be more productive at reducing risks and responding to data breaches in the cloud:
- Automatically discover data resources across cloud estate and evaluate their accessibility, data sensitivity and configured data flows.
- Continuously uncover risks to data breaches of sensitive data resources, exposure or attack paths that could lead to a data resource using a lateral movement technique. 
- Detect suspicious activities that may indicate an ongoing threat to sensitive data resources.

## Data-Aware Security Posture in Defender CSPM

Defender CSPM helps security teams cut through the noise with contextual cloud security and prioritize the most critical security risks powered by its Cloud Security Graph. 

With Defender CSPM's new data-aware security posture management, security teams can get ahead of their data risks and prioritize security issues that could prevent a costly data breach.

### Auto-Discovery of the Cloud Data Estate
Cloud data security starts with visibility.  Data-aware security posture management automatically and continuously discovers managed and shadow data resources in use across clouds, including different types of objects stores and databases. Security teams can utilize Defender for Cloud security explorer to determine where the data is stored, who can access it and how does the data flows by querying different types of data resources, their network, access controls, and configured data flows security attributes.

Data-aware security management also offers rapid, agentless, and intelligent sensitive data discovery, which automatically identify data resources that contain sensitive data such as Finance, PII, and Credentials. By default, the new sensitive data discovery service is enabled with high-sensitive information types and additional sensitive information types can be selected from the Defender for Cloud’s data sensitivity settings.

In addition, customers using Microsoft Purview can leverage their investments in organization data classification with custom information types, custom labels, and data scan context to identify data resources that contain sensitive data in the cloud.

### Uncover risks for data breaches in the cloud
Now that the data layer is part of the Cloud Security Graph, the new data-aware security posture continuously uncovers risks to data exposure and prioritizes security issues across cloud environments that cloud lead to data breach.

Examples:
- Find misconfigured data resources across multi-cloud environments that are publicly accessible and contain sensitive data, using the cloud security explorer queries. The result of such a query provides additional information regarding the network and access controls applied to the exposed data resources, along with examples of the sensitive data that these data resources contain.
- Discover risk to a data breach by an attack path of an internet-exposed virtual machine (VM) with access to a sensitive data store. Hackers can exploit the vulnerable VM that is exposed to and move laterally to access an object store that contains sensitive data.


Relevant links:
- [How to enable sensitive data discovery in Defender CSPM for Azure storage accounts](data-security-posture-enable.md#enable-data-aware-security-posture-in-defender-cspm-for-azure-subscriptions)
- [How to enable sensitive data discovery in Defender CSPM for Amazon S3 buckets](data-security-posture-enable.md#enable-data-aware-security-posture-in-defender-cspm-for-aws-accounts)
- [How to explore data risk](data-security-review-risks.md)
- [Relevant insights and attack paths related to data-aware security](data-security-posture-enable.md#enable-resource-scanning-on-your-subscriptions)

## Data-Aware Threat Detection in Defender for Storage
Defender for Storage provides ongoing monitoring of activities within Azure Storage account across data and control planes. It uses advanced threat detection modules to detect potential data breaches by identifying harmful attempts to access or exploit data, as well as suspicious configuration changes that could lead to such a data breach. When such early signs are detected, the Defender for Storage generates a security alert, which allows security teams to enable quick response and mitigation.

Defender for Storage threat detection with sensitive data context allows secure teams to detect and respond to active data breaches that involve malicious access, exfiltration, or corruption of sensitive data.

Relevant links:
- [How to enable sensitive data discovery in Defender for Storage](defender-for-storage-introduction.md)
- [How to explore data risk](data-security-review-risks.md)

## How does the data discovery work?
Defender for Cloud uses smart sampling to scan a selected number of files in your cloud datastores. The results provide an accurate assessment of where sensitive data is stored while saving on scanning costs and time.

The data security posture scans resources and annotates them with sensitive information types and labels based on sensitivity settings defined for your tenant.

## Next steps

This article explains how data-aware security posture management works and how it helps you protect your sensitive data.

Learn more about how to [use data-aware security posture management](data-security-posture-enable.md).