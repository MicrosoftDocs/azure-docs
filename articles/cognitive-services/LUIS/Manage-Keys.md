---
title: Manage your keys in LUIS | Microsoft Docs
description: Use Language Understanding (LUIS) to manage your programmatic API, endpoint, and external keys. 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/13/2017
ms.author: cahann
---

# Manage your LUIS keys
A key allows you to publish your LUIS app. LUIS has two different types of keys: [programmatic](#programmatic-key) and [endpoint](#endpoint-key) keys. 

## Programmatic key

A programmatic key, also known as a starter key, is created automatically when you create a LUIS account and it is free. This key gives you one million (1,000,000) authoring hits and ten thousand (10,000) endpoint hits per month so you can start using your LUIS app now. You have one programmatic key across all your LUIS apps.

To find the Programmatic Key, log in to [https://www.luis.ai](https://www.luis.ai) and click on the account name in the upper-right navigation bar to open **Account Settings**, which displays the Programmatic Key.

## Endpoint Key

 When you need more than ten thousand (10,000) endpoint hits per month, create an Azure LUIS key from the [Microsoft Azure portal](https://portal.azure.com). It is essential for publishing your app and accessing your HTTP endpoint. This key allows a quota of endpoint hits based on the usage plan you specified when creating the key. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information.

An endpoint key is directly tied to an Azure LUIS subscription key. The endpoint key can be used for all your LUIS apps or for specific LUIS apps. When you publish each LUIS app, you set the endpoint key. Part of this process is choosing the Azure LUIS subscription.  
 
### To create and use an endpoint key:
On the **Publish app** page, there is already a key in the **Resources and Keys** table. This is the programmatic (starter) key. 

1. Create a LUIS key on the [Azure portal](https://portal.azure.com). For further instructions, see [Creating a subscription key using Azure](AzureIbizaSubscription.md).
 
2. In order to add the LUIS key created in the previous step, click the **Add Key** button to open the **Assign a key to your app** dialog. 

    ![Assign a key to your app](./media/luis-manage-keys/assign-key.png)
3. Select a Tenant in the dialog. 
 
    > [!Note]
    > In Azure, a tenant represents the Azure Active Directory ID of the client or organization associated with a service. If you previously signed up for an Azure subscription with your individual Microsoft Account, you already have a tenant! When you log in to the Azure portal, you are automatically logged in to [your default tenant](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant). You are free to use this tenant but you may want to create an Organizational administrator account.

4. Choose the Azure subscription associated with the Azure LUIS key you want to add.

5. Select the Azure LUIS account.

    ![Choose the key](./media/luis-manage-keys/assign-key-filled-out.png)

## Regions and keys

The region in which you publish your LUIS app corresponds to the region or location you specify in the Azure portal when you create a Azure LUIS endpoint key. When you [publish an app](./PublishApp.md), LUIS automatically generates an endpoint URL for the region associated with the key. To publish a LUIS app to more than one region, you need at least one key per region. 

## Publishing regions

LUIS apps created on https://www.luis.ai can be published to all endpoints except the European region. To publish to the European regions, you create LUIS apps at https://eu.luis.ai. 

 Global region | Azure region   |   Endpoint URL format   |
|-----|------|------|
| Asia | East Asia     |   https://eastasia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| Asia | Southeast Asia     |   https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| Australia | Australia East     |   https://australiaeast.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| *[Europe](#publishing-to-europe)| North Europe     |   https://northeurope.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   | 
| *[Europe](#publishing-to-europe) | West Europe     |   https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   | 
| South America | Brazil South     |   https://brazilsouth.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| U.S. | South Central US     |   https://southcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   | 
| U.S. | West US |   https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY  |
| U.S. | West US 2    |   https://westus2.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY  |
| U.S. |East US      |   https://eastus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| U.S. |East US 2     |   https://eastus2.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| U.S. |West Central US     |   https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |

## Publishing to Europe

To publish to the European regions, you create LUIS apps at https://eu.luis.ai only. If you attempt to publish to https://www.luis.ai using a key in the Europe region, LUIS displays a warning message. Instead, use https://eu.luis.ai. LUIS apps created at [https://eu.luis.ai](https://eu.luis.ai) don't automatically migrate to [https://www.luis.ai](https://www.luis.ai). You need to export and then import the LUIS app in order to migrate it.

## Unassign key

* In the **Resources and Keys list**, click the trash bin icon next to the entity you want to unassign. Then, click **OK** in the confirmation message to confirm deletion.
 
    ![Unassign Entity](./media/luis-manage-keys/unassign-key.png)

> [!NOTE]
> Unassigning the LUIS key does not delete it from your Azure subscription.

## Next steps

Use your key to publish your app in the **Publish app** page. For instructions on publishing, see [Publish app](PublishApp.md).