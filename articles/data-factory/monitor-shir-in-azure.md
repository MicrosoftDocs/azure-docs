---
title: Monitor self-hosted integration runtime (SHIR) virtual machines in Azure
titleSuffix: Azure Data Factory & Azure Synapse
description: This article describes how to monitor Azure virtual machines hosting the self-hosted integration runtime.
author: jonburchel
ms.service: data-factory
ms.subservice: 
ms.custom: synapse
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jburchel
---

# Monitor self-hosted integration runtime (SHIR) virtual machines in Azure
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

By default, the Self Hosted Integration Runtime’s diagnostic and performance telemetry is saved locally on the virtual or physical machine that is hosting it. Two broad categories of telemetry are of interest for monitoring the Self Hosted Integration Runtime.

## Event logs

When logged on locally to the Self Hosted Integration Runtime, specific events can be viewed using the [event viewer](/windows/win32/eventlog/viewing-the-event-log). The relevant events are captured in two event viewer journals named: **Connectors - Integration Runtime** and **Integration Runtime** respectively. While it’s possible to log on to to the Self Hosted Integration Runtime hosts individually to view these events, it's also possible to stream these events to a Log Analytics workspace in Azure monitor for ease of query and centralization purposes.

## Performance counters

Performance counters in Windows and Linux provide insight into the performance of hardware components, operating systems, and applications such as the Self Hosted Integration Runtime. The performance counters can be viewed and collected locally on the VM using the performance monitor tool. See the article on [using performance counters](/windows/win32/perfctrs/using-performance-counters) for more details. 

## Centralize log collection and analysis

When a deployment requires a more in-depth level of analysis or has reached a certain scale, it becomes impractical to log on to locally to each Self Hosted Integration Runtime host. Therefore, we recommend using Azure Monitor and Azure Log Analytics specifically to collect that data and enable a single pane of glass monitoring for your Self Hosted Integration Runtimes. See the article on [Configuring the SHIR for log analytics collection](how-to-configure-shir-for-log-analytics-collection.md) for instructions on how to instrument your Self Hosted Integration Runtimes for Azure Monitor.

## Next Steps

- [How to configure SHIR for log analytics collection](how-to-configure-shir-for-log-analytics-collection.md)
- [Review integration runtime concepts in Azure Data Factory.](concepts-integration-runtime.md)
- Learn how to [create a self-hosted integration runtime in the Azure portal.](create-self-hosted-integration-runtime.md)
