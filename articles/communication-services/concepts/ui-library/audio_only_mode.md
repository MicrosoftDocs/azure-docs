---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Audio Only mode in the UI Library
description: Enabling audio only calling experiences
author:      ahammer # GitHub alias
ms.author:   adamhammer # Microsoft alias
ms.service: azure-communication-services
ms.topic: conceptual
ms.date:     01/08/2024
ms.subservice: calling
---

# Audio Only Mode: Overview

**Public Preview Notice**

**Audio Only Mode** is a specialized feature designed for situations where video functionality is unnecessary or impractical. This mode offers an audio-centric communication solution, addressing various needs including privacy, security, and resource efficiency.

### For Third-party Application Developers:

To integrate Audio Only Mode in your application, configure the CallComposite in your UI Library. This configuration disables all video functionalities, both local and remote, for the entire call duration. It's crucial to activate this mode before initiating the call.

### Feature Description

- Toggle configuration for video enablement or disablement.
- Disables both remote and local video streams.
- Automatically hides video control options in the user interface.

### User Interface Adaptations

- Removal of the Camera button.
- Concealment of video-related icons.
- Remote Video or shared content becomes non-visible.
- Display of user's Avatar and Microphone status.

### Technical Considerations

#### Bandwidth and Resource Optimization

Audio Only Mode is ideal for device-limited scenarios, such as low battery or memory constraints. It lessens the system's load, facilitating smoother, less resource-demanding communications.

#### Security and Privacy Enhancements

In situations where privacy or security is paramount, Audio Only Mode ensures that no visual data is transmitted from the user's device.

### Use Cases and Scenarios

- **Remote Field Operations**: Facilitates uninterrupted communication in areas with limited internet, removing concerns about unstable video feeds.
- **Privacy during Home Office**: Respects personal space by eliminating video during calls, ensuring comfortable and focused discussions.
- **Accessibility for Visually Impaired Employees**: Simplifies the user interface, enhancing ease of use and participation in calls.
- **Energy Conservation Initiatives**: As part of sustainability efforts, this mode is recommended for internal communications to save energy, aligning with environmental goals.
