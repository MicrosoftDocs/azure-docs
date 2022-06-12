---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/11/2022
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for C++. 

The Speech SDK for C++ is available as a NuGet package on Windows, Linux, and macOS. For more information, see <a href="https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech" target="_blank">Microsoft.CognitiveServices.Speech</a>. The Speech SDK for C++ is also available as a tar package from https://aka.ms/csspeech/linuxbinary.

## System requirements

Before you do anything, see the [platform requirements and instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#platform-requirements).

## Install the Speech SDK

The Speech SDK for C++ can be installed with the following `Install-Package` command:

```powershell
Install-Package Microsoft.CognitiveServices.Speech
```

Otherwise, you can follow a guide below for additional options.

**Choose your target environment**

# [Linux](#tab/linux)

[!INCLUDE [linux](cpp-linux.md)]

# [macOS](#tab/macos)

[!INCLUDE [macos](cpp-macos.md)]

# [Windows](#tab/windows)

[!INCLUDE [windows](cpp-windows.md)]

* * *