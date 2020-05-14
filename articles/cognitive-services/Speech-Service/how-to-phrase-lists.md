---
title: Phrase Lists - Speech service
titleSuffix: Azure Cognitive Services
description: "Learn how to supply the Speech service with a Phrase List using the `PhraseListGrammar` object to improve speech-to-text recognition results."
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/04/2020
ms.author: dapine
zone_pivot_groups: programming-languages-speech-services-one-nomore-no-go
---

# Phrase Lists for speech-to-text

By providing the Speech service with a list of phrases, you can improve the accuracy of speech recognition. Phrase Lists are used to identify known phrases in audio data, like a person's name or a specific location.

As an example, if you have a command "Move to" and a possible destination of "Ward" that may be spoken, you can add an entry of "Move to Ward". Adding a phrase will increase the probability that when the audio is recognized that "Move to Ward" will be recognized instead of "Move toward".

Single words or complete phrases can be added to a Phrase List. During recognition, an entry in a phrase list is used if an exact match for the entire phrase is included in the audio as a separate phrase. If an exact match to the phrase is not found, recognition is not assisted.

>[!Note]
> Currently, Phrase Lists supports only English for speech-to-text.

## How to use Phrase Lists

The samples below illustrate how to build a Phrase List using the `PhraseListGrammar` object.

::: zone pivot="programming-language-csharp"

```cs
PhraseListGrammar phraseList = PhraseListGrammar.FromRecognizer(recognizer);
phraseList.AddPhrase("Move to Ward");
phraseList.AddPhrase("Move to Bill");
phraseList.AddPhrase("Move to Ted");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
auto phraselist = PhraseListGrammar::FromRecognizer(recognizer);
phraselist->AddPhrase("Move to Ward");
phraselist->AddPhrase("Move to Bill");
phraselist->AddPhrase("Move to Ted");
```

::: zone-end

::: zone pivot="programming-language-java"

```Java
PhraseListGrammar phraseListGrammar = PhraseListGrammar.fromRecognizer(recognizer);
phraseListGrammar.addPhrase("Move to Ward");
phraseListGrammar.addPhrase("Move to Bill");
phraseListGrammar.addPhrase("Move to Ted");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
phrase_list_grammar = speechsdk.PhraseListGrammar.from_recognizer(reco)
phrase_list_grammar.addPhrase("Move to Ward")
phrase_list_grammar.addPhrase("Move to Bill")
phrase_list_grammar.addPhrase("Move to Ted")
```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript
var phraseListGrammar = SpeechSDK.PhraseListGrammar.fromRecognizer(reco);
phraseListGrammar.addPhrase("Move to Ward");
phraseListGrammar.addPhrase("Move to Bill");
phraseListGrammar.addPhrase("Move to Ted");
```

::: zone-end

>[!Note]
> The maximum number of Phrase Lists that the Speech service will use to match speech is 1024 phrases.

You can also clear the phrases associated with the `PhraseListGrammar` by calling clear().

::: zone pivot="programming-language-csharp"

```cs
phraseList.Clear();
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
phraselist->Clear();
```

::: zone-end

::: zone pivot="programming-language-java"

```Java
phraseListGrammar.clear();
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
phrase_list_grammar.clear()
```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript
phraseListGrammar.clear();
```

::: zone-end

> [!NOTE]
> Changes to a `PhraseListGrammar` object take effect on the next recognition or following a reconnection to the Speech service.

## Next steps

* [Speech SDK reference documentation](speech-sdk.md)
