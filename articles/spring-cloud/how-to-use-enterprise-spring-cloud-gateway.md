---
title: How to use Spring Cloud Gateway for Tanzu with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to use Spring Cloud Gateway for Tanzu with Azure Spring Cloud Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Use Spring Cloud Gateway for Tanzu

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use Spring Cloud Gateway for VMware Tanzu® with Azure Spring Cloud Enterprise Tier.

[Spring Cloud Gateway for Tanzu](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is one of the commercial VMware Tanzu components. It's based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles cross-cutting concerns for API development teams, such as Single Sign-On (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

Spring Cloud Gateway for Tanzu also has other commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services, client certificate authorization, rate-limiting approaches, circuit breaker configuration, and support for accessing application services via HTTP Basic Authentication credentials.

To integrate with [API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md), Spring Cloud Gateway for Tanzu automatically generates OpenAPI version 3 documentation after the route configuration gets changed.

## Prerequisites

- An already provisioned Azure Spring Cloud Enterprise tier service instance with Spring Cloud Gateway for Tanzu enabled. For more information, see [Quickstart: Provision an Azure Spring Cloud service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).

  > [!NOTE]
  > To use Spring Cloud Gateway for Tanzu, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable it after provisioning at this time.

- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

## How Spring Cloud Gateway for Tanzu works

Spring Cloud Gateway for Tanzu has two components: Spring Cloud Gateway for Tanzu operator and Spring Cloud Gateway for Tanzu instance. The operator is responsible for the lifecycle of Spring Cloud Gateway for Tanzu instances and routing rules. It's transparent to the developer and Azure Spring Cloud will manage it.

Spring Cloud Gateway for Tanzu instance routes traffic according to rules. It supports rich features, and you can customize it using the sections below. Both scale in/out and up/down are supported to meet dynamic traffic load.

Default resource usage:

| Component name                          | Instance count | vCPU per instance | Memory per instance |
|-----------------------------------------|----------------|-------------------|---------------------|
| Spring Cloud Gateway for Tanzu          | 2              | 1 core            | 2Gi                 |
| Spring Cloud Gateway for Tanzu operator | 2              | 1 core            | 2Gi                 |

## Configure Spring Cloud Gateway for Tanzu

Spring Cloud Gateway for Tanzu is configured using the following sections and steps.

### Configure Spring Cloud Gateway for Tanzu metadata

Spring Cloud Gateway for Tanzu metadata is used to automatically generate OpenAPI version 3 documentation so that the [API portal](./how-to-use-enterprise-api-portal.md) can gather information to show the route groups.

| Property | Description |
| - | - |
| title | Title describing the context of the APIs available on the Gateway instance (default: `Spring Cloud Gateway for K8S`) |
| description | Detailed description of the APIs available on the Gateway instance (default: `Generated OpenAPI 3 document that describes the API routes configured for '[Gateway instance name]' Spring Cloud Gateway instance deployed under '[namespace]' namespace.`) |
| documentation | Location of more documentation for the APIs available on the Gateway instance |
| version | Version of APIs available on this Gateway instance (default: `unspecified`) |
| serverUrl | Base URL that API consumers will use to access APIs on the Gateway instance |

> [!NOTE]
> `serverUrl` is mandatory if you want to integrate with [API portal](./how-to-use-enterprise-api-portal.md).

### Configure cross-origin resource sharing (CORS)

Cross-origin resource sharing (CORS) allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.

| Property | Description |
| - | - |
| allowedOrigins | Allowed origins to make cross-site requests |
| allowedMethods | Allowed HTTP methods on cross-site requests |
| allowedHeaders |  Allowed headers in cross-site request |
| maxAge | How long, in seconds, the response from a pre-flight request can be cached by clients |
| allowCredentials | Whether user credentials are supported on cross-site requests |
| exposedHeaders | HTTP response headers to expose for cross-site requests |

> [!NOTE]
> Be sure you have the correct CORS configuration if you want to integrate with the [API portal](./how-to-use-enterprise-api-portal.md). For an example, see the [Create an example application](#create-an-example-application) section.

### Configure single sign-on (SSO)

Spring Cloud Gateway for Tanzu supports authentication and authorization using Single Sign-On (SSO) with an OpenID identity provider (IdP) which supports OpenID Connect Discovery protocol.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that is asserted as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

To setup SSO with Azure AD, see [How to set up Single Sign-On with Azure AD for Spring Cloud Gateway and API Portal for Tanzu](./how-to-setup-sso-with-azure-ad.md).

> [!NOTE]
> Only authorization servers supporting OpenID Connect Discovery protocol are supported. Also, be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.
>
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.
>
> After configuring SSO, remember to set `ssoEnabled=true` for the Spring Cloud Gateway routes.

### Requested resource

Customization of the resource usage for Spring Cloud Gateway for Tanzu instances is supported, including vCpu, memory, and instance count.

> [!NOTE]
> For high available consideration, single replica is not recommended.

## Configure routes

This section describes how to add, update, and manage API routes for apps that use Spring Cloud Gateway for Tanzu.

### Define route config

The route definition includes the following parts:

- appResourceId: The full app resource id to route traffic to
- routes: A list of route rules about how the traffic goes to one app

The following tables list the route definitions. All the properties are optional.

| Property | Description |
| - | - |
| title | A title, will be applied to methods in the generated OpenAPI documentation |
| description | A description, will be applied to methods in the generated OpenAPI documentation  |
| uri | Full uri, will override `appResourceId` |
| ssoEnabled | Enable SSO validation. See "Using Single Sign-On" |
| tokenRelay | Pass currently authenticated user's identity token to application service |
| predicates | A list of predicates. See [Available Predicates](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-predicates) and [Commercial Route Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-predicates.html)|
| filters | A list of filters. See [Available Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-configuring-routes.html#available-filters) and [Commercial Route Filters](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.0/scg-k8s/GUID-route-filters.html)|
| order | Route processing order, same as Spring Cloud Gateway for Tanzu |
| tags | Classification tags, will be applied to methods in the generated OpenAPI documentation |

Not all the filters/predicates are supported in Azure Spring Cloud because of security/compatible reasons. The following are not supported:

- BasicAuth
- JWTKey

## Create an example application

Use the following steps to create an example application using Spring Cloud Gateway for Tanzu.

1. To create an app in Azure Spring Cloud which the Spring Cloud Gateway for Tanzu would route traffic to, follow the instructions in [Quickstart: Build and deploy apps to Azure Spring Cloud using the Enterprise tier](quickstart-deploy-apps-enterprise.md). Select `customers-service` for this example.

1. Assign a public endpoint to the gateway to access it.

   Select the **Spring Cloud Gateway** section, then select **Overview** to view the running state and resources given to Spring Cloud Gateway and its operator.

   Select **Yes** next to *Assign endpoint* to assign a public endpoint. You'll get a URL in a few minutes. Save the URL to use later.

   :::image type="content" source="media/enterprise/getting-started-enterprise/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Cloud overview page with 'Assign endpoint' highlighted.":::

   You can also use CLI to do it, as shown in the following command:

   ```azurecli
   az spring-cloud gateway update --assign-endpoint
   ```

1. Use the following command to configure Spring Cloud Gateway for Tanzu properties:

   ```azurecli
   az spring-cloud gateway update \
       --api-description "<api-description>" \
       --api-title "<api-title>" \
       --api-version "v0.1" \
       --server-url "<endpoint-in-the-previous-step>" \
       --allowed-origins "*"
   ```

   You can also view those properties in the portal.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-configuration.png" alt-text="Screenshot of Azure portal showing Azure Spring Cloud Spring Cloud Gateway page with Configuration pane showing.":::

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
   az spring-cloud gateway route-config create \
       --name customers-service-rule \
       --app-name customers-service \
       --routes-file customers-service.json
   ```

   You can also view the routes in the portal.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png" alt-text="Screenshot of Azure portal Azure Spring Cloud Spring Cloud Gateway page showing 'Routing rules' pane.":::

1. Use the following command to access the `customers service` and `owners` APIs through the gateway endpoint:

   ```bash
   curl https://<endpoint-url>/api/customers-service/owners
   ```

1. Use the following command to query the routing rules:

   ```azurecli
   az configure --defaults group=<resource group name> spring-cloud=<service name>
   az spring-cloud gateway route-config show \
       --name customers-service-rule \
       --query '{appResourceId:properties.appResourceId, routes:properties.routes}'
   az spring-cloud gateway route-config list \
       --query '[].{name:name, appResourceId:properties.appResourceId, routes:properties.routes}'
   ```

## Next steps

- [Azure Spring Cloud](index.yml)
