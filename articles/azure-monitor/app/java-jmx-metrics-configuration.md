---
title: How to configure JMX metrics - Azure Monitor application insights for Java
description: Configure extra JMX metrics collection for Azure Monitor Application Insights Java agent
ms.topic: conceptual
ms.date: 05/13/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
ms.reviewer: mmcc
---

# Configuring JMX metrics

Application Insights Java 3.x collects some of the JMX metrics by default, but in many cases it isn't enough. This document describes the JMX configuration option in details.

## How do I collect extra JMX metrics?

JMX metrics collection can be configured by adding a ```"jmxMetrics"``` section to the applicationinsights.json file. You can specify the name of the metric the way you want it to appear in Azure portal in application insights resource. Object name and attribute are required for each of the metrics you want collected.

## How do I know what metrics are available to configure?

You nailed it - you must know the object names and the attributes, those properties are different for various libraries, frameworks, and application servers, and are often not well documented. Luckily, it's easy to find exactly what JMX metrics are supported for your particular environment.

To view the available metrics, set the self-diagnostics level to `DEBUG` in your `applicationinsights.json` configuration file, for example:

```json
{
  "selfDiagnostics": {
    "level": "DEBUG"
  }
}
```

Available JMX metrics, with object names and attribute names, appear in your Application Insights log file.

Log file output looks similar to these examples. In some cases, it can be extensive.

> :::image type="content" source="media/java-ipa/jmx/available-mbeans.png" lightbox="media/java-ipa/jmx/available-mbeans.png" alt-text="Screenshot of available JMX metrics in the log file.":::


## Configuration example

Knowing what metrics are available, you can configure the agent to collect them. The first one is an example of a nested metric - `LastGcInfo` that has several properties, and we want to capture the `GcThreadCount`.

```json
"jmxMetrics": [
      {
        "name": "Demo - GC Thread Count",
        "objectName": "java.lang:type=GarbageCollector,name=PS MarkSweep",
        "attribute": "LastGcInfo.GcThreadCount"
      },
      {
        "name": "Demo - GC Collection Count",
        "objectName": "java.lang:type=GarbageCollector,name=PS MarkSweep",
        "attribute": "CollectionCount"
      },
      {
        "name": "Demo - Thread Count",
        "objectName": "java.lang:type=Threading",
        "attribute": "ThreadCount"
      }
],
```

## Where do I find the JMX Metrics in application insights?

You can view the JMX metrics collected while your application is running by navigating to your application insights resource in the Azure portal. Under Metrics tab, select the dropdown as shown to view the metrics.

> :::image type="content" source="media/java-ipa/jmx/jmx-portal.png" lightbox="media/java-ipa/jmx/jmx-portal.png" alt-text="Screenshot of metrics in portal":::
