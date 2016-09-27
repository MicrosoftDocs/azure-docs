<properties
	pageTitle="Before you deploy Azure Stack POC | Microsoft Azure"
	description="View the environment and hardware requirements for Azure Stack POC (service administrator)."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/29/2016"
	ms.author="erikje"/>

# Azure Stack deployment prerequisites

Before you deploy Azure Stack POC ([Proof of Concept](azure-stack-poc.md)), make sure your computer meets the following requirements.
These requirements apply to the Azure Stack POC only and might change for future releases.

You might also find it helpful to watch this deployment tutorial video:

[AZURE.VIDEO microsoft-azure-stack-tp1-poc-deployment-tutorial]

## Hardware

| Component | Minimum  | Recommended |
|---|---|---|
| Disk drives: Operating System | 1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) | 1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) |
| Disk drives: General Azure Stack POC Data | 4 disks. Each disk provides a minimum of 140 GB of capacity (SSD or HDD). All available disks will be used. | 4 disks. Each disk provides a minimum of 250 GB of capacity (SSD or HDD). All available disks will be used.|
| Compute: CPU | Dual-Socket: 12 Physical Cores (total)  | Dual-Socket: 16 Physical Cores (total) |
| Compute: Memory | 96 GB RAM  | 128 GB RAM |
| Compute: BIOS | Hyper-V Enabled (with SLAT support)  | Hyper-V Enabled (with SLAT support) |
| Network: NIC | Windows Server 2012 R2 Certification required for NIC; no specialized features required | Windows Server 2012 R2 Certification required for NIC; no specialized features required |
| HW logo certification | [Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0) |[Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0)|

You can use the [Deployment Checker for Azure Stack Technical Preview 1](https://gallery.technet.microsoft.com/Deployment-Checker-for-76d824e1) to confirm your requirements.

**Data disk drive configuration:** All data drives must be of the same type (all SAS or all SATA) and capacity. If SAS disk drives are used, the disk drives must be attached via a single path (no MPIO, multi-path support is provided).

**HBA configuration options**
 
- (Preferred) Simple HBA
- RAID HBA – Adapter must be configured in “pass through” mode
- RAID HBA – Disks should be configured as Single-Disk, RAID-0

**Supported bus and media type combinations**

-	SATA HDD

-	SAS HDD

-	RAID HDD

-	RAID SSD (If the media type is unspecified/unknown\*)

-	SATA SSD + SATA HDD

-	SAS SSD + SAS HDD

\* RAID controllers without pass-through capability can’t recognize the media type. Such controllers will mark both HDD and SSD as Unspecified. In that case, the SSD will be used as persistent storage instead of caching devices. Therefore, you can deploy the Microsoft Azure Stack POC on those SSDs.

**Example HBAs**: LSI 9207-8i, LSI-9300-8i, or LSI-9265-8i in pass-through mode

Sample OEM configurations are available.




## Operating system

| | **Requirements**  |
|---|---|
| **OS Version** | Windows Server 2016 Datacenter Edition **Technical Preview 4** with the latest important updates installed. A WindowsServer2016Datacenter.vhdx is included in the download package. You can boot into this VHDX, and then use as the base operating system for your Azure Stack POC deployment.|
| **Install Method** | Clean install. You can use the WindowsServer2016Datacenter.vhdx provided in the deployment package to quickly install the operating system on your Azure Stack POC machine. |
| **Domain joined?** | No. |


## Microsoft Azure Active Directory accounts

1. Create an Azure AD account that is the directory administrator for at least one Azure Active Directory. If you already have one, you can use that. Otherwise, you can create one for free at  [http://azure.microsoft.com/en-us/pricing/free-trial/](http://azure.microsoft.com/pricing/free-trial/) (in China, visit <http://go.microsoft.com/fwlink/?LinkID=717821> instead.)

    Save these credentials for use in step 6 of [Run the PowerShell deployment script](azure-stack-run-powershell-script.md#run-the-powershell-deployment-script). This *service administrator* account can configure and manage resource clouds, user accounts, tenant plans, quotas, and pricing. In the portal, they can create website clouds, virtual machine private clouds, create plans, and manage user subscriptions.

2. [Create](azure-stack-add-new-user-aad.md) at least one account so that you can sign in to the Azure Stack POC as a tenant.

    | **Azure Active Directory account**  | **Supported?** |
    |---|---| 
    | Organization ID with valid Public Azure Subscription  | Yes |
    | Microsoft Account with valid Public Azure Subscription  | Yes |
    | Organization ID with valid China Azure Subscription  | Yes |
    | Organization ID with valid US Government Azure Subscription  | No |

>[AZURE.NOTE] The Azure Stack POC supports Azure Active Directory authentication only.


## Network

### Switch

One available port on a switch for the POC machine.  

The Azure Stack POC machine supports connecting to a switch access port or trunk port. No specialized features are required on the switch. If you are using a trunk port or if you need to configure a VLAN ID, you have to provide the VLAN ID as a deployment parameter. For example:

	DeployAzureStack.ps1 –Verbose –PublicVLan 305

Specifying this parameter will set the VLAN ID for the host and NATVM only.

### Subnet

Do not connect the POC machine to the subnets 192.168.200.0/24, 192.168.100.0/24, or 192.168.133.0/24. These are reserved for the internal networks within the Microsoft Azure Stack POC environment.

### IPv4/IPv6

Only IPv4 is supported. You cannot create IPv6 networks.

### DHCP

Make sure there is a DHCP server available on the network that the NIC connects to. If DHCP is not available, you must prepare an additional static IPv4 network besides the one used by host. You must provide that IP address and gateway as a deployment parameter. For example:

	DeployAzureStack.ps1 -Verbose -NATVMStaticIP 10.10.10.10/24 -NATVMStaticGateway 10.10.10.1

### Internet access

Make sure the NIC can connect to the Internet. Both the host IP and the new IP assigned to the NATVM (by DHCP or static IP) must be able to access Internet. Ports 80 and 443 are used under the graph.windows.net and login.windows.net domains.

### Proxy

If a proxy is required in your environment, specify the proxy server address and port as a deployment parameter. For example:

	DeployAzureStack.ps1 -Verbose -ProxyServer 172.11.1.1:8080

Azure Stack POC does not support proxy authentication. 

### Telemetry

Port 443 (HTTPS) must be open for your network. The client endpoint is https://vortex-win.data.microsoft.com.


## Next steps

[Download the Azure Stack POC deployment package](https://azure.microsoft.com/overview/azure-stack/try/?v=try)

[Deploy Azure Stack POC](azure-stack-run-powershell-script.md)
