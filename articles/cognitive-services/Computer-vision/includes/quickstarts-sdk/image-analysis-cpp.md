---
title: "Quickstart: Image Analysis client library for C++"
description: In this quickstart, get started with the Image Analysis client library for C++.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 09/12/2022
ms.author: pafarley
---
 
<a name="HOLTop"></a>

Use the Image Analysis client library for C++ to analyze an image for content tags. This quickstart analyzes a remote image and print the results. 

[Reference documentation](TBD) | [Library source code](TBD) | [Package (NuGet)](TBD) | [Samples](TBD)

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](TBD) methods, such as **TBD**. Or, see the sample code on [GitHub](TBD) for scenarios involving local images.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../../how-to/call-analyze-image.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* TBD
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Analyze image

1. Create a new C++ application.

    TBD

    ### Install the client library

    Within the application directory, install the Computer Vision client library for C++ with the following command:

    TBD

1. Find the key and endpoint.

    [!INCLUDE [find key and endpoint](../find-key.md)]

1. From the project directory, open the *Program.cpp* file in your preferred editor or IDE. Paste in the following code:

   [!code-cpp[](~/cognitive-services-quickstart-code/cpp/ComputerVision/ImageAnalysisQuickstart-single-4-0.cpp?name=snippet_single)]

1. Paste your key and endpoint into the code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

1. Run the application

   Run the application from your application directory with the TBD command.

   TBD

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

## Output

```console
----------------------------------------------------------

Please wait for image analysis results...

Tags:
grass 0.9957543611526489
dog 0.9939157962799072
mammal 0.9928356409072876
animal 0.9918001890182495
dog breed 0.9890419244766235
pet 0.974603533744812
outdoor 0.969241738319397
companion dog 0.906731367111206
small greek domestic dog 0.8965123891830444
golden retriever 0.8877675533294678
labrador retriever 0.8746421337127686
puppy 0.872604250907898
ancient dog breeds 0.8508287668228149
field 0.8017748594284058
retriever 0.6837497353553772
brown 0.6581960916519165
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](TBD).
