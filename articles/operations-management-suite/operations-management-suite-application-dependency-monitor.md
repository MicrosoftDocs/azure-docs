<properties
   pageTitle="Application Dependency Monitor (ADM) in Operations Management Suite (OMS) | Microsoft Azure"
   description="Application Dependency Monitor (ADM) is an Operations Management Suite (OMS) solution that automatically discovers application components on Windows and Linux systems and maps the communication between services.  This article provides details for deploying ADM in your environment and using it in a variety of scenarios."
   services="operations-management-suite"
   documentationCenter=""
   authors="daseidma"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/26/2016"
   ms.author="daseidma;bwren" />

# Application Dependency Monitor solution in Operations Management Suite (OMS)
![Alert Management icon](media/operations-management-suite-application-dependency-monitor/icon.png) Application Dependency Monitor (ADM) is an Operations Management Suite (OMS) solution that automatically discovers application components on Windows and Linux systems and maps the communication between services. It allows you to view your servers as you think of them – as interconnected systems that rely on other systems to deliver critical services.  Application Dependency Monitor shows connections between servers, processes, and ports across any TCP-connected architecture with no configuration required other than installation of an agent.

>[AZURE.NOTE]Application Dependency Monitor is currently in private preview.  You can request access to the ADM private preview at [https://www.surveymonkey.com/r/MGNQRG2](https://www.surveymonkey.com/r/MGNQRG2).
>
>During private preview, all OMS accounts have unlimited access to ADM, and ADM nodes are free.  Log Analytics data for AdmComputer_CL and AdmProcess_CL types will still be metered like any other solution.
>
>After ADM enters public preview, it will be available only to free and paid customers of Insight & Analytics in the OMS Pricing Plan.  Free tier accounts will be limited to 5 ADM nodes.  If you are participating in the private preview and are not enrolled in the OMS Pricing Plan when ADM enters public preview, ADM will be disabled at that time. 




## Use Cases: Make Your IT Processes Dependency Aware

### Discovery
ADM automatically builds a common reference map of dependencies across your servers, processes, and 3rd party services.  It discovers and maps all TCP dependencies, identifying surprise connections, remote 3rd party systems you depend on, and dependencies to traditional dark areas of your network such as DNS and AD.  ADM discovers failed network connections that your managed systems are attempting to make, helping you identify potential server misconfiguration, service outages, and network issues.

### Incident Management
ADM helps eliminate the guesswork of problem isolation by showing you how systems are connected and affecting each other.  In addition to failed connections, information about connected clients help identify misconfigured load balancers, surprising or excessive load on critical services, and rogue clients such as developer machines talking to production systems.  Integrated workflows with OMS Change Tracking also allows you to see whether a change event on a back-end machine or service explains the root cause of an incident.

### Migration Assurance
ADM allows you to effectively plan, accelerate, and validate Azure migrations, ensuring that nothing is left behind and there are no surprise outages.  You can discover all interdependent systems that need to migrate together, assess system configuration and capacity, and identify whether a running system is still serving users or is a candidate for decommissioning instead of migration.  After the move is done, you can check on client load and identity to verify that test systems and customers are connecting.  If your subnet planning and firewall definitions have issues, failed connections in ADM maps will point you to the systems that need connectivity.

### Business Continuity
If you are using Azure Site Recovery and need help defining the recovery sequence for your application environment, ADM can automatically show you how systems rely on each other to ensure that your recovery plan is reliable.  By choosing a critical server and viewing its clients, you can identify the front-end systems that should be recovered only after that critical server is restored and available.  Conversely, by looking at a critical server’s back-end dependencies, you can identify those systems that must be recovered before your focus system is restored.

### Patch Management
ADM enhances your use of OMS System Update Assessment by showing you which other teams and servers depend on your service, so you can notify them in advance before you take your systems down for patching.  ADM also enhances patch management in OMS by showing you whether your services are available and properly connected after they are patched and restarted. 


## Using Application Dependency Monitor

### Mapping Overview
ADM agents gather information about all TCP-connected processes on the server where they’re installed, as well as details about the inbound and outbound connections for each process.  Using the Machine List on the left side of the ADM solution, machines with ADM agents can be selected to visualize their dependencies over a selected time range.  Machine dependency maps focus on a specific machine, and show all the machines that are direct TCP clients or servers of that machine.

![ADM overview](media/operations-management-suite-application-dependency-monitor/adm-overview.png)

Machines can be expanded in the map to show the running processes with active network connections during the selected time range.  When a remote machine with an ADM agent is expanded to show process details, only those processes communicating with the focus machine are shown.  The count of agentless front-end machines connecting into the focus machine is indicated on the left side of the processes they connect to.  If the focus machine is making a connection to a back-end machine without an agent, that back-end is represented with a node in the map that shows its IPv4 address, and the node can be expanded to show individual ports and services that the focus machine is communicating with.

By default, ADM maps show the last 10 minutes of dependency information.  Using the time controls in the upper left, maps can be queried for historical time ranges, up to one-hour wide, to show how dependencies looked in the past, e.g. during an incident or before a change occurred.    ADM data is stored for 30 days in paid workspaces, and for 7 days in free workspaces.

![Machine map with selected machine properties](media/operations-management-suite-application-dependency-monitor/machine-map.png)

### Failed Connections
Failed Connections are shown in ADM maps for processes and computers, with a dashed red line showing if a client system is failing to reach a process or port.  Failed connections are reported from any system with a deployed ADM agent if that system is the one attempting the failed connection.  ADM measures this by observing TCP sockets that fail to establish a connection.  This could be due to a firewall, a misconfiguration in the client or server, or a remote service being unavailable. 

![Failed connections](media/operations-management-suite-application-dependency-monitor/failed-connections.png)

Understanding failed connections can help with troubleshooting, migration validation, security analysis, and overall architectural understanding.  Sometimes failed connections are harmless, but they often point directly to a problem, such as a failover environment suddenly becoming unreachable, or two application tiers not being able to talk after a cloud migration. 

### Computer and Process Properties
When navigating an ADM map, you can select machines and processes to gain additional context about their properties.  Machines provide information about DNS name, IPv4 addresses, CPU and Memory capacity, VM Type, Operating System version, Last Reboot time, and the IDs of their OMS and ADM agents.

Process	 details are gathered from Operating System metadata about running processes, including process name, process description, user name and domain (on Windows), company name, product name, product version, working directory, command line, and process start time.

![Process properties](media/operations-management-suite-application-dependency-monitor/process-properties.png)

The Process Summary panel provides additional information about that process’s connectivity, including its bound ports, inbound and outbound connections, and failed connections. 

![Process summary](media/operations-management-suite-application-dependency-monitor/process-summary.png)

### OMS Change Tracking Integration
ADM’s integration with Change Tracking is automatic when both solutions are enabled and configured in your OMS workspace.

The Machine Summary Panel indicates whether Change Tracking events have occurred on the selected machine during the selected time range.

![Machine Summary Panel](media/operations-management-suite-application-dependency-monitor/machine-summary.png)

The Machine Change Tracking Panel shows a list of all changes, with the most recent first, along with a link to drill into Log Search for additional details.
![Machine Change Tracking Panel](media/operations-management-suite-application-dependency-monitor/machine-change-tracking.png)

Following is a drill down view of Configuration Change event after selecting **Show in Log Analytics**.
![Configuration Change Event](media/operations-management-suite-application-dependency-monitor/configuration-change-event.png)


## Output data
ADM’s computer and process inventory data is available for [search](../log-analytics/log-analytics-log-searches.md) in Log Analytics.  This can be applied to scenarios including migration planning, capacity analysis, discovery, and ad hoc performance troubleshooting. 

One record is generated per hour for each unique computer and process in addition to records generated when that process or computer starts or is on-boarded to ADM.  These records have the properties in the following tables. 

There are internally generated properties you can use to identify unique processes and computers:

- PersistentKey_s is uniquely defined by the process configuration, e.g. command line and user ID.  It is unique for a given computer, but can be repeated across computers.
- ProcessId_s and ComputerId_s are globally unique in the ADM model.



### AdmComputer_CL records
Records with a type of **AdmComputer_CL** have inventory data for servers with ADM agents.  These records have the properties in the following table.  

| Property | Description |
|:--|:--|
| Type | *AdmComputer_CL* |
| SourceSystem | *OpsManager* |
| ComputerName_s | Windows or Linux computer name |
| CPUSpeed_d | CPU Speed in MHz |
| DnsNames_s | List of all DNS names for this computer |
| IPv4s_s | List of all IPv4 addresses in use by this computer |
| IPv6s_s | List of all IPv6 addresses in use by this computer.  (ADM identifies IPv6  addresses but does not discover IPv6 dependencies.) |
| Is64Bit_b | true or false based on OS type |
| MachineId_s | An internal GUID, unique across an OMS workspace  |
| OperatingSystemFamily_s | Windows or Linux |
| OperatingSystemVersion_s | Long OS version string |
| TimeGenerated | Date and time that the record was created. |
| TotalCPUs_d | Number of CPU cores |
| TotalPhysicalMemory_d | Memory capacity in MB |
| VirtualMachine_b | true or false based on whether OS is a VM guest |
| VirtualMachineID_g | Hyper-V VM ID |
| VirtualMachineName_g | Hyper-V VM Name |
| VirtualMachineType_s | Hyperv, Vmware, Xen, Kvm, Ldom, Lpar, Virtualpc |


### AdmProcess_CL Type records 
Records with a type of **AdmProcess_CL** have inventory data for TCP-connected processes on servers with ADM agents.  These records have the properties in the following table.

| Property | Description |
|:--|:--|
| Type | *AdmProcess_CL* |
| SourceSystem | *OpsManager* |
| CommandLine_s | Full command line of the process |
| CompanyName_s | Company name (from Windows PE or Linux RPM) |
| Description_s | Long process description (from Windows PE or Linux RPM) |
| FileVersion_s | Executable file version (from Windows PE, Windows only) |
| FirstPid_d | OS Process ID |
| InternalName_s | Executable file’s internal name (from Windows PE, Windows only) |
| MachineId_s | Internal GUID unique across an OMS workspace  |
| Name_s | The process executable name |
| Path_s | File system path of the process executable |
| PersistentKey_s | Internal GUID unique within this computer |
| PoolId_d | Internal ID for aggregating processes based on similar command lines. |
| ProcessId_s | Internal GUID unique across an OMS workspace  |
| ProductName_s | Product name string (from Windows PE or Linux RPM) |
| ProductVersion_s | Product version string (from Windows PE or Linux RPM) |
| StartTime_t | Process start time on local computer clock |
| TimeGenerated | Date and time that the record was created. |
| UserDomain_s | Domain of process owner (Windows only) |
| UserName_s | Name of process owner (Windows only) |
| WorkingDirectory_s | Process working directory |


## Sample log searches

### List the physical memory capacity of all managed computers. 
Type=AdmComputer_CL | select TotalPhysicalMemory_d, ComputerName_s | Dedup ComputerName_s

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-01.png)

