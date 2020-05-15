---
title: "Migrate your face data across subscriptions - Face"
titleSuffix: Azure Cognitive Services
description: This guide shows you how to migrate your stored face data from one Face subscription to another.
services: cognitive-services
author: nitinme
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: nitinme
---

# Migrate your face data to a different Face subscription

This guide shows you how to move face data, such as a saved PersonGroup object with faces, to a different Azure Cognitive Services Face subscription. To move the data, you use the Snapshot feature. This way you avoid having to repeatedly build and train a PersonGroup or FaceList object when you move or expand your operations. For example, perhaps you created a PersonGroup object by using a free trial subscription and now want to migrate it to your paid subscription. Or you might need to sync face data across subscriptions in different regions for a large enterprise operation.

This same migration strategy also applies to LargePersonGroup and LargeFaceList objects. If you aren't familiar with the concepts in this guide, see their definitions in the [Face recognition concepts](../concepts/face-recognition.md) guide. This guide uses the Face .NET client library with C#.

## Prerequisites

You need the following items:

- Two Face subscription keys, one with the existing data and one to migrate to. To subscribe to the Face service and get your key, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).
- The Face subscription ID string that corresponds to the target subscription. To find it, select **Overview** in the Azure portal. 
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).

## Create the Visual Studio project

This guide uses a simple console app to run the face data migration. For a full implementation, see the [Face snapshot sample](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/FaceApiSnapshotSample/FaceApiSnapshotSample) on GitHub.

1. In Visual Studio, create a new Console app .NET Framework project. Name it **FaceApiSnapshotSample**.
1. Get the required NuGet packages. Right-click your project in the Solution Explorer, and select **Manage NuGet Packages**. Select the **Browse** tab, and select **Include prerelease**. Find and install the following package:
    - [Microsoft.Azure.CognitiveServices.Vision.Face 2.3.0-preview](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.2.0-preview)

## Create face clients

In the **Main** method in *Program.cs*, create two [FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) instances for your source and target subscriptions. This example uses a Face subscription in the East Asia region as the source and a West US subscription as the target. This example demonstrates how to migrate data from one Azure region to another. 

[!INCLUDE [subdomains-note](../../../../includes/cognitive-services-custom-subdomains-note.md)]

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

Fill in the subscription key values and endpoint URLs for your source and target subscriptions.


## Prepare a PersonGroup for migration

You need the ID of the PersonGroup in your source subscription to migrate it to the target subscription. Use the [PersonGroupOperationsExtensions.ListAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperationsextensions.listasync?view=azure-dotnet) method to retrieve a list of your PersonGroup objects. Then get the [PersonGroup.PersonGroupId](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.persongroup.persongroupid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_Face_Models_PersonGroup_PersonGroupId) property. This process looks different based on what PersonGroup objects you have. In this guide, the source PersonGroup ID is stored in `personGroupId`.

> [!NOTE]
> The [sample code](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/FaceApiSnapshotSample/FaceApiSnapshotSample) creates and trains a new PersonGroup to migrate. In most cases, you should already have a PersonGroup to use.

## Take a snapshot of a PersonGroup

A snapshot is temporary remote storage for certain Face data types. It functions as a kind of clipboard to copy data from one subscription to another. First, you take a snapshot of the data in the source subscription. Then you apply it to a new data object in the target subscription.

Use the source subscription's FaceClient instance to take a snapshot of the PersonGroup. Use [TakeAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.snapshotoperationsextensions.takeasync?view=azure-dotnet) with the PersonGroup ID and the target subscription's ID. If you have multiple target subscriptions, add them as array entries in the third parameter.

```csharp
var takeSnapshotResult = await FaceClientEastAsia.Snapshot.TakeAsync(
    SnapshotObjectType.PersonGroup,
    personGroupId,
    new[] { "<Azure West US Subscription ID>" /* Put other IDs here, if multiple target subscriptions wanted */ });
```

> [!NOTE]
> The process of taking and applying snapshots doesn't disrupt any regular calls to the source or target PersonGroups or FaceLists. Don't make simultaneous calls that change the source object, such as [FaceList management calls](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.facelistoperations?view=azure-dotnet) or the [PersonGroup Train](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations?view=azure-dotnet) call, for example. The snapshot operation might run before or after those operations or might encounter errors.

## Retrieve the snapshot ID

The method used to take snapshots is asynchronous, so you must wait for its completion. Snapshot operations can't be canceled. In this code, the `WaitForOperation` method monitors the asynchronous call. It checks the status every 100 ms. After the operation finishes, retrieve an operation ID by parsing the `OperationLocation` field. 

```csharp
var takeOperationId = Guid.Parse(takeSnapshotResult.OperationLocation.Split('/')[2]);
var operationStatus = await WaitForOperation(FaceClientEastAsia, takeOperationId);
```

A typical `OperationLocation` value looks like this:

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

After the operation status shows `Succeeded`, get the snapshot ID by parsing the `ResourceLocation` field of the returned OperationStatus instance.

```csharp
var snapshotId = Guid.Parse(operationStatus.ResourceLocation.Split('/')[2]);
```

A typical `resourceLocation` value looks like this:

```csharp
"/snapshots/e58b3f08-1e8b-4165-81df-aa9858f233dc"
```

## Apply a snapshot to a target subscription

Next, create the new PersonGroup in the target subscription by using a randomly generated ID. Then use the target subscription's FaceClient instance to apply the snapshot to this PersonGroup. Pass in the snapshot ID and the new PersonGroup ID.

```csharp
var newPersonGroupId = Guid.NewGuid().ToString();
var applySnapshotResult = await FaceClientWestUS.Snapshot.ApplyAsync(snapshotId, newPersonGroupId);
```


> [!NOTE]
> A Snapshot object is valid for only 48 hours. Only take a snapshot if you intend to use it for data migration soon after.

A snapshot apply request returns another operation ID. To get this ID, parse the `OperationLocation` field of the returned applySnapshotResult instance. 

```csharp
var applyOperationId = Guid.Parse(applySnapshotResult.OperationLocation.Split('/')[2]);
```

The snapshot application process is also asynchronous, so again use `WaitForOperation` to wait for it to finish.

```csharp
operationStatus = await WaitForOperation(FaceClientWestUS, applyOperationId);
```

## Test the data migration

After you apply the snapshot, the new PersonGroup in the target subscription populates with the original face data. By default, training results are also copied. The new PersonGroup is ready for face identification calls without needing retraining.

To test the data migration, run the following operations and compare the results they print to the console:

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

Now you can use the new PersonGroup in the target subscription. 

To update the target PersonGroup again in the future, create a new PersonGroup to receive the snapshot. To do this, follow the steps in this guide. A single PersonGroup object can have a snapshot applied to it only one time.

## Clean up resources

After you finish migrating face data, manually delete the snapshot object.

```csharp
await FaceClientEastAsia.Snapshot.DeleteAsync(snapshotId);
```

## Next steps

Next, see the relevant API reference documentation, explore a sample app that uses the Snapshot feature, or follow a how-to guide to start using the other API operations mentioned here:

- [Snapshot reference documentation (.NET SDK)](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.snapshotoperations?view=azure-dotnet)
- [Face snapshot sample](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/FaceApiSnapshotSample/FaceApiSnapshotSample)
- [Add faces](how-to-add-faces.md)
- [Detect faces in an image](HowtoDetectFacesinImage.md)
- [Identify faces in an image](HowtoIdentifyFacesinImage.md)
