---
title: Connect hybrid machine with Azure Arc enabled servers
description: Learn how to collect and analyze data for an Azure virtual machine in Azure Monitor.
ms.service:  azure-arc
ms. subservice: azure-arc-servers
ms.topic: quickstart
author: mgoedtel
ms.author: magoedte
ms.date: 08/03/2020
---

# Quickstart: Connect hybrid machine with Azure Arc enabled servers

[Azure Arc for servers](../overview.md) (preview) enables you to manage and govern your Windows and Linux machines hosted across on-premises, edge and multicloud environments. In this quickstart, you'll enable the machine for management by Arc for servers (preview).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Deploying the Arc for servers (preview) Hybrid Connected Machine agent requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, you are member of the Local Administrators group.

* Before you get started, be sure to review the [prerequisites](../agent-overview.md#prerequisites) and verify the following:

    * Your target machine is running a supported [operating system](../agent-overview.md#supported-operating-systems).

    * Your account is granted assignment to the [required Azure roles](../agent-overview.md#required-permissions).

    * If the machine connects through a firewall or proxy server to communicate over the Internet, make sure the URLs [listed](../agent-overview.md#networking-configuration) are not blocked.

    * Azure Arc for servers (preview) only the regions specified [here](../overview.md#supported-regions).

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

## Register Azure resource providers

Azure Arc for servers (preview) depends on the following Azure resource providers in your subscription in order to use this service:

* Microsoft.HybridCompute
* Microsoft.GuestConfiguration

Register them using the following commands:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
```

## Generate installation script

The script to automate the download and installation, and to establish the connection with Azure Arc, is available from the Azure portal. To complete the process, do the following:

1. From your browser, go to the [Azure portal](https://aka.ms/hybridmachineportal).

1. On the **Machines - Azure Arc** page, select either **Add**, at the upper left, or the **Create machine - Azure Arc** option at the bottom of the middle pane.

1. On the **Select a method** page, select the **Add machines using interactive script** tile, and then select **Generate script**.

1. On the **Generate script** page, select the subscription and resource group where you want the machine to be managed within Azure. Select an Azure location where the machine metadata will be stored.

1. On the **Generate script** page, in the **Operating system** drop-down list, select the operating system that the script will be running on.

1. If the machine is communicating through a proxy server to connect to the internet, select **Next: Proxy Server**.

1. On the **Proxy server** tab, specify the proxy server IP address or the name and port number that the machine will use to communicate with the proxy server. Enter the value in the format `http://<proxyURL>:<proxyport>`.

1. Select **Review + generate**.

1. On the **Review + generate** tab, review the summary information, and then select **Download**. If you still need to make changes, select **Previous**.

## Install the agent using the script

### Windows agent

1. Log in to the server.

1. Open an elevated 64-bit PowerShell command prompt.

1. Change to the folder or share that you copied the script to, and execute it on the server by running the `./OnboardingScript.ps1` script.

### Linux agent

1. To install the Linux agent on the target machine that can directly communicate to Azure, run the following command:

    ```bash
    bash ~/Install_linux_azcmagent.sh
    ```

    If the target machine communicates through a proxy server, run the following command:

    ```bash
    bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
    ```

## Configure the agent communication

After you install the agent, configure it to communicate with the Azure Arc service by running the following command. For Linux machines, you must have **root** access permissions to run the command.

`azcmagent connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID"`

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc for servers (preview), go to the Azure portal to verify that the server has been successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

![A successful server connection](../media/onboard-portal/arc-for-servers-successful-onboard.png)