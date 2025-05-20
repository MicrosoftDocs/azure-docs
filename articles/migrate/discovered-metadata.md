---
title: Discovered Metadata
description: Get details about the metadata that the Azure Migrate appliance discovers.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 02/06/2025
ms.custom: engagement-fy25, devx-track-extended-java
---

# Metadata that an Azure Migrate appliance discovers

The Azure Migrate Discovery and Assessment tool uses the lightweight [Azure Migrate appliance](migrate-appliance.md) to discover servers running in your environment and send server configuration and performance metadata to Azure.

This article provides details about the metadata that the Azure Migrate appliance discovers. This metadata helps you assess server readiness for migration to Azure, right-size servers, and plan costs. Microsoft doesn't use this data in any license compliance audit.

## Collected metadata for VMware servers

The appliance collects data about configuration, performance, installed applications, roles, and features (software inventory) from servers running in your VMware environment. It also collects dependency data, if agentless dependency analysis is enabled.

Here's the full list of server metadata that the appliance collects and sends to Azure:

Data | Counter
--- | ---
**Server details** |
Server ID | `vm.Config.InstanceUuid`
Server name | `vm.Config.Name`
vCenter Server ID | `VMwareClient.Instance.Uuid`
Server description | `vm.Summary.Config.Annotation`
License product name | `vm.Client.ServiceContent.About.LicenseProductName`
Operating system type | `vm.SummaryConfig.GuestFullName`
Boot type | `vm.Config.Firmware`
Number of cores | `vm.Config.Hardware.NumCPU`
Memory (MB) | `vm.Config.Hardware.MemoryMB`
Number of disks | `vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualDisk).count`
Disk size list | `vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualDisk)`
Network adapters list | `vm.Config.Hardware.Device.ToList().FindAll(x => is VirtualEthernet).count`
CPU utilization | `cpu.usage.average`
Memory utilization | `mem.usage.average`
Processor model/name | `vm.Config.Hardware.CpuModel`
Number of sockets in a processor | `vm.Config.Hardware.NumCpuPkgs`
**Per-disk details** |
Disk key value | `disk.Key`
Disk unit number | `disk.UnitNumber`
Disk controller key value | `disk.ControllerKey.Value`
Gigabytes provisioned | `virtualDisk.DeviceInfo.Summary`
Disk name | Value generated using `disk.UnitNumber`, `disk.Key`, `disk.ControllerKey.VAlue`
Read operations per second | `virtualDisk.numberReadAveraged.average`
Write operations per second | `virtualDisk.numberWriteAveraged.average`
Read throughput (MB per second) | `virtualDisk.read.average`
Write throughput (MB per second) | `virtualDisk.write.average`
**Per-NIC details** |
Network adapter name | `nic.Key`
MAC address | `((VirtualEthernetCard)nic).MacAddress`
IPv4 addresses | `vm.Guest.Net`
IPv6 addresses | `vm.Guest.Net`
Read throughput (MB per second) | `net.received.average`
Write throughput (MB per second) | `net.transmitted.average`
**Inventory path details** |
Name | `container.GetType().Name`
Type of child object | `container.ChildType`
Reference details | `container.MoRef`
Parent details | `Container.Parent`
Folder details per server | `((Folder)container).ChildEntity.Type`
Datacenter details per server | `((Datacenter)container).VmFolder`
Datacenter details per host folder | `((Datacenter)container).HostFolder`
Cluster details per host | `((ClusterComputeResource)container).Host`
Host details per server | `((HostSystem)container).VM`

### Performance metadata

Here's the performance data that an appliance collects for a server running on VMware and sends to Azure:

Data | Counter | Assessment impact
--- | --- | ---
CPU utilization | `cpu.usage.average` | Recommended server size/cost
Memory utilization | `mem.usage.average` | Recommended server size/cost
Disk read throughput (MB per second) | `virtualDisk.read.average` | Calculation for disk size, storage cost, server size
Disk writes throughput (MB per second) | `virtualDisk.write.average` | Calculation for disk size, storage cost, server size
Disk read operations per second | `virtualDisk.numberReadAveraged.average` | Calculation for disk size, storage cost, server size
Disk writes operations per second | `virtualDisk.numberWriteAveraged.average`  | Calculation for disk size, storage cost, server size
NIC read throughput (MB per second) | `net.received.average` | Calculation for server size
NIC writes throughput (MB per second) | `net.transmitted.average`  |Calculation for server size

