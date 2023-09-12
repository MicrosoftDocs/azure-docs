---
title: Privacy guidelines for voice assistants on Windows
titleSuffix: Azure AI services
description:  The instructions to enable voice activation for a voice agent by default.
services: cognitive-services
author: cfogg6
manager: trrwilson
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: travisw
ms.custom: cogserv-non-critical-speech
---
# Privacy guidelines for voice assistants on Windows

It's important that users are given clear information about how their voice data is collected and used and important that they are given control over if and how this collection happens. These core facets of privacy -- *disclosure* and *consent* -- are especially important for voice assistants integrated into Windows given the always-listening nature of their use.

Developers creating voice assistants on Windows must include clear user interface elements within their applications that reflect the listening capabilities of the assistant.

> [!NOTE]
> Failure to provide appropriate disclosure and consent for an assistant application, including after application updates, may result in the assistant becoming unavailable for voice activation until privacy issues are resolved.

## Minimum requirements for feature inclusion

Windows users can see and control the availability of their assistant applications in **`Settings > Privacy > Voice activation`**.

 > [!div class="mx-imgBorder"]
 > [![Screenshot shows options to control availablity of Cortana. ](media/voice-assistants/windows_voice_assistant/privacy-app-listing.png "A Windows voice activation privacy setting entry for an assistant application")](media/voice-assistants/windows_voice_assistant/privacy-app-listing.png#lightbox)

To become eligible for inclusion in this list, contact Microsoft at winvoiceassistants@microsoft.com to get started. By default, users will need to explicitly enable voice activation for a new assistant in **`Settings > Privacy > Voice Activation`**, which an application can protocol link to with `ms-settings:privacy-voiceactivation`. An allowed application will appear in the list once it has run and used the `Windows.ApplicationModel.ConversationalAgent` APIs. Its voice activation settings will be modifiable once the application has obtained microphone consent from the user.

Because the Windows privacy settings include information about how voice activation works and has standard UI for controlling permission, disclosure and consent are both fulfilled. The assistant will remain in this allowed list as long as it does not:

* Mislead or misinform the user about voice activation or voice data handling by the assistant
* Unduly interfere with another assistant
* Break any other relevant Microsoft policies

If any of the above are discovered, Microsoft may remove an assistant from the allowed list until problems are resolved.

> [!NOTE]
> In all cases, voice activation permission requires microphone permission. If an assistant application does not have microphone access, it will not be eligible for voice activation and will appear in the voice activation privacy settings in a disabled state.

## Additional requirements for inclusion in Microphone consent

Assistant authors who want to make it easier and smoother for their users to opt in to voice activation can do so by meeting additional requirements to adequately fulfill disclosure and consent without an extra trip to the settings page. Once approved, voice activation will become available immediately once a user grants microphone permission to the assistant application. To qualify for this, an assistant application must do the following **before** prompting for Microphone consent (for example, by using the `AppCapability.RequestAccessAsync` API):

1. Provide clear and prominent indication to the user that the application would like to listen to the user's voice for a keyword, *even when the application is not running*, and would like the user's consent
1. Include relevant information about data usage and privacy policies, such as a link to an official privacy statement
1. Avoid any directive or leading wording (for example, "click yes on the following prompt") in the experience flow that discloses audio capture behavior

If an application accomplishes all of the above, it's eligible to enable voice activation capability together with Microphone consent. Contact winvoiceassistants@microsoft.com for more information and to review a first use experience.

> [!NOTE]
> Voice activation above lock is not eligible for automatic enablement with Microphone access and will still require a user to visit the Voice activation privacy page to enable above-lock access for an assistant.

## Next steps

> [!div class="nextstepaction"]
> [Learn about best practices for voice assistants on Windows](windows-voice-assistants-best-practices.md)
