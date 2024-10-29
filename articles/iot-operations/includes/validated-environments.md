---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 08/02/2024
 ms.author: dobett
ms.custom:
  - include file
  - ignite-2023
---

Azure IoT Operations ships as a set of Azure Arc-enabled Kubernetes services and is intended for use with [CNCF](https://www.cncf.io/) conformant [Arc validated partner products](/azure/azure-arc/kubernetes/validation-program). Currently, Microsoft has validated Azure IoT Operations against the following fixed-set of infrastructures and environments:

| Environment | Version |
| ----------- | ------- |
| AKS-EE on Windows 11 IoT Enterprise <br> on a Lenovo ThinkStation P3 Tiny machine (16 core, 32 GB RAM) with single-node cluster | AksEdge-K3s-1.29.6-1.8.202.0 |
| K3S on Ubuntu 24.04 <br> on a Lenovo ThinkStation P3 Tiny machine (16 core, 32 GB RAM) with a 3-node cluster | K3s version 1.31.1 |

> [!IMPORTANT]
> The environments listed previously are production-like environments that Microsoft has validated. They're not the only environments that Azure IoT Operations can run on. Azure IoT Operations can run on any Arc-enabled Kubernetes cluster that meets the [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements). Currently Azure IoT Operations doesn't support ARM64 architectures.
