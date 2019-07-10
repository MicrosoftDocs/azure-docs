---
title: Phrase Lists - Speech Services
titlesuffix: Azure Cognitive Services
description: "Learn how to supply the Speech Services with a Phrase List using the `PhraseListGrammar` object to improve speech-to-text recognition results."
services: cognitive-services
author: rhurey
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: rhurey
---

# Phrase Lists for speech-to-text

By providing the Speech Services with a Phrase List, you can improve the accuracy of speech recognition. Phrase Lists are used to identify known phrases in audio data, like a person's name or a specific location.

As an example, if you have a command "Move to" and a possible destination of "Ward" that may be spoken, you can add an entry of "Move to Ward". Adding a phrase will increase the probability that when the audio is recognized that "Move to Ward" will be recognized instead of "Move toward".

Single words or complete phrases can be added to a Phrase List. During recognition, an entry in a phrase list is used if an exact match is included in the audio. Building on the previous example, if the Phrase List includes "Move to Ward", and the phrase captured is "Move toward slowly", then the recognition result will be "Move to Ward slowly".

## How to use Phrase Lists

The samples below illustrate how to build a Phrase List using the `PhraseListGrammar` object.

```C++
auto phraselist = PhraseListGrammar::FromRecognizer(recognizer);
phraselist->AddPhrase("Move to Ward");
phraselist->AddPhrase("Move to Bill");
phraselist->AddPhrase("Move to Ted");
```

```cs
PhraseListGrammar phraseList = PhraseListGrammar.FromRecognizer(recognizer);
phraseList.AddPhrase("Move to Ward");
phraseList.AddPhrase("Move to Bill");
phraseList.AddPhrase("Move to Ted");
```

```Python
phrase_list_grammar = speechsdk.PhraseListGrammar.from_recognizer(reco)
phrase_list_grammar.addPhrase("Move to Ward")
phrase_list_grammar.addPhrase("Move to Bill")
phrase_list_grammar.addPhrase("Move to Ted")
```

```JavaScript
var phraseListGrammar = SpeechSDK.PhraseListGrammar.fromRecognizer(reco);
phraseListGrammar.addPhrase("Move to Ward");
phraseListGrammar.addPhrase("Move to Bill");
phraseListGrammar.addPhrase("Move to Ted");
```

```Java
PhraseListGrammar phraseListGrammar = PhraseListGrammar.fromRecognizer(recognizer);
phraseListGrammar.addPhrase("Move to Ward");
phraseListGrammar.addPhrase("Move to Bill");
phraseListGrammar.addPhrase("Move to Ted");
```

>[!Note]
> The maximum number of Phrase Lists that the Speech Service will use to match speech is 1024 phrases.

You can also clear the phrases associated with the `PhraseListGrammar` by calling clear().

```C++
phraselist->Clear();
```

```cs
phraseList.Clear();
```

```Python
phrase_list_grammar.clear()
```

```JavaScript
phraseListGrammar.clear();
```

```Java
phraseListGrammar.clear();
```

> [!NOTE]
> Changes to a `PhraseListGrammar` object take affect on the next recognition or following a reconnection to the Speech Services.

## Next steps

* [Speech SDK reference documentation](speech-sdk.md)
