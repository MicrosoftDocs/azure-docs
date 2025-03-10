---
title: 'Tutorial: Forward Syslog data to Microsoft Sentinel and Azure Monitor by using Azure Monitor Agent'
description: In this tutorial, you learn how to monitor Linux-based devices by forwarding Syslog data to a Log Analytics workspace.
author: cwatson-cat
ms.author: cwatson
ms.service: microsoft-sentinel
ms.topic: tutorial
ms.date: 05/16/2024
ms.custom: template-tutorial, linux-related-content


#Customer intent: As a security engineer or system administrator, I want to forward Syslog data from Linux-based devices to a Log Analytics workspace so that I can detect attacks, view, hunt, and respond to threats, or monitor my Linux-based devices.

---

# Tutorial: Forward Syslog data to a Log Analytics workspace with Microsoft Sentinel by using Azure Monitor Agent

In this tutorial, you configure a Linux virtual machine (VM) to forward Syslog data to your workspace by using Azure Monitor Agent. These steps allow you to collect and monitor data from Linux-based devices where you can't install an agent like a firewall network device.

> [!NOTE]
> Container Insights now supports the automatic collection of Syslog events from Linux nodes in your AKS clusters. To learn more, see [Syslog collection with Container Insights](/azure/azure-monitor/containers/container-insights-syslog).

Configure your Linux-based device to send data to a Linux VM. Azure Monitor Agent on the VM forwards the Syslog data to the Log Analytics workspace. Then use Microsoft Sentinel or Azure Monitor to monitor the device from the data stored in the Log Analytics workspace.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a data collection rule.
> * Verify that Azure Monitor Agent is running.
> * Enable log reception on port 514.
> * Verify that Syslog data is forwarded to your Log Analytics workspace.

## Prerequisites

To complete the steps in this tutorial, you must have the following resources and roles:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure account with the following roles to deploy the agent and create the data collection rules.

  |Built-in role  |Scope  |Reason  |
  |---------|---------|---------|
  |- [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md)</br>- [Azure Connected Machine Resource Administrator](../role-based-access-control/built-in-roles.md)     |  - Virtual machines</br>- Scale sets</br>- Azure Arc-enabled servers        |   To deploy the agent      |
  |Any role that includes the action Microsoft.Resources/deployments/*    | - Subscription </br>- Resource group</br>- Existing data collection rule       |  To deploy Azure Resource Manager templates       |
  |[Monitoring Contributor ](../role-based-access-control/built-in-roles.md)    |- Subscription </br>- Resource group </br>- Existing data collection rule        | To create or edit data collection rules        |
- A Log Analytics workspace.
- A Linux server that's running an operating system that supports Azure Monitor Agent.
   - [Supported Linux operating systems for Azure Monitor Agent](/azure/azure-monitor/agents/agents-overview#linux).
   - [Create a Linux VM in the Azure portal](/azure/virtual-machines/linux/quick-create-portal) or [add an on-premises Linux server to Azure Arc](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm).
- A Linux-based device that generates event log data like a firewall network device.

## Configure Azure Monitor Agent to collect Syslog data

See the step-by-step instructions in [Collect Syslog events with Azure Monitor Agent](/azure/azure-monitor/agents/data-collection-syslog).

## Verify that Azure Monitor Agent is running

In Microsoft Sentinel or Azure Monitor, verify that Azure Monitor Agent is running on your VM.

1. In the Azure portal, search for and open **Microsoft Sentinel** or **Azure Monitor**.
1. If you're using Microsoft Sentinel, select the appropriate workspace.
1. Under **General**, select **Logs**.
1. Close the **Queries** page so that the **New Query** tab appears.
1. Run the following query where you replace the computer value with the name of your Linux VM.

   ```kusto
   Heartbeat
   | where Computer == "vm-linux"
   | take 10
   ```

## Enable log reception on port 514

Verify that the VM that's collecting the log data allows reception on port 514 TCP or UDP depending on the Syslog source. Then configure the built-in Linux Syslog daemon on the VM to listen for Syslog messages from your devices. After you finish those steps, configure your Linux-based device to send logs to your VM.

> [!NOTE]
> If the firewall is running, a rule will need to be created to allow remote systems to reach the daemon’s syslog listener: `systemctl status firewalld.service`
> 1. Add for tcp 514 (your zone/port/protocol may differ depending on your scenario)
>      `firewall-cmd --zone=public --add-port=514/tcp --permanent`
> 2. Add for udp 514 (your zone/port/protocol may differ depending on your scenario)
>      `firewall-cmd --zone=public --add-port=514/udp --permanent`
> 3. Restart the firewall service to ensure new rules take effect
>      `systemctl restart firewalld.service`

The following two sections cover how to add an inbound port rule for an Azure VM and configure the built-in Linux Syslog daemon.

### Allow inbound Syslog traffic on the VM

If you're forwarding Syslog data to an Azure VM, follow these steps to allow reception on port 514.

1. In the Azure portal, search for and select **Virtual Machines**.
1. Select the VM.
1. Under **Settings**, select **Networking**.
1. Select **Add inbound port rule**.
1. Enter the following values.

   |Field |Value  |
   |---------|---------|
   |Destination port ranges     | 514        |
   |Protocol    |  TCP or UDP depending on Syslog source      |
   |Action   |  Allow      |
   |Name    |    AllowSyslogInbound      |

   Use the default values for the rest of the fields.

1. Select **Add**.

### Configure the Linux Syslog daemon

Connect to your Linux VM and configure the Linux Syslog daemon. For example, run the following command, adapting the command as needed for your network environment:

```bash
sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python3 Forwarder_AMA_installer.py
```

This script can make changes for both rsyslog.d and syslog-ng.

> [!NOTE]
> To avoid [Full Disk scenarios](/azure/azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog) where the agent can't function, you must set the `syslog-ng` or `rsyslog` configuration to not store logs, which are not needed by the agent. A Full Disk scenario disrupts the function of the installed Azure Monitor Agent.
> Read more about [rsyslog](https://www.rsyslog.com/doc/master/configuration/actions.html) or [syslog-ng](https://www.syslog-ng.com/technical-documents).

## Verify Syslog data is forwarded to your Log Analytics workspace

After you configure your Linux-based device to send logs to your VM, verify that Azure Monitor Agent is forwarding Syslog data to your workspace.

1. In the Azure portal, search for and open **Microsoft Sentinel** or **Azure Monitor**.
1. If you're using Microsoft Sentinel, select the appropriate workspace.
1. Under **General**, select **Logs**.
1. Close the **Queries** page so that the **New Query** tab appears.
1. Run the following query where you replace the computer value with the name of your Linux VM.

   ```kusto
   Syslog
   | where Computer == "vm-linux"
   | summarize by HostName
   ```

## Clean up resources

Evaluate whether you need the resources like the VM that you created. Resources you leave running can cost you money. Delete the resources you don't need individually. You can also delete the resource group to delete all the resources you created.

## Related content

- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)
- [Collect Syslog events with Azure Monitor Agent](/azure/azure-monitor/agents/data-collection-syslog)
