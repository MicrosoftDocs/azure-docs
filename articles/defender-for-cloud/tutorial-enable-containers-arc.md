---
title: Protect your on-premises Kubernetes clusters with Defender for Containers
description: Learn how to enable the Defender for Containers plan on your on-premises devices for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/27/2023
---

# Protect your on-premises Kubernetes clusters with Defender for Containers

Defender for Containers in Microsoft Defender for Cloud is the cloud-native solution that is used to secure your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications.

Learn more about [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).

You can learn more about Defender for Container's pricing on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Ensure the following [Azure Arc-enabled Kubernetes network requirements](../azure-arc/kubernetes/network-requirements.md) are validated and [connect the Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).

- Validate the following endpoints are configured for outbound access so that the Defender extension can connect to Microsoft Defender for Cloud to send security data and events:

    | Domain                     | Port |
    | -------------------------- | ---- |
    | *.ods.opinsights.azure.com | 443  |
    | *.oms.opinsights.azure.com | 443  |
    | login.microsoftonline.com  | 443  |

- [Connect the Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md)

## Enable the Defender for Containers plan

By default, when enabling the plan through the Azure portal, Microsoft Defender for Containers is configured to automatically install required components to provide the protections offered by plan, including the assignment of a default workspace.

If you would prefer to [assign a custom workspace](defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#assign-a-custom-workspace), one can be assigned through the Azure Policy.

**To enable Defender for Containers plan on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the Containers plan to **On**.

    :::image type="content" source="media/tutorial-enable-containers-azure/containers-enabled-aks.png" alt-text="Screenshot of the Defender plans page that shows where to toggle the containers plan switch to on is located." lightbox="media/tutorial-enable-containers-azure/containers-enabled-aks.png":::

1. Select **Save**.

> [!NOTE]
> To enable or disable individual Defender for Containers capabilities, either globally or for specific resources, see [How to enable Microsoft Defender for Containers components](defender-for-containers-enable.md).

## Deploy the Defender extension on Arc-enabled Kubernetes clusters that were onboarded to an Azure subscription

You can enable the Defender for Containers plan and deploy all of the relevant components in different ways. We walk you through the steps to accomplish this using the Azure portal. Learn how to [deploy the Defender extension](/azure/defender-for-cloud/defender-for-containers-enable?pivots=defender-for-container-arc&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api#deploy-the-defender-extension) with REST API, Azure CLI or with a Resource Manager template.

**To deploy the Defender profile in Azure:**

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Navigate to the Recommendations page.

1. Search for and select the `Azure Arc-enabled Kubernetes clusters should have Defender for Cloud's extension installed` recommendation.

    :::image type="content" source="media/tutorial-enable-containers-azure/extension-recommendation.png" alt-text="Microsoft Defender for Cloud's recommendation for deploying the Defender extension for Azure Arc-enabled Kubernetes clusters." lightbox="media/tutorial-enable-containers-azure/extension-recommendation.png":::

1. Select all of the relevant affected resources.

1. Select **Fix**.

## Next steps

- For advanced enablement features for Defender for Containers, see the [Enable Microsoft Defender for Containers](defender-for-containers-enable.md) page.

- [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).
