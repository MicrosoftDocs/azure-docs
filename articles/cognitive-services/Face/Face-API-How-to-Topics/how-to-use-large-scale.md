---
title: "Example: Use the Large-Scale feature - Face API"
titleSuffix: Azure Cognitive Services
description: Use the large-scale feature in the Face API.
services: cognitive-services
author: SteveMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: sample
ms.date: 05/01/2019
ms.author: sbowles
---

# Example: Use the large-scale feature

This guide is an advanced article on how to scale up from existing PersonGroup and FaceList objects to LargePersonGroup and LargeFaceList objects, respectively. This guide demonstrates the migration process. It assumes a basic familiarity with PersonGroup and FaceList objects, the [Train](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae2d16ac60f11b48b5aa4) operation, and the face recognition functions. To learn more about these subjects, see the [Face recognition](../concepts/face-recognition.md) conceptual guide.

LargePersonGroup and LargeFaceList are collectively referred to as large-scale operations. LargePersonGroup can contain up to 1 million persons, each with a maximum of 248 faces. LargeFaceList can contain up to 1 million faces. The large-scale operations are similar to the conventional PersonGroup and FaceList but have some differences because of the new architecture. 

The samples are written in C# by using the Azure Cognitive Services Face API client library.

> [!NOTE]
> To enable Face search performance for Identification and FindSimilar in large scale, introduce a Train operation to preprocess the LargeFaceList and LargePersonGroup. The training time varies from seconds to about half an hour based on the actual capacity. During the training period, it's possible to perform Identification and FindSimilar if a successful training operating was done before. The drawback is that the new added persons and faces don't appear in the result until a new post migration to large-scale training is completed.

## Step 1: Initialize the client object

When you use the Face API client library, the subscription key and subscription endpoint are passed in through the constructor of the FaceClient class. For example:

```CSharp
string SubscriptionKey = "<Subscription Key>";
// Use your own subscription endpoint corresponding to the subscription key.
string SubscriptionEndpoint = "https://westus.api.cognitive.microsoft.com";
private readonly IFaceClient faceClient = new FaceClient(
            new ApiKeyServiceClientCredentials(subscriptionKey),
            new System.Net.Http.DelegatingHandler[] { });
faceClient.Endpoint = SubscriptionEndpoint
```

