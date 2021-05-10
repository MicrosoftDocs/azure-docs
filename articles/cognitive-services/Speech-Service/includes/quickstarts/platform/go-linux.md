---
author: glecaros
ms.service: cognitive-services
ms.topic: include
ms.date: 10/15/2020
ms.author: gelecaro
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Linux

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## System requirements

Linux; see the list of [supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md).

## Prerequisites

To complete this quickstart, you'll need:

* [Go binary (1.13 or later)](https://golang.org/dl/)
* Linux environment set up as per [system requirements and setup instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#get-the-speech-sdk).


[!INCLUDE [linux-install-sdk](linux-install-sdk.md)]


## Configure Go environment

Perform the following steps to set up your Go environment to find the Speech SDK. In both steps, replace `<architecture>` with the processor architecture of your CPU. This will be `x86`, `x64`, `arm32`, or `arm64`.

1. Since the bindings rely on `cgo`, you need to set the environment variables so Go can find the SDK:

   ```sh
   export CGO_CFLAGS="-I$SPEECHSDK_ROOT/include/c_api"
   export CGO_LDFLAGS="-L$SPEECHSDK_ROOT/lib/<architecture> -lMicrosoft.CognitiveServices.Speech.core"
   ```

1. To run applications including the SDK, we need to tell the OS
where to find the libs:

   ```sh
   export LD_LIBRARY_PATH="$SPEECHSDK_ROOT/lib/<architecture>:$LD_LIBRARY_PATH"
   ```

## Next steps

[!INCLUDE [windows](../quickstart-list-go.md)]
