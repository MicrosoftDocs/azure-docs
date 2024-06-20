---
title: Collect Syslog events with Azure Monitor Agent 
description: Configure collection of Syslog events by using a data collection rule on virtual machines with Azure Monitor Agent.
ms.topic: conceptual
ms.custom: linux-related-content
ms.date: 05/10/2023
ms.reviewer: glinuxagent
---

# Collect Syslog events with Azure Monitor Agent

Syslog is an event logging protocol that's common to Linux. You can use the Syslog daemon that's built into Linux devices and appliances to collect local events of the types you specify. Applications send messages that are either stored on the local machine or delivered to a Syslog collector.

Syslog events is one of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides additional details for the Syslog events data source type.

> [!TIP]
> To collect data from devices that don't allow local installation of Azure Monitor Agent, [configure a dedicated Linux-based log forwarder](../../sentinel/forward-syslog-monitor-agent.md).

## Prerequisites

- [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) where you have at least [contributor rights](../logs/manage-access.md#azure-rbac). Syslog events are sent to the [Syslog](/azure/azure-monitor/reference/tables/event) table.

## Configure collection of Syslog data

Create a data collection rule, as described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). In the **Collect and deliver** step, select **Linux Syslog** from the **Data source type** dropdown. 

When you create a DCR for Linux Syslog, the Azure Monitor Agent configures the local Syslog daemon to forward messages to the agent. You can filter the Syslog event facilities and severities that are collected either in the DCR or the configuration files for your Linux agents.

:::image type="content" source="../../sentinel/media/forward-syslog-monitor-agent/create-rule-data-source.png" lightbox="../../sentinel/media/forward-syslog-monitor-agent/create-rule-data-source.png" alt-text="Screenshot that shows the page to select the data source type and minimum log level.":::

By default, the agent will collect all events that are sent by the Syslog configuration. Change the **Minimum log level** for each facility to limit data collection. Select **NONE** to collect no events for a particular facility.

## Configure Syslog on the Linux agent
When Azure Monitor Agent is installed on a Linux machine, it installs a default Syslog configuration file that defines the facility and severity of the messages that are collected if Syslog is enabled in a DCR. The configuration file is different depending on the Syslog daemon that the client has installed.

### Rsyslog
On many Linux distributions, the rsyslogd daemon is responsible for consuming, storing, and routing log messages sent by using the Linux Syslog API. Azure Monitor Agent uses the TCP forward output module (`omfwd`) in rsyslog to forward log messages.

The Azure Monitor Agent installation includes default config files located in `/etc/opt/microsoft/azuremonitoragent/syslog/rsyslogconf/`. When Syslog is added to a DCR, this configuration is installed under the `etc/rsyslog.d` system directory and rsyslog is automatically restarted for the changes to take effect. 

Following is the default configuration which collects Syslog messages sent from the local agent for all facilities with all log levels.

```
$ cat /etc/rsyslog.d/10-azuremonitoragent-omfwd.conf
# Azure Monitor Agent configuration: forward logs to azuremonitoragent

template(name="AMA_RSYSLOG_TraditionalForwardFormat" type="string" string="<%PRI%>%TIMESTAMP% %HOSTNAME% %syslogtag%%msg:::sp-if-no-1st-sp%%msg%")
# queue.workerThreads sets the maximum worker threads, it will scale back to 0 if there is no activity
# Forwarding all events through TCP port
*.* action(type="omfwd"
template="AMA_RSYSLOG_TraditionalForwardFormat"
queue.type="LinkedList"
queue.filename="omfwd-azuremonitoragent"
queue.maxFileSize="32m"
action.resumeRetryCount="-1"
action.resumeInterval="5"
action.reportSuspension="on"
action.reportSuspensionContinuation="on"
queue.size="25000"
queue.workerThreads="100"
queue.dequeueBatchSize="2048"
queue.saveonshutdown="on"
target="127.0.0.1" Port="28330" Protocol="tcp")
```

The following configuration is used when you use SELinux and decide to use Unix sockets.

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

On some legacy systems, such as CentOS 7.3, you may see rsyslog log formatting issues when a traditional forwarding format is used to send Syslog events to Azure Monitor Agent. For these systems, Azure Monitor Agent automatically places a legacy forwarder template instead:

`template(name="AMA_RSYSLOG_TraditionalForwardFormat" type="string" string="%TIMESTAMP% %HOSTNAME% %syslogtag%%msg:::sp-if-no-1st-sp%%msg%\n")`

### Syslog-ng

The Azure Monitor Agent installation includes default config files located in `/etc/opt/microsoft/azuremonitoragent/syslog/syslog-ngconf/azuremonitoragent-tcp.conf`. When Syslog is added to a DCR, this configuration is installed under the `/etc/syslog-ng/conf.d/azuremonitoragent-tcp.conf` system directory and syslog-ng is automatically restarted for the changes to take effect.

The default contents are shown in the following example. This example collects Syslog messages sent from the local agent for all facilities and all severities.
```
$ cat /etc/syslog-ng/conf.d/azuremonitoragent-tcp.conf 
# Azure MDSD configuration: syslog forwarding config for mdsd agent
options {};

# during install time, we detect if s_src exist, if it does then we
# replace it by appropriate source name like in redhat 's_sys'
# Forwrding using tcp
destination d_azure_mdsd {
	network("127.0.0.1" 
	port(28330)
	log-fifo-size(25000));			
};

log {
	source(s_src); # will be automatically parsed from /etc/syslog-ng/syslog-ng.conf
	destination(d_azure_mdsd);
	flags(flow-control);
};
```
The following configuration is used when you use SELinux and decide to use Unix sockets.
```
$ cat /etc/syslog-ng/conf.d/azuremonitoragent.conf 
# Azure MDSD configuration: syslog forwarding config for mdsd agent options {}; 
# during install time, we detect if s_src exist, if it does then we 
# replace it by appropriate source name like in redhat 's_sys' 
# Forwrding using unix domain socket 
destination d_azure_mdsd { 
	unix-dgram("/run/azuremonitoragent/default_syslog.socket" 
	flags(no_multi_line) ); 
};
 
log {
	source(s_src); # will be automatically parsed from /etc/syslog-ng/syslog-ng.conf 
	destination(d_azure_mdsd);
}; 
```

>[!Note]
> Azure Monitor supports collection of messages sent by rsyslog or syslog-ng, where rsyslog is the default daemon. The default Syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) isn't supported for Syslog event collection. To collect Syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

If you edit the Syslog configuration, you must restart the Syslog daemon for the changes to take effect.

## Destinations

**Azure Monitor Logs** is the only destination allowed for Syslog events, which allows you to send data to a Log Analytics workspace. Data is sent to the [Syslog table](/azure/azure-monitor/reference/tables/syslog) table. You can only modify the destination table mby manually editing the DCR.

:::image type="content" source="media/data-collection-windows-event/destination-workspace.png" lightbox="media/data-collection-windows-event/destination-workspace.png" alt-text="Screenshot that shows configuration of an Azure Monitor Logs destination in a data collection rule." border="false":::



## Supported facilities

The following facilities are supported with the Syslog collector:
* alert
* audit
* auth
* authpriv
* clock (formerly mark)
* cron
* daemon
* ftp
* kern
* local0-local7
* lpr
* mail
* news
* nopri
* ntp
* syslog
* user
* uucp

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
