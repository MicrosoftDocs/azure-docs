---
title: "Example: Use the Large-Scale Feature - Face API"
titleSuffix: Azure Cognitive Services
description: Use the large-scale feature in the Face API.
services: cognitive-services
author: SteveMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: sample
ms.date: 03/01/2018
ms.author: sbowles
---

# Example: How to use the large-scale feature

This guide is an advanced article on code migration to scale up from existing PersonGroup and FaceList to LargePersonGroup and LargeFaceList respectively.
This guide demonstrates the migration process with assumption of knowing basic usage of PersonGroup and FaceList.
For getting familiar with basic operations, please see other tutorials such as [How to identify faces in images](HowtoIdentifyFacesinImage.md),

The Face API recently released two features to enable large-scale scenarios,
LargePersonGroup and LargeFaceList,
collectively referred to as Large-scale operations.
LargePersonGroup can contain up to 1,000,000 persons each with a maximum of 248 faces,
and LargeFaceList can hold up to 1,000,000 faces.

The large-scale operations are similar to the conventional PersonGroup and FaceList,
but have some notable differences due to the new architecture.
This guide demonstrates the migration process with assumption of knowing basic usage of PersonGroup and FaceList.
The samples are written in C# using the Face API client library.

To enable Face search performance for Identification and FindSimilar in the large scale,
you need to introduce a Train operation to pre-process the LargeFaceList and LargePersonGroup.
The training time varies from seconds to about half an hour depending on the actual capacity.
During the training period,
it is still possible to perform Identification and FindSimilar if a successful training is done before.
However, the drawback is that the new added persons/faces will not appear in the result until a new post migration to large-scale training is completed.

## Concepts

If you are not familiar with the following concepts in this guide, the definitions can be found in the [glossary](../Glossary.md):

- LargePersonGroup: A collection of Persons with capacity up to 1,000,000.
- LargeFaceList: A collection of Faces with capacity up to 1,000,000.
- Train: A pre-process to ensure Identification/FindSimilar performance.
- Identification: Identify one or more faces from a PersonGroup or LargePersonGroup.
- FindSimilar: Search similar faces from a FaceList or LargeFaceList.

## Step 1: Authorize the API call

When using the Face API client library, the subscription key and subscription endpoint are passed in through the constructor of the FaceServiceClient class. For example:

```CSharp
string SubscriptionKey = "<Subscription Key>";
// Use your own subscription endpoint corresponding to the subscription key.
string SubscriptionRegion = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/";
FaceServiceClient FaceServiceClient = new FaceServiceClient(SubscriptionKey, SubscriptionRegion);
```

