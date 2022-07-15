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

This article describes out-of-memory (OOM) issues for Java applications in Azure Spring Apps. For container OOM

## OOM concepts

There are two different OOM concepts, which are described in the following sections: container OOM and JVM OOM.

### Container OOM

Container OOM, also called *system OOM*, means that the available app memory has run out. Container OOM will cause app restart events, which are reported in the **Resource Health** section of the Azure portal. Normally, container OOM is due to incorrect memory size configurations.

### JVM OOM

JVM OOM means that the amount of used memory has reached the maximum size set in JVM options.

JVM OOM won't cause app restart. Normally, JVM OOM is a result of bad code, which you can find by looking for `java.lang.OutOfMemoryError` exceptions in the application log. JVM OOM will make the application and the Java Profiling tools (such as Java Flight Recorder) unhealthy.

This article focuses on how to fix container OOM. To fix JVM OOM, check tools like heap dump, thread dump, and Java Flight Recorder. For more information, see [Capture heap dump and thread dump manually and use Java Flight Recorder in Azure Spring Apps](how-to-capture-dumps.md).

## Fix app restart issues due to OOM

The following sections describe the tools, metrics, and JVM options that will help you diagnose and fix container OOM issues.

### Alert in resource health

The **Resource health** page on the Azure portal shows app restart events due to container OOM, as shown in the following screenshot:

:::image type="content" source="media/how-to-fix-app-restart-issues-caused-by-out-of-memory/out-of-memory-alert-resource-health.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Resource Health page with OOM message highlighted." lightbox="media/how-to-fix-app-restart-issues-caused-by-out-of-memory/out-of-memory-alert-resource-health.png":::

### Fix container OOM

The metrics "App memory Usage", `jvm.memory.used`, and `jvm.memory.committed` provide a view of memory usage. For more information, see the [Metrics](tools-to-troubleshoot-memory-issues.md#metrics) section of [Tools to troubleshoot memory issues](tools-to-troubleshoot-memory-issues.md). More importantly, you need to configure the maximum memory sizes in the JVM options to ensure that memory is under the limit.

The sum of the maximum memory sizes of all the parts in the [Java memory model](concepts-for-java-memory-management.md#java-memory-model) should be less than the real available app memory. To set your maximum memory sizes, refer to the typical memory layout described in the [Memory usage layout](concepts-for-java-memory-management.md#memory-usage-layout) section.

When you set the maximum memory size too high, there will be a risk of container OOM. When you set the maximum memory size too low, there will be a risk of JVM OOM, and garbage collection will be frequent and will slow down the app. So you need to find a balance.

#### Control heap memory

You can set the maximum heap size by using `-Xms`, `-Xmx`, `-XX:InitialRAMPercentage`, and `-XX:MaxRAMPercentage` in the JVM options.

When the value of `jvm.memory.used` is too high in the metrics, you may need to adjust the maximum heap size settings. For more information, see the [jvm.memory.used](tools-to-troubleshoot-memory-issues.md#jvmmemoryusedcommittedmax) section of [Tools to troubleshoot memory issues](tools-to-troubleshoot-memory-issues.md).

#### Control direct memory

Direct memory may be used by frameworks like nio and gzip without noticing it. Also, direct memory is only garbage collected by full GC, while full GC occurs only when the heap is near full. For this reason, it's important to set `-XX:MaxDirectMemorySize` in the JVM options. Normally, you can set `MaxDirectMemorySize` to a value less than the app memory size minus the heap memory minus the non-heap memory.

#### Control metaspace

You can set the maximum metaspace size by using `-XX:MaxMetaspaceSize` in the JVM options. Another parameter, `-XX:MetaspaceSize`, is the threshold value to trigger full GC.

Usually, metaspace memory is stable.
