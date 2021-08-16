---
title: "Quickstart: Optical character recognition client library for Go"
titleSuffix: Azure Cognitive Services
description: Get started with the Optical character recognition client library for Go with this quickstart.
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

Use the OCR client library to read printed and handwritten text from images.

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

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/ComputerVision/ComputerVisionQuickstart.go), which contains the code examples in this quickstart.

Open `sample-app.go` in your preferred IDE or text editor.

Declare a context at the root of your script. You'll need this object to execute most Computer Vision function calls.

### Find the subscription key and endpoint

Go to the Azure portal. If the Computer Vision resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your subscription key and endpoint in the resource's **key and endpoint** page, under **resource management**. 

Create variables for your Computer Vision subscription key and endpoint. Paste your subscription key and endpoint into the following code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_imports_and_vars)]

> [!IMPORTANT]
> Remember to remove the subscription key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md).

Next, you'll begin adding code to carry out different OCR operations.

> [!div class="nextstepaction"]
> [I set up the client](?success=set-up-client#object-model) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=set-up-client&product=computer-vision&page=go-sdk)

## Object model

The following classes and interfaces handle some of the major features of the OCR Go SDK.

|Name|Description|
|---|---|
| [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#BaseClient) | This class is needed for all Computer Vision functionality, such as image analysis and text reading. You instantiate it with your subscription information, and you use it to do most image operations.|
|[ReadOperationResult](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#ReadOperationResult)| This type contains the results of a Batch Read operation. |

## Code examples

These code snippets show you how to do the following tasks with the OCR client library for Go:

* [Authenticate the client](#authenticate-the-client)
* [Read printed and handwritten text](#read-printed-and-handwritten-text)

## Authenticate the client

> [!NOTE]
> This step assumes you've [created environment variables](../../../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your Computer Vision key and endpoint, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT` respectively.

Create a `main` function and add the following code to it to instantiate a client with your endpoint and key.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_client)]

> [!div class="nextstepaction"]
> [I authenticated the client](?success=authenticate-client#read-printed-and-handwritten-text) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=authenticate-client&product=computer-vision&page=go-sdk)



## Read printed and handwritten text

The OCR service can read visible text in an image and convert it to a character stream. The code in this section defines a function, `RecognizeTextReadAPIRemoteImage`, which uses the client object to detect and extract printed or handwritten text in the image.

Add the sample image reference and function call in your `main` function.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_readinmain)]

> [!TIP]
> You can also extract text from a local image. See the [BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v2.1/computervision#BaseClient) methods, such as **BatchReadFileInStream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/ComputerVision/ComputerVisionQuickstart.go) for scenarios involving local images.

### Call the Read API

Define the new function for reading text, `RecognizeTextReadAPIRemoteImage`. Add the code below, which calls the **BatchReadFile** method for the given image. This method returns an operation ID and starts an asynchronous process to read the content of the image.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_read_call)]

### Get Read results

Next, get the operation ID returned from the **BatchReadFile** call, and use it with the **GetReadOperationResult** method to query the service for operation results. The following code checks the operation at one-second intervals until the results are returned. It then prints the extracted text data to the console.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_read_response)]

### Display Read results

Add the following code to parse and display the retrieved text data, and finish the function definition.

[!code-go[](~/cognitive-services-quickstart-code/go/ComputerVision/ComputerVisionQuickstart.go?name=snippet_read_display)]

> [!div class="nextstepaction"]
> [I read text](?success=read-printed-handwritten-text#run-the-application) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=read-printed-handwritten-text&product=computer-vision&page=go-sdk)

## Run the application

Run the application from your application directory with the `go run` command.

```bash
go run sample-app.go
```

> [!div class="nextstepaction"]
> [I ran the application](?success=run-the-application#clean-up-resources) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=run-the-application&product=computer-vision&page=go-sdk)

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> [I cleaned up resources](?success=clean-up-resources#next-steps) [I ran into an issue](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=Go&Section=clean-up-resources&product=computer-vision&page=go-sdk)

## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../Vision-API-How-to-Topics/call-read-api.md)

* [OCR overview](../../overview-ocr.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/ComputerVision/ComputerVisionQuickstart.go).
