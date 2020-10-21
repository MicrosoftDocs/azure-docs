---
title: Azure Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Azure Defender for Kubernetes.
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for Kubernetes

Azure Kubernetes Service (AKS) is Microsoft's managed service for developing, deploying, and managing containerized applications.

Azure Security Center and AKS form the best cloud-native Kubernetes security offering and together they provide environment hardening, workload protection, and run-time protection as outlined below.

For threat detection for your Kubernetes clusters, enable **Azure Defender for Kubernetes**.

Host-level threat detection for your Linux AKS nodes is available if you enable [Azure Defender for servers](defender-for-servers-introduction.md).

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|**Azure Defender for Kubernetes** is billed as shown on [the pricing page](security-center-pricing.md)|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||

## What are the benefits of Azure Defender for Kubernetes?

### Run-time protection

Through continuous analysis of the following AKS sources, Security Center provides real-time threat protection for your containerized environments and generates alerts for threats and malicious activity detected at the host *and* AKS cluster level. You can use this information to quickly remediate security issues and improve the security of your containers.

Security Center provides threat protection at different levels: 

- **Host level (provided by Azure Defender for servers)** - Using the same Log Analytics agent that Security Center uses on other VMs, Azure Defender monitors your Linux AKS nodes for suspicious activities such as web shell detection and connection with known suspicious IP addresses. The agent also monitors for container-specific analytics such as privileged container creation, suspicious access to API servers, and Secure Shell (SSH) servers running inside a Docker container.

    For a list of the AKS host level alerts, see the [Reference table of alerts](alerts-reference.md#alerts-containerhost).

    >[!IMPORTANT]
    > If you choose not to install the agents on your hosts, you will only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

- **AKS cluster level (provided by Azure Defender for Kubernetes)** - At the cluster level, the threat protection is based on analyzing Kubernetes' audit logs. To enable this **agentless** monitoring, enable Azure Defender. To generate alerts at this level, Security Center monitors your AKS-managed services using the logs retrieved by AKS. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts.

    For a list of the AKS cluster level alerts, see the [Reference table of alerts](alerts-reference.md#alerts-akscluster).

    >[!NOTE]
    > Security Center generates security alerts for Azure Kubernetes Service actions and deployments occurring after the Kubernetes option is enabled on the subscription settings. 

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).



## How does Security Center's Kubernetes protection work?

Below is a high-level diagram of the interaction between Azure Security Center, Azure Kubernetes Service, and Azure Policy.

You can see that the items received and analyzed by Security Center include:

- audit logs from the API server
- raw security events from the Log Analytics agent
- cluster configuration information from the AKS cluster
- workload configuration from Azure Policy (via the **Azure Policy add-on for Kubernetes**). [Learn more about workload protection best-practices using Kubernetes admission control](container-security.md#workload-protection-best-practices-using-kubernetes-admission-control)

:::image type="content" source="./media/defender-for-kubernetes-intro/kubernetes-service-security-center-integration-detailed.png" alt-text="High-level architecture of the interaction between Azure Security Center, Azure Kubernetes Service, and Azure Policy" lightbox="./media/defender-for-kubernetes-intro/kubernetes-service-security-center-integration-detailed.png":::




## Azure Defender for Kubernetes - FAQ

### Can I still get AKS protections without the Log Analytics agent?

As mentioned above, the optional **Azure Defender for Kubernetes** plan provides protections at the cluster level, the Log Analytics agent of **Azure Defender for servers** protects your nodes. 

We recommend deploying both, for the most complete protection possible.

If you choose not to install the agent on your hosts, you'll only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.


## Next steps

In this article, you learned about Security Center's Kubernetes protection including Azure Defender for Kubernetes. 

For related material, see the following articles: 

- [Enable Azure Defender](security-center-pricing.md)
- [Export alerts to a Azure Sentinel or a third-party SIEM](continuous-export.md)
- [Reference table of alerts](alerts-reference.md)