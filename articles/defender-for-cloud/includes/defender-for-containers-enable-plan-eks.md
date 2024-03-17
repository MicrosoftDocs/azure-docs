---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 12/11/2023
ms.author: dacurwin
author: dcurwin
---
## Enable the plan

> [!IMPORTANT]
>
> - If you haven't already connected an AWS account, [connect your AWS accounts to Microsoft Defender for Cloud](../tutorial-enable-container-aws.md).
> - If you have already enabled the plan on your connector, and you would like to change optional configurations or enable new capabilities, go directly to step 4.

To protect your EKS clusters, enable the Containers plan on the relevant account connector:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the AWS connector.

    :::image type="content" source="../media/defender-for-kubernetes-intro/select-aws-connector.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing an AWS connector.":::

1. Verify that the toggle for the **Containers** plan is set to **On**.

    :::image type="content" source="../media/defender-for-kubernetes-intro/enable-containers-plan-on-aws-connector.png" alt-text="Screenshot of enabling Defender for Containers for an AWS connector.":::

1. To change optional configurations for the plan, select **Settings**.

    :::image type="content" source="../media/tutorial-enable-containers-aws/containers-settings.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing the settings for the Containers plan." lightbox="../media/tutorial-enable-containers-aws/containers-settings.png":::

    - Defender for Containers requires control plane audit logs to provide [runtime threat protection](../defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters). To send Kubernetes audit logs to Microsoft Defender, toggle the setting to **On.** To change the retention period for your audit logs, enter the required time frame.

        > [!NOTE]
        > If you disable this configuration, then the `Threat detection (control plane)` feature will be disabled. Learn more about [features availability](../supported-machines-endpoint-solutions-clouds-containers.md).

    - [Agentless discovery for Kubernetes](../defender-for-containers-architecture.md#how-does-agentless-discovery-for-kubernetes-in-aws-work) provides API-based discovery of your Kubernetes clusters. To enable the **Agentless discovery for Kubernetes** feature, toggle the setting to **On**.
    - The [Agentless Container Vulnerability Assessment](../agentless-vulnerability-assessment-aws.md) provides vulnerability management for images stored in ECR and running images on your EKS clusters. To enable the **Agentless Container Vulnerability Assessment** feature, toggle the setting to **On**.

1. Continue through the remaining pages of the connector wizard.

1. If you're enabling the **Agentless Discovery for Kubernetes** feature, you need to grant control plane permissions on the cluster. You can do this in one of the following ways:

    - Run [this Python script](https://github.com/Azure/Microsoft-Defender-for-Cloud/blob/main/Onboarding/AWS/ReadMe.md) to grant the permissions. The script adds the Defender for Cloud role *MDCContainersAgentlessDiscoveryK8sRole* to the *aws-auth ConfigMap* of the EKS clusters that you wish to onboard.
    - Grant each Amazon EKS cluster the *MDCContainersAgentlessDiscoveryK8sRole* role with the ability to interact with the cluster. Sign into all existing and newly created clusters using [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) and execute the following script:

        ```bash
            eksctl create iamidentitymapping \ 
            --cluster my-cluster \ 
            --region region-code \ 
            --arn arn:aws:iam::account:role/MDCContainersAgentlessDiscoveryK8sRole \ 
            --group system:masters\ 
            --no-duplicate-arns
        ```

        For more information, see [Enabling IAM principal access to your cluster](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html).

1. Azure Arc-enabled Kubernetes, the Defender sensor, and Azure Policy for Kubernetes should be installed and running on your EKS clusters. There is a dedicated Defender for Cloud recommendations to install these extensions (and Azure Arc if necessary):
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
