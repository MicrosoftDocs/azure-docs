---
title: Troubleshooting guide for Azure Spring Cloud | Microsoft Docs
description: Troubleshooting guide for Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/07/2019
ms.author: v-vasuke

---
# Troubleshooting Guide for common problems

This article details some common problems and troubleshooting steps for developers working within the Azure Spring Cloud. We also recommend reading our [FAQ article](spring-cloud-faq.md).

## Availability, performance, and application issues

### My application cannot start (for example, the endpoint cannot be connected, or returns 502 after few retries)

Export the logs to _Azure Log Analytics_. The table for Spring application logs is named `AppPlatformLogsforSpring`. To learn more, please visit [Analyze logs and metrics with Diagnostic settings](diagnostic-services.md)

Finding the following error in your logs indicates one of two likely problems:

`org.springframework.context.ApplicationContextException: Unable to start web server`

* One of the beans or one of its dependencies is missing.
* One of the bean properties is missing or invalid. You will likely see `java.lang.IllegalArgumentException` in this case.

Service bindings may also cause application start failures. Use keywords related to the bound services to query the logs.  For instance, assume your application has a binding to a MySQL instance set to local system time. If the application fails to start, you may find the following error in the log:

`java.sql.SQLException: The server time zone value 'Coordinated Universal Time' is unrecognized or represents more than one time zone.`

To fix this error, go to the `server parameters` of your MySql instance and change `time_zone` from `SYSTEM` to `+0:00`.


### My application crashes or throws an unexpected error

When debugging application crashes, start by checking the running status and discovery status of the application. Go to _App management_ in the Azure portal to ensure all the applications are _Running_ and _UP_.

