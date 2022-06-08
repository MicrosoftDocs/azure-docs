---
title: How to configure health probes for Apps | Microsoft Docs
description: How to add health probes in Azure Spring Apps
author: 
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 4/28/2022
ms.author: xuycao
ms.custom: devx-track-java, devx-track-azurecli
---

# How to configure health probes for Apps in Azure Spring Apps

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to customize apps running in Azure Spring Apps with health probes.

Azure Spring Apps uses liveness probes to know when to restart an application. For example, liveness probes could catch a deadlock, where an application is running, but unable to make progress. Restarting the application in such a state can help to make the application more available despite bugs.

Azure Spring Apps uses readiness probes to know when an app instance is ready to start accepting traffic. One use of this signal is to control which app instances are used as backends for the application. When an app instance is not ready, it is removed from [Kubernetes Service Discovery](how-to-service-registration.md).

Azure Spring Apps uses startup probes to know when an application has started. If such a probe is configured, it disables liveness and readiness checks until it succeeds, making sure those probes don't interfere with the application startup. This can be used to adopt liveness checks on slow starting applications, avoiding them getting killed before they are up and running.

By default, Azure Spring Apps offers default health probe rules for every application. This article shows you how to customize your application with three kinds of health probes.



## Prerequisites

* The [Azure Spring Apps extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI

## Config health probes to applications

### Health Probe Properties
|Property Name | Description|
|-|-|
| initialDelaySeconds|Number of seconds after the App Instance has started before probes are initiated.|
|periodSeconds|How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.|
|timeoutSeconds|Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1.|
|failureThreshold|Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.|
|successThreshold|Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.|

### Probe Action Properties

- *HTTPGetAction*

|Property Name | Description|
|-|-|
|scheme|Scheme to use for connecting to the host. Defaults to HTTP.|
|path|Path to access on the HTTP server.|


- *ExecAction*

|Property Name | Description|
|-|-|
|command|Command is the command line to execute inside the Application's container.|

- *TCPSocketAction*

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

---

## Use best practices

Use the following best practices when adding your own persistent storage to Azure Spring Apps.

* It's recommanded to use liveness and readiness probe together. The reason is that Azure Spring Apps provides two approachs for service discovery at the same time. And when the readiness probe fails, the app instance will only be removed from Kubernetes Service Discovery. A proper configed liveness probe can remove the issued app instance from Eureka Service Discovery to avoid unexpected cases.
For more information about Service Discovery, please refer [Discover and register your Spring Boot applications](how-to-service-registration.md).
* The total timeout before a probe failure is *initialDelaySeconds + periodSeconds * failureThreshold*. Please ensure this timeout is longer enough for your application to be about to start to server the traffic.
* For spring boot applications, Spring Boot shipped with the [Health Groups support](https://docs.spring.io/spring-boot/docs/2.2.x/reference/html/production-ready-features.html#health-groups), allowing developers to select a subset of health indicators and group them under a single, correlated, health status. Please refer this blog for more information [Liveness and Readiness Probes with Spring Boot](https://spring.io/blog/2020/03/25/liveness-and-readiness-probes-with-spring-boot).  


## FAQs

The following are frequently asked questions (FAQ) about using health probes with Azure Spring Apps.

* I received 400 response when create applications with customized health probes

   *The error message will point out which probe is responsible for the provision failure. Please make sure the health probe rules are correct and the timeout is long enough for the application to be in running state.*

## Next steps

* [Scale an application in Azure Spring Apps](how-to-scale-manual.md).
