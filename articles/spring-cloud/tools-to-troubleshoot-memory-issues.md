---
title: Tools to troubleshoot memory issues
titleSuffix: Azure Spring Apps
description: Provides a list of tools for troubleshooting Java memory issues.
author: karlerickson
ms.author: kaiqianyang
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 07/15/2022
ms.custom: devx-track-java
---

# Tools to troubleshoot memory issues

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article describes various tools that are useful for troubleshooting Java memory issues. You can use these tools in many scenarios not limited to memory issues, but this article focuses only on the topic of memory.

## Alert and diagnose

### Resource health

For more information, see [Monitor app lifecycle events using Azure Activity log and Azure Service Health](monitor-app-lifecycle-events.md).

Resource health sends alerts about app restart events due to [container OOM](how-to-fix-app-restart-issues-caused-by-out-of-memory.md#how-to-fix-app-restart-issues-due-to-oom).

For more information, see [How to fix app restart issues caused by out of memory issues](how-to-fix-app-restart-issues-caused-by-out-of-memory.md).

:::image type="content" source="media/tools-to-troubleshoot-memory-issues/out-of-memory-alert-resource-health.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Resource Health page with OOM message highlighted." lightbox="media/tools-to-troubleshoot-memory-issues/out-of-memory-alert-resource-health.png":::

### Diagnose and solve problems

For more information, see [Self-diagnose and solve problems in Azure Spring Apps](how-to-self-diagnose-solve.md).

Under "Diagnose and solve problems", you can find "Memory Usage" detector. It shows a simple diagnosis for app memory usage.

:::image type="content" source="media/tools-to-troubleshoot-memory-issues/diagnose-solve-problem-location.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Diagnose and solve problems page with Memory Usage highlighted in drop-down menu." lightbox="media/tools-to-troubleshoot-memory-issues/diagnose-solve-problem-location.png":::

:::image type="content" source="media/tools-to-troubleshoot-memory-issues/diagnose-solve-problem-example.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Memory Usage page." lightbox="media/tools-to-troubleshoot-memory-issues/diagnose-solve-problem-example.png":::

### Metrics

For more information, see [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](quickstart-logs-metrics-tracing.md?tabs=Azure-CLI&pivots=programming-language-java).

Metrics cover issues including high memory usage, heap memory too large and garbage collection abnormal(too frequent or too not frequent), through the following metrics.

#### App Memory Usage

App Memory Usage is a percentage = app memory used / app memory limit. It shows the whole app memory.

#### jvm.memory.used/committed/max

On JVM memory, there are three metrics: `jvm.memory.used`, `jvm.memory.committed`, `jvm.memory.max`.

"JVM memory" isn't a clearly defined concept. Here "jvm.memory" is the sum of [heap memory](concepts-for-java-memory-management.md#heap-memory), [former permGen](concepts-for-java-memory-management.md#non-heap-memory). It doesn't include direct memory or other memory like thread stack. These three metrics are gathered by spring-boot actuator, and the scope of jvm.memory is also determined by spring-boot actuator.

- `jvm.memory.used`

  The amount of used JVM memory, including used heap memory and used former permGen in non-heap memory.

  jvm.memory.used majorly reflects the change of heap memory, because the former permGen part is usually stable.

  If you find jvm.memory.used too large, consider to set a smaller max heap memory size.

- `jvm.memory.committed`

  The amount of memory committed for the JVM to use. The size of jvm.memory.committed is basically the limit of usable JVM memory.

- `jvm.memory.max`

  The maximum amount of JVM memory, not to be confused with the real available amount.

  The value of `jvm.memory.max` can sometimes be confusing because it can be much higher than the available app memory. To clarify, `jvm.memory.max` is the sum of all maximum sizes of heap memory and [former permGen](concepts-for-java-memory-management.md#non-heap-memory), regardless of the real available memory. For example, if an app is set with 1 GB memory in the Azure Spring Apps portal, then the default heap memory size will be 0.5 GB

(refer to [the doc for default heap size](concepts-for-java-memory-management.md#default-max-heap-size)), the default Compressed Class Space size is 1 GB (refer to [an oracle doc](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2F9%2Fgctuning%2Fother-considerations.htm%23JSGCT-GUID-B29C9153-3530-4C15-9154-E74F44E3DAD9&data=04%7C01%7Ckaiqianyang%40microsoft.com%7C38fc180b69244f235bc808d9d5957de2%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637775660327124610%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&sdata=qRyPF%2BviieEO0lVtOKUoIPy5Ejx7hgM5RMQGaDEVm7A%3D&reserved=0)), then the value of jvm.memory.max will be larger than 1.5 GB regardless of the app memory size 1 GB.

#### jvm.gc.memory.allocated/promoted

These two metrics are for observing [Java garbage collection](concepts-for-java-memory-management.md#java-garbage-collection). Max heap size influences the frequency of minor GC and full GC. Max metaspace and max direct memory size influence full GC. If you want to adjust the frequency of garbage collection, consider to modify max memory sizes.

- `jvm.gc.memory.allocated`

  The amount of increase in the size of the young generation memory pool after one GC to before the next. It reflects minor GC.

- `jvm.gc.memory.promoted`

  The amount of increase in the size of the old generation memory pool before GC to after GC.
It reflects full GC

This feature can be found on the Azure portal. You can choose specific metrics and add filters for a specific app, deployment, or instance. You can also apply splitting.

:::image type="content" source="media/tools-to-troubleshoot-memory-issues/metrics-example.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Metrics page." lightbox="media/tools-to-troubleshoot-memory-issues/metrics-example.png":::

## Further debug

### Capture heap dump and thread dump manually and use Java Flight Recorder

For more information, see [Capture heap dump and thread dump manually and use Java Flight Recorder in Azure Spring Apps](how-to-capture-dumps.md).

This feature provides further details on heap and threads, to help debug.

Heap dump records the state of the Java heap memory. Thread dump records the stacks of all live threads. Using third party tools like [Memory Analyzer](https://www.eclipse.org/mat/) to analyze heap dumps can get useful information. It is both available on azure CLI and on the app page of portal:

:::image type="content" source="media/tools-to-troubleshoot-memory-issues/capture-dump-location.png" alt-text="Screenshot of Azure portal showing app overview page with Troubleshooting button highlighted." lightbox="media/tools-to-troubleshoot-memory-issues/capture-dump-location.png":::

## Modify configurations and fix problem

### Configure memory settings in JVM options

If you identify issues including [container OOM](how-to-fix-app-restart-issues-caused-by-out-of-memory.md#how-to-fix-app-restart-issues-due-to-oom), heap memory too large, garbage collection abnormal, you may need to configure max memory size in JVM options.

For more information, see [related JVM Options](concepts-for-java-memory-management.md#important-jvm-options).

This feature is available on Azure CLI and on portal.

:::image type="content" source="media/tools-to-troubleshoot-memory-issues/maxdirectmemorysize-location.png" alt-text="Screenshot of Azure portal showing app configuration page with JVM options highlighted." lightbox="media/tools-to-troubleshoot-memory-issues/maxdirectmemorysize-location.png":::
