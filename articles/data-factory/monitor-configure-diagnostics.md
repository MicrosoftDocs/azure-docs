---
title: Configure diagnostic settings and workspace
description: Learn how to configure diagnostic settings and a Log Analytics Workspace to monitor Azure Data Factory.
author: minhe-msft
ms.author: hemin
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 09/02/2021
---

# Configure diagnostic settings and workspace

Create or add diagnostic settings for your data factory.

1. In the portal, go to Monitor. Select **Settings** > **Diagnostic settings**.

1. Select the data factory for which you want to set a diagnostic setting.

1. If no settings exist on the selected data factory, you're prompted to create a setting. Select **Turn on diagnostics**.

   :::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image1.png" alt-text="Create a diagnostic setting if no settings exist":::

   If there are existing settings on the data factory, you see a list of settings already configured on the data factory. Select **Add diagnostic setting**.

   :::image type="content" source="media/data-factory-monitor-oms/add-diagnostic-setting.png" alt-text="Add a diagnostic setting if settings exist":::

1. Give your setting a name, select **Send to Log Analytics**, and then select a workspace from **Log Analytics Workspace**.

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

      You can select various logs relevant to your workloads to send to Log Analytics tables. For example, if you don't use SQL Server Integration Services (SSIS) at all, you need not select any SSIS logs. If you want to log SSIS Integration Runtime (IR) start/stop/maintenance operations, you can select SSIS IR logs. If you invoke SSIS package executions via T-SQL on SQL Server Management Studio (SSMS), SQL Server Agent, or other designated tools, you can select SSIS package logs. If you invoke SSIS package executions via Execute SSIS Package activities in ADF pipelines, you can select all logs.

    * If you select _AllMetrics_, various ADF metrics will be made available for you to monitor or raise alerts on, including the metrics for ADF activity, pipeline, and trigger runs, as well as for SSIS IR operations and SSIS package executions.

   :::image type="content" source="media/data-factory-monitor-oms/monitor-oms-image2.png" alt-text="Name your settings and select a log-analytics workspace":::

    > [!NOTE]
    > Because an Azure log table can't have more than 500 columns, we **highly recommended** you select _Resource-Specific mode_. For more information, see [AzureDiagnostics Logs reference](/azure/azure-monitor/reference/tables/azurediagnostics).

1. Select **Save**.

After a few moments, the new setting appears in your list of settings for this data factory. Diagnostic logs are streamed to that workspace as soon as new event data is generated. Up to 15 minutes might elapse between when an event is emitted and when it appears in Log Analytics.

## Next Steps

[Setup diagnostics logs via the Azure Monitor REST API](monitor-logs-rest.md)
