---
title: "How to manually capture heap dump, thread dump, and JFR in Azure Spring Cloud"
description: Learn how to manually capture a heap dump, a thread dump or start JFR.
author: YinglueZhang-MS
ms.author: yinglzh
ms.service: spring-cloud
ms.topic: how-to
ms.date: 10/31/2021
ms.custom: devx-track-java
---

# How to manually capture heap dump, thread dump, and JFR in Azure Spring Cloud

**This article applies to:** ✔️ Java ❌ C#

Effective troubleshooting, which is critical for our customers to timely fix issues on their production environment, ensures their business always online. Today in Azure Spring Cloud, we have already provided application log streaming/query, rich metrics emitting, and alerts, distributed tracing, etc. to assist our customers in this field. However, when customers getting alerts about request of high latency, JVM heap leak, or high CPU usage, there is no the last-mile solution for them. Therefore, we enabled manually generate a heap dump, generate a thread dump, or start a JFR.

## Prerequisites
To complete this exercise, you need:

* A deployed Azure Spring Cloud service instance. Follow our [quickstart on deploying an app via the Azure CLI](./quickstart.md) to get started.
* At least one application already created in your service instance.
* At least one [persistent storage already bind on your app](how-to-built-in-persistent-storage.md) to save generated diagnostic files.

**If customers want to use path under mount path, please ensure that the sub-path have already been created.**

## Generate a heap dump
Generate a heap dump of our app in Azure Spring Cloud.
```heap dump command
   az spring-cloud app deployment generate-heap-dump -g <resource-group-name> -s <service-instance-name> --app <app-name> --deployment <deployment-name> --app-instance <app-instance name> --file-path <your-target-file-path-in-your-persistent-storage-mount-path>
```

## Generate a thread dump
Generate a thread dump of our app in Azure Spring Cloud.
```thread dump command
   az spring-cloud app deployment generate-thread-dump -g <resource-group-name> -s <service-instance-name> --app <app-name> --deployment <deployment-name> --app-instance <app-instance name> --file-path <your-target-file-path-in-your-persistent-storage-mount-path>
```

## Start JFR
Start a JFR of our app in Azure Spring Cloud.
```JFR command
   az spring-cloud app deployment start-JFR -g <resource-group-name> -s <service-instance-name> --app <app-name> --deployment <deployment-name> --app-instance <app-instance name> --file-path <your-target-file-path-in-your-persistent-storage-mount-path> --duration <duration-of-JFR>
```
The default value of duration is 60s.
## Get your diagnostic files
Go to the target file path in your persistent storage and find your dump/JFR. You can download them to your local machine. The name of the generated file will be like '{appInstance}\_heapdump\_{timeStamp}.hprof' for heap dump, '{appInstance}\_threaddump\_{timeStamp}.txt' for thread dump, and '{appInstance}\_JFR\_{timeStamp}.jfr' for JFR.
