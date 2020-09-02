---
title: Calling SDK Browser Support
description: TODO
author: mikben    
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services

---
# Calling SDK Browser Support matrix

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


| Platform/ Competitor  | JS                  | iOS                   | Android|
| --------              | ------------------- | --------------------- |--------------------- |
| Azure Communication Services                |  **Chrome**, new **Edge**, supported versions: current + 2 previous releases    | **Safari**, version 13+               | **Chrome**  supported versions: current + 2 previous releases                 | 
| Amazon Chime SDK      | **Mozilla Firefox** (version   60 and later), for macOS and Windows<br/>**Google Chrome** (version 78 and later), for macOS, Windows, and Ubuntu LTS 16.04 and later<br/>**Chromium-based Edge** (version 79 and later), for Windows<br/>**Chromium-based Electron** (Electron 7 and later, with Chromium version 78 and later)<br/>**Safari** (version 12, audio and video only, no content sharing), for macOS<br/>**Safari** (version 13 and later, content sharing with screen capture requires turning on the Develop, Experimental Features, Screen Capture feature in the browser), for macOS<br/>**Opera** (version 66 and later), for macOS and Windows | **Safari** (version 12.1.1 and later, audio and video only, no content sharing), for iOS (version 10.0 and later)           | **Google Chrome** for Android also supported for audio and video only (no content sharing) (version 5.0 and later, ARM and ARM64 architecture)           | 
| Twilio                |          **Chrome** for Linux, windows, macOS, <br/>**Firefox** for Linux, windows, macOS, <br/>**Safari** for macOS, <br/>**Edge** (Legacy*** & Chromium) for windows           |           **Safari** (WebRTC support started with version 11)            |             **Chrome, <br/>Firefox**          |


## Browsers for each platform


|                       | Windows             | macOS                 | Android             | Linux                | Ubuntu               | iOS
| --------              | ------------------- | --------------------- |--------------------- |--------------------- |--------------------- |--------------------- |
| **Azure Communication Services**                 |  Chrome, new Edge     | Chrome, Safari                  | Chrome                 | Chrome                 |   Chrome                   |          Safari            |
|  **Amazon Chime SDK**     | Firefox, <br/>Chrome,<br/>Chromium-based Edge,<br/>Chromium-based Electron<br/>Opera | Safari, <br/>Opera              |   Chrome          |       -           |        Chrome              |   Safari       |
| **Twilio**                | Firefox,<br/>Chrome,<br/>Edge (Legacy*** & Chromium) – will be deprecated 1st of September 2020 |  Firefox,<br/>Chrome,<br/>Safari  |           Firefox,<br/>Chrome   |  Firefox,<br/>Chrome        |            -          |Safari (WebRTC support started with version 11), <br/>Chrome and Firefox for iOS do not have access to WebRTC APIs



