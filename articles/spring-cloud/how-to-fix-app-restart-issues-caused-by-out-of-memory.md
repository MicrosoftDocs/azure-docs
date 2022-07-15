---
title: App restart issues caused by out-of-memory issues
titleSuffix: Azure Spring Apps
description: Explains how to understand out-of-memory (OOM) issues for Java applications in Azure Spring Apps.
author: karlerickson
ms.author: kaiqianyang
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 07/15/2022
ms.custom: devx-track-java
---

# App restart issues caused by out-of-memory issues

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This articles describes out-of-memory (OOM) issues for Java applications in Azure Spring Apps.

## OOM concepts

There are two different OOM concepts, which are described in the following sections: container OOM and JVM OOM.

### Container OOM

Container OOM, also called *system OOM*, means that the available app memory has run out. Container OOM will cause app restart events, which are reported in the **Resource Health** section of the Azure portal. Normally, container OOM it is due to incorrect memory size configurations.

### JVM OOM

JVM OOM means that the amount of used memory has reached the maximum size set in JVM options.

JVM OOM will not cause app restart. Normally, JVM OOM is a result of bad code, which you can find by looking for `java.lang.OutOfMemoryError` exceptions in the application log. JVM OOM will make the application and the Java Profiling tools (such as Java Flight Recorder) unhealthy.

This article focuses on how to fix container OOM. To fix JVM OOM, check tools like heap dump, thread dump, and Java Flight Recorder. For more information, see [Capture heap dump and thread dump manually and use Java Flight Recorder in Azure Spring Apps](how-to-capture-dumps.md).

## Fix app restart issues due to OOM

### Alert in resource health

The **Resource health** page on the Azure portal shows app restart events due to container OOM, as shown in the following screenshot:

:::image type="content" source="media/how-to-fix-app-restart-issues-caused-by-out-of-memory/out-of-memory-alert-resource-health.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Resource Health page with OOM message highlighted." lightbox="media/how-to-fix-app-restart-issues-caused-by-out-of-memory/out-of-memory-alert-resource-health.png":::

### How to fix container OOM

The metrics "App memory Usage", `jvm.memory.used`, and `jvm.memory.committed` provide a view of memory usage. For more information see the [Metrics](tools-to-troubleshoot-memory-issues.md#metrics) section of [Tools to troubleshoot memory issues](tools-to-troubleshoot-memory-issues.md). More important, you need to configure maximum memory sizes in JVM options to control memory under limit.

The sum of maximum memory sizes of [all parts in Java memory model](concepts-for-java-memory-management.md#java-memory-model), should be less than real available app memory. You can refer to [typical memory layout](concepts-for-java-memory-management.md#memory-usage-layout) to set your maximum memory sizes.

When you set the maximum memory size too high, there will be risk of container OOM. When you set the maximum memory size too low, there will be risk of JVM OOM, and garbage collection will be frequent and will slow the app. So you need to find a balance.

#### Control heap memory

You can set the maximum heap size by using `-Xms`, `-Xmx`, `-XX:InitialRAMPercentage`, and `-XX:MaxRAMPercentage` in the JVM options.

When the value of `jvm.memory.used` is too high in the metrics, you may need to adjust the maximum heap size settings. For more information, see the [jvm.memory.used](tools-to-troubleshoot-memory-issues.md#jvmmemoryusedcommittedmax) section of [Tools to troubleshoot memory issues](tools-to-troubleshoot-memory-issues.md).

#### Control direct memory

Direct memory may be used by frameworks like nio, gzip without noticing it. And direct memory is only garbage collected by full GC, while full GC performs only when the heap is near full.

So it's important to set `-XX:MaxDirectMemorySize` in the JVM options. Normally, you can set `MaxDirectMemorySize` < (app memory size)-(heap memory)-(non-heap memory).

#### Control metaspace

You can set the maximum metaspace size by using `-XX:MaxMetaspaceSize` in the JVM options. Another parameter `-XX:MetaspaceSize` is the threshold value to trigger full GC.

Usually, metaspace memory is stable.
