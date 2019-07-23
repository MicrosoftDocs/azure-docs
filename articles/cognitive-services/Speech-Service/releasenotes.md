---
title: Release Notes - Speech Services
titlesuffix: Azure Cognitive Services
description: See a running log of feature releases, improvements, bug fixes, and known issues for Azure Speech Services.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/26/2019
ms.author: wolfma
ms.custom: seodec18
---

# Release notes

## Speech SDK 1.6.0: 2019-June release

**Samples**
*	Quick start samples for Text To Speech on UWP and Unity
*	Quick start sample for Swift on iOS
*	Unity samples for Speech & Intent Recognition and Translation
*	Updated quick start samples for DialogServiceConnector

**Improvements / Changes**
* Dialog namespace:
    * SpeechBotConnector has been renamed to DialogServiceConnector
    * BotConfig has been renamed to DialogServiceConfig
    * BotConfig::FromChannelSecret() has been remapped to DialogServiceConfig::FromBotSecret()
    * All existing Direct Line Speech clients continue to be supported after the rename
* Update TTS REST adapter to support proxy, persistent connection
* Improve error message when an invalid region is passed
* Swift/Objective-C:
    * Improved error reporting: Methods that can result in an error are now present in two versions: One that exposes an `NSError` object for error handling, and one that raises an exception. The former are exposed to Swift. This change requires adaptations to existing Swift code.
    * Improved event handling

**Bug fixes**
*	Fix for TTS: where SpeakTextAsync future returned without waiting until audio has completed rendering
*	Fix for marshalling strings in C# to enable full language support
*	Fix for .NET core app problem to load core library with net461 target framework in samples
*	Fix for occasional issues to deploy native libraries to the output folder in samples
*	Fix for web socket closing reliably
*	Fix for possible crash while opening a connection under very heavy load on Linux
*	Fix for missing metadata in the framework bundle for macOS
*	Fix for problems with `pip install --user` on Windows


## Speech SDK 1.5.1

This is a bug fix release and only affecting the native/managed SDK. It is not affecting the JavaScript version of the SDK.

**Bug fixes**

* Fix FromSubscription when used with Conversation Transcription.
* Fix bug in keyword spotting for voice-first virtual assistant.


## Speech SDK 1.5.0: 2019-May release

**New features**

* Wake word (Keyword spotting/KWS) functionality is now available for Windows and Linux. KWS functionality might work with any microphone type, official KWS support, however, is currently limited to the microphone arrays found in the Azure Kinect DK hardware or the Speech Devices SDK.
* Phrase hint functionality is available through the SDK. For more information, see [here](how-to-phrase-lists.md).
* Conversation transcription functionality is available through the SDK. See [here](conversation-transcription-service.md).
* Add support for voice-first virtual assistants using the Direct Line Speech channel.

**Samples**

* Added samples for new features or new services supported by the SDK.

**Improvements / Changes**

* Added various recognizer properties to adjust service behavior or service results (like masking profanity and others).
* You can now configure the recognizer through the standard configuration properties, even if you created the recognizer `FromEndpoint`.
* Objective-C: `OutputFormat` property was added to SPXSpeechConfiguration.
* The SDK now supports Debian 9 as a Linux distribution.

**Bug fixes**

* Fixed a problem where the speaker resource was destructed too early in text-to-speech.
## Speech SDK 1.4.2

This is a bug fix release and only affecting the native/managed SDK. It is not affecting the JavaScript version of the SDK.

## Speech SDK 1.4.1

This is a JavaScript-only release. No features have been added. The following fixes were made:

* Prevent web pack from loading https-proxy-agent.

## Speech SDK 1.4.0: 2019-April release

**New features** 

* The SDK now supports the text-to-speech service as a beta version. It is supported on Windows and Linux Desktop from C++ and C#. For more information, check the [text-to-speech overview](text-to-speech.md#get-started-with-text-to-speech).
* The SDK now supports MP3 and Opus/OGG audio files as stream input files. This feature is available only on Linux from C++ and C# and is currently in beta (more details [here](how-to-use-codec-compressed-audio-input-streams.md)).
* The Speech SDK for Java, .NET core, C++ and Objective-C have gained macOS support. The Objective-C support for macOS is currently in beta.
* iOS: The Speech SDK for iOS (Objective-C) is now also published as a CocoaPod.
* JavaScript: Support for non-default microphone as an input device.
* JavaScript: Proxy support for Node.js.

