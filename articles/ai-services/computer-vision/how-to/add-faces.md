---
title: "Example: Add faces to a PersonGroup - Face"
titleSuffix: Azure AI services
description: This guide demonstrates how to add a large number of persons and faces to a PersonGroup object with the Azure AI Face service.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: how-to
ms.date: 02/14/2024
ms.author: pafarley
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Add faces to a PersonGroup

[!INCLUDE [Gate notice](../includes/identity-gate-notice.md)]

This guide demonstrates how to add a large number of persons and faces to a **PersonGroup** object. The same strategy also applies to **LargePersonGroup**, **FaceList**, and **LargeFaceList** objects. This sample is written in C#.

## Initialization

The following code declares several variables and implements a helper function to schedule the **face add** requests:

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


## Create the PersonGroup

This code creates a **PersonGroup** named `"MyPersonGroup"` to save the persons. The request time is enqueued to `_timeStampQueue` to ensure the overall validation.

```csharp
const string personGroupId = "mypersongroupid";
const string personGroupName = "MyPersonGroup";
_timeStampQueue.Enqueue(DateTime.UtcNow);
using (var content = new ByteArrayContent(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new Dictionary<string, object> { ["name"] = personGroupName, ["recognitionModel"] = "recognition_04" }))))
{
    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
    await httpClient.PutAsync($"{ENDPOINT}/face/v1.0/persongroups/{personGroupId}", content);
}
```

## Create the persons for the PersonGroup

This code creates **Persons** concurrently, and uses `await WaitCallLimitPerSecondAsync()` to avoid exceeding the call rate limit.

```csharp
string?[] persons = new string?[PersonCount];
Parallel.For(0, PersonCount, async i =>
{
    await WaitCallLimitPerSecondAsync();

    string personName = $"PersonName#{i}";
    using (var content = new ByteArrayContent(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new Dictionary<string, object> { ["name"] = personName }))))
    {
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        using (var response = await httpClient.PostAsync($"{ENDPOINT}/face/v1.0/persongroups/{personGroupId}/persons", content))
        {
            string contentString = await response.Content.ReadAsStringAsync();
            persons[i] = (string?)(JsonConvert.DeserializeObject<Dictionary<string, object>>(contentString)?["personId"]);
        }
    }
});
```

## Add faces to the persons

Faces added to different persons are processed concurrently. Faces added for one specific person are processed sequentially. Again, `await WaitCallLimitPerSecondAsync()` is invoked to ensure that the request frequency is within the scope of limitation.

```csharp
Parallel.For(0, PersonCount, async i =>
{
    string personImageDir = @"/path/to/person/i/images";

    foreach (string imagePath in Directory.GetFiles(personImageDir, "*.jpg"))
    {
        await WaitCallLimitPerSecondAsync();

        using (Stream stream = File.OpenRead(imagePath))
        {
            using (var content = new StreamContent(stream))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                await httpClient.PostAsync($"{ENDPOINT}/face/v1.0/persongroups/{personGroupId}/persons/{persons[i]}/persistedfaces?detectionModel=detection_03", content);
            }
        }
    }
});
```

## Summary

In this guide, you learned the process of creating a PersonGroup with a massive number of persons and faces. Several reminders:

- This strategy also applies to **FaceLists** and **LargePersonGroups**.
- Adding or deleting faces to different **FaceLists** or persons in **LargePersonGroups** are processed concurrently.
- Adding or deleting faces to one specific **FaceList** or persons in a **LargePersonGroup** is done sequentially.


## Next steps

Next, learn how to use the enhanced data structure **PersonDirectory** to do more with your face data.

- [Use the PersonDirectory structure (preview)](use-persondirectory.md)
