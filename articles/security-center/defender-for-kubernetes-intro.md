---
title: Azure Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Azure Defender for Kubernetes.
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: conceptual
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for Kubernetes

Azure Kubernetes Service (AKS) is Microsoft's managed service for developing, deploying, and managing containerized applications.

Enable **Azure Defender for Kubernetes** in Azure Security Center to gain deeper visibility into your AKS nodes, cloud traffic, and security controls.

## What are the benefits of Azure Defender for Kubernetes?

Azure Security Center and AKS form the best cloud-native Kubernetes security offering and together they provide environment hardening, workload protection, and run-time protection as outlined below.

### Cluster hardening

To secure your AKS nodes and hosts, Security Center:

- **Discovers and categorizes**:
    - your AKS resources, from clusters to individual virtual machines
    - unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers

- **Performs continuous monitoring** of the configuration of your AKS clusters and your Docker hosts.

- **Generates security recommendations** if your containers don't satisfy any of the controls in the [Center for Internet Security (CIS) Docker Benchmark](https://www.cisecurity.org/benchmark/docker/).

    Use the **recommendations page** to view recommendations and remediate issues. 

    You'll also see the recommendations per resource by applying the relevant filters on the [asset inventory](asset-inventory.md) page. 

    For details of the relevant Security Center recommendations that might appear for this feature, see the [container section](recommendations-reference.md#recs-containers) of the recommendations reference table.

    >[!NOTE]
    > These CIS benchmark checks will not run on AKS-managed instances or Databricks-managed VMs.


### Run-time protection

Through continuous analysis of the following AKS sources, Security Center provides real-time threat protection for your containerized environments and generates alerts for threats and malicious activity detected at the host *and* AKS cluster level. You can use this information to quickly remediate security issues and improve the security of your containers.

Security Center provides threat protection at different levels: 

- **Host level (provided by Azure Defender for servers)** - Using the same Log Analytics agent that Security Center uses on other VMs, Azure Defender monitors your Linux AKS nodes for suspicious activities such as web shell detection and connection with known suspicious IP addresses. The agent also monitors for container-specific analytics such as privileged container creation, suspicious access to API servers, and Secure Shell (SSH) servers running inside a Docker container.

    For a list of the AKS host level alerts, see the [Reference table of alerts](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-containerhost).

    >[!IMPORTANT]
    > If you choose not to install the agents on your hosts, you will only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

- **AKS cluster level (provided by Azure Defender for Kubernetes)** - At the cluster level, the threat protection is based on analyzing Kubernetes' audit logs. To enable this **agentless** monitoring, enable Azure Defender. To generate alerts at this level, Security Center monitors your AKS-managed services using the logs retrieved by AKS. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts.

    For a list of the AKS cluster level alerts, see the [Reference table of alerts](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-akscluster).

    >[!NOTE]
    > Security Center generates security alerts for Azure Kubernetes Service actions and deployments occurring after the Kubernetes option is enabled on the subscription settings. 

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

> [!TIP]
> You can simulate container alerts by following the instructions in [this blog post](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-demonstrate-the-new-containers-features-in-azure-security/ba-p/1011270).



## How does Security Center's Kubernetes protection work?

![Azure Security Center and Azure Kubernetes Service (AKS) in more detail](./media/azure-kubernetes-service-integration/aks-asc-integration-detailed.png)



## Azure Defender for Kubernetes - FAQ

### Can I still get AKS protections without the Log Analytics agent?

As mentioned above, the optional Kubernetes bundle provides protections at the cluster level, the Log Analytics agent of Azure Security Center standard tier protect your nodes. 

We recommend deploying both, for the most complete protection possible.

If you choose not to install the agent on your hosts, you will only receive a subset of the threat protection benefits and security alerts. You'll still receive alerts related to network analysis and communications with malicious servers.


## Next steps

In this article, you learned about Security Center's Kubernetes protection including Azure Defender for Kubernetes. 

For related material, see the following articles: 

- [Enable Azure Defender](security-center-pricing.md)
- [Export alerts to a Azure Sentinel or a third-party SIEM](continuous-export.md)
- [Reference table of alerts](alerts-reference.md)
- > [!div class="nextstepaction"]
    > [How to use Azure Defender for Kubernetes](defender-for-kubernetes-usage.md)