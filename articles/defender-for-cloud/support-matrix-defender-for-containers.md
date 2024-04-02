---
title: Containers support matrix in Defender for Cloud
description: Review support requirements for container capabilities in Microsoft Defender for Cloud.
ms.topic: limits-and-quotas
author: dcurwin
ms.author: dacurwin
ms.date: 12/14/2023
ms.custom: references_regions
---

# Containers support matrix in Defender for Cloud

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article summarizes support information for Container capabilities in Microsoft Defender for Cloud.

> [!NOTE]
>
> - Specific features are in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - Only the versions of AKS, EKS and GKE supported by the cloud vendor are officially supported by Defender for Cloud.

> [!IMPORTANT]
> The Defender for Cloud Containers Vulnerability Assessment powered by Qualys is being retired. The retirement will be completed by March 6, and until that time partial results may still appear both in the Qualys recommendations, and Qualys results in the security graph. Any customers who were previously using this assessment should upgrade to to [Vulnerability assessments for Azure with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-azure.md). For information about transitioning to the container vulnerability assessment offering powered by Microsoft Defender Vulnerability Management, see [Transition from Qualys to Microsoft Defender Vulnerability Management](transition-to-defender-vulnerability-management.md).

## Azure

Following are the features for each of the domains in Defender for Containers:

### Security posture management

