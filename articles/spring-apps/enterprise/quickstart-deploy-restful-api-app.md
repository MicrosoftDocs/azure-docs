---
title: Quickstart - Deploy RESTful API Application to Azure Spring Apps
description: Learn how to deploy RESTful API application to Azure Spring Apps.
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 01/17/2024
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, mode-other, engagement-fy23, devx-track-extended-azdevcli, devx-track-azurecli
zone_pivot_groups: spring-apps-enterprise-or-consumption-plan-selection
---

# Quickstart: Deploy RESTful API application to Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

This article describes how to deploy a RESTful API application protected by [Microsoft Entra ID](/entra/fundamentals/whatis) to Azure Spring Apps. The sample project is a simplified version based on the [Simple Todo](https://github.com/Azure-Samples/ASA-Samples-Web-Application) web application, which only provides the backend service and uses Microsoft Entra ID to protect the RESTful APIs.

These RESTful APIs are protected by applying role-based access control (RBAC). Anonymous users can't access any data and aren't allowed to control access for different users. Anonymous users only have the following three permissions:

- Read: With this permission, a user can read the ToDo data.
- Write: With this permission, a user can add or update the ToDo data.
- Delete: With this permission, a user can delete the ToDo data.

After the deployment is successful, you can view and test the APIs through the Swagger UI.

:::image type="content" source="media/quickstart-deploy-restful-api-app/swagger-ui.png" alt-text="Screenshot of the Swagger UI that shows the API document." lightbox="media/quickstart-deploy-restful-api-app/swagger-ui.png":::

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-restful-api-app/diagram.png" alt-text="Diagram that shows the architecture of a Spring web application." lightbox="media/quickstart-deploy-restful-api-app/diagram.png":::

[!INCLUDE [quickstart-tool-introduction](includes/quickstart-deploy-restful-api-app/quickstart-tool-introduction.md)]

## 1. Prerequisites

::: zone pivot="sc-enterprise"

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

- An Azure subscription. If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/) before you begin.
- One of the following roles:
  - Global Administrator or Privileged Role Administrator, for granting consent for apps requesting any permission, for any API.
  - Cloud Application Administrator or Application Administrator, for granting consent for apps requesting any permission for any API, except Microsoft Graph app roles (application permissions).
  - A custom directory role that includes the [permission to grant permissions to applications](/entra/identity/role-based-access-control/custom-consent-permissions), for the permissions required by the application.

  For more information, see [Grant tenant-wide admin consent to an application](/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal).
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra tenant. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).

### [Azure CLI](#tab/Azure-CLI)

- An Azure subscription, If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/) before you begin.
- One of the following roles:
  - Global Administrator or Privileged Role Administrator, for granting consent for apps requesting any permission, for any API.
  - Cloud Application Administrator or Application Administrator, for granting consent for apps requesting any permission for any API, except Microsoft Graph app roles (application permissions).
  - A custom directory role that includes the [permission to grant permissions to applications](/entra/identity/role-based-access-control/custom-consent-permissions), for the permissions required by the application.

  For more information, see [Grant tenant-wide admin consent to an application](/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal).
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra tenant. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.53.1 or higher.

---

::: zone-end

::: zone pivot="sc-consumption-plan"

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

- An Azure subscription, If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/) before you begin.
- One of the following roles:
  - Global Administrator or Privileged Role Administrator, for granting consent for apps requesting any permission, for any API.
  - Cloud Application Administrator or Application Administrator, for granting consent for apps requesting any permission for any API, except Microsoft Graph app roles (application permissions).
  - A custom directory role that includes the [permission to grant permissions to applications](/entra/identity/role-based-access-control/custom-consent-permissions), for the permissions required by the application.

  For more information, see [Grant tenant-wide admin consent to an application](/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal).
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra tenant. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

- An Azure subscription, If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/) before you begin.
- One of the following roles:
  - Global Administrator or Privileged Role Administrator, for granting consent for apps requesting any permission, for any API.
  - Cloud Application Administrator or Application Administrator, for granting consent for apps requesting any permission for any API, except Microsoft Graph app roles (application permissions).
  - A custom directory role that includes the [permission to grant permissions to applications](/entra/identity/role-based-access-control/custom-consent-permissions), for the permissions required by the application.

  For more information, see [grant admin consent](/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal#prerequisites).
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra tenant. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).
- [Azure Developer CLI (AZD)](https://aka.ms/azd-install), version 1.0.2 or higher.

---

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-restful-api-app-with-enterprise-plan](includes/quickstart-deploy-restful-api-app/deploy-restful-api-app-with-enterprise-plan.md)]

::: zone-end

::: zone pivot="sc-consumption-plan"

[!INCLUDE [deploy-restful-api-app-with-consumption-plan](includes/quickstart-deploy-restful-api-app/deploy-restful-api-app-with-consumption-plan.md)]

