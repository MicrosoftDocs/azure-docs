---
title: Monitor and troubleshoot SFTP Ingestion Agents for Azure Operator Insights
description: Learn how to monitor SFTP Ingestion Agents and troubleshoot common issues 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: troubleshooting-general
ms.date: 12/06/2023
---

# Monitor and troubleshoot SFTP Ingestion Agents for Azure Operator Insights

If you notice problems with data collection from your SFTP ingestion agents, use the information in this section to fix common problems or create a diagnostics package. You can upload the diagnostics package to support tickets that you create in the Azure portal.

## Agent diagnostics overview

The ingestion bus agents are software packages, so their diagnostics are limited to the functioning of the application.  Microsoft doesn't provide OS or resource monitoring. You're encouraged to use standard tooling such as snmpd, Prometheus node exporter, or others to send OS-level data, logs and metrics to your own monitoring systems. [Monitor virtual machines with Azure Monitor](../azure-monitor/vm/monitor-virtual-machine.md) describes tools you can use if your ingestion agents are running on Azure VMs.

You can also use the diagnostics provided by Azure Operator Insights itself in Azure Monitor to help identify and debug ingestion issues.

The agent writes logs and metrics to files under */var/log/az-sftp-uploader/*.  If the agent is failing to start for any reason, such as misconfiguration, the stdout.log file contains human-readable logs explaining the issue.

Metrics are reported in a simple human-friendly form.  They're provided primarily to help Microsoft Support debug unexpected issues.

## Troubleshoot common issues

For most of these troubleshooting techniques, you need an SSH connection to the VM running the agent.

### Agent fails to start

Symptoms: `sudo systemctl status az-sftp-uploader` shows that the service is in failed state.

Steps to fix:

- Ensure the service is running: `sudo systemctl start az-sftp-uploader`.

- Look at the */var/log/az-sftp-uploader/stdout.log* file and check for any reported errors.  Fix any issues with the configuration file and start the agent again.

### Agent can't connect to SFTP server

Symptoms: No files are uploaded to AOI. The agent log file, */var/log/az-sftp-uploader/stdout.log*, contains errors about connecting the SFTP server.

Steps to fix:

- Verify the SFTP user and credentials used by the agent are valid for the SFTP server.

- Check network connectivity and firewall configuration between the agent and the SFTP server. By default, the SFTP server must have port 22 open to accept SFTP connections.

- Check that the `known_hosts` file on the agent VM contains a valid public SSH key for the SFTP server: 
  - On the agent VM, run `ssh-keygen -l -F *<sftp-server-IP-or-hostname>*` 
  - If there's no output, then `known_hosts` doesn't contain a matching entry. Follow the instructions in [Learn how to create and configure SFTP Ingestion Agents for Azure Operator Insights](how-to-install-sftp-agent.md) to add a `known_hosts` entry for the SFTP server.


### No files are uploaded to Azure Operator Insights

Symptoms: 
- No data appears in Azure Data Explorer.
- The AOI *Data Ingested* metric for the relevant data type is zero. 

Steps to fix:

- Check that the agent is running on all VMs and isn't reporting errors in logs.

- Check that files exist in the correct location on the SFTP server, and that they aren't being excluded due to file source config (see [Files are missing](#files-are-missing)).

- Check the network connectivity and firewall configuration between the ingestion agent and Azure Operator Insights.


### Files are missing

Symptoms:
- Data is missing from Azure Data Explorer.
- The AOI *Data Ingested* and *Processed File Count* metrics for the relevant data type are lower than expected. 

Steps to fix:

- Check that the agent is running on all VMs and isn't reporting errors in logs. Search the logs for the name of the missing file to find errors related to that file.

- Check that the files exist on the SFTP server and that they aren't being excluded due to file source config. Check the file source config and confirm that:
  - The files exist on the SFTP server under the path defined in `base_path`. Ensure that there are no symbolic links in the file paths of the files to upload: the ingestion agent ignores symbolic links.
  - The "last modified" time of the files is at least `settling_time_secs` seconds earlier than the time of the most recent upload run for this file source.
  - The "last modified" time of the files is later than `exclude_before_time` (if specified).
  - The file path relative to `base_path` matches the regular expression given by `include_pattern` (if specified).
  - The file path relative to `base_path` *doesn't* match the regular expression given by `exclude_pattern` (if specified).

- If recent files are missing, check the agent logs to confirm that the ingestion agent performed an upload run for the file source at the expected time. The `schedule` parameter in the file source config gives the expected schedule. 

- Check that the agent VM isn't overloaded – monitor CPU and memory usage. In particular, ensure no other process is taking resources from the VM.

### Files are uploaded more than once

Symptoms:
- Duplicate data appears in Azure Operator Insights

Steps to fix:

- Check whether the ingestion agent encountered a retryable error on a previous upload and then retried that upload more than 24 hours after the last successful upload. In that case, the agent might upload duplicate data during the retry attempt. The duplication of data should affect only the retry attempt.

- Check that the file sources defined in the config file refer to non-overlapping sets of files. If multiple file sources are configured to pull files from the same location on the SFTP server, use the `include_pattern` and `exclude_pattern` config fields to specify distinct sets of files that each file source should consider.

- If you're running multiple instances of the SFTP ingestion agent, check that the file sources configured for each agent don't overlap with file sources on any other agent. In particular, look out for file source config that has been accidentally copied from another agent's config.

- If you recently changed the `source_id` for a configured file source, use the `exclude_before_time` field to avoid files being reuploaded with the new `source_id`. For instructions, see [Manage SFTP Ingestion Agents for Azure Operator Insights: Update agent configuration](how-to-manage-sftp-agent.md#update-agent-configuration).

## Collect diagnostics

Microsoft Support might request diagnostic packages when investigating an issue.

To collect a diagnostics package, SSH to the Virtual Machine and run the command `/usr/bin/microsoft/az-ingestion-gather-diags`.  This command generates a date-stamped zip file in the current directory that you can copy from the system.

> [!NOTE]
> Diagnostics packages don't contain any customer data or the value of any credentials.