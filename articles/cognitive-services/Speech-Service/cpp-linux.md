---
title: Speech SDK Quickstart for C++ and Linux | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Get information and code samples to help you quickly get started using the Speech SDK with Linux and C++ in Cognitive Services.
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 06/07/2018
ms.author: wolfma
---

# Quickstart for C++ and Linux

The current version of the Cognitive Services Speech SDK is `0.4.0`.

The Cognitive Services Speech SDK for Linux is available for building of 64-bit and 32-bit applications. The required files can be downloaded as a tar-file from https://aka.ms/csspeech/linuxbinary.

> [!NOTE]
> If you're looking for a Quickstart for C++ and Windows, go [here](cpp-windows.md).
> If you're looking for a Quickstart for C# and Windows, go [here](quickstart-csharp-windows.md).

[!include[Get a Subscription Key](includes/get-subscription-key.md)]

> [!NOTE]
> These instructions assume you're running on Ubuntu 16.04 on a PC (x86 or x64).
> On a different Ubuntu version, or a different Linux distribution, you will have to adapt
> the required steps.

## Prerequisites

[!include[Ubuntu Prerequisites](includes/ubuntu1604-prerequisites.md)]

## Getting the binary package

[!include[License Notice](includes/license-notice.md)]

1. Pick a directory (absolute path) where you would like to place the Speech SDK binaries and headers.
   For example, pick the path `speechsdk` under your home directory:

   ```sh
   export SPEECHSDK_ROOT="$HOME/speechsdk"
   ```

1. Create the directory if it doesn't exist yet:

   ```sh
   mkdir -p "$SPEECHSDK_ROOT"
   ```

1. Download and extract the `.tar.gz` archive with the Speech SDK binaries:

   ```sh
   wget -O SpeechSDK-Linux.tar.gz https://aka.ms/csspeech/linuxbinary
   tar --strip 1 -xzf SpeechSDK-Linux.tar.gz -C "$SPEECHSDK_ROOT"
   ```

1. Validate the contents of the top-level directory of the extracted package:

   ```sh
   ls -l "$SPEECHSDK_ROOT"
   ```

   It should show third-party notice and license files, as well as an `include`
   directory for headers and a `lib` directory for libraries.

   [!include[Linux Binary Archive Content](includes/linuxbinary-content.md)]

## Sample code

The following code recognizes English speech from your microphone.
Place it into a file named `quickstart-linux.cpp`:

[!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/Linux/quickstart-linux/quickstart-linux.cpp#code)]

Please replace the subscription key in the code with the one you obtained.

## Building

> [!NOTE]
> Make sure to copy and paste the build commands below as a _single line_.

* Run the following command to build the application on an x64 machine:

  ```sh
  g++ quickstart-linux.cpp -o quickstart-linux -I "$SPEECHSDK_ROOT/include/cxx_api" -I "$SPEECHSDK_ROOT/include/c_api" --std=c++14 -lpthread -lMicrosoft.CognitiveServices.Speech.core -L "$SPEECHSDK_ROOT/lib/x64" -l:libssl.so.1.0.0 -l:libcurl.so.4 -l:libasound.so.2
  ```

* Run the following command to build the application on an x86 machine:

  ```sh
  g++ quickstart-linux.cpp -o quickstart-linux -I "$SPEECHSDK_ROOT/include/cxx_api" -I "$SPEECHSDK_ROOT/include/c_api" --std=c++14 -lpthread -lMicrosoft.CognitiveServices.Speech.core -L "$SPEECHSDK_ROOT/lib/x86" -l:libssl.so.1.0.0 -l:libcurl.so.4 -l:libasound.so.2
  ```

## Running

To run the application, you'll need to configure the loader's library path to point to the Speech SDK library.

* On an x64 machine, please run:

  ```sh
  export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SPEECHSDK_ROOT/lib/x64"
  ```

* On an x86 machine, please run:

  ```sh
  export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SPEECHSDK_ROOT/lib/x86"
  ```

Run the application as follows:

```sh
./quickstart-linux
```

If all goes well, you should see output similar to the following:

```text
Say something...
We recognized: What's the weather
```

## Downloading the sample

For the latest set of samples, see the [Cognitive Services Speech SDK Sample GitHub repository](https://aka.ms/csspeech/samples).

## Next steps

* Visit the [samples page](samples.md) for additional samples.
