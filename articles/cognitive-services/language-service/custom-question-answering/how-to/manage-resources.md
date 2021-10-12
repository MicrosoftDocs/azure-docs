---
title: Set up a custom question answering enabled resource
description: Before you can create any knowledge bases, you must first set up custom question answering in Azure. Anyone with authorization to create new resources in a subscription can set up a custom question answering enabled resource.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 11/02/2021
---

# Manage custom question answering resources

Before you can create knowledge bases, you must first set up a custom question answering enabled language resource in Azure. Anyone with authorization to create new resources in a subscription can set up a language resource with custom question answering enabled. 

A solid understanding of the following concepts is helpful before creating your resource:

* [QnA Maker resources](../../../qnamaker/Concepts/azure-resources.md)
* [Authoring and publishing keys](../../../qnamaker/Concepts/azure-resources.md#keys-in-qna-maker)

## Create a new custom question answering enabled resource

This procedure creates the Azure resources needed to manage the knowledge base content. After you complete these steps, you'll find the *subscription* keys on the **Keys** page for the resource in the Azure portal.

1.  Sign in to the Azure portal and [create a language](https://aka.ms/create-language-resource) resource. <!--TODO: Change link-->

1.  Select Custom question answering feature to add to the language resource. Click on **Continue to create your resource**.

    > [!div class="mx-imgBorder"]
    > ![Add QnA to TA](../../../qnamaker/media/qnamaker-how-to-setup-service/select-qna-feature-create-flow.png)

1.  Select the appropriate tiers and regions for the language resource. For the custom question answering feature, select search location and pricing tier.

    > [!div class="mx-imgBorder"]
    > ![Create a new TA service - pricing tier and regions](../../../qnamaker/media/qnamaker-how-to-setup-service/custom-qna-create-button.png)

    * Choose the **Subscription** under which the language resource will be deployed.
    * Create a new **Resource group** (recommended) or use an existing one in which to deploy this language resource. Enabling custom question answering with a language resource creates fewer Azure resources. When you create a resource group to hold these resources, you can easily find, manage, and delete these resources by the resource group name.
    * In the **Name** field, enter a unique name to identify this language resource. 
    * Choose the **Location** where you want the language resource to be deployed. The management APIs and service endpoint will be hosted in this location. 
    * Select the **Pricing tier** for the language service. See [more details about SKU pricing](https://aka.ms/qnamaker-pricing).
    * Choose the **Search location** where you want Azure Cognitive Search indexes to be deployed. Restrictions on where customer data must be stored will help determine the location you choose for Azure Cognitive Search.
    * Choose the **Search pricing tier** of the Azure Cognitive Search service. If the Free tier option is unavailable (appears dimmed), it means you already have a free service deployed through your subscription. In that case, you'll need to start with the Basic tier. See [Azure Cognitive Search pricing details](https://azure.microsoft.com/pricing/details/search/).

1.  After all the fields are validated, select **Review + Create**. The process can take a few minutes to complete.

    > [!div class="mx-imgBorder"]
    > ![Review TA resource](../../../qnamaker/media/qnamaker-how-to-setup-service/custom-qna-review-resource.png)

1.  After deployment is completed, you'll see the following resources created in your subscription:

    > [!div class="mx-imgBorder"]
    > ![Resource created a new QnA Maker managed (Preview) service](../../../qnamaker/media/qnamaker-how-to-setup-service/resources-created-question-answering.png)

    The resource with the _Cognitive Services_ type has your _subscription_ keys.

## Upgrade Azure resources

### Upgrade the Azure Cognitive Search service

If you plan to have many knowledge bases, upgrade your Azure Cognitive Search service pricing tier.

Currently, you can't perform an in-place upgrade of the Azure search SKU. However, you can create a new Azure search resource with the desired SKU, restore the data to the new resource, and then link it to the Custom question answering stack. To do this, follow these steps:

1. Create a new Azure search resource in the Azure portal, and select the desired SKU.

    ![QnA Maker Azure search resource](../../../qnamaker/media/qnamaker-how-to-upgrade-qnamaker/qnamaker-azuresearch-new.png)

1. Restore the indexes from your original Azure search resource to the new one. See the [backup restore sample code](https://github.com/pchoudhari/QnAMakerBackupRestore).

1. Link the new Azure search resource to the Custom question answering feature in the [features tab of the language resource](../../../qnamaker/how-to/configure-qna-maker-resources.md) .

### Inactivity policy for free Search resources

If you are not using a language resource, you should remove all the resources. If you don't remove unused resources, your knowledge base will stop working if you created a free Search resource.

Free Search resources are deleted after 90 days without receiving an API call.

## Delete Azure resources

If you delete any of the Azure resources used for your knowledge bases, the knowledge bases will no longer function. Before deleting any resources, make sure you export your knowledge bases from the **Settings** page.

## Next steps

Learn more about the [App service](../../../../app-service/index.yml) and [Search service](../../../../search/index.yml).
