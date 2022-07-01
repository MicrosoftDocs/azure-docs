---
title: How to configure health probes and gracefull termination period for Apps | Microsoft Docs
description: How to add health probes and gracefull termination period in Azure Spring Apps
author: 
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 6/29/2022
ms.author: xuycao
ms.custom: devx-track-java, devx-track-azurecli
---

# How to configure health probes and gracefull termination period for Apps in Azure Spring Apps

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to customize apps running in Azure Spring Apps with health probes and graceful termination period.

A probe is a diagnostic performed periodically by Azure Spring Apps on an app instance. To perform a diagnostic, Azure Spring Apps either executes arbitrary command of your choice within the app instance, establishs TCP socket connection or makes a HTTP request.

Azure Spring Apps uses liveness probes to know when to restart an application. For example, liveness probes could catch a deadlock, where an application is running, but unable to make progress. Restarting the application in such a state can help to make the application more available despite bugs.

Azure Spring Apps uses readiness probes to know when an app instance is ready to start accepting traffic. One use of this signal is to control which app instances are used as backends for the application. When an app instance is not ready, it is removed from [Kubernetes Service Discovery](how-to-service-registration.md).

Azure Spring Apps uses startup probes to know when an application has started. If such a probe is configured, it disables liveness and readiness checks until it succeeds, making sure those probes don't interfere with the application startup. This can be used to adopt liveness checks on slow starting applications, avoiding them getting killed before they are up and running.

By default, Azure Spring Apps offers default health probe rules for every application. This article shows you how to customize your application with three kinds of health probes.



## Prerequisites

