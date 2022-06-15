---
title: How to use Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to use Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Spring Cloud Gateway for Kubernetes

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use VMware Spring Cloud Gateway for VMware Kubernetes with Azure Spring Apps Enterprise Tier to route requests to your applications.

Spring Cloud Gateway for Kubernetes instances match requests to target endpoints using configured API routes. A route is assigned to each request by evaluating a number of conditions, called predicates. Each predicate may be evaluated against request headers and parameter values. All of the predicates associated with a route must evaluate to true for the route to be matched to the request. The route may also include a chain of filters, to modify the request before sending it to the target endpoint, or the received response.

To integrate with [API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md), Spring Cloud Gateway for Kubernetes automatically generates OpenAPI version 3 documentation after the route configuration gets changed.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier service instance with Spring Cloud Gateway for Kubernetes enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps Enterprise tier](quickstart-deploy-apps-enterprise.md#provision-a-service-instance).

  > [!NOTE]
  > To use Spring Cloud Gateway for Kubernetes, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

Spring Cloud Gateway for Kubernetes routes are configured using the following sections and steps.

## Configure routes

This section describes how to add, update, and manage API routes for apps that use Spring Cloud Gateway for Kubernetes.

### Define route config

The route definition includes the following parts:

- appResourceId: The full app resource ID to route traffic to
- routes: A list of route rules about how the traffic goes to one app

The following tables list the route definitions. All the properties are optional.

| Property | Description |
| - | - |
| title | A title, will be applied to methods in the generated OpenAPI documentation |
| description | A description, will be applied to methods in the generated OpenAPI documentation  |
| uri | Full uri, will override `appResourceId` |
| ssoEnabled | Enable SSO validation. See [Using Single Sign-on](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-single-sign-on-sso) |
| tokenRelay | Pass currently authenticated user's identity token to the application |
| predicates | A list of predicates. See [Available Predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-predicates) |
| filters | A list of filters. See [Available Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-filters) |
| order | Route processing order - a lower order is processed with higher precedence, same as [Spring Cloud Gateway OSS](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/) |
| tags | Classification tags, will be applied to methods in the generated OpenAPI documentation |

> [!NOTE]
> Not all the filters/predicates are supported in Azure Spring Apps because of security or compatibility reasons. The following aren't supported:
>
> - BasicAuth
> - JWTKey

## Using Routes for Spring Cloud Gateway for Kubernetes Example

Use the following steps to create an example application using Spring Cloud Gateway for Kubernetes.

1. To create an app in Azure Spring Apps which the Spring Cloud Gateway for Kubernetes would route traffic to, follow the instructions in the [Animal Rescue Sample App](https://github.com/Azure-Samples/animal-rescue) through [Build and Deploy Applications](https://github.com/Azure-Samples/animal-rescue#build-and-deploy-applications).

1. Assign a public endpoint to the gateway to access it.

   Select the **Spring Cloud Gateway** section, then select **Overview** to view the running state and resources given to Spring Cloud Gateway and its operator.

   Select **Yes** next to *Assign endpoint* to assign a public endpoint. You'll get a URL in a few minutes. Save the URL to use later.

   :::image type="content" source="media/enterprise/getting-started-enterprise/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps overview page with 'Assign endpoint' highlighted.":::

   You can also use CLI to do it, as shown in the following command:

   ```azurecli
   az spring gateway update --assign-endpoint
   ```

1. Configure routing rules to apps.

   Create rules to access apps deployed in the above step through Spring Cloud Gateway for Kubernetes.

   Save the following content to the *adoption-api.json* file.

   ```json
   [
      {
        "predicates": [
          "Path=/api/animals",
          "Method=GET"
        ],
        "filters": [
          "RateLimit=2,10s"
        ],
        "tags": [
          "pet adoption"
        ],
        "title": "Retrieve pets for adoption.",
        "description": "Retrieve all of the animals who are up for pet adoption."
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

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png" alt-text="Screenshot of Azure portal Azure Spring Apps Spring Cloud Gateway page showing 'Routing rules' pane.":::

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

## Commercial Filters

The open-source [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway) project includes a number of built-in filters for use in Gateway routes. Spring Cloud Gateway provides a number of custom filters in addition to those included in the OSS project.

### Filters Included In Spring Cloud Gateway OSS

Filters in Spring Cloud Gateway OSS can be used in Spring Cloud Gateway for Kubernetes. Spring Cloud Gateway OSS includes a number of GatewayFilter factories used to create filters for routes. For a complete list of these factories, see the [Spring Cloud Gateway OSS documentation](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories).

### Using Commercial Filters

The [Spring Cloud Gateway for Kubernetes Documentation](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-filters.html#filters-added-in-spring-cloud-gateway-for-kubernetes) includes examples for included commercial filters. These examples are written using Kubernetes resource definitions. The following example shows how to use the [AddRequestHeadersIfNotPresent](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-filters.html#add-request-headers-if-not-present) filter by converting the Kubernetes resource definition.

Given the following resource definition in yaml:

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

Convert `spec.routes` into json format as follows:

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

Then apply the route definition using following command in the Azure CLI:

```azurecli
az spring gateway route-config create \
    --name my-gateway-routes \
    --app myapp
    --routes-file <json-file-with-routes>
```

## Next steps

- [Azure Spring Apps](index.yml)
- [Quickstart: Build and deploy apps to Azure Spring Apps Enterprise tier](./quickstart-deploy-apps-enterprise.md)
