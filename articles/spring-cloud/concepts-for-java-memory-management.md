---
title: Java memory management
titleSuffix: Azure Spring Apps
description: Introduces concepts for Java memory management to help you understand Java applications in Azure Spring Apps.
author: karlerickson
ms.author: kaiqianyang
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 07/15/2022
ms.custom: devx-track-java
---

# Java memory management

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article describes various concepts related to Java memory management to help you understand the behavior of Java applications hosted in Azure Spring Apps.

## Java memory model

A Java application's memory has several parts, and there are different ways to divide the parts. This article discusses Java memory as divided into heap memory, non-heap memory, and direct memory.

### Heap memory

Heap memory stores all class instances and arrays. Each Java virtual machine (JVM) has only one heap area, which is shared among threads.

Spring-boot actuator can observe the value of heap memory, it takes heap value as part of [jvm.memory.used/committed/max](tools-to-troubleshoot-memory-issues.md#jvmmemoryusedcommittedmax).

Heap memory is divided into young generation and old generation.

- Young Generation: all new objects are allocated and aged in young generation.

  - Eden Space: new objects are allocated in Eden Space.
  - Survivor Space: objects will be moved from Eden to Survivor Space after surviving one garbage collection cycle. Survivor Space can be divided to two parts, s1 and s2.

- Old Generation: also called Tenured Space. Objects that have remained in the survivor spaces for a long time will be moved to Old Generation.

Before Java 8, another section called permanent generation was also part of heap. It was majorly replaced by metaspace in non-heap memory, starting from Java 8.

### Non-heap memory

Here we divide non-heap memory into two parts:

1. The part that replaced permanent generation(permGen) starting from Java 8. Spring-boot actuator observes this section and takes it as part of [jvm.memory.used/committed/max](tools-to-troubleshoot-memory-issues.md#jvmmemoryusedcommittedmax). In other words, [jvm.memory.used/committed/max](tools-to-troubleshoot-memory-issues.md#jvmmemoryusedcommittedmax) is the sum of heap memory and the former permGen part of non-heap memory.

1. The part of other memory such as thread stack, which isn't observed by spring-boot actuator.

   - Former permanent generation

     - Metaspace : which stores the class definitions loaded by class loaders
     - Compressed Class Space: which is for compressed class pointers
     - Code Cache: which stores native code compiled by JIT

   - Other memory: other memory such as thread stack.

### Direct memory

Direct memory is native memory allocated by `java.nio.DirectByteBuffer`, which is used in third party libraries like nio and gzip.

Spring-boot actuator doesn't observe the value of direct memory.

In conclusion, Java memory model is like following layout.

:::image type="content" source="media/concepts-for-java-memory-management/java-memory-model.png" alt-text="Diagram of Java memory model." border="false":::

## Java garbage collection

There are 3 terms regarding of Java Garbage Collection: "Minor GC", "Major GC", "Full GC". These terms are not clearly defined in the JVM specification. Here we consider "Major GC" and "Full GC" equivalent.

- Minor GC

  Minor GC performs when Eden space is full. It removes all dead objects in Young Generation and moves live objects to from Eden Space to s1 of Survivor Space, or from s1 to s2.

- Full GC/Major GC

  Full GC does garbage collection in the entire Heap. Parts like metaspace and direct memory can also be collected by Full GC, and they can only be cleaned by Full GC.

Max heap size influences the frequency of minor GC and full GC. Max metaspace and max direct memory size influence full GC.

When max heap size is set lower, garbage collections perform more frequent, which slow the app a little but better limit the memory usage. When max heap size is set higher, garbage collections perform less, which may have more [OOM risk](how-to-fix-app-restart-issues-caused-by-out-of-memory.md#oom-concepts).

Metaspace and direct memory can only be collected by full GC, when metaspace or direct memory is full, full GC will perform.

## Java memory configurations

### Java containerization

Applications in Azure Spring Apps run in container environments. For more information, see [Containerize your Java applications](/azure/developer/java/containers/overview?toc=/azure/spring-cloud/toc.json&bc=/azure/spring-cloud/breadcrumb/toc.json).

### Important JVM options

Max size of each part of memory can be configured in JVM options. It can be set through Azure CLI or on portal (refer to [the doc for configuring memory settings in JVM options](tools-to-troubleshoot-memory-issues.md#configure-memory-settings-in-jvm-options))

- Heap size configuration

  - `-Xms` sets initial heap size by absolute value.
  - `-Xmx` sets maximum heap size by absolute value.
  - `-XX:InitialRAMPercentage` sets initial heap size by the percentage of heap size / app memory size.
  - `-XX:MaxRAMPercentage` sets the maximum heap size by the percentage of heap size / app memory size.

- Direct memory size configuration

  - `-XX:MaxDirectMemorySize` sets the maximum direct memory size by absolute value. For more information, see [MaxDirectMemorySize](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE__GUID-2E02B495-5C36-4C93-8597-0020EFDC9A9C) in the Oracle documentation.

- Metaspace size configuration

  - `-XX:MaxMetaspaceSize` sets the maximum metaspace size by absolute value.

### Default max memory size

#### Default max heap size

Azure Spring Apps sets the default max heap memory size to about 50%-80% of app memory for Java apps. Specifically, Azure Spring Apps uses the following settings:

- If the app memory < 1 GB, the default max heap size will be 50% of app memory.
- If 1 GB <= the app memory < 2 GB, the default max heap size will be 60% of app memory.
- If 2 GB <= the app memory < 3 GB, the default max heap size will be 70% of app memory.
- If 3 GB <= the app memory, the default max heap size will be 80% of app memory.

#### Default max direct memory size

When the max direct memory size isn't set in the JVM options, the JVM automatically sets the max direct memory size = [`Runtime.getRuntime.maxMemory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/Runtime.html#maxMemory--) ~= max heap memory size (refer to [jdk8](http://hg.openjdk.java.net/jdk8u/jdk8u/jdk/file/a71d26266469/src/share/classes/sun/misc/VM.java#l282&gt;%20jdk8)).

### Memory usage layout

Heap size is influenced by your throughput. Basically, when configuring, you can keep the default max heap size, which leaves reasonable memory for other parts.

The metaspace size depends on the complexity of your code, such as the number of classes.

Direct memory size depends on your use of third party libraries like nio, gzip, and also depend on your throughput.

Here's a typical memory layout sample for 2 GB apps. Numbers in grey are reference values of daily memory usage. You can refer to this to configure your memory size settings.

:::image type="content" source="media/concepts-for-java-memory-management/2-gb-sample.png" alt-text="Diagram of typical memory layout for 2 G B apps." border="false":::

Overall, when configuring max memory sizes, you should consider the usage of each part in memory, and the sum of all max sizes shouldn't exceed total available memory.

## Java OOM

OOM means the application is out of memory. There are two different concepts: container OOM and JVM OOM. For more information, see [How to fix app restart issues caused by out of memory issues](./how-to-fix-app-restart-issues-caused-by-out-of-memory.md).
