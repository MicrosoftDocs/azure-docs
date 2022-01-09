---
title: Microsoft Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for Kubernetes.
ms.date: 11/23/2021
ms.topic: overview
---

# Introduction to Microsoft Defender for Kubernetes (deprecated)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Cloud provides environment hardening, workload protection, and run-time protections as outlined in [Container security in Defender for Cloud](defender-for-containers-introduction.md).

Defender for Kubernetes protects your Kubernetes clusters whether they're running in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications.

- **Amazon Elastic Kubernetes Service (EKS) in a connected Amazon Web Services (AWS) account** (preview) - Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

- **An unmanaged Kubernetes distribution** - Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters on premises or on IaaS. Learn more in [Defend Azure Arc-enabled Kubernetes clusters running in on-premises and multi-cloud environments](defender-for-kubernetes-azure-arc.md).

Host-level threat detection for your Linux AKS nodes is available if you enable [Microsoft Defender for servers](defender-for-servers-introduction.md) and its Log Analytics agent. However, if your cluster is deployed on an Azure Kubernetes Service virtual machine scale set, the Log Analytics agent is not currently supported.


## Availability

> [!IMPORTANT]
> Microsoft Defender for Kubernetes has been replaced with **Microsoft Defender for Containers**. If you've already enabled Defender for Kubernetes on a subscription, you can continue to use it. However, you won't get Defender for Containers' improvements and new features.
>
> This plan is no longer available for subscriptions where it isn't already enabled.
>
> To upgrade to Microsoft Defender for Containers, open the Defender plans page in the portal and enable the new plan:
>
> :::image type="content" source="media/defender-for-containers/enable-defender-for-containers.png" alt-text="Enable Microsoft Defender for Containers from the Defender plans page.":::
>
> Learn more about this change in [the release note](release-notes.md#microsoft-defender-for-containers-plan-released-for-general-availability-ga).


|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)<br>Protections for EKS clusters are preview. [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]|
|Pricing:|**Microsoft Defender for Kubernetes** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).<br>**Containers plan** for EKS clusters in connected AWS accounts is free while it's in preview.|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview)|
|||

## What are the benefits of Microsoft Defender for Kubernetes?

Our global team of security researchers constantly monitor the threat landscape. As container-specific alerts and vulnerabilities are discovered, these researchers add them to our threat intelligence feeds and Defender for Cloud alerts you to any that are relevant for your environment.

In addition, Microsoft Defender for Kubernetes provides **cluster-level threat protection** by monitoring your clusters' logs. This means that security alerts are only triggered for actions and deployments that occur *after* you've enabled Defender for Kubernetes on your subscription.

> [!TIP]
> For EKS-based clusters, we monitor the control plane audit logs. These are enabled in the containers plan configuration:
> :::image type="content" source="media/defender-for-kubernetes-intro/eks-audit-logs-enabled.png" alt-text="Screenshot of AWS connector's containers plan with audit logs enabled.":::

Examples of security events that Microsoft Defender for Kubernetes monitors include:

- Exposed Kubernetes dashboards
- Creation of high privileged roles
- Creation of sensitive mounts.

