---
title: Protect your Azure containers with the Defender for Containers plan on your Azure subscription
description: Learn how to enable the Defender for Containers plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your Azure containers with Defender for Containers

Microsoft Defender for Containers is a cloud-native solution to improve, monitor, and maintain the security of your containerized assets (Kubernetes clusters, Kubernetes nodes, Kubernetes workloads, container registries, container images and more), and their applications, across multicloud and on-premises environments.

Learn more about [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).

You can learn more about Defender for Container's pricing on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Ensure the [required Fully Qualified Domain Names (FQDN)/application](../aks/limit-egress-traffic.md) endpoints are configured for outbound access so the Defender sensor can connect to Microsoft Defender for Cloud to send security data and events.

    > [!NOTE]
    > By default, AKS clusters have unrestricted outbound (egress) internet access.

## Enable the Defender for Containers plan

By default, when enabling the plan through the Azure portal, Microsoft Defender for Containers is configured to automatically enable all capabilities and install required components to provide the protections offered by plan, including the assignment of a default workspace.

If you would prefer to [assign a custom workspace](defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api#assign-a-custom-workspace), one can be assigned through the Azure Policy.

**To enable Defender for Containers plan on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant Azure subscription.

1. On the Defender plans page, toggle the Containers plan to **On**.

    :::image type="content" source="media/tutorial-enable-containers-azure/containers-enabled-aks.png" alt-text="Screenshot of the Defender plans page that shows where to toggle the containers plan switch to on is located." lightbox="media/tutorial-enable-containers-azure/containers-enabled-aks.png":::

1. Select **Save**.

## Deploy the Defender sensor in Azure

> [!NOTE]
> To enable or disable individual Defender for Containers capabilities, either globally or for specific resources, see [How to enable Microsoft Defender for Containers components](defender-for-containers-enable.md).

You can enable the Defender for Containers plan and deploy all of the relevant components in different ways. We walk you through the steps to accomplish this using the Azure portal. Learn how to [deploy the Defender sensor](defender-for-containers-enable.md#deploy-the-defender-sensor) with REST API, Azure CLI or with a Resource Manager template.

**To deploy the Defender sensor in Azure:**

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to the Recommendations page.

1. Search for and select the `Azure Kubernetes Service clusters should have Defender profile enabled` recommendation.

    :::image type="content" source="media/tutorial-enable-containers-azure/recommendation-search.png" alt-text="Screenshot of the recommendations page that shows where to search for and find the Azure Kubernetes service cluster recommendation is located." lightbox="media/tutorial-enable-containers-azure/recommendation-search.png":::

1. Select all of the relevant affected resources.

1. Select **Fix**.

    :::image type="content" source="media/tutorial-enable-containers-azure/affected-fix.png" alt-text="Screenshot of the recommendation with the affected resources selected that shows you how to select the fix button." lightbox="media/tutorial-enable-containers-azure/affected-fix.png":::

## Next steps

- For advanced enablement features for Defender for Containers, see the [Enable Microsoft Defender for Containers](defender-for-containers-enable.md) page.

- [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).
