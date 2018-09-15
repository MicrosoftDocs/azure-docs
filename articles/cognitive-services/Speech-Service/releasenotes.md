---
title: Cognitive Services Speech SDK Documentation | Microsoft Docs
description: Release notes - what has changed in the most recent releases
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 09/24/2018
ms.author: wolfma
---

# Release notes

## Cognitive Services Speech SDK 1.0.0: 2018-September release

**New features**

* Support for Objective-C on iOS.
* Support for JavaScript in browser. Check out our [JavaScript quickstart](quickstart-js-browser.md).

**Breaking changes**

* With this release a number of breaking changes are introduced.
  Please check [this page](https://aka.ms/csspeech/breakingchanges_1_0_0) for details.

## Cognitive Services Speech SDK 0.6.0: 2018-August release

**New features**

* UWP apps built with the Speech SDK can now pass the Windows App Certification Kit (WACK).
  Check out our [UWP quickstart](quickstart-csharp-uwp.md).
* Support for .NET Standard 2.0 on Linux (Ubuntu 16.04 x64).
* Experimental: Support Java 8 on Windows (64-bit) and Linux (Ubuntu 16.04 x64).
  Check out the [Java Run-Time Environment quickstart](quickstart-java-jre.md)

**Functional changes**

* Exposing additional error detail information on connection errors.

**Breaking changes**

* On Java (Android), the `SpeechFactory.configureNativePlatformBindingWithDefaultCertificate` function no longer requires a path parameter. The path is now automatically detected on all supported platforms.
* The get-accessor of the property `EndpointUrl` in Java and C# was removed.

**Bug fixes**

* In Java, the audio synthesis result on the translation recognizer is now implemented.
* Fixed a bug, that could cause inactive threads and an increased number of open and unused sockets.
* Fixed a problem, where a long running recognition could terminate in the middle the transmission.
* Fixed a race condition in recognizer shutdown.

## Cognitive Services Speech SDK 0.5.0: 2018-July release

**New features**

* Support Android platform (API 23: Android 6.0 Marshmallow or higher).
  Check out the [Android quickstart](quickstart-java-android.md).
* Support .NET Standard 2.0 on Windows.
  Check out the [.NET Core quickstart](quickstart-csharp-dotnetcore-windows.md).
* Experimental: Support UWP on Windows (version 1709 or later)
  * Check out our [UWP quickstart](quickstart-csharp-uwp.md).
  * Note: UWP apps built with the Speech SDK do not yet pass the Windows App Certification Kit (WACK).
* Support long running recognition with automatic reconnection.

**Functional changes**

* `StartContinuousRecognitionAsync()` supports long running recognition
* The recognition result contains more fields: offset from the audio beginning and duration (both in ticks) of the recognized text, additional values representing recognition status, e.g., `InitialSilenceTimeout`, `InitialBabbleTimeout`.
* Support AuthorizationToken for creating factory instances.

**Breaking changes**

* Recognition events: NoMatch event type is merged into the Error event.
* SpeechOutputFormat in C# is renamed to OutputFormat to keep aligned with C++.
* The return type of some methods of the `AudioInputStream` interface slightly changed:
   * In Java, the `read` method now returns `long` instead of `int`.
   * In C#, the `Read` method now returns `uint` instead of `int`.
   * In C++, the `Read` and `GetFormat` methods now return `size_t` instead of `int`.
* C++: instances of audio input streams can now only be passed as a `shared_ptr`.

**Bug fixes**

* Fixed incorrect return values in result when `RecognizeAsync()` times out.
* The dependency on media foundation libraries on Windows is removed. The SDK is now using Core Audio APIs.
* Documentation fix: added a [regions](regions.md) page to describe what are the supported regions.

**Known issues**

* The Speech SDK for Android does not report speech synthesis results for translation.
  This will be fixed in the next release.

## Cognitive Services Speech SDK 0.4.0: 2018-June release

**Functional changes**

- AudioInputStream

  A recognizer can now consume a stream as the audio source. For detailed information, see the related [how-to guide](how-to-use-audio-input-streams.md).

- Detailed output format

  While creating a `SpeechRecognizer`, you can request `Detailed` or `Simple` output format. The `DetailedSpeechRecognitionResult` contains a confidence score, recognized text, raw lexical form, normalized form, and normalized form with masked profanity.

**Breaking change**

- Change to `SpeechRecognitionResult.Text` from `SpeechRecognitionResult.RecognizedText` in C#.

**Bug fixes**

- Fix a possible callback issue in USP layer during shutdown.

- If a recognizer consumed an audio input file, it was holding on to the file handle longer than necessary.

- Removed several deadlocks between message pump and recognizer.

- Fire a `NoMatch` result when the response from service is timed out.

- The media foundation libraries on Windows are delay-loaded. This library is only required for microphone input.

- The upload speed for audio data is limited to about twice the original audio speed.

- On Windows, C# .NET assemblies are now strong-named.

- Documentation fix: `Region` is required information to create a recognizer.

More samples have been added and are constantly being updated. For the latest set of samples, see the [Speech SDK Sample GitHub repository](https://aka.ms/csspeech/samples).

## Cognitive Services Speech SDK 0.2.12733: 2018-May release

The first public preview release of the Cognitive Services Speech SDK.