**Samples**

* Samples for using the Speech SDK with C++ and with Objective-C on macOS have been added.
* Samples demonstrating the usage of the text-to-speech service have been added.

**Improvements / Changes**

* Python: Additional properties of recognition results are now exposed via the `properties` property.
* For additional development and debug support, you can redirect SDK logging and diagnostics information into a log file (more details [here](how-to-use-logging.md)).
* JavaScript: Improve audio processing performance.

**Bug fixes**

* Mac/iOS: A bug that led to a long wait when a connection to the Speech Service could not be established was fixed.
* Python: improve error handling for arguments in Python callbacks.
* JavaScript: Fixed wrong state reporting for speech ended on RequestSession.

## Speech SDK 1.3.1: 2019-February refresh

This is a bug fix release and only affecting the native/managed SDK. It is not affecting the JavaScript version of the SDK.

**Bug fix**

* Fixed a memory leak when using microphone input. Stream based or file input is not affected.

## Speech SDK 1.3.0: 2019-February release

**New Features**

* The Speech SDK supports selection of the input microphone through the AudioConfig class. This allows you to stream audio data to the Speech Services from a non-default microphone. For more information, see the documentation describing [audio input device selection](how-to-select-audio-input-devices.md). This feature is not yet available from JavaScript.
* The Speech SDK now supports Unity in a beta version. Provide feedback through the issue section in the [GitHub sample repository](https://aka.ms/csspeech/samples). This release supports Unity on Windows x86 and x64 (desktop or Universal Windows Platform applications), and Android (ARM32/64, x86). More information is available in our [Unity quickstart](quickstart-csharp-unity.md).
* The file `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` (shipped in previous releases) isn't needed anymore. The functionality is now integrated into the core SDK.


**Samples**

The following new content is available in our [sample repository](https://aka.ms/csspeech/samples):

* Additional samples for AudioConfig.FromMicrophoneInput.
* Additional Python samples for intent recognition and translation.
* Additional samples for using the Connection object in iOS.
* Additional Java samples for translation with audio output.
* New sample for use of the [Batch Transcription REST API](batch-transcription.md).

**Improvements / Changes**

* Python
  * Improved parameter verification and error messages in SpeechConfig.
  * Add support for the Connection object.
  * Support for 32-bit Python (x86) on Windows.
  * The Speech SDK for Python is out of beta.
* iOS
  * The SDK is now built against the iOS SDK version 12.1.
  * The SDK now supports iOS versions 9.2 and later.
  * Improve reference documentation and fix several property names.
* JavaScript
  * Add support for the Connection object.
  * Add type definition files for bundled JavaScript
  * Initial support and implementation for phrase hints.
  * Return properties collection with service JSON for recognition
* Windows DLLs do now contain a version resource.
* If you create a recognizer `FromEndpoint` you can add parameters directly to the endpoint URL. Using `FromEndpoint` you can't configure the recognizer through the standard configuration properties.

**Bug fixes**

* Empty proxy username and proxy password were not handled correctly. With this release, if you set proxy username and proxy password to an empty string, they will not be submitted when connecting to the proxy.
* SessionId's created by the SDK were not always truly random for some languages&nbsp;/ environments. Added random generator initialization to fix this issue.
* Improve handling of authorization token. If you want to use an authorization token, specify in the SpeechConfig and leave the subscription key empty. Then create the recognizer as usual.
* In some cases the Connection object wasn't released correctly. This issue has been fixed.
* The JavaScript sample was fixed to support audio output for translation synthesis also on Safari.

## Speech SDK 1.2.1

This is a JavaScript-only release. No features have been added. The following fixes were made:

* Fire end of stream at turn.end, not at speech.end.
* Fix bug in audio pump that did not schedule next send if the current send failed.
* Fix continuous recognition with auth token.
* Bug fix for different recognizer / endpoints.
* Documentation improvements.

## Speech SDK 1.2.0: 2018-December release

**New Features**

* Python
  * The Beta version of Python support (3.5 and above) is available with this release. For more information, see here](quickstart-python.md).
* JavaScript
  * The Speech SDK for JavaScript has been open-sourced. The source code is available on [GitHub](https://github.com/Microsoft/cognitive-services-speech-sdk-js).
  * We now support Node.js, more info can be found [here](quickstart-js-node.md).
  * The length restriction for audio sessions has been removed, reconnection will happen automatically under the cover.
* Connection Object
  * From the Recognizer, you can access a Connection object. This object allows you to explicitly initiate the service connection and subscribe to connect and disconnect events.
    (This feature is not yet available from JavaScript and Python.)
* Support for Ubuntu 18.04.
* Android
  * Enabled ProGuard support during APK generation.

**Improvements**

* Improvements in the internal thread usage, reducing the number of threads, locks, mutexes.
* Improved error reporting / information. In several cases, error messages have not been propagated out all the way out.
* Updated development dependencies in JavaScript to use up-to-date modules.

**Bug fixes**

* Fixed memory leaks due to a type mismatch in RecognizeAsync.
* In some cases exceptions were being leaked.
* Fixing memory leak in translation event arguments.
* Fixed a locking issue on reconnect in long running sessions.
* Fixed an issue that could lead to missing final result for failed translations.
* C#: If an async operation wasn't awaited in the main thread, it was possible the recognizer could be disposed before the async task was completed.
* Java: Fixed a problem resulting in a crash of the Java VM.
* Objective-C: Fixed enum mapping; RecognizedIntent was returned instead of RecognizingIntent.
* JavaScript: Set default output format to 'simple' in SpeechConfig.
* JavaScript: Removing inconsistency between properties on the config object in JavaScript and other languages.

**Samples**

* Updated and fixed several samples (for example output voices for translation, etc.).
* Added Node.js samples in the [sample repository](https://aka.ms/csspeech/samples).

## Speech SDK 1.1.0

**New Features**

* Support for Android x86/x64.
* Proxy Support: In the SpeechConfig object, you can now call a function to set the proxy information (hostname, port, username, and password). This feature is not yet available on iOS.
* Improved error code and messages. If a recognition returned an error, this did already set `Reason` (in canceled event) or `CancellationDetails` (in recognition result) to `Error`. The canceled event now contains two additional members, `ErrorCode` and `ErrorDetails`. If the server returned additional error information with the reported error, it will now be available in the new members.

**Improvements**

* Added additional verification in the recognizer configuration, and added additional error message.
* Improved handling of long-time silence in middle of an audio file.
* NuGet package: for .NET Framework projects, it prevents building with AnyCPU configuration.

**Bug fixes**

* Fixed several exceptions found in recognizers. In addition, exceptions are caught and converted into Canceled event.
* Fix a memory leak in property management.
* Fixed bug in which an audio input file could crash the recognizer.
* Fixed a bug where events could be received after a session stop event.
* Fixed some race conditions in threading.
* Fixed an iOS compatibility issue that could result in a crash.
* Stability improvements for Android microphone support.
* Fixed a bug where a recognizer in JavaScript would ignore the recognition language.
* Fixed a bug preventing setting the EndpointId (in some cases) in JavaScript.
* Changed parameter order in AddIntent in JavaScript, and added missing AddIntent JavaScript signature.

**Samples**

* Added C++ and C# samplea for pull and push stream usage in the [sample repository](https://aka.ms/csspeech/samples).

## Speech SDK 1.0.1

Reliability improvements and bug fixes:

* Fixed potential fatal error due to race condition in disposing recognizer
* Fixed potential fatal error in case of unset properties.
* Added additional error and parameter checking.
* Objective-C: Fixed possible fatal error caused by name overriding in NSString.
* Objective-C: Adjusted visibility of API
* JavaScript: Fixed regarding events and their payloads.
* Documentation improvements.

In our [sample repository](https://aka.ms/csspeech/samples), a new sample for JavaScript was added.

## Cognitive Services Speech SDK 1.0.0: 2018-September release

**New features**

* Support for Objective-C on iOS. Check out our [Objective-C quickstart for iOS](quickstart-objectivec-ios.md).
* Support for JavaScript in browser. Check out our [JavaScript quickstart](quickstart-js-browser.md).

**Breaking changes**

* With this release, a number of breaking changes are introduced.
  Check [this page](https://aka.ms/csspeech/breakingchanges_1_0_0) for details.

## Cognitive Services Speech SDK 0.6.0: 2018-August release

**New features**

* UWP apps built with the Speech SDK now can pass the Windows App Certification Kit (WACK).
  Check out the [UWP quickstart](quickstart-csharp-uwp.md).
* Support for .NET Standard 2.0 on Linux (Ubuntu 16.04 x64).
* Experimental: Support Java 8 on Windows (64-bit) and Linux (Ubuntu 16.04 x64).
  Check out the [Java Runtime Environment quickstart](quickstart-java-jre.md).

**Functional change**

* Expose additional error detail information on connection errors.

**Breaking changes**

* On Java (Android), the `SpeechFactory.configureNativePlatformBindingWithDefaultCertificate` function no longer requires a path parameter. Now the path is automatically detected on all supported platforms.
* The get-accessor of the property `EndpointUrl` in Java and C# was removed.

**Bug fixes**

* In Java, the audio synthesis result on the translation recognizer is implemented now.
* Fixed a bug that could cause inactive threads and an increased number of open and unused sockets.
* Fixed a problem, where a long-running recognition could terminate in the middle of the transmission.
* Fixed a race condition in recognizer shutdown.

## Cognitive Services Speech SDK 0.5.0: 2018-July release

**New features**

* Support Android platform (API 23: Android 6.0 Marshmallow or higher). Check out the [Android quickstart](quickstart-java-android.md).
* Support .NET Standard 2.0 on Windows. Check out the [.NET Core quickstart](quickstart-csharp-dotnetcore-windows.md).
* Experimental: Support UWP on Windows (version 1709 or later).
  * Check out the [UWP quickstart](quickstart-csharp-uwp.md).
  * Note: UWP apps built with the Speech SDK do not yet pass the Windows App Certification Kit (WACK).
* Support long-running recognition with automatic reconnection.

**Functional changes**

* `StartContinuousRecognitionAsync()` supports long-running recognition.
* The recognition result contains more fields. They're offset from the audio beginning and duration (both in ticks) of the recognized text and additional values that represent recognition status, for example, `InitialSilenceTimeout` and `InitialBabbleTimeout`.
* Support AuthorizationToken for creating factory instances.

**Breaking changes**

* Recognition events: NoMatch event type was merged into the Error event.
* SpeechOutputFormat in C# was renamed to OutputFormat to stay aligned with C++.
* The return type of some methods of the `AudioInputStream` interface changed slightly:
   * In Java, the `read` method now returns `long` instead of `int`.
   * In C#, the `Read` method now returns `uint` instead of `int`.
   * In C++, the `Read` and `GetFormat` methods now return `size_t` instead of `int`.
* C++: Instances of audio input streams now can be passed only as a `shared_ptr`.

**Bug fixes**

* Fixed incorrect return values in the result when `RecognizeAsync()` times out.
* The dependency on media foundation libraries on Windows was removed. The SDK now uses Core Audio APIs.
* Documentation fix: Added a [regions](regions.md) page to describe the supported regions.

**Known issue**

* The Speech SDK for Android doesn't report speech synthesis results for translation. This issue will be fixed in the next release.

## Cognitive Services Speech SDK 0.4.0: 2018-June release

**Functional changes**

- AudioInputStream

  A recognizer now can consume a stream as the audio source. For more information, see the related [how-to guide](how-to-use-audio-input-streams.md).

- Detailed output format

  When you create a `SpeechRecognizer`, you can request `Detailed` or `Simple` output format. The `DetailedSpeechRecognitionResult` contains a confidence score, recognized text, raw lexical form, normalized form, and normalized form with masked profanity.

**Breaking change**

- Changed to `SpeechRecognitionResult.Text` from `SpeechRecognitionResult.RecognizedText` in C#.

**Bug fixes**

- Fixed a possible callback issue in the USP layer during shutdown.

- If a recognizer consumed an audio input file, it was holding on to the file handle longer than necessary.

- Removed several deadlocks between the message pump and the recognizer.

- Fire a `NoMatch` result when the response from service is timed out.

- The media foundation libraries on Windows are delay loaded. This library is required for microphone input only.

- The upload speed for audio data is limited to about twice the original audio speed.

- On Windows, C# .NET assemblies now are strong named.

- Documentation fix: `Region` is required information to create a recognizer.

More samples have been added and are constantly being updated. For the latest set of samples, see the [Speech SDK samples GitHub repository](https://aka.ms/csspeech/samples).

## Cognitive Services Speech SDK 0.2.12733: 2018-May release

This release is the first public preview release of the Cognitive Services Speech SDK.
