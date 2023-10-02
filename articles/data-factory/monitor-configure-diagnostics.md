---
title: Configure diagnostic settings and a workspace
description: Learn how to configure diagnostic settings and a Log Analytics workspace to monitor Azure Data Factory.
author: ukchrist
ms.author: ulrichchrist
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 07/20/2023
---

# Configure diagnostic settings and a workspace

Create or add diagnostic settings for your data factory.

1. In the Azure portal, navigate to your data factory and select **Diagnostics** on the left navigation pane to see the diagnostics settings.  If there are existing settings on the data factory, you see a list of settings already configured. Select **Add diagnostic setting**.

   :::image type="content" source="media/data-factory-monitor-oms/add-diagnostic-setting.png" alt-text="Screenshot that shows adding a diagnostic setting if settings exist.":::

1. Give your setting a name, select **Send to Log Analytics**, and then select a workspace from **Log Analytics workspace**.

    * In _Azure-Diagnostics_ mode, diagnostic logs flow into the _AzureDiagnostics_ table.
    * In _Resource-Specific_ mode, diagnostic logs from Azure Data Factory flow into the following tables:
      - _ADFActivityRun_
      - _ADFPipelineRun_
      - _ADFTriggerRun_
      - _ADFSSISIntegrationRuntimeLogs_
      - _ADFSSISPackageEventMessageContext_
      - _ADFSSISPackageEventMessages_
      - _ADFSSISPackageExecutableStatistics_
      - _ADFSSISPackageExecutionComponentPhases_
      - _ADFSSISPackageExecutionDataStatistics_

      You can select various logs relevant to your workloads to send to Log Analytics tables. For example: 
        - If you don't use SQL Server Integration Services (SSIS) at all, you don't need to select any SSIS logs. 
        - If you want to log SSIS integration runtime (IR) start, stop, or maintenance operations, select SSIS IR logs. 
        - If you invoke SSIS package executions via T-SQL on SQL Server Management Studio, SQL Server Agent, or other designated tools, select SSIS package logs. 
        - If you invoke SSIS package executions via Execute SSIS Package activities in Data Factory pipelines, select all logs.

    * If you select _AllMetrics_, various Data Factory metrics are made available for you to monitor or raise alerts on. These metrics include the metrics for Data Factory activity, pipeline, and trigger runs, and for SSIS IR operations and SSIS package executions.

   :::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image2.png" alt-text="Screenshot that shows naming your settings and selecting a Log Analytics workspace.":::

    > [!NOTE]
    > Because an Azure log table can't have more than 500 columns, we *highly recommend* that you select _Resource-Specific mode_. For more information, see [Azure diagnostics logs reference](/azure/azure-monitor/reference/tables/azurediagnostics).

1. Select **Save**.

After a few moments, the new setting appears in your list of settings for this data factory. Diagnostic logs are streamed to that workspace as soon as new event data is generated. Up to 15 minutes might elapse between when an event is emitted and when it appears in Log Analytics.

## Next steps

[Set up diagnostics logs via the Azure Monitor REST API](monitor-logs-rest.md)
