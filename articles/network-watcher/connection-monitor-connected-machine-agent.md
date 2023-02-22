---
title: Install the Azure Connected Machine agent for connection monitor
description: This article describes how to install Azure Connected Machine agent
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.custom: ignite-2022, engagement-fy23
ms.topic: how-to
ms.date: 10/27/2022
ms.author: halkazwini
#Customer intent: I need to monitor a connection by using Azure Monitor Agent.
---

# Install the Azure Connected Machine agent to enable Azure Arc 

This article describes how to install the Azure Connected Machine agent.

## Prerequisites

* An Azure account with an active subscription. If you don't already have an account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrator permissions to install and configure the Connected Machine agent. On Linux, you install and configure it by using the root account, and on Windows, you use an account that's a member of the Local Administrators group.
* Register the Microsoft.HybridCompute, Microsoft.GuestConfiguration, and Microsoft.HybridConnectivity resource providers on your subscription. You can [register these resource providers](../azure-arc/servers/prerequisites.md#azure-resource-providers) either ahead of time or as you're completing the steps in this article.
* Review the [agent prerequisites](../azure-arc/servers/prerequisites.md), and ensure that:
  * Your target machine is running a supported [operating system](../azure-arc/servers/prerequisites.md#supported-operating-systems).
  * Your account has the [required Azure built-in roles](../azure-arc/servers/prerequisites.md#required-permissions).
  * The machine is in a [supported region](../azure-arc/overview.md).
  * If the machine connects through a firewall or proxy server to communicate over the internet, the listed URLs in [Connected Machine agent network requirements](../azure-arc/servers/network-requirements.md#urls) aren't blocked.

## Generate an installation script

Use the Azure portal to create a script that automates the downloading and installation of the agent and establishes the connection with Azure Arc.

1. In the [Azure portal](https://portal.azure.com), search for **Servers - Azure Arc**, and then select it in the results list.

1. On the **Servers - Azure Arc** page, select **Add**.

1. On the **Add a single server** tile, select **Generate script**.

1. Review the information on the **Prerequisites** page, and then select **Next**.

1. On the **Resource details** page, provide the following:

   a. Select the subscription and resource group where you want the machine to be managed within Azure.  
   b. For **Region**, select the Azure region in which the server's metadata will be stored.  
   c. For **Operating system**, select the operating system of the server you want to connect.  
   d. For **Connectivity method**, select how the Azure Connected Machine agent should connect to the internet. If you select **Proxy server**, enter the proxy server IP address, or enter the name and port number that the machine will use, in the format `http://<proxyURL>:<proxyport>`.  
   e. Select **Next**.

1. On the **Tags** page, review the default **Physical location tags** suggested and either enter a value or specify one or more **Custom tags** to support your standards. 

1. Select **Next**.

1. On the **Download and run script** page, select the **Register** button to register the required resource providers in your subscription, if you haven't already done so.

1. In the **Download or copy the following script** section, review the script. If you want to make any changes, use the **Previous** button to go back and update your selections. Otherwise, select **Download** to save the script file.

## Install the agent by using the script

After you've generated the script, the next step is to run it on the server that you want to onboard to Azure Arc. The script will download the Connected Machine agent from the Microsoft Download Center, install the agent on the server, create the Azure Arc-enabled server resource, and associate it with the agent.

Follow the steps corresponding to the operating system of your server.

# [Windows agent](#tab/WindowsScript)

1. Sign in to the server.

1. Open an elevated 64-bit PowerShell Command Prompt window.

1. Change to the folder or share that you copied the script to, and then execute it on the server by running the `./OnboardingScript.ps1` script.

# [Linux agent](#tab/LinuxScript)

To install the Linux agent, run one of the following commands:

* On the target machine that can directly communicate to Azure, run:

    ```bash
    bash ~/Install_linux_azcmagent.sh
    ```

* If the target machine communicates through a proxy server, run:

    ```bash
    bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
    ```
--- 

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server is successfully connected. View your machine in the [Azure portal](https://aka.ms/hybridmachineportal).

## Connect hybrid machines to Azure by using PowerShell

For servers that are enabled with Azure Arc, you can take the previously mentioned manual steps to enable them for one or more Windows or Linux machines in your environment. 

Alternatively, you can use the PowerShell cmdlet `Connect-AzConnectedMachine` to download the Azure Connected Machine agent, install the agent, and register the machine with Azure Arc. The cmdlet downloads the Windows agent package (Windows Installer) from the Microsoft Download Center, and it downloads the Linux agent package from the Microsoft package repository.

Refer to the linked document to discover the required steps to install the [Azure Arc agent via PowerShell](../azure-arc/servers/onboard-powershell.md).

## Connect hybrid machines to Azure from Windows Admin Center

You can enable Azure Arc-enabled servers for one or more Windows machines in your environment manually, or you can use the Windows Admin Center to deploy the Azure Connected Machine agent and register your on-premises servers without having to perform any steps outside of this tool. For more information about installing the Azure Arc agent via Windows Admin Center, see [Connect hybrid machines to Azure from Windows Admin Center](../azure-arc/servers/onboard-windows-admin-center.md).

## Next steps

- [Install Azure Monitor Agent](connection-monitor-install-azure-monitor-agent.md)