## 5. Validate the app

[!INCLUDE [validate-the-app-portal](includes/quickstart-deploy-restful-api-app/validate-the-app-portal.md)]

::: zone-end

#### Obtain the access token

Use the following steps to use [OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow) method to obtain an access token with Microsoft Entra ID, then access the RESTful APIs of the `ToDo` app:

1. Open the URL exposed by the app, then select **Authorize** to prepare the OAuth2 authentication.

1. In the **Available authorizations** window, enter the client ID of the `ToDoWeb` app in the **client_id** field, select all the scopes for **Scopes** field, ignore the **client_secret** field, and then select **Authorize** to redirect to the Microsoft Entra sign-in page.

After completing the sign in with the previous user, you're returned to the **Available authorizations** window.

### 5.2. Access the RESTful APIs

Use the following steps to access the RESTful APIs of the `ToDo` app in the Swagger UI:

1. Select the API **POST /api/simple-todo/lists** and then select **Try it out**. Enter the following request body, and then select **Execute** to create a ToDo list.

   ```json
   {
     "name": "My List"
   }
   ```

   After the execution is complete, you see the following **Response body**:

   ```json
   {
     "id": "<ID-of-the-ToDo-list>",
     "name": "My List",
     "description": null
   }
   ```

1. Select the API **POST /api/simple-todo/lists/{listId}/items** and then select **Try it out**. For **listId**, enter the ToDo list ID you created previously, enter the following request body, and then select **Execute** to create a ToDo item.

   ```json
   {
     "name": "My first ToDo item", 
     "listId": "<ID-of-the-ToDo-list>",
     "state": "todo"
   }
   ```

   This action returns the following ToDo item:

   ```json
   {
     "id": "<ID-of-the-ToDo-item>",
     "listId": "<ID-of-the-ToDo-list>",
     "name": "My first ToDo item",
     "description": null,
     "state": "todo",
     "dueDate": "2023-07-11T13:59:24.9033069+08:00",
     "completedDate": null
   }
   ```

1. Select the API **GET /api/simple-todo/lists** and then select **Execute** to query ToDo lists. This action returns the following ToDo lists:

   ```json
   [
     {
       "id": "<ID-of-the-ToDo-list>",
       "name": "My List",
       "description": null
     }
   ]
   ```

1. Select the API **GET /api/simple-todo/lists/{listId}/items** and then select **Try it out**. For **listId**, enter the ToDo list ID you created previously, and then select **Execute** to query the ToDo items. This action returns the following ToDo item:

   ```json
   [
     {
       "id": "<ID-of-the-ToDo-item>",
       "listId": "<ID-of-the-ToDo-list>",
       "name": "My first ToDo item",
       "description": null,
       "state": "todo",
       "dueDate": "2023-07-11T13:59:24.903307+08:00",
       "completedDate": null
     }
   ]
   ```

1. Select the API **PUT /api/simple-todo/lists/{listId}/items/{itemId}** and then select **Try it out**. For **listId**, enter the ToDo list ID. For **itemId**, enter the ToDo item ID, enter the following request body, and then select **Execute** to update the ToDo item.

   ```json
   {
     "id": "<ID-of-the-ToDo-item>",
     "listId": "<ID-of-the-ToDo-list>",
     "name": "My first ToDo item",
     "description": "Updated description.",
     "dueDate": "2023-07-11T13:59:24.903307+08:00",
     "state": "inprogress"
   }
   ```

   This action returns the following updated ToDo item:

   ```json
   {
     "id": "<ID-of-the-ToDo-item>",
     "listId": "<ID-of-the-ToDo-list>",
     "name": "My first ToDo item",
     "description": "Updated description.",
     "state": "inprogress",
     "dueDate": "2023-07-11T05:59:24.903307Z",
     "completedDate": null
   }
   ```

1. Select the API **DELETE /api/simple-todo/lists/{listId}/items/{itemId}** and then select **Try it out**. For **listId**, enter the ToDo list ID. For **itemId**, enter the ToDo item ID, and then select **Execute** to delete the ToDo item. You should see that the server response code is `204`.

[!INCLUDE [clean-up-resources](includes/quickstart-deploy-restful-api-app/clean-up-resources.md)]

## 7. Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy an event-driven application to Azure Spring Apps](../basic-standard/quickstart-deploy-event-driven-app.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Quickstart: Deploy microservice applications to Azure Spring Apps](../basic-standard/quickstart-deploy-microservice-apps.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](../basic-standard/structured-app-log.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](../basic-standard/how-to-custom-domain.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Use Azure Spring Apps CI/CD with GitHub Actions](../basic-standard/how-to-github-actions.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Automate application deployments to Azure Spring Apps](../basic-standard/how-to-cicd.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/azure-spring-apps-samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
