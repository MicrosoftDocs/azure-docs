---
title: Identify and protect sensitive data in Azure Storage with Microsoft Defender for Cloud
description: Use Microsoft Defender for Cloud to identify sensitive data in your Azure Storage resources to get security alerts when the sensitive data is a risk and find resource configurations that leave your sensitive data open to attacks.
author: bmansheim
ms.author: benmansheim
ms.topic: how-to
ms.date: 03/09/2023
---
# Identify and protect sensitive data in Azure Storage

This article explains how to enable data-aware security capabilities in Microsoft Defender for Cloud to prevent leaks of sensitive information. The goal is to allow organizations to configure sensitivity settings for datastores in the cloud that generate sensitivity insights in the Cloud map. 

The sensitivity of resources in the cloud map is based on [Microsoft Purview settings and scan results](/microsoft-365/compliance/information-protection), and any labeled resource is considered sensitive. This article provides guidance on how you can use Defender for Cloud to identify sensitive resources by selecting the information types that are considered sensitive.

When you enable data-aware security capabilities with **Sensitive data discovery** for [Defender CSPM](data-security-posture-enable.md) and [Defender for Storage](defender-for-storage-introduction.md), Defender for Cloud uses algorithms to identify Azure Storage containers, and AWS S3 buckets that appear to contain sensitive data. The resources are labeled according to the default set of info types identified as sensitive in the data sensitivity settings. You can customize the data sensitivity settings to include additional info types. Customized sensitivity settings help you:

- Improve the accuracy of the sensitivity insights in the Cloud map, attack paths, and security alerts
- Hide sensitive data identification and security alerts for data that your organization considers non-sensitive

Attack path: Internet exposed Azure Storage container with sensitive data is publicly accessible

## Permissions

To configure data sensitivity settings, you must have the **Subscription Owner** role or have these specific permissions:

- Microsoft.Storage/storageAccounts/{read/write}
- Microsoft.Authorization/roleAssignments/{read/write/delete}

## Limitations

The identification of data sensitivity is updated every 7 days.

## Prerequisites

To see the sensitivity insights in Defender for Cloud, you must:

- In Microsoft Purview:
    - Consent to sharing sensitive data with Defender for Cloud.
    - Create and publish sensitivity labels for your tenant in Microsoft Purview with a scope that includes Items and Schematized data assets and Auto-labeling rules.
    Learn more about [sensitivity labels](/microsoft-365/compliance/create-sensitivity-labels) in Microsoft Purview.
- In Defender for Cloud, enable data-aware security capabilities for [Defender CSPM](data-security-posture-enable.md) and [Defender for Storage](defender-for-storage-introduction.md).

## Customize sensitive data categories

When you enable data-aware security capabilities in Defender for Cloud, the sensitive data categories include a default list of Microsoft Purview info types. Storage or containers that are found to contain these info types are marked as containing sensitive data.

To customize the data sensitivity discovery for your organization, you'll need to select in the data sensitivity settings the info types that you want to mark as sensitive. Some info types are organized in pre-defined categories, such as Personally Identifiable Information (PII) and Financial information. Custom labels are shown in the Custom category and all other info types are shown in the Other category.

To select the info types that you want to see marked as sensitive in Defender for Cloud:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select **Data sensitivity**.
1. Select the info type category that you want to customize.
    The Finance, PII, and Credentials categories are contain all of the info types that are typically associated with those categories. The Custom category contains custom info types from your Purview configuration. The Other category contains all of the rest of the available info types.
1. Select the info types that you want marked as sensitive data.
1. Select **Apply** and **Save**.

## Set the threshold for sensitive data labels

You can set the threshold for sensitive data labels to determine the minimum confidence level for a label to be marked as sensitive in Defender for Cloud. When you turn on the Sensitivity label threshold, you can select the label with the lowest sensitivity that you want to see marked as sensitive in Defender for Cloud. Any label with a lower sensitivity than the selected label is not marked as sensitive.

To set the threshold for sensitive data labels:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select **Data sensitivity**.
    The current minimum sensitivity threshold is shown.
1. Select **Change** to see the list of sensitivity labels and select the lowest sensitivity level that you want marked as sensitive.
1. Select **Apply** and **Save**.

## Next steps
TODO: Add your next steps
