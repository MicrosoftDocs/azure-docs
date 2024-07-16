---
description: Enable scenarios using closed captions and the UI Library in iOS
author: garchiro7

ms.author: jorgegarc
ms.date: 07/01/2024
ms.topic: include
ms.service: azure-communication-services
---

### Enable closed captions

```swift
let captionsOptions = CaptionsOptions(
    captionsOn: false, 
    spokenLanguage: "en-US"
)

let localOptions = LocalOptions(
    participantViewData: participantViewData,
    setupScreenViewData: setupScreenViewData,
    cameraOn: false,
    microphoneOn: false,
    skipSetupScreen: false,
    audioVideoMode: .audioAndVideo,
    captionsOptions: captionsOptions
)

```

