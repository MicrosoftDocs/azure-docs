---
title: Prioritize data connectors for Microsoft Sentinel
description: Learn how to plan and prioritize which data sources to use for your Microsoft Sentinel deployment.
author: limwainstein
ms.topic: conceptual
ms.date: 06/29/2023
ms.author: lwainstein
ms.service: microsoft-sentinel
---

# Prioritize your data connectors for Microsoft Sentinel

In this article, you learn how to plan and prioritize which data sources to use for your Microsoft Sentinel deployment. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Determine which connectors you need

Check which data connectors are relevant to your environment, in the following order:

1. Review this list of [free data connectors](billing.md#free-data-sources). The free data connectors will start showing value from Microsoft Sentinel as soon as possible, while you continue to plan other data connectors and budgets.
1. Review the [custom](create-custom-connector.md) data connectors.
1. Review the [partner](data-connectors-reference.md) data connectors. 

For the custom and partner connectors, we recommend that you start by setting up [CEF/Syslog](connect-cef-syslog-options.md) connectors, with the highest priority first, as well as any Linux-based devices.

If your data ingestion becomes too expensive, too quickly, stop or filter the logs forwarded using the [Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-overview.md).

> [!TIP]
> Custom data connectors enable you to ingest data into Microsoft Sentinel from data sources not currently supported by built-in functionality, such as via agent, Logstash, or API. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).
>

## Alternative data ingestion requirements

If the standard configuration for data collection doesn't work well for your organization, review these and possible [alternative solutions and considerations](best-practices-data.md#alternative-data-ingestion-requirements).

## Filter your logs

If you choose to filter your collected logs or log content before the data is ingested into Microsoft Sentinel, [review these best practices](best-practices-data.md#filter-your-logs-before-ingestion).

## Next steps

In this article, you learned how to prioritize data connectors to prepare for your Microsoft Sentinel deployment.

> [!div class="nextstepaction"]
>>[Plan roles and permissions](roles.md)