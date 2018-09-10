---
title: Azure Security Center Quickstart - Onboard your Linux computers to Security Center | Microsoft Docs
description: This quickstart shows you how to onboard your Linux computers to Security Center.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security-center
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/02/2018
ms.author: rkarlin

---
# Quickstart: Onboard Linux computers to Azure Security Center
After you onboard your Azure subscriptions, you can enable Security Center for Linux resources running outside of Azure, for example on-premises or in other clouds, by provisioning the Linux Agent.

This quickstart shows you how to install the Linux Agent on a Linux computer.

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

You must be on Security Center’s Standard pricing tier before starting this quickstart. See [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) for upgrade instructions. You can try Security Center’s Standard at no cost for the first 60 days.

## Add new Linux computer

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**. **Security Center - Overview** opens.

 ![Security Center overview][2]

3. Under the Security Center main menu, select **Getting started**.
4. Select the **Get started** tab.
   ![Get started][3]

5. Click **Configure** under **Add new non-Azure computers**, a list of your Log Analytics workspaces is shown. The list includes, if applicable, the default workspace created for you by Security Center when automatic provisioning was enabled. Select this workspace or another workspace you want to use.

    ![Add non-Azure computer](./media/quick-onboard-linux-computer/non-azure.png)

6.	On the **Direct Agent** page, under **DOWNLOAD AND ONBOARD AGENT FOR LINUX**, select the **copy** button to copy the *wget* command.

7.	Open Notepad, and paste this command. Save this file to a location that can be accessible from your Linux computer.

## Install the agent

1.	On your Linux computer, open the file that was previously saved. Select the entire content, copy, open a terminal console, and paste the command.
2.	Once the installation is finished, you can validate that the *omsagent* is installed by running the *pgrep* command. The command will return the *omsagent* PID (Process ID) as shown below:

  ![Install the agent][5]

The logs for the Security Center Agent for Linux can be found at: */var/opt/microsoft/omsagent/<workspace id>/log/*

  ![Logs for agent][6]

After some time, it may take up to 30 minutes, the new Linux computer will appear in Security Center.

Now you can monitor your Azure VMs and non-Azure computers in one place. Under **Compute**, you have an overview of all VMs and computers along with recommendations. Each column represents one set of recommendations. The color represents the VM's or computer's current security state for that recommendation. Security Center also surfaces any detections for these computers in Security alerts.

  ![Compute blade][7]
There are two types of icons represented on the **Compute** blade:

  ![icon1](./media/quick-onboard-linux-computer/security-center-monitoring-icon1.png) Non-Azure computer

  ![icon2](./media/quick-onboard-linux-computer/security-center-monitoring-icon2.png) Azure VM

## Clean up resources
When no longer needed, you can remove the agent from the Linux computer.

To remove the agent:

1. Download the Linux agent [universal script](https://github.com/Microsoft/OMS-Agent-for-Linux/releases) to the computer.
2. Run the bundle .sh file with the *--purge* argument on the computer, which completely removes the agent and its configuration.

    `sudo sh ./omsagent-<version>.universal.x64.sh --purge`

## Next steps
In this quick start, you provisioned the agent on a Linux computer. To learn more about how to use Security Center, continue to the tutorial for configuring a security policy and assessing the security of your resources.

> [!div class="nextstepaction"]
> [Tutorial: Define and assess security policies](tutorial-security-policy.md)

<!--Image references-->
[1]: ./media/quick-onboard-linux-computer/portal.png
[2]: ./media/quick-onboard-linux-computer/overview.png
[3]: ./media/quick-onboard-linux-computer/get-started.png
[4]: ./media/quick-onboard-linux-computer/add-computer.png
[5]: ./media/quick-onboard-linux-computer/pgrep-command.png
[6]: ./media/quick-onboard-linux-computer/logs-for-agent.png
[7]: ./media/quick-onboard-linux-computer/compute.png
