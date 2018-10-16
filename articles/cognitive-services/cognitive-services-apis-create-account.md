---
title: Create a Cognitive Services APIs account in the Azure portal
titlesuffix: Azure Cognitive Services
description: How to create a Microsoft Cognitive Services APIs account in the Azure portal.
services: cognitive-services
author: garyericson
manager: cgronlun

ms.service: cognitive-services
ms.topic: conceptual
ms.date: 02/01/2018
ms.author: garye
---

# Quickstart: Create a Cognitive Services account in the Azure portal

Use this quickstart to begin using Azure Cognitive Services. These services are represented by Azure [resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal), which enable you to connect to one or more of the many Cognitive Services APIs available.

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
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Location** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
    | **Pricing tier** | The cost of your Cognitive Services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).
    | **Resource group** | The [Azure resource group](https://docs.microsoft.com/azure/architecture/cloud-adoption/getting-started/azure-resource-access#what-is-an-azure-resource-group) that will contain your Cognitive Services resource. You can create a new group or add it to a preexisting group. |

    ![Resource creation screen](media/cognitive-services-apis-create-account/resource_create_screen.png)

## Access your resource 

> [!NOTE]
> Subscription owners can disable the creation of Cognitive Services accounts for resource groups and subscriptions by applying [Azure policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview#policy-definition), assigning a “Not allowed resource types” policy definition, and specifying **Microsoft.CognitiveServices/accounts** as the target resource type.

After creating your resource, you can access it from the Azure dashboard if you pinned it. Otherwise, you can find it in **Resource Groups**.

Within your Cognitive Services resource, You can use the Endpoint URL and keys in the **Overview** section to start making API calls in your applications.

![Resources screen](media/cognitive-services-apis-create-account/resourceScreen.png)

## Next Steps

> [!div class="nextstepaction"]
> [Computer Vision API C# tutorial](https://docs.microsoft.com/azure/cognitive-services/computer-vision/tutorials/csharptutorial)

## See also

* [Quickstart: Extract handwritten text from an image](https://docs.microsoft.com/azure/cognitive-services/computer-vision/quickstarts/csharp-hand-text)
* [Tutorial: Create an app to detect and frame faces in an image](https://docs.microsoft.com/azure/cognitive-services/Face/Tutorials/FaceAPIinCSharpTutorial)
* [Build a custom search webpage](https://docs.microsoft.com/azure/cognitive-services/bing-custom-search/tutorials/custom-search-web-page)
* [Integrate Language Understanding (LUIS) with a bot using the Bot Framework](https://docs.microsoft.com/azure/cognitive-services/luis/luis-nodejs-tutorial-build-bot-framework-sample)
