---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers (preview)
ms.topic: overview
ms.date: 12/06/2021
---
# Overview of Microsoft Defender for Containers (preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Containers is the cloud-native solution for securing your containers.

This preview plan merges the capabilities of two existing Microsoft Defender plans, "Defender for Kubernetes" and "Defender for Container registries", and provides new and improved features without deprecating any of the functionality from those plans.

This page describes how you can use Defender for Containers to improve, monitor, and maintain the security of your clusters, containers, and their applications.

You'll learn how Defender for Cloud helps with these core aspects of container security:

- [Environment hardening through security recommendations](#environment-hardening-through-security-recommendations)
- [Vulnerability management - scanning container images](#vulnerability-management---scanning-container-images)
- [Run-time protection for Kubernetes nodes and clusters](#run-time-protection-for-kubernetes-nodes-and-clusters)

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview.<br>[!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)]|
|Pricing:|**Microsoft Defender for Containers** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/security-center/)|
|Supported registries and images:|Linux images in Azure Container Registry (ACR) registries accessible from the public internet with shell access<br>[ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md)|
|Unsupported registries and images:|Windows images<br>'Private' registries (unless access is granted to [Trusted Services](../container-registry/allow-access-trusted-services.md#trusted-services))<br>Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images, or "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br>Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md)|
|Required roles and permissions:| • To auto provision the required components, [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor), or [Azure Kubernetes Service Contributor Role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview)|
|||

## What are the benefits of Microsoft Defender for Containers?

Defender for Containers protects the following resources:

| Resource type | Protections offered by Defender for Containers |
|:--------------------:|-----------|
| :::image type="icon" source="media/container-security/icon-kubernetes-service-rec.png" border="false":::<br>**Kubernetes clusters** | Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-prem / IaaS, or Amazon EKS.<br>By continuously assessing clusters, Defender for Containers provides visibility into misconfigurations and guidelines to help mitigate identified threats. Learn more about [environment hardening through security recommendations](#environment-hardening).<br>Threat protection for clusters and Linux nodes generates security alerts for suspicious activities. Learn more about [run-time protection for Kubernetes nodes and clusters](#run-time-protection-for-kubernetes-nodes-and-clusters).|
| :::image type="icon" source="media/container-security/icon-container-registry-rec.png" border="false":::<br>**Azure Container Registry (ACR)<br>registries** | Vulnerability assessment and management tools for the images stored in ACR registries.<br>Learn more about [scanning container images for vulnerabilities](#vulnerability-management---scanning-container-images). |
| :::image type="icon" source="media/container-security/icon-container-registry-rec.png" border="false":::<br>**Azure Container Registry (ACR)<br>running images** | Vulnerability assessment and management tools for **running** images from ACR registries.<br>Learn more about [runtime protection for container images](#vulnerability-management---scanning-container-images). |
|||


## Environment hardening through security recommendations

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud works together with [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md), Microsoft's managed container orchestration service for developing, deploying, and managing containerized applications. AKS provides security controls and visibility into the security posture of your clusters. Defender for Cloud uses these features to constantly monitor the configuration of your AKS clusters and generate security recommendations aligned with industry standards.

Defender for Cloud also works with [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md), to defend your on-premises clusters with the same threat detection capabilities offered for Azure Kubernetes Service clusters. You can auto provision all the necessary components for Azure Arc-enabled Kubernetes to your clusters as described below. 

The Arc extension can also protect Kubernetes clusters on other cloud providers, although not on their managed Kubernetes services.

This is a high-level diagram of the interaction between Microsoft Defender for Cloud, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy:

:::image type="content" source="./media/defender-for-containers/defender-for-containers-high-level.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/defender-for-containers-high-level.png":::

You can see that the items received and analyzed by Defender for Cloud include:

- audit logs and security events from the API server
- cluster configuration information from the AKS cluster
- workload configuration from Azure Policy (via the **Azure Policy add-on for Kubernetes**)

For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

### Continuous monitoring of your Docker configuration

Defender for Cloud identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Defender for Cloud continuously assesses the configurations of these containers and compares them with the [Center for Internet Security (CIS) Docker Benchmark](https://www.cisecurity.org/benchmark/docker/). Defender for Cloud generates alerts if your containers don't satisfy any of the controls of this benchmark. 

When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues. The CIS benchmark checks don't run on AKS-managed instances or Databricks-managed VMs.

For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

When you're exploring the security issues of a virtual machine, Defender for Cloud provides additional information about the containers on the machine. Such information includes the Docker version and the number of images running on the host.

> [!TIP]
> To monitor unmanaged containers hosted on IaaS Linux VMs, enable the optional [Microsoft Defender for servers](defender-for-servers-introduction.md).


### Workload protection best-practices using Kubernetes admission control

For a bundle of recommendations to protect the workloads of your Kubernetes containers, install the  **Azure Policy add-on for Kubernetes**. You can also auto deploy this add-on as explained in [Enable auto provisioning of the Log Analytics agent and extensions](enable-data-collection.md#auto-provision-mma). When auto provisioning for the add-on is set to "on", the extension is enabled by default in all existing and future clusters (that meet the add-on installation requirements).

As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). Kubernetes admission controllers are plugins that enforce how your clusters are used. The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).

## Vulnerability assessment

### Scanning images in ACR registries

With Defender for Containers enabled on subscriptions with Azure Container Registry registries, Defender for Cloud scans any images pulled within the last 30 days, pushed to your registry, or imported. The integrated vulnerability scanner is provided by the industry-leading vulnerability scanning vendor, Qualys.

When issues are found – by Qualys or Defender for Cloud – you'll get notified in the [Workload protections dashboard](workload-protections-dashboard.md). For every vulnerability, Defender for Cloud provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Defender for Cloud's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-compute).

Defender for Cloud filters and classifies findings from the scanner. When an image is healthy, Defender for Cloud marks it as such. Defender for Cloud generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Defender for Cloud reduces the potential for unwanted informational alerts.

### Scanning images at runtime

Defender for Containers expands on the registry scanning features of the Defender for container registries plan by introducing run-time visibility of vulnerabilities.


### Run-time protection for Kubernetes nodes and clusters

Defender for Cloud provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Defender for Cloud provides threat protection at the cluster level by analyzing the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts. For a list of the cluster level alerts, see the [Reference table of alerts](../articles/security-center/alerts-reference.md#alerts-k8scluster).

Our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.






## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. For related material see:

- [Introduction to Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Introduction to Microsoft Defender for container registries](defender-for-container-registries-introduction.md)
