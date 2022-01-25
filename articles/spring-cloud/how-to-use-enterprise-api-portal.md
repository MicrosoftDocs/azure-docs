---
title: How to use the API portal with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to use the API portal with Azure Spring Cloud Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Use API portal

**This article applies to:** ✔️ Enterprise tier ❌ Basic/Standard tier

This article shows you how to use the API portal with Azure Spring Cloud Enterprise Tier.

[API portal](https://docs.vmware.com/en/API-portal-for-VMware-Tanzu/1.0/api-portal/GUID-index.html) is one of the proprietary VMware Tanzu components. The API portal supports viewing API definitions from [Spring Cloud Gateway](./how-to-use-enterprise-spring-cloud-gateway.md) and testing of specific API routes from the browser. It also supports enabling Single Sign-On authentication via configuration.

## Prerequisites

- An already provisioned Azure Spring Cloud Enterprise tier service instance with the API portal enabled. For more information, see [Get started with Enterprise Tier](./get-started-enterprise.md)
- [Spring Cloud Gateway](./how-to-use-enterprise-spring-cloud-gateway.md) is enabled during provisioning and the corresponding API metadata is configured.

## Configure the API portal

### Configure single sign-on (SSO)

The API portal supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) which supports OpenID Connect Discovery protocol.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that the it asserts as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

> Note that only authorization servers supporting OpenID Connect Discovery protocol are supported.
Also configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.

> [!NOTE]
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.

> Important: If you are using the SSO feature, only one instance count is supported.

### Configure the instance count

Configuration of the instance count for the API portal is supported, unless you are using SSO. If you are using the SSO feature, only one instance count is supported.

## Assign a public endpoint for the API portal

To access the API portal, use the following steps to assign a public endpoint:

1. Select **API portal**.
1. Select **Overview** to view the running state and resources allocated to the API portal.
1. Select **Yes** next to *Assign endpoint* to assign a public endpoint. A URL will be generated within a few minutes.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-api-portal/api-portal-overview.png" alt-text="Azure portal screenshot showing Azure Spring Cloud API portal page with 'Assign endpoint' highlighted.":::

1. Save the URL for use later.

You can also use the CLI to assign a public endpoint with the following command:

```azurecli
az spring-cloud api-portal update --assign-endpoint
```

## View the route information through the API portal

> [!NOTE]
> It takes several minutes to sync between Spring Cloud Gateway and the API portal.

Select the `endpoint URL` to go to API portal. You will see all the routes configured in Spring Cloud Gateway.

:::image type="content" source="media/enterprise/getting-started-enterprise/api-portal-portal.png" alt-text="Screenshot of the API portal showing configured routes.":::

## Try APIs using the API portal

> [!NOTE]
> Only `GET` operations are supported in the public preview.

1. Select the API you would like to try.
1. Select **EXECUTE** and the response will be shown.

   :::image type="content" source="media/enterprise/getting-started-enterprise/api-portal-tryout.png" alt-text="Screenshot of the API portal.":::

## Next steps

- [Azure Spring Cloud](index.yml)
