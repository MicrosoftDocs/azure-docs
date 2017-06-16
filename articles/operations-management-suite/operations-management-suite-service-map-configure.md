---
title: Configure Service Map in Operations Management Suite | Microsoft Docs
description: Service Map is an Operations Management Suite solution that automatically discovers application components on Windows and Linux systems and maps the communication between services. This article provides details for deploying Service Map in your environment and using it in a variety of scenarios.
services: operations-management-suite
documentationcenter: ''
author: daveirwin1
manager: jwhit
editor: tysonn

ms.assetid: d3d66b45-9874-4aad-9c00-124734944b2e
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/18/2016
ms.author: daseidma;bwren;dairwin

---
# Configure Service Map in Operations Management Suite
Service Map automatically discovers application components on Windows and Linux systems and maps the communication between services. You can use it to view your servers as you think of them--as interconnected systems that deliver critical services. Service Map shows connections between servers, processes, and ports across any TCP-connected architecture with no configuration required, other than installation of an agent.

This article describes the details of configuring Service Map and onboarding agents. For information on using Service Map, see [Use the Service Map solution in Operations Management Suite](operations-management-suite-service-map.md).

## Dependency Agent downloads
| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.0.5 | 73B3F6A2A76A08D58F72A550947FF839B588591C48E6EDDD6DDF73AA3FD82B43 |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.0.5 | A1BAD0B36EBF79F2B69113A07FCF48C68D90BD169C722689F9C83C69FC032371 |


