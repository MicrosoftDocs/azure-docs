---
title: Data security posture management in Microsoft Defender for Cloud
description: Learn how Defender for Cloud can help you identify and remediate data security posture issues in your cloud environment.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/09/2023
---

# Data security posture management (preview)

In today's fast-paced world of constant data migration and increasingly complex cloud environments, it's essential for you to identify and protect your most critical assets from potential cyberattacks. Attacks that expose sensitive information of millions customers are common place, for example due to misconfigured firewalls in a company's cloud infrastructure.

With data sensitivity posture management (DSPM), you can automatically discover and assess your cloud data estate, identify your most critical assets and sensitive data, and prioritize remediation of potential attack paths for resources that are exposed to high risk. The result is greater visibility and insight into where critical data is located and how best to protect it, ensuring that your personal identification and financial information remains secure and protected.

You can [enable DSPM](link) with the **Sensitive data discovery** option in Defender CSPM or Defender for Storage.

## How data security posture management works

Data security posture is an essential aspect of cloud security. Defender for Cloud uses smart sampling to scan a selected number of cloud files in your protected datastores. The results provide an accurate assessment of where sensitive data is stored while saving on scanning costs and time.

The data security posture scans resources and annotates them with sensitive information types and labels based on sensitivity settings defined for your tenant.

## Integration with Microsoft Purview

Resources that are not scanned by data security posture are enriched with classifications and labels from Purview, but these classifications are considered to contain sensitive data regardless of the sensitivity settings. The enrichment from Purview does not provide details about the last scan time, sensitive information types, labels, or samples of files. To access this information, the user must launch the Purview catalog.

## FAQ



## Next steps

This article explains how data security posture management works and how it helps you protect your sensitive data.

Learn more about how to [use data security posture management](enable-data-security-posture-management.md).
