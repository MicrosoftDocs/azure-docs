---
title: Troubleshooting guide for Azure Spring Cloud | Microsoft Docs
description: Troubleshooting guide for Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---
# Troubleshooting Guide of common problems

When you create or manage _Azure Spring Cloud_, you might occasionally encounter problems. This article details some common problems and troubleshooting steps. We recommend that you read the [FAQ article](spring-cloud-faq.md) and other documentation in addition to this one.

## Availability, performance, and application issues
### My application cannot start (for example, the endpoint cannot be connected, or returns 502 after few retries)
Export the logs to _Azure Log Analytics_. The table for Spring application logs is named `AppPlatformLogsforSpring`. For more details, please visit [Analyze logs and metrics with Diagnostic settings](diagnostic-services.md)

Application start fails because of various reasons, but if you see the following error in the beginning of your logs:

`org.springframework.context.ApplicationContextException: Unable to start web server`

Basically they can be in either of the two following reasons:
- One of the beans or one of its dependencies is missing.
- One of the bean properties is missing or invalid. You will likely see `java.lang.IllegalArgumentException` in this case.

Application start fails might be related with the enabled service bindings as well. Use keywords related to the bound services to query the logs.

_Take MySql for example. The default timezone of a MySql instance is set to local system time. If you bind this MySql instance to your Spring application, it might not start due to the following error shown in the log:_

`java.sql.SQLException: The server time zone value 'Coordinated Universal Time' is unrecognized or represents more than one time zone.`

All you need to do is to go to the `server parameters` of your MySql instance, and change `time_zone` from `SYSTEM` to `+0:00`.


### My application crashes or throws an unexpected error

Application crashes and errors happen because of various reasons. It's good to start by checking the running status and discovery status first. You can go to _App management_ to make sure all the applications are in _Running_ status and _UP_ discovery status.

