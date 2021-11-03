---
title: How to load Logback and write logs to your own persistent storage
description: How to load Logback and write logs to your own storage in Azure Spring Cloud.
author: TODO: To be added
ms.author: xuycao
ms.service: spring-cloud
ms.topic: how-to
ms.date: 11/03/2021
ms.custom: devx-track-java
---



# How to load Logback and write logs to your own persistent storage in Azure Spring Cloud

**This article applies to:** ✔️ Java

This article shows you how to load Logback and write logs to your own persistent storage in Azure Spring Cloud.

## Prerequisites

* An existing storage resource binded to Azure Spring Cloud instance. If you need to bind a storage resource, see [How to enable your own persistent storage in Azure Spring Cloud](./how-to-custom-persistent-storage.md).
* Introduce Logback dependency to your application, see [A Guide To Logback](https://www.baeldung.com/logback)
* The [Azure Spring Cloud extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI

## Edit Logback configuration to write logs into a specific path

When a file in the application's classpath has one of the following names, Spring Boot will automatically load it over the default configuration for Logback:
- *logback-spring.xml*
- *logback.xml*
- *logback-spring.groovy*
- *logback.groovy*

Let's take the simple logback-spring.xml below as a example:

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
        <!-- please feel free to customize the log layout -->
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

    <!-- LOG everything at INFO level -->
    <root level="info">
        <appender-ref ref="RollingFile" />
        <appender-ref ref="Console" />
    </root>

    <!-- LOG "com.baeldung*" at TRACE level -->
    <logger name="com.baeldung" level="trace" additivity="false">
        <appender-ref ref="RollingFile" />
        <appender-ref ref="Console" />
    </logger>

</configuration>
```

In *RollingFileAppender* and *TimeBasedRollingPolicy* sections, they both contains a placeholder *{LOGS}* in the path url for writing application logs to. 

We just need to assign a value to the environment variable *LOGS* and attach the BYOS persistent storage to the same path. Then the log will flow to both console and the custom persistent storage.

## Use the Azure CLI to load Logback and write logs to the custom persistent storage

1. Use the following command to create the application with custom storage enabled and environment variable set:

    ```azurecli
        az spring-cloud app create -n <app-name> -g <resource-group-name> -s <spring-instance-name> --persistent-storage <path-to-JSON-file> --env LOGS=/byos/logs
    ```

    Here's a sample of the JSON file that is passed to the `--persistent-storage` parameter in the create command. Please make sure to pass the same value for environment variable in the cli command above and *mountPath* property below:

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
        az spring-cloud app deploy -n <app-name> -g <resource-group-name> -s <spring-instance-name> --jar-path <path-to-jar-file>
    ```

1. The Logback configuration above will write logs to both application console and the custom persistent storage. 
Use the following command to check your application's console log:
    ```azurecli
        az spring-cloud app logs -n <app-name> -g <resource-group-name> -s <spring-instance-name>
    ```

    Go to the Azure Storage Account resource you binded and find the Azure File Share that was attached as a persistent storage. The log files should be continueously writing into it.

