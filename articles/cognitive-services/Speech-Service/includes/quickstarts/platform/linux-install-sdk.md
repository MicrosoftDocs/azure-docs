---
author: glecaros
ms.service: cognitive-services
ms.topic: include
ms.date: 03/30/2020
ms.author: gelecaro
---

## Install Speech SDK

The Speech SDK for Linux can be used to build both 64-bit and 32-bit applications. The required libraries and header files can be downloaded as a tar file from https://aka.ms/csspeech/linuxbinary.

Download and install the SDK as follows:

1. Choose a directory to which the Speech SDK files should be extracted, and set the `SPEECHSDK_ROOT` environment variable to point to that directory. This variable makes it easy to refer to the directory in future commands. For example, if you want to use the directory `speechsdk` in your home directory, use a command like the following:

   ```sh
   export SPEECHSDK_ROOT="$HOME/speechsdk"
   ```

1. Create the directory if it doesn't exist yet.

   ```sh
   mkdir -p "$SPEECHSDK_ROOT"
   ```

1. Download and extract the `.tar.gz` archive containing the Speech SDK binaries:

   ```sh
   wget -O SpeechSDK-Linux.tar.gz https://aka.ms/csspeech/linuxbinary
   tar --strip 1 -xzf SpeechSDK-Linux.tar.gz -C "$SPEECHSDK_ROOT"
   ```

1. Validate the contents of the top-level directory of the extracted package:

   ```sh
   ls -l "$SPEECHSDK_ROOT"
   ```

   The directory listing should contain the third-party notice and license files, as well as an `include` directory containing header (`.h`) files and a `lib` directory containing libraries.

   [!INCLUDE [Linux Binary Archive Content](~/includes/cognitive-services-speech-service-linuxbinary-content.md)]