### List computer name, DNS, IP, and OS version.
Type=AdmComputer_CL | select ComputerName_s, OperatingSystemVersion_s, DnsNames_s, IPv4s_s  | dedup ComputerName_s

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-02.png)

### Find all processes with "sql" in the command line
Type=AdmProcess_CL CommandLine_s = \*sql\* | dedup ProcessId_s

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-03.png)

### After viewing event data for given process, use its machine ID to retrieve the computer’s name
Type=AdmComputer_CL "m!m-9bb187fa-e522-5f73-66d2-211164dc4e2b" | Distinct ComputerName_s

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-04.png)

### List all computers running SQL
Type=AdmComputer_CL MachineId_s IN {Type=AdmProcess_CL \*sql\* | Distinct MachineId_s} | Distinct ComputerName_s

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-05.png)

### List of all unique product versions of curl in my datacenter
Type=AdmProcess_CL Name_s=curl | Distinct ProductVersion_s

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-06.png)

### Create a Computer Group of all computers running CentOS

![ADM query example](media/operations-management-suite-application-dependency-monitor/adm-example-07.png)



## Connected sources
The following table describes the connected sources that are supported by the ADM solution.

| Connected Source | Supported | Description |
|:--|:--|:--|
| [Windows agents](../log-analytics/log-analytics-windows-agents.md) | Yes | ADM analyzes and collects data from Windows agent computers.  <br><br>Note that in addition to the OMS agent, Windows agents require the Microsoft Dependency Agent.  Please see the [Supported Operating Systems](Supported Operating Systems) for a complete list of operating system versions. |
| [Linux agents](../log-analytics/log-analytics-limux-agents.md) | Yes | ADM analyzes and collects data from Windows agent computers.  <br><br>Note that in addition to the OMS agent, Linux agents require the Microsoft Dependency Agent.  Please see the [Supported Operating Systems](Supported Operating Systems) for a complete list of operating system versions. |
| [SCOM management group](../log-analytics/log-analytics-om-agents.md) | Yes | ADM analyzes and collects data from Windows and Linux agents in a connected SCOM management group. <br><br>A direct connection from the SCOM agent computer to OMS is required. Data is sent directly from forwarded from the management group to the OMS repository.|
| [Azure storage account](../log-analytics/log-analytics-azure-storage.md) | No | ADM collects data from agent computers, so there is no data from it to collect from Azure storage. |

