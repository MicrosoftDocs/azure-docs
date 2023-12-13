---
title: Enable Azure Monitor for a hybrid environment
description: This article describes how you enable VM insights for a hybrid cloud environment that contains one or more virtual machines.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 12/11/2023
# Customer-intent: As a cloud administrator, I want to enable VM insights on Windows virtual machines in a hybrid cloud environment without using Azure Arc, so that I can monitor the performance and dependencies of my virtual machines.

---

# Enable VM insights for a hybrid virtual machine

For Linux hybrid machines, use [Azure Arc for servers](../../azure-arc/servers/overview.md) and onboard your virtual machines in the same way you [enable VM insights on Azure VMs](vminsights-enable-portal.md). Azure Arc doesn't currently support Windows hybrid machines. This article describes how to enable VM insights on a Widows virtual machine outside of Azure, including on-premises and other cloud environments, without using Azure Arc, which doesn't currently support Windows.

## Prerequisites

- [Create a Log Analytics workspace](../logs/quick-create-workspace.md).
- See [Supported operating systems](./vminsights-enable-overview.md#supported-operating-systems) to ensure that the operating system of the virtual machine or virtual machine scale set you're enabling is supported.

## Firewall requirements

- For Azure Monitor Agent firewall requirements, see [Define Azure Monitor Agent network settings](../agents/azure-monitor-agent-data-collection-endpoint.md#firewall-requirements). 
- The VM insights Map Dependency agent doesn't transmit any data itself, and it doesn't require any changes to firewalls or ports.

Azure Monitor Agent transmits data to the Azure Monitor service directly or through the [Operations Management Suite gateway](../../azure-monitor/agents/gateway.md) if your IT security policies don't allow computers on the network to connect to the internet.

## Install Azure Monitor Agent and Dependency agent

To enable VM insights on virtual machines outside of Azure, install the agents manually, or using other methods, on the guest operating system: 

1. [Install Azure Monitor Agent](../agents/azure-monitor-agent-windows-client.md). 
1. Optionally, to use the [Map feature of VM insights](vminsights-maps.md), install Dependency agent using the installer or PowerShell script:

    - To install Dependency agent using the installer: 

        Download [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) and install the agent manually on by running `InstallDependencyAgent-Windows.exe`. If you run this executable file without any options, it starts a setup wizard that you can follow to install the agent interactively. You require Administrator privileges on the guest OS to install or uninstall the agent.
        
        The agent setup command supports these parameters from the command line:
        
        | Parameter | Description |
        |:--|:--|
        | /? | Returns a list of the command-line options. |
        | /S | Performs a silent installation with no user interaction. |
        
        For example, to run the installation program with the `/?` parameter, enter **InstallDependencyAgent-Windows.exe /?**.
    
        Files for the Windows Dependency agent are installed in *C:\Program Files\Microsoft Dependency Agent* by default. If the Dependency agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\Microsoft Dependency Agent\logs*.

    - To install Dependency agent using PowerShell:

        - Use this sample PowerShell script to download and install the agent:
        
            ```powershell
            Invoke-WebRequest "https://aka.ms/dependencyagentwindows" -OutFile InstallDependencyAgent-Windows.exe
            
            .\InstallDependencyAgent-Windows.exe /S
            ```
        
        - To deploy the Dependency agent by using Desired State Configuration (DSC), you can use the `xPSDesiredStateConfiguration` module with the following sample code:
        
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

This section offers troubleshooting tips for common issues.

### VM doesn't appear on the map

If your Dependency agent installation succeeded but you don't see your computer on the map, diagnose the problem by following these steps:

1. Is the Dependency agent installed successfully? Check to see if the service is installed and running. Look for the service named "Microsoft Dependency agent."

1. Are you on the [Free pricing tier of Log Analytics](/previous-versions/azure/azure-monitor/insights/solutions)? The Free plan allows for up to five unique computers. Any subsequent computers won't show up on the map, even if the prior five are no longer sending data.

1. Is the computer sending log and performance data to Azure Monitor Logs? Run this query for your computer:

    ```Kusto
    Usage | where Computer == "computer-name" | summarize sum(Quantity), any(QuantityUnit) by DataType
    ```

    Did it return one or more results? Is the data recent? If so, your the agent is operating correctly and communicating with the service. If not, check the agent on your server. See [Troubleshooting Azure Monitor Agent on Windows virtual machines and scale sets](../agents/azure-monitor-agent-troubleshoot-windows-vm.md) or [Log Analytics agent for Linux troubleshooting](../agents/agent-linux-troubleshoot.md).

#### Computer appears on the map but has no processes

You see your server on the map, but it has no process or connection data. In this case, the Dependency agent is installed and running, but the kernel driver didn't load.

Check the *C:\Program Files\Microsoft Dependency Agent\logs\wrapper.log* file . The last lines of the file should indicate why the kernel didn't load. 

## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with VM insights.

- To view discovered application dependencies, see [View VM insights Map](vminsights-maps.md).
- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).
