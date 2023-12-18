---
title: Enable Dapr on your container app
description: Learn more about enabling Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: event-tier1-build-2022, ignite-2022, build-2023
ms.topic: conceptual
ms.date: 12/18/2023
---

# Enable Dapr on your container app

You can configure Dapr using various [arguments and annotations][dapr-args] based on the runtime context. Azure Container Apps provides three channels through which you can configure Dapr:

- Container Apps CLI
- Infrastructure as Code (IaC) templates, as in Bicep or Azure Resource Manager (ARM) templates
- The Azure portal

The table below outlines the currently supported list of Dapr sidecar configurations in Container Apps:

| Container Apps CLI        | Template field            | Description                                                                                                                  |
| ------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--enable-dapr`           | `dapr.enabled`            | Enables Dapr on the container app.                                                                                           |
| `--dapr-app-port`         | `dapr.appPort`            | The port your application is listening on which is used by Dapr for communicating to your application                   |
| `--dapr-app-protocol`     | `dapr.appProtocol`        | Tells Dapr which protocol your application is using. Valid options are `http` or `grpc`. Default is `http`.                  |
| `--dapr-app-id`           | `dapr.appId`              | A unique Dapr identifier for your container app used for service discovery, state encapsulation and the pub/sub consumer ID. |
| `--dapr-max-request-size` | `dapr.httpMaxRequestSize` | Set the max size of request body http and grpc servers to handle uploading of large files. Default is 4 MB.                    |
| `--dapr-read-buffer-size` | `dapr.httpReadBufferSize` | Set the max size of http header read buffer in to handle when sending multi-KB headers. The default 4 KB.                    |
| `--dapr-api-logging`      | `dapr.enableApiLogging`   | Enables viewing the API calls from your application to the Dapr sidecar.                                                     |
| `--dapr-log-level`        | `dapr.logLevel`           | Set the log level for the Dapr sidecar. Allowed values: debug, error, info, warn. Default is `info`.                         |

When using an IaC template, specify the following arguments in the `properties.configuration` section of the container app resource definition.

# [Bicep](#tab/bicep1)

```bicep
 dapr: {
   enabled: true
   appId: 'nodeapp'
   appProtocol: 'http'
   appPort: 3000
 }
```

# [ARM](#tab/arm1)

```json
  "dapr": {
    "enabled": true,
    "appId": "nodeapp",
    "appProcotol": "http",
    "appPort": 3000
  }
```

---

The above Dapr configuration values are considered application-scope changes. When you run a container app in multiple-revision mode, changes to these settings won't create a new revision. Instead, all existing revisions are restarted to ensure they're configured with the most up-to-date values.

## Next steps

[Learn how to connect Dapr components using the Azure portal][dapr-connect]

<!-- Links External -->

[dapr-args]: https://docs.dapr.io/reference/arguments-annotations-overview/

<!-- Links Internal -->

[dapr-connect]: ./dapr-component-connection.md