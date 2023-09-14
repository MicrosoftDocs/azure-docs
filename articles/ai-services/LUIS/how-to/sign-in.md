---
title: Sign in to the LUIS portal and create an app
description:  Learn how to sign in to LUIS and create application.
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 07/19/2022
---
# Sign in to the LUIS portal and create an app

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Use this article to get started with the LUIS portal, and create an authoring resource. After completing the steps in this article, you will be able to create and publish LUIS apps.

## Access the portal

1. To get started with LUIS, go to the [LUIS Portal](https://www.luis.ai/). If you do not already have a subscription, you will be prompted to go create a [free account](https://azure.microsoft.com/free/cognitive-services/) and return back to the portal.
2. Refresh the page to update it with your newly created subscription
3. Select your subscription from the dropdown list

:::image type="content" source="../media/migrate-authoring-key/select-subscription-sign-in-2.png" alt-text="A screenshot showing how to select a subscription." lightbox="../media/migrate-authoring-key/select-subscription-sign-in-2.png":::

4. If your subscription lives under another tenant, you will not be able to switch tenants from the existing window. You can switch tenants by closing this window and selecting the avatar containing your initials in the top-right section of the screen. Select **Choose a different authoring resource**  from the top to reopen the window.

:::image type="content" source="../media/migrate-authoring-key/switch-directories.png" alt-text="A screenshot showing how to choose a different authoring resource." lightbox="../media/migrate-authoring-key/switch-directories.png":::

5. If you have an existing LUIS authoring resource associated with your subscription, choose it from the dropdown list. You can view all applications that are created under this authoring resource.
6. If not, then select  **Create a new authoring resource**  at the bottom of this modal.
7. When creating a new authoring resource, provide the following information:
:::image type="content" source="../media/migrate-authoring-key/create-new-authoring-resource-2.png" alt-text="A screenshot showing the page for adding resource information." lightbox="../media/migrate-authoring-key/create-new-authoring-resource-2.png":::


* **Tenant Name**  - the tenant your Azure subscription is associated with. You will not be able to switch tenants from the existing window. You can switch tenants by closing this window and selecting the avatar at the top-right corner of the screen, containing your initials. Select  **Choose a different authoring resource**  from the top to reopen the window.
* **Azure Resource group name**  - a custom resource group name you choose in your subscription. Resource groups allow you to group Azure resources for access and management. If you currently do not have a resource group in your subscription, you will not be allowed to create one in the LUIS portal. Go to [Azure portal](https://portal.azure.com/#create/Microsoft.ResourceGroup) to create one then go to LUIS to continue the sign-in process.
* **Azure Resource name**  - a custom name you choose, used as part of the URL for your authoring transactions. Your resource name can only include alphanumeric characters, `-`, and can't start or end with `-`. If any other symbols are included in the name, creating a resource will fail.
* **Location**  - Choose to author your applications in one of the [three authoring locations](../luis-reference-regions.md) that are currently supported by LUIS including: West US, West Europe and East Australia
* **Pricing tier**  - By default, F0 authoring pricing tier is selected as it is the recommended. Create a [customer managed key](../encrypt-data-at-rest.md#customer-managed-keys-for-language-understanding) from the Azure portal if you are looking for an extra layer of security.

8. Now you have successfully signed in to LUIS. You can now start creating applications. 

>[!Note]
> * When creating a new resource, make sure that the resource name only includes alphanumeric characters, '-', and can’t start or end with '-'. Otherwise, it will fail.


## Create a new LUIS app
There are a couple of ways to create a LUIS app. You can create a LUIS app in the LUIS portal, or through the LUIS authoring [APIs](../developer-reference-resource.md). 

**Using the LUIS portal** You can create a new app in the portal in several ways:
* Start with an empty app and create intents, utterances, and entities.
* Start with an empty app and add a [prebuilt domain](../luis-concept-prebuilt-model.md).
* Import a LUIS app from a .lu or .json file that already contains intents, utterances, and entities.

**Using the authoring APIs** You can create a new app with the authoring APIs in a couple of ways:
* [Add application](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f) - start with an empty app and create intents, utterances, and entities.
* [Add prebuilt application](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/59104e515aca2f0b48c76be5) - start with a prebuilt domain, including intents, utterances, and entities.

## Create new app in LUIS using portal
1. On  **My Apps**  page, select your  **Subscription** , and  **Authoring resource**  then select **+ New App**.
:::image type="content" source="../media/create-app-in-portal.png" alt-text="A screenshot showing the LUIS apps screen." lightbox="../media/create-app-in-portal.png":::

1. In the dialog box, enter the name of your application, such as Pizza Tutorial.
:::image type="content" source="../media/create-pizza-tutorial-app-in-portal.png" alt-text="A screenshot showing the create new apps dialog box." lightbox="../media/create-pizza-tutorial-app-in-portal.png":::
2. Choose your application culture, and then select  **Done**. The description and prediction resource are optional at this point. You can set then at any time in the  **Manage**  section of the portal.
    >[!NOTE]
    > The culture cannot be changed once the application is created.
    
 After the app is created, the LUIS portal shows the  **Intents**  list with the None intent already created for you. You now have an empty app.

 :::image type="content" source="../media/pizza-tutorial-new-app-empty-intent-list.png" alt-text="Intents list with a None intent and no example utterances" lightbox="../media/pizza-tutorial-new-app-empty-intent-list.png":::
  

## Next steps

If your app design includes intent detection, [create new intents](intents.md), and add example utterances. If your app design is only data extraction, add example utterances to the None intent, then [create entities](entities.md), and label the example utterances with those entities.
