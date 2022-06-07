---
title: How to customize apps running in Azure Spring Cloud | Microsoft Docs
description: How to add health probes and set termination grace period in Azure Spring Cloud
author: 
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 4/28/2022
ms.author: xuycao
ms.custom: devx-track-java, devx-track-azurecli
---

# How to customize apps running in Azure Spring Cloud

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to customize apps running in Azure Spring Cloud.

By default, Azure Spring Cloud offers default health probe rules and termination grace period for every application. This article shows you how to customize your application with three kinds of health probes and the termination grace period.



## Prerequisites

* The [Azure Spring Cloud extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI

## Add health probes and termination grace period to applications

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
> Azure Spring Cloud also support two more kinds of probe actions, here are the JSON file examples:
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


1. Optionally, protect slow starting containers with startup probe using the following command:

   ```azurecli
   az spring app update \
	   --enable-startup-probe true \
       --startup-probe-config [path-to-startup-probe-json-file] \ 
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name>
   ```

1. Optionally, disable any specific health probe using the following command:

 ```azurecli
    az spring app update \
       --enable-liveness-probe false \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name>
   ```

---

## Use best practices

Use the following best practices when adding your own persistent storage to Azure Spring Cloud.

* It's recommanded to use liveness and readiness probe together.
* The total timeout before a probe failure is *initialDelaySeconds + periodSeconds * failureThreshold*. Please ensure this timeout is longer enough for your application to be about to start to server the traffic.
* For spring boot applications, Spring Boot shipped with the [Health Groups support](https://docs.spring.io/spring-boot/docs/2.2.x/reference/html/production-ready-features.html#health-groups), allowing developers to select a subset of health indicators and group them under a single, correlated, health status. Please refer this blog for more information [Liveness and Readiness Probes with Spring Boot](https://spring.io/blog/2020/03/25/liveness-and-readiness-probes-with-spring-boot).  


## FAQs

The following are frequently asked questions (FAQ) about using health probes with Azure Spring Cloud.

* I received 400 response when create applications with customized health probes

   *The error message will point out which probe is responsible for the provision failure. Please make sure the health probe rules are correct and the timeout is long enough for the application to be in running state.*

* What are the properties that can be customized related to health probe?

    * *initialDelaySeconds: Number of seconds after the App Instance has started before probes are initiated.*
    * *periodSeconds: How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.*
    * *timeoutSeconds: Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1.*
    * *failureThreshold: Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.*
    * *successThreshold: Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.*
   
* What are the properties that can be customized related to probe actions?
    * *HTTPGetAction*:
        * *scheme: Scheme to use for connecting to the host. Defaults to HTTP* 
        * *path: Path to access on the HTTP server.*
    * *ExecAction*:
        * *command: Command is the command line to execute inside the Application's container.*

## Next steps

* [Scale an application in Azure Spring Cloud](how-to-scale-manual.md).
