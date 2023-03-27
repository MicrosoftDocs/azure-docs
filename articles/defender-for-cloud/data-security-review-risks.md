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

After you [discover resources with sensitive data](data-security-posture-enable.md), Microsoft Defender for Cloud lets you explore sensitive data risk for those resources with these features:

- **Attack paths**: When sensitive data discovery is enabled in the Defender Cloud Security Posture Management (CSPM) plan, you can use attack paths to discover risk of data breaches. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security Explorer**: When sensitive data discovery is enabled in the Defender CSPM plan, you can use Cloud Security Explorer to find sensitive data insights. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security alerts**: When sensitive data discovery is enabled in the Defender for Storage plan, you can prioritize and explore ongoing threats to sensitive data stores by applying sensitivity filters Security Alerts settings.

## Explore risks through attack paths

View predefined attack paths to discover data breach risks, and get remediation recommendations, as follows:


1. In Defender for Cloud, open **Recommendations** > **Attack paths**.
1. In **Risk category filter**, select **Data exposure** or **Sensitive data exposure** to filter the data-related attack paths.

    :::image type="content" source="./media/data-security-review-risks/attack-paths.png" alt-text="Screenshot that shows attack paths for data risk.":::

1. Review the data attack paths.
1. To view sensitive information detected in data resources, select the resource name > **Insights**. Then, expand the **Contain sensitive data** insight.
1. For risk mitigation steps, open **Active Recommendations**.

Other examples of attack paths for sensitive data include:

- "Internet exposed Azure Storage container with sensitive data is publicly accessible"
- "VM has high severity vulnerabilities and read permission to a data store with sensitive data"
- "Internet exposed AWS S3 Bucket with sensitive data is publicly accessible"
- "Private AWS S3 bucket that replicates data to the internet is exposed and publicly accessible"

[Review](attack-path-reference.md) a full list of attack paths.


## Explore risks with Cloud Security Explorer

Explore data risks and exposure in cloud security graph insights using a query template, or by defining a manual query.

1. In Defender for Cloud, open **Cloud Security Explorer**.
1. Select a query template, or build your own query. Here's an example:

    :::image type="content" source="./media/data-security-review-risks/query.png" alt-text="Screenshot that shows an Insights data query.":::

## Explore sensitive data security alerts

When sensitive data discovery is enabled in the Defender for Storage plan, you can prioritize and focus on alerts the alerts that affect resources with sensitive data. [Learn more](defender-for-storage-data-sensitivity.md) about monitoring data security alerts in Defender for Storage.

## Next steps

- Learn more about [attack paths](concept-attack-path.md).
- Learn more about [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).
