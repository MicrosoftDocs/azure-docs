---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/13/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK in the next section of this article, but first check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements.

## Create captions from speech

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `caption.cpp` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/captioning_sample/scenarios/cpp/windows/captioning/caption.cpp) at GitHub.


Build and run your new console application. Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. 

```console
caption.exe [-f] [-h] [-i file] [-l languages] [-m] [-o file] [-p phrases] [-q] [-r number] [-s] [-t] [-u] YourSubscriptionKey YourServiceRegion
```

Usage options include:

- `-h`: Show this help and stop

- `-o file`: Output captions to the specified `file`. This flag is required.

- `-f`: Removes profane words. This setting overrides `-m` if set.

- `-m`: Replaces letters in profane words with asterisk (*) characters. This setting is overridden by `-f` if set.

- `-i`: Input speech from the specified `file`. If this is not set, audio input is from the default microphone.

- `-l languages`: Enable language identification for specified *languages`.  The comma delimited phrases must be in quotes. Example: "en-US,ja-JP"

- `-p phrases`: Add specified `phrases` to the phrase list. The semicolon delimited phrases must be in quotes. Example: "Constoso;Jessie;Rehaan"

- `-q`: Suppress console output (except errors)

- `-r number`: Set stable partial result threshold to the `number`. 

- `-s`: Emit SRT caption format instead of the default WebVTT format.

- `-t`: Capitalize intermediate results


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
