---
title: 'Quickstart: Recognize speech, C++ (Linux) - Speech Services'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in C++ on Linux by using the Speech SDK
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: wolfma
---

# Quickstart: Recognize speech in C++ on Linux by using the Speech SDK

Quickstarts are also available for [text-to-speech](quickstart-text-to-speech-cpp-linux.md).

If desired, switch to a different programming language and/or environment:<br/>
[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a C++ console application for Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9). You use the Cognitive Services [Speech SDK](speech-sdk.md) to transcribe speech to text in real time from your PC's microphone. The application is built with the [Speech SDK for Linux](https://aka.ms/csspeech/linuxbinary) and your Linux distribution's C++ compiler (for example, `g++`).

## Prerequisites

You need a Speech Services subscription key to complete this Quickstart. You can get one for free. See [Try the Speech Services for free](get-started.md) for details.

## Install Speech SDK

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

The current version of the Cognitive Services Speech SDK is `1.6.0`.

The Speech SDK for Linux can be used to build both 64-bit and 32-bit applications. The required libraries and header files can be downloaded as a tar file from https://aka.ms/csspeech/linuxbinary.

Download and install the SDK as follows:

1. Make sure the SDK's dependencies are installed.

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

   [!INCLUDE [Linux Binary Archive Content](../../../includes/cognitive-services-speech-service-linuxbinary-content.md)]

## Add sample code

1. Create a C++ source file named `helloworld.cpp`, and paste the following code into it.

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp-linux/helloworld.cpp#code)]

1. In this new file, replace the string `YourSubscriptionKey` with your Speech Services subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

## Build the app

> [!NOTE]
> Make sure to enter the commands below as a _single command line_. The easiest way to do that is to copy the command by using the **Copy** button next to each command, and then paste it at your shell prompt.

* On an **x64**  (64-bit) system, run the following command to build the application.

  ```sh
  g++ helloworld.cpp -o helloworld -I "$SPEECHSDK_ROOT/include/cxx_api" -I "$SPEECHSDK_ROOT/include/c_api" --std=c++14 -lpthread -lMicrosoft.CognitiveServices.Speech.core -L "$SPEECHSDK_ROOT/lib/x64" -l:libasound.so.2
  ```

* On an **x86** (32-bit) system, run the following command to build the application.

  ```sh
  g++ helloworld.cpp -o helloworld -I "$SPEECHSDK_ROOT/include/cxx_api" -I "$SPEECHSDK_ROOT/include/c_api" --std=c++14 -lpthread -lMicrosoft.CognitiveServices.Speech.core -L "$SPEECHSDK_ROOT/lib/x86" -l:libasound.so.2
  ```

## Run the app

1. Configure the loader's library path to point to the Speech SDK library.

   * On an **x64** (64-bit) system, enter the following command.

     ```sh
     export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SPEECHSDK_ROOT/lib/x64"
     ```

   * On an **x86** (32-bit) system, enter this command.

     ```sh
     export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SPEECHSDK_ROOT/lib/x86"
     ```

1. Run the application.

   ```sh
   ./helloworld
   ```

1. In the console window, a prompt appears, requesting that you say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech Services and transcribed to text, which appears in the same window.

   ```text
   Say something...
   We recognized: What's the weather like?
   ```

## Next steps

> [!div class="nextstepaction"]
> [Explore C++ samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
