---
title: Connect on-premises machines
description: Learn how to connect your non-Azure machines to Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
ms.custom: mode-other
---

# Connect your non-Azure machines to Microsoft Defender for Cloud

Microsoft Defender for Cloud can monitor the security posture of your non-Azure machines, but first you need to connect them to Azure.

You can connect your non-Azure computers in any of the following ways:

- Onboarding with Azure Arc:
  - By using Azure Arc-enabled servers (recommended)
  - By using the Azure portal
- [Onboarding directly with Microsoft Defender for Endpoint](onboard-machines-with-defender-for-endpoint.md)

This article describes the methods for onboarding with Azure Arc.

If you're connecting machines from other cloud providers, see [Connect your AWS account](quickstart-onboard-aws.md) or [Connect your GCP project](quickstart-onboard-gcp.md). The multicloud connectors for Amazon Web Services (AWS) and Google Cloud Platform (GCP) in Defender for Cloud transparently handle the Azure Arc deployment for you.

## Prerequisites

To complete the procedures in this article, you need:

- A Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free one](https://azure.microsoft.com/pricing/free-trial/).

- [Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) set up on your Azure subscription.

- Access to an on-premises machine.

## Connect on-premises machines by using Azure Arc

A machine that has [Azure Arc-enabled servers](../azure-arc/servers/overview.md) becomes an Azure resource. When you install the Log Analytics agent on it, it appears in Defender for Cloud with recommendations, like your other Azure resources.

Azure Arc-enabled servers provide enhanced capabilities, such as enabling guest configuration policies on the machine and simplifying deployment with other Azure services. For an overview of the benefits of Azure Arc-enabled servers, see [Supported cloud operations](../azure-arc/servers/overview.md#supported-cloud-operations).

To deploy Azure Arc on one machine, follow the instructions in [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](../azure-arc/servers/learn/quick-enable-hybrid-vm.md).

To deploy Azure Arc on multiple machines at scale, follow the instructions in [Connect hybrid machines to Azure at scale](../azure-arc/servers/onboard-service-principal.md).

Defender for Cloud tools for automatically deploying the Log Analytics agent work with machines running Azure Arc. However, this capability is currently in preview. When you connect your machines by using Azure Arc, use the relevant Defender for Cloud recommendation to deploy the agent and benefit from the full range of protections that Defender for Cloud offers:

- [Log Analytics agent should be installed on your Linux-based Azure Arc machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/720a3e77-0b9a-4fa9-98b6-ddf0fd7e32c1)
- [Log Analytics agent should be installed on your Windows-based Azure Arc machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/27ac71b1-75c5-41c2-adc2-858f5db45b08)

## Connect on-premises machines by using the Azure portal

After you connect Defender for Cloud to your Azure subscription, you can start connecting your on-premises machines from the **Getting started** page in Defender for Cloud.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. On the Defender for Cloud menu, select **Getting started**.

1. Select the **Get started** tab.

1. Find **Add non-Azure servers** and select **Configure**.

    :::image type="content" source="./media/quickstart-onboard-machines/onboarding-get-started-tab.png" alt-text="Screenshot of the tab for getting started with Defender for Cloud and adding an on-premises server." lightbox="./media/quickstart-onboard-machines/onboarding-get-started-tab.png":::

    A list of your Log Analytics workspaces appears.

1. (Optional) If you don't already have a Log Analytics workspace in which to store the data, select **Create new workspace** and follow the on-screen guidance.

1. From the list of workspaces, select **Upgrade** for the relevant workspace to turn on Defender for Cloud paid plans for 30 free days.

1. From the list of workspaces, select **Add Servers** for the relevant workspace.

1. On the **Agents management** page, choose one of the following procedures, depending on the type of machines you're onboarding:

   - [Onboard your Windows server](#onboard-your-windows-server)
   - [Onboard your Linux server](#onboard-your-linux-server)

## Onboard your Windows server

When you add a Windows server, you need to get the information on the **Agents management** page and download the appropriate agent file (32 bit or 64 bit).

To onboard a Windows server:

1. Select **Windows servers**.

    :::image type="content" source="media/quickstart-onboard-machines/windows-servers.png" alt-text="Screenshot that shows the tab for Windows servers.":::

1. Select the **Download Windows Agent** link that's applicable to your computer processor type to download the setup file.

1. From the **Agents management** page, copy the **Workspace ID** and **Primary Key** values into Notepad.

1. Copy the downloaded setup file to the target computer and run it.

1. Follow the installation wizard (select **Next** > **I Agree** > **Next** > **Next**).

1. On the **Azure Log Analytics** page, paste the **Workspace ID** and **Primary Key** values that you copied into Notepad.

1. If the computer should report to a Log Analytics workspace in the Azure Government cloud, select **Azure US Government** from the **Azure Cloud** dropdown list.

1. If the computer needs to communicate through a proxy server to the Log Analytics service, select **Advanced**. Then provide the URL and port number of the proxy server.

1. When you finish entering all of the configuration settings, select **Next**.

1. On the **Ready to Install** page, review the settings to be applied and select **Install**.

1. On the **Configuration completed successfully** page, select **Finish**.

When the process is complete, **Microsoft Monitoring agent** appears in **Control Panel**. You can review your configuration there and verify that the agent is connected.

For more information on installing and configuring the agent, see [Connect Windows machines](../azure-monitor/agents/agent-windows.md#install-the-agent).

### Onboard your Linux server

To add Linux machines, you need the `wget` command from the **Agents management** page.

To onboard your Linux server:

1. Select **Linux servers**.

    :::image type="content" source="media/quickstart-onboard-machines/linux-servers.png" alt-text="Screenshot that shows the tab for Linux servers.":::

1. Copy the `wget` command into Notepad. Save this file to a location that you can access from your Linux computer.

1. On your Linux computer, open the file that contains the `wget` command. Copy the entire contents and paste them into a terminal console.

1. When the installation finishes, validate that the Operations Management Suite Agent is installed by running the `pgrep` command. The command returns the `omsagent` persistent ID.

    You can find the logs for the agent at `/var/opt/microsoft/omsagent/<workspace id>/log/`. The new Linux machine might take up to 30 minutes to appear in Defender for Cloud.

## Verify that your machines are connected

Your Azure and on-premises machines are available to view in one location.

To verify that your machines are connected:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. On the Defender for Cloud menu, select **Inventory** to show the [asset inventory](asset-inventory.md).

1. Filter the page to view the relevant resource types. These icons distinguish the types:

   ![Defender for Cloud icon for an on-premises machine.](./media/quickstart-onboard-machines/security-center-monitoring-icon1.png) Non-Azure machine

   ![Defender for Cloud icon for an Azure machine.](./media/quickstart-onboard-machines/security-center-monitoring-icon2.png) Azure VM

   ![Defender for Cloud icon for an Azure Arc-enabled server.](./media/quickstart-onboard-machines/arc-enabled-machine-icon.png) Azure Arc-enabled server

## Clean up resources

There's no need to clean up any resources for this article.

## Next steps

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md).
- Set up your [AWS account](quickstart-onboard-aws.md) and [GCP projects](quickstart-onboard-gcp.md).
