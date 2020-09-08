---
title: Container Security in Azure Security Center | Microsoft Docs
description: "Learn about Azure Security Center's container security features."
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2020
ms.author: memildin

---

# Container security in Security Center

Azure Security Center is the Azure-native solution for securing your containers. Security Center can protect the following container resource types:

| Resource type | Details |
|:--------------------:|-----------|
| ![Kubernetes service](./media/security-center-virtual-machine-recommendations/icon-kubernetes-service-rec.png)<br>**Azure Kubernetes Service (AKS) clusters** | Security Center continuously assesses your AKS clusters' configurations and gives you visibility into misconfigurations. Security Center provides guidelines to help you resolve any discovered issues.<br>[Learn more about environment hardening through security recommendations](#environment-hardening).<br><br>Security Center also provides threat protection for<br> - Linux AKS nodes with [run-time protection - real-time threat detection](#run-time-protection---real-time-threat-detection)<br>- AKS clusters with the optional [Azure Defender for Kubernetes](defender-for-kubernetes-intro.md).|
| ![Container host](./media/security-center-virtual-machine-recommendations/icon-container-host-rec.png)<br>**Container hosts**<br>(VMs  running Docker) | Security Center continuously assesses your Docker configurations and gives you visibility into misconfigurations by providing a list of all failed rules that were assessed.<br>Security Center provides guidelines to help you resolve any discovered issues.<br>[Learn more about environment hardening through security recommendations](#environment-hardening).|
| ![Container registry](./media/security-center-virtual-machine-recommendations/icon-container-registry-rec.png)<br>**Azure Container Registry (ACR) registries** | Gain deeper visibility into the vulnerabilities of the images in your ARM-based ACR registries with the vulnerability assessment and management tools in Security Center's optional [Azure Defender for container registries](defender-for-container-registries-intro.md).<br>[Learn more about scanning your container images for vulnerabilities](#vulnerability-management---scanning-container-images). |
|||

This article describes how you can use Security Center, together with the optional Azure Defender plans for container registries and Kubernetes, to improve, monitor, and maintain the security of your containers and their apps.

:::image type="content" source="./media/container-security/container-security-tab.png" alt-text="Container-related resources in Security Center's asset inventory page" lightbox="./media/container-security/container-security-tab.png":::

For instructions on how to use these features, see [Monitoring the security of your containers](monitor-container-security.md).


## Vulnerability management - scanning container images

To monitor your ARM-based Azure Container Registry, enable [Azure Defender for container registries](defender-for-container-registries-intro.md). Security Center scans any images pulled within the last 30 days, pushed to your registry, or imported. The integrated scanner is provided by the industry-leading vulnerability scanning vendor, Qualys.

When issues are found – by Qualys or Security Center – you'll get notified in the [Azure Defender dashboard](azure-defender-dashboard.md). For every vulnerability, Security Center provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Security Center's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-containers).

Security Center filters and classifies findings from the scanner. When an image is healthy, Security Center marks it as such. Security Center generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Security Center reduces the potential for unwanted informational alerts.

## Environment hardening

### Continuous monitoring of your Docker configuration

Azure Security Center identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Security Center continuously assesses the configurations of these containers. It then compares them with the [Center for Internet Security (CIS) Docker Benchmark](https://www.cisecurity.org/benchmark/docker/).

Security Center includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. When it finds misconfigurations, Security Center generates security recommendations. Use the **recommendations page** to view recommendations and remediate issues. You'll also see the recommendations on the **Containers** tab that displays all virtual machines deployed with Docker. 

For details of the relevant Security Center recommendations that might appear for this feature, see the [container section](recommendations-reference.md#recs-containers) of the recommendations reference table.

When you're exploring the security issues of a VM, Security Center provides additional information about the containers on the machine. Such information includes the Docker version and the number of images running on the host. 

>[!NOTE]
> These CIS benchmark checks will not run on AKS-managed instances or Databricks-managed VMs.

### Continuous monitoring of your Kubernetes clusters
Security Center works together with Azure Kubernetes Service (AKS), Microsoft's managed container orchestration service for developing, deploying, and managing containerized applications.

AKS provides security controls and visibility into the security posture of your clusters. Security Center uses these features to:
* Constantly monitor the configuration of your AKS clusters
* Generate security recommendations aligned with industry standards

For details of the relevant Security Center recommendations that might appear for this feature, see the [container section](recommendations-reference.md#recs-containers) of the recommendations reference table.

###  Workload protection best-practices using Kubernetes admission control

Kubernetes admission controllers are plugins that enforce how your clusters are used. 

Security Center includes a bundle of recommendations that are available when you've installed the **Azure Policy add-on for Kubernetes**. As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. 

When you've installed the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads. 

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in 



## Run-time protection - Real-time threat detection

[!INCLUDE [AKS in ASC threat protection](../../includes/security-center-azure-kubernetes-threat-protection.md)]



## Next steps

In this overview, you learned about the core elements of container security in Azure Security Center. Continue to [how to monitor the security of your containers](monitor-container-security.md).
> [!div class="nextstepaction"]
> [Monitoring the security of your containers](monitor-container-security.md)