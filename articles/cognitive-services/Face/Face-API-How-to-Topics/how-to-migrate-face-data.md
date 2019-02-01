---
title: "How to migrate your data across subscriptions - Face API"
titleSuffix: Azure Cognitive Services
description: This guide shows you how to migrate your stored face data from one Face API subscription to another.
services: cognitive-services
author: lewlu
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: conceptual
ms.date: 01/24/2019
ms.author: lewlu
---

# Migrate your face data to a different Face subscription

This guide shows you how to move face data (such as a saved **PersonGroup** of faces) to a different Face API subscription using the Snapshot feature. This allows you to avoid having to repeatedly build up a **PersonGroup** or **FaceList** when moving or expanding your operations. For example, you may have created a **PersonGroup** using a free trial subscription and now want to migrate it to your paid subscription, or you may need to sync face data across regions for a large enterprise operation.

The same migration strategy also applies to **LargePersonGroup** and **LargeFaceList** objects. If you are not familiar with the concepts in this guide, see their definitions in the [glossary](../Glossary.md). This guide uses the Face API .NET client library with C#.

You take a snapshot of your data and then apply it to a data object on a new subscription.

## Prerequisites

- Two Face API subscription keys (one with the existing data, and one to migrate to). Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.
- Two corresponding Face API subscription ID strings (found in the **Overview** blade on the Azure portal). 
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).


## Create the Visual Studio project

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **FaceMigration**. 
1. Get the required NuGet packages. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**. Click the **Browse** tab and select **Include prerelease**; then find and install the following package:
    - [Microsoft.Azure.CognitiveServices.Vision.Face 2.2.0-preview](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.2.0-preview)


## Create face clients

In the **Main** method in *Program.cs*, create two **[FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet)** instances for your source and target subscriptions. In this example, we will use a Face subscription in the East Asia region as the source, and a West US subscription as the target. This will demonstrate how to migrate data from one Azure region to another.

```csharp
var FaceClientEastAsia = new FaceClient(new ApiKeyServiceClientCredentials("<East Asia Subscription Key>"))
    {
        Endpoint = "<East Asia Endpoint Url>"
    };

var FaceClientWestUS = new FaceClient(new ApiKeyServiceClientCredentials("<West US Subscription Key>"))
    {
        Endpoint = "<West US Endpoint Url>"
    };
```

You will need to fill in the subscription key values and endpoint URLs for your source and target subscriptions.


## Prepare a PersonGroup for migration

You need the ID of the **PersonGroup** in your source subscription to migrate it to the target subscription. Use the **[PersonGroupOperation.ListWithHttpMessages](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations.listwithhttpmessagesasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_Face_PersonGroupOperations_ListWithHttpMessagesAsync_System_String_System_Nullable_System_Int32__System_Collections_Generic_Dictionary_System_String_System_Collections_Generic_List_System_String___System_Threading_CancellationToken_)** method to retrieve a list of your **PersonGroup** objects; then get the **[PersonGroup.PersonGroupId](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.persongroup.persongroupid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_Face_Models_PersonGroup_PersonGroupId)** property. In the following code snippets, this ID is stored in `personGroupId`.

> [!NOTE]
> The sample code creates and trains a new **PersonGroup** to migrate, but in most cases you should already have a **PersonGroup** to use.

## Take a Snapshot of the PersonGroup

Use the source subscription **FaceClient** instance to take a snapshot of the PersonGroup, using **TakeAsync** with the **PersonGroup** ID and the target subscription's ID. If you have multiple target subscriptions, you can add them as additional array entries in the third parameter.

```csharp
var takeSnapshotResult = await FaceClientEastAsia.Snapshot.TakeAsync(
    SnapshotObjectType.PersonGroup,
    personGroupId,
    new[] { "<Azure West US Subscription ID>" /* Put other IDs here, if multiple target subscriptions wanted */ });
```

> [!NOTE]
> The process of taking and applying snapshots will not disrupt any regular calls to the source or target **PersonGroup**s. However, it may cause [Face List management calls](https://docs.microsoft.com/rest/api/cognitiveservices/face/facelist) or the [Person Group - Train](https://docs.microsoft.com/rest/api/cognitiveservices/face/persongroup/train) REST call to fail.

## Retrieve the Snapshot ID

The snapshot retrieving method is asynchronous, so you'll need to wait for its completion (snapshot operations cannot be cancelled). In this code, the `WaitForOperation` function monitors the method call, checking the status every 100ms. When the operation completes, you will be able to retrieve a snapshot ID. You can obtain it by parsing the `OperationLocation` field. A typical `OperationLocation` value will look like this:

```csharp
"/operations/a63a3bdd-a1db-4d05-87b8-dbad6850062a"
```

The following code waits for the snapshot-taking operation to complete and parses its result to get the take operation ID.

```csharp
var takeOperationId = Guid.Parse(takeSnapshotResult.OperationLocation.Split('/')[2]);
var operationStatus = await WaitForOperation(FaceClientEastAsia, takeOperationId);
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

When the operation status is marked as `Succeeded`, you can then get the snapshot ID by parsing the `resourceLocation` field of the returned **OperationStatus** instance. A typical `resourceLocation` value will look like this:

```csharp
"/snapshots/e58b3f08-1e8b-4165-81df-aa9858f233dc"
```

Parse the snapshot ID with the following line:

```csharp
var snapshotId = Guid.Parse(operationStatus.ResourceLocation.Split('/')[2]);
```

## Apply Snapshot to target subscription

Next, create the new **PersonGroup** in the target subscription, using a randomly generated ID. Then use the target subscription's **FaceClient** instance to apply the snapshot to this PersonGroup, passing in the snapshot ID and new **PersonGroup** ID. 

> [!NOTE]
> A Snapshot object is only valid for 48 hours. You should only take a snapshot if you intend to use it for data migration soon after.

```csharp
var newPersonGroupId = Guid.NewGuid().ToString();
var applySnapshotResult = await FaceClientWestUS.Snapshot.ApplyAsync(snapshotId, newPersonGroupId);
```

A snapshot apply request will return an operation ID. You can get this ID by parsing the `OperationLocation` field of the returned **applySnapshotResult** instance. A typical `OperationLocation` value will look like this:

```csharp
"/operations/84276574-2a2a-4540-a1b0-f65d834d225b"
```

Parse the apply operation ID with the following line:

```csharp
var applyOperationId = Guid.Parse(applySnapshotResult.OperationLocation.Split('/')[2]);
```

The snapshot application process is also asynchronous, so again use `WaitForOperation` to wait for it to complete.

```csharp
operationStatus = await WaitForOperation(FaceClientWestUS, applyOperationId);
```

## Test the data migration

After you've applied the snapshot, the new **PersonGroup** in the target subscription should be populated with the original face data. By default, training results are also copied, so the new **PersonGroup** will be ready for face identification calls without needing retraining.

To test the data migration, you can run the following operations and compare their results.

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
/// <summary>
/// Identification against the person group.
/// </summary>
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

## Clean up resources

Once you are finished migrating face data, we recommend you manually delete the snapshot object by running the following code.

```csharp
await FaceClientEastAsia.Snapshot.DeleteAsync(snapshotId);
```

## Related Topics

- [Face reference documentation (.NET SDK)](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/face)
- [How to add faces](how-to-add-faces.md)
- [How to Detect Faces in Image](HowtoDetectFacesinImage.md)
- [How to Identify Faces in image](HowtoIdentifyFacesinImage.md)
