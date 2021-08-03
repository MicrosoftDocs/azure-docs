---
title: Azure Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Azure Defender for Kubernetes.
author: memildin
ms.author: memildin
ms.date: 07/20/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for Kubernetes

Azure Defender for Kubernetes is the Azure Defender plan providing protections for your Kubernetes clusters wherever they're running. 

We can defend clusters in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications

- **On-premises and multi-cloud environments** - Using an [extension for Arc enabled Kubernetes](defender-for-kubernetes-azure-arc.md)

Azure Security Center and AKS form a cloud-native Kubernetes security offering with environment hardening, workload protection, and run-time protection as outlined in [Container security in Security Center](container-security.md).

Host-level threat detection for your Linux AKS nodes is available if you enable [Azure Defender for servers](defender-for-servers-introduction.md) and its Log Analytics agent. However, if your cluster is deployed on an Azure Kubernetes Service virtual machine scale set (VMSS), the Log Analytics agent is not currently supported.



## Availability

|Aspect|Details|
|----|:----|
|Release state:|General Availability (GA)|
|Pricing:|**Azure Defender for Kubernetes** is billed as shown on [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/)|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National/Sovereign (US Gov, Azure China)|
|||

## What are the benefits of Azure Defender for Kubernetes?

Azure Defender for Kubernetes provides **cluster-level threat protection** by monitoring your clusters' logs.

Examples of security events that Azure Defender for Kubernetes monitors include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts. For a full list of the cluster level alerts, see the [reference table of alerts](alerts-reference.md#alerts-k8scluster).

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

>[!NOTE]
> Azure Defender generates security alerts for actions and deployments that occur after you've enabled the Defender for Kubernetes plan on your subscription.




## FAQ - Azure Defender for Kubernetes

- [Can I still get cluster protections without the Log Analytics agent?](#can-i-still-get-cluster-protections-without-the-log-analytics-agent)
- [Does AKS allow me to install custom VM extensions on my AKS nodes?](#does-aks-allow-me-to-install-custom-vm-extensions-on-my-aks-nodes)
- [If my cluster is already running an Azure Monitor for containers agent, do I need the Log Analytics agent too?](#if-my-cluster-is-already-running-an-azure-monitor-for-containers-agent-do-i-need-the-log-analytics-agent-too)
- [Does Azure Defender for Kubernetes support AKS with VMSS nodes?](#does-azure-defender-for-kubernetes-support-aks-with-vmss-nodes)

### Can I still get cluster protections without the Log Analytics agent?

**Azure Defender for Kubernetes** plan provides protections at the cluster level. If you also deploy the Log Analytics agent of **Azure Defender for servers**, you'll get the threat protection for your nodes that's provided with that plan. Learn more in [Introduction to Azure Defender for servers](defender-for-servers-introduction.md).

We recommend deploying both, for the most complete protection possible.

If you choose not to install the agent on your hosts, you'll only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

### Does AKS allow me to install custom VM extensions on my AKS nodes?
For Azure Defender to monitor your AKS nodes, they must be running the Log Analytics agent.

AKS is a managed service and since the Log analytics agent is a Microsoft-managed extension, it is also supported on AKS clusters.

### If my cluster is already running an Azure Monitor for containers agent, do I need the Log Analytics agent too?
For Azure Defender to monitor your nodes, they must be running the Log Analytics agent.

If your clusters are already running the Azure Monitor for containers agent, you can install the Log Analytics agent too and the two agents can work alongside one another without any problems.

[Learn more about the Azure Monitor for containers agent](../azure-monitor/containers/container-insights-manage-agent.md).


### Does Azure Defender for Kubernetes support AKS with VMSS nodes?
If your cluster is deployed on an Azure Kubernetes Service virtual machine scale set (VMSS), the Log Analytics agent is not currently supported.



## Next steps

In this article, you learned about Security Center's Kubernetes protection including Azure Defender for Kubernetes. 

> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)

For related material, see the following articles: 

- [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md)
- [Reference table of alerts](alerts-reference.md)
