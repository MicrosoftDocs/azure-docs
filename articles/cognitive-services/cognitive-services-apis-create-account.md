---
title: "Quickstart: Create and access Azure Cognitive Services using Azure resources"
titleSuffix: Microsoft Docs
description: Learn how to create and access Azure Cognitive Services.
services: cognitive-services
documentationcenter: ''
author: aahill
manager: cgronlun
editor: 

ms.assetid: b6176bb2-3bb6-4ebf-84d1-3598ee6e01c6
ms.service: cognitive-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/06/2018
ms.author: aahi
ms.reviewer: gibattag

---

# Quickstart: Create and access Cognitive Services using Azure resources

Before accessing Azure Cognitive Services, you must create and subscribe to at least one Cognitive Services [resource](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal). These resources enable you to connect to one or more of the many Cognitive Services APIs available.

## Prerequisites

* A valid Azure subscription. you can [create an account](https://azure.microsoft.com/free/) for free.

## Create and subscribe to an Azure Cognitive Services resource

1. Sign in to the [Azure portal](http://portal.azure.com), and click **+Create a resource**.
    
    ![Select Cognitive Services APIs](media/cognitive-services-apis-create-account/azurePortalScreen.png)

2. Under Azure Marketplace, select **AI + Machine Learning**. If you don't see the service you're interested in, click on **See all** to view the entire catalog of Cognitive Services APIs.

    ![Select Cognitive Services APIs](media/cognitive-services-apis-create-account/azureMarketplace.png)

3. On the **Create** page, provide the following information:

    |    |    |
    |--|--|
    | **Name** | A descriptive name for your cognitive services resource. We recommend using a descriptive name, for example *MyNameFaceAPIAccount*. |
    | **Subscription:** | Select one of your available Azure subscriptions. |
    | **Pricing tier:** | The cost of your Cognitive Services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).
    | **Location:** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |

    ![Resource creation screen](media/cognitive-services-apis-create-account/resource_create_screen.png)

## Access your resource 

After creating your resource, you can access it from the Azure dashboard if you pinned it. Otherwise, you can find it in **Resource Groups**.

Within your Cognitive Services resource, You can use the Endpoint URL and keys in the **Overview** section to start making API calls in your applications.

![Resources screen](media/cognitive-services-apis-create-account/resourceScreen.png)

## Next Steps

> [!div class="nextstepaction"]
> [Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)

## See also

* [Quickstart: Extract handwritten text from an image](https://docs.microsoft.com/azure/cognitive-services/computer-vision/quickstarts/csharp-hand-text)
* [Tutorial: Create an app to detect and frame faces in an image](https://review.docs.microsoft.com/azure/cognitive-services/Face/Tutorials/FaceAPIinCSharpTutorial?branch=pr-en-us-51089)
* [Build a custom search webpage](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-custom-search/tutorials/custom-search-web-page)
* [Integrate Language Understanding (LUIS) with a bot using the Bot Framework](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-nodejs-tutorial-build-bot-framework-sample)