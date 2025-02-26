---
title: Unsupported Workloads for Azure Update Manager
description: Learn about the workloads that are not supported by Azure Update Manager.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/26/2025
ms.topic: overview
---

# Unsupported workloads

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

## Overview 

This article provides an overview of unsupported operating systems and custom VM images, along with recommendations for alternative update management solutions.

Unsupported workloads include operating systems like Windows 10 and 11, which are best managed with Microsoft Intune, as well as custom VM images that might not have the necessary agent installed to receive updates


The following table lists the workloads that aren't supported.

   | **Workloads**| **Notes**
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](/mem/intune/) to manage updates.|
   | Virtual Machine Scale Sets| We recommend that you use [Automatic upgrades](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade) to patch the Virtual Machine Scale Sets.|
   | Azure Kubernetes Service nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).|

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).

## Next steps

- [Supported regions](supported-regions.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)