---
title: How to configure health probes and graceful termination period for apps hosted in Azure Spring Apps
description: Learn how to customize apps running in Azure Spring Apps with health probes and graceful termination period.
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 07/02/2022
ms.author: xuycao
ms.custom: devx-track-java, devx-track-azurecli
---

# How to configure health probes and graceful termination periods for apps hosted in Azure Spring Apps

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to customize apps running in Azure Spring Apps with health probes and graceful termination periods.

A probe is a diagnostic activity performed periodically by Azure Spring Apps on an app instance. To perform a diagnostic, Azure Spring Apps takes one of the following actions:

- Executes an arbitrary command of your choice within the app instance.
- Establishes a TCP socket connection.
- Makes an HTTP request.

Azure Spring Apps offers default health probe rules for every application. This article shows you how to customize your application with three kinds of health probes:

- *Liveness probes* determine when to restart an application. For example, liveness probes can identify a deadlock, such as when an application is running but unable to make progress. Restarting the application in a deadlock state can make the application available despite errors.

- *Readiness probes* determine when an app instance is ready to start accepting traffic. For example, readiness probes can control which app instances are used as backends for the application. When an app instance isn't ready, it's removed from Kubernetes service discovery. For more information, see [Discover and register your Spring Boot applications](how-to-service-registration.md).

- *Startup probes* determine when an application has started. A startup probe disables liveness and readiness checks until startup succeeds, ensuring that liveness and readiness probes don't interfere with application startup. You can use use startup probes to perform liveness checks on slow starting applications, preventing the app from terminating before it's up and running.

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension.

## Configure health probes and graceful termination for applications

The following sections describe how to configure health probes and graceful termination using the Azure CLI.

### Graceful termination

The following table describes the `terminationGracePeriodSeconds` property, which you can use to configure graceful termination.

| Property name                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `terminationGracePeriodSeconds` | The duration in seconds after processes running in the app instance are sent a termination signal before they're forcibly halted. Set this value longer than the expected cleanup time for your process. The value must be a non-negative integer. Setting the grace period to zero stops the app instance immediately via the kill signal, with no opportunity to shut down. If the value is nil, Azure Spring Apps uses the default grace period. The default value is 90 seconds. |

### Health probe properties

The following table describes the properties you can use to configure health probes.

| Property name         | Description                                                                                                                                                                                              |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `initialDelaySeconds` | The number of seconds after the app instance has started before probes are initiated. The default value is 0, the minimum value.                                                                         |
| `periodSeconds`       | The frequency in seconds to perform the probe. The default value is 10. The minimum value is 1.                                                                                                          |
| `timeoutSeconds`      | The number of seconds until the probe times out. The default value is 1, the minimum value.                                                                                                              |
| `failureThreshold`    | The minimum number of consecutive failures for the probe to be considered failed after having succeeded. The default value is 3. The minimum value is 1.                                                 |
| `successThreshold`    | The minimum number of consecutive successes for the probe to be considered successful after having failed. The default value is 1. The value must be 1 for liveness and startup. The minimum value is 1. |

### Probe action properties

There are three ways you can check an app instance using a probe. Each probe must define one of the following probe actions:

- `HTTPGetAction`

  Performs an HTTP GET request against the app instance on a specified path. The diagnostic is considered successful if the response has a status code greater than or equal to 200 and less than 400.

  | Property name | Description                                                                    |
  |----------------|---------------------------------------------------------------------------------|
  | `scheme`      | The scheme to use for connecting to the host. The default is HTTP.             |
  | `path`        | The path to access on the HTTP server of the app instance, such as */healthz*. |

