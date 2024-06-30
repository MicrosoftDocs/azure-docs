---
title: Change configuration for ingestion agents for Azure Operator Insights
description: Learn how to make and roll back configuration changes for Azure Operator Insights ingestion agents.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

#CustomerIntent: As a someone managing an agent that has already been set up, I want to update its configuration so that Data Products in Azure Operator Insights receive the correct data.
---

# Change configuration for Azure Operator Insights ingestion agents

The ingestion agent is a software package that is installed onto a Linux Virtual Machine (VM) owned and managed by you. You might need to change the agent configuration.

In this article, you'll change your ingestion agent configuration and roll back a configuration change.

## Prerequisites

- Using the documentation for your Data Product, check for required or recommended configuration for the ingestion agent.
- See [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md) for full details of the configuration options.

## Update agent configuration

> [!WARNING]
> Changing the configuration requires restarting the agent. For the MCC EDR source, a small number of EDRs being handled might be dropped.  It is not possible to gracefully restart without dropping any data. For safety, update agents one at a time, only updating the next when you are sure the previous was successful.

> [!WARNING]
> If you change the pipeline ID for an SFTP pull source, the agent treats it as a new source and might upload duplicate files with the new pipeline ID. To avoid this, add the `exclude_before_time` parameter to the file source configuration. For example, if you configure `exclude_before_time: "2024-01-01T00:00:00-00:00"` then any files last modified before midnight on January 1, 2024 UTC will be ignored by the agent.

If you need to change the agent's configuration, carry out the following steps.

1. Save a copy of the existing */etc/az-aoi-ingestion/config.yaml* configuration file.
1. Edit the configuration file to change the config values.
1. Restart the agent.
    ```
    sudo systemctl restart az-aoi-ingestion.service
    ```

## Roll back configuration changes

If a configuration change fails:

1. Copy the backed-up configuration file from before the change to the */etc/az-aoi-ingestion/config.yaml* file.
1. Restart the agent.
    ```
    sudo systemctl restart az-aoi-ingestion.service
    ```

## Related content

Learn how to:

- [Monitor and troubleshoot ingestion agents](monitor-troubleshoot-ingestion-agent.md).
- [Upgrade ingestion agents](upgrade-ingestion-agent.md).
- [Rotate secrets for ingestion agents](rotate-secrets-for-ingestion-agent.md).
