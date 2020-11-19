---
title: Container Security in Azure Security Center | Microsoft Docs
description: "Learn about Azure Security Center's container security features."
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin

---

# Container security in Security Center

Azure Security Center is the Azure-native solution for securing your containers.

Security Center can protect the following container resource types:

| Resource type | Protections offered by Security Center |
|:--------------------:|-----------|
| ![Kubernetes service](./media/security-center-virtual-machine-recommendations/icon-kubernetes-service-rec.png)<br>**Azure Kubernetes Service (AKS) clusters** | - Continuous assessment of your AKS clusters' configurations to provide visibility into misconfigurations, and guidelines to help you resolve any discovered issues.<br>[Learn more about environment hardening through security recommendations](#environment-hardening).<br><br>- Threat protection for AKS clusters and Linux nodes. Alerts for suspicious activities are provided by the optional  [Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md).<br>[Learn more about run-time protection for AKS nodes and clusters](#run-time-protection-for-aks-nodes-and-clusters).|
| ![Container host](./media/security-center-virtual-machine-recommendations/icon-container-host-rec.png)<br>**Container hosts**<br>(VMs  running Docker) | - Continuous assessment of your Docker configurations to provide visibility into misconfigurations, and guidelines to help you resolve any discovered issues with the optional  [Azure Defender for servers](defender-for-servers-introduction.md).<br>[Learn more about environment hardening through security recommendations](#environment-hardening).|
| ![Container registry](./media/security-center-virtual-machine-recommendations/icon-container-registry-rec.png)<br>**Azure Container Registry (ACR) registries** | - Vulnerability assessment and management tools for the images in your Azure Resource Manager-based ACR registries with the optional [Azure Defender for container registries](defender-for-container-registries-introduction.md).<br>[Learn more about scanning your container images for vulnerabilities](#vulnerability-management---scanning-container-images). |
|||

This article describes how you can use Security Center, together with the optional Azure Defender plans for container registries, severs, and Kubernetes, to improve, monitor, and maintain the security of your containers and their apps.

You'll learn how Security Center helps with these core aspects of container security:

- [Vulnerability management - scanning container images](#vulnerability-management---scanning-container-images)
- [Environment hardening](#environment-hardening)
- [Run-time protection for AKS nodes and clusters](#run-time-protection-for-aks-nodes-and-clusters)

The following screenshot shows the asset inventory page and the various container resource types protected by Security Center.

:::image type="content" source="./media/container-security/container-security-tab.png" alt-text="Container-related resources in Security Center's asset inventory page" lightbox="./media/container-security/container-security-tab.png":::

## Vulnerability management - scanning container images

To monitor images in your Azure Resource Manager-based Azure container registries, enable [Azure Defender for container registries](defender-for-container-registries-introduction.md). Security Center scans any images pulled within the last 30 days, pushed to your registry, or imported. The integrated scanner is provided by the industry-leading vulnerability scanning vendor, Qualys.

When issues are found – by Qualys or Security Center – you'll get notified in the [Azure Defender dashboard](azure-defender-dashboard.md). For every vulnerability, Security Center provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Security Center's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-containers).

Security Center filters and classifies findings from the scanner. When an image is healthy, Security Center marks it as such. Security Center generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Security Center reduces the potential for unwanted informational alerts.

## Environment hardening

### Continuous monitoring of your Docker configuration

Azure Security Center identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Security Center continuously assesses the configurations of these containers. It then compares them with the [Center for Internet Security (CIS) Docker Benchmark](https://www.cisecurity.org/benchmark/docker/).

Security Center includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. When it finds misconfigurations, Security Center generates security recommendations. Use Security Center's **recommendations page** to view recommendations and remediate issues. The CIS benchmark checks don't run on AKS-managed instances or Databricks-managed VMs.

For details of the relevant Security Center recommendations that might appear for this feature, see the [container section](recommendations-reference.md#recs-containers) of the recommendations reference table.

When you're exploring the security issues of a VM, Security Center provides additional information about the containers on the machine. Such information includes the Docker version and the number of images running on the host. 

To monitor unmanaged containers hosted on IaaS Linux VMs, enable the optional [Azure Defender for servers](defender-for-servers-introduction.md).


### Continuous monitoring of your Kubernetes clusters
Security Center works together with Azure Kubernetes Service (AKS), Microsoft's managed container orchestration service for developing, deploying, and managing containerized applications.

AKS provides security controls and visibility into the security posture of your clusters. Security Center uses these features to:
* Constantly monitor the configuration of your AKS clusters
* Generate security recommendations aligned with industry standards

For details of the relevant Security Center recommendations that might appear for this feature, see the [container section](recommendations-reference.md#recs-containers) of the recommendations reference table.

###  Workload protection best-practices using Kubernetes admission control

Install the  **Azure Policy add-on for Kubernetes** to get a bundle of recommendations for protecting the workloads of your Kubernetes containers.

As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). Kubernetes admission controllers are plugins that enforce how your clusters are used. The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. 

When you've installed the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads. 

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).


## Run-time protection for AKS nodes and clusters

[!INCLUDE [AKS in ASC threat protection](../../includes/security-center-azure-kubernetes-threat-protection.md)]



## Next steps

In this overview, you learned about the core elements of container security in Azure Security Center. For related material see:

- [Introduction to Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Introduction to Azure Defender for container registries](defender-for-container-registries-introduction.md)