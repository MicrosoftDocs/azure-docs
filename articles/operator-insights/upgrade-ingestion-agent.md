---
title: Upgrade ingestion agents for Azure Operator Insights
description: Learn how to upgrade Azure Operator Insights ingestion agents.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

# Upgrade Azure Operator Insights ingestion agents

The ingestion agent is a software package that is installed onto a Linux Virtual Machine (VM) owned and managed by you. You might need to upgrade the agent.

In this article, you will upgrade your ingestion agent and roll back an upgrade.

## Prerequisites

Obtain latest version of the ingestion agent RPM from [download.microsoft.com](https://download.microsoft.com/download/a/4/a/a4ae5f8b-6ccd-477b-8c29-2c22bed915d2/az-sftp-uploader-0.9.0-1.el8.x86_64.rpm).

## Upgrade the agent software

To upgrade to a new release of the agent, repeat the following steps on each VM that has the old agent.

1. Copy the RPM to the VM. In an SSH session, change to the directory where the RPM was copied.
2. Save a copy of the existing */etc/az-aoi-ingestion/config.yaml* configuration file.
3. Upgrade the RPM: `sudo dnf install .\*.rpm`.  Answer 'y' when prompted.  
4. Create a new config file based on the new sample, keeping values from the original. Follow specific instructions in the release notes for the upgrade to ensure the new configuration is generated correctly. 
5. Restart the agent: `sudo systemctl restart az-aoi-ingestion.service`
6. Once the agent is running, configure the az-aoi-ingestion service to automatically start on a reboot: `sudo systemctl enable az-aoi-ingestion.service`.
7. Verify that the agent is running and that it's copying files as described in [Monitor and troubleshoot Ingestion Agents for Azure Operator Insights](monitor-troubleshoot-ingestion-agent.md).

## Roll back an upgrade

If an upgrade or configuration change fails:

1. Copy the backed-up configuration file from before the change to the */etc/az-aoi-ingestion/config.yaml* file.
2. Downgrade back to the original RPM.
3. Restart the agent: `sudo systemctl restart az-aoi-ingestion.service`
4. Once the agent is running, configure the az-aoi-ingestion service to automatically start on a reboot: `sudo systemctl enable az-aoi-ingestion.service`.

## Related content

Learn how to:

- [Monitor and troubleshoot ingestion agents](monitor-troubleshoot-ingestion-agent.md).
- [Change configuration for ingestion agents](change-ingestion-agent-configuration.md).
- [Rotate secrets for ingestion agents](rotate-secrets-for-ingestion-agent.md).
