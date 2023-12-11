---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 10/17/2023
---

<!-- 
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to expose RESTful APIs.

[!INCLUDE [expose-restful-apis](expose-restful-apis.md)]

-->

Use the following steps to expose your RESTful APIs in Microsoft Entra ID:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directory + subscription** filter (:::image type="icon" source="../../media/quickstart-deploy-restful-api-app/portal-directory-subscription-filter.png" border="false":::) to select the tenant in which you want to register an application.

1. Search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a name for your application in the **Name** field - for example, *Todo*. Users of your app might see this name, and you can change it later.

1. For **Supported account types**, select **Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant) and personal Microsoft accounts**.

1. Select **Register** to create the application.

1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You need it to configure the YAML configuration file for this project.

1. Under **Manage**, select **Expose an API**, find the **Application ID URI** at the beginning of the page, and then select **Add**.

1. On the **Edit application ID URI** page, accept the proposed Application ID URI (`api://{client ID}`) or use a meaningful name instead of the client ID, such as `api://simple-todo`, and then select **Save**.

1. Under **Manage**, select **Expose an API** > **Add a scope**, and then enter the following information:

   - For **Scope name**, enter *ToDo.Read*.
   - For **Who can consent**, select **Admins only**.
   - For **Admin consent display name**, enter *Read the ToDo data*.
   - For **Admin consent description**, enter *Allows authenticated users to read the ToDo data.*.
   - For **State**, keep it enabled.
   - Select **Add scope**.

1. Repeat the previous steps to add the other two scopes: *ToDo.Write* and *ToDo.Delete*.

   :::image type="content" source="../../media/quickstart-deploy-restful-api-app/expose-an-api.png" alt-text="Screenshot of the Azure portal that shows the Expose an API page of a RESTful API application." lightbox="../../media/quickstart-deploy-restful-api-app/expose-an-api.png":::
