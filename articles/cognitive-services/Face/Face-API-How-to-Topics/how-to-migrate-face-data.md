---
title: "Migrate your face data across subscriptions - Face API"
titleSuffix: Azure Cognitive Services
description: This guide shows you how to migrate your stored face data from one Face API subscription to another.
services: cognitive-services
author: lewlu
manager: cgronlun

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 02/01/2019
ms.author: lewlu
---

# Migrate your face data to a different Face subscription

This guide shows you how to move face data (such as a saved **PersonGroup** of faces) to a different Face API subscription using the Snapshot feature. This allows you to avoid having to repeatedly build and train a **PersonGroup** or **FaceList** when moving or expanding your operations. For example, you may have created a **PersonGroup** using a free trial subscription and now want to migrate it to your paid subscription, or you may need to sync face data across regions for a large enterprise operation.

This same migration strategy also applies to **LargePersonGroup** and **LargeFaceList** objects. If you are not familiar with the concepts in this guide, see their definitions in the [glossary](../Glossary.md). This guide uses the Face API .NET client library with C#.

## Prerequisites

- Two Face API subscription keys (one with the existing data, and one to migrate to). Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.
- The Face API subscription ID string corresponding to the target subscription (found in the **Overview** blade on the Azure portal). 
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).


## Create the Visual Studio project

This guide will use a simple console app to execute the face data migration. For a full implementation, see the [Face API Snapshot Sample](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/FaceApiSnapshotSample/FaceApiSnapshotSample) on GitHub.

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **FaceApiSnapshotSample**. 
1. Get the required NuGet packages. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**. Click the **Browse** tab and select **Include prerelease**; then find and install the following package:
    - [Microsoft.Azure.CognitiveServices.Vision.Face 2.3.0-preview](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.2.0-preview)


## Create face clients

In the **Main** method in *Program.cs*, create two **[FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet)** instances for your source and target subscriptions. In this example, we will use a Face subscription in the East Asia region as the source, and a West US subscription as the target. This will demonstrate how to migrate data from one Azure region to another. If your subscriptions are in different regions, you will need to change the `Endpoint` strings.

```csharp
var FaceClientEastAsia = new FaceClient(new ApiKeyServiceClientCredentials("<East Asia Subscription Key>"))
    {
        Endpoint = "https://southeastasia.api.cognitive.microsoft.com/>"
    };

var FaceClientWestUS = new FaceClient(new ApiKeyServiceClientCredentials("<West US Subscription Key>"))
    {
        Endpoint = "https://westus.api.cognitive.microsoft.com/"
    };
```

You will need to fill in the subscription key values and endpoint URLs for your source and target subscriptions.


## Prepare a PersonGroup for migration

You need the ID of the **PersonGroup** in your source subscription to migrate it to the target subscription. Use the **[PersonGroupOperationsExtensions.ListAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperationsextensions.listasync?view=azure-dotnet)** method to retrieve a list of your **PersonGroup** objects; then get the **[PersonGroup.PersonGroupId](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.persongroup.persongroupid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_Face_Models_PersonGroup_PersonGroupId)** property. This process will look different depending on what **PersonGroup** objects you have. In the this guide, the source **PersonGroup** ID is stored in `personGroupId`.

> [!NOTE]
> The [sample code](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/FaceApiSnapshotSample/FaceApiSnapshotSample) creates and trains a new **PersonGroup** to migrate, but in most cases you should already have a **PersonGroup** to use.

## Take Snapshot of PersonGroup

A snapshot is a temporary remote storage for certain Face data types. It functions as a kind of clipboard to copy data from one subscription to another. First the user "takes" a snapshot of the data in the source subscription, and then they "apply" it to a new data object in the target subscription.

Use the source subscription's **FaceClient** instance to take a snapshot of the **PersonGroup**, using **[TakeAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.snapshotoperationsextensions.takeasync?view=azure-dotnet)** with the **PersonGroup** ID and the target subscription's ID. If you have multiple target subscriptions, you can add them as array entries in the third parameter.

```csharp
var takeSnapshotResult = await FaceClientEastAsia.Snapshot.TakeAsync(
    SnapshotObjectType.PersonGroup,
    personGroupId,
    new[] { "<Azure West US Subscription ID>" /* Put other IDs here, if multiple target subscriptions wanted */ });
```

> [!NOTE]
> The process of taking and applying snapshots will not disrupt any regular calls to the source or target **PersonGroup**s (or **FaceList**s). However, we do not recommend making simultaneous calls that change the source object ([FaceList management calls](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.facelistoperations?view=azure-dotnet) or the [PersonGroup Train](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations?view=azure-dotnet) call, for example), because the snapshot operation may execute before or after those operations or may encounter errors.

## Retrieve the Snapshot ID

The snapshot taking method is asynchronous, so you'll need to wait for its completion (snapshot operations cannot be canceled). In this code, the `WaitForOperation` method monitors the asynchronous call, checking the status every 100ms. When the operation completes, you will be able to retrieve an operation ID. You can obtain it by parsing the `OperationLocation` field. 

```csharp
var takeOperationId = Guid.Parse(takeSnapshotResult.OperationLocation.Split('/')[2]);
var operationStatus = await WaitForOperation(FaceClientEastAsia, takeOperationId);
```

