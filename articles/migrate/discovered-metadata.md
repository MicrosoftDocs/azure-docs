---
title: Discovered metadata
description: Provides details of the metadata discovered by Azure Migrate appliance.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 02/24/2023
ms.custom: engagement-fy23
---

# Metadata discovered by Azure Migrate appliance 

This article provides details of the metadata discovered by Azure Migrate appliance.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance that the Azure Migrate: Discovery and assessment tool uses to discover servers running in your environment and send server configuration and performance metadata to Azure.

Metadata discovered by the Azure Migrate appliance helps you to assess server readiness for migration to Azure, right-size servers and plans costs. Microsoft doesn't use this data in any license compliance audit.

## Collected metadata for VMware servers

The appliance collects configuration, performance metadata, data about installed applications, roles and features (software inventory) and dependency data (if agentless dependency analysis is enabled) from servers running in your VMware environment.

Here's the full list of server metadata that the appliance collects and sends to Azure:

**DATA** | **COUNTER**
--- | ---
**Server details** |
Server ID | vm.Config.InstanceUuid
Server name | vm.Config.Name
vCenter Server ID | VMwareClient.Instance.Uuid
Server description | vm.Summary.Config.Annotation
License product name | vm.Client.ServiceContent.About.LicenseProductName
Operating system type | vm.SummaryConfig.GuestFullName
Boot type | vm.Config.Firmware
Number of cores | vm.Config.Hardware.NumCPU
Memory (MB) | vm.Config.Hardware.MemoryMB
Number of disks | vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualDisk).count
Disk size list | vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualDisk)
Network adapters list | vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualEthernet).count
CPU utilization | cpu.usage.average
Memory utilization | mem.usage.average
Processor model/name | vm.Config.Hardware.CpuModel 
Number of Sockets in a Processor | vm.Config.Hardware.NumCpuPkgs
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
Folder details per server | ((Folder)container).ChildEntity.Type
Datacenter details per server | ((Datacenter)container).VmFolder
Datacenter details per host folder | ((Datacenter)container).HostFolder
Cluster details per host | ((ClusterComputeResource)container).Host
Host details per server | ((HostSystem)container).VM

### Performance metadata

Here's the performance data that an appliance collects for a server running on VMware and sends to Azure:

**Data** | **Counter** | **Assessment impact**
--- | --- | ---
CPU utilization | cpu.usage.average | Recommended server size/cost
Memory utilization | mem.usage.average | Recommended server size/cost
Disk read throughput (MB per second) | virtualDisk.read.average | Calculation for disk size, storage cost, server size
Disk writes throughput (MB per second) | virtualDisk.write.average | Calculation for disk size, storage cost, server size
Disk read operations per second | virtualDisk.numberReadAveraged.average | Calculation for disk size, storage cost, server size
Disk writes operations per second | virtualDisk.numberWriteAveraged.average  | Calculation for disk size, storage cost, server size
NIC read throughput (MB per second) | net.received.average | Calculation for server size
NIC writes throughput (MB per second) | net.transmitted.average  |Calculation for server size

## Collected metadata for Hyper-V servers

The appliance collects configuration, performance metadata, data about installed applications, roles and features (software inventory) and dependency data (if agentless dependency analysis is enabled) from servers running in your Hyper-V environment.

Here's the full list of server metadata that the appliance collects and sends to Azure.

**Data** | **WMI class** | **WMI class property**
--- | --- | ---
**Server details** | 
Serial number of BIOS | Msvm_BIOSElement | BIOSSerialNumber
Server type (Gen 1 or 2) | Msvm_VirtualSystemSettingData | VirtualSystemSubType
Server display name | Msvm_VirtualSystemSettingData | ElementName
Server version | Msvm_ProcessorSettingData | VirtualQuantity
Memory (bytes) | Msvm_MemorySettingData | VirtualQuantity
Maximum memory that can be consumed by server | Msvm_MemorySettingData | Limit
Dynamic memory enabled | Msvm_MemorySettingData | DynamicMemoryEnabled
Operating system name/version/FQDN | Msvm_KvpExchangeComponent | GuestIntrinsicExchangeItems Name Data
Server power status | Msvm_ComputerSystem | EnabledState
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

