---
title: "Quickstart: Computer Vision client library for Go | Microsoft Docs"
description: Get started with the Computer Vision client library for Go.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 10/22/2019
ms.author: pafarley
---

# Quickstart: Computer Vision client library for Go

Get started with the Computer Vision client library for Go. Follow these steps to install the package and try out the example code for basic tasks. Computer Vision provides you with access to advanced algorithms for processing images and returning information.

Use the Computer Vision client library for Go to:

* Analyze an image for tags, text description, faces, adult content, and more.
* Recognize printed and handwritten text with the Batch Read API.

[Reference documentation](https://docs.microsoft.com/go/api/overview/azure/cognitiveservices/client/computervision?view=azure-go) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.ComputerVision) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision/) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=vision&sort=0)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The latest version of [Go](https://golang.org/dl/)

## Setting up

### Create a Computer Vision Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Computer Vision using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and endpoint URL, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT`, respectively.

### Create a Go project directory

In a console window (cmd, PowerShell, Terminal, Bash), create a new workspace for your Go project, named `my-app`, and navigate to it.

```
$ mkdir -p my-app/{src, bin, pkg}  
$ cd my-app
```

Your workspace will contain three folders:

* **src** - This directory will contain source code and packages. Any packages installed with the `go get` command will go here.
* **pkg** - This directory will contain the compiled Go package objects. These files all have an `.a` extension.
* **bin** - This directory will contains the binary executable files that are created when you run `go install`.

> [!TIP]
> To learn more about the structure of a Go workspace, see the [Go language documentation](https://golang.org/doc/code.html#Workspaces). This guide includes information for setting `$GOPATH` and `$GOROOT`.

### Install the client library for Go

Next, install the client library for Go:

```bash
$ go get -u <library-location-or-url>
```

or if you use dep, within your repo run:

```bash
$ dep ensure -add <library-location-or-url>
```

### Create a Go application

Next, create a file in the **src** directory named `sample-app.go`:

```bash
$ cd src
$ touch sample-app.go
```

Open `sample-app.go` in your preferred IDE or text editor. Then add the package name and import the following libraries:

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_imports)]

## Object model

The following classes and interfaces handle some of the major features of the Computer Vision Go SDK.

|Name|Description|
|---|---|
| [ComputerVisionClient](tbd) | This class is needed for all Computer Vision functionality. You instantiate it with your subscription information, and you use it to do most image operations.|
|[ComputerVisionClientExtensions](tbd)| This class contains additional methods for the **ComputerVisionClient**.|
|[VisualFeatureTypes](tbd)| This enum defines the different types of image analysis that can be done in a standard Analyze operation. You specify a set of VisualFeatureTypes values depending on your needs. |

## Code examples

These code snippets show you how to do the following tasks with the Computer Vision client library for Go:

* [Authenticate the client](#authenticate-the-client)
* [Analyze an image](#analyze-an-image)
* [Read printed and handwritten text](#read-printed-and-handwritten-text)

## Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Computer Vision key and endpoint, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT` respectively.

Create a `main` function and add the following code to instantiate a client with your endpoint and key. and computerVisionContext ??? tbd

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_client)]

## Analyze an image

The following code uses the client object to analyze a remote image and print the results. It returns a text description, categorization, list of tags, detected faces, adult content flags, main colors, and image type.

### Set up test image

In your **Program** class, save a reference the URL of the image you want to analyze.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_analyze_url)]

> [!NOTE]
> You can also analyze a local image. See the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-go-sdk-samples/blob/master/documentation-samples/quickstarts/ComputerVision/Program.cs) for scenarios involving local images.

### Specify visual features

Define your new method for image analysis. Add the code below, which specifies visual features you'd like to extract in your analysis. See the [VisualFeatureTypes](https://docs.microsoft.com/go/api/microsoft.azure.cognitiveservices.vision.computervision.models.visualfeaturetypes?view=azure-go) enum for a complete list.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_analyze)]

### Analyze

The **AnalyzeImageAsync** method returns an **ImageAnalysis** object that contains all of extracted information.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_analyze)]

The following sections show how to define the image analysis functions.

### Get image description

The following code gets the list of generated captions for the image. See [Describe images](../concept-describing-images.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_describe)]

### Get image category

The following code gets the detected category of the image. See [Categorize images](../concept-categorizing-images.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_categorize)]

### Get image tags

The following code gets the set of detected tags in the image. See [Content tags](../concept-tagging-images.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_tags)]

### Detect objects

The following code detects common objects in the image and prints them to the console. See [Object detection](../concept-object-detection.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_objects)]

### Detect brands

The following code detects corporate brands and logos in the image and prints them to the console. See [Brand detection](../concept-brand-detection.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_brands)]

### Detect faces

The following code returns the detected faces in the image with their rectangle coordinates and select face attributes. See [Face detection](../concept-detecting-faces.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_faces)]

### Detect adult, racy, or gory content

The following code prints the detected presence of adult content in the image. See [Adult, racy, gory content](../concept-detecting-adult-content.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_adult)]

### Get image color scheme

The following code prints the detected color attributes in the image, like the dominant colors and accent color. See [Color schemes](../concept-detecting-color-schemes.md) for more details.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_color)]

### Get domain-specific content

Computer Vision can use specialized model to do further analysis on images. See [Domain-specific content](../concept-detecting-domain-content.md) for more details. 

The following code parses data about detected celebrities in the image.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_celebs)]

The following code parses data about detected landmarks in the image.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_landmarks)]

### Get the image type

The following code prints information about the type of image&mdash;whether it is clip art or line drawing.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_type)]

## Read printed and handwritten text

Computer Vision can read visible text in an image and convert it to a character stream. The code in this section defines a method, `ExtractTextUrl`, which uses the client object to detect and extract printed or handwritten text in the image.

Add the method call in your `Main` method.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_extracttextinmain)]

### Set up test image

In your **Program** class, save a reference the URL of the image you want to extract text from.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_extracttext_url)]

> [!NOTE]
> You can also extract text from a local image. See the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-go-sdk-samples/blob/master/documentation-samples/quickstarts/ComputerVision/Program.cs) for scenarios involving local images.

### Call the Read API

Define the new method for reading text. Add the code below, which calls the **BatchReadFileAsync** method for the given image. This returns an operation ID and starts an asynchronous process to read the content of the image.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_extract_call)]

### Get Read results

Next, get the operation ID returned from the **BatchReadFileAsync** call, and use it to query the service for operation results. The following code checks the operation at one-second intervals until the results are returned. It then prints the extracted text data to the console.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_extract_response)]

### Display Read results

Add the following code to parse and display the retrieved text data, and finish the method definition.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_extract_display)]

## Run the application

Run the application from your application directory with the `go run` command.

```go
go run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[Computer Vision API reference (Go)](tbd)

* [What is the Computer Vision API?](../Home.md)
* The source code for this sample can be found on [GitHub](tbd).
