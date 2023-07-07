---
title: Train a custom model for Product Recognition
titleSuffix: Azure AI services
description: Learn how to use the Image Analysis model customization feature to train a model to recognize specific products in a Product Recognition task.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 05/02/2023
ms.author: pafarley
---

# Train a custom Product Recognition model

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
curl.exe -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -H "Content-Type: application/json" "https://<endpoint>/vision/v4.0-preview.1/operations/shelfanalysis-productunderstanding:analyze?PRODUCT_CLASSIFIER_MODEL=myModelName" -d "{
    'url':'<your_url_string>'
}"
```

## Next steps

In this guide, you learned how to use a custom Product Recognition model to better meet your business needs. Next, set up planogram matching, which works in conjunction with custom Product Recognition.

> [!div class="nextstepaction"]
> [Planogram matching](shelf-planogram.md)

* [Image Analysis overview](../overview-image-analysis.md)