- `ExecAction`

  Executes a specified command inside the app instance. The diagnostic is considered successful if the command exits with a status code of 0.

  | Property name | Description                                                                                                                                                                                                                                                                                                                                                                            |
  |----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | `command`       | The command to execute inside the app instance. The working directory for the command is the root directory (*/*) in the app instance's file system. Because the command is run using `exec` rather than inside a shell, shell instructions won't work. To use a shell, explicitly call out to the shell. An exit status of 0 is treated as live/healthy, and non-zero is unhealthy. |

- `TCPSocketAction`

  Performs a TCP check against the app instance.

  There are no available properties for the `TCPSocketAction` action.

### Customize your application

#### [Azure portal](#tab/azure-portal)

Use the following steps to customize your application using Azure portal:

1. Under **Settings**, select **Apps**, and then select the application from the list.

   :::image type="content" source="media/how-to-configure-health-probes-graceful-termination/select-app.jpg" lightbox="media/how-to-configure-health-probes-graceful-termination/select-app.jpg" alt-text="Screenshot of Azure portal showing the Apps page.":::

1. Select **Configuration** in the left naviation pane, select **Health probes**, and then specify Health proble properties.

   :::image type="content" source="media/how-to-configure-health-probes-graceful-termination/probe-config.jpg" lightbox="media/how-to-configure-health-probes-graceful-termination/probe-config.jpg" alt-text="Screenshot of the Azure portal Configuration page showing the Health probes tab.":::

1. To set the termination grace period, select **General settings**, and specify a value in the Termination grade period box.

   :::image type="content" source="media/how-to-configure-health-probes-graceful-termination/termination-grace-period-config.jpg" lightbox="media/how-to-configure-health-probes-graceful-termination/termination-grace-period-config.jpg" alt-text="Screenshot of the Azure portal Configuration page showing the General settings tab.":::

#### [Azure CLI](#tab/azure-cli)

Use the following steps show you how to customize your application using Azure CLI.

1. Use the following command to create an application with liveness probe and readiness probe:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name> \
       --enable-liveness-probe true \
       --liveness-probe-config <path-to-liveness-probe-json-file> \ 
       --enable-readiness-probe true \
       --readiness-probe-config <path-to-readiness-probe-json-file>
   ```

   The following example shows the contents of a sample JSON file passed to the `--liveness-probe-config` parameter in the create command:

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
   > Azure Spring Apps also support two more kinds of probe actions, as shown in the following JSON file examples:
   >
   > ```json
   > "probeAction": {
   >     "type": "HTTPGetAction",
   >     "scheme": "HTTP",
   >     "path": "/anyPath"
   > }
   > ```
   >
   > and
   >
   > ```json
   > "probeAction": {
   >     "type": "ExecAction",
   >     "command": ["cat", "/tmp/healthy"]
   > }
   > ```

1. Optionally, protect slow starting containers with a startup probe by using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name> \
       --enable-startup-probe true \
       --startup-probe-config <path-to-startup-probe-json-file>
   ```

1. Optionally, disable any specific health probe using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name> \
       --enable-liveness-probe false
   ```

1. Optionally, set the termination grace period seconds using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Cloud-instance-name> \
       --name <application-name> \
       --grace-period <termination-grace-period-seconds>
   ```

## Use best practices

Use the following best practices when adding your own persistent storage to Azure Spring Apps.

- Use liveness and readiness probe together. The reason for this recommendation is that Azure Spring Apps provides two approaches for service discovery at the same time. When the readiness probe fails, the app instance will be removed only from Kubernetes Service Discovery. A properly configured liveness probe can remove the issued app instance from Eureka Service Discovery to avoid unexpected cases. For more information about Service Discovery, see [Discover and register your Spring Boot applications](how-to-service-registration.md).
- When an app instance starts, the first check is done after the delay specified by `initialDelaySeconds`, and subsequent checks happen periodically, with the period length specified by `periodSeconds`. If the app has failed to respond to the requests for several times as specified by `failureThreshold`, the app instance will be restarted. Be sure your application can start fast enough, or update these parameters, so the total timeout `initialDelaySeconds + periodSeconds * failureThreshold` is longer than the start time of your application.
- For Spring Boot applications, Spring Boot shipped with the [Health Groups](https://docs.spring.io/spring-boot/docs/2.2.x/reference/html/production-ready-features.html#health-groups) support, allowing developers to select a subset of health indicators and group them under a single, correlated, health status. For more information, see [Liveness and Readiness Probes with Spring Boot](https://spring.io/blog/2020/03/25/liveness-and-readiness-probes-with-spring-boot) on the Spring Blog.

  The following examples show Liveness and Readiness probes with Spring Boot:

  - Liveness probe:

    ```json
    "probe": {
           "initialDelaySeconds": 30,
           "periodSeconds": 10,
           "timeoutSeconds": 1,
           "failureThreshold": 30,
           "successThreshold": 1,
           "probeAction": {
               "type": "HTTPGetAction",
               "scheme": "HTTP",
               "path": "/actuator/health/liveness"
           }
       }
    ```

  - Readiness probe:

    ```json
    "probe": {
           "initialDelaySeconds": 0,
           "periodSeconds": 10,
           "timeoutSeconds": 1,
           "failureThreshold": 3,
           "successThreshold": 1,
           "probeAction": {
               "type": "HTTPGetAction",
               "scheme": "HTTP",
               "path": "/actuator/health/readiness"
           }
       }
    ```

## FAQs

The following list shows frequently asked questions (FAQ) about using health probes with Azure Spring Apps.

- I received 400 response when I created applications with customized health probes. What does this mean?

  *The error message will point out which probe is responsible for the provision failure. Be sure the health probe rules are correct and the timeout is long enough for the application to be in the running state.*

- What's the default probe settings for existing application?

  *The following example shows the default settings:*

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
  }
  ```

## Next steps

- [Scale an application in Azure Spring Apps](how-to-scale-manual.md).