## Collected metadata for Hyper-V servers

The appliance collects data about configuration, performance, installed applications, roles, and features (software inventory) from servers running in your Hyper-V environment. It also collects dependency data, if agentless dependency analysis is enabled.

Here's the full list of server metadata that the appliance collects and sends to Azure:

Data | WMI class | WMI class property
--- | --- | ---
**Server details** |
Serial number of BIOS | `Msvm_BIOSElement` | `BIOSSerialNumber`
Server type (Generation 1 or 2) | `Msvm_VirtualSystemSettingData` | `VirtualSystemSubType`
Server display name | `Msvm_VirtualSystemSettingData` | `ElementName`
Server version | `Msvm_ProcessorSettingData` | `VirtualQuantity`
Memory (bytes) | `Msvm_MemorySettingData` | `VirtualQuantity`
Maximum memory that the server can consume | `Msvm_MemorySettingData` | `Limit`
Dynamic memory enabled | `Msvm_MemorySettingData` | `DynamicMemoryEnabled`
Operating system name/version/FQDN | `Msvm_KvpExchangeComponent` | `GuestIntrinsicExchangeItems Name Data`
Server power status | `Msvm_ComputerSystem` | `EnabledState`
**Per-disk details** |
Disk identifier | `Msvm_VirtualHardDiskSettingData` | `VirtualDiskId`
Virtual hard disk type | `Msvm_VirtualHardDiskSettingData` | `Type`
Virtual hard disk size | `Msvm_VirtualHardDiskSettingData` | `MaxInternalSize`
Virtual hard disk parent | `Msvm_VirtualHardDiskSettingData` | `ParentPath`
**Per-NIC details** |
IP addresses (synthetic NICs) | `Msvm_GuestNetworkAdapterConfiguration` | `IPAddresses`
DHCP enabled (synthetic NICs) | `Msvm_GuestNetworkAdapterConfiguration`| `DHCPEnabled`
NIC ID (synthetic NICs) | `Msvm_SyntheticEthernetPortSettingData` | `InstanceID`
NIC MAC address (synthetic NICs) | `Msvm_SyntheticEthernetPortSettingData` | `Address`
NIC ID (legacy NICs) | `MsvmEmulatedEthernetPortSetting Data` | `InstanceID`
NIC MAC ID (legacy NICs) | `MsvmEmulatedEthernetPortSetting Data` | `Address`

### Performance data

Here's the server performance data that the appliance collects and sends to Azure:

Performance counter class | Counter | Assessment impact
--- | --- | ---
Hyper-V hypervisor virtual processor | % Guest Run Time | Recommended server size/cost
Hyper-V dynamic memory server | Current Pressure (%)<br/> Guest Visible Physical Memory (MB) | Recommended server size/cost
Hyper-V virtual storage device | Read Bytes/Second | Calculation for disk size, storage cost, server size
Hyper-V virtual storage device | Write Bytes/Second | Calculation for disk size, storage cost, server size
Hyper-V virtual network adapter | Bytes Received/Second | Calculation for server size
Hyper-V virtual network adapter | Bytes Sent/Second | Calculation for server size

- CPU utilization is the sum of all usage for all virtual processors attached to a server.
- Memory utilization is (Current Pressure * Guest Visible Physical Memory) / 100.
- Disk and network utilization values are collected from the listed Hyper-V performance counters.

## Collected data for physical servers

The appliance collects data about configuration, performance, installed applications, roles, and features (software inventory) from physical servers or from servers running on other clouds (like AWS or GCP). It also collects dependency data if agentless [dependency analysis](concepts-dependency-visualization.md) is enabled.

### Windows server metadata

