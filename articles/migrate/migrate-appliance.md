---
title: Azure Migrate appliance 
description: Provides a summary of support for the Azure Migrate appliance.
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 03/18/2021
---


# Azure Migrate appliance

This article summarizes the prerequisites and support requirements for the Azure Migrate appliance.

## Deployment scenarios

The Azure Migrate appliance is used in the following scenarios.

**Scenario** | **Tool** | **Used to**
--- | --- | ---
**Discovery and assessment of servers running in VMware environment** | Azure Migrate: Discovery and assessment | Discover servers running in your VMware environment<br/><br/> Perform discovery of installed software inventory, agentless dependency analysis and discover SQL Server instances and databases.<br/><br/> Collect server configuration and performance metadata for assessments.
**Agentless migration of servers running in VMware environment** | Azure Migrate:Server Migration | Discover servers running in your VMware environment. <br/><br/> Replicate servers without installing any agents on them.
**Discovery and assessment of servers running in Hyper-V environment** | Azure Migrate: Discovery and assessment | Discover servers running in your Hyper-V environment.<br/><br/> Collect server configuration and performance metadata for assessments.
**Discovery and assessment of physical or virtualized servers on-premises** |  Azure Migrate: Discovery and assessment |  Discover physical or virtualized servers on-premises.<br/><br/> Collect server configuration and performance metadata for assessments.

## Deployment methods

The appliance can be deployed using a couple of methods:

- The appliance can be deployed using a template for servers running in VMware or Hyper-V environment ([OVA template for VMware](how-to-set-up-appliance-vmware.md) or [VHD for Hyper-V](how-to-set-up-appliance-hyper-v.md)).
- If you don't want to use a template, you can deploy the appliance for VMware or Hyper-V environment using a [PowerShell installer script](deploy-appliance-script.md).
- In Azure Government, you should deploy the appliance using a PowerShell installer script. Refer to the steps of deployment [here](deploy-appliance-script-government.md).
- For physical or virtualized servers on-premises or any other cloud, you always deploy the appliance using a PowerShell installer script.Refer to the steps of deployment [here](how-to-set-up-appliance-physical.md).
- Download links are available in the tables below.

## Appliance - VMware

The following table summarizes the Azure Migrate appliance requirements for VMware.

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

