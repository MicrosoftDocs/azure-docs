---
title: What's new in Automanage for Windows Server (preview)
description: Learn about new Windows Server Azure Edition capabilities in Automanage for Windows Server
author: nwashburn-ms
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 06/23/2021
ms.author: niwashbu 
---

# What's new in Automanage for Windows Server

Automanage brings new capabilities specifically to Windows Server Azure Edition.  These capabilities include:
* Hotpatch
* SMB over QUIC
* Extended Network

Automanage for Windows Server capabilities can be found in one or more of these Windows Server Azure Edition images: 

* Windows Server 2019 Datacenter: Azure Edition (Core)
* Windows Server 2022 Datacenter: Azure Edition (Desktop Experience)
* Windows Server 2022 Datacenter: Azure Edition (Core)

Capabilities vary by image, see below for more detail.

## Automanage for Windows Server capabilities

These new capabilities are available for public preview:

### Hotpatch

Hotpatch is available in public preview on the following images:
* Windows Server 2019 Datacenter: Azure Edition (Core)
* Windows Server 2022 Datacenter: Azure Edition (Core)

Hotpatch gives you the ability to apply security updates on your VM without rebooting.  Additionally, Automanage for Windows Server automates the onboarding, configuration, and orchestration of Hotpatching.  To learn more about Hotpatch see the [detailed article](https://docs.microsoft.com/azure/automanage/automanage-hotpatch).  

### SMB over QUIC

SMB over QUIC is available in public preview on the following images:
* Windows Server 2022 Datacenter: Azure Edition (Desktop experience)
* Windows Server 2022 Datacenter: Azure Edition (Core)

SMB over QUIC enables users to files when working remotely without using a VPN.  SMB over QUIC has security like VPN for file shares without additional management overhead.  To learn more about SMB over QUIC see the [detailed article](https://aka.ms/smboverquic).  

### Extended Network

Azure Extended Network is available in public preview on the following images:
* Windows Server 2022 Datacenter: Azure Edition (Desktop experience)
* Windows Server 2022 Datacenter: Azure Edition (Core)

Azure Extended Network give the same network visibility to your VMs and workloads running in Azure as your servers running in your on-premises network by stretching the subnet. To learn more about Extended Network see the [detailed article](https://docs.microsoft.com/windows-server/manage/windows-admin-center/azure/azure-extended-network).  


## Getting started with Windows Server Azure Edition

Automanage for Windows Server capabilities and preview availability vary by image.

### Deciding which image to use 

|Image    |Capabilities | Preview state   |Regions   |On date    |
| -- |-- | -- | -- | -- |
| Windows Server 2019 Datacenter: Azure Edition (Core) | Hotpatch | Public preview | (all) | 3/12/21 |
| Windows Server 2022  Datacenter: Azure Edition (Desktop experience) | SMB over QUIC, Extended Network | Public preview in some regions | North Europe, South Central US, West Central US | 6/22/21 |
| Windows Server 2022 Datacenter: Azure Edition (Core) | Hotpatch, SMB over QUIC, Extended Network | Public preview to start | (all) | 7/8/21 |

### Creating a VM

To use Automanage for Windows Server capabilities on a new VM, follow these steps:
1.  Enable preview access (for Hotpatch)
    * To use Hotpatch, one-time preview access enablement is required per subscription.
    * Preview access can be enabled through API, PowerShell, or CLI as described in the following section.
    * Instructions on enabling preview access for Hotpatch can be found [here](https://docs.microsoft.com/azure/automanage/automanage-hotpatch#enabling-preview-access).
2.  Create a VM from the Azure portal
    * During the preview, you'll need to get started using [this link](https://aka.ms/AzureAutomanageHotPatch).
3.  Supply VM details
    * Ensure that the version of _Windows Server Azure Edition_ that corresponds to the feature you want to use (from the table above) is selected in the Image dropdown.
    * On the Management tab, scroll down to the ‘Guest OS updates’ section. You'll see Hotpatching set to On and Patch installation defaulted to Azure-orchestrated patching.
    * Automanage VM Best Practices will be enabled by default
4. Create your new VM.

