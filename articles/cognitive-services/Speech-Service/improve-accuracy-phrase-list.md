---
title: Improve recognition accuracy with Phrase lists 
description: Phrase lists can be used to customize speech recognition results based on context. 
author: ut-karsh
ms.author: umaheshwari
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual 
ms.date: 01/26/2022 
zone_pivot_groups: programming-languages-set-two-with-js-spx
---

# Improve recognition accuracy with Phrase lists

A phrase list is a list of words or phrases provided ahead of time to help improve their recognition. Adding a phrase to a phrase list increases its importance, thus making it more likely to be recognized.

Examples of phrases include:
* Names
* Geographical locations
* Homonyms
* Words or acronyms unique to your industry or organization

For example, let's say that you want the Speech service to recognize the sentence: "Abdoulaye Gueye is a Senegalese professional footballer." You might estimate in advance or discover later that it's incorrectly recognized as: "Abdullah **Guy** is a Senegalese professional footballer." In this case you want to add "Abdoulaye Gueye" to your phrase list. 

A phrase list is provided just before starting the speech recognition, eliminating the need to train a custom model. You can use the Speech SDK or Speech CLI. The Batch transcription API does not support phrase lists. 

There are some situations where [training a custom model](custom-speech-overview.md) that includes the phrases is likely the best option to improve accuracy.
- If you need to use a large list of phrases. A phrase list shouldn't have more than 500 phrases. 
- If you need a phrase list for languages that are not currently supported. For supported Phrase list locales see [Language and voice support for the Speech service](language-support.md#phrase-list).
- If you use a custom endpoint. Phrase lists can't be used custom endpoints. 


## Speech Studio

Let's use Speech Studio to see how Phrase list can improve recognition accuracy.

> [!NOTE]
> You may be prompted to select your Azure subscription and Speech resource, and then acknowledge billing for your region. If you are new to Azure or Speech, see [Try the Speech service for free](overview.md#try-the-speech-service-for-free).

1. Sign in to [Speech Studio](https://speech.microsoft.com/). 
1. Select **Real-time Speech-to-text**.
1. You test speech recognition by uploading an audio file or recording audio with a microphone. For example, select **record audio with a microphone** and then say "Abdoulaye Gueye is a Senegalese professional footballer." Then select the red button to stop recording. 
1. You should see the transcription result in the **Test results** text box. If "Abdoulaye Gueye" was not recognized, you can add their name to a phrase list in the next step.
1. Select **Show advanced options** and make sure **Phrase list** is turned on. 
1. Enter "Abdoulaye Gueye" in the phrase list text box, and then use the microphone to test recognition again. Note that multiple phrases need to be separated by a semicolon.  

## Example code

With the Speech SDK you add phrases and then run speech recognition. Then you can optionally clear or update the phrase list to take effect before the next recognition.

::: zone pivot="programming-language-csharp"
```csharp
var phraseList = PhraseListGrammar.FromRecognizer(recognizer);
phraseList.AddPhrase("Abdoulaye Gueye");
phraseList.Clear();
```
::: zone-end

::: zone pivot="programming-language-cpp"
```cpp
auto phraseListGrammar = PhraseListGrammar::FromRecognizer(recognizer);
phraseListGrammar->AddPhrase("Abdoulaye Gueye");
phraseListGrammar->Clear();
```
::: zone-end

::: zone pivot="programming-language-java"
```java
PhraseListGrammar phraseList = PhraseListGrammar.fromRecognizer(recognizer);
phraseList.addPhrase("Abdoulaye Gueye");
phraseList.clear();
```
::: zone-end

::: zone pivot="programming-language-javascript"
```javascript
const phraseList = sdk.PhraseListGrammar.fromRecognizer(recognizer);
phraseList.addPhrase("Abdoulaye Gueye");
phraseList.clear();
```
::: zone-end

::: zone pivot="programming-language-python"
```Python
phrase_list_grammar = speechsdk.PhraseListGrammar.from_recognizer(reco)
phrase_list_grammar.addPhrase("Abdoulaye Gueye")
phrase_list_grammar.clear()
```
::: zone-end

::: zone pivot="programmer-tool-spx"
With the Speech CLI you include phrases along with the recognize command.

```console
spx recognize --microphone --phrases "Abdoulaye Gueye;"
```

You can also use a text file that contains one phrase per line.

# [Terminal](#tab/terminal)
```console
spx recognize --microphone --phrases @phrases.txt
```

# [PowerShell](#tab/powershell)
```powershell
spx --% recognize --microphone --phrases @phrases.txt
```
***

::: zone-end

## Next Steps

Check out more options to improve recognition accuracy.

> [!div class="nextstepaction"]
> [Custom Speech](custom-speech-overview.md)

