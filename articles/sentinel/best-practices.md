---
title: Best practices for Azure Sentinel
description: Learn about best practices to employ when managing your Azure Sentinel workspace.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 06/21/2021
---

# Best practices for Azure Sentinel

This article collects best practices and guidance to use when deploying, managing, and using Azure Sentinel, including links to additional articles for more information.

## Architectural best practices

- Before deploying Azure Sentinel, review and complete pre-deployment activities and prerequisites, and review best practices for creating your Azure Sentinel instance. 

    For more information, see [Pre-deployment activities and prerequisites for deploying Azure Sentinel](prerequisites.md).

- When structuring your Azure Sentinel instance, consider Azure Sentinel's cost and billing structure. For more information, see:

    - [Azure Sentinel costs and billing](azure-sentinel-billing.md)
    - [Azure Sentinel pricing](https://azure.microsoft.com/en-us/pricing/details/azure-sentinel/)
    - [Log Analytics pricing](https://azure.microsoft.com/en-us/pricing/details/monitor/)
    - [Logic apps (playbooks) pricing](https://azure.microsoft.com/en-us/pricing/details/logic-apps/)
    - [Integrating Azure Data Explorer for long-term log retention](store-logs-in-azure-data-explorer.md)

## Data collection best practices

### Prioritizing your data connectors

If it's unclear to you which data connectors will best serve your environment, start by enabling all [free data connectors](azure-sentinel-billing.md#free-data-sources) to start getting value from Azure Sentinel as soon as possible, while you continue to plan other data connectors and budgets.

For your [partner] and [custom](create-custom-connector.md) data connectors, start by setting up your [Syslog](connect-syslog.md) and [CEF](connect-common-event-format.md) connectors with the highest priority first, as well as any Linux-based devices. If your data ingestion becomes too expensive too quickly, stop or filter the logs forwarded using the [Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-overview).

> [!TIP]
> Custom data connectors enable you to ingest data into Azure Sentinel from data sources not currently supported by built-in functionality, such as via agent, Logstash, or API. For more information, see [Resources for creating Azure Sentinel custom connectors](create-custom-connector.md).
>

### Monitoring agent best practices

The Microsoft Monitoring Agent is a major factor when it comes to endpoint log ingestion for Azure Sentinel. There are some key details and use cases to keep in mind when using the agents:
-	To note, the Microsoft Monitoring Agent and the Azure Monitor Agent are different agents that serve the same purpose. The AMA is a newer version of the MMA that covers the same base functionalities but also adds additional features such as pre-ingestion log filtering and individual data collection rules for certain groups of machines.
-	The MMA currently has a limit of 10,000 events per second. It is best to not let the log ingestion to reach over 8,500 events per second as that is when the performance of the agent begins to drop.
-	In the event that multiple agents are required, it is best to utilize a virtual machine scale set to run multiple agents that will handle log ingestion. Several machines can also be used instead of VMSS. Both of these options can then be used with a load balancer to ensure that the machines are not overloaded as well as preventing duplication of data.
-	The MMA for Linux currently does not support multi-homing (sending logs to multiple workspaces). If multi-homing is required, it is recommended that the AMA is used instead as it supports multi-homing.

### CFilter your logs before ingestion


If looking to filter log content or which logs are being collected, it is best to use either the Azure Monitor Agent or Logstash to achieve this. The new Azure Monitor Agent supports filtering via data collection rules that configure the agent to only collect the specified events. This is extremely useful when looking to avoid ingesting logs that are not important for security operations. This new agent can be used for both Windows and Linux. 
Logstash should be used when looking to filter out message content before ingestion. This is most useful when working with syslog or CEF based logs but can be used for Windows as well. Logstash allows for changes to be made to the message, removing unwanted details, before being sent to the Azure Sentinel workspace. This can help drive down cost if there are chatty logs that contain unwanted information.
-	Note: If using Logstash, the logs will be ingested as custom logs. If Logstash is used on free tier logs, this will cause them to become paid tier logs. Additionally, custom logs will need to be worked into Analytic Rules, Threat Hunting, and Workbooks as they are not automatically added. Lastly, custom logs are not available for any Machine Learning capabilities at this time.

### Sample data ingestion challenges





## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
