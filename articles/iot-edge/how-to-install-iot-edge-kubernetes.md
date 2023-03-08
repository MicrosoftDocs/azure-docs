---
title: How to install IoT Edge on Kubernetes | Microsoft Docs 
description: Learn on how to install IoT Edge on Kubernetes using a local development cluster environment
author: PatAltimore

ms.author: patricka
ms.reviewer: veyalla
ms.date: 12/09/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# How to install IoT Edge on Kubernetes

IoT Edge can be installed on Kubernetes by using [KubeVirt](https://www.cncf.io/projects/kubevirt/) technology. KubeVirt is an open source, Cloud Native Computing Foundation (CNCF) project that offers a Kubernetes virtualization API and runtime to define and manage virtual machines. 

## Architecture

:::image type="content" source="./media/how-to-install-iot-edge-kubernetes/iotedge-kubevirt.png" alt-text="Screenshot showing I o T Edge on Kubernetes with KubeVirt." lightbox="./media/how-to-install-iot-edge-kubernetes/iotedge-kubevirt.png":::

| Note | Description |
|-|-|
|  1 | Install KubeVirt Custom Resource Definitions (CRDs) into the Kubernetes cluster. Like the Kubernetes cluster, management and updates to KubeVirt components are outside the purview of IoT Edge. |
|  2️ | A KubeVirt `VirtualMachine` custom resource is used to define a Virtual Machine with required resources and base operating system. A running *instance* of this resource is created in a Kubernetes Pod using [KVM](https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine) and [QEMU](https://wiki.qemu.org/Main_Page) technologies. If your Kubernetes node itself is a Virtual Machine, you'll need to enable Nested Virtualization to use KubeVirt.|
|  3️ | The environment inside the QEMU container is just like an OS environment. IoT Edge and its dependencies (like the Docker container engine) can be setup using standard installation instructions or a [cloud-init](https://github.com/Azure-Samples/IoT-Edge-K8s-KubeVirt-Deployment/blob/12e3192b66aa9b49157c8ee9f6b832b322659f2f/deployment/helm/templates/_helper.tpl#L31) script. |

## Sample
A functional sample for running IoT Edge on Azure Kubernetes Service (AKS) using KubeVirt is available at [https://aka.ms/iotedge-kubevirt](https://aka.ms/iotedge-kubevirt). 

> [!NOTE]
> Based on feedback, the prior translation-based preview of IoT Edge integration with Kubernetes has been discontinued and will not be made generally available. An exception being Azure Stack Edge devices where translation-based Kubernetes integration will be supported until IoT Edge v1.1 is maintained (Dec 2022).
