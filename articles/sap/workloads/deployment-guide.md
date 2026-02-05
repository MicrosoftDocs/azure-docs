---
title: Azure Virtual Machines deployment for SAP NetWeaver | Microsoft Docs
description: Learn how to deploy SAP software on Linux virtual machines in Azure.
services: virtual-machines-linux,virtual-machines-windows
author: MSSedusch
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.custom: linux-related-content
ms.topic: article
ms.date: 02/04/2026
ms.author: bentrin
# Customer intent: "As an IT administrator, I want to deploy SAP NetWeaver on Azure virtual machines, so that I can leverage cloud resources for improved reliability and integration with my existing on-premises infrastructure."
---
# Azure Virtual Machines deployment for SAP NetWeaver

## Overview

**Purpose**: Deploy SAP NetWeaver-based applications on Azure Virtual Machines  
**Scope**: VM deployment, configuration, and troubleshooting for SAP workloads  
**Target Audience**: IT administrators deploying SAP on Azure  
**Prerequisites**: Planning phase must be completed first - see [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)

Azure Virtual Machines enables organizations to deploy SAP applications with minimal procurement cycles while extending reliability and availability. This guide covers deployment steps, alternate deployment options, and troubleshooting for SAP applications on Azure VMs.

## Key Terminology

- **SAP NetWeaver**: SAP's technology platform for building and integrating SAP applications
- **SAPS**: SAP Application Performance Standard - unit of measurement for SAP system performance
- **CTS**: SAP Correction and Transport System - manages software changes
- **VM Agent**: Azure Virtual Machine Agent - provides VM management capabilities
- **DBMS**: Database Management System
- **Cross-premises**: Hybrid deployment connecting on-premises and Azure resources

## Prerequisites Matrix

### Environment Prerequisites

| Component | Requirement | Details |
|-----------|-------------|---------|
| **Local Management Computer** | Windows 10+ OR Linux with Azure CLI | For VM management via PowerShell/Azure CLI |
| **Internet Connectivity** | Required | For tool downloads, VM Agent, and Azure Extension for SAP |
| **Azure Subscription** | Active Azure account | Required for all Azure resources |
| **Network Planning** | Completed topology design | Virtual networks must be configured before deployment |

### SAP Sizing Requirements

**Input Requirements**:
- Projected SAP workload (use SAP Quick Sizer tool)
- SAPS number requirements
- CPU resource and memory consumption estimates
- Required I/O operations per second
- Network bandwidth requirements (VM-to-VM and on-premises connectivity)

### Azure Architecture Definition

**Must Be Defined Before Deployment**:
- Azure Managed Disks selection
- Virtual network and subnet configuration
- Resource group assignment
- Azure region selection
- Azure Availability Zones (if applicable)
- SAP configuration tier (two-tier or three-tier)
- VM sizes and additional data disk requirements
- SAP CTS configuration

## SAP Resource Requirements

### Critical SAP Notes by Category

**VM Sizing and Support**:
- **SAP Note 1928533**: Azure VM sizes, capacity info, supported SAP software/OS/database combinations, required SAP kernel versions

**Deployment Prerequisites**:
- **SAP Note 2015553**: Prerequisites for SAP-supported deployments in Azure

**Monitoring and Agents**:
- **SAP Note 2178632**: Monitoring metrics for SAP in Azure
- **SAP Note 1409604**: SAP Host Agent version for Windows
- **SAP Note 2191498**: SAP Host Agent version for Linux
- **SAP Note 1999351**: Azure Extension for SAP troubleshooting

**Operating System Specific**:
- **SAP Note 2243692**: SAP licensing on Linux
- **SAP Note 2578899**: SUSE Linux Enterprise Server 15 information
- **SAP Note 3108316**: Red Hat Enterprise Linux 9.x information
- **SAP Note 3399081**: Oracle Linux 9.x information
- **SAP Note 1597355**: Linux swap-space information

### Additional Resources

