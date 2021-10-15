---
title: "Quickstart: Custom text classification"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to start using the custom text classification feature.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 11/02/2021
ms.author: aahi
zone_pivot_groups: usage-custom-language-features     
---

# Quickstart: Custom text classification (preview)

Use this article to get started with Custom text classification using Language Studio and the REST API. Follow these steps to try out an example for creating a model for classifying support tickets.

This quickstart will explain the following steps to successfully use text classification:

1. **Create a project**, which requires a Text Analytics Azure resource. This resource provides:
    * A "key", which is a password string to access this service.
    * An "endpoint", which is a URL you will use to later send data to your model. 
    * A connection to an Azure blob storage account, which is an online data storage solution required to hold your text for analysis.

2. **Download the example data**
    * Later in this quickstart, we will provide some data for you to upload to this storage account. This data consists of tagged text files that will be used to train your model.

3. **Train a model**
    * A model is the machine learning object that will be trained to classify text from tagged data.
    * Your model will learn from the example tagged data file.

4. **Deploy a model**
    * Deploy a model, making it available for use via the Analyze API.

7. **Classify text**: Use your custom modeled for you to test and use for text classification.


::: zone pivot="language-studio"

[!INCLUDE [Language Studio quickstart](includes/quickstarts/language-studio.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API quickstart](includes/quickstarts/rest-api.md)]

::: zone-end

## Next steps

After you've created a text classification model, you can:
* [Send text classification requests to your model](how-to/run-inference.md)
* [Improve your model's performance](how-to/improve-model.md).

As you create Text Classification projects:
* [View the recommended practices](concepts/recommended-practices.md)
* [Learn how to improve your model by using evaluation metrics](how-to/view-model-evaluation.md).