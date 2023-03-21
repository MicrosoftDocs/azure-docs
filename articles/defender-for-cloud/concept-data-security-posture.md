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

As digital transformation accelerates in response to market shifts, cloud adoption, and remote working practices, organizations are moving from traditional on-premises environments to multi-cloud architectures. Security teams are shifting technologies, processes, and operations from traditional network perimeter-based security to asset-based security controls. Data is a critical business asset that's moving to the cloud at an exponential rate using multiple data stores such as object stores and managed/hosted databases. Business risk frameworks must account for increasing data threats, growing attack surfaces, and higher risk of data asset loss or compromise.

Data-aware security in Microsoft Defender for Cloud aims to proactively protect data, reduce risk, and respond to data breaches. Using data-aware security posture you can:

- Automatically discover sensitive data resources across multiple clouds.
- Evaluate data sensitivity, who's accessing data, and how data flows across the organization.
- Proactively and continuously uncover risks that might lead to data breaches.
- Detect suspicious activities that might indicate ongoing threats to sensitive data resources.

## Data security in Defender CSPM

Defender Cloud Security Posture Management (CSPM) provides visibility and contextual insights into your organizational security posture. The addition of data-aware security posture to the Defender CSPM plan enables you to proactively identify and prioritize critical data risks.

- With data awareness now built into [cloud security graph](concept-attack-path#what-is-cloud-security-graph.md) you can leverage cloud security explorer queries to find misconfigured data resources that are publicly accessible and contain sensitive data, across multi-cloud environments. 
- You can discover risk of data breaches by attack paths of internet-exposed VMs that have access to sensitive data stores. Hackers can exploit exposed VMs to move laterally across the enterprise to access these stores.

## Data security in Defender for Storage

Defender for Storage monitors Azure storage accounts with advanced threat detection capabilities. It detects potential data breaches by identifying harmful attempts to access or exploit data, and by identifying suspicious configuration changes that could lead to a breach.

When early signs are detected, the Defender for Storage generates a security alert, which allows security teams to quickly respond and mitigate.

## Discovering data resources

Data-aware security posture management automatically and continuously discovers managed and shadow data resources in use across clouds, including different types of objects stores and databases.

With Defender for CSPM, security teams can use cloud security explorer to query data resources, networks, access controls and data flow security attributes, to determine where data is stored, who can access it, and how it flows across the enterprise.

## Scanning with smart sampling

Defender for Cloud uses smart sampling to scan a selected number of files in your cloud datastores. Based on the sensitive data settings you configure for the Azure tenant, the results provide an accurate assessment of where sensitive data is stored while saving on scanning costs and time.

## Configuring sensitivity settings

Data-aware security posture identifies sensitive data based on sensitive information types. Defender for Cloud defines default sensitive information types that you can customize.

In addition, Defender for Cloud integrates with Microsoft Purview. You can optionally add additional Purview sensitive information types, or sensitivity labels, to be used during data resource scanning.



## Next steps

[Prepare](concept-data-security-posture-prepare.md) for using data-aware security posture management.

