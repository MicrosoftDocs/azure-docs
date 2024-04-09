---
author: eric-urban
ms.service: azure-ai-speech
ms.custom: linux-related-content
ms.topic: include
ms.date: 02/02/2024
ms.author: eur
---

Use the following procedure to download and install the SDK. The steps include [downloading the required libraries and header files](https://aka.ms/csspeech/linuxbinary) as a *.tar* file.

1. Choose a directory for the Speech SDK files. Set the `SPEECHSDK_ROOT` environment variable to point to that directory. This variable makes it easy to refer to the directory in future commands.

   To use the directory *speechsdk* in your home directory, run the following command:

   ```console
   export SPEECHSDK_ROOT="$HOME/speechsdk"
   ```

1. Create the directory if it doesn't exist:

   ```console
   mkdir -p "$SPEECHSDK_ROOT"
   ```

1. Download and extract the *.tar.gz* archive that contains the Speech SDK binaries:

   ```console
   wget -O SpeechSDK-Linux.tar.gz https://aka.ms/csspeech/linuxbinary
   tar --strip 1 -xzf SpeechSDK-Linux.tar.gz -C "$SPEECHSDK_ROOT"
   ```

1. Validate the contents of the top-level directory of the extracted package:

   ```console
   ls -l "$SPEECHSDK_ROOT"
   ```

   The directory listing should contain the partner notices and license files. The listing should also contain an *include* directory that holds header (*.h*) files and a *lib* directory that holds libraries for arm32, arm64, x64, and x86.

    | Path | Description |
    |:-----|:----|
    | *license.md* | License |
    | *ThirdPartyNotices.md* | Partner notices |
    | *REDIST.txt* | Redistribution notice |
    | *include* | Required header files for C++ |
    | *lib/arm32* | Native library for ARM32 required to link your application |
    | *lib/arm64* | Native library for ARM64 required to link your application |
    | *lib/x64* | Native library for x64 required to link your application |
    | *lib/x86* | Native library for x86 required to link your application |
