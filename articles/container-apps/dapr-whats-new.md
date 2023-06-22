---
title: What's new with Dapr in Azure Container Apps
description: Learn more about what's new with Dapr in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/20/2023
---

# What's new with Dapr in Azure Container Apps

This article lists significant updates to Dapr and how it's available in Azure Container Apps.

## June 2023

Dapr released version 1.11.0 on June 15, 2023, introducing several new and improved features.

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| [Stable Configuration API](https://docs.dapr.io/developing-applications/building-blocks/configuration/) | [Dapr integration with Azure Container Apps](./dapr-overview.md) | Dapr's Configuration API is now stable in v1.11 and supported in Azure Container Apps. |
| [Service Invocation can now call non-Dapr endpoints](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/howto-invoke-non-dapr-endpoints/) | [How to: Invoke Non-Dapr Endpoints using](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/howto-invoke-non-dapr-endpoints/)<br>[HTTPEndpoint spec](https://docs.dapr.io/reference/resource-specs/httpendpoints-schema/) | The ability to call non-Dapr endpoints with service invocation is supported in Azure Container Apps. |
| [Choice of Dapr sidecar build variations](https://docs.dapr.io/operations/support/support-release-policy/#build-variations) | [Build variations](https://docs.dapr.io/operations/support/support-release-policy/#build-variations) | You can now choose between using the default Dapr image that contains all components, or a new variation of the Dapr image that contains only stable components. |
| Dapr dashboard no longer installed with control plane | [How to manually install the dashboard](https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-deploy/#installing-the-dapr-dashboard-as-part-of-the-control-plane) | As of 1.11.0, the Dapr dashboard is no longer installed by default with the Dapr control plane when installing via Helm. You can still install manually using the new `dapr-dashboard` chart. |
| Windows Server 2022 container images |  | In addition to images based on Windows Server 1809, Dapr 1.11.0 offers container images for Windows Server 2022, using the `windows-ltsc2022` tag. |
| App channel supports HTTP/2 and HTTP/2 Cleartext |  | The CLI flag `--app-protocol` can now assume three more values, in addition to `http` and `grpc`: <br>`https`<br>`grpcs`<br>`h2c` |
| [Multi-app Run improved](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run) | [Multi-app Run logs](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run/multi-app-overview/#logs) | You can now write app logs to the console _and_ a local log file with `dapr run -f .` |


## May 2023

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| Easy component creation | [Connect to Azure services via Dapr components in the Azure portal](./dapr-component-connection.md) | Service Connector teams up with Dapr to provide an improved component creation feature in the Azure Container Apps portal. |

## Next steps

[Learn more about Dapr in Azure Container Apps.](./dapr-overview.md)