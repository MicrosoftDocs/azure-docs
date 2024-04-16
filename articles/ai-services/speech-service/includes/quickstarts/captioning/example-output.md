---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 10/03/2022
ms.author: eur
---

The output file with complete captions is written to `caption.output.txt`. Intermediate results are shown in the console:

```srt
00:00:00,180 --> 00:00:01,600
Welcome to

00:00:00,180 --> 00:00:01,820
Welcome to applied

00:00:00,180 --> 00:00:02,420
Welcome to applied mathematics

00:00:00,180 --> 00:00:02,930
Welcome to applied mathematics course

00:00:00,180 --> 00:00:03,100
Welcome to applied Mathematics course 2

00:00:00,180 --> 00:00:03,230
Welcome to applied Mathematics course 201.
```

The [SRT](https://docs.fileformat.com/video/srt/) (SubRip Text) timespan output format is `hh:mm:ss,fff`. For more information, see [Caption output format](~/articles/ai-services/speech-service/captioning-concepts.md#caption-output-format).
