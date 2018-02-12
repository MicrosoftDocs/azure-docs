---
title: Manage your keys in LUIS | Microsoft Docs
description: Use Language Understanding (LUIS) to manage your programmatic API, endpoint, and external keys. 
titleSuffix: Azure
services: cognitive-services
author: v-geberr
manager: Kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 01/25/2018
ms.author: v-geberr
---

# Manage your LUIS keys
A key allows you to publish your LUIS app. LUIS has two different types of keys: [programmatic](#programmatic-key) and [endpoint](#endpoint-key) keys. 

## Programmatic key

A programmatic key, also known as a starter key, is created automatically when you create a LUIS account and it is free. You have one programmatic key across all your LUIS apps. Use the [key limits chart](#key-limits) to understand the purpose and limit of the key. 

To find the Programmatic Key, log in to [LUIS][LUIS] and click on the account name in the upper-right navigation bar to open **Account Settings**.

![Programmatic Key](./media/luis-manage-keys/programatic-key.png)

## Endpoint Key

 When you need a larger limit than the programmatic key, create an Azure LUIS key from the [Microsoft Azure portal](https://portal.azure.com). It is essential for publishing your app and accessing your HTTP endpoint. This key allows a quota of endpoint hits based on the usage plan you specified when creating the key. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information.

An endpoint key is directly tied to an Azure LUIS subscription key. The endpoint key can be used for all your LUIS apps or for specific LUIS apps. When you publish each LUIS app, you set the endpoint key. Part of this process is choosing the Azure LUIS subscription.  

## Key limits
The programmatic key has different limits for authoring and endpoint. The subscription key is only valid for endpoint queries.

|Key|Authoring|Endpoint|Purpose|
|--|--|--|--|
|Programmatic/Starter|1 million/month|1 thousand/month|Authoring your LUIS app|
|Subscription - F0 - Free tier |invalid|10 thousand/month, 5/second|Querying your LUIS endpoint|
|Subscription - S0 - Basic tier|invalid|1 million/month, 50/second|Querying your LUIS endpoint|
 
## Key limit errors
If you exceed your per second quota, you receive an HTTP 429 error. If you exceed your per month quota, you receive an HTTP 403 error. 

## Create and use an endpoint key
On the **Publish app** page, there is already a key in the **Resources and Keys** table. This is the programmatic (starter) key. 

1. Create a LUIS key on the [Azure portal](https://portal.azure.com). For further instructions, see [Creating a subscription key using Azure](AzureIbizaSubscription.md).
 
2. In order to add the LUIS key created in the previous step, click the **Add Key** button to open the **Assign a key to your app** dialog. 

    ![Assign a key to your app](./media/luis-manage-keys/assign-key.png)
3. Select a Tenant in the dialog. 
 
    > [!Note]
    > In Azure, a tenant represents the Azure Active Directory ID of the client or organization associated with a service. If you previously signed up for an Azure subscription with your individual Microsoft Account, you already have a tenant! When you log in to the Azure portal, you are automatically logged in to [your default tenant](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant). You are free to use this tenant but you may want to create an Organizational administrator account.

4. Choose the Azure subscription associated with the Azure LUIS key you want to add.

5. Select the Azure LUIS account. The region of the account is displayed in parentheses. 

    ![Choose the key](./media/luis-manage-keys/assign-key-filled-out.png)


<!-- content moved to luis-reference-regions.md, need replacement links-->
<a name="regions-and-keys"></a>
<a name="publishing-to-europe"></a>
<a name="publishing-to-australia"></a>

## Publishing regions
Learn more about publishing [regions](luis-reference-regions.md) including publishing in [Europe](luis-reference-regions.md#publishing-to-europe), and [Australia](luis-reference-regions.md#publishing-to-australia). 


## Unassign key

* In the **Resources and Keys list**, click the trash bin icon next to the entity you want to unassign. Then, click **OK** in the confirmation message to confirm deletion.
 
    ![Unassign Entity](./media/luis-manage-keys/unassign-key.png)

> [!NOTE]
> Unassigning the LUIS key does not delete it from your Azure subscription.

## Next steps

Use your key to publish your app in the **Publish app** page. For instructions on publishing, see [Publish app](PublishApp.md).

[LUIS]: luis-reference-regions.md