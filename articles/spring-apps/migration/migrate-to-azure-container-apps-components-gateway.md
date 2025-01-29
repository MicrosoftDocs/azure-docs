---
title: Migrate Spring Cloud Gateway for Tanzu to Managed Gateway for Spring in Azure Container Apps
description: Describes how to migrate Spring Cloud Gateway for Tanzu to managed Gateway for Spring in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Spring Cloud Gateway for Tanzu to managed Gateway for Spring in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to migrate VMware Spring Cloud Gateway in Azure Spring Apps Enterprise plan to managed Gateway for Spring in Azure Container Apps using the Azure CLI.

## Prerequisites

- An existing Azure Spring Apps Enterprise plan instance with Spring Cloud Gateway enabled.
- An existing Azure container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).
- [Azure CLI](/cli/azure/install-azure-cli).

## Provision managed Gateway for Spring

Use the following command to provision the Gateway for Spring Java component in the Azure Container Apps environment that you created in the prerequisites:

```azurecli
az containerapp env java-component gateway-for-spring create \
    --resource-group <resource-group-name> \
    --name <gateway-name> \
    --environment <azure-container-app-environment-name>
```

After you successfully create the component, you can see that the **Provisioning State** value for Spring Cloud Gateway is **Succeeded**.

### Resource management

The container resource allocation for the Gateway for Spring in Azure Container Apps is fixed to the following values:

- **CPU**: 0.5 vCPU
- **Memory**: 1 Gi

To configure the instance count for Gateway for Spring, use the parameters `--min-replicas` and `--max-replicas`, setting both to the same value. This configuration ensures that the instance count remains fixed. The system currently doesn't support dynamic autoscaling configurations.

## Configure Gateway for Spring

After you provision the gateway, the next step is to configure it for smooth migration.

You can update the configuration and routes of the Gateway for Spring component by using the `update` command, as shown in the following example:

```azurecli
az containerapp env java-component gateway-for-spring update \
    --resource-group <resource-group-name> \
    --name <gateway-name> \
    --environment <azure-container-app-environment-name> \
    --configuration <configuration-key>="<configuration-value>" \
    --route-yaml <path-to-route-YAML-file>
```

### CORS configuration

To migrate the global Cross-Origin Resource Sharing (CORS) configuration of VMware Spring Cloud Gateway, you need to map properties into the format `<configuration-key>="<configuration-value>"`. The mapping relation is shown in the following table:

| Property name in VMware Spring Cloud Gateway | Configuration in Gateway for Spring                                                     |
|----------------------------------------------|-----------------------------------------------------------------------------------------|
| Allowed origins                              | `spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOrigins[<id>]`        |
| Allowed origin patterns                      | `spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOriginPatterns[<id>]` |
| Allowed methods                              | `spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods[<id>]`        |
| Allowed headers                              | `spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedHeaders[<id>]`        |
| Max age                                      | `spring.cloud.gateway.globalcors.cors-configurations.[/**].maxAge`                      |
| Allow credentials                            | `spring.cloud.gateway.globalcors.cors-configurations.[/**].allowCredentials`            |
| Exposed headers                              | `spring.cloud.gateway.globalcors.cors-configurations.[/**].exposedHeaders[<id>]`        |

For example, if you have a configuration like `allowedOrigins:["https://example.com","https://example1.com"]` in VMware Spring Cloud Gateway, you should update Gateway for Spring with the following parameter:

```azurecli
--configuration spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOrigins[0]=https://example.com spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOrigins[1]=https://example1.com
```

For per route CORS configuration, you need to replace the "/**" in the configuration key as the route path. For example, if you have a route with path `/v1/**`, you should configure `spring.cloud.gateway.globalcors.cors-configurations.[/v1/**].allowedOrigins[<id>]`.

### Routes

The Gateway for Spring component supports defining routes through the `id`, `uri`, `predicates`, and `filters` properties, as shown in the following example:

