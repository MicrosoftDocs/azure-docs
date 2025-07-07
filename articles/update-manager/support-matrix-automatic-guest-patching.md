---
title: Automatic Guest Patching for Azure Virtual Machines
description: Learn how to automatically patch your Azure Virtual Machines and Scale Sets using Azure Update Manager. This article provides an overview of supported OS images, configuration steps, and best practices for maintaining security compliance through automatic guest patching.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 03/07/2025
ms.topic: overview
# Customer intent: "As a cloud administrator, I want to enable automatic guest patching for Azure Virtual Machines, so that I can ensure they remain secure and compliant without manual intervention."
---
# Automatic guest patching for Azure virtual machines

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

By enabling automatic guest patching for your Azure Virtual Machines (VMs), you can automatically and securely patch your VMs to ensure they remain compliant with security standards."

## Supported OS images

Automatic VM guest patching, on-demand patch assessment and on-demand patch installation are supported only on VMs created from images with the exact combination of publisher, offer and sku from the below supported OS images list. Custom images or any other publisher, offer, sku combinations aren't supported. More images are added periodically. Don't see your SKU in the list? Request support by filing out [Image Support Request](https://forms.microsoft.com/r/6vfSgT0mFx).

If [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching) is enabled on a VM, then the available Critical and Security patches are downloaded and applied automatically on the VM.

>[!NOTE]
> Only x64 operating systems are currently supported. Neither ARM64 nor x86 are supported for any operating system.

## Customized images

For VMs created from customized images even if the Patch orchestration mode is set to `Azure Orchestrated/AutomaticByPlatform`, automatic VM guest patching doesn't work. We recommend that you use scheduled patching to patch the machines by defining your own schedules or install updates on-demand.

## Next steps

- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).