**SAP Community Resources**:
- [SAP on Azure SCN page](https://wiki.scn.sap.com/wiki/x/Pia7Gg): News and resources
- [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes): Required SAP Notes for Linux

**Azure Tools Integration**:
- [Azure PowerShell][azure-ps]: SAP-specific PowerShell cmdlets
- [Azure CLI][azure-cli]: SAP-specific Azure CLI commands

## Deployment Scenarios

### Scenario Decision Matrix

| Scenario       | Source | Use Case | VM Agent Status | Complexity |
|----------------|--------|----------|----------------|------------|
| **Scenario 1** | Azure Marketplace | Standard OS deployment | Auto-installed | Low |
| **Scenario 2** | Custom/Generalized Image | Standardized deployments | Auto-installed | Medium |
| **Scenario 3** | Non-generalized VHD | Lift-and-shift migration | Manual installation | High |

### Scenario 1: Azure Marketplace Deployment

**Context**: Deploy VM using Microsoft or third-party images from Azure Marketplace  
**Image Types**: Windows Server, Linux distributions, DBMS-included images (e.g., SQL Server)  
**VM Agent**: Automatically installed  
**DBMS Reference**: [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide]

#### Implementation Methods

**Method 1: Azure Portal Deployment**

**Process Flow**:
1. Navigate to Azure portal → Create Resource → Virtual Machine
2. Select OS type (Windows Server 2025+, SLES 15+, RHEL 9.4+, Oracle Linux 9.x+)
3. Configure deployment model (Resource Manager)
4. Complete wizard-guided configuration

**Key Configuration Areas**:

**Basic Configuration**:
- VM name and resource identification
- VM disk type (Premium Storage recommended for both OS and data disks)
- Authentication (username/password for Windows, SSH public key for Linux)
- Subscription and resource group assignment
- Location selection (must align with virtual network location)

**Size Configuration**:
- **Requirement**: Must support Premium Storage for optimal performance
- **Reference**: SAP Note 1928533 for supported VM types
- **Additional Info**: [Azure storage for SAP workloads](./planning-guide-storage.md)

**Settings Configuration**:
```
Storage:
├── Disk Type: Premium Storage (recommended)
├── Managed Disks: Yes (recommended)
└── Storage Account: Select existing or create new

Network:
├── Virtual Network: Connect to existing network for hybrid connectivity
├── Subnet: Select appropriate subnet
├── Public IP: Configure as needed
└── Network Security Group: Configure traffic rules

Extensions:
├── Installation: Not required during initial deployment
└── SAP Extensions: Install post-deployment (see post-deployment steps)

High Availability:
├── Options: Virtual Machine Scale Set, Availability Zone, or Availability Set
├── Recommendation: Azure Availability Zones in VM Scale Sets
└── Reference: [Deployment options](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload)

Monitoring:
├── Boot Diagnostics: Can be disabled
└── Guest OS Diagnostics: Can be disabled
```

**Method 2: Template-Based Deployment**

**Template Repository**: [Azure Quickstart Templates][azure-quickstart-templates-github]

**Available Templates**:

**Two-Tier Configuration**:
- [Standard VM template][sap-templates-2-tier-marketplace-image]: Single VM deployment
- [Managed Disks template][sap-templates-2-tier-marketplace-image-md]: Single VM with Managed Disks

**Three-Tier Configuration**:
- [Multi-VM template][sap-templates-3-tier-marketplace-image]: Multiple VM deployment
- [Managed Disks multi-VM template][sap-templates-3-tier-marketplace-image-md]: Multiple VMs with Managed Disks

**Template Parameters**:

**Basic Parameters**:
- Subscription and resource group selection
- Location (uses existing resource group location if selected)

**SAP-Specific Parameters**:
- **SAP System ID (SID)**: Unique identifier for SAP system
- **OS Type**: Windows or Linux selection
- **SAP System Size**: SAPS number (consult SAP Technology Partner if unknown)
- **System Availability** (three-tier only): Standard or HA configuration

**Storage Parameters**:
- **Storage Type**: Premium Storage/Premium Storage v2 recommended for larger systems
- **References**: 
  - [SAP DBMS Premium SSD usage][2367194]
  - [RDBMS Storage structure](./dbms-guide-general.md#65fa79d6-a85f-47ee-890b-22e794f51a64)
  - [Premium Storage guide][storage-premium-storage-portal]
  - [Azure Storage introduction][storage-introduction]

**Network Parameters**:
- **Subnet Configuration**: New or existing subnet selection
- **Subnet ID Format**: `/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Network/virtualNetworks/<vnet-name>/subnets/<subnet-name>`

#### Post-Deployment Configuration Steps

**Step 1: Proxy Configuration** *(if required)*
- **Condition**: Cross-premises connectivity via VPN or ExpressRoute
- **Purpose**: Enable internet access for VM extensions and SAP Host agent
- **Reference**: [Configure the proxy][deployment-guide-configure-proxy]

**Step 2: Domain Integration** *(Windows only)*
- **Condition**: Cross-premises Active Directory/DNS integration
- **Process**: Join VM to on-premises domain
- **Reference**: [Join VM to domain][deployment-guide-4.3]

**Step 3: Azure Extension for SAP Configuration**
- **Purpose**: Enable SAP support for Azure environment
- **Process**: Install and configure Azure Extension for SAP
- **Reference**: [Configure Azure Extension for SAP][deployment-guide-4.5]

**Step 4: SAP Software Installation**
- **Approach**: Follow same guidelines as on-premises installation
- **Media Storage Options**:
  - Azure VHDs or Managed Disks
  - Azure VM as file server
  - Cross-premises installation shares

### Scenario 2: Custom Image Deployment

**Context**: Deploy VM using custom OS/DBMS VM image for standardized deployments  
**Use Case**: Organizations with specific patch requirements or standardized configurations  
**Image Preparation**: Different processes for Linux vs. Windows

#### Image Preparation Requirements

**Windows Image Preparation**:
- **Tool**: [sysprep](/previous-versions/windows/it-pro/windows-8.1-and-8/hh825084(v=win.10))
- **Purpose**: Abstract Windows settings (SID, hostname) for redeployment

**Linux Image Preparation**:
- **Tool**: `waagent -deprovision`
- **Purpose**: Abstract Linux settings for multiple VM deployment
- **References**: 
  - [Linux VM capture][virtual-machines-linux-capture-image]
  - [Azure Linux agent guide][virtual-machines-linux-agent-user-guide-command-line-options]

#### Database Content Strategy

**Options for Database Setup**:
1. **SAP Software Provisioning Manager**: Install new SAP system with database backup restore
2. **Direct Azure Storage Restore**: Restore database backup directly from Azure storage (if DBMS supports)
3. **System Rename Procedure**: Adapt existing on-premises SAP system using SAP Software Provisioning Manager (SAP Note [1619720])

#### Implementation Methods

**Method 1: Azure Portal with Managed Disk Image**

**Prerequisites**: 
- Managed Disk image available
- **Reference**: [Capture managed image](/azure/virtual-machines/windows/capture-image-resource)

**Process**:
1. Navigate to Azure portal → Images
2. Select Managed Disk image → Create VM
3. Follow configuration wizard (same parameters as Scenario 1)

**Method 2: Template Deployment**

**Available Templates**:
- [Two-tier user image][sap-templates-2-tier-user-image]: Single VM deployment
- [Two-tier Managed Disk image][sap-templates-2-tier-user-image-md]: Single VM with Managed Disks
- [Three-tier user image][sap-templates-3-tier-user-image]: Multi-VM deployment
- [Three-tier Managed Disk image][sap-templates-3-tier-user-image-md]: Multi-VM with Managed Disks

**Additional Template Parameters**:
- **User Image VHD URI** (unmanaged disk template): Private OS image location
- **User Image Storage Account** (unmanaged disk template): Storage account for private OS image
- **userImageId** (managed disk template): Managed Disk image identifier

#### Post-Deployment Requirements

**VM Agent Installation** *(Linux only)*:
- **Requirement**: VM Agent must be pre-installed in user image
- **Failure Condition**: Template deployment fails without VM Agent
- **Reference**: [Download, install, and enable Azure VM Agent][deployment-guide-4.4]

**Additional Configuration Steps**: Same as Scenario 1 (proxy, domain join, Azure Extension for SAP)

### Scenario 3: Non-Generalized VHD Migration

**Context**: Move specific SAP system from on-premises to Azure using non-generalized VHD  
**Use Case**: Lift-and-shift migration maintaining existing configuration  
**Key Characteristic**: Preserves hostname, SAP SID, and user accounts  
**VM Agent Status**: Manual installation required

#### Migration Process

**Data Migration**:
- Upload VHD with OS, SAP binaries, and DBMS binaries
- Upload VHDs with data and log files
- **Planning Reference**: [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]

**Template Deployment Options**:
- [Two-tier OS disk template][sap-templates-2-tier-os-disk]: Single VM deployment
- [Two-tier Managed Disk template][sap-templates-2-tier-os-disk-md]: Single VM with Managed Disk

**Template Parameters**:
- **OS Disk VHD URI** (unmanaged disk): Private OS disk location
- **OS Disk Managed Disk ID** (managed disk): Managed Disk OS disk identifier
- Format: `/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Compute/disks/<disk-name>`

#### Manual Installation Requirements

**VM Agent Installation**:
- **Requirement**: Must be installed on OS disk before deployment
- **Alternative**: Install after deployment if not using templates
- **Reference**: [Download, install, and enable Azure VM Agent][deployment-guide-4.4]

**Post-Deployment Steps**: Same as previous scenarios (domain join, proxy, Azure Extension for SAP)

## Detailed Configuration Tasks

### Domain Integration (Windows Only)

**Applicability**: Cross-premises scenarios with Active Directory/DNS extension to Azure  
**Requirements**: Additional software installation (anti-malware, backup, monitoring)

**Proxy Configuration Considerations**:
- **Scope**: Windows Local System Account (S-1-5-18)
- **Method**: Domain Group Policy (recommended for consistent application)

### VM Agent Management

#### Automatic Installation Scenarios
- **Azure Marketplace deployments**: VM Agent pre-installed
- **Generalized custom images**: VM Agent included in image preparation

#### Manual Installation Scenarios
- **Non-generalized images**: Requires manual installation
- **Migration scenarios**: Install during or after migration

#### Installation Process

**Windows Installation**:
1. Download [Azure VM Agent installer](https://go.microsoft.com/fwlink/?LinkId=394789)
2. Connect via RDP to deployed VM
3. Transfer and execute MSI installer
4. **Proxy Configuration**: Ensure Local System account (S-1-5-18) has correct proxy settings

**Linux Installation**:

**SUSE Linux Enterprise Server**:
```bash
sudo zypper install WALinuxAgent
```

**Red Hat Enterprise Linux/Oracle Linux**:
```bash
sudo yum install WALinuxAgent
```

**Agent Updates**: Automatic updates (no VM restart required)

#### Update Process
- **Linux Agent Updates**: [Update Azure Linux Agent][virtual-machines-linux-update-agent]

### Proxy Configuration

#### Windows Proxy Setup

**Configuration Scope**: Local System account  
**Alternative Method**: Group Policy configuration

**Manual Configuration Process**:
1. Start → gpedit.msc
2. Navigate: Computer Configuration → Administrative Templates → Windows Components → Internet Explorer
3. Verify: "Make proxy settings per-machine" is disabled/not configured
4. Control Panel → Network and Sharing Center → Internet Options
5. Connections tab → LAN settings
6. Configure proxy settings
7. **Required Exception**: Add IP address 168.63.129.16

#### Linux Proxy Setup

**Configuration File**: `/etc/waagent.conf`

**Required Parameters**:
```bash
HttpProxy.Host=<proxy host>          # Example: proxy.corp.local
HttpProxy.Port=<proxy port>          # Example: 80
```

**Service Restart**:
```bash
sudo service waagent restart
```

**Azure Repository Access**:
- Ensure repository traffic bypasses on-premises intranet
- Configure user-defined routes for direct internet access
- Avoid routing through site-to-site VPN

#### Repository-Specific Configuration

**SUSE Linux Enterprise Server**:
- Add routes for IP addresses in `/etc/regionserverclnt.cfg`

**Red Hat Enterprise Linux**:
- Add routes for IP addresses in `/etc/yum.repos.d/rhui-load-balancers`

**Oracle Linux**:
- Configure custom repositories or use public repositories

**VM Extension for SAP**: Must also have internet access for proper operation

### Azure Extension for SAP

**Support Channel**: SAP Support (not Microsoft)  
**Installation Timing**: After VM preparation completion  
**Availability**: Global Azure datacenters  
**Purpose**: Enable SAP support validation for Azure environment

**Installation Reference**: [Configure the Azure Extension for SAP][deployment-guide-4.5]

## Reference Links

### SAP Notes Reference Links
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1597355]:https://launchpad.support.sap.com/#/notes/1597355
[1619720]:https://launchpad.support.sap.com/#/notes/1619720
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2069760]:https://launchpad.support.sap.com/#/notes/2069760
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[2367194]:https://launchpad.support.sap.com/#/notes/2367194

### Azure Documentation Links
[azure-cli]:/cli/azure/install-classic-cli
[azure-ps]:/powershell/azure/
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[deployment-guide-3.3]:deployment-guide.md#54a1fc6d-24fd-4feb-9c57-ac588a55dff2
[deployment-guide-3]:deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e
[deployment-guide-4.3]:deployment-guide.md#31d9ecd6-b136-4c73-b61e-da4a29bbc9cc
[deployment-guide-4.4]:deployment-guide.md#c7cbb0dc-52a4-49db-8e03-83e7edc2927d
[deployment-guide-4.5]:vm-extension-for-sap.md
[deployment-guide-configure-proxy]:deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d
[planning-guide]:planning-guide.md
[resource-group-overview]:/azure/azure-resource-manager/management/overview
[storage-introduction]:/azure/storage/common/storage-introduction
[storage-premium-storage-portal]:/azure/virtual-machines/disks-types
[virtual-machines-windows-agent-user-guide]:/azure/virtual-machines/extensions/agent-windows
[virtual-machines-linux-agent-user-guide]:/azure/virtual-machines/extensions/agent-linux
[virtual-machines-linux-agent-user-guide-command-line-options]:/azure/virtual-machines/extensions/agent-linux#command-line-options
[virtual-machines-linux-capture-image]:/azure/virtual-machines/linux/capture-image
[virtual-machines-linux-tutorial]:/azure/virtual-machines/linux/quick-create-cli
[virtual-machines-linux-update-agent]:/azure/virtual-machines/linux/update-agent
[virtual-machines-ps-create-preconfigure-windows-resource-manager-vms]:/azure/virtual-machines/windows/quick-create-powershell
[virtual-machines-upload-image-windows-resource-manager]:/azure/virtual-machines/windows/upload-image
[virtual-machines-windows-tutorial]:/azure/virtual-machines/windows/quick-create-portal
[virtual-networks-nsg]:../../virtual-network/security-overview.md
[virtual-networks-udr-overview]:../../virtual-network/virtual-networks-udr-overview.md

Setting up an Azure virtual machine for SAP software deployment involves multiple steps and resources. Before you start, make sure that you meet the prerequisites for installing SAP software on virtual machines in Azure.

### Local computer

To manage Windows or Linux VMs, you can use a PowerShell script and the Azure portal. For both tools, you need a local computer running Windows 7 or a later version of Windows. If you want to manage only Linux VMs and you want to use a Linux computer for this task, you can use Azure CLI.

### Internet connection

To download and run the tools and scripts that are required for SAP software deployment, you must be connected to the Internet. The Azure VM that is running the Azure Extension for SAP also needs access to the Internet. If the Azure VM is part of an Azure virtual network or on-premises domain, make sure that the relevant proxy settings are set, as described in [Configure the proxy][deployment-guide-configure-proxy].

### Microsoft Azure subscription

You need an active Azure account.

### Topology and networking

You need to define the topology and architecture of the SAP deployment in Azure:

* Azure storage accounts to be used
* Virtual network where you want to deploy the SAP system
* Resource group to which you want to deploy the SAP system
* Azure region where you want to deploy the SAP system
* SAP configuration (two-tier or three-tier)
* VM sizes and the number of additional data disks to be mounted to the VMs
* SAP Correction and Transport System (CTS) configuration

Create and configure Azure storage accounts (if necessary) or Azure virtual networks before you begin the SAP software deployment process. For information about how to create and configure these resources, see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].

