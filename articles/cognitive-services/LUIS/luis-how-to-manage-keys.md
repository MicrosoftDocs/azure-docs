---
title: Manage the authoring and endpoint keys in LUIS | Microsoft Docs
description: Use Language Understanding (LUIS) to manage your programmatic API, endpoint, and external keys.
titleSuffix: Azure
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 07/31/2018
ms.author: diberry
---

# Add LUIS endpoint keys to app

After you create a LUIS endpoint key in the Azure portal, assign the key to the LUIS app and get the correct endpoint URL. Use this endpoint URL to get LUIS predictions.

<a name="programmatic-key" ></a>
<a name="authoring-key" ></a>
<a name="endpoint-key" ></a>
<a name="use-endpoint-key-in-query" ></a>
<a name="api-usage-of-ocp-apim-subscription-key" ></a>
<a name="key-limits" ></a>
<a name="key-limit-errors" ></a>
<a name="key-concepts"></a>
<a name="authoring-key"></a>
<a name="create-and-use-an-endpoint-key"></a>

## Assign endpoint key

1. Create a LUIS key on the [Azure portal](https://portal.azure.com). For further instructions, see [Creating an endpoint key using Azure](luis-how-to-azure-subscription.md).
 
2. In order to add the LUIS key created in the previous step, select **Assign Key +** to open the **Assign a key to your app** dialog. 

    ![Assign a key to your app](./media/luis-manage-keys/assign-key.png)
3. Select a Tenant in the dialog associated with the email address you login with to the LUIS website.  
<!-- 
    > [!Note]
    > In Azure, a tenant represents the Azure Active Directory ID of the client or organization associated with a service. If you previously signed up for an Azure subscription with your individual Microsoft Account, you already have a tenant! When you log in to the Azure portal, you are automatically logged in to [your default tenant](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant). You are free to use this tenant but you may want to create an Organizational administrator account.-->

4. Choose the **Subscription Name** associated with the Azure LUIS key you want to add.

5. Select the **LUIS resource name**. The region of the resource is displayed in parentheses. 

6. Select the **Region Time Zone**. See [Change time zone of prebuilt datetimeV2 entity](luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity) for more information.

7. Select **Assign Keys**. 

8. Find the new row in the table and copy the endpoint URL. It is correctly constructed to make an HTTP GET request to the LUIS endpoint for a prediction. 

<!-- content moved to luis-reference-regions.md, need replacement links-->
<a name="regions-and-keys"></a>
<a name="publishing-to-europe"></a>
<a name="publishing-to-australia"></a>

## Publishing regions

Learn more about publishing [regions](luis-reference-regions.md) including publishing in [Europe](luis-reference-regions.md#publishing-to-europe), and [Australia](luis-reference-regions.md#publishing-to-australia). Publishing regions are different from authoring regions. Create an app in the authoring region corresponding to the publishing region you want for the query endpoint.

## Unassign key
When you unassign the endpoint key, it is not deleted it from your Azure subscription. When an endpoint key is unassigned, or not assigned to the app, any endpoint URL requests return a 401 with the error: `` 

## Next steps

Use your key to publish your app in the **Publish app** page. For instructions on publishing, see [Publish app](luis-how-to-publish-app.md).

See [Keys in LUIS](luis-concept-keys.md) to understand LUIS authoring and endpoint key concepts.