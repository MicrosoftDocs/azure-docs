---
title: Detect threats to sensitive data
description: Learn about using security alerts to protect your sensitive data from exposure.
ms.date: 03/16/2023
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
---

# Detect threats to sensitive data

Sensitive data threat detection lets you efficiently prioritize and examine security alerts by considering the sensitivity of the data that could be at risk, leading to better detection and preventing data breaches. By quickly identifying and addressing the most significant risks, this capability helps security teams reduce the likelihood of data breaches and enhances sensitive data protection by detecting exposure events and suspicious activities on resources containing sensitive data. 

This is a configurable feature in the new Defender for Storage plan. You can choose to enable or disable it with no additional cost.

Learn more about [scope and limitations of sensitive data scanning](concept-data-security-posture-prepare.md).

## How does sensitive data discovery work?

Sensitive data threat detection is powered by the sensitive data discovery engine, an agentless engine that uses a smart sampling method to find resources with sensitive data.

The service is integrated with Microsoft Purview's sensitive information types (SITs) and classification labels, allowing seamless inheritance of your organization's sensitivity settings. This ensures that the detection and protection of sensitive data aligns with your established policies and procedures.

:::image type="content" source="media/defender-for-storage-data-sensitivity/data-sensitivity-cspm-storage.png" alt-text="Diagram showing how Defender CSPM and Defender for Storage combine to provide data-aware security.":::

Upon enablement, the engine initiates an automatic scanning process across all supported storage accounts. Results are typically generated within 24 hours. Additionally, newly created storage accounts under protected subscriptions are scanned within six hours of their creation. Recurring scans are scheduled to occur weekly after the enablement date. This is the same engine that Defender CSPM uses to discover sensitive data.

## Prerequisites

Sensitive data threat detection is available for Blob storage accounts, including: Standard general-purpose V1, Standard general-purpose V2, Azure Data Lake Storage Gen2, and Premium block blobs. Learn more about the [availability of Defender for Storage features](defender-for-storage-introduction.md#availability).

To enable sensitive data threat detection at subscription and storage account levels, you need to have the relevant data-related permissions from the **Subscription owner** or **Storage account owner** roles. Learn more about the [roles and permissions required for sensitive data threat detection](support-matrix-defender-for-storage.md).

## Enabling sensitive data threat detection

Sensitive data threat detection is enabled by default when you enable Defender for Storage. You can [enable it or disable it](../storage/common/azure-defender-storage-configure.md) in the Azure portal or with other at-scale methods. This feature is included in the price of Defender for Storage.

## Using the sensitivity context in the security alerts

The sensitive data threat detection capability helps security teams identify and prioritize data security incidents for faster response times. Defender for Storage alerts include findings of sensitivity scanning and indications of operations that have been performed on resources containing sensitive data.

In the alert’s extended properties, you can find sensitivity scanning findings for a **blob container**: 

- Sensitivity scanning time UTC - when the last scan was performed
- Top sensitivity label - the most sensitive label found in the blob container
- Sensitive information types - information types that were found and whether they are based on custom rules
- Sensitive file types - the file types of the sensitive data

:::image type="content" source="media/defender-for-storage-data-sensitivity/sensitive-data-alerts.png" alt-text="Screenshot of an alert regarding sensitive data." lightbox="media/defender-for-storage-data-sensitivity/sensitive-data-alerts.png":::

## Integrate with the organizational sensitivity settings in Microsoft Purview (optional)

When you enable sensitive data threat detection, the sensitive data categories include built-in sensitive information types (SITs) in the default list of Microsoft Purview. This will affect the alerts you receive from Defender for Storage: storage or containers that are found with these SITs are marked as containing sensitive data.

To customize the Data Sensitivity Discovery for your organization, you can [create custom sensitive information types (SITs)](/microsoft-365/compliance/create-a-custom-sensitive-information-type) and connect to your organizational settings with a single step integration. Learn more [here](episode-two.md).

You also can create and publish sensitivity labels for your tenant in Microsoft Purview with a scope that includes Items and Schematized data assets and Auto-labeling rules (recommended). Learn more about [sensitivity labels](/microsoft-365/compliance/sensitivity-labels) in Microsoft Purview.

## Next steps

In this article, you learned about Microsoft Defender for Storage's sensitive data scanning.

> [!div class="nextstepaction"]
> [Enable Defender for Storage](enable-enhanced-security.md)