The subscription key with corresponding endpoint can be obtained from the Marketplace page of your Azure portal.
See [Subscriptions](https://azure.microsoft.com/services/cognitive-services/directory/vision/).

## Step 2: Code Migration in action

This section only focuses on migrating PersonGroup/FaceList implementation to LargePersonGroup/LargeFaceList.
Although LargePersonGroup/LargeFaceList differs from PersonGroup/FaceList in design and internal implementation,
the API interfaces are similar for back-compatibility.

Data migration is not supported, you have to recreate the LargePersonGroup/LargeFaceList instead.

## Step 2.1: Migrate PersonGroup to LargePersonGroup

The migration from PersonGroup to LargePersonGroup is smooth as they share exactly the same group-level operations.

For PersonGroup/Person related implementation,
it is only necessary to change the API paths or SDK class/module to LargePersonGroup and LargePersonGroup Person.

In terms of data migration, see [How to Add Faces](how-to-add-faces.md) for reference.

## Step 2.2: Migrate FaceList to LargeFaceList

| FaceList APIs | LargeFaceList APIs |
|:---:|:---:|
| Create | Create |
| Delete | Delete |
| Get | Get |
| List | List |
| Update | Update |
| - | Train |
| - | Get Training Status |

The preceding table is a comparison of list-level operations between FaceList and LargeFaceList.
As is shown, LargeFaceList comes with new operations, Train, and Get Training Status, when compared with FaceList.
Getting the LargeFaceList trained is a precondition of
[FindSimilar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237)
operation while there is no Train required for FaceList.
The following snippet is a helper function to wait for the training of a LargeFaceList.

```CSharp
/// <summary>
/// Helper function to train LargeFaceList and wait for finish.
/// </summary>
/// <remarks>
/// The time interval can be adjusted considering the following factors:
/// - The training time which depends on the capacity of the LargeFaceList.
/// - The acceptable latency for getting the training status.
/// - The call frequency and cost.
///
/// Estimated training time for LargeFaceList in different scale:
/// -     1,000 faces cost about  1 to  2 seconds.
/// -    10,000 faces cost about  5 to 10 seconds.
/// -   100,000 faces cost about  1 to  2 minutes.
/// - 1,000,000 faces cost about 10 to 30 minutes.
/// </remarks>
/// <param name="largeFaceListId">The Id of the LargeFaceList for training.</param>
/// <param name="timeIntervalInMilliseconds">The time interval for getting training status in milliseconds.</param>
/// <returns>A task of waiting for LargeFaceList training finish.</returns>
private static async Task TrainLargeFaceList(
    string largeFaceListId,
    int timeIntervalInMilliseconds = 1000)
{
    // Trigger a train call.
    await FaceServiceClient.TrainLargeFaceListAsync(largeFaceListId);

    // Wait for training finish.
    while (true)
    {
        Task.Delay(timeIntervalInMilliseconds).Wait();
        var status = await FaceServiceClient.GetLargeFaceListTrainingStatusAsync(largeFaceListId);

        if (status.Status == Status.Running)
        {
            continue;
        }
        else if (status.Status == Status.Succeeded)
        {
            break;
        }
        else
        {
            throw new Exception("The train operation is failed!");
        }
    }
}
```

Previously, a typical usage of FaceList with adding faces and FindSimilar would be

```CSharp
// Create a FaceList.
const string FaceListId = "myfacelistid_001";
const string FaceListName = "MyFaceListDisplayName";
const string ImageDir = @"/path/to/FaceList/images";
FaceServiceClient.CreateFaceListAsync(FaceListId, FaceListName).Wait();

// Add Faces to the FaceList.
Parallel.ForEach(
    Directory.GetFiles(ImageDir, "*.jpg"),
    async imagePath =>
        {
            using (Stream stream = File.OpenRead(imagePath))
            {
                await FaceServiceClient.AddFaceToFaceListAsync(FaceListId, stream);
            }
        });

// Perform FindSimilar.
const string QueryImagePath = @"/path/to/query/image";
var results = new List<SimilarPersistedFace[]>();
using (Stream stream = File.OpenRead(QueryImagePath))
{
    var faces = FaceServiceClient.DetectAsync(stream).Result;
    foreach (var face in faces)
    {
        results.Add(await FaceServiceClient.FindSimilarAsync(face.FaceId, FaceListId, 20));
    }
}
```

When migrating it to LargeFaceList, it should become

```CSharp
// Create a LargeFaceList.
const string LargeFaceListId = "mylargefacelistid_001";
const string LargeFaceListName = "MyLargeFaceListDisplayName";
const string ImageDir = @"/path/to/FaceList/images";
FaceServiceClient.CreateLargeFaceListAsync(LargeFaceListId, LargeFaceListName).Wait();

// Add Faces to the LargeFaceList.
Parallel.ForEach(
    Directory.GetFiles(ImageDir, "*.jpg"),
    async imagePath =>
        {
            using (Stream stream = File.OpenRead(imagePath))
            {
                await FaceServiceClient.AddFaceToLargeFaceListAsync(LargeFaceListId, stream);
            }
        });

// Train() is newly added operation for LargeFaceList.
// Must call it before FindSimilarAsync() to ensure the newly added faces searchable.
await TrainLargeFaceList(LargeFaceListId);

// Perform FindSimilar.
const string QueryImagePath = @"/path/to/query/image";
var results = new List<SimilarPersistedFace[]>();
using (Stream stream = File.OpenRead(QueryImagePath))
{
    var faces = FaceServiceClient.DetectAsync(stream).Result;
    foreach (var face in faces)
    {
        results.Add(await FaceServiceClient.FindSimilarAsync(face.FaceId, largeFaceListId: LargeFaceListId));
    }
}
```

As is shown above, the data management and the FindSimilar part are almost the same.
The only exception is that a fresh pre-processing Train operation must complete in the LargeFaceList before FindSimilar works.

## Step 3: Train Suggestions

Although the Train operation speeds up the
[FindSimilar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237)
and
[Identification](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239),
the training time suffers especially when coming to large scale.
The estimated training time in different scales is listed in the following table:

| Scale (faces or persons) | Estimated Training Time |
|:---:|:---:|
| 1,000 | 1-2 s |
| 10,000 | 5-10 s |
| 100,000 | 1 - 2 min |
| 1,000,000 | 10 - 30 min |

To better utilize the large-scale feature, some strategies are recommended to take into consideration.

## Step 3.1: Customize Time Interval

As is shown in the `TrainLargeFaceList()`,
there is a `timeIntervalInMilliseconds` to delay the infinite training status checking process.
For LargeFaceList with more faces, using a larger interval reduces the call counts and cost.
The time interval should be customized according to the expected capacity of the LargeFaceList.

Same strategy also applies to LargePersonGroup.
For example, when training a LargePersonGroup with 1,000,000 persons,
the `timeIntervalInMilliseconds` could be 60,000 (a.k.a. 1-minute interval).

## Step 3.2 Small-scale buffer

Persons/Faces in LargePersonGroup/LargeFaceList are searchable only after being trained.
In a dynamic scenario, new persons/faces are constantly added and need to be immediately searchable,
yet training could take longer than desired.
To mitigate this problem, you can use an extra small-scale LargePersonGroup/LargeFaceList as a buffer only for the newly added entries.
This buffer takes shorter time to train because of much smaller size and the immediate search on this temporary buffer should work.
Use this buffer in combination with training on the master LargePersonGroup/LargeFaceList by executing the master training on a more sparse interval,
for example, in the mid-night, and daily.

An example workflow:
1. Create a master LargePersonGroup/LargeFaceList (master collection) and a buffer LargePersonGroup/LargeFaceList (buffer collection). The buffer collection is only for newly added Persons/Faces.
1. Add new Persons/Faces to both the master collection and the buffer collection.
1. Only train the buffer collection with a short time interval to ensure the newly added entries taking effect.
1. Call Identification/FindSimilar against both the master collection and the buffer collection, and merge the results.
1. When buffer collection size increases to a threshold or at a system idle time, create a new buffer collection and trigger the train on master collection.
1. Delete the old buffer collection after the finish of training on the master collection.

## Step 3.3 Standalone Training

If a relatively long latency is acceptable,
it is not necessary to trigger the Train operation right after adding new data.
Instead, the Train operation can be split from the main logic and triggered regularly.
This strategy is suitable for dynamic scenarios with acceptable latency,
and can be applied to static scenarios to further reduce the Train frequency.

Suppose there is a `TrainLargePersonGroup` function similar to the `TrainLargeFaceList`.
A typical implementation of the standalone Training on LargePersonGroup by invoking the
[`Timer`](https://msdn.microsoft.com/library/system.timers.timer(v=vs.110).aspx)
class in `System.Timers` would be:

```CSharp
private static void Main()
{
    // Create a LargePersonGroup.
    const string LargePersonGroupId = "mylargepersongroupid_001";
    const string LargePersonGroupName = "MyLargePersonGroupDisplayName";
    FaceServiceClient.CreateLargePersonGroupAsync(LargePersonGroupId, LargePersonGroupName).Wait();

    // Setup a standalone training at regular intervals.
    const int TimeIntervalForStatus = 1000 * 60; // 1 minute interval for getting training status.
    const double TimeIntervalForTrain = 1000 * 60 * 60; // 1 hour interval for training.
    var trainTimer = new Timer(TimeIntervalForTrain);
    trainTimer.Elapsed += (sender, args) => TrainTimerOnElapsed(LargePersonGroupId, TimeIntervalForStatus);
    trainTimer.AutoReset = true;
    trainTimer.Enabled = true;

    // Other operations like creating persons, adding faces and Identification except for Train.
    // ...
}

private static void TrainTimerOnElapsed(string largePersonGroupId, int timeIntervalInMilliseconds)
{
    TrainLargePersonGroup(largePersonGroupId, timeIntervalInMilliseconds).Wait();
}
```

More information about data management and identification-related implementations,
see [How to Add Faces](how-to-add-faces.md) and [How to Identify Faces in Image](HowtoIdentifyFacesinImage.md).

## Summary

In this guide, you have learned how to migrate the existing PersonGroup/FaceList code (not data) to the LargePersonGroup/LargeFaceList:

- LargePersonGroup and LargeFaceList works similar to the PersonGroup/FaceList, except Train operation is required by LargeFaceList.
- Take proper train strategy to dynamic data update for large-scale dataset.

## Related Topics

- [How to Identify Faces in Image](HowtoIdentifyFacesinImage.md)
- [How to Add Faces](how-to-add-faces.md)