## Connected sources
Service Map gets its data from the Microsoft Dependency Agent. The Dependency Agent depends on the OMS Agent for its connections to Operations Management Suite. This means that a server must have the OMS Agent installed and configured first, and then the Dependency Agent can be installed. The following table describes the connected sources that the Service Map solution supports.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | Service Map analyzes and collects data from Windows agent computers. <br><br>In addition to the [OMS Agent](../log-analytics/log-analytics-windows-agents.md), Windows agents require the Microsoft Dependency Agent. See the [supported operating systems](#supported-operating-systems) for a complete list of operating system versions. |
| Linux agents | Yes | Service Map analyzes and collects data from Linux agent computers. <br><br>In addition to the [OMS Agent](../log-analytics/log-analytics-linux-agents.md), Linux agents require the Microsoft Dependency Agent. See the [supported operating systems](#supported-operating-systems) for a complete list of operating system versions. |
| System Center Operations Manager management group | Yes | Service Map analyzes and collects data from Windows and Linux agents in a connected [System Center Operations Manager management group](../log-analytics/log-analytics-om-agents.md). <br><br>A direct connection from the System Center Operations Manager agent computer to Operations Management Suite is required. Data is forwarded from the management group to the Operations Management Suite repository.|
| Azure storage account | No | Service Map collects data from agent computers, so there is no data from it to collect from Azure Storage. |

Service Map supports only 64-bit platforms.

On Windows, the Microsoft Monitoring Agent (MMA) is used by both System Center Operations Manager and Operations Management Suite to gather and send monitoring data. (This agent is called the System Center Operations Manager Agent, OMS Agent, Log Analytics Agent, MMA, or Direct Agent, depending on the context.) System Center Operations Manager and Operations Management Suite provide different out-of-the box versions of the MMA. These versions can each report to System Center Operations Manager, to Operations Management Suite, or to both.  

On Linux, the OMS Agent for Linux gathers and sends monitoring data to Operations Management Suite. You can use Service Map on servers with OMS Direct Agents or on servers that are attached to Operations Management Suite via System Center Operations Manager management groups.  

In this article, we'll refer to all agents--whether Linux or Windows, whether connected to a System Center Operations Manager management group or directly to Operations Management Suite--as the "OMS Agent." We'll use the specific deployment name of the agent only if it's needed for context.

The Service Map agent does not transmit any data itself, and it does not require any changes to firewalls or ports. The data in Service Map is always transmitted by the OMS Agent to Operations Management Suite, either directly or via the OMS Gateway.

![Service Map agents](media/oms-service-map/agents.png)

If you are a System Center Operations Manager customer with a management group connected to Operations Management Suite:

- If your System Center Operations Manager agents can access the Internet to connect to Operations Management Suite, no additional configuration is required.  
- If your System Center Operations Manager agents cannot access Operations Management Suite over the Internet, you need to configure the OMS Gateway to work with System Center Operations Manager.
  
If you are using the OMS Direct Agent, you need to configure the OMS Agent itself to connect to Operations Management Suite or to your OMS Gateway. The OMS Gateway can be downloaded from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=52666).

### Management packs
When Service Map is activated in an Operations Management Suite workspace, a 300-KB management pack is sent to all the Windows servers in that workspace. If you are using System Center Operations Manager agents in a [connected management group](../log-analytics/log-analytics-om-agents.md), the Service Map management pack is deployed from System Center Operations Manager. If the agents are directly connected, Operations Management Suite delivers the management pack.

The management pack is named Microsoft.IntelligencePacks.ApplicationDependencyMonitor. It's written to %Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs\. The data source that the management pack uses is %Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll.

## Installation
### Install the Dependency Agent on Microsoft Windows
Administrator privileges are required to install or uninstall the agent.

The Dependency Agent is installed on Windows computers through InstallDependencyAgent-Windows.exe. If you run this executable file without any options, it starts a wizard that you can follow to install interactively.  

Use the following steps to install the Dependency Agent on each Windows computer:

1.	Install the OMS Agent by using the instructions at [Connect Windows computers to the Log Analytics service in Azure](../log-analytics/log-analytics-windows-agents.md).
2.	Download the Windows agent and run it by using the following command: <br>`InstallDependencyAgent-Windows.exe`
3.	Follow the wizard to install the agent.
4.	If the Dependency Agent fails to start, check the logs for detailed error information. On Windows agents, the log directory is %Programfiles%\Microsoft Dependency Agent\logs. 

#### Windows command line
Use options from the following table to install from a command line. To see a list of the installation flags, run the installer by using the /? flag as follows.

	InstallDependencyAgent-Windows.exe /?

| Flag | Description |
|:--|:--|
| /? | Get a list of the command-line options. |
| /S | Perform a silent installation with no user prompts. |

Files for the Windows Dependency Agent are placed in C:\Program Files\Microsoft Dependency Agent by default.

### Install the Dependency Agent on Linux
Root access is required to install or configure the agent.

The Dependency Agent is installed on Linux computers through InstallDependencyAgent-Linux64.bin, a shell script with a self-extracting binary. You can run the file by using sh or add execute permissions to the file itself.
 
Use the following steps to install the Dependency Agent on each Linux computer:

1.	Install the OMS Agent by using the instructions at [Collect and manage data from Linux computers](https://technet.microsoft.com/library/mt622052.aspx).
2.	Install the Linux Dependency agent as root by using the following command:<br>`sh InstallDependencyAgent-Linux64.bin`
3.	If the Dependency Agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is /var/opt/microsoft/dependency-agent/log.

To see a list of the installation flags, run the installation program with the -help flag as follows.

	InstallDependencyAgent-Linux64.bin -help

| Flag | Description |
|:--|:--|
| -help | Get a list of the command-line options. |
| -s | Perform a silent installation with no user prompts. |
| --check | Check permissions and the operating system but do not install the agent. |

Files for the Dependency Agent are placed in the following directories:

| Files | Location |
|:--|:--|
| Core files | /opt/microsoft/dependency-agent |
| Log files | /var/opt/microsoft/dependency-agent/log |
| Config files | /etc/opt/microsoft/dependency-agent/config |
| Service executable files | /opt/microsoft/dependency-agent/bin/microsoft-dependency-agent<br>/opt/microsoft/dependency-agent/bin/microsoft-dependency-agent-manager |
| Binary storage files | /var/opt/microsoft/dependency-agent/storage |

## Installation script examples
To easily deploy the Dependency Agent on many servers at once, it helps to use a script. You can use the following script examples to download and install the Dependency Agent on either Windows or Linux.

### PowerShell script for Windows
```PowerShell
Invoke-WebRequest "https://aka.ms/dependencyagentwindows" -OutFile InstallDependencyAgent-Windows.exe

.\InstallDependencyAgent-Windows.exe /S
```

### Shell script for Linux
```
wget --content-disposition https://aka.ms/dependencyagentlinux -O InstallDependencyAgent-Linux64.bin
sh InstallDependencyAgent-Linux64.bin -s
```

## Desired State Configuration
To deploy the Dependency Agent via Desired State Configuration, you can use the xPSDesiredStateConfiguration module and a bit of code like the following:
```
Import-DscResource -ModuleName xPSDesiredStateConfiguration

$DAPackageLocalPath = "C:\InstallDependencyAgent-Windows.exe"


Node $NodeName 
{ 
	# Download and install the Dependency Agent
	xRemoteFile DAPackage 
	{
		Uri = "https://aka.ms/dependencyagentwindows"
		DestinationPath = $DAPackageLocalPath
		DependsOn = "[Package]OI"
	}

	xPackage DA
	{
		Ensure="Present"
		Name = "Dependency Agent"
		Path = $DAPackageLocalPath
		Arguments = '/S'
		ProductId = ""
		InstalledCheckRegKey = "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\DependencyAgent"
		InstalledCheckRegValueName = "DisplayName"
		InstalledCheckRegValueData = "Dependency Agent"
	}
}
```

## Uninstallation
### Uninstall the Dependency Agent on Windows
An administrator can uninstall the Dependency Agent for Windows through Control Panel.

An administrator can also run %Programfiles%\Microsoft Dependency Agent\Uninstall.exe to uninstall the Dependency Agent.

### Uninstall the Dependency Agent on Linux
To completely uninstall the Dependency Agent from Linux, you must remove the agent itself and the connector, which is installed automatically with the agent. You can uninstall both by using the following single command:

	rpm -e dependency-agent dependency-agent-connector

## Troubleshooting
If you have any problems installing or running Service Map, this section can help you. If you still can't resolve your problem, please contact Microsoft Support.

### Dependency Agent installation problems
#### Installer asks for a reboot
The Dependency Agent *generally* does not require a reboot upon installation or uninstallation. However, in certain rare cases, Windows Server requires a reboot to continue with an installation. This happens when a dependency, usually the Microsoft Visual C++ Redistributable, requires a reboot because of a locked file.

#### Message "Unable to install Dependency Agent: Visual Studio Runtime libraries failed to install (code = [code_number])" appears

The Microsoft Dependency Agent is built on the Microsoft Visual Studio runtime libraries. You'll get a message if there's a problem during installation of the libraries. 

The runtime library installers create logs in the %LOCALAPPDATA%\temp folder. The file is dd_vcredist_arch_yyyymmddhhmmss.log, where *arch* is "x86" or "amd64" and *yyyymmddhhmmss* is the date and time (24-hour clock) when the log was created. The log provides details about the problem that's blocking installation.

It might be useful to install the [latest runtime libraries](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) yourself first.

The following table lists code numbers and suggested resolutions.

| Code | Description | Resolution |
|:--|:--|:--|
| 0x17 | The library installer requires a Windows update that hasn't been installed. | Look in the most recent library installer log.<br><br>If a reference to "Windows8.1-KB2999226-x64.msu" is followed by a line "Error 0x80240017: Failed to execute MSU package," you don't have the prerequisites to install KB2999226. Follow the instructions in the prerequisites section in [Universal C Runtime in Windows](https://support.microsoft.com/kb/2999226). You might need to run Windows Update and reboot multiple times in order to install the prerequisites.<br><br>Run the Microsoft Dependency Agent installer again. |

### Post-installation issues
#### Server doesn't appear in Service Map
If your Dependency Agent installation succeeded, but you don't see your server in the Service Map solution:
* Is the Dependency Agent installed successfully? You can validate this by checking to see if the service is installed and running.<br><br>
**Windows**: Look for the service named "Microsoft Dependency Agent."<br>
**Linux**: Look for the running process "microsoft-dependency-agent."

* Are you on the [Free pricing tier of Operations Management Suite/Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-add-solutions#offers-and-pricing-tiers)? The Free plan allows for up to five unique Service Map servers. Any subsequent servers won't show up in Service Map, even if the prior five are no longer sending data.

* Is your server sending log and perf data to Operations Management Suite? Go to Log Search and run the following query for your computer: 

		* Computer="<your computer name here>" | measure count() by Type
		
  Did you get a variety of events in the results? Is the data recent? If so, your OMS Agent is operating correctly and communicating with the Operations Management Suite service. If not, check the OMS Agent on your server: [OMS Agent for Windows troubleshooting](https://support.microsoft.com/help/3126513/how-to-troubleshoot-operations-management-suite-onboarding-issues) or [OMS Agent for Linux troubleshooting](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/Troubleshooting.md).

#### Server appears in Service Map but has no processes
If you see your server in Service Map, but it has no process or connection data, that indicates that the Dependency Agent is installed and running, but the kernel driver didn't load. 

Check the C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log file (Windows) or /var/opt/microsoft/dependency-agent/log/service.log file (Linux). The last lines of the file should indicate why the kernel didn't load. For example, the kernel might not be supported on Linux if you updated your kernel.

## Data collection
You can expect each agent to transmit roughly 25 MB per day, depending on how complex your system dependencies are. Each agent sends Service Map dependency data every 15 seconds.  

The Dependency Agent typically consumes 0.1 percent of system memory and 0.1 percent of system CPU.

## Supported Azure regions
Service Map is currently available in the following Azure regions:
- East US
- West Europe
- West Central US


## Supported operating systems
The following sections list the supported operating systems for the Dependency Agent. Service Map doesn't support 32-bit architectures for any operating system.

### Windows Server
- Windows Server 2016
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 SP1

### Windows desktop
- Windows 10
- Windows 8.1
- Windows 8
- Windows 7

### Red Hat Enterprise Linux, CentOS Linux, and Oracle Linux (with RHEL Kernel)
- Only default and SMP Linux kernel releases are supported.
- Nonstandard kernel releases, such as PAE and Xen, are not supported for any Linux distribution. For example, a system with the release string of "2.6.16.21-0.8-xen" is not supported.
- Custom kernels, including recompiles of standard kernels, are not supported.
- CentOSPlus kernel is not supported.
- Oracle Unbreakable Enterprise Kernel (UEK) is covered in a later section of this article.


#### Red Hat Linux 7
| OS version | Kernel version |
|:--|:--|
| 7.0 | 3.10.0-123 |
| 7.1 | 3.10.0-229 |
| 7.2 | 3.10.0-327 |
| 7.3 | 3.10.0-514 |

#### Red Hat Linux 6
| OS version | Kernel version |
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
| OS version | Kernel version |
|:--|:--|
| 5.8 | 2.6.18-308 |
| 5.9 | 2.6.18-348 |
| 5.10 | 2.6.18-371 |
| 5.11 | 2.6.18-398<br>2.6.18-400<br>2.6.18-402<br>2.6.18-404<br>2.6.18-406<br>2.6.18-407<br>2.6.18-408<br>2.6.18-409<br>2.6.18-410<br>2.6.18-411<br>2.6.18-412<br>2.6.18-416<br>2.6.18-417<br>2.6.18-419 |

#### Oracle Enterprise Linux with Unbreakable Enterprise Kernel

#### Oracle Linux 6
| OS version | Kernel version
|:--|:--|
| 6.2 | Oracle 2.6.32-300 (UEK R1) |
| 6.3 | Oracle 2.6.39-200 (UEK R2) |
| 6.4 | Oracle 2.6.39-400 (UEK R2) |
| 6.5 | Oracle 2.6.39-400 (UEK R2 i386) |
| 6.6 | Oracle 2.6.39-400 (UEK R2 i386) |

#### Oracle Linux 5

| OS version | Kernel version
|:--|:--|
| 5.8 | Oracle 2.6.32-300 (UEK R1) |
| 5.9 | Oracle 2.6.39-300 (UEK R2) |
| 5.10 | Oracle 2.6.39-400 (UEK R2) |
| 5.11 | Oracle 2.6.39-400 (UEK R2) |

#### SUSE Linux Enterprise Server

#### SUSE Linux 11
| OS version | Kernel version
|:--|:--|
| 11 | 2.6.27 |
| 11 SP1 | 2.6.32 |
| 11 SP2 | 3.0.13 |
| 11 SP3 | 3.0.76 |
| 11 SP4 | 3.0.101 |

#### SUSE Linux 10
| OS version | Kernel version
|:--|:--|
| 10 SP4 | 2.6.16.60 |

## Diagnostic and usage data
Microsoft automatically collects usage and performance data through your use of the Service Map service. Microsoft uses this data to provide and improve the quality, security, and integrity of the Service Map service. Data includes information about the configuration of your software, like operating system and version. It also includes IP address, DNS name, and workstation name in order to provide accurate and efficient troubleshooting capabilities. We do not collect names, addresses, or other contact information.

For more information on data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).



## Next steps
- Learn how to [use Service Map](operations-management-suite-service-map.md) after it has been deployed and configured.
