---
title: Azure Monitor agent extension versions
description: This article describes the version details for the Azure Monitor agent virtual machine extension.
ms.topic: conceptual
ms.date: 2/22/2023
ms.custom: references_region
ms.reviewer: shseth

---

# Azure Monitor agent extension versions
This article describes the version details for the Azure Monitor agent virtual machine extension. This extension deploys the agent on virtual machines, scale sets, and Arc-enabled servers (on premise servers with Azure Arc agent installed).

We strongly recommended to update to the latest version at all times, or opt in to the [Automatic Extension Update](../../virtual-machines/automatic-extension-upgrade.md) feature.

[//]: # "DO NOT change the format (column schema, etc.) of the below table without consulting glinuxagent alias. The [Azure Monitor Linux Agent Troubleshooting Tool](https://github.com/Azure/azure-linux-extensions/blob/master/AzureMonitorAgent/ama_tst/AMA-Troubleshooting-Tool.md) parses the below table at runtime to determine the latest version of AMA; altering the format could degrade some of the functions of the tool."

## Version details
| Release Date | Release notes | Windows | Linux |
|:---|:---|:---|:---|
| Jan 2023 | **Linux** <ul><li>RHEL 9 and Amazon Linux 2 support</li><li>Update to OpenSSL 1.1.1s and require TLS 1.2 or higher</li><li>Performance improvements</li><li>Improvements in Garbage Collection for persisted disk cache and handling corrupted cache files better</li><li>**Fixes** <ul><li>Set agent service memory limit for CentOS/RedHat 7 distros. Resolved MemoryMax parsing error</li><li>Fixed modifying rsyslog system-wide log format caused by installer on RedHat/Centos 7.3</li><li>Fixed permissions to config directory</li><li>Installation reliability improvements</li><li>Fixed permissions on default file so rpm verification doesn't fail</li><li>Added traceFlags setting to enable trace logs for agent</li></ul></li></ul> **Windows** <ul><li>Fixed issue related to incorrect *EventLevel* and *Task* values for Log Analytics *Event* table, to match Windows Event Viewer values</li><li>Added missing columns for IIS logs - *TimeGenerated, Time, Date, Computer, SourceSystem, AMA, W3SVC, SiteName*</li><li>Reliability improvements for metrics collection</li><li>Fixed machine restart issues on for Arc-enabled servers related to repeated calls to HIMDS service</li></ul> | 1.12.0.0 | 1.25.1 |
| Nov-Dec 2022 | <ul><li>Support for air-gapped clouds added for [Windows MSI installer for clients](./azure-monitor-agent-windows-client.md) </li><li>Reliability improvements for using AMA with Custom Metrics destination</li><li>Performance and internal logging improvements</li></ul> | 1.11.0.0 | None | 
| Oct 2022 | **Windows** <ul><li>Increased reliability of data uploads</li><li>Data quality improvements</li></ul> **Linux** <ul><li>Support for `http_proxy` and `https_proxy` environment variables for [network proxy configurations](./azure-monitor-agent-data-collection-endpoint.md#proxy-configuration) for the agent</li><li>[Text logs](./data-collection-text-log.md) <ul><li>Network proxy support enabled</li><li>Fixed missing `_ResourceId`</li><li>Increased maximum line size support to 1MB</li></ul></li><li>Support ingestion of syslog events whose timestamp is in the future</li><li>Performance improvements</li><li>Fixed `diskio` metrics instance name dimension to use the disk mount path(s) instead of the device name(s)</li><li>Fixed world writable file issue to lockdown write access to certain agent logs and configuration files stored locally on the machine</li></ul>  | 1.10.0.0 | 1.24.2 | 
| Sep 2022 | Reliability improvements | 1.9.0.0 | None | 
| August 2022 | **Common updates** <ul><li>Improved resiliency: Default lookback (retry) time updated to last 3 days (72 hours) up from 60 minutes, for agent to collect data post interruption. This is subject to default offline cache size of 10gigabytes</li><li>Fixes the preview custom text log feature that was incorrectly removing the *TimeGenerated* field from the raw data of each event. All events are now additionally stamped with agent (local) upload time</li><li>Reliability and supportability improvements</li></ul> **Windows** <ul><li>Fixed datetime format to UTC</li><li>Fix to use default location for firewall log collection, if not provided</li><li>Reliability and supportability improvements</li></ul> **Linux** <ul><li>Support for OpenSuse 15, Debian 11 ARM64</li><li>Support for coexistence of Azure Monitor agent with legacy Azure Diagnostic extension for Linux (LAD)</li><li>Increased max-size of UDP payload for Telegraf output to prevent dimension truncation</li><li>Prevent unconfigured upload to Azure Monitor Metrics destination</li><li>Fix for disk metrics wherein *instance name* dimension will use the disk mount path(s) instead of the device name(s), to provide parity with legacy agent</li><li>Fixed *disk free MB* metric to report megabytes instead of bytes</li></ul> | 1.8.0.0 | 1.22.2 |
| July 2022 | Fix for mismatch event timestamps for Sentinel Windows Event Forwarding | 1.7.0.0 | None |
| June 2022 | Bugfixes with user assigned identity support, and reliability improvements | 1.6.0.0 | None |
| May 2022 | <ul><li>Fixed issue where agent stops functioning due to faulty XPath query. With this version, only query related Windows events will fail, other data types will continue to be collected</li><li>Collection of Windows network troubleshooting logs added to 'CollectAMAlogs.ps1' tool</li><li>Linux support for Debian 11 distro</li><li>Fixed issue to list mount paths instead of device names for Linux disk metrics</li></ul> | 1.5.0.0 | 1.21.0 |
| April 2022 | <ul><li>Private IP information added in Log Analytics <i>Heartbeat</i> table for Windows and Linux</li><li>Fixed bugs in Windows IIS log collection (preview) <ul><li>Updated IIS site column name to match backend KQL transform</li><li>Added delay to IIS upload task to account for IIS buffering</li></ul></li><li>Fixed Linux CEF syslog forwarding for Sentinel</li><li>Removed 'error' message for Azure MSI token retrieval failure on Arc to show as 'Info' instead</li><li>Support added for Ubuntu 22.04, RHEL 8.5, 8.6, AlmaLinux and RockyLinux distros</li></ul> | 1.4.1.0<sup>Hotfix</sup> | 1.19.3 |
| March 2022 | <ul><li>Fixed timestamp and XML format bugs in Windows Event logs</li><li>Full Windows OS information in Log Analytics Heartbeat table</li><li>Fixed Linux performance counters to collect instance values instead of 'total' only</li></ul> | 1.3.0.0 | 1.17.5.0 |
| February 2022 | <ul><li>Bugfixes for the AMA Client installer (private preview)</li><li>Versioning fix to reflect appropriate Windows major/minor/hotfix versions</li><li>Internal test improvement on Linux</li></ul> | 1.2.0.0 | 1.15.3 |
| January 2022 | <ul><li>Syslog RFC compliance for Linux</li><li>Fixed issue for Linux perf counters not flowing on restart</li><li>Fixed installation failure on Windows Server 2008 R2 SP1</li></ul> | 1.1.5.1<sup>Hotfix</sup> | 1.15.2.0<sup>Hotfix</sup> |
| December 2021 | <ul><li>Fixed issues impacting Linux Arc-enabled servers</li><li>'Heartbeat' table > 'Category' column reports "Azure Monitor Agent" in Log Analytics for Windows</li></ul>  | 1.1.4.0 | 1.14.7.0<sup>2</sup> |
| September 2021 | <ul><li>Fixed issue causing data loss on restarting the agent</li><li>Fixed issue for Arc Windows servers</li></ul> | 1.1.3.2<sup>Hotfix</sup> | 1.12.2.0 <sup>1</sup> |
| August 2021 | Fixed issue allowing Azure Monitor Metrics as the only destination | 1.1.2.0 | 1.10.9.0<sup>Hotfix</sup> |
| July 2021 | <ul><li>Support for direct proxies</li><li>Support for Log Analytics gateway</li></ul> [Learn more](https://azure.microsoft.com/updates/general-availability-azure-monitor-agent-and-data-collection-rules-now-support-direct-proxies-and-log-analytics-gateway/) | 1.1.1.0 | 1.10.5.0 |
| June 2021 | General availability announced. <ul><li>All features except metrics destination now generally available</li><li>Production quality, security and compliance</li><li>Availability in all public regions</li><li>Performance and scale improvements for higher EPS</li></ul> [Learn more](https://azure.microsoft.com/updates/azure-monitor-agent-and-data-collection-rules-now-generally-available/) | 1.0.12.0 | 1.9.1.0 |

<sup>Hotfix</sup> Do not use AMA Linux versions v1.10.7, v1.15.1 and AMA Windows v1.1.3.1, v1.1.5.0. Please use hotfix versions listed above.
<sup>1</sup> Known issue: No data collected from Linux Arc-enabled servers
<sup>2</sup> Known issue: Linux performance counters data stops flowing on restarting/rebooting the machine(s)

## Next steps

- [Install and manage the extension](azure-monitor-agent-manage.md).
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
