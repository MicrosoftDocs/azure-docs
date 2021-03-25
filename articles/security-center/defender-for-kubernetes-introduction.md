---
title: Azure Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Azure Defender for Kubernetes.
author: memildin
ms.author: memildin
ms.date: 02/07/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for Kubernetes

Azure Kubernetes Service (AKS) is Microsoft's managed service for developing, deploying, and managing containerized applications.

Azure Security Center and AKS form a cloud-native Kubernetes security offering with environment hardening, workload protection, and run-time protection as outlined in [Container security in Security Center](container-security.md).

For threat detection for your Kubernetes clusters, enable **Azure Defender for Kubernetes**.

Host-level threat detection for your Linux AKS nodes is available if you enable [Azure Defender for servers](defender-for-servers-introduction.md) and its Log Analytics agent. However, if your AKS cluster is deployed on a virtual machine scale set, the Log Analytics agent is not currently supported.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General Availability (GA)|
|Pricing:|**Azure Defender for Kubernetes** is billed as shown on [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/)|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||

## What are the benefits of Azure Defender for Kubernetes?

Azure Defender for Kubernetes provides **cluster-level threat protection** by monitoring your AKS-managed services through the logs retrieved by Azure Kubernetes Service (AKS).

Examples of security events that Azure Defender for Kubernetes monitors include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts. For a full list of the AKS cluster level alerts, see the [reference table of alerts](alerts-reference.md#alerts-akscluster).

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

>[!NOTE]
> Security Center generates security alerts for Azure Kubernetes Service actions and deployments occurring **after** you've enabled Azure Defender for Kubernetes.




## Azure Defender for Kubernetes - FAQ

### Can I still get AKS protections without the Log Analytics agent?

**Azure Defender for Kubernetes** plan provides protections at the cluster level. If you also deploy the Log Analytics agent of **Azure Defender for servers**, you'll get the threat protection for your nodes that's provided with that plan. Learn more in [Introduction to Azure Defender for servers](defender-for-servers-introduction.md).

We recommend deploying both, for the most complete protection possible.

If you choose not to install the agent on your hosts, you'll only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

### Does AKS allow me to install custom VM extensions on my AKS nodes?
For Azure Defender to monitor your AKS nodes, they must be running the Log Analytics agent. 

AKS is a managed service and since the Log analytics agent is a Microsoft-managed extension, it is also supported on AKS clusters.

### If my cluster is already running an Azure Monitor for containers agent, do I need the Log Analytics agent too?
For Azure Defender to monitor your AKS nodes, they must be running the Log Analytics agent.

If your clusters are already running the Azure Monitor for containers agent, you can install the Log Analytics agent too and the two agents can work alongside one another without any problems.

[Learn more about the Azure Monitor for containers agent](../azure-monitor/containers/container-insights-manage-agent.md).


## Next steps

In this article, you learned about Security Center's Kubernetes protection including Azure Defender for Kubernetes. 

> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)

For related material, see the following articles: 

- [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md)
- [Reference table of alerts](alerts-reference.md)
