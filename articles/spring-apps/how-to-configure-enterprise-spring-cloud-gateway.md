---
title: How to configure VMware Spring Cloud Gateway with Azure Spring Apps Enterprise tier
description: Shows you how to configure VMware VMware Spring Cloud Gateway with Azure Spring Apps Enterprise tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 11/04/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Configure VMware Spring Cloud Gateway

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to configure VMware Spring Cloud Gateway with Azure Spring Apps Enterprise tier.

[VMware Spring Cloud Gateway](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is a commercial VMware Tanzu component based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

A Spring Cloud Gateway instance routes traffic according to rules. Both *scale in/out* and *up/down* are supported to meet a dynamic traffic load.

VMware Spring Cloud Gateway includes the following features:

- Dynamic routing configuration, independent of individual applications that can be applied and changed without recompilation.
- Commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services.
- Client certificate authorization.
- Rate-limiting approaches.
- Circuit breaker configuration.
- Support for accessing application services via HTTP Basic Authentication credentials.

To integrate with [API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md), VMware Spring Cloud Gateway automatically generates OpenAPI version 3 documentation after any route configuration additions or changes.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier service instance with VMware Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > To use VMware Spring Cloud Gateway, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

## Configure Spring Cloud Gateway

This section describes how to assign an endpoint to Spring Cloud Gateway and configure its properties.

To view the running state and resources given to Spring Cloud Gateway and its operator, open your Azure Spring Apps instance in the Azure portal, select the **Spring Cloud Gateway** section, then select **Overview**.

To assign a public endpoint, select **Yes** next to **Assign endpoint**. You'll get a URL in a few minutes. Save the URL to use later.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps overview page with 'Assign endpoint' highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-overview.png":::

You can also use Azure CLI to assign the endpoint, as shown in the following command:

```azurecli
az spring gateway update --assign-endpoint
```

## Configure VMware Spring Cloud Gateway metadata

VMware Spring Cloud Gateway metadata is used to automatically generate OpenAPI version 3 documentation so that the [API portal](./how-to-use-enterprise-api-portal.md) can gather information to show the route groups. The available metadata options are described in the following table.

| Property      | Description                                                                                                                                                                                                                                                                 |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title         | A title describing the context of the APIs available on the Gateway instance. The default value is *Spring Cloud Gateway for K8S*.                                                                                                                                          |
| description   | A detailed description of the APIs available on the Gateway instance. The default value is *Generated OpenAPI 3 document that describes the API routes configured for '\[Gateway instance name\]' Spring Cloud Gateway instance deployed under '\[namespace\]' namespace.*. |
| documentation | The location of more documentation for the APIs available on the Gateway instance.                                                                                                                                                                                          |
| version       | The version of APIs available on this Gateway instance. The default value is *unspecified*.                                                                                                                                                                                 |
| serverUrl     | The base URL that API consumers will use to access APIs on the Gateway instance.                                                                                                                                                                                            |

> [!NOTE]
> `serverUrl` is mandatory if you want to integrate with [API portal](./how-to-use-enterprise-api-portal.md).

Use the following command to configure VMware Spring Cloud Gateway metadata properties:

```azurecli
az spring gateway update \
    --api-description "<api-description>" \
    --api-title "<api-title>" \
    --api-version "v0.1" \
    --server-url "<endpoint-in-the-previous-step>" \
    --allowed-origins "*"
```

You can also view or edit these properties in the Azure portal, as shown in the following screenshot.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-configuration.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Spring Cloud Gateway page with Configuration pane showing." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-configuration.png":::

## Configure single sign-on (SSO)

VMware Spring Cloud Gateway supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) which supports OpenID Connect Discovery protocol.

| Property       | Required? | Description                                                                                                                                                                                                                                                                                                          |
|----------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `issuerUri`    | Yes       | The URI that is asserted as its Issuer Identifier. For example, if the `issuer-uri` provided is `https://example.com`, then an OpenID Provider Configuration Request will be made to `https://example.com/.well-known/openid-configuration`. The result is expected to be an OpenID Provider Configuration Response. |
| `clientId`     | Yes       | The OpenID Connect client ID provided by your IdP.                                                                                                                                                                                                                                                                   |
| `clientSecret` | Yes       | The OpenID Connect client secret provided by your IdP.                                                                                                                                                                                                                                                               |
| `scope`        | Yes       | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider.                                                                                                                                                                                       |

To set up SSO with Azure AD, see [How to set up single sign-on with Azure Active Directory for Spring Cloud Gateway and API Portal](./how-to-set-up-sso-with-azure-ad.md).

Use the following command to configure SSO properties for VMware Spring Cloud Gateway:

```azurecli
az spring gateway update \
    --client-id <client-id> \
    --client-secret <client-secret> \
    --issuer-uri <issuer-uri> \
    --scope <scope>
```

You can also view or edit those properties in the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-sso-configuration.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Spring Cloud Gateway page with Configuration pane showing including Single Sign On Configuration." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-sso-configuration.png":::

> [!NOTE]
> Only authorization servers supporting OpenID Connect Discovery protocol are supported. Also, be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.
>
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.
>
> After configuring SSO, remember to set `ssoEnabled: true` for the Spring Cloud Gateway routes.

## Configure cross-origin resource sharing (CORS)

Cross-origin resource sharing (CORS) allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. The available CORS configuration options are described in the following table.

| Property         | Description                                                                            |
|------------------|----------------------------------------------------------------------------------------|
| allowedOrigins   | Allowed origins to make cross-site requests.                                           |
| allowedMethods   | Allowed HTTP methods on cross-site requests.                                           |
| allowedHeaders   | Allowed headers in cross-site request.                                                 |
| maxAge           | How long, in seconds, the response from a pre-flight request can be cached by clients. |
| allowCredentials | Whether user credentials are supported on cross-site requests.                         |
| exposedHeaders   | HTTP response headers to expose for cross-site requests.                               |

> [!NOTE]
> Be sure you have the correct CORS configuration if you want to integrate with the [API portal](./how-to-use-enterprise-api-portal.md). For an example, see the [Configure Spring Cloud Gateway](#configure-spring-cloud-gateway) section.

## Use service scaling

Customization of resource allocation for Spring Cloud Gateway instances is supported, including vCpu, memory, and instance count.

> [!NOTE]
> For high availability, a single replica is not recommended.

The following table describes the default resource usage:

| Component name                               | Instance count | vCPU per instance | Memory per instance |
|----------------------------------------------|----------------|-------------------|---------------------|
| VMware Spring Cloud Gateway                  | 2              | 1 core            | 2Gi                 |
| VMware Spring Cloud Gateway operator         | 2              | 1 core            | 2Gi                 |

## Next steps

- [How to Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md)
