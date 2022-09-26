---
title: Connect hybrid machines to Azure from Windows Admin Center
description: In this article, you learn how to install the agent and connect machines to Azure by using Azure Arc-enabled servers from  Windows Admin Center.
ms.date: 08/17/2021
ms.topic: conceptual
---

# Connect hybrid machines to Azure from Windows Admin Center

You can enable Azure Arc-enabled servers for one or more Windows machines in your environment by performing a set of steps manually. Or you can use [Windows Admin Center](/windows-server/manage/windows-admin-center/understand/what-is) to deploy the Connected Machine agent and register your on-premises servers without having to perform any steps outside of this tool.

## Prerequisites

* Azure Arc-enabled servers - Review the [prerequisites](prerequisites.md) and verify that your subscription, your Azure account, and resources meet the requirements.

* Windows Admin Center - Review the requirements to [prepare your environment](/windows-server/manage/windows-admin-center/deploy/prepare-environment) to deploy and [configure Azure integration](/windows-server/manage/windows-admin-center/azure/azure-integration).

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* The target Windows servers that you want to manage must have Internet connectivity to access Azure.

### Security

This deployment method requires that you have administrator rights on the target Windows machine or server to install and configure the agent. You also need to be a member of the [**Gateway users**](/windows-server/manage/windows-admin-center/plan/user-access-options#gateway-access-roles) role.

## Deploy

Perform the following steps to configure the Windows server with Azure Arc-enabled servers.

1. Sign in to Windows Admin Center.

1. From the connection list on the **Overview** page, in the list of connected Windows servers, select a server from the list to connect to it.

1. From the left-hand pane, select **Azure hybrid services**.

1. On the **Azure hybrid services** page, select **Discover Azure services**.

1. On the **Discover Azure services** page, under **Leverage Azure policies and solutions to manage your servers with Azure Arc**, select **Set up**.

1. On the **Settings\Azure Arc for servers** page, if prompted authenticate to Azure and then select **Get started**.

1. On the **Connect server to Azure** page, provide the following:

    1. In the **Azure subscription** drop-down list, select the Azure subscription.
    1. For **Resource group**, either select **New** to create a new resource group, or under the **Resource group** drop-down list, select an existing resource group to register and manage the machine from.
    1. In the **Region** drop-down list, select the Azure region to store the servers metadata.
    1. If the machine or server is communicating through a proxy server to connect to the internet, select the option **Use proxy server**. Using this configuration, the agent communicates through the proxy server using the HTTP protocol. Specify the proxy server IP address or the name, and port number that the machine will use to communicate with the proxy server.

1. Select **Set up** to proceed with configuring the Windows server with Azure Arc-enabled servers.

The Windows server will connect to Azure, download the Connected Machine agent, install it and register with Azure Arc-enabled servers. To track the progress, select **Notifications** in the menu.

To confirm installation of the Connected Machine Agent, in Windows Admin Center select [**Events**](/windows-server/manage/windows-admin-center/use/manage-servers#events) from the left-hand pane to review *MsiInstaller* events in the Application Event Log.

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the [Azure portal](https://portal.azure.com).

:::image type="content" source="./learn/media/quick-enable-hybrid-vm/enabled-machine.png" alt-text="A successful machine connection" border="false":::

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
