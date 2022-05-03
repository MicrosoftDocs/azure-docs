---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 03/31/2022
ms.author: eur
---

### Example offset and duration

The following table shows potential offset and duration in ticks when a speaker says "Welcome to Applied Mathematics course 201." For each utterance, the offset doesn't change throughout the `Recognizing` and `Recognized` events. The duration of speech recognized so far is calculated as an offset from the beginning of the utterance.

|Event  |Text  |Offset (in ticks)  |Duration (in ticks) |
|---------|---------|---------|---------|
|RECOGNIZING     |welcome         |17000000         |5000000         |
|RECOGNIZING     |welcome to         |17000000         |6400000         |
|RECOGNIZING     |welcome to applied math          |17000000         |13600000         |
|RECOGNIZING     |welcome to applied mathematics         |17000000         |17200000         |
|RECOGNIZING     |welcome to applied mathematics course         |17000000         |23700000         |
|RECOGNIZING     |welcome to applied mathematics course 2         |17000000         |26700000         |
|RECOGNIZING     |welcome to applied mathematics course 201         |17000000         |33400000         |
|RECOGNIZED     |Welcome to applied Mathematics course 201.         |17000000         |34500000         |

The total duration of the first utterance was 3.45 seconds. It was recognized at 1.7 to 5.15 seconds offset from the start of speech recognition (00:00:01.700 --> 00:00:05.150).

If the speaker continues to say "Let's get started," a new offset is calculated. Again, the offset is always calculated from the start of recognition to the start of an utterance. The following table shows potential offset and duration for an utterance that was recognized two seconds after the previous utterance ended.

|Event  |Text  |Offset (in ticks)  |Duration (in ticks) |
|---------|---------|---------|---------|
|RECOGNIZING     |OK         |71500000         |3100000         |
|RECOGNIZING     |OK now         |71500000         |10300000         |
|RECOGNIZING     |OK, now let's         |71500000         |14700000         |
|RECOGNIZING     |OK, now let's get started.         |71500000         |18500000         |
|RECOGNIZED     |OK, now let's get started.         |71500000         |20600000         |

The total duration of the second utterance was 2.06 seconds. It was recognized at 7.15 to 9.21 seconds offset from the start of speech recognition (00:00:07.150 --> 00:00:09.210). 
