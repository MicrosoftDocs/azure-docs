---
title: Quickstart - Deploy RESTful API application to Azure Spring Apps
description: Learn how to deploy RESTful API application to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 10/02/2023
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy RESTful API application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview)

This article describes how to deploy a RESTful API application protected by [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) to Azure Spring Apps. The sample project is a simplified version based on the [Simple Todo](https://github.com/Azure-Samples/ASA-Samples-Web-Application) web application, which only provides the backend service and uses Microsoft Entra ID to protect the RESTful APIs.

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

### [Azure portal](#tab/Azure-portal)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra ID tenant. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](../active-directory/fundamentals/create-new-tenant.md).
- [curl](https://curl.se/download.html).

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra ID tenant. For instructions on creating one, see [Quickstart: Create a new tenant in Microsoft Entra ID](../active-directory/fundamentals/create-new-tenant.md).
- [Azure Developer CLI (AZD)](https://aka.ms/azd-install), version 1.0.2 or higher.
- [curl](https://curl.se/download.html).

---

[!INCLUDE [deploy-restful-api-app-with-consumption-plan](includes/quickstart-deploy-restful-api-app/deploy-restful-api-app-with-consumption-plan.md)]

## 5. Validate the app

Now, you can access the RESTful API to see if it works.

### Request an access token

The RESTful APIs act as a resource server, which is protected by Microsoft Entra ID. Before acquiring an access token, you're required to register another application in Microsoft Entra ID and grant permissions to the client application, which is named `ToDoWeb`.

#### Register the client application

Use the following steps to register an application in Microsoft Entra ID, which is used to add the permissions for the `ToDo` app:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directory + subscription** filter (:::image type="icon" source="media/quickstart-deploy-restful-api-app/portal-directory-subscription-filter.png" border="false":::) to select the tenant in which you want to register an application.

1. Search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a name for your application in the **Name** field - for example, *ToDoWeb*. Users of your app might see this name, and you can change it later.

1. For **Supported account types**, use the default value **Accounts in this organizational directory only**.

1. Select **Register** to create the application.

1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You need it to acquire an access token.

1. Select **API permissions** > **Add a permission** > **My APIs**. Select the `ToDo` application that you registered earlier, and then select the **ToDo.Read**, **ToDo.Write**, and **ToDo.Delete** permissions. Select **Add permissions**.

1. Select **Grant admin consent for \<your-tenant-name>** to grant admin consent for the permissions you added.

   :::image type="content" source="media/quickstart-deploy-restful-api-app/api-permissions.png" alt-text="Screenshot of the Azure portal that shows the API permissions of a web application." lightbox="media/quickstart-deploy-restful-api-app/api-permissions.png":::

#### Add user to access the RESTful APIs

Use the following steps to create a member user in your Microsoft Entra ID tenant. Then, the user can manage the data of the `ToDo` application through RESTful APIs.

1. Under **Manage**, select **Users** > **New user** > **Create new user**.

1. On the **Create new user** page, enter the following information:

   - **User principal name**: Enter a name for the user.
   - **Display name**: Enter a display name for the user.
   - **Password**: Copy the autogenerated password provided in the **Password** box.

   > [!NOTE]
   > New users must complete the first sign-in authentication and update their passwords, otherwise, you receive an `AADSTS50055: The password is expired` error when you get the access token.
   >
   > When a new user logs in, they receive an **Action Required** prompt. They can choose **Ask later** to skip the validation.

1. Select **Review + create** to review your selections. Select **Create** to create the user.

#### Update the OAuth2 configuration for Swagger UI authorization

Use the following steps to update the OAuth2 configuration for Swagger UI authorization. Then, you can authorize users to acquire access tokens through the `ToDoWeb` app.

1. Open the Azure Spring Apps instance in the Azure portal.

1. Open your **Microsoft Entra ID** tenant in the Azure portal, and go to the registered `ToDoWeb` app.

1. Under **Manage**, select **Authentication**, select **Add a platform**, and then select **Single-page application**.

1. Use the format `<your-app-exposed-application-url-or-endpoint>/swagger-ui/oauth2-redirect.html` as the OAuth2 redirect URL in the **Redirect URIs** field - for example, `https://simple-todo-api.xxxxxxxx-xxxxxxxx.xxxxxx.azurecontainerapps.io/swagger-ui/oauth2-redirect.html` - and then select **Configure**.

   :::image type="content" source="media/quickstart-deploy-restful-api-app/single-page-app-authentication.png" alt-text="Screenshot of the Azure portal that shows the Authentication page for Microsoft Entra ID." lightbox="media/quickstart-deploy-restful-api-app/single-page-app-authentication.png":::

#### Obtain the access token

Use the following steps to use [OAuth 2.0 authorization code flow](../active-directory/develop/v2-oauth2-auth-code-flow.md) method to obtain an access token with Microsoft Entra ID, then access the RESTful APIs of the `ToDo` app:

1. Open the URL exposed by the app, then select **Authorize** to prepare the OAuth2 authentication.

1. In the **Available authorizations** window, enter the client ID of the `ToDoWeb` app in the **client_id** field, select all the scopes for **Scopes** field, ignore the **client_secret** field, and then select **Authorize** to redirect to the Microsoft Entra ID sign-in page.

After completing the sign in with the previous user, you're returned to the **Available authorizations** window.

### Access the RESTful APIs

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
> [Quickstart: Deploy an event-driven application to Azure Spring Apps](./quickstart-deploy-event-driven-app-standard-consumption.md)

> [!div class="nextstepaction"]
> [Quickstart: Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md)

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./how-to-custom-domain.md)

> [!div class="nextstepaction"]
> [Use Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Automate application deployments to Azure Spring Apps](./how-to-cicd.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
