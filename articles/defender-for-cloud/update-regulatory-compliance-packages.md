---
title: Assign regulatory compliance standards in Microsoft Defender for Cloud
description: Learn how to assign regulatory compliance standards in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 02/26/2024
ms.custom: ignite-2023
---

# Assign security standards

Defender for Cloud's regulatory standards and benchmarks are represented as [security standards](security-policy-concept.md). Each standard is an initiative defined in Azure Policy.

In Defender for Cloud, you assign security standards to specific scopes such as Azure subscriptions, AWS accounts, and GCP projects that have Defender for Cloud enabled.

Defender for Cloud continually assesses the environment-in-scope against standards. Based on assessments, it shows in-scope resources as being compliant or noncompliant with the standard, and provides remediation recommendations.

This article describes how to add regulatory compliance standards as security standards in an Azure subscription, AWS account, or GCP project.

## Before you start

- To add compliance standards, at least one Defender for Cloud plan must be enabled.
- You need `Owner` or `Policy Contributor` permissions to add a standard.

## Assign a standard (Azure)

**To assign regulatory compliance standards on Azure**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Regulatory compliance**. For each standard, you can see the applied subscription.

1. Select **Manage compliance policies**.

    :::image type="content" source="media/update-regulatory-compliance-packages/manage-compliance.png" alt-text="Screenshot of the regulatory compliance page that shows you where to select the manage compliance policy button." lightbox="media/update-regulatory-compliance-packages/manage-compliance.png":::

1. Select the subscription or management group on which you want to assign the security standard.

    > [!NOTE]
    > We recommend selecting the highest scope for which the standard is applicable so that compliance data is aggregated and tracked for all nested resources.

1. Select **Security policies**.

1. Locate the standard you want to enable and toggle the status to **On**.

    :::image type="content" source="media/update-regulatory-compliance-packages/turn-standard-on.png" alt-text="Screenshot showing regulatory compliance dashboard options."  lightbox="media/update-regulatory-compliance-packages/turn-standard-on.png":::

    If any information is needed in order to enable the standard, the **Set parameters** page appears for you to type in the information.

The selected standard appears in **Regulatory compliance** dashboard as enabled for the subscription it was enabled on.

## Assign a standard (AWS)

**To assign regulatory compliance standards on AWS accounts**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Regulatory compliance**. For each standard, you can see the applied subscription.

1. Select **Manage compliance policies**.

1. Select the relevant AWS account.

1. Select **Security policies**.

1. In the **Standards** tab, select the three dots in the standard you want to assign > **Assign standard**.

    :::image type="content" source="media/update-regulatory-compliance-packages/assign-standard-aws-from-list.png" alt-text="Screenshot that shows where to select a standard to assign." lightbox="media/update-regulatory-compliance-packages/assign-standard-aws-from-list.png":::

1. At the prompt, select **Yes**. The standard is assigned to your AWS account.

    :::image type="content" source="media/update-regulatory-compliance-packages/assign-standard-aws.png" alt-text="Screenshot of the prompt to assign a regulatory compliance standard to the AWS account." lightbox="media/update-regulatory-compliance-packages/assign-standard-aws.png":::

The selected standard appears in **Regulatory compliance** dashboard as enabled for the account.

## Assign a standard (GCP)

**To assign regulatory compliance standards on GCP projects**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Regulatory compliance**. For each standard, you can see the applied subscription.

1. Select **Manage compliance policies**.

1. Select the relevant GCP project.

1. Select **Security policies**.

1. In the **Standards** tab, select the three dots alongside an unassigned standard and select **Assign standard**.

    :::image type="content" source="media/update-regulatory-compliance-packages/assign-standard-gcp-from-list.png" alt-text="Screenshot that shows how to assign a standard to your GCP project." lightbox="media/update-regulatory-compliance-packages/assign-standard-gcp-from-list.png":::

1. At the prompt, select **Yes**. The standard is assigned to your GCP project.

The selected standard appears in the **Regulatory compliance** dashboard as enabled for the project.

## Next steps

- [Create custom security standards and recommendations](create-custom-recommendations.md)
- [Improve regulatory compliance](regulatory-compliance-dashboard.md)
