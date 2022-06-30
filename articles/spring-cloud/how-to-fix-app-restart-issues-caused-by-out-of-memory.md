---
title: How to fix app restart issues caused by out-of-memory issues
titleSuffix: Azure Spring Apps
description: Explains how to understand out of memory (OOM) issues for Java applications in Azure Spring Apps.
author: karlerickson
ms.author: kaiqianyang
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 06/28/2022
ms.custom: devx-track-java
---

# How to fix app restart issues caused by out of memory issues

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This doc helps understand out of memory (OOM) issues for Java applications in Azure Spring Apps.

## OOM Concepts

OOM is shortened from out of memory. There are two different OOM concepts: 1. container OOM, 2. JVM OOM.

### 1. Container OOM

Container OOM is also called "system OOM". It means available app memory runs out. This will cause app restart events which are reported in Resource Health. Normally it is due to wrong memory size configurations.

### 2. JVM OOM

JVM OOM means the amount of used memory reaches the max size set in JVM options.

This will not cause app restart. Normally it is from bad code, and it can be found from "java.lang.OutOfMemoryError" exception in application log. It will make the application unhealthy
and the Java Profiling tools(such as Java Flight Recorder).

:::image type="content" source="media/how-to-fix-app-restart-issues-caused-by-out-of-memory/heap-out-exception.png" alt-text="memory 3":::

This doc focuses on how to fix container OOM. To fix JVM OOM, check tools like heap dump, thread dump, and Java Flight Recorder. For more information, see [Capture heap dump and thread dump manually and use Java Flight Recorder in Azure Spring Apps](/azure/spring-cloud/how-to-capture-dumps).

## How to fix app restart issues due to OOM

### 1. Alert in resource health

Resource health shows app restart events due to container OOM.

:::image type="content" source="media/how-to-fix-app-restart-issues-caused-by-out-of-memory/out-of-memory-alert-resource-health.png" alt-text="memory 5":::

### 2. How to fix container OOM

Metrics "App memory Usage", "jvm.memory.used", "jvm.memory.committed" can provide a view of memory using situation [refer to the doc](tools-to-troubleshoot-memory-issues.md#2metrics-related-doc). More important, you need to configure max memory sizes in JVM options to control memory under limit.

The sum of max memory sizes of [all parts in java memory model](concepts-for-java-memory-management.md#java-memory-model), should be less than real available app memory. You can refer to [typical memory layout](concepts-for-java-memory-management.md#3-memory-usage-layout) to set your max memory sizes.

When max memory size is set too high, there will be risk of container OOM. When max memory size is set too low, there will be risk of JVM OOM, and garbage collection will be frequent and slow the app. So a balance need to be found.

#### (1) Control heap memory

Max heap size is set by "-Xms" "-Xmx" "-XX:InitialRAMPercentage" "-XX:MaxRAMPercentage" in JVM options.

When the value of [jvm.memory.used](tools-to-troubleshoot-memory-issues.md#2-jvmmemoryusedcommittedmax) is too high in metrics, there may be a need to adjust max heap size settings.

#### (2) Control direct memory

Direct memory may be used by frameworks like nio, gzip without noticing it. And direct memory is only garbage collected by Full GC, while Full GC performs only when the heap is near full.

So it is important to set "-XX:MaxDirectMemorySize" in JVM options. Normally you can set MaxDirectMemorySize < (app memory size)-(heap memory)-(non-heap memory).

#### (3) Control metaspace

Max metaspace size is set by "-XX:MaxMetaspaceSize" in JVM options. Another parameter "-XX:MetaspaceSize" is the threshold value to trigger full GC.

Usually, metaspace memory is stable.
