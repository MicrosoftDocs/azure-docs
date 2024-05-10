---
title: Set dynamic logger level to troubleshoot Java applications in Azure Container Apps (preview)
description: Learn how to use dynamic logger level settings to debug your Java applications running on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 05/10/2024
ms.author: cshoe
---

# Set dynamic logger level to troubleshoot Java applications in Azure Container Apps (preview)

Azure Container Apps platform offers a built-in diagnostics tool exclusively for Java developers to help them debug and troubleshoot their Java applications running on Azure Container Apps more easily and efficiently. One of the key features is a dynamic logger level change, which allows you to access log details that are hidden by default. When enabled, this log information is collected without requiring you to modify your code.

## Enable JVM diagnostics for your Java applications

Before using the Java diagnostics tool, you need to first enable Java Virtual Machine (JVM) diagnostics for your Azure Container Apps. This step enables Java diagnostics functionality by injecting an advanced diagnostics agent into your app. Your app might restart during this process.

To take advantage of these diagnostic tools, you can create a new container app with them enabled, or update an existing container app.

To create a new container app with JVM diagnostics enabled, use the following command:

```azurecli
// TODO: replace this
az containerapp java diagnostics enable --enable-java-agent \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

To update an existing container app, use the following command:

```azurecli
// TODO: replace this
az containerapp create --enable-java-agent \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <JAVA_COMPONENT_NAME>
```

## Change runtime logger levels

After enabling JVM diagnostics, you can change runtime logger levels without interrupting your running apps.

Use the following command to adjust the logger levels in your Java application.

```azurecli
// TODO: replace this
az containerapp env java-component list \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP>
```

It could take up to two minutes for the logger level change to take effect. Once complete, you can check the application logs from [log streams](log-streaming.md) or other [log options](log-options.md).

## Supported Java logging frameworks

The following Java logging frameworks are supported:

- [Log4j2](https://logging.apache.org/log4j/2.x/) (only version 2.*)
- [SLF4J](https://slf4j.org/)
- [jboss-logging](https://github.com/jboss-logging/jboss-logging)

### Supported log levels by different logging frameworks

Different logging frameworks support different log levels. In the JVM diagnostics platform, some frameworks are better supported than others. Before changing logging levels, make sure the log levels you're using are supported by both the framework and platform.

| Framework     | Off   | Fatal | Error | Warn | Info | Debug | Trace | All |
|---------------|-------|-------|-------|------|------|-------|-------|-----|
| Log4j2        | Yes   | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | Yes |
| SLF4J         | Yes   | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | Yes |
| jboss-logging | No    | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | No  |
| **Platform**  | Yes   | No    | Yes   | Yes  | Yes  | Yes   | Yes   | No  |

### General visibility of log levels

| Log Level | Fatal | Error | Warn | Info | Debug | Trace | All |
|-----------|-------|-------|------|------|-------|-------|-----|
| **OFF**   |       |       |      |      |       |       |     |
| **FATAL** | Yes   |       |      |      |       |       |     |
| **ERROR** | Yes   | Yes   |      |      |       |       |     |
| **WARN**  | Yes   | Yes   | Yes  |      |       |       |     |
| **INFO**  | Yes   | Yes   | Yes  | Yes  |       |       |     |
| **DEBUG** | Yes   | Yes   | Yes  | Yes  | Yes   |       |     |
| **TRACE** | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   |     |
| **ALL**   | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | Yes |

## Related content

> [!div class="nextstepaction"]
> [Log steaming](./log-streaming.md)
