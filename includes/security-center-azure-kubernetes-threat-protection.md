---
author: memildin
ms.author: memildin
manager: rkarlin
ms.date: 10/18/2021
ms.topic: include
---

Defender for Cloud provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Defender for Cloud provides threat protection at different levels: 

* **Host level (provided by Microsoft Defender for servers)** - Using the same Log Analytics agent that Defender for Cloud uses on other VMs, Microsoft Defender for servers monitors your Linux Kubernetes nodes for suspicious activities such as web shell detection and connection with known suspicious IP addresses. The agent also monitors for container-specific analytics such as privileged container creation, suspicious access to API servers, and Secure Shell (SSH) servers running inside a Docker container.

    If you choose not to install the agents on your hosts, you will only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

    >[!IMPORTANT]
    > We don't currently support installation of the Log Analytics agent on Azure Kubernetes Service clusters that are running on virtual machine scale sets.

    For a list of the host level alerts, see the [Reference table of alerts](../articles/security-center/alerts-reference.md#alerts-containerhost).


* **Cluster level (provided by Microsoft Defender for Kubernetes)** - At the cluster level, the threat protection is based on analyzing Kubernetes' audit logs. To enable this **agentless** monitoring, enable enhanced security features. If your cluster is on-premises or on another cloud provider, enable [Azure Arc-enabled Kubernetes and the Microsoft Defender extension](../articles/security-center/defender-for-kubernetes-azure-arc.md).

    To generate alerts at this level, Defender for Cloud monitors your clusters' logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts.

    >[!NOTE]
    > Defender for Cloud generates security alerts for actions and deployments that occur after you've enabled the Defender for Kubernetes plan on your subscription. 

    For a list of the cluster level alerts, see the [Reference table of alerts](../articles/security-center/alerts-reference.md#alerts-k8scluster).

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).
