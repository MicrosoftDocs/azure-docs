---
title: Audio processing - Speech service
titleSuffix: Azure AI services
description: An overview of audio processing and capabilities of the Microsoft Audio Stack.
services: cognitive-services
author: hasyashah
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 09/07/2022
ms.author: hasshah
ms.custom: ignite-fall-2021
---

# Audio processing

The Microsoft Audio Stack is a set of enhancements optimized for speech processing scenarios. This includes examples like keyword recognition and speech recognition. It consists of various enhancements/components that operate on the input audio signal:

* **Noise suppression** - Reduce the level of background noise.
* **Beamforming** - Localize the origin of sound and optimize the audio signal using multiple microphones.
* **Dereverberation** - Reduce the reflections of sound from surfaces in the environment.
* **Acoustic echo cancellation** - Suppress audio being played out of the device while microphone input is active.
* **Automatic gain control** - Dynamically adjust the person’s voice level to account for soft speakers, long distances, or non-calibrated microphones.

[ ![Block diagram of Microsoft Audio Stack's enhancements.](media/audio-processing/mas-block-diagram.png) ](media/audio-processing/mas-block-diagram.png#lightbox)

Different scenarios and use-cases can require different optimizations that influence the behavior of the audio processing stack. For example, in telecommunications scenarios such as telephone calls, it is acceptable to have minor distortions in the audio signal after processing has been applied. This is because humans can continue to understand the speech with high accuracy. However, it is unacceptable and disruptive for a person to hear their own voice in an echo. This contrasts with speech processing scenarios, where distorted audio can adversely impact a machine-learned speech recognition model’s accuracy, but it is acceptable to have minor levels of echo residual. 

Processing is performed fully locally where the Speech SDK is being used. No audio data is streamed to Microsoft’s cloud services for processing by the Microsoft Audio Stack. The only exception to this is for the Conversation Transcription Service, where raw audio is sent to Microsoft’s cloud services for processing. 

The Microsoft Audio Stack also powers a wide range of Microsoft products:
* **Windows** - Microsoft Audio Stack is the default speech processing pipeline when using the Speech audio category. 
* **Microsoft Teams Displays and Microsoft Teams Rooms devices** - Microsoft Teams Displays and Teams Rooms devices use the Microsoft Audio Stack to enable high quality hands-free, voice-based experiences with Cortana.

## Speech SDK integration

The Speech SDK integrates Microsoft Audio Stack (MAS), allowing any application or product to use its audio processing capabilities on input audio. Some of the key Microsoft Audio Stack features available via the Speech SDK include:
* **Real-time microphone input & file input** - Microsoft Audio Stack processing can be applied to real-time microphone input, streams, and file-based input. 
* **Selection of enhancements** - To allow for full control of your scenario, the SDK allows you to disable individual enhancements like dereverberation, noise suppression, automatic gain control, and acoustic echo cancellation. For example, if your scenario does not include rendering output audio that needs to be suppressed from the input audio, you have the option to disable acoustic echo cancellation.
* **Custom microphone geometries** - The SDK allows you to provide your own custom microphone geometry information, in addition to supporting preset geometries like linear two-mic, linear four-mic, and circular 7-mic arrays (see more information on supported preset geometries at [Microphone array recommendations](speech-sdk-microphone.md#microphone-geometry)).
* **Beamforming angles** - Specific beamforming angles can be provided to optimize audio input originating from a predetermined location, relative to the microphones.

## Minimum requirements to use Microsoft Audio Stack

Microsoft Audio Stack can be used by any product or application that can meet the following requirements:
* **Raw audio** - Microsoft Audio Stack requires raw (unprocessed) audio as input to yield the best results. Providing audio that is already processed limits the audio stack’s ability to perform enhancements at high quality.
* **Microphone geometries** - Geometry information about each microphone on the device is required to correctly perform all enhancements offered by the Microsoft Audio Stack. Information includes the number of microphones, their physical arrangement, and coordinates. Up to 16 input microphone channels are supported. 
* **Loopback or reference audio** - An audio channel that represents the audio being played out of the device is required to perform acoustic echo cancellation. 
* **Input format** - Microsoft Audio Stack supports down sampling for sample rates that are integral multiples of 16 kHz. A minimum sampling rate of 16 kHz is required. Additionally, the following formats are supported: 32-bit IEEE little endian float, 32-bit little endian signed int, 24-bit little endian signed int, 16-bit little endian signed int, and 8-bit signed int.

## Next steps
[Use the Speech SDK for audio processing](audio-processing-speech-sdk.md)
