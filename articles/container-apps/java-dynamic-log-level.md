---
title: Use dynamic logger level settings for troubleshooting Java applications in Azure Container Apps (preview)
description: Learn how to leverage dynamic logger level settings to debug your Java applications running on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/13/2024
ms.author: cshoe
---

# Use dynamic logger level settings for troubleshooting Java applications in Azure Container Apps (preview)

Azure Container Apps platform offers a built-in diagnostics tool exclusively for Java developers to help them debug and troubleshoot their Java applications running on Azure Container Apps more easily and effeiciently. One of the key functionalities provided is dynamic logger level change, which allows developers to get more hidden information from app logs without modifying code and restarting apps.

## Enable JVM diagnostics for your Java applications

Before using the Java diagnostics tool, you need to enable JVM diagnostics for your Azure Container Apps first. This step will unblock Java diagnostics functionalities by injecting an advanced diagnostics agent into your app and may restart it.

Create a new Azure Container Apps with JVM diagnostics enabled:

```azurecli
// TODO: replace this
az containerapp java diagnostics enable --enable-java-agent \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

Update an existing Azure Container Apps to enable JVM diagnostics:

```azurecli
// TODO: replace this
az containerapp create --enable-java-agent \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

## Change runtime logger levels

After enabling JVM diagnostics, you can change runtime logger levels without interruptting your running apps now.

```azurecli
// TODO: replace this
az containerapp env java-component list \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP>
```

It may take up to 2 minutes for the logger level change to take effect. You can then check out your app logs from [Log streaming](log-streaming.md) or other [Log options](log-options.md).

## Supported Java logging frameworks

Currently most of those popular Java logging frameworks are supported: [Log4j](https://logging.apache.org/log4j/2.x/), [SLF4J](https://slf4j.org/), [jboss-logging](https://github.com/jboss-logging/jboss-logging).

### Visibility of Log4j Log Levels

| Log Level | FATAL | ERROR | WARN | INFO | DEBUG | TRACE |
|-----------|-------|-------|------|------|-------|-------|
| **OFF**   |       |       |      |      |       |       |
| **FATAL** | Y     |       |      |      |       |       |
| **ERROR** | Y     | Y     |      |      |       |       |
| **WARN**  | Y     | Y     | Y    |      |       |       |
| **INFO**  | Y     | Y     | Y    | Y    |       |       |
| **DEBUG** | Y     | Y     | Y    | Y    | Y     |       |
| **TRACE** | Y     | Y     | Y    | Y    | Y     | Y     |

### Visibility of SLF4J Log Levels

| Log Level | ERROR | WARN | INFO | DEBUG | TRACE |
|-----------|-------|------|------|-------|-------|
| **OFF**   |       |      |      |       |       |
| **ERROR** | Y     |      |      |       |       |
| **WARN**  | Y     | Y    |      |       |       |
| **INFO**  | Y     | Y    | Y    |       |       |
| **DEBUG** | Y     | Y    | Y    | Y     |       |
| **TRACE** | Y     | Y    | Y    | Y     | Y     |

### Visibility of jboss-logging Log Levels

| Log Level | FATAL | ERROR | WARN | INFO | DEBUG |
|-----------|-------|------|------|-------|-------|
| **OFF**   |       |      |      |       |       |
| **FATAL** | Y     |      |      |       |       |
| **ERROR** | Y     | Y    |      |       |       |
| **WARN**  | Y     | Y    | Y    |       |       |
| **INFO**  | Y     | Y    | Y    | Y     |       |
| **DEBUG** | Y     | Y    | Y    | Y     | Y     |
