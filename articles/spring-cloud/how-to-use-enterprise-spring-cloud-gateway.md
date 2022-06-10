---
title: How to use Spring Cloud Gateway for Tanzu with Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to use Spring Cloud Gateway for Tanzu with Azure Spring Apps Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Spring Cloud Gateway for Tanzu

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use Spring Cloud Gateway for VMware Tanzu® with Azure Spring Apps Enterprise Tier to route requests to your applications.

[Spring Cloud Gateway for Tanzu](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is one of the commercial VMware Tanzu components. It's based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles cross-cutting concerns for API development teams, such as Single Sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

Spring Cloud Gateway for Tanzu also has other commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services, client certificate authorization, rate-limiting approaches, circuit breaker configuration, and support for accessing application services via HTTP Basic Authentication credentials.

To integrate with [API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md), Spring Cloud Gateway for Tanzu automatically generates OpenAPI version 3 documentation after the route configuration gets changed.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier service instance with Spring Cloud Gateway for Tanzu enabled. For more information, see [Quickstart: Provision an Azure Spring Apps service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).

  > [!NOTE]
  > To use Spring Cloud Gateway for Tanzu, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

Spring Cloud Gateway for Tanzu is configured using the following sections and steps.

## Configure routes

This section describes how to add, update, and manage API routes for apps that use Spring Cloud Gateway for Tanzu.

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
| ssoEnabled | Enable SSO validation. See "Using Single Sign-on" |
| tokenRelay | Pass currently authenticated user's identity token to application service |
| predicates | A list of predicates. See [Available Predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-predicates) and [Commercial Route Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-predicates.html)|
| filters | A list of filters. See [Available Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-filters) and [Commercial Route Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-filters.html)|
| order | Route processing order, same as Spring Cloud Gateway for Tanzu |
| tags | Classification tags, will be applied to methods in the generated OpenAPI documentation |

Not all the filters/predicates are supported in Azure Spring Apps because of security/compatible reasons. The following aren't supported:

- BasicAuth
- JWTKey

## Create an example application

Use the following steps to create an example application using Spring Cloud Gateway for Tanzu.

1. To create an app in Azure Spring Apps which the Spring Cloud Gateway for Tanzu would route traffic to, follow the instructions in [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md). Select `customers-service` for this example.

1. Assign a public endpoint to the gateway to access it.

   Select the **Spring Cloud Gateway** section, then select **Overview** to view the running state and resources given to Spring Cloud Gateway and its operator.

   Select **Yes** next to *Assign endpoint* to assign a public endpoint. You'll get a URL in a few minutes. Save the URL to use later.

   :::image type="content" source="media/enterprise/getting-started-enterprise/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps overview page with 'Assign endpoint' highlighted.":::

   You can also use CLI to do it, as shown in the following command:

   ```azurecli
   az spring gateway update --assign-endpoint
   ```

1. Use the following command to configure Spring Cloud Gateway for Tanzu properties:

   ```azurecli
   az spring gateway update \
       --api-description "<api-description>" \
       --api-title "<api-title>" \
       --api-version "v0.1" \
       --server-url "<endpoint-in-the-previous-step>" \
       --allowed-origins "*"
   ```

   You can also view those properties in the portal.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-configuration.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Spring Cloud Gateway page with Configuration pane showing.":::

1. Configure routing rules to apps.

   Create rules to access apps deployed in the above step through Spring Cloud Gateway for Tanzu.

   Save the following content to the *customers-service.json* file.

   ```json
   [
      {
         "title": "Customers service",
         "description": "Route to customer service",
         "predicates": [
            "Path=/api/customers-service/owners"
         ],
         "filters": [
            "StripPrefix=2"
         ],
         "tags": [
            "pet clinic"
         ]
      }
   ]
   ```

   Use the following command to apply the rule to the app `customers-service`:

   ```azurecli
   az spring gateway route-config create \
       --name customers-service-rule \
       --app-name customers-service \
       --routes-file customers-service.json
   ```

   You can also view the routes in the portal.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png" alt-text="Screenshot of Azure portal Azure Spring Apps Spring Cloud Gateway page showing 'Routing rules' pane.":::

1. Use the following command to access the `customers service` and `owners` APIs through the gateway endpoint:

   ```bash
   curl https://<endpoint-url>/api/customers-service/owners
   ```

1. Use the following command to query the routing rules:

   ```azurecli
   az configure --defaults group=<resource group name> spring-cloud=<service name>
   az spring gateway route-config show \
       --name customers-service-rule \
       --query '{appResourceId:properties.appResourceId, routes:properties.routes}'
   az spring gateway route-config list \
       --query '[].{name:name, appResourceId:properties.appResourceId, routes:properties.routes}'
   ```

## Next steps

- [Azure Spring Apps](index.yml)
