---
title: Add faces with the Face API | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Use the Face API in Cognitive Services to add faces in images.
services: cognitive-services
author: SteveMSFT
manager: corncar
ms.service: cognitive-services
ms.component: face-api
ms.topic: article
ms.date: 03/01/2018
ms.author: sbowles
---

# How to add faces

This guide demonstrates the best practice to add massive number of persons and faces to a PersonGroup.
The same strategy also applies to FaceList and LargePersonGroup.
The samples are written in C# using the Face API client library.

## <a name="step1"></a> Step 1: Initialization

Several variables are declared and a helper function is implemented to schedule the requests.

- `PersonCount` is the total number of persons.
- `CallLimitPerSecond` is the maximum calls per second according to the subscription tier.
- `_timeStampQueue` is a Queue to record the request timestamps.
- `await WaitCallLimitPerSecondAsync()` will wait until it is valid to send next request.

```CSharp
const int PersonCount = 10000;
const int CallLimitPerSecond = 10;
static Queue<DateTime> _timeStampQueue = new Queue<DateTime>(CallLimitPerSecond);

static async Task WaitCallLimitPerSecondAsync()
{
    Monitor.Enter(_timeStampQueue);
    try
    {
        if (_timeStampQueue.Count >= CallLimitPerSecond)
        {
            TimeSpan timeInterval = DateTime.UtcNow - _timeStampQueue.Peek();
            if (timeInterval < TimeSpan.FromSeconds(1))
            {
                await Task.Delay(TimeSpan.FromSeconds(1) - timeInterval);
            }
            _timeStampQueue.Dequeue();
        }
        _timeStampQueue.Enqueue(DateTime.UtcNow);
    }
    finally
    {
        Monitor.Exit(_timeStampQueue);
    }
}
```

## <a name="step2"></a> Step 2: Authorize the API call

When using a client library, the subscription key is passed in through the constructor of the FaceServiceClient class. For example:

```CSharp
FaceServiceClient faceServiceClient = new FaceServiceClient("<Subscription Key>");
```

The subscription key can be obtained from the Marketplace page of your Azure portal. See [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up).

## <a name="step3"></a> Step 3: Create the PersonGroup

A PersonGroup named "MyPersonGroup" is created to save the persons.
The request time is enqueued to `_timeStampQueue` to ensure the overall validation.

```CSharp
const string personGroupId = "mypersongroupid";
const string personGroupName = "MyPersonGroup";
_timeStampQueue.Enqueue(DateTime.UtcNow);
await faceServiceClient.CreatePersonGroupAsync(personGroupId, personGroupName);
```

## <a name="step4"></a> Step 4: Create the persons to the PersonGroup

Persons are created concurrently and `await WaitCallLimitPerSecondAsync()` is also applied to avoid exceeding the call limit.

```CSharp
CreatePersonResult[] persons = new CreatePersonResult[PersonCount];
Parallel.For(0, PersonCount, async i =>
{
    await WaitCallLimitPerSecondAsync();

    string personName = $"PersonName#{i}";
    persons[i] = await faceServiceClient.CreatePersonAsync(personGroupId, personName);
});
```

## <a name="step5"></a> Step 5: Add faces to the persons

Adding faces to different persons are processed concurrently, while for one specific person is sequential.
Again, `await WaitCallLimitPerSecondAsync()` is invoked to ensure the request frequency is within the scope of limitation.

```CSharp
Parallel.For(0, PersonCount, async i =>
{
    Guid personId = persons[i].PersonId;
    string personImageDir = @"/path/to/person/i/images";

    foreach (string imagePath in Directory.GetFiles(personImageDir, "*.jpg"))
    {
        await WaitCallLimitPerSecondAsync();

        using (Stream stream = File.OpenRead(imagePath))
        {
            await faceServiceClient.AddPersonFaceAsync(personGroupId, personId, stream);
        }
    }
});
```

## <a name="summary"></a> Summary

In this guide, you have learned the process of creating a PersonGroup with massive number of persons and faces. Several reminders:

- This strategy also applies to FaceList and LargePersonGroup.
- Adding/Deleting faces to different FaceLists or Persons in LargePersonGroup can be processed concurrently.
- Same operations to one specific FaceList or Person in LargePersonGroup should be done sequentially.
- To keep the simplicity, the handling of potential exception is omitted in this guide. If you want to enhance more robustness, proper retry policy should be applied.

The following are a quick reminder of the features previously explained and demonstrated:

- Creating PersonGroups using the [PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) API
- Creating persons using the [PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c) API
- Adding faces to persons using the [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) API

## <a name="related"></a> Related Topics
- [How to Identify Faces in Image](HowtoIdentifyFacesinImage.md)
- [How to Detect Faces in Image](HowtoDetectFacesinImage.md)
- [How to use the large-scale feature](how-to-use-large-scale.md)
