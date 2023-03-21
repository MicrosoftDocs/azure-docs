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

- You can discover sensitive data with the sensitive data discovery extension that's included in the Defender Cloud Security Posture Management (CSPM) and Defender for Storage plans.
- Discovery of hosted databases and data flows is available in Cloud Security Explorer and Attack Paths. This functionality is available in the Defender for CSPM plan even if the extension isn't turned on.

## Data security in Defender CSPM

Defender CSPM provides visibility and contextual insights into your organizational security posture. The addition of data-aware security posture to the Defender CSPM plan enables you to proactively identify and prioritize critical data risks.

With Defender for CSPM, you can:

- Leverage cloud security explorer queries to find misconfigured data resources that are publicly accessible and contain sensitive data, across multi-cloud environments. You can query data resources, networks, access controls and data flow security attributes, to determine where data is stored, who can access it, and how it flows across the enterprise.
- Discover risk of data breaches by attack paths of internet-exposed VMs that have access to sensitive data stores. Hackers can exploit exposed VMs to move laterally across the enterprise to access these stores.

## Data security in Defender for Storage

Defender for Storage monitors Azure storage accounts with advanced threat detection capabilities. It detects potential data breaches by identifying harmful attempts to access or exploit data, and by identifying suspicious configuration changes that could lead to a breach.

When early suspicious signs are detected, Defender for Storage generates a security alert, which allows security teams to quickly respond and mitigate.

## Scanning with smart sampling

Defender for Cloud uses smart sampling to scan a selected number of files in your cloud datastores. The sampling results provide an accurate assessment of where sensitive data is stored while saving on scanning costs and time.

## Configuring sensitivity settings

Data sensitivity settings allow you to define what you consider sensitive data in your organization. Defender for Cloud uses the same sensitive information types provided by [Microsoft Purview](/microsoft-365/compliance/sensitive-information-type-learn-about), to ensure consistent classification across services and workloads.  

Defender for Cloud turns on some built-in sensitive information types by default. You can modify these information types to suit your organization.

In addition, if you're using Microsoft Purview you can add custom sensitive information types that you've defined in the Purview portal. In addition, if you're automatically assigning Microsoft Purview sensitivity labels to resources, you can integrate those into Defender for Cloud.


## Next steps

[Prepare](concept-data-security-posture-prepare.md) and review requirements for data-aware security posture management.

