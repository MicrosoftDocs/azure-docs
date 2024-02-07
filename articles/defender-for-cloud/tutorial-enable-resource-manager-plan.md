---
title: Protect your resources with the Resource Manager plan
description: Learn how to enable the Defender for Resource Manager plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your resources with Defender for Resource Manager

[Azure Resource Manager](../azure-resource-manager/management/overview.md) is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account. You use management features, like access control, locks, and tags, to secure and organize your resources after deployment.

Microsoft Defender for Resource Manager automatically monitors the resource management operations in your organization, whether they're performed through the Azure portal, Azure REST APIs, Azure CLI, or other Azure programmatic clients. Defender for Cloud runs advanced security analytics to detect threats and alerts you about suspicious activity.

Learn more about [Microsoft Defender for Resource Manager](defender-for-resource-manager-introduction.md).

You can learn more about Defender for Resource Manager's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

## Enable the Resource Manager plan

Microsoft Defender for Resource Manager automatically monitors the resource management operations in your organization, whether they're performed through the Azure portal, Azure REST APIs, Azure CLI, or other Azure programmatic clients. Defender for Cloud runs advanced security analytics to detect threats and alerts you about suspicious activity.

**To enable the Defender for Resource Manager plan on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the Resource Manager plan to **On**.

    :::image type="content" source="media/tutorial-enable-resource-manager-plan/enable-resource-manager.png" alt-text="Screenshot of the Defender for Cloud plans that shows where to enable the Resource Manager plan toggle." lightbox="media/tutorial-enable-resource-manager-plan/enable-resource-manager.png":::

1. Select **Save**.

## Next steps

[Overview of Microsoft Defender for Resource Manager](defender-for-resource-manager-introduction.md)
