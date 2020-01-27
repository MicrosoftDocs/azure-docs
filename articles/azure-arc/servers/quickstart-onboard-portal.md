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

You can enable Azure Arc for servers (preview) for one or a small number of Windows or Linux machines in your environment using a script that we provide. This script automates the download and installation of both agents, and then prompts you to verify the machine connection with Azure Arc. 

This installation method requires that you have administrative rights on the machine to install and configure the agent. On Linux, using the root account and on Windows, you are member of the Local Administrators group.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To understand the supported configurations and deployment requirements, review [Azure Arc for servers Overview](overview.md).

## Generate the agent install script using the Azure portal

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

The script must be run on the target machine you want to connect. It downloads the agent, installs it, and connects the machine as a single operation.

On the Non-Azure servers you want to manage:

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
