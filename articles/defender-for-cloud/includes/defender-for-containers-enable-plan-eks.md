---
ms.service: defender-for-cloud
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/14/2022
ms.author: dacurwin
author: dcurwin
---
## Protect Amazon Elastic Kubernetes Service clusters

> [!IMPORTANT]
> If you haven't already connected an AWS account, [connect your AWS accounts to Microsoft Defender for Cloud](../quickstart-onboard-aws.md).

To protect your EKS clusters, enable the Containers plan on the relevant account connector:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the AWS connector.

    :::image type="content" source="../media/defender-for-kubernetes-intro/select-aws-connector.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing an AWS connector.":::

1. Set the toggle for the **Containers** plan to **On**.

    :::image type="content" source="../media/defender-for-kubernetes-intro/enable-containers-plan-on-aws-connector.png" alt-text="Screenshot of enabling Defender for Containers for an AWS connector.":::

1. (Optional) To change the retention period for your audit logs, select **Configure**, enter the required timeframe, and select **Save**.

    :::image type="content" source="../media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png" alt-text="Screenshot of adjusting the retention period for EKS control pane logs." lightbox="../media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png":::

    > [!Note]
    > If you disable this configuration, then the `Threat detection (control plane)` feature will be disabled. Learn more about [features availability](../supported-machines-endpoint-solutions-clouds-containers.md).

1. (Optional) Enable vulnerability scanning of your ECR images. Learn more about [vulnerability assessment for ECR images](../defender-for-containers-vulnerability-assessment-elastic.md).

1. Continue through the remaining pages of the connector wizard.

1. Azure Arc-enabled Kubernetes, the Defender agent, and Azure Policy for Kubernetes should be installed and running on your EKS clusters. There is a dedicated Defender for Cloud recommendations to install these extensions (and Azure Arc if necessary):
    - `EKS clusters should have Microsoft Defender's extension for Azure Arc installed`

    For each of the recommendations, follow the steps below to install the required extensions.

    **To install the required extensions**:
    1. From Defender for Cloud's **Recommendations** page, search for one of the recommendations by name.
    1. Select an unhealthy cluster.

        > [!IMPORTANT]
        > You must select the clusters one at a time.
        >
        > Don't select the clusters by their hyperlinked names: select anywhere else in the relevant row.

    1. Select **Fix**.
    1. Defender for Cloud generates a script in the language of your choice: select Bash (for Linux) or PowerShell (for Windows).
    1. Select **Download remediation logic**.
    1. Run the generated script on your cluster.
    1. Repeat steps *"a" through "f"* for the second recommendation.

    :::image type="content" source="../media/defender-for-kubernetes-intro/generate-script-defender-extension-kubernetes.gif" alt-text="Video of how to use the Defender for Cloud recommendation to generate a script for your EKS clusters that enables the Azure Arc extension. ":::

### View recommendations and alerts for your EKS clusters

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).

To view the alerts and recommendations for your EKS clusters, use the filters on the alerts, recommendations, and inventory pages to filter by resource type **AWS EKS cluster**.

:::image type="content" source="../media/defender-for-kubernetes-intro/view-alerts-for-aws-eks-clusters.png" alt-text="Screenshot of how to use filters on Microsoft Defender for Cloud's security alerts page to view alerts related to AWS EKS clusters." lightbox="../media/defender-for-kubernetes-intro/view-alerts-for-aws-eks-clusters.png":::