### SAP sizing

Know the following information, for SAP sizing:

* Projected SAP workload, for example, by using the SAP Quick Sizer tool, and the SAP Application Performance Standard (SAPS) number
* Required CPU resource and memory consumption of the SAP system
* Required input/output (I/O) operations per second
* Required network bandwidth of eventual communication between VMs in Azure
* Required network bandwidth between on-premises assets and the Azure-deployed SAP system

### Resource groups

In Azure Resource Manager, you can use resource groups to manage all the application resources in your Azure subscription. For more information, see [Azure Resource Manager overview][resource-group-overview].

## Resources

### <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>SAP resources

When you're setting up your SAP software deployment, you need the following SAP resources:

* SAP Note [1928533], which has:
  * List of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows and Linux on Microsoft Azure

* SAP Note [2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [1409604] has the required SAP Host Agent version for Windows in Azure.
* SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1984787] has general information about SUSE Linux Enterprise Server 12.
* SAP Note [2002167] has general information about Red Hat Enterprise Linux 7.x.
* SAP Note [2069760] has general information about Oracle Linux 7.x.
* SAP Note [1999351] has additional troubleshooting information for the Azure Extension for SAP.
* SAP Note [1597355] has general information about swap-space for Linux.
* [SAP on Azure SCN page](https://wiki.scn.sap.com/wiki/x/Pia7Gg) has news and a collection of useful resources.
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* SAP-specific PowerShell cmdlets that are part of [Azure PowerShell][azure-ps].
* SAP-specific Azure CLI commands that are part of [Azure CLI][azure-cli].

### <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>Windows resources

These Microsoft articles cover SAP deployments in Azure:

* [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]
* [Azure Virtual Machines deployment for SAP NetWeaver (this article)][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide]

## <a name="b3253ee3-d63b-4d74-a49b-185e76c4088e"></a>Deployment scenarios for SAP software on Azure VMs

You have multiple options for deploying VMs and associated disks in Azure. It's important to understand the differences between deployment options, because you might take different steps to prepare your VMs for deployment based on the deployment type you choose.

### <a name="db477013-9060-4602-9ad4-b0316f8bb281"></a>Scenario 1: Deploying a VM from the Azure Marketplace for SAP

You can use an image provided by Microsoft or by a third party in the Azure Marketplace to deploy your VM. The Marketplace offers some standard OS images of Windows Server and different Linux distributions. You also can deploy an image that includes database management system (DBMS) SKUs, for example, Microsoft SQL Server. For more information about using images with DBMS SKUs, see [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide].

The following flowchart shows the SAP-specific sequence of steps for deploying a VM from the Azure Marketplace:

![Flowchart of VM deployment for SAP systems by using a VM image from the Azure Marketplace][deployment-guide-figure-100]

#### Create a virtual machine by using the Azure portal

The easiest way to create a new virtual machine with an image from the Azure Marketplace is by using the Azure portal.

1. Navigate to [Create a resource in the Azure portal](https://portal.azure.com/#create/hub). Or, in the Azure portal menu, select **+ New**.
2. Select **Compute**, and then select the type of operating system you want to deploy. For example, Windows Server 2012 R2 or higher, SUSE Linux Enterprise Server 12 or higher, Red Hat Enterprise Linux 7.x or higher (RHEL 7.2), or Oracle Linux 7.2 or higher. The default list view doesn't show all supported operating systems. Select **see all** for a full list. For more information about supported operating systems for SAP software deployment, see SAP Note [1928533].
3. On the next page, review terms and conditions.
4. In the **Select a deployment model** box, select **Resource Manager**.
5. Select **Create**.

The wizard guides you through setting the required parameters to create the virtual machine, in addition to all required resources, like network interfaces and storage accounts. Some of these parameters are:

1. **Basics**:
   * **Name**: The name of the resource (the virtual machine name).
   * **VM disk type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
   * **Username and password** or **SSH public key**: Enter the username and password of the user that is created during the provisioning. For a Linux virtual machine, you can enter the public Secure Shell (SSH) key that you use to sign in to the machine.
   * **Subscription**: Select the subscription that you want to use to provision the new virtual machine.
   * **Resource group**: The name of the resource group for the VM. You can enter either the name of a new resource group or the name of a resource group that already exists.
   * **Location**: Where to deploy the new virtual machine. If you want to connect the virtual machine to your on-premises network, make sure you select the location of the virtual network that connects Azure to your on-premises network. For more information, see [Microsoft Azure networking](planning-guide.md#azure-networking).
1. **Size**:

   For a list of supported VM types, see SAP Note [1928533]. Be sure you select the correct VM type if you want to use Azure Premium Storage. Not all VM types support Premium Storage. For more information, see [Azure storage for SAP workloads](./planning-guide-storage.md).

1. **Settings**:
   * **Storage**
     * **Disk Type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
     * **Use managed disks**: If you want to use Managed Disks, select Yes. For more information about Managed Disks, see chapter [Managed Disks](./planning-guide-storage.md#microsoft-azure-storage-resiliency) in the planning guide.
     * **Storage account**: Select an existing storage account or create a new one. Not all storage types work for running SAP applications. For more information about storage types, see [Storage structure of a VM for RDBMS Deployments](./dbms-guide-general.md#65fa79d6-a85f-47ee-890b-22e794f51a64).
   * **Network**
     * **Virtual network** and **Subnet**: To integrate the virtual machine with your intranet, select the virtual network that is connected to your on-premises network.
     * **Public IP address**: Select the public IP address that you want to use, or enter parameters to create a new public IP address. You can use a public IP address to access your virtual machine over the Internet. Make sure that you also create a network security group to help secure access to your virtual machine.
     * **Network security group**: For more information, see [Control network traffic flow with network security groups][virtual-networks-nsg].
   * **Extensions**: You can install virtual machine extensions by adding them to the deployment. You don't need to add extensions in this step. The extensions required for SAP support are installed later. See chapter [Configure the Azure Extension for SAP][deployment-guide-4.5] in this guide.
   * **High Availability**: Select either virtual machine scale set, availability zone or availability set deployment option. The appropriate choices for [deployment options](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) depend on the system configuration you prefer within an Azure region, whether it involves spanning across multiple zones, residing in a single zone, or operating in a region without zones.
   * **Monitoring**
     * **Boot diagnostics**: You can select **Disable** for boot diagnostics.
     * **Guest OS diagnostics**: You can select **Disable** for monitoring diagnostics.

1. **Summary**:

   Review your selections, and then select **OK**.

Your virtual machine is deployed in the resource group you selected.

#### Create a virtual machine by using a template

You can create a virtual machine by using one of the SAP templates published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can manually create a virtual machine by using the [Azure portal][virtual-machines-windows-tutorial], [PowerShell][virtual-machines-ps-create-preconfigure-windows-resource-manager-vms], or [Azure CLI][virtual-machines-linux-tutorial].

* [**Two-tier configuration (only one virtual machine) template** (sap-2-tier-marketplace-image)][sap-templates-2-tier-marketplace-image]

  To create a two-tier system by using only one virtual machine, use this template.
* [**Two-tier configuration (only one virtual machine) template - Managed Disks** (sap-2-tier-marketplace-image-md)][sap-templates-2-tier-marketplace-image-md]

  To create a two-tier system by using only one virtual machine and Managed Disks, use this template.
* [**Three-tier configuration (multiple virtual machines) template** (sap-3-tier-marketplace-image)][sap-templates-3-tier-marketplace-image]

  To create a three-tier system by using multiple virtual machines, use this template.
* [**Three-tier configuration (multiple virtual machines) template - Managed Disks** (sap-3-tier-marketplace-image-md)][sap-templates-3-tier-marketplace-image-md]

  To create a three-tier system by using multiple virtual machines and Managed Disks, use this template.

In the Azure portal, enter the following parameters for the template:

1. **Basics**:
   * **Subscription**: The subscription to use to deploy the template.
   * **Resource group**: The resource group to use to deploy the template. You can create a new resource group, or you can select an existing resource group in the subscription.
   * **Location**: Where to deploy the template. If you selected an existing resource group, the location of that resource group is used.

1. **Settings**:
   * **SAP System ID**: The SAP System ID (SID).
   * **OS type**: The operating system you want to deploy, for example, Windows Server 2012 R2, SUSE Linux Enterprise Server 12 (SLES 12), Red Hat Enterprise Linux 7.2 (RHEL 7.2), or Oracle Linux 7.2.

     The list view doesn't show all supported operating systems. For more information about supported operating systems for SAP software deployment, see SAP Note [1928533].
   * **SAP system size**: The size of the SAP system.

     The number of SAPS the new system provides. If you aren't sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   * **System availability** (three-tier template only): The system availability.

     Select **HA** for a configuration that is suitable for a high-availability installation. Two database servers and two servers for ABAP SAP Central Services (ASCS) are created.
   * **Storage type** (two-tier template only): The type of storage to use.

     For larger systems, we highly recommend using Azure Premium Storage. For more information about storage types, see these resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Storage structure of a VM for RDBMS Deployments](./dbms-guide-general.md#65fa79d6-a85f-47ee-890b-22e794f51a64)
      * [Premium Storage: High-performance storage for Azure Virtual Machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
   * **Admin username** and **Admin password**: A username and password.
     A new user is created, for signing in to the virtual machine.
   * **New or existing subnet**: Determines whether a new virtual network and subnet are  created or an existing subnet is used. If you already have a virtual network that is connected to your on-premises network, select **Existing**.
   * **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
     /subscriptions/&lt;subscription id>/resourceGroups/&lt;resource group name>/providers/Microsoft.Network/virtualNetworks/&lt;virtual network name>/subnets/&lt;subnet name>

1. **Terms and conditions**:  
    Review and accept the legal terms.

1. Select **Purchase**.

The Azure VM Agent is deployed by default when you use an image from the Azure Marketplace.

#### Configure proxy settings

Depending on how your on-premises network is configured, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet, and won't be able to download the required VM extensions or collect Azure infrastructure information for the SAP Host agent via the SAP extension for Azure. For more information, see [Configure the proxy][deployment-guide-configure-proxy].

#### Join a domain (Windows only)

If your Azure deployment is connected to an on-premises Active Directory or DNS instance via an Azure site-to-site VPN connection or ExpressRoute (this is called *cross-premises* in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), it is expected that the VM is joining an on-premises domain. For more information about considerations for this task, see [Join a VM to an on-premises domain (Windows only)][deployment-guide-4.3].

#### <a name="ec323ac3-1de9-4c3a-b770-4ff701def65b"></a>Configure VM Extension

To be sure SAP supports your environment, set up the Azure Extension for SAP as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. 

#### Post-deployment steps

After you create the VM and the VM is deployed, you need to install the required software components in the VM. Because of the deployment/software installation sequence in this type of VM deployment, the software to be installed must already be available, either in Azure, on another VM, or as a disk that can be attached. Or, consider using a cross-premises scenario, in which connectivity to the on-premises assets (installation shares) is given.

After you deploy your VM in Azure, follow the same guidelines and tools to install the SAP software on your VM as you would in an on-premises environment. To install SAP software on an Azure VM, both SAP and Microsoft recommend that you upload and store the SAP installation media on Azure VHDs or Managed Disks, or that you create an Azure VM that works as a file server that has all the required SAP installation media.

### <a name="54a1fc6d-24fd-4feb-9c57-ac588a55dff2"></a>Scenario 2: Deploying a VM with a custom image for SAP

Because different versions of an operating system or DBMS have different patch requirements, the images you find in the Azure Marketplace might not meet your needs. You might instead want to create a VM by using your own OS/DBMS VM image, which you can deploy again later.
You use different steps to create a private image for Linux than to create one for Windows.

---
> ![Windows logo.][Logo_Windows] Windows
>
> To prepare a Windows image that you can use to deploy multiple virtual machines, the Windows settings (like Windows SID and hostname) must be abstracted or generalized on the on-premises VM. You can use [sysprep](/previous-versions/windows/it-pro/windows-8.1-and-8/hh825084(v=win.10)) to do this.
>
> ![Linux logo.][Logo_Linux] Linux
>
> To prepare a Linux image that you can use to deploy multiple virtual machines, some Linux settings must be abstracted or generalized on the on-premises VM. You can use `waagent -deprovision`  to do this. For more information, see [Capture a Linux virtual machine running on Azure][virtual-machines-linux-capture-image] and the [Azure Linux agent user guide][virtual-machines-linux-agent-user-guide-command-line-options].

---
You can prepare and create a custom image, and then use it to create multiple new VMs. This is described in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]. Set up your database content either by using SAP Software Provisioning Manager to install a new SAP system (restores a database backup from a disk that's attached to the virtual machine) or by directly restoring a database backup from Azure storage, if your DBMS supports it. For more information, see [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide]. If you have already installed an SAP system on your on-premises VM (especially for two-tier systems), you can adapt the SAP system settings after the deployment of the Azure VM by using the System Rename procedure supported by SAP Software Provisioning Manager (SAP Note [1619720]). Otherwise, you can install the SAP software after you deploy the Azure VM.

The following flowchart shows the SAP-specific sequence of steps for deploying a VM from a custom image:

![Flowchart of VM deployment for SAP systems by using a VM image in private Marketplace][deployment-guide-figure-300]

#### Create a virtual machine by using the Azure portal

The easiest way to create a new virtual machine from a Managed Disk image is by using the Azure portal. For more information on how to create a Manage Disk Image, read [Capture a managed image of a generalized VM in Azure](/azure/virtual-machines/windows/capture-image-resource)

1. Navigate to [Images in the Azure portal](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Compute%2Fimages). Or, in the Azure portal menu, select **Images**.
1. Select the Managed Disk image you want to deploy and click on **Create VM**

The wizard guides you through setting the required parameters to create the virtual machine, in addition to all required resources, like network interfaces and storage accounts. Some of these parameters are:

1. **Basics**:
   * **Name**: The name of the resource (the virtual machine name).
   * **VM disk type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
   * **Username and password** or **SSH public key**: Enter the username and password of the user that is created during the provisioning. For a Linux virtual machine, you can enter the public Secure Shell (SSH) key that you use to sign in to the machine.
   * **Subscription**: Select the subscription that you want to use to provision the new virtual machine.
   * **Resource group**: The name of the resource group for the VM. You can enter either the name of a new resource group or the name of a resource group that already exists.
   * **Location**: Where to deploy the new virtual machine. If you want to connect the virtual machine to your on-premises network, make sure you select the location of the virtual network that connects Azure to your on-premises network. For more information, see [Microsoft Azure networking](./planning-guide.md#azure-networking) in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].
1. **Size**:

   For a list of supported VM types, see SAP Note [1928533]. Be sure you select the correct VM type if you want to use Azure Premium Storage. Not all VM types support Premium Storage. For more information, see [Azure storage for SAP workloads](./planning-guide-storage.md).

1. **Settings**:
   * **Storage**
     * **Disk Type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
     * **Use managed disks**: If you want to use Managed Disks, select Yes. For more information about Managed Disks, see chapter [Managed Disks](./planning-guide-storage.md#microsoft-azure-storage-resiliency) in the planning guide.
   * **Network**
     * **Virtual network** and **Subnet**: To integrate the virtual machine with your intranet, select the virtual network that is connected to your on-premises network.
     * **Public IP address**: Select the public IP address that you want to use, or enter parameters to create a new public IP address. You can use a public IP address to access your virtual machine over the Internet. Make sure that you also create a network security group to help secure access to your virtual machine.
     * **Network security group**: For more information, see [Control network traffic flow with network security groups][virtual-networks-nsg].
   * **Extensions**: You can install virtual machine extensions by adding them to the deployment. You don't need to add extension in this step. The extensions required for SAP support are installed later. See chapter [Configure the Azure Extension for SAP][deployment-guide-4.5] in this guide.
   * **High Availability**: Select either virtual machine scale set, availability zone or availability set deployment option. The appropriate choices for [deployment options](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) depend on the system configuration you prefer within an Azure region, whether it involves spanning across multiple zones, residing in a single zone, or operating in a region without zones.
   * **Monitoring**
     * **Boot diagnostics**: You can select **Disable** for boot diagnostics.
     * **Guest OS diagnostics**: You can select **Disable** for monitoring diagnostics.

1. **Summary**:

   Review your selections, and then select **OK**.

Your virtual machine is deployed in the resource group you selected.

#### Create a virtual machine by using a template

To create a deployment by using a private OS image from the Azure portal, use one of the following SAP templates. These templates are published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can manually create a virtual machine, by using [PowerShell][virtual-machines-upload-image-windows-resource-manager].

* [**Two-tier configuration (only one virtual machine) template** (sap-2-tier-user-image)][sap-templates-2-tier-user-image]

  To create a two-tier system by using only one virtual machine, use this template.
* [**Two-tier configuration (only one virtual machine) template - Managed Disk Image** (sap-2-tier-user-image-md)][sap-templates-2-tier-user-image-md]

  To create a two-tier system by using only one virtual machine and a Managed Disk image, use this template.
* [**Three-tier configuration (multiple virtual machines) template** (sap-3-tier-user-image)][sap-templates-3-tier-user-image]

  To create a three-tier system by using multiple virtual machines or your own OS image, use this template.
* [**Three-tier configuration (multiple virtual machines) template - Managed Disk Image** (sap-3-tier-user-image-md)][sap-templates-3-tier-user-image-md]

  To create a three-tier system by using multiple virtual machines or your own OS image and a Managed Disk image, use this template.

In the Azure portal, enter the following parameters for the template:

1. **Basics**:
   * **Subscription**: The subscription to use to deploy the template.
   * **Resource group**: The resource group to use to deploy the template. You can create a new resource group or select an existing resource group in the subscription.
   * **Location**: Where to deploy the template. If you selected an existing resource group, the location of that resource group is used.
1. **Settings**:
   * **SAP System ID**: The SAP System ID.
   * **OS type**: The operating system type you want to deploy (Windows or Linux).
   * **SAP system size**: The size of the SAP system.

     The number of SAPS the new system provides. If you aren't sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   * **System availability** (three-tier template only): The system availability.

     Select **HA** for a configuration that is suitable for a high-availability installation. Two database servers and two servers for ASCS are created.
   * **Storage type** (two-tier template only): The type of storage to use.

     For larger systems, we highly recommend using Azure Premium Storage. For more information about storage types, see the following resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Storage structure of a VM for RDBMS Deployments](./dbms-guide-general.md#65fa79d6-a85f-47ee-890b-22e794f51a64)
      * [Premium Storage: High-performance storage for Azure virtual machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
   * **User image VHD URI** (unmanaged disk image template only): The URI of the private OS image VHD, for example, https://&lt;accountname>.blob.core.windows.net/vhds/userimage.vhd.
   * **User image storage account** (unmanaged disk image template only): The name of the storage account where the private OS image is stored, for example, &lt;accountname> in https://&lt;accountname>.blob.core.windows.net/vhds/userimage.vhd.
   * **userImageId** (managed disk image template only): ID of the Managed Disk image you want to use
   * **Admin username** and **Admin password**: The username and password.

     A new user is created, for signing in to the virtual machine.
   * **New or existing subnet**: Determines whether a new virtual network and subnet is created or an existing subnet is used. If you already have a virtual network that is connected to your on-premises network, select **Existing**.
   * **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
     /subscriptions/&lt;subscription id>/resourceGroups/&lt;resource group name>/providers/Microsoft.Network/virtualNetworks/&lt;virtual network name>/subnets/&lt;subnet name>

1. **Terms and conditions**:  
    Review and accept the legal terms.

1. Select **Purchase**.

#### Install the VM Agent (Linux only)

To use the templates described in the preceding section, the Linux Agent must already be installed in the user image, or the deployment will fail. Download and install the VM Agent in the user image as described in [Download, install, and enable the Azure VM Agent][deployment-guide-4.4]. If you don't use the templates, you also can install the VM Agent later.

#### Join a domain (Windows only)

If your Azure deployment is connected to an on-premises Active Directory or DNS instance via an Azure site-to-site VPN connection or Azure ExpressRoute (this is called *cross-premises* in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), it's expected that the VM is joining an on-premises domain. For more information about considerations for this step, see [Join a VM to an on-premises domain (Windows only)][deployment-guide-4.3].

#### Configure proxy settings

Depending on how your on-premises network is configured, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet, and won't be able to download the required VM extensions or collect Azure infrastructure information for the SAP Host agent via the SAP extension for Azure, see [Configure the proxy][deployment-guide-configure-proxy].

#### Configure Azure VM Extension for SAP

To be sure SAP supports your environment, set up the Azure Extension for SAP as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. 

### <a name="a9a60133-a763-4de8-8986-ac0fa33aa8c1"></a>Scenario 3: Moving an on-premises VM by using a nongeneralized Azure VHD with SAP

In this scenario, you plan to move a specific SAP system from an on-premises environment to Azure. You can do this by uploading the VHD that has the OS, the SAP binaries, and eventually the DBMS binaries, plus the VHDs with the data and log files of the DBMS, to Azure. Unlike the scenario described in [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3], in this case, you keep the hostname, SAP SID, and SAP user accounts in the Azure VM, because they were configured in the on-premises environment. You don't need to generalize the OS. This scenario applies most often to cross-premises scenarios where part of the SAP landscape runs on-premises and part of it runs on Azure.

In this scenario, the VM Agent is **not** automatically installed during deployment. Because the VM Agent and the Azure Extension for SAP are required to run SAP NetWeaver on Azure, you need to download, install, and enable both components manually after you create the virtual machine.

For more information about the Azure VM Agent, see the following resources.

---
> ![Windows logo.][Logo_Windows] Windows
>
> [Azure Virtual Machine Agent overview][virtual-machines-windows-agent-user-guide]
>
> ![Linux logo.][Logo_Linux] Linux
>
> [Azure Linux Agent User Guide][virtual-machines-linux-agent-user-guide]

---

The following flowchart shows the sequence of steps for moving an on-premises VM by using a non-generalized Azure VHD:

![Flowchart of VM deployment for SAP systems by using a VM disk][deployment-guide-figure-400]

If the disk is already uploaded and defined in Azure (see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), do the tasks described in the next few sections.

#### Create a virtual machine

To create a deployment by using a private OS disk through the Azure portal, use the SAP template published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can manually create a virtual machine, by using PowerShell.

* [**Two-tier configuration (only one virtual machine) template** (sap-2-tier-user-disk)][sap-templates-2-tier-os-disk]

  To create a two-tier system by using only one virtual machine, use this template.
* [**Two-tier configuration (only one virtual machine) template - Managed Disk** (sap-2-tier-user-disk-md)][sap-templates-2-tier-os-disk-md]

  To create a two-tier system by using only one virtual machine and a Managed Disk, use this template.

In the Azure portal, enter the following parameters for the template:

1. **Basics**:
   * **Subscription**: The subscription to use to deploy the template.
   * **Resource group**: The resource group to use to deploy the template. You can create a new resource group or select an existing resource group in the subscription.
   * **Location**: Where to deploy the template. If you selected an existing resource group, the location of that resource group is used.
1. **Settings**:
   * **SAP System ID**: The SAP System ID.
   * **OS type**: The operating system type you want to deploy (Windows or Linux).
   * **SAP system size**: The size of the SAP system.

     The number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   * **Storage type** (two-tier template only): The type of storage to use.

     For larger systems, we highly recommend using Azure Premium Storage. For more information about storage types, see the following resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Storage structure of a VM for RDBMS Deployments](./dbms-guide-general.md#65fa79d6-a85f-47ee-890b-22e794f51a64)
      * [Premium Storage: High-performance storage for Azure Virtual Machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
   * **OS disk VHD URI** (unmanaged disk template only): The URI of the private OS disk, for example, https://&lt;accountname>.blob.core.windows.net/vhds/osdisk.vhd.
   * **OS disk Managed Disk ID** (managed disk template only): The ID of the Managed Disk OS disk, /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/group/providers/Microsoft.Compute/disks/WIN
   * **New or existing subnet**: Determines whether a new virtual network and subnet are created, or an existing subnet is used. If you already have a virtual network that is connected to your on-premises network, select **Existing**.
   * **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
     /subscriptions/&lt;subscription id>/resourceGroups/&lt;resource group name>/providers/Microsoft.Network/virtualNetworks/&lt;virtual network name>/subnets/&lt;subnet name>

1. **Terms and conditions**:  
    Review and accept the legal terms.

1. Select **Purchase**.

#### Install the VM Agent

To use the templates described in the preceding section, the VM Agent must be installed on the OS disk, or the deployment will fail. Download and install the VM Agent in the VM, as described in [Download, install, and enable the Azure VM Agent][deployment-guide-4.4].

If you don't use the templates described in the preceding section, you can also install the VM Agent afterwards.

#### Join a domain (Windows only)

If your Azure deployment is connected to an on-premises Active Directory or DNS instance via an Azure site-to-site VPN connection or ExpressRoute (this is called *cross-premises* in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), it is expected that the VM is joining an on-premises domain. For more information about considerations for this task, see [Join a VM to an on-premises domain (Windows only)][deployment-guide-4.3].

#### Configure proxy settings

Depending on how your on-premises network is configured, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet, and won't be able to download the required VM extensions or collect Azure infrastructure information for the SAP Host agent via the SAP extension for Azure, see [Configure the proxy][deployment-guide-configure-proxy].

#### Configure Azure VM Extension for SAP

To be sure SAP supports your environment, set up the Azure Extension for SAP as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. 

## Detailed tasks for SAP software deployment

This section has detailed steps for doing specific tasks in the configuration and deployment process.

### <a name="31d9ecd6-b136-4c73-b61e-da4a29bbc9cc"></a>Join a VM to an on-premises domain (Windows only)

If you deploy SAP VMs in a cross-premises scenario, where on-premises Active Directory and DNS are extended in Azure, it's expected that the VMs are joining an on-premises domain. The detailed steps you take to join a VM to an on-premises domain, and the additional software required to be a member of an on-premises domain, varies by customer. Usually, to join a VM to an on-premises domain, you need to install additional software, like anti-malware software, and backup or monitoring software.

In this scenario, you also need to make sure that if Internet proxy settings are forced when a VM joins a domain in your environment, the Windows Local System Account (S-1-5-18) in the Guest VM has the same proxy settings. The easiest option is to force the proxy by using a domain Group Policy, which applies to systems in the domain.

### <a name="c7cbb0dc-52a4-49db-8e03-83e7edc2927d"></a>Download, install, and enable the Azure VM Agent

For virtual machines that are deployed from an OS image that isn't generalized (for example, an image that doesn't originate in the Windows System Preparation, or sysprep, tool), you need to manually download, install, and enable the Azure VM Agent.

If you deploy a VM from the Azure Marketplace, this step isn't required. Images from the Azure Marketplace already have the Azure VM Agent.

#### <a name="b2db5c9a-a076-42c6-9835-16945868e866"></a>Windows

1. Download the Azure VM Agent:
   1. Download the [Azure VM Agent installer package](https://go.microsoft.com/fwlink/?LinkId=394789).
   1. Store the VM Agent MSI package locally on a personal computer or server.
1. Install the Azure VM Agent:
   1. Connect to the deployed Azure VM by using Remote Desktop Protocol (RDP).
   1. Open a Windows Explorer window on the VM and select the target directory for the MSI file of the VM Agent.
   1. Drag the Azure VM Agent Installer MSI file from your local computer/server to the target directory of the VM Agent on the VM.
   1. Double-click the MSI file on the VM.
1. For VMs that are joined to on-premises domains, make sure that eventual Internet proxy settings also apply to the Windows Local System account (S-1-5-18) in the VM, as described in [Configure the proxy][deployment-guide-configure-proxy]. The VM Agent runs in this context and needs to be able to connect to Azure.

No user interaction is required to update the Azure VM Agent. The VM Agent is automatically updated, and doesn't require a VM restart.

#### <a name="6889ff12-eaaf-4f3c-97e1-7c9edc7f7542"></a>Linux

Use the following commands to install the VM Agent for Linux:

* **SUSE Linux Enterprise Server (SLES)**

  ```console
  sudo zypper install WALinuxAgent
  ```

* **Red Hat Enterprise Linux (RHEL) or Oracle Linux**

  ```console
  sudo yum install WALinuxAgent
  ```

If the agent is already installed, to update the Azure Linux Agent, do the steps described in [Update the Azure Linux Agent on a VM to the latest version from GitHub][virtual-machines-linux-update-agent].

### <a name="baccae00-6f79-4307-ade4-40292ce4e02d"></a>Configure the proxy

The steps you take to configure the proxy in Windows are different from the way you configure the proxy in Linux.

#### Windows

Proxy settings must be set up correctly for the Local System account to access the Internet. If your proxy settings aren't set by Group Policy, you can configure the settings for the Local System account.

1. Go to **Start**, enter **gpedit.msc**, and then select **Enter**.
1. Select **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Internet Explorer**. Make sure that the setting **Make proxy settings per-machine (rather than per-user)** is disabled or not configured.
1. In **Control Panel**, go to **Network and Sharing Center** > **Internet Options**.
1. On the **Connections** tab, select the **LAN settings** button.
1. Clear the **Automatically detect settings** check box.
1. Select the **Use a proxy server for your LAN** check box, and then enter the proxy address and port.
1. Select the **Advanced** button.
1. In the **Exceptions** box, enter the IP address **168.63.129.16**. Select **OK**.

#### Linux

Configure the correct proxy in the configuration file of the Microsoft Azure Guest Agent, which is located at \\etc\\waagent.conf.

Set the following parameters:

1. **HTTP proxy host**. For example, set it to **proxy.corp.local**.

   ```console
   HttpProxy.Host=<proxy host>

   ```

1. **HTTP proxy port**. For example, set it to **80**.

   ```console
   HttpProxy.Port=<port of the proxy host>

   ```

1. Restart the agent.

   ```console
   sudo service waagent restart
   ```

If you want to use the Azure repositories, make sure that the traffic to these repositories isn't going through your on-premises intranet. If you created user-defined routes to enable forced tunneling, make sure that you add a route that routes traffic to the repositories directly to the Internet, and not through your site-to-site VPN connection.

The VM Extension for SAP also needs to be able to access the internet. Make sure to install the new VM Extension for SAP and follow the steps in [Configure the Azure VM extension for SAP solutions](vm-extension-for-sap-new.md#configure) in the VM Extension for SAP installation guide to configure the proxy.

* **SLES**

  You also need to add routes for the IP addresses listed in \\etc\\regionserverclnt.cfg. The following figure shows an example:

  ![Forced tunneling][deployment-guide-figure-50]


* **RHEL**

  You also need to add routes for the IP addresses of the hosts listed in \\etc\\yum.repos.d\\rhui-load-balancers. For an example, see the preceding figure.

* **Oracle Linux**

  There are no repositories for Oracle Linux on Azure. You need to configure your own repositories for Oracle Linux or use the public repositories.

For more information about user-defined routes, see [User-defined routes and IP forwarding][virtual-networks-udr-overview].

### <a name="d98edcd3-f2a1-49f7-b26a-07448ceb60ca"></a>Azure Extension for SAP

> [!NOTE]
> General Support Statement:  
> Support for the Azure Extension for SAP is provided through SAP support channels. If you need assistance with the Azure Extension for SAP, please open a support case with [SAP Support](https://support.sap.com/).

When you've prepared the VM as described in [Deployment scenarios of VMs for SAP on Azure][deployment-guide-3], the Azure VM Agent is installed on the virtual machine. The next step is to deploy the Azure Extension for SAP, which is available in the Azure Extension Repository in the global Azure datacenters. For more information, see [Configure the Azure Extension for SAP][deployment-guide-4.5].

## Next Steps

Learn about [RHEL for SAP in-place upgrade](/azure/virtual-machines/workloads/redhat/redhat-in-place-upgrade#upgrade-sap-environments-from-rhel-7-vms-to-rhel-8-vms)
