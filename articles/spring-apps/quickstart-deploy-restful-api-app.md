---
title: Quickstart - Deploy RESTful API application to Azure Spring Apps
description: Learn how to deploy RESTful API application to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy RESTful API application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article explains how to deploy a RESTful API application protected by [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) to Azure Spring Apps. 
The sample project is a simplified version based on the [Simple Todo] web application (https://github.com/Azure-Samples/ASA-Samples-Web-Application), 
which only provides the backend service and uses Azure AD to protect the RESTful APIs.
These RESTful APIs are protected by applying role-based access control (RBAC), anonymous users are not allowed, with the following three permissions to control access for different users:
the Anonymous user cant's access any data,
- Read, with this permission can read the ToDo data.
- Write, with this permission can write the ToDo data.
- Delete, with this permission can delete the ToDO data.

The following diagram shows the architecture of the system:

  :::image type="content" source="media/quickstart-deploy-restful-api-app/diagram.png" alt-text="Image that shows the architecture of a Spring web application." lightbox="media/quickstart-deploy-restful-api-app/diagram.png":::

[!INCLUDE [quickstart-tool-introduction](includes/quickstart-deploy-restful-api-app/quickstart-tool-introduction.md)]

## 1. Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- An Azure AD instance. For instructions on creating one, see [Quickstart: Create a new tenant in Azure AD](../active-directory/fundamentals/create-new-tenant.md).

[!INCLUDE [deploy-rest-api-app-with-basic-standard-plan](includes/quickstart-deploy-restful-api-app/deploy-rest-api-with-basic-standard-plan.md)]

## 5. Validate the app

Now we can access the RESTful API to see if it works.

### Request an access token

The RESTful APIs acts as a resource server, which is protected by Azure AD. Before acquiring an access token, it's required to register another application in Azure AD and grant permissions to the client application, which is named `ToDoWeb`.

#### Register the client application

This section provides the steps to register an application in Azure AD, which is used to add the permissions of app `ToDo`.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directory + subscription** filter (:::image type="icon" source="media/quickstart-deploy-restful-api-app/portal-directory-subscription-filter.png" border="false":::) to select the tenant in which you want to register an application.

1. Search for and Select **Azure Active Directory**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a name for your application in the **Name** field, for example `ToDoWeb`. Users of your app might see this name, and you can change it later.

1. For **Supported account types**, use the default **Accounts in this organizational directory only**.

1. Select **Register** to create the application.

1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You need it to acquire access token.

1. Select **API permissions** > **Add a permission** > **My APIs**. Select the `ToDo` application that you registered earlier, 
   then select the Permissions **ToDo.Read**, **ToDo.Write** and **ToDo.Delete**, and select **Add permissions**.

1. Select **Grant admin consent for {your-tenant-name}** to grant admin consent for the permissions you added.

   :::image type="content" source="media/quickstart-deploy-restful-api-app/api-permissions.png" alt-text="Image that shows the API permissions of a web application." lightbox="media/quickstart-deploy-restful-api-app/api-permissions.png":::

1. Navigate to **Certificates & secrets** and select the **New client secret**. On the **Add a client secret** page, enter a description for the secret, select an expiration date, and select **Add**. 

1. Look for the **Value** of the secret, and then record it for later use. You need it to acquire access token.

#### Add user to access the RESTful APIs

This section provides the steps to create a member user in your Azure AD, then the user can manage the data of ToDo application through RESTful APIs.

1. Under **Manage**, select **Users** > **New user** -> **Create new user**.

1. On the **Create new user** page, enter the following information:

    - **User principal name**: Enter a name for the user.
    - **Display name**: Enter a display name for the user.
    - **Password**: Copy the autogenerated password provided in the **Password** box.

   > [!NOTE]
   > 1. New users must complete the first login authentication and update their passwords, otherwise, you will receive an `AADSTS50055: The password is expired` error when you get the access token.
   > 2. When a new user logs in, they will receive an **Action Required** prompt, you may choose to **Ask later** to skip the validation.

1. Select **Review + create** to review your selections. Select **Create** to create the user.

#### Obtain the access token

This section provides the steps to use [OAuth 2.0 Resource Owner Password Credentials](../active-directory/develop/v2-oauth-ropc.md) method to obtain an access token in Azure AD, then access the RESTful APIs of the app `ToDo`.

1. Request an access token using the following command. Be sure to replace the placeholders with your own values you created in the previous step.

   ```bash
   export CLIENT_ID=<client-ID-of-your-app-ToDoWeb>
   export CLIENT_SECRET=<client-secret-of-your-app-ToDoWeb>
   export USERNAME=<user-principal-name>
   export PASSWORD='<user-password>'
   export TENANT_ID=<tenant-ID-of-your-Azure-AD>
   export SCOPE=api://simple-todo/ToDo.Read%20api://simple-todo/ToDo.Write%20api://simple-todo/ToDo.Delete
   curl -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=password&client_id=${CLIENT_ID}&scope=${SCOPE}&client_secret=${CLIENT_SECRET}&username=${USERNAME}&password=${PASSWORD}" \
     "https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token"
   ```

1. Look for the **access_token** value, and then record it for later use. You need it to access RESTful APIs.

### Access the RESTful APIs

This section provides the steps to access the RESTful APIs of the app `ToDo`.

1. Define the following variables for HTTP requests:
   
   ```shell
   export EXPOSED_APPLICATION_URL=<your-app-exposed-application-url-or-endpoint>
   export BEARER_TOKEN=<access-token-from-previous-step>
   ```
   
1. Ordinary users create a ToDo list:

   ```shell
   curl -X POST ${EXPOSED_APPLICATION_URL}/api/simple-todo/lists \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${BEARER_TOKEN}" \
    -d "{\"name\":\"My List\"}"
   ```

   After the addition is successful, the ToDo list information will be returned.

   ```json
   {"id":"<ID-of-the-ToDo-list>","name":"My List","description":null}
   ```
   
1. Ordinary users create a ToDo item within a list:

   ```shell
   export LIST_ID=<ID-of-the-ToDo-list>
   curl -X POST ${EXPOSED_APPLICATION_URL}/api/simple-todo/lists/${LIST_ID}/items \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${BEARER_TOKEN}" \
    -d "{\"name\":\"My first ToDo item\",\"listId\":\"${LIST_ID}\",\"state\":\"todo\"}"
   ```

   After the addition is successful, the ToDo list information will be returned.

   ```json
   {"id":"<ID-of-the-ToDo-item>","listId":<ID-of-the-ToDo-list>,"name":"My first ToDo item","description":null,"state":"todo","dueDate":"2023-07-11T13:59:24.9033069+08:00","completedDate":null}
   ```

1. Anonymous users query ToDo list:

   ```shell
   curl -X GET ${EXPOSED_APPLICATION_URL}/api/simple-todo/lists
   ```

   Return ToDo list:

   ```json
   [{"id":<ID-of-the-ToDo-list>,"name":"My List","description":null}]
   ```

1. Anonymous users query Todo items within the specified list:

   ```shell
   curl -X GET ${EXPOSED_APPLICATION_URL}/api/simple-todo/lists/${LIST_ID}/items
   ```

   Return ToDo item:

   ```json
   [{"id":"<ID-of-the-ToDo-item>","listId":<ID-of-the-ToDo-list>,"name":"My first ToDo item","description":null,"state":"todo","dueDate":"2023-07-11T13:59:24.903307+08:00","completedDate":null}]
   ```
   
1. Ordinary users modify a ToDo item within a list:

   ```shell
   export ITEM_ID=<ID-of-the-ToDo-item>
   curl -X PUT ${EXPOSED_APPLICATION_URL}/api/simple-todo/lists/${LIST_ID}/items/${ITEM_ID} \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${BEARER_TOKEN}" \
    -d "{\"id\":\"${ITEM_ID}\",\"listId\":\"${LIST_ID}\",\"name\":\"My first ToDo item\",\"description\":\"Updated description.\",\"dueDate\":\"2023-07-11T13:59:24.903307+08:00\",\"state\":\"inprogress\"}"
   ```

   After the modification is successful, the latest ToDo item information will be returned.

   ```json
   {"id":"<ID-of-the-ToDo-item>","listId": <ID-of-the-ToDo-list>,"name":"My first ToDo item","description":"Updated description.","state":"inprogress","dueDate":"2023-07-11T05:59:24.903307Z","completedDate":null}
   ```
   
1. Admin users delete a ToDo item within a list:

   ```shell
   curl -i -X DELETE ${EXPOSED_APPLICATION_URL}/api/simple-todo/lists/${LIST_ID}/items/${ITEM_ID} \
    -H "Authorization: Bearer ${BEARER_TOKEN}"
   ```
   
   You should see an output like the following snippet:
   
   ```output
   HTTP/1.1 204
   ...
   ...
   ```

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
> [Set up Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with Azure DevOps](./how-to-cicd.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
