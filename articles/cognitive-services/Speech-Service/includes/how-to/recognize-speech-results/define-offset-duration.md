---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/13/2022
ms.author: eur
---

- **Offset**: The duration offset into the stream of audio that is being recognized. Offset starts incrementing in ticks from `0` (zero) when the first audio byte is processed by the SDK. For example, the offset begins when you start continuous recognition, since that's when the SDK starts processing the audio stream. One tick represents one hundred nanoseconds or one ten-millionth of a second. 
- **Duration**: Duration of the utterance that is being recognized. The duration in ticks doesn't include trailing or leading silence. 
