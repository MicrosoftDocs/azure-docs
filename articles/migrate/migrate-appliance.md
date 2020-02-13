---
title: Azure Migrate appliance 
description: Provides an overview of the Azure Migrate appliance used in server assessment and migration.
ms.topic: conceptual
ms.date: 11/19/2019
---


# Azure Migrate appliance

This article describes the Azure Migrate appliance. You deploy the appliance when you use [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool to discover and assess apps, infrastructure, and workloads for migration to Microsoft Azure. The appliance is also used when you migrate VMware VMs to Azure using [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-migration-tool) with [agentless migration](server-migrate-overview.md).

## Appliance overview

The Azure Migrate appliance is used in the following scenarios.

**Scenario** | **Tool** | **Used for** 
--- | --- | ---
VMware VM | Azure Migrate: Server Assessment<br/><br/> Azure Migrate: Server Migration | Discover VMware VMs<br/><br/> Discover machine apps and dependencies<br/><br/> Collect machine metadata and performance metadata for assessments.<br/><br/> Replicate VMware VMs with agentless migration.
Hyper-V VM | Azure Migrate: Server Assessment | Discover Hyper-V VMs<br/><br/> Collect machine metadata and performance metadata for assessments.
Physical machine |  Azure Migrate: Server Assessment |  Discover physical servers<br/><br/> Collect machine metadata and performance metadata for assessments.

## Appliance - VMware 

**Requirement** | **VMware** 
--- | ---
**Download format** | .OVA 
**Download link** | https://aka.ms/migrate/appliance/vmware 
**Download size** | 11.2 GB
**License** | The downloaded appliance template comes with a Windows Server 2016 evaluation license, which is valid for 180 days. If the evaluation period is close to expiry, we recommend that you download and deploy a new appliance, or that you activate the operating system license of the appliance VM.
**Deployment** | You deploy the appliance as a VMware VM. You need enough resources on the vCenter Server to allocate a VM with 32-GB RAM, 8 vCPUs, around 80 GB of disk storage, and an external virtual switch.<br/><br/> The appliance requires internet access, either directly or through a proxy.<br/> The appliance VM must be deployed on an ESXi host running version 5.5 or later.<br/><br/> The appliance can connect to a single vCenter Server.
**Hardware** | Resources on vCenter to allocate a VM with 32-GB RAM 8 vCPUs, around 80 GB of disk storage, and an external virtual switch. 
**Hash value** | MD5: c06ac2a2c0f870d3b274a0b7a73b78b1<br/><br/> SHA256: 4ce4faa3a78189a09a26bfa5b817c7afcf5b555eb46999c2fad9d2ebc808540c
**vCenter server/host** | The appliance VM must be deployed on an ESXi host running version 5.5 or later.<br/><br/> vCenter Server running 5.5, 6.0, 6.5, or 6.7.
**Azure Migrate project** | An appliance can be associated with a single project. <br/> Any number of appliances can be associated with a single project.<br/> 
**Discovery** | An appliance can discover up to 10,000 VMware VMs on a vCenter Server.<br/> An appliance can connect to a single vCenter Server.
**Appliance components** | Management app: Web app in appliance for user input during deployment.<br/> Discovery agent: Gathers machine configuration data.<br/> Assessment agent: Collect performance data.<br/> DRA: Orchestrates VM replication, and coordinates communication between machines/Azure.<br/> Gateway: Sends replicated data to Azure.<br/> Auto update service: Update components (runs every 24 hours).
**VDDK (agentless migration)** | If you're running an agentless migration with Azure Migrate Server Migration, the VMware vSphere VDDK must be installed on the appliance VM).


## Appliance - Hyper-V

**Requirement** | **Hyper-V** 
--- | ---
**Download format** | Zipped folder (With VHD)
**Download link** | https://aka.ms/migrate/appliance/hyperv 
**Download size** | 10 GB
**License** | The downloaded appliance template comes with a Windows Server 2016 evaluation license, which is valid for 180 days. If the evaluation period is close to expiry, we recommend that you download and deploy a new appliance, or that you activate the operating system license of the appliance VM.
**Appliance deployment**   |  You deploy the appliance as a Hyper-V VM.<br/> The appliance VM provided by Azure Migrate is Hyper-V VM version 5.0.<br/> The Hyper-V host must be running Windows Server 2012 R2 or later.<br/> The host needs sufficient space to allocate 16 GB RAM, 8 vCPUs, around 80 GB of storage space, and an external switch for the appliance VM.<br/> The appliance needs a static or dynamic IP address, and internet access.
**Hardware** | Resources on Hyper-V host to allocate 16-GB RAM, 8 vCPUs, around 80 GB of storage space, and an external switch for the appliance VM.
**Hash value** | MD5: 29a7531f32bcf69f32d964fa5ae950bc<br/><br/> SHA256: 37b3f27bc44f475872e355f04fcb8f38606c84534c117d1609f2d12444569b31
**Hyper-V host** | Running Windows Server 2012 R2 or later.
**Azure Migrate project** | An appliance can be associated with a single project. <br/> Any number of appliances can be associated with a single project.<br/> 
**Discovery** | An appliance can discover up to 5000 VMware VMs on a vCenter Server.<br/> An appliance can connect to up to 300 Hyper-V hosts.
**Appliance components** | Management app: Web app in appliance for user input during deployment.<br/> Discovery agent: Gathers machine configuration data.<br/> Assessment agent: Collect performance data.<br/>  Auto update service: Update components (runs every 24 hours).


## Appliance - Physical

**Requirement** | **Physical** 
--- | ---
**Download format** | Zipped folder (with PowerShell installer script)
**Download link** | [Download link](https://go.microsoft.com/fwlink/?linkid=2105112)
**Download size** | 59.7 MB
**Hardware** | Dedicated physical machine, or VM. The machine running appliance needs 16-GB RAM, 8 vCPUs, around 80 GB of storage space, and an external switch.<br/><br/> The appliance needs a static or dynamic IP address, and internet access.
**Hash value** | MD5: 96fd99581072c400aa605ab036a0a7c0<br/><br/> SHA256: f5454beef510c0aa38ac1c6be6346207c351d5361afa0c9cea4772d566fcdc36
**Software** | Appliance machine should run Windows Server 2016. 
**Appliance deployment**   |  The appliance installer script is downloaded from the portal (in a zipped folder). <br/> You unzip the folder, and run the PowerShell script (AzureMigrateInstaller.ps1).
**Discovery** | An appliance can discover up to 250 physical servers.
**Appliance components** | Management app: Web app in appliance for user input during deployment.<br/> Discovery agent: Gathers machine configuration data.<br/> Assessment agent: Collect performance data.<br/>  Auto update service: Update components (runs every 24 hours).
**Port access** | After you have configured the appliance, inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: `https://<appliance-ip-or-name>:44368.<br/><br/> Outbound connections on port 443, 5671 and 5672 to send discovery and performance metadata to Azure Migrate.



## URL access

The Azure Migrate appliance needs connectivity to the internet.

- When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.
- If you're using a URL-based proxy to connect to the internet, allow access to these URLs, making sure that the proxy resolves any CNAME records received while looking up the URLs.

**URL** | **Details**  
--- | --- |
*.portal.azure.com  | Navigate to the Azure portal.
*.windows.net <br/> *.msftauth.net <br/> *.msauth.net <br/> *.microsoft.com <br/> *.live.com | Sign in to your Azure subscription.
*.microsoftonline.com <br/> *.microsoftonline-p.com | Create Active Directory apps for the appliance to communicate with Azure Migrate.
management.azure.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
*.vault.azure.net | Manage secrets in the Azure Key Vault.
aka.ms/* | Allow access to aka links. Used for Azure Migrate appliance updates.
download.microsoft.com/download | Allow downloads from Microsoft download.
*.servicebus.windows.net | Used for VMware agentless migration.<br/><br/> Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com <br/> *.migration.windowsazure.com <br/> *.hypervrecoverymanager.windowsazure.com | Used for VMware agentless migration.<br/><br/> Connect to Azure Migrate service URLs.
*.blob.core.windows.net |  Used for VMware agentless migration.<br/><br/>Upload data to storage.




## Collected data - VMware

### Collected performance data-VMware

Here's the VMware VM performance data that the appliance collects and sends to Azure.

**Data** | **Counter** | **Assessment impact**
--- | --- | ---
CPU utilization | cpu.usage.average | Recommended VM size/cost
Memory utilization | mem.usage.average | Recommended VM size/cost
Disk read throughput (MB per second) | virtualDisk.read.average | Calculation for disk size, storage cost, VM size
Disk writes throughput (MB per second) | virtualDisk.write.average | Calculation for disk size, storage cost, VM size
Disk read operations per second | virtualDisk.numberReadAveraged.average | Calculation for disk size, storage cost, VM size
Disk writes operations per second | virtualDisk.numberWriteAveraged.average  | Calculation for disk size, storage cost, VM size
NIC read throughput (MB per second) | net.received.average | Calculation for VM size
NIC writes throughput (MB per second) | net.transmitted.average  |Calculation for VM size


### Collected metadata-VMware

> [!NOTE]
> Metadata discovered by the Azure Migrate appliance is used to help you right-size your applications as you migrate them to Azure, perform Azure suitability analysis, application dependency analysis, and cost planning. Microsoft does not use this data in relation to any license compliance audit.

Here's the full list of VMware VM metadata that the appliance collects and sends to Azure.

**Data** | **Counter**
--- | --- 
**Machine details** | 
VM ID | vm.Config.InstanceUuid 
VM name | vm.Config.Name
vCenter Server ID | VMwareClient.Instance.Uuid
VM description | vm.Summary.Config.Annotation
License product name | vm.Client.ServiceContent.About.LicenseProductName
Operating system type | vm.SummaryConfig.GuestFullName
Boot type | vm.Config.Firmware
Number of cores | vm.Config.Hardware.NumCPU
Memory (MB) | vm.Config.Hardware.MemoryMB
Number of disks | vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualDisk).count
Disk size list | vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualDisk)
Network adapters list | vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualEthernet).count
CPU utilization | cpu.usage.average
Memory utilization |mem.usage.average
**Per disk details** | 
Disk key value | disk.Key
Dikunit number | disk.UnitNumber
Disk controller key value | disk.ControllerKey.Value
Gigabytes provisioned | virtualDisk.DeviceInfo.Summary
Disk name | Value generated using disk.UnitNumber, disk.Key, disk.ControllerKey.VAlue
Read operations per second | virtualDisk.numberReadAveraged.average
Write operations per second | virtualDisk.numberWriteAveraged.average
Read throughput (MB per second) | virtualDisk.read.average
Write throughput (MB per second) | virtualDisk.write.average
**Per NIC details** | 
Network adapter name | nic.Key
MAC address | ((VirtualEthernetCard)nic).MacAddress
IPv4 addresses | vm.Guest.Net
IPv6 addresses | vm.Guest.Net
Read throughput (MB per second) | net.received.average
Write throughput (MB per second) | net.transmitted.average
**Inventory path details** | 
Name | container.GetType().Name
Type of child object | container.ChildType
Reference details | container.MoRef
Parent details | Container.Parent
Folder details per VM | ((Folder)container).ChildEntity.Type
Datacenter details per VM | ((Datacenter)container).VmFolder
Datacenter details per host folder | ((Datacenter)container).HostFolder
Cluster details per host | ((ClusterComputeResource)container).Host
Host details per VM | ((HostSystem)container).VM

## Collected data - Hyper-V

### Collected performance data-Hyper-V

> [!NOTE]
> Metadata discovered by the Azure Migrate appliance is used to help you right-size your applications as you migrate them to Azure, perform Azure suitability analysis, application dependency analysis, and cost planning. Microsoft does not use this data in relation to any license compliance audit.

Here's the Hyper VM performance data that the appliance collects and sends to Azure.

**Performance counter class** | **Counter** | **Assessment impact**
--- | --- | ---
Hyper-V Hypervisor Virtual Processor | % Guest Run Time | Recommended VM size/cost
Hyper-V Dynamic Memory VM | Current Pressure (%)<br/> Guest Visible Physical Memory (MB) | Recommended VM size/cost
Hyper-V Virtual Storage Device | Read Bytes/Second | Calculation for disk size, storage cost, VM size
Hyper-V Virtual Storage Device | Write Bytes/Second | Calculation for disk size, storage cost, VM size
Hyper-V Virtual Network Adapter | Bytes Received/Second | Calculation for VM size
Hyper-V Virtual Network Adapter | Bytes Sent/Second | Calculation for VM size

- CPU utilization is the sum of all usage, for all virtual processors attached to a VM.
- Memory utilization is (Current Pressure * Guest Visible Physical Memory) / 100.
- Disk and network utilization values are collected from the listed Hyper-V performance counters.

### Collected metadata-Hyper-V

Here's the full list of Hyper-V VM metadata that the appliance collects and sends to Azure.

**Data** | **WMI class** | **WMI class property**
--- | --- | ---
**Machine details** | 
Serial number of BIOS _ Msvm_BIOSElement | BIOSSerialNumber
VM type (Gen 1 or 2) | Msvm_VirtualSystemSettingData | VirtualSystemSubType
VM display name | Msvm_VirtualSystemSettingData | ElementName
VM version | Msvm_ProcessorSettingData | VirtualQuantity
Memory (bytes) | Msvm_MemorySettingData | VirtualQuantity
Maximum memory that can be consumed by VM | Msvm_MemorySettingData | Limit
Dynamic memory enabled | Msvm_MemorySettingData | DynamicMemoryEnabled
Operating system name/version/FQDN | Msvm_KvpExchangeComponent | GuestIntrinsicExchangeItems Name Data
VM power status | Msvm_ComputerSystem | EnabledState
**Per disk details** | 
Disk identifier | Msvm_VirtualHardDiskSettingData | VirtualDiskId
Virtual hard disk type | Msvm_VirtualHardDiskSettingData | Type
Virtual hard disk size | Msvm_VirtualHardDiskSettingData | MaxInternalSize
Virtual hard disk parent | Msvm_VirtualHardDiskSettingData | ParentPath
**Per NIC details** | 
IP addresses (synthetic NICs) | Msvm_GuestNetworkAdapterConfiguration | IPAddresses
DHCP enabled (synthetic NICs) | Msvm_GuestNetworkAdapterConfiguration | DHCPEnabled
NIC ID (synthetic NICs) | Msvm_SyntheticEthernetPortSettingData | InstanceID
NIC MAC address (synthetic NICs) | Msvm_SyntheticEthernetPortSettingData | Address
NIC ID (legacy NICs) | MsvmEmulatedEthernetPortSetting Data | InstanceID
NIC MAC ID (legacy NICs) | MsvmEmulatedEthernetPortSetting Data | Address




## Discovery and collection process

The appliance communicates with vCenter Servers and Hyper-V hosts/cluster using the following process.

1. **Start discovery**:
    - When you start the discovery on the Hyper-V appliance, it communicates with the Hyper-V hosts on WinRM ports 5985 (HTTP) and 5986 (HTTPS).
    - When you start discovery on the VMware appliance, it communicates with the vCenter server on TCP port 443 by default. IF the vCenter server listens on a different port, you can configure it in the appliance web app.
2. **Gather metadata and performance data**:
    - The appliance uses a Common Information Model (CIM) session to gather Hyper-V VM data from the Hyper-V host on ports 5985 and 5986.
    - The appliance communicates with port 443 by default, to gather VMware VM data from the vCenter Server.
3. **Send data**: The appliance sends the collected data to Azure Migrate Server Assessment and Azure Migrate Server Migration over SSL port 443. The appliance can connect to Azure over the internet, or you can use ExpressRoute with public/Microsoft peering.
    - For performance data, the appliance collects real-time utilization data.
        - Performance data is collected every 20 seconds for VMware, and every 30 seconds for Hyper-V, for each performance metric.
        - The collected data is rolled up to create a single data point for 10 minutes.
        - The peak utilization value is selected from all of the 20/30-second data points, and sent to Azure for assessment calculation.
        - Based on the percentile value specified in the assessment properties (50th/90th/95th/99th), the ten-minute points are sorted in ascending order, and the appropriate percentile value is used to compute the assessment
    - For Server Migration, the appliance starts collecting VM data, and replicates it to Azure.
4. **Assess and migrate**: You can now create assessments from the metadata collected by the appliance using Azure Migrate Server Assessment. In addition, you can also start migrating VMware VMs using Azure Migrate Server Migration to orchestrate agentless VM replication.


![Architecture](./media/migrate-appliance/architecture.png)


## Appliance upgrades

The appliance is upgraded as the Azure Migrate agents running on the appliance are updated.

- This happens automatically because the auto-update is enabled on the appliance by default.
- You can change this default setting to update the agents manually.
- To disable the auto-update, go to the Registry Editor>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance and set the registry key- "AutoUpdate" to 0 (DWORD).
 
### Set agent updates to manual

For manual updates, make sure that you update all the agents on the appliance at the same time, using the **Update** button for each outdated agent on the appliance. You can switch the update setting back to automatic updates at any time.

## Next steps

[Learn how](tutorial-assess-vmware.md#set-up-the-appliance-vm) to set up the appliance for VMware.
[Learn how](tutorial-assess-hyper-v.md#set-up-the-appliance-vm) to set up the appliance for Hyper-V.

