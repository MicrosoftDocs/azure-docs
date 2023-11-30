---
title: VM Insights Dependency Agent
description: This article describes how to upgrade the VM insights Dependency agent using command-line, setup wizard, and other methods.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023

---

# Dependency Agent

The Dependency Agent collects data about processes running on the virtual machine and external process dependencies. Dependency Agent updates include bug fixes or support of new features or functionality. This article describes Dependency Agent requirements and how to upgrade Dependency Agent manually or through automation.

>[!NOTE]
> The Dependency Agent sends heartbeat data to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table, for which you incur data ingestion charges. This behavior is different from Azure Monitor Agent, which sends agent health data to the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table, which is free from data collection charges.

## Dependency Agent requirements

- The Dependency Agent requires the Azure Monitor Agent to be installed on the same machine.
- On both the Windows and Linux versions, the Dependency Agent collects data using a user-space service and a kernel driver. 
    - Dependency Agent supports the same [Windows versions that Azure Monitor Agent supports](../agents/agents-overview.md#supported-operating-systems), except Windows Server 2008 SP2 and Azure Stack HCI.
    - For Linux, see [Dependency Agent Linux support](#dependency-agent-linux-support).

## Upgrade Dependency Agent 

You can upgrade the Dependency agent for Windows and Linux manually or automatically, depending on the deployment scenario and environment the machine is running in, using these methods:

|Environment |Installation method |Upgrade method |
|------------|--------------------|---------------|
|Azure VM | Dependency agent VM extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) and [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) | Agent is automatically upgraded by default unless you configured your Azure Resource Manager template to opt out by setting the property *autoUpgradeMinorVersion* to **false**. The upgrade for minor version where auto upgrade is disabled, and a major version upgrade follow the same method - uninstall and reinstall the extension. |
| Custom Azure VM images | Manual install of Dependency agent for Windows/Linux | Updating VMs to the newest version of the agent needs to be performed from the command line running the Windows installer package or Linux self-extracting and installable shell script bundle.|
| Non-Azure VMs | Manual install of Dependency agent for Windows/Linux | Updating VMs to the newest version of the agent needs to be performed from the command line running the Windows installer package or Linux self-extracting and installable shell script bundle. |

### Upgrade Windows agent 

Update the agent on a Windows VM from the command prompt, with a script or other automation solution, or by using the InstallDependencyAgent-Windows.exe Setup Wizard.  

[Download the latest version of the Windows agent](https://aka.ms/dependencyagentwindows).

#### Using the Setup Wizard

1. Sign on to the computer with an account that has administrative rights.

2. Execute **InstallDependencyAgent-Windows.exe** to start the Setup Wizard.
   
3. Follow the **Dependency Agent Setup** wizard to uninstall the previous version of the dependency agent and then install the latest version.


#### From the command line

1. Sign on to the computer with an account that has administrative rights.

2. Run the following command.

    ```cmd
    InstallDependencyAgent-Windows.exe /S /RebootMode=manual
    ```

    The `/RebootMode=manual` parameter prevents the upgrade from automatically rebooting the machine if some processes are using files from the previous version and have a lock on them. 

3. To confirm the upgrade was successful, check the `install.log` for detailed setup information. The log directory is *%Programfiles%\Microsoft Dependency Agent\logs*.

### Upgrade Linux agent 

Upgrade from prior versions of the Dependency Agent on Linux is supported and performed following the same command as a new installation.

You can download the latest version of the Linux agent from [here](https://aka.ms/dependencyagentlinux).

1. Sign on to the computer with an account that has administrative rights.

2. Run the following command as root.

    ```bash
    InstallDependencyAgent-Linux64.bin -s
    ```

If the Dependency agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is */var/opt/microsoft/dependency-agent/log*. 

## Uninstall Dependency Agent 

To uninstall Dependency Agent:

1. From the **Virtual Machines** menu in the Azure portal, select your virtual machine.
1. Select **Extensions + applications** > **DependencyAgentWindows** or **DependencyAgentLinux** > **Uninstall**.

    :::image type="content" source="media/vminsights-dependency-agent-maintenance/azure-monitor-uninstall-dependency-agent.png" alt-text="Screenshot showing the Extensions and applications screen for a virtual machine." lightbox="media/vminsights-dependency-agent-maintenance/azure-monitor-uninstall-dependency-agent.png":::

## Dependency Agent Linux support

Since the Dependency agent works at the kernel level, support is also dependent on the kernel version. As of Dependency agent version 9.10.* the agent supports * kernels.  The following table lists the major and minor Linux OS release and supported kernel versions for the Dependency agent.

>[!NOTE]
> With Dependency agent 9.10.15 and above, installation is not blocked for unsupported kernel versions, but the agent will run in degraded mode. In this mode, connection and port data stored in VMConnection and VMBoundport tables is not collected. The VMProcess table may have some data, but it will be minimal.

| Distribution | OS version | Kernel version |
|:---|:---|:---|
|  Red Hat Linux 8   | 8.5     | 4.18.0-348.\*el8_5.x86_644.18.0-348.\*el8.x86_64 |
|                    | 8.4     | 4.18.0-305.\*el8.x86_64, 4.18.0-305.\*el8_4.x86_64 |
|                    | 8.3     |  4.18.0-240.\*el8_3.x86_64 |
|                    | 8.2     | 4.18.0-193.\*el8_2.x86_64 |
|                    | 8.1     | 4.18.0-147.\*el8_1.x86_64 |
|                    | 8.0     | 4.18.0-80.\*el8.x86_64<br>4.18.0-80.\*el8_0.x86_64 |
|  Red Hat Linux 7   | 7.9     | 3.10.0-1160 |
|                    | 7.8     | 3.10.0-1136 |
|                    | 7.7     | 3.10.0-1062 |
|                    | 7.6     | 3.10.0-957  |
|                    | 7.5     | 3.10.0-862  |
|                    | 7.4     | 3.10.0-693  |
| Red Hat Linux 6    | 6.10    | 2.6.32-754 |
|                    | 6.9     | 2.6.32-696  |
| CentOS Linux 8     | 8.5     | 4.18.0-348.\*el8_5.x86_644.18.0-348.\*el8.x86_64  |
|                    | 8.4     | 4.18.0-305.\*el8.x86_64, 4.18.0-305.\*el8_4.x86_64 |
|                    | 8.3     | 4.18.0-240.\*el8_3.x86_64 |
|                    | 8.2     | 4.18.0-193.\*el8_2.x86_64 |
|                    | 8.1     | 4.18.0-147.\*el8_1.x86_64 |
|                    | 8.0     | 4.18.0-80.\*el8.x86_64<br>4.18.0-80.\*el8_0.x86_64 |
| CentOS Linux 7     | 7.9     | 3.10.0-1160 |
|                    | 7.8     | 3.10.0-1136 |
|                    | 7.7     | 3.10.0-1062 |
| CentOS Linux 6     | 6.10    | 2.6.32-754.3.5<br>2.6.32-696.30.1 |
|                    | 6.9     | 2.6.32-696.30.1<br>2.6.32-696.18.7 |
| Ubuntu Server      | 20.04   | 5.8<br>5.4\* |
|                    | 18.04   | 5.3.0-1020<br>5.0 (includes Azure-tuned kernel)<br>4.18*<br>4.15* |
|                    | 16.04.3 | 4.15.\* |
|                    | 16.04   | 4.13.\*<br>4.11.\*<br>4.10.\*<br>4.8.\*<br>4.4.\* |
|                    | 14.04   | 3.13.\*-generic<br>4.4.\*-generic|
| SUSE Linux 12 Enterprise Server | 12 SP5     | 4.12.14-122.\*-default, 4.12.14-16.\*-azure|
|                                 | 12 SP4 | 4.12.\* (includes Azure-tuned kernel) |
|                                 | 12 SP3 | 4.4.\* |
|                                 | 12 SP2 | 4.4.\* |
| SUSE Linux 15 Enterprise Server | 15 SP1 | 4.12.14-197.\*-default, 4.12.14-8.\*-azure |
|                                 | 15     | 4.12.14-150.\*-default |
| Debian                          | 9      | 4.9  | 

>[!NOTE]
> Dependency agent is not supported for Azure Virtual Machines with Ampere Altra ARM–based processors.

## Next steps

If you want to stop monitoring your VMs for a while or remove VM insights entirely, see [Disable monitoring of your VMs in VM insights](../vm/vminsights-optout.md).
