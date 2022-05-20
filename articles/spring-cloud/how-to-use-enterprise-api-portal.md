---
title: How to use API portal for VMware Tanzu with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to use API portal for VMware Tanzu with Azure Spring Cloud Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Use API portal for VMware Tanzu

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use API portal for VMware Tanzu® with Azure Spring Cloud Enterprise Tier.

[API portal](https://docs.vmware.com/en/API-portal-for-VMware-Tanzu/1.0/api-portal/GUID-index.html) is one of the commercial VMware Tanzu components. API portal supports viewing API definitions from [Spring Cloud Gateway for VMware Tanzu®](./how-to-use-enterprise-spring-cloud-gateway.md) and testing of specific API routes from the browser. It also supports enabling Single Sign-On authentication via configuration.

## Prerequisites

- An already provisioned Azure Spring Cloud Enterprise tier instance with API portal enabled. For more information, see [Quickstart: Provision an Azure Spring Cloud service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).

  > [!NOTE]
  > To use API portal, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable it after provisioning at this time.

- [Spring Cloud Gateway for Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md) is enabled during provisioning and the corresponding API metadata is configured.

## Configure API portal

The following sections describe configuration in API portal.

### Configure single sign-on (SSO)

API portal supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) that supports the OpenID Connect Discovery protocol.

> [!NOTE]
> Only authorization servers supporting the OpenID Connect Discovery protocol are supported. Be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that the it asserts as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

To setup SSO with Azure AD, see [How to set up Single Sign-On with Azure AD for Spring Cloud Gateway and API Portal for Tanzu](./how-to-setup-sso-with-azure-ad.md).

> [!NOTE]
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.

> [!IMPORTANT]
> If you're using the SSO feature, only one instance count is supported.

### Configure the instance count

Configuration of the instance count for API portal is supported, unless you are using SSO. If you are using the SSO feature, only one instance count is supported.

## Assign a public endpoint for API portal

To access API portal, use the following steps to assign a public endpoint:

1. Select **API portal**.
1. Select **Overview** to view the running state and resources allocated to API portal.
1. Select **Yes** next to *Assign endpoint* to assign a public endpoint. A URL will be generated within a few minutes.
1. Save the URL for use later.

You can also use the Azure CLI to assign a public endpoint with the following command:

```azurecli
az spring-cloud api-portal update --assign-endpoint
```

## View the route information through API portal

> [!NOTE]
> It takes several minutes to sync between Spring Cloud Gateway for Tanzu and API portal.

Select the `endpoint URL` to go to API portal. You'll see all the routes configured in Spring Cloud Gateway for Tanzu.

:::image type="content" source="media/enterprise/how-to-use-enterprise-api-portal/api-portal.png" alt-text="Screenshot of A P I portal showing configured routes.":::

## Try APIs using API portal

> [!NOTE]
> Only `GET` operations are supported in the public preview.

1. Select the API you would like to try.
1. Select **EXECUTE** and the response will be shown.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-api-portal/api-portal-tryout.png" alt-text="Screenshot of A P I portal.":::

## Next steps

- [Azure Spring Cloud](index.yml)
