---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 07/31/2023
ms.author: eur
---

### Speech SDK 1.31.0: August 2023 release

#### New Features

* Support for [real-time diarization](../../get-started-stt-diarization.md) is available in public preview with the Speech SDK 1.31.0. This feature is available in the following SDKs: C#, C++, Java, JavaScript, and Python. 

* Synchronized speech synthesis word boundary and viseme events with audio playback

#### Breaking changes

* The former "conversation transcription" scenario is renamed to "meeting transcription". For example, use `MeetingTranscriber` instead of `ConversationTranscriber`, and use `CreateMeetingAsync` instead of `CreateConversationAsync`. Although the names of SDK objects and methods have changed, there are no changes to the feature itself. Use meeting transcription objects for transcription of meetings with user profiles and voice signatures. See [Meeting transcription](../../meeting-transcription.md) for more information. The "conversation translation" objects and methods are not affected by these changes. You can still use the `ConversationTranslator` object and its methods for meeting translation scenarios.

- For real-time diarization, a new `ConversationTranscriber` object is introduced. The new "conversation transcription" object model and call patterns are similar to continuous recognition with the `SpeechRecognizer` object. A key difference is that the `ConversationTranscriber` object is designed to be used in a conversation scenario where you want to differentiate multiple speakers (diarization). User profiles and voice signatures aren't applicable. See the [real-time diarization quickstart](../../get-started-stt-diarization.md) for more information.

<br>
This table shows the previous and new object names for real-time diarization and meeting transcription. The scenario name is in the first column, the previous object names are in the second column, and the new object names are in the third column. 

| Scenario name | Previous object names | New object names |
| ------------- | -------------------- | --------------- |
| Real-time diarization | N/A | `ConversationTranscriber` |
| Meeting transcription | `ConversationTranscriber`<br/>`ConversationTranscriptionEventArgs`<br/>`ConversationTranscriptionCanceledEventArgs`<br/>`ConversationTranscriptionResult`<br/>`RemoteConversationTranscriptionResult`<br/>`RemoteConversationTranscriptionClient`<br/>`RemoteConversationTranscriptionResult`<br/>`Participant`<sup>1</sup><br/>`ParticipantChangedReason`<sup>1</sup><br/>`User`<sup>1</sup> | `MeetingTranscriber`<br/>`MeetingTranscriptionEventArgs`<br/>`MeetingTranscriptionCanceledEventArgs`<br/>`MeetingTranscriptionResult`<br/>`RemoteMeetingTranscriptionResult`<br/>`RemoteMeetingTranscriptionClient`<br/>`RemoteMeetingTranscriptionResult`<br/>`Participant`<br/>`ParticipantChangedReason`<br/>`User`<br/>`Meeting`<sup>2</sup> |

<sup>1</sup> The `Participant`, `ParticipantChangedReason`, and `User` objects are applicable to both meeting transcription and meeting translation scenarios.

<sup>2</sup> The `Meeting` object is new and is used with the `MeetingTranscriber` object.

#### Bug fixes

* Fixed macOS minimum supported version https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/2017

#### Samples

* **CSharp**

    * [New C# meeting transcription quickstart](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/csharp/dotnet/meeting-transcription/README.md)

* **JavaScript**

    * [New JavaScript conversation transcription quickstart](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/browser/conversation-transcription/README.md)

    * [New JavaScript meeting transcription quickstart](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/browser/meeting-transcription/README.md)

    * [New NodeJS conversation transcription quickstart](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/node/conversation-transcription/README.md)

    * [New NodeJS meeting transcription quickstart](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/node/meeting-transcription/README.md)

### Speech SDK 1.30.0: July 2023 release

#### New Features

* **C++, C#, Java** - Added support for `DisplayWords` in Embedded Speech Recognition's detailed result.
* **Objective-C/Swift** - Added support for `ConnectionMessageReceived` event in Objective-C/Swift.
* **Objective-C/Swift** - Improved keyword-spotting models for iOS. This change has increased the size of the certain packages, which contain iOS binaries (like NuGet, XCFramework). We're working on to reduce the size for future releases.

#### Bug fixes

* Fixed a memory leak when using speech recognizer with PhraseListGrammar, as reported by a customer ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1978)).
* Fixed a deadlock in Text-to-Speech (TTS) open connection API.

#### Additional notes

* **Java** - Some internally used, `public` Java API methods were changed to package `internal`, `protected` or `private`. This change shouldn't have an effect on developers, as we don't expect applications to be using those. Noted here for transparency.

#### Samples

* New Pronunciation Assessment samples on how to specify a learning language in your own application
  - **C#**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#LL1086C13-L1086C98).
  - **C++**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#L624).
  - **JavaScript**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/node/pronunciationAssessmentContinue.js#LL37C4-L37C52).
  - **Objective-C**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m#L862).
  - **Python**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py#LL937C1-L937C1).
  - **Swift**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/swift/ios/speech-samples/speech-samples/ViewController.swift#L224). 

### Speech SDK 1.29.0: June 2023 release

#### New Features

* **C++, C#, Java** - Preview of Embedded Speech Translation APIs. Now you can do speech translation without cloud connection!
* **JavaScript** - Continuous Language Identification (LID) now enabled for speech translation.
* **JavaScript** - Community contribution for adding `LocaleName` property to `VoiceInfo` class. Thank you GitHub user [shivsarthak](https://github.com/shivsarthak) for the pull request. 
* **C++, C#, Java** - Added support for resampling Embedded Text-to-Speech (TTS) output from 16 kHz to 48 kHz sample rate.
* Added support for `hi-IN` locale in Intent Recognizer with Simple Pattern Matching.

#### Bug fixes

* Fixed a crash caused by a race condition in Speech Recognizer during object destruction, as seen in some of our Android tests
* Fixed possible deadlocks in Intent Recognizer with Simple Pattern Matcher

#### Samples

* New Embedded Speech Translation samples


### Speech SDK 1.28.0: May 2023 release

#### Breaking change

* **JavaScript SDK**: Online Certificate Status Protocol (OCSP) was removed. This allows clients to better conform to browser and Node standards for certificate handling. Version 1.28 and onward will no longer include our custom OCSP module.

#### New Features

* **Embedded Speech Recognition** now returns `NoMatchReason::EndSilenceTimeout` when a silence timeout occurs at the end of an utterance. This matches the behavior when doing recognition using the real-time speech service.
* **JavaScript SDK**: Set properties on `SpeechTranslationConfig` using `PropertyId` enum values.

#### Bug fixes

* **C# on Windows** - Fix potential race condition/deadlock in Windows audio extension. In scenarios that both dispose of the audio renderer quickly and also use the Synthesizer method to stop speaking, the underlying event was not reset by stop, and could cause the renderer object to never be disposed, all while it could be holding a global lock for disposal, freezing the dotnet GC thread.

#### Samples

* Added an embedded speech sample for MAUI.
* Updated the embedded speech sample for Android Java to include Text to speech.

### Speech SDK 1.27.0: April 2023 release

#### Notification about upcoming changes

* We plan to remove Online Certificate Status Protocol (OCSP) in the next JavaScript SDK release. This allows clients to better conform to browser and Node standards for certificate handling. Version 1.27 is the last release that includes our custom OCSP module.

#### New Features

* **JavaScript** – Added support for microphone input from the browser with Speaker Identification and Verification.
* **Embedded Speech Recognition** - Update support for `PropertyId::Speech_SegmentationSilenceTimeoutMs` setting.

#### Bug fixes

* **General** - Reliability updates in service reconnection logic (all programming languages except JavaScript).
* **General** - Fix string conversions leaking memory on Windows (all relevant programming languages except JavaScript).
* **Embedded Speech Recognition** - Fix crash in French Speech Recognition when using certain grammar list entries.
* **Source code documentation** - Corrections to SDK reference documentation comments related to audio logging on the service.
* **Intent recognition** - Fix Pattern Matcher priorities related to list entities.

#### Samples

* Properly handle authentication failure in C# Conversation Transcription (CTS) sample.
* Added example of streaming pronunciation assessment for Python, JavaScript, Objective-C and Swift.


### Speech SDK 1.26.0: March 2023 release

#### Breaking changes

* Bitcode has been disabled in all iOS targets in the following packages: Cocoapod with xcframework, NuGet (for Xamarin and MAUI) and Unity. The change is due to Apple's deprecation of bitcode support from Xcode 14 and onwards. This change also means if you're using Xcode 13 version or you have explicitly enabled the bitcode on your application using the Speech SDK, you may encounter an error saying "framework doesn't contain bitcode and you must rebuild it". To resolve this issue, make sure your targets have bitcode disabled.
* Minimum iOS deployment target has been upgraded to 11.0 in this release, which means armv7 HW is no longer supported.

#### New features

* Embedded (on-device) Speech Recognition now supports both 8 and 16-kHz sampling rate input audio (16-bit per sample, mono PCM).
* Speech Synthesis now reports connection, network and service latencies in the result to help end-to-end latency optimization.
* New tie breaking rules for [Intent Recognition with simple pattern matching](../../how-to-use-simple-language-pattern-matching.md). The more character bytes that are matched, will win over pattern matches with lower character byte count. Example: Pattern "Select {something} in the top right" will win over "Select {something}"

#### Bug fixes

* Speech Synthesis: fix a bug where the emoji isn't correct in word boundary events.
* [Intent Recognition with with Conversational Language Understanding (CLU)](../../get-started-intent-recognition-clu.md):
  * Intents from the CLU Orchestrator Workflow now appear correctly.
  * The JSON result is now available via the property ID `LanguageUnderstandingServiceResponse_JsonResult`.
* Speech recognition with keyword activation: Fix for missing ~150 ms audio after a keyword recognition.
* Fix for Speech SDK NuGet iOS MAUI Release build, reported by customer ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1835))

#### Samples

* Fix for Swift iOS sample, reported by customer ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1759))


### Speech SDK 1.25.0: January 2023 release

#### Breaking changes

- Language Identification (preview) APIs have been simplified. If you update to Speech SDK 1.25 and see a build break, please visit the [Language Identification](~/articles/ai-services/speech-service/language-identification.md) page to learn about the new property `SpeechServiceConnection_LanguageIdMode`. This single property replaces the two previous ones `SpeechServiceConnection_SingleLanguageIdPriority` and `SpeechServiceConnection_ContinuousLanguageIdPriority`. Prioritizing between low latency and high accuracy is no longer necessary following recent model improvements. Now, you only need to select whether to run at-start or continuous Language Identification when doing continuous speech recognition or translation.

#### New features

