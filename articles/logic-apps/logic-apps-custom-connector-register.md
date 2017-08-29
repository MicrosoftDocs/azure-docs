---
title: Register custom connectors - Azure Logic Apps | Microsoft Docs
description: Set up custom connectors for use in Azure Logic Apps
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# Register custom connectors in Azure Logic Apps

After you build your REST API, set up authentication, 
and get your API definition file, you're ready to register your connector.

## Prerequisites

To register your custom connector, you need these items:

* Details for registering your connector in Azure, 
such as the name, Azure subscription, Azure resource group, 
and location that you want to use

* An OpenAPI (Swagger) file that describes your API. 
For this tutorial, you can use the 
[sample Azure Resources Manager OpenAPI file](http://pwrappssamples.blob.core.windows.net/samples/AzureResourceManager.json).

* An icon that represents your connector

* A short description for your connector

* The host location for your API

## Create your connector

1. In the Azure portal, on the main Azure menu, choose **New**. 
In the search box, enter "logic apps connector" as your filter, 
and press Enter. From the results list, choose **Logic Apps Connector** > **Create**.

2. Provide details for registering your connector 
as described in the table. When you're done, 
choose **Pin to dashboard** > **Create**.

   | Property | Suggested value | Description | 
   | -------- | --------------- | ----------- | 
   | **Name** | *custom-connector-name* | Provide a name for your connector. | 
   | **Subscription** | *your-Azure-subscription* | Select your Azure subscription. | 
   | **Resource group** | *Azure-resource-group-name* | Create or select an Azure group for organizing your Azure resources. | 
   | **Location** | *your-selected-region* | Select a deployment region for your connector. | 
   |||| 

3. In your connector's menu, choose **Logic Apps Connector**. 
In the toolbar, choose **Edit**.

4. Choose **General** so you can provide the details 
in these tables for creating, securing, and defining the 
actions and triggers for your custom connector.

   1. For **Custom connectors**, select an option 
   so you can provide the OpenAPI (Swagger) file that describes your API.

      ![Provide the OpenAPI file for your API](./media/logic-apps-custom-connector-register/provide-openapi-file.png)

      | Option | Format |Description | 
      | ------ | ------ | ----------- | 
      | **Upload an OpenAPI file** | *OpenAPI (Swagger)-json-file* | Browse to the location for your OpenAPI file, and select that file. | 
      | **Use an OpenAPI URL** | http://*path-to-swagger-json-file* | Provide the URL for your API's OpenAPI file. | 
      | **Upload Postman collection V1** | *exported-Postman-collection-V1-file* | Browse to the location for an exported Postman collection in V1 format. | 
      |||| 

   2. For **General information**, provide these items for identifying 
   and describing your connector, such as an icon and a description: 

      ![Connector details](./media/logic-apps-custom-connector-register/add-connector-details.png)

      | Option or setting | Format | Description | 
      | ----------------- | ------ | ----------- | 
      | **Upload Icon** | *png-or-jpg-file-under-1-MB* | Provide the icon that represents your connector. | 
      | **Icon background color** | *hexadecimal-color-code* | Shows a color behind your icon. Provide the hexadecimal code for that color. For example, #007ee5 represents the color blue. | 
      | **Description** | *connector-description* | Provide a short description for your connector. | 
      | **Host** | *connector-host* | Provide the host domain used by your connector. | 
      | **Base URL** | *connector-base-URL* | Provide the base URL for your connector. | 
      |||| 

   3. When you're done, choose **Continue**.

5. Now choose **Security**, then choose **Edit** so you can 
select the authentication type that your API uses.  
Then provide additional details for that authentication type. 
These settings make sure that user identities flow appropriately 
between your service and any clients.

   ![Choose authentication type](./media/logic-apps-custom-connector-register/security.png)

   In this example, the OpenAPI file uses an Azure AD app for authentication, 
   so you must provide information about the Azure AD app to Logic Apps. 

   1. Under **Authentication type**, select this type: **OAuth 2.0**
   2. Under **OAuth 2.0**, select **Azure Active Directory**.
   3. Under **Client id**, type the Azure AD *Application ID* that you previously saved. 
   4. For **Client secret**, use the *client key* that you saved earlier.
   5. For **Resource URL**, enter this URL: `https://management.core.windows.net/`

      > [!IMPORTANT] 
      > Make sure that you include the 
      > **Resource URL** exactly as specified here, 
      > including the trailing slash.

   6. When you're ready, choose **Continue**.

6. Now choose **Definition** so you can define the actions or triggers 
that users can add to their workflows.

   You can edit your connector's schema and response for existing operations, 
   or add new operations. You can also specify each operation's properties 
   so that you can control your connector's end-user experience. 

   ![Connector definition](./media/logic-apps-custom-connector-register/definition.png)

   To learn more about the different operation types:

   * Triggers for [Logic Apps](**NEED TOPIC**)
   * Actions for [Logic Apps](../logic-apps/logic-apps-custom-connector-register.md) 

   For advanced connector functionality, 
   see [Logic Apps: OpenAPI extensions for custom connectors](../logic-apps/custom-connector-openapi-extensions.md).

   To request features that aren't available in the registration wizard, 
   contact [condevhelp@microsoft.com](mailto:condevhelp@microsoft.com).

7. Now that the custom connector is registered, 
you must create a connection to the custom connector 
so that you can use the connector in your logic apps. 

## FAQ

**Q:** Is there a limit on how many connectors I create? </br>
**A:** Yes, this number differs based on your target service, 
so review the pricing page for that service:

* [Logic Apps pricing](**NEED INFO!!!!!!!!**)
* [Flow pricing](https://flow.microsoft.com/pricing/)
* [PowerApps pricing](https://powerapps.microsoft.com/pricing/)

(**VERIFY FOR LOGIC APPS**)
**Q:** Is there a limit on how many requests that users can make with a custom connector? </br>
**A:** Yes, for each connection that's created by a custom connector, 
you can make up to 500 requests per minute. 

## Next steps

* [Optional: Certify your connector](../logic-apps/custom-connector-submit-certification.md)