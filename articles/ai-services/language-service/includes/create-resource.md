---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/06/2022
ms.author: aahi
---

### Create an Azure resource

To use the code sample below, you'll need to deploy an Azure resource. This resource will contain a key and endpoint you'll use to authenticate the API calls you send to the Language service.

1. Use the following link to <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics" target="_blank">create a language resource</a> using the Azure portal. You will need to sign in using your Azure subscription.
1. On the **Select additional features** screen that appears, select **Continue to create your resource**.

    :::image type="content" source="../media/portal-resource-additional-features.png" alt-text="A screenshot showing additional feature options in the Azure portal." lightbox="../media/portal-resource-additional-features.png":::

1. In the **Create language** screen, provide the following information:

    |Detail  |Description  | 
    |---------|---------|
    |Subscription     | The subscription account that your resource will be associated with. Select your Azure subscription from the drop-down menu.         |
    |Resource group   | A resource group is a container that stores the resources you create. Select **Create new** to create a new resource group.         |
    |Region     | The location of your Language resource. Different regions may introduce latency depending on your physical location, but have no impact on the runtime availability of your resource. For this quickstart, either select an available region near you, or choose **East US**.        |
    |Name     | The name for your Language resource. This name will also be used to create an endpoint URL that your applications will use to send API requests.         |
    |Pricing tier     | The [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/) for your Language resource. You can use the **Free F0** tier to try the service and upgrade later to a paid tier for production.       |
     
    :::image type="content" source="../media/portal-resource-creation-details.png" alt-text="A screenshot showing resource creation details in the Azure portal." lightbox="../media/portal-resource-creation-details.png":::

1. Make sure the **Responsible AI Notice** checkbox is checked.
1. Select **Review + Create** at the bottom of the page.

1. In the screen that appears, make sure the validation has passed, and that you entered your information correctly. Then select **Create**. 
