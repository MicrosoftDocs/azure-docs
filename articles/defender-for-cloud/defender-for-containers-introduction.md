---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers
ms.topic: overview
ms.date: 08/17/2022
---

# Overview of Microsoft Defender for Containers

Microsoft Defender for Containers is the cloud-native solution that is used to secure your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications.

Defender for Containers assists you with the three core aspects of container security:

- [**Environment hardening**](#hardening) - Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-premises/IaaS, or Amazon EKS. Defender for Containers continuously assesses clusters to provide visibility into misconfigurations and guidelines to help mitigate identified threats.

- [**Vulnerability assessment**](#vulnerability-assessment) - Vulnerability assessment and management tools for images stored in ACR registries and running in Azure Kubernetes Service.

- [**Run-time threat protection for nodes and clusters**](#run-time-protection-for-kubernetes-nodes-and-clusters) - Threat protection for clusters and Linux nodes generates security alerts for suspicious activities.

You can learn more by watching this video from the Defender for Cloud in the Field video series: [Microsoft Defender for Containers](episode-three.md).

## Microsoft Defender for Containers plan availability

| Aspect | Details |
|--|--|
| Release state: | General availability (GA)<br> Certain features are in preview, for a full list see the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section. |
| Feature availability | Refer to the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section for additional information on feature release state and availability.|
| Pricing: | **Microsoft Defender for Containers** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Required roles and permissions: | • To auto provision the required components, see the [permissions for each of the components](enable-data-collection.md?tabs=autoprovision-containers)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md) |
| Clouds: | **Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National clouds (Azure Government, Azure China 21Vianet) (Except for preview features))<br><br>**Non-Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: On-prem/IaaS supported via Arc enabled Kubernetes (Preview). <br> <br>For more information about, see the [availability section](supported-machines-endpoint-solutions-clouds-containers.md#defender-for-containers-feature-availability). |

## Hardening

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations that are available on Defender for Cloud's Recommendations page. The recommendations allow you to investigate and remediate issues. For details on the recommendations that might appear for this feature, check out the [compute section](recommendations-reference.md#recs-container) of the recommendations reference table.

For Kubernetes clusters on EKS, you'll need to [connect your AWS account to Microsoft Defender for Cloud](quickstart-onboard-aws.md) and ensure you've enabled the CSPM plan.

You can use the resource filter to review the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page:

:::image type="content" source="media/defender-for-containers/resource-filter.png" alt-text="Screenshot showing you where the resource filter is located." lightbox="media/defender-for-containers/resource-filter.png":::

### Kubernetes data plane hardening

To protect the workloads of your Kubernetes containers with tailored recommendations, you can install the [Azure Policy for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md). You can also auto deploy this component as explained in [enable auto provisioning of agents and extensions](enable-data-collection.md#auto-provision-mma).

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure it to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

You can learn more about [Kubernetes data plane hardening](kubernetes-workload-protections.md).

## Vulnerability assessment

### Scanning images in ACR registries

Defender for Containers offers vulnerability scanning for images in Azure Container Registries (ACRs). Triggers for scanning an image include:

- **On push**: When an image is pushed in to a registry for storage, Defender for Containers automatically scans the image.

- **Recently pulled**: Weekly scans of images that have been pulled in the last 30 days.

- **On import**: When you import images into an ACR, Defender for Containers scans any supported images.

Learn more in [Vulnerability assessment](defender-for-containers-usage.md).

:::image type="content" source="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png" alt-text="Sample Microsoft Defender for Cloud recommendation about vulnerabilities discovered in Azure Container Registry (ACR) hosted images." lightbox="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png":::

### View vulnerabilities for running images

Defender for Cloud gives its customers the ability to prioritize the remediation of vulnerabilities in images that are currently being used within their environment using the [Running container images should have vulnerability findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false) recommendation.

Defender for Cloud is able to provide the recommendation, by correlating the inventory of your running containers that are collected by the Defender agent which is installed on your AKS clusters, with the vulnerability assessment scan of images that are stored in ACR. The recommendation then shows your running containers with the vulnerabilities associated with the images that are used by each container and provides you with vulnerability reports and remediation steps.

> [!NOTE] 
> **Windows containers**: There is no Defender agent for Windows containers, the Defender agent is deployed to a Linux node running in the cluster, to retrieve the running container inventory for your Windows nodes.
>
> Images that aren't pulled from ACR for deployment in AKS won't be checked and will appear under the **Not applicable** tab.
>
> Images that have been deleted from their ACR registry, but are still running, won't be reported on only 30 days after their last scan occurred in ACR.

:::image type="content" source="media/defender-for-containers/running-image-vulnerabilities-recommendation.png" alt-text="Screenshot showing where the recommendation is viewable." lightbox="media/defender-for-containers/running-image-vulnerabilities-recommendation-expanded.png":::

## Run-time protection for Kubernetes nodes and clusters

Defender for Containers provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers. Threat protection at the cluster level is provided by the Defender agent and analysis of the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high-privileged roles, and the creation of sensitive mounts.

In addition, our threat detection goes beyond the Kubernetes management layer. Defender for Containers includes host-level threat detection with over 60 Kubernetes-aware analytics, AI, and anomaly detections based on your runtime workload.

This solution monitors the growing attack surface of multicloud Kubernetes deployments and tracks the [MITRE ATT&CK® matrix for Containers](https://www.microsoft.com/security/blog/2021/04/29/center-for-threat-informed-defense-teams-up-with-microsoft-partners-to-build-the-attck-for-containers-matrix/), a framework that was developed by the [Center for Threat-Informed Defense](https://mitre-engenuity.org/ctid/) in close partnership with Microsoft and others.

## FAQ - Defender for Containers

- [What are the options to enable the new plan at scale?](#what-are-the-options-to-enable-the-new-plan-at-scale)
- [Does Microsoft Defender for Containers support AKS clusters with virtual machines scale sets?](#does-microsoft-defender-for-containers-support-aks-clusters-with-virtual-machines-scale-sets)
- [Does Microsoft Defender for Containers support AKS without scale set (default)?](#does-microsoft-defender-for-containers-support-aks-without-scale-set-default)
- [Do I need to install the Log Analytics VM extension on my AKS nodes for security protection?](#do-i-need-to-install-the-log-analytics-vm-extension-on-my-aks-nodes-for-security-protection)

### What are the options to enable the new plan at scale?

You can use the Azure Policy `Configure Microsoft Defender for Containers to be enabled`, to enable Defender for Containers at scale. You can also see all of the options that are available to [enable Microsoft Defender for Containers](defender-for-containers-enable.md).

### Does Microsoft Defender for Containers support AKS clusters with virtual machines scale sets?

Yes.

### Does Microsoft Defender for Containers support AKS without scale set (default)?

No. Only Azure Kubernetes Service (AKS) clusters that use virtual machine scale sets for the nodes is supported.

### Do I need to install the Log Analytics VM extension on my AKS nodes for security protection?

No, AKS is a managed service, and manipulation of the IaaS resources isn't supported. The Log Analytics VM extension isn't needed and may result in extra charges.

## Learn More

Learn more about Defender for Containers in the following blogs:

- [Introducing Microsoft Defender for Containers](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/introducing-microsoft-defender-for-containers/ba-p/2952317)
- [Demonstrating Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/how-to-demonstrate-the-new-containers-features-in-microsoft/ba-p/3281172)

The release state of Defender for Containers is broken down by two dimensions: environment and feature. So, for example:
  - **Kubernetes data plane recommendations** for AKS clusters are GA
  - **Kubernetes data plane recommendations** for EKS clusters are preview

  To view the status of the full matrix of features and environments, see [Microsoft Defender for Containers feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. To enable the plan, see:

> [!div class="nextstepaction"]
> [Enable Defender for Containers](defender-for-containers-enable.md)
