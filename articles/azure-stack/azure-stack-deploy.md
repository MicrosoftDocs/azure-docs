---
title: Before you deploy Azure Stack Development Kit | Microsoft Docs
description: View the environment and hardware requirements for Azure Stack Development Kit (service administrator).
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 32a21d9b-ee42-417d-8e54-98a7f90f7311
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/10/2017
ms.author: erikje

---
# Azure Stack deployment prerequisites
Before you deploy Azure Stack [Development Kit](azure-stack-poc.md), make sure your computer meets the following requirements.
You can use the same hardware that you used for the previous single-box preview.

## Hardware
| Component | Minimum | Recommended |
| --- | --- | --- |
| Disk drives: Operating System |1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) |1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) |
| Disk drives: General development kit data* |4 disks. Each disk provides a minimum of 140 GB of capacity (SSD or HDD). All available disks will be used. |4 disks. Each disk provides a minimum of 250 GB of capacity (SSD or HDD). All available disks will be used. |
| Compute: CPU |Dual-Socket: 12 Physical Cores (total) |Dual-Socket: 16 Physical Cores (total) |
| Compute: Memory |96 GB RAM |128 GB RAM (This is the minimum to support PaaS resource providers.)|
| Compute: BIOS |Hyper-V Enabled (with SLAT support) |Hyper-V Enabled (with SLAT support) |
| Network: NIC |Windows Server 2012 R2 Certification required for NIC; no specialized features required |Windows Server 2012 R2 Certification required for NIC; no specialized features required |
| HW logo certification |[Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0) |[Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0) |

\*You will need more than this recommended capacity if you plan on adding many of the [marketplace items](azure-stack-download-azure-marketplace-item.md) from Azure.

**Data disk drive configuration:** All data drives must be of the same type (all SAS or all SATA) and capacity. If SAS disk drives are used, the disk drives must be attached via a single path (no MPIO, multi-path support is provided).

**HBA configuration options**

* (Preferred) Simple HBA
* RAID HBA – Adapter must be configured in “pass through” mode
* RAID HBA – Disks should be configured as Single-Disk, RAID-0

**Supported bus and media type combinations**

* SATA HDD
* SAS HDD
* RAID HDD
* RAID SSD (If the media type is unspecified/unknown\*)
* SATA SSD + SATA HDD
* SAS SSD + SAS HDD

\* RAID controllers without pass-through capability can’t recognize the media type. Such controllers will mark both HDD and SSD as Unspecified. In that case, the SSD will be used as persistent storage instead of caching devices. Therefore, you can deploy the development kit on those SSDs.

**Example HBAs**: LSI 9207-8i, LSI-9300-8i, or LSI-9265-8i in pass-through mode

Sample OEM configurations are available.

## Operating system
|  | **Requirements** |
| --- | --- |
| **OS Version** |Windows Server 2012 R2 or later. The operating system version isn’t critical before the deployment starts, as you'll boot the host computer into the VHD that's included in the Azure Stack installation. The OS and all required patches are already integrated into the image. Don’t use any keys to activate any Windows Server instances used in the development kit. |

## Deployment requirements check tool
After installing the operating system, you can use the [Deployment Checker for Azure Stack](https://gallery.technet.microsoft.com/Deployment-Checker-for-50e0f51b) to confirm that your hardware meets all the requirements.

## Account requirements
Typically, you deploy the development kit with internet connectivity, where you can connect to Microsoft Azure. In this case, you must configure an Azure Active Directory (Azure AD) account to deploy the development kit.

If your environment is not connected to the internet, or you don't want to use Azure AD, you can deploy Azure Stack by using Active Directory Federation Services (AD FS). The development kit includes its own AD FS and Active Directory Domain Services instances. If you deploy by using this option, you don't have to set up accounts ahead of time.

>[!NOTE]
If you deploy by using the AD FS option, you must redeploy Azure Stack to switch to Azure AD.

### Azure Active Directory accounts
To deploy Azure Stack by using an Azure AD account, you must prepare an Azure AD account before you run the deployment PowerShell script. This account becomes the Global Admin for the Azure AD tenant. It's used to provision and delegate applications and service principals for all Azure Stack services that interact with Azure Active Directory and Graph API. It's also used as the owner of the default provider subscription (which you can later change). You can log in to your Azure Stack system’s administrator portal by using this account.

1. Create an Azure AD account that is the directory administrator for at least one Azure AD. If you already have one, you can use that. Otherwise, you can create one for free at [http://azure.microsoft.com/en-us/pricing/free-trial/](http://azure.microsoft.com/pricing/free-trial/) (in China, visit <http://go.microsoft.com/fwlink/?LinkID=717821> instead.)
   
    Save these credentials for use in step 6 of [Deploy the development kit](azure-stack-run-powershell-script.md#deploy-the-development-kit). This *service administrator* account can configure and manage resource clouds, user accounts, tenant plans, quotas, and pricing. In the portal, they can create website clouds, virtual machine private clouds, create plans, and manage user subscriptions.
2. [Create](azure-stack-add-new-user-aad.md) at least one account so that you can sign in to the development kit as a tenant.
   
   | **Azure Active Directory account** | **Supported?** |
   | --- | --- |
   | Work or school account with valid Public Azure Subscription |Yes |
   | Microsoft Account with valid Public Azure Subscription |No |
   | Work or school account with valid China Azure Subscription |Yes |
   | Work or school account with valid US Government Azure Subscription |Yes |

## Network
### Switch
One available port on a switch for the development kit machine.  

The development kit machine supports connecting to a switch access port or trunk port. No specialized features are required on the switch. If you are using a trunk port or if you need to configure a VLAN ID, you have to provide the VLAN ID as a deployment parameter. You can see examples in the [list of deployment parameters](azure-stack-run-powershell-script.md).

### Subnet
Do not connect the development kit machine to the following subnets:

* 192.168.200.0/24
* 192.168.100.0/27
* 192.168.101.0/26
* 192.168.102.0/24
* 192.168.103.0/25
* 192.168.104.0/25

These subnets are reserved for the internal networks within the development kit environment.

### IPv4/IPv6
Only IPv4 is supported. You cannot create IPv6 networks.

### DHCP
Make sure there is a DHCP server available on the network that the NIC connects to. If DHCP is not available, you must prepare an additional static IPv4 network besides the one used by host. You must provide that IP address and gateway as a deployment parameter. You can see examples in the [list of deployment parameters](azure-stack-run-powershell-script.md).

### Internet access
Azure Stack requires access to the Internet, either directly or through a transparent proxy. Azure Stack does not support the configuration of a web proxy to enable Internet access. Both the host IP and the new IP assigned to the MAS-BGPNAT01 (by DHCP or static IP) must be able to access Internet. Ports 80 and 443 are used under the graph.windows.net and login.windows.net domains.

### Telemetry
To support telemetry data flow, port 443 (HTTPS) must be open in your network. The client endpoint is https://vortex-win.data.microsoft.com.

## Next steps
[Download the Azure Stack development kit deployment package](https://azure.microsoft.com/overview/azure-stack/try/?v=try)

[Deploy Azure Stack development kit](azure-stack-run-powershell-script.md)

