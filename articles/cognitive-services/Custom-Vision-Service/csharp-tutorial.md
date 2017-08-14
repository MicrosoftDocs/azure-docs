---
title: Custom Vision API C# tutorial | Microsoft Docs
description: Explore a basic Windows app that uses the Custom Vision API in Microsoft Cognitive Services. Create a project, add tags, upload images, train your project, and make a prediction using the default endpoint.
services: cognitive-services
author: gitbeams
manager: juliakuz

ms.service: cognitive-services
ms.technology: custom vision service
ms.topic: article
ms.date: 05/06/2017
ms.author: gitbeams
---

# Custom Vision API C&#35; Tutorial
Explore a basic Windows application that uses the Computer Vision API to create a project; add tags to it; upload images; train the project; obtain the default prediction endpoint URL for the project; and use the endpoint to programmatically test an image. You can use this open source example as a template for building your own app for Windows using the Custom Vision API.

### <a name="Prerequisites">Prerequisites</a>

#### Platform requirements
This example has been developed for the .NET Framework using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs). 

#### Get the Custom Vision SDK
To build this example, you need the Custom Vision API, which you can find at [SDK](http://github.com/Microsoft/Cognitive-CustomVision-Windows/). 

### <a name="Step1">Step 1: Create a console application and prepare the training key and the images needed for the example/a>

Start Visual Studio 2015, Community Edition, create a new Console Application, and replace the contents of Program.cs with the following code. This code defines and calls two helper methods. The method called **GetTrainingKey** prepares the training key. The one called **LoadImagesFromDisk** loads two sets of images that this example uses to train the project, and one test image that the example loads to demonstrate the use of the default prediction endpoint.

```
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using Microsoft.Cognitive.CustomVision;

namespace SmokeTester
{
    class Program
    {
        private static List<MemoryStream> hemlockImages;

        private static List<MemoryStream> japaneseCherryImages;

        private static MemoryStream testImage;

        static void Main(string[] args)
        {
            // You can either add your training key here, pass it on the command line, or type it in when the program runs
            string trainingKey = GetTrainingKey("<your key here>", args);

            // Create the Api, passing in a credentials object that contains the training key
            TrainingApiCredentials trainingCredentials = new TrainingApiCredentials(trainingKey);
            TrainingApi trainingApi = new TrainingApi(trainingCredentials);

            // Upload the images we need for training and the test image
            Console.WriteLine("\tUploading images");
            LoadImagesFromDisk();
        }

        private static string GetTrainingKey(string trainingKey, string[] args)
        {
            if (string.IsNullOrWhiteSpace(trainingKey) || trainingKey.Equals("<your key here>"))
            {
                if (args.Length >= 1)
                {
                    trainingKey = args[0];
                }

                while (string.IsNullOrWhiteSpace(trainingKey) || trainingKey.Length != 32)
                {
                    Console.Write("Enter your training key: ");
                    trainingKey = Console.ReadLine();
                }
                Console.WriteLine();
            }

            return trainingKey;
        }

        private static void LoadImagesFromDisk()
        {
            // this loads the images to be uploaded from disk into memory
            hemlockImages = Directory.GetFiles(@"..\..\..\..\..\SampleImages\Hemlock").Select(f => new MemoryStream(File.ReadAllBytes(f))).ToList();
            japaneseCherryImages = Directory.GetFiles(@"..\..\..\..\..\SampleImages\Japanese Cherry").Select(f => new MemoryStream(File.ReadAllBytes(f))).ToList();
            testImage = new MemoryStream(File.ReadAllBytes(@"..\..\..\..\..\SampleImages\Test\test_image.jpg"));

        }
    }
}
```

### <a name="Step2">Step 2: Create a Custom Vision Service project</a>

* To create a new Custom Vision Service project, add the following code in your **Main()** method after the call to **LoadImagesFromDisk()**.

```
            // Create a new project
            Console.WriteLine("Creating new project:");
            var project = trainingApi.CreateProject("My New Project");
```

### <a name="Step3">Step 3: Add tags to your project</a>

* To add tags to your project, insert the following code after the call to **CreateProject()**

```
            // Make two tags in the new project
            var hemlockTag = trainingApi.CreateTag(project.Id, "Hemlock");
            var japaneseCherryTag = trainingApi.CreateTag(project.Id, "Japanese Cherry");
```

### <a name="Step4">Step 4: Upload images to the project</a>

* To add the images we have in memory to the project, insert the following code at the end of the **Main()** method.

```
            // Images can be uploaded one at a time
            foreach (var image in hemlockImages)
            {
                trainingApi.CreateImagesFromData(project.Id, image, new List<string>() { hemlockTag.Id.ToString() });
            }

            // Or uploaded in a single batch 
            trainingApi.CreateImagesFromData(project.Id, japaneseCherryImages, new List<Guid>() { japaneseCherryTag.Id });
```

### <a name="Step5">Step 5: Train the project</a>

* Now that we've added tags and images to the project, we can train it. Insert the following code at the end of **Main()**. This creates the first iteration in the project. We can then mark this iteration as the default iteration.

```
            // Now there are images with tags start training the project
            Console.WriteLine("\tTraining");
            var iteration = trainingApi.TrainProject(project.Id);

            // The returned iteration will be in progress, and can be queried periodically to see when it has completed
            while (iteration.Status == "Training")
            {
                Thread.Sleep(1000);

                // Re-query the iteration to get it's updated status
                iteration = trainingApi.GetIteration(project.Id, iteration.Id);
            }

            // The iteration is now trained. Make it the default project endpoint
            iteration.IsDefault = true;
            trainingApi.UpdateIteration(project.Id, iteration.Id, iteration);
            Console.WriteLine("Done!\n");
```

### <a name="Step6">Step 6: Get and use the default prediction endpoint</a>

* We are now ready to use the model for prediction. First we obtain the endpoint associated with the default iteration. Then we send a test image to the project using that endpoint. Insert the code below at the end of **Main()**.

```
            // Now there is a trained endpoint, it can be used to make a prediction

            // Get the prediction key, which is used in place of the training key when making predictions
            var account = trainingApi.GetAccountInfo();
            var predictionKey = account.Keys.PredictionKeys.PrimaryKey;

            // Create a prediction endpoint, passing in a prediction credentials object that contains the obtained prediction key
            PredictionEndpointCredentials predictionEndpointCredentials = new PredictionEndpointCredentials(predictionKey);
            PredictionEndpoint endpoint = new PredictionEndpoint(predictionEndpointCredentials);

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

### <a name="Step7">Step 7: Run the example</a>

* Build and run the solution. The prediction results appear on the console.