Here's the full list of Windows server metadata that the appliance collects and sends to Azure:

Data | WMI class | WMI class property
--- | --- | ---
FQDN | `Win32_ComputerSystem` | `Domain`, `Name`, `PartOfDomain`
Processor core count | `Win32_PRocessor` | `NumberOfCores`
Memory allocated | `Win32_ComputerSystem` | `TotalPhysicalMemory`
BIOS serial number | `Win32_ComputerSystemProduct` | `IdentifyingNumber`
BIOS GUID | `Win32_ComputerSystemProduct` | `UUID`
Boot type | `Win32_DiskPartition` | Check for partition with `Type = GPT:System` for EFI/BIOS
OS name | `Win32_OperatingSystem` | `Caption`
OS version |`Win32_OperatingSystem` | `Version`
OS architecture | `Win32_OperatingSystem` | `OSArchitecture`
Disk count | `Win32_DiskDrive` | `Model`, `Size`, `DeviceID`, `MediaType`, `Name`
Disk size | `Win32_DiskDrive` | `Size`
NIC list | `Win32_NetworkAdapterConfiguration` | `Description`, `Index`
NIC IP address | `Win32_NetworkAdapterConfiguration` | `IPAddress`
NIC MAC address | `Win32_NetworkAdapterConfiguration` | `MACAddress`

### Windows server performance data

Here's the Windows server performance data that the appliance collects and sends to Azure:

Data | WMI class | WMI class property
--- | --- | ---
CPU usage | `Win32_PerfFormattedData_PerfOS_Processor` | `PercentIdleTime`
Memory usage | `Win32_PerfFormattedData_PerfOS_Memory` | `AvailableMBytes`
NIC count | `Win32_PerfFormattedData_Tcpip_NetworkInterface` | Network device count
Data received per NIC | `Win32_PerfFormattedData_Tcpip_NetworkInterface`  | `BytesReceivedPerSec`
Data transmitted per NIC | `BWin32_PerfFormattedData_Tcpip_NetworkInterface` | `BytesSentPersec`
Disk count | `BWin32_PerfFormattedData_PerfDisk_PhysicalDisk` | Count of disks
Disk details | `Win32_PerfFormattedData_PerfDisk_PhysicalDisk` | `DiskWritesPerSec`, `DiskWriteBytesPerSec`, `DiskReadsPerSec`, `DiskReadBytesPerSec`

### Linux server metadata

Here's the full list of Linux server metadata that the appliance collects and sends to Azure:

Data | Commands
--- | ---
FQDN | `cat /proc/sys/kernel/hostname, hostname -f`
Processor core count |  `cat /proc/cpuinfo \| awk '/^processor/{print $3}' \| wc -l`
Memory allocated | `cat /proc/meminfo \| grep MemTotal \| awk '{printf "%.0f", $2/1024}'`
BIOS serial number | `lshw \| grep "serial:" \| head -n1 \| awk '{print $2}'` <br/> `/usr/sbin/dmidecode -t 1 \| grep 'Serial' \| awk '{ $1="" ; $2=""; print}'`
BIOS GUID | `cat /sys/class/dmi/id/product_uuid`
Boot type | `[ -d /sys/firmware/efi ] && echo EFI \|\| echo BIOS`
OS name/version | We access these files for the OS version and name:<br/><br/> `/etc/os-release`<br/> `/usr/lib/os-release` <br/> `/etc/enterprise-release` <br/> `/etc/redhat-release`<br/> `/etc/oracle-release`<br/>  `/etc/SuSE-release`<br/>  `/etc/lsb-release`  <br/> `/etc/debian_version`
OS architecture | `uname -m`
Disk count | `fdisk -l \| egrep 'Disk.*bytes' \| awk '{print $2}' \| cut -f1 -d ':'`
Boot disk | `df /boot \| sed -n 2p \| awk '{print $1}'`
Disk size | `fdisk -l \| egrep 'Disk.*bytes' \| egrep $disk: \| awk '{print $5}'`
NIC list | `ip -o -4 addr show \| awk '{print $2}'`
NIC IP address | `ip addr show $nic \| grep inet \| awk '{print $2} \| cut -f1 -d "/"`
NIC MAC address | `ip addr show $nic \| grep ether  \| awk '{print $2}'`

