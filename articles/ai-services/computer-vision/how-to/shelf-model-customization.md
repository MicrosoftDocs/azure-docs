---
title: Train a custom model for Product Recognition
titleSuffix: Azure AI services
description: Learn how to use the Image Analysis model customization feature to train a model to recognize specific products in a Product Recognition task.
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 05/02/2023
ms.author: pafarley
---

# Shelf Product Recognition - Custom Model (preview)

You can train a custom model to recognize specific retail products for use in a Product Recognition scenario. The out-of-box [Analyze](shelf-analyze.md) operation doesn't differentiate between products, but you can build this capability into your app through custom labeling and training.

:::image type="content" source="../media/shelf/shelf-analysis-custom.png" alt-text="Photo of a retail shelf with product names and gaps highlighted with rectangles.":::

> [!NOTE]
> The brands shown in the images are not affiliated with Microsoft and do not indicate any form of endorsement of Microsoft or Microsoft products by the brand owners, or an endorsement of the brand owners or their products by Microsoft.

## Use the model customization feature

The [Model customization how-to guide](./model-customization.md) shows you how to train and publish a custom Image Analysis model. You can follow that guide, with a few specifications, to make a model for Product Recognition.

> [!div class="nextstepaction"]
> [Model customization](model-customization.md)


## Dataset specifications

Your training dataset should consist of images of the retail shelves. When you first create the model, you need to set the _ModelKind_ parameter to **ProductRecognitionModel**. 

Also, save the value of the _ModelName_ parameter, so you can use it as a reference later.

## Custom labeling

When you go through the labeling workflow, create labels for each of the products you want to recognize. Then label each product's bounding box, in each image.

## Analyze shelves with a custom model

When your custom model is trained and ready (you've completed the steps in the [Model customization guide](./model-customization.md)), you can use it through the Shelf Analyze operation. Set the _PRODUCT_CLASSIFIER_MODEL_ URL parameter to the name of your custom model (the _ModelName_ value you used in the creation step).

The API call will look like this:

```bash
curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/computervision/productrecognition/ms-pretrained-product-detection/runs/<your_run_name>?api-version=2023-04-01-preview" -d "{
    'url':'<your_url_string>'
}"
```

1. Make the following changes in the command where needed:
    1. Replace the `<subscriptionKey>` with your Vision resource key.
    1. Replace the `<endpoint>` with your Vision resource endpoint. For example: `https://YourResourceName.cognitiveservices.azure.com`.
    2. Replace the `<your_run_name>` with your unique test run name for the task queue. It is an async API task queue name for you to be able retrieve the API response later. For example, `.../runs/test1?api-version...`
    1. Replace the `<your_url_string>` contents with the blob URL of the image
1. Open a command prompt window.
1. Paste your edited `curl` command from the text editor into the command prompt window, and then run the command.

## Next steps

In this guide, you learned how to use a custom Product Recognition model to better meet your business needs. Next, set up planogram matching, which works in conjunction with custom Product Recognition.

> [!div class="nextstepaction"]
> [Planogram matching](shelf-planogram.md)

* [Image Analysis overview](../overview-image-analysis.md)