**Requirement** | **VMware**
--- | ---
**Permissions** | To access the appliance configuration manager locally or remotely,you need to have a local or domain user account with administrative privileges on the appliance server.
**Appliance services** | The appliance has the following services:<br/><br/> - **Appliance configuration manager**: This is a web application which can be configured with source details to start the discovery and assessment of servers.<br/> - **VMware discovery agent**: The agent collects server configuration metadata which can be used to create as on-premises assessments.<br/>- **VMware assessment agent**: The agent collects server performance metadata which can be used to create performance-based assessments.<br/>- **Auto update service**: The service keeps all the agents running on the appliance up-to-date. It automatically runs once every 24 hours.<br/>- **DRA agent**: Orchestrates server replication, and coordinates communication between replicated servers and Azure. Used only when replicating servers to Azure using agentless migration.<br/>- **Gateway**: Sends replicated data to Azure. Used only when replicating servers to Azure using agentless migration.<br/>- **SQL discovery and assessment agent**: sends the configuration and performance metadata of SQL Server instances and databases to Azure.
**Project limits** |  An appliance can only be registered with a single project.<br/> A single project can have multiple registered appliances.
**Discovery limits** | An appliance can discover up to 10,000 servers running on a vCenter Server.<br/> An appliance can connect to a single vCenter Server.
**Supported deployment** | Deploy as new server running on vCenter Server using OVA template.<br/><br/> Deploy on an existing server running Windows Server 2016 using PowerShell installer script.
**OVA template** | Download from project or from [here](https://go.microsoft.com/fwlink/?linkid=2140333)<br/><br/> Download size is 11.9 GB.<br/><br/> The downloaded appliance template comes with a Windows Server 2016 evaluation license, which is valid for 180 days.<br/>If the evaluation period is close to expiry, we recommend that you download and deploy a new appliance using OVA template , or you activate the operating system license of the appliance server.
**OVA verification** | [Verify](tutorial-discover-vmware.md#verify-security) the OVA template downloaded from project by checking the hash values.
**PowerShell script** | Refer to this [article](./deploy-appliance-script.md#set-up-the-appliance-for-vmware) on how to deploy an appliance using the PowerShell installer script.<br/><br/> 
**Hardware and network requirements** |  The appliance should run on server with Windows Server 2016, 32-GB RAM, 8 vCPUs, around 80 GB of disk storage, and an external virtual switch.<br/> The appliance requires internet access, either directly or through a proxy.<br/><br/> If you deploy the appliance using OVA template, you need enough resources on the vCenter Server to create a server that meets the hardware requirements.<br/><br/> If you run the appliance on an existing server, make sure that it's running Windows Server 2016, and meets hardware requirements.<br/>_(Currently the deployment of appliance is only supported on Windows Server 2016.)_
**VMware requirements** | If you deploy the appliance as a server on vCenter Server, it  must be deployed on a vCenter Server running 5.5, 6.0, 6.5, or 6.7 and an ESXi host running version 5.5 or later.<br/><br/> 
**VDDK (agentless migration)** | To leverage the appliance for agentless migration of servers, the VMware vSphere VDDK must be installed on the appliance server.

## Appliance - Hyper-V

**Requirement** | **Hyper-V**
--- | ---
**Permissions** | To access the appliance configuration manager locally or remotely,you need to have a local or domain user account with administrative privileges on the appliance server.
**Appliance services** | The appliance has the following services:<br/><br/> - **Appliance configuration manager**: This is a web application which can be configured with source details to start the discovery and assessment of servers.<br/> - **Discovery agent**: The agent collects server configuration metadata which can be used to create as on-premises assessments.<br/>- **Assessment agent**: The agent collects server performance metadata which can be used to create performance-based assessments.<br/>- **Auto update service**: The service keeps all the agents running on the appliance up-to-date. It automatically runs once every 24 hours.
**Project limits** |  An appliance can only be registered with a single project.<br/> A single project can have multiple registered appliances.
**Discovery limits** | An appliance can discover up to 5000 servers running in Hyper-V environment.<br/> An appliance can connect to up to 300 Hyper-V hosts.
**Supported deployment** | Deploy as server running on a Hyper-V host using a VHD template.<br/><br/> Deploy on an existing server running Windows Server 2016 using PowerShell installer script.
**VHD template** | Zip file that includes a VHD. Download from project or from [here](https://go.microsoft.com/fwlink/?linkid=2140422).<br/><br/> Download size is 8.91 GB.<br/><br/> The downloaded appliance template comes with a Windows Server 2016 evaluation license, which is valid for 180 days.<br/> If the evaluation period is close to expiry, we recommend that you download and deploy a new appliance, or that you activate the operating system license of the appliance server.
**VHD verification** | [Verify](tutorial-discover-hyper-v.md#verify-security) the VHD template downloaded from project by checking the hash values.
**PowerShell script** | Refer to this [article](./deploy-appliance-script.md#set-up-the-appliance-for-hyper-v) on how to deploy an appliance using the PowerShell installer script.<br/>
**Hardware and network requirements**  |  The appliance should run on server with Windows Server 2016, 16-GB RAM, 8 vCPUs, around 80 GB of disk storage, and an external virtual switch.<br/> The appliance needs a static or dynamic IP address, and requires internet access, either directly or through a proxy.<br/><br/> If you run the appliance as a server running on a Hyper-V host, you need enough resources on the host to create a server that meets the hardware requirements.<br/><br/> If you run the appliance on an existing server, make sure that it's running Windows Server 2016, and meets hardware requirements.<br/>_(Currently the deployment of appliance is only supported on Windows Server 2016.)_
**Hyper-V requirements** | If you deploy the appliance with the VHD template, the appliance provided by Azure Migrate is Hyper-V VM version 5.0.<br/><br/> The Hyper-V host must be running Windows Server 2012 R2 or later.

## Appliance - Physical

**Requirement** | **Physical**
--- | ---
**Permissions** | To access the appliance configuration manager locally or remotely,you need to have a local or domain user account with administrative privileges on the appliance server.
**Appliance services** | The appliance has the following services:<br/><br/> - **Appliance configuration manager**: This is a web application which can be configured with source details to start the discovery and assessment of servers.<br/> - **Discovery agent**: The agent collects server configuration metadata which can be used to create as on-premises assessments.<br/>- **Assessment agent**: The agent collects server performance metadata which can be used to create performance-based assessments.<br/>- **Auto update service**: The service keeps all the agents running on the appliance up-to-date. It automatically runs once every 24 hours.
**Project limits** |  An appliance can only be registered with a single project.<br/> A single project can have multiple registered appliances.<br/>
**Discovery limits** | An appliance can discover up to 1000 physical servers.
**Supported deployment** | Deploy on an existing server running Windows Server 2016 using PowerShell installer script.
**PowerShell script** | Download the script (AzureMigrateInstaller.ps1) in a zip file from the project or from [here](https://go.microsoft.com/fwlink/?linkid=2140334). [Learn more](tutorial-discover-physical.md).<br/><br/> Download size is 85.8 MB.
**Script verification** | [Verify](tutorial-discover-physical.md#verify-security) the PowerShell installer script downloaded from project by checking the hash values.
**Hardware and network requirements** |  The appliance should run on server with Windows Server 2016, 16-GB RAM, 8 vCPUs, around 80 GB of disk storage.<br/> The appliance needs a static or dynamic IP address, and requires internet access, either directly or through a proxy.<br/><br/> If you run the appliance on an existing server, make sure that it's running Windows Server 2016, and meets hardware requirements.<br/>_(Currently the deployment of appliance is only supported on Windows Server 2016.)_

## URL access

The Azure Migrate appliance needs connectivity to the internet.

- When you deploy the appliance, Azure Migrate does a connectivity check to the required URLs.
- You need to allow access to all URLs in the list. If you're doing assessment only, you can skip the URLs that are marked as required for VMware agentless migration.
- If you're using a URL-based proxy to connect to the internet, make sure that the proxy resolves any CNAME records received while looking up the URLs.

### Public cloud URLs

**URL** | **Details**  
--- | --- |
*.portal.azure.com  | Navigate to the Azure portal.
*.windows.net <br/> *.msftauth.net <br/> *.msauth.net <br/> *.microsoft.com <br/> *.live.com <br/> *.office.com | Sign in to your Azure subscription.
*.microsoftonline.com <br/> *.microsoftonline-p.com | Create Azure Active Directory (AD) apps for the appliance to communicate with Azure Migrate.
management.azure.com | Create Azure AD apps for the appliance to communicate with the Azure Migrate.
*.services.visualstudio.com | Upload appliance logs used for internal monitoring.
*.vault.azure.net | Manage secrets in the Azure Key Vault.<br/> Note: Ensure servers to replicate have access to this.
aka.ms/* | Allow access to aka links; used to download and install the latest updates for appliance services.
download.microsoft.com/download | Allow downloads from Microsoft download center.
*.servicebus.windows.net | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com <br/> *.migration.windowsazure.com | Connect to Azure Migrate service URLs.
*.hypervrecoverymanager.windowsazure.com | **Used for VMware agentless migration**<br/><br/> Connect to Azure Migrate service URLs.
*.blob.core.windows.net |  **Used for VMware agentless migration**<br/><br/>Upload data to storage for migration.

### Government cloud URLs

**URL** | **Details**  
--- | --- |
*.portal.azure.us  | Navigate to the Azure portal.
graph.windows.net | Sign in to your Azure subscription.
login.microsoftonline.us  | Create Azure Active Directory (AD) apps for the appliance to communicate with Azure Migrate.
management.usgovcloudapi.net | Create Azure AD apps for the appliance to communicate with the Azure Migrate service.
*.services.visualstudio.com | Upload appliance logs used for internal monitoring.
*.vault.usgovcloudapi.net | Manage secrets in the Azure Key Vault.
aka.ms/* | Allow access to aka links; used to download and install the latest updates for appliance services.
download.microsoft.com/download | Allow downloads from Microsoft download center.
*.servicebus.usgovcloudapi.net  | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.us <br/> *.migration.windowsazure.us | Connect to Azure Migrate service URLs.
*.hypervrecoverymanager.windowsazure.us | **Used for VMware agentless migration**<br/><br/> Connect to Azure Migrate service URLs.
*.blob.core.usgovcloudapi.net  |  **Used for VMware agentless migration**<br/><br/>Upload data to storage for migration.
*.applicationinsights.us | Upload appliance logs used for internal monitoring.  

### Public cloud URLs for private link connectivity

The appliance needs access to the following URLs (directly or via proxy) over and above private link access. 

**URL** | **Details**  
--- | --- | 
*.portal.azure.com  | Navigate to the Azure portal.
*.windows.net <br/> *.msftauth.net <br/> *.msauth.net <br/> *.microsoft.com <br/> *.live.com <br/> *.office.com | Sign in to your Azure subscription.
*.microsoftonline.com <br/> *.microsoftonline-p.com | Create Azure Active Directory (AD) apps for the appliance to communicate with Azure Migrate.
management.azure.com | Create Azure AD apps for the appliance to communicate with the Azure Migrate.
*.services.visualstudio.com (optional) | Upload appliance logs used for internal monitoring.
aka.ms/* (optional) | Allow access to aka links; used to download and install the latest updates for appliance services.
download.microsoft.com/download | Allow downloads from Microsoft download center.
*.servicebus.windows.net | **Used for VMware agentless migration**<br/><br/> Communication between the appliance and the Azure Migrate service.
*.vault.azure.net | **Used for VMware agentless migration**<br/><br/>  Ensure servers to replicate have access to this.
*.hypervrecoverymanager.windowsazure.com | **Used for VMware agentless migration**<br/><br/> Connect to Azure Migrate service URLs.
*.blob.core.windows.net |  **Used for VMware agentless migration**<br/><br/>Upload data to storage for migration.

### Government cloud URLs for private link connectivity   

The appliance needs access to the following URLs (directly or via proxy) over and above private link access. 

**URL** | **Details**  
--- | --- |
*.portal.azure.us  | Navigate to the Azure portal.
graph.windows.net | Sign in to your Azure subscription.
login.microsoftonline.us  | Create Azure Active Directory (AD) apps for the appliance to communicate with Azure Migrate.
management.usgovcloudapi.net | Create Azure AD apps for the appliance to communicate with the Azure Migrate service.
*.services.visualstudio.com (optional) | Upload appliance logs used for internal monitoring.
aka.ms/* (optional) | Allow access to aka links; used to download and install the latest updates for appliance services.
download.microsoft.com/download | Allow downloads from Microsoft download center.
*.servicebus.usgovcloudapi.net  | **Used for VMware agentless migration**<br/><br/> Communication between the appliance and the Azure Migrate service. 
*.vault.usgovcloudapi.net | **Used for VMware agentless migration**<br/><br/> Manage secrets in the Azure Key Vault.
*.hypervrecoverymanager.windowsazure.us | **Used for VMware agentless migration**<br/><br/> Connect to Azure Migrate service URLs.
*.blob.core.usgovcloudapi.net  |  **Used for VMware agentless migration**<br/><br/>Upload data to storage for migration.
*.applicationinsights.us (optional) | Upload appliance logs used for internal monitoring.  

## Collected data - VMware

The appliance collects configuration metadata, performance metadata, and server dependencies data (if agentless [dependency analysis](concepts-dependency-visualization.md) is used).

### Metadata

Metadata discovered by the Azure Migrate appliance helps you to figure out whether servers are ready for migration to Azure, right-size servers, plans costs, and analyze application dependencies. Microsoft doesn't use this data in any license compliance audit.

Here's the full list of server metadata that the appliance collects and sends to Azure.

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
Folder details per server | ((Folder)container).ChildEntity.Type
Datacenter details per server | ((Datacenter)container).VmFolder
Datacenter details per host folder | ((Datacenter)container).HostFolder
Cluster details per host | ((ClusterComputeResource)container).Host
Host details per server | ((HostSystem)container).VM

### Performance data

Here's the performance data that an appliance collects for a server running on VMware and sends to Azure.

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

### Installed software inventory

The appliance collects data about installed software inventory on servers.

#### Windows server software inventory data

Here's the software inventory data that the appliance collects from each Windows server discovered in your VMware environment.

**Data** | **Registry Location** | **Key**
--- | --- | ---
Application Name  | HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* <br/> HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*  | DisplayName
Version  | HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*  <br/> HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*  | DisplayVersion
Provider  | HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*  <br/> HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*  | Publisher

#### Windows server features data

Here's the features data that the appliance collects from each Windows server discovered in your VMware environment.

**Data**  | **PowerShell cmdlet** | **Property**
--- | --- | ---
Name  | Get-WindowsFeature  | Name
Feature Type | Get-WindowsFeature  | FeatureType
Parent  | Get-WindowsFeature  | Parent

#### SQL Server metadata

Here's the SQL Server data that the appliance collects from each Windows server discovered in your VMware environment.

**Data**  | **Registry Location**  | **Key**
--- | --- | ---
Name  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL  | installedInstance
Edition  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\\\<InstanceName>\Setup  | Edition
Service Pack  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\\\<InstanceName>\Setup  | SP
Version  | HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\\\<InstanceName>\Setup  | Version

#### Windows server operating system data

Here's the operating system data that the appliance collects from each Windows server discovered in your VMware environment.

**Data**  | **WMI class**  | **WMI Class Property**
--- | --- | ---
Name  | Win32_operatingsystem  | Caption
Version  | Win32_operatingsystem  | Version
Architecture  | Win32_operatingsystem  | OSArchitecture

#### Linux server software inventory data

Here's the software inventory data that the appliance collects from each Linux server discovered in your VMware environment. Based on the operating system of the server, one or more of the commands are run.

**Data**  | **Commands**
--- | ---
Name | rpm, dpkg-query, snap
Version | rpm, dpkg-query, snap
Provider | rpm, dpkg-query, snap

#### Linux server operating system data

Here's the operating system data that the appliance collects from each Linux server discovered in your VMware environment.

**Data**  | **Commands**
--- | ---
Name <br/> version | Gathered from one or more of the following files:<br/> <br/>/etc/os-release  <br> /usr/lib/os-release  <br> /etc/enterprise-release  <br> /etc/redhat-release  <br> /etc/oracle-release  <br> /etc/SuSE-release  <br> /etc/lsb-release  <br> /etc/debian_version
Architecture | uname

### SQL Server instances and databases data

Appliance collects data on SQL Server instances and databases.

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

#### SQL database metadata

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

#### SQL Server metadata

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


### Application dependency data

Agentless dependency analysis collects the connection and process data.

#### Windows server dependencies data

Here's the connection data that the appliance collects from each Windows server, enabled for agentless dependency analysis.

**Data** | **Commands**
--- | ---
Local port | netstat
Local IP address | netstat
Remote port | netstat
Remote IP address | netstat
TCP connection state | netstat
Process ID | netstat
Number of active connections | netstat

Here's the connection data that the appliance collects from each Windows server, enabled for agentless dependency analysis.

**Data** | **WMI class** | **WMI class property**
--- | --- | ---
Process name | Win32_Process | ExecutablePath
Process arguments | Win32_Process | CommandLine
Application name | Win32_Process | VersionInfo.ProductName parameter of ExecutablePath property

#### Linux server dependencies data

Here's the connection data that the appliance collects from each Linux server, enabled for agentless dependency analysis.

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

## Collected data - Hyper-V

The appliance collects configuration and performance metadata from servers running in Hyper-V environment.

### Metadata
Metadata discovered by the Azure Migrate appliance helps you to figure out whether servers are ready for migration to Azure, right-size servers, and plans costs. Microsoft doesn't use this data in any license compliance audit.

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

## Collected data - Physical

The appliance collects configuration and performance metadata from physical or virtual servers running on-premises.

### Metadata

Metadata discovered by the Azure Migrate appliance helps you to figure out whether servers are ready for migration to Azure, right-size servers, and plans costs. Microsoft doesn't use this data in any license compliance audit.

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

### Linux server metadata

Here's the full list of Linux server metadata that the appliance collects and sends to Azure.

**Data** | **Commands**
--- | ---
FQDN | cat /proc/sys/kernel/hostname, hostname -f
Processor core count |  /proc/cpuinfo \| awk '/^processor/{print $3}' \| wc -l
Memory allocated | cat /proc/meminfo \| grep MemTotal \| awk '{printf "%.0f", $2/1024}'
BIOS serial number | lshw \| grep "serial:" \| head -n1 \| awk '{print $2}' <br/> /usr/sbin/dmidecode -t 1 \| grep 'Serial' \| awk '{ $1="" ; $2=""; print}'
BIOS GUID | cat /sys/class/dmi/id/product_uuid
Boot type | [ -d /sys/firmware/efi ] && echo EFI \|\| echo BIOS
OS name/version | We access these files for the OS version and name:<br/><br/> /etc/os-release<br/> /usr/lib/os-release <br/> /etc/enterprise-release <br/> /etc/redhat-release<br/> /etc/oracle-release<br/>  /etc/SuSE-release<br/>  /etc/lsb-release  <br/> /etc/debian_version
OS architecture | Uname -m
Disk count | fdisk -l \| egrep 'Disk.*bytes' \| awk '{print $2}' \| cut -f1 -d ':'
Boot disk | df /boot \| sed -n 2p \| awk '{print $1}'
Disk size | fdisk -l \| egrep 'Disk.*bytes' \| egrep $disk: \| awk '{print $5}'
NIC list | ip -o -4 addr show \| awk '{print $2}'
NIC IP address | ip addr show $nic \| grep inet \| awk '{print $2}' \| cut -f1 -d "/" 
NIC MAC address | ip addr show $nic \| grep ether  \| awk '{print $2}'

### Windows performance data

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

### Linux performance data

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

## Appliance upgrades

The appliance is upgraded as the Azure Migrate services running on the appliance are updated. This happens automatically, because auto-update is enabled on the appliance by default. You can change this default setting, to update the appliance services manually.

### Turn off auto-update

1. On the server running the appliance, open the Registry Editor.
2. Navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance**.
3. To turn off auto-update, create a registry key **AutoUpdate** key with DWORD value of 0.

    ![Set registry key](./media/migrate-appliance/registry-key.png)


### Turn on auto-update

You can turn on auto-update using either of these methods:

- By deleting the AutoUpdate registry key from HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance.
- Click on **View appliance services** from the latest update checks in the **Set up prerequisites** panel to turn on auto-update.

To delete the registry key:

1. On the server running the appliance, open the Registry Editor.
2. Navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance**.
3. Delete the registry key **AutoUpdate**, that was previously created to turn off auto-update.

To turn on from Appliance Configuration Manager, after discovery is complete:

1. On the appliance configuration manager, go to **Set up prerequisites** panel
2. In the latest updates check, click on **View appliance services** and click on the link to turn on auto-update.

    ![Turn on auto updates](./media/migrate-appliance/autoupdate-off.png)

### Check the appliance services version

You can check the appliance services version using either of these methods:

- In Appliance configuration manager, go to **Set up prerequisites** panel.
- On the appliance, in the **Control Panel** > **Programs and Features**.

To check in the Appliance configuration manager:

1. On the appliance configuration manager, go to **Set up prerequisites** panel
2. In the latest updates check, click on **View appliance services**.

    ![Check version](./media/migrate-appliance/versions.png)

To check in the Control Panel:

1. On the appliance, click **Start** > **Control Panel** > **Programs and Features**
2. Check the appliance services versions in the list.

    ![Check version in Control Panel](./media/migrate-appliance/programs-features.png)

### Manually update an older version

If you are running an older version for any of the services, you must uninstall the service, and manually update to the latest version.

1. To check for the latest appliance service versions, [download](https://aka.ms/latestapplianceservices) the LatestComponents.json file.
2. After downloading, open the LatestComponents.json file in Notepad.
3. Find the latest service version in the file, and the download link for it. For example:

    "Name": "ASRMigrationWebApp", "DownloadLink": "https://download.microsoft.com/download/f/3/4/f34b2eb9-cc8d-4978-9ffb-17321ad9b7ed/MicrosoftAzureApplianceConfigurationManager.msi", "Version": "6.0.211.2", "Md5Hash": "e00a742acc35e78a64a6a81e75469b84"

4. Download the latest version of an outdated service, using the download link in the file.
5. After downloading, run the following command in an administrator command window, to verify the integrity of the downloaded MSI.

    ``` C:\>Get-FileHash -Path <file_location> -Algorithm [Hashing Algorithm] ```
    For example:
    C:\>CertUtil -HashFile C:\Users\public\downloads\MicrosoftAzureApplianceConfigurationManager.MSI MD5

5. Check that the command output matches the hash value entry for the service in the file (for example, the MD5 hash value above).
6. Now, run the MSI to install the service. It's a silent install, and the installation window closes after it's done.
7. After installation is complete, check the version of the service in **Control panel** > **Programs and Features**. The service version should now be upgraded to the latest shown in the json file.

## Next steps

- [Learn how](how-to-set-up-appliance-vmware.md) to set up the appliance for VMware.
- [Learn how](how-to-set-up-appliance-hyper-v.md) to set up the appliance for Hyper-V.
- [Learn how](how-to-set-up-appliance-physical.md) to set up the appliance for physical servers.
