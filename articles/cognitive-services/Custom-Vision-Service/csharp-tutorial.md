---
title: Custom Vision API C# tutorial | Microsoft Docs
description: Explore a basic Windows app that uses the Custom Vision API in Microsoft Cognitive Services. Create a project, add tags, upload images, train your project, and make a prediction by using the default endpoint.
services: cognitive-services
author: anrothMSFT
manager: corncar
ms.service: cognitive-services
ms.component: custom-vision
ms.topic: article
ms.date: 05/06/2017
ms.author: anroth
---

# Custom Vision API C&#35; tutorial
Explore a basic Windows application that uses the Computer Vision API to create a project. After it's created, you can add tags, upload images, train the project, obtain the project's  default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this open-source example as a template for building your own app for Windows by using the Custom Vision API.

## Prerequisites

### Platform requirements
This example has been developed for the .NET Framework using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs). 

### Get the Custom Vision SDK
To build this example, you need the Custom Vision API, which you can find at [SDK](http://github.com/Microsoft/Cognitive-CustomVision-Windows/). 

## Step 1: Create a console application

In this step, you create a console application and prepare the training key and the images needed for the example:

1. Start Visual Studio 2015, Community Edition. 
2. Create a new console application by replacing the contents of **Program.cs** with the code that follows.

**LoadImagesFromDisk** loads two sets of images that this example uses to train the project, and one test image that the example loads to demonstrate the use of the default prediction endpoint:

```
using Microsoft.Cognitive.CustomVision.Prediction;
using Microsoft.Cognitive.CustomVision.Training;
using Microsoft.Cognitive.CustomVision.Training.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;

namespace SmokeTester
{
    class Program
    {
        private static List<string> hemlockImages;

        private static List<string> japaneseCherryImages;

        private static MemoryStream testImage;

        static void Main(string[] args)
        {
            // Add your training key from the settings page of the portal
            string trainingKey = "<your key here>";

            // Create the Api, passing in the training key
            TrainingApi trainingApi = new TrainingApi() { ApiKey = trainingKey };

            // Upload the images you need for training and the test image
            Console.WriteLine("\tUploading images");
            LoadImagesFromDisk();
        }        

        private static void LoadImagesFromDisk()
        {
            // this loads the images to be uploaded from disk into memory
            hemlockImages = Directory.GetFiles(@"..\..\..\Images\Hemlock").ToList();
            japaneseCherryImages = Directory.GetFiles(@"..\..\..\Images\Japanese Cherry").ToList();
            testImage = new MemoryStream(File.ReadAllBytes(@"..\..\..\Images\SampleData\Test\test_image.jpg"));
        }
    }
}
```

## Step 2: Create a Custom Vision Service project

To create a new Custom Vision Service project, add the following code in your **Main()** method after the call to **LoadImagesFromDisk()**:

```
            // Create a new project
            Console.WriteLine("Creating new project:");
            var project = trainingApi.CreateProject("My New Project");
```

## Step 3: Add tags to your project

To add tags to your project, insert the following code after the call to **CreateProject()**:

```
            // Make two tags in the new project
            var hemlockTag = trainingApi.CreateTag(project.Id, "Hemlock");
            var japaneseCherryTag = trainingApi.CreateTag(project.Id, "Japanese Cherry");
```

## Step 4: Upload images to the project

To add the images that you loaded into memory, insert the following code at the end of the **Main()** method:

```
            // Images can be uploaded one at a time
            foreach (var image in hemlockImages)
            {
                using (var stream = new MemoryStream(File.ReadAllBytes(image)))
                {
                    trainingApi.CreateImagesFromData(project.Id, stream, new List<string>() { hemlockTag.Id.ToString() });
                }
            }

            // Or uploaded in a single batch 
            var imageFiles = japaneseCherryImages.Select(img => new ImageFileCreateEntry(Path.GetFileName(img), File.ReadAllBytes(img))).ToList();
            trainingApi.CreateImagesFromFiles(project.Id, new ImageFileCreateBatch(imageFiles, new List<Guid>() { japaneseCherryTag.Id }));
```

## Step 5: Train the project

Now that you've added tags and images to the project, you can train it: 

1. Insert the following code at the end of **Main()**. This creates the first iteration in the project.
2. Mark this iteration as the default iteration.

```
            // Now there are images with tags start training the project
            Console.WriteLine("\tTraining");
            var iteration = trainingApi.TrainProject(project.Id);

            // The returned iteration will be in progress, and can be queried periodically to see when it has completed
            while (iteration.Status == "Training")
            {
                Thread.Sleep(1000);

                // Re-query the iteration to get its updated status
                iteration = trainingApi.GetIteration(project.Id, iteration.Id);
            }

            // The iteration is now trained. Make it the default project endpoint
            iteration.IsDefault = true;
            trainingApi.UpdateIteration(project.Id, iteration.Id, iteration);
            Console.WriteLine("Done!\n");
```

## Step 6: Get and use the default prediction endpoint

You're now ready to use the model for prediction: 

1. Obtain the endpoint associated with the default iteration by inserting the following code at the end of **Main()**. 
2. Send a test image to the project by using that endpoint.

```
            // Now there is a trained endpoint, it can be used to make a prediction

            // Add your prediction key from the settings page of the portal
            // The prediction key is used in place of the training key when making predictions
            string predictionKey = "<your key here>";

            // Create a prediction endpoint, passing in the obtained prediction key
            PredictionEndpoint endpoint = new PredictionEndpoint() { ApiKey = predictionKey };

            // Make a prediction against the new project
            Console.WriteLine("Making a prediction:");
            var result = endpoint.PredictImage(project.Id, testImage);

            // Loop over each prediction and write out the results
            foreach (var c in result.Predictions)
            {
                Console.WriteLine($"\t{c.Tag}: {c.Probability:P1}");
            }

            Console.ReadKey();
```

## Step 7: Run the example

Build and run the solution. The prediction results appear on the console.
