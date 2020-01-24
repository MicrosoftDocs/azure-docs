---
title: Threat detection for cloud native computing in Azure Security Center | Microsoft Docs
description: This article presents the cloud native compute alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 5aa5efcf-9f6f-4aa1-9f72-d651c6a7c9cd
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/05/2020
ms.author: memildin
---
# Threat detection for cloud native computing in Azure Security Center

As a native solution, Azure Security Center has unique visibility into internal logs for attack methodology identification across multiple targets. This article presents the alerts available for the following Azure services:

* [Azure App Service](#app-services)
* [Azure Containers](#azure-containers) 

> [!NOTE]
> These services are not currently available in Azure government and sovereign cloud regions.

## Azure App Service <a name="app-services"></a>

Security Center uses the scale of the cloud to identify attacks targeting applications running over App Service. Attackers probe web applications to find and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways, where they're inspected and logged. This data is then used to identify exploits and attackers, and to learn new patterns that will be used later.

By using the visibility that Azure has as a cloud provider, Security Center analyzes App Service internal logs to identify attack methodology on multiple targets. For example, methodology includes widespread scanning and distributed attacks. This type of attack typically comes from a small subset of IPs, and shows patterns of crawling to similar endpoints on multiple hosts. The attacks are searching for a vulnerable page or plugin, and can't be identified from the standpoint of a single host.

If you’re running a Windows-based App Service plan, Security Center also has access to the underlying sandboxes and VMs. Together with the log data mentioned above, the infrastructure can tell the story, from a new attack circulating in the wild to compromises in customer machines. Therefore, even if Security Center is deployed after a web app has been exploited, it may be able to detect ongoing attacks.

For a list of the Azure App Service alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azureappserv).

## Azure Containers <a name="azure-containers"></a>

Security Center provides real-time threat detection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

We detect threats at different levels: 

* **Host level** - Security Center's agent (available on the Standard tier, see [pricing](security-center-pricing.md) for details) monitors Linux for suspicious activities. The agent triggers alerts for suspicious activities originating from the node or a container running on it. Examples of such activities include web shell detection and connection with known suspicious IP addresses.

    For a deeper insight into the security of your containerized environment, the agent monitors container-specific analytics. It will trigger alerts for events such as privileged container creation, suspicious access to API servers, and Secure Shell (SSH) servers running inside a Docker container.

    >[!NOTE]
    > If you choose not to install the agents on your hosts, you will only receive a subset of the threat detection benefits and alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

    For a list of the host level alerts, see the [Reference table of alerts](alerts-reference.md#alerts-containerhost).


* For **AKS cluster level**, there's threat detection monitoring based on Kubernetes audit logs analysis. To enable this **agentless** monitoring, add the Kubernetes option to your subscription from the **Pricing & settings** page (see [pricing](security-center-pricing.md)). To generate alerts at this level, Security Center monitors your AKS-managed services using the logs retrieved by AKS. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and creation of sensitive mounts.

    >[!NOTE]
    > Security Center generates detection alerts for Azure Kubernetes Service actions and deployments occurring after the Kubernetes option is enabled on the subscription settings. 

    For a list of the AKS cluster level alerts, see the [Reference table of alerts](alerts-reference.md#alerts-akscluster).

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

## Next steps

* For more information on App Service plans, see [App Service plans](https://azure.microsoft.com/pricing/details/app-service/plans/).