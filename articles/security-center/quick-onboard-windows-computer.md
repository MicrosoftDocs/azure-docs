---
title: Azure Security Center Quickstart - Onboard your Windows computers to Security Center | Microsoft Docs
description: This quickstart shows you how to provision the Microsoft Monitoring Agent on a Windows computer.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/3/2018
ms.author: rkarlin

---
# Quickstart: Onboard Windows computers to Azure Security Center
After you onboard your Azure subscriptions, you can enable Security Center for resources running outside of Azure, for example on-premises or in other clouds, by provisioning the Microsoft Monitoring Agent.

This quickstart shows you how to install the Microsoft Monitoring Agent on a Windows computer.

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

You must be on Security Center’s Standard pricing tier before starting this quickstart. See [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) for upgrade instructions. You can try Security Center’s Standard at no cost. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Add new Windows computer

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**. **Security Center - Overview** opens.

   ![Security Center overview][2]

3. Under the Security Center main menu, select **Getting started**.
4. Select the **Get started** tab.

   ![Get started][3]

5. Click **Configure** under **Add new non-Azure computers**. A list of your Log Analytics workspaces is shown. The list includes, if applicable, the default workspace created for you by Security Center when automatic provisioning was enabled. Select this workspace or another workspace you want to use.

    ![Add non-Azure computer](./media/quick-onboard-windows-computer/non-azure.png)

   The **Direct Agent** blade opens with a link for downloading a Windows agent and keys for your workspace ID to use in configuring the agent.

6. Select the **Download Windows Agent** link applicable to your computer processor type to download the setup file.

7. On the right of **Workspace ID**, select the copy icon and paste the ID into Notepad.

8. On the right of **Primary Key**, select the copy icon and paste the key into Notepad.

## Install the agent
You must now install the downloaded file on the target computer.

1. Copy the file to the target computer and Run Setup.
2. On the **Welcome** page, select **Next**.
3. On the **License Terms** page, read the license and then select **I Agree**.
4. On the **Destination Folder** page, change or keep the default installation folder and then select **Next**.
5. On the **Agent Setup Options** page, choose to connect the agent to Azure Log Analytics and then select **Next**.
6. On the **Azure Log Analytics** page, paste the **Workspace ID** and **Workspace Key (Primary Key)** that you copied into Notepad in the previous procedure.
7. If the computer should report to a Log Analytics workspace in Azure Government cloud, select **Azure US Government** form the **Azure Cloud** dropdown list.  If the computer needs to communicate through a proxy server to the Log Analytics service, select **Advanced** and provide the URL and port number of the proxy server.
8. Select **Next** once you have completed providing the necessary configuration settings.

   ![Install the agent][5]

9. On the **Ready to Install** page, review your choices and then select **Install**.
10. On the **Configuration completed successfully** page, select **Finish**

When complete, the **Microsoft Monitoring Agent** appears in **Control Panel**. You can review your configuration there and verify that the agent is connected.

For further information on installing and configuring the agent, see [Connect Windows computers](../azure-monitor/platform/agent-windows.md#install-the-agent-using-setup-wizard).

Now you can monitor your Azure VMs and non-Azure computers in one place. Under **Compute**, you have an overview of all VMs and computers along with recommendations. Each column represents one set of recommendations. The color represents the VM's or computer's current security state for that recommendation. Security Center also surfaces any detections for these computers in Security alerts.

  ![Compute blade][6]

There are two types of icons represented on the **Compute** blade:

![icon1](./media/quick-onboard-windows-computer/security-center-monitoring-icon1.png) Non-Azure computer

![icon2](./media/quick-onboard-windows-computer/security-center-monitoring-icon2.png) Azure VM

## Clean up resources
When no longer needed, you can remove the agent from the Windows computer.

To remove the agent:

1. Open **Control Panel**.
2. Open **Programs and Features**.
3. In **Programs and Features**, select **Microsoft Monitoring Agent** and click **Uninstall**.

## Next steps
In this quickstart, you provisioned the Microsoft Monitoring Agent on a Windows computer. To learn more about how to use Security Center, continue to the tutorial for configuring a security policy and assessing the security of your resources.

> [!div class="nextstepaction"]
> [Tutorial: Define and assess security policies](tutorial-security-policy.md)

<!--Image references-->
[2]: ./media/quick-onboard-windows-computer/overview.png
[3]: ./media/quick-onboard-windows-computer/get-started.png
[4]: ./media/quick-onboard-windows-computer/add-computer.png
[5]: ./media/quick-onboard-windows-computer/log-analytics-mma-setup-laworkspace.png
[6]: ./media/quick-onboard-windows-computer/compute.png
