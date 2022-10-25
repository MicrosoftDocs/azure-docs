---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers
ms.topic: overview
ms.custom: ignite-2022
ms.date: 09/11/2022
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
| Required roles and permissions: | • To deploy the required components, see the [permissions for each of the components](monitoring-components.md#defender-for-containers-extensions)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md) |
| Clouds: | **Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National clouds (Azure Government, Azure China 21Vianet) (Except for preview features))<br><br>**Non-Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: On-prem/IaaS supported via Arc enabled Kubernetes (Preview). <br> <br>For more information about, see the [availability section](supported-machines-endpoint-solutions-clouds-containers.md#defender-for-containers-feature-availability). |

## Hardening

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations that are available on Defender for Cloud's Recommendations page. The recommendations allow you to investigate and remediate issues. For details on the recommendations that might appear for this feature, check out the [compute section](recommendations-reference.md#recs-container) of the recommendations reference table.

For Kubernetes clusters on EKS, you'll need to [connect your AWS account to Microsoft Defender for Cloud](quickstart-onboard-aws.md) and ensure you've enabled the CSPM plan.

You can use the resource filter to review the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page:

:::image type="content" source="media/defender-for-containers/resource-filter.png" alt-text="Screenshot showing you where the resource filter is located." lightbox="media/defender-for-containers/resource-filter.png":::

### Kubernetes data plane hardening

To protect the workloads of your Kubernetes containers with tailored recommendations, you can install the [Azure Policy for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md). Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure it to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

You can learn more about [Kubernetes data plane hardening](kubernetes-workload-protections.md).

## Vulnerability assessment

### Scanning images in container registries

Defender for Containers scans the containers in Azure Container Registry (ACR) and Amazon AWS Elastic Container Registry (ECR) to notify you if there are known vulnerabilities in your images.

When you push an image to a container registry and while the image is stored in the container registry, Defender for Containers automatically scans it. Defender for Containers checks for known vulnerabilities in packages or dependencies defined in the image file.

When the scan completes, Defender for Containers provides details for each vulnerability detected, a security classification for each vulnerability detected, and guidance on how to remediate issues and protect vulnerable attack surfaces.

Learn more about:
- [Vulnerability assessment for Azure Container Registry (ACR)](defender-for-containers-va-acr.md)
- [Vulnerability assessment for Amazon AWS Elastic Container Registry (ECR)](defender-for-containers-va-ecr.md)

### View vulnerabilities for running images in Azure Container Registry (ACR)

Defender for Cloud gives its customers the ability to prioritize the remediation of vulnerabilities in images that are currently being used within their environment using the [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false) recommendation.

To provide findings for the recommendation, Defender for Cloud collects the inventory of your running containers that are collected by the Defender agent installed on your AKS clusters. Defender for Cloud correlates that inventory with the vulnerability assessment scan of images that are stored in ACR. The recommendation shows your running containers with the vulnerabilities associated with the images that are used by each container and provides vulnerability reports and remediation steps.

:::image type="content" source="media/defender-for-containers/running-image-vulnerabilities-recommendation.png" alt-text="Screenshot showing where the recommendation is viewable." lightbox="media/defender-for-containers/running-image-vulnerabilities-recommendation-expanded.png":::

Learn more about [viewing vulnerabilities for running images in (ACR)](defender-for-containers-va-acr.md).

## Run-time protection for Kubernetes nodes and clusters

Defender for Containers provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers. Threat protection at the cluster level is provided by the Defender agent and analysis of the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high-privileged roles, and the creation of sensitive mounts.

Defender for Containers also includes host-level threat detection with over 60 Kubernetes-aware analytics, AI, and anomaly detections based on your runtime workload.

Defender for Cloud monitors the attack surface of multicloud Kubernetes deployments based on the [MITRE ATT&CK® matrix for Containers](https://www.microsoft.com/security/blog/2021/04/29/center-for-threat-informed-defense-teams-up-with-microsoft-partners-to-build-the-attck-for-containers-matrix/), a framework developed by the [Center for Threat-Informed Defense](https://mitre-engenuity.org/ctid/) in close partnership with Microsoft.

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
