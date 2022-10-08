---
title: Install agents for connection monitor
description: This article describes how to install Azure Connected machine agent
services: network-watcher
author: v-ksreedevan
ms.service: network-watcher
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/11/2022
ms.author: v-ksreedevan
#Customer intent: I need to monitor a connection using Azure Monitor agent.
---

# Install Azure Connected Machine agent to enable Arc 

This article describes the procedure to install the Azure Connected Machine agent.

## Prerequisites

* An Azure account with an active subscription, else [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrator permissions to install and configure the Connected Machine agent. On Linux, the installation and configuration is done using the root account, and on Windows, with an account that is a member of the Local Administrators group.
* Register the Microsoft.HybridCompute, Microsoft.GuestConfiguration, and Microsoft.HybridConnectivity resource providers on your subscription. You can [register these resource providers](../azure-arc/servers/prerequisites.md#azure-resource-providers) ahead of time, or while completing the steps in this article.
* Review the [agent prerequisites](../azure-arc/servers/prerequisites.md) and ensure the following:
  * Your target machine is running a supported [operating system](../azure-arc/servers/prerequisites.md#supported-operating-systems).
  * Your account has the [required Azure built-in roles](../azure-arc/servers/prerequisites.md#required-permissions).
  * The machine is in a [supported region](../azure-arc/overview.md).
  * If the machine connects through a firewall or proxy server to communicate over the Internet, make sure the listed [URLs](../azure-arc/servers/network-requirements.md#urls) aren't blocked.

## Generate installation script

Use the Azure portal to create a script that automates the download and installation of the agent and establishes the connection with Azure Arc.

1. In the Azure portal, search for **Servers - Azure Arc** and select it.

  1. On the **Servers - Azure Arc** page, select **Add**.

1. On the next screen, from the **Add a single server** tile, select **Generate script**.

1. Review the information on the **Prerequisites** page, then select **Next**.

1. On the **Resource details** page, provide the following:

   1. Select the subscription and resource group where you want the machine to be managed within Azure.
   1. For **Region**, choose the Azure region in which the server's metadata will be stored.
   1. For **Operating system**, select the operating system of the server you want to connect.
   1. For **Connectivity method**, choose how the Azure Connected Machine agent should connect to the internet. If you select **Proxy server**, enter the proxy server IP address, or the name and port number that the machine will use in the format `http://<proxyURL>:<proxyport>`.
   1. Select **Next**.

1. On the **Tags** page, review the default **Physical location tags** suggested and enter a value, or specify one or more **Custom tags** to support your standards. Then select **Next**.

1. On the **Download and run script** page, select the **Register** button to register the required resource providers in your subscription, if you haven't already done so.

1. In the **Download or copy the following script** section, review the script. If you want to make any changes, use the **Previous** button to go back and update your selections. Otherwise, select **Download** to save the script file.

## Install the agent using the script

After you've generated the script, the next step is to run it on the server that you want to onboard to Azure Arc. The script will download the Connected Machine agent from the Microsoft Download Center, install the agent on the server, create the Azure Arc-enabled server resource, and associate it with the agent.

Follow the steps corresponding to the operating system of your server.

# [Windows agent](#tab/WindowsScript)

1. Sign in to the server.

1. Open an elevated 64-bit PowerShell command prompt.

1. Change to the folder or share that you copied the script to, then execute it on the server by running the `./OnboardingScript.ps1` script.

### [Linux agent](#tab/LinuxScript)

1. To install the Linux agent on the target machine that can directly communicate to Azure, run the following command:

    ```bash
    bash ~/Install_linux_azcmagent.sh
    ```

1. Alternately, if the target machine communicates through a proxy server, run the following command:

    ```bash
    bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
    ```
--- 

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the [Azure portal](https://aka.ms/hybridmachineportal).

## Connect hybrid machines to Azure by using PowerShell

For servers enabled with Azure Arc, you can take manual steps mentioned above to enable them for one or more Windows or Linux machines in your environment. Alternatively, you can use the PowerShell cmdlet Connect-AzConnectedMachine to download the Connected Machine agent, install the agent, and register the machine with Azure Arc. The cmdlet downloads the Windows agent package (Windows Installer) from the Microsoft Download Center, and the Linux agent package from the Microsoft package repository.
Refer to the linked document to discover the required steps to install the [Arc agent via PowerShell](../azure-arc/servers/onboard-powershell.md)

## Connect hybrid machines to Azure from Windows Admin Center

You can enable Azure Arc-enabled servers for one or more Windows machines in your environment manually or use the Windows Admin Center to deploy the Connected Machine agent and register your on-premises servers without having to perform any steps outside of this tool. [Learn more](../azure-arc/servers/onboard-windows-admin-center.md) about installing Arc agent via the Windows Admin Center.

## Next steps

- Install [Azure Monitor agent](connection-monitor-install-azure-monitor-agent.md).
