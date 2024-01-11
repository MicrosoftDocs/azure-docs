---
title: Performance evaluations for Embedded Speech - Speech service
titleSuffix: Azure AI services
description: Learn how to evaluate performance of embedded speech models on your target devices.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/28/2023
ms.author: eur
---

# Evaluating performance of Embedded Speech

Embedded speech models run fully on your target devices. Understanding the performance characteristics of these models on your devices’ hardware can be critical to delivering low latency experiences within your products and applications. This guide provides information to help answer the question, "Is my device suitable to run embedded speech to text and speech translation models?"

## Metrics & terminology

**Real-time factor (RTF)** – The real-time factor (RTF) of a device measures how fast the embedded speech model can process audio input. It's the ratio of the processing time to the audio length. For example, if a device processes a 1-minute audio file in 30 seconds, the RTF is 0.5. This metric evaluates the computational power of the device for running embedded speech models. It can help identify devices that are too slow to support the models. Measurement of this metric should only be done using file-based input rather than real-time microphone input.  

To support real-time & interactive speech experiences, the device should have an RTF of `1` or lower. An RTF value higher than `1` means that the device can't keep up with the audio input and will cause poor user experiences. 

When measuring the RTF of a device, it's important to measure multiple samples and analyze the distribution across percentiles. This allows you to capture the effect of variations in the device's behavior like different CPU clock speeds due to thermal throttling. The predefined measurement tests outlined in [Measuring the real-time factor on your device](#measuring-the-real-time-factor-on-your-device) automatically measure the RTF for each speech recognition result, yielding a sufficiently large sample size. 

**User-perceived latency (UPL)** – The user-perceived latency (UPL) of speech to text is the time between a word being spoken and the word being shown in the recognition results.

## Factors that affect performance 

**Device specifications** – The specifications of your device play a key role in whether embedded speech models can run without performance issues. CPU clock speed, architecture (for example, x64, ARM processor, etcetera), and memory can all affect model inference speed.  

**CPU load** – In most cases, your device is running other applications in parallel to the application where embedded speech models are integrated. The amount of CPU load your device experiences when idle and at peak can also affect performance. 

For example, if the device is under moderate to high CPU load from all other applications running on the device, it's possible to encounter performance issues for running embedded speech in addition to the other applications, even with a powerful processor.  

**Memory load** – An embedded speech to text model consumes between 200-300 MB of memory at runtime. If your device has less memory available than that for the embedded speech process to use, frequent fallbacks to virtual memory and paging can introduce more latencies. This can affect both the real-time factor and user-perceived latency. 

## Built-in performance optimizations 

All embedded speech to text models come with a Voice Activity Detector (VAD) component that aims to filter out silence and non-speech content from the audio input. The goal is to reduce the CPU load and the processing time for other speech to text model components. 

The VAD component is always on and doesn't need any configuration from you as the developer. It works best when the audio input has non-negligible amounts of silence or non-speech content, which is common in scenarios like captioning, commanding, and dictation. 

## Measuring the real-time factor on your device 

For all embedded speech supported platforms, a code sample is available on GitHub that includes a performance measurement mode. In this mode, the goal is to measure the real-time factor (RTF) of your device by controlling as many variables as possible: 

- **Model** – The English (United States) model is used for measurement. Models for all other supported locales follow similar performance characteristics, so measuring through the English (United States) model is sufficient.  

- **Audio input** – A prebuilt audio file designed for RTF measurements is made available as a supplemental download to the sample code. 

- **Measurement mechanism** – The start and stop markers of time measurement are preconfigured in the sample to ensure accuracy and ease of comparing results across different devices & test iterations. 

This measurement should be done with the sample running directly on your target device(s), with no code changes other than specifying your model paths & encryption key. The device should be in a state that represents a real end-user state when embedded speech would be used (for example, other active applications, CPU & memory load, etc.).  

Running the sample yields performance metrics outputted to the console. The full suite of metrics includes the real-time factor along with other properties like CPU usage and memory consumption. Each metric is defined and explained below.

### Instruction set metrics

| Metric | Description | Notes |
|--------|-------------|-------|
| AVX512Supported | True if CPU supports AVX512 instruction set. | This flag is for X64 platforms. ONNX runtime has optimizations for the various instruction sets, and having this information can help diagnose inconsistencies. |
| AVXSupported | True if CPU supports AVX instruction set. | This flag is for X64 platforms. ONNX runtime has optimizations for the various instruction sets, and having this information can help diagnose inconsistencies. |
| AVX2Supported  | True if CPU supports AVX2 instruction set. | This flag is for X64 platforms. ONNX runtime has optimizations for the various instruction sets, and having this information can help diagnose inconsistencies. |
| SSE3Available  | True if CPU supports SSE3 instruction set. | This flag is for X64 platforms. ONNX runtime has optimizations for the various instruction sets, and having this information can help diagnose inconsistencies. |
| NEONAvailable  | True if CPU supports NEON instruction set. | This flag is for ARM processor platforms. ONNX runtime has optimizations for the various instruction sets, and having this information can help diagnose inconsistencies. |
| NPU  | Name of Neural Processing Unit, or N/A if none found. | This flag is for hardware acceleration. |

### Memory metrics

| Metric | Description | Notes |
|--------|-------------|-------|
| PagefileUsage | Amount of page file used by process. Implemented for Linux and Windows. | Values are relative to the machine configuration. |
| WorkingSetSize | Amount of memory used for the process. | |
| ProcessCPUUsage | Aggregate of CPU usage for the process. | Includes all threads in the process, including Speech SDK and UI threads. Aggregated across all cores. |
| ThreadCPUUsage | Aggregate of CPU usage for the speech recognition or speech translation thread. | |

### Performance metrics

| Metric | Description | Notes |
|--------|-------------|-------|
| RealTimeFactor | Measures how much faster than real-time the embedded speech engine is processing audio. Includes audio loading time. | Values greater than `1` indicate that the engine is processing audio slower than real-time. Values less than `1` indicate the engine is processing audio faster than real-time. This value should only be analyzed in file-based input mode. It shouldn't be analyzed in streaming input mode. |
| StreamingRealTimeFactor | Measures how much faster than real-time the engine is processing audio. Excludes audio loading time.  | Values greater than `1` indicate that the engine is processing audio slower than real-time. Values less than `1` indicate the engine is processing audio faster than real-time. |