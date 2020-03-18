---
title: "include file"
description: "include file"
services: app-service\mobile
author: conceptdev
ms.service: app-service-mobile
ms.topic: "include"
ms.date: 06/20/2019
ms.author: crdun
ms.custom: "include file"
---
1. Sign in to the [Azure portal].

2. Click **Create a resource**.

3. In the search box, type **Web App**.
    
4. In the results list, select **Web App** from the Marketplace.

5. Select your **Subscription** and **Resource Group** (select an existing resource group _or_ create a new one (using the same name as your app)).

6. Choose a unique **Name** of your web app.

7. Choose the default **Publish** option as **Code**.

8. In the **Runtime stack**, you need to select a version under **ASP.NET** or **Node**. If you are building a .NET backend, select a version under ASP.NET. Otherwise if you are targeting a Node based application, select one of the version from Node.

9. Select the right **Operating System**, either Linux or Windows. 

10. Select the **Region** where you would like this app to be deployed. 

11. Select the appropriate **App Service Plan** and hit **Review and create**. 

12. Under **Resource Group**, select an existing resource group _or_ create a new one (using the same name as your app).

13. Click **Create**. Wait a few minutes for the service to be deployed successfully before proceeding. Watch the Notifications (bell) icon in the portal header for status updates.

14. Once the deployment is completed, click on the **Deployment details** section and then click on the Resource of Type **Microsoft.Web/sites**. It will navigate you to the App Service Web App that you just created. 

15. Click on the **Configuration** blade under **Settings** and in the **Application settings**, click on the **New application setting** button.

16. In the **Add/Edit application setting** page, enter **Name** as **MobileAppsManagement_EXTENSION_VERSION** and Value as **latest** and hit OK.

You are all set to use this newly created App Service Web app as a Mobile app.

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/