For a full list of the cluster level alerts, see the [reference table of alerts](alerts-reference.md#alerts-k8scluster).


## Protect Azure Kubernetes Service (AKS) clusters

To protect your AKS clusters, enable the Defender plan on the relevant subscription:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription.
1. In the **Defender plans** page, set the status of Microsoft Defender for Kubernetes to **On**.

    :::image type="content" source="media/defender-for-kubernetes-intro/enable-defender-for-kubernetes.png" alt-text="Screenshot of Microsoft Defender for Kubernetes plan being enabled.":::

1. Select **Save**.

## Protect Amazon Elastic Kubernetes Service clusters

> [!IMPORTANT]
> If you haven't already connected an AWS account, do so now using the instructions in [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md) and skip to step 3 below.

To protect your EKS clusters, enable the Containers plan on the relevant account connector:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the AWS connector.

    :::image type="content" source="media/defender-for-kubernetes-intro/select-aws-connector.png" alt-text="Screenshot of Defender for Cloud's environment settings page showing an AWS connector.":::

1. Set the toggle for the **Containers** plan to **On**.

    :::image type="content" source="media/defender-for-kubernetes-intro/enable-containers-plan-on-aws-connector.png" alt-text="Screenshot of enabling Defender for Containers for an AWS connector.":::

1. Optionally, to change the retention period for your audit logs, select **Configure**, enter the desired timeframe, and select **Save**.

    :::image type="content" source="media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png" alt-text="Screenshot of adjusting the retention period for EKS control pane logs." lightbox="./media/defender-for-kubernetes-intro/adjust-eks-logs-retention.png":::

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

    :::image type="content" source="media/defender-for-kubernetes-intro/generate-script-defender-extension-kubernetes.gif" alt-text="Video of how to use the Defender for Cloud recommendation to generate a script for your EKS clusters that enables the Azure Arc extension. ":::

### View recommendations and alerts for your EKS clusters

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).

To view the alerts and recommendations for your EKS clusters, use the filters on the alerts, recommendations, and inventory pages to filter by resource type **AWS EKS cluster**.

:::image type="content" source="media/defender-for-kubernetes-intro/view-alerts-for-aws-eks-clusters.png" alt-text="Screenshot of how to use filters on Microsoft Defender for Cloud's alerts page to view alerts related to AWS EKS clusters." lightbox="./media/defender-for-kubernetes-intro/view-alerts-for-aws-eks-clusters.png":::

## FAQ - Microsoft Defender for Kubernetes

- [Can I still get cluster protections without the Log Analytics agent?](#can-i-still-get-cluster-protections-without-the-log-analytics-agent)
- [Does AKS allow me to install custom VM extensions on my AKS nodes?](#does-aks-allow-me-to-install-custom-vm-extensions-on-my-aks-nodes)
- [If my cluster is already running an Azure Monitor for containers agent, do I need the Log Analytics agent too?](#if-my-cluster-is-already-running-an-azure-monitor-for-containers-agent-do-i-need-the-log-analytics-agent-too)
- [Does Microsoft Defender for Kubernetes support AKS with virtual machine scale set nodes?](#does-microsoft-defender-for-kubernetes-support-aks-with-virtual-machine-scale-set-nodes)

### Can I still get cluster protections without the Log Analytics agent?

**Microsoft Defender for Kubernetes** provides protections at the cluster level. If you also deploy the Log Analytics agent of **Microsoft Defender for servers**, you'll get the threat protection for your nodes that's provided with that plan. Learn more in [Introduction to Microsoft Defender for servers](defender-for-servers-introduction.md).

We recommend deploying both, for the most complete protection possible.

If you choose not to install the agent on your hosts, you'll only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

### Does AKS allow me to install custom VM extensions on my AKS nodes?

For Defender for Cloud to monitor your AKS nodes, they must be running the Log Analytics agent.

AKS is a managed service and since the Log Analytics agent is a Microsoft-managed extension, it is also supported on AKS clusters. However, if your cluster is deployed on an Azure Kubernetes Service virtual machine scale set, the Log Analytics agent isn't currently supported.

### If my cluster is already running an Azure Monitor for containers agent, do I need the Log Analytics agent too?

For Defender for Cloud to monitor your nodes, they must be running the Log Analytics agent.

If your clusters are already running the Azure Monitor for containers agent, you can install the Log Analytics agent too and the two agents can work alongside one another without any problems.

[Learn more about the Azure Monitor for containers agent](../azure-monitor/containers/container-insights-manage-agent.md).

### Does Microsoft Defender for Kubernetes support AKS with virtual machine scale set nodes?

If your cluster is deployed on an Azure Kubernetes Service virtual machine scale set, the Log Analytics agent is not currently supported.

## Next steps

In this article, you learned about Kubernetes protection in Defender for Cloud, including Microsoft Defender for Kubernetes.

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)

For related material, see the following articles:

- [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md)
- [Reference table of alerts](alerts-reference.md)
