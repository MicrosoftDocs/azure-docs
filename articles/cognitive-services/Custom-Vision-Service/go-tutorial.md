---
title: "Quickstart: Create an image classification project with the Custom Vision SDK for Go"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and make a prediction using the Go SDK.
services: cognitive-services
author: areddish
manager: daauld

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: quickstart
ms.date: 12/12/2018
ms.author: areddish
---

# Quickstart: Create an image classification project with the Custom Vision Go SDK

This article provides information and sample code to help you get started using the Custom Vision SDK with Go to build an image classification model. After it's created, you can add tags, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own Go application. If you wish to go through the process of building and using a classification model _without_ code, see the [browser-based guidance](getting-started-build-a-classifier.md) instead.

## Prerequisites

- [Go 1.8+](https://golang.org/doc/install)

## Install the Custom Vision SDK

To install the Custom Vision service SDK for Go, run the following command in PowerShell:

```
go get -u github.com/Azure/azure-sdk-for-go/...
```

or if you use dep, within your repo run:
```
dep ensure -add github.com/Azure/azure-sdk-for-go
```

[!INCLUDE [get-keys](includes/get-keys.md)]

[!INCLUDE [python-get-images](includes/python-get-images.md)]

## Add the code

Create a new file called *sample.go* in your preferred project directory.

### Create the Custom Vision service project

Add the following code to your script to create a new Custom Vision service project. Insert your subscription keys in the appropriate definitions.

```go
package main

import(
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"time"
	"github.com/Azure/services/cognitiveservices/v2.2/customvision/training"
	"github.com/Azure/services/cognitiveservices/v2.0/customvision/prediction"
)

var (
	training_key string = "<your training key>"
	prediction_key string = "<your prediction key>"
	endpoint string = "https://southcentralus.api.cognitive.microsoft.com"
	project_name string = "Go Sample Project"
	sampleDataDirectory = "<path to sample images>"
)

func main() {
    fmt.Println("Creating project...")

	trainer := training.New(training_key, endpoint)

	project, err := trainer.CreateProject(project_name, "", nil)
	if (err != nil) {
		log.Fatal(err)
	}
```

### Create tags in the project

To create classification tags to your project, add the following code to the end of *sample.go*:

```go
	hemlockTag, _ := trainer.CreateTag(*project.ID, "Hemlock", "")
	cherryTag, _ := trainer.CreateTag(*project.ID, "Japanese Cherry", "")
```

### Upload and tag images

To add the sample images to the project, insert the following code after the tag creation. This code uploads each image with its corresponding tag. You will need to enter the base image URL path, based on where you downloaded the Cognitive Services Go SDK Samples project.

> [!NOTE]
> You'll need to change the path to the images based on where you downloaded the Cognitive Services Go SDK Samples project earlier.

```go
    fmt.Println("Adding images...")
	japaneseCherryImages, err := ioutil.ReadDir(sampleDataDirectory + "Japanese Cherry")
	if err != nil {
		fmt.Println("Error finding Sample images")
	}

	hemLockImages, err := ioutil.ReadDir(sampleDataDirectory + "Hemlock")
	if err != nil {
		fmt.Println("Error finding Sample images")
	}

	for _, file := range hemLockImages {
		imageFile, _ := ioutil.ReadFile(sampleDataDirectory + "Hemlock/" + file.Name())
		imageData := ioutil.NopCloser(bytes.NewReader(imageFile))

		trainer.CreateImagesFromData(*project.ID, imageData, []string{ hemlockTag.ID.String() })
	}

	for _, file := range japaneseCherryImages {
		imageFile, _ := ioutil.ReadFile(sampleDataDirectory + "Japanese Cherry/" + file.Name())
		imageData := ioutil.NopCloser(bytes.NewReader(imageFile))
		trainer.CreateImagesFromData(*project.ID, imageData, []string{ cherryTag.ID.String() })
	}

```

### Train the classifier

This code creates the first iteration in the project and marks it as the default iteration. The default iteration reflects the version of the model that will respond to prediction requests. You should update this each time you retrain the model.

```go
fmt.Println("Training...")
	iteration, _ := trainer.TrainProject(*project.ID)
	for {
		if *iteration.Status != "Training" {
			break
		}
		fmt.Println("Training status: " + *iteration.Status)
		time.Sleep(1 * time.Second)
		iteration, _ = trainer.GetIteration(*project.ID, *iteration.ID)
	}

	trainer.UpdateIteration(*project.ID, *iteration.ID, iteration)
```

### Get and use the default prediction endpoint

To send an image to the prediction endpoint and retrieve the prediction, add the following code to the end of the file:

```go
    fmt.Println("Predicting...")
	predictor := prediction.New(prediction_key, endpoint)

	testImageData, _ := ioutil.ReadFile(sampleDataDirectory + "Test/test_image.jpg")
	results, _ := predictor.PredictImage(*project.ID, ioutil.NopCloser(bytes.NewReader(testImageData)), iteration.ID, "")

	for _, prediction := range *results.Predictions	{
		fmt.Printf("\t%s: %.2f%%", *prediction.Tag, *prediction.Probability * 100)
		fmt.Println("")
	}
}
```

## Run the application

Run *sample.go*.

```PowerShell
Go sample.go
```

The output of the application should be similar to the following text:

```
Creating project...
Adding images...
Training...
Training status: Training
Training status: Completed
Done!
        Hemlock: 93.53%
        Japanese Cherry: 0.01%
```

You can then verify that the test image (found in **<base_image_url>/Images/Test/**) is tagged appropriately. You can also go back to the [Custom Vision website](https://customvision.ai) and see the current state of your newly created project.

[!INCLUDE [clean-ic-project](includes/clean-ic-project.md)]

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)