---
title: Connect Windows Server machines to Azure through Azure Arc Setup
description: In this article, you learn how to connect Windows Server machines to Azure Arc using the built-in Windows Server Azure Arc Setup wizard.
ms.date: 09/21/2023
ms.topic: conceptual
---

# Connect Windows Server machines to Azure through Azure Arc Setup

Windows Server machines can be onboarded directly to Azure Arc through a graphical wizard included in Windows Server. The wizard automates the onboarding process by checking the necessary prerequisites for successful Arc onboarding and fetching and installing the latest version of the Connected Machine agent. Once the wizard process completes, you're directed to your Window Server machine in the Azure portal, where it can be viewed and managed like any other Arc-enabled resource.

## Prerequisites

* Azure Arc-enabled servers - Review the [prerequisites](prerequisites.md) and verify that your subscription, your Azure account, and resources meet the requirements.

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Arc Server Setup and connect to Azure Arc

The Azure Arc Setup wizard is launched from a system tray icon at the bottom of the Windows Server machine when the Azure Arc Setup feature is enabled. This feature is enabled by default. Alternatively, you can launch the wizard from a pop-up window in the Server Manager.

1. Select the Azure Arc system tray icon, then select **Launch Azure Arc Setup**.

    :::image type="content" source="media/onboard-windows-server/system-tray-icon.png" alt-text="Screenshot showing Arc system tray icon and window to launch Arc setup process.":::
   
1. The introduction window of the Azure Arc Setup wizard explains the benefits of onboarding your machine to Azure Arc. When you're ready to proceed, click **Next**.

    :::image type="content" source="media/onboard-windows-server/get-started-with-arc.png" alt-text="Screenshot of the intro page of the wizard.":::

1. The wizard automatically checks for the prerequisites necessary to install the Azure Connected Machine agent on your Windows Server machine. Once this process completes and the agent is installed, select **Configure**.

1. The configuration window details the steps required to configure the agent. When you're ready to begin configuration, select **Next**.

    :::image type="content" source="media/onboard-windows-server/configure-arc.png" alt-text="Screenshot of the Configure Arc window showing the configuration steps.":::

1. Sign-in to Azure by selecting the applicable Azure cloud, and then selecting **Sign in to Azure**. You'll be asked to provide your sign-in credentials.

1. Provide the resource details of how your machine will work within Azure Arc, such as the **Subscription** and **Resource group**, and then select **Next**.

    :::image type="content" source="media/onboard-windows-server/resource-details.png" alt-text="Screenshot of resource details window with fields.":::

1. Select an option for enabling Azure Automanage on your machine, and then click **Next**.

    Azure Automanage machine best practices help enhance reliability, security, and management for virtual machines. To learn more, see [Azure Automanage machine best practices](/azure/automanage/overview-about).

1. Once the configuration completes and your machine is onboarded to Azure Arc, select **Finish**.

1. Go to the Server Manager and select **Local Server** to view the status of the machine in the **Azure Arc Management** field. A successfully onboarded machine has a status of **Enabled**.

    :::image type="content" source="media/onboard-windows-server/server-manager-enabled.png" alt-text="Screenshot of Server Manager local server pane showing machine status is enabled.":::

## Viewing the connected machine

The Azure Arc system tray icon at the bottom of your Windows Server machine indicates if the machine is connected to Azure Arc; a red symbol means the machine is not connected. To view a connected machine is Azure Arc, select the icon and then select **View Machine in Azure**. You can then view the machine in the [Azure portal](https://portal.azure.com/), just as you would other Arc-enabled resources.

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
