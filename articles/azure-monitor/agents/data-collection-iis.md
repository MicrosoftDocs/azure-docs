---
title: Collect IIS logs with Azure Monitor Agent
description: Configure collection of Internet Information Services (IIS) logs on virtual machines with Azure Monitor Agent.
ms.topic: concept-article
ms.date: 07/12/2024
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect IIS logs with Azure Monitor Agent
**IIS Logs** is one of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides additional details for the Windows events data source type.

Internet Information Services (IIS) stores user activity in log files that can be collected by Azure Monitor agent and sent to a Log Analytics workspace.


## Prerequisites

- [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) where you have at least [contributor rights](../logs/manage-access.md#azure-rbac). Windows events are sent to the [Event](/azure/azure-monitor/reference/tables/event) table.
- A data collection endpoint (DCE) if you plan to use Azure Monitor Private Links. The data collection endpoint must be in the same region as the Log Analytics workspace. See [How to set up data collection endpoints based on your deployment](../essentials/data-collection-endpoint-overview.md#how-to-set-up-data-collection-endpoints-based-on-your-deployment) for details.
- Either a new or existing DCR described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md).

## Configure collection of IIS logs on client
Before you can collect IIS logs from the machine, you must ensure that IIS logging has been enabled and is configured correctly.

- The IIS log file must be in W3C format and stored on the local drive of the machine running the agent. 
- Each entry in the log file must be delineated with an end of line. 
- The log file must not use circular logging,, which overwrites old entries.
- The log file must not use renaming, where a file is moved and a new file with the same name is opened. 

The default location for IIS log files is **C:\\inetpub\\logs\\LogFiles\\W3SVC1**. Verify that log files are being written to this location or check your IIS configuration to identify an alternate location. Check the timestamps of the log files to ensure that they're recent.

:::image type="content" source="media/data-collection-iis/iis-log-format-setting.png" lightbox="media/data-collection-iis/iis-log-format-setting.png" alt-text="Screenshot of IIS logging configuration dialog box on agent machine.":::


## Configure IIS log data source

Create a data collection rule, as described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). In the **Collect and deliver** step, select **IIS Logs** from the **Data source type** dropdown. You only need to specify a file pattern to identify the directory where the log files are located if they are stored in a different location than configured in IIS. In most cases, you can leave this value blank.

:::image type="content" source="media/data-collection-iis/iis-data-collection-rule.png" lightbox="media/data-collection-iis/iis-data-collection-rule.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule.":::

## Destinations

IIS log data can be sent to the following locations.

| Destination | Table / Namespace |
|:---|:---|
| Log Analytics workspace | [W3CIISLog](/azure/azure-monitor/reference/tables/w3ciislog) |
    


### Sample IIS log queries

- **Count the IIS log entries by URL for the host www.contoso.com.**
    
    ```kusto
    W3CIISLog 
    | where csHost=="www.contoso.com" 
    | summarize count() by csUriStem
    ```

- **Review the total bytes received by each IIS machine.**

    ```kusto
    W3CIISLog 
    | summarize sum(csBytes) by Computer
    ```

- **Identify any records with a return status of 500.**
    
    ```kusto
    W3CIISLog 
    | where scStatus==500
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```


> [!NOTE]
> The X-Forwarded-For custom field is not supported at this time. If this is a critical field, you can collect the IIS logs as a custom text log.

## Troubleshooting
Go through the following steps if you aren't collecting data from the JSON log that you're expecting.

- Verify that IIS logs are being created in the location you specified.
- Verify that IIS logs are configured to be W3C formatted.
- See [Verify operation](./azure-monitor-agent-data-collection.md#verify-operation) to verify whether the agent is operational and data is being received.


## Next steps

Learn more about: 

- [Azure Monitor Agent](azure-monitor-agent-overview.md).
- [Data collection rules](../essentials/data-collection-rule-overview.md).
- [Best practices for cost management in Azure Monitor](../best-practices-cost.md).
