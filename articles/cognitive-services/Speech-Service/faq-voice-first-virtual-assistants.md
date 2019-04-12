---
title: Frequently asked questions about the Direct Line Speech
titleSuffix: Azure Cognitive Services
description: Get answers to the most popular questions about voice-first virtual assistants using the Direct Line Speech channel.
services: cognitive-services
author: trrwilson
manager: 
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/11/2018
ms.author: travisw
---

# Voice-first virtual assistants (Preview): frequently asked questions (FAQ)

If you can't find answers to your questions in this FAQ, check out [other support options](support.md).

## General

## Debugging

**Q: I'm getting an error when using a SpeechBotConnector and it's not clear what I should do. What *should* I do?**

**A:** File-based logging provides substantially more detail and can help accelerate support requests. To enable this, add a property to the `BotConnectorConfig` for your `SpeechBotConnector` named `SPEECH-LogFilename` with a value pointing to a full, writeable path:

```csharp
var config = BotConnectorConfig.FromBotConnectionId(connectionId, subscriptionKey, region);
...
// Add this property to enable file-based logging
config.SetProperty("SPEECH-LogFilename", "fullPathToLogTo");
...
var connector = new SpeechBotConnector(config);
```

```java
SpeechBotConfig botConfig = BotConnectorConfig.fromBotConnectionId(botId, key, region);
...
// Add this property to enable file-based logging 
botConfig.setProperty("SPEECH-LogFileName", "fullPathToLogTo");
... 
SpeechBotConnector connector = new SpeechBotConnector(botConfig, null);
```

```cpp
auto botConfig = BotConnectorConfig::FromBotConnectionId(botId, key, region);
...
// Addition to include file logging
botConfig->SetProperty("SPEECH-LogFileName", "fullPathToLogTo);
... 
auto connector = SpeechBotConnector::FromConfig(botConfig);
```

> [!NOTE]
> File-based logging requires write access to the location specified from the client application. This includes isolated storage restrictions for Universal Windows Applications. Please consult the documentation for your platform if logs don't appear.

## Next steps

* [Troubleshooting](troubleshooting.md)
* [Release notes](releasenotes.md)
