---
title: How to Use API Portal for VMware Tanzu with the Azure Spring Apps Enterprise Plan
titleSuffix: Azure Spring Apps Enterprise plan
description: How to use API portal for VMware Tanzu with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: xiading
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 12/01/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Use API portal for VMware Tanzu

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to use API portal for VMware Tanzu with the Azure Spring Apps Enterprise plan.

[API portal](https://docs.vmware.com/en/API-portal-for-VMware-Tanzu/1.1/api-portal/GUID-index.html) is one of the commercial VMware Tanzu components. API portal supports viewing API definitions from [Spring Cloud Gateway for VMware Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md) and testing of specific API routes from the browser. It also supports enabling single sign-on (SSO) authentication via configuration.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance with API portal enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Spring Cloud Gateway for Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md) is enabled during provisioning and the corresponding API metadata is configured.

## Configure single sign-on (SSO)

API portal supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) that supports the OpenID Connect Discovery protocol.

> [!NOTE]
> Only authorization servers supporting the OpenID Connect Discovery protocol are supported. Be sure to configure the external authorization server to allow redirects back to the API portal. Refer to your authorization server's documentation and add `https://<api-portal-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.

| Property | Required? | Description |
| - | - | - |
| issuerUri | Yes | The URI that the app asserts as its Issuer Identifier. For example, if the issuer-uri provided is "https://example.com", then an OpenID Provider Configuration Request is made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scope | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

To set up SSO with Microsoft Entra ID, see [How to set up single sign-on with Microsoft Entra ID for Spring Cloud Gateway and API Portal for Tanzu](./how-to-set-up-sso-with-azure-ad.md).

> [!NOTE]
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.

## Configure the instance count

### [Azure portal](#tab/Portal)

Use the following steps to configure the instance count using API portal:

1. Navigate to your service instance and select **API portal**.
1. Select **Scale out**.
1. Configure **Instance count** and then select **Save**.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure the instance count using API portal. Be sure to replace the placeholder with your actual value.

```azurecli
az spring api-portal update --instance-count <number>
```

---

## Assign a public endpoint for API portal

### [Azure portal](#tab/Portal)

Use the following steps to assign a public endpoint to API portal:

1. Select **API portal**.
1. Select **Overview** to view the running state and resources allocated to API portal.
1. Select **Yes** next to *Assign endpoint* to assign a public endpoint. A URL is generated within a few minutes.
1. Save the URL for use later.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to assign a public endpoint to API portal:

```azurecli
az spring api-portal update --assign-endpoint
```

---

## Configure the API try-out feature

API portal enables you to view APIs centrally and try them out using the API try-out feature. API try-out is enabled by default and this configuration helps you turn it off across the whole API portal instance. For more information, see the [Try out APIs in API portal](#try-out-apis-in-api-portal) section.

### [Azure portal](#tab/Portal)

Use the following steps to enable or disable API try-out:

1. Navigate to your service instance and select **API portal**.
1. Select **Configuration**.
1. Select or clear **Enable API try-out** and then select **Save**.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable API try-out:

```azurecli
az spring api-portal update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --enable-api-try-out
```

Use following command to disable API try-out:

```azurecli
az spring api-portal update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --enable-api-try-out false
```

---

## Configure API routing with OpenAPI Spec on Spring Cloud Gateway for Tanzu

This section describes how to view and try out APIs with schema definitions in API portal. Use the following steps to configure API routing with an OpenAPI spec URL on Spring Cloud Gateway for Tanzu.

1. Create an app in Azure Spring Apps that the gateway routes traffic to.

1. Generate the OpenAPI definition and get the URI to access it. The following two URI options are accepted:

   - The first option is to use a publicly accessible endpoint like the URI `https://petstore3.swagger.io/api/v3/openapi.json`, which includes the OpenAPI specification.
   - The second option is to put the OpenAPI definition in the relative path of the app in Azure Spring Apps, and construct the URI in the format `http://<app-name>/<relative-path-to-OpenAPI-spec>`. You can choose tools like `SpringDocs` to generate the OpenAPI specification automatically, so the URI can be like `http://<app-name>/v3/api-docs`.

1. Use the following command to assign a public endpoint to the gateway to access it.

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

1. Configure routing rules to apps.

   To create rules to access the app in Spring Cloud Gateway for Tanzu route configuration, save the following contents to the *sample.json* file.

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
               "StripPrefix=0"
            ]
         }
      ]
   }
   ```

   The `open_api.uri` value is the public endpoint or URI constructed in the second step above. You can add predicates and filters for paths defined in your OpenAPI specification.

   Use the following command to apply the rule to the app created in the first step:

   ```azurecli
   az spring gateway route-config create \
       --name sample \
       --app-name <app-name> \
       --routes-file sample.json
   ```

1. Check the response of the created routes. You can also view the routes in the portal.

## View exposed APIs in API portal

> [!NOTE]
> It takes several minutes to sync between Spring Cloud Gateway for Tanzu and API portal.

Select the `endpoint URL` to go to API portal. You see all the routes configured in Spring Cloud Gateway for Tanzu.

:::image type="content" source="media/how-to-use-enterprise-api-portal/api-portal.png" alt-text="Screenshot of API portal that shows the configured routes.":::

## Try out APIs in API portal

Use the following steps to try out APIs:

1. Select the API you would like to try.
1. Select **EXECUTE**, and the response appears.

   :::image type="content" source="media/how-to-use-enterprise-api-portal/api-portal-tryout.png" alt-text="Screenshot of the API portal that shows the Execute option selected.":::

## Enable/disable API portal after service creation

You can enable and disable API portal after service creation using the Azure portal or Azure CLI. Before disabling API portal, you're required to unassign its endpoint.

### [Azure portal](#tab/Portal)

Use the following steps to enable or disable API portal using the Azure portal:

1. Navigate to your service resource, and then select **API portal**.
1. Select **Manage**.
1. Select or unselect the **Enable API portal**, and then select **Save**.
1. You can now view the state of API portal on the **API portal** page.

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI commands to enable or disable API portal:

```azurecli
az spring api-portal create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

```azurecli
az spring api-portal delete \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

---

## Next steps

- [Azure Spring Apps](index.yml)
