---
title: Connect hybrid machines to Azure from the Azure portal
description: In this article, you learn how to install the agent and connect machines to Azure by using Azure Arc for servers (preview) from the Azure portal.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 05/18/2020
ms.topic: conceptual
ms.custom: references_regions
---

# Connect hybrid machines to Azure from the Azure portal

You can enable Azure Arc for servers (preview) for one or a small number of Windows or Linux machines in your environment by performing a set of steps manually. Or you can use an automated method by running a template script that we provide. This script automates the download and installation of both agents.

This method requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, you are member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](agent-overview.md#prerequisites) and verify that your subscription and resources meet the requirements.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Generate the installation script from the Azure portal

The script to automate the download and installation, and to establish the connection with Azure Arc, is available from the Azure portal. To complete the process, do the following:

1. From your browser, go to the [Azure portal](https://aka.ms/hybridmachineportal).

1. On the **Machines - Azure Arc** page, select either **Add**, at the upper left, or the **Create machine - Azure Arc** option at the bottom of the middle pane. 

1. On the **Select a method** page, select the **Add machines using interactive script** tile, and then select **Generate script**.

1. On the **Generate script** page, select the subscription and resource group where you want the machine to be managed within Azure. Select an Azure location where the machine metadata will be stored.

    >[!NOTE]
    >Azure Arc for servers (preview) supports only the following regions:
    >- EastUS
    >- WestUS2
    >- WestEurope
    >- SoutheastAsia
    >
    >Review additional considerations when selecting a region [here](overview.md#supported-regions) in the Overview article.

1. On the **Generate script** page, in the **Operating system** drop-down list, select the operating system that the script will be running on.

1. If the machine is communicating through a proxy server to connect to the internet, select **Next: Proxy Server**. 
1. On the **Proxy server** tab, specify the proxy server IP address or the name and port number that the machine will use to communicate with the proxy server. Enter the value in the format `http://<proxyURL>:<proxyport>`. 
1. Select **Review + generate**.

1. On the **Review + generate** tab, review the summary information, and then select **Download**. If you still need to make changes, select **Previous**.

## Install and validate the agent on Windows

### Install manually

You can install the Connected Machine agent manually by running the Windows Installer package *AzureConnectedMachineAgent.msi*. You can download the latest version of the [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center. 

> [!NOTE]
> * To install or uninstall the agent, you must have *Administrator* permissions.
> * You must first download and copy the Installer package to a folder on the target server, or from a shared network folder. If you run the Installer package without any options, it starts a setup wizard that you can follow to install the agent interactively.

If the machine needs to communicate through a proxy server to the service, after you install the agent you need to run a command that's described later in the article. This sets the proxy server system environment variable `https_proxy`.

If you are unfamiliar with the command-line options for Windows Installer packages, review [Msiexec standard command-line options](https://docs.microsoft.com/windows/win32/msi/standard-installer-command-line-options) and [Msiexec command-line options](https://docs.microsoft.com/windows/win32/msi/command-line-options).

For example, run the installation program with the `/?` parameter to review the help and quick reference option. 

```dos
msiexec.exe /i AzureConnectedMachineAgent.msi /?
```

To install the agent silently and create a setup log file in the `C:\Support\Logs` folder that exist, run the following command.

```dos
msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\Azcmagentsetup.log"
```

If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\AzureConnectedMachineAgentAgent\logs*.

### Install with the scripted method

1. Log in to the server.

1. Open an elevated PowerShell command prompt.

1. Change to the folder or share that you copied the script to, and execute it on the server by running the `./OnboardingScript.ps1` script.

If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\AzureConnectedMachineAgentAgent\logs*.

### Configure the agent proxy setting

To set the proxy server environment variable, run the following command:

```powershell
# If a proxy server is needed, execute these commands with the proxy URL and port.
[Environment]::SetEnvironmentVariable("https_proxy", "http://{proxy-url}:{proxy-port}", "Machine")
$env:https_proxy = [System.Environment]::GetEnvironmentVariable("https_proxy","Machine")
# For the changes to take effect, the agent service needs to be restarted after the proxy environment variable is set.
Restart-Service -Name himds
```

>[!NOTE]
>The agent does not support setting proxy authentication in this preview.
>

### Configure agent communication

After installing the agent, you need to configure the agent to communicate with the Azure Arc service by running the following command:

`"%ProgramFiles%\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "<resourceGroupName>" --tenant-id "<tenantID>" --location "<regionName>" --subscription-id "<subscriptionID>"`

## Install and validate the agent on Linux

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) that's hosted in the Microsoft [package repository](https://packages.microsoft.com/). The [shell script bundle `Install_linux_azcmagent.sh`](https://aka.ms/azcmagent) performs the following actions:

- Configures the host machine to download the agent package from packages.microsoft.com.
- Installs the Hybrid Resource Provider package.

Optionally, you can configure the agent with your proxy information by including the `--proxy "{proxy-url}:{proxy-port}"` parameter.

The script also contains logic to identify the supported and unsupported distributions, and it verifies the permissions that are required to perform the installation. 

The following example downloads the agent and installs it:

```bash
# Download the installation package.
wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

# Install the connected machine agent. 
bash ~/Install_linux_azcmagent.sh
```

To download and install the agent, including the `--proxy` parameter for configuring the agent to communicate through your proxy server, run the following commands:

```bash
# Download the installation package.
wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

# Install the connected machine agent. 
bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
```

### Configure the agent communication

After you install the agent, configure it to communicate with the Azure Arc service by running the following command:

`azcmagent connect --resource-group "<resourceGroupName>" --tenant-id "<tenantID>" --location "<regionName>" --subscription-id "<subscriptionID>"`

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc for servers (preview), go to the Azure portal to verify that the server has been successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

![A successful server connection](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-at-scale-policy.md), and much more.

- Learn more about the [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).
