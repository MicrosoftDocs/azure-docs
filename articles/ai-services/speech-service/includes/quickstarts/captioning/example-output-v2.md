---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 10/03/2022
ms.author: eur
---

When you use the `realTime` option in the example above, the partial results from `Recognizing` events are included in the output. In this example, only the final `Recognized` event includes the commas. Commas aren't the only differences between `Recognizing` and `Recognized` events. For more information, see [Get partial results](~/articles/ai-services/speech-service/captioning-concepts.md#get-partial-results).

```srt
1
00:00:00,170 --> 00:00:00,380
The

2
00:00:00,380 --> 00:00:01,770
The rainbow

3
00:00:01,770 --> 00:00:02,560
The rainbow has seven

4
00:00:02,560 --> 00:00:03,820
The rainbow has seven colors

5
00:00:03,820 --> 00:00:05,050
The rainbow has seven colors red

6
00:00:05,050 --> 00:00:05,850
The rainbow has seven colors red
orange

7
00:00:05,850 --> 00:00:06,440
The rainbow has seven colors red
orange yellow

8
00:00:06,440 --> 00:00:06,730
The rainbow has seven colors red
orange yellow green

9
00:00:06,730 --> 00:00:07,160
orange, yellow, green, blue,
indigo and Violet.
```

When you use the `--offline` option, the results are stable from the final `Recognized` event. Partial results aren't included in the output:

```srt
1
00:00:00,170 --> 00:00:05,540
The rainbow has seven colors, red,
orange, yellow, green, blue,

2
00:00:05,540 --> 00:00:07,160
indigo and Violet.
```

The [SRT](https://docs.fileformat.com/video/srt/) (SubRip Text) timespan output format is `hh:mm:ss,fff`. For more information, see [Caption output format](~/articles/ai-services/speech-service/captioning-concepts.md#caption-output-format).
