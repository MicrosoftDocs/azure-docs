<properties
	pageTitle="Deploy Azure Stack POC (service administrator)"
	description="Deploy Azure Stack POC (service administrator)"
	services="azure-stack" 
	documentationCenter=""
	authors="v-anpasi"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="v-anpasi"/>

# Deploy Azure Stack POC (service administrator)

The deployment process for Azure Stack POC has been simplified into a PowerShell script that you can run on a computer that fulfills the prerequisites below.

## Pre-deployment requirements

Before you begin deploying Azure Stack POC, make sure your environment complies with these requirements:

- Operating system requirements

- Networking requirements

- Microsoft Azure Active Directory requirements

- Hardware requirements

### Operating system requirements

| | **Requirements**  |
|---|---|
| **OS Version** | Windows Server 2016 Datacenter Edition Technical Preview 4 EN-US (Full Edition). |
| **Install Method** | Clean install. |
| **Domain joined?** | No. |
| **Time Zone** | **UTC-8** |

### Networking requirements

#### Switch requirements

One available port on a switch for the POC machine.  

The Azure Stack POC machine supports connecting to a switch access port. Connecting to a trunk port or VLAN ID are not supported. If your POC machine has multiple ports that are connected to a switch, make sure they're all configured as access ports instead of trunk ports. No specialized features are required on the switch.

#### Subnet requirements

Do not connect the POC machine to the subnets 192.168.200.0/24, 192.168.100.0/24, or 192.168.133.0/24. These are reserved for the internal networks within the Microsoft Azure Stack POC environment.

#### IPv4/IPv6 requirements

Only IPv4 is supported. You cannot create IPv6 networks.

#### DHCP requirements

Make sure there is a DHCP server available on the network that the NIC connects to. If DHCP is not available, you must prepare an additional static IPv4 network besides the one used by host. You must provide that IP address and password as a deployment parameter. For example:

	DeployAzureStack.ps1 -Verbose - -NATVMStaticIP 10.10.10.10/24 -NATVMStaticGateway 10.10.10.1

#### Internet access requirements

Make sure the NIC can connect to the Internet. Both the host IP and the new IP assigned to the NATVM (by DHCP or static IP) must be able to access Internet. Ports 80 and 443 are used under the graph.windows.net and login.windows.net domains.

#### Proxy requirements

If a proxy is required in your environment, specify the proxy server address and port as a deployment parameter. For example:

	DeployAzureStack.ps1 -Verbose -ProxyServer 172.11.1.1:8080

Azure Stack POC does not support proxy authentication. 

#### Telemetry requirements

Port 443 (HTTPS) must be open for your network. The client end-point is https://vortex-win.data.microsoft.com.

### Microsoft Azure Active Directory accounts requirements

To deploy Azure Stack POC, you must have a valid Microsoft Azure AD account that is the directory administrator for at least one Azure Active Directory. If you don’t have any existing Azure AD account, you can create one for free at [*http://azure.microsoft.com/en-us/pricing/free-trial/*](http://azure.microsoft.com/pricing/free-trial/) (in China, visit <http://go.microsoft.com/fwlink/?LinkID=717821> instead.)

This Azure AD account is used as the service administrator account for the environment. The service administrator can configure and manage resource clouds, user accounts, tenant plans, quotas, and pricing. In the portal, they can create website clouds, virtual machine private clouds, create plans, and manage user subscriptions.

Save these credentials for use in step 7 of the [Run the PowerShell script](azure-stack-run-powershell-script.md) section below. This will be the day 0 administrator.

You should also create at least one account so you can sign in to the Azure Stack POC as a tenant. Or add users from other AD accounts into your tenant accounts. See Appendix A for instructions on how to add a user in Azure Active Directory.

>[AZURE.NOTE] The Azure Stack POC supports Azure Active Directory authentication only.

| **Azure Active Directory account**  | **Supported?** |
|---|---|
| Organization ID with valid Public Azure Subscription  | Yes |
| Microsoft Account with valid Public Azure Subscription  | Yes |
| Organization ID with valid China Azure Subscription  | Yes |
| Organization ID with valid US Government Azure Subscription  | No |

### Hardware requirements

These requirements apply to the Azure Stack POC only and might change for future releases.

| Component | Minimum  | Recommended |
|---|---|---|
| Compute: CPU | Dual-Socket: 12 Physical Cores  | Dual-Socket: 16 Physical Cores |
| Compute: Memory | 96 GB RAM  | 128 GB RAM |
| Compute: BIOS | Hyper-V Enabled (with SLAT support)  | Hyper-V Enabled (with SLAT support) |
| Network: NIC | Windows Server 2012 R2 Certification required for NIC; no specialized features required | Windows Server 2012 R2 Certification required for NIC; no specialized features required |
| Disk drives: Operating System | 1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) | 1 OS disk with minimum of 200 GB available for system partition (SSD or HDD) |
| Disk drives: General Azure Stack POC Data | 4 disks. Each disk provides a minimum of 140 GB of capacity (SSD or HDD). | 4 disks. Each disk provides a minimum of 250 GB of capacity. |
| HW logo certification | [Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0) |[Certified for Windows Server 2012 R2](http://windowsservercatalog.com/results.aspx?&chtext=&cstext=&csttext=&chbtext=&bCatID=1333&cpID=0&avc=79&ava=0&avq=0&OR=1&PGS=25&ready=0)|

**Data disk drive configuration:** All data drives must be of the same type (SAS or SATA) and capacity. If SAS disk drives are used, the disk drives must be attached via a single path (no MPIO, multi-path support is provided)

**HBA configuration options:**
 1. (Preferred) Simple HBA
 2. RAID HBA – Adapter must be configured in “pass through” mode
 3. RAID HBA – Disks should be configured as Single-Disk, RAID-0

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
