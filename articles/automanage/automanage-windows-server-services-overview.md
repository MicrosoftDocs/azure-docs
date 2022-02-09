---
title: Automanage for Windows Server Services (preview)
description: Overview of Automanage for Windows Server Services and capabilities with Windows Server Azure Edition 
author: nwashburn-ms
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 07/09/2021
ms.author: niwashbu 
---

# Automanage for Windows Server Services (preview)

Automanage for Windows Server Services brings new capabilities specifically to _Windows Server Azure Edition_.  These capabilities include:
- Hotpatch
- SMB over QUIC
- Extended Network

> [!IMPORTANT]
> Automanage for Windows Server Services is currently in Public Preview. An opt-in procedure is needed to use the Hotpatch capability described below.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Hotpatch can be evaluated on _Windows Server 2022 Datacenter: Azure Edition (Core) Preview_.  Hotpatch on _Windows Server 2019 Datacenter: Azure Edition Preview_ is no longer available to evaluate.

Automanage for Windows Server capabilities can be found in one or more of these _Windows Server Azure Edition_ images: 

- Windows Server 2022 Datacenter: Azure Edition (Desktop Experience)
- Windows Server 2022 Datacenter: Azure Edition (Core)

Capabilities vary by image, see [getting started](#getting-started-with-windows-server-azure-edition) for more detail.

## Automanage for Windows Server capabilities

### Hotpatch

Hotpatch is available in public preview on the following images:

- Windows Server 2022 Datacenter: Azure Edition (Core)

Hotpatch gives you the ability to apply security updates on your VM without rebooting.  Additionally, Automanage for Windows Server automates the onboarding, configuration, and orchestration of Hotpatching.  To learn more, see [Hotpatch](automanage-hotpatch.md).  

### SMB over QUIC

SMB over QUIC is available in public preview on the following images:

- Windows Server 2022 Datacenter: Azure Edition (Desktop experience)
- Windows Server 2022 Datacenter: Azure Edition (Core)

SMB over QUIC enables users to access files when working remotely without a VPN, by tunneling SMB traffic over the QUIC protocol.  To learn more, see [SMB over QUIC](/windows-server/storage/file-server/smb-over-quic).  

### Azure Extended Network

Azure Extended Network is available in public preview on the following images:

- Windows Server 2022 Datacenter: Azure Edition (Desktop experience)
- Windows Server 2022 Datacenter: Azure Edition (Core)

Azure Extended Network enables you to stretch an on-premises subnet into Azure to let on-premises virtual machines keep their original on-premises private IP addresses when migrating to Azure. To learn more, see [Azure Extended Network](/windows-server/manage/windows-admin-center/azure/azure-extended-network).  


## Getting started with Windows Server Azure Edition

It's important to consider up front, which Automanage for Windows Server capabilities you would like to use, then choose a corresponding VM image that supports all of those capabilities.  Some of the _Windows Server Azure Edition_ images support only a subset of capabilities, see the table below for more details.

### Deciding which image to use 

|Image|Capabilities|
|--|--|
|Windows Server 2022  Datacenter: Azure Edition (Desktop experience) | SMB over QUIC, Extended Network | 
| Windows Server 2022 Datacenter: Azure Edition (Core) | Hotpatch, SMB over QUIC, Extended Network | 

### Creating a VM

To start using Automanage for Windows Server capabilities on a new VM, use your preferred method to create an Azure VM, and select the _Windows Server Azure Edition_ image that corresponds to the set of [capabilities](#getting-started-with-windows-server-azure-edition) that you would like to use.  Configuration of those capabilities may be needed during VM creation. You can learn more about VM configuration in the individual capability topics (such as [Hotpatch](automanage-hotpatch.md)).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Automanage](automanage-virtual-machines.md)