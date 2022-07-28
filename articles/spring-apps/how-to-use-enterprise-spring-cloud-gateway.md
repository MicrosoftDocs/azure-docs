---
title: How to use VMware Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise tier
description: Shows you how to use VMware Spring Cloud Gateway for VMware Kubernetes with Azure Spring Apps Enterprise tier to route requests to your applications.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 07/18/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Spring Cloud Gateway for Kubernetes

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use VMware Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise tier to route requests to your applications.

[Spring Cloud Gateway for Kubernetes](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is one of the commercial VMware Tanzu components. It's based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

Spring Cloud Gateway for Kubernetes also has the following features:

- Other commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services.
- Client certificate authorization.
- Rate-limiting approaches.
- Circuit breaker configuration.
- Support for accessing application services via HTTP Basic Authentication credentials.

To integrate with [API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md), Spring Cloud Gateway for Kubernetes automatically generates OpenAPI version 3 documentation after the route configuration gets changed.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier service instance with Spring Cloud Gateway for Kubernetes enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > To use Spring Cloud Gateway for Kubernetes, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

## Configure routes

This section describes how to add, update, and manage API routes for apps that use Spring Cloud Gateway for Kubernetes.

### Define route config

The route configuration definition includes the following parts:

- OpenAPI URI: The URI points to an OpenAPI specification. Both OpenAPI 2.0 and OpenAPI 3.0 specs are supported. The specification can be shown in API portal to try out. Two types of URI are accepted. The first type of URI is a public endpoint like `https://petstore3.swagger.io/api/v3/openapi.json`. The second type of URI is a constructed URL `http://<app-name>/{relative-path-to-OpenAPI-spec}`, where `app-name` is the name of an application in Azure Spring Apps that includes the API definition.
- routes: A list of route rules about how the traffic goes to one app.

Use the following command to create a route config. The `--app-name` value should be the name of an app hosted in Azure Spring Apps that the requests will route to.

```azurecli
az spring gateway route-config create \
    --name <route-config-name> \
    --app-name <app-name> \
    --routes-file <routes-file.json>
```

The following is an example of a JSON file that is passed to the `--routes-file` parameter in the create command:

```json
{
   "open_api": {
      "uri": "<OpenAPI-URI>"
   },
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

The following tables list the route definitions. All the properties are optional.

| Property    | Description                                                                                                                                                                            |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title       | A title to apply to methods in the generated OpenAPI documentation.                                                                                                                    |
| description | A description to apply to methods in the generated OpenAPI documentation.                                                                                                              |
| uri         | The full URI, which will override the name of app that requests route to.                                                                                                              |
| ssoEnabled  | A value that indicates whether to enable SSO validation. See [Configure single sign-on](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-single-sign-on-sso).           |
| tokenRelay  | Passes the currently authenticated user's identity token to the application.                                                                                                           |
| predicates  | A list of predicates. See [Available Predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-predicates). |
| filters     | A list of filters. See [Available Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-filters).          |
| order       | The route processing order. A lower order is processed with higher precedence, as in [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/). |
| tags        | Classification tags that will be applied to methods in the generated OpenAPI documentation.                                                                                            |

> [!NOTE]
> Because of security or compatibility reasons, not all the filters/predicates are supported in Azure Spring Apps. The following aren't supported:
>
> - BasicAuth
> - JWTKey

## Use routes for Spring Cloud Gateway for Kubernetes

Use the following steps to create an example application using Spring Cloud Gateway for Kubernetes.

1. To create an app in Azure Spring Apps that the Spring Cloud Gateway for Kubernetes would route traffic to, follow the instructions in the [Animal Rescue Sample App](https://github.com/Azure-Samples/animal-rescue) through the [Build and Deploy Applications](https://github.com/Azure-Samples/animal-rescue#build-and-deploy-applications) section.

1. Assign a public endpoint to the gateway to access it.

   To view the running state and resources given to Spring Cloud Gateway and its operator, select the **Spring Cloud Gateway** section, then select **Overview**.

   To assign a public endpoint, select **Yes** next to **Assign endpoint**. You'll get a URL in a few minutes. Save the URL to use later.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps overview page with 'Assign endpoint' highlighted." lightbox="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-overview.png":::

   You can also use Azure CLI to assign the endpoint, as shown in the following command:

   ```azurecli
   az spring gateway update --assign-endpoint
   ```

1. Configure routing rules to apps.

   Create rules to access apps deployed in the above step through Spring Cloud Gateway for Kubernetes.

   Save the following content to the *adoption-api.json* file.

   ```json
   [
      {
        "title": "Retrieve pets for adoption.",
        "description": "Retrieve all of the animals who are up for pet adoption.",
        "predicates": [
          "Path=/api/animals",
          "Method=GET"
        ],
        "filters": [
          "RateLimit=2,10s"
        ],
        "tags": [
          "pet adoption"
        ]
      }
   ]
   ```

   Use the following command to apply the rule to the app `animal-rescue-backend`:

   ```azurecli
   az spring gateway route-config create \
       --name adoption-api-routes \
       --app-name animal-rescue-backend \
       --routes-file adoption-api.json
   ```

   You can also view the routes in the portal.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png" alt-text="Screenshot of Azure portal Azure Spring Apps Spring Cloud Gateway page showing 'Routing rules' pane." lightbox="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png":::

1. Use the following command to access the `animal rescue backend` API through the gateway endpoint:

   ```bash
   curl https://<endpoint-url>/api/animals
   ```

1. Use the following commands to query the routing rules:

   ```azurecli
   az configure --defaults group=<resource group name> spring-cloud=<service name>
   az spring gateway route-config show \
       --name adoption-api-routes \
       --query '{appResourceId:properties.appResourceId, routes:properties.routes}'
   az spring gateway route-config list \
       --query '[].{name:name, appResourceId:properties.appResourceId, routes:properties.routes}'
   ```

## Commercial filters

The open-source [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) project includes a number of built-in filters for use in Gateway routes. Spring Cloud Gateway provides a number of custom filters in addition to those included in the OSS project.

### Filters included in Spring Cloud Gateway OSS

You can use Spring Cloud Gateway OSS filters in Spring Cloud Gateway for Kubernetes. Spring Cloud Gateway OSS includes a number of `GatewayFilter` factories that are used to create filters for routes. For a complete list of these factories, see the [GatewayFilter Factories](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories) section in the Spring Cloud Gateway documentation.

### Use commercial filters

For examples of commercial filters, see [Commercial Route Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-filters.html#filters-added-in-spring-cloud-gateway-for-kubernetes) in the Spring Cloud Gateway for Kubernetes documentation. These examples are written using Kubernetes resource definitions.

The following example shows how to use the [AddRequestHeadersIfNotPresent](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-filters.html#add-request-headers-if-not-present) filter by converting the Kubernetes resource definition.

Start with the following resource definition in YAML:

```yml
apiVersion: "tanzu.vmware.com/v1"
kind: SpringCloudGatewayRouteConfig
metadata:
  name: my-gateway-routes
spec:
  service:
    name: myapp
  routes:
  - predicates:
      - Path=/api/**
    filters:
      - AddRequestHeadersIfNotPresent=Content-Type:application/json,Connection:keep-alive
```

Then, convert `spec.routes` into the following JSON format:

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
    --name my-gateway-routes \
    --app myapp
    --routes-file <json-file-with-routes>
```

## Next steps

- [Azure Spring Apps](index.yml)
- [Quickstart: Build and deploy apps to Azure Spring Apps Enterprise tier](./quickstart-deploy-apps-enterprise.md)
