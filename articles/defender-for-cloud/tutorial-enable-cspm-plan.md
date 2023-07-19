---
title: Protect your resources with Defender CSPM plan on your subscription
description: Learn how to enable Defender CSPM on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/27/2023
---

# Protect your resources with Defender CSPM

Defender Cloud Security Posture Management (CSPM) in Microsoft Defender for Cloud provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues. Defender for Cloud shows you your security posture with the secure score. The secure score is an aggregated score of the security findings that tells you your current security situation. The higher the score, the lower the identified risk level.

When you enable Defender for Cloud, you automatically enable the **Foundational CSPM capabilities**. these capabilities are part of the free services offered by Defender for Cloud.

You have the ability to enable the **Defender CSPM** plan, which offers extra protections for your environments such as governance, regulatory compliance, cloud security explorer, attack path analysis and agentless scanning for machines.

> [!NOTE]
> Agentless scanning requires the **Subscription Owner** to enable the Defender CSPM plan. Anyone with a lower level of authorization can enable the Defender CSPM plan, but the agentless scanner won't be enabled by default due a lack of required permissions that are only available to the Subscription Owner. In addition, attack path analysis and security explorer won't populate with vulnerabilities because the agentless scanner is disabled.

For availability and to learn more about the features offered by each plan, see the [Defender CSPM plan options](concept-cloud-security-posture-management.md#defender-cspm-plan-options).

You can learn more about Defender for CSPM's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/). 

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Connect your [non-Azure machines](quickstart-onboard-machines.md), [AWS accounts](quickstart-onboard-aws.md) or [GCP projects](quickstart-onboard-gcp.md). 

- In order to gain access to all of the features available from the CSPM plan, the plan must be enabled by the **Subscription Owner**.

## Enable the Defender for CSPM plan

When you enable Defender for Cloud, you automatically receive the protections offered by the Foundational CSPM capabilities. In order to gain access to the other features provided by Defender CSPM, you need to enable the Defender CSPM plan on your subscription.

**To enable the Defender for CSPM plan on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription, AWS account or GCP project.

1. On the Defender plans page, toggle the Defender CSPM plan to **On**.

1. Select **Save**.

## Configure monitoring coverage

Once the Defender CSPM plan is enabled on your subscription, you have the ability to disable the agentless scanner or add exclusion tags to your subscription.

**To configure monitoring coverage**:

1. On the Defender plans page, select **Settings**.

    :::image type="content" source="media/tutorial-enable-cspm-plan/cspm-settings.png" alt-text="Screenshot of the Defender plans page that shows where to select the settings option." lightbox="media/tutorial-enable-cspm-plan/cspm-settings.png":::

1. On the Settings and monitoring page, select **Edit configuration**.

    :::image type="content" source="media/tutorial-enable-cspm-plan/cspm-configuration.png" alt-text="Screenshot that shows where to select edit configuration." lightbox="media/tutorial-enable-cspm-plan/cspm-configuration.png":::

1. Enter a tag name and tag value for any machines to be excluded from scans.

1. Select **Apply**. 

## Next steps

[Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md)
