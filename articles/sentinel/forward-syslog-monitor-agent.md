---
title: Forward syslog data to Microsoft Sentinel and Azure Monitor by using the Azure Monitor agent
description: In this tutorial, you will forward syslog data to Microsoft Sentinel by using the Azure Monitor agent. 
author: cwatson-cat
ms.author: cwatson
ms.service: microsoft-sentinel
ms.topic: tutorial 
ms.date: 07/12/2022
ms.custom: template-tutorial
#Customer intent: As a security-engineer, I want to get syslog data into Microsoft Sentinel so that I can use the data with other data to do attack detection, threat visibility, proactive hunting, and threat response.
---

# Tutorial: Forward syslog data to a Log Analytics workspace by using the Azure Monitor agent

In this tutorial, you'll configure a Linux virtual machine (VM) to forward syslog data to Microsoft Sentinel by using the  Azure Monitor agent. Use these steps to collect data from devices where you can't install an agent like a firewall network device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a data collection rule
> * Verify the Azure Monitor agent is running
> * Enable log reception on port 514
> * Verify event logs are forwarded to Microsoft Sentinel

## Prerequisites

To complete the steps in this tutorial, you must have the following resources and roles.

- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure account with the following roles to deploy the agent and create the data collection rules:

  |Build-in Role  |Scope  |Reason  |
  |---------|---------|---------|
  |- [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles)</br>- [Azure Connected Machine Resource Administrator](/azure/role-based-access-control/built-in-roles)     |  - Virtual machines</br>- Scale sets</br>- Arc-enabled servers        |   To deploy the agent      |
  |Any role that includes the action Microsoft.Resources/deployments/*    | - Subscription and/or</br>- Resource group and/or</br>- An existing data collection rule       |  To deploy ARM templates       |
  |[Monitoring Contributor ](/azure/role-based-access-control/built-in-roles)    |- Subscription and/or </br>- Resource group and/or</br>- An existing data collection rule        | To create or edit data collection rules        |
- Log Analytics workspace associated to Microsoft Sentinel
- Linux server that's running an operating system that supports Azure Monitor agent.

   - [Supported Linux operating systems for Azure Monitor agent](/azure/azure-monitor/agents/agents-overview#linux)  
   - [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal) or
   - Onboard an on-premises Linux server to Azure Arc. See [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm)

- Device that generates event log data like a firewall network device.

## Create a data collection rule

Create a *data collection rule* in the same region as your Microsoft Sentinel workspace.
A data collection rule is an Azure resource that allows you to define the way  data should be handled as it's ingested into Microsoft Sentinel.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and open **Monitor**.
1. Under **Settings**, select **Data Collection Rules**.
1. Select **Create**.

   :::image type="content" source="media/forward-syslog-monitor-agent/create-data-collection-rule.png" alt-text="Screenshot of the data collections rules pane with the create option selected.":::

### Enter basic information

1. On the **Basics** pane, enter the following information:

   |Field   |Value |
   |---------|---------|
   |Rule Name     | Enter a name like   dcr-syslog     |
   |Subscription     | Select the appropriate subscription        |
   |Resource group     |    Select the appropriate resource group     |
   |Region     |  Select the same region that your Microsoft Sentinel workspace is located      |
   |Platform Type     |    Linux     |
1. Select **Next: Resources**.

### Add resources
1. Select **Add resources**.
1. Use the filters to find the virtual machine that you'll use to collect logs.
   :::image type="content" source="media/forward-syslog-monitor-agent/create-rule-scope.png" alt-text="Screenshot of the page to select the scope for the data collection rule. ":::
1. Select the virtual machine.
1. Select **Apply**.
1. Select **Next: Collect and deliver**.

### Add data source

1. Select **Add data source**.
1. For **Data source type**, select **Linux syslog**.
   :::image type="content" source="media/forward-syslog-monitor-agent/create-rule-data-source.png" alt-text="Screenshot of page to select data source type and minimum log level":::
1. For **Minimum log level**, leave the default values **LOG_DEBUG**.
1. Select **Next: Destination**.

### Add destination

1. Select **Add destination**.

   :::image type="content" source="media/forward-syslog-monitor-agent/create-rule-add-destination.png" alt-text="Screenshot of the destination tab with the add destination option selected.":::
1. Enter the following values:

   |Field   |Value |
   |---------|---------|
   |Destination type     | Azure Monitor Logs    |
   |Subscription     | Select the appropriate subscription        |
   |Account or namespace    |Select the appropriate Log Analytics workspace|

1. Select **Add data source**.
1. Select **Next: Review + create**.

### Create rule

1. Select **Create**.
1. Wait 20 minutes before moving on to the next section.

If your VM doesn't have the Azure Monitor agent installed, the data collection rule deployment triggers the installation of the agent on the VM.

## Verify Azure Monitor agent is running

In Microsoft Sentinel, verify that the Azure Monitor agent is running on your VM.

1. In the Azure portal, search for and open **Microsoft Sentinel** and select the appropriate workspace.
1. Under **General**, select **Logs**.
1. Close the **Queries** page so that the **New Query** tab is displayed.
1. Run the following query where you replace the computer value with the name of your Linux virtual machine.

   ```kusto
   Heartbeat
   | where Computer == "vm-ubuntu"
   | take 10
   ```

## Enable log reception on port 514

Verify that the device you're collecting data from, like a network firewall, allows reception on port 514 TCP and/or UDP (On the VM). Then configure your build-in Linux syslog daemon (rsyslog.d/syslog-ng) to listen for syslog messages from your security solutions.

### Allow inbound syslog traffic on the VM

If you're forwarding syslogs to an Azure VM, use the following steps to allow reception on port 514.

1. In the Azure portal, search for and select Azure Virtual Machines.
1. Select the VM.
1. Under **Settings**, select **Networking**.
1. Select **Add inbound port rule**.
1. Enter the following values.

   |Field |Value  |
   |---------|---------|
   |Destination port ranges     | 514        |
   |Protocol    |  TCP or UDP       |
   |Action   |  Allow      |
   |Name    |    AllowSyslogInbound      |

   Use the default values for the rest of the fields.

1. Select **Add**.

### Configure Linux syslog daemon

On your Linux VM, run the following command to configure the Linux syslog daemon:

```bash
sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py 
```

## Verify event logs are forwarded to your Log Analytics workspace

In Microsoft Sentinel, verify that the Azure Monitor agent is forwarding event log data to your workspace in Microsoft Sentinel.

1. In the Azure portal, search for and open **Microsoft Sentinel** and select the appropriate workspace.
1. Under **General**, select **Logs**.
1. Close the **Queries** page so that the **New Query** tab is displayed.
1. Run the following query where you replace the computer value with the name of your Linux virtual machine.

   ```kusto
   Syslog
   | where computer == "vm-ubuntu"
   | where devicename == ....
   | take 10

ADD summerize by devicename
   ```

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

Evaluate whether you still need the resources you created like the virtual machine. Resources you leave running can cost you money. You can delete the resources individually or delete the resource group to delete all the resources you've created.

## Next steps

> [!div class="nextstepaction"]
> [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)