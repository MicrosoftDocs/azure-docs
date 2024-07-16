---
title: Data and privacy
description: Data and privacy for Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Data and privacy for Arc-enabled servers

This article explains the data collection process by the Azure Connected Machine agent for Azure Arc-enabled servers, detailing how system metadata is gathered and sent to Azure. This article also describes the logging mechanisms available for Azure Arc-enabled servers, including the Azure Activity log for tracking server actions.

## Information collected by Azure Arc

As part of its normal operation, the Azure Connected Machine agent collects system metadata and sends it to Azure as part of its regular heartbeat. This metadata is populated in the Azure Arc-enabled server resource so you can identify and query your servers as part of your Azure inventory. Azure Arc collects no end user-identifiable data.

See [instance metadata](/azure/azure-arc/servers/agent-overview#instance-metadata) for a complete list of metadata collected by Azure Arc. This list is regularly updated to reflect the data collected by the most recent release of the Azure Connected Machine agent. It's not possible to opt out of this data collection because it's used across Azure experiences to help filter and identify your servers.

To collect cloud metadata, the Azure Connected Machine agent queries the instance metadata endpoints for AWS, GCP, Oracle Cloud, Azure Stack HCI and Azure. The agent checks if it’s in a cloud once, each time the "himds" service is started. Your security software may notice the agent reaching out to the following endpoints as part of that process: 169.254.169.254, 169.254.169.253, and metadata.google.internal.

All data is handled according to [Microsoft’s privacy standards](https://www.microsoft.com/en-us/trust-center/privacy).

## Data replication and disaster recovery

Azure Arc-enabled servers is a software-as-a-service offering and handles data replication and disaster recovery preparation on your behalf. When you select the region to store your data, that data is automatically replicated to another region in that same geography to protect against a regional outage. In the event a region becomes unavailable, DNS records are automatically changed to point to the failover region. No action is required from you and your agents will automatically reconnect when the failover is complete.

In some geographies, only one region supports Azure Arc-enabled servers. In these situations, data is still replicated for backup purposes to another region in that geography but won't be able to fail over to another region during an outage. You continue to see metadata in Azure from the last time your servers sent a heartbeat but  can't make changes or connect new servers until region functionality is restored. The Azure Arc team regularly considers region expansion opportunities to minimize the number of geographies in this configuration.

## Compliance with regulatory standards

Azure Arc is regularly audited for compliance with many global, regional, and industry-specific regulatory standards. A summary table of the compliance offerings is available at [https://aka.ms/AzureCompliance](https://aka.ms/AzureCompliance). 

For more information on a particular standard and to download audit documents, see [Azure and other Microsoft cloud services compliance offerings](/azure/compliance/offerings/).

## Azure Activity log

You can use the Azure Activity log to track actions taken on an Azure Arc-enabled server. Actions like installing extensions on an Arc server have unique operation identifiers (all starting with “Microsoft.HybridCompute”) that you can use to filter the log. Learn more about the [Azure Activity Log](/azure/azure-monitor/essentials/activity-log-insights) and how to retain activity logs for more than 30 days by [sending activity log data](/azure/azure-monitor/essentials/activity-log?tabs=powershell) to Log Analytics. 

## Local logs

The Azure Connected Machine agent keeps a set of local logs on each server that may be useful for troubleshooting or auditing when the Arc agent made a change to the system. The fastest way to get a copy of all logs from a server is to run [azcmagent logs](/azure/azure-arc/servers/azcmagent-logs), which generates a compressed folder of all the latest logs for you.

## HIMDS log

The HIMDS log file contains all log data from the HIMDS service. This data includes heartbeat information, connection and disconnection attempts, and a history of REST API requests for IMDS metadata and managed identity tokens from other apps on the system.

|OS  |Log location  |
|---------|---------|
|Windows |%PROGRAMDATA%\AzureConnectedMachineAgent\Log\himds.log |
|Linux |/var/opt/azcmagent/log/himds.log |

## azcmagent CLI log

The azcmagent log file contains a history of commands run using the local “azcmagent” command line interface. This log provides the parameters used when connecting, disconnecting, or modifying the configuration of the agent.

|OS  |Log location  |
|---------|---------|
|Windows |%PROGRAMDATA%\AzureConnectedMachineAgent\Log\azcmagent.log |
|Linux |/var/opt/azcmagent/log/azcmagent.log |

## Extension Manager log

The extension manager log contains information about attempts to install, upgrade, reconfigure, and uninstall extensions on the machine.

|OS  |Log location  |
|---------|---------|
|Windows |%PROGRAMDATA%\GuestConfig\ext_mgr_logs\gc_ext.log |
|Linux |/var/lib/GuestConfig/ext_mgr_logs/gc_ext.log |

Other logs may be generated by individual extensions. Logs for individual extensions aren't guaranteed to follow any standard log format.

|OS  |Log location  |
|---------|---------|
|Windows |%PROGRAMDATA%\GuestConfig\extension_logs\* |
|Linux |/var/lib/GuestConfig/extension_logs/* |

## Machine Configuration log

The machine configuration policy engine generates logs for the audit and enforcement of settings on the system.

|OS  |Log location  |
|---------|---------|
|Windows |%PROGRAMDATA%\GuestConfig\arc_policy_logs\gc_agent.log |
|Linux |/var/lib/GuestConfig/arc_policy_logs/gc_agent.log |

