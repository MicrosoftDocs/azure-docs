---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers
ms.topic: overview
ms.date: 01/23/2022
---
# Overview of Microsoft Defender for Containers

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Containers is the cloud-native solution for securing your containers.

This plan merges the capabilities of two existing Microsoft Defender plans, "Defender for Kubernetes" and "Defender for Container registries", and provides new and improved features without deprecating any of the functionality from those plans. 

On this page, you'll learn how how you can use Defender for Containers to improve, monitor, and maintain the security of your clusters, containers, and their applications.

## Availability

| Aspect                          | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                  | General availability (GA)<br>Where indicated, specific features are in preview. [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Pricing:                        | **Microsoft Defender for Containers** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Registries and images:          | **Supported**<br> • Linux images in Azure Container Registry (ACR) registries accessible from the public internet with shell access<br> • Private registries with access granted to [Trusted Services](../container-registry/allow-access-trusted-services.md#trusted-services)<br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md)<br><br>**Unsupported**<br> • Windows images<br> • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> • Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md) |
| Kubernetes distributions and configurations:       | **Supported**<br> • Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters<br><br>**Unsupported**<br> • Any [taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) applied to your nodes *might* disrupt the configuration of Defender for Containers<br>•The AKS Defender profile doesn't support AKS clusters that don't have RBAC enabled.<br><br>**Tested on**<br> • [Azure Kubernetes Service](../aks/intro-kubernetes.md)<br> • [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)<br> • [Azure Kubernetes Service on Azure Stack HCI](/azure-stack/aks-hci/overview)<br> • [Kubernetes](https://kubernetes.io/docs/home/)<br> • [AKS Engine](https://github.com/Azure/aks-engine)<br> • [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br> • [Red Hat OpenShift](https://www.openshift.com/learn/topics/kubernetes/) (version 4.6 or newer)<br> • [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid)<br> • [Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/)                                                                        |
| Required roles and permissions: | • To auto provision the required components, [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor), or [Azure Kubernetes Service Contributor Role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md)                                                                                                                                                                                                                        |
| Clouds:                         | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet) (Except for preview features)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## What are the benefits of Microsoft Defender for Containers?

Defender for Containers helps with the core aspects of container security:

- **Environment hardening** - Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-prem / IaaS, or Amazon EKS. By continuously assessing clusters, Defender for Containers provides visibility into misconfigurations and guidelines to help mitigate identified threats. Learn more in [Environment hardening through security recommendations](#environment-hardening-through-security-recommendations).

- **Vulnerability assessment scanning** - Vulnerability assessment and management tools for images **stored** in ACR registries and **running** in Azure Kubernetes Service. Learn more in [Vulnerability assessment](#vulnerability-assessment).

- **Run-time threat protection for nodes and clusters** - Threat protection for clusters and Linux nodes generates security alerts for suspicious activities. Learn more in [Run-time protection for Kubernetes nodes, clusters, and hosts](#run-time-protection-for-kubernetes-nodes-and-clusters).

## Architecture overview

The architecture of the various elements involved in the full range of protections provided by Defender for Containers varies depending on where your Kubernetes clusters are hosted. 

Defender for Containers protects your clusters whether they're running in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications.

- **Amazon Elastic Kubernetes Service (EKS) in a connected Amazon Web Services (AWS) account** - Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

- **An unmanaged Kubernetes distribution** (using Azure Arc-enabled Kubernetes) - Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters hosted on-premises or on IaaS.

> [!NOTE]
> Defender for Containers' support for Arc-enabled Kubernetes clusters (and therefore AWS EKS too) is a preview feature.

For high-level diagrams of each scenario, see the relevant tabs below. 

In the diagrams you'll see that the items received and analyzed by Defender for Cloud include:

- Audit logs and security events from the API server
- Cluster configuration information from the control plane
- Workload configuration from Azure Policy 
- Security signals and events from the node level


### [**AKS cluster**](#tab/defender-for-container-arch-aks)

### Architecture diagram of Defender for Cloud and AKS clusters<a name="jit-asc"></a>

When Defender for Cloud protects a cluster hosted in Azure Kubernetes Service, the collection of audit log data is agentless and frictionless.

The **Defender profile (preview)** deployed to each node provides the runtime protections and collects signals from nodes using [eBPF technology](https://ebpf.io/).

The **Azure Policy add-on for Kubernetes** collects cluster and workload configuration for admission control policies as explained in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).

> [!NOTE]
> Defender for Containers' **Defender profile** is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-aks-cluster.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, and Azure Policy." lightbox="./media/defender-for-containers/architecture-aks-cluster.png":::


### [**Azure Arc-enabled Kubernetes**](#tab/defender-for-container-arch-arc)

### Architecture diagram of Defender for Cloud and Arc-enabled Kubernetes clusters

For all clusters hosted outside of Azure, [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) is required to connect the clusters to Azure and provide Azure services such as Defender for Containers. 

With the cluster connected to Azure, an [Arc extension](../azure-arc/kubernetes/extensions.md) collects Kubernetes audit logs data from all control plane nodes in the cluster and sends them to the Microsoft Defender for Cloud backend in the cloud for further analysis. The extension is registered with a Log Analytics workspace used as a data pipeline, but the audit log data isn't stored in the Log Analytics workspace.

Workload configuration information is collected by an Azure Policy add-on. As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). Kubernetes admission controllers are plugins that enforce how your clusters are used. The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

> [!NOTE]
> Defender for Containers' support for Arc-enabled Kubernetes clusters is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-arc-cluster.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-arc-cluster.png":::



### [**AWS EKS**](#tab/defender-for-container-arch-eks)

### Architecture diagram of Defender for Cloud and EKS clusters

For all clusters hosted outside of Azure, [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) is required to connect the clusters to Azure and provide Azure services such as Defender for Containers. 

With an EKS-based cluster, Arc and its Defender extension are needed to collect policy and configuration data from nodes. 

With an EKS-based cluster, Arc and its Defender extension are required for runtime protection. The **Azure Policy add-on for Kubernetes** collects cluster and workload configuration for admission control policies as explained in [Protect your Kubernetes workloads](kubernetes-workload-protections.md) 

We use AWS's CloudWatch to collect log data. To monitor your EKS clusters with Defender for Cloud, your AWS account needs to be connected to Microsoft Defender for Cloud [via the environment settings page](quickstart-onboard-aws.md). You'll need both the **Defender for Containers** plan and the **CSPM** plan (for configuration monitoring and recommendations).

> [!NOTE]
> Defender for Containers' support for AWS EKS clusters is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-eks-cluster.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Amazon Web Services' EKS clusters, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-eks-cluster.png":::

---


## Environment hardening through security recommendations

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues. For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

For Kubernetes clusters on EKS, you'll need to connect your AWS account to Microsoft Defender for Cloud via the environment settings page as described in [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md). Then ensure you've enabled the CSPM plan.

For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

When reviewing the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page, you can use the resource filter:



### Workload protection best-practices using Kubernetes admission control

For a bundle of recommendations to protect the workloads of your Kubernetes containers, install the **Azure Policy for Kubernetes**. You can also auto deploy this component as explained in [enable auto provisioning of agents and extensions](enable-data-collection.md#auto-provision-mma). By default, auto provisioning is enabled when you enable Defender for Containers. 

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).




## Vulnerability assessment

### Scanning images in ACR registries

Defender for Containers includes an integrated vulnerability scanner for scanning images in Azure Container Registry registries.

There are three triggers for an image scan:

- **On push** - Whenever an image is pushed to your registry, Defender for container registries automatically scans that image. To trigger the scan of an image, push it to your repository.

- **Recently pulled** - Since new vulnerabilities are discovered every day, **Microsoft Defender for container registries** also scans, on a weekly basis, any image that has been pulled within the last 30 days. There's no extra charge for these rescans; as mentioned above, you're billed once per image.

- **On import** - Azure Container Registry has import tools to bring images to your registry from Docker Hub, Microsoft Container Registry, or another Azure container registry. **Microsoft Defender for container registries** scans any supported images you import. Learn more in [Import container images to a container registry](../container-registry/container-registry-import-images.md).
 
The scan typically completes within 2 minutes, but it might take up to 40 minutes. For every vulnerability identified, Defender for Cloud provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. 

Defender for Cloud filters and classifies findings from the scanner. When an image is healthy, Defender for Cloud marks it as such. Defender for Cloud generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Defender for Cloud reduces the potential for unwanted informational alerts.

:::image type="content" source="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png" alt-text="Sample Microsoft Defender for Cloud recommendation about vulnerabilities discovered in Azure Container Registry (ACR) hosted images." lightbox="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png":::


### Scanning images at runtime

Defender for Containers expands on the registry scanning features of the Defender for container registries plan by introducing the **preview feature** of run-time visibility of vulnerabilities powered by the Defender profile.

The new recommendation, **Running container images should have vulnerability findings resolved** groups running images that have vulnerabilities and provides details about the issues discovered and how to remediate them.

:::image type="content" source="media/defender-for-containers/running-image-vulnerabilities-recommendation.png" alt-text="Screenshot showing where the recommendation is viewable" lightbox="media/defender-for-containers/running-image-vulnerabilities-recommendation-expanded.png":::

## Run-time protection for Kubernetes nodes and clusters

Defender for Cloud provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Threat protection at the cluster level is provided by the Defender profile and analysis of the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts.

In addition, our threat detection goes beyond the Kubernetes management layer. Defender for Containers includes **host-level threat detection** with over sixty Kubernetes-aware analytics, AI, and anomaly detections based on your runtime workload. Our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered. Together, this solution monitors the growing attack surface of multi-cloud Kubernetes deployments and tracks the [MITRE ATT&CK® matrix for Containers](https://www.microsoft.com/security/blog/2021/04/29/center-for-threat-informed-defense-teams-up-with-microsoft-partners-to-build-the-attck-for-containers-matrix/), a framework that was developed by the [Center for Threat-Informed Defense](https://mitre-engenuity.org/ctid/) in close partnership with Microsoft and others.

The full list of available alerts can be found in the [Reference table of alerts](alerts-reference.md#alerts-k8scluster).

:::image type="content" source="media/defender-for-containers/sample-containers-plan-alerts.png" alt-text="Screenshot of Defender for Cloud's alerts page showing alerts for multi-cloud Kubernetes resources." lightbox="./media/defender-for-containers/sample-containers-plan-alerts.png":::

## FAQ - Defender for Containers

- [What happens to subscriptions with Microsoft Defender for Kubernetes or Microsoft Defender for container registries enabled?](#what-happens-to-subscriptions-with-microsoft-defender-for-kubernetes-or-microsoft-defender-for-container-registries-enabled)
- [Is Defender for Containers a mandatory upgrade?](#is-defender-for-containers-a-mandatory-upgrade)
- [Does the new plan reflect a price increase?](#does-the-new-plan-reflect-a-price-increase)
- [What are the options to enable the new plan at scale?](#what-are-the-options-to-enable-the-new-plan-at-scale)

### What happens to subscriptions with Microsoft Defender for Kubernetes or Microsoft Defender for container registries enabled?

Subscriptions that already have one of these plans enabled can continue to benefit from it.

If you haven't enabled them yet, or create a new subscription, these plans can no longer be enabled.

### Is Defender for Containers a mandatory upgrade?
No. Subscriptions that have either Microsoft Defender for Kubernetes or Microsoft Defender for container registries enabled don't need to be upgraded to the new Microsoft Defender for Containers plan. However, they won't benefit from the new and improved capabilities and they will have an upgrade icon shown alongside them in the Azure portal. 

### Does the new plan reflect a price increase?
No. There is no direct price increase. The new comprehensive Container security plan  combines Kubernetes protection and container registry image scanning, and removes the previous dependency on the (paid) Defender for Servers plan. 

### What are the options to enable the new plan at scale? 
We’ve rolled out a new policy in Azure Policy, **Configure Microsoft Defender for Containers to be enabled**, to make it easier to enable the new plan at scale. 



## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. To enable the plan, see:

> [!div class="nextstepaction"]
> [Enable Defender for Containers](defender-for-containers-enable.md)