* The [Azure Spring Apps extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI

## Config health probes and grace termination to applications

### Grace Termination

|Property Name | Description|
|-|-|
| terminationGracePeriodSeconds|  The grace period is the duration in seconds after the processes running in the App Instance are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. Defaults to 90 seconds.
 |

### Health Probe Properties
|Property Name | Description|
|-|-|
| initialDelaySeconds|Number of seconds after the App Instance has started before probes are initiated. Default to 0 seconds. Minimum value is 0.|
|periodSeconds|How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.|
|timeoutSeconds|Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1.|
|failureThreshold|Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.|
|successThreshold|Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.|

### Probe Action Properties
There are three different ways to check an app instance using a probe. Each probe must define exactly one of these three probe actions:

- *HTTPGetAction*


    Performs an HTTP GET request against the app instance on a specified path. The diagnostic is considered successful if the response has a status code greater than or equal to 200 and less than 400.

|Property Name | Description|
|-|-|
|scheme|Scheme to use for connecting to the host. Defaults to HTTP.|
|path|Path to access on the HTTP server of the app instance. e.g. `/healthz`|


- *ExecAction*

Executes a specified command inside the app instance. The diagnostic is considered successful if the command exits with a status code of 0.

|Property Name | Description|
|-|-|
|command|Command is the command line to execute inside the app instance. The working directory for the command is root ('/') in the app instance's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.|

- *TCPSocketAction*

Performs a TCP check against the app instance.

No available property to be customized for now.

# [CLI](#tab/Azure-CLI)

You can customize your application with the Azure CLI by using the following steps.

1. Use the following command to create an application with liveness probe and readiness probe:

    ```azurecli
    az spring app create \
	    --enable-liveness-probe true \
	    --liveness-probe-config [path-to-liveness-probe-json-file] \ 
        --enable-readiness-probe true \
	    --readiness-probe-config [path-to-readiness-probe-json-file] \ 
        --resource-group <resource-group-name> \
        --service <Azure-Spring-Cloud-instance-name> \
        --name <application-name>
    ```

   Here's a sample of the JSON file that is passed to the `--liveness-probe-config ` parameter in the create command:

   ```json
   {
        "probe": {
            "initialDelaySeconds": 30,
            "periodSeconds": 10,
            "timeoutSeconds": 1,
            "failureThreshold": 30,
            "successThreshold": 1,
            "probeAction": {
                "type": "TCPSocketAction",
            }
        }
    }
   ```
> [!NOTE]
> Azure Spring Apps also support two more kinds of probe actions, here are the JSON file examples:
> ```json
>"probeAction": {
>    "type": "HTTPGetAction",
>    "scheme": "HTTP",
>    "path": "/anyPath"
> }
> ```
> and
> ```json
>"probeAction": {
>    "type": "ExecAction",
>    "command": ["cat", "/tmp/healthy"]
> }
> ```

2. Optionally, protect slow starting containers with startup probe using the following command:

   ```azurecli
   az spring app update \
	   --enable-startup-probe true \
       --startup-probe-config [path-to-startup-probe-json-file] \ 
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name>
   ```

3. Optionally, disable any specific health probe using the following command:

 ```azurecli
    az spring app update \
       --enable-liveness-probe false \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name>
   ```

4. Optionally, set the termination grace period seconds using the following command:
 
 ```azurecli
    az spring app update \
       --grace-period <termination-grace-period-seconds> \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name>
   ```

---

## Use best practices

Use the following best practices when adding your own persistent storage to Azure Spring Apps.

* It's recommanded to use liveness and readiness probe together. The reason is that Azure Spring Apps provides two approachs for service discovery at the same time. And when the readiness probe fails, the app instance will only be removed from Kubernetes Service Discovery. A proper configed liveness probe can remove the issued app instance from Eureka Service Discovery to avoid unexpected cases.
For more information about Service Discovery, please refer [Discover and register your Spring Boot applications](how-to-service-registration.md).
* After an app instance starts, the first check is done after initialDelaySeconds, and subsequent checks happen afterwards every periodSeconds. If the app has failed to respond to the requests for failureThreshold times, the app instance will be restarted. Please make sure your application can start fast enough, or update above parameters, so the total timeout `initialDelaySeconds + periodSeconds * failureThreshold` is longer than the start time of your application.
* For spring boot applications, Spring Boot shipped with the [Health Groups support](https://docs.spring.io/spring-boot/docs/2.2.x/reference/html/production-ready-features.html#health-groups), allowing developers to select a subset of health indicators and group them under a single, correlated, health status. Please refer this blog for more information [Liveness and Readiness Probes with Spring Boot](https://spring.io/blog/2020/03/25/liveness-and-readiness-probes-with-spring-boot). 

    > Examples for Liveness and Readiness Probes with Spring Boot:
    > ```json
    > // liveness probe
    > "probe": {
    >        "initialDelaySeconds": 30,
    >        "periodSeconds": 10,
    >        "timeoutSeconds": 1,
    >        "failureThreshold": 30,
    >        "successThreshold": 1,
    >        "probeAction": {
    >            "type": "HTTPGetAction",
    >            "scheme": "HTTP",
    >            "path": "/actuator/health/liveness"
    >        }
    >    }
    > ```
    >
    > ```json
    > // readiness probe
    > "probe": {
    >        "initialDelaySeconds": 0,
    >        "periodSeconds": 10,
    >        "timeoutSeconds": 1,
    >        "failureThreshold": 3,
    >        "successThreshold": 1,
    >        "probeAction": {
    >            "type": "HTTPGetAction",
    >            "scheme": "HTTP",
    >            "path": "/actuator/health/readiness"
    >        }
    >    }
    > ```


## FAQs

The following are frequently asked questions (FAQ) about using health probes with Azure Spring Apps.

* I received 400 response when create applications with customized health probes

   *The error message will point out which probe is responsible for the provision failure. Please make sure the health probe rules are correct and the timeout is long enough for the application to be in running state.*

* What is the default probe settings for existing applications

    ```json
    "startupProbe": null,
    "livenessProbe": {
        "disableProbe": false,
        "failureThreshold": 24,
        "initialDelaySeconds": 60,
        "periodSeconds": 10,
        "probeAction": {
            "type": "TCPSocketAction"
        },
        "successThreshold": 1,
        "timeoutSeconds": 1
    },
    "readinessProbe": {
        "disableProbe": false,
        "failureThreshold": 3,
        "initialDelaySeconds": 0,
        "periodSeconds": 10,
        "probeAction": {
            "type": "TCPSocketAction"
        },
        "successThreshold": 1,
        "timeoutSeconds": 1
    },
    ```

## Next steps

* [Scale an application in Azure Spring Apps](how-to-scale-manual.md).
