---
title: Get Started with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to get started with Enterprise Tier in Azure Spring Cloud.
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Get started with Enterprise Tier

**This article applies to:** ✔️ Enterprise tier

This article shows you how to get started with Enterprise Tier in Azure Spring Cloud.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier offering from Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Apache Maven](https://maven.apache.org/download.cgi)

## Use Spring Cloud Gateway

To use Spring Cloud Gateway, follow these steps.

> [!NOTE]
> To use Spring Cloud Gateway, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable it after provisioning at this time.

### Assign a public endpoint for the gateway

Assign a public endpoint for the gateway to access to it, using the following steps:

1. Select the **Spring Cloud Gateway** section.
1. Select **Overview** to view the running state and resources allocated to Spring Cloud Gateway.
1. Select **Yes** next to **Assign endpoint** to assign a public endpoint. A URL will be generated for you after a few minutes.

   :::image type="content" source="media/enterprise/getting-started-enterprise/gateway-overview.png" alt-text="Azure portal screenshot of Azure Spring Cloud overview page with 'Assign endpoint' highlighted.":::

1. Save the URL for use later.

### Configure the Spring Cloud Gateway properties

Configure the Spring Cloud Gateway properties using the following command:

```azurecli
az spring-cloud gateway update \
    --api-description "<api-description>" \
    --api-title "<api-title>" \
    --api-version "v0.1" \
    --server-url "<endpoint-in-the-previous-step>" \
    --allowed-origins "*"
```

The Spring Cloud Gateway properties will be used to integrate with the API portal in the [Use the API portal](#use-the-api-portal) section.

### Configure routing rules for the applications

Use the following steps to create rules to access apps previously deployed through Spring Cloud Gateway.

1. Save the following JSON to the *customers-service.json* file.

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

1. Use the following command to apply the rule to the `customers-service` app:

   ```azurecli
   az spring-cloud gateway route-config create \
       --name customers-service-rule \
       --app-name customers-service \
       --routes-file customers-service.json
   ```

1. Access the `owners` API of the `customers-service` app through the gateway endpoint.

   ```bash
   curl https://<endpoint-url>/api/customers-service/owners
   ```

## Use the API portal

To use API portal, follow these steps to assign a public endpoint to the API portal.

> [!NOTE]
> To use the API portal, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable the API portal after provisioning, at this time.

1. Select **API portal**.
1. Select **Overview** to view the running state and resources allocated to the API portal.
1. Select **Yes** next to *Assign endpoint* to assign a public endpoint. A URL will be generated for you after a few minutes.

   :::image type="content" source="media/enterprise/getting-started-enterprise/api-portal-overview.png" alt-text="Azure portal screenshot of Azure Spring Cloud API portal page with 'Assign endpoint' highlighted.":::

1. Visit the routes information through the API portal.

   > [!NOTE]
   > It usually take several minutes to sync between Spring Cloud Gateway and API portal.

   Select the assigned endpoint URL to go to API portal. You can see all the routes configured in Spring Cloud Gateway.

   :::image type="content" source="media/enterprise/getting-started-enterprise/api-portal-portal.png" alt-text="Screenshot of the API portal showing configured routes.":::

1. Try out APIs through the API portal.

   > [!NOTE]
   > Only the `GET` operation is supported in the public preview.

   Select the API you would like to try out, then select `EXECUTE`. The response from the API will be shown.

   :::image type="content" source="media/enterprise/getting-started-enterprise/api-portal-tryout.png" alt-text="Screenshot of the API portal.":::

## Real-time app log streaming

Use the following command to get real-time logs from the application.

```azurecli
az spring-cloud app logs \
    --resource-group <resource_group> \
    --service <service_instance_name> \
    --name <app_name> \
    --lines 100 \
    --follow
```

This will return logs similar to the following example:

```output
2021-07-15 01:54:40.481  INFO [auth-service,,,] 1 --- [main] o.apache.catalina.core.StandardService  : Starting service [Tomcat]
2021-07-15 01:54:40.482  INFO [auth-service,,,] 1 --- [main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.22]
2021-07-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.a.c.c.C.[Tomcat].[localhost].[/uaa]  : Initializing Spring embedded WebApplicationContext
2021-07-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.s.web.context.ContextLoader  : Root WebApplicationContext: initialization completed in 7203 ms
```

## Monitor apps with Application Insights

You can configure Application Insights when provisioning Azure Spring Cloud service or after the service is created. For more information, see [How to use Application Insights Java In-Process Agent in Azure Spring Cloud](./how-to-application-insights.md).

## Monitor apps with third-party APMs

For more information on monitoring apps with third-party APMs, see [Buildpack Bindings](./how-to-enterprise-build-service.md#buildpack-bindings)

## Clean up resources

1. Open the [Azure portal](https://ms.portal.azure.com/?AppPlatformExtension=entdf#home), then delete the service instance as in the following screenshot.

   :::image type="content" source="media/enterprise/getting-started-enterprise/service-instance-delete-instance.png" alt-text="Azure portal screenshot showing Azure Spring Cloud overview page with Delete button highlighted.":::

1. Run the following command to remove the preview version of the Azure CLI extension.

   ```azurecli
   az extension remove --name spring-cloud
   ```

## Next steps

> [!div class="nextstepaction"]
> [Azure Spring Cloud](index.yml)
