---
title: Capture heap dump and thread dump manually and use Java Flight Recorder in Azure Spring Apps
description: Learn how to manually capture a heap dump, a thread dump, or start Java Flight Recorder.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 01/21/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022
---

# Capture heap dump and thread dump manually and use Java Flight Recorder in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to manually generate a heap dump or thread dump, and how to start Java Flight Recorder (JFR).

Effective troubleshooting is critical to ensure you can fix issues in production environments and keep your business online. Azure Spring Apps provides application log streaming and query, rich metrics emitting, alerts, distributed tracing, and so forth. However, when you get alerts about requests with high latency, JVM heap leak, or high CPU usage, there's no last-mile solution. For this reason, we've enabled you to manually generate a heap dump, generate a thread dump, and start JFR.

## Prerequisites

* A deployed Azure Spring Apps service instance. To get started, see [Quickstart: Deploy your first application to Azure Spring Apps](quickstart.md).
* At least one application already created in your service instance.
* Your own persistent storage as described in [How to enable your own persistent storage in Azure Spring Apps](how-to-custom-persistent-storage.md). This storage is used to save generated diagnostic files. The paths you provide in the parameter values below should be under the mount path of the persistent storage bound to your app. If you want to use a path under the mount path, be sure to create the subpath beforehand.

## Generate a heap dump

Use the following command to generate a heap dump of your app in Azure Spring Apps.

```azurecli
az spring app deployment generate-heap-dump \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --app <app-name> \
    --deployment <deployment-name> \
    --app-instance <app-instance name> \
    --file-path <your-target-file-path-in-your-persistent-storage-mount-path>
```

## Generate a thread dump

Use the following command to generate a thread dump of your app in Azure Spring Apps.

```azurecli
az spring app deployment generate-thread-dump \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --app <app-name> \
    --deployment <deployment-name> \
    --app-instance <app-instance name> \
    --file-path <your-target-file-path-in-your-persistent-storage-mount-path>
```

## Start JFR

Use the following command to start JFR for your app in Azure Spring Apps.

```azurecli
az spring app deployment start-jfr \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --app <app-name> \
    --deployment <deployment-name> \
    --app-instance <app-instance name> \
    --file-path <your-target-file-path-in-your-persistent-storage-mount-path> \
    --duration <duration-of-JFR>
```

The default value for `duration` is 60 seconds.

## Generate a dump using the Azure portal

Use the following steps to generate a heap or thread dump of your app in Azure Spring Apps.

1. In the Azure portal, navigate to your target app, then select **Troubleshooting**.

   :::image type="content" source="media/how-to-capture-dumps/app-troubleshooting.png" alt-text="Screenshot of the Azure portal showing the app Overview page with the Troubleshooting button highlighted." lightbox="media/how-to-capture-dumps/app-troubleshooting.png":::

1. In the **Troubleshooting** pane, select the app instance and the type of dump you'd like to collect.

   :::image type="content" source="media/how-to-capture-dumps/heap-dump.png" alt-text="Screenshot of the Azure portal Troubleshooting pane." lightbox="media/how-to-capture-dumps/heap-dump.png":::

1. In the **File path** field, specify the mount path of your persistent storage.
1. Select **Collect**.

## Get your diagnostic files

Navigate to the target file path in your persistent storage and find your dump/JFR. From there, you can download them to your local machine. The name of the generated file will be similar to *`<app-instance>_heapdump_<time-stamp>.hprof`* for the heap dump, *`<app-instance>_threaddump_<time-stamp>.txt`* for the thread dump, and *`<app-instance>_JFR_<time-stamp>.jfr`* for the JFR file.

## Next steps

* [Use the diagnostic settings of JVM options for advanced troubleshooting in Azure Spring Apps](how-to-dump-jvm-options.md)