| Feature | Description | Supported resources | Linux release state | Windows release state   | Enablement method | Sensor | Plans | Azure clouds availability |
|--|--|--|--|--|--|--|--|--|
| [Agentless discovery for Kubernetes](defender-for-containers-introduction.md#security-posture-management) | Provides zero footprint, API-based discovery of Kubernetes clusters, their configurations and deployments. | AKS | GA | GA | Enable **Agentless discovery on Kubernetes** toggle | Agentless  | Defender for Containers **OR** Defender CSPM | Azure commercial clouds |
| Comprehensive inventory capabilities | Enables you to explore resources, pods, services, repositories, images, and configurations through [security explorer](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer) to easily monitor and manage your assets. | ACR, AKS | GA | GA | Enable **Agentless discovery on Kubernetes** toggle | Agentless| Defender for Containers **OR** Defender CSPM | Azure commercial clouds |
| Attack path analysis | A graph-based algorithm that scans the cloud security graph. The scans  expose exploitable paths that attackers might use to breach your  environment. | ACR, AKS | GA | - | Activated with plan | Agentless | Defender CSPM (requires Agentless discovery for Kubernetes to be enabled) | Azure commercial clouds |
| Enhanced risk-hunting | Enables security admins to actively hunt for posture issues in their containerized assets through queries (built-in and custom) and [security insights](attack-path-reference.md#insights) in the [security explorer](how-to-manage-cloud-security-explorer.md). | ACR, AKS | GA | - | Enable **Agentless discovery on Kubernetes** toggle | Agentless | Defender for Containers **OR** Defender CSPM | Azure commercial clouds |
| [Control plane hardening](defender-for-containers-architecture.md) | Continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations that are available on Defender for Cloud's Recommendations page. The recommendations let you investigate and remediate issues. | ACR, AKS | GA | Preview | Activated with plan | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| [Kubernetes data plane hardening](kubernetes-workload-protections.md) |Protect workloads of your Kubernetes containers with best practice recommendations. |AKS | GA | - | Enable **Azure Policy for Kubernetes** toggle | Azure Policy | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Docker CIS | Docker CIS benchmark | VM, Virtual Machine Scale Set | GA | - | Enabled with plan | Log Analytics agent | Defender for Servers Plan 2 | Commercial clouds<br><br> National clouds: Azure Government, Microsoft Azure operated by 21Vianet  |

### Vulnerability assessment

| Feature | Description | Supported resources | Linux release state | Windows release state   | Enablement method | Sensor | Plans | Azure clouds availability |
|--|--|--|--|--|--|--|--|--|
| Agentless registry scan (powered by Microsoft Defender Vulnerability Management) [supported packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management)| Vulnerability assessment for images in ACR | ACR, Private ACR | GA | Preview | Enable **Agentless container vulnerability assessment** toggle | Agentless | Defender for Containers or Defender CSPM | Commercial clouds<br/><br/> National clouds: Azure Government, Azure operated by 21Vianet |
| Agentless/agent-based runtime (powered by Microsoft Defender Vulnerability Management) [supported packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management)| Vulnerability assessment for running images in AKS | AKS | GA | Preview | Enable **Agentless container vulnerability assessment** toggle | Agentless (Requires Agentless discovery for Kubernetes) **OR/AND** Defender sensor | Defender for Containers or Defender CSPM | Commercial clouds<br/><br/> National clouds: Azure Government, Azure operated by 21Vianet |

### Runtime threat protection

| Feature | Description | Supported resources | Linux release state | Windows release state   | Enablement method | Sensor | Plans | Azure clouds availability |
|--|--|--|--|--|--|--|--|--|
| [Control plane](defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters) | Detection of suspicious activity for Kubernetes based on Kubernetes audit trail | AKS | GA | GA | Enabled with plan | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Workload | Detection of suspicious activity for Kubernetes for cluster level, node level, and workload level | AKS | GA | - | Enable **Defender Sensor in Azure** toggle **OR** deploy Defender sensors on individual clusters | Defender sensor | Defender for Containers | Commercial clouds<br /><br />National clouds: Azure Government, Azure China 21Vianet |

### Deployment & monitoring

| Feature | Description | Supported resources | Linux release state | Windows release state   | Enablement method | Sensor | Plans | Azure clouds availability |
|--|--|--|--|--|--|--|--|--|
| Discovery of unprotected clusters | Discovering Kubernetes clusters missing Defender sensors | AKS | GA | GA | Enabled with plan | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Defender sensor auto provisioning | Automatic deployment of Defender sensor | AKS | GA | - | Enable **Defender Sensor in Azure** toggle | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Azure Policy for Kubernetes auto provisioning | Automatic deployment of Azure policy sensor for Kubernetes | AKS | GA | - | Enable **Azure policy for Kubernetes** toggle | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |

### Registries and images support for Azure - Vulnerability assessment powered by Microsoft Defender Vulnerability Management

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • ACR registries <br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md) (Private registries requires access to Trusted Services) <br> • Container images in Docker V2 format <br> • Images with [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification <br> **Unsupported**<br>   • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> is currently unsupported <br> |
| Operating systems | **Supported** <br> • Alpine Linux 3.12-3.16 <br> • Red Hat Enterprise Linux 6-9 <br> • CentOS 6-9<br> • Oracle Linux 6-9 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap, openSUSE Tumbleweed <br> • SUSE Enterprise Linux 11-15 <br> • Debian GNU/Linux 7-12 <br> • Google Distroless (based on Debian GNU/Linux 7-12) <br> • Ubuntu 12.04-22.04 <br>  • Fedora 31-37<br> • Mariner 1-2<br> • Windows Server 2016, 2019, 2022|
| Language specific packages <br><br>  | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |

### Kubernetes distributions and configurations for Azure - Runtime threat protection

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br> • [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) with [Kubernetes RBAC](../aks/concepts-identity.md#kubernetes-rbac) <br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br> • [Azure Kubernetes Service hybrid](/azure/aks/hybrid/aks-hybrid-options-overview)<br> • [Kubernetes](https://kubernetes.io/docs/home/)<br> • [AKS Engine](https://github.com/Azure/aks-engine)<br> • [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br /> |

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested on Azure.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Private link restrictions

Defender for Containers relies on the [Defender sensor](defender-for-cloud-glossary.md#defender-sensor) for several features. The Defender sensor doesn't support the ability to ingest data through Private Link. You can disable public access for ingestion, so that only machines that are configured to send traffic through Azure Monitor Private Link can send data to that workstation. You can configure a private link by navigating to **`your workspace`** > **Network Isolation** and setting the Virtual networks access configurations to **No**.

:::image type="content" source="media/supported-machines-endpoint-solutions-cloud-containers/network-access.png" alt-text="Screenshot that shows where to go to turn off data ingestion.":::

Allowing data ingestion to occur only through Private Link Scope on your workspace Network Isolation settings, can result in communication failures and partial converge of the Defender for Containers feature set.

Learn how to [use Azure Private Link to connect networks to Azure Monitor](../azure-monitor/logs/private-link-security.md).

## AWS

| Domain | Feature | Supported Resources | Linux release state  | Windows release state   | Agentless/Sensor-based | Pricing tier |
|--|--| -- | -- | -- | -- | --|
| Security posture management  | [Agentless discovery for Kubernetes](defender-for-containers-introduction.md#security-posture-management) | EKS | Preview | Preview | Agentless  | Defender for Containers **OR** Defender CSPM |
| Security posture management  | Comprehensive inventory capabilities | ECR, EKS | Preview | Preview | Agentless| Defender for Containers **OR** Defender CSPM |
| Security posture management  | Attack path analysis | ECR, EKS | Preview | - | Agentless | Defender CSPM |
| Security posture management  | Enhanced risk-hunting | ECR, EKS | Preview | Preview | Agentless | Defender for Containers **OR** Defender CSPM |
| Security posture management | Docker CIS | EC2 | Preview | - | Log Analytics agent | Defender for Servers Plan 2 |
| Security posture management | Control plane hardening | - | - | - | - | - |
| Security posture management | Kubernetes data plane hardening | EKS | GA| - | Azure Policy for Kubernetes | Defender for Containers |
| [Vulnerability assessment](agentless-vulnerability-assessment-aws.md) | Agentless registry scan (powered by Microsoft Defender Vulnerability Management) [supported packages](#registries-and-images-support-for-aws---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management)| ECR | Preview | Preview | Agentless | Defender for Containers or Defender CSPM |
| [Vulnerability assessment](agentless-vulnerability-assessment-aws.md) | Agentless/sensor-based runtime (powered by Microsoft Defender Vulnerability Management) [supported packages](#registries-and-images-support-for-aws---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management)| EKS | Preview | Preview | Agentless **OR/AND** Defender sensor | Defender for Containers or Defender CSPM |
| Runtime protection| Control plane | EKS | Preview | Preview | Agentless | Defender for Containers |
| Runtime protection| Workload | EKS | Preview | - | Defender sensor | Defender for Containers |
| Deployment & monitoring | Discovery of unprotected clusters | EKS | Preview | - | Agentless | Free |
| Deployment & monitoring | Auto provisioning of Defender sensor | - | - | - | - | - |
| Deployment & monitoring | Auto provisioning of Azure Policy for Kubernetes | - | - | - | - | - |

### Registries and images support for AWS - Vulnerability assessment powered by Microsoft Defender Vulnerability Management

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • ECR registries <br> • Container images in Docker V2 format  <br> • Images with [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification <br>  **Unsupported**<br>   • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images is currently unsupported <br> • Public repositories <br> • Manifest lists <br>|
| Operating systems | **Supported** <br> • Alpine Linux 3.12-3.16 <br> • Red Hat Enterprise Linux 6-9 <br> • CentOS 6-9<br> • Oracle Linux 6-9 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap, openSUSE Tumbleweed <br> • SUSE Enterprise Linux 11-15 <br> • Debian GNU/Linux 7-12 <br> • Google Distroless (based on Debian GNU/Linux 7-12)<br> • Ubuntu 12.04-22.04 <br>  • Fedora 31-37<br> • Mariner 1-2<br> • Windows server 2016, 2019, 2022|
| Language specific packages <br><br>  | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |

### Kubernetes distributions/configurations support for AWS - Runtime threat protection

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br>•  [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)<br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br> • [Kubernetes](https://kubernetes.io/docs/home/)<br />**Unsupported**<br /> • EKS private clusters |

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Outbound proxy support - AWS

Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## GCP

| Domain | Feature | Supported Resources | Linux release state  | Windows release state  | Agentless/Sensor-based | Pricing tier |
|--|--| -- | -- | -- | -- | --|
| Security posture management  | [Agentless discovery for Kubernetes](defender-for-containers-introduction.md#security-posture-management) | GKE | Preview | Preview | Agentless  | Defender for Containers **OR** Defender CSPM |
| Security posture management  | Comprehensive inventory capabilities | GAR, GCR, GKE | Preview | Preview | Agentless| Defender for Containers **OR** Defender CSPM |
| Security posture management  | Attack path analysis | GAR, GCR, GKE | Preview | - | Agentless | Defender CSPM |
| Security posture management  | Enhanced risk-hunting | GAR, GCR, GKE | Preview | Preview | Agentless | Defender for Containers **OR** Defender CSPM |
| Security posture management | Docker CIS | GCP VMs | Preview | - | Log Analytics agent | Defender for Servers Plan 2 |
| Security posture management | Control plane hardening | GKE | GA | GA | Agentless | Free |
| Security posture management | Kubernetes data plane hardening | GKE | GA| - | Azure Policy for Kubernetes | Defender for Containers |
| [Vulnerability assessment](agentless-vulnerability-assessment-gcp.md) | Agentless registry scan (powered by Microsoft Defender Vulnerability Management) [supported packages](#registries-and-images-support-for-gcp---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management)| GAR, GCR | Preview | Preview | Agentless | Defender for Containers or Defender CSPM |
| [Vulnerability assessment](agentless-vulnerability-assessment-gcp.md) | Agentless/sensor-based runtime (powered by Microsoft Defender Vulnerability Management) [supported packages](#registries-and-images-support-for-gcp---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management)| GKE | Preview | Preview | Agentless **OR/AND** Defender sensor | Defender for Containers or Defender CSPM |
| Runtime protection| Control plane | GKE | Preview | Preview | Agentless | Defender for Containers |
| Runtime protection| Workload | GKE | Preview | - | Defender sensor | Defender for Containers |
| Deployment & monitoring | Discovery of unprotected clusters | GKE | Preview | - | Agentless | Free |
| Deployment & monitoring | Auto provisioning of Defender sensor | GKE | Preview | - | Agentless | Defender for Containers |
| Deployment & monitoring | Auto provisioning of Azure Policy for Kubernetes | GKE | Preview | - | Agentless | Defender for Containers |

### Registries and images support for GCP - Vulnerability assessment powered by Microsoft Defender Vulnerability Management

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • Google Registries (GAR, GCR) <br> • Container images in Docker V2 format  <br> • Images with [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification <br> **Unsupported**<br> • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images is currently unsupported <br> • Public repositories <br> • Manifest lists <br>|
| Operating systems | **Supported** <br> • Alpine Linux 3.12-3.16 <br> • Red Hat Enterprise Linux 6-9 <br> • CentOS 6-9<br> • Oracle Linux 6-9 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap, openSUSE Tumbleweed <br> • SUSE Enterprise Linux 11-15 <br> • Debian GNU/Linux 7-12 <br> • Google Distroless (based on Debian GNU/Linux 7-12)<br> • Ubuntu 12.04-22.04 <br>  • Fedora 31-37<br> • Mariner 1-2<br> • Windows server 2016, 2019, 2022|
| Language specific packages <br><br>  | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |

### Kubernetes distributions/configurations support for GCP - Runtime threat protection

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br>  • [Google Kubernetes Engine (GKE) Standard](https://cloud.google.com/kubernetes-engine/) <br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br> • [Kubernetes](https://kubernetes.io/docs/home/)<br><br />**Unsupported**<br /> • Private network clusters<br /> • GKE autopilot<br /> • GKE AuthorizedNetworksConfig |

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Outbound proxy support - GCP

Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## On-premises, Arc-enabled Kubernetes clusters

| Domain | Feature | Supported Resources | Linux release state  | Windows release state   | Agentless/Sensor-based | Pricing tier |
|--|--| -- | -- | -- | -- | --|
| Security posture management | Docker CIS | Arc enabled VMs | Preview | - | Log Analytics agent | Defender for Servers Plan 2 |
| Security posture management | Control plane hardening | - | - | - | - | - |
| Security posture management | Kubernetes data plane hardening | Arc enabled K8s clusters | GA| - | Azure Policy for Kubernetes | Defender for Containers |
| Runtime protection| Threat protection (control plane)| Arc enabled K8s clusters | Preview | Preview | Defender sensor | Defender for Containers |
| Runtime protection | Threat protection (workload)| Arc enabled K8s clusters | Preview | - | Defender sensor | Defender for Containers |
| Deployment & monitoring | Discovery of unprotected clusters | Arc enabled K8s clusters | Preview | - | Agentless | Free |
| Deployment & monitoring | Auto provisioning of Defender sensor | Arc enabled K8s clusters | Preview | Preview | Agentless | Defender for Containers |
| Deployment & monitoring | Auto provisioning of Azure Policy for Kubernetes | Arc enabled K8s clusters | Preview | - | Agentless | Defender for Containers |

### Kubernetes distributions and configurations

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br>• [Azure Kubernetes Service hybrid](/azure/aks/hybrid/aks-hybrid-options-overview)<br> • [Kubernetes](https://kubernetes.io/docs/home/)<br> • [AKS Engine](https://github.com/Azure/aks-engine)<br> • [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br> • [Red Hat OpenShift](https://www.openshift.com/learn/topics/kubernetes/) (version 4.6 or newer)<br> • [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid)<br> • [Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/)<br> |

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Supported host operating systems

Defender for Containers relies on the **Defender sensor** for several features. The Defender sensor is supported on the following host operating systems:

- Amazon Linux 2
- CentOS 8
- Debian 10
- Debian 11
- Google Container-Optimized OS
- Mariner 1.0
- Mariner 2.0
- Red Hat Enterprise Linux 8
- Ubuntu 16.04
- Ubuntu 18.04
- Ubuntu 20.04
- Ubuntu 22.04

Ensure your Kubernetes node is running on one of the verified supported operating systems. Clusters with different host operating systems, only get partial coverage.

### Defender sensor limitations

The Defender sensor in AKS V1.28 and below is not supported on ARM64 nodes.

### Network restrictions

#### Private link

Defender for Containers relies on the Defender sensor for several features. The Defender sensor doesn't support the ability to ingest data through Private Link. You can disable public access for ingestion, so that only machines that are configured to send traffic through Azure Monitor Private Link can send data to that workstation. You can configure a private link by navigating to **`your workspace`** > **Network Isolation** and setting the Virtual networks access configurations to **No**.

:::image type="content" source="media/supported-machines-endpoint-solutions-cloud-containers/network-access.png" alt-text="Screenshot that shows where to go to turn off data ingestion.":::

Allowing data ingestion to occur only through Private Link Scope on your workspace Network Isolation settings, can result in communication failures and partial converge of the Defender for Containers feature set.

Learn how to [use Azure Private Link to connect networks to Azure Monitor](../azure-monitor/logs/private-link-security.md).

#### Outbound proxy support

Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## Next steps

- Learn how [Defender for Cloud collects data using the Log Analytics Agent](monitoring-components.md).
- Learn how [Defender for Cloud manages and safeguards data](data-security.md).
- Review the [platforms that support Defender for Cloud](security-center-os-coverage.md).
