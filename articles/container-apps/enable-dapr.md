---
title: Configure Dapr on an existing container app
description: Configure Dapr on your existing Azure Container App service.
ms.author: hannahhunter
author: hhunter-ms
ms.service: azure-container-apps
ms.custom: build-2023, devx-track-bicep
ms.topic: conceptual
ms.date: 04/08/2025
---

# Configure Dapr on an existing container app

You can configure Dapr using various [arguments and annotations][dapr-args] based on the runtime context. Dapr configurations available in Azure Container Apps are considered *application-scope* changes. When you run a container app in multiple-revision mode, changes to these settings don't create a new revision. Instead, all existing revisions are restarted to ensure they're configured with the most up-to-date values.

Azure Container Apps provides three channels through which you can enable and configure Dapr:

- [The Azure CLI](#using-the-cli)
- [Infrastructure as Code (IaC) templates,](#using-bicep-or-arm) like Bicep or Azure Resource Manager (ARM) templates
- [The Azure portal](#using-the-azure-portal)

The following table outlines the currently supported list of Dapr sidecar configurations for enabling Dapr in Azure Container Apps:

| Container Apps CLI        | Template field            | Description                                                                                                                  |
| ------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--enable-dapr`           | `dapr.enabled`            | Enables Dapr on the container app.                                                                                           |
| `--dapr-app-port`         | `dapr.appPort`            | The port your application is listening on which is used by Dapr for communicating to your application                   |
| `--dapr-app-protocol`     | `dapr.appProtocol`        | Tells Dapr which protocol your application is using. Valid options are `http` or `grpc`. Default setting is `http`.                  |
| `--dapr-app-id`           | `dapr.appId`              | A unique Dapr identifier for your container app used for service discovery, state encapsulation, and the pub/sub consumer ID. |
| `--dapr-max-request-size` | `dapr.httpMaxRequestSize` | Set the max size of request body http and grpc servers to handle uploading of large files. Default setting is `4 MB`.                    |
| `--dapr-read-buffer-size` | `dapr.httpReadBufferSize` | Set the max size of http header read buffer in to handle when sending multi-KB headers. Default setting is `4 KB`.                    |
| `--dapr-api-logging`      | `dapr.enableApiLogging`   | Enables viewing the API calls from your application to the Dapr sidecar.                                                     |
| `--dapr-log-level`        | `dapr.logLevel`           | Set the log level for the Dapr sidecar. Allowed values: debug, error, info, warn. Default setting is `info`.                         |
| `--dapr-app-health-enabled` | `dapr.appHealth.enabled`| Optional configuration to enable app health checks for your container app using Boolean format. Default setting is `false`.                                |
| `--dapr-app-health-path`    | `dapr.appHealth.path`| Set the path that Dapr invokes for health probes when the app channel is HTTP. This value is ignored if the app channel is using gRPC. Default setting is `/healthz`.                               |
| `--dapr-app-health-probe-interval` | `dapr.appHealth.probeIntervalSeconds`| Number of seconds between each health probe. Default setting is `3`.                             |
| `--dapr-app-health-probe-timeout` | `dapr.appHealth.probeTimeoutMilliseconds`| Timeout in milliseconds for health probe requests. This value must be smaller than the `probeIntervalSeconds` value. Default setting is `500`.              |
| `--dapr-app-health-threshold` | `dapr.appHealth.threshold`| Max number of consecutive failures before the app is considered unhealthy. Default setting is `3`.                             |
| `--dapr-max-concurrency`  | `dapr.maxConcurrency`     | Limit the concurrency of your application. A valid value is any number larger than `0`. `-1` means no limit on concurrency.                         |


## Using the CLI

You can enable Dapr on your container app using the Azure CLI.

```azurecli
az containerapp dapr enable
```

[For more information and examples, see the reference documentation.][dapr-enable-cli]

## Using Bicep or ARM

When using an IaC template, specify the following arguments in the `properties.configuration` section of the container app resource definition.

# [Bicep](#tab/bicep1)

```bicep
 dapr: {
   enabled: true
   appId: 'nodeapp'
   appProtocol: 'http'
   appPort: 3000
   httpReadBufferSize: 30
   httpMaxRequestSize: 10
   logLevel: 'debug'
   enableApiLogging: true
   appHealth: {
     enabled: true
     path: '/health'
     probeIntervalSeconds: 3
     probeTimeoutMilliseconds: 1000
     threshold: 3
   },
   maxConcurrency: 10
  }
```

# [ARM](#tab/arm1)

```json
  "dapr": {
    "enabled": true,
    "appId": "nodeapp",
    "appProtocol": "http",
    "appPort": 3000,
    "httpReadBufferSize": 30,
    "httpMaxRequestSize": 10,
    "logLevel": "debug",
    "enableApiLogging": true,
    "appHealth": {
      "enabled": true,
      "path": "/health",
      "probeIntervalSeconds": 3,
      "probeTimeoutMilliseconds": 1000,
      "threshold": 3,
    },
    "maxConcurrency": 10
  }
```

---


## Using the Azure portal

You can also enable Dapr via the portal view of your container apps. 

> [!NOTE]
> Before you start, make sure you've already created your own Dapr components. [You can connect Dapr components via your container app environment in the portal.][dapr-connect]

Navigate to your container app in the Azure portal and select **Dapr** under **Settings** in the left side menu. 

:::image type="content" source="media/enable-dapr/dapr-enablement-menu.png" alt-text="Screenshot showing where to enable Dapr in your container app via the Azure portal view.":::

By default, Dapr is disabled. Select **Enabled** to expand the Dapr settings.

:::image type="content" source="media/enable-dapr/dapr-disabled.png" alt-text="Screenshot of Dapr being disabled by default and where to click to enable it.":::

Enter the component App ID and select the appropriate headings. If applicable, under the **Components** header, select the link to add and manage your Dapr components to the container app environment.

:::image type="content" source="media/enable-dapr/dapr-enablement-settings.png" alt-text="Screenshot showing some basic settings for enabling Dapr on the container app.":::

## Next steps

[Learn more about Dapr components in Azure Container Apps.](./dapr-components.md)

<!-- Links External -->

[dapr-args]: https://docs.dapr.io/reference/arguments-annotations-overview/

<!-- Links Internal -->

[dapr-connect]: ./dapr-component-connection.md
[dapr-enable-cli]: /cli/azure/containerapp/dapr#az-containerapp-dapr-enable
[dapr-pubsub]: ./microservices-dapr-pubsub.md
[dapr-bindings]: ./microservices-dapr-bindings.md
[dapr-invoke]: ./microservices-dapr-service-invoke.md
