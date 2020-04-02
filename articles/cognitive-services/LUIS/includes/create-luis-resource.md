---
title: Create LUIS resource
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 10/23/2019
ms.author: dapine
---

## Create LUIS resources

1. Use [this link](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne) to begin creating LUIS resources in the Azure portal.

1. Enter all required settings:

    |Name|Purpose|
    |--|--|
    |Resource name| A custom name you choose, used as your custom subdomain for your authoring and prediction endpoint queries.|
    |Subscription name| the subscription that will be billed for the resource.|
    |Resource group| A custom resource group name you choose or create. Resource groups allow you to group Azure resources for access and management in the same region.|
    |Authoring location|The region associated with your model.|
    |Authoring pricing tier|The pricing tier determines the maximum transaction per second and month.|
    |Runtime location|The region associated with your published prediction endpoint runtime.|
    |Runtime pricing tier|The pricing tier determines the maximum transaction per second and month.|

    > [!div class="mx-imgBorder"]
    > ![Create the language understanding resource](./media/luis-how-to-azure-subscription/create-resource-in-azure.png)

1. Click **Review + create** and wait for the resource to be created.
1. After both resources are created, still in the Azure portal, select the new authoring resource, then **Quickstarts** to get the authoring **endpoint URL** and **key** for authoring programmatically.
1. [assign the resources](./luis-how-to-azure-subscription.md#assign-an-authoring-resource-in-the-luis-portal-for-all-apps) in the LUIS portal.

[!INCLUDE [Gathering required parameters](../../containers/includes/container-gathering-required-parameters.md)]
