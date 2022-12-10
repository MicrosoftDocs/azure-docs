---
ms.service: defender-for-cloud
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/14/2022
ms.author: benmansheim
author: bmansheim
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

1. (Optional) Enable vulnerability scanning of your ECR images. Learn more about [vulnerability assessment for ECR images](../defender-for-containers-vulnerability-assessment-elastic.md).

3. (Optional) To change the retention period for your audit logs, select **Configure**, enter the required timeframe, and select **Save**.

    :::image type="content" source="../media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png" alt-text="Screenshot of adjusting the retention period for EKS control pane logs." lightbox="../media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png":::

    > [!Note]
    > If you disable this configuration, then the `Threat detection (control plane)` feature will be disabled. Learn more about [features availability](../supported-machines-endpoint-solutions-clouds-containers.md).

1. (Optional) Create exclusion tags for clusters that you don’t wish to onboard for AuditLogs.

1. (Optional) Enable “Defender’s extension for Azure Arc”. Learn more about Defender’s extension for Azure Arc [How to enable Microsoft Defender for Containers in Microsoft Defender for Cloud | Microsoft Learn](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-containers-enable?pivots=defender-for-container-arc&toc=%2Fazure%2Fazure-arc%2Fkubernetes%2Ftoc.json&bc=%2Fazure%2Fazure-arc%2Fkubernetes%2Fbreadcrumb%2Ftoc.json&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api#protect-arc-enabled-kubernetes-clusters)

1. (Optional) Enable “Azure Policy extension for Azure Arc”. Learn more about Azure Policy extension for Arc [Learn Azure Policy for Kubernetes - Azure Policy | Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/policy-for-kubernetes)

1. (Optional) Create exclusion tags for clusters that you don’t wish to onboard for Policy and Defender agents.

1. Continue through the remainder of the page of the connector wizard to add a role in AWS and execute the required Kubernetes script.

1. If you chose to enable Defender’s extension for Azure Arc and Azure Policy extension for Azure Arc, they will now be automatically installed.

3. Continue through the remaining pages of the connector wizard.

**Alternative: manual installation for specific clusters**

1. Azure Arc-enabled Kubernetes, the Defender extension, and the Azure Policy extension should be installed and running on your EKS clusters. There is a dedicated Defender for Cloud recommendations to install these extensions (and Azure Arc if necessary):
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
