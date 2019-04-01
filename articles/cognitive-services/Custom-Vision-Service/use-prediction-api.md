---
title: "Example: Use prediction endpoint to programmatically test images with classifier - Custom Vision"
titlesuffix: Azure Cognitive Services
description: Learn how to use the API to programmatically test images with your Custom Vision Service classifier.
services: cognitive-services
author: anrothMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: article
ms.date: 03/26/2019
ms.author: anroth
---

#  Use your Model with the Prediction API

After you train your model, you can test images programmatically by submitting them to the Prediction API.

> [!NOTE]
> This document demonstrates using C# to submit an image to the Prediction API. For more information and examples of using the API, see the [Prediction API reference](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Prediction_3.0/operations/5c82db60bf6a2b11a8247c15).

## Publish your trained iteration

From the [Custom Vision web page](https://customvision.ai), select your project and then select the __Performance__ tab.

To submit images to the Prediction API, you will first need to publish your iteration for prediction, which can be done by selecting __Publish__ and specifying a name for the published iteration. This will enable your model to be accessible to the Prediction API of your Custom Vision Azure resource. 

![The performance tab is shown, with a red rectangle surrounding the Publish button.](./media/use-prediction-api/unpublished-iteration.png)

Once your model has been successfully published, you'll see a "Published" label appear next to your iteration in the left-hand sidebar, as well as the name of the published iteration in the description of the iteration.

![The performance tab is shown, with a red rectangle surrounding the Published label and the name of the published iteration.](./media/use-prediction-api/published-iteration.png)

## Get the URL and prediction key

Once your model has been published, you can retrieve information about using the Prediction API by selecting __Prediction URL__. This will open up a dialog like the one shown below with information for using the Prediction API, including the __Prediction URL__ and __Prediction-Key__.

![The performance tab is shown with a red rectangle surrounding the Prediction URL button.](./media/use-prediction-api/published-iteration-prediction-url.png)

![The performance tab is shown with a red rectangle surrounding the Prediction URL value for using an image file and the Prediction-Key value.](./media/use-prediction-api/prediction-api-info.png)

> [!TIP]
> Your __Prediction-Key__ can also be found in the [Azure Portal](https://portal.azure.com) page for the Custom Vision Azure Resource associated to your project, under __Keys__. 

From the dialog, copy the following information for use in the application:

* __Prediction URL__ for using an __image file__.
* __Prediction-Key__ value.

## Create the application

1. From Visual Studio, create a new C# console application.

1. Use the following code as the body of the __Program.cs__ file.

    > [!IMPORTANT]
    > Change the following information:
    >
    > * Set the __namespace__ to the name of your project.
    > * Set the __Prediction-Key__ value you retrieved earlier in the line that begins with `client.DefaultRequestHeaders.Add("Prediction-Key",`.
    > * Set the __Prediction URL__ value you retrieved earlier in the line that begins with `string url =`.

    ```csharp
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    namespace CVSPredictionSample
    {
        public static class Program
        {
            public static void Main()
            {
                Console.Write("Enter image file path: ");
                string imageFilePath = Console.ReadLine();

                MakePredictionRequest(imageFilePath).Wait();

                Console.WriteLine("\n\nHit ENTER to exit...");
                Console.ReadLine();
            }

            public static async Task MakePredictionRequest(string imageFilePath)
            {
                var client = new HttpClient();

                // Request headers - replace this example key with your valid Prediction-Key.
                client.DefaultRequestHeaders.Add("Prediction-Key", "3b9dde6d1ae1453a86bfeb1d945300f2");

                // Prediction URL - replace this example URL with your valid Prediction URL.
                string url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/8622c779-471c-4b6e-842c-67a11deffd7b/classify/iterations/Cats%20vs.%20Dogs%20-%20Published%20Iteration%203/image";

                HttpResponseMessage response;

                // Request body. Try this sample with a locally stored image.
                byte[] byteData = GetImageAsByteArray(imageFilePath);

                using (var content = new ByteArrayContent(byteData))
                {
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response = await client.PostAsync(url, content);
                    Console.WriteLine(await response.Content.ReadAsStringAsync());
                }
            }

            private static byte[] GetImageAsByteArray(string imageFilePath)
            {
                FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
                BinaryReader binaryReader = new BinaryReader(fileStream);
                return binaryReader.ReadBytes((int)fileStream.Length);
            }
        }
    }
    ```

## Use the application

When running the application, you will enter the path to an image file in the console. The image is submitted to the Prediction API and the prediction results are returned as a JSON document. The following JSON is an example of the response.

```json
{
    "Id":"7796df8e-acbc-45fc-90b4-1b0c81b73639",
    "Project":"8622c779-471c-4b6e-842c-67a11deffd7b",
    "Iteration":"59ec199d-f3fb-443a-b708-4bca79e1b7f7",
    "Created":"2019-03-20T16:47:31.322Z",
    "Predictions":[
        {"TagId":"d9cb3fa5-1ff3-4e98-8d47-2ef42d7fb373","TagName":"cat", "Probability":1.0},
        {"TagId":"9a8d63fb-b6ed-4462-bcff-77ff72084d99","TagName":"dog", "Probability":0.1087869}
    ]
}
```

## Next steps

[Export the model for mobile use](export-your-model.md)

[Get started with .NET SDKs](csharp-tutorial.md)

[Get started with Python SDKs](python-tutorial.md)

[Get started with Java SDKs](java-tutorial.md)

[Get started with Node SDKs](node-tutorial.md)

[Get started with Go SDKs](go-tutorial.md)
