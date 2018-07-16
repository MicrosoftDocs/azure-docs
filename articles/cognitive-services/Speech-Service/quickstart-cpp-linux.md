---
title: 'Quickstart: Recognize speech in C++ on Linux using the Cognitive Services Speech SDK | Microsoft Docs'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in C++ on Linux using the Cognitive Services Speech SDK
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 07/16/2018
ms.author: wolfma
---

# Quickstart: Recognize speech in C++ on Linux using the Speech SDK

In this article, you learn how to create a C++ console application on Linux (Ubuntu 16.04) using the Cognitive Services Speech SDK to transcribe speech to text.

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* An Ubuntu 16.04 PC with a working microphone.
* To install packages needed to build and run this sample run the following:

  ```sh
  sudo apt-get update
  sudo apt-get install build-essential libssl1.0.0 libcurl3 libasound2 wget
  ```

## Get the Speech SDK

[!include[License Notice](includes/license-notice.md)]

The current version of the Cognitive Services Speech SDK is `0.5.0`.

The Cognitive Services Speech SDK for Linux is available for building of 64-bit and 32-bit applications.
The required files can be downloaded as a tar-file from https://aka.ms/csspeech/linuxbinary.
Download and install the SDK as follows:

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

## Add the sample code

1. Add the following code into a file named `helloworld.cpp`:

  [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp-linux/helloworld.cpp#code)]

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

## Building

> [!NOTE]
> Make sure to copy and paste the build commands below as a _single line_.

* On an **x64** machine, run the following command to build the application:

  ```sh
  g++ helloworld.cpp -o helloworld -I "$SPEECHSDK_ROOT/include/cxx_api" -I "$SPEECHSDK_ROOT/include/c_api" --std=c++14 -lpthread -lMicrosoft.CognitiveServices.Speech.core -L "$SPEECHSDK_ROOT/lib/x64" -l:libssl.so.1.0.0 -l:libcurl.so.4 -l:libasound.so.2
  ```

* On an **x86** machine, run the following command to build the application:

  ```sh
  g++ helloworld.cpp -o helloworld -I "$SPEECHSDK_ROOT/include/cxx_api" -I "$SPEECHSDK_ROOT/include/c_api" --std=c++14 -lpthread -lMicrosoft.CognitiveServices.Speech.core -L "$SPEECHSDK_ROOT/lib/x86" -l:libssl.so.1.0.0 -l:libcurl.so.4 -l:libasound.so.2
  ```

## Run the sample

1. Configure the configure the loader's library path to point to the Speech SDK library.

   * On an **x64** machine, run:

     ```sh
     export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SPEECHSDK_ROOT/lib/x64"
     ```

   * On an **x86** machine, run:

     ```sh
     export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SPEECHSDK_ROOT/lib/x86"
     ```

1. Run the application as follows:

   ```sh
   ./helloworld
   ```

1. You should see output similar to this:

   ```text
   Say something...
   We recognized: What's the weather
   ```

[!include[Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/cpp-linux` folder.

## Next steps

* Visit the [samples page](samples.md) for additional samples.
