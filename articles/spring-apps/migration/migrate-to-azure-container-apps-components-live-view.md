---
title: Migrate Application Live View to Managed Admin for Spring in Azure Container Apps
description: Describes how to migrate API Portal to Managed Admin for Spring in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Application Live View to Managed Admin for Spring in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article describes how to migrate API Portal to Managed Admin for Spring in Azure Container Apps.

The Admin for Spring managed component provides an administrative interface for Spring Boot web applications that expose actuator endpoints. It's similar to Application Live View, acting as a lightweight insights and troubleshooting tool to help developers and operators monitor running apps.

## Prerequisites

- A configured Azure Spring Apps Enterprise plan instance with Application Configuration Service enabled.
- An existing Azure container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).
- [Azure CLI](/cli/azure/install-azure-cli).

## Provision Managed Admin for Spring in Azure Container Apps

Use the following steps to provision the component:

### [Azure portal](#tab/Azure-portal)

1. Navigate to your container app's environment in the Azure portal.
1. Under **Services** in the service menu, select **Services**.
1. Choose **Configure**, then select **Java component**.
1. Fill out the **Configure Java component** pane with the following values:

   | Property                | Value                |
   |-------------------------|----------------------|
   | **Java component type** | **Admin for Spring** |
   | **Java component name** | **admin**            |

1. Select **Next**.
1. On the **Review** tab, select **Configure**.

### [Azure CLI](#tab/Azure-CLI)

1. Use the following command to create the Admin for Spring Java component:

   ```azurecli
   az containerapp env java-component admin-for-spring create \
       --resource-group $RESOURCE_GROUP \
       --name $JAVA_COMPONENT_NAME \
       --environment $ENVIRONMENT \
       --min-replicas 1 \
       --max-replicas 1
   ```

1. Use the following command to update the Admin for Spring Java component:

   ```azurecli
   az containerapp env java-component admin-for-spring update \
       --resource-group $RESOURCE_GROUP \
       --name $JAVA_COMPONENT_NAME \
       --environment $ENVIRONMENT \
       --min-replicas 2 \
       --max-replicas 2
   ```

---

## Update your container app dependency

To integrate the Admin component into your container app, add the following dependency to your **pom.xml** file. Replace the version number with the latest version from the [Maven Repository](https://search.maven.org/artifact/de.codecentric/spring-boot-admin-starter-client).

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
    <version>3.3.2</version>
</dependency>
```

## Bind your container app to the Admin for Spring Java component

### [Azure portal](#tab/Azure-portal)

Use the following steps to bind your container app to the component:

1. Go to your container app's environment in the Azure portal.
1. Under **Services**, select **Services**.
1. From the list, choose **admin**.
1. Under **Bindings**, select your container app name from the **App name** dropdown.
1. Select the **Review** tab and then select **Configure**.
1. Navigate to your container app in the Azure portal and copy its URL for later use.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to create the container app and bind it to the Admin for Spring component:

```azurecli
az containerapp create \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --environment $ENVIRONMENT \
    --image $IMAGE \
    --min-replicas 1 \
    --max-replicas 1 \
    --ingress external \
    --target-port 8080 \
    --bind $JAVA_COMPONENT_NAME
```

---

## Access the admin dashboard

> [!NOTE]
> Managed Admin for Spring in Azure Container Apps doesn't support single sign-on (SSO) configuration. It relies on Azure role assignments.

To access the dashboard, you must have the `Microsoft.App/managedEnvironments/write` role assigned to your account for the managed environment resource.

### Create and assign a custom role

Use the following steps to create and assign a custom role:

1. Use the following command to create a custom role definition:

   ```azurecli
   az role definition create --role-definition '{
       "Name": "<ROLE_NAME>",
       "IsCustom": true,
       "Description": "Access to managed Java Component dashboards in managed environments",
       "Actions": [
          "Microsoft.App/managedEnvironments/write"
       ],
       "AssignableScopes": ["/subscriptions/<SUBSCRIPTION_ID>"]
   }'
   ```

1. use the following command to assign the custom role to your account:

   ```azurecli
   az role assignment create \
       --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
       --role "<ROLE_NAME>" \
       --scope $ENVIRONMENT_ID
   ```
