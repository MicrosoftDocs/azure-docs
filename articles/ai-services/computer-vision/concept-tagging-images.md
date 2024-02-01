---
title: Content tags - Azure AI Vision
titleSuffix: Azure AI services
description: Learn concepts related to the images tagging feature of the Azure AI Vision API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 09/20/2022
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Image tagging

Image Analysis can return content tags for thousands of recognizable objects, living beings, scenery, and actions that appear in images. Tags are not organized as a taxonomy and do not have inheritance hierarchies. A collection of content tags forms the foundation for an image [description](./concept-describing-images.md) displayed as human readable language formatted in complete sentences. When tags are ambiguous or not common knowledge, the API response provides hints to clarify the meaning of the tag in context of a known setting.

After you upload an image or specify an image URL, the Analyze API can output tags based on the objects, living beings, and actions identified in the image. Tagging is not limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets, and so on.

Try out the image tagging features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Image tagging example

The following JSON response illustrates what Azure AI Vision returns when tagging visual features detected in the example image.

![A blue house and the front yard](./Images/house_yard.png).

```json
{
   "tags":[
      {
         "name":"grass",
         "confidence":0.9960499405860901
      },
      {
         "name":"outdoor",
         "confidence":0.9956876635551453
      },
      {
         "name":"building",
         "confidence":0.9893627166748047
      },
      {
         "name":"property",
         "confidence":0.9853052496910095
      },
      {
         "name":"plant",
         "confidence":0.9791355133056641
      },
      {
         "name":"sky",
         "confidence":0.9764555096626282
      },
      {
         "name":"home",
         "confidence":0.9732913970947266
      },
      {
         "name":"house",
         "confidence":0.9726772904396057
      },
      {
         "name":"real estate",
         "confidence":0.972320556640625
      },
      {
         "name":"yard",
         "confidence":0.9480282068252563
      },
      {
         "name":"siding",
         "confidence":0.945357620716095
      },
      {
         "name":"porch",
         "confidence":0.9410697221755981
      },
      {
         "name":"cottage",
         "confidence":0.9143695831298828
      },
      {
         "name":"tree",
         "confidence":0.9111741185188293
      },
      {
         "name":"farmhouse",
         "confidence":0.8988939523696899
      },
      {
         "name":"window",
         "confidence":0.894851565361023
      },
      {
         "name":"lawn",
         "confidence":0.8940501809120178
      },
      {
         "name":"backyard",
         "confidence":0.8931854963302612
      },
      {
         "name":"garden buildings",
         "confidence":0.885913610458374
      },
      {
         "name":"roof",
         "confidence":0.8695329427719116
      },
      {
         "name":"driveway",
         "confidence":0.8670971393585205
      },
      {
         "name":"land lot",
         "confidence":0.8564285039901733
      },
      {
         "name":"landscaping",
         "confidence":0.8540750741958618
      }
   ],
   "requestId":"d60ac02b-966d-4f62-bc24-fbb1fec8bd5d",
   "metadata":{
      "height":200,
      "width":300,
      "format":"Png"
   },
   "modelVersion":"2021-05-01"
}
```

## Use the API

The tagging feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Tags` in the **visualFeatures** query parameter. Then, when you get the full JSON response, parse the string for the contents of the `"tags"` section.


* [Quickstart: Image Analysis REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)

## Next steps

Learn the related concepts of [categorizing images](concept-categorizing-images.md) and [describing images](concept-describing-images.md).
