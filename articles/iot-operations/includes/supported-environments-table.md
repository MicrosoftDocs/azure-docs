---
author: dominicbetts
ms.author: dobett
ms.topic: include
ms.service: azure-iot-operations
ms.date: 07/15/2026
---

### Supported Windows environments

Microsoft supports the following Kubernetes distributions for Azure IoT Operations deployments on Windows. The table below details their support levels and the versions Microsoft uses to validate deployments:

| Kubernetes distribution           | Architecture         | Support level        | *Minimum validated version*                    |
|-----------------------------------|----------------------|----------------------|------------------------------------------------|
| [AKS Edge Essentials](/azure/aks/aksarc/aks-edge-system-requirements)      | x86_64               | General availability       | *AksEdge-K3s-1.33.5-1.12.269.0*                 |
| [AKS on Azure Local](/azure/aks/aksarc/aks-whats-new-local)                | x86_64               | General availability       | *Azure Stack HCI OS, Version 24H2, Build 2607* |

* The *minimum validated version* is the lowest version of the Kubernetes distribution that Microsoft uses to validate Azure IoT Operations deployments.

### Supported Linux environments

Microsoft supports the following Kubernetes distributions for Azure IoT Operations deployments in Linux environments. The table below lists their support levels and the versions Microsoft uses to validate deployments:

| Kubernetes distribution           | Architecture         | Support level        | *Minimum validated version*         | *Minimum validated OS*                |
|-----------------------------------|----------------------|----------------------|-------------------------------------|---------------------------------------|
| [K3s](https://www.rancher.com/products/k3s)               | x86_64, ARM64        | General availability | *1.33.6*                            | *Ubuntu 24.04* for ARM64 and x86_64, <br> Red Hat Enterprise Linux (RHEL) 9.x for x86_64 only                        |
| [vSphere Kubernetes Service (VKS)](https://www.vmware.com/products/cloud-infrastructure/vsphere-kubernetes-service)    | x86_64               | General availability | *v1.32.7---vmware.3-fips-vkr.1*                          | *VKS 3.3.x*        |
| [RKE2](https://docs.rke2.io/)                             | x86_64               | General availability | *v1.35.0+rke2r1*                   | [Operating systems](https://docs.rke2.io/install/requirements#operating-systems)    |
| [K3s on small form factor deployment of Azure Local (preview)](/azure/azure-local/small-form-factor/small-form-factor-container-orchestrators#k3s) | x86_64               | Preview       | *1.33.6*  | *Azure Local 2604* |

* The *minimum validated version* is the lowest version of the Kubernetes distribution that Microsoft uses to validate Azure IoT Operations deployments.
* The *minimum validated OS* is the lowest operating system version that Microsoft uses to validate deployments.
* ARM64 support for K3s on Ubuntu 24.04 is available starting with Azure IoT Operations 2607.
* Currently, support is available for VKS running in [privileged mode](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/organization-management/managing-vks-clusters-with-vks-cluster-management/vks-cluster-management-policies/pod-security-management.html) without WLIF.
