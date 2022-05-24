---
title: How to migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise tier
titleSuffix: Azure Spring Cloud Enterprise tier
description: How to migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise tier
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 05/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise tier

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to migrate an existing application in Basic or Standard tier to Enterprise tier. When you migrate from Basic or Standard tier to Enterprise tier, VMware Tanzu components will replace the OSS Spring Cloud components to provide more feature support.

## Prerequisites

- An already provisioned Azure Spring Cloud Enterprise tier service instance with Spring Cloud Gateway for Tanzu enabled. For more information, see [Quickstart: Provision an Azure Spring Cloud service instance using Enterprise tier](./quickstart-provision-service-instance-enterprise.md). However, you won't need to change any code in your applications.
- [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

## Using Application Configuration Service for configuration

In Enterprise tier, Application Configuration Service provides external configuration support for your apps. Managed Spring Cloud Config Server is only available in Basic and Standard tiers and is not available in Enterprise tier. 

## Configure Application Configuration Service for Tanzu settings

Follow these steps to use Application Configuration Service for Tanzu as a centralized configuration service.

# [Azure portal](#tab/azure-portal)

1. Select **Application Configuration Service**.
1. Select **Overview** to view the running state and resources allocated to Application Configuration Service for Tanzu.

   :::image type="content" source="./media/enterprise/getting-started-enterprise/config-service-overview.png" alt-text="Application Configuration Service Overview screen" lightbox="./media/enterprise/getting-started-enterprise/config-service-overview.png":::

1. Select **Settings**, then add a new entry in the **Repositories** section with the Git backend information.

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   :::image type="content" source="./media/enterprise/getting-started-enterprise/config-service-settings.png" alt-text="Application Configuration Service Settings overview" lightbox="./media/enterprise/getting-started-enterprise/config-service-settings.png":::

# [Azure CLI](#tab/azure-cli)

```azurecli
az spring-cloud application-configuration-service git repo add \
    --name <entry-name> \
    --patterns <patterns> \
    --uri <git-backend-uri> \
    --label <git-branch-name>
```

---

### Bind application to Application Configuration Service for Tanzu and configure patterns

When you use Application Configuration Service for Tanzu with a Git backend, you must bind the app to Application Configuration Service for Tanzu. After binding the app, you'll need to configure which pattern will be used by the app. Follow these steps to bind and configure the pattern for the app.

# [Azure portal](#tab/azure-portal)

1. Open the **App binding** tab.

1. Select **Bind app** and choose one app in the dropdown, then select **Apply** to bind.

   :::image type="content" source="./media/enterprise/how-to-enterprise-application-configuration-service/config-service-app-bind-dropdown.png" alt-text="How to bind Application Configuration Service screenshot":::

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app for the binding to take effect.

1. Select **Apps**, then select the [pattern(s)](./how-to-enterprise-application-configuration-service.md#pattern) to be used by the apps.

   1. In the left navigation menu, select **Apps** to view the list of apps.

   1. Select the target app to configure patterns for from the `name` column.

   1. In the left navigation pane, select **Configuration**, then select **General settings**.

   1. In the **Config file patterns** dropdown, choose one or more patterns from the list.

      :::image type="content" source="./media/enterprise/how-to-enterprise-application-configuration-service/config-service-pattern.png" alt-text="Bind Application Configuration Service in deployment screenshot":::

   1. Select **Save**.

# [Azure CLI](#tab/azure-cli)

```azurecli
az spring-cloud application-configuration-service bind --app <app-name>
az spring-cloud app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file> \
    --config-file-pattern <config-file-pattern>
```

---

For more information, see [Use Application Configuration Service for Tanzu](./how-to-enterprise-application-configuration-service.md).

## Bind an application to Tanzu Service Registry

[Service Registry](https://docs.pivotal.io/spring-cloud-services/2-1/common/service-registry/index.html) is one of the proprietary VMware Tanzu components. It provides your apps with an implementation of the Service Discovery pattern, one of the key concepts of a microservice-based architecture. 

Use the following steps to bind an application to Tanzu Service Registry.

1. Open the **App binding** tab.

1. Select **Bind app** and choose one app in the dropdown, then select **Apply** to bind.

   :::image type="content" source="./media/enterprise/how-to-enterprise-service-registry/service-reg-app-bind-dropdown.png" alt-text="Bind Service Registry dropdown screenshot":::

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app to make the change take effect.

For more information, see [Use Tanzu Service Registry](./how-to-enterprise-service-registry.md).

## Create and configure an application using Spring Cloud Gateway for Tanzu

[Spring Cloud Gateway for Tanzu](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is one of the VMware Tanzu components. It's based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles cross-cutting concerns for API development teams, such as Single Sign-On (SSO), access control, rate-limiting, resiliency, security, and more. 

Use the following steps to create and configure an application using Spring Cloud Gateway for Tanzu.

### Create an app for Spring Cloud Gateway to route traffic to

1. Create an app which Spring Cloud Gateway for Tanzu will route traffic to by following the instructions in [Quickstart: Build and deploy apps to Azure Spring Cloud using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

1. Assign a public endpoint to the gateway to access it.

   # [Azure portal](#tab/azure-portal)

   1. Select the **Spring Cloud Gateway** section, then select **Overview** to view the running state and resources given to Spring Cloud Gateway and its operator.

   1. Select **Yes** next to *Assign endpoint* to assign a public endpoint. You'll get a URL in a few minutes. Save the URL to use later.

   :::image type="content" source="./media/enterprise/getting-started-enterprise/gateway-overview.png" alt-text="Gateway overview screenshot showing assigning endpoint" lightbox="./media/enterprise/getting-started-enterprise/gateway-overview.png":::

   # [Azure CLI](#tab/azure-cli)

   ```azurecli
   az spring-cloud gateway update --assign-endpoint
   ```
   ---

### Configure Spring Cloud Gateway

1. Configure Spring Cloud Gateway for Tanzu properties using the CLI:

   ```azurecli
   az spring-cloud gateway update \
       --api-description "<api-description>" \
       --api-title "<api-title>" \
       --api-version "v0.1" \
       --server-url "<endpoint-in-the-previous-step>" \
       --allowed-origins "*"
   ```

   You can view the properties in the portal.

   :::image type="content" source="./media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-configuration.png" alt-text="Gateway Configuration settings screenshot" lightbox="./media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-configuration.png":::

1. Configure routing rules to apps.

   Create rules to access apps deployed in the above steps through Spring Cloud Gateway for Tanzu.

   Save the following content to your application's JSON file, changing the placeholders to your application's information.

   ```json
   [
      {
         "title": "<your-title>",
         "description": "Route to <your-app-name>",
         "predicates": [
            "Path=/api/<your-app-name>/owners"
         ],
         "filters": [
            "StripPrefix=2"
         ],
         "tags": [
            "<your-tags>"
         ]
      }
   ]
   ```

1. Apply the rule to your application using the following command:

   ```azurecli
   az spring-cloud gateway route-config create \
       --name <your-app-name-rule> \
       --app-name <your-app-name> \
       --routes-file <your-app-name>.json
   ```

   You can view the routes in the portal.

   :::image type="content" source="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png" alt-text="Example screenshot of gateway routing configuration" lightbox="media/enterprise/how-to-use-enterprise-spring-cloud-gateway/gateway-route.png":::

## Access application APIs through the gateway endpoint

1. Access the application APIs through the gateway endpoint using the following command:

   ```bash
   curl https://<endpoint-url>/api/<your-app-name>
   ```

1. Query the routing rules using the following commands:

   ```azurecli
   az configure --defaults group=<resource group name> spring-cloud=<service name>
   az spring-cloud gateway route-config show \
       --name <your-app-rule> \
       --query '{appResourceId:properties.appResourceId, routes:properties.routes}'
   az spring-cloud gateway route-config list \
       --query '[].{name:name, appResourceId:properties.appResourceId, routes:properties.routes}'
   ```

For more information, see [Use Spring Cloud Gateway for Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md).

## Next steps

- [Azure Spring Cloud](index.yml)
