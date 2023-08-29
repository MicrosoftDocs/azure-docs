---
title: Operationalize Data Pipelines
description: Learn about how to deliver service level agreements for data pipelines
ms.service: data-factory
ms.subservice: orchestration
author: chez-charlie
ms.author: chez
ms.reviewer: jburchel
ms.topic: tutorial
ms.date: 08/10/2023
---

# Deliver service level agreement for data pipelines

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Azure Data Factory is loved and trusted by corporations around the world. As Azure's native cloud ETL service for scale-out server-less data integration and data transformation, it's widely used to implement Data Pipelines to prepare, process, and load data into enterprise data warehouse or data lake.

Once data pipelines are published, either through [continuous integration and delivery (CI/CD)](continuous-integration-delivery.md) in Git mode or directly in live mode, they typically run on autopilot. They may run on a pre-defined timetable, with a [Schedule Trigger](how-to-create-schedule-trigger.md) or a [Tumbling Window Trigger](how-to-create-tumbling-window-trigger.md), or they may run in an event driven architecture, with a [Storage Event Trigger](how-to-create-event-trigger.md) or a [Custom Event Trigger](how-to-create-custom-event-trigger.md). They're entrusted with mission critical workloads, preparing data for business reports or data analytics and machine learning projects.

## Preemptive warnings for long-running jobs

There are two major challenges delivering service level agreements (SLAs) for these data pipelines:

* Compute environment for activities, for instance SQL for a Stored Procedure activity, may throttle, slowing down the whole data pipeline and jeopardizing pipeline SLA.
* Pipeline developers aren't always actively monitoring the factory, and proactively seeking out long running pipelines that will miss SLAs.

To address these issues, when configured properly, pipeline runs emit _Elapsed Time Pipeline Run_ metrics in cases of missing SLA. Combined with [Data Factory Alerts](monitor-metrics-alerts.md#data-factory-alerts), we empower data pipelines developers to better deliver SLAs to their customers: you tell us how long a pipeline should run, and we'll notify you, proactively, when the pipeline runs longer than expected.

For each pipeline you want to create alerts on, during authoring phase, go to pipeline settings, by clicking on the blank space in the pipeline canvas.

:::image type="content" source="media/tutorial-operationalize-pipelines/elapsed-time-1-set-up.png" alt-text="Screenshot showing how to specify expected run duration for a pipeline.":::

Under __Settings__ tab, check Elapsed time metric, and specify expected pipeline run duration, with format `D.HH:MM:SS`. We strongly recommend you to set it to your business SLA, the amount of time that the pipeline can take to meet your business needs. Once a pipeline duration exceeds this setting, Data Factory will log an _Elapsed Time Pipeline Run_ metric (metric ID: `PipelineElapsedTimeRuns`) in Azure Monitor. In other words, you'll get notified about long running pipelines _preemptively_, before the pipeline eventually finishes.

We understand some pipelines will naturally take more time to finish than others, since they have more steps, or move more data. There isn't any one-size-fit-all definition for long running pipelines. We kindly ask you to define the threshold for every pipeline that you need a SLA on. And when logging the metric for a particular pipeline, we'll compare to its user-defined setting for expected run duration.

> [!NOTE]
> This is a per pipeline opt in feature. No metric will ever be logged for a pipeline, if no expected run duration is specified for the aforementioned pipeline.

Follow the steps to set up [Data Factory Alerts](monitor-metrics-alerts.md#data-factory-alerts) on the metric. Your engineers will get notified to intervene and take steps to meet the SLAs, through emails or SMSs.

## Next steps

[Data Factory metrics and alerts](monitor-metrics-alerts.md)

[Monitor Visually](monitor-visually.md#alerts)
