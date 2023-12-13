---
title: Audio concepts in Azure AI Speech
titleSuffix: Azure AI services
description: An overview of audio concepts in Azure AI Speech.
author: mswellsi
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 12/12/2023
ms.author: wellsi
---

# Audio concepts in Azure AI Speech

The Speech service accepts and provides audio in multiple formats, and the area of audio is a complex topic but some background information can be helpful.

## Audio concepts

Speech is inherently analog, which is approximated by converting it to a digital signal by sampling. The number of times it's sampled per second is the sampling rate, and how accurate each sample is defined by the bit-depth.
 
### Sample Rate
How many audio samples there are per second. A higher sampling rate will more accurately reproduce higher frequencies such as music. Humans can typically hear between 20 Hz and 20 kHz but most sensitive up to 5 kHz. The sample rate needs to be twice the highest frequency so for human speech a 16-kHz sampling rate is normally adequate, but a higher sampling rate can provide a higher quality although larger files. The default for both STT and TTS is 16 kHz, however 48 kHz is recommended for audio books. Some source audio is in 8 kHz, especially when coming from legacy telecom systems, which will result in degraded results.
 
### Bit-depth
Uncompressed audio samples are each represented by many bits that define its accuracy or resolution. For human speech 13 bits are needed, which is rounded up to a 16-bit sample. A higher bit-depth would be needed for professional audio or music. Legacy telephony systems often use 8 bits with compression, but it isn't ideal.
 
### Channels
The speech service typically expects and provides a mono stream. The behavior of stereo and multi-channel files is API specific, for example the REST STT will split a stereo file and generate a result for each channel. TTS is mono only.
 
## Audio formats and codecs
 
For the Speech service to be able to use the audio it needs to know how it's encoded. Also as audio files can be relatively large it's common to use compression to reduce their size. Audio files and streams can be described by their container format and the audio codec. Common containers are WAV or MP4 and common audio formats are PCM or MP3. You normally can't presume that a container uses a specific audio format, for instance .WAV files often contain PCM data but other audio formats are possible.
 
### Uncompressed Audio
 
The Speech service internally works on uncompressed audio, which is encoded with Pulse Code Modulation (or PCM). This means that every sample represents the amplitude of the signal. This is a simple representation for processing, but not space efficient so compression is often used for transporting audio.
 
### Lossy compressed audio
 
Lossy algorithms might enable greater compression resulting in smaller files or lower bandwidth, which can be important on mobile connections or busy networks. A common audio format is MP3, which is an example of lossy compression. MP3 files are significantly smaller than the originals, and might sound nearly identical to the original, but you can't recreate the exact source file. Lossy compression works by removing parts of the audio or approximating it. When encoding with a lossy algorithm you trade off bandwidth for accuracy.
 
MP3 was designed for music rather than speech.
AMR and AMR-WB were designed to efficiently compress speech for mobile phones, and won't work as well representing music or noise.

A-Law and Mu-Law are older algorithms that compress each sample by itself, and converts a 16-bit sample to 8 bit using a logarithmic quantization technique. It should only be used to support legacy systems.
 
### Lossless compressed audio
 
Lossless compression allows you to recreate the original uncompressed file. The compressed file is typically much smaller than the original, without any loss, but the actual compression depends on the input. It achieves compression by uses multiple methods to remove redundancy from the file.
 
The most common lossless compression is FLAC.

## Next steps
[Use the Speech SDK for audio processing](audio-processing-speech-sdk.md)