Note that ADM only supports 64-bit platforms.

In addition to the Microsoft Monitoring Agent, Windows and Linux computers require the Microsoft Dependency Agent.  The Dependency Agent passes its data locally on-box to the OMS-connected agents, which then sends it to OMS where it is processed by ADM. Application components and other details will only be discovered on servers with agents installed. Details will not be discovered for systems without an agent although connections between them and agent servers will be discovered.

You can use ADM on servers with OMS Direct Agents or on servers that are attached to OMS via SCOM Management Groups.  However, in both cases, ADM data is always sent directly from MMA to OMS (i.e. ADM data does not flow through a SCOM Management Group), so the server must be able to connect to OMS.  Each OMS agent therefore requires internet connectivity to the OMS cloud or the use of an OMS Gateway.  This may require configuration of a firewall or proxy.

Using both configurations with the same workspace in each will cause duplication of data. Using both with different workspaces can result in conflicting configuration (one with ADM solution enabled and the other without) that may prevent data from flowing to ADM completely.
NOTE: Even if the machine itself isn’t specified in the SCOM Console’s OMS configuration, if an Instance Group such as “Windows Server Instances Group” is active, it may still result in the machine receiving OMS configuration via SCOM.

![ADM Agents](media/operations-management-suite-application-dependency-monitor/agents.png)


