---
title: Microsoft Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for Kubernetes.
author: memildin
ms.author: memildin
ms.date: 11/09/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Microsoft Defender for Kubernetes

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Kubernetes is the enhanced security plan providing protections for your Kubernetes clusters wherever they're running.

Defender for Cloud can defend clusters in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications

- **On-premises and multi-cloud environments** - Using an [extension for Azure Arc-enabled Kubernetes](defender-for-kubernetes-azure-arc.md)

Microsoft Defender for Cloud and AKS form a cloud-native Kubernetes security offering with environment hardening, workload protection, and run-time protection as outlined in [Container security in Defender for Cloud](container-security.md).

Host-level threat detection for your Linux AKS nodes is available if you enable [Microsoft Defender for servers](defender-for-servers-introduction.md) and its Log Analytics agent. However, if your cluster is deployed on an Azure Kubernetes Service virtual machine scale set, the Log Analytics agent is not currently supported.



## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for Kubernetes** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/security-center/)|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National/Sovereign (Azure Government, Azure China 21Vianet)|
|||

## What are the benefits of Microsoft Defender for Kubernetes?

Microsoft Defender for Kubernetes provides **cluster-level threat protection** by monitoring your clusters' logs.

Examples of security events that Microsoft Defender for Kubernetes monitors include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts. For a full list of the cluster level alerts, see the [reference table of alerts](alerts-reference.md#alerts-k8scluster).

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

>[!NOTE]
> Defender for Cloud generates security alerts for actions and deployments that occur after you've enabled the Defender for Kubernetes plan on your subscription.

## FAQ - Microsoft Defender for Kubernetes

- [Can I still get cluster protections without the Log Analytics agent?](#can-i-still-get-cluster-protections-without-the-log-analytics-agent)
- [Does AKS allow me to install custom VM extensions on my AKS nodes?](#does-aks-allow-me-to-install-custom-vm-extensions-on-my-aks-nodes)
- [If my cluster is already running an Azure Monitor for containers agent, do I need the Log Analytics agent too?](#if-my-cluster-is-already-running-an-azure-monitor-for-containers-agent-do-i-need-the-log-analytics-agent-too)
- [Does Microsoft Defender for Kubernetes support AKS with virtual machine scale set nodes?](#does-microsoft-defender-for-kubernetes-support-aks-with-virtual-machine-scale-set-nodes)

### Can I still get cluster protections without the Log Analytics agent?

**Microsoft Defender for Kubernetes** plan provides protections at the cluster level. If you also deploy the Log Analytics agent of **Microsoft Defender for servers**, you'll get the threat protection for your nodes that's provided with that plan. Learn more in [Introduction to Microsoft Defender for servers](defender-for-servers-introduction.md).

We recommend deploying both, for the most complete protection possible.

If you choose not to install the agent on your hosts, you'll only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

### Does AKS allow me to install custom VM extensions on my AKS nodes?

For Defender for Cloud to monitor your AKS nodes, they must be running the Log Analytics agent.

AKS is a managed service and since the Log analytics agent is a Microsoft-managed extension, it is also supported on AKS clusters. However, if your cluster is deployed on an Azure Kubernetes Service virtual machine scale set, the Log Analytics agent is not currently supported.

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
