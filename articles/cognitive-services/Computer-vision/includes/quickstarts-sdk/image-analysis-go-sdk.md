---
title: "Quickstart: Image Analysis client library for Go"
titleSuffix: Azure Cognitive Services
description: Get started with the Image Analysis client library for Go with this quickstart.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 12/15/2020
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the Image Analysis client library to analyze an image for tags, text description, faces, adult content, and more.

[Reference documentation](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/computervision) | [Package](https://github.com/Azure/azure-sdk-for-go)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The latest version of [Go](https://golang.org/dl/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a Go project directory

In a console window (cmd, PowerShell, Terminal, Bash), create a new workspace for your Go project, named `my-app`, and navigate to it.

```
mkdir -p my-app/{src, bin, pkg}  
cd my-app
```

Your workspace will contain three folders:

* **src** - This directory will contain source code and packages. Any packages installed with the `go get` command will go in this directory.
* **pkg** - This directory will contain the compiled Go package objects. These files all have an `.a` extension.
* **bin** - This directory will contain the binary executable files that are created when you run `go install`.

> [!TIP]
> To learn more about the structure of a Go workspace, see the [Go language documentation](https://golang.org/doc/code.html#Workspaces). This guide includes information for setting `$GOPATH` and `$GOROOT`.

### Install the client library for Go

Next, install the client library for Go:

```bash
go get -u https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/computervision
```

or if you use dep, within your repo run:

```bash
dep ensure -add https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v2.1/computervision
```

### Create a Go application 

Next, create a file in the **src** directory named `sample-app.go`:

```bash
cd src
touch sample-app.go
```

Open `sample-app.go` in your preferred IDE or text editor. Then add the package name and import the following libraries:

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_imports)]

Also, declare a context at the root of your script. You'll need this object to execute most Image Analysis function calls:

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_context)]

Next, you'll begin adding code to carry out different Computer Vision operations.

> [!div class="nextstepaction"]
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=set-up-client&product=computer-vision&page=image-analysis-go-sdk)

## Object model

The following classes and interfaces handle some of the major features of the Image Analysis Go SDK.

|Name|Description|
|---|---|
| [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#BaseClient) | This class is needed for all Computer Vision functionality, such as image analysis and text reading. You instantiate it with your subscription information, and you use it to do most image operations.|
|[ImageAnalysis](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#ImageAnalysis)| This type contains the results of an **AnalyzeImage** function call. There are similar types for each of the category-specific functions.|
|[VisualFeatureTypes](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#VisualFeatureTypes)| This type defines the different kinds of image analysis that can be done in a standard Analyze operation. You specify a set of VisualFeatureTypes values depending on your needs. |

## Code examples

These code snippets show you how to do the following tasks with the Image Analysis client library for Go:

* [Authenticate the client](#authenticate-the-client)
* [Analyze an image](#analyze-an-image)

## Authenticate the client

> [!NOTE]
> This step assumes you've [created environment variables](../../../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your Computer Vision key and endpoint, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT` respectively.

Create a `main` function and add the following code to it to instantiate a client with your endpoint and key.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_client)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#analyze-an-image) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=authenticate-client&product=computer-vision&page=image-analysis-go-sdk)

## Analyze an image

The following code uses the client object to analyze a remote image and print the results to the console. You can get a text description, categorization, list of tags, detected objects, detected brands, detected faces, adult content flags, main colors, and image type.

### Set up test image

First save a reference to the URL of the image you want to analyze. Put this inside your `main` function.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_analyze_url)]

> [!TIP]
> You can also analyze a local image. See the [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#BaseClient) methods, such as **AnalyzeImageInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/ComputerVision/ImageAnalysisQuickstart.go) for scenarios involving local images.

### Specify visual features

The following function calls extract different visual features from the sample image. You'll define these functions in the following sections.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_analyze)]

### Get image description

The following function gets the list of generated captions for the image. For more information about image description, see [Describe images](../../concept-describing-images.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_analyze_describe)]

### Get image category

The following function gets the detected category of the image. For more information, see [Categorize images](../../concept-categorizing-images.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_analyze_categorize)]

### Get image tags

The following function gets the set of detected tags in the image. For more information, see [Content tags](../../concept-tagging-images.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_tags)]

### Detect objects

The following function detects common objects in the image and prints them to the console. For more information, see [Object detection](../../concept-object-detection.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_objects)]

### Detect brands

The following code detects corporate brands and logos in the image and prints them to the console. For more information, [Brand detection](../../concept-brand-detection.md).

First, declare a reference to a new image within your `main` function.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_brand_url)]

The following code defines the brand detection function.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_brands)]

### Detect faces

The following function returns the detected faces in the image with their rectangle coordinates and certain face attributes. For more information, see [Face detection](../../concept-detecting-faces.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_faces)]

### Detect adult, racy, or gory content

The following function prints the detected presence of adult content in the image. For more information, see [Adult, racy, gory content](../../concept-detecting-adult-content.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_adult)]

### Get image color scheme

The following function prints the detected color attributes in the image, like the dominant colors and accent color. For more information, see [Color schemes](../../concept-detecting-color-schemes.md).

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_color)]

### Get domain-specific content

Image Analysis can use specialized models to do further analysis on images. For more information, see [Domain-specific content](../../concept-detecting-domain-content.md). 

The following code parses data about detected celebrities in the image.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_celebs)]

The following code parses data about detected landmarks in the image.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_landmarks)]

### Get the image type

The following function prints information about the type of image&mdash;whether it's clip art or a line drawing.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ImageAnalysisQuickstart.go?name=snippet_type)]

> [!div class="nextstepaction"]
> [I analyzed an image](?success=analyze-image#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=analyze-image&product=computer-vision&page=image-analysis-go-sdk)


## Run the application

Run the application from your application directory with the `go run` command.

```bash
go run sample-app.go
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=run-the-application&product=computer-vision&page=image-analysis-go-sdk)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=clean-up-resources&product=computer-vision&page=image-analysis-go-sdk)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../Vision-API-How-to-Topics/HowToCallVisionAPI.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/ComputerVision/ImageAnalysisQuickstart.go).

