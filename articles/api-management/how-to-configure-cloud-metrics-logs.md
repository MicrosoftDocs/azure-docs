---
title: Configure cloud metrics and logs for Azure API Management self-hosted gateway | Microsoft Docs
description: Learn how to configure cloud metrics and logs for Azure API Management self-hosted gateway
services: api-management
documentationcenter: ''
author: miaojiang
manager: gwallace
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 04/30/2020
ms.author: apimpm

---

# Configure cloud metrics and logs for Azure API Management self-hosted gateway

This article provides details for configuring cloud metrics and logs for the [self-hosted gateway](./self-hosted-gateway-overview.md).

The self-hosted gateway has to be associated with an API management service and requires outbound TCP/IP connectivity to Azure on port 443. The gateway leverages the outbound connection to send telemetry to Azure, if configured to do so. 

## Metrics
By default, the self-hosted gateway emits a number of metrics through [Azure Monitor](https://azure.microsoft.com/services/monitor/), same as the managed gateway [in the cloud](api-management-howto-use-azure-monitor.md). 

The feature can be enabled or disabled using the `telemetry.metrics.cloud` key in the ConfigMap of the gateway Deployment. Below is a breakdown of the available configurations:

| Field  | Default | Description |
| ------------- | ------------- | ------------- |
| telemetry.metrics.cloud  | `true` | Enables logging through Azure Monitor. Value can be `true`, `false`. |


Here is a sample configuration:

```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
        name: contoso-gateway-environment
    data:
        config.service.endpoint: "<contoso-gateway-management-endpoint>"
        telemetry.metrics.cloud: "true"
```

The self-hosted gateway currently emits the following metrics through Azure Monitor:

| Metric  | Description |
| ------------- | ------------- |
| Requests  | Number of API requests in the period |
| Duration of gateway requests | Number of milliseconds from the moment gateway received request until the moment response sent in full |
| Duration of backend requests | Number of milliseconds spent on overall backend IO (connecting, sending and receiving bytes)  |

## Logs

The self-hosted gateway currently does not send [diagnostic logs](https://docs.microsoft.com/azure/api-management/api-management-howto-use-azure-monitor#diagnostic-logs) to the cloud. However, it is possible to [configure and persist logs locally](how-to-configure-local-metrics-logs.md) where the self-hosted gateway is deployed. 

If a gateway is deployed in [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/), you can enable [Azure Monitor for containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview) to collect logs from your containers and view them in Log Analytics. 


## Next steps

* To learn more about the self-hosted gateway, see [Azure API Management self-hosted gateway overview](self-hosted-gateway-overview.md)
* Learn about [configuring and persisting logs locally](how-to-configure-local-metrics-logs.md)


