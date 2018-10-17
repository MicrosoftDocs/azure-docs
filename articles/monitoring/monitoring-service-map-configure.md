---
title: Configure Service Map in Azure | Microsoft Docs
description: Service Map is a solution in Azure that automatically discovers application components on Windows and Linux systems and maps the communication between services. This article provides details for deploying Service Map in your environment and using it in a variety of scenarios.
services:  monitoring
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: d3d66b45-9874-4aad-9c00-124734944b2e
ms.service:  monitoring
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/24/2018
ms.author: daseidma;bwren

---
# Configure Service Map in Azure
Service Map automatically discovers application components on Windows and Linux systems and maps the communication between services. You can use it to view your servers as you think of them--interconnected systems that deliver critical services. Service Map shows connections between servers, processes, and ports across any TCP-connected architecture with no configuration required, other than installation of an agent.

This article describes the details of configuring Service Map and onboarding agents. For information on using Service Map, see [Use the Service Map solution in Azure]( monitoring-service-map.md).

## Supported Azure regions
Service Map is currently available in the following Azure regions:
- East US
- West Europe
- West Central US
- Southeast Asia

## Supported Windows operating systems
The following section list the supported operating systems for the Dependency agent on Windows. 

>[!NOTE]
>Service Map supports only 64-bit platforms.
>

### Windows Server
- Windows Server 2016 1803
- Windows Server 2016
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 SP1

### Windows desktop
- Windows 10 1803
- Windows 10
- Windows 8.1
- Windows 8
- Windows 7

## Supported Linux operating systems
The following section list the supported operating systems for the Dependency agent on Red Hat Enterprise Linux, CentOS Linux, and Oracle Linux (with RHEL Kernel).  

- Only default and SMP Linux kernel releases are supported.
- Nonstandard kernel releases, such as PAE and Xen, are not supported for any Linux distribution. For example, a system with the release string of "2.6.16.21-0.8-xen" is not supported.
- Custom kernels, including recompiles of standard kernels, are not supported.
- CentOSPlus kernel is not supported.
- Oracle Unbreakable Enterprise Kernel (UEK) is covered in a later section of this article.

### Red Hat Linux 7

| OS version | Kernel version |
|:--|:--|
| 7.0 | 3.10.0-123 |
| 7.1 | 3.10.0-229 |
| 7.2 | 3.10.0-327 |
| 7.3 | 3.10.0-514 |
| 7.4 | 3.10.0-693 |
| 7.5 | 3.10.0-862 |

### Red Hat Linux 6

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
| 6.9 | 2.6.32-696 |

### Ubuntu Server

| OS version | Kernel version |
|:--|:--|
| Ubuntu 18.04 | kernel 4.15.* |
| Ubuntu 16.04.3 | kernel 4.15.* |
| 16.04 | 4.4.\*<br>4.8.\*<br>4.10.\*<br>4.11.\*<br>4.13.\* |
| 14.04 | 3.13.\*<br>4.4.\* |

### Oracle Enterprise Linux 6 with Unbreakable Enterprise Kernel
| OS version | Kernel version
|:--|:--|
| 6.2 | Oracle 2.6.32-300 (UEK R1) |
| 6.3 | Oracle 2.6.39-200 (UEK R2) |
| 6.4 | Oracle 2.6.39-400 (UEK R2) |
| 6.5 | Oracle 2.6.39-400 (UEK R2 i386) |
| 6.6 | Oracle 2.6.39-400 (UEK R2 i386) |

### Oracle Enterprise Linux 5 with Unbreakable Enterprise Kernel

| OS version | Kernel version
|:--|:--|
| 5.10 | Oracle 2.6.39-400 (UEK R2) |
| 5.11 | Oracle 2.6.39-400 (UEK R2) |

## SUSE Linux 12 Enterprise Server

| OS version | Kernel version
|:--|:--|
|12 SP2 | 4.4.* |
|12 SP3 | 4.4.* |

## Dependency agent downloads

| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.7.1 | 55030ABF553693D8B5112569FB2F97D7C54B66E9990014FC8CC43EFB70DE56C6 |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.7.1 | 43C75EF0D34471A0CBCE5E396FFEEF4329C9B5517266108FA5D6131A353D29FE |

