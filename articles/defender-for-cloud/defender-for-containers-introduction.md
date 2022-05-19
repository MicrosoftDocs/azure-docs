---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers
author: bmansheim
ms.author: benmansheim
ms.topic: overview
ms.date: 05/18/2022
---

# Overview of Microsoft Defender for Containers

Microsoft Defender for Containers is the cloud-native solution for securing your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications.

[How does Defender for Containers work in each Kubernetes platform?](defender-for-containers-architecture.md)

## Microsoft Defender for Containers plan availability

| Aspect | Details |
|--|--|
| Release state: | General availability (GA)<br> Certain features  are in preview, for a full list see the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section. |
| Feature availability | Refer to the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section for additional information on feature release state and availability.|
| Pricing: | **Microsoft Defender for Containers** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Required roles and permissions: | • To auto provision the required components, see the [permissions for each of the components](enable-data-collection.md?tabs=autoprovision-containers)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md) |
| Clouds: | **Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National clouds (Azure Government, Azure China 21Vianet) (Except for preview features))<br><br>**Non-Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: On-prem/IaaS supported via Arc enabled Kubernetes (Preview). <br> <br>For more information about, see the [availability section](supported-machines-endpoint-solutions-clouds-containers.md#defender-for-containers-feature-availability). |

## What are the benefits of Microsoft Defender for Containers?

Defender for Containers helps with the core aspects of container security:

- [**Environment hardening**](#hardening) - Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-premises/IaaS, or Amazon EKS. By continuously assessing clusters, Defender for Containers provides visibility into misconfigurations and guidelines to help mitigate identified threats.

- [**Vulnerability assessment**](#vulnerability-assessment) - Vulnerability assessment and management tools for images **stored** in ACR registries and **running** in Azure Kubernetes Service.

- [**Run-time threat protection for nodes and clusters**](#run-time-protection-for-kubernetes-nodes-and-clusters) - Threat protection for clusters and Linux nodes generates security alerts for suspicious activities.

## Hardening

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues. For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-container) of the recommendations reference table.

For Kubernetes clusters on EKS, you'll need to [connect your AWS account to Microsoft Defender for Cloud](quickstart-onboard-aws.md). Then ensure you've enabled the CSPM plan.

When reviewing the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page, you can use the resource filter:

:::image type="content" source="media/defender-for-containers/resource-filter.png" alt-text="Screenshot showing you where the resource filter is located.":::

### Kubernetes data plane hardening

To protect the workloads of your Kubernetes containers with tailored recommendations, install the **Azure Policy for Kubernetes**. You can also auto deploy this component as explained in [enable auto provisioning of agents and extensions](enable-data-collection.md#auto-provision-mma).

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Kubernetes data plane hardening](kubernetes-workload-protections.md).

## Vulnerability assessment

### Scanning images in ACR registries

Defender for Containers includes an integrated vulnerability scanner for scanning images in Azure Container Registry registries. The vulnerability scanner runs on an image:

- When you push the image to your registry
- Weekly on any image that was pulled within the last 30
- When you import the image to your Azure Container Registry
- Continuously in specific situations

Learn more in [Vulnerability assessment](defender-for-containers-usage.md).

:::image type="content" source="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png" alt-text="Sample Microsoft Defender for Cloud recommendation about vulnerabilities discovered in Azure Container Registry (ACR) hosted images." lightbox="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png":::

### View vulnerabilities for running images

The recommendation **Running container images should have vulnerability findings resolved** shows vulnerabilities for running images by using the scan results from ACR registries and information on running images from the Defender security profile/extension. Images that are deployed from a non-ACR registry, will appear under the **Not applicable** tab.

:::image type="content" source="media/defender-for-containers/running-image-vulnerabilities-recommendation.png" alt-text="Screenshot showing where the recommendation is viewable." lightbox="media/defender-for-containers/running-image-vulnerabilities-recommendation-expanded.png":::

## Run-time protection for Kubernetes nodes and clusters

Defender for Containers provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers. Threat protection at the cluster level is provided by the Defender profile and analysis of the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high-privileged roles, and the creation of sensitive mounts.

In addition, our threat detection goes beyond the Kubernetes management layer. Defender for Containers includes **host-level threat detection** with over 60 Kubernetes-aware analytics, AI, and anomaly detections based on your runtime workload. Our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.

This solution monitors the growing attack surface of multi-cloud Kubernetes deployments and tracks the [MITRE ATT&CK® matrix for Containers](https://www.microsoft.com/security/blog/2021/04/29/center-for-threat-informed-defense-teams-up-with-microsoft-partners-to-build-the-attck-for-containers-matrix/), a framework that was developed by the [Center for Threat-Informed Defense](https://mitre-engenuity.org/ctid/) in close partnership with Microsoft and others.

The full list of available alerts can be found in the [Reference table of alerts](alerts-reference.md#alerts-k8scluster).

:::image type="content" source="media/defender-for-containers/sample-containers-plan-alerts.png" alt-text="Screenshot of Defender for Cloud's alerts page showing alerts for multi-cloud Kubernetes resources." lightbox="./media/defender-for-containers/sample-containers-plan-alerts.png":::

## FAQ - Defender for Containers

- [Overview of Microsoft Defender for Containers](#overview-of-microsoft-defender-for-containers)
  - [Microsoft Defender for Containers plan availability](#microsoft-defender-for-containers-plan-availability)
  - [What are the benefits of Microsoft Defender for Containers?](#what-are-the-benefits-of-microsoft-defender-for-containers)
  - [Hardening](#hardening)
    - [Continuous monitoring of your Kubernetes clusters - wherever they're hosted](#continuous-monitoring-of-your-kubernetes-clusters---wherever-theyre-hosted)
    - [Kubernetes data plane hardening](#kubernetes-data-plane-hardening)
  - [Vulnerability assessment](#vulnerability-assessment)
    - [Scanning images in ACR registries](#scanning-images-in-acr-registries)
    - [View vulnerabilities for running images](#view-vulnerabilities-for-running-images)
  - [Run-time protection for Kubernetes nodes and clusters](#run-time-protection-for-kubernetes-nodes-and-clusters)
  - [FAQ - Defender for Containers](#faq---defender-for-containers)
    - [What are the options to enable the new plan at scale?](#what-are-the-options-to-enable-the-new-plan-at-scale)
    - [Does Microsoft Defender for Containers support AKS clusters with virtual machines scale sets?](#does-microsoft-defender-for-containers-support-aks-clusters-with-virtual-machines-scale-sets)
    - [Does Microsoft Defender for Containers support AKS without scale set (default)?](#does-microsoft-defender-for-containers-support-aks-without-scale-set-default)
    - [Do I need to install the Log Analytics VM extension on my AKS nodes for security protection?](#do-i-need-to-install-the-log-analytics-vm-extension-on-my-aks-nodes-for-security-protection)
  - [Next steps](#next-steps)

### What are the options to enable the new plan at scale?

We’ve rolled out a new policy in Azure Policy, **Configure Microsoft Defender for Containers to be enabled**, to make it easier to enable the new plan at scale.

### Does Microsoft Defender for Containers support AKS clusters with virtual machines scale sets?

Yes.

### Does Microsoft Defender for Containers support AKS without scale set (default)?

No. Only Azure Kubernetes Service (AKS) clusters that use virtual machine scale sets for the nodes is supported.

### Do I need to install the Log Analytics VM extension on my AKS nodes for security protection?

No, AKS is a managed service, and manipulation of the IaaS resources isn't supported. The Log Analytics VM extension isn't needed and may result in additional charges.

## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. To enable the plan, see:

> [!div class="nextstepaction"]
> [Enable Defender for Containers](defender-for-containers-enable.md)
