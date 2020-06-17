---
title: Azure Media Player Accessibility
description: Learn more about the Azure Media Player's accessibility settings.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 04/20/2020
---

# Accessibility #

Azure Media Player works with screen reader capabilities such as Windows Narrator and Apple OSX/iOS VoiceOver. Alternative tags are available for the UI buttons, and the screen reader is capable of reading these alternative tags when the user navigates to them. Additional configurations can be set at the Operating System level.

## Captions and subtitles ##

At this time, Azure Media Player currently supports captions for only On-Demand events with WebVTT format and live events using CEA 708. TTML format is currently unsupported. Captions and subtitles allow the player to cater to and empower a broader audience, including people with hearing disabilities or those who want to read along in a different language. Captions also increase video engagement, improve comprehension, and make it possible to view the video in sound sensitive environments, like a workplace.  

## High contrast mode ##

The default UI in Azure Media Player is compliant with most device/browser high contrast view modes. Configurations can be set at the Operating System level.

## Mobility options ##

### Tabbing focus ###

Tabbing focus, provided by general HTML standards, is available in Azure Media Player. In order to enable tab focusing, you must add `tabindex=0` (or another value if you understand how tab ordering is affected in HTML) to the HTML `<video>` like so: `<video ... tabindex=0>...</video>`. On some platforms, the focus for the controls may only be present if the controls are visible and if the platform supports these capabilities.

Once tabbing focus is enabled, the end user can effectively navigate and control the video player without depending on their mouse. Each context menu or controllable element can be navigated to by hitting the tab button and selected with enter or spacebar. Hitting enter or spacebar on a context menu will expand it so the end user can continue tabbing through to select a menu item. Once you have context of the item you wish to select, hit enter or spacebar again to complete the selection.

### HotKeys ###

Azure Media Player supports controlling through keyboard hot key. In a web browser, the only way to control the underlying video element is by having focus on the player. Once there is focus on the player, hot key can control the player functionality.  The table below describes the various hot keys and their associated behavior:

| Hot key              | Behavior                                                                |
|----------------------|-------------------------------------------------------------------------|
| F/f                  | Player will enter/exit FullScreen mode                                  |
| M/m                  | Player volume will mute/unmute                                          |
| Up and Down Arrow    | Player volume will increase/decrease                                    |
| Left and Right Arrow | Video progress will increase /decrease                                  |
| 0,1,2,3,4,5,6,7,8,9  | Video progress will be changed to 0%\- 90% depending on the key pressed |
| Click Action         | Video will play/pause                                                   |

## Next steps

<!---Some context for the following links goes here--->
- [Azure Media Player Quickstart](azure-media-player-quickstart.md)