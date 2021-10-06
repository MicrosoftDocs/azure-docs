---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 09/08/2021
ms.author: aahi
---

### Create a new resource from the Azure portal

Go to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Lngugae Servicesresource from Azure. If you're asked to select additional features, select **Skip this step**. When you create your resource, ensure it has the following values to call the custom text classification API.  

|Requirement  |Required value  |
|---------|---------|
|Location | "West US 2" or "West Europe"         |
|Pricing tier     | Standard (**S**) pricing tier        |

> [!IMPORTANT]
> In the **Custom Named Entity Recognition (NER) & Custom Classification (Preview)** section, make sure you choose an existing storage account, or create a new one. A storage account is required to use custom text classification. While you can specify a storage account later, it's easier to do it now. 
