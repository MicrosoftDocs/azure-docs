---
title: Connect hybrid machines to Azure from the Azure portal
description: In this article, you learn how to install the agent and connect machines to Azure using Azure Arc for servers (preview) from the Azure portal.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 01/29/2020
ms.custom: mvc
ms.topic: quickstart
---

# Connect hybrid machines to Azure from the Azure portal

You can enable Azure Arc for servers (preview) for one or a small number of Windows or Linux machines in your environment by performing a set of steps manually, or using an automated method by running a template script that we provide. This script automates the download and installation of both agents.

This installation method requires that you have administrative rights on the machine to install and configure the agent. On Linux, using the root account and on Windows, you are member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](overview.md#prerequisites) and verify that your subscription and resources meet the requirements.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Generate install script from the Azure portal

The script to automate the download, installation, and establishing the connection with Azure Arc is available from the Azure portal. The following steps describe how to complete this process.

1. From your browser, launch [https://aka.ms/hybridmachineportal](https://aka.ms/hybridmachineportal).

2. On the **Machines - Azure Arc** page, either select **+Add** in the upper left-hand corner, or select the **Create machine - Azure Arc** option from the bottom of the middle pane. 

3. On the **Select a method** page, select from the **Add machines using interactive script** tile **Generate script**.

4. On the **Generate script** page, select the subscription and resource group where you want the machine to be managed within Azure. Select an Azure location where machine metadata will be stored.

    >[!NOTE]
    >Azure Arc for servers (preview), only supports the following regions:
    >- WestUS2
    >- WestEurope
    >- WestAsia
    >

5. On the **Generate script** page, under the **Operating system** drop-down list, select the appropriate operating system the script will be running on.

6. If the machine is communicating through a proxy server in order to connect to the Internet, select the option **Next: Proxy Server>**. On the **Proxy server** tab, specify the proxy server IP address or name and port number that the machine will use to communicate with the proxy server. Enter the value following the format `http://<proxyURL>:<proxyport>`. Once completed, select **Review + generate**.  Otherwise, select **Review + generate** to complete the steps.

7. On the **Review + generate** tab, review the summary information, and then select **Download**. Otherwise if you need to make changes, you can select **Previous**.

## Install and validate the agent on Windows

### Install manually

You can install the Connected Machine agent manually by running the Windows Installer installation package `AzureConnectedMachineAgent.msi` after downloading it and copying it to a folder on the target server, or from a shared network folder. If you run the Installer package without any options, it starts a setup wizard that you can follow to install the agent interactively.

>[!NOTE]
>*Administrator* privileges are required to install or uninstall the agent.

If the machine needs to communicate through a proxy server to the service, after you install the agent you need to run a command described in a section below, to set the proxy server system environment variable `https_proxy`.

The following table highlights the parameters that are supported by setup for the agent from the command line.

| Parameter | Description |
|:--|:--|
| /? | Returns a list of the command-line options. |
| /S | Performs a silent installation with no user interaction. |

For example, to run the installation program with the `/?` parameter, enter `msiexec.exe /i AzureConnectedMachineAgent.msi /?`.

Files for the Connected Machine agent are installed in *C:\Program Files\AzureConnectedMachineAgent* by default. If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\AzureConnectedMachineAgentAgent\logs*.

### Install using scripted method

1. Log onto the server.

2. Open an elevated PowerShell command prompt.

3. Change to the folder or share you copied the script to and execute it on the server by running the command `./OnboardingScript.ps1`.

### Configure agent proxy setting

Run the following command to set the proxy server environment variable.

```powershell
# If a proxy server is needed, execute these commands with proxy URL and port
[Environment]::SetEnvironmentVariable("https_proxy", "http://{proxy-url}:{proxy-port}", "Machine")
$env:https_proxy = [System.Environment]::GetEnvironmentVariable("https_proxy","Machine")
# The agent service needs to be restarted after the proxy environment variable is set in order for the changes to take effect.
Restart-Service -Name himds
```

>[!NOTE]
>The agent does not support setting proxy authentication in this preview.
>

### Configure agent communication

After installing the agent, you need to configure the agent to communicate with the Azure Arc service by running the following command:

`%ProgramFiles%\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "<resourceGroupName>" --tenant-id "<tenantID>" --location "<regionName>" --subscription-id "<subscriptionID>"`

## Install and validate the agent on Linux

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) hosted on Microsoft's [package repository](https://packages.microsoft.com/). A shell script bundle `Install_linux_azcmagent.sh` located at [https://aka.ms/azcmagent](https://aka.ms/azcmagent) performs the following actions:

- Configures the host machine to download the agent package from packages.microsoft.com.
- Installs the Hybrid Resource Provider package.
- Optionally, configure the agent with your proxy information by including the `--proxy "{proxy-url}:{proxy-port}"` parameter.

The script also contains logic to identify supported and unsupported distributions, as well as verifying required permissions to perform the installation. 

The example below downloads the agent and installs it, without performing any of the conditional checks.

```bash
# Download the installation package
wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

# Install the connected machine agent. 
bash ~/Install_linux_azcmagent.sh
```

To download and install the agent, including the `--proxy` parameter for configuring the agent to communicate through your proxy server, run the following commands:

```bash
# Download the installation package
wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

# Install the connected machine agent. 
bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
```

### Configure agent communication

After installing the agent, you need to configure the agent to communicate with the Azure Arc service by running the following command:

`/opt/azcmagent/bin/azcmagent.exe" connect --resource-group "<resourceGroupName>" --tenant-id "<tenantID>" --location "<regionName>" --subscription-id "<subscriptionID>"`

## Verify connection with Azure Arc

After performing the steps to install the agent and configure it to connect to Azure Arc for servers (preview), go to the Azure portal to verify that the server has been successfully connected. You can view your machines in the Azure portal by visiting [https://aka.ms/hybridmachineportal](https://aka.ms/hybridmachineportal).

![Successful Onboarding](./media/quickstart-onboard/arc-for-servers-successful-onboard.png)

## Clean up

To disconnect a machine from Azure Arc for servers (preview), you need to perform the following steps.

1. Open Azure Arc for servers (preview) by visiting [https://aka.ms/hybridmachineportal](https://aka.ms/hybridmachineportal).

2. Select the machine in the list, click the ellipse (`...`) and select **Delete**.

3. To uninstall the Windows agent from the machine, perform the following:

    1. Sign on to the computer with an account that has administrative rights.

    2. In **Control Panel**, select **Programs and Features**.

    3. In **Programs and Features**, select **Azure Connected Machine Agent**, select **Uninstall**, and then select **Yes**.

        >[!NOTE]
        >The agent Setup Wizard can also be run by double-clicking **AzureConnectedMachineAgent.msi** installer package.

    If you would like to script the uninstall, you can use the following example, which retrieves the product code and uninstalls the agent using the Msiexec.exe command line - `msiexec /x {Product Code}`. Open the Registry Editor and look under the registry key `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall` and find the product code GUID. You can then uninstall the agent using Msiexec.

   The example below demonstrates uninstalling the agent.

   ```powershell
   Get-ChildItem -Path HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall | `
   Get-ItemProperty | `
   Where-Object {$_.DisplayName -eq "Azure Connected Machine Agent"} | `
   ForEach-Object {MsiExec.exe /x "$($_.PsChildName)" /qn}
   ```

4. To uninstall the Linux agent, execute the following command to uninstall the agent.

   ```bash
   sudo apt purge hybridagent
   ```

## Next steps

> [!div class="nextstepaction"]
> [Assign a Policy to Connected Machines](../../governance/policy/assign-policy-portal.md)