To get the subscription key with its corresponding endpoint, go to the Azure Marketplace from the Azure portal.
For more information, see [Subscriptions](https://azure.microsoft.com/services/cognitive-services/directory/vision/).

## Step 2: Code migration

This section focuses on how to migrate PersonGroup or FaceList implementation to LargePersonGroup or LargeFaceList. Although LargePersonGroup or LargeFaceList differs from PersonGroup or FaceList in design and internal implementation, the API interfaces are similar for backward compatibility.

Data migration isn't supported. You re-create the LargePersonGroup or LargeFaceList instead.

### Migrate a PersonGroup to a LargePersonGroup

Migration from a PersonGroup to a LargePersonGroup is simple. They share exactly the same group-level operations.

For PersonGroup- or person-related implementation, it's necessary to change only the API paths or SDK class/module to LargePersonGroup and LargePersonGroup Person.

Add all of the faces and persons from the PersonGroup to the new LargePersonGroup. For more information, see [Add faces](how-to-add-faces.md).

### Migrate a FaceList to a LargeFaceList

| FaceList APIs | LargeFaceList APIs |
|:---:|:---:|
| Create | Create |
| Delete | Delete |
| Get | Get |
| List | List |
| Update | Update |
| - | Train |
| - | Get Training Status |

The preceding table is a comparison of list-level operations between FaceList and LargeFaceList. As is shown, LargeFaceList comes with new operations, Train and Get Training Status, when compared with FaceList. Training the LargeFaceList is a precondition of the 
[FindSimilar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) operation. Training isn't required for FaceList. The following snippet is a helper function to wait for the training of a LargeFaceList:

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
    await FaceClient.LargeTrainLargeFaceListAsync(largeFaceListId);

    // Wait for training finish.
    while (true)
    {
        Task.Delay(timeIntervalInMilliseconds).Wait();
        var status = await faceClient.LargeFaceList.TrainAsync(largeFaceListId);

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

Previously, a typical use of FaceList with added faces and FindSimilar looked like the following:

```CSharp
// Create a FaceList.
const string FaceListId = "myfacelistid_001";
const string FaceListName = "MyFaceListDisplayName";
const string ImageDir = @"/path/to/FaceList/images";
faceClient.FaceList.CreateAsync(FaceListId, FaceListName).Wait();

// Add Faces to the FaceList.
Parallel.ForEach(
    Directory.GetFiles(ImageDir, "*.jpg"),
    async imagePath =>
        {
            using (Stream stream = File.OpenRead(imagePath))
            {
                await faceClient.FaceList.AddFaceFromStreamAsync(FaceListId, stream);
            }
        });

// Perform FindSimilar.
const string QueryImagePath = @"/path/to/query/image";
var results = new List<SimilarPersistedFace[]>();
using (Stream stream = File.OpenRead(QueryImagePath))
{
    var faces = faceClient.Face.DetectWithStreamAsync(stream).Result;
    foreach (var face in faces)
    {
        results.Add(await faceClient.Face.FindSimilarAsync(face.FaceId, FaceListId, 20));
    }
}
```

When migrating it to LargeFaceList, it becomes the following:

```CSharp
// Create a LargeFaceList.
const string LargeFaceListId = "mylargefacelistid_001";
const string LargeFaceListName = "MyLargeFaceListDisplayName";
const string ImageDir = @"/path/to/FaceList/images";
faceClient.LargeFaceList.CreateAsync(LargeFaceListId, LargeFaceListName).Wait();

// Add Faces to the LargeFaceList.
Parallel.ForEach(
    Directory.GetFiles(ImageDir, "*.jpg"),
    async imagePath =>
        {
            using (Stream stream = File.OpenRead(imagePath))
            {
                await faceClient.LargeFaceList.AddFaceFromStreamAsync(LargeFaceListId, stream);
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
    var faces = faceClient.Face.DetectWithStreamAsync(stream).Result;
    foreach (var face in faces)
    {
        results.Add(await faceClient.Face.FindSimilarAsync(face.FaceId, largeFaceListId: LargeFaceListId));
    }
}
```

As previously shown, the data management and the FindSimilar part are almost the same. The only exception is that a fresh preprocessing Train operation must complete in the LargeFaceList before FindSimilar works.

## Step 3: Train suggestions

Although the Train operation speeds up [FindSimilar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237)
and [Identification](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), the training time suffers, especially when coming to large scale. The estimated training time in different scales is listed in the following table.

| Scale for faces or persons | Estimated training time |
|:---:|:---:|
| 1,000 | 1-2 sec |
| 10,000 | 5-10 sec |
| 100,000 | 1-2 min |
| 1,000,000 | 10-30 min |

To better utilize the large-scale feature, we recommend the following strategies.

### Step 3.1: Customize time interval

As is shown in `TrainLargeFaceList()`, there's a time interval in milliseconds to delay the infinite training status checking process. For LargeFaceList with more faces, using a larger interval reduces the call counts and cost. Customize the time interval according to the expected capacity of the LargeFaceList.

The same strategy also applies to LargePersonGroup. For example, when you train a LargePersonGroup with 1 million persons, `timeIntervalInMilliseconds` might be 60,000, which is a 1-minute interval.

### Step 3.2: Small-scale buffer

Persons or faces in a LargePersonGroup or a LargeFaceList are searchable only after being trained. In a dynamic scenario, new persons or faces are constantly added and must be immediately searchable, yet training might take longer than desired. 

To mitigate this problem, use an extra small-scale LargePersonGroup or LargeFaceList as a buffer only for the newly added entries. This buffer takes a shorter time to train because of the smaller size. The immediate search capability on this temporary buffer should work. Use this buffer in combination with training on the master LargePersonGroup or LargeFaceList by running the master training on a sparser interval. Examples are in the middle of the night and daily.

An example workflow:

1. Create a master LargePersonGroup or LargeFaceList, which is the master collection. Create a buffer LargePersonGroup or LargeFaceList, which is the buffer collection. The buffer collection is only for newly added persons or faces.
1. Add new persons or faces to both the master collection and the buffer collection.
1. Only train the buffer collection with a short time interval to ensure that the newly added entries take effect.
1. Call Identification or FindSimilar against both the master collection and the buffer collection. Merge the results.
1. When the buffer collection size increases to a threshold or at a system idle time, create a new buffer collection. Trigger the Train operation on the master collection.
1. Delete the old buffer collection after the Train operation finishes on the master collection.

### Step 3.3: Standalone training

If a relatively long latency is acceptable, it isn't necessary to trigger the Train operation right after you add new data. Instead, the Train operation can be split from the main logic and triggered regularly. This strategy is suitable for dynamic scenarios with acceptable latency. It can be applied to static scenarios to further reduce the Train frequency.

Suppose there's a `TrainLargePersonGroup` function similar to `TrainLargeFaceList`. A typical implementation of the standalone training on a LargePersonGroup by invoking the [`Timer`](https://msdn.microsoft.com/library/system.timers.timer(v=vs.110).aspx) class in `System.Timers` is:

```CSharp
private static void Main()
{
    // Create a LargePersonGroup.
    const string LargePersonGroupId = "mylargepersongroupid_001";
    const string LargePersonGroupName = "MyLargePersonGroupDisplayName";
    faceClient.LargePersonGroup.CreateAsync(LargePersonGroupId, LargePersonGroupName).Wait();

    // Set up standalone training at regular intervals.
    const int TimeIntervalForStatus = 1000 * 60; // 1-minute interval for getting training status.
    const double TimeIntervalForTrain = 1000 * 60 * 60; // 1-hour interval for training.
    var trainTimer = new Timer(TimeIntervalForTrain);
    trainTimer.Elapsed += (sender, args) => TrainTimerOnElapsed(LargePersonGroupId, TimeIntervalForStatus);
    trainTimer.AutoReset = true;
    trainTimer.Enabled = true;

    // Other operations like creating persons, adding faces, and identification, except for Train.
    // ...
}

private static void TrainTimerOnElapsed(string largePersonGroupId, int timeIntervalInMilliseconds)
{
    TrainLargePersonGroup(largePersonGroupId, timeIntervalInMilliseconds).Wait();
}
```

For more information about data management and identification-related implementations, see [Add faces](how-to-add-faces.md) and [Identify faces in an image](HowtoIdentifyFacesinImage.md).

## Summary

In this guide, you learned how to migrate the existing PersonGroup or FaceList code, not data, to the LargePersonGroup or LargeFaceList:

- LargePersonGroup and LargeFaceList work similar to PersonGroup or FaceList, except that the Train operation is required by LargeFaceList.
- Take the proper Train strategy to dynamic data update for large-scale data sets.

## Next steps

Follow a how-to guide to learn how to add faces to a PersonGroup or execute the Identify operation on a PersonGroup.

- [Add faces](how-to-add-faces.md)
- [Identify faces in an image](HowtoIdentifyFacesinImage.md)