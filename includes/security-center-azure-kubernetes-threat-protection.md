---
author: memildin
ms.author: memildin
manager: rkarlin
ms.date: 06/30/2020
ms.topic: include
---

Security Center provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Security Center provides threat protection at different levels: 

* **Host level (provided by Azure Defender for servers)** - Using the same Log Analytics agent that Security Center uses on other VMs, Azure Defender monitors your Linux AKS nodes for suspicious activities such as web shell detection and connection with known suspicious IP addresses. The agent also monitors for container-specific analytics such as privileged container creation, suspicious access to API servers, and Secure Shell (SSH) servers running inside a Docker container.

    >[!IMPORTANT]
    > If you choose not to install the agents on your hosts, you will only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

    For a list of the AKS host level alerts, see the [Reference table of alerts](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-containerhost).


* **AKS cluster level (provided by Azure Defender for Kubernetes)** - At the cluster level, the threat protection is based on analyzing Kubernetes' audit logs. To enable this **agentless** monitoring, enable Azure Defender. To generate alerts at this level, Security Center monitors your AKS-managed services using the logs retrieved by AKS. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts.

    >[!NOTE]
    > Security Center generates security alerts for Azure Kubernetes Service actions and deployments occurring after the Kubernetes option is enabled on the subscription settings. 

    For a list of the AKS cluster level alerts, see the [Reference table of alerts](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-akscluster).

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).