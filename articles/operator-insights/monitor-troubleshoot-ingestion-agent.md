---
title: Monitor and troubleshoot ingestion agents for Azure Operator Insights
description: Learn how to detect, troubleshoot, and fix problems with Azure Operator Insights ingestion agents.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: troubleshooting-general #Don't change.
ms.date: 02/29/2024

#CustomerIntent: As a someone managing an agent that has already been set up, I want to monitor and troubleshoot it so that Data Products in Azure Operator Insights receive the correct data.
---


# Monitor and troubleshoot Azure Operator Insights ingestion agents

For an overview of ingestion agents, see [Ingestion agent overview](ingestion-agent-overview.md).

If you notice problems with data collection from your ingestion agents, use the information in this section to fix common problems or create a diagnostics package. You can upload the diagnostics package to support tickets that you create in the Azure portal.

The ingestion agent is a software package, so the diagnostics are limited to the functioning of the application. We don't provide OS or resource monitoring. You're encouraged to use standard tooling such as snmpd, Prometheus node exporter, or other tools to send OS-level data, logs, and metrics to your own monitoring systems. [Monitor virtual machines with Azure Monitor](../azure-monitor/vm/monitor-virtual-machine.md) describes tools you can use if your ingestion agents are running on Azure VMs.

The agent writes logs and metrics to files under */var/log/az-aoi-ingestion/*. If the agent is failing to start for any reason, such as misconfiguration, the *stdout.log* file contains human-readable logs explaining the issue.

Metrics are reported in a simple human-friendly form.

## Prerequisites

- For most of these troubleshooting techniques, you need an SSH connection to the VM running the agent.

## Ingestion agent diagnostics

To collect a diagnostics package, SSH to the Virtual Machine and run the command `/usr/bin/microsoft/az-aoi-ingestion-gather-diags`. This command generates a date-stamped zip file in the current directory that you can copy from the system.

If you have configured collection of logs through the Azure Monitor agent, you can view ingestion agent logs in the portal view of your Log Analytics workspace, and may not need to collect a diagnostics package to debug your issues.

> [!NOTE]
> Microsoft Support might request diagnostics packages when investigating an issue. Diagnostics packages don't contain any customer data or the value of any credentials.


## Problems common to all sources

Problems broadly fall into four categories.

- An agent misconfiguration, which prevents the agent from starting.
- A problem with receiving data from the source, typically misconfiguration, or network connectivity.
- A problem with uploading files to the Data Product's input storage account, typically network connectivity.
- A problem with the VM on which the agent is running.

### Agent fails to start

Symptoms: `sudo systemctl status az-aoi-ingestion` shows that the service is in failed state.

- Ensure the service is running.
    ```
    sudo systemctl start az-aoi-ingestion
    ```
- Look at the */var/log/az-aoi-ingestion/stdout.log* file and check for any reported errors. Fix any issues with the configuration file and start the agent again.
 
### No data appearing in Azure Operator Insights

Symptoms: no data appears in Azure Data Explorer.

- Check the network connectivity and firewall configuration between the ingestion agent VM and the Data Product's input storage account.
- Check the logs from the ingestion agent for errors uploading to Azure. If the logs point to authentication issues, check that the agent configuration has the correct sink settings and authentication for your Data Product. Then restart the agent.
- Check that the ingestion agent is receiving data from its source. Check the network connectivity and firewall configuration between your network and the ingestion agent.

## Problems with the MCC EDR source

This section covers problems specific to the MCC EDR source.

You can also use the diagnostics provided by the MCCs, or by Azure Operator Insights itself in Azure Monitor, to help identify and debug ingestion issues.

### MCC can't connect

Symptoms: MCC reports alarms about MSFs being unavailable.

- Check that the agent is running.
- Ensure that MCC is configured with the correct IP and port.
- Check the logs from the agent and see if it's reporting connections. If not, check the network connectivity to the agent VM and verify that the firewalls aren't blocking traffic to port 36001.
- Collect a packet capture to see where the connection is failing.

### No EDRs appearing in Azure Operator Insights

Symptoms: no data appears in Azure Data Explorer.

- Check that the MCC is healthy and ingestion agents are running.
- Check the ingestion agent logs in the diagnostics package for errors uploading to Azure. If the logs point to an invalid connection string, or connectivity issues, fix the configuration, connection string, or SAS token, and restart the agent.
- Check the network connectivity and firewall configuration on the storage account.

### Data missing or incomplete

Symptoms: Azure Monitor shows a lower incoming EDR rate in ADX than expected.

- Check that the agent is running on all VMs and isn't reporting errors in the diagnostics package logs.
- Verify that the agent VMs aren't being sent more than the rated load.
- Check agent metrics in the diagnostics package for dropped bytes/dropped EDRs. If the metrics don't show any dropped data, then MCC isn't sending the data to the agent. Check the "received bytes" metrics to see how much data is being received from MCC.
- Check that the agent VM isn't overloaded – monitor CPU and memory usage. In particular, ensure no other process is taking resources from the VM.
 
