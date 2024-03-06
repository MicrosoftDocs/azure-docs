---
title: Upgrade the Azure Operator Insights ingestion agent
description: Learn how to upgrade the Azure Operator Insights ingestion agent to receive the latest new features or fixes.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

#CustomerIntent: As a someone managing an agent that has already been set up, I want to upgrade it to receive the latest enhancements or fixes.
---
# Upgrade Azure Operator Insights ingestion agents

The ingestion agent is a software package that is installed onto a Linux Virtual Machine (VM) owned and managed by you. You might need to upgrade the agent.

In this article, you'll upgrade your ingestion agent and roll back an upgrade.

## Prerequisites

Obtain the latest version of the ingestion agent RPM from [https://go.microsoft.com/fwlink/?linkid=2260508](https://go.microsoft.com/fwlink/?linkid=2260508).

Links to the current and previous releases of the agents are available below the heading of each [release note](ingestion-agent-release-notes.md). If you're looking for an agent version that's more than 6 months old, check out the [release notes archive](ingestion-agent-release-notes-archive.md).

## Upgrade the agent software

To upgrade to a new release of the agent, repeat the following steps on each VM that has the old agent.

1. Ensure you have a copy of the currently running version of the RPM, in case you need to roll back the upgrade.
1. Copy the new RPM to the VM.
1. Connect to the VM over SSH, and change to the directory where the RPM was copied.
1. Save a copy of the existing */etc/az-aoi-ingestion/config.yaml* configuration file.
1. Upgrade the RPM.
    ```
    sudo dnf install ./*.rpm
    ```
    Answer `y` when prompted.  
1. Make any changes to the configuration file described by your support contact or the documentation for the new version. Most upgrades don't require any configuration changes.
1. Restart the agent.
    ```
    sudo systemctl restart az-aoi-ingestion.service
    ```
1. Once the agent is running, configure the az-aoi-ingestion service to automatically start on a reboot.
    ```
    sudo systemctl enable az-aoi-ingestion.service
    ```
1. Verify that the agent is running and that it's copying files as described in [Monitor and troubleshoot Ingestion Agents for Azure Operator Insights](monitor-troubleshoot-ingestion-agent.md).

## Roll back an upgrade

If an upgrade or configuration change fails:

1. Copy the backed-up configuration file from before the change to the */etc/az-aoi-ingestion/config.yaml* file.
1. Downgrade back to the original RPM.
1. Restart the agent.
    ```
    sudo systemctl restart az-aoi-ingestion.service
    ```
1. When the agent is running, configure the az-aoi-ingestion service to automatically start on a reboot.
    ```
    sudo systemctl enable az-aoi-ingestion.service
    ```

## Related content

Learn how to:

- [Monitor and troubleshoot ingestion agents](monitor-troubleshoot-ingestion-agent.md).
- [Change configuration for ingestion agents](change-ingestion-agent-configuration.md).
- [Rotate secrets for ingestion agents](rotate-secrets-for-ingestion-agent.md).
