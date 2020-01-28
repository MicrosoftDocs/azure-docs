---
title: "Quickstart: Face client library for Go | Microsoft Docs"
description: Get started with the Face client library for Go.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: 
ms.topic: quickstart
ms.date: 01/27/2020
ms.author: pafarley
---

# Quickstart: Face client library for Go

Get started with the Face client library for Go. Follow these steps to install the library and try out our examples for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face service client library for Go to:

* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)
* [Take a snapshot for data migration](#take-a-snapshot-for-data-migration)

[Reference documentation](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v1.0/face) | [SDK download](https://github.com/Azure/azure-sdk-for-go)

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* The latest version of [Go](https://golang.org/dl/)

## Setting up

### Create a Face Azure resource 

Begin using the Face service by creating an Azure resource. Choose the resource type that's right for you:

* A [trial resource](https://azure.microsoft.com/try/cognitive-services/#decision) (no Azure subscription needed): 
    * Valid for seven days, for free. After signing up, a trial key and endpoint will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/). 
    * This is a great option if you want to try Face service, but don’t have an Azure subscription.
<!-- Link to the 'create' blade in the azure portal -->
* A [ Face service resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector):
    * Available through the Azure portal until you delete the resource.
    * Use the free pricing tier to try the service, and upgrade later to a paid tier for production.
<!-- remove the below text if your service is not supported by the multi-service option. -->
* A [Multi-Service resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne):
    * Available through the Azure portal until you delete the resource.  
    * Use the same key and endpoint for your applications, across multiple Cognitive Services.


### Create an environment variable

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:
<!-- replace the below variable names with the names expected in the code sample.-->
* `PRODUCT_NAME_KEY` - The resource key for authenticating your requests.
* `PRODUCT_NAME_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.
<!-- replace the below endpoint and key examples -->
#### [Windows](#tab/windows)

```console
setx PRODUCT_NAME_KEY <replace-with-your-product-name-key>
setx PRODUCT_NAME_ENDPOINT <replace-with-your-product-name-endpoint>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export PRODUCT_NAME_KEY=<replace-with-your-product-name-key>
export PRODUCT_NAME_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export PRODUCT_NAME_KEY=<replace-with-your-product-name-key>
export PRODUCT_NAME_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***

### Create a Go project directory

In a console window (cmd, PowerShell, Terminal, Bash), create a new workspace for your Go project, named `my-app`, and navigate to it.

```
mkdir -p my-app/{src, bin, pkg}  
cd my-app
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
go get -u <library-location-or-url>
```

or if you use dep, within your repo run:

```bash
dep ensure -add <library-location-or-url>
```

### Create a Go application

Next, create a file in the **src** directory named `sample-app.go`:

```bash
cd src
touch sample-app.go
```

Open `sample-app.go` in your preferred IDE or text editor. Then add the package name and import the following libraries:

```Go
package main

import (
	"..."
	"..."
)
```

## Object model

The following classes and interfaces handle some of the major features of the Face service Go SDK.

|Name|Description|
|---|---|
| | |

## Code examples

These code samples show you how to complete basic tasks using the Face service client library for Go:

* [Authenticate the client](#)
* [Example task 1 (anchor link)](#)
* [Example task 2 (anchor link)](#)
* [Example task 3 (anchor link)](#)

## Authenticate the client

> [!NOTE] 
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Face service key, named `TBD_KEY`.

In a new method, instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create an [ApiClient]() object.

```go

```

## Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```Go

```

<!-- 
    If this code sample is in a function, tell the reader to call it. For example:

    Call the `example()` function.

-->

## Example task 2

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```Go

```

<!-- 
    If this code sample is in a function, tell the reader to call it. For example:

    Call the `example()` function.

-->

## Run the application

Run your Go application with the `go run [arguments]` command from your application directory.

```bash
go run sample-app.go
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

## See also

* [What is the Face service?](#)
* [API reference](#)
* The source code for this sample can be found on [GitHub](#).