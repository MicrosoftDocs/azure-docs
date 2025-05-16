---
title: How to install IoT Edge on Kubernetes
description: Learn on how to install IoT Edge on Kubernetes using a local development cluster environment
author: PatAltimore

ms.author: patricka
ms.date: 05/08/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
---

# How to install IoT Edge on Kubernetes

You can install IoT Edge on Kubernetes using [KubeVirt](https://www.cncf.io/projects/kubevirt/) technology. KubeVirt is an open-source project from the Cloud Native Computing Foundation (CNCF) that provides a Kubernetes virtualization API and runtime to define and manage virtual machines. 

## Architecture

:::image type="content" source="./media/how-to-install-iot-edge-kubernetes/iotedge-kubevirt.png" alt-text="Screenshot showing IoT Edge on Kubernetes with KubeVirt." lightbox="./media/how-to-install-iot-edge-kubernetes/iotedge-kubevirt.png":::

| Note | Description |
|-|-|
|  1 | Install KubeVirt custom resource definitions (CRDs) into the Kubernetes cluster. Like the Kubernetes cluster, management and updates to KubeVirt components are outside the purview of IoT Edge. |
|  2️ | A KubeVirt `VirtualMachine` custom resource defines a virtual machine with required resources and a base operating system. A running *instance* of this resource is created in a Kubernetes pod using [KVM](https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine) and [QEMU](https://wiki.qemu.org/Main_Page) technologies. If your Kubernetes node is itself a virtual machine, you need to enable nested virtualization to use KubeVirt.|
|  3️ | The environment inside the QEMU container is like an OS environment. IoT Edge and its dependencies (like the Docker container engine) can be set up using standard installation instructions or a [cloud-init](https://github.com/Azure-Samples/IoT-Edge-K8s-KubeVirt-Deployment/blob/12e3192b66aa9b49157c8ee9f6b832b322659f2f/deployment/helm/templates/_helper.tpl#L31) script. |

## Sample
A functional sample for running IoT Edge on Azure Kubernetes Service (AKS) with KubeVirt is available at [https://aka.ms/iotedge-kubevirt](https://aka.ms/iotedge-kubevirt). 
