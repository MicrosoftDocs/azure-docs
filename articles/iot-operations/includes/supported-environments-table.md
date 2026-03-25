---
author: dominicbetts
ms.author: dobett
ms.topic: include
ms.service: iot-operations
ms.date: 06/20/2025
---

### Supported Windows environments

Microsoft supports the following Kubernetes distributions for Azure IoT Operations deployments on Windows. The table below details their support levels and the versions Microsoft uses to validate deployments:

| Kubernetes distribution           | Architecture         | Support level        | *Minimum validated version*                    |
|-----------------------------------|----------------------|----------------------|------------------------------------------------|
| [AKS Edge Essentials](/azure/aks/aksarc/aks-edge-system-requirements)               | x86_64               | Public preview       | *AksEdge-K3s-1.30.6-1.11.247.0*                 |
| [AKS on Azure Local](/azure/aks/aksarc/aks-whats-new-local)                | x86_64               | Public preview       | *Azure Stack HCI OS, version 23H2, build 2411* |

* The *minimum validated version* is the lowest version of the Kubernetes distribution that Microsoft uses to validate Azure IoT Operations deployments.

### Supported Linux environments

Microsoft supports the following Kubernetes distributions for Azure IoT Operations deployments in Linux environments. The table below lists their support levels and the versions Microsoft uses to validate deployments:

| Kubernetes distribution           | Architecture         | Support level        | *Minimum validated version*         | *Minimum validated OS*                |
|-----------------------------------|----------------------|----------------------|-------------------------------------|---------------------------------------|
| [K3s](https://www.rancher.com/products/k3s)                             | x86_64               | General availability | *1.33.6*                            | *Ubuntu 24.04*, <br> Red Hat Enterprise Linux (RHEL) 9.x                        |
| [vSphere Kubernetes Service (VKS)](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vsphere-supervisor-services-and-standalone-components/latest/release-notes/vmware-tanzu-kubernetes-grid-service-release-notes.html)    | x86_64               | General availability | *1.32.7*                           | *VKS*         |

* The *minimum validated version* is the lowest version of the Kubernetes distribution that Microsoft uses to validate Azure IoT Operations deployments.
* The *minimum validated OS* is the lowest operating system version that Microsoft uses to validate deployments.
