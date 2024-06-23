---
title: Protect your Amazon Web Service (AWS) accounts containers with Defender for Containers
description: Learn how to enable the Defender for Containers plan on your Amazon Web Service (AWS) accounts for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 01/10/2024
---

# Protect your Amazon Web Service (AWS) containers with Defender for Containers

Defender for Containers in Microsoft Defender for Cloud is the cloud-native solution that is used to secure your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications.

Learn more about [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).

You can learn more about Defender for Container's pricing on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- [Connect your AWS account to Microsoft Defender for Cloud](quickstart-onboard-aws.md#connect-your-aws-account)

- Verify your Kubernetes nodes can access source repositories of your package manager. For information about the requirements, see [Network requirements](defender-for-containers-enable.md?tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-eks&preserve-view=true#network-requirements).

- Ensure the following [Azure Arc-enabled Kubernetes network requirements](../azure-arc/kubernetes/quickstart-connect-cluster.md) are validated.

## Enable the Defender for Containers plan on your AWS account

To protect your EKS clusters, you need to enable the Containers plan on the relevant AWS account connector.

**To enable the Defender for Containers plan on your AWS account**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant AWS account.

    :::image type="content" source="media/tutorial-enable-containers-aws/aws-account.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing an AWS connector.":::

1. Set the toggle for the **Containers** plan to **On**.

    :::image type="content" source="media/tutorial-enable-containers-aws/aws-containers-enabled.png" alt-text="Screenshot of enabling Defender for Containers for an AWS connector." lightbox="media/tutorial-enable-containers-aws/aws-containers-enabled.png":::

1. To change optional configurations for the plan, select **Settings**.

    :::image type="content" source="media/tutorial-enable-containers-aws/containers-settings.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing the settings for the Containers plan." lightbox="media/tutorial-enable-containers-aws/containers-settings.png":::

    - Defender for Containers requires control plane audit logs to provide [runtime threat protection](defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters). To send Kubernetes audit logs to Microsoft Defender, toggle the setting to **On.** To change the retention period for your audit logs, enter the required time frame.

        > [!NOTE]
        > If you disable this configuration, then the `Threat detection (control plane)` feature will be disabled. Learn more about [features availability](supported-machines-endpoint-solutions-clouds-containers.md).

    - [Agentless discovery for Kubernetes](defender-for-containers-architecture.md#how-does-agentless-discovery-for-kubernetes-in-aws-work) provides API-based discovery of your Kubernetes clusters. To enable the **Agentless discovery for Kubernetes** feature, toggle the setting to **On**.
    - The [Agentless Container Vulnerability Assessment](agentless-vulnerability-assessment-aws.md) provides vulnerability management for images stored in ECR and running images on your EKS clusters. To enable the **Agentless Container Vulnerability Assessment** feature, toggle the setting to **On**.

1. Select **Next: Review and generate**.

1. Select **Update**.

> [!NOTE]
> To enable or disable individual Defender for Containers capabilities, either globally or for specific resources, see [How to enable Microsoft Defender for Containers components](defender-for-containers-enable.md).

## Deploy the Defender sensor in EKS clusters

Azure Arc-enabled Kubernetes, the Defender sensor, and Azure Policy for Kubernetes should be installed and running on your EKS clusters. There's a dedicated Defender for Cloud recommendation that can be used to install these extensions (and Azure Arc if necessary):

- `EKS clusters should have Microsoft Defender's extension for Azure Arc installed`

**To deploy the required extensions**:

1. From Defender for Cloud's **Recommendations** page, search for one of the recommendations by name.

1. Select an unhealthy cluster.

    > [!IMPORTANT]
    > You must select the clusters one at a time.
    >
    > Don't select the clusters by their hyperlinked names: select anywhere else in the relevant row.

1. Select **Fix**.

1. Defender for Cloud generates a script in the language of your choice:
    - For Linux, select **Bash**.
    - For Windows, select **PowerShell**.

1. Select **Download remediation logic**.

1. Run the generated script on your cluster.

    :::image type="content" source="media/tutorial-enable-containers-aws/generate-script-defender-extension-kubernetes.gif" alt-text="Video of how to use the Defender for Cloud recommendation to generate a script for your EKS clusters that enables the Azure Arc extension. ":::

## Next steps

- For advanced enablement features for Defender for Containers, see the [Enable Microsoft Defender for Containers](defender-for-containers-enable.md) page.

- [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).
