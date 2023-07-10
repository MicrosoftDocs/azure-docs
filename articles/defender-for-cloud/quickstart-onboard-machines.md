---
title: Connect your on-premises machines to Defender for Cloud
description: Learn how to connect your on-premises machines to Microsoft Defender for Cloud
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
ms.custom: mode-other
---

# Connect your non-Azure machines to Microsoft Defender for Cloud

Defender for Cloud can monitor the security posture of your non-Azure computers, but first you need to connect them to Azure.

You can connect your non-Azure computers in any of the following ways:

- Onboarding with Azure Arc:
  - [Using Azure Arc-enabled servers](#connect-on-premises-machines-using-azure-arc) (**recommended**)
  - [From Defender for Cloud's pages in the Azure portal](#connect-on-premises-machines-using-the-azure-portal)
- [Onboarding directly with Defender for Endpoint](onboard-machines-with-defender-for-endpoint.md)

> [!TIP]
> If you're connecting machines from other cloud providers, see [Connect your AWS accounts](quickstart-onboard-aws.md) or [Connect your GCP projects](quickstart-onboard-gcp.md). Defender for Cloud's multicloud connectors for AWS and GCP transparently handles the Azure Arc deployment for you.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [Set up Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Access to an on-premises machine.

## Connect on-premises machines using Azure Arc

A machine that has [Azure Arc-enabled servers](../azure-arc/servers/overview.md) becomes an Azure resource. When you've installed the Log Analytics agent on it, it appears in Defender for Cloud with recommendations similar to your other Azure resources.

In addition, Azure Arc-enabled servers provide enhanced capabilities such as the ability to enable guest configuration policies on the machine, simplify deployment with other Azure services and more. For an overview of the benefits of Azure Arc-enabled servers, see [Supported cloud operations](../azure-arc/servers/overview.md#supported-cloud-operations).

> [!NOTE]
> Defender for Cloud's auto-deploy tools for deploying the Log Analytics agent works with machines running Azure Arc however this capability is currently in preview . When you've connected your machines using Azure Arc, use the relevant Defender for Cloud recommendation to deploy the agent and benefit from the full range of protections offered by Defender for Cloud:
>
> - [Log Analytics agent should be installed on your Linux-based Azure Arc machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/720a3e77-0b9a-4fa9-98b6-ddf0fd7e32c1)
> - [Log Analytics agent should be installed on your Windows-based Azure Arc machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/27ac71b1-75c5-41c2-adc2-858f5db45b08)

**To deploy Azure Arc on one machine:**

Follow the instructions in [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](../azure-arc/servers/learn/quick-enable-hybrid-vm.md).

**To deploy Azure Arc for multiple machines at scale:**

Follow the instructions in [Connect hybrid machines to Azure at scale](../azure-arc/servers/onboard-service-principal.md).

## Connect on-premises machines using the Azure portal

Once Defender for Cloud has been connected to your Azure subscription, you can start connecting your on-premises machines from the Getting started page within Defender for Cloud.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Getting started**.

1. Select the **Get started** tab.

1. Locate the Add on-premises servers and select **Configure** .

    :::image type="content" source="./media/quickstart-onboard-machines/onboarding-get-started-tab.png" alt-text="Screenshot of the Get Started tab in the Getting started page." lightbox="./media/quickstart-onboard-machines/onboarding-get-started-tab.png":::

    A list of your Log Analytics workspaces is shown.

1. (Optional) If you don't already have a Log Analytics workspace, select **Create New workspace**, to create a new workspace in which to store the data. Follow the onscreen guide to create the workspace.

1. From the list of workspaces, select **Upgrade** for the relevant workspace to turn on Defender for Cloud's paid plans for 30 free days.

1. From the list of workspaces, select **Add Servers** for the relevant workspace.

    The **Agents management** page appears.

    From here, choose the following relevant procedure depending on the type of machines you're onboarding:

    - [Onboard your Windows server](#onboard-your-windows-server)
    - [Onboard your Linux servers](#onboard-your-linux-servers)

## Onboard your Windows server

When you add Windows server, you need the information on the Agents management page and to download the appropriate agent file (32/64-bit).

**To onboard a Windows server**:

1. Select **Windows servers**.

    :::image type="content" source="media/quickstart-onboard-machines/windows-servers.png" alt-text="Screenshot that shows the Windows servers tab selected.":::

1. Select the **Download Windows Agent** link applicable to your computer processor type to download the setup file.

1. From the **Agents management** page, copy the **Workspace ID** and **Primary Key** into Notepad.

1. Copy the downloaded setup file to the target computer and run it.

1. Follow the installation wizard (**Next**, **I Agree**, **Next**, **Next**).

  1. On the **Azure Log Analytics** page, paste the **Workspace ID** and **Workspace Key (Primary Key)** that you copied into Notepad.
    
  1. If the computer should report to a Log Analytics workspace in Azure Government cloud, select **Azure US Government** from the **Azure Cloud** dropdown list.
    
  1. If the computer needs to communicate through a proxy server to the Log Analytics service, select **Advanced** and provide the URL and port number of the proxy server.
    
  1. When you've entered all of the configuration settings, select **Next**.
    
  1. From the **Ready to Install** page, review the settings to be applied and select **Install**.
    
  1. On the **Configuration completed successfully** page, select **Finish**.

When complete, the **Microsoft Monitoring agent** appears in **Control Panel**. You can review your configuration there and verify that the agent is connected.

For more information on installing and configuring the agent, see [Connect Windows machines](../azure-monitor/agents/agent-windows.md#install-the-agent).

### Onboard your Linux servers

To add Linux machines, you need the WGET command from the **Agents management** page.

**To onboard your Linux server**:

1. Select **Linux servers**.

    :::image type="content" source="media/quickstart-onboard-machines/linux-servers.png" alt-text="Screenshot that shows the Linux servers tab selected.":::

1. Copy the **WGET** command into Notepad. Save this file to a location that can be accessible from your Linux computer.

1. On your Linux computer, open the file with the WGET command. Select the entire content and copy and paste it into a terminal console.

1. When the installation completes, you can validate that the `omsagent` is installed by running the `pgrep` command. The command returns the `omsagent` PID.

    The logs for the Agent can be found at: `/var/opt/microsoft/omsagent/\<workspace id>/log/`. It might take up to 30 minutes for the new Linux machine to appear in Defender for Cloud.

## Verify your machines are connected

Your Azure and on-premises machines are available to view in one location.

**To verify your machines are connected**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select [**Inventory**](asset-inventory.md).

1. Filter the page to view the relevant resource types. These icons distinguish the types:

  ![Defender for Cloud icon for on-premises machine.](./media/quickstart-onboard-machines/security-center-monitoring-icon1.png) Non-Azure machine

  ![Defender for Cloud icon for Azure machine.](./media/quickstart-onboard-machines/security-center-monitoring-icon2.png) Azure VM

  ![Defender for Cloud icon for Azure Arc server.](./media/quickstart-onboard-machines/arc-enabled-machine-icon.png) Azure Arc-enabled server

## Clean up resources

There's no need to clean up any resources for this tutorial.

## Next steps

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md)

- Set up your [AWS account](quickstart-onboard-aws.md), [GCP projects](quickstart-onboard-gcp.md).
