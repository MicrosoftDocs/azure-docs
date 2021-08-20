---
title: Connect machines from Azure Automation Update Management
description: In this article, you learn how to connect hybrid machines to Azure Arc managed by Automation Update Management.
ms.date: 08/20/2021
ms.topic: conceptual
---

# Connect hybrid machines to Azure from Automation Update Management

You can enable Azure Arc-enabled servers for one or more of your Windows or Linux virtual machines or physical servers hosted on-premises or other cloud environment that are managed with Azure Automation Update Management. This onboarding process automates the download and installation of the [Connected Machine agent](agent-overview.md). To connect the machines to Azure Arc-enabled servers, an Azure Active Directory [service principal](../../active-directory/develop/app-objects-and-service-principals.md) is used instead of your privileged identity to [interactively connect](onboard-portal.md) the machine. This service principal is created automatically as part of the onboarding process for these machines.

Before you get started, be sure to review the [prerequisites](agent-overview.md#prerequisites) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Add machines from the Azure portal

Perform the following steps to configure the hybrid machine with Arc-enabled servers. The server or machine needs to be powered on and online in order for the process to complete successfully.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Servers - Azure Arc** page, and then select **Add** at the upper left.

1. On the **Select a method** page, select the **Add managed servers from Update Management (preview)** tile, and then select **Add servers**.

1. On the **Basics** page, configure the following:

    1. In the **Resource group** drop-down list, select the resource group the machine will be managed from.
    1. In the **Region** drop-down list, select the Azure region to store the servers metadata.
    1. If the machine is communicating through a proxy server to connect to the internet, specify the proxy server IP address or the name and port number that the machine will use to communicate with the proxy server. Enter the value in the format `http://<proxyURL>:<proxyport>`.
    1. Select **Next: Machines**.

1. On the **Machines** page, select the **Subscription** and **Automation account** from the drop-down list that has the Update Management feature enabled and includes the machines you want to onboard to Azure Arc-enabled servers.

   After specifying the Automation account, the list below returns non-Azure machines managed by Update Management for that Automation account. Both Windows and Linux machines are listed and for each one, select **add**.

   You can review your selection by selecting **Review selection** and if you want to remove a machine select **remove** from under the **Action** column. 

   Once you confirm your selection, select **Next: Tags**.

1. On the **Tags** page, specify one or more **Name**/**Value** pairs to support your standards. Select **Next: Review + add**.

1. On the **Review _ add** page, review the summary information, and then select *Add machines**. If you still need to make changes, select **Previous**.

## Verify the connection with Azure Arc

After the agent is installed and configured to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

![A successful server connection](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

- Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.

- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verify the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.