---
title: Collect Syslog events with Azure Monitor Agent 
description: Configure collection of Syslog events by using a data collection rule on virtual machines with Azure Monitor Agent.
ms.topic: conceptual
ms.date: 05/10/2023
ms.reviewer: glinuxagent
---

# Collect Syslog events with Azure Monitor Agent

Syslog is an event logging protocol that's common to Linux. You can use the Syslog daemon that's built in to Linux devices and appliances to collect local events of the types you specify. Then you can have it send those events to a Log Analytics workspace. Applications send messages that might be stored on the local machine or delivered to a Syslog collector.

When the Azure Monitor agent for Linux is installed, it configures the local Syslog daemon to forward messages to the agent when Syslog collection is enabled in [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). Azure Monitor Agent then sends the messages to an Azure Monitor or Log Analytics workspace where a corresponding Syslog record is created in a [Syslog table](/azure/azure-monitor/reference/tables/syslog).

:::image type="content" source="media/data-sources-syslog/overview.png" lightbox="media/data-sources-syslog/overview.png" alt-text="Diagram that shows Syslog collection.":::

:::image type="content" source="media/azure-monitor-agent/linux-agent-syslog-communication.png" lightbox="media/azure-monitor-agent/linux-agent-syslog-communication.png" alt-text="Diagram that shows Syslog daemon and Azure Monitor Agent communication.":::

The following facilities are supported with the Syslog collector:
* auth
* authpriv
* cron
* daemon
* mark
* kern
* lpr
* mail
* news
* syslog
* user
* uucp
* local0-local7

For some device types that don't allow local installation of Azure Monitor Agent, the agent can be installed instead on a dedicated Linux-based log forwarder. The originating device must be configured to send Syslog events to the Syslog daemon on this forwarder instead of the local daemon. For more information, see the [Sentinel tutorial](../../sentinel/forward-syslog-monitor-agent.md).

## Configure Syslog

The Azure Monitor Agent for Linux only collects events with the facilities and severities that are specified in its configuration. You can configure Syslog through the Azure portal or by managing configuration files on your Linux agents.

### Configure Syslog in the Azure portal
Configure Syslog from the **Data Collection Rules** menu of Azure Monitor. This configuration is delivered to the configuration file on each Linux agent.

1. Select **Add data source**.
1. For **Data source type**, select **Linux syslog**.

You can collect Syslog events with a different log level for each facility. By default, all Syslog facility types are collected. If you don't want to collect, for example, events of `auth` type, select **NONE** in the **Minimum log level** list box for `auth` facility and save the changes. If you need to change the default log level for Syslog events and collect only events with a log level starting at **NOTICE** or a higher priority, select **LOG_NOTICE** in the **Minimum log level** list box.

By default, all configuration changes are automatically pushed to all agents that are configured in the DCR.

### Create a data collection rule

Create a *data collection rule* in the same region as your Log Analytics workspace. A DCR is an Azure resource that allows you to define the way data should be handled as it's ingested into the workspace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and open **Monitor**.
1. Under **Settings**, select **Data Collection Rules**.
1. Select **Create**.

   :::image type="content" source="../../sentinel/media/forward-syslog-monitor-agent/create-data-collection-rule.png" alt-text="Screenshot that shows the Data Collection Rules pane with the Create option selected.":::

#### Add resources

1. Select **Add resources**.
1. Use the filters to find the virtual machine you want to use to collect logs.

   :::image type="content" source="../../sentinel/media/forward-syslog-monitor-agent/create-rule-scope.png" alt-text="Screenshot that shows the page to select the scope for the data collection rule. ":::
1. Select the virtual machine.
1. Select **Apply**.
1. Select **Next: Collect and deliver**.

#### Add a data source

1. Select **Add data source**.
1. For **Data source type**, select **Linux syslog**.

   :::image type="content" source="../../sentinel/media/forward-syslog-monitor-agent/create-rule-data-source.png" alt-text="Screenshot that shows the page to select the data source type and minimum log level.":::
1. For **Minimum log level**, leave the default values **LOG_DEBUG**.
1. Select **Next: Destination**.

#### Add a destination

1. Select **Add destination**.

   :::image type="content" source="../../sentinel/media/forward-syslog-monitor-agent/create-rule-add-destination.png" alt-text="Screenshot that shows the Destination tab with the Add destination option selected.":::
1. Enter the following values:

   |Field   |Value |
   |---------|---------|
   |Destination type     | Azure Monitor Logs    |
   |Subscription     | Select the appropriate subscription        |
   |Account or namespace    |Select the appropriate Log Analytics workspace|

1. Select **Add data source**.
1. Select **Next: Review + create**.

### Create a rule

1. Select **Create**.
1. Wait 20 minutes before you move on to the next section.

If your VM doesn't have Azure Monitor Agent installed, the DCR deployment triggers the installation of the agent on the VM.

## Configure Syslog on the Linux agent
When Azure Monitor Agent is installed on a Linux machine, it installs a default Syslog configuration file that defines the facility and severity of the messages that are collected if Syslog is enabled in a DCR. The configuration file is different depending on the Syslog daemon that the client has installed.

### Rsyslog
On many Linux distributions, the rsyslogd daemon is responsible for consuming, storing, and routing log messages sent by using the Linux Syslog API. Azure Monitor Agent uses the UNIX domain socket output module (`omuxsock`) in rsyslog to forward log messages to Azure Monitor Agent.

The Azure Monitor Agent installation includes default config files that get placed under the following directory: `/etc/opt/microsoft/azuremonitoragent/syslog/rsyslogconf/`

When Syslog is added to a DCR, these configuration files are installed under the `etc/rsyslog.d` system directory and rsyslog is automatically restarted for the changes to take effect. These files are used by rsyslog to load the output module and forward the events to the Azure Monitor Agent daemon by using defined rules.

The built-in `omuxsock` module can't be loaded more than once. For this reason, the configurations for loading of the module and forwarding of the events with corresponding forwarding format template are split in two different files. Its default contents are shown in the following example. This example collects Syslog messages sent from the local agent for all facilities with all log levels.
```
$ cat /etc/rsyslog.d/10-azuremonitoragent.conf
# Azure Monitor Agent configuration: forward logs to azuremonitoragent
$OMUxSockSocket /run/azuremonitoragent/default_syslog.socket
template(name="AMA_RSYSLOG_TraditionalForwardFormat" type="string" string="<%PRI%>%TIMESTAMP% %HOSTNAME% %syslogtag%%msg:::sp-if-no-1st-sp%%msg%") 
$OMUxSockDefaultTemplate AMA_RSYSLOG_TraditionalForwardFormat
# Forwarding all events through Unix Domain Socket
*.* :omuxsock: 
```
 
```
$ cat /etc/rsyslog.d/05-azuremonitoragent-loadomuxsock.conf
# Azure Monitor Agent configuration: load rsyslog forwarding module. 
$ModLoad omuxsock
```

On some legacy systems, such as CentOS 7.3, we've seen rsyslog log formatting issues when a traditional forwarding format is used to send Syslog events to Azure Monitor Agent. For these systems, Azure Monitor Agent automatically places a legacy forwarder template instead:

`template(name="AMA_RSYSLOG_TraditionalForwardFormat" type="string" string="%TIMESTAMP% %HOSTNAME% %syslogtag%%msg:::sp-if-no-1st-sp%%msg%\n")`

### Syslog-ng

The configuration file for syslog-ng is installed at `/etc/opt/microsoft/azuremonitoragent/syslog/syslog-ngconf/azuremonitoragent.conf`. When Syslog collection is added to a DCR, this configuration file is placed under the `/etc/syslog-ng/conf.d/azuremonitoragent.conf` system directory and syslog-ng is automatically restarted for the changes to take effect.

The default contents are shown in the following example. This example collects Syslog messages sent from the local agent for all facilities and all severities.
```
$ cat /etc/syslog-ng/conf.d/azuremonitoragent.conf 
# Azure MDSD configuration: syslog forwarding config for mdsd agent options {}; 

# during install time, we detect if s_src exist, if it does then we 

# replace it by appropriate source name like in redhat 's_sys' 

# Forwrding using unix domain socket 

destination d_azure_mdsd { 

unix-dgram("/run/azuremonitoragent/default_syslog.socket" 

flags(no_multi_line) 

); 
}; 

log {	source(s_src); # will be automatically parsed from /etc/syslog-ng/syslog-ng.conf 
destination(d_azure_mdsd); }; 
```

>[!Note]
> Azure Monitor supports collection of messages sent by rsyslog or syslog-ng, where rsyslog is the default daemon. The default Syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) isn't supported for Syslog event collection. To collect Syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

If you edit the Syslog configuration, you must restart the Syslog daemon for the changes to take effect.

## Prerequisites
You need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A [data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint).
- [Permissions to create DCR objects](../essentials/data-collection-rule-overview.md#permissions) in the workspace.

## Syslog record properties

Syslog records have a type of **Syslog** and have the properties shown in the following table.

| Property | Description |
|:--- |:--- |
| Computer |Computer that the event was collected from. |
| Facility |Defines the part of the system that generated the message. |
| HostIP |IP address of the system sending the message. |
| HostName |Name of the system sending the message. |
| SeverityLevel |Severity level of the event. |
| SyslogMessage |Text of the message. |
| ProcessID |ID of the process that generated the message. |
| EventTime |Date and time that the event was generated. |

## Log queries with Syslog records

The following table provides different examples of log queries that retrieve Syslog records.

| Query | Description |
|:--- |:--- |
| Syslog |All Syslogs |
| Syslog &#124; where SeverityLevel == "error" |All Syslog records with severity of error |
| Syslog &#124; where Facility == "auth" |All Syslog records with auth facility type  |
| Syslog &#124; summarize AggregatedValue = count() by Facility |Count of Syslog records by facility |

## Next steps

Learn more about:

- [Azure Monitor Agent](azure-monitor-agent-overview.md)
- [Data collection rules](../essentials/data-collection-rule-overview.md)
- [Best practices for cost management in Azure Monitor](../best-practices-cost.md)
