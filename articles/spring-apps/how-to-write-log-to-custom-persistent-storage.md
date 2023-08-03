---
title: How to use Logback to write logs to custom persistent storage in Azure Spring Apps | Microsoft Docs
description: How to use Logback to write logs to custom persistent storage in Azure Spring Apps.
author: KarlErickson
ms.author: xuycao
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/17/2021
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# How to use Logback to write logs to custom persistent storage

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to load Logback and write logs to custom persistent storage in Azure Spring Apps.

> [!NOTE]
> When a file in the application's classpath has one of the following names, Spring Boot will automatically load it over the default configuration for Logback:
> - *logback-spring.xml*
> - *logback.xml*
> - *logback-spring.groovy*
> - *logback.groovy*

## Prerequisites

* An existing storage resource bound to an Azure Spring Apps instance. If you need to bind a storage resource, see [How to enable your own persistent storage in Azure Spring Apps](./how-to-custom-persistent-storage.md).
* The Logback dependency included in your application. For more information on Logback, see [A Guide To Logback](https://www.baeldung.com/logback).
* The [Azure Spring Apps extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI

## Edit the Logback configuration to write logs into a specific path

You can set the path to where logs will be written by using the logback-spring.xml example file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="Console"
              class="ch.qos.logback.core.ConsoleAppender">
        <!-- please feel free to customize the log layout -->
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>
                %black(%d{ISO8601}) %highlight(%-5level) [%blue(%t)] %yellow(%C{1.}): %msg%n%throwable
            </Pattern>
        </layout>
    </appender>

    <appender name="RollingFile"
              class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 'LOGS' here is a value to be read from the application's environment variable -->
        <file>${LOGS}/spring-boot-logger.log</file>
        <!-- please feel free to customize the log layout pattern -->
        <encoder
                class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <Pattern>%d %p %C{1.} [%t] %m%n</Pattern>
        </encoder>

        <rollingPolicy
                class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- rollover daily and when the file reaches 10 MegaBytes -->
            <fileNamePattern>${LOGS}/archived/spring-boot-logger-%d{yyyy-MM-dd}.%i.log
            </fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy
                    class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
    </appender>

    <!-- LOG everything at the INFO level -->
    <root level="info">
        <appender-ref ref="RollingFile" />
        <appender-ref ref="Console" />
    </root>

    <!-- LOG "com.baeldung*" at the TRACE level -->
    <logger name="com.baeldung" level="trace" additivity="false">
        <appender-ref ref="RollingFile" />
        <appender-ref ref="Console" />
    </logger>

</configuration>
```

In the preceding example, there are two placeholders named `{LOGS}` in the path for writing the application's logs to. A value needs to be assigned to the environment variable `LOGS` to have the log write to both the console and your persistent storage. 

## Use the Azure CLI to create and deploy a new app with Logback on persistent storage

1. Use the following command to create an application in Azure Spring Apps with persistent storage enabled and the environment variable set:

   ```azurecli
   az spring app create \
        --resource-group <resource-group-name> \
        --name <app-name> \
        --service <spring-instance-name> \
        --persistent-storage <path-to-json-file> \
        --env LOGS=/byos/logs
   ```
   > [!NOTE]
   > The value of the `LOGS` environment variable can be the same as, or a subdirectory of the `mountPath`.
    
    Here's an example of the JSON file that is passed to the `--persistent-storage` parameter in the create command. In this example, the same value is passed for the environment variable in the CLI command above and in the `mountPath` property below: 

    ```json
    {
        "customPersistentDisks": [
            {
                "storageName": "<Storage-Resource-Name>",
                "customPersistentDiskProperties": {
                    "type": "AzureFileVolume",
                    "shareName": "<Azure-File-Share-Name>",
                    "mountPath": "/byos/logs",
                    "readOnly": false
                }
            }
        ]
    }
    ```
  
1. Use the following command to deploy your application:

   ```azurecli
   az spring app deploy \
        --resource-group <resource-group-name> \
        --name <app-name> \
        --service <spring-instance-name> \
        --jar-path <path-to-jar-file>
   ```

1. Use the following command to check your application's console log:

   ```azurecli
   az spring app logs \
        --resource-group <resource-group-name> \
        --name <app-name> \
        --service <spring-instance-name>
   ```

    Go to the Azure Storage Account resource you bound and find the Azure file share that was attached as persistent storage. In this example, the logs will be written to the *spring-boot-logger.log* file at the root of your Azure file share. All of the rotated log files will be stored in the */archived* folder in your Azure file share.

1. Optionally, use the following command to update the path or persistent storage of an existing app:

    The path or persistent storage where the logs are saved can be changed at any time. The application will restart when changes are made to either environment variables or persistent storage.

   ```azurecli
   az spring app update \
        --resource-group <resource-group-name> \
        --name <app-name> \
        --service <spring-instance-name> \
        --persistent-storage <path-to-new-json-file> \
        --env LOGS=<new-path>
   ```

## Next steps

* [Structured application log for Azure Spring Apps](./structured-app-log.md)
* [Analyzing logs and metrics with diagnostic settings](./diagnostic-services.md)