* If the status is _Running_ but the discovery status is not _UP_, go to [My application cannot be registered](#my-application-cannot-be-registered).

* If the discovery status is _UP_, go to _Metrics_ to check the application's health. Inspect the following metrics:


  - `TomcatErrorCount` (_tomcat.global.error_):
    All Spring application exceptions will be counted here. If this number is large, go to _Azure Log Analytics_ to inspect your application logs.

  - `AppMemoryMax` (_jvm.memory.max_):
    The maximum amount of memory available to the application. It may be undefined or change over time if defined. The amount of used and committed memory will always be less than or equal to max if it is defined. However, a memory allocation may fail with `OutOfMemoryError` if it attempts to increase the used memory such that used > committed even if used <= max would still be true. In such a situation, try to increase the maximum heap size via the `-Xmx` parameter.

  - `AppMemoryUsed` (_jvm.memory.used_):
    The amount of memory in bytes that is currently used by the application. For a normal load Java application, this metric series will form into a 'sawtooth' pattern, where the memory usage steadily increases and decreases in small increments and drops a lot suddenly and this pattern repeats. This is because of garbage collection inside Java virtual machine, where collection actions represent drops on the 'sawteeth'.
    This metric is important for identify memory issues, such as:
            * Memory explosion at the very beginning
            * Surge memory allocation for a specific logic path
            * Gradual memory leaks

  For more details, please visit [Metrics](spring-cloud-concept-metrics.md).

Visit [this getting started article](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal) to get started with _Azure Log Analytics_.

### My application experiences high CPU usage or high memory usage

If your application experiences high CPU/memory usage, one of two things is true:
* All the app instances experience high CPU/memory usage, or
* Some of the app instances experience high CPU/memory usage.

To confirm which situation it is,

1. Go to _Metrics_, select either `Service CPU Usage Percentage` or `Service Memory Used`,
2. Add an `App=` filter to specify which application you want to monitor, and
3. Split the metrics by `Instance`.

If all instances are experiencing high CPU/memory, you need to either scale out the application or scale up the CPU/Memory. For more details, please visit [Scale Applications](spring-cloud-tutorial-scale-manual.md)

If some of the instances are experiencing high CPU/memory, check the instance status and its discovery status.

For more details, visit [Metrics](spring-cloud-concept-metrics.md).

If all instances are up and running, go to _Azure Log Analytics_ to query your application logs and review your code logic to see if any of them might impact scale partitioning. For more details, visit [Analyze logs and metrics with Diagnostic settings](diagnostic-services.md).

Visit [this getting started article](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal) to get started with _Azure Log Analytics_. Query the logs using [Kusto Query Language](https://docs.microsoft.com/azure/kusto/query/).

### Checklist before onboarding your Spring application to Azure Spring Cloud

* The application can run locally with the specified Java runtime version.
* The environment config (CPU/RAM/Instances) meets the minimum requirement set by the application provider.
* The configuration items have expected values. For more information, see [Config Server](spring-cloud-tutorial-config-server.md).
* The environment variables have expected values.
* The JVM parameters have expected values.
* We recommended that you disable/remove embedded _Config Server_ and _Spring Service Registry_ service from the application package.
* If any Azure resources are to be bound via _Service Binding_, make sure the target resources are up and running.

## Configuration and Management

### I encountered a problem creating an Azure Spring Cloud service instance

When you try to provision an _Azure Spring Cloud_ service instance via the portal, Azure Spring Cloud will perform validation for you.

However, if you try to provision the _Azure Spring Cloud_ service instance via [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) or [Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/), verify:

* The subscription is active.
* The location is [supported](spring-cloud-faq.md) by _Azure Spring Cloud_.
* The resource group for the instance is already created.
* The resource name conforms to the naming rule. (It can contain only lowercase letters, numbers and hyphens. The first character must be a letter. The last character must be a letter or number. The value must be between 2 and 32 characters long.)

If you try to provision the _Azure Spring Cloud_ service instance via the Resource Manager template, please visit https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates to check the template syntax.

The name of the _Azure Spring Cloud_ service instance will be used for requesting a subdomain name under `azureapps.io`, so the provision will fail if the name conflicts with an existing one. You may find more details in the activity logs.

### I cannot deploy a JAR package

You cannot upload JAR/source package via the portal or Resource Manager template.

When you deploy your application package using the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), it will periodically poll the deployment progress, and in the end, it will show the deployment result.

If the polling is interrupted, you can still use the following command to fetch the deployment logs:

`az spring-cloud app show-deploy-log -n <app-name>`

Ensure that your application is packaged in the correct [executable jar format](https://docs.spring.io/spring-boot/docs/current/reference/html/executable-jar.html). If not, you will see an error like the following:

`Error: Invalid or corrupt jarfile /jar/38bc8ea1-a6bb-4736-8e93-e8f3b52c8714`

### I cannot deploy a source package

You cannot upload JAR/source package via the portal or Resource Manager template.

When you deploy your application package thought [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), it will periodically poll the deployment progress, and in the end, it will show the deployment result.

If the polling is interrupted, you can still use the following command to fetch the build and deployment logs:

`az spring-cloud app show-deploy-log -n <app-name>`

However, note that one _Azure Spring Cloud_ service instance can only trigger one build job for one source package at one time. For more details, please refer to [Deploy an application](spring-cloud-quickstart-launch-app-portal.md) and [Staging environment guide](spring-cloud-howto-staging-environment.md).

### My application cannot be registered

In most cases, this happens when the Required Dependencies/Service Discovery are not properly configured in your POM file. Once configured, the built-in Service Registry server endpoint will be injected as an environment variable with your application. Applications will then register themselves with the Service Registry server and discover other dependent microservices.

Wait at least 2 minutes before a newly registered instance starts receiving traffic.

If you are migrating an existing Spring Cloud based solution to Azure, ensure your ad-hoc _Service Registry_ and _Config Server_ instances are removed (or disabled) to avoid conflicting with the managed instances provided by _Azure Spring Cloud_.

You may also check _Service Registry_ client logs in _Azure Log Analytics_. For more details, visit [Analyze logs and metrics with Diagnostic settings](diagnostic-services.md)

Visit [this getting started article](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal) to get started with _Azure Log Analytics_. Query the logs using [Kusto Query Language](https://docs.microsoft.com/azure/kusto/query/).

### I want to inspect my application's environment variables

Environment variables inform the Azure Spring Cloud framework, ensuring that Azure understands where and how to configure the services that comprise your application.  Ensuring that your environment variables are correct is a necessary first step in troubleshooting potential problems.  You can use the Spring Boot Actuator endpoint to review your environment variables.  

> [!WARNING]
> This procedure exposes your environment variables using your test endpoint.  Do not proceed if your test endpoint is publicly accessible or if you've assigned a domain name to your application.

1. Navigate to this URL:  `https://<your application test endpoint>/actuator/health`.  
    - A response similar to `{"status":"UP"}` indicates that the endpoint has been enabled.
    - If the response is negative, include the following dependency in your `POM.xml`:

        ```xml
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-actuator</artifactId>
            </dependency>
        ```

1. With the Spring Boot Actuator endpoint enabled, go to the Azure portal and find the configuration page of your application.  Add an environment variable with the name `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE' and the value `*`. 

1. Restart your application.

1. Navigate to `https://<the test endpoint of your app>/actuator/env` and inspect the response.  It should look like this:

    ```json
    {
        "activeProfiles": [],
        "propertySources": {,
            "name": "server.ports",
            "properties": {
                "local.server.port": {
                    "value": 1025
                }
            }
        }
    }
    ```

Find the child node named `systemEnvironment`.  This node contains your application's environment variables.

> [!IMPORTANT]
> Remember to reverse the exposure of your environment variables before making your application accessible to the public.  Go to the Azure portal, find the configuration page of your application, and delete this environment variable:  `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE`.

### I cannot find metrics or logs for my application

Go to _App management_ to make sure the application is _Running_ and _UP_.

If you can see metrics from _JVM_ but no metrics from _Tomcat_, check if the`spring-boot-actuator` dependency is enabled in your application package and successfully boots up.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

If your application logs can be archived to a storage account, but not sent to _Azure Log Analytics_, please check whether you [set up your workspace correctly](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace). If you are using a free tier of _Azure Log Analytics_, note that [the free tier does not provide SLA](https://azure.microsoft.com/support/legal/sla/log-analytics/v1_3/).