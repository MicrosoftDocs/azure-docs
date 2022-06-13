---
title: How to Configure Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to Configure Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Configure Spring Cloud Gateway for Kubernetes

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use VMware Spring Cloud Gateway for Kubernetes with Azure Spring Apps Enterprise Tier.

[Spring Cloud Gateway for Kubernetes](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is one of the commercial VMware Tanzu components. It's based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Kubernetes handles cross-cutting concerns for API development teams, such as Single Sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

Spring Cloud Gateway for Kubernetes also has other commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services, client certificate authorization, rate-limiting approaches, circuit breaker configuration, and support for accessing application services via HTTP Basic Authentication credentials.

To integrate with [API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md), Spring Cloud Gateway for Kubernetes automatically generates OpenAPI version 3 documentation after the route configuration gets changed.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier service instance with Spring Cloud Gateway for Kubernetes enabled. For more information, see [Quickstart: Provision an Azure Spring Apps service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).

  > [!NOTE]
  > To use Spring Cloud Gateway for Kubernetes, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

## How Spring Cloud Gateway for Kubernetes works

Spring Cloud Gateway for Kubernetes has two components: Spring Cloud Gateway for Kubernetes operator and Spring Cloud Gateway for Kubernetes instance. The operator is responsible for the lifecycle of Spring Cloud Gateway for Kubernetes instances and routing rules. It's transparent to the developer and Azure Spring Apps will manage it.

Spring Cloud Gateway for Kubernetes instance routes traffic according to rules. It supports rich features, and you can customize it using the sections below. Both scale in/out and up/down are supported to meet dynamic traffic load.

Default resource usage:

| Component name                          | Instance count | vCPU per instance | Memory per instance |
|-----------------------------------------|----------------|-------------------|---------------------|
| Spring Cloud Gateway for Kubernetes          | 2              | 1 core            | 2Gi                 |
| Spring Cloud Gateway for Kubernetes operator | 2              | 1 core            | 2Gi                 |

## Configure Spring Cloud Gateway for Kubernetes

Spring Cloud Gateway for Kubernetes is configured using the following sections and steps.

### Configure Spring Cloud Gateway for Kubernetes metadata

Spring Cloud Gateway for Kubernetes metadata is used to automatically generate OpenAPI version 3 documentation so that the [API portal](./how-to-use-enterprise-api-portal.md) can gather information to show the route groups.

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

### Configure single Sign-on (SSO)

Spring Cloud Gateway for Kubernetes supports authentication and authorization using Single Sign-on (SSO) with an OpenID identity provider (IdP) which supports OpenID Connect Discovery protocol.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that is asserted as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

To set up SSO with Azure AD, see [How to set up Single Sign-on with Azure AD for Spring Cloud Gateway and API Portal for Tanzu](./how-to-set up-sso-with-azure-ad.md).

> [!NOTE]
> Only authorization servers supporting OpenID Connect Discovery protocol are supported. Also, be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.
>
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.
>
> After configuring SSO, remember to set `ssoEnabled=true` for the Spring Cloud Gateway routes.

### Requested resource

Customization of the resource usage for Spring Cloud Gateway for Kubernetes instances is supported, including vCpu, memory, and instance count.

> [!NOTE]
> For high available consideration, single replica is not recommended.

## Configuring Spring Cloud Gateway Example

Use the following steps to assign an endpoint to Spring Cloud Gateway and configure its properties.

1. Assign a public endpoint to the gateway to access it.

   Select the **Spring Cloud Gateway** section, then select **Overview** to view the running state and resources given to Spring Cloud Gateway and its operator.

   Select **Yes** next to *Assign endpoint* to assign a public endpoint. You'll get a URL in a few minutes. Save the URL to use later.

   :::image type="content" source="media/enterprise/getting-started-enterprise/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps overview page with 'Assign endpoint' highlighted.":::

   You can also use CLI to do it, as shown in the following command:

   ```azurecli
   az spring gateway update --assign-endpoint
   ```

1. Use the following command to configure Spring Cloud Gateway for Kubernetes properties:

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

## Next steps

- [Azure Spring Apps](index.yml)
- [How to Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md)