## Management packs
When ADM is activated in an OMS workspace, a 300KB Management Pack is sent to all the Microsoft Monitoring Agents in that workspace.  If you are using SCOM agents in a [connected management group](../log-analytics/log-analytics-om-agents.md), the ADM Management Pack will be deployed from SCOM.  If the agents are directly connected, the MP will be delivered by OMS.

The MP is named Microsoft.IntelligencePacks.ApplicationDependencyMonitor*.  It is written to *%Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs\*.  The data source used by the management pack is *%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll*.


## Data collection
You can expect each agent to transmit roughly 25MB per day, depending on how complex your system dependencies are.  ADM dependency data is sent by each agent every 15 seconds.  

The ADM Agent typically consumes 0.1% of system memory and 0.1% of system CPU.

## Configuration
>[AZURE.NOTE] While Application Dependency Monitor is in [public preview](../log-analytics/log-analytics-add-solutions.md#log-analytics-preview-solutions-and-features), you must add it to your workspace by selecting **Preview Features** in the **Settings** section of the OMS portal.

Add the Application Dependency Monitor solution to your OMS workspace using the process described in [Add solutions](../log-analytics/log-analytics-add-solutions.md). 

In addition to Windows and Linux computers have an agent installed and connected to OMS, the Dependency Agent installer must be downloaded from the ADM solution and then installed as root or Admin on each managed server.  Once the ADM agent is installed on a server reporting to OMS, ADM dependency maps will appear within 10 minutes.  If you have any issues, please email [oms-adm-support@microsoft.com](mailto:oms-adm-support@microsoft.com).


### Migrating from BlueStripe FactFinder
Application Dependency Monitor will deliver BlueStripe technology into OMS in phases. FactFinder is still supported for existing customers but is no longer available for individual purchase.  This preview version of the Dependency Agent can only communicate with OMS.  If you are a current FactFinder customer, please identify a set of test servers for ADM that are not managed by FactFinder. 

### Download the Dependency Agent
In addition to the Microsoft Management Agent (MMA) and OMS Linux Agent which provide the connection between the computer and OMS, all computers analyzed by Application Dependency Monitor must have the Dependency Agent installed.  On Linux, the OMS Agent for Linux must be installed before the Dependency Agent. 

![Application Dependency Monitor tile](media/operations-management-suite-application-dependency-monitor/tile.png)

In order to download the Dependency Agent, click **Configure Solution** in the **Application Dependency Monitor** tile to open the **Dependency Agent** blade.  The Dependency Agent blade has links for the Windows and the Linux agents. Click the appropriate link to download each agent. See the following sections for details on installing the agent on different systems.

### Install the Dependency Agent

#### Microsoft Windows
Administrator privileges are required to install or uninstall the agent.

The Dependency Agent is installed on Windows computers with ADM-Agent-Windows.exe. If you run this executable without any options, then it will start a wizard that you can follow to perform the installation interactively.  

Use the following steps to install the Dependency Agent on each Windows computer.

1.	Ensure that the OMS agent is installed using the instructions at Connect computers directly to OMS.
2.	Download the Windows agent and run it with the following command.<br>*ADM-Agent-Windows.exe*
3.	Follow the wizard to install the agent.
4.	If the Dependency Agent fails to start, check the logs for detailed error information. On Windows agents, the log directory is *C:\Program Files\BlueStripe\Collector\logs*. 

The Dependency Agent for Windows can be uninstalled by an Administrator through the Control Panel.


#### Linux
Root access is required to install or configure the agent.

The Dependency Agent is installed on Linux computers with ADM-Agent-Linux64.bin, a shell script with a self-extracting binary. You can run the file with sh or add execute permissions to the file itself.
 
Use the following steps to install the Dependency Agent on each Linux computer.

1.	Ensure that the OMS agent is installed using the instructions at [Collect and manage data from Linux computers.  This needs to be installed before the Linux Dependency Agent](https://technet.microsoft.com/library/mt622052.aspx).
2.	Install the Linux Dependency agent as root using the following command.<br>*sh ADM-Agent-Linux64.bin*.
3.	If the Dependency Agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is */var/opt/microsoft/dependency-agent/log*.

### Uninstalling the Dependency Agent on Linux
To completely uninstall the Dependency Agent from Linux, you must remove the agent itself and the proxy which is installed automatically with the agent.  You can uninstall both with the following single command.

	rpm -e dependency-agent dependency-agent-connector


### Installing from a Command Line
The previous section provides guidance on installing the Dependency Monitor agent using default options.  The sections below provide guidance for installing the agent from a command line using custom options.

#### Windows
Use options from the table below to perform the installation from a command line. To see a list of the installation flags run the installer with the /? flag as follows.

	ADM-Agent-Windows.exe /?

| Flag | Description |
|:--|:--|
| /S | Perform a silent installation with no user prompts. |

Files for the Windows Dependency Agent are placed in *C:\Program Files\BlueStripe\Collector* by default.


#### Linux
Use options from the table below to perform the installation. To see a list of the installation flags run the installation program with the -help flag as follows.

	ADM-Agent-Linux64.bin -help

| Flag	Description
|:--|:--|
| -s | Perform a silent installation with no user prompts. |
| --check | Checks permissions and operating system but does not install the agent. |

Files for the Dependency Agent are placed in the following directories.

| Files | Location |
|:--|:--|
| Core files | /usr/lib/bluestripe-collector |
| Log files | /var/opt/microsoft/dependency-agent/log |
| Config files | /etc/opt/microsoft/dependency-agent/config |
| Service executables | /sbin/bluestripe-collector<br>/sbin/bluestripe-collector-manager |
| Binary storage files | /var/opt/microsoft/dependency-agent/storage |



## Troubleshooting
If you encounter problems with Application Dependency Monitor, you can gather troubleshooting information from multiple components using the following information.

### Windows Agents

#### Microsoft Dependency Agent
To generate troubleshooting data from the Dependency Agent, open a Command Prompt as administrator and run the CollectBluestripeData.vbs script using the following command.  You can add the --help flag to show additional options.

	cd C:\Program Files\Bluestripe\Collector\scripts
	cscript CollectDependencyData.vbs

The Support Data Package is saved in the %USERPROFILE% directory for the current user.  You can use the --file <filename> option to save it to a different location.

#### Microsoft Dependency Agent Management Pack for MMA
The Dependency Agent Management Pack runs inside Microsoft Management Agent.  It receives data from the Dependency Agent and forwards it to the ADM cloud service.
  
Verify that the management pack is downloaded by performing the following steps.

1.	Look for a file called Microsoft.IntelligencePacks.ApplicationDependencyMonitor.mp in C:\Program Files\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs.  
2.	If the file is not present and the agent is connected to a SCOM management group, then verify that it has been imported into SCOM by checking Management Packs in the Administration workspace of the Operations Console.

The ADM MP writes events to the Operations Manager Windows event log.  The log can be [searched in OMS](../log-analytics/log-analytics-log-searches.md) via the system log solution, where you can configure which log files to upload.  If debug events are enabled, they are written to the Application event log, with the event source *AdmProxy*.

#### Microsoft Monitoring Agent
To collect diagnostic traces, open a Command Prompt as administrator and run the following commands: 

	cd \Program Files\Microsoft Monitoring Agent\Agent\Tools
	net stop healthservice 
	StartTracing.cmd ERR
	net start healthservice

Traces are written to c:\Windows\Logs\OpsMgrTrace.  You can stop the tracing with StopTracing.cmd.


### Linux Agents

#### Microsoft Dependency Agent
To generate troubleshooting data from the Dependency Agent, login with an account that has sudo or root privileges and run the following command.  You can add the --help flag to show additional options.

	/usr/lib/bluestripe-collector/scripts/collect-dependency-agent-data.sh

The Support Data Package is saved to /var/opt/microsoft/dependency-agent/log (if root) under the Agent's installation directory, or to the home directory of the user running the script (if non-root).  You can use the --file <filename> option to save it to a different location.

#### Microsoft Dependency Agent Fluentd Plug-in for Linux
The Dependency Agent Fluentd Plug-in runs inside the OMS Linux Agent.  It receives data from the Dependency Agent and forwards it to the ADM cloud service.  

Logs are written to the following two files.

- /var/opt/microsoft/omsagent/log/omsagent.log
- /var/log/messages

#### OMS Agent for Linux
A troubleshooting resource for connecting Linux servers to OMS can be found here: [https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/Troubleshooting.md](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/Troubleshooting.md) 

The logs for the OMS Agent for Linux are located in */var/opt/microsoft/omsagent/log/*.  

The logs for omsconfig (agent configuration) are located in */var/opt/microsoft/omsconfig/log/*.
 
The log for the OMI and SCX components which provide performance metrics data are located in */var/opt/omi/log/* and */var/opt/microsoft/scx/log*.



## Supported Operating Systems
The following sections list the supported operating systems for the Dependency Agent.   32-bit architectures are not supported for any operating system.

### Windows Server
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 SP1

### Windows Desktop
- Note: Windows 10 is not yet supported
- Windows 8.1
- Windows 8
- Windows 7

### Red Hat Enterprise Linux, CentOS Linux and Oracle Linux (with RHEL Kernel)
- Only default and SMP Linux kernel releases are supported.
- Non-standard kernel releases, such as PAE and Xen, are not supported for any Linux distribution. For example, a system with the release string of "2.6.16.21-0.8-xen" is not supported.
- Custom kernels, including recompiles of standard kernels, are not supported
- Centos Plus kernel is not supported.
- Oracle Unbreakable Kernel (UEK) is covered in a different section below.


#### Red Hat Linux 7
| OS Version | Kernel Version |
|:--|:--|
| 7.0 | 3.10.0-123 |
| 7.1 | 3.10.0-229 |
| 7.2 | 3.10.0-327 |

#### Red Hat Linux 6
| OS Version | Kernel Version |
|:--|:--|
| 6.0 | 2.6.32-71 |
| 6.1 | 2.6.32-131 |
| 6.2 | 2.6.32-220 |
| 6.3 | 2.6.32-279 |
| 6.4 | 2.6.32-358 |
| 6.5 | 2.6.32-431 |
| 6.6 | 2.6.32-504 |
| 6.7 | 2.6.32-573 |
| 6.8 | 2.6.32-642 |

#### Red Hat Linux 5
| OS Version | Kernel Version |
|:--|:--|
| 5.8 | 2.6.18-308 |
| 5.9 | 2.6.18-348 |
| 5.10 | 2.6.18-371 |
| 5.11 | 2.6.18-398<br>2.6.18-400<br>2.6.18-402<br>2.6.18-404<br>2.6.18-406<br>2.6.18-407<br>2.6.18-408<br>2.6.18-409<br>2.6.18-410<br>2.6.18-411 |

#### Oracle Enterprise Linux w/ Unbreakable Kernel (UEK)

#### Oracle Linux 6
| OS Version | Kernel Version
|:--|:--|
| 6.2 | Oracle 2.6.32-300 (UEK R1) |
| 6.3 | Oracle 2.6.39-200 (UEK R2) |
| 6.4 | Oracle 2.6.39-400 (UEK R2) |
| 6.5 | Oracle 2.6.39-400 (UEK R2 i386) |
| 6.6 | Oracle 2.6.39-400 (UEK R2 i386) |

#### Oracle Linux 5

| OS Version | Kernel Version
|:--|:--|
| 5.8 | Oracle 2.6.32-300 (UEK R1) |
| 5.9 | Oracle 2.6.39-300 (UEK R2) |
| 5.10 | Oracle 2.6.39-400 (UEK R2) |
| 5.11 | Oracle 2.6.39-400 (UEK R2) |

#### SUSE Linux Enterprise Server

#### SUSE Linux 11
| OS Version | Kernel Version
|:--|:--|
| 11 | 2.6.27 |
| 11 SP1 | 2.6.32 |
| 11 SP2 | 3.0.13 |
| 11 SP3 | 3.0.76 |
| 11 SP4 | 3.0.101 |

#### SUSE Linux 10
| OS Version | Kernel Version
|:--|:--|
| 10 SP4 | 2.6.16.60 |

## Diagnostic and usage data
Microsoft automatically collects usage and performance data through your use of the Application Dependency Monitor service. Microsoft uses this Data to provide and improve the quality, security and integrity of the Application Dependency Monitor service. Data includes information about the configuration of your software like operating system and version and also includes IP address, DNS name, and Workstation name in order to provide accurate and efficient troubleshooting capabilities. We do not collect names, addresses or other contact information.

For more information on data collection and usage, please see the [Microsoft Online Services Privacy Statement](https://www.microsoft.com/privacystatement/OnlineServices/Default.aspx).



## Next steps
- Learn more about [log searches](../log-analytics/log-analytics-log-searches.md] in Log Analytics to retrieve data collected by Application Dependency Monitor.)
