---
title: Isolated Image Builds for Azure VM Image Builder
description: Isolated Image Builds is achieved by transitioning core process of VM image customization/validation from shared infrastructure to dedicated Azure Container Instances resources in your subscription providing compute and network isolation. 
ms.date: 11/10/2023
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

Isolated Image Builds enable defense-in-depth by limiting network access of your build VM to just your subscription. Isolated Image Builds also provide you with more transparency by allowing your inspection of the processing done by Image Builder to customize/validate your VM image. Further, Isolated Image Builds eases viewing of live build logs. Specifically:

1. **Compute Isolation:** Isolated Image Builds perform major portion of image building processing in Azure Container Instances resources in your subscription instead of on AIB's shared platform resources. ACI provides hypervisor isolation for each container group to ensure containers run in isolation without sharing a kernel.
2. **Network Isolation:**  Isolated Image Builds remove all direct network WinRM/ssh communication between your build VM and Image Builder service. 
    - If you are provisioning an Image Builder template without your own Virtual Network, then a Public IP Address resource will no more be provisioned in your staging resource group at image build time.
    - If you are provisioning an Image Builder template with an existing Virtual Network in your subscription, then a Private Link based communication channel will no more be set up between your Build VM and AIB's backend platform resources. Instead, the communication channel is set up between the Azure Container Instance and the Build VM resources - both of which reside in the staging resource group in your subscription.
3. **Transparency:** AIB is built on HashiCorp [Packer](https://www.packer.io/). Isolated Image Builds executes Packer in the ACI in your subscription, which allows you to inspect the ACI resource and its containers. Similarly, having the entire network communication pipeline in your subscription allows you to inspect all the network resources, their settings, and their allowances.
4. **Better viewing of live logs:** AIB writes customization logs to a storage account in the staging resource group in your subscription. Isolated Image Builds provides with another way to follow the same logs directly in the Azure portal, which can be done by navigating to Image Builder's container in the ACI resource.

## Backward compatibility

This is a platform level change and doesn't affect AIB's interfaces. So, your existing Image Template and Trigger resources continue to function and there's no change in the way you deploy new resources of these types. Similarly, customization logs continue to be available in the storage account.

You might observe a few new resources temporarily appear in the staging resource group (for example, Azure Container Instance, and Private Endpoint) while some other resource will no longer appear (for example, Public IP Address). As earlier, these temporary resources exist only during the build and will be deleted by Image Builder thereafter.

Your image builds will automatically be migrated to Isolated Image Builds and you need to take no action to opt in.

> [!NOTE]
> Image Builder is in the process of rolling this change out to all locations and customers. Some of these details might change as the process is fine-tuned based on service telemetry and feedback. Please refer to the [troubleshooting guide](./linux/image-builder-troubleshoot.md#troubleshoot-build-failures) for more information.

> [!IMPORTANT] 
> Make sure your subscription is registered for `Microsoft.ContainerInstance provider`: 
> - Azure CLI: `az provider register -n Microsoft.ContainerInstance`
> - PowerShell: `Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerInstance`


## Next steps

- [Azure VM Image Builder overview](./image-builder-overview.md)
- [Getting started with Azure Container Instances](../container-instances/container-instances-overview.md)
- [Securing your Azure resources](../security/fundamentals/overview.md)
- [Troubleshooting guide for Azure VM Image Builder](./linux/image-builder-troubleshoot.md#troubleshoot-build-failures)