### Performance data

Here's the server performance data that the appliance collects and sends to Azure.

**Performance counter class** | **Counter** | **Assessment impact**
--- | --- | ---
Hyper-V Hypervisor Virtual Processor | % Guest Run Time | Recommended server size/cost
Hyper-V Dynamic Memory Server | Current Pressure (%)<br/> Guest Visible Physical Memory (MB) | Recommended server size/cost
Hyper-V Virtual Storage Device | Read Bytes/Second | Calculation for disk size, storage cost, server size
Hyper-V Virtual Storage Device | Write Bytes/Second | Calculation for disk size, storage cost, server size
Hyper-V Virtual Network Adapter | Bytes Received/Second | Calculation for server size
Hyper-V Virtual Network Adapter | Bytes Sent/Second | Calculation for server size

- CPU utilization is the sum of all usage, for all virtual processors attached to a server.
- Memory utilization is (Current Pressure * Guest Visible Physical Memory) / 100.
- Disk and network utilization values are collected from the listed Hyper-V performance counters.

## Collected data for Physical servers

The appliance collects configuration, performance metadata, data about installed applications, roles and features (software inventory) and dependency data (if agentless [dependency analysis](concepts-dependency-visualization.md) is enabled) from physical servers or server running on other clouds like AWS, GCP, etc.

### Windows server metadata

Here's the full list of Windows server metadata that the appliance collects and sends to Azure.

**Data** | **WMI class** | **WMI class property**
--- | --- | ---
FQDN | Win32_ComputerSystem | Domain, Name, PartOfDomain
Processor core count | Win32_PRocessor | NumberOfCores
Memory allocated | Win32_ComputerSystem | TotalPhysicalMemory
BIOS serial number | Win32_ComputerSystemProduct | IdentifyingNumber
BIOS GUID | Win32_ComputerSystemProduct | UUID
Boot type | Win32_DiskPartition | Check for partition with Type = **GPT:System** for EFI/BIOS
OS name | Win32_OperatingSystem | Caption
OS version |Win32_OperatingSystem | Version
OS architecture | Win32_OperatingSystem | OSArchitecture
Disk count | Win32_DiskDrive | Model, Size, DeviceID, MediaType, Name
Disk size | Win32_DiskDrive | Size
NIC list | Win32_NetworkAdapterConfiguration | Description, Index
NIC IP address | Win32_NetworkAdapterConfiguration | IPAddress
NIC MAC address | Win32_NetworkAdapterConfiguration | MACAddress

### Windows server performance data

Here's the Windows server performance data that the appliance collects and sends to Azure.

**Data** | **WMI class** | **WMI class property**
--- | --- | ---
CPU usage | Win32_PerfFormattedData_PerfOS_Processor | PercentIdleTime
Memory usage | Win32_PerfFormattedData_PerfOS_Memory | AvailableMBytes
NIC count | Win32_PerfFormattedData_Tcpip_NetworkInterface | Get the network device count.
Data received per NIC | Win32_PerfFormattedData_Tcpip_NetworkInterface  | BytesReceivedPerSec
Data transmitted per NIC | BWin32_PerfFormattedData_Tcpip_NetworkInterface | BytesSentPersec
Disk count | BWin32_PerfFormattedData_PerfDisk_PhysicalDisk | Count of disks
Disk details | Win32_PerfFormattedData_PerfDisk_PhysicalDisk | DiskWritesPerSec, DiskWriteBytesPerSec, DiskReadsPerSec, DiskReadBytesPerSec.

### Linux server metadata

Here's the full list of Linux server metadata that the appliance collects and sends to Azure.

