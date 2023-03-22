---
title: Customize data sensitivity settings in Microsoft Defender for Cloud
description: Learn how to customize data sensitivity settings in Defender for Cloud
author: bmansheim
ms.author: benmansheim
ms.topic: how-to
ms.date: 03/22/2023
---
# Identify and protect sensitive data in Azure Storage

This article describes how to customize data sensitivity settings in Microsoft Defender for Cloud. 

[Data sensitivity settings](concept-data-security-posture.md#data-sensitivity-settings) are used to identify what's considered sensitive data in your organization. When scanning resource sensitivity in Defender for Cloud, scan results are based on:

- The sensitivity information types and labels you select in Defender for Cloud. By default Defender for Cloud uses the [built-in sensitive information types](/microsoft-365/compliance/sensitive-information-type-learn-about#built-in-sensitive-information-types) provided by Microsoft Purview. A selection of these are enabled by default, and you can modify as needed.
- You can optionally allow the import of customized sensitive information types and [sensitivity labels](/microsoft-365/compliance/sensitivity-labels#what-a-sensitivity-label-is) that you've defined in Microsoft Purview.
- If you import labels, you can set sensitivity thresholds that determine the minimum confidence level for a label to be marked as sensitive in Defender for Cloud. Thresholds make it easier to explore sensitive data.

Customizing sensitivity settings helps you to:

- Improve the accuracy of the sensitivity insights in Defender CSPM Cloud Security Graph, and in attack paths: 
- Hide sensitive data identification and security alerts for data that your organization considers non-sensitive.

## Before you start

- [Review the prerequisites](concept-data-security-posture-prepare.md#configuring-data-sensitivity-settings) for customizing data sensitivity settings.
- In Defender for Cloud, enable data-aware security capabilities in the [Defender CSPM](data-security-posture-enable.md) and/or [Defender for Storage](defender-for-storage-introduction.md) plans.

Note that changes in sensitivity settings take effect the next time that resources are scanned.

## Import custom sensitive info types/labels from Microsoft Purview

You can import your custom sensitivity types and labels from Microsoft Purview.

Import as follows:

1. Log into Microsoft Purview.
1. Select **Agree** for the consent notice to share your sensitivity labels with Defender for Cloud.

## Customize sensitive data categories/types

To customize sensitive data type settings that appear in Defender for Cloud


1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select **Data sensitivity**.
1. Select the info type category that you want to customize.
    - The **Finance**, **PII**, and **Credentials** categories contain all of the info types that are typically associated with those categories.
    - The **Custom** category contains custom types from your Microsoft Purview configuration.
    - The **Other** category contains all of the rest of the available info types.
1. Select the types that you want marked as sensitive data.
1. Select **Apply** and **Save**.

## Set the threshold for sensitive data labels

If you're using Microsoft Purview labels, you can set a threshold to determine the minimum confidence level for a label to be marked as sensitive in Defender for Cloud.

When you turn on the threshold, you select a label with the lowest setting that should be considered sensitive in your organization. Any resources with this minimum label or higher are presumed to contain sensitive data. For example, if you select **Confidential** as minimum, then **Highly Confidential** is also considered sensitive. **General**, **Public**, and **Non-Business** aren't.

To set the threshold for sensitive data labels:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select **Data sensitivity**.
    The current minimum sensitivity threshold is shown.
1. Select **Change** to see the list of sensitivity labels and select the lowest sensitivity level that you want marked as sensitive.
1. Select **Apply** and **Save**.


## Next steps
TODO: Add your next steps
