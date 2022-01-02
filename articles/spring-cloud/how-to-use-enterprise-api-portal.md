---
title: How to use the API portal with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to use the API portal with Azure Spring Cloud Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 12/15/2021
ms.custom: devx-track-java, devx-track-azurecli
zone_pivot_groups: spring-cloud-tier-selection
---

# API Portal

This article describes the use of the API portal with Azure Spring Cloud Enterprise Tier.

[API portal](https://docs.vmware.com/en/API-portal-for-VMware-Tanzu/1.0/api-portal/GUID-index.html) is one of the proprietary VMware Tanzu components. The API portal supports viewing API definitions from [Spring Cloud Gateway](./how-to-use-enterprise-spring-cloud-gateway.md) and testing of specific API routes from the browser. It also supports enabling Single Sign-On authentication via configuration.

## Prerequisites
- An already provisioned Azure Spring Cloud Enterprise tier service instance with the API portal enabled. For more information, see [Get started with Enterprise Tier](./get-started-enterprise.md)
- [Spring Cloud Gateway](./how-to-use-enterprise-spring-cloud-gateway.md) is enabled during provisioning and the corresponding API metadata is configured.

   ![API Portal Overview image](./media/enterprise/api-portal/overview.png)

## Configure the API portal

### Configure Single Sign-On (SSO)

The API portal supports authentication and authorization using Single Sign-On (SSO) with an OpenID identity provider (IdP) which supports OpenID Connect Discovery protocol.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that the it asserts as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

> Note that only authorization servers supporting OpenID Connect Discovery protocol are supported.
Also configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.

> Note: If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration. 

> Important: If you are using the SSO feature, only one instance count is supported.

### Configure the instance count

Configuration of the instance count for the API portal is supported, unless you are suing SSO. If you are using the SSO feature, only one instance count is supported.

## Assign a public endpoint for the API portal

To access the API portal, use the following steps to assign a public endpoint:

1. Select **API portal**.
1. Select **Overview** to show the running state and resources allocated to the API portal.
1. Select **Assign endpoint** to assign a public endpoint. A URL will be generated within a few minutes.
1. Save the URL for use later.

   ![Assign public endpoint for API portal](./media/enterprise/api-portal/overview.png)

You can also use the CLI to assign a public endpoint with the following command:

```azurecli
az spring-cloud api-portal update --assign-endpoint
```

## View the route information through the API portal

> Note: It takes several minutes to sync between Spring Cloud Gateway and the API portal.
   
Click on the `endpoint URL` to go to API portal. You will see all the routes configured in Spring Cloud Gateway.

![API portal routes image](./media/enterprise/api-portal/portal.png)

## Try APIs using the API portal.

> Note: Only `GET` operations are supported in the public preview.

1. Select the API you would like to try.
1. Select **EXECUTE** and the response will be shown.

   ![Try out API portal](./media/enterprise/api-portal/tryout.png)

## Next Steps
