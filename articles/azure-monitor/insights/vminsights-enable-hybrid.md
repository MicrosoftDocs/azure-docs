---
title: Enable Azure Monitor for a hybrid environment
description: This article describes how you enable Azure Monitor for VMs for a hybrid cloud environment that contains one or more virtual machines.
ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Enable Azure Monitor for VMs for a hybrid virtual machine
This article describes how to enable Azure Monitor for VMs for a virtual machine outside of Azure, including on-premises and other cloud environments.

> [!IMPORTANT]
> The recommended method of enabling hybrid VMs is first enabling [Azure Arc for servers](../../azure-arc/servers/overview.md) so that the VMs can be enabled for Azure Monitor for VMs using processes similar to Azure VMs. This article describes how to onboard hybrid VMs if you choose not to use Azure Arc.

## Prerequisites

- [Create and configure a Log Analytics workspace](vminsights-configure-workspace.md).
- See [Supported operating systems](vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported. 


## Overview
Virtual machines outside of Azure require the same Log Analytics agent and Dependency agent that are used for Azure VMs. Since you can't use VM extensions to install the agents though, you must manually install them in the guest operating system or have them installed through some other method. 

See [Connect Windows computers to Azure Monitor](../platform/agent-windows.md) or [Connect Linux computers to Azure Monitor](../platform/agent-linux.md) for details on deploying the Log Analytics agent. Details for the Dependency agent are provided in this article. 

## Firewall requirements
Firewall requirements for the Log Analytics agent are provided in [Log Analytics agent overview](../platform/log-analytics-agent.md#network-requirements). The Azure Monitor for VMs Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports. The Map data is always transmitted by the Log Analytics agent to the Azure Monitor service, either directly or through the [Operations Management Suite gateway](../../azure-monitor/platform/gateway.md) if your IT security policies don't allow computers on the network to connect to the internet.


## Dependency agent

>[!NOTE]
>The following information described in this section is also applicable to the [Service Map solution](service-map.md).  

You can download the Dependency agent from these locations:

| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.10.5.10940 | C27A56D0BE9CF162DF73292DFBB2083F5FF749F2B80FCAD2545BC8B14B64A8D7  |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.10.5.10940 | 71B4E1DA5116E61E03317C49C6702B5069F01A0C9A7CB860F6ACFAF5C198740E |


## Install the Dependency agent on Windows

You can install the Dependency agent manually on Windows computers by running `InstallDependencyAgent-Windows.exe`. If you run this executable file without any options, it starts a setup wizard that you can follow to install the agent interactively. You require *Administrator* privileges on the guest OS to install or uninstall the agent.

The following table highlights the parameters that are supported by setup for the agent from the command line.

| Parameter | Description |
|:--|:--|
| /? | Returns a list of the command-line options. |
| /S | Performs a silent installation with no user interaction. |

For example, to run the installation program with the `/?` parameter, enter **InstallDependencyAgent-Windows.exe /?**.

Files for the Windows Dependency agent are installed in *C:\Program Files\Microsoft Dependency Agent* by default. If the Dependency agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\Microsoft Dependency Agent\logs*.

### PowerShell script
Use the following sample PowerShell script to download and install the agent:

```powershell
Invoke-WebRequest "https://aka.ms/dependencyagentwindows" -OutFile InstallDependencyAgent-Windows.exe

.\InstallDependencyAgent-Windows.exe /S
```


## Install the Dependency agent on Linux

The Dependency agent is installed on Linux servers from *InstallDependencyAgent-Linux64.bin*, a shell script with a self-extracting binary. You can run the file by using `sh` or add execute permissions to the file itself.

>[!NOTE]
> Root access is required to install or configure the agent.
>

| Parameter | Description |
|:--|:--|
| -help | Get a list of the command-line options. |
| -s | Perform a silent installation with no user prompts. |
| --check | Check permissions and the operating system, but don't install the agent. |

For example, to run the installation program with the `-help` parameter, enter **InstallDependencyAgent-Linux64.bin -help**. Install the Linux Dependency agent as root by running the command `sh InstallDependencyAgent-Linux64.bin`.

If the Dependency agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is */var/opt/microsoft/dependency-agent/log*.

Files for the Dependency agent are placed in the following directories:

| Files | Location |
|:--|:--|
| Core files | /opt/microsoft/dependency-agent |
| Log files | /var/opt/microsoft/dependency-agent/log |
| Config files | /etc/opt/microsoft/dependency-agent/config |
| Service executable files | /opt/microsoft/dependency-agent/bin/microsoft-dependency-agent<br>/opt/microsoft/dependency-agent/bin/microsoft-dependency-agent-manager |
| Binary storage files | /var/opt/microsoft/dependency-agent/storage |

### Shell script 
Use the following sample shell script to download and install the agent:

```
wget --content-disposition https://aka.ms/dependencyagentlinux -O InstallDependencyAgent-Linux64.bin
sudo sh InstallDependencyAgent-Linux64.bin -s
```

## Desired State Configuration

To deploy the Dependency agent using Desired State Configuration (DSC), you can use the xPSDesiredStateConfiguration module with the following example code:

```powershell
configuration VMInsights {

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



## Troubleshooting

### VM doesn't appear on the map

If your Dependency agent installation succeeded, but you don't see your computer on the map, diagnose the problem by following these steps.

1. Is the Dependency agent installed successfully? You can validate this by checking to see if the service is installed and running.

    **Windows**: Look for the service named "Microsoft Dependency agent."

    **Linux**: Look for the running process "microsoft-dependency-agent."

2. Are you on the [Free pricing tier of Log Analytics](./solutions.md)? The Free plan allows for up to five unique computers. Any subsequent computers won't show up on the map, even if the prior five are no longer sending data.

3. Is the computer sending log and perf data to Azure Monitor Logs? Perform the following query for your computer:

    ```Kusto
    Usage | where Computer == "computer-name" | summarize sum(Quantity), any(QuantityUnit) by DataType
    ```

    Did it return one or more results? Is the data recent? If so, your Log Analytics agent is operating correctly and communicating with the service. If not, check the agent on your server: [Log Analytics agent for Windows troubleshooting](../platform/agent-windows-troubleshoot.md) or [Log Analytics agent for Linux troubleshooting](../platform/agent-linux-troubleshoot.md).

#### Computer appears on the map but has no processes

If you see your server on the map, but it has no process or connection data, that indicates that the Dependency agent is installed and running, but the kernel driver didn't load.

Check the C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log file (Windows) or /var/opt/microsoft/dependency-agent/log/service.log file (Linux). The last lines of the file should indicate why the kernel didn't load. For example, the kernel might not be supported on Linux if you updated your kernel.


## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with Azure Monitor for VMs.

- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).

- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).