---
title: Forward streaming event log data to Microsoft Sentinel by using the Azure Monitor agent
description: In this tutorial, you will forward syslog data to Microsoft Sentinel by using the Azure Monitor agent. 
author: cwatson-cat
ms.author: cwatson
ms.service: microsoft-sentinel
ms.topic: tutorial 
ms.date: 07/12/2022
ms.custom: template-tutorial
#Customer intent: As a security-engineer, I want to get event data into Microsoft Sentinel so that I can use the data with other data to do attack detection, threat visibility, proactive hunting, and threat response.
---

# Tutorial: Forward event log data to Microsoft Sentinel by using the Azure Monitor agent

In this tutorial, you'll configure a Linux virtual machine (VM) to forward streaming events to Microsoft Sentinel by using the  Azure Monitor agent. Use these steps to collect data from devices where you can't install an agent like a firewall network device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a data collection rule
> * Verify the Azure Monitor agent is running
> * Enable log reception on port 514

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this tutorial.
-->

## Prerequisites

To complete the steps in this tutorial, you must have the following resources and roles.

- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Log Analytics workspace associated to Microsoft Sentinel
- Linux server that's running an operating system that supports Azure Monitor agent.
   - [Create a Linux VM with the Azure CLI](/azure/virtual-machines/linux/tutorial-manage-vm) or
   - Onboard an on-premises Linux server to Azure Arc. See [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm)
   - [Overview of Azure Monitor agents - Supported operating systems](/azure/azure-monitor/agents/agents-overview#linux).
- Roles to deploy the agent and create the data collection rules.


  |Build-in Role  |Scope  |Reason  |
  |---------|---------|---------|
  |- [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles)</br>- [Azure Connected Machine Resource Administrator](/azure/role-based-access-control/built-in-roles)     |  - Virtual machines</br>- Scale sets</br>- Arc-enabled servers        |   To deploy the agent      |
  |Any role that includes the action Microsoft.Resources/deployments/*    | - Subscription and/or</br>- Resource group and/or</br>- An existing data collection rule       |  To deploy ARM templates       |
  |[Monitoring Contributor ](/azure/role-based-access-control/built-in-roles)    |- Subscription and/or </br>- Resource group and/or</br>- An existing data collection rule        | To create or edit data collection rules        |

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## Create a data collection rule

Create a date collection rule in the same region as your Microsoft Sentinel workspace.
A data collection rule (DCR) is an Azure resource that allows you to define the way  data should be handled as it's ingested into Microsoft Sentinel.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and open **Monitor**.
1. Under **Settings**, select **Data Collection Rules**.
1. Select **Create**.
1. Enter the following information:

   |Field   |Value |
   |---------|---------|
   |Rule Name     | Enter a name like   dcr-syslog     |
   |Subscription     | Select the appropriate subscription        |
   |Resource group     |    Select the appropriate resource group     |
   |Region     |  Select the same region that your Microsoft Sentinel workspace is located      |
   |Platform Type     |    Linux     |
1. Select **Next: Resources** > **Add resources**.
1. Filter items to find and select the virtual machine that you'll use to collect logs.  
1. Select **Apply**.
1. Select **Next: Collect and deliver** > **Add data source**.
1. For **Data source type**, select **Linux syslog**.
1. For **Minimum log level**, leave the default value **LOG_DEBUG**.
1. Select **Next: Destination** > **Add destination**.
1. Enter the following values:

   |Field   |Value |
   |---------|---------|
   |Destination type     | Azure Monitor Logs    |
   |Subscription     | Select the appropriate subscription        |
   |Account or namespace    |Select the appropriate Microsoft Sentinel workspace|

1. Select **Add data source**.
1. Select **Next: Review + create** > **Create**.



## Verify Azure Monitor agent is running
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Enable log reception on port 514
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

For more information, see:

- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)