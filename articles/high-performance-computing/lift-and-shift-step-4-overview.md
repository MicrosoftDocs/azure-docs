---
title: "Deployment step 4: compute nodes - overview"
description: Learn about production-level environment migration deployment step four.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 4: compute nodes - overview

Managing compute nodes in an HPC cloud environment involves careful consideration of virtual machine (VM) types, images, and quota limits. Testing key on-premises workloads in the cloud helps assess the cost-benefit of different VM SKUs, allowing for more informed hardware decisions over time. Azure provides preconfigured HPC images for Ubuntu and Alma Linux, which include necessary drivers and libraries, simplifying the deployment process. Custom images can also be created using available resources from the Azure HPC image repository. Additionally, it’s important to plan resource usage carefully and consult with Azure to avoid quota limitations, especially when scaling across multiple regions.

This section provides guidance on selecting and managing compute resources efficiently for HPC workloads in the cloud.

## Virtual machine (VM) types (SKUs)

We recommend you test a few key on-premises workloads in the cloud to develop an understanding of cost-benefit for different SKUS. In the cloud, the hardware options allow decisions to be refined over time.

## VM images

Azure offers HPC images for ubuntu and alma linux, containing various drivers, libraries, and some HPC-related configurations. We recommended that you use these images as much as possible. However, if custom images are required, one can see from the Azure HPC images GitHub repository how these images were built, and use the scripts there.

## Quota

If large amounts of resources are required, it's beneficial to have a proper planning and discussion with Azure team to minimize chances of reaching quota limits. Depending on the case, it can be beneficial to explore multiple regions whenever possible.

For details check the description of the following component:

- [VM images](lift-and-shift-step-4-vm-images.md)

Here we describe each component. Each section includes:

- An overview description of what the component is
- What the requirements for the component are (that is, what do we need from the component)
- Tools and services available
- Best practices for the component in the context of HPC lift & shift
- An example of a quick start setup

The goal of the quick start is to have a sense on how to start using the component. As the HPC cloud deployment matures, one is expected to automate the usage of the component, by using, for instance, Infrastructure as Software tools such as Terraform or Bicep.
