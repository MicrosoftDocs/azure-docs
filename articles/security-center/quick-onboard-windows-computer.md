---
title: Azure Security Center Quickstart - Onboard your Windows computers to Security Center | Microsoft Docs
description: This quickstart shows you how to provision the Microsoft Monitoring Agent on a Windows computer.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2017
ms.author: terrylan

---
# Quickstart: Onboard Windows computers to Azure Security Center
After you onboard your Azure subscriptions, you can enable Security Center for resources running outside of Azure, for example on-premises or in other clouds, by provisioning the Microsoft Monitoring Agent

This quickstart shows you how to:

- Provision the Microsoft Monitoring Agent on a Windows computer

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

You must be on Security Center’s Standard pricing tier before starting this quickstart. See [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) for upgrade instructions. You can try Security Center’s Standard at no cost for the first 60 day.

## Onboard a Windows computer

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**.

  ![Azure menu][1]

  **Security Center - Overview** opens.

 ![Security Center overview][2]

## Add new Windows computer

1. Under the Security Center main menu, select **Onboarding to advanced security**.
2. Select **Do you want to add new non-Azure computers**.

   ![Onboard to advanced security][3]

3. On **Add Non-Azure Computers**, a list of your Log Analytics workspaces is shown. The list includes, if applicable, the default workspace created for you by Security Center when automatic provisioning was enabled. Select this workspace or another workspace you wish to use.

    ![Add non-Azure computer][4]

  The **Direct Agent** blade opens with a link for downloading a Windows agent and keys for your workspace ID to use in configuring the agent.

4.	Select the **Download Windows Agent** link applicable to your computer processor type to download the setup file.

5.	On the right of **Workspace ID**, select the copy icon and paste the ID into Notepad.

6.	On the right of **Primary Key**, select the copy icon and paste the key into Notepad.

## Install the agent using setup
You must now install the downloaded file on the target computer.

1. Copy the file to the target computer and Run Setup.
2. On the **Welcome** page, select **Next**.
3. On the **License Terms** page, read the license and then select **I Agree**.
4. On the **Destination Folder** page, change or keep the default installation folder and then select **Next**.
5. On the **Agent Setup Options** page, choose to connect the agent to Azure Log Analytics (OMS) and then select **Next**.
6. On the **Azure Log Analytics** page, paste the **Workspace ID** and **Workspace Key (Primary Key)** that you copied into Notepad in the previous procedure.
7. If the computer should report to a Log Analytics workspace in Azure Government cloud, select **Azure US Government** form the **Azure Cloud** dropdown list.  If the computer needs to communicate through a proxy server to the Log Analytics service, select **Advanced** and provide the URL and port number of the proxy server.
8. Select **Next** once you have completed providing the necessary configuration settings

  ![Install the agent][5]

9. On the **Ready to Install** page, review your choices and then select **Install**.
10. On the **Configuration completed successfully** page, select **Finish**

When complete, the **Microsoft Monitoring Agent** appears in **Control Panel**. You can review your configuration there and verify that the agent is connected.

For further information on installing and configuring the agent, see [Connect Windows computers](../log-analytics/log-analytics-agent-windows.md#install-the-agent-using-setup).

## Clean up resources
When no longer needed, you can remove the agent from the Windows computer.

To remove the agent, perform the following steps.

1. Open **Control Panel**.
2. Open **Programs and Features**.
3. In **Programs and Features**, select **Microsoft Monitoring Agent** and click **Uninstall**.

## Next steps
In this quickstart, you provisioned the Microsoft Monitoring agent on a Windows computer. To learn more about how to use Security Center, continue to the tutorial for configuring a security policy and assessing the security of your resources.

> [!div class="nextstepaction"]
> [Tutorial: Define and assess security policies](tutorial-security-policy.md)

<!--Image references-->
[1]: ./media/quick-onboard-windows-computer/portal.png
[2]: ./media/quick-onboard-windows-computer/overview.png
[3]: ./media/quick-onboard-windows-computer/onboard-windows-computer.png
[4]: ./media/quick-onboard-windows-computer/add-computer.png
[5]: ./media/quick-onboard-windows-computer/log-analytics-mma-setup-laworkspace.png
