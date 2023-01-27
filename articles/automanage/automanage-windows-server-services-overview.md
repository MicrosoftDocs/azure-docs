---
title: Automanage for Windows Server 
description: Overview of Azure Automanage for Windows Server capabilities with Windows Server Azure Edition 
author: nwashburn-ms
ms.service: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 02/13/2022
ms.author: niwashbu 
---

# Azure Automanage for Windows Server

Azure Automanage for Windows Server brings new capabilities specifically to _Windows Server Azure Edition_.  These capabilities include:
- Hotpatch
- SMB over QUIC
- Extended network for Azure

<!--
> [!IMPORTANT]
> Hotpatch is currently in Public Preview. An opt-in procedure is needed to use the Hotpatch capability described below.
> This preview is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
-->

Automanage for Windows Server capabilities can be found in one or more of these _Windows Server Azure Edition_ images: 

- Windows Server 2022 Datacenter: Azure Edition (Desktop Experience)
- Windows Server 2022 Datacenter: Azure Edition (Core)

Capabilities vary by image, see [getting started](#getting-started-with-windows-server-azure-edition) for more detail.

## Automanage for Windows Server capabilities

### Hotpatch

Hotpatch is available on the following images:

- Windows Server 2022 Datacenter: Azure Edition (Core)

Hotpatch gives you the ability to apply security updates on your VM without rebooting.  Additionally, Automanage for Windows Server automates the onboarding, configuration, and orchestration of hot patching.  To learn more, see [Hotpatch](automanage-hotpatch.md).  

### SMB over QUIC

SMB over QUIC is available on the following images:

- Windows Server 2022 Datacenter: Azure Edition (Desktop experience)
- Windows Server 2022 Datacenter: Azure Edition (Core)

SMB over QUIC offers an "SMB VPN" for telecommuters, mobile device users, and branch offices, providing secure, reliable connectivity to edge file servers over untrusted networks like the Internet. [QUIC](https://datatracker.ietf.org/doc/rfc9000/) is an IETF-standardized protocol used in HTTP/3, designed for maximum data protection with TLS 1.3 and requires encryption that cannot be disabled. SMB behaves normally within the QUIC tunnel, meaning the user experience doesn't change. SMB features like multichannel, signing, compression, continuous availability, and directory leasing work normally. 

SMB over QUIC is also integrated with [Automanage machine best practices for Windows Server](automanage-windows-server.md) to help make SMB over QUIC management easier. QUIC uses certificates to provide its encryption and organizations often struggle to maintain complex public key infrastructures. Automanage machine best practices ensure that certificates do not expire without warning and that SMB over QUIC stays enabled for maximum continuity of service.

To learn more, see [SMB over QUIC](/windows-server/storage/file-server/smb-over-quic) and [SMB over QUIC management with Automanage machine best practices](automanage-smb-over-quic.md).
 

### Extended network for Azure

Extended Network for Azure is available on the following images:

- Windows Server 2022 Datacenter: Azure Edition (Desktop experience)
- Windows Server 2022 Datacenter: Azure Edition (Core)

Azure Extended Network enables you to stretch an on-premises subnet into Azure to let on-premises virtual machines keep their original on-premises private IP addresses when migrating to Azure. To learn more, see [Azure Extended Network](/windows-server/manage/windows-admin-center/azure/azure-extended-network).  


## Getting started with Windows Server Azure Edition

It's important to consider up front, which Automanage for Windows Server capabilities you would like to use, then choose a corresponding VM image that supports all of those capabilities.  Some of the _Windows Server Azure Edition_ images support only a subset of capabilities, see the table below for more details.

> [!NOTE]
> If you would like to preview the upcoming version of **Windows Server Azure Edition**, see [Windows Server VNext Datacenter: Azure Edition](windows-server-azure-edition-vnext.md).

### Deciding which image to use 

| Image                                                               | Capabilities                                        |
| ------------------------------------------------------------------- | --------------------------------------------------- |
| Windows Server 2022  Datacenter: Azure Edition (Desktop experience) | SMB over QUIC, Extended network for Azure           |
| Windows Server 2022 Datacenter: Azure Edition (Core)                | Hotpatch, SMB over QUIC, Extended network for Azure |

### Creating a VM

To start using Automanage for Windows Server capabilities on a new VM, use your preferred method to create an Azure VM, and select the _Windows Server Azure Edition_ image that corresponds to the set of [capabilities](#getting-started-with-windows-server-azure-edition) that you would like to use.  

<!--
> [!IMPORTANT]
> Some capabilities have specific configuration steps to perform during VM creation, and some capabilities that are in preview have specific opt-in and portal viewing requirements.  See the individual capability topics above to learn more about using that capability with your VM.
-->

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure Automanage](overview-about.md)