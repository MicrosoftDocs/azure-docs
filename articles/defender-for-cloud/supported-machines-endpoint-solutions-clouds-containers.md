---
title: Microsoft Defender for Containers feature availability
description: Learn about the availability of Microsoft Defender for Cloud containers features according to OS, machine type, and cloud deployment.
ms.topic: overview
ms.date: 03/27/2022
ms.custom: references_regions
---

# Defender for Containers feature availability

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

The **tabs** below show the features that are available, by environment, for Microsoft Defender for Containers.

## Supported features by environment 

### [**Azure (AKS)**](#tab/azure-aks)

| Domain | Feature | Supported Resources | Release state <sup>[1](#footnote1)</sup> | Windows support | Agentless/Agent-based | Pricing Tier | Azure clouds availability |
|--|--|--|--|--|--|--|--|
| Compliance | Docker CIS | VMs | GA | X | Log Analytics agent | Defender for Servers Plan 2 |  |
| Vulnerability Assessment | Registry scan | ACR, Private ACR | GA | ✓ (Preview) | Agentless | Defender for Containers  | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Vulnerability Assessment | View vulnerabilities for running images | AKS | Preview | X | Defender profile | Defender for Containers | Commercial clouds |
| Hardening | Control plane recommendations | ACR, AKS | GA | ✓ | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Hardening | Kubernetes data plane recommendations | AKS | GA | X | Azure Policy | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Runtime protection| Threat detection (control plane)| AKS | GA | ✓ | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Runtime protection| Threat detection (workload) | AKS | Preview | X | Defender profile | Defender for Containers | Commercial clouds |
| Discovery and provisioning | Discovery of unprotected clusters | AKS | GA | ✓ | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Discovery and provisioning | Collection of control plane threat data | AKS | GA | ✓ | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Discovery and provisioning | Auto provisioning of Defender profile | AKS | Preview | X | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |
| Discovery and provisioning | Auto provisioning of Azure policy add-on | AKS | GA | X | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure China 21Vianet |

<sup><a name="footnote1"></a>1</sup> Specific features are in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### [**AWS (EKS)**](#tab/aws-eks)

| Domain | Feature | Supported Resources | Release state <sup>[1](#footnote1)</sup> | Windows support | Agentless/Agent-based | Pricing tier |
|--|--| -- | -- | -- | -- | --| 
| Compliance | Docker CIS | EC2 | Preview | X | Log Analytics agent | Defender for Servers Plan 2 |
| Vulnerability Assessment | Registry scan | - | - | - | - | - |
| Vulnerability Assessment | View vulnerabilities for running images | - | - | - | - | - |
| Hardening | Control plane recommendations | - | - | - | - | - |
| Hardening | Kubernetes data plane recommendations | EKS | Preview | X | Azure Policy extension | Defender for Containers |
| Runtime protection| Threat detection (control plane)| EKS | Preview | ✓ | Agentless | Defender for Containers |
| Runtime protection| Threat detection (workload) | EKS | Preview | X | Defender extension | Defender for Containers |
| Discovery and provisioning | Discovery of unprotected clusters | EKS | Preview | X | Agentless | Free |
| Discovery and provisioning | Collection of control plane threat data | EKS | Preview | ✓ | Agentless | Defender for Containers |
| Discovery and provisioning | Auto provisioning of Defender extension | - | - | - | - | - |
| Discovery and provisioning | Auto provisioning of Azure policy extension | - | - | - | - | - |

<sup><a name="footnote1"></a>1</sup> Specific features are in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### [**GCP (GKE)**](#tab/gcp-gke)

| Domain | Feature | Supported Resources | Release state <sup>[1](#footnote1)</sup> | Windows support | Agentless/Agent-based | Pricing tier |
|--|--| -- | -- | -- | -- | --| 
| Compliance | Docker CIS | GCP VMs | Preview | X | Log Analytics agent | Defender for Servers Plan 2 |
| Vulnerability Assessment | Registry scan | - | - | - | - | - |
| Vulnerability Assessment | View vulnerabilities for running images | - | - | - | - | - |
| Hardening | Control plane recommendations | - | - | - | - | - |
| Hardening | Kubernetes data plane recommendations | GKE | Preview | X | Azure Policy extension | Defender for Containers |
| Runtime protection| Threat detection (control plane)| GKE | Preview | ✓ | Agentless | Defender for Containers |
| Runtime protection| Threat detection (workload) | GKE | Preview | X | Defender extension | Defender for Containers |
| Discovery and provisioning | Discovery of unprotected clusters | GKE | Preview | X | Agentless | Free |
| Discovery and provisioning | Collection of control plane threat data | GKE | Preview | ✓ | Agentless | Defender for Containers |
| Discovery and provisioning | Auto provisioning of Defender extension | GKE | Preview | X | Agentless | Defender for Containers |
| Discovery and provisioning | Auto provisioning of Azure policy extension | GKE | Preview | X | Agentless | Defender for Containers |

<sup><a name="footnote1"></a>1</sup> Specific features are in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### [**On-prem/IaaS (Arc)**](#tab/iaas-arc)

| Domain | Feature | Supported Resources | Release state <sup>[1](#footnote1)</sup> | Windows support | Agentless/Agent-based | Pricing tier |
|--|--| -- | -- | -- | -- | --| 
| Compliance | Docker CIS | Arc enabled VMs | Preview | X | Log Analytics agent | Defender for Servers Plan 2 |
| Vulnerability Assessment | Registry scan | ACR, Private ACR | Preview | ✓ (Preview) | Agentless | Defender for Containers |
| Vulnerability Assessment | View vulnerabilities for running images | Arc enabled K8s clusters | Preview | X | Defender extension | Defender for Containers |
| Hardening | Control plane recommendations | - | - | - | - | - |
| Hardening | Kubernetes data plane recommendations | Arc enabled K8s clusters | Preview | X | Azure Policy extension | Defender for Containers |
| Runtime protection| Threat detection (control plane)| Arc enabled K8s clusters | Preview | ✓ | Defender extension | Defender for Containers |
| Runtime protection| Threat detection (workload) | Arc enabled K8s clusters | Preview | X | Defender extension | Defender for Containers |
| Discovery and provisioning | Discovery of unprotected clusters | Arc enabled K8s clusters | Preview | X | Agentless | Free |
| Discovery and provisioning | Collection of control plane threat data | Arc enabled K8s clusters | Preview | ✓ | Defender extension | Defender for Containers |
| Discovery and provisioning | Auto provisioning of Defender extension | Arc enabled K8s clusters | Preview | ✓ | Agentless | Defender for Containers |
| Discovery and provisioning | Auto provisioning of Azure policy extension | Arc enabled K8s clusters | Preview | X | Agentless | Defender for Containers |

<sup><a name="footnote1"></a>1</sup> Specific features are in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

---

## Additional information

### Registries and images

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md) (Private registries requires access to Trusted Services) <br> • Windows images (Preview). This is free while it's in preview, and will incur charges (based on the Defender for Containers plan) when it becomes generally available.<br><br>**Unsupported**<br> • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> • Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md) |


### Kubernetes distributions and configurations

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br> • Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters<br>• [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md)<br> • [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)<br> • [Google Kubernetes Engine (GKE) Standard](https://cloud.google.com/kubernetes-engine/) <br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br>• [Azure Kubernetes Service on Azure Stack HCI](/azure-stack/aks-hci/overview)<br> • [Kubernetes](https://kubernetes.io/docs/home/)<br> • [AKS Engine](https://github.com/Azure/aks-engine)<br> • [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br> • [Red Hat OpenShift](https://www.openshift.com/learn/topics/kubernetes/) (version 4.6 or newer)<br> • [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid)<br> • [Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/)<br><br>**Unsupported**<br> • Azure Kubernetes Service (AKS) Clusters without [Kubernetes RBAC](../aks/concepts-identity.md#kubernetes-rbac)  <br>  |

<sup><a name="footnote1"></a>1</sup>Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.<br>
<sup><a name="footnote2"></a>2</sup>To get [Microsoft Defender for Containers](../azure-arc/kubernetes/overview.md) protection for you should onboard to [Azure Arc-enabled Kubernetes](https://mseng.visualstudio.com/TechnicalContent/_workitems/recentlyupdated/) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kuberenetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

## Next steps

- Learn how [Defender for Cloud collects data using the Log Analytics Agent](enable-data-collection.md).
- Learn how [Defender for Cloud manages and safeguards data](data-security.md).
- Review the [platforms that support Defender for Cloud](security-center-os-coverage.md).
