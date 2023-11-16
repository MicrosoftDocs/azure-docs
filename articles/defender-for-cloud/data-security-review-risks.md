---
title: Explore risks to sensitive data
description: Learn how to use attack paths and security explorer to find and remediate sensitive data risks.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 11/12/2023
ms.custom: template-how-to-pattern
---
# Explore risks to sensitive data

After you [discover resources with sensitive data](data-security-posture-enable.md), Microsoft Defender for Cloud lets you explore sensitive data risk for those resources with these features:

- **Attack paths**: When sensitive data discovery is enabled in the Defender Cloud Security Posture Management (CSPM) plan, you can use attack paths to discover risk of data breaches. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security Explorer**: When sensitive data discovery is enabled in the Defender CSPM plan, you can use Cloud Security Explorer to find sensitive data insights. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security alerts**: When sensitive data discovery is enabled in the Defender for Storage plan, you can prioritize and explore ongoing threats to sensitive data stores by applying sensitivity filters Security Alerts settings.

## Explore risks through attack paths

View predefined attack paths to discover data breach risks, and get remediation recommendations, as follows:

1. In Defender for Cloud, open **Attack path analysis**.
1. In **Risk Factors**, select **Sensitive data** to filter the data-related attack paths.

    :::image type="content" source="./media/data-security-review-risks/attack-paths.png" alt-text="Screenshot that shows attack paths for data risk." lightbox="media/data-security-review-risks/attack-paths.png":::

1. Review the data attack paths.
1. To view sensitive information detected in data resources, select the resource name > **Insights**. Then, expand the **Contain sensitive data** insight.
1. For risk mitigation steps, open **Active Recommendations**.

Other examples of attack paths for sensitive data include:

- "Internet exposed Azure Storage container with sensitive data is publicly accessible"
- "Managed database with excessive internet exposure and sensitive data allows basic (local user/password) authentication"
- "VM has high severity vulnerabilities and read permission to a data store with sensitive data"
- "Internet exposed AWS S3 Bucket with sensitive data is publicly accessible"
- "Private AWS S3 bucket that replicates data to the internet is exposed and publicly accessible"
- "RDS snapshot is publicly available to all AWS accounts"

## Explore risks with Cloud Security Explorer

Explore data risks and exposure in cloud security graph insights using a query template, or by defining a manual query.

1. In Defender for Cloud, open **Cloud Security Explorer**.
1. You can build your own query, or select  one of the sensitive data query templates > **Open query**, and modify it as needed. Here's an example:

    :::image type="content" source="./media/data-security-review-risks/query.png" alt-text="Screenshot that shows an Insights data query.":::

### Use query templates

As an alternative to creating your own query, you can use predefined query templates. Several sensitive data query templates are available. For example:

- Internet exposed storage containers with sensitive data that allow public access.
- Internet exposed S3 buckets with sensitive data that allow public access

When you open a predefined query, it's populated automatically and can be tweaked as needed. For example, here are the prepopulated fields for "Internet exposed storage containers with sensitive data that allow public access".

:::image type="content" source="./media/data-security-review-risks/query-template.png" alt-text="Screenshot that shows an Insights data query template.":::

## Explore sensitive data security alerts

When sensitive data discovery is enabled in the Defender for Storage plan, you can prioritize and focus on alerts the alerts that affect resources with sensitive data. [Learn more](defender-for-storage-data-sensitivity.md) about monitoring data security alerts in Defender for Storage.

For PaaS databases and S3 Buckets, findings are reported to Azure Resource Graph (ARG) allowing you to filter and sort by sensitivity labels and sensitive info types in Defender for Cloud Inventory, Alert and Recommendation blades.

## Export findings

It's common for the security administrator, who reviews sensitive data findings in attack paths or the security explorer, to lack direct access to the data stores. Therefore, they need to share the findings with the data owners, who can then conduct further investigation.

For that purpose, use the **Export** within the **Contains sensitive data** insight.

:::image type="content" source="media/data-security-review-risks/export-findings.png" alt-text="Screenshot of how to export insights.":::

The CSV file produced includes:

- **Sample name** – depending on the resource type, this can be a database column, file name, or container name.
- **Sensitivity label** – the highest ranking label found on this resource (same value for all rows).
- **Contained in** – sample full path (file path or column full name).
- **Sensitive info types** – discovered info types per sample. If more than one info type was detected, a new row is added for each info type. This is to allow an easier filtering experience.

> [!NOTE]
> **Download CSV report** in the Cloud Security Explorer page will export all insights retrieved by the query in raw format (json).

## Next steps

- Learn more about [attack paths](concept-attack-path.md).
- Learn more about [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).
