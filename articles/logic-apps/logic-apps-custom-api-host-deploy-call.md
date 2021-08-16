---
title: Call custom web APIs & REST APIs
description: Call your own web APIs & REST APIs from Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: jonfan, logicappspm
ms.topic: article
ms.date: 05/13/2020
---

# Deploy and call custom APIs from workflows in Azure Logic Apps

After you [create your own APIs](./logic-apps-create-api-app.md) to use in your logic app workflows, 
you need to deploy those APIs before you can call them. 
You can deploy your APIs as [web apps](../app-service/overview.md), 
but consider deploying your APIs as [API apps](../app-service/app-service-web-tutorial-rest-api.md), 
which make your job easier when you build, host, and consume APIs 
in the cloud and on premises. You don't have to change any code in your 
APIs - just deploy your code to an API app. You can host your APIs on 
[Azure App Service](../app-service/overview.md), 
a platform-as-a-service (PaaS) offering that provides highly scalable, 
easy API hosting.

Although you can call any API from a logic app, 
for the best experience, add [Swagger metadata](https://swagger.io/specification/) 
that describes your API's operations and parameters. 
This Swagger document helps your API integrate more easily 
and work better with logic apps.

## Deploy your API as a web app or API app

Before you can call your custom API from a logic app, 
deploy your API as a web app or API app to Azure App Service. 
To make your Swagger document readable by the Logic Apps Designer, 
set the API definition properties and turn on 
[cross-origin resource sharing (CORS)](../app-service/overview.md) 
for your web app or API app.

1. In the [Azure portal](https://portal.azure.com), 
select your web app or API app.

2. In the app menu that opens, 
under **API**, choose **API definition**. 
Set the **API definition location** 
to the URL for your swagger.json file.

   Usually, the URL appears in this format: 
   `https://{name}.azurewebsites.net/swagger/docs/v1)`

   ![Link to Swagger document for your custom API](./media/logic-apps-custom-api-deploy-call/custom-api-swagger-url.png)

3. Under **API**, choose **CORS**. 
Set the CORS policy for **Allowed origins** to **'*'** (allow all).

   This setting permits requests from Logic App Designer.

   ![Permit requests from Logic App Designer to your custom API](./media/logic-apps-custom-api-deploy-call/custom-api-cors.png)

For more information, see 
[Host a RESTful API with CORS in Azure App Service](../app-service/app-service-web-tutorial-rest-api.md).

## Call your custom API from logic app workflows

After you set up the API definition properties and CORS, 
your custom API's triggers and actions should be available 
for you to include in your logic app workflow. 

*  To view websites that have OpenAPI URLs, 
you can browse your subscription websites in the Logic Apps Designer.

*  To view available actions and inputs by pointing at a Swagger document, 
use the [HTTP + Swagger action](../connectors/connectors-native-http-swagger.md).

*  To call any API, including APIs that don't have or expose an Swagger document, 
you can always create a request with the [HTTP action](../connectors/connectors-native-http.md).

## Next steps

* [Custom connector overview](../logic-apps/custom-connector-overview.md)
