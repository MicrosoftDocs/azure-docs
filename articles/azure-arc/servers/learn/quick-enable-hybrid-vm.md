---
title: Quickstart - Connect hybrid machine with Azure Arc-enabled servers
description: In this quickstart, you connect and register a hybrid machine with Azure Arc-enabled servers.
ms.topic: quickstart
ms.date: 03/23/2022
ms.custom: mode-other
---

# Quickstart: Connect hybrid machines with Azure Arc-enabled servers

Get started with [Azure Arc-enabled servers](../overview.md) to manage and govern your Windows and Linux machines hosted across on-premises, edge, and multicloud environments. In this quickstart, you'll deploy and configure the Azure Connected Machine agent on a Windows or Linux machine hosted outside of Azure, so that it can be managed through Azure Arc-enabled servers.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Deploying the Connected Machine agent on a machine requires that you have administrator permissions to install and configure the agent. On Linux, by using the root account, and on Windows, with an account that is a member of the Local Administrators group.
* The Microsoft.HybridCompute, Microsoft.GuestConfiguration, and Microsoft.HybridConnectivity resource providers must be registered on your subscription. You can [register these resource providers ahead of time](../prerequisites.md#azure-resource-providers) or while completing the steps in this quickstart.
* Before you get started, be sure to review the agent [prerequisites](../prerequisites.md) and verify the following:
  * Your target machine is running a supported [operating system](../prerequisites.md#supported-operating-systems).
  * Your account is granted assignment to the [required Azure roles](../prerequisites.md#required-permissions).
  * If the machine connects through a firewall or proxy server to communicate over the Internet, make sure the URLs [listed](../network-requirements.md#urls) are not blocked.
  * Ensure the machine is in a [supported region](../overview.md#supported-regions).
  * Confirm that the Linux hostname or Windows computer name doesn't use a [reserved word or trademark](../../../azure-resource-manager/templates/error-reserved-resource-name.md).

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

## Register Azure resource providers

Azure Arc-enabled servers requires the following [Azure resource providers](../../../azure-resource-manager/management/resource-providers-and-types.md) to be registered in your subscription:

* Microsoft.HybridCompute
* Microsoft.GuestConfiguration
* Microsoft.HybridConnectivity

Register them using the following commands:

```azurepowershell-interactive
Login-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridConnectivity
```

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
az provider register --namespace 'Microsoft.HybridConnectivity'
```

## Generate installation script

The script to automate the download, installation, and establish the connection with Azure Arc, is available from the Azure portal. To complete the process, do the following:

1. Launch the Azure Arc service in the Azure portal by searching for and selecting **Servers - Azure Arc**.

   :::image type="content" source="media/quick-enable-hybrid-vm/search-machines.png" alt-text="Search for Azure Arc-enabled servers in the Azure portal.":::

1. On the **Servers - Azure Arc** page, select **Add** near the upper left.

1. On the next page, from the **Add a single server** tile, select **Generate script**.

1. Review the information on the **Prerequisites** page, then select **Next**.

1. On the **Resource details** page, provide the following:

   1. Select the subscription and resource group where you want the machine to be managed within Azure.
   1. For **Region**, choose the Azure region in which the server's metadata will be stored.
   1. For **Operating system**, select the operating system of the server you want to connect.
   1. For **Connectivity method**, choose how the Azure Connected Machine agent should connect to the internet. For this quickstart, we recommend choosing **Public endpoint**. If the machine is communicating through a proxy server, select that and specify the proxy server IP address or the name and port number that the machine will use in the format `http://<proxyURL>:<proxyport>`.
   1. Select **Next**.

1. On the **Tags** page, review the default **Physical location tags** suggested and enter a value, or specify one or more **Custom tags** to support your standards. Then select **Next**.

1. On the **Download and run script** page, select the **Register** button to register the required resource providers in your subscription if you haven't already done so.

1. In the **Download or copy the following script** section, review the script and then select Download. If you need to make any changes to the script, use the **Previous** button to go back and update your selections.

## Install the agent using the script

Next, you'll run the script that you just generated on the server you want to onboard to Azure Arc. The script will download the Connected Machine agent from the Microsoft Download Center, install the agent on the server, create the Azure Arc-enabled server resource, and associate it with the agent. Follow the steps below based on the operating system of your server.

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

After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the [Azure portal](https://aka.ms/hybridmachineportal).

:::image type="content" source="./media/quick-enable-hybrid-vm/enabled-machine.png" alt-text="A successful machine connection" border="false":::

> [!TIP]
> You can repeat these steps as needed to onboard additional machines. There are also other options for deploying the agent, including several methods designed to onboard at scale. For more information, see [Azure Connected Machine agent deployment options](../deployment-options.md).

## Next steps

Now that you've enabled your Linux or Windows hybrid machine and successfully connected to the service, you are ready to enable Azure Policy to understand compliance in Azure.

To learn how to identify Azure Arc-enabled servers enabled machine that doesn't have the Log Analytics agent installed, continue to the tutorial:

> [!div class="nextstepaction"]
> [Create a policy assignment to identify non-compliant resources](tutorial-assign-policy-portal.md)