- **C#/C++/Java**: Embedded Speech SDK is now released under gated public preview. See [Embedded Speech (preview)](~/articles/ai-services/speech-service/embedded-speech.md) documentation. You can now do on-device speech to text and text to speech when cloud connectivity is intermittent or unavailable. Supported on Android, Linux, macOS and Windows platforms
- **C# MAUI**: Support added for iOS and Mac Catalyst targets in Speech SDK NuGet ([Customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1649))
- **Unity**: Android x86_64 architecture added to Unity package ([Customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1715))
- **Go**:
  - ALAW/MULAW direct streaming support added for speech recognition ([Customer issue](https://github.com/microsoft/cognitive-services-speech-sdk-go/issues/81))
  - Added support for PhraseListGrammar. Thank you GitHub user [czkoko](https://github.com/czkoko) for the community contribution!
- **C#/C++**: Intent Recognizer now supports Conversational Language Understanding models in C++ and C# with orchestration on the Microsoft service

#### Bug fixes

- Fix an occasional hang in **KeywordRecognizer** when trying to stop it
- **Python**:
  - Fix for getting Pronunciation Assessment results when `PronunciationAssessmentGranularity.FullText` is set ([Customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1763))
  - Fix for gender property for Male voices not being retrieved, when getting speech synthesis voices
- **JavaScript**
  - Fix for parsing some WAV files that were recorded on iOS devices ([Customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1774))
  - JS SDK now builds without using npm-force-resolutions ([Customer issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/549))
  - Conversation Translator now correctly sets service endpoint when using a speechConfig instance created using SpeechConfig.fromEndpoint()

#### Samples

- Added samples showing how to use Embedded Speech
- Added Speech to text sample for MAUI

  See [Speech SDK samples repository](https://github.com/Azure-Samples/cognitive-services-speech-sdk).

### Speech SDK 1.24.2: November 2022 release

#### New features
- No new features, just an embedded engine fix to support new model files.

#### Bug fixes

- **All programing languages**
    - Fixed an issue with encryption of embedded speech recognition models.

### Speech SDK 1.24.1: November 2022 release

#### New features
- Published packages for the Embedded Speech preview. See https://aka.ms/embedded-speech for more information.

#### Bug fixes

- **All programing languages**
    - Fix embedded TTS crash when voice font isn't supported
    - Fix stopSpeaking() can't stop playback on Linux ([#1686](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1686))
- **JavaScript SDK**
    - Fixed regression in how conversation transcriber gated audio.
- **Java**
    - Temporarily Published updated POM and Javadocs files to Maven Central to enable the docs pipeline to update online reference docs.
- **Python**
    - Fix regression where Python speak_text(ssml) returns void.


### Speech SDK 1.24.0: October 2022 release

#### New features

- **All programing languages**: AMR-WB (16khz) added to the supported list of Text to speech audio output formats
- **Python**: Package added for Linux ARM64 for supported Linux distributions.
- **C#/C++/Java/Python**: Support added for ALAW & MULAW direct streaming to the speech service (in addition to existing PCM stream) using `AudioStreamWaveFormat`.
- **C# MAUI**: NuGet package updated to support Android targets for [.NET MAUI](/dotnet/maui/what-is-maui) developers ([Customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1649))
- **Mac**: Added separate XCframework for Mac, which doesn't contain any iOS binaries. This offers an option for developers who need only Mac binaries using a smaller XCframework package.
- **Microsoft Audio Stack** (MAS):
  - When beam-forming angles are specified, sound originating outside of specified range will be suppressed better.
  - Approximately 70% reduction in the size of `libMicrosoft.CognitiveServices.Speech.extension.mas.so` for Linux ARM32 and Linux ARM64.
- **Intent Recognition using pattern matching**:
  - Add orthography support for the languages `fr`, `de`, `es`, `jp`
  - Added prebuilt integer support for language `es`.

#### Bug fixes

- **iOS**: fix speech synthesis error on iOS 16 caused by compressed audio decoding failure ([Customer Issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1613)).
- **JavaScript**:
  - Fix authentication token not working when getting speech synthesis voice list ([Customer issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/551)).
  - Use data URL for worker loading ([Customer issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/563)).
  - Create audio processor worklet only when AudioWorklet is supported in browser ([Customer issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/572)). This was a community contribution by [William Wong](https://github.com/compulim). Thank you William!
  - Fix recognized callback when LUIS response `connectionMessage` is empty ([Customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1644)).
  - Properly set speech segmentation timeout.
- **Intent Recognition using pattern matching**:
  - Non-json characters inside models will now load properly.
  - Fix hanging issue when `recognizeOnceAsync(text)` was called during continuous recognition.

### Speech SDK 1.23.0: July 2022 release

#### New features

- **C#, C++, Java**: Added support for languages `zh-cn` and `zh-hk` in Intent Recognition with Pattern Matching.
- **C#**: Added support for `AnyCPU` .NET Framework builds

#### Bug fixes

- **Android**: Fixed OpenSSL vulnerability CVE-2022-2068 by updating OpenSSL to 1.1.1q
- **Python**: Fix crash when using PushAudioInputStream
- **iOS**: Fix "EXC_BAD_ACCESS: Attempted to dereference null pointer" as reported on iOS ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1555))


### Speech SDK 1.22.0: June 2022 release

#### New features

- **Java**: IntentRecognitionResult API for getEntities(), applyLanguageModels(), and recognizeOnceAsync(text) added to support the "simple pattern matching" engine.
- **Unity**: Added support for Mac M1 (Apple Silicon) for Unity package ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1465))
- **C#**: Added support for x86_64 for Xamarin Android ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1457))
- **C#**: .NET framework minimum version updated to v4.6.2 for SDK C# package as v4.6.1 has retired (see [Microsoft .NET Framework Component Lifecycle Policy](/lifecycle/products/microsoft-net-framework))
- **Linux**: Added support for Debian 11 and Ubuntu 22.04 LTS. Ubuntu 22.04 LTS requires manual installation of libssl1.1 either as a binary package from [here](http://security.ubuntu.com/ubuntu/pool/main/o/openssl) (for example, libssl1.1_1.1.1l-1ubuntu1.3_amd64.deb or newer for x64), or by compiling from sources.

#### Bug fixes

- **UWP**: OpenSSL dependency removed from UWP libraries and replaced with WinRT websocket and HTTP APIs to meet security compliance and smaller binary footprint.
- **Mac**: Fixed "MicrosoftCognitiveServicesSpeech Module Not Found" issue when using Swift projects targeting macOS platform
- **Windows, Mac**: Fixed a platform-specific issue where audio sources that were configured via properties to stream at a real-time rate sometimes fell behind and eventually exceeded capacity

#### Samples ([GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk))

- **C#**: .NET framework samples updated to use v4.6.2
- **Unity**: Virtual-assistant sample fixed for Android and UWP
- **Unity**: Unity samples updated for Unity 2020 LTS version


### Speech SDK 1.21.0: April 2022 release

#### New features
- **Java & JavaScript**: Added support for Continuous Language Identification when using the SpeechRecognizer object
- **JavaScript**: Added Diagnostics APIs to enable console logging level and (Node only) file logging, to help Microsoft troubleshoot customer-reported issues
- **Python**: Added support for Conversation Transcription
- **Go**: Added support for Speaker Recognition
- **C++ & C#**: Added support for a required group of words in the Intent Recognizer (simple pattern matching). For example: "(set|start|begin) a timer" where either "set", "start" or "begin" must be present for the intent to be recognized.
- **All programming languages, Speech Synthesis**: Added duration property in word boundary events. Added support for punctuation boundary and sentence boundary
- **Objective-C/Swift/Java**: Added word-level results on the Pronunciation Assessment result object (similar to  C#). The application no longer needs to parse a JSON result string to get word-level information ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1380))
- **iOS platform**: Added experimental support for ARMv7 architecture

#### Bug fixes
- **iOS platform**: Fix to allow building for the target "Any iOS Device", when using CocoaPod ([GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1320))
- **Android platform**: OpenSSL version has been updated to 1.1.1n to fix security vulnerability [CVE-2022-0778](https://nvd.nist.gov/vuln/detail/CVE-2022-0778)
- **JavaScript**: Fix issue where wav header wasn't updated with file size ([GitHub issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/513))
- **JavaScript**: Fix request ID desync issue breaking translation scenarios ([GitHub issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/511))
- **JavaScript**: Fix issue when instantiating SpeakerAudioDestination with no stream ([GitHub issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/476)]
- **C++**: Fix C++ headers to remove a warning when compiling for C++17 or newer

#### Samples [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- New **Java** samples for Speech Recognition with Language Identification
- New **Python** and **Java** samples for Conversation Transcription
- New **Go** sample for Speaker Recognition
- New **C++ and C#** tool for Windows that enumerates all audio capture and render devices, for finding their Device ID. This ID is needed by the Speech SDK if you plan to [capture audio from, or render audio to, a non-default device](../../how-to-select-audio-input-devices.md).


### Speech SDK 1.20.0: January 2022 release


#### New features

- **Objective-C, Swift, and Python**: Added support for DialogServiceConnector, used for [Voice-Assistant scenarios](../../voice-assistants.md).
- **Python**: Support for Python 3.10 was added. Support for Python 3.6 was removed, per Python's [end-of-life for 3.6](https://devguide.python.org/devcycle/#end-of-life-branches).
- **Unity**: Speech SDK is now supported for Unity applications on Linux.
- **C++, C#**: IntentRecognizer using pattern matching is now supported in C#. In addition, scenarios with custom entities, optional groups, and entity roles are now supported in C++ and C#.
- **C++, C#**: Improved diagnostics trace logging using new classes FileLogger, MemoryLogger, and EventLogger. SDK logs are an important tool for Microsoft to diagnose customer-reported issues. These new classes make it easier for customers to integrate Speech SDK logs into their own logging system.
- **All programming languages**: PronunciationAssessmentConfig now has properties to set the desired phoneme alphabet (IPA or SAPI) and N-Best Phoneme Count (avoiding the need to author a configuration JSON as per [GitHub issue 1284](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1284)). Also, syllable level output is now supported.
- **Android, iOS and macOS (all programming languages)**: GStreamer is no longer needed to support limited-bandwidth networks. SpeechSynthesizer now uses the operating system's audio decoding capabilities to decode compressed audio streamed from the text to speech service.
- **All programming languages**: SpeechSynthesizer now supports three new raw output Opus formats (without container), which are widely used in live streaming scenarios.
- **JavaScript**: Added getVoicesAsync() API to SpeechSynthesizer to retrieve the list of supported synthesis voices ([GitHub issue 1350](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1350))
- **JavaScript**: Added getWaveFormat() API to AudioStreamFormat to support non-PCM wave formats ([GitHub issue 452](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/452))
- **JavaScript**: Added volume getter/setter and mute()/unmute() APIs to SpeakerAudioDestination ([GitHub issue 463](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/463))

#### Bug fixes
- **C++, C#, Java, JavaScript, Objective-C, and Swift**: Fix to remove a 10-second delay while stopping a speech recognizer that uses a PushAudioInputStream. This is for the case where no new audio is pushed in after StopContinuousRecognition is called (GitHub issues [1318](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1388), [331](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/331))
- **Unity on Android and UWP**: Unity meta files were fixed for UWP, Android ARM64, and Windows Subsystem for Android (WSA) ARM64 ([GitHub issue 1360](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1360))
- **iOS**: Compiling your Speech SDK application on any iOS Device when using CocoaPods is now fixed ([GitHub issue 1320](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1320))
- **iOS**: When SpeechSynthesizer is configured to output audio directly to a speaker, playback stopped at the beginning in rare conditions. This was fixed.
- **JavaScript**: Use script processor fallback for microphone input if no audio worklet is found ([GitHub issue 455](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/455))
- **JavaScript**: Add protocol to agent to mitigate bug found with Sentry integration ([GitHub issue 465](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/465))

#### Samples [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

- **[C++](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#L65), [C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#L70), [Python](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py#L96)**, and **[Java](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechRecognitionSamples.java#L77)** samples showing how to get detailed recognition results. The details include alternative recognition results, confidence score, Lexical form, Normalized form, Masked Normalized form, with word-level timing for each.
- **[iOS sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/swift/ios/from-external-microphone)** added using AVFoundation as external audio source.
- **[Java sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechSynthesisSamples.java#L705)** added to show how to get SRT (SubRip Text) format using WordBoundary event.
- **[Android samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/android/sdkdemo)** for Pronunciation Assessment.
- **[C++](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/diagnostics_logging_samples.cpp), [C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_diagnostics_logging_samples.cs)** showing usage of the new Diagnostics Logging classes.


### Speech SDK 1.19.0: 2021-Nov release 

#### Highlights

- Speaker Recognition service is generally available (GA) now. Speech SDK APIs are available on C++, C#, Java, and JavaScript. With Speaker Recognition, you can accurately verify and identify speakers by their unique voice characteristics. For more information about this topic, see the [documentation](../../speaker-recognition-overview.md).

- We've dropped support for Ubuntu 16.04 in conjunction with Azure DevOps and GitHub. Ubuntu 16.04 reached end of life back in April of 2021. Migrate your Ubuntu 16.04 workflows to Ubuntu 18.04 or newer. 

- OpenSSL linking in Linux binaries changed to dynamic. Linux binary size has been reduced by about 50%. 

- Mac M1 ARM-based silicon support added. 

#### New features 

- **C++/C#/Java**: New APIs added to enable audio processing support for speech input with Microsoft Audio Stack. Documentation [here](../../audio-processing-overview.md).

- **C++**: New APIs for intent recognition to facilitate more advanced pattern matching. This includes List and Prebuilt Integer entities as well as support for grouping intents and entities as models (Documentation, updates, and samples are under development and will be published in the near future). 

- **Mac**: Support for ARM64 (M1) based silicon for CocoaPod, Python, Java, and NuGet packages related to [GitHub issue 1244](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1244).

- **iOS/Mac**: iOS and macOS binaries are now packaged into xcframework related to [GitHub issue 919](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/919).

- **iOS/Mac**: Support for Mac catalyst related to [GitHub issue 1171](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1171). 

- **Linux**: New tar package added for CentOS7 [About the Speech SDK](../../speech-sdk.md). The Linux .tar package now contains specific libraries for RHEL/CentOS 7 in `lib/centos7-x64`. Speech SDK libraries in lib/x64 are still applicable for all the other supported Linux x64 distributions (including RHEL/CentOS 8) and won't work on RHEL/CentOS 7.

- **JavaScript**: VoiceProfile & SpeakerRecognizer APIs made async/awaitable. 

- **JavaScript**: Support added for US government Azure regions. 

- **Windows**: Support added for playback on Universal Windows Platform (UWP). 


#### Bug fixes 

- **Android**: OpenSSL security update (updated to version 1.1.1l) for Android packages. 

- **Python**: Resolved bug where selecting speaker device on Python fails. 

- **Core**: Automatically reconnect when a connection attempt fails. 

- **iOS**: Audio compression disabled on iOS packages due instability and bitcode build problems when using GStreamer. Details are available via [GitHub issue 1209](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1209).

 

#### Samples [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

- **Mac/iOS**: Updated samples and quickstarts to use xcframework package. 

- **.NET**: Samples updated to use .NET core 3.1 version. 

- **JavaScript**: Added sample for Voice Assistants. 


### Speech SDK 1.18.0: 2021-July release

**Note**: Get started with the Speech SDK [here](../../quickstarts/setup-platform.md).

#### Highlights summary
- Ubuntu 16.04 reached end of life in April of 2021. With Azure DevOps and GitHub, we'll drop support for 16.04 in September 2021.  Migrate ubuntu-16.04 workflows to ubuntu-18.04 or newer before then. 

#### New features

- **C++**: Simple Language Pattern matching with the Intent Recognizer now makes it easier to [implement simple intent recognition scenarios](../../get-started-intent-recognition.md?pivots=programming-language-cpp).
- **C++/C#/Java**: We added a new API, `GetActivationPhrasesAsync()` to the `VoiceProfileClient` class for receiving a list of valid activation phrases in Speaker Recognition enrollment phase for independent recognition scenarios. 
    - **Important**: The Speaker Recognition feature is in Preview. All voice profiles created in Preview will be discontinued 90 days after the Speaker Recognition feature is moved out of Preview into General Availability. At that point the Preview voice profiles will stop functioning.
- **Python**: Added [support for continuous Language Identification (LID)](../../language-identification.md?pivots=programming-language-python) on the existing `SpeechRecognizer` and `TranslationRecognizer` objects. 
- **Python**: Added a [new Python object](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.sourcelanguagerecognizer) named `SourceLanguageRecognizer` to do one-time or continuous LID (without recognition or translation). 
- **JavaScript**: `getActivationPhrasesAsync` API added to `VoiceProfileClient` class for receiving a list of valid activation phrases in Speaker Recognition enrollment phase for independent recognition scenarios. 
- **JavaScript** `VoiceProfileClient`'s `enrollProfileAsync` API is now async awaitable. See [this independent identification code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/node/speaker-recognition/identification/independent-identification.js), for example, usage.

#### Improvements

- **Java**: **AutoCloseable** support added to many Java objects. Now the try-with-resources model is supported to release resources. See [this sample that uses try-with-resources](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/java/jre/intent-recognition/src/speechsdk/quickstart/Main.java#L28). Also see the Oracle Java documentation tutorial for [The try-with-resources Statement](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) to learn about this pattern.
- **Disk footprint** has been significantly reduced for many platforms and architectures. Examples for the `Microsoft.CognitiveServices.Speech.core` binary: x64 Linux is 475KB smaller (8.0% reduction); ARM64 Windows UWP is 464KB smaller (11.5% reduction); x86 Windows is 343KB smaller (17.5% reduction); and x64 Windows is 451KB smaller (19.4% reduction).

#### Bug fixes

- **Java**: Fixed synthesis error when the synthesis text contains surrogate characters. Details [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1118). 
- **JavaScript**: Browser microphone audio processing now uses `AudioWorkletNode` instead of deprecated `ScriptProcessorNode`. Details [here](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/391).
- **JavaScript**: Correctly keep conversations alive during long running conversation translation scenarios. Details [here](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/389).
- **JavaScript**: Fixed issue with recognizer reconnecting to a mediastream in continuous recognition. Details [here](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/385).
- **JavaScript**: Fixed issue with recognizer reconnecting to a pushStream in continuous recognition. Details [here](https://github.com/microsoft/cognitive-services-speech-sdk-js/pull/399).
- **JavaScript**: Corrected word level offset calculation in detailed recognition results. Details [here](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/394).

#### Samples

- Java quickstart samples updated [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java).
- JavaScript Speaker Recognition samples updated to show new usage of `enrollProfileAsync()`. See samples [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/node).


### Speech SDK 1.17.0: 2021-May release

>[!NOTE]
>Get started with the Speech SDK [here](../../quickstarts/setup-platform.md).

#### Highlights summary

- Smaller footprint - we continue to decrease the memory and disk footprint of the Speech SDK and its components.
- A new stand-alone Language Identification API allows you to recognize what language is being spoken.
- Develop speech enabled mixed reality and gaming applications using Unity on macOS.
- You can now use Text to speech in addition to speech recognition from the Go programming language.
- Several Bug fixes to address issues YOU, our valued customers, have flagged on GitHub! THANK YOU! Keep the feedback coming!

#### New features

- **C++/C#**: New stand-alone At-Start and Continuous Language Detection via the `SourceLanguageRecognizer` API. If you only want to detect the language(s) spoken in audio content, this is the API to do that. See details for [C++](/cpp/cognitive-services/speech/sourcelanguagerecognizer) and [C#](/dotnet/api/microsoft.cognitiveservices.speech.sourcelanguagerecognizer).
- **C++/C#**: Speech Recognition and Translation Recognition now support both at-start and continuous Language Identification so you can programmatically determine which language(s) are being spoken before they're transcribed or translated. See documentation [here for Speech Recognition](../../language-identification.md) and [here for Speech Translation](../../get-started-speech-translation.md).
- **C#**:  Added support Unity support to macOS (x64). This unlocks speech recognition and speech synthesis use cases in mixed reality and gaming!
- **Go**: We added support for speech synthesis text to speech to the Go programming language to make speech synthesis available in even more use cases. See our [quickstart](../../get-started-text-to-speech.md?tabs=windowsinstall&pivots=programming-language-go) or our [reference documentation](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go).
- **C++/C#/Java/Python/Objective-C/Go**: The speech synthesizer now supports the `connection` object. This helps you manage and monitor the connection to the Speech service, and is especially helpful to pre-connect to reduce latency. See documentation [here](../../how-to-lower-speech-synthesis-latency.md).
- **C++/C#/Java/Python/Objective-C/Go**: We now expose the latency and underrun time in `SpeechSynthesisResult` to help you monitor and diagnose speech synthesis latency issues. See details for [C++](/cpp/cognitive-services/speech/speechsynthesisresult), [C#](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisresult), [Java](/java/api/com.microsoft.cognitiveservices.speech.speechsynthesisresult), [Python](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisresult), [Objective-C](/objectivec/cognitive-services/speech/spxspeechsynthesisresult) and [Go](https://pkg.go.dev/github.com/Microsoft/cognitive-services-speech-sdk-go#readme-reference).
- **C++/C#/Java/Python/Objective-C**: Text to speech [now uses neural voices](../../text-to-speech.md#core-features) by default when you don't specify a voice to be used. This gives you higher fidelity output by default, but also [increases the default price](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/#pricing). You can specify any of our [over 70 standard voices](../../how-to-migrate-to-prebuilt-neural-voice.md) or [over 130 neural voices](../../language-support.md?tabs=tts) to change the default.
- **C++/C#/Java/Python/Objective-C/Go**: We added a Gender property to the synthesis voice info to make it easier to select voices based on gender. This addresses [GitHub issue #1055](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1055).
- **C++, C#, Java, JavaScript**: We now support `retrieveEnrollmentResultAsync`, `getAuthorizationPhrasesAsync`, and `getAllProfilesAsync()` in Speaker Recognition to ease user management of all voice profiles for a given account. See documentation for [C++](/cpp/cognitive-services/speech/speaker-voiceprofileclient), [C#](/dotnet/api/microsoft.cognitiveservices.speech.speaker.voiceprofileclient), [Java](/java/api/com.microsoft.cognitiveservices.speech.speaker.voiceprofileclient), [JavaScript](/javascript/api/microsoft-cognitiveservices-speech-sdk/voiceprofileclient). This addresses [GitHub issue #338](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/338).
- **JavaScript**: We added retry for connection failures that will make your JavaScript-based speech applications more robust.

#### Improvements

- Linux and Android Speech SDK binaries have been updated to use the latest version of OpenSSL (1.1.1k)
- Code Size improvements:
    - Language Understanding is now split into a separate "lu" library.
    - Windows x64 core binary size decreased by 14.4%.
    - Android ARM64 core binary size decreased by 13.7%.
    - other components also decreased in size.

#### Bug fixes

- **All**: Fixed [GitHub issue #842](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/842) for ServiceTimeout. You can now transcribe long audio files using the Speech SDK without the connection to the service terminating with this error. However, we still recommend you use [batch transcription](../../batch-transcription.md) for long files.
- **C#**: Fixed [GitHub issue #947](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/947) where no speech input could leave your app in a bad state.
- **Java**: Fixed [GitHub Issue #997](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/997) where the Speech SDK for Java 1.16 crashes when using DialogServiceConnector without a network connection or an invalid subscription key.
- Fixed a crash when abruptly stopping speech recognition (for example, using CTRL+C on console app).
- **Java**: Added a fix to delete temporary files on Windows when using Speech SDK for Java.
- **Java**: Fixed [GitHub issue #994](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/994) where calling `DialogServiceConnector.stopListeningAsync` could result in an error.
- **Java**: Fixed a customer issue in the [virtual assistant quickstart](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/jre/virtual-assistant).
- **JavaScript**: Fixed [GitHub issue #366](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/366) where `ConversationTranslator` threw an error 'this.cancelSpeech isn't a function'.
- **JavaScript**: Fixed [GitHub issue #298](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/298) where 'Get result as an in-memory stream' sample played sound out loud.
- **JavaScript**: Fixed [GitHub issue #350](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/350) where calling `AudioConfig` could result in a 'ReferenceError: MediaStream isn't defined'.
- **JavaScript**: Fixed an UnhandledPromiseRejection warning in Node.js for long-running sessions.

#### Samples

- Updated Unity samples documentation for macOS [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk).
- A React Native sample for the Azure AI Speech recognition service is now available [here](https://github.com/microsoft/cognitive-services-sdk-react-native-example).


### Speech SDK 1.16.0: 2021-March release

> [!NOTE]
> The Speech SDK on Windows depends on the shared Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019. Download it [here](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads).

#### New features

- **C++/C#/Java/Python**: Moved to the latest version of GStreamer (1.18.3) to add support for transcribing any media format on Windows, Linux, and Android. See documentation [here](../../how-to-use-codec-compressed-audio-input-streams.md).
- **C++/C#/Java/Objective-C/Python**: Added support for decoding compressed TTS/synthesized audio to the SDK. If you set output audio format to PCM and GStreamer is available on your system, the SDK will automatically request compressed audio from the service to save bandwidth and decode the audio on the client. You can set `SpeechServiceConnection_SynthEnableCompressedAudioTransmission` to `false` to disable this feature. Details for [C++](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#propertyid), [C#](/dotnet/api/microsoft.cognitiveservices.speech.propertyid), [Java](/java/api/com.microsoft.cognitiveservices.speech.propertyid), [Objective-C](/objectivec/cognitive-services/speech/spxpropertyid), [Python](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.propertyid).
- **JavaScript**: Node.js users can now use the [`AudioConfig.fromWavFileInput` API](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig#fromWavFileInput_File_). This addresses [GitHub issue #252](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/252).
- **C++/C#/Java/Objective-C/Python**: Added `GetVoicesAsync()` method for TTS to return all available synthesis voices. Details for [C++](/cpp/cognitive-services/speech/speechsynthesizer#getvoicesasync), [C#](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesizer#methods), [Java](/java/api/com.microsoft.cognitiveservices.speech.speechsynthesizer#methods), [Objective-C](/objectivec/cognitive-services/speech/spxspeechsynthesizer#getvoiceasync), and [Python](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesizer#methods).
- **C++/C#/Java/JavaScript/Objective-C/Python**: Added `VisemeReceived` event for TTS/speech synthesis to return synchronous viseme animation. See documentation [here](../../how-to-speech-synthesis-viseme.md).
- **C++/C#/Java/JavaScript/Objective-C/Python**: Added `BookmarkReached` event for TTS. You can set bookmarks in the input SSML and get the audio offsets for each bookmark. See documentation [here](../../speech-synthesis-markup-structure.md#bookmark-element).
- **Java**: Added support for Speaker Recognition APIs. Details [here](/java/api/com.microsoft.cognitiveservices.speech.speaker.speakerrecognizer).
- **C++/C#/Java/JavaScript/Objective-C/Python**: Added two new output audio formats with WebM container for TTS (Webm16Khz16BitMonoOpus and Webm24Khz16BitMonoOpus). These are better formats for streaming audio with the Opus codec. Details for [C++](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace#speechsynthesisoutputformat), [C#](/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat), [Java](/java/api/com.microsoft.cognitiveservices.speech.speechsynthesisoutputformat), [JavaScript](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat), [Objective-C](/objectivec/cognitive-services/speech/spxspeechsynthesisoutputformat), [Python](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechsynthesisoutputformat).
- **C++/C#/Java**: Added support for retrieving voice profile for Speaker Recognition scenario. Details for [C++](/cpp/cognitive-services/speech/speaker-speakerrecognizer), [C#](/dotnet/api/microsoft.cognitiveservices.speech.speaker.speakerrecognizer), and [Java](/java/api/com.microsoft.cognitiveservices.speech.speaker.speakerrecognizer).
- **C++/C#/Java/Objective-C/Python**: Added support for separate shared library for audio microphone and speaker control. This allows the developer to use the SDK in environments that don't have required audio library dependencies.
- **Objective-C/Swift**: Added support for module framework with umbrella header. This allows the developer to import Speech SDK as a module in iOS/Mac Objective-C/Swift apps. This addresses [GitHub issue #452](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/452).
- **Python**: Added support for [Python 3.9](../../quickstarts/setup-platform.md?pivots=programming-language-python) and dropped support for Python 3.5 per Python's [end-of-life for 3.5](https://devguide.python.org/devcycle/#end-of-life-branches).

**Known issues**

- **C++/C#/Java**: `DialogServiceConnector` can't use a `CustomCommandsConfig` to access a Custom Commands application and will instead encounter a connection error. This can be worked around by manually adding your application ID to the request with `config.SetServiceProperty("X-CommandsAppId", "your-application-id", ServicePropertyChannel.UriQueryParameter)`. The expected behavior of `CustomCommandsConfig` will be restored in the next release.

#### Improvements

- As part of our multi-release effort to reduce the Speech SDK's memory usage and disk footprint, Android binaries are now 3% to 5% smaller.
- Improved accuracy, readability, and see-also sections of our C# reference documentation [here](/dotnet/api/microsoft.cognitiveservices.speech).

#### Bug fixes

- **JavaScript**: Large WAV file headers are now parsed correctly (increases header slice to 512 bytes). This addresses [GitHub issue #962](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/962).
- **JavaScript**: Corrected microphone timing issue if mic stream ends before stop recognition, addressing an issue with Speech Recognition not working in Firefox.
- **JavaScript**: We now correctly handle initialization promise when the browser forces mic off before turnOn completes.
- **JavaScript**: We replaced URL dependency with url-parse. This addresses [GitHub issue #264](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/264).
- **Android**: Fixed callbacks not working when `minifyEnabled` is set to true.
- **C++/C#/Java/Objective-C/Python**: `TCP_NODELAY` will be correctly set to underlying socket IO for TTS to reduce latency.
- **C++/C#/Java/Python/Objective-C/Go**: Fixed an occasional crash when the recognizer was destroyed just after starting a recognition.
- **C++/C#/Java**: Fixed an occasional crash in the destruction of speaker recognizer.

#### Samples

- **JavaScript**: [Browser samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser) no longer require separate JavaScript library file download.


### Speech SDK 1.15.0: 2021-January release

> [!NOTE]
> The Speech SDK on Windows depends on the shared Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019. Download it [here](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads).

#### Highlights summary
- Smaller memory and disk footprint making the SDK more efficient.
- Higher fidelity output formats available for custom-neural voice private preview.
- Intent Recognizer can now get return more than the top intent, giving you the ability to make a separate assessment about your customer's intent.
- Voice assistants and bots are now easier to set up, and you can make it stop listening immediately, and exercise greater control over how it responds to errors.
- Improved on device performance through making compression optional.
- Use the Speech SDK on Windows ARM/ARM64.
- Improved low-level debugging.
- Pronunciation Assessment feature is now more widely available.
- Several Bug fixes to address issues YOU, our valued customers, have flagged on GitHub! THANK YOU! Keep the feedback coming!

#### Improvements
- The Speech SDK is now more efficient and lightweight. We've started a multi-release effort to reduce the Speech SDK's memory usage and disk footprint. As a first step we made significant file size reductions in shared libraries on most platforms. Compared to the 1.14 release:
  - 64-bit UWP-compatible Windows libraries are about 30% smaller.
  - 32-bit Windows libraries aren't yet seeing a size improvement.
  - Linux libraries are 20-25% smaller.
  - Android libraries are 3-5% smaller.

#### New features
- **All**: New 48 KHz output formats available for the private preview of custom-neural voice through the TTS speech synthesis API: Audio48Khz192KBitRateMonoMp3, audio-48khz-192kbitrate-mono-mp3, Audio48Khz96KBitRateMonoMp3, audio-48khz-96kbitrate-mono-mp3, Raw48Khz16BitMonoPcm, raw-48khz-16bit-mono-pcm, Riff48Khz16BitMonoPcm, riff-48khz-16bit-mono-pcm.
- **All**: Custom voice is also easier to use. Added support for setting custom voice via `EndpointId` ([C++](/cpp/cognitive-services/speech/speechconfig#setendpointid), [C#](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.endpointid#Microsoft_CognitiveServices_Speech_SpeechConfig_EndpointId), [Java](/java/api/com.microsoft.cognitiveservices.speech.speechconfig.setendpointid#com_microsoft_cognitiveservices_speech_SpeechConfig_setEndpointId_String_), [JavaScript](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig#endpointId), [Objective-C](/objectivec/cognitive-services/speech/spxspeechconfiguration#endpointid), [Python](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig#endpoint-id)). Before this change, custom voice users needed to set the endpoint URL via the `FromEndpoint` method. Now customers can use the `FromSubscription` method just like prebuilt voices, and then provide the deployment ID by setting `EndpointId`. This simplifies setting up custom voices.
- **C++/C#/Java/Objective-C/Python**: Get more than the top intent from`IntentRecognizer`. It now supports configuring the JSON result containing all intents and not only the top scoring intent via `LanguageUnderstandingModel FromEndpoint` method by using `verbose=true` uri parameter. This addresses [GitHub issue #880](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/880). See updated documentation [here](../../get-started-intent-recognition.md#add-a-languageunderstandingmodel-and-intents).
- **C++/C#/Java**: Make your voice assistant or bot stop listening immediately. `DialogServiceConnector` ([C++](/cpp/cognitive-services/speech/dialog-dialogserviceconnector), [C#](/dotnet/api/microsoft.cognitiveservices.speech.dialog.dialogserviceconnector), [Java](/java/api/com.microsoft.cognitiveservices.speech.dialog.dialogserviceconnector)) now has a `StopListeningAsync()` method to accompany `ListenOnceAsync()`. This will immediately stop audio capture and gracefully wait for a result, making it perfect for use with "stop now" button-press scenarios.
- **C++/C#/Java/JavaScript**: Make your voice assistant or bot react better to underlying system errors. `DialogServiceConnector` ([C++](/cpp/cognitive-services/speech/dialog-dialogserviceconnector), [C#](/dotnet/api/microsoft.cognitiveservices.speech.dialog.dialogserviceconnector), [Java](/java/api/com.microsoft.cognitiveservices.speech.dialog.dialogserviceconnector), [JavaScript](/javascript/api/microsoft-cognitiveservices-speech-sdk/dialogserviceconnector)) now has a new `TurnStatusReceived` event handler. These optional events correspond to every [`ITurnContext`](/dotnet/api/microsoft.bot.builder.iturncontext) resolution on the Bot and will report turn execution failures when they happen, for example, as a result of an unhandled exception, timeout, or network drop between Direct Line Speech and the bot. `TurnStatusReceived` makes it easier to respond to failure conditions. For example, if a bot takes too long on a backend database query (for example, looking up a product), `TurnStatusReceived` allows the client to know to reprompt with "sorry, I didn't quite get that, could you please try again" or something similar.
- **C++/C#**: Use the Speech SDK on more platforms. The [Speech SDK NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) now supports Windows ARM/ARM64 desktop native binaries (UWP was already supported) to make the Speech SDK more useful on more machine types.
- **Java**: [`DialogServiceConnector`](/java/api/com.microsoft.cognitiveservices.speech.dialog.dialogserviceconnector) now has a `setSpeechActivityTemplate()` method that was unintentionally excluded from the language previously. This is equivalent to setting the `Conversation_Speech_Activity_Template` property and will request that all future Bot Framework activities originated by the Direct Line Speech service merge the provided content into their JSON payloads.
- **Java**: Improved low-level debugging. The [`Connection`](/java/api/com.microsoft.cognitiveservices.speech.connection) class now has a `MessageReceived` event, similar to other programming languages (C++, C#). This event provides low-level access to incoming data from the service and can be useful for diagnostics and debugging.
- **JavaScript**: Easier setup for Voice Assistants and bots through [`BotFrameworkConfig`](/javascript/api/microsoft-cognitiveservices-speech-sdk/botframeworkconfig), which now has `fromHost()` and `fromEndpoint()` factory methods that simplify the use of custom service locations versus manually setting properties. We also standardized optional specification of `botId` to use a non-default bot across the configuration factories.
- **JavaScript**: Improved on device performance through added string control property for websocket compression. For performance reasons, we disabled websocket compression by default. This can be reenabled for low-bandwidth scenarios. More details [here](/javascript/api/microsoft-cognitiveservices-speech-sdk/propertyid). This addresses [GitHub issue #242](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/242).
- **JavaScript**: Added support for lPronunciation Assessment to enable evaluation of speech pronunciation. See the quickstart [here](../../how-to-pronunciation-assessment.md?pivots=programming-language-javascript).

#### Bug fixes
- **All** (except JavaScript): Fixed a regression in version 1.14, in which too much memory was allocated by the recognizer.
- **C++**: Fixed a garbage collection issue with `DialogServiceConnector`, addressing [GitHub issue #794](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/794).
- **C#**: Fixed an issue with thread shutdown that caused objects to block for about a second when disposed.
- **C++/C#/Java**: Fixed an exception preventing an application from setting speech authorization token or activity template more than once on a `DialogServiceConnector`.
- **C++/C#/Java**: Fixed a recognizer crash due to a race condition in teardown.
- **JavaScript**: [`DialogServiceConnector`](/javascript/api/microsoft-cognitiveservices-speech-sdk/dialogserviceconnector) didn't previously honor the optional `botId` parameter specified in `BotFrameworkConfig`'s factories. This made it necessary to set the `botId` query string parameter manually to use a non-default bot. The bug has been corrected and `botId` values provided to `BotFrameworkConfig`'s factories will be honored and used, including the new `fromHost()` and `fromEndpoint()` additions. This also applies to the `applicationId` parameter for `CustomCommandsConfig`.
- **JavaScript**: Fixed [GitHub issue #881](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/881), allowing recognizer object reusage.
- **JavaScript**: Fixed an issue where the SKD was sending `speech.config` multiple times in one TTS session, wasting bandwidth.
- **JavaScript**: Simplified error handling on microphone authorization, allowing more descriptive message to bubble up when user hasn't allowed microphone input on their browser.
- **JavaScript**: Fixed [GitHub issue #249](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/249) where type errors in `ConversationTranslator` and `ConversationTranscriber` caused a compilation error for TypeScript users.
- **Objective-C**: Fixed an issue where GStreamer build failed for iOS on Xcode 11.4, addressing [GitHub issue #911](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/911).
- **Python**: Fixed [GitHub issue #870](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/870), removing "DeprecationWarning: the imp module is deprecated in favor of importlib".

#### Samples
- [From-file sample for JavaScript browser](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/browser/from-file/index.html) now uses files for speech recognition. This addresses [GitHub issue #884](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/884).


### Speech SDK 1.14.0: 2020-October release

> [!NOTE]
> The Speech SDK on Windows depends on the shared Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019. Download it [here](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads).

#### New features
- **Linux**: Added support for Debian 10 and Ubuntu 20.04 LTS.
- **Python/Objective-C**: Added support for the `KeywordRecognizer` API. Documentation will be [here](../../custom-keyword-basics.md).
- **C++/Java/C#**: Added support to set any `HttpHeader` key/value via `ServicePropertyChannel::HttpHeader`.
- **JavaScript**: Added support for the `ConversationTranscriber` API. Read documentation [here](../../get-started-stt-diarization.md).
- **C++/C#**: Added new `AudioDataStream FromWavFileInput` method (to read .WAV files) [here (C++)](/cpp/cognitive-services/speech/audiodatastream) and [here (C#)](/dotnet/api/microsoft.cognitiveservices.speech.audiodatastream).
-  **C++/C#/Java/Python/Objective-C/Swift**: Added a `stopSpeakingAsync()` method to stop Text to speech synthesis. Read the Reference documentation [here (C++)](/cpp/cognitive-services/speech/microsoft-cognitiveservices-speech-namespace), [here (C#)](/dotnet/api/microsoft.cognitiveservices.speech), [here (Java)](/java/api/com.microsoft.cognitiveservices.speech), [here (Python)](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech),  and [here (Objective-C/Swift)](/objectivec/cognitive-services/speech/).
- **C#, C++, Java**: Added a `FromDialogServiceConnector()` function to the `Connection` class that can be used to monitor connection and disconnection events for `DialogServiceConnector`. Read the Reference documentation [here (C#)](/dotnet/api/microsoft.cognitiveservices.speech.connection), [here (C++)](/cpp/cognitive-services/speech/connection), and [here (Java)](/java/api/com.microsoft.cognitiveservices.speech.connection).
- **C++/C#/Java/Python/Objective-C/Swift**: Added support for Pronunciation Assessment, which evaluates speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. Read the documentation [here](../../how-to-pronunciation-assessment.md).

#### Breaking change
- **JavaScript**: PullAudioOutputStream.read() has a return type change from an internal Promise to a Native JavaScript Promise.

#### Bug fixes
- **All**: Fixed 1.13 regression in `SetServiceProperty` where values with certain special characters were ignored.
- **C#**: Fixed Windows console samples on Visual Studio 2019 failing to find native DLLs.
- **C#**: Fixed crash with memory management if stream is used as `KeywordRecognizer` input.
- **ObjectiveC/Swift**: Fixed crash with memory management if stream is used as recognizer input.
- **Windows**: Fixed coexistence issue with BT HFP/A2DP on UWP.
- **JavaScript**: Fixed mapping of session IDs to improve logging and aid in internal debug/service correlations.
- **JavaScript**: Added fix for `DialogServiceConnector` disabling `ListenOnce` calls after the first call is made.
- **JavaScript**: Fixed issue where result output would only ever be "simple".
- **JavaScript**: Fixed continuous recognition issue in Safari on macOS.
- **JavaScript**: CPU load mitigation for high request throughput scenario.
- **JavaScript**: Allow access to details of Voice Profile Enrollment result.
- **JavaScript**: Added fix for continuous recognition in `IntentRecognizer`.
- **C++/C#/Java/Python/Swift/ObjectiveC**: Fixed incorrect url for australiaeast and brazilsouth in `IntentRecognizer`.
- **C++/C#**: Added `VoiceProfileType` as an argument when creating a `VoiceProfile` object.
- **C++/C#/Java/Python/Swift/ObjectiveC**: Fixed potential `SPX_INVALID_ARG` when trying to read `AudioDataStream` from a given position.
- **IOS**: Fixed crash with speech recognition on Unity

#### Samples
- **ObjectiveC**: Added sample for keyword recognition [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/objective-c/ios/speech-samples).
- **C#/JavaScript**: Added quickstart for conversation transcription [here (C#)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/dotnet/conversation-transcription) and [here (JavaScript)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node/conversation-transcription).
- **C++/C#/Java/Python/Swift/ObjectiveC**: Added sample for Pronunciation Assessment [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples)
- **Xamarin**: Updated quickstart to latest Visual Studio template [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/xamarin).

#### Known Issue
- DigiCert Global Root G2 certificate isn't supported by default in HoloLens 2 and Android 4.4 (KitKat) and needs to be added to the system to make the Speech SDK functional. The certificate will be added to HoloLens 2 OS images in the near future. Android 4.4 customers need to add the updated the certificate to the system.

#### COVID-19 abridged testing
Due to working remotely over the last few weeks, we couldn't do as much manual verification testing as we normally do. We haven't made any changes we think could have broken anything, and our automated tests all passed. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

### Speech SDK 1.13.0: 2020-July release

> [!NOTE]
> The Speech SDK on Windows depends on the shared Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019. Download and install it from [here](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads).

#### New features
- **C#**: Added support for asynchronous conversation transcription. See documentation [here](../../get-started-stt-diarization.md).
- **JavaScript**: Added Speaker Recognition support for both [browser](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/browser/speaker-recognition) and [Node.js](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node/speaker-recognition).
- **JavaScript**: Added support for Language Identification/language ID. See documentation [here](../../language-identification.md?pivots=programming-language-javascript).
- **Objective-C**: Added support for [multi-device conversation](../../multi-device-conversation.md) and conversation transcription.
- **Python**: Added compressed audio support for Python on Windows and Linux. See documentation [here](../../how-to-use-codec-compressed-audio-input-streams.md).

#### Bug fixes
- **All**: Fixed an issue that caused the KeywordRecognizer to not move forward the streams after a recognition.
- **All**: Fixed an issue that caused the stream obtained from a KeywordRecognitionResult to not contain the keyword.
- **All**: Fixed an issue that the SendMessageAsync doesn't really send the message over the wire after the users finish waiting for it.
- **All**: Fixed a crash in Speaker Recognition APIs when users call VoiceProfileClient::SpeakerRecEnrollProfileAsync method multiple times and didn't wait for the calls to finish.
- **All**: Fixed enable file logging in VoiceProfileClient and SpeakerRecognizer classes.
- **JavaScript**: Fixed an [issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/74) with throttling when browser is minimized.
- **JavaScript**: Fixed an [issue](https://github.com/microsoft/cognitive-services-speech-sdk-js/issues/78) with a memory leak on streams.
- **JavaScript**: Added caching for OCSP responses from NodeJS.
- **Java**: Fixed an issue that was causing BigInteger fields to always return 0.
- **iOS**: Fixed an [issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/702) with publishing Speech SDK-based apps in the iOS App Store.

#### Samples
- **C++**: Added sample code for Speaker Recognition [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/cpp/windows/console/samples/speaker_recognition_samples.cpp).

#### COVID-19 abridged testing
Due to working remotely over the last few weeks, we couldn't do as much manual verification testing as we normally do. We haven't made any changes we think could have broken anything, and our automated tests all passed. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!


### Speech SDK 1.12.1: 2020-June release

#### New features
-   **C\#, C++**: Speaker Recognition Preview: This feature enables speaker identification (who is speaking?) and speaker verification (is the speaker who they claim to be?). Start with an [overview](../../speaker-recognition-overview.md), read the [Speaker Recognition basics article](../../get-started-speaker-recognition.md), or the [API reference docs](/rest/api/speakerrecognition/).

#### Bug fixes
-   **C\#, C++**: Fixed microphone recording wasn't working in 1.12 in Speaker Recognition.
-   **JavaScript**: Fixes for Text to speech in Firefox, and Safari on macOS and iOS.
-   Fix for Windows application verifier access violation crash on conversation transcription when using eight-channel stream.
-   Fix for Windows application verifier access violation crash on multi-device conversation translation.

#### Samples
-   **C#**: [Code sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/dotnet/speaker-recognition) for Speaker Recognition.
-   **C++**: [Code sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/cpp/windows/speaker-recognition) for Speaker Recognition.
-   **Java**: [Code sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android/intent-recognition) for intent recognition on Android. 

#### COVID-19 abridged testing
Due to working remotely over the last few weeks, we couldn't do as much manual verification testing as we normally do. We haven't made any changes we think could have broken anything, and our automated tests all passed. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!


### Speech SDK 1.12.0: 2020-May release

#### New features
- **Go**: New Go language support for [Speech Recognition](../../get-started-speech-to-text.md?pivots=programming-language-go) and [custom voice assistant](../../quickstarts/voice-assistants.md?pivots=programming-language-go). Set up your dev environment [here](../../quickstarts/setup-platform.md?pivots=programming-language-go). For sample code, see the Samples section below.
- **JavaScript**: Added Browser support for Text to speech. See documentation [here](../../get-started-text-to-speech.md?pivots=programming-language-JavaScript).
- **C++, C#, Java**: New `KeywordRecognizer` object and APIs supported on Windows, Android, Linux & iOS platforms. Read the documentation [here](../../keyword-recognition-overview.md). For sample code, see the Samples section below.
- **Java**: Added multi-device conversation with translation support. See the reference doc [here](/java/api/com.microsoft.cognitiveservices.speech.transcription).

**Improvements & Optimizations**
- **JavaScript**: Optimized browser microphone implementation improving speech recognition accuracy.
- **Java**: Refactored bindings using direct JNI implementation without SWIG. This change reduces by 10x the bindings size for all Java packages used for Windows, Android, Linux, and Mac and eases further development of the Speech SDK Java implementation.
- **Linux**: Updated support [documentation](../../speech-sdk.md?tabs=linux) with the latest RHEL 7 specific notes.
- Improved connection logic to attempt connecting multiple times when service and network errors occur.
- Updated the [portal.azure.com](https://portal.azure.com) Speech Quickstart page to help developers take the next step in the Azure AI Speech journey.

#### Bug fixes
- **C#, Java**: Fixed an [issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/587) with loading SDK libraries on Linux ARM (both 32 bit and 64 bit).
- **C#**: Fixed explicit disposal of native handles for TranslationRecognizer, IntentRecognizer, and Connection objects.
- **C#**: Fixed audio input lifetime management for ConversationTranscriber object.
- Fixed an issue where `IntentRecognizer` result reason wasn't set properly when recognizing intents from simple phrases.
- Fixed an issue where `SpeechRecognitionEventArgs` result offset wasn't set correctly.
- Fixed a race condition where SDK was trying to send a network message before opening the websocket connection. Was reproducible for `TranslationRecognizer` while adding participants.
- Fixed memory leaks in the keyword recognizer engine.

#### Samples
- **Go**: Added quickstarts for [speech recognition](../../get-started-speech-to-text.md?pivots=programming-language-go) and [custom voice assistant](../../quickstarts/voice-assistants.md?pivots=programming-language-go). Find sample code [here](https://github.com/microsoft/cognitive-services-speech-sdk-go/tree/master/samples).
- **JavaScript**: Added quickstarts for [Text to speech](../../get-started-text-to-speech.md?pivots=programming-language-javascript), [Translation](../../get-started-speech-translation.md?pivots=programming-language-csharp&tabs=script), and [Intent Recognition](../../get-started-intent-recognition.md?pivots=programming-language-javascript).
- Keyword recognition samples for [C\#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/uwp/keyword-recognizer) and [Java](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android/keyword-recognizer) (Android). 

#### COVID-19 abridged testing
Due to working remotely over the last few weeks, we couldn't do as much manual verification testing as we normally do. We haven't made any changes we think could have broken anything, and our automated tests all passed. If we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

### Speech SDK 1.11.0: 2020-March release
#### New features
- Linux: Added support for Red Hat Enterprise Linux (RHEL)/CentOS 7 x64 with [instructions](../../how-to-configure-rhel-centos-7.md) on how to configure the system for Speech SDK.
- Linux: Added support for .NET Core C# on Linux ARM32 and ARM64. Read more [here](../../speech-sdk.md?tabs=linux).
- C#, C++: Added `UtteranceId` in `ConversationTranscriptionResult`, a consistent ID across all the intermediates and final speech recognition result. Details for [C#](/dotnet/api/microsoft.cognitiveservices.speech.transcription.conversationtranscriptionresult), [C++](/cpp/cognitive-services/speech/transcription-conversationtranscriptionresult).
- Python: Added support for `Language ID`. See speech_sample.py in [GitHub repo](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/python/console).
- Windows: Added compressed audio input format support on Windows platform for all the win32 console applications. Details [here](../../how-to-use-codec-compressed-audio-input-streams.md).
- JavaScript: Support speech synthesis (text to speech) in NodeJS. Learn more [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node/text-to-speech).
- JavaScript: Add new APIs to enable inspection of all send and received messages. Learn more [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript).

#### Bug fixes
- C#, C++: Fixed an issue so `SendMessageAsync` now sends binary message as binary type. Details for [C#](/dotnet/api/microsoft.cognitiveservices.speech.connection.sendmessageasync#Microsoft_CognitiveServices_Speech_Connection_SendMessageAsync_System_String_System_Byte___System_UInt32_), [C++](/cpp/cognitive-services/speech/connection).
- C#, C++: Fixed an issue where using `Connection MessageReceived` event may cause crash if `Recognizer` is disposed before `Connection` object. Details for [C#](/dotnet/api/microsoft.cognitiveservices.speech.connection.messagereceived), [C++](/cpp/cognitive-services/speech/connection#messagereceived).
- Android: Audio buffer size from microphone decreased from 800 ms to 100 ms to improve latency.
- Android: Fixed an [issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/563) with x86 Android emulator in Android Studio.
- JavaScript: Added support for Regions in China with the `fromSubscription` API. Details [here](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig#fromsubscription-string--string-).
- JavaScript: Add more error information for connection failures from NodeJS.

#### Samples
- Unity: Intent recognition public sample is fixed, where LUIS json import was failing. Details [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/369).
- Python: Sample added for `Language ID`. Details [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py).

**Covid19 abridged testing:**
Due to working remotely over the last few weeks, we couldn't do as much manual device verification testing as we normally do. For example, we couldn't test microphone input and speaker output on Linux, iOS, and macOS. We haven't made any changes we think could have broken anything on these platforms, and our automated tests all passed. In the unlikely event that we missed something, let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Thank you for your continued support. As always, please post questions or feedback on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen) or [Stack Overflow](https://stackoverflow.microsoft.com/questions/tagged/731).<br>
Stay healthy!

### Speech SDK 1.10.0: 2020-February release

#### New features

 - Added Python packages to support the new 3.8 release of Python.
 - Red Hat Enterprise Linux (RHEL)/CentOS 8 x64 support (C++, C#, Java, Python).
   > [!NOTE]
   > Customers must configure OpenSSL according to [these instructions](../../how-to-configure-openssl-linux.md).
 - Linux ARM32 support for Debian and Ubuntu.
 - DialogServiceConnector now supports an optional "bot ID" parameter on BotFrameworkConfig. This parameter allows the use of multiple Direct Line Speech bots with a single Speech resource. Without the parameter specified, the default bot (as determined by the Direct Line Speech channel configuration page) will be used.
 - DialogServiceConnector now has a SpeechActivityTemplate property. The contents of this JSON string will be used by Direct Line Speech to pre-populate a wide variety of supported fields in all activities that reach a Direct Line Speech bot, including activities automatically generated in response to events like speech recognition.
 - TTS now uses subscription key for authentication, reducing the first byte latency of the first synthesis result after creating a synthesizer.
 - Updated speech recognition models for 19 locales for an average word error rate reduction of 18.6% (es-ES, es-MX, fr-CA, fr-FR, it-IT, ja-JP, ko-KR, pt-BR, zh-CN, zh-HK, nb-NO, fi-FL, ru-RU, pl-PL, ca-ES, zh-TW, th-TH, pt-PT, tr-TR). The new models bring significant improvements across multiple domains including Dictation, Call-Center Transcription, and Video Indexing scenarios.

#### Bug fixes

 - Fixed bug where Conversation Transcriber didn't await  properly in JAVA APIs
 - Android x86 emulator fix for Xamarin [GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/363)
 - Add missing (Get|Set)Property methods to AudioConfig
 - Fix a TTS bug where the audioDataStream couldn't be stopped when connection fails
 - Using an endpoint without a region would cause USP failures for conversation translator
 - ID generation in Universal Windows Applications now uses an appropriately unique GUID algorithm; it previously and unintentionally defaulted to a stubbed implementation that often produced collisions over large sets of interactions.

 #### Samples

 - Unity sample for using Speech SDK with [Unity microphone and push mode streaming](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/csharp/unity/from-unitymicrophone)

**Other changes**

 - [OpenSSL configuration documentation updated for Linux](../../how-to-configure-openssl-linux.md)

### Speech SDK 1.9.0: 2020-January release

#### New features

- Multi-device conversation: connect multiple devices to the same speech or text-based conversation, and optionally translate messages sent between them. Learn more in [this article](../../multi-device-conversation.md).
- Keyword recognition support added for Android `.aar` package and added support for x86 and x64 flavors.
- Objective-C: `SendMessage` and `SetMessageProperty` methods added to `Connection` object. See documentation [here](/objectivec/cognitive-services/speech/spxconnection).
- TTS C++ api now supports `std::wstring` as synthesis text input, removing the need to convert a wstring to string before passing it to the SDK. See details [here](/cpp/cognitive-services/speech/speechsynthesizer#speaktextasync).
- C#: [Language ID](../../language-identification.md?pivots=programming-language-csharp) and [source language config](../../how-to-recognize-speech.md) are now available.
- JavaScript: Added a feature to `Connection` object to pass through custom messages from the Speech service as callback `receivedServiceMessage`.
- JavaScript: Added support for `FromHost API` to ease use with on-premises containers and sovereign clouds. See documentation [here](../../speech-container-howto.md).
- JavaScript: We now honor `NODE_TLS_REJECT_UNAUTHORIZED` thanks to a contribution from [orgads](https://github.com/orgads). See details [here](https://github.com/microsoft/cognitive-services-speech-sdk-js/pull/75).

**Breaking changes**

- `OpenSSL` has been updated to version 1.1.1b and is statically linked to the Speech SDK core library for Linux. This may cause a break if your inbox `OpenSSL` hasn't been installed to the `/usr/lib/ssl` directory in the system. Check [our documentation](../../how-to-configure-openssl-linux.md) under Speech SDK docs to work around the issue.
- We've changed the data type returned for C# `WordLevelTimingResult.Offset` from `int` to `long` to allow for access to `WordLevelTimingResults` when speech data is longer than 2 minutes.
- `PushAudioInputStream` and `PullAudioInputStream` now send wav header information to the Speech service based on `AudioStreamFormat`, optionally specified when they were created. Customers must now use the [supported audio input format](../../how-to-use-audio-input-streams.md). Any other formats will get suboptimal recognition results or may cause other issues.

#### Bug fixes

- See the `OpenSSL` update under Breaking changes above. We fixed both an intermittent crash and a performance issue (lock contention under high load) in Linux and Java.
- Java: Made improvements to object closure in high concurrency scenarios.
- Restructured our NuGet package. We removed the three copies of `Microsoft.CognitiveServices.Speech.core.dll` and `Microsoft.CognitiveServices.Speech.extension.kws.dll` under lib folders, making the NuGet package smaller and faster to download, and we added headers needed to compile some C++ native apps.
- Fixed quickstart samples [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/cpp). These were exiting without displaying "microphone not found" exception on Linux, macOS, Windows.
- Fixed SDK crash with long speech recognition results on certain code paths like [this sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/csharp/uwp/speechtotext-uwp).
- Fixed SDK deployment error in Azure Web App environment to address [this customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/396).
- Fixed a TTS error while using multi `<voice>` tag or `<audio>` tag to address [this customer issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/433).
- Fixed a TTS 401 error when the SDK is recovered from suspended.
- JavaScript: Fixed a circular import of audio data thanks to a contribution from [euirim](https://github.com/euirim).
- JavaScript: added support for setting service properties, as added in 1.7.
- JavaScript: fixed an issue where a connection error could result in continuous, unsuccessful websocket reconnect attempts.

#### Samples

- Added keyword recognition sample for Android [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/android/sdkdemo).
- Added TTS sample for the server scenario [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_server_scenario_sample.cs).
- Added Multi-device conversation quickstarts for C# and C++ [here](../../quickstarts/multi-device-conversation.md).

**Other changes**

- Optimized SDK core library size on Android.
- SDK in 1.9.0 and onwards supports both `int` and `string` types in the voice signature version field for Conversation Transcriber.

### Speech SDK 1.8.0: 2019-November release

#### New features

- Added a `FromHost()` API, to ease use with on-premises containers and sovereign clouds.
- Added Source Language Identification for Speech Recognition (in Java and C++)
- Added `SourceLanguageConfig` object for Speech Recognition, used to specify expected source languages (in Java and C++)
- Added `KeywordRecognizer` support on Windows (UWP), Android and iOS through the NuGet and Unity packages
- Added Remote Conversation Java API to do Conversation Transcription in asynchronous batches.

**Breaking changes**

- Conversation Transcriber functionalities moved under namespace `Microsoft.CognitiveServices.Speech.Transcription`.
- Parts of the Conversation Transcriber methods are moved to new `Conversation` class.
- Dropped support for 32-bit (ARMv7 and x86) iOS

#### Bug fixes

- Fix for crash if local `KeywordRecognizer` is used without a valid Speech service subscription key

#### Samples

- Xamarin sample for `KeywordRecognizer`
- Unity sample for `KeywordRecognizer`
- C++ and Java samples for Automatic Source Language Identification.

### Speech SDK 1.7.0: 2019-September release

#### New features

- Added beta support for Xamarin on Universal Windows Platform (UWP), Android, and iOS
- Added iOS support for Unity
- Added `Compressed` input support for ALaw, Mulaw, FLAC, on Android, iOS and Linux
- Added `SendMessageAsync` in `Connection` class for sending a message to service
- Added `SetMessageProperty` in `Connection` class for setting property of a message
- TTS added bindings for Java (JRE and Android), Python, Swift, and Objective-C
- TTS added playback support for macOS, iOS, and Android.
- Added "word boundary" information for TTS.

#### Bug fixes

- Fixed IL2CPP build issue on Unity 2019 for Android
- Fixed issue with malformed headers in wav file input being processed incorrectly
- Fixed issue with UUIDs not being unique in some connection properties
- Fixed a few warnings about nullability specifiers in the Swift bindings (might require small code changes)
- Fixed a bug that caused websocket connections to be closed ungracefully under network load
- Fixed an issue on Android that sometimes results in duplicate impression IDs used by `DialogServiceConnector`
- Improvements to the stability of connections across multi-turn interactions and the reporting of failures (via `Canceled` events) when they occur with `DialogServiceConnector`
- `DialogServiceConnector` session starts will now properly provide events, including when calling `ListenOnceAsync()` during an active `StartKeywordRecognitionAsync()`
- Addressed a crash associated with `DialogServiceConnector` activities being received

#### Samples

- Quickstart for Xamarin
- Updated CPP Quickstart with Linux ARM64 information
- Updated Unity quickstart with iOS information

### Speech SDK 1.6.0: 2019-June release

#### Samples

- Quickstart samples for Text To Speech on UWP and Unity
- Quickstart sample for Swift on iOS
- Unity samples for Speech & Intent Recognition and Translation
- Updated quickstart samples for `DialogServiceConnector`

**Improvements / Changes**

- Dialog namespace:
  - `SpeechBotConnector` has been renamed to `DialogServiceConnector`
  - `BotConfig` has been renamed to `DialogServiceConfig`
  - `BotConfig::FromChannelSecret()` has been remapped to `DialogServiceConfig::FromBotSecret()`
  - All existing Direct Line Speech clients continue to be supported after the rename
- Update TTS REST adapter to support proxy, persistent connection
- Improve error message when an invalid region is passed
- Swift/Objective-C:
  - Improved error reporting: Methods that can result in an error are now present in two versions: One that exposes an `NSError` object for error handling, and one that raises an exception. The former are exposed to Swift. This change requires adaptations to existing Swift code.
  - Improved event handling

#### Bug fixes

- Fix for TTS: where `SpeakTextAsync` future returned without waiting until audio has completed rendering
- Fix for marshaling strings in C# to enable full language support
- Fix for .NET core app problem to load core library with net461 target framework in samples
- Fix for occasional issues to deploy native libraries to the output folder in samples
- Fix for web socket closing reliably
- Fix for possible crash while opening a connection under heavy load on Linux
- Fix for missing metadata in the framework bundle for macOS
- Fix for problems with `pip install --user` on Windows

### Speech SDK 1.5.1

This is a bug fix release and only affecting the native/managed SDK. It isn't affecting the JavaScript version of the SDK.

#### Bug fixes

- Fix FromSubscription when used with Conversation Transcription.
- Fix bug in keyword spotting for Voice Assistants.

### Speech SDK 1.5.0: 2019-May release

#### New features

- Keyword spotting (KWS) is now available for Windows and Linux. KWS functionality might work with any microphone type, official KWS support, however, is currently limited to the microphone arrays found in the Azure Kinect DK hardware or the Speech Devices SDK.
- Phrase hint functionality is available through the SDK. For more information, see [here](../../get-started-speech-to-text.md).
- Conversation transcription functionality is available through the SDK. 
- Add support for Voice Assistants using the Direct Line Speech channel.

#### Samples

- Added samples for new features or new services supported by the SDK.

**Improvements / Changes**

- Added various recognizer properties to adjust service behavior or service results (like masking profanity and others).
- You can now configure the recognizer through the standard configuration properties, even if you created the recognizer `FromEndpoint`.
- Objective-C: `OutputFormat` property was added to `SPXSpeechConfiguration`.
- The SDK now supports Debian 9 as a Linux distribution.

#### Bug fixes

- Fixed a problem where the speaker resource was destructed too early in Text to speech.

### Speech SDK 1.4.2

This is a bug fix release and only affecting the native/managed SDK. It isn't affecting the JavaScript version of the SDK.

### Speech SDK 1.4.1

This is a JavaScript-only release. No features have been added. The following fixes were made:

- Prevent web pack from loading https-proxy-agent.

### Speech SDK 1.4.0: 2019-April release

#### New features

- The SDK now supports the Text to speech service as a beta version. It's supported on Windows and Linux Desktop from C++ and C#. For more information, check the [Text to speech overview](../../text-to-speech.md#get-started).
- The SDK now supports MP3 and Opus/OGG audio files as stream input files. This feature is available only on Linux from C++ and C# and is currently in beta (more details [here](../../how-to-use-codec-compressed-audio-input-streams.md)).
- The Speech SDK for Java, .NET core, C++ and Objective-C have gained macOS support. The Objective-C support for macOS is currently in beta.
- iOS: The Speech SDK for iOS (Objective-C) is now also published as a CocoaPod.
- JavaScript: Support for non-default microphone as an input device.
- JavaScript: Proxy support for Node.js.

#### Samples

- Samples for using the Speech SDK with C++ and with Objective-C on macOS have been added.
- Samples demonstrating the usage of the Text to speech service have been added.

**Improvements / Changes**

- Python: Additional properties of recognition results are now exposed via the `properties` property.
- For additional development and debug support, you can redirect SDK logging and diagnostics information into a log file (more details [here](../../how-to-use-logging.md)).
- JavaScript: Improve audio processing performance.

#### Bug fixes

- Mac/iOS: A bug that led to a long wait when a connection to the Speech service couldn't be established was fixed.
- Python: improve error handling for arguments in Python callbacks.
- JavaScript: Fixed wrong state reporting for speech ended on RequestSession.

### Speech SDK 1.3.1: 2019-February refresh

This is a bug fix release and only affecting the native/managed SDK. It isn't affecting the JavaScript version of the SDK.

**Bug fix**

- Fixed a memory leak when using microphone input. Stream based or file input isn't affected.

### Speech SDK 1.3.0: 2019-February release

#### New features

- The Speech SDK supports selection of the input microphone through the `AudioConfig` class. This allows you to stream audio data to the Speech service from a non-default microphone. For more information, see the documentation describing [audio input device selection](../../how-to-select-audio-input-devices.md). This feature isn't yet available from JavaScript.
- The Speech SDK now supports Unity in a beta version. Provide feedback through the issue section in the [GitHub sample repository](https://aka.ms/csspeech/samples). This release supports Unity on Windows x86 and x64 (desktop or Universal Windows Platform applications), and Android (ARM32/64, x86). More information is available in our [Unity quickstart](../../get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=unity).
- The file `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` (shipped in previous releases) isn't needed anymore. The functionality is now integrated into the core SDK.

#### Samples

The following new content is available in our [sample repository](https://aka.ms/csspeech/samples):

- Additional samples for `AudioConfig.FromMicrophoneInput`.
- Additional Python samples for intent recognition and translation.
- Additional samples for using the `Connection` object in iOS.
- Additional Java samples for translation with audio output.
- New sample for use of the [Batch Transcription REST API](../../batch-transcription.md).

**Improvements / Changes**

- Python
  - Improved parameter verification and error messages in `SpeechConfig`.
  - Add support for the `Connection` object.
  - Support for 32-bit Python (x86) on Windows.
  - The Speech SDK for Python is out of beta.
- iOS
  - The SDK is now built against the iOS SDK version 12.1.
  - The SDK now supports iOS versions 9.2 and later.
  - Improve reference documentation and fix several property names.
- JavaScript
  - Add support for the `Connection` object.
  - Add type definition files for bundled JavaScript
  - Initial support and implementation for phrase hints.
  - Return properties collection with service JSON for recognition
- Windows DLLs do now contain a version resource.
- If you create a recognizer `FromEndpoint`, you can add parameters directly to the endpoint URL. Using `FromEndpoint` you can't configure the recognizer through the standard configuration properties.

#### Bug fixes

- Empty proxy username and proxy password weren't handled correctly. With this release, if you set proxy username and proxy password to an empty string, they won't be submitted when connecting to the proxy.
- SessionId's created by the SDK weren't always truly random for some languages&nbsp;/ environments. Added random generator initialization to fix this issue.
- Improve handling of authorization token. If you want to use an authorization token, specify in the `SpeechConfig` and leave the subscription key empty. Then create the recognizer as usual.
- In some cases, the `Connection` object wasn't released correctly. This issue has been fixed.
- The JavaScript sample was fixed to support audio output for translation synthesis also on Safari.

### Speech SDK 1.2.1

This is a JavaScript-only release. No features have been added. The following fixes were made:

- Fire end of stream at turn.end, not at speech.end.
- Fix bug in audio pump that didn't schedule next send if the current send failed.
- Fix continuous recognition with auth token.
- Bug fix for different recognizer / endpoints.
- Documentation improvements.

### Speech SDK 1.2.0: 2018-December release

#### New features

- Python
  - The Beta version of Python support (3.5 and above) is available with this release. For more information, see here](../../quickstart-python.md).
- JavaScript
  - The Speech SDK for JavaScript has been open-sourced. The source code is available on [GitHub](https://github.com/Microsoft/cognitive-services-speech-sdk-js).
  - We now support Node.js, more info can be found [here](../../get-started-speech-to-text.md).
  - The length restriction for audio sessions has been removed, reconnection will happen automatically under the cover.
- `Connection` object
  - From the `Recognizer`, you can access a `Connection` object. This object allows you to explicitly initiate the service connection and subscribe to connect and disconnect events.
    (This feature isn't yet available from JavaScript and Python.)
- Support for Ubuntu 18.04.
- Android
  - Enabled ProGuard support during APK generation.

#### Improvements

- Improvements in the internal thread usage, reducing the number of threads, locks, mutexes.
- Improved error reporting / information. In several cases, error messages haven't been propagated out all the way out.
- Updated development dependencies in JavaScript to use up-to-date modules.

#### Bug fixes

- Fixed memory leaks due to a type mismatch in `RecognizeAsync`.
- In some cases exceptions were being leaked.
- Fixing memory leak in translation event arguments.
- Fixed a locking issue on reconnect in long running sessions.
- Fixed an issue that could lead to missing final result for failed translations.
- C#: If an `async` operation wasn't awaited in the main thread, it was possible the recognizer could be disposed before the async task was completed.
- Java: Fixed a problem resulting in a crash of the Java VM.
- Objective-C: Fixed enum mapping; RecognizedIntent was returned instead of `RecognizingIntent`.
- JavaScript: Set default output format to 'simple' in `SpeechConfig`.
- JavaScript: Removing inconsistency between properties on the config object in JavaScript and other languages.

#### Samples

- Updated and fixed several samples (for example output voices for translation, etc.).
- Added Node.js samples in the [sample repository](https://aka.ms/csspeech/samples).

### Speech SDK 1.1.0

#### New features

- Support for Android x86/x64.
- Proxy Support: In the `SpeechConfig` object, you can now call a function to set the proxy information (hostname, port, username, and password). This feature isn't yet available on iOS.
- Improved error code and messages. If a recognition returned an error, this did already set `Reason` (in canceled event) or `CancellationDetails` (in recognition result) to `Error`. The canceled event now contains two additional members, `ErrorCode` and `ErrorDetails`. If the server returned additional error information with the reported error, it will now be available in the new members.

#### Improvements

- Added additional verification in the recognizer configuration, and added additional error message.
- Improved handling of long-time silence in middle of an audio file.
- NuGet package: for .NET Framework projects, it prevents building with AnyCPU configuration.

#### Bug fixes

- Fixed several exceptions found in recognizers. In addition, exceptions are caught and converted into `Canceled` event.
- Fix a memory leak in property management.
- Fixed bug in which an audio input file could crash the recognizer.
- Fixed a bug where events could be received after a session stop event.
- Fixed some race conditions in threading.
- Fixed an iOS compatibility issue that could result in a crash.
- Stability improvements for Android microphone support.
- Fixed a bug where a recognizer in JavaScript would ignore the recognition language.
- Fixed a bug preventing setting the `EndpointId` (in some cases) in JavaScript.
- Changed parameter order in AddIntent in JavaScript, and added missing `AddIntent` JavaScript signature.

#### Samples

- Added C++ and C# samples for pull and push stream usage in the [sample repository](https://aka.ms/csspeech/samples).

### Speech SDK 1.0.1

Reliability improvements and bug fixes:

- Fixed potential fatal error due to race condition in disposing recognizer
- Fixed potential fatal error when unset properties occur.
- Added additional error and parameter checking.
- Objective-C: Fixed possible fatal error caused by name overriding in NSString.
- Objective-C: Adjusted visibility of API
- JavaScript: Fixed regarding events and their payloads.
- Documentation improvements.

In our [sample repository](https://aka.ms/csspeech/samples), a new sample for JavaScript was added.

### Azure AI Speech SDK 1.0.0: 2018-September release

#### New features

- Support for Objective-C on iOS. Check out our [Objective-C quickstart for iOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/objectivec/ios/from-microphone).
- Support for JavaScript in browser. Check out our [JavaScript quickstart](../../get-started-speech-to-text.md).

**Breaking changes**

- With this release, a number of breaking changes are introduced.
  Check [this page](https://aka.ms/csspeech/breakingchanges_1_0_0) for details.

### Azure AI Speech SDK 0.6.0: 2018-August release

#### New features

- UWP apps built with the Speech SDK now can pass the Windows App Certification Kit (WACK).
  Check out the [UWP quickstart](../../get-started-speech-to-text.md?pivots=programming-language-chsarp&tabs=uwp).
- Support for .NET Standard 2.0 on Linux (Ubuntu 16.04 x64).
- Experimental: Support Java 8 on Windows (64-bit) and Linux (Ubuntu 16.04 x64).
  Check out the [Java Runtime Environment quickstart](../../get-started-speech-to-text.md?pivots=programming-language-java&tabs=jre).

**Functional change**

- Expose additional error detail information on connection errors.

**Breaking changes**

- On Java (Android), the `SpeechFactory.configureNativePlatformBindingWithDefaultCertificate` function no longer requires a path parameter. Now the path is automatically detected on all supported platforms.
- The get-accessor of the property `EndpointUrl` in Java and C# was removed.

#### Bug fixes

- In Java, the audio synthesis result on the translation recognizer is implemented now.
- Fixed a bug that could cause inactive threads and an increased number of open and unused sockets.
- Fixed a problem, where a long-running recognition could terminate in the middle of the transmission.
- Fixed a race condition in recognizer shutdown.

### Azure AI Speech SDK 0.5.0: 2018-July release

#### New features

- Support Android platform (API 23: Android 6.0 Marshmallow or higher). Check out the [Android quickstart](../../get-started-speech-to-text.md?pivots=programming-language-java&tabs=android).
- Support .NET Standard 2.0 on Windows. Check out the [.NET Core quickstart](../../get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=dotnetcore).
- Experimental: Support UWP on Windows (version 1709 or later).
  - Check out the [UWP quickstart](../../get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=uwp).
  - Note that UWP apps built with the Speech SDK don't yet pass the Windows App Certification Kit (WACK).
- Support long-running recognition with automatic reconnection.

**Functional changes**

- `StartContinuousRecognitionAsync()` supports long-running recognition.
- The recognition result contains more fields. They're offset from the audio beginning and duration (both in ticks) of the recognized text and additional values that represent recognition status, for example, `InitialSilenceTimeout` and `InitialBabbleTimeout`.
- Support AuthorizationToken for creating factory instances.

**Breaking changes**

- Recognition events: `NoMatch` event type was merged into the `Error` event.
- SpeechOutputFormat in C# was renamed to `OutputFormat` to stay aligned with C++.
- The return type of some methods of the `AudioInputStream` interface changed slightly:
  - In Java, the `read` method now returns `long` instead of `int`.
  - In C#, the `Read` method now returns `uint` instead of `int`.
  - In C++, the `Read` and `GetFormat` methods now return `size_t` instead of `int`.
- C++: Instances of audio input streams now can be passed only as a `shared_ptr`.

#### Bug fixes

- Fixed incorrect return values in the result when `RecognizeAsync()` times out.
- The dependency on media foundation libraries on Windows was removed. The SDK now uses Core Audio APIs.
- Documentation fix: Added a [regions](../../regions.md) page to describe the supported regions.

#### Known Issue

- The Speech SDK for Android doesn't report speech synthesis results for translation. This issue will be fixed in the next release.

### Azure AI Speech SDK 0.4.0: 2018-June release

**Functional changes**

- AudioInputStream

  A recognizer now can consume a stream as the audio source. For more information, see the related [how-to guide](../../how-to-use-audio-input-streams.md).

- Detailed output format

  When you create a `SpeechRecognizer`, you can request `Detailed` or `Simple` output format. The `DetailedSpeechRecognitionResult` contains a confidence score, recognized text, raw lexical form, normalized form, and normalized form with masked profanity.

#### Breaking change

- Changed to `SpeechRecognitionResult.Text` from `SpeechRecognitionResult.RecognizedText` in C#.

#### Bug fixes

- Fixed a possible callback issue in the USP layer during shutdown.
- If a recognizer consumed an audio input file, it was holding on to the file handle longer than necessary.
- Removed several deadlocks between the message pump and the recognizer.
- Fire a `NoMatch` result when the response from service is timed out.
- The media foundation libraries on Windows are delay loaded. This library is required for microphone input only.
- The upload speed for audio data is limited to about twice the original audio speed.
- On Windows, C# .NET assemblies now are strong named.
- Documentation fix: `Region` is required information to create a recognizer.

More samples have been added and are constantly being updated. For the latest set of samples, see the [Speech SDK samples GitHub repository](https://aka.ms/csspeech/samples).

### Azure AI Speech SDK 0.2.12733: 2018-May release

This release is the first public preview release of the Azure AI Speech SDK.
