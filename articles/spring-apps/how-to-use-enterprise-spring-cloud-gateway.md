---
title: How to use VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan
description: Shows you how to use VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan to route requests to your applications.
author: KarlErickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/04/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Spring Cloud Gateway

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to use VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan to route requests to your applications.

[VMware Spring Cloud Gateway](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is a commercial VMware Tanzu component based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway handles cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

Spring Cloud Gateway includes the following features:

- Dynamic routing configuration, independent of individual applications that can be applied and changed without recompilation.
- Commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services.
- Client certificate authorization.
- Rate-limiting approaches.
- Circuit breaker configuration.
- Support for accessing application services via HTTP Basic Authentication credentials.

To integrate with [API portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md), VMware Spring Cloud Gateway automatically generates OpenAPI version 3 documentation after any route configuration additions or changes.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.0.67 or later. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.

## Configure routes

This section describes how to add, update, and manage API routes for apps that use Spring Cloud Gateway.

The route configuration definition includes the following parts:

- OpenAPI URI: This URI references an OpenAPI specification. You can use a public URI endpoint such as `https://petstore3.swagger.io/api/v3/openapi.json` or a constructed URI such as `http://<app-name>/{relative-path-to-OpenAPI-spec}`, where *`<app-name>`* is the name of an application in Azure Spring Apps that includes the API definition. Both OpenAPI 2.0 and OpenAPI 3.0 specs are supported. The specification displays in the API portal if enabled.
- routes: A list of route rules to direct traffic to apps and apply filters.
- protocol: The backend protocol of the application to which Spring Cloud Gateway routes traffic. The protocol's supported values are `HTTP` or `HTTPS`, and the default is `HTTP`. To secure traffic from Spring Cloud Gateway to your HTTPS-enabled application, you need to set the protocol to `HTTPS` in your route configuration.
- app level routes: There are three route properties that you can configure at the app level to avoid repetition across all or most of the routes in the route configuration. The concrete routing rule overrides the app level routing rule for the same property. You can define the following properties at the app level: `predicates`, `filters`, and `ssoEnabled`. If you use the `OpenAPI URI` feature to define routes, the only app level routing property to support is `filters`.

Use the following command to create a route config. The `--app-name` value should be the name of an app hosted in Azure Spring Apps that the requests route to.

```azurecli
az spring gateway route-config create \
    --name <route-config-name> \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --app-name <app-name> \
    --routes-file <routes-file.json>
```

The following example shows a JSON file that's passed to the `--routes-file` parameter in the create command:

```json
{
   "predicates": [
      "<app-level-predicate-of-route>",
   ],
   "ssoEnabled": false,
   "filters": [
      "<app-level-filter-of-route>",
   ],
   "openApi": {
      "uri": "<OpenAPI-URI>"
   },
   "protocol": "<protocol-of-routed-app>",
   "routes": [
      {
         "title": "<title-of-route>",
         "description": "<description-of-route>",
         "predicates": [
            "<predicate-of-route>",
         ],
         "ssoEnabled": true,
         "filters": [
            "<filter-of-route>",
         ],
         "tags": [
            "<tag-of-route>"
         ],
         "order": 0
      }
   ]
}
```

The following table lists the route definitions. All the properties are optional.

| Property    | Description                                                                                                                                                                            |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title       | A title to apply to methods in the generated OpenAPI documentation.                                                                                                                    |
| description | A description to apply to methods in the generated OpenAPI documentation.                                                                                                              |
| uri         | The full URI, which overrides the name of app that the requests route to.                                                                                                          |
| ssoEnabled  | A value that indicates whether to enable SSO validation. See [Configure single sign-on](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-single-sign-on).           |
| tokenRelay  | Passes the currently authenticated user's identity token to the application.                                                                                                           |
| predicates  | A list of predicates. See [Available Predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.2/scg-k8s/GUID-configuring-routes.html#available-predicates). |
| filters     | A list of filters. See [Available Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.2/scg-k8s/GUID-configuring-routes.html#available-filters).          |
| order       | The route processing order. A lower order is processed with higher precedence, as in [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/). |
| tags        | Classification tags that are applied to methods in the generated OpenAPI documentation.                                                                                            |

> [!NOTE]
> Because of security or compatibility reasons, not all the filters/predicates are supported in Azure Spring Apps. The following aren't supported:
>
> - BasicAuth
> - JWTKey

## Use routes for Spring Cloud Gateway

Use the following steps to create a sample application using Spring Cloud Gateway.

1. Use the following command to create a test application named *test-app* in Azure Spring Apps:

   ```azurecli
   az spring app create \
       name test-app \
       resource-group <resource-group-name> \
       service <Azure-Spring-Apps-instance-name>
   ```

1. Assign a public endpoint to the gateway to access it.

   To view the running state and resources given to Spring Cloud Gateway, open your Azure Spring Apps instance in the Azure portal, select the **Spring Cloud Gateway** section, then select **Overview**.

   To assign a public endpoint, select **Yes** next to **Assign endpoint**. A URL appears in a few minutes. Save the URL to use later.

   :::image type="content" source="media/how-to-use-enterprise-spring-cloud-gateway/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps overview page with 'Assign endpoint' highlighted." lightbox="media/how-to-use-enterprise-spring-cloud-gateway/gateway-overview.png":::

   You can also use Azure CLI to assign the endpoint. Use the following command to assign the endpoint.

   ```azurecli
   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --assign-endpoint true
   ```

1. Create a rule to access the health check endpoint of the test app through Spring Cloud Gateway.

   Save the following content to a *test-api.json* file. This configuration includes a RateLimit filter, which allows 20 requests every 10 seconds, and a RewritePath filter, which allows the request endpoint to reach the standard Spring Boot health check endpoint.

   ```json
   {
     "protocol": "HTTP",
     "routes": [
       {
         "title": "Test API",
         "description": "Retrieve a health check from our application",
         "predicates": [
           "Path=/test/api/healthcheck",
           "Method=GET"
         ],
         "filters": [
           "RateLimit=20,10s",
           "RewritePath=/api/healthcheck,/actuator/health"
         ],
         "tags": [
           "test"
         ]
       }
     ]
   }
   ```

   Then, use the following command to apply the rule to the app `test-app`:

   ```azurecli
   az spring gateway route-config create \
       --name test-api-routes \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --app-name test-app \
       --routes-file test-api.json
   ```

   You can also view the routes in the portal, as shown in the following screenshot:

   :::image type="content" source="media/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png" alt-text="Screenshot of Azure portal Azure Spring Apps Spring Cloud Gateway page showing 'Routing rules' pane." lightbox="media/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png":::

1. Use the following command to access the `test health check` API through the gateway endpoint:

   ```bash
   curl https://<endpoint-url>/test/api/healthcheck
   ```

1. Use the following commands to query the routing rules:

   ```azurecli
   az spring gateway route-config show \
       --name test-api-routes \
       --query '{appResourceId:properties.appResourceId, routes:properties.routes}'
       
   az spring gateway route-config list \
       --query '[].{name:name, appResourceId:properties.appResourceId, routes:properties.routes}'
   ```

## Use filters

The open-source [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) project includes many built-in filters for use in Gateway routes. Spring Cloud Gateway provides many custom filters in addition to the filters included in the OSS project.

The following example shows how to apply the `AddRequestHeadersIfNotPresent` filter to a route:

```json
[
  {
    "predicates": [
      "Path=/api/**",
      "Method=GET"
    ],
    "filters": [
      "AddRequestHeadersIfNotPresent=Content-Type:application/json,Connection:keep-alive"
    ]
  }
]
```

Then, apply the route definition using the following Azure CLI command:

```azurecli
az spring gateway route-config create \
    --name <route-config-name> \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --app <app-name>
    --routes-file <json-file-with-routes>
```

For more information on available route filters, see [How to use VMware Spring Cloud Gateway Route Filters with the Azure Spring Apps Enterprise plan](./how-to-configure-enterprise-spring-cloud-gateway-filters.md).

## Next steps

- [Azure Spring Apps](index.yml)
- [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](./quickstart-deploy-apps-enterprise.md)
