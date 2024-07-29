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

This article describes how to upgrade your ingestion agent, and how to roll back an upgrade.

## Prerequisites

Decide which version of the ingestion agent you would like to upgrade to. If you don't specify a version when you upgrade, you'll upgrade to the most recent version.

See [What's new with Azure Operator Insights ingestion agent](ingestion-agent-release-notes.md) for a list of recent releases and to see what's changed in each version. If you're looking for an agent version that's more than six months old, check out the [release notes archive](ingestion-agent-release-notes-archive.md).

If you would like to verify the authenticity of the ingestion agent package before upgrading, see [How to use the GPG Repository Signing Key](/linux/packages#how-to-use-the-gpg-repository-signing-key).

## Upgrade the agent software

To upgrade to a new release of the agent, repeat the following steps on each VM that has the old agent.

1. Connect to the VM over SSH.
1. Save a copy of the existing */etc/az-aoi-ingestion/config.yaml* configuration file.
1. Upgrade the agent using your VM's package manager. For example, for Red Hat-based Linux Distributions:
    ```
    sudo dnf upgrade az-aoi-ingestion
    ```
    Answer `y` when prompted.
    1. Alternatively, to upgrade to a specific version of the agent, specify the version number in the command. For example, for version 2.0.0 on a RHEL8 system, use the following command:
    ```
    sudo dnf install az-aoi-ingestion-2.0.0
    ```
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

1. Downgrade back to the previous version by reinstalling the previous version of the agent. For example, to downgrade to version 1.0.0 on a RHEL8 system, use the following command:
    ```
    sudo dnf downgrade az-aoi-ingestion-1.0.0
    ```
1. Copy the backed-up configuration file from before the change to the */etc/az-aoi-ingestion/config.yaml* file.
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
