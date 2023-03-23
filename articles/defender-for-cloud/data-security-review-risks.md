---
title: Explore risks to sensitive data in Microsoft Defender for Cloud
description: Learn how to use attack paths and security explorer to find and remediate sensitive data risks.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: template-how-to-pattern
---
# Explore risks to sensitive data

After [discovering resources with sensitive data](data-security-posture-enable.md), Microsoft Defender for Cloud lets you explore sensitive data risk for those resources in a number of ways:

- **Attack paths**: When sensitive data discovery is enabled in the Defender Cloud Security Posture Management (CSPM) plan, you can use attack paths to discover risk of data breaches. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security Explorer**: When sensitive data discovery is enabled in the Defender CSPM plan, you can use Cloud Security Explorer to find sensitive data insights. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security alerts**: When sensitive data discovery is enabled in the Defender for Storage plan, you can prioritize and explore ongoing threats to sensitive data stores by applying sensitivity filters, and monitoring security alerts.

## Explore risks through attack paths

View attacks path for sensitive data as follows.

1. In Defender for Cloud, open **Recommendations** > **Attack paths**.
1. Review attack paths related to sensitive data.
1. To view sensitive information detected in data resources, select the resource name > **Insights**.Then, expand the **Contain sensitive data** insight.
1. For risk mitigation steps, open **Active Recommendations**.

Attack paths for sensitive data include:
- "Internet exposed Azure Storage container with sensitive data is publicly accessible"
- "VM has high severity vulnerabilities and read permission to a data store with sensitive data"
- "Internet exposed AWS S3 Bucket with sensitive data is publicly accessible"
- "Internet exposed EC2 instance has high severity vulnerabilities and read permission to a S3 bucket with sensitive data"

[Review](attack-path-reference.md) a full list of attack paths.


## Explore risks with Cloud Security Explorer

View cloud security graph insights for sensitive data as follows.

1. In Defender for Cloud, open **Cloud Security Explorer**.
1. Select a query template, or build your own query.

[Review](resource-graph-samples.md) some sample queries.


## Explore sensitive data security alerts

When sensitive data discovery is enabled in the Defender for Storage plan, you can prioritize the alerts and recommendations that are related to resources that have sensitive information types and labels assigned to them. [Learn more](defender-for-storage-data-sensitivity.md)

## Next steps

- Learn more about [attack paths](concept-attack-path.md).
- Learn more about [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).
