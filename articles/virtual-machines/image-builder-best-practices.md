---
title: Best practices
description: This article describes best practices to be followed while using Azure VM Image Builder.
author: sumit-kalra
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 03/25/2024
ms.reviewer: mattmcinnes
ms.subservice: image-builder
ms.custom: references_regions
---

# Azure VM Image Builder best practices

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article describes best practices to be followed while using Azure VM Image Builder (AIB).

- To prevent image templates from being accidentally deleted, use resource locks at the image template resource level. For more information, see [Protect your Azure resources with a lock](../azure-resource-manager/management/lock-resources.md).
- Make sure your image templates are set up for disaster recovery by following [reliability recommendation for AIB](../reliability/reliability-image-builder.md?toc=/azure/virtual-machines/toc.json&bc=/azure/virtual-machines/breadcrumb/toc.json).
- Set up AIB [triggers](image-builder-triggers-how-to.md) to automatically rebuild your images and keep them updated.
- Enable [VM Boot Optimization](vm-boot-optimization.md) in AIB to improve the create time for your VMs.
- Specify your own Build VM and ACI subnets for a tighter control over deployment of networking related resource by AIB in your subscription. Specifying these subnets also leads to faster image build times. See [template reference](./linux/image-builder-json.md#vnetconfig-optional) to learn more about specifying these options.
- Follow the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access) for your AIB resources.
  - **Image Template**: A principal that has access to your image template is able to run, delete, or tamper with it. Having this access, in turn, allows the principal to change the images created by that image template.
  - **Staging Resource Group**: AIB uses a staging resource group in your subscription to customize your VM image. You must consider this resource group as sensitive and restrict access to this resource group only to required principals. Since the process of customizing your image takes place in this resource group, a principal with access to the resource group is able to compromise the image building process - for example, by injecting malware into the image. AIB also delegates privileges associated with the Template identity and Build VM identity to resources in this resource group. Hence, a principal with access to the resource group is able to get access to these identities. Further, AIB maintains a copy of your customizer artifacts in this resource group. Hence, a principal with access to the resource group is able to inspect these copies.
  - **Template Identity**: A principal with access to your template identity is able to access all resources that the identity has permissions for. This includes your customizer artifacts (for example, shell and PowerShell scripts), your distribution targets (for example, an Azure Compute Gallery image version), and your Virtual Network. Hence, you must provide only the minimum required privileges to this identity.
  - **Build VM Identity**: A principal with access to your build VM identity is able to access all resources that the identity has permissions for. This includes any artifacts and Virtual Network that you might be using from within the Build VM using this identity. Hence, you must provide only the minimum required privileges to this identity.
- If you're distributing to Azure Compute Gallery (ACG), then also follow [best practices for ACG resources](azure-compute-gallery.md#best-practices).