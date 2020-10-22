---
author: baanders
description: include file for Azure Digital Twins - code to create a twin
ms.service: digital-twins
ms.topic: include
ms.date: 10/21/2020
ms.author: baanders
---

```csharp
// Define the model type for the twin to be created
Dictionary<string, object> meta = new Dictionary<string, object>()
{
    { "$model", "dtmi:example:Room;1" }
};
// Initialize the twin properties
Dictionary<string, object> twin = new Dictionary<string, object>()
{
    { "$metadata", meta },
    { "Temperature", temperature},
    { "Humidity", humidity},
};
//Create the twin
client.CreateDigitalTwin("myRoomID", JsonSerializer.Serialize<Dictionary<string, object>>(twin));
```