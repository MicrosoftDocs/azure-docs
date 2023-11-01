---
title: Isolated Image Builds for Azure VM Image Builder
description: Isolated Image Builds is achieved by transitioning core process of VM image customization/validation from shared infrastructure to dedicated Azure Container Instances resources in your subscription providing compute and network isolation. 
ms.date: 11/01/2023
ms.topic: sample
author: kof-f
ms.author: erd
ms.reviewer: erd
ms.service: virtual-machines
ms.subservice: image-builder

---

# What is Isolated Image Builds for Azure Image Builder?

Isolated Image Builds is a feature of Azure Image Builder (AIB). It transitions the core process of VM image customization/validation from shared infrastructure to dedicated Azure Container Instances (ACI) resources in your subscription, providing compute and network isolation.

## Advantages of Isolated Image Builds

Isolated Image Builds enable defense-in-depth by putting strict boundaries around access of your data outside your subscription and by limiting network access of your build VM to just your subscription. Isolated Image Builds also provide you with more transparency by allowing your inspection of the processing done by Image Builder to customize/validate your VM image. Further, Isolated Image Builds eases viewing of live build logs. Specifically:

1. **Compute Isolation:** Isolated Image Builds perform major portion of image building processing in Azure Container Instances resources in your subscription instead of on AIB's shared platform resources. ACI provides hypervisor isolation for each container group to ensure containers run in isolation without sharing a kernel.
2. **Network Isolation:**  Isolated Image Builds remove all direct network WinRM/ssh communication between your build VM and Image Builder service. 
3. **Transparency:** AIB is built on HashiCorp Packer. Isolated Image Builds executes Packer in the ACI in your subscription, which allows you to inspect the ACI resource and its containers.
4. **Better viewing of live logs:** AIB writes customization logs to a storage account in the staging resource group in your subscription. Isolated Image Builds provides with another way to follow the same logs directly in the Azure portal which can be done by navigating to Image Builder's container in the ACI resource.

## Backward Compatibility

This is a platform level change and doesn't affect AIB's interfaces. So, your existing Image Template and Trigger resources continue to function and there's no change in the way you'll deploy new resources of these types. Similarly, customization logs continue to be available in the storage account.

> [!NOTE]
> Image Builder is in the process of rolling this change out to all locations and customers. Some of these details might change as the process is fine-tuned based on service telemetry and feedback. Please refer to the [troubleshooting guide](azure/virtual-machines/linux/image-builder-troubleshoot#troubleshoot-build-failures) for more information.

## Next steps

- [Azure VM Image Builder overview](/azure/virtual-machines/image-builder-overview)
- [Getting started with Azure Container Instances](/azure/container-instances/container-instances-overview)
- [Securing your Azure resources](/azure/security/fundamentals/overview)
- [Troubleshooting guide for Azure VM Image Builder](/azure/virtual-machines/linux/image-builder-troubleshoot#troubleshoot-build-failures)
