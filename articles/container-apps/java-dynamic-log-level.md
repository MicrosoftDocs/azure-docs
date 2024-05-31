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

Azure Container Apps platform offers a built-in diagnostics tool exclusively for Java developers to help them debug and troubleshoot their Java applications running on Azure Container Apps more easily and efficiently. One of the key features is a dynamic logger level change, which allows you to access log details that are hidden by default. When enabled, log information is collected without code modifications or forcing you to restart your app when changing log levels.

Before getting started, you need to upgrade Azure Container Apps extension in your Azure CLI to version **0.3.51** or higher.
```azurecli
az extension update --name containerapp
```

## Enable JVM diagnostics for your Java applications

Before using the Java diagnostics tool, you need to first enable Java Virtual Machine (JVM) diagnostics for your Azure Container Apps. This step enables Java diagnostics functionality by injecting an advanced diagnostics agent into your app. Your app might restart during this process.

To take advantage of these diagnostic tools, you can create a new container app with them enabled, or update an existing container app.

To create a new container app with JVM diagnostics enabled, use the following command:

```azurecli
az containerapp create --enable-java-agent \
  --environment <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME>
```

To update an existing container app, use the following command:

```azurecli
az containerapp update --enable-java-agent \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME>
```

## Change runtime logger levels

After enabling JVM diagnostics, you can change runtime log levels for specific loggers in your running Java app without the need to restart your application.

The following sample uses the logger name `org.springframework.boot` with the log level `info`. Make sure to change these values to match your own logger name and level.
 
Use the following command to adjust log levels for a specific logger:
 
```azurecli
az containerapp java logger set \
  --logger-name "org.springframework.boot" \
  --logger-level "info"
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME>
```

It may take up to two minutes for the logger level change to take effect. Once complete, you can check the application logs from [log streams](log-streaming.md) or other [log options](log-options.md).

## Supported Java logging frameworks

The following Java logging frameworks are supported:

- [Log4j2](https://logging.apache.org/log4j/2.x/) (only version 2.*)
- [Logback](https://logback.qos.ch/)
- [jboss-logging](https://github.com/jboss-logging/jboss-logging)

### Supported log levels by different logging frameworks

Different logging frameworks support different log levels. In the JVM diagnostics platform, some frameworks are better supported than others. Before changing logging levels, make sure the log levels you're using are supported by both the framework and platform.

| Framework     | OFF   | FATAL | ERROR | WARN | INFO | DEBUG | TRACE | ALL |
|---------------|-------|-------|-------|------|------|-------|-------|-----|
| Log4j2        | Yes   | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | Yes |
| Logback       | Yes   | No    | Yes   | Yes  | Yes  | Yes   | Yes   | Yes |
| jboss-logging | No    | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | No  |
| **Platform**  | Yes   | No    | Yes   | Yes  | Yes  | Yes   | Yes   | No  |

### General visibility of log levels

| Log Level | FATAL | ERROR | WARN | INFO | DEBUG | TRACE | ALL |
|-----------|-------|-------|------|------|-------|-------|-----|
| **OFF**   |       |       |      |      |       |       |     |
| **FATAL** | Yes   |       |      |      |       |       |     |
| **ERROR** | Yes   | Yes   |      |      |       |       |     |
| **WARN**  | Yes   | Yes   | Yes  |      |       |       |     |
| **INFO**  | Yes   | Yes   | Yes  | Yes  |       |       |     |
| **DEBUG** | Yes   | Yes   | Yes  | Yes  | Yes   |       |     |
| **TRACE** | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   |     |
| **ALL**   | Yes   | Yes   | Yes  | Yes  | Yes   | Yes   | Yes |

For example, if you set log level to `DEBUG`, your app will print logs with level `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG` and will NOT print logs with level `TRACE` AND `ALL`.

## Related content

> [!div class="nextstepaction"]
> [Log steaming](./log-streaming.md)
