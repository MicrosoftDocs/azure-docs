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

A key allows you to author _or_ query your LUIS app. 

<a name="programmatic-key" ></a>
<a name="authoring-key" ></a>
<a name="endpoint-key" ></a>
<a name="use-endpoint-key-in-query" ></a>
<a name="api-usage-of-ocp-apim-subscription-key" ></a>
<a name="key-limits" ></a>
<a name="key-limit-errors" ></a>
## Key concepts
See [Keys in LUIS](luis-concept-keys.md) to understand LUIS authoring and endpoint key concepts.

On the **Keys and Endpoints** page, both the free authoring key and the Azure-created endpoint key are displayed. 

## Authoring key

Your authoring key in displayed both at the top and in the endpoint keys table only to help you get started using LUIS. This key has a limited number of endpoint queries it allows. After those few endpoint queries, the key will not work as and endpoint key. Create a endpoint key to extend the number of available endpoint queries. 

<a name="create-and-use-an-endpoint-key"></a>
## Assign endpoint key

1. Create a LUIS key on the [Azure portal](https://portal.azure.com). For further instructions, see [Creating an endpoint key using Azure](luis-how-to-azure-subscription.md).
 
2. In order to add the LUIS key created in the previous step, select **Assign Key +** to open the **Assign a key to your app** dialog. 

    ![Assign a key to your app](./media/luis-manage-keys/assign-key.png)
3. Select a Tenant in the dialog associated with the email address you login with to the LUIS website.  
 
    > [!Note]
    > In Azure, a tenant represents the Azure Active Directory ID of the client or organization associated with a service. If you previously signed up for an Azure subscription with your individual Microsoft Account, you already have a tenant! When you log in to the Azure portal, you are automatically logged in to [your default tenant](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant). You are free to use this tenant but you may want to create an Organizational administrator account.

4. Choose the **Subscription Name** associated with the Azure LUIS key you want to add.

5. Select the **LUIS resource name**. The region of the resource is displayed in parentheses. 

6. Select the **Region Time Zone**. See [Change time zone of prebuilt datetimeV2 entity](luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity) for more information.

7. Select **Assign Keys**. After you assign this endpoint key, use it in all endpoint queries.

<!-- content moved to luis-reference-regions.md, need replacement links-->
<a name="regions-and-keys"></a>
<a name="publishing-to-europe"></a>
<a name="publishing-to-australia"></a>

## Publishing regions

Learn more about publishing [regions](luis-reference-regions.md) including publishing in [Europe](luis-reference-regions.md#publishing-to-europe), and [Australia](luis-reference-regions.md#publishing-to-australia). Publishing regions are different from authoring regions. Create an app in the authoring region corresponding to the publishing region you want for the query endpoint.

## Unassign key
When you unassign the key, it is not deleted it from your Azure subscription.

## Next steps

Use your key to publish your app in the **Publish app** page. For instructions on publishing, see [Publish app](luis-how-to-publish-app.md).