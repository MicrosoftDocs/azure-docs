---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Cloud's container security features
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 11/09/2021
ms.author: memildin
---
# Container security in Microsoft Defender for Cloud

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Cloud is the cloud-native solution for securing your containers.

Defender for Cloud can protect the following container resource types:

| Resource type | Protections offered by Defender for Cloud |
|:--------------------:|-----------|
| ![Kubernetes service.](./media/container-security/icon-kubernetes-service-rec.png)<br>**Kubernetes clusters** | Continuous assessment of your clusters to provide visibility into misconfigurations and guidelines to help you mitigate identified threats. Learn more about [environment hardening through security recommendations](#environment-hardening).<br><br>Threat protection for clusters and Linux nodes. Alerts for suspicious activities are provided by [Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md). This plan defends your Kubernetes clusters whether they're hosted in Azure Kubernetes Service (AKS), on-premises, or on other cloud providers. clusters. <br>Learn more about [run-time protection for Kubernetes nodes and clusters](#run-time-protection-for-kubernetes-nodes-and-clusters).|
| ![Container host.](./media/container-security/icon-container-host-rec.png)<br>**Container hosts**<br>(VMs  running Docker) | Continuous assessment of your Docker environments to provide visibility into misconfigurations and guidelines to help you  mitigate threats identified by the optional [Microsoft Defender for servers](defender-for-servers-introduction.md).<br>Learn more about [environment hardening through security recommendations](#environment-hardening).|
| ![Container registry.](./media/container-security/icon-container-registry-rec.png)<br>**Azure Container Registry (ACR) registries** | Vulnerability assessment and management tools for the images in your Azure Resource Manager-based ACR registries with the optional [Microsoft Defender for container registries](defender-for-container-registries-introduction.md).<br>Learn more about [scanning your container images for vulnerabilities](#vulnerability-management---scanning-container-images). |
|||

This article describes how you can use Defender for Cloud, together with the optional enhanced protections for container registries, severs, and Kubernetes, to improve, monitor, and maintain the security of your containers and their apps.

You'll learn how Defender for Cloud helps with these core aspects of container security:

- [Vulnerability management - scanning container images](#vulnerability-management---scanning-container-images)
- [Environment hardening](#environment-hardening)
- [Run-time protection for Kubernetes nodes and clusters](#run-time-protection-for-kubernetes-nodes-and-clusters)

The following screenshot shows the asset inventory page and the various container resource types protected by Defender for Cloud.

:::image type="content" source="./media/container-security/inventory-container-resources.png" alt-text="Container-related resources in Defender for Cloud's asset inventory page" lightbox="./media/container-security/inventory-container-resources.png":::

## Vulnerability management - scanning container images

To monitor images in your Azure Resource Manager-based Azure container registries, enable [Microsoft Defender for container registries](defender-for-container-registries-introduction.md). Defender for Cloud scans any images pulled within the last 30 days, pushed to your registry, or imported. The integrated scanner is provided by the industry-leading vulnerability scanning vendor, Qualys.

When issues are found – by Qualys or Defender for Cloud – you'll get notified in the [Workload protections dashboard](workload-protections-dashboard.md). For every vulnerability, Defender for Cloud provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Defender for Cloud's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-compute).

Defender for Cloud filters and classifies findings from the scanner. When an image is healthy, Defender for Cloud marks it as such. Defender for Cloud generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Defender for Cloud reduces the potential for unwanted informational alerts.

## Environment hardening

### Continuous monitoring of your Docker configuration

Microsoft Defender for Cloud identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Defender for Cloud continuously assesses the configurations of these containers. It then compares them with the [Center for Internet Security (CIS) Docker Benchmark](https://www.cisecurity.org/benchmark/docker/).

Defender for Cloud includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues. The CIS benchmark checks don't run on AKS-managed instances or Databricks-managed VMs.

For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

When you're exploring the security issues of a VM, Defender for Cloud provides additional information about the containers on the machine. Such information includes the Docker version and the number of images running on the host.

To monitor unmanaged containers hosted on IaaS Linux VMs, enable the optional [Microsoft Defender for servers](defender-for-servers-introduction.md).

### Continuous monitoring of your Kubernetes clusters

Defender for Cloud works together with Azure Kubernetes Service (AKS), Microsoft's managed container orchestration service for developing, deploying, and managing containerized applications.

AKS provides security controls and visibility into the security posture of your clusters. Defender for Cloud uses these features to constantly monitor the configuration of your AKS clusters and generate security recommendations aligned with industry standards.

This is a high-level diagram of the interaction between Microsoft Defender for Cloud, Azure Kubernetes Service, and Azure Policy:

:::image type="content" source="./media/defender-for-kubernetes-intro/kubernetes-service-security-center-integration-detailed.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Cloud, Azure Kubernetes Service, and Azure Policy" lightbox="./media/defender-for-kubernetes-intro/kubernetes-service-security-center-integration-detailed.png":::

You can see that the items received and analyzed by Defender for Cloud include:

- audit logs from the API server
- raw security events from the Log Analytics agent

    > [!NOTE]
    > We don't currently support installation of the Log Analytics agent on Azure Kubernetes Service clusters that are running on virtual machine scale sets.

- cluster configuration information from the AKS cluster
- workload configuration from Azure Policy (via the **Azure Policy add-on for Kubernetes**)

For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

### Workload protection best-practices using Kubernetes admission control

For a bundle of recommendations to protect the workloads of your Kubernetes containers, install the  **Azure Policy add-on for Kubernetes**. You can also auto deploy this add-on as explained in [Enable auto provisioning of the Log Analytics agent and extensions](enable-data-collection.md#auto-provision-mma). When auto provisioning for the add-on is set to "on", the extension is enabled by default in all existing and future clusters (that meet the add-on installation requirements).

As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). Kubernetes admission controllers are plugins that enforce how your clusters are used. The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).

## Run-time protection for Kubernetes nodes and clusters

[!INCLUDE [AKS in ASC threat protection](../../includes/security-center-azure-kubernetes-threat-protection.md)]

## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. For related material see:

- [Introduction to Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Introduction to Microsoft Defender for container registries](defender-for-container-registries-introduction.md)
