---
title: Onboard Azure Stack virtual machines to Azure Security Center
description: This quickstart shows you how to provision the Azure Monitor, Update and Configuration Management virtual machine extension on a Azure Stack virtual machines.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin

ms.assetid: 8982348a-0624-40c7-8a1e-642a523c7f6b
ms.service: security-center
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/02/2019
ms.author: memildin

---
# Quickstart: Onboard your Azure Stack virtual machines to Security Center
After you onboard your Azure subscription, you can enable Security Center to protect your virtual machines running on Azure Stack by adding the **Azure Monitor, Update and Configuration Management** virtual machine extension from the Azure Stack marketplace.

This quickstart shows you how to add the **Azure Monitor, Update and Configuration Management** virtual machine extension on a virtual machine (Linux and Windows are both supported) running on Azure Stack.

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

You must have an Azure subscription on Security Center’s Standard tier before starting this quickstart. See [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) for upgrade instructions. You can try Security Center Standard tier at no cost for 30 days. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Select your workspace in Azure Security Center

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**. **Security Center - Overview** opens. 

   ![Security Center overview][2]

3. Under the Security Center main menu, select **Getting started**.
4. Select the **Get started** tab.

   ![Get started][3]

5. Click **Configure** under **Add new non-Azure computers**. A list of your Log Analytics workspaces is shown. The list includes, if applicable, the default workspace created for you by Security Center when automatic provisioning was enabled. Select this workspace or another workspace you want the Azure Stack VM to report security data to.

    ![Add non-Azure computer](./media/quick-onboard-windows-computer/non-azure.png)

   The **Direct Agent** blade opens with a link for downloading the agent and keys for your workspace ID to use in configuring the agent.

   >[!NOTE]
   > You do NOT need to download the agent manually. The agent will be installed as a VM extension in the steps below.

6. On the right of **Workspace ID**, select the copy icon and paste the ID into Notepad.

7. On the right of **Primary Key**, select the copy icon and paste the key into Notepad.

## Add the virtual machine extension to your existing Azure Stack virtual machines
You must now add the **Azure Monitor, Update and Configuration Management** virtual machine extension to the virtual machines running on your Azure Stack.

1. In a new browser tab, log into your **Azure Stack** portal.
2. Go to the **Virtual machines** page, select the virtual machine that you want to protect with Security Center. For information on how to create a virtual machine on Azure Stack, see [this quickstart for Windows virtual machines](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-quick-windows-portal) or [this quickstart for Linux virtual machines](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-quick-linux-portal).
3. Select **Extensions**. The list of virtual machine extensions installed on this virtual machine is shown.
4. Click the **Add** tab. The **New Resource** menu blade opens and shows the list of available virtual machine extensions. 
5. Select the **Azure Monitor, Update and Configuration Management** extension and click **Create**. The **Install extension** configuration blade opens up.

>[!NOTE]
> If you do not see the **Azure Monitor, Update and Configuration Management** extension listed in your marketplace, please reach out to your Azure Stack operator to make it available.

6. On the **Install extension** configuration blade, paste the **Workspace ID** and **Workspace Key (Primary Key)** that you copied into Notepad in the previous procedure.
7. When you are done providing the necessary configuration settings, click **OK**.
8. Once the extension installation completes, its status will show as **Provisioning Succeeded**. It might take up to one hour for the virtual machine to appear in the Security Center portal.

For further information on installing and configuring the agent for Windows, see [Connect Windows computers](../azure-monitor/platform/agent-windows.md#install-the-agent-using-setup-wizard).

For Linux troubleshooting of agent issues, see [Troubleshoot Azure Log Analytics Linux Agent](../azure-monitor/platform/agent-linux-troubleshoot.md).

Now you can monitor your Azure VMs and non-Azure computers in one place. In the Security Center portal on Azure, under **Compute**, you have an overview of all VMs and computers along with their recommendations. Security Center also surfaces any detection for these computers in Security alerts.

  ![Compute blade][6]

There are two types of icons represented on the **Compute** blade:

![icon1](./media/quick-onboard-windows-computer/security-center-monitoring-icon1.png) Non-Azure computer 

![icon2](./media/quick-onboard-windows-computer/security-center-monitoring-icon2.png) Azure VM (Azure Stack VMs will show in this group)

## Clean up resources
When no longer needed, you can remove the extension from the virtual machine via the Azure Stack portal.

To remove the extension:

1. Open the **Azure Stack Portal**.
2. Go to **Virtual machines** page, select the virtual machine from which you want to remove the extension.
3. Select **Extensions**, select the extension **Microsoft.EnterpriseCloud.Monitoring**.
4. Click on **Uninstall**, and confirm you selection by clicking **Yes**.

## Next steps
In this quickstart, you provisioned the Azure Monitor, Update and Configuration Management extension on a virtual machine running on Azure Stack. To learn more about how to use Security Center, continue to the tutorial for configuring a security policy and assessing the security of your resources.

> [!div class="nextstepaction"]
> [Tutorial: Define and assess security policies](tutorial-security-policy.md)

<!--Image references-->
[2]: ./media/quick-onboard-windows-computer/overview.png
[3]: ./media/quick-onboard-windows-computer/get-started.png
[4]: ./media/quick-onboard-windows-computer/add-computer.png
[5]: ./media/quick-onboard-windows-computer/log-analytics-mma-setup-laworkspace.png
[6]: ./media/quick-onboard-windows-computer/compute.png
