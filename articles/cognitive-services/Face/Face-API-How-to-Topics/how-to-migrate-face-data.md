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

This guide shows you how to migrate an existing group of faces to a different Face API subscription using the Snapshot feature. This allows you to avoid having to repeatedly build up a **PersonGroup** or **FaceList** when moving or expanding your operations. For example, you may have created a **PersonGroup** using a free trial subscription and now want to migrate it to your paid subscription, or you may need to sync face data across regions for a large enterprise operation.

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

You need the ID of the PersonGroup in your source subscription to migrate it to the target subscription. Use the **[PersonGroupOperation.ListWithHttpMessages](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations.listwithhttpmessagesasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_Face_PersonGroupOperations_ListWithHttpMessagesAsync_System_String_System_Nullable_System_Int32__System_Collections_Generic_Dictionary_System_String_System_Collections_Generic_List_System_String___System_Threading_CancellationToken_)** method to retrieve a list of your PersonGroup objects; then get the **[PersonGroup.PersonGroupId](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.persongroup.persongroupid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Vision_Face_Models_PersonGroup_PersonGroupId)** property. In the following code snippets, this ID is stored in `personGroupId`.

> [!NOTE]
> The sample code creates and trains a new PersonGroup to migrate, but in most cases you should already have a PersonGroup to use.

## Take a Snapshot of the PersonGroup

Use the source subscription **FaceClient** instance to take a snapshot of the PersonGroup, using **TakeAsync** with the PersonGroup ID and the target subscription's ID. If you have multiple target subscriptions,you can add them as additional array entries in the third parameter.

```csharp
var takeSnapshotResult = await FaceClientEastAsia.Snapshot.TakeAsync(
    "PersonGroup",
    personGroupId,
    new[] { "<Azure West US Subscription ID>" /* Put other IDs here, if multiple target subscriptions wanted */ });
```

The snapshot request should immediately return `202 Accepted` as the response code. There is an operation ID in the response which you can use to get the snapshot status. You can obtain it by parsing the `OperationLocation` field. A typical `OperationLocation` value will look like this:

```csharp
"/operations/a63a3bdd-a1db-4d05-87b8-dbad6850062a"
```

## Retrieve the Snapshot ID

The snapshot retrieving method is asynchronous, so you'll need to wait for its completion. In this code, the `WaitForOperation` function monitors the method call, checking the status every 100ms. It uses the operation ID we receive from the original snapshot result.

```csharp
var takeOperationId = takeSnapshotResult.OperationLocation.Split('/')[2];
var operationStatus = await WaitForOperation(FaceClientEastAsia, takeOperationId);
```

The `WaitForOperation` helper method is here:

```csharp
/// <summary>
/// Waits for the take/apply operation to complete and returns the final operation status.
/// </summary>
/// <returns>The final operation status.</returns>
private static async Task<OperationStatus> WaitForOperation(IFaceClient client, string operationId)
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

## Apply Snapshot to target subscription

Create the new PersonGroup in the target subscription using a randomly generated ID. Then use the target subscription Face Client instance to apply the snapshot to this PersonGroup, passing in the snapshot ID and new PersonGroup ID. 

> [!NOTE]
> A Snapshot object is only valid for 48 hours.

```csharp
var snapshotId = operationStatus.ResourceLocation.Split('/')[2];
var newPersonGroupId = Guid.NewGuid().ToString();
var applySnapshotResult = await FaceClientWestUS.Snapshot.ApplyAsync(snapshotId, newPersonGroupId);
```

Usually, a snapshot application request will immediately return `202 Accepted` as the response code. And there is an operation ID in the response header. The operation ID is used to get the snapshot application status. You can obtain the operation ID by parsing the `Operation-Location` field. A sample response of snapshot application request is shown as below.

```
HTTP/1.1 202 Accepted
Operation-Location: /operations/84276574-2a2a-4540-a1b0-f65d834d225b
```

The snapshot application process is also asynchronous, so use `WaitForOperation` to wait for it to complete.

```csharp
var applyOperationId = applySnapshotResult.OperationLocation.Split('/')[2];
operationStatus = await WaitForOperation(FaceClientWestUS, applyOperationId);
```

## Test the data migration

After you've applied the snapshot, the new PersonGroup in the target subscription should be populated with the original face data. 

By default, training results are also copied by snapshot feature. The new PersonGroup is ready for identify without retrain needed.

Run the following operations and compare their results.

```csharp
await DisplayPersonGroup(FaceClientEastAsia, personGroupId);
await IdentifyInPersonGroup(FaceClientEastAsia, personGroupId);

await DisplayPersonGroup(FaceClientWestUS, newPersonGroupId);
// No need to retrain the person group before identification,
// training results are copied by snapshot as well.
await IdentifyInPersonGroup(FaceClientWestUS, newPersonGroupId);
```

## Clean up resources

Once the data migration is finished, we recommend you manually delete the snapshot object by running the following code.

```csharp
await FaceClientEastAsia.Snapshot.DeleteAsync(snapshotId);
```

## Tips

- Each subscription ID can only access the snapshots created by it, and the snapshots created for it (included in the applyScope of the snapshot specified as a parameter when call `Snapshot.TakeAsync`). The API ListSnapshots will return all these snapshots. = unnecessary.

- You can fire multiple snapshot taking requests for a PersonGroup at the same time, applying one same snapshot to personGroup under different subscriptions or to different personGroups under the same subscription at the same time. To be clear, the personGroup to be applied should be newly created and not applied any snapshot before. Currently, the snapshot apply model does not support replace operation.
- The snapshot taking and applying operation does not support cancelling for now.
- Snapshot does not break any operation to the source PersonGroup when taking or the target PersonGroup when applying, but it is not guaranteed to work as expected when calling PersonGroup (Person, Face) - Management and PersonGroup - Train.

- For both Take/Apply a snapshot, they're asynchronous processes.
- Training results are also copied by snapshot feature and new PersonGroup is ready for identify once migration is finished.
- Snapshot is only valid for 48 hours by design currently.

## Related Topics

- Snapshot reference documentation (.NET SDK)
- Snapshot reference documentation (REST)
- [How to add faces](how-to-add-faces.md)
- [How to Detect Faces in Image](HowtoDetectFacesinImage.md)
- [How to Identify Faces in image](HowtoIdentifyFacesinImage.md)