- If the status is _Running_ but the discovery status is not _UP_, go to [My application cannot be registered](#my-application-cannot-be-registered).

- If the discovery status is _UP_, you can go to _Metrics_ to check the application's health, especially the following metrics:

  - `TomcatErrorCount` (_tomcat.global.error_):
    All Spring application exceptions will be counted here. If you see this number is large, go to _Azure Log Analytics_ to inspect your application logs.

  - `AppMemoryMax` (_jvm.memory.max_):
    The maximum amount of memory available to the application. It may be undefined or may change over time if defined. The amount of used and committed memory will always be less than or equal to max if it is defined. However, a memory allocation may fail with `OutOfMemoryError` if it attempts to increase the used memory such that used > committed even if used <= max would still be true. In such a situation, try to increase the maximum heap size via the `-Xmx` parameter.

  - `AppMemoryUsed` (_jvm.memory.used_):
    The amount of memory in bytes that is currently used by the application. For a normal load Java application, this metric series will form into a 'sawtooth' pattern, where the memory usage steadily increases and decreases in small increments and drops a lot suddenly and this pattern repeats. This is because of garbage collection inside Java virtual machine, where collection actions represent drops on the 'sawteeth'.
    This metric is important for identify memory issues, such as:
        - Memory explosion at the very beginning
        - Surge memory allocation for a specific logic path
        - Gradual memory leaks

  For more details, please visit [Metrics](spring-cloud-concept-metrics.md).

To get started with _Azure Log Analytics_, visit https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal. You will need to query the logs by using [Kusto Query Language](https://docs.microsoft.com/azure/kusto/query/).

### My application experiences high CPU usage or high memory usage
If your application experiences high CPU/memory usage, it is basically in either of two situations:
- All the app instances experience high CPU/memory usage, and
- Some of the app instances experience high CPU/memory usage.

To confirm which situation it is,

1. Go to _Metrics_, select either `Service CPU Usage Percentage` or `Service Memory Used`,
2. Add an `App=` filter to specify which application you want to monitor, and
3. Split the metrics by `Instance`.

If the situation happens to be that all instances are experiencing high CPU/memory, you need to either scale out the application or scale up the CPU/Memory. For more details, please visit [Scale Applications](spring-cloud-tutorial-scale-manual.md)

If the situation happens to be that some of the instances are experiencing high CPU/memory, check the instance status and its discovery status.

For more details, visit [Metrics](spring-cloud-concept-metrics.md).

If all instances are up and running, go to _Azure Log Analytics_ to query your application logs and review your code logics to see if any of them might impact scale partitioning. For more details, visit [Analyze logs and metrics with Diagnostic settings](diagnostic-services.md).

To get started with _Azure Log Analytics_, visit https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal. You will need to query the logs by using [Kusto Query Language](https://docs.microsoft.com/azure/kusto/query/).

### Checklist before onboard your Spring application to Azure Spring Cloud
- The application can be run locally with the specified Java runtime version.
- The environment config (CPU/RAM/Instances) meets the minimum requirement by the application provider.
- The configuration items have expected values. For more information, see [Config Server](spring-cloud-tutorial-config-server.md).
- The environment variables have expected values.
- The JVM parameters have expected values.
- We recommended that you disable/remove embedded _Config Server_ and _Eureka_ service from the application package.
- If any Azure resources are to be bound via _Service Binding_, make sure the target resources are up and running.

## Configuration and Management
### I encountered a problem in creating Azure Spring Cloud service instance
When you try to provision an _Azure Spring Cloud_ service instance via the portal, it will do validation for you.

However, if you try to provision the _Azure Spring Cloud_ service instance via [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) or [Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/), verify:
- The subscription is active.
- The location is [supported](spring-cloud-faq.md) by _Azure Spring Cloud_.
- The resource group for the instance is already created.
- The resource name conforms to the naming rule. (It can contain only lowercase letters, numbers and hyphens. The first character must be a letter. The last character must be a letter or number. The value must be between 2 and 32 characters long.)

If you try to provision the _Azure Spring Cloud_ service instance via the Resource Manager template, please visit https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates to check the template syntax.

The name of the _Azure Spring Cloud_ service instance will be used for requesting a subdomain name under `azureapps.io`, so the provision will fail if the name conflicts with an existing one. You may find more details in the activity logs.

### I cannot deploy a JAR package
First of all, due to known limitation, you cannot upload JAR/source package via the portal or Resource Manager template.

When you deploy your application package thought [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), it will periodically poll the deployment progress, and in the end, it will show the deployment result.

If the polling is interrupted, you can still use the following command to fetch the deployment logs:

`az spring-cloud app show-deploy-log -n <app-name>`

Make sure that your application is packaged in the correct [executable jar format](https://docs.spring.io/spring-boot/docs/current/reference/html/executable-jar.html). If not, you will see an error like the following:

`Error: Invalid or corrupt jarfile /jar/38bc8ea1-a6bb-4736-8e93-e8f3b52c8714`

### I cannot deploy a source package
First of all, due to known limitation, you cannot upload JAR/source package via the portal or Resource Manager template.

When you deploy your application package thought [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), it will periodically poll the deployment progress, and in the end, it will show the deployment result.

If the polling is interrupted, you can still use the following command to fetch the build and deployment logs:

`az spring-cloud app show-deploy-log -n <app-name>`

However, note that one _Azure Spring Cloud_ service instance can only trigger one build job for one source package at one time. For more details, please refer to [Deploy an application](spring-cloud-quickstart-launch-app-portal.md) and [Staging environment guide](spring-cloud-howto-staging-environment.md).

### My application cannot be registered

In most case, it is because you have not configured Required Dependencies/Service Discovery in your pom file. After configured, the built-in Eureka server endpoint will be automatically injected as environment variable with your application. Then applications will be able to register themselves with Eureka server and discover other dependent microservices.

Wait at least 2 minutes before a newly registered instance start receiving traffic for the following reasons: 

*  The first heartbeat happens 30 seconds after startup, this heartbeat is for client registration.
* The server maintains a response cache that is updated per 30 seconds, so even if the instance is just registered it will not appear in the _Eureka_ response immediately.
*  _Eureka_ client maintains a cache of registry information. The cache is refreshed per 30 seconds.
*  _Ribbon_ also maintains a local cache to avoid calling the client for every request. It may take another 30s.

If you are migrating an existing Spring Cloud based solution to Azure, make sure your ad-hoc _Eureka_ and _Config Server_ instances are removed (or disabled) to avoid conflicting with the managed instances provided by _Azure Spring Cloud_.

You may also check _Eureka_ client logs in _Azure Log Analytics_. For more details, please visit [Analyze logs and metrics with Diagnostic settings](diagnostic-services.md)

To get started with _Azure Log Analytics_, please visit https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal. You will need to query the logs by using [Kusto Query Language](https://docs.microsoft.com/azure/kusto/query/).

### I cannot find metrics or logs for my application
First of all, go to _App management_ to make sure the application is in _Running_ status and _UP_ discovery status.

If you can see metrics from _JVM_ but no metrics from _Tomcat_, please check if `spring-boot-actuator` dependency is enabled in your application package and successfully boot up.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

If your application logs can be archived to a storage account, but not sent to _Azure Log Analytics_, please check whether you [set up your workspace correctly](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace). If you are using a free tier of _Azure Log Analytics_, note that [the free tier does not provide SLA](https://azure.microsoft.com/support/legal/sla/log-analytics/v1_3/).