```yaml
springCloudGatewayRoutes:
  - id: "route1"
    uri: "https://otherjavacomponent.myenvironment.test.net"
    predicates:
      - "Path=/v1/{path}"
      - "After=2024-01-01T00:00:00.000-00:00[America/Denver]"
    filters:
      - "SetPath=/{path}"
  - id: "route2"
    uri: "https://otherjavacomponent.myenvironment.test.net"
    predicates:
      - "Path=/v2/{path}"
      - "After=2024-01-01T00:00:00.000-00:00[America/Denver]"
    filters:
      - "SetPath=/{path}"
```

The following list describes the mapping relationship between routes of VMware Spring Cloud Gateway and routes of Gateway for Spring:

- The `name` of the route is mapped to `id`.
- The `appName` and `protocol` are mapped to the URI of the route, which should be the accessible URI for the Azure Container Apps instance.
- Spring Cloud Gateway predicates and filters are mapped to Gateway for Spring predicates and filters.

For example, suppose the following route config json file, called **test-api.json** is created for VMware Spring Cloud Gateway:

```json
{
  "protocol": "HTTP",
  "routes": [
    {
      "title": "Test API",
      "predicates": [
        "Path=/test/api/healthcheck",
        "Method=GET"
      ],
      "filters": [
        "AddResponseHeader=X-Response-Red, Blue"
      ]
    }
  ]
}
```

And, suppose you use the following command to apply the rule to the Azure Spring Apps app `test-app`:

```azurecli
az spring gateway route-config create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name test-api \
    --app-name test-app \
    --routes-file test-api.json
```

Then, the following example shows the corresponding route YAML file **test-api.yml** for Gateway for Spring on Azure Container Apps:

```yaml
springCloudGatewayRoutes:
  - id: "test-api"
    uri: "<app-fqdn-in-Container-Apps>"
    predicates:
      - Path=/test/api/healthcheck
      - Method=GET
    filters:
      - AddResponseHeader=X-Response-Red, Blue
```

And, you would use the following command to update the container app:

```azurecli
az containerapp env java-component gateway-for-spring update \
    --route-yaml test-api.yml
```

You need to enable ingress for your Azure Container App application to obtain its fully qualified domain name (FQDN). Then, replace `<app-FQDN-in-Azure-Container-Apps>` in the route's URI with the app's accessible endpoint. The URI format is `https://<app-name>.<container-app-env-name>.<region>.azurecontainerapps.io`.

There are some [commercial predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-predicates.html) and [commercial filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-filters.html) that aren't supported on Gateway for Spring on Azure Container Apps.

### Response cache

If you enable the response cache globally, you can update the managed Gateway for Spring with the following configuration:

```properties
spring.cloud.gateway.filter.local-response-cache.enabled=true
spring.cloud.gateway.filter.local-response-cache.time-to-live=<response-cache-ttl>
spring.cloud.gateway.filter.local-response-cache.size=<response-cache-size>
```

If you enable the response cache for the route, you can use the `LocalResponseCache` filter in the routing rule configuration of managed Gateway for Spring as the following YAML:

```yaml
springCloudGatewayRoutes:
  - id: "test-api"
    uri: "<app-fqdn-in-Container-Apps>"
    predicates:
      - Path=/v1/**
      - Method=GET
    filters:
      - LocalResponseCache=3m, 1MB
```

## Troubleshooting

You can view logs of Gateway for Spring in Azure Container Apps using `Log Analytics` by using the following steps:

1. In the Azure portal, navigate to your Azure Container Apps environment.
1. In the navigation pane, select **Monitoring** > **Logs**.
1. To view logs, query the `ContainerAppSystemLogs_CL` table using the query editor, as shown in the following example:

   ```kusto
   ContainerAppSystemLogs_CL
   | where ComponentType_s == "SpringCloudGateway"
   | project Time=TimeGenerated, ComponentName=ComponentName_s, Message=Log_s
   | take 100
   ```

For more information about querying logs, see [Observability of managed Java components in Azure Container Apps](../../container-apps/java-component-logs.md).

## Known limitation

For now, Gateway for Spring on Azure Container Apps doesn't support certain commercial features, including metadata used to generate OpenAPI documentation, single sign-on (SSO), and application performance monitoring (APM) integration.

There's a known issue where enabling Gateway for Spring prevents the **Services** section from opening in the Azure portal. We expect to resolve this issue soon.
