---
title: "Face Go client library quickstart"
description: Use the Face client library for Go to detect faces, find similar (face search by image), identify faces (facial recognition search) and migrate your face data.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 09/17/2020
ms.author: pafarley
---
Get started with facial recognition using the Face client library for Go. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face service client library for Go to:

* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)

[Reference documentation](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v1.0/face) | [SDK download](https://github.com/Azure/azure-sdk-for-go)

## Prerequisites

* The latest version of [Go](https://golang.org/dl/)
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* After you get a key and endpoint, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and endpoint, named `FACE_SUBSCRIPTION_KEY` and `FACE_ENDPOINT`, respectively.

## Setting up

### Create a Go project directory

In a console window (cmd, PowerShell, Terminal, Bash), create a new workspace for your Go project, named `my-app`, and navigate to it.

```
mkdir -p my-app/{src, bin, pkg}  
cd my-app
```

Your workspace will contain three folders:

* **src** - This directory will contain source code and packages. Any packages installed with the `go get` command will be in this folder.
* **pkg** - This directory will contain the compiled Go package objects. These files all have a `.a` extension.
* **bin** - This directory will contain the binary executable files that are created when you run `go install`.

> [!TIP]
> To learn more about the structure of a Go workspace, see the [Go language documentation](https://golang.org/doc/code.html#Workspaces). This guide includes information for setting `$GOPATH` and `$GOROOT`.

### Install the client library for Go

Next, install the client library for Go:

```bash
go get -u github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v1.0/face
```

or if you use dep, within your repo run:

```bash
dep ensure -add https://github.com/Azure/azure-sdk-for-go/tree/master/services/cognitiveservices/v1.0/face
```

### Create a Go application

Next, create a file in the **src** directory named `sample-app.go`:

```bash
cd src
touch sample-app.go
```

Open `sample-app.go` in your preferred IDE or text editor. Then add the package name and import the following libraries:

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_imports)]

Next, you'll begin adding code to carry out different Face service operations.

## Object model

The following classes and interfaces handle some of the major features of the Face service Go client library.

|Name|Description|
|---|---|
|[BaseClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#BaseClient) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[Client](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#Client)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#DetectedFace)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[ListClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#ListClient)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPersonClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#PersonGroupPersonClient)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroupClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#PersonGroupClient)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |
|[SnapshotClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#SnapshotClient)|This class manages the Snapshot functionality. You can use it to temporarily save all of your cloud-based Face data and migrate that data to a new Azure subscription. |

## Code examples

These code samples show you how to complete basic tasks using the Face service client library for Go:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)

## Authenticate the client

> [!NOTE] 
> This quickstart assumes you've [created environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Face key and endpoint, named `FACE_SUBSCRIPTION_KEY` and `FACE_ENDPOINT` respectively.

Create a **main** function and add the following code to it to instantiate a client with your endpoint and key. You create a **[CognitiveServicesAuthorizer](https://godoc.org/github.com/Azure/go-autorest/autorest#CognitiveServicesAuthorizer)** object with your key, and use it with your endpoint to create a **[Client](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#Client)** object. This code also instantiates a context object, which is needed for the creation of client objects. It also defines a remote location where some of the sample images in this quickstart are found.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_main_client)]


## Detect faces in an image

Add the following code in your **main** method. This code defines a remote sample image and specifies which face features to extract from the image. It also specifies which AI model to use to extract data from the detected face(s). See [Specify a recognition model](../../Face-API-How-to-Topics/specify-recognition-model.md) for information on these options. Finally, the **[DetectWithURL](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#Client.DetectWithURL)** method does the face detection operation on the image and saves the results in program memory.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_detect)]

### Display detected face data

The next block of code takes the first element in the array of **[DetectedFace](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#DetectedFace)** objects and prints its attributes to the console. If you used an image with multiple faces, you should iterate through the array instead.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_detect_display)]

## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, save a reference to the face you detected in the [Detect faces in an image](#detect-faces-in-an-image) section. This face will be the source.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar_single_ref)]

Then enter the following code to detect a set of faces in a different image. These faces will be the target.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar_multiple_ref)]

### Find matches

The following code uses the **[FindSimilar](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#Client.FindSimilar)** method to find all of the target faces that match the source face.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar)]

### Print matches

The following code prints the match details to the console.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_similar_print)]


## Create and train a person group

To step through this scenario, you need to save the following images to the root directory of your project: https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/Face/images.

This group of images contains three sets of single-face images that correspond to three different people. The code will define three **PersonGroup Person** objects and associate them with image files that start with `woman`, `man`, and `child`.

### Create PersonGroup

Once you've downloaded your images, add the following code to the bottom of your **main** method. This code authenticates a **[PersonGroupClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#PersonGroupClient)** object and then uses it to define a new **PersonGroup**.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_pg_setup)]

### Create PersonGroup Persons

The next block of code authenticates a **[PersonGroupPersonClient](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#PersonGroupPersonClient)** and uses it to define three new **PersonGroup Person** objects. These objects each represent a single person in the set of images.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_pgp_setup)]

### Assign faces to Persons

The following code sorts the images by their prefix, detects faces, and assigns the faces to each respective **PersonGroup Person** object, based on the image file name.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_pgp_assign)]

### Train PersonGroup

Once you've assigned faces, you train the **PersonGroup** so it can identify the visual features associated with each of its **Person** objects. The following code calls the asynchronous **train** method and polls the result, printing the status to the console.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_pg_train)]

## Identify a face

The Identify operation takes an image of a person (or multiple people) and looks to find the identity of each face in the image (facial recognition search). It compares each detected face to a **PersonGroup**, a database of different **Person** objects whose facial features are known.

> [!IMPORTANT]
> In order to run this example, you must first run the code in [Create and train a person group](#create-and-train-a-person-group).

### Get a test image

The following code looks in the root of your project for an image _test-image-person-group.jpg_ and loads it into program memory. You can find this image in the same repo as the images used in [Create and train a person group](#create-and-train-a-person-group): https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/Face/images.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_id_source_get)]

### Detect source faces in test image

The next code block does ordinary face detection on the test image to retrieve all of the faces and save them to an array.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_id_source_detect)]

### Identify faces

The **[Identify](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#Client.Identify)** method takes the array of detected faces and compares them to the given **PersonGroup** (defined and trained in the earlier section). If it can match a detected face to a **Person** in the group, it saves the result.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_id)]

This code then prints detailed match results to the console.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_id_print)]


## Verify faces

The Verify operation takes a face ID and either another face ID or a **Person** object and determines whether they belong to the same person.

The following code detects faces in two source images and then verifies each of them against a face detected from a target image.

### Get test images

The following code blocks declare variables that will point to the target and source images for the verification operation.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_ver_images)]

### Detect faces for verification

The following code detects faces in the source and target images and saves them to variables.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_ver_detect_source)]

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_ver_detect_target)]

### Get verification results

The following code compares each of the source images to the target image and prints a message indicating whether they belong to the same person.

[!code-go[](~/cognitive-services-quickstart-code/go/Face/FaceQuickstart.go?name=snippet_ver)]

## Run the application

Run your face recognition app from the application directory with the `go run <app-name>` command.

```bash
go run sample-app.go
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

If you created a **PersonGroup** in this quickstart and you want to delete it, call the **[Delete](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face#PersonGroupClient.Delete)** method.

## Next steps

In this quickstart, you learned how to use the Face client library for Go to do basis facial recognition tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
> [Face API reference (Go)](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face)

* [What is the Face service?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/go/Face/FaceQuickstart.go).