### Linux server performance data

Here's the Linux server performance data that the appliance collects and sends to Azure:

Data | Commands
--- | ---
CPU usage | `cat /proc/stat/ \| grep 'cpu' /proc/stat`
Memory usage | `free \| grep Mem \| awk '{print $3/$2 * 100.0}'`
NIC count | `lshw -class network \| grep eth[0-60] \| wc -l`
Data received per NIC | `cat /sys/class/net/eth$nic/statistics/rx_bytes`
Data transmitted per NIC | `cat /sys/class/net/eth$nic/statistics/tx_bytes`
Disk count | `fdisk -l \| egrep 'Disk.*bytes' \| awk '{print $2}' \| cut -f1 -d ':'`
Disk details | `cat /proc/diskstats`

## Software inventory data

The appliance collects data about installed applications, roles, and features (software inventory) from servers running in a VMware environment or Hyper-V environment, from physical servers, or from servers running on other clouds (like AWS or GCP).

### Windows server application data

Here's the software inventory data that the appliance collects from each discovered Windows server:

Data | Registry location | Key
--- | --- | ---
Application name  | `HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*` <br/> `HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*`  | `DisplayName`
Version  | `HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*`  <br/> `HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*`  | `DisplayVersion`
Provider  | `HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*`  <br/> `HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*`  | `Publisher`

### Windows server feature data

Here's the feature data that the appliance collects from each discovered Windows server:

Data  | PowerShell cmdlet | Property
--- | --- | ---
Name  | `Get-WindowsFeature`  | `Name`
Feature type | `Get-WindowsFeature`  | `FeatureType`
Parent  | `Get-WindowsFeature`  | `Parent`

### Windows server operating system data

Here's the operating system data that the appliance collects from each discovered Windows server:

Data  | WMI class  | WMI class property
--- | --- | ---
Name  | `Win32_operatingsystem`  | `Caption`
Version  | `Win32_operatingsystem`  | `Version`
Architecture  | `Win32_operatingsystem`  | `OSArchitecture`

### SQL Server data

Here's the SQL Server data that the appliance collects from each discovered Windows server:

Data  | Registry location  | Key
--- | --- | ---
Name  | `HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL`  | `installedInstance`
Edition  | `HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\<InstanceName>\Setup`  | `Edition`
Service pack  | `HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\<InstanceName>\Setup`  | `SP`
Version  | `HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\<InstanceName>\Setup`  | `Version`

### Linux server application data

Here's the software inventory data that the appliance collects from each discovered Linux server. Based on the operating system of the server, one or more of the commands are run.

Data  | Commands
--- | ---
Name | `rpm`, `dpkg-query`, `snap`
Version | `rpm`, `dpkg-query`, `snap`
Provider | `rpm`, `dpkg-query`, `snap`

### Linux server operating system data

Here's the operating system data that the appliance collects from each discovered Linux server:

Data  | Commands
--- | ---
Name/version | Gathered from one or more of the following files:<br/> <br/>`/etc/os-release`  <br> `/usr/lib/os-release`  <br> `/etc/enterprise-release`  <br> `/etc/redhat-release`  <br> `/etc/oracle-release`  <br> `/etc/SuSE-release`  <br> `/etc/lsb-release`  <br> `/etc/debian_version`
Architecture | `uname`

## SQL Server instance and database data

The Azure Migrate appliance that's used for discovery of VMware VMs can also collect data on SQL Server instances and databases.

### SQL database metadata

Database metadata |  Views/ SQL Server properties
--- | ---
Unique identifier of the database | `sys.databases`
Server-defined database ID | `sys.databases`
Name of the database | `sys.databases`
Compatibility level of the database | `sys.databases`
Collation name of the database | `sys.databases`
State of the database | `sys.databases`
Size of the database (in MB) | `sys.master_files`
Drive letter of the location that contains data files | `SERVERPROPERTY`, `Software\Microsoft\MSSQLServer\MSSQLServer`
List of database files | `sys.databases`, `sys.master_files`
Service broker is enabled or not | `sys.databases`
Database is enabled for change data capture or not | `sys.databases`
Always On availability group databases and states | `sys.dm_hadr_database_replica_states`

