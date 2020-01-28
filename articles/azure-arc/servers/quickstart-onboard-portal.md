---
title: Connect hybrid machines to Azure from the Azure portal
description: In this article you learn how to install the agent and connect machines to Azure using Azure Arc for servers from the Azure portal.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 01/24/2020
ms.custom: mvc
ms.topic: quickstart
---

# Connect hybrid machines to Azure from the Azure portal

You can enable Azure Arc for servers (preview) for one or a small number of Windows or Linux machines in your environment by performing a set of steps manually, or using an automated method by running a template script that we provide. This script automates the download and installation of both agents.

This installation method requires that you have administrative rights on the machine to install and configure the agent. On Linux, using the root account and on Windows, you are member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](overview.md#prerequisites) and verify that your subscription and resources meet the requirements. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Generate the agent install script from the Azure portal

The script to automate the download, installation, and establishing the connection with Azure Arc is available from the Azure portal. The following steps describe how to complete this process.

1. From your browser, launch [https://aka.ms/hybridmachineportal](https://aka.ms/hybridmachineportal).

2. On the **Machines - Azure Arc** page, either select **+Add** in the upper lef-hand corner, or select the **Create machine - Azure Arc** option from the bottom of the middle pane. 

3. On the **Select a method** page, select from the **Add machines using interactive script** tile **Generate script**.

4. On the **Generate script** page, select the subscription and resource group where you want the machine to be managed within Azure. Select an Azure location where machine metadata will be stored.

    >[!NOTE]
    >Azure Arc for servers (preview), only supports the following regions:
    >- WestUS2
    >- WestEurope
    >- WestAsia
    >

5. On the **Generate script** page, under the **Operating system** drop-down list, select the appropriate operating system the script will be running on.

6. If the machine is communicating through a proxy server in order to connect to the Internet, select the option **Next: Proxy Server>**. On the **Proxy server** tab, specify the proxy server IP address and port number that the machine will use to communicate with the proxy server. Once completed, select **Review + generate**.  Otherwise, select **Review + generate** to complete the steps.

7. On the **Review + generate** tab, review the summary information and then select **Download**. Otherwise if you need to make changes, you can select **Previous**.

## Install and validate the agent on Windows

## Install manually

You can install the Connected Machine agent manually by running the Windows Installer installation package `AzureConnectedMachineAgent.msi` after downloading it and copying it to a folder on the target server, or from a shared network folder. If you run the Installer package without any options, it starts a setup wizard that you can follow to install the agent interactively.

>[!NOTE]
>*Administrator* privileges are required to install or uninstall the agent.

If the machine needs to communicate through a proxy server to the service, after you install the agent you need to run a command described in a section below to set the proxy server system environment variable `https_proxy`.

The following table highlights the parameters that are supported by setup for the agent from the command line.

| Parameter | Description |
|:--|:--|
| /? | Returns a list of the command-line options. |
| /S | Performs a silent installation with no user interaction. |

For example, to run the installation program with the `/?` parameter, enter **msiexec.exe /i AzureConnectedMachineAgent /?**.

Files for the Connected Machine agent are installed in *C:\Program Files\AzureConnectedMachineAgent* by default. If the agent fails to start after setup is finished, check the logs for detailed error information. The log directory is *%Programfiles%\AzureConnectedMachineAgentAgent\logs*.

### Install using scripted method

1. Log onto the server.

2. Open an elevated PowerShell command prompt. 

3. Change to the folder or share you copied the script to and execute it on the server by running the command :

    `./OnboardingScript.ps1`

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

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) and hosted on Microsoft's [package repository](https://packages.microsoft.com/). A shell script bundle `Install_linux_azcmagent.sh` located at [https://aka.ms/azcmagent](https://aka.ms/azcmagent) performs the following actions:

- Configures the host machine to download the agent package from packages.microsoft.com.
- Installs the Hybrid Resource Provider package.
- Optionally, configures the agent with your proxy information, if you specify the `--proxy "{proxy-url}:{proxy-port}"` parameter.

The script also contains logic to identify supported and un-supported distributions, as well as verifying required permissions to perform the installation. You can skip the conditional checks by specifying the `-O` parameter.

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





With the script you just created, you need to copy it to the target machine you want to connect to Azure Arc, and log on to run it. The script downloads the agent, installs it, and connects the machine in a single operation. After the script is complete, you need to verify the machine by submitting a code that is displayed at the end of script execution from your browser.

>[!NOTE]
>Verifying the machine using a web browser does not need to be performed from the server you are connecting to Azure Arc. We recommend as a standard security practice to avoid browsing the Internet from your production machines.
>

You can complete these steps using SSH for Linux, and for Windows by logging on locally, using Remote Desktop Protocol (RDP), or PowerShell remoting.

1. Log onto the server.

2. Open a shell with administrative privileges. 

3. Open the folder you copied the script to and execute it on the server by running the command:

    ```


1. Logon to the server (using SSH, RDP or PowerShell Remoting)
1. Start a shell: bash on Linux, PowerShell as Administrator on Windows
1. Paste in the script from the portal and execute it on the server to be connected to Azure.
1. The default authentication for onboarding an individual server is *interactive* using Azure 'device login'. When you run the script, you will see a message similar to:

  ```none
  To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code B3V3NLWRF to authenticate.
  ```
  
   Open a browser and enter the code to authenticate. The browser doesn't need to be running on the server you are onboarding, it could be on another computer such as your laptop.

1. If you would like to authenticate non-interactively, follow the steps in [Create a Service Principal](quickstart-onboard-powershell.md#create-a-service-principal-for-onboarding-at-scale) and modify the script generated from the portal.

> [!NOTE]
> If you are using Internet Explorer on the server for the very first time to logon, it will error out. You can just reopen the browser and do it again.

## Execute the script on target nodes

Log in to each Node and execute the script you generated from the portal. After the script completes successfully, go to the Azure portal verify that the server has been successfully connected.

![Successful Onboarding](./media/quickstart-onboard/arc-for-servers-successful-onboard.png)

## Clean up

To disconnect a machine from Azure Arc for servers, you need to perform two steps.

1. Select the machine in [Portal](https://aka.ms/hybridmachineportal), click the ellipsis (`...`) and select **Delete**.
1. Uninstall the agent from the machine.

   On Windows, you can use the "Apps & Features" control panel to uninstall the agent.
  
  ![Apps & Features](./media/quickstart-onboard/apps-and-features.png)

   If you would like to script the uninstall, you can use the following example which retrieves the **PackageId** and uninstall the agent using `msiexec /X`.

   look under the registry key `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall` and find the **PackageId**. You can then uninstall the agent using `msiexec`.

   The example below demonstrates uninstalling the agent.

   ```powershell
   Get-ChildItem -Path HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall | `
   Get-ItemProperty | `
   Where-Object {$_.DisplayName -eq "Azure Connected Machine Agent"} | `
   ForEach-Object {MsiExec.exe /Quiet /X "$($_.PsChildName)"}
   ```

   On Linux, execute the following command to uninstall the agent.

   ```bash
   sudo apt purge hybridagent
   ```

## Next steps

> [!div class="nextstepaction"]
> [Assign a Policy to Connected Machines](../../governance/policy/assign-policy-portal.md)
