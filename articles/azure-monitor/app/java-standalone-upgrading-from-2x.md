---
title: Upgrading from 2.x - Azure Monitor Application Insights Java
description: Upgrading from Azure Monitor Application Insights Java 2.x
ms.topic: conceptual
ms.date: 11/04/2020

---

# Upgrading from Application Insights Java SDK 2.x

If you're already using Application Insights Java SDK 2.x in your application, there is no need to remove it.
The Java 3.0 agent will detect it, and capture and correlate any custom telemetry you're sending via the Java SDK 2.x,
while suppressing any auto-collection performed by the Java SDK 2.x to prevent duplicate telemetry.

If you were using Application Insights 2.x agent, you need to remove the `-javaagent:` JVM arg
that was pointing to the 2.x agent.

> [!NOTE]
> Note: Java SDK 2.x TelemetryInitializers and TelemetryProcessors will not be run when using the 3.0 agent.
> Many of the use cases that previously required these can be solved in 3.0
> by configuring [custom dimensions](./java-standalone-config.md#custom-dimensions)
> or configuring [telemetry processors](./java-standalone-telemetry-processors.md).

> [!NOTE]
> Note: 3.0 does not support multiple instrumentation keys in a single JVM yet.
