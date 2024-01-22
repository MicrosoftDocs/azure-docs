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

# Overview of Audio Only Mode
[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

"Audio Only Mode" is a feature designed for scenarios where video functionality is either not required or not feasible. This mode ensures users have a mechanism to communicate, utilizing only audio, thereby addressing various needs such as privacy, security, and resource conservation.

### For Third-party Application Developers:
Enabling Audio Only Mode in the UI Library is done via configuration of the `CallComposite`. Once enabled, all video will be disabled, including both local and remote streams. This must be initialized before starting the call and will persist for the duration of the call.

### Feature Description
- Configuration to enabled/disable video
- Disables remote video
- Disables local camera
- Suppresses options to control video in the UI

#### User Interface Adaptations
- Camera Button removed
- Video related icons hidden
- Only users Avatar and Mic status will be visible

### Technical Considerations

#### Bandwidth and Resource Optimization
In cases where their is device constraints, such as battery and battery limitations, Audio Only Mode can be used to reduce the demands on the system. This can be propagated to the User to create communication solutions that are less resource intensive.

#### Security and Privacy Enhancements
In some cases, Privacy or Security may be a consideration. Audio Only Mode will help ensure that no visual data from that client is transmitted off the device.

### Use Cases and Scenarios

1. **Remote Field Operations**: Field agents often work in remote areas with limited internet connectivity. Using "Audio Only Mode" allows these agents to participate in crucial meetings without worrying about unstable video feeds, ensuring uninterrupted communication despite bandwidth constraints.

1. **Privacy during Home Office**: Many of employees work from home and prefer not to share their private living spaces during calls. "Audio Only Mode" respects their privacy while maintaining high-quality communication, allowing team members to focus on the discussion without the pressure of being on camera.

1. **Accessibility for Visually Impaired Employees**: For visually impaired people, "Audio Only Mode" simplifies the user interface, making it easier to navigate and participate in calls, thereby enhancing their work experience and productivity.

1. **Energy Conservation Initiatives**: As part of its sustainability efforts, Contoso encourages the use of "Audio Only Mode" in internal communications to save energy. Since audio calls require significantly less battery power compared to video calls, this mode aligns with the company's goals to reduce its environmental footprint.