### SQL Server metadata

Server metadata | Views/ SQL server properties
--- | ---
Server name |`SERVERPROPERTY`
FQDN | Connection string derived from discovery of installed applications
Installation ID | `sys.dm_server_registry`
Server version | `SERVERPROPERTY`
Server edition | `SERVERPROPERTY`
Server host platform (Windows/Linux) | `SERVERPROPERTY`
Product level of the server (RTM SP CTP) | `SERVERPROPERTY`
Default backup path | `SERVERPROPERTY`
Default path of the data files | `SERVERPROPERTY`, `Software\Microsoft\MSSQLServer\MSSQLServer`
Default path of the log files | `SERVERPROPERTY`, `Software\Microsoft\MSSQLServer\MSSQLServer`
No. of cores on the server | `sys.dm_os_schedulers`, `sys.dm_os_sys_info`
Server collation name | `SERVERPROPERTY`
No. of cores on the server with `VISIBLE ONLINE` status | `sys.dm_os_schedulers`
Unique server ID | `sys.dm_server_registry`
High availability enabled or not | `SERVERPROPERTY`
Buffer pool extension enabled or not | `sys.dm_os_buffer_pool_extension_configuration`
Failover cluster configured or not | `SERVERPROPERTY`
Server using Windows Authentication mode only | `SERVERPROPERTY`
Server installs PolyBase | `SERVERPROPERTY`
No. of logical CPUs on the system | `sys.dm_server_registry`, `sys.dm_os_sys_info`
Ratio of the no. of logical or physical cores that are exposed by one physical processor package | `sys.dm_os_schedulers`, `sys.dm_os_sys_info`
No. of physical CPUs on the system |  `sys.dm_os_schedulers`, `sys.dm_os_sys_info`
Date and time server last started | `sys.dm_server_registry`
Maximum server memory use (in MB) | `sys.dm_os_process_memory`
Total no. of users across all databases | `sys.databases`, `sys.logins`
Total size of all user databases | `sys.databases`
Size of temporary database | `sys.master_files`, `sys.configurations`, `sys.dm_os_sys_info`
No. of logins | `sys.logins`
List of linked servers | `sys.servers`
List of agent jobs |  `[msdb].[dbo].[sysjobs]`, `[sys].[syslogins]`, `[msdb].[dbo].[syscategories]`
Always On availability groups, replicas, and their states | `sys.availability_groups`, `sys.dm_hadr_availability_group_states`, `sys.availability_group_listeners`, `sys.availability_group_listener_ip_addresses`, `sys.availability_replicas`, `sys.dm_hadr_availability_replica_states`
Always On failover clustered instance | `sys.dm_hadr_cluster`, `sys.dm_hadr_cluster_members`, `sys.dm_hadr_cluster_networks`

### Performance metadata

Performance | Views/ SQL server properties | Assessment impact
--- | --- | ---
SQL Server CPU utilization| `sys.dm_os_ring_buffers`| Recommended SKU size (CPU dimension)
SQL logical CPU count| `sys.dm_os_sys_info`| Recommended SKU size (CPU dimension)
SQL physical memory in use| `sys.dm_os_process_memory`| Unused
SQL memory utilization percentage| `sys.dm_os_process_memory` | Unused
Database CPU utilization| `sys.dm_exec_query_stats`, `sys.dm_exec_plan_attributes`| Recommended SKU size (CPU dimension)
Database memory in use (buffer pool)| `sys.dm_os_buffer_descriptors`| Recommended SKU size (Memory dimension)
File read/write I/O| `sys.dm_io_virtual_file_stats`, `sys.master_files`| Recommended SKU size (I/O dimension)
File number of reads/writes| `sys.dm_io_virtual_file_stats`, `sys.master_files`| Recommended SKU size (throughput dimension)
File I/O stall read/write (ms)| `sys.dm_io_virtual_file_stats`, `sys.master_files`| Recommended SKU size (I/O latency dimension)
File size| `sys.master_files`| Recommended SKU size (storage dimension)

