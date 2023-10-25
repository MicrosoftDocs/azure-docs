---
title: "Quickstart: Face recognition using Vision Studio"
titleSuffix: "Azure AI services"
description: In this quickstart, get started with the Face service using Vision Studio.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: include
ms.date: 06/13/2022
ms.author: pafarley
---

Use Vision Studio to identify a face. This is a streamlined version of the face identification feature: you can only train the model on a single person, and then check whether a new face matches that person. Normally, you would train the model on multiple people and then check a new image against all of them. To do the full identification scenario, use the REST API or a client SDK.

## Prerequisites

* Sign in to [Vision Studio](https://portal.vision.cognitive.azure.com/) with your Azure subscription and Azure AI services resource. See the [Get started section](../overview-vision-studio.md#get-started-using-vision-studio) of the overview if you need help with this step.
* You'll need at least three images of a person's face: two or more to train the model and one to test it.



## Identify faces

1. Select the **Face** tab, and select panel titled **Recognize a particular person**.
1. To use the try-it-out experience, you will need to choose a resource and acknowledge it will incur usage according to your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/face-api/).
1. Next, you'll name the **person** and upload the images of their face. Then select **Enroll face** and wait for the model to finish training.
1. Finally, upload another image in the bottom pane, and the service will determine whether it belongs to the **person** it was trained for.
1. See the **Detected attributes** pane for the match results and confidence scores.
1. Below the try-it-out experience are next steps to start using this capability in your own application.



## Next steps

In this quickstart, you learned how to use Vision Studio to do a basic facial recognition task. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../how-to/specify-detection-model.md)

* [What is the Face service?](../overview-identity.md)
