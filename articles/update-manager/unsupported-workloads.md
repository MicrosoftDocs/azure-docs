---
title: Unsupported Workloads for Azure Update Manager
description: Learn about the workloads that are not supported by Azure Update Manager.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 02/26/2025
ms.topic: overview
---

# Unsupported workloads for Azure Update Manager

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

## Overview 

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).


The following table lists the workloads that aren't supported.

   | **Workloads**| **Notes**
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](/mem/intune/) to manage updates.|
   | Virtual Machine Scale Sets| We recommend that you use [Automatic upgrades](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade) to patch the Virtual Machine Scale Sets.|
   | Azure Kubernetes Service nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).|


## Next steps

- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).