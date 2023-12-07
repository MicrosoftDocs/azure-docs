---
title: Customize data sensitivity settings
description: Learn how to customize data sensitivity settings in Defender for Cloud
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 09/05/2023
---
# Customize data sensitivity settings

This article describes how to customize data sensitivity settings in Microsoft Defender for Cloud.

Data sensitivity settings are used to identify and focus on managing the critical sensitive data in your organization.

- The sensitive info types and sensitivity labels that come from Microsoft Purview compliance portal and which you can select in Defender for Cloud. By default Defender for Cloud uses the [built-in sensitive information types](/microsoft-365/compliance/sensitive-information-type-learn-about) provided by Microsoft Purview compliance portal. Some of the information types and labels are enabled by default, Of these built-in sensitive information types, there's a subset supported by sensitive data discovery. You can view a [reference list](sensitive-info-types.md) of this subset, which also lists which information types are supported by default. The [sensitivity settings page](data-sensitivity-settings.md) allows you to modify the default settings.
- You can optionally allow the import of custom sensitive info types and allow the import of [sensitivity labels](/microsoft-365/compliance/sensitivity-labels) that you defined in Microsoft Purview.
- If you import labels, you can set sensitivity thresholds that determine the minimum threshold sensitivity level for a label to be marked as sensitive in Defender for Cloud.

This configuration helps you focus on your critical sensitive resources and improve the accuracy of the sensitivity insights.

## Before you start

- Make sure that you [review the prerequisites and requirements](concept-data-security-posture-prepare.md#configuring-data-sensitivity-settings) for customizing data sensitivity settings.
- In Defender for Cloud, enable sensitive data discovery capabilities in the [Defender CSPM](data-security-posture-enable.md) and/or [Defender for Storage](defender-for-storage-data-sensitivity.md) plans.

Changes in sensitivity settings take effect the next time that resources are discovered.

## Import custom sensitive info types/labels

Defender for Cloud uses built-in sensitive info types. You can optionally import your own custom sensitive info types and labels from Microsoft Purview compliance portal to align with your organization's needs.

Import as follows (Import only once):

1. Log into Microsoft Purview compliance portal.
1. Navigate to Information Protection > [Labels](https://compliance.microsoft.com/informationprotection/labels).
1. In the consent notice message, select **Turn on** and then select **Yes** to share your custom info types and sensitivity labels with Defender for Cloud.

> [!NOTE]
>
> - Imported labels appear in Defender for Cloud in the order rank that's set in Microsoft Purview.
> - The two sensitivity labels that are set to highest priority in Microsoft Purview are turned on by default in Defender for Cloud.

## Customize sensitive data categories/types

To customize data sensitivity settings that appear in Defender for Cloud, review the [prerequisites](concept-data-security-posture-prepare.md#configuring-data-sensitivity-settings), and then do the following.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select **Data sensitivity**.
1. Select the info type category that you want to customize:
    - The **Finance**, **PII**, and **Credentials** categories contain the default info type data that are typically sought out by attackers.
    - The **Custom** category contains custom info types from your Microsoft Purview compliance portal configuration.
    - The **Other** category contains all of the rest of the built-in available info types.
1. Select the info types that you want to be marked as sensitive.
1. Select **Apply** and **Save**.

    :::image type="content" source="./media/concept-data-security-posture/data-sensitivity.png" alt-text="Screenshot of the data sensitivity page, showing the sensitivity settings.":::

## Set the threshold for sensitive data labels

 You can set a threshold to determine the minimum sensitivity level for a label to be marked as sensitive in Defender for Cloud.

If you're using Microsoft Purview sensitivity labels, make sure that:

- the label scope is set to "Items"; under which you should configure [auto labeling for files and emails](/microsoft-365/compliance/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-for-office-apps)
- labels must be [published](/microsoft-365/compliance/create-sensitivity-labels#publish-sensitivity-labels-by-creating-a-label-policy) with a label policy that is in effect.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select **Data sensitivity**.
    The current minimum sensitivity threshold is shown.
1. Select **Change** to see the list of sensitivity labels and select the lowest sensitivity label that you want marked as sensitive.
1. Select **Apply** and **Save**.

    :::image type="content" source="./media/concept-data-security-posture/sensitivity-threshold.png" alt-text="Screenshot of the data sensitivity page, showing the sensitivity label threshold.":::

> [!NOTE]
>
> - When you turn on the threshold, you select a label with the lowest setting that should be considered sensitive in your organization.
> - Any resources with this minimum label or higher are presumed to contain sensitive data.
> - For example, if you select **Confidential** as minimum, then **Highly Confidential** is also considered sensitive. **General**, **Public**, and **Non-Business** aren't.
> - You can’t select a sub label in the threshold. However, you can see the sublabel as the affected label on resources in attack path/Cloud Security Explorer, if the parent label is part of the threshold (part of the sensitive labels selected).
> - The same settings will apply to any supported resource (object storage and databases).

## Next steps

[Review risks](data-security-review-risks.md) to sensitive data
