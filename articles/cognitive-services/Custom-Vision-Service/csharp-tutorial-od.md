---
title: "Quickstart: Create an object detection project with the Custom Vision SDK for C#"
titlesuffix: Azure Cognitive Services
description: Create a project, add tags, upload images, train your project, and detect objects using the .NET SDK with C#.
services: cognitive-services
author: areddish
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: quickstart
ms.date: 10/31/2018
ms.author: areddish
---

# Quickstart: Create an object detection project with the Custom Vision .NET SDK

This article provides information and sample code to help you get started using the Custom Vision SDK with C# to build an object detection model. After it's created, you can add tagged regions, upload images, train the project, obtain the project's default prediction endpoint URL, and use the endpoint to programmatically test an image. Use this example as a template for building your own .NET application. 

## Prerequisites

- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)

## Get the Custom Vision SDK and sample code
To write a .NET app that uses Custom Vision, you'll need the Custom Vision NuGet packages. These are included in the sample project you will download, but you can access them individually here.

* [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training/)
* [Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction/)

Clone or download the [Cognitive Services .NET Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples) project. Navigate to the **CustomVision/ObjectDetection** folder and open ObjectDetection.csproj_ in Visual Studio.

This Visual Studio project creates a new Custom Vision project named __My New Project__, which can be accessed through the [Custom Vision website](https://customvision.ai/). It then uploads images to train and test an object detection model. In this project, the model is trained to detect forks and scissors in images.

## Get the training and prediction keys

The project needs a valid set of subscription keys in order to interact with the service. To get a set of free trial keys, go to the [Custom Vision website](https://customvision.ai) and sign in with a Microsoft account. Select the __gear icon__ in the upper right. In the __Accounts__ section, see the values in the __Training Key__ and __Prediction Key__ fields. You will need these later. 

![Image of the keys UI](./media/csharp-tutorial/training-prediction-keys.png)

## Understand the code

Open the _Program.cs_ file and inspect the code. Insert your subscription keys in the appropriate definitions in the **Main** method.

```csharp
// Add your training & prediction key from the settings page of the portal
string trainingKey = "<your key here>";
string predictionKey = "<your key here>";

// Create the Api, passing in the training key
TrainingApi trainingApi = new TrainingApi() { ApiKey = trainingKey };
```

The following lines of code execute the primary functionality of the project.

### Create a new Custom Vision Service project

This first bit of code creates an object detection project. The created project will show up on the [Custom Vision website](https://customvision.ai/) that you visited earlier. 

```csharp
// Find the object detection domain
var domains = trainingApi.GetDomains();
var objDetectionDomain = domains.FirstOrDefault(d => d.Type == "ObjectDetection");

// Create a new project
Console.WriteLine("Creating new project:");
var project = trainingApi.CreateProject("My New Project", null, objDetectionDomain.Id);
```

### Add tags to the project

```csharp
// Make two tags in the new project
var forkTag = trainingApi.CreateTag(project.Id, "fork");
var scissorsTag = trainingApi.CreateTag(project.Id, "scissors");
```

### Upload and tag images

When you tag images in object detection projects, you need to specify the region of each tagged object using normalized coordinates. The following code associates each of the sample images with its tagged region.

```csharp
Dictionary<string, double[]> fileToRegionMap = new Dictionary<string, double[]>()
{
    // The bounding box is specified in normalized coordinates.
    //  Normalized Left = Left / Width (in Pixels)
    //  Normalized Top = Top / Height (in Pixels)
    //  Normalized Bounding Box Width = (Right - Left) / Width (in Pixels)
    //  Normalized Bounding Box Height = (Bottom - Top) / Height (in Pixels)

    //  FileName, Left, Top, Width, Height of the bounding box.
    {"scissors_1", new double[] { 0.4007353, 0.194068655, 0.259803921, 0.6617647 } },
    {"scissors_2", new double[] { 0.426470578, 0.185898721, 0.172794119, 0.5539216 } },
    {"scissors_3", new double[] { 0.289215684, 0.259428144, 0.403186262, 0.421568632 } },
    {"scissors_4", new double[] { 0.343137264, 0.105833367, 0.332107842, 0.8055556 } },
    {"scissors_5", new double[] { 0.3125, 0.09766343, 0.435049027, 0.71405226 } },
    {"scissors_6", new double[] { 0.379901975, 0.24308826, 0.32107842, 0.5718954 } },
    {"scissors_7", new double[] { 0.341911763, 0.20714055, 0.3137255, 0.6356209 } },
    {"scissors_8", new double[] { 0.231617644, 0.08459154, 0.504901946, 0.8480392 } },
    {"scissors_9", new double[] { 0.170343131, 0.332957536, 0.767156839, 0.403594762 } },
    {"scissors_10", new double[] { 0.204656869, 0.120539248, 0.5245098, 0.743464053 } },
    {"scissors_11", new double[] { 0.05514706, 0.159754932, 0.799019635, 0.730392158 } },
    {"scissors_12", new double[] { 0.265931368, 0.169558853, 0.5061275, 0.606209159 } },
    {"scissors_13", new double[] { 0.241421565, 0.184264734, 0.448529422, 0.6830065 } },
    {"scissors_14", new double[] { 0.05759804, 0.05027781, 0.75, 0.882352948 } },
    {"scissors_15", new double[] { 0.191176474, 0.169558853, 0.6936275, 0.6748366 } },
    {"scissors_16", new double[] { 0.1004902, 0.279036, 0.6911765, 0.477124184 } },
    {"scissors_17", new double[] { 0.2720588, 0.131977156, 0.4987745, 0.6911765 } },
    {"scissors_18", new double[] { 0.180147052, 0.112369314, 0.6262255, 0.6666667 } },
    {"scissors_19", new double[] { 0.333333343, 0.0274019931, 0.443627447, 0.852941155 } },
    {"scissors_20", new double[] { 0.158088237, 0.04047389, 0.6691176, 0.843137264 } },
    {"fork_1", new double[] { 0.145833328, 0.3509314, 0.5894608, 0.238562092 } },
    {"fork_2", new double[] { 0.294117659, 0.216944471, 0.534313738, 0.5980392 } },
    {"fork_3", new double[] { 0.09191177, 0.0682516545, 0.757352948, 0.6143791 } },
    {"fork_4", new double[] { 0.254901975, 0.185898721, 0.5232843, 0.594771266 } },
    {"fork_5", new double[] { 0.2365196, 0.128709182, 0.5845588, 0.71405226 } },
    {"fork_6", new double[] { 0.115196079, 0.133611143, 0.676470637, 0.6993464 } },
    {"fork_7", new double[] { 0.164215669, 0.31008172, 0.767156839, 0.410130739 } },
    {"fork_8", new double[] { 0.118872553, 0.318251669, 0.817401946, 0.225490168 } },
    {"fork_9", new double[] { 0.18259804, 0.2136765, 0.6335784, 0.643790841 } },
    {"fork_10", new double[] { 0.05269608, 0.282303959, 0.8088235, 0.452614367 } },
    {"fork_11", new double[] { 0.05759804, 0.0894935, 0.9007353, 0.3251634 } },
    {"fork_12", new double[] { 0.3345588, 0.07315363, 0.375, 0.9150327 } },
    {"fork_13", new double[] { 0.269607842, 0.194068655, 0.4093137, 0.6732026 } },
    {"fork_14", new double[] { 0.143382356, 0.218578458, 0.7977941, 0.295751631 } },
    {"fork_15", new double[] { 0.19240196, 0.0633497, 0.5710784, 0.8398692 } },
    {"fork_16", new double[] { 0.140931368, 0.480016381, 0.6838235, 0.240196079 } },
    {"fork_17", new double[] { 0.305147052, 0.2512582, 0.4791667, 0.5408496 } },
    {"fork_18", new double[] { 0.234068632, 0.445702642, 0.6127451, 0.344771236 } },
    {"fork_19", new double[] { 0.219362751, 0.141781077, 0.5919118, 0.6683006 } },
    {"fork_20", new double[] { 0.180147052, 0.239820287, 0.6887255, 0.235294119 } }
};
```
Then, this map of associations is used to upload each sample image with its region coordinates.

```csharp

// Add all images for fork
var imagePath = Path.Combine("Images", "fork");
var imageFileEntries = new List<ImageFileCreateEntry>();
foreach (var fileName in Directory.EnumerateFiles(imagePath))
{
    var region = fileToRegionMap[Path.GetFileNameWithoutExtension(fileName)];
    imageFileEntries.Add(new ImageFileCreateEntry(fileName, File.ReadAllBytes(fileName), null, new List<Region>(new Region[] { new Region(forkTag.Id, region[0], region[1], region[2], region[3]) })));
}
trainingApi.CreateImagesFromFiles(project.Id, new ImageFileCreateBatch(imageFileEntries));

// Add all images for scissors
imagePath = Path.Combine("Images", "scissors");
imageFileEntries = new List<ImageFileCreateEntry>();
foreach (var fileName in Directory.EnumerateFiles(imagePath))
{
    var region = fileToRegionMap[Path.GetFileNameWithoutExtension(fileName)];
    imageFileEntries.Add(new ImageFileCreateEntry(fileName, File.ReadAllBytes(fileName), null, new List<Region>(new Region[] { new Region(scissorsTag.Id, region[0], region[1], region[2], region[3]) })));
}
trainingApi.CreateImagesFromFiles(project.Id, new ImageFileCreateBatch(imageFileEntries));
```

At this point, all of the sample images have been uploaded, and each has a tag (**fork** or **scissors**) and an associated pixel rectangle for that tag.

### Train the project

This code creates the first iteration in the project and marks it as the default iteration. The default iteration reflects the version of the model that will respond to prediction requests. You should update this every time you retrain the model.

```csharp
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
```
### Set the current iteration as default

```csharp
// The iteration is now trained. Make it the default project endpoint
iteration.IsDefault = true;
trainingApi.UpdateIteration(project.Id, iteration.Id, iteration);
Console.WriteLine("Done!\n");

// Now there is a trained endpoint, it can be used to make a prediction
```

### Create a prediction endpoint

```csharp
// Create a prediction endpoint, passing in the obtained prediction key
PredictionEndpoint endpoint = new PredictionEndpoint() { ApiKey = predictionKey };
```

### Use the prediction endpoint

This part of the script loads the test image, queries the model endpoint, and outputs prediction data to the console.

```csharp
// Make a prediction against the new project
Console.WriteLine("Making a prediction:");
var imageFile = Path.Combine("Images", "test", "test_image.jpg");
using (var stream = File.OpenRead(imageFile))
{
    var result = endpoint.PredictImage(project.Id, File.OpenRead(imageFile));

    // Loop over each prediction and write out the results
    foreach (var c in result.Predictions)
    {
        Console.WriteLine($"\t{c.TagName}: {c.Probability:P1} [ {c.BoundingBox.Left}, {c.BoundingBox.Top}, {c.BoundingBox.Width}, {c.BoundingBox.Height} ]");
    }
}
```

## Run the application

As the application runs, it should open a console window and write the following output:

```
Creating new project:
        Training
Done!

Making a prediction:
        fork: 98.2% [ 0.111609578, 0.184719115, 0.6607002, 0.6637112 ]
        scissors: 1.2% [ 0.112389535, 0.119195729, 0.658031344, 0.7023591 ]
```
You can then verify that the test image (found in **Images/Test/**) is tagged appropriately and that the region of detection is correct. At this point, you can press any key to exit the application.

## Clean up resources
If you wish to implement your own object detection project (or try an [image classification](csharp-tutorial.md) project instead), you may want to delete the fork/scissors detection project from this example. A free trial allows for two Custom Vision projects.

On the [Custom Vision website](https://customvision.ai), navigate to **Projects** and select the trash can under My New Project.

![Screenshot of a panel labelled My New Project with a trash can icon](media/csharp-tutorial/delete_od_project.png)

## Next steps

Now you have seen how every step of the object detection process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate. The following guide deals with image classification, but its principles are similar to object detection.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)