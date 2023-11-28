---
title: Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights
description: Learn how to monitor MCC EDR Ingestion Agents and troubleshoot common issues 
author: HollyCl
ms.author: HollyCl
ms.service: operator-insights
ms.topic: troubleshooting-general #Don't change.
ms.date: 12/06/2023
---

# Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights

## Agent diagnostics overview

Because the ingestion bus agents are software packages, their diagnostics are limited to the functioning of the application.  Microsoft doesn't provide OS or resource monitoring. You're encouraged to use standard tooling such as snmpd, Prometheus node exporter, or others to send OS-level data and telemetry to your on-premises monitoring systems.

The diagnostics provided by the MCCs, or by Azure Operator Insights itself in Azure Monitor, are expected to be sufficient for most other use cases.

The agent writes logs and metrics to files under */var/log/az-mcc-edr-uploader/*.  If the agent is failing to start for any reason, such as misconfiguration, the stdout.log file contains human-readable logs explaining the issue.

Metrics are reported in a simple human-friendly form.  They're provided primarily for Microsoft support to have telemetry for debugging unexpected issues.  The diagnostics provided by the MCCs, or by Azure Operator Insights itself in Azure Monitor, are expected to be sufficient for most other use cases.

## Collecting diagnostics

Microsoft Support may request diagnostic packages when investigating an issue.

To collect a diagnostics package, SSH to the Virtual Machine and run the command `/usr/bin/microsoft/az-ingestion-gather-diags`.  This command generates a date-stamped zip file in the current directory that you can copy from the system.

> [!NOTE]
> Diagnostics packages don't contain any customer data or the value of the Azure Storage connection string.

## Troubleshooting common issues

For most of these troubleshooting techniques, you need an SSH connection to the VM running the agent.

If none of these suggested remediation steps help, or you're unsure how to proceed, collect a diagnostics package and contact your support representative.

### Agent fails to start

Symptoms: `sudo systemctl status az-mcc-edr-uploader` shows that the service is in failed state.

Steps to fix:

- Ensure the service is running: `sudo systemctl start az-mcc-edr-uploader`.

- Look at the */var/log/az-mcc-edr-uploader/stdout.log* file and check for any reported errors.  Fix any issues with the configuration file and start the agent again.

### MCC cannot connect

Symptoms: MCC reports alarms about MSFs being unavailable.

Steps to fix:

- Check that the agent is running.
- Ensure that MCC is configured with the correct IP and port.

- Check the logs from the agent and see if it's reporting connections.  If not, check the network connectivity to the agent VM and verify that the firewalls aren't blocking traffic to port 36001.

- Collect a packet capture to see where the connection is failing.

### No EDRs appearing in AOI

Symptoms: no data appears in Azure Data Explorer.

Steps to fix:

- Check that the MCC is healthy and ingestion bus agents are running.

- Check the logs from the ingestion agent for errors uploading to Azure. If the logs point to an invalid connection string, or connectivity issues, fix the configuration/connection string and restart the agent.

- Check the network connectivity and firewall configuration on the storage account.

### Data missing or incomplete

Symptoms: Azure Monitor shows a lower incoming EDR rate in ADX than expected.

Steps to fix:

- Check that the agent is running on all VMs and isn't reporting errors in logs.

- Verify that the agent VMs aren't being sent more than the rated load.  

- Check agent metrics for dropped bytes/dropped EDRs.  If the metrics don't show any dropped data, then MCC isn't sending the data to the agent. Check the "received bytes" metrics to see how much data is being received from MCC.

- Check that the agent VM isn't overloaded – monitor CPU and memory usage.   In particular, ensure no other process is taking resources from the VM.