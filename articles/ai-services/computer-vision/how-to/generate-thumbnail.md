---
title: "Generate a smart-cropped thumbnail - Image Analysis"
titleSuffix: Azure AI services
description: Use the Image Analysis REST API to generate a thumbnail with smart cropping.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 07/20/2022
ms.author: pafarley
---

# Generate a smart-cropped thumbnail

You can use Image Analysis to generate a thumbnail with smart cropping. You specify the desired height and width, which can differ in aspect ratio from the input image. Image Analysis uses smart cropping to intelligently identify the area of interest and generate cropping coordinates around that region.

## Call the Generate Thumbnail API

To call the API, do the following steps:

1. Copy the following command into a text editor.
1. Make the following changes in the command where needed:
    1. Replace the value of `<subscriptionKey>` with your key.
    1. Replace the value of `<thumbnailFile>` with the path and name of the file in which to save the returned thumbnail image.
    1. Replace the first part of the request URL (`westcentralus`) with the text in your own endpoint URL.
        [!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]
    1. Optionally, change the image URL in the request body (`https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png`) to the URL of a different image from which to generate a thumbnail.
1. Open a command prompt window.
1. Paste the command from the text editor into the command prompt window.
1. Press enter to run the program.

    ```bash
    curl -H "Ocp-Apim-Subscription-Key: <subscriptionKey>" -o <thumbnailFile> -H "Content-Type: application/json" "https://westus.api.cognitive.microsoft.com/vision/v3.2/generateThumbnail?width=100&height=100&smartCropping=true" -d "{\"url\":\"https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png\"}"
    ```

## Examine the response

A successful response writes the thumbnail image to the file specified in `<thumbnailFile>`. If the request fails, the response contains an error code and a message to help determine what went wrong. If the request seems to succeed but the created thumbnail isn't a valid image file, it's possible that your key is not valid.

## Next steps

If you'd like to call Image Analysis APIs using a native SDK in the language of your choice, follow the quickstart to get set up.

[Quickstart (Image Analysis)](../quickstarts-sdk/image-analysis-client-library.md)