**Data** | **Commands**
--- | ---
FQDN | cat /proc/sys/kernel/hostname, hostname -f
Processor core count |  cat/proc/cpuinfo \| awk '/^processor/{print $3}' \| wc -l
Memory allocated | cat /proc/meminfo \| grep MemTotal \| awk '{printf "%.0f", $2/1024}'
BIOS serial number | lshw \| grep "serial:" \| head -n1 \| awk '{print $2}' <br/> /usr/sbin/dmidecode -t 1 \| grep 'Serial' \| awk '{ $1="" ; $2=""; print}'
BIOS GUID | cat /sys/class/dmi/id/product_uuid
Boot type | [ -d /sys/firmware/efi ] && echo EFI \|\| echo BIOS
OS name/version | We access these files for the OS version and name:<br/><br/> /etc/os-release<br/> /usr/lib/os-release <br/> /etc/enterprise-release <br/> /etc/redhat-release<br/> /etc/oracle-release<br/>  /etc/SuSE-release<br/>  /etc/lsb-release  <br/> /etc/debian_version
OS architecture | uname -m
Disk count | fdisk -l \| egrep 'Disk.*bytes' \| awk '{print $2}' \| cut -f1 -d ':'
Boot disk | df /boot \| sed -n 2p \| awk '{print $1}'
Disk size | fdisk -l \| egrep 'Disk.*bytes' \| egrep $disk: \| awk '{print $5}'
NIC list | ip -o -4 addr show \| awk '{print $2}'
NIC IP address | ip addr show $nic \| grep inet \| awk '{print $2}' \| cut -f1 -d "/" 
NIC MAC address | ip addr show $nic \| grep ether  \| awk '{print $2}'

### Linux server performance data

Here's the Linux server performance data that the appliance collects and sends to Azure.

| **Data** | **Commands** |
| --- | --- |
| CPU usage | cat /proc/stat/ \| grep 'cpu' /proc/stat |
| Memory usage | free \| grep Mem \| awk '{print $3/$2 * 100.0}' |
| NIC count | lshw -class network \| grep eth[0-60] \| wc -l |
| Data received per NIC | cat /sys/class/net/eth$nic/statistics/rx_bytes |
| Data transmitted per NIC | cat /sys/class/net/eth$nic/statistics/tx_bytes |
| Disk count | fdisk -l \| egrep 'Disk.\*bytes' \| awk '{print $2}' \| cut -f1 -d ':' |
| Disk details | cat /proc/diskstats |

## Software inventory data

The appliance collects data about installed applications, roles and features (software inventory) from servers running in VMware environment/Hyper-V environment/physical servers or servers running on other clouds like AWS, GCP etc.

### Windows server applications data

Here's the software inventory data that the appliance collects from each discovered Windows server:

**Data** | **Registry Location** | **Key**
--- | --- | ---
Application Name  | HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* <br/> HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*  | DisplayName
Version  | HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*  <br/> HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*  | DisplayVersion
Provider  | HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*  <br/> HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*  | Publisher

### Windows server features data

Here's the features data that the appliance collects from each discovered Windows server:

**Data**  | **PowerShell cmdlet** | **Property**
--- | --- | ---
Name  | Get-WindowsFeature  | Name
Feature Type | Get-WindowsFeature  | FeatureType
Parent  | Get-WindowsFeature  | Parent

### Windows server operating system data

Here's the operating system data that the appliance collects from each discovered Windows server:

**Data**  | **WMI class**  | **WMI Class Property**
--- | --- | ---
Name  | Win32_operatingsystem  | Caption
Version  | Win32_operatingsystem  | Version
Architecture  | Win32_operatingsystem  | OSArchitecture

### SQL Server metadata

Here's the SQL Server data that the appliance collects from each discovered Windows server:

