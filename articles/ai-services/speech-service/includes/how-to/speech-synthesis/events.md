---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/30/2023
ms.author: eur
---


| Event | Description | Use case |
|:--- |:--- |:--- |
| `BookmarkReached` | Signals that a bookmark was reached. To trigger a bookmark reached event, a `bookmark` element is required in the [SSML](../../../speech-synthesis-markup-structure.md#bookmark-element). This event reports the output audio's elapsed time between the beginning of synthesis and the `bookmark` element. The event's `Text` property is the string value that you set in the bookmark's `mark` attribute. The `bookmark` elements aren't spoken. | You can use the `bookmark` element to insert custom markers in SSML to get the offset of each marker in the audio stream. The `bookmark` element can be used to reference a specific location in the text or tag sequence. |
| `SynthesisCanceled` | Signals that the speech synthesis was canceled. | You can confirm when synthesis has been canceled. |
| `SynthesisCompleted` | Signals that speech synthesis has completed. | You can confirm when synthesis has completed. |
| `SynthesisStarted` | Signals that speech synthesis has started. | You can confirm when synthesis has started. |
| `Synthesizing` | Signals that speech synthesis is ongoing. This event fires each time the SDK receives an audio chunk from the Speech service. | You can confirm when synthesis is in progress. |
| `VisemeReceived` | Signals that a viseme event was received. | [Visemes](../../../how-to-speech-synthesis-viseme.md) are often used to represent the key poses in observed speech. Key poses include the position of the lips, jaw, and tongue in producing a particular phoneme. You can use visemes to animate the face of a character as speech audio plays. |
| `WordBoundary` | Signals that a word boundary was received. This event is raised at the beginning of each new spoken word, punctuation, and sentence. The event reports the current word's time offset, in ticks, from the beginning of the output audio. This event also reports the character position in the input text or [SSML](../../../speech-synthesis-markup.md) immediately before the word that's about to be spoken. | This event is commonly used to get relative positions of the text and corresponding audio. You might want to know about a new word, and then take action based on the timing. For example, you can get information that can help you decide when and for how long to highlight words as they're spoken. |

> [!NOTE]
> Events are raised as the output audio data becomes available, which is faster than playback to an output device. The caller must appropriately synchronize streaming and real-time.
