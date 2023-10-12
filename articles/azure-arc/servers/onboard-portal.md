---
title: Connect hybrid machines to Azure using a deployment script
description: In this article, you learn how to install the agent and connect machines to Azure by using Azure Arc-enabled servers using the deployment script you create in the Azure portal.
ms.date: 10/12/2023
ms.topic: conceptual
---

# Connect hybrid machines to Azure using a deployment script

You can enable Azure Arc-enabled servers for one or a small number of Windows or Linux machines in your environment by performing a set of steps manually. Or you can use an automated method by running a template script that we provide. This script automates the download and installation of both agents.

This method requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, you are member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](prerequisites.md) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> Follow security best practices and use an Azure account with the least privileged access to onboard your server. See [Azure Identity Management and access control security best practices](/azure/security/fundamentals/identity-management-best-practices) for more information.
> 
## Generate the installation script from the Azure portal

The script to automate the download and installation, and to establish the connection with Azure Arc, is available from the Azure portal. To complete the process, perform the following steps:

1. From your browser, sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Arc - Machines** page, select **Add/Create** at the upper left, and then select **Add a machine** from the drop-down menu.

1. On the **Add servers with Azure Arc** page, under the **Add a single server** tile, select **Generate script**.

1. On the **Basics** page, provide the following:

    1. In the **Project Details** section, select the **Subscription** and **Resource group** the machine will be managed from.
    1. In the **Region** drop-down list, select the Azure region to store the servers metadata.
    1. In the **Operating system** drop-down list, select the operating system that the script is configured to run on.
    1. In the **Connectivity method** section, If the machine is communicating through a proxy server to connect to the internet, select **Proxy server** option and specify the proxy server IP address or the name and port number that the machine will use to communicate with the proxy server. Enter the value in the format `http://<proxyURL>:<proxyport>`. Else if the machine is communicating through a private endpoint then select **Private endpoint** option and appropriate private link scope in the drop-down list. Else if the machine is communicating through a public endpoint then select **Public endpoint** option.
    1. In the **Automanage machine best practices** section, you may enable automanage if you want to onboard and configure best practice services like Machine configuration and Insights, based on your server needs.
    1. Select **Next** to go to the Tags page.

1. On the **Tags** page, review the default **Physical location tags** suggested and enter a value, or specify one or more **Custom tags** to support your standards.

1. Select **Next** to Download and run script page.

1. On the **Download and run script** page, review the summary information, and then select **Download**. If you still need to make changes, select **Previous**.

## Install and validate the agent on Windows

### Install manually

You can install the Connected Machine agent manually by running the Windows Installer package *AzureConnectedMachineAgent.msi*. You can download the latest version of the [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center.

>[!NOTE]
>* To install or uninstall the agent, you must have *Administrator* permissions.
>* You must first download and copy the Installer package to a folder on the target server, or from a shared network folder. If you run the Installer package without any options, it starts a setup wizard that you can follow to install the agent interactively.

If the machine needs to communicate through a proxy server to the service, after you install the agent you need to run a command that's described in the steps below. This command sets the proxy server system environment variable `https_proxy`. Using this configuration, the agent communicates through the proxy server using the HTTP protocol.

If you are unfamiliar with the command-line options for Windows Installer packages, review [Msiexec standard command-line options](/windows/win32/msi/standard-installer-command-line-options) and [Msiexec command-line options](/windows/win32/msi/command-line-options).

For example, run the installation program with the `/?` parameter to review the help and quick reference option.

```dos
msiexec.exe /i AzureConnectedMachineAgent.msi /?
```

1. To install the agent silently and create a setup log file in the `C:\Support\Logs` folder that exist, run the following command.

    ```dos
    msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\Azcmagentsetup.log"
    ```

    If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%ProgramData%\AzureConnectedMachineAgent\log*.

2. If the machine needs to communicate through a proxy server, to set the proxy server environment variable, run the following command:

    ```powershell
    [Environment]::SetEnvironmentVariable("https_proxy", "http://{proxy-url}:{proxy-port}", "Machine")
    $env:https_proxy = [System.Environment]::GetEnvironmentVariable("https_proxy","Machine")
    # For the changes to take effect, the agent service needs to be restarted after the proxy environment variable is set.
    Restart-Service -Name himds
    ```

    >[!NOTE]
    >The agent does not support setting proxy authentication.
    >

3. After installing the agent, you need to configure it to communicate with the Azure Arc service by running the following command:

    ```dos
    "%ProgramFiles%\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID"
    ```

### Install with the scripted method

1. Log in to the server.

1. Open an elevated PowerShell command prompt.

    >[!NOTE]
    >The script only supports running from a 64-bit version of Windows PowerShell.
    >

1. Change to the folder or share that you copied the script to, and execute it on the server by running the `./OnboardingScript.ps1` script.

If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%ProgramData%\AzureConnectedMachineAgent\log*.

## Install and validate the agent on Linux

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) that's hosted in the Microsoft [package repository](https://packages.microsoft.com/). The [shell script bundle `Install_linux_azcmagent.sh`](https://aka.ms/azcmagent) performs the following actions:

* Configures the host machine to download the agent package from packages.microsoft.com.

* Installs the Hybrid Resource Provider package.

Optionally, you can configure the agent with your proxy information by including the `--proxy "{proxy-url}:{proxy-port}"` parameter. Using this configuration, the agent communicates through the proxy server using the HTTP protocol.

The script also contains logic to identify the supported and unsupported distributions, and it verifies the permissions that are required to perform the installation.

The following example downloads the agent and installs it:

```bash
# Download the installation package.
wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

# Install the Azure Connected Machine agent.
bash ~/Install_linux_azcmagent.sh
```

1. To download and install the agent, run the following commands. If your machine needs to communicate through a proxy server to connect to the internet, include the `--proxy` parameter.

    ```bash
    # Download the installation package.
    wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

    # Install the AZure Connected Machine agent.
    bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
    ```

2. After installing the agent, you need to configure it to communicate with the Azure Arc service by running the following command:

    ```bash
    azcmagent connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID" --cloud "cloudName"
    if [ $? = 0 ]; then echo "\033[33mTo view your onboarded server(s), navigate to https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.HybridCompute%2Fmachines\033[m"; fi
    ```

### Install with the scripted method

1. Log in to the server with an account that has root access.

1. Change to the folder or share that you copied the script to, and execute it on the server by running the `./OnboardingScript.sh` script.

If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *var/opt/azcmagent/log*.

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

![A successful server connection](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

- Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.

- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verify the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
