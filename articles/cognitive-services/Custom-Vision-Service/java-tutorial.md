---
title: "Quickstart: Create an image classification project with the Custom Vision SDK for Java"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and make a prediction using the Java SDK.
services: cognitive-services
author: areddish
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: quickstart
ms.date: 10/31/2018
ms.author: areddish
---

# Quickstart: Create an image classification project with the Custom Vision SDK for Java

This article provides information and sample code to help you get started using the Custom Vision Java SDK to build an image classification model. After it's created, you can add tags, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own Java application. If you wish to go through the process of building and using a classification model _without_ code, see the [browser-based guidance](getting-started-build-a-classifier.md) instead.

## Prerequisites
- A Java IDE of your choice
- [JDK 7 or 8](https://aka.ms/azure-jdks) installed.
- Maven installed


## Get the Custom Vision SDK and sample code
To write a Java app that uses Custom Vision, you'll need the Custom Vision maven packages. These are included in the sample project you will download, but you can access them individually here.

You can install the Custom Vision SDK from maven central repository:
* [Training SDK](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customvision-training)
* [Prediction SDK](https://mvnrepository.com/artifact/com.microsoft.azure.cognitiveservices/azure-cognitiveservices-customvision-prediction)

Clone or download the [Cognitive Services Java SDK Samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master) project. Navigate to the **Vision/CustomVision/** folder.

This Visual Studio project creates a new Custom Vision project named __Sample Java Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test a classifier. In this project, the classifier is intended to determine whether a tree is a __Hemlock__ or a __Japanese Cherry__.

## Get the training and prediction keys

The project needs a valid set of subscription keys in order to interact with the service. To get a set of free trial keys, go to the [Custom Vision website](https://customvision.ai) and sign in with a Microsoft account. Select the __gear icon__ in the upper right. In the __Accounts__ section, see the values in the __Training Key__ and __Prediction Key__ fields. You will need these later. 

![Image of the keys UI](./media/csharp-tutorial/training-prediction-keys.png)

The program is configured to store your key data as environment variables. Set these variables by navigating to the **Vision/CustomVision** folder in PowerShell. Then enter the commands:

```PowerShell
$env:AZURE_CUSTOMVISION_TRAINING_API_KEY ="<your training api key>"
$env:AZURE_CUSTOMVISION_PREDICTION_API_KEY ="<your prediction api key>"
```

## Understand the code

Load the `Vision/CustomVision` project in your Java IDE and open the _CustomVisionSamples.java_ file. Find the **runSample** method and comment out the **ObjectDetection_Sample** method call&mdash;this executes the object detection scenario, which is not covered in this guide. The **ImageClassification_Sample** method implements the primary functionality of this example; navigate to its definition and inspect the code. 

### Create a Custom Vision Service project

The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

```java
System.out.println("ImageClassification Sample");
Trainings trainer = trainClient.trainings();

System.out.println("Creating project...");
Project project = trainer.createProject()
    .withName("Sample Java Project")
    .execute();
```

### Create tags in the project

```java
// create hemlock tag
Tag hemlockTag = trainer.createTag()
    .withProjectId(project.id())
    .withName("Hemlock")
    .execute();

// create cherry tag
Tag cherryTag = trainer.createTag()
    .withProjectId(project.id())
    .withName("Japanese Cherry")
    .execute();
```

### Upload and tag images

The sample images are included in the **src/main/resources** folder of the project. They are read from there and uploaded to the service with their appropriate tags.

```java
System.out.println("Adding images...");
for (int i = 1; i <= 10; i++) {
    String fileName = "hemlock_" + i + ".jpg";
    byte[] contents = GetImage("/Hemlock", fileName);
    AddImageToProject(trainer, project, fileName, contents, hemlockTag.id(), null);
}

for (int i = 1; i <= 10; i++) {
    String fileName = "japanese_cherry_" + i + ".jpg";
    byte[] contents = GetImage("/Japanese Cherry", fileName);
    AddImageToProject(trainer, project, fileName, contents, cherryTag.id(), null);
}
```

The previous code snippet makes use of two helper functions that retrieve the images as resource streams and upload them to the service.

```java
private static void AddImageToProject(Trainings trainer, Project project, String fileName, byte[] contents, UUID tag)
{
    System.out.println("Adding image: " + fileName);

    ImageFileCreateEntry file = new ImageFileCreateEntry()
        .withName(fileName)
        .withContents(contents);

    ImageFileCreateBatch batch = new ImageFileCreateBatch()
        .withImages(Collections.singletonList(file));

    batch = batch.withTagIds(Collections.singletonList(tag));

    trainer.createImagesFromFiles(project.id(), batch);
}

private static byte[] GetImage(String folder, String fileName)
{
    try {
        return ByteStreams.toByteArray(CustomVisionSamples.class.getResourceAsStream(folder + "/" + fileName));
    } catch (Exception e) {
        System.out.println(e.getMessage());
        e.printStackTrace();
    }

    return null;
}
```

### Train the classifier

This code creates the first iteration in the project and marks it as the default iteration. The default iteration reflects the version of the model that will respond to prediction requests. You should update this every time you retrain the model.

```java
System.out.println("Training...");
Iteration iteration = trainer.trainProject(project.id());

while (iteration.status().equals("Training"))
{
    System.out.println("Training Status: "+ iteration.status());
    Thread.sleep(1000);
    iteration = trainer.getIteration(project.id(), iteration.id());
}

System.out.println("Training Status: "+ iteration.status());
trainer.updateIteration(project.id(), iteration.id(), iteration.withIsDefault(true));
```

### Use the prediction endpoint

The prediction endpoint, represented by the `predictor` object here, is the reference that you use to submit an image to the current model and get a classification prediction. In this sample, `predictor` is defined elsewhere using the prediction key environment variable.

```java
// load test image
byte[] testImage = GetImage("/Test", "test_image.jpg");

// predict
ImagePrediction results = predictor.predictions().predictImage()
    .withProjectId(project.id())
    .withImageData(testImage)
    .execute();

for (Prediction prediction: results.predictions())
{
    System.out.println(String.format("\t%s: %.2f%%", prediction.tagName(), prediction.probability() * 100.0f));
}
```

## Run the application

To compile and run the solution using maven, run the following command in the project directory in PowerShell:

```PowerShell
mvn compile exec:java
```

The output of the application should be similar to the following text:

```
Creating project...
Adding images...
Adding image: hemlock_1.jpg
Adding image: hemlock_2.jpg
Adding image: hemlock_3.jpg
Adding image: hemlock_4.jpg
Adding image: hemlock_5.jpg
Adding image: hemlock_6.jpg
Adding image: hemlock_7.jpg
Adding image: hemlock_8.jpg
Adding image: hemlock_9.jpg
Adding image: hemlock_10.jpg
Adding image: japanese_cherry_1.jpg
Adding image: japanese_cherry_2.jpg
Adding image: japanese_cherry_3.jpg
Adding image: japanese_cherry_4.jpg
Adding image: japanese_cherry_5.jpg
Adding image: japanese_cherry_6.jpg
Adding image: japanese_cherry_7.jpg
Adding image: japanese_cherry_8.jpg
Adding image: japanese_cherry_9.jpg
Adding image: japanese_cherry_10.jpg
Training...
Training status: Training
Training status: Training
Training status: Completed
Done!
        Hemlock: 93.53%
        Japanese Cherry: 0.01%
```

You can then verify that the test image prediction (the last few lines of output) is correct.

## Clean up resources
If you wish to implement your own image classification project (or try an [object detection](java-tutorial-od.md) project instead), you may want to delete the tree identification project from this example. A free trial allows for two Custom Vision projects.

On the [Custom Vision website](https://customvision.ai), navigate to **Projects** and select the trash can under My New Project.

![Screenshot of a panel labelled My New Project with a trash can icon](media/csharp-tutorial/delete_project.png)

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)