A typical `OperationLocation` value will look like this:

```csharp
"/operations/a63a3bdd-a1db-4d05-87b8-dbad6850062a"
```

The `WaitForOperation` helper method is here:

```csharp
/// <summary>
/// Waits for the take/apply operation to complete and returns the final operation status.
/// </summary>
/// <returns>The final operation status.</returns>
private static async Task<OperationStatus> WaitForOperation(IFaceClient client, Guid operationId)
{
    OperationStatus operationStatus = null;
    do
    {
        if (operationStatus != null)
        {
            Thread.Sleep(TimeSpan.FromMilliseconds(100));
        }

        // Get the status of the operation.
        operationStatus = await client.Snapshot.GetOperationStatusAsync(operationId);

        Console.WriteLine($"Operation Status: {operationStatus.Status}");
    }
    while (operationStatus.Status != OperationStatusType.Succeeded
            && operationStatus.Status != OperationStatusType.Failed);

    return operationStatus;
}
```

When the operation status is marked as `Succeeded`, you can then get the snapshot ID by parsing the `ResourceLocation` field of the returned **OperationStatus** instance.

```csharp
var snapshotId = Guid.Parse(operationStatus.ResourceLocation.Split('/')[2]);
```

A typical `resourceLocation` value will look like this:

```csharp
"/snapshots/e58b3f08-1e8b-4165-81df-aa9858f233dc"
```

## Apply Snapshot to target subscription

Next, create the new **PersonGroup** in the target subscription, using a randomly generated ID. Then use the target subscription's **FaceClient** instance to apply the snapshot to this PersonGroup, passing in the snapshot ID and new **PersonGroup** ID. 

```csharp
var newPersonGroupId = Guid.NewGuid().ToString();
var applySnapshotResult = await FaceClientWestUS.Snapshot.ApplyAsync(snapshotId, newPersonGroupId);
```


> [!NOTE]
> A Snapshot object is only valid for 48 hours. You should only take a snapshot if you intend to use it for data migration soon after.

A snapshot apply request will return another operation ID. You can get this ID by parsing the `OperationLocation` field of the returned **applySnapshotResult** instance. 

```csharp
var applyOperationId = Guid.Parse(applySnapshotResult.OperationLocation.Split('/')[2]);
```

The snapshot application process is also asynchronous, so again use `WaitForOperation` to wait for it to complete.

```csharp
operationStatus = await WaitForOperation(FaceClientWestUS, applyOperationId);
```

## Test the data migration

After you've applied the snapshot, the new **PersonGroup** in the target subscription should be populated with the original face data. By default, training results are also copied, so the new **PersonGroup** will be ready for face identification calls without needing retraining.

To test the data migration, you can run the following operations and compare the results they print to the console.

```csharp
await DisplayPersonGroup(FaceClientEastAsia, personGroupId);
await IdentifyInPersonGroup(FaceClientEastAsia, personGroupId);

await DisplayPersonGroup(FaceClientWestUS, newPersonGroupId);
// No need to retrain the person group before identification,
// training results are copied by snapshot as well.
await IdentifyInPersonGroup(FaceClientWestUS, newPersonGroupId);
```

Use the following helper methods:

```csharp
private static async Task DisplayPersonGroup(IFaceClient client, string personGroupId)
{
    var personGroup = await client.PersonGroup.GetAsync(personGroupId);
    Console.WriteLine("Person Group:");
    Console.WriteLine(JsonConvert.SerializeObject(personGroup));

    // List persons.
    var persons = await client.PersonGroupPerson.ListAsync(personGroupId);

    foreach (var person in persons)
    {
        Console.WriteLine(JsonConvert.SerializeObject(person));
    }

    Console.WriteLine();
}
```

```csharp
private static async Task IdentifyInPersonGroup(IFaceClient client, string personGroupId)
{
    using (var fileStream = new FileStream("data\\PersonGroup\\Daughter\\Daughter1.jpg", FileMode.Open, FileAccess.Read))
    {
        var detectedFaces = await client.Face.DetectWithStreamAsync(fileStream);

        var result = await client.Face.IdentifyAsync(detectedFaces.Select(face => face.FaceId.Value).ToList(), personGroupId);
        Console.WriteLine("Test identify against PersonGroup");
        Console.WriteLine(JsonConvert.SerializeObject(result));
        Console.WriteLine();
    }
}
```

Now you can begin using the new **PersonGroup** in the target subscription. 

If you wish to update the target **PersonGroup** again in the future, you will need to create a new **PersonGroup** (following the steps of this guide) to receive the snapshot. A single **PersonGroup** object can only have a snapshot applied to it one time.

## Clean up resources

Once you are finished migrating face data, we recommend you manually delete the snapshot object.

```csharp
await FaceClientEastAsia.Snapshot.DeleteAsync(snapshotId);
```

## Related Topics

- [Snapshot reference documentation (.NET SDK)](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.snapshotoperations?view=azure-dotnet)
- [Face API Snapshot Sample](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/FaceApiSnapshotSample/FaceApiSnapshotSample)
- [How to add faces](how-to-add-faces.md)
- [How to Detect Faces in Image](HowtoDetectFacesinImage.md)
- [How to Identify Faces in image](HowtoIdentifyFacesinImage.md)
