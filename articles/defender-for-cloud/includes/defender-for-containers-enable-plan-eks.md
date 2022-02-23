---
author: memildin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/10/2022
ms.author: memildin
---
## Protect Amazon Elastic Kubernetes Service clusters

> [!IMPORTANT]
> If you haven't already connected an AWS account, do so now using the instructions in [Connect your AWS accounts to Microsoft Defender for Cloud](../quickstart-onboard-aws.md) and skip to step 3 below.

To protect your EKS clusters, enable the Containers plan on the relevant account connector:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the AWS connector.

    :::image type="content" source="../media/defender-for-kubernetes-intro/select-aws-connector.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing an AWS connector.":::

1. Set the toggle for the **Containers** plan to **On**.

    :::image type="content" source="../media/defender-for-kubernetes-intro/enable-containers-plan-on-aws-connector.png" alt-text="Screenshot of enabling Defender for Containers for an AWS connector.":::

1. Optionally, to change the retention period for your audit logs, select **Configure**, enter the required timeframe, and select **Save**.

    :::image type="content" source="../media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png" alt-text="Screenshot of adjusting the retention period for EKS control pane logs." lightbox="../media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png":::

1. Continue through the remaining pages of the connector wizard.

1. Azure Arc-enabled Kubernetes and the Defender extension should be installed and running on your EKS clusters. A dedicated Defender for Cloud recommendation deploys the extension (and Arc if necessary):

    1. From Defender for Cloud's **Recommendations** page, search for **EKS clusters should have Azure Defender's extension for Azure Arc installed**.
    1. Select an unhealthy cluster.

        > [!IMPORTANT]
        > You must select the clusters one at a time.
        >
        > Don't select the clusters by their hyperlinked names: select anywhere else in the relevant row.

    1. Select **Fix**.
    1. Defender for Cloud generates a script in the language of your choice: select Bash (for Linux) or PowerShell (for Windows).
    1. Select **Download remediation logic**.
    1. Run the generated script on your cluster. 

    :::image type="content" source="../media/defender-for-kubernetes-intro/generate-script-defender-extension-kubernetes.gif" alt-text="Video of how to use the Defender for Cloud recommendation to generate a script for your EKS clusters that enables the Azure Arc extension. ":::

### View recommendations and alerts for your EKS clusters

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).

To view the alerts and recommendations for your EKS clusters, use the filters on the alerts, recommendations, and inventory pages to filter by resource type **AWS EKS cluster**.

:::image type="content" source="../media/defender-for-kubernetes-intro/view-alerts-for-aws-eks-clusters.png" alt-text="Screenshot of how to use filters on Microsoft Defender for Cloud's alerts page to view alerts related to AWS EKS clusters." lightbox="../media/defender-for-kubernetes-intro/view-alerts-for-aws-eks-clusters.png":::