## Connected sources
Service Map gets its data from the Microsoft Dependency agent. The Dependency agent relies on the Log Analytics agent for its connections to Log Analytics. This means that a server must have the Log Analytics agent installed and configured with the Dependency agent.  The following table describes the connected sources that the Service Map solution supports.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | Service Map analyzes and collects data from Windows computers. <br><br>In addition to the [Log Analytics agent for Windows](../log-analytics/log-analytics-concept-hybrid.md), Windows agents require the Microsoft Dependency agent. See the [supported operating systems](#supported-operating-systems) for a complete list of operating system versions. |
| Linux agents | Yes | Service Map analyzes and collects data from Linux computers. <br><br>In addition to the [Log Analytics agent for Linux](../log-analytics/log-analytics-concept-hybrid.md), Linux agents require the Microsoft Dependency agent. See the [supported operating systems](#supported-operating-systems) for a complete list of operating system versions. |
| System Center Operations Manager management group | Yes | Service Map analyzes and collects data from Windows and Linux agents in a connected [System Center Operations Manager management group](../log-analytics/log-analytics-om-agents.md). <br><br>A direct connection from the System Center Operations Manager agent computer to Log Analytics is required. |
| Azure storage account | No | Service Map collects data from agent computers, so there is no data from it to collect from Azure Storage. |

On Windows, the Microsoft Monitoring Agent (MMA) is used by both System Center Operations Manager and Log Analytics to gather and send monitoring data. (This agent is called the System Center Operations Manager agent, OMS Agent, Log Analytics agent, MMA, or Direct Agent, depending on the context.) System Center Operations Manager and Log Analytics provide different out-of-the box versions of the MMA. These versions can each report to System Center Operations Manager, to Log Analytics, or to both.  

On Linux, the Log Analytics agent for Linux gathers and sends monitoring data to Log Analytics. You can use Service Map on servers with Log Analytics agents connected directly to the service, or that are reporting to an Operations Manager management group integrated with Log Analytics.  

In this article, we'll refer to all agents, whether Linux or Windows connected to a System Center Operations Manager management group or directly to Log Analytics, as the *Log Analytics agent*. 

The Service Map agent does not transmit any data itself, and it does not require any changes to firewalls or ports. The data in Service Map is always transmitted by the Log Analytics agent to the Log Analytics service, either directly or through the OMS Gateway.

![Service Map agents](media/monitoring-service-map/agents.png)

If you are a System Center Operations Manager customer with a management group connected to Log Analytics:

- If your System Center Operations Manager agents can access the Internet to connect to Log Analytics, no additional configuration is required.  
- If your System Center Operations Manager agents cannot access Log Analytics over the Internet, you need to configure the OMS Gateway to work with System Center Operations Manager.
  
If your Windows or Linux computers cannot directly connect to the service, you need to configure the Log Analytics agent to connect to Log Analytics using the OMS Gateway. For further information on how to deploy and configure the OMS Gateway, see [Connect computers without Internet access using the OMS Gateway](../log-analytics/log-analytics-oms-gateway.md).  

### Management packs
When Service Map is activated in a Log Analytics workspace, a 300-KB management pack is forwarded to all the Windows servers in that workspace. If you are using System Center Operations Manager agents in a [connected management group](../log-analytics/log-analytics-om-agents.md), the Service Map management pack is deployed from System Center Operations Manager. 

The management pack is named Microsoft.IntelligencePacks.ApplicationDependencyMonitor. It's written to %Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs\. The data source that the management pack uses is %Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll.

## Data collection
You can expect each agent to transmit roughly 25 MB per day, depending on how complex your system dependencies are. Each agent sends Service Map dependency data every 15 seconds.  

The Dependency agent typically consumes 0.1 percent of system memory and 0.1 percent of system CPU.

## Diagnostic and usage data
Microsoft automatically collects usage and performance data through your use of the Service Map service. Microsoft uses this data to provide and improve the quality, security, and integrity of the Service Map service. Data includes information about the configuration of your software, like operating system and version. It also includes IP address, DNS name, and workstation name in order to provide accurate and efficient troubleshooting capabilities. We do not collect names, addresses, or other contact information.

For more information on data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

## Installation

## Azure VM Extension
There is an extension available for both Windows (DependencyAgentWindows) and Linux (DependencyAgentLinux), and you can easily deploy the Dependency agent to your Azure VMs using an [Azure VM Extension](https://docs.microsoft.com/azure/virtual-machines/windows/extensions-features).  With the Azure VM Extension, you can deploy the Dependency agent to your Windows and Linux VMs using either a PowerShell script or directly in the VM using an Azure Resource Manager template.  If you deploy the agent with the Azure VM Extension, your agents are automatically updated to the latest version.

To deploy the Azure VM Extension with PowerShell, you can use the following example:

```PowerShell
#
# Deploy the Dependency agent to every VM in a Resource Group
#

$version = "9.4"
$ExtPublisher = "Microsoft.Azure.Monitoring.DependencyAgent"
$OsExtensionMap = @{ "Windows" = "DependencyAgentWindows"; "Linux" = "DependencyAgentLinux" }
$rmgroup = "<Your Resource Group Here>"

Get-AzureRmVM -ResourceGroupName $rmgroup |
ForEach-Object {
	""
	$name = $_.Name
	$os = $_.StorageProfile.OsDisk.OsType
	$location = $_.Location
	$vmRmGroup = $_.ResourceGroupName
	"${name}: ${os} (${location})"
	Date -Format o
	$ext = $OsExtensionMap.($os.ToString())
	$result = Set-AzureRmVMExtension -ResourceGroupName $vmRmGroup -VMName $name -Location $location `
	-Publisher $ExtPublisher -ExtensionType $ext -Name "DependencyAgent" -TypeHandlerVersion $version
	$result.IsSuccessStatusCode
}
```

An even easier way to ensure the Dependency agent is installed on your VMs is to include the agent in your Azure Resource Manager template.  The following JSON code example can be added to the *resources* section of your template.

```JSON
"type": "Microsoft.Compute/virtualMachines/extensions",
"name": "[concat(parameters('vmName'), '/DependencyAgent')]",
"apiVersion": "2017-03-30",
"location": "[resourceGroup().location]",
"dependsOn": [
"[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
],
"properties": {
	"publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
	"type": "DependencyAgentWindows",
	"typeHandlerVersion": "9.4",
	"autoUpgradeMinorVersion": true
}

```

### Install the Dependency agent on Microsoft Windows
The Dependency agent can be installed manually on Windows computers by running  `InstallDependencyAgent-Windows.exe`. If you run this executable file without any options, it starts a setup wizard that you can follow to install interactively.  

>[!NOTE]
>Administrator privileges are required to install or uninstall the agent.

Use the following steps to install the Dependency agent on each Windows computer:

1.	Install the Log Analytics agent for Windows following one of the methods described in [Collect data in a hybrid environment with Log Analytics agent](../log-analytics/log-analytics-concept-hybrid.md).
2.	Download the Windows agent and run it by using the following command: 
    
    `InstallDependencyAgent-Windows.exe`

3.	Follow the setup wizard to install the agent.
4.	If the Dependency agent fails to start, check the logs for detailed error information. On Windows agents, the log directory is %Programfiles%\Microsoft Dependency Agent\logs. 

#### Windows command line
Use options from the following table to install from a command line. To see a list of the installation flags, run the installer by using the /? flag as follows.

	InstallDependencyAgent-Windows.exe /?

| Flag | Description |
|:--|:--|
| /? | Get a list of the command-line options. |
| /S | Perform a silent installation with no user prompts. |

Files for the Windows Dependency agent are placed in C:\Program Files\Microsoft Dependency Agent by default.

### Install the Dependency agent on Linux
The Dependency agent is installed on Linux computers from `InstallDependencyAgent-Linux64.bin`, a shell script with a self-extracting binary. You can run the file by using `sh` or add execute permissions to the file itself.

>[!NOTE]
> Root access is required to install or configure the agent.

Use the following steps to install the Dependency agent on each Linux computer:

1.	Install the Log Analytics agent following one of the methods described in [Collect data in a hybrid environment with Log Analytics agent](../log-analytics/log-analytics-concept-hybrid.md).
2.	Install the Linux Dependency agent as root by running the following command:
    
    `sh InstallDependencyAgent-Linux64.bin`

3.	If the Dependency agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is /var/opt/microsoft/dependency-agent/log.

To see a list of the installation flags, run the installation program with the -help flag as follows.

	InstallDependencyAgent-Linux64.bin -help

| Flag | Description |
|:--|:--|
| -help | Get a list of the command-line options. |
| -s | Perform a silent installation with no user prompts. |
| --check | Check permissions and the operating system but do not install the agent. |

Files for the Dependency agent are placed in the following directories:

| Files | Location |
|:--|:--|
| Core files | /opt/microsoft/dependency-agent |
| Log files | /var/opt/microsoft/dependency-agent/log |
| Config files | /etc/opt/microsoft/dependency-agent/config |
| Service executable files | /opt/microsoft/dependency-agent/bin/microsoft-dependency-agent<br>/opt/microsoft/dependency-agent/bin/microsoft-dependency-agent-manager |
| Binary storage files | /var/opt/microsoft/dependency-agent/storage |

## Installation script examples
To easily deploy the Dependency agent on many servers at once, the following script example is provided to download and install the Dependency agent on either Windows or Linux.

### PowerShell script for Windows
```PowerShell
Invoke-WebRequest "https://aka.ms/dependencyagentwindows" -OutFile InstallDependencyAgent-Windows.exe

.\InstallDependencyAgent-Windows.exe /S
```

### Shell script for Linux
```
wget --content-disposition https://aka.ms/dependencyagentlinux -O InstallDependencyAgent-Linux64.bin
sudo sh InstallDependencyAgent-Linux64.bin -s
```
## Desired State Configuration
To deploy the Dependency agent using Desired State Configuration (DSC), you can use the xPSDesiredStateConfiguration module with the following example code:

```
configuration ServiceMap {

Import-DscResource -ModuleName xPSDesiredStateConfiguration

$DAPackageLocalPath = "C:\InstallDependencyAgent-Windows.exe"

Node localhost
{ 
    # Download and install the Dependency agent
    xRemoteFile DAPackage 
    {
        Uri = "https://aka.ms/dependencyagentwindows"
        DestinationPath = $DAPackageLocalPath
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
        DependsOn = "[xRemoteFile]DAPackage"
    }
  }
}
```

## Remove the Dependency agent
### Uinstall agent on Windows
An administrator can uninstall the Dependency agent for Windows through Control Panel.

An administrator can also run %Programfiles%\Microsoft Dependency Agent\Uninstall.exe to uninstall the Dependency agent.

### Uninstall agent on Linux
You can uninstall the Dependency agent from Linux with the following command.

RHEL, CentOs, or Oracle:

```
sudo rpm -e dependency-agent
```

Ubuntu:

```
sudo apt -y purge dependency-agent
```

## Troubleshooting
If you have any problems installing or running Service Map, this section can help you. If you still can't resolve your problem, please contact Microsoft Support.

### Dependency agent installation problems
#### Installer prompts for a reboot
The Dependency agent *generally* does not require a reboot upon installation or uninstallation. However, in certain rare cases, Windows Server requires a reboot to continue with an installation. This happens when a dependency, usually the Microsoft Visual C++ Redistributable, requires a reboot because of a locked file.

#### Message "Unable to install Dependency agent: Visual Studio Runtime libraries failed to install (code = [code_number])" appears

The Microsoft Dependency agent is built on the Microsoft Visual Studio runtime libraries. You'll get a message if there's a problem during installation of the libraries. 

The runtime library installers create logs in the %LOCALAPPDATA%\temp folder. The file is dd_vcredist_arch_yyyymmddhhmmss.log, where *arch* is "x86" or "amd64" and *yyyymmddhhmmss* is the date and time (24-hour clock) when the log was created. The log provides details about the problem that's blocking installation.

It might be useful to install the [latest runtime libraries](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) yourself first.

The following table lists code numbers and suggested resolutions.

| Code | Description | Resolution |
|:--|:--|:--|
| 0x17 | The library installer requires a Windows update that hasn't been installed. | Look in the most recent library installer log.<br><br>If a reference to "Windows8.1-KB2999226-x64.msu" is followed by a line "Error 0x80240017: Failed to execute MSU package," you don't have the prerequisites to install KB2999226. Follow the instructions in the prerequisites section in [Universal C Runtime in Windows](https://support.microsoft.com/kb/2999226). You might need to run Windows Update and reboot multiple times in order to install the prerequisites.<br><br>Run the Microsoft Dependency agent installer again. |

### Post-installation issues
#### Server doesn't appear in Service Map
If your Dependency agent installation succeeded, but you don't see your server in the Service Map solution:
* Is the Dependency agent installed successfully? You can validate this by checking to see if the service is installed and running.<br><br>
**Windows**: Look for the service named "Microsoft Dependency agent."<br>
**Linux**: Look for the running process "microsoft-dependency-agent."

* Are you on the [Free pricing tier of Operations Management Suite/Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-add-solutions#offers-and-pricing-tiers)? The Free plan allows for up to five unique Service Map servers. Any subsequent servers won't show up in Service Map, even if the prior five are no longer sending data.

* Is your server sending log and perf data to Log Analytics? Go to Log Search and run the following query for your computer: 

		Usage | where Computer == "admdemo-appsvr" | summarize sum(Quantity), any(QuantityUnit) by DataType

Did you get a variety of events in the results? Is the data recent? If so, your Log Analytics Agent is operating correctly and communicating with Log Analytics. If not, check the agent on your server: [Log Analytics agent for Windows troubleshooting](https://support.microsoft.com/help/3126513/how-to-troubleshoot-monitoring-onboarding-issues) or [Log Analytics agent for Linux troubleshooting](../log-analytics/log-analytics-agent-linux-support.md).

#### Server appears in Service Map but has no processes
If you see your server in Service Map, but it has no process or connection data, that indicates that the Dependency agent is installed and running, but the kernel driver didn't load. 

Check the C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log file (Windows) or /var/opt/microsoft/dependency-agent/log/service.log file (Linux). The last lines of the file should indicate why the kernel didn't load. For example, the kernel might not be supported on Linux if you updated your kernel.

## Next steps
- Learn how to [use Service Map]( monitoring-service-map.md) after it has been deployed and configured.