**Data**  | **Registry Location**  | **Key**
--- | --- | ---
Name  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL  | installedInstance
Edition  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\\\<InstanceName>\Setup  | Edition
Service Pack  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\\\<InstanceName>\Setup  | SP
Version  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\\\<InstanceName>\Setup  | Version

### Linux server application data

Here's the software inventory data that the appliance collects from each discovered Linux server. Based on the operating system of the server, one or more of the commands are run.

**Data**  | **Commands**
--- | ---
Name | rpm, dpkg-query, snap
Version | rpm, dpkg-query, snap
Provider | rpm, dpkg-query, snap

### Linux server operating system data

Here's the operating system data that the appliance collects from each discovered Linux server:

**Data**  | **Commands**
--- | ---
Name <br/> version | Gathered from one or more of the following files:<br/> <br/>/etc/os-release  <br> /usr/lib/os-release  <br> /etc/enterprise-release  <br> /etc/redhat-release  <br> /etc/oracle-release  <br> /etc/SuSE-release  <br> /etc/lsb-release  <br> /etc/debian_version
Architecture | uname

## SQL Server instances and databases data

Azure Migrate appliance used for discovery of VMware VMs can also collect data on SQL Server instances and databases.

### SQL database metadata

**Database Metadata** |	**Views/ SQL Server properties**
--- | ---
Unique identifier of the database | sys.databases
Server defined database ID | sys.databases
Name of the database | sys.databases
Compatibility level of database | sys.databases
Collation name of database | sys.databases
State of the database | sys.databases
Size of the database (in MBs) | sys.master_files
Drive letter of location containing data files | SERVERPROPERTY, and Software\Microsoft\MSSQLServer\MSSQLServer
List of database files | sys.databases, sys.master_files
Service broker is enabled or not | sys.databases
Database is enabled for change data capture or not | sys.databases
Always On Availability Group databases and states | sys.dm_hadr_database_replica_states 


### SQL Server metadata

**Server Metadata** | **Views/ SQL server properties**
--- | ---
Server name |SERVERPROPERTY
FQDN | Connection string derived from discovery of installed applications
Install ID | sys.dm_server_registry
Server version | SERVERPROPERTY
Server edition | SERVERPROPERTY
Server host platform (Windows/Linux) | SERVERPROPERTY
Product level of the server (RTM SP CTP) | SERVERPROPERTY
Default Backup path | SERVERPROPERTY
Default path of the data files | SERVERPROPERTY, and Software\Microsoft\MSSQLServer\MSSQLServer
Default path of the log files | SERVERPROPERTY, and Software\Microsoft\MSSQLServer\MSSQLServer
No. of cores on the server | sys.dm_os_schedulers, sys.dm_os_sys_info
Server collation name | SERVERPROPERTY
No. of cores on the server with VISIBLE ONLINE status | sys.dm_os_schedulers
Unique Server ID | sys.dm_server_registry
HA enabled or not | SERVERPROPERTY
Buffer Pool Extension enabled or not | sys.dm_os_buffer_pool_extension_configuration
Failover cluster configured or not | SERVERPROPERTY
Server using Windows Authentication mode only | SERVERPROPERTY
Server installs PolyBase | SERVERPROPERTY
No. of logical CPUs on the system | sys.dm_server_registry, sys.dm_os_sys_info
Ratio of the no of logical or physical cores that are exposed by one physical processor package | sys.dm_os_schedulers, sys.dm_os_sys_info
No of physical CPUs on the system |	sys.dm_os_schedulers, sys.dm_os_sys_info
Date and time server last started | sys.dm_server_registry
Max server memory use (in MBs) | sys.dm_os_process_memory
Total no. of users across all databases | sys.databases, sys.logins
Total size of all user databases | sys.databases
Size of temp database | sys.master_files, sys.configurations, sys.dm_os_sys_info
No. of logins | sys.logins
List of linked servers | sys.servers
List of agent job |	[msdb].[dbo].[sysjobs], [sys].[syslogins], [msdb].[dbo].[syscategories]
Always On Availability Groups, Replicas, and their states | sys.availability_groups, sys.dm_hadr_availability_group_states, sys.availability_group_listeners, sys.availability_group_listener_ip_addresses, sys.availability_replicas, sys.dm_hadr_availability_replica_states 
Always On Failover Clustered Instance | sys.dm_hadr_cluster, sys.dm_hadr_cluster_members, sys.dm_hadr_cluster_networks 

