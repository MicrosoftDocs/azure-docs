---
title: Connect hybrid machine with Azure Arc–enabled servers
description: Learn how to connect and register your hybrid machine with Azure Arc–enabled servers.
ms.topic: quickstart
ms.date: 12/15/2020
---

# Quickstart: Connect hybrid machines with Azure Arc–enabled servers

[Azure Arc–enabled servers](../overview.md) enables you to manage and govern your Windows and Linux machines hosted across on-premises, edge, and multicloud environments. In this quickstart, you'll deploy and configure the Connected Machine agent on your Windows or Linux machine hosted outside of Azure for management by Azure Arc–enabled servers.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Deploying the Azure Arc–enabled servers Hybrid Connected Machine agent requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, with an account that is a member of the Local Administrators group.

* Before you get started, be sure to review the agent [prerequisites](../agent-overview.md#prerequisites) and verify the following:

    * Your target machine is running a supported [operating system](../agent-overview.md#supported-operating-systems).

    * Your account is granted assignment to the [required Azure roles](../agent-overview.md#required-permissions).

    * If the machine connects through a firewall or proxy server to communicate over the Internet, make sure the URLs [listed](../agent-overview.md#networking-configuration) are not blocked.

    * Azure Arc–enabled servers supports only the regions specified [here](../overview.md#supported-regions).

> [!WARNING]
> The Linux hostname or Windows computer name cannot use one of the reserved words or trademarks in the name, otherwise attempting to register the connected machine with Azure will fail. See [Resolve reserved resource name errors](../../../azure-resource-manager/templates/error-reserved-resource-name.md) for a list of the reserved words.

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

## Register Azure resource providers

Azure Arc–enabled servers depends on the following Azure resource providers in your subscription in order to use this service:

* Microsoft.HybridCompute
* Microsoft.GuestConfiguration

Register them using the following commands:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
```

## Generate installation script

The script to automate the download, installation, and establish the connection with Azure Arc, is available from the Azure portal. To complete the process, do the following:

1. Launch the Azure Arc service in the Azure portal by clicking **All services**, then searching for and selecting **Servers - Azure Arc**.

    :::image type="content" source="./media/quick-enable-hybrid-vm/search-machines.png" alt-text="Search for Azure Arc–enabled servers in All Services" border="false":::

1. On the **Servers - Azure Arc** page, select **Add** at the upper left.

1. On the **Select a method** page, select the **Add servers using interactive script** tile, and then select **Generate script**.

1. On the **Generate script** page, select the subscription and resource group where you want the machine to be managed within Azure. Select an Azure location where the machine metadata will be stored. This location can be the same or different, as the resource group's location.

1. On the **Prerequisites** page, review the information and then select **Next: Resource details**.

1. On the **Resource details** page, provide the following:

    1. In the **Resource group** drop-down list, select the resource group the machine will be managed from.
    1. In the **Region** drop-down list, select the Azure region to store the servers metadata.
    1. In the **Operating system** drop-down list, select the operating system that the script be configured to run on.
    1. If the machine is communicating through a proxy server to connect to the internet, specify the proxy server IP address or the name and port number that the machine will use to communicate with the proxy server. Enter the value in the format `http://<proxyURL>:<proxyport>`.
    1. Select **Next: Tags**.

1. On the **Tags** page, review the default **Physical location tags** suggested and enter a value, or specify one or more **Custom tags** to support your standards.

1. Select **Next: Download and run script**.

1. On the **Download and run script** page, review the summary information, and then select **Download**. If you still need to make changes, select **Previous**.

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

    * If the target machine communicates through a proxy server, run the following command:

        ```bash
        bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
        ```

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc–enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the [Azure portal](https://aka.ms/hybridmachineportal).

:::image type="content" source="./media/quick-enable-hybrid-vm/enabled-machine.png" alt-text="A successful machine connection" border="false":::

## Next steps

Now that you've enabled your Linux or Windows hybrid machine and successfully connected to the service, you are ready to enable Azure Policy to understand compliance in Azure.

To learn how to identify Azure Arc–enabled servers enabled machine that doesn't have the Log Analytics agent installed, continue to the tutorial:

> [!div class="nextstepaction"]
> [Create a policy assignment to identify non-compliant resources](tutorial-assign-policy-portal.md)