## ASP.NET web app data

The Azure Migrate appliance that's used for discovery of VMs can also collect data on ASP.NET web applications.

Here's the ASP.NET web app configuration data that the appliance collects from each Windows server discovered in your environment:

Entity | Data
--- | ---
Web app | Application name <br/>Configuration path <br/>Front-end bindings <br/>Enabled frameworks <br/>Hosting web server<br/>Sub-applications and virtual applications <br/>Application pool name <br/>Runtime version <br/>Managed pipeline mode
Web server | Server name <br/>Server type (currently only IIS) <br/>Configuration location <br/>Version <br/>FQDN <br/>Credentials used for discovery <br/>List of applications

## Java web app data

The Azure Migrate appliance that's used for discovery of VMs can also collect data on Java web applications.

Here's the Java web app configuration data that the appliance collects from each Windows server discovered in your environment:

Entity | Data
--- | ---
Web app | Application name <br/> Web server ID <br/> Web server name <br/> Display name<br/> Directories <br/>Configurations <br/>Bindings <br/>Discovered frameworks (might contain JVM version) <br/>Requests (CPU requests) <br/>Limits (CPU limits) <br/> Workload type <br/> Application scratch path <br/>Static folders
Web server | OS type <br/> OS name<br/> OS version <br/> OS architecture<br/> Host name <br/> `CATALINA_HOME` <br/> Tomcat version <br/>JVM version<br/> Username <br/> User ID<br/> Group name<br/> Group ID

## Spring Boot web app data

The Azure Migrate appliance that's used for discovery of VMs can also collect data on Spring Boot web applications.

Here's the Spring Boot web app configuration data that the appliance collects from each Windows server discovered in your environment:

Entity | Data
--- | ---
Web app | Application name <br/>Maven artifact name <br/>JAR file location <br/>JAR file checksum <br/>JAR file size<br/>Spring Boot version<br/>Maven build JDK version <br/> Application property files <br/>Certificate file names <br/> Static content location <br/> Application port <br/> Binding ports (including app port) <br/> Logging configuration <br/> JAR file last modified time
OS runtime | OS installed JDK version <br/> JVM options <br/> JVM heap memory <br/> OS name <br/> OS version <br/> Environment variables

## Application dependency data

The Azure Migrate appliance can collect data about inter-server dependencies for servers running in your VMware environment or Hyper-V environment, for physical servers, or for servers running on other clouds (like AWS or GCP).

### Windows server dependency data

Here's the connection data that the appliance collects from each Windows server that's enabled for agentless dependency analysis from the portal:

Data | Command
--- | ---
Local port | `netstat`
Local IP address | `netstat`
Remote port | `netstat`
Remote IP address | `netstat`
TCP connection state | `netstat`
Process ID | `netstat`
Number of active connections | `netstat`

Data | WMI class | WMI class property
--- | --- | ---
Process name | `Win32_Process` | `ExecutablePath`
Process arguments | `Win32_Process` | `CommandLine`
Application name | `Win32_Process` | `VersionInfo.ProductName` parameter of the `ExecutablePath` property

### Linux server dependency data

Here's the connection data that the appliance collects from each Linux server that's enabled for agentless dependency analysis:

Data | Command
--- | ---
Local port | `netstat`
Local IP address | `netstat`
Remote port | `netstat`
Remote IP address | `netstat`
TCP connection state | `netstat`
Number of active connections | `netstat`
Process ID  | `netstat`
Process name | `ps`
Process arguments | `ps`
Application name | `dpkg` or `rpm`

## Related content

- [Set up an appliance for servers in a VMware environment](how-to-set-up-appliance-vmware.md)
- [Set up an appliance for servers on Hyper-V](how-to-set-up-appliance-hyper-v.md)
- [Set up an appliance for physical servers](how-to-set-up-appliance-physical.md)
