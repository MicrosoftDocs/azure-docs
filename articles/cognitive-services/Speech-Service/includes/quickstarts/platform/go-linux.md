---
author: glecaros
ms.service: cognitive-services
ms.topic: include
ms.date: 03/30/2020
ms.author: gelecaro
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Linux

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## System requirements

Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9, RHEL 8, CentOS 8)

## Prerequisites

To complete this quickstart, you'll need:

* gcc
* go (1.13 or later)

* Supported Linux platforms will require certain libraries installed (`libssl` for secure sockets layer support and `libasound2` for sound support). Refer to your distribution below for the commands needed to install the correct versions of these libraries.

   * On Ubuntu:

     ```sh
     sudo apt-get update
     sudo apt-get install build-essential libssl1.0.0 libasound2 wget
     ```

   * On Debian 9:

     ```sh
     sudo apt-get update
     sudo apt-get install build-essential libssl1.0.2 libasound2 wget
     ```

   * On RHEL/CentOS 8:

     ```sh
     sudo yum update
     sudo yum groupinstall "Development tools"
     sudo yum install alsa-lib openssl wget
     ```

> [!NOTE]
> On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](~/articles/cognitive-services/speech-service/how-to-configure-openssl-linux.md).

[!INCLUDE [linux-install-sdk](linux-install-sdk.md)]


## Configure Go environment

1. Since the bindings rely on `cgo`, you need to set the environment variables so Go can find the SDK:

   ```sh
   export CGO_CFLAGS="-I$SPEECHSDK_ROOT/include/c_api"
   export CGO_LDFLAGS="-L$SPEECHSDK_ROOT/lib -lMicrosoft.CognitiveServices.Speech.core"
   ```

1. Additionally, to run applications including the SDK, we need to tell the OS
where to find the libs:

   ```sh
   export LD_LIBRARY_PATH="$SPEECHSDK_ROOT/lib/<arch>:$LD_LIBRARY_PATH"
   ```

## Next steps

[!INCLUDE [windows](../quickstart-list-go.md)]