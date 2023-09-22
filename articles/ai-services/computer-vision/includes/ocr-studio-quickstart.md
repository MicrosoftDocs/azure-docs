---
title: "Quickstart: Optical character recognition using Vision Studio"
titleSuffix: "Azure AI services"
description: In this quickstart, get started with the OCR service using Vision Studio.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
---

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- [An Azure AI Vision resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision). You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- Connect to [Vision Studio](https://portal.vision.cognitive.azure.com/).

  - You might need to sign in.
  - After you sign in, select **View all resources**. If necessary, select **Refresh**. Verify that your resource is available.

  For more information, see [Get started using Vision Studio](../overview-vision-studio.md#get-started-using-vision-studio).

## Read printed and handwritten text

1. Under **Optical character recognition**, select **Extract text from images**.
1. Under **Try it out**, acknowledge that this demo incurs usage to your Azure account. For more information, see [Azure AI Vision pricing](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/).
1. Select an image from the available set, or upload your own.
1. If necessary, select **Please select a resource** to select your resource.

   After you select your image, the extracted text appears in the output window. You can also select the **JSON** tab to see the JSON output that the API call returns.

Below the try-it-out experience are next steps to start using this capability in your own application.

## Next steps

In this quickstart, you used Vision Studio to access the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
> [Call the Read API](../how-to/call-read-api.md)

- [OCR overview](../overview-ocr.md)
