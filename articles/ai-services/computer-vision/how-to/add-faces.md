---
title: "Example: Add faces to a PersonGroup - Face"
titleSuffix: Azure AI services
description: This guide demonstrates how to add a large number of persons and faces to a PersonGroup object with the Azure AI Face service.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: how-to
ms.date: 04/10/2019
ms.author: nitinme
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Add faces to a PersonGroup

[!INCLUDE [Gate notice](../includes/identity-gate-notice.md)]

This guide demonstrates how to add a large number of persons and faces to a PersonGroup object. The same strategy also applies to LargePersonGroup, FaceList, and LargeFaceList objects. This sample is written in C# by using the Azure AI Face .NET client library.

## Step 1: Initialization

The following code declares several variables and implements a helper function to schedule the face add requests:

- `PersonCount` is the total number of persons.
- `CallLimitPerSecond` is the maximum calls per second according to the subscription tier.
- `_timeStampQueue` is a Queue to record the request timestamps.
- `await WaitCallLimitPerSecondAsync()` waits until it's valid to send the next request.

```csharp
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

## Step 2: Authorize the API call

When you use the Face client library, the key and subscription endpoint are passed in through the constructor of the FaceClient class. See the [quickstart](../quickstarts-sdk/identity-client-library.md?pivots=programming-language-csharp&tabs=visual-studio) for instructions on creating a Face client object.


## Step 3: Create the PersonGroup

A PersonGroup named "MyPersonGroup" is created to save the persons.
The request time is enqueued to `_timeStampQueue` to ensure the overall validation.

```csharp
const string personGroupId = "mypersongroupid";
const string personGroupName = "MyPersonGroup";
_timeStampQueue.Enqueue(DateTime.UtcNow);
await faceClient.LargePersonGroup.CreateAsync(personGroupId, personGroupName);
```

## Step 4: Create the persons for the PersonGroup

Persons are created concurrently, and `await WaitCallLimitPerSecondAsync()` is also applied to avoid exceeding the call limit.

```csharp
Person[] persons = new Person[PersonCount];
Parallel.For(0, PersonCount, async i =>
{
    await WaitCallLimitPerSecondAsync();

    string personName = $"PersonName#{i}";
    persons[i] = await faceClient.PersonGroupPerson.CreateAsync(personGroupId, personName);
});
```

## Step 5: Add faces to the persons

Faces added to different persons are processed concurrently. Faces added for one specific person are processed sequentially.
Again, `await WaitCallLimitPerSecondAsync()` is invoked to ensure that the request frequency is within the scope of limitation.

```csharp
Parallel.For(0, PersonCount, async i =>
{
    Guid personId = persons[i].PersonId;
    string personImageDir = @"/path/to/person/i/images";

    foreach (string imagePath in Directory.GetFiles(personImageDir, "*.jpg"))
    {
        await WaitCallLimitPerSecondAsync();

        using (Stream stream = File.OpenRead(imagePath))
        {
            await faceClient.PersonGroupPerson.AddFaceFromStreamAsync(personGroupId, personId, stream);
        }
    }
});
```

## Summary

In this guide, you learned the process of creating a PersonGroup with a massive number of persons and faces. Several reminders:

- This strategy also applies to FaceLists and LargePersonGroups.
- Adding or deleting faces to different FaceLists or persons in LargePersonGroups are processed concurrently.
- Adding or deleting faces to one specific FaceList or person in a LargePersonGroup are done sequentially.
- For simplicity, how to handle a potential exception is omitted in this guide. If you want to enhance more robustness, apply the proper retry policy.

The following features were explained and demonstrated:

- Create PersonGroups by using the [PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) API.
- Create persons by using the [PersonGroup Person - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523c) API.
- Add faces to persons by using the [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) API.

## Next steps

In this guide, you learned how to add face data to a **PersonGroup**. Next, learn how to use the enhanced data structure **PersonDirectory** to do more with your face data.

- [Use the PersonDirectory structure (preview)](use-persondirectory.md)