## Problems with the SFTP pull source

This section covers problems specific to the SFTP pull source.

You can also use the diagnostics provided by Azure Operator Insights itself in Azure Monitor to help identify and debug ingestion issues.

### Agent can't connect to SFTP server

Symptoms: No files are uploaded to Azure Operator Insights. The agent log file, */var/log/az-aoi-ingestion/stdout.log*, contains errors about connecting the SFTP server.

- Verify the SFTP user and credentials used by the agent are valid for the SFTP server.
- Check network connectivity and firewall configuration between the agent and the SFTP server. By default, the SFTP server must have port 22 open to accept SFTP connections.
- Check that the `known_hosts` file on the agent VM contains a valid public SSH key for the SFTP server: 
  - On the agent VM, run `ssh-keygen -l -F *<sftp-server-IP-or-hostname>*`.
  - If there's no output, then `known_hosts` doesn't contain a matching entry. Follow the instructions in [Setup the Azure Operator Insights ingestion agent](set-up-ingestion-agent.md) to add a `known_hosts` entry for the SFTP server.

### No files are uploaded to Azure Operator Insights

Symptoms: No data appears in Azure Data Explorer. Logs of category `Ingestion` don't appear in [Azure Operator Insights monitoring data](monitor-operator-insights-data-reference.md#resource-logs) or they contain errors. The [Number of ingested rows](concept-data-quality-monitoring.md#metrics) data quality metric for the relevant data type is zero.

- Check that the agent is running on all VMs and isn't reporting errors in logs.
- Check that files exist in the correct location on the SFTP server, and that they aren't being excluded due to file source config (see [Files are missing](#files-are-missing)).
- Ensure that the configured SFTP user can read all directories under the `base_path`, which file source config doesn't exclude.
- Check the network connectivity and firewall configuration between the ingestion agent VM and the Data Product's input storage account.

### Files are missing

Symptoms: Data is missing from Azure Data Explorer. Logs of category `Ingestion` in [Azure Operator Insights monitoring data](monitor-operator-insights-data-reference.md#resource-logs) are lower than expected or they contain errors. The [Number of ingested rows](concept-data-quality-monitoring.md#metrics) data quality metric for the relevant data type is lower than expected.


- Check that the agent is running on all VMs and isn't reporting errors in logs. Search in the diagnostics package logs for the name of the missing file to find errors related to that file.
- Check that the files exist on the SFTP server and that they aren't being excluded due to file source config. Check the file source config and confirm that:
  - The files exist on the SFTP server under the path defined in `base_path`. Ensure that there are no symbolic links in the file paths of the files to upload: the ingestion agent ignores symbolic links.
  - The "last modified" time of the files is at least `settling_time` seconds earlier than the time of the most recent upload run for this file source.
  - The "last modified" time of the files is later than `exclude_before_time` (if specified).
  - The file path relative to `base_path` matches the regular expression given by `include_pattern` (if specified).
  - The file path relative to `base_path` *doesn't* match the regular expression given by `exclude_pattern` (if specified).
- If recent files are missing, check the agent logs in the diagnostics package to confirm that the ingestion agent performed an upload run for the source at the expected time. The `cron` parameter in the source config gives the expected schedule.
- Check that the agent VM isn't overloaded – monitor CPU and memory usage. In particular, ensure no other process is taking resources from the VM.

### Files are uploaded more than once

Symptoms: Duplicate data appears in Azure Operator Insights.

- Check whether the ingestion agent encountered a retryable error in the diagnostics package log on a previous upload and then retried that upload more than 24 hours after the last successful upload. In that case, the agent might upload duplicate data during the retry attempt. The duplication of data should affect only the retry attempt.
- Check that the file sources defined in the config file refer to nonoverlapping sets of files. If multiple file sources are configured to pull files from the same location on the SFTP server, use the `include_pattern` and `exclude_pattern` config fields to specify distinct sets of files that each file source should consider.
- If you're running multiple instances of the SFTP ingestion agent, check that the file sources configured for each agent don't overlap with file sources on any other agent. In particular, look out for file source config that was accidentally copied from another agent's config.
- If you recently changed the pipeline `id` for a configured file source, use the `exclude_before_time` field to avoid files being reuploaded with the new pipeline `id`. For instructions, see [Change configuration for ingestion agents for Azure Operator Insights](change-ingestion-agent-configuration.md).

## Related content

Learn how to:

- [Change configuration for ingestion agents](change-ingestion-agent-configuration.md).
- [Upgrade ingestion agents](upgrade-ingestion-agent.md).
- [Rotate secrets for ingestion agents](rotate-secrets-for-ingestion-agent.md).
