---
title: Container security 
description: Learn about Microsoft Defender for Containers
ms.topic: overview
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 07/25/2023
---

# Overview of Microsoft Defender for Containers

Microsoft Defender for Containers is the cloud-native solution to improve, monitor, and maintain the security of your clusters, containers, and their applications.

Defender for Containers assists you with the three core aspects of container security:

- [**Environment hardening**](#hardening) - Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-premises/IaaS, or Amazon EKS. Defender for Containers continuously assesses clusters to provide visibility into misconfigurations and guidelines to help mitigate identified threats.

- [**Vulnerability assessment**](#vulnerability-assessment) - Vulnerability assessment and management tools for images stored in Azure Container Registry and Elastic Container Registry

- [**Run-time threat protection for nodes and clusters**](#run-time-protection-for-kubernetes-nodes-and-clusters) - Threat protection for clusters and nodes generates security alerts for suspicious activities.

You can learn more by watching this video from the Defender for Cloud in the Field video series: [Microsoft Defender for Containers](episode-three.md).

## Microsoft Defender for Containers plan availability

| Aspect | Details |
|--|--|
| Release state: | General availability (GA)<br> Certain features are in preview, for a full list see the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section. |
| Feature availability | Refer to the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section for additional information on feature release state and availability.|
| Pricing: | **Microsoft Defender for Containers** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Required roles and permissions: | • To deploy the required components, see the [permissions for each of the components](monitoring-components.md#defender-for-containers-extensions)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Roles for remediation](permissions.md#roles-used-to-automatically-provision-agents-and-extensions) and [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md) |
| Clouds: | **Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National clouds (Azure Government, Microsoft Azure operated by 21Vianet) (Except for preview features))<br><br>**Non-Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: On-prem/IaaS supported via Arc enabled Kubernetes (Preview). <br> <br>For more information about, see the [availability section](supported-machines-endpoint-solutions-clouds-containers.md#defender-for-containers-feature-availability). |

## Hardening

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations that are available on Defender for Cloud's Recommendations page. The recommendations let you investigate and remediate issues.

You can use the resource filter to review the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page:

:::image type="content" source="media/defender-for-containers/resource-filter.png" alt-text="Screenshot showing you where the resource filter is located." lightbox="media/defender-for-containers/resource-filter.png":::

For details on the recommendations that might appear for this feature, check out the [compute section](recommendations-reference.md#recs-container) of the recommendations reference table.

### Kubernetes data plane hardening

To protect the workloads of your Kubernetes containers with tailored recommendations, you can install the [Azure Policy for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md). Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure it to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

You can learn more about [Kubernetes data plane hardening](kubernetes-workload-protections.md).

## Vulnerability assessment

Defender for Containers scans the container images in Azure Container Registry (ACR) and Amazon AWS Elastic Container Registry (ECR) to provide vulnerability reports for your container images, providing details for each vulnerability detected, remediation guidance, real-world exploit insights, and more.

There are two solutions for vulnerability assessment in Azure, one powered by Microsoft Defender Vulnerability Management and one powered by Qualys.

Learn more about:

- [Vulnerability assessments for Azure with Microsoft Defender Vulnerability Management](agentless-container-registry-vulnerability-assessment.md)
- [Vulnerability assessment for Azure powered by Qualys](defender-for-containers-vulnerability-assessment-azure.md)
- [Vulnerability assessment for Amazon AWS Elastic Container Registry (ECR)](defender-for-containers-vulnerability-assessment-elastic.md)

## Run-time protection for Kubernetes nodes and clusters

Defender for Containers provides real-time threat protection for [supported containerized environments](support-matrix-defender-for-containers.md) and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Threat protection at the cluster level is provided by the Defender agent and analysis of the Kubernetes audit logs. This means that security alerts are only triggered for actions and deployments that occur after you've enabled Defender for Containers on your subscription.

Examples of security events that Microsoft Defenders for Containers monitors include:

- Exposed Kubernetes dashboards
- Creation of high privileged roles
- Creation of sensitive mounts

You can view security alerts by selecting the Security alerts tile at the top of the Defender for Cloud's overview page, or the link from the sidebar.

  :::image type="content" source="media/managing-and-responding-alerts/overview-page-alerts-links.png" alt-text="Screenshot showing how to get to the security alerts page from Microsoft Defender for Cloud's overview page." lightbox="media/managing-and-responding-alerts/overview-page-alerts-links.png":::

The security alerts page opens.

   :::image type="content" source="media/defender-for-containers/view-containers-alerts.png" alt-text="Screenshot showing you where to view the list of alerts." lightbox="media/defender-for-containers/view-containers-alerts.png":::

Security alerts for runtime workload in the clusters can be recognized by the `K8S.NODE_` prefix of the alert type.  For a full list of the cluster level alerts, see the [reference table of alerts](alerts-reference.md#alerts-k8scluster).

Defender for Containers also includes host-level threat detection with over 60 Kubernetes-aware analytics, AI, and anomaly detections based on your runtime workload.

Defender for Cloud monitors the attack surface of multicloud Kubernetes deployments based on the [MITRE ATT&CK® matrix for Containers](https://www.microsoft.com/security/blog/2021/04/29/center-for-threat-informed-defense-teams-up-with-microsoft-partners-to-build-the-attck-for-containers-matrix/), a framework developed by the [Center for Threat-Informed Defense](https://mitre-engenuity.org/cybersecurity/center-for-threat-informed-defense/) in close partnership with Microsoft.

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

- [Enable Defender for Containers](defender-for-containers-enable.md)
- Check out [common questions](faq-defender-for-containers.yml) about Defender for Containers.
