---
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 01/22/2020
ms.author: trbye
---

## Speech modes

**Interactive**
- Meant for command and control scenarios.
- Has a segmentation time out value of X.
- At the end of one recognized utterance, the service stops processing audio from that request ID and ends the turn. The connection is not closed.
- Maximum limit for recognition is 20s.
- Typical Carbon call to invoke is `RecognizeOnceAsync`.

**Conversation**
- Meant for longer running recognitions.
- Has a segmentation time out value of Y. (Y != X)
- Will process multiple complete utterances without ending the turn.
- Will end the turn for too much silence.
- Carbon will continue with a new request ID and replaying audio as needed.
- The service will forcibly disconnect after 10 minutes of speech recognition.
- Carbon will reconnect and replay unacknowledged audio.
- Invoked in Carbon with `StartContinuousRecognition`.

**Dictation**
- Allows users to specify punctuation by speaking it.
- Invoked in Carbon by specifying `EnableDictation` on the `SpeechConfig` object regardless of the API call that starts recognition.
- The 1<sup>st</sup> party cluster returns `speech.fragment` messages for intermediate results, the 3<sup>rd</sup> party return `speech.hypothesis` messages.