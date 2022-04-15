---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers
ms.topic: overview
ms.author: elkrieger
author: ElazarK
ms.date: 04/07/2022
---

# Overview of Microsoft Defender for Containers

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Containers is the cloud-native solution for securing your containers. 

On this page, you'll learn how you can use Defender for Containers to improve, monitor, and maintain the security of your clusters, containers, and their applications.

## Microsoft Defender for Containers plan availability

| Aspect | Details |
|--|--|
| Release state: | General availability (GA)<br> Certain features  are in preview, for a full list see the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section. |
| Feature availability | Refer to the [availability](supported-machines-endpoint-solutions-clouds-containers.md) section for additional information on feature release state and availability.|
| Pricing: | **Microsoft Defender for Containers** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Required roles and permissions: | • To auto provision the required components, [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor), or [Azure Kubernetes Service Contributor Role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md) |
| Clouds: | **Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National clouds (Azure Government, Azure China 21Vianet) (Except for preview features))<br><br>**Non Azure**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP projects (Preview) <br> :::image type="icon" source="./media/icons/yes-icon.png"::: On-prem/IaaS supported via Arc enabled Kubernetes (Preview). <br> <br>For more details, see the [availability section](supported-machines-endpoint-solutions-clouds-containers.md#defender-for-containers-feature-availability). |


## What are the benefits of Microsoft Defender for Containers?

Defender for Containers helps with the core aspects of container security:

- **Environment hardening** - Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-prem / IaaS, or Amazon EKS. By continuously assessing clusters, Defender for Containers provides visibility into misconfigurations and guidelines to help mitigate identified threats. Learn more in [Hardening](#hardening).

- **Vulnerability assessment** - Vulnerability assessment and management tools for images **stored** in ACR registries and **running** in Azure Kubernetes Service. Learn more in [Vulnerability assessment](#vulnerability-assessment).

- **Run-time threat protection for nodes and clusters** - Threat protection for clusters and Linux nodes generates security alerts for suspicious activities. Learn more in [Run-time protection for Kubernetes nodes, clusters, and hosts](#run-time-protection-for-kubernetes-nodes-and-clusters).

## Hardening

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues. For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-container) of the recommendations reference table.

For Kubernetes clusters on EKS, you'll need to connect your AWS account to Microsoft Defender for Cloud via the environment settings page as described in [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md). Then ensure you've enabled the CSPM plan.

When reviewing the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page, you can use the resource filter:

:::image type="content" source="media/defender-for-containers/resource-filter.png" alt-text="Screenshot showing you where the resource filter is located.":::

### Kubernetes data plane hardening

For a bundle of recommendations to protect the workloads of your Kubernetes containers, install the **Azure Policy for Kubernetes**. You can also auto deploy this component as explained in [enable auto provisioning of agents and extensions](enable-data-collection.md#auto-provision-mma). By default, auto provisioning is enabled when you enable Defender for Containers. 

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Kubernetes data plane hardening](kubernetes-workload-protections.md).




## Vulnerability assessment

### Scanning images in ACR registries

Defender for Containers includes an integrated vulnerability scanner for scanning images in Azure Container Registry registries.

There are four triggers for an image scan:

- **On push** - Whenever an image is pushed to your registry, Defender for Containers automatically scans that image. To trigger the scan of an image, push it to your repository.

- **Recently pulled** - Since new vulnerabilities are discovered every day, **Microsoft Defender for Containers** also scans, on a weekly basis, any image that has been pulled within the last 30 days. There's no extra charge for these rescans; as mentioned above, you're billed once per image.

- **On import** - Azure Container Registry has import tools to bring images to your registry from Docker Hub, Microsoft Container Registry, or another Azure container registry. **Microsoft Defender for container Containers** scans any supported images you import. Learn more in [Import container images to a container registry](../container-registry/container-registry-import-images.md).

- **Continuous scan**- This trigger has two modes:

    - A Continuous scan based on an image pull.  This scan is performed every seven days after an image was pulled, and only for 30 days after the image was pulled. This mode doesn't require the security profile, or extension.

    -  (Preview) Continuous scan for running images. This scan is performed every seven days for as long as the image runs. This mode runs instead of  the above mode when the Defender profile, or extension is running on the cluster.

This scan typically completes within 2 minutes, but it might take up to 40 minutes. For every vulnerability identified, Defender for Cloud provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. 

Defender for Cloud filters, and classifies findings from the scanner. When an image is healthy, Defender for Cloud marks it as such. Defender for Cloud generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Defender for Cloud reduces the potential for unwanted informational alerts.

:::image type="content" source="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png" alt-text="Sample Microsoft Defender for Cloud recommendation about vulnerabilities discovered in Azure Container Registry (ACR) hosted images." lightbox="./media/defender-for-containers/recommendation-acr-images-with-vulnerabilities.png":::


### View vulnerabilities for running images 

The recommendation **Running container images should have vulnerability findings resolved** shows vulnerabilities for running images by using the scan results from ACR registeries and information on running images from the Defender security profile/extension. Images that are deployed from a non ACR registry, will appear under the Not applicable tab.

:::image type="content" source="media/defender-for-containers/running-image-vulnerabilities-recommendation.png" alt-text="Screenshot showing where the recommendation is viewable" lightbox="media/defender-for-containers/running-image-vulnerabilities-recommendation-expanded.png":::

> [!NOTE]
> This recommendation is currently supported for Linux containers only, as there's no Defender profile/extension for Windows.
> 
## Run-time protection for Kubernetes nodes and clusters

Defender for Cloud provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Threat protection at the cluster level is provided by the Defender profile and analysis of the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high-privileged roles, and the creation of sensitive mounts.

In addition, our threat detection goes beyond the Kubernetes management layer. Defender for Containers includes **host-level threat detection** with over 60 Kubernetes-aware analytics, AI, and anomaly detections based on your runtime workload. Our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered. Together, this solution monitors the growing attack surface of multi-cloud Kubernetes deployments and tracks the [MITRE ATT&CK® matrix for Containers](https://www.microsoft.com/security/blog/2021/04/29/center-for-threat-informed-defense-teams-up-with-microsoft-partners-to-build-the-attck-for-containers-matrix/), a framework that was developed by the [Center for Threat-Informed Defense](https://mitre-engenuity.org/ctid/) in close partnership with Microsoft and others.

The full list of available alerts can be found in the [Reference table of alerts](alerts-reference.md#alerts-k8scluster).

:::image type="content" source="media/defender-for-containers/sample-containers-plan-alerts.png" alt-text="Screenshot of Defender for Cloud's alerts page showing alerts for multi-cloud Kubernetes resources." lightbox="./media/defender-for-containers/sample-containers-plan-alerts.png":::

## Architecture overview

The architecture of the various elements involved in the full range of protections provided by Defender for Containers varies depending on where your Kubernetes clusters are hosted. 

Defender for Containers protects your clusters whether they're running in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications.

- **Amazon Elastic Kubernetes Service (EKS) in a connected Amazon Web Services (AWS) account** - Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

- **Google Kubernetes Engine (GKE) in a connected Google Cloud Platform (GCP) project** - Google’s managed environment for deploying, managing, and scaling applications using GCP infrastructure.

- **An unmanaged Kubernetes distribution** (using Azure Arc-enabled Kubernetes) - Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters hosted on-premises or on IaaS.

> [!NOTE]
> Defender for Containers' support for Arc-enabled Kubernetes clusters (AWS EKS, and GCP GKE) is a preview feature.

For high-level diagrams of each scenario, see the relevant tabs below. 

In the diagrams you'll see that the items received and analyzed by Defender for Cloud include:

- Audit logs and security events from the API server
- Cluster configuration information from the control plane
- Workload configuration from Azure Policy 
- Security signals and events from the node level

### [**Azure (AKS)**](#tab/defender-for-container-arch-aks)

### Architecture diagram of Defender for Cloud and AKS clusters<a name="jit-asc"></a>

When Defender for Cloud protects a cluster hosted in Azure Kubernetes Service, the collection of audit log data is agentless and frictionless.

The **Defender profile (preview)** deployed to each node provides the runtime protections and collects signals from nodes using [eBPF technology](https://ebpf.io/).

The **Azure Policy add-on for Kubernetes** collects cluster and workload configuration for admission control policies as explained in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).

> [!NOTE]
> Defender for Containers' **Defender profile** is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-aks-cluster.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, and Azure Policy." lightbox="./media/defender-for-containers/architecture-aks-cluster.png":::

#### Defender profile component details

| Pod Name | Namespace | Kind | Short Description | Capabilities | Resource limits | Egress Required |
|--|--|--|--|--|--|--|
| azuredefender-collector-ds-* | kube-system | [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) | A set of containers that focus on collecting inventory and security events from the Kubernetes environment. | SYS_ADMIN, <br>SYS_RESOURCE, <br>SYS_PTRACE | memory: 64Mi<br> <br> cpu: 60m | No |
| azuredefender-collector-misc-* | kube-system | [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) | A set of containers that focus on collecting inventory and security events from the Kubernetes environment that aren't bounded to a specific node. | N/A | memory: 64Mi <br> <br>cpu: 60m | No |
| azuredefender-publisher-ds-* | kube-system | [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) | Publish the collected data to Microsoft Defender for Containers' backend service where the data will be processed for and analyzed. | N/A | memory: 200Mi  <br> <br> cpu: 60m | Https 443 <br> <br> Learn more about the [outbound access prerequisites](../aks/limit-egress-traffic.md#microsoft-defender-for-containers) |

\* resource limits aren't configurable

### [**On-premises / IaaS (Arc)**](#tab/defender-for-container-arch-arc)

### Architecture diagram of Defender for Cloud and Arc-enabled Kubernetes clusters

For all clusters hosted outside of Azure, [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) is required to connect the clusters to Azure and provide Azure services such as Defender for Containers. 

With the cluster connected to Azure, an [Arc extension](../azure-arc/kubernetes/extensions.md) collects Kubernetes audit logs data from all control plane nodes in the cluster and sends them to the Microsoft Defender for Cloud backend in the cloud for further analysis. The extension is registered with a Log Analytics workspace used as a data pipeline, but the audit log data isn't stored in the Log Analytics workspace.

Workload configuration information is collected by an Azure Policy add-on. As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). Kubernetes admission controllers are plugins that enforce how your clusters are used. The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

> [!NOTE]
> Defender for Containers' support for Arc-enabled Kubernetes clusters is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-arc-cluster.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-arc-cluster.png":::



### [**AWS (EKS)**](#tab/defender-for-container-arch-eks)

### Architecture diagram of Defender for Cloud and EKS clusters

The following describes the components necessary in order to receive the full protection offered by Microsoft Defender for Cloud for Containers.

- **[Kubernetes audit logs](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)** – [AWS account’s CloudWatch](https://aws.amazon.com/cloudwatch/) enables, and collects audit log data through an agentless collector, and sends the collected information to the Microsoft Defender for Cloud backend for further analysis.

- **[Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)** - An agent based solution that connects your EKS clusters to Azure. Azure then is capable of providing services such as Defender, and Policy as [Arc extensions](../azure-arc/kubernetes/extensions.md).

- **The Defender extension** – The [DeamonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) that collects signals from hosts using [eBPF technology](https://ebpf.io/), and provides runtime protection. The extension is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace.

- **The Azure Policy extension** - The workload's configuration information is collected by the Azure Policy add-on. The Azure Policy add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). The extension registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. For more information, see [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

> [!NOTE]
> Defender for Containers' support for AWS EKS clusters is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-eks-cluster.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Amazon Web Services' EKS clusters, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-eks-cluster.png":::

### [**GCP (GKE)**](#tab/defender-for-container-gke)

### Architecture diagram of Defender for Cloud and GKE clusters<a name="jit-asc"></a>

The following describes the components necessary in order to receive the full protection offered by Microsoft Defender for Cloud for Containers.

- **[Kubernetes audit logs](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)** – [GCP Cloud Logging](https://cloud.google.com/logging/) enables, and collects audit log data through an agentless collector, and sends the collected information to the Microsoft Defender for Cloud backend for further analysis.

- **[Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)** - An agent based solution that connects your EKS clusters to Azure. Azure then is capable of providing services such as Defender, and Policy as [Arc extensions](../azure-arc/kubernetes/extensions.md).

- **The Defender extension** – The [DeamonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) that collects signals from hosts using [eBPF technology](https://ebpf.io/), and provides runtime protection. The extension is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace.

- **The Azure Policy extension** - The workload's configuration information is collected by the Azure Policy add-on. The Azure Policy add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). The extension registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. For more information, see [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

> [!NOTE]
> Defender for Containers' support for GCP GKE clusters is a preview feature. 

:::image type="content" source="./media/defender-for-containers/architecture-gke.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Google GKE clusters, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-gke.png":::

---

## FAQ - Defender for Containers

- [What are the options to enable the new plan at scale?](#what-are-the-options-to-enable-the-new-plan-at-scale)

### What are the options to enable the new plan at scale? 
We’ve rolled out a new policy in Azure Policy, **Configure Microsoft Defender for Containers to be enabled**, to make it easier to enable the new plan at scale. 

### Does Microsoft Defender for Containers support AKS clusters with virtual machines scale set (VMSS)?
Yes.

### Does Microsoft Defender for Containers support AKS without scale set (default) ?
No. Only Azure Kubernetes Service (AKS) clusters that use virtual machine scale sets for the nodes is supported. 

### Do I need to install the Log Analytics VM extension on my AKS nodes for security protection?
No, AKS is a managed service, and manipulation of the IaaS resources isn't supported. The Log Analytics VM extension is not needed and may result in additional charges.

## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. To enable the plan, see:

> [!div class="nextstepaction"]
> [Enable Defender for Containers](defender-for-containers-enable.md)
