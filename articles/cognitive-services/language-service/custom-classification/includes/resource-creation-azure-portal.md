---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/04/2022
ms.author: aahi
---

### Create a new resource from the Azure portal

Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. If you're asked to select additional features, select **Skip this step**. When you create your resource, ensure it has the following parameters.  

:::image type="content" source="../media/select-custom-feature-azure-portal.png" alt-text="A screenshot showing available additional features." lightbox="../media/select-custom-feature-azure-portal.png":::

|Requirement  |Required value  |
|---------|---------|
|Location | "West US 2" or "West Europe"         |
|Pricing tier     | Standard (**S**) pricing tier        |

> [!IMPORTANT]
> In the **Custom named entity recognition (NER) & custom text classification (Preview)** section, make sure you choose an existing storage account, or create a new one. A storage account is required to use custom text classification. While you can specify a storage account later, it's easier to do it now. 
