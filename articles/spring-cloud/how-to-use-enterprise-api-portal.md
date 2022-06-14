---
title: How to use API portal for VMware Tanzu with Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to use API portal for VMware Tanzu with Azure Spring Apps Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use API portal for VMware Tanzu

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use API portal for VMware Tanzu® with Azure Spring Apps Enterprise Tier.

[API portal](https://docs.vmware.com/en/API-portal-for-VMware-Tanzu/1.0/api-portal/GUID-index.html) is one of the commercial VMware Tanzu components. API portal supports viewing API definitions from [Spring Cloud Gateway for VMware Tanzu®](./how-to-use-enterprise-spring-cloud-gateway.md) and testing of specific API routes from the browser. It also supports enabling Single Sign-on authentication via configuration.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance with API portal enabled. For more information, see [Quickstart: Provision an Azure Spring Apps service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).

  > [!NOTE]
  > To use API portal, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

- [Spring Cloud Gateway for Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md) is enabled during provisioning and the corresponding API metadata is configured.

## Configure API portal

The following sections describe configuration in API portal.

### Configure single Sign-on (SSO)

API portal supports authentication and authorization using single Sign-on (SSO) with an OpenID identity provider (IdP) that supports the OpenID Connect Discovery protocol.

> [!NOTE]
> Only authorization servers supporting the OpenID Connect Discovery protocol are supported. Be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that the app asserts as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

To set up SSO with Azure AD, see [How to set up Single Sign-on with Azure AD for Spring Cloud Gateway and API Portal for Tanzu](./how-to-set-up-sso-with-azure-ad.md).

> [!NOTE]
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.

> [!IMPORTANT]
> If you're using the SSO feature, only one instance count is supported.

### Configure the instance count

Configuration of the instance count for API portal is supported, unless you're using SSO. If you're using the SSO feature, only one instance count is supported.

## Assign a public endpoint for API portal

To access API portal, use the following steps to assign a public endpoint:

1. Select **API portal**.
1. Select **Overview** to view the running state and resources allocated to API portal.
1. Select **Yes** next to *Assign endpoint* to assign a public endpoint. A URL will be generated within a few minutes.
1. Save the URL for use later.

You can also use the Azure CLI to assign a public endpoint with the following command:

```azurecli
az spring api-portal update --assign-endpoint
```

## Setup route information definition of APIs
To display APIs and try out with schema definition in API portal, you need to configure route config in Spring Cloud Gateway for Tanzu.
1. To create an app in Azure Spring Apps which the gateway will route traffic to.
2. Generate the OpenAPI definition and get the URI to access it. Two types of URI are accepted.
    - The first one is a public accessible endpoint like the URI `https://petstore3.swagger.io/api/v3/openapi.json` which includes the OpenAPI specification.
    - The second option is to put the OpenAPI definition in the relative path of the app in Azure Spring Apps, and construct the URI in the format `http://<app-name>/<relative-path-to-OpenAPI-spec>`. You can choose tools like `SpringDocs` to generate OpenAPI specification automatically, so the URI can be like `http://<app-name>/v3/api-docs`.
3. Assign a public endpoint to gateway to access it
```azurecli
az spring gateway update \
    --assign-endpoint \
```
4. Use the following command to configure Spring Cloud Gateway for Tanzu properties:
```azurecli
az spring gateway update \
    --api-description "<api-description>" \
    --api-title "<api-title>" \
    --api-version "v0.1" \
    --server-url "<endpoint-in-the-previous-step>" \
    --allowed-origins "*"
```
5.  Configure routing rules to apps.

Create rules to access the app in Spring Cloud Gateway route config, save the following contents to the *sample.json* file.
```json
{
   "open_api": {
      "uri": "https://petstore3.swagger.io/api/v3/openapi.json"
   },
   "routes": [
      {
         "title": "Petstore",
         "description": "Route to application",
         "predicates": [
            "Path=/pet",
            "Method=PUT"
         ],
         "filters": [
            "StripPrefix=0",
         ]
      }
   ]
}
```
The `open_api.uri` is the public endpoint or constructed URI by the second step. You can add predicates and filters for paths defined in your OpenAPI specification.

Use the following command to apply the rule to the app created in the first step:

```azurecli
az spring gateway route-config create \
    --name sample \
    --app-name <app-name> \
    --routes-file sample.json
```

6. Check the response of created routes, you can also view the routes in the portal.


## View the route information through API portal

> [!NOTE]
> It takes several minutes to sync between Spring Cloud Gateway for Tanzu and API portal.

Select the `endpoint URL` to go to API portal. You'll see all the routes configured in Spring Cloud Gateway for Tanzu.

:::image type="content" source="media/enterprise/how-to-use-enterprise-api-portal/api-portal.png" alt-text="Screenshot of A P I portal showing configured routes.":::


## Try APIs using API portal
1. Select the API you would like to try.
1. Select **EXECUTE** and the response will be shown.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-api-portal/api-portal-tryout.png" alt-text="Screenshot of A P I portal.":::

## Next steps

- [Azure Spring Apps](index.yml)