### Performance metadata

**Performance** | **Views/ SQL server properties** | **Assessment Impact**
--- | --- | ---
SQL Server CPU utilization| sys.dm_os_ring_buffers| Recommended SKU size (CPU dimension)
SQL logical CPU count| sys.dm_os_sys_info| Recommended SKU size (CPU dimension)
SQL physical memory in use| sys.dm_os_process_memory| Unused
SQL memory utilization percentage| sys.dm_os_process_memory | Unused
Database CPU utilization| sys.dm_exec_query_stats, sys.dm_exec_plan_attributes| Recommended SKU size (CPU dimension)
Database memory in use (buffer pool)| sys.dm_os_buffer_descriptors| Recommended SKU size (Memory dimension)
File read/write IO| sys.dm_io_virtual_file_stats, sys.master_files| Recommended SKU size (IO dimension)
File num of reads/writes| sys.dm_io_virtual_file_stats, sys.master_files| Recommended SKU size (Throughput dimension)
File IO stall read/write (ms)| sys.dm_io_virtual_file_stats, sys.master_files| Recommended SKU size (IO latency dimension)
File size| sys.master_files| Recommended SKU size (Storage dimension)

## ASP.NET web apps data

Azure Migrate appliance used for discovery of VMware VMs can also collect data on ASP.NET web applications.

> [!Note]
> Currently this feature is only available for servers running in your VMware environment.

Here's the web apps configuration data that the appliance collects from each Windows server discovered in your VMware environment.

**Entity** | **Data**
--- | ---
Web apps | Application Name <br/>Configuration Path <br/>Frontend Bindings <br/>Enabled Frameworks <br/>Hosting Web Server<br/>Sub-Applications and virtual applications <br/>Application Pool name <br/>Runtime version <br/>Managed pipeline mode
Web server | Server Name <br/>Server Type (currently only IIS) <br/>Configuration Location <br/>Version <br/>FQDN <br/>Credentials used for discovery <br/>List of Applications

## Application dependency data

Azure Migrate appliance can collect data about inter-server dependencies for servers running in your VMware environment/Hyper-V environment/ physical servers or servers running on other clouds like AWS, GCP etc.

### Windows server dependencies data

Here's the connection data that the appliance collects from each Windows server, which has been enabled for agentless dependency analysis from portal:

**Data** | **Commands**
--- | ---
Local port | netstat
Local IP address | netstat
Remote port | netstat
Remote IP address | netstat
TCP connection state | netstat
Process ID | netstat
Number of active connections | netstat

**Data** | **WMI class** | **WMI class property**
--- | --- | ---
Process name | Win32_Process | ExecutablePath
Process arguments | Win32_Process | CommandLine
Application name | Win32_Process | VersionInfo.ProductName parameter of ExecutablePath property

### Linux server dependencies data

Here's the connection data that the appliance collects from each Linux server, which has been enabled for agentless dependency analysis.

**Data** | **Commands**
--- | ---
Local port | netstat
Local IP address | netstat
Remote port | netstat
Remote IP address | netstat
TCP connection state | netstat
Number of active connections | netstat
Process ID  | netstat
Process name | ps
Process arguments | ps
Application name | dpkg or rpm

## Next steps

- [Learn how](how-to-set-up-appliance-vmware.md) to set up the appliance for VMware.
- [Learn how](how-to-set-up-appliance-hyper-v.md) to set up the appliance for Hyper-V.
- [Learn how](how-to-set-up-appliance-physical.md) to set up the appliance for physical servers.
