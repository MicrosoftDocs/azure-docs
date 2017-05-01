---
title: Use the Prediction API | Microsoft Docs
description: How to use the API to programmatically test images.
services: cognitive-services
author: v-moib
manager: juliakuz

ms.service: cognitive-services
ms.technology: cognitive-services
ms.topic: article
ms.date: 04/28/2017
ms.author: v-moib
---

# Use the prediction API to test images programmatically

After you train your model, you can obtain a URL which you can use to test images programmatically.

## To obtain the Prediction URL:

1. Click the "PERFORMANCE" tab, which is shown inside a red rectangle in the image below.
2. In the left pane, click on the iteration you want to use for testing images.
3. In the upper part of the screen, click "Prediction URL", which is shown in a red rectangle in the image below.

![The performance tab is shown with a red rectangle surrounding the Prediction URL.](./media/use-prediction-api/performance-tab-and-prediction-url.png)


## Test an image in C#

```c#
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace CSPredictionSample
{
    static class Program
    {
        static void Main()
        {
            Console.Write("Enter image file path: ");
            string imageFilePath = Console.ReadLine();

            MakePredictionRequest(imageFilePath);

            Console.WriteLine("\n\n\nHit ENTER to exit...");
            Console.ReadLine();
        }

        static byte[] GetImageAsByteArray(string imageFilePath)
        {
            FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            return binaryReader.ReadBytes((int)fileStream.Length);
        }

        static async void MakePredictionRequest(string imageFilePath)
        {
            var client = new HttpClient();

            // Request headers - replace this example key with your valid subscription key.
            client.DefaultRequestHeaders.Add("Prediction-Key", "13hc77781f7e4b19b5fcdd72a8df7156");

            // Prediction URL - replace this example URL with your valid prediction URL.
            string uri = "https://deviris2.azure-api.net/v1.0/Prediction/13hc7778-1f7e-4b19-b5fc-dd72a8df7156/image?iterationId=13hc7778-1f7e-4b19-b5fc-dd72a8df7156";

            HttpResponseMessage response;

            // Request body. Try this sample with a locally stored JPEG image.
            byte[] byteData = GetImageAsByteArray(imageFilePath);

            using (var content = new ByteArrayContent(byteData))
            {
                // This example uses content type "application/octet-stream".
                // The other content type you can use is "application/json" - but you'll need a different prediction URL for that.
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = await client.PostAsync(uri, content);
                Console.WriteLine(response);
            }
        }
    }
}
```
