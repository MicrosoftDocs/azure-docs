---
title: Create a Cognitive Services resource in the Azure portal
titleSuffix: Azure Cognitive Services
description: Get started with Azure Cognitive Services by creating and subscribing to a resource in the Azure portal.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.topic: conceptual
ms.date: 07/16/2019
ms.author: aahi
---

# Create a Cognitive Services resource using the Azure portal

Use this quickstart to start using Azure Cognitive Services. After creating a Cognitive Service resource in the Azure portal, you'll get an endpoint and a key for authenticating your applications.


[!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

## Prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/).

## Create a new Azure Cognitive Services resource

1. Sign in to the [Azure portal](https://portal.azure.com), and click **+Create a resource**.

    ![Select Cognitive Services APIs](media/cognitive-services-apis-create-account/azurePortalScreenMulti.png)


2. Create a resource.

    #### [Multi-service resource](#tab/multiservice)

    >[!WARNING]
    > At this time, these services **can't** be called using a multi-service keys: QnA Maker, Speech Services, Custom Vision, and Anomaly Detector.
    
    Creating a multi-service Cognitive Services resource:
    * Lets you use a single Azure resource for most Azure Cognitive Services.
    * You obtain a single key that can be used with multiple Azure Cognitive Services.
    * Consolidates billing from the services you use. See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) for additional information.
    
    
    The multi-service resource is named **Cognitive Services** in the portal. To create one, [click here](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) or search for **Cognitive Services** in the portal search bar. Then select **Create**.

    ![Search for Cognitive Services](media/cognitive-services-apis-create-account/azureCogServSearchMulti.png) <!--On the resource page, select **Create**. ![Create Cognitive Services account](media/cognitive-services-apis-create-account/azurecogservsearchmulti-2.png) -->


    #### [Single-service resource](#tab/singleservice)

    Subscribing to a single-service Cognitive Services resource:
    * Lets you use a specified cognitive service.
    * You obtain a key that is specific to the cognitive service you create a resource for.
    
    Use the below links to create a resource for the available Cognitive Services:

    | Vision                      | Speech                  | Language                          | Decision             | Search                 |
    |-----------------------------|-------------------------|-----------------------------------|----------------------|------------------------|
    | [Computer vision]()         | [Speech Services]()     | [Immersive reader]()              | [Anomaly Detector]() | [Bing Search API V7]() |
    | [Computer vision service]() | [Speaker Recognition]() | [Language Understanding (LUIS)]() | [Immersive reader]() | [Bing Custom Search]() |
    | [Face]()                    |                         | [QnA Maker]()                     | [Personalizer]()     | [Bing Entity Search]() |
    | [Form Recognizer]()         |                         | [Text Analytics]()                |                      | [Bing Spell Check]()   |
    | [Ink Recognizer]()          |                         | [Translator Text]()               |                      |                        |
    | [Video Indexer]()           |                         |                                   |                      |                        |


    To see all available cognitive services in the portal, select **AI + Machine Learning**, under **Azure Marketplace**. If you don't see the service you're interested in, click on **See all** and scroll to **Cognitive Services**. Click **See more** to view the entire catalog of Cognitive Services.

    Once you are on the service you are interested in, click **Create**.
    
    ![Select Cognitive Services APIs](media/cognitive-services-apis-create-account/azureMarketplace.png)

    ***
3. On the **Create** page, provide the following information:

    #### [Multi-service resource](#tab/multiservice)

    |    |    |
    |--|--|
    | **Name** | A descriptive name for your cognitive services resource. For example, *MyCognitiveServicesResource*. |
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Location** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. Remember your Azure location, as you may need it when calling the Azure Cognitive Services. |
    | **Pricing tier** | The cost of your Cognitive Services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).
    | **Resource group** | The Azure resource group that will contain your Cognitive Services resource. You can create a new group or add it to a pre-existing group. |

    ![Resource creation screen](media/cognitive-services-apis-create-account/resource_create_screen-multi.png)

    Click **Create**.

    #### [Single-service resource](#tab/singleservice)

    |    |    |
    |--|--|
    | **Name** | A descriptive name for your cognitive services resource. For example, *TextAnalyticsResource*. |
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Location** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. Remember your Azure location, as you may need it when calling the Azure Cognitive Services. |
    | **Pricing tier** | The cost of your Cognitive Services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).
    | **Resource group** | The Azure resource group that will contain your Cognitive Services resource. You can create a new group or add it to a pre-existing group. |

    ![Resource creation screen](media/cognitive-services-apis-create-account/resource_create_screen.png)

    Click **Create**.

    ***

## Get the keys for your resource

After your resource is successfully deployed, click on **Go to resource** under **Next Steps**.

![Search for Cognitive Services](media/cognitive-services-apis-create-account/resource-next-steps.png)

From the quickstart pane that opens, you can access your key and endpoint.

![Get key and endpoint](media/cognitive-services-apis-create-account/get-cog-serv-keys.png)

[!INCLUDE [cognitive-services-environment-variables](../../includes/cognitive-services-environment-variables.md)]

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group containing the resource to be deleted
3. Right-click on the resource group listing. Select **Delete resource group**, and confirm.

## See also

* [Authenticate requests to Azure Cognitive Services](authentication.md)
* [What is Azure Cognitive Services?](Welcome.md)
* [Natural language support](language-support.md)
* [Docker container support](cognitive-services-container-support.md)
