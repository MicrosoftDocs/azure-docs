---
title: Windows Virtual Desktop Linux SDK Overview - Azure
description: A brief overview of the Windows Virtual Desktop Linux SDK.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 01/23/2020
ms.author: helohr
---
# Windows Virtual Desktop Linux SDK

The Linux SDK for Windows Virtual Desktop may be used to build a standalone Windows Virtual Desktop client or enable your client application to support Windows Virtual Desktop. This guide provides an overview of the Linux SDK as well as instructions to get started.

## Linux SDK overview

### Supported Linux distributions

The SDK is compatible with most operating systems built on Ubuntu 18.04 and newer. We will work with partners on a case-by-case basis to evaluate support for other Linux distributions.

### How the Linux SDK works

You can use the SDK's APIs to retrieve a Windows Virtual Desktop resource feed, connect to desktop and remote application sessions, and leverage many of the redirections supported by our first party clients.

### Feature support

The SDK supports multiple connections to desktop and remote application sessions. The following redirections are supported:

| Redirection       | Supported |
| :---------------- | :-------: |
| Keyboard          | x         |
| Mouse             | x         |
| Audio in          | x         |
| Audio out         | x         |
| Clipboard (text)  | x         |
| Clipboard (image) | x         |
| Clipboard (file)  | x         |
| Smartcard         | x         |
| Drive/folder      | x         |

The SDK also supports multiple monitor display configurations. The monitors selected for the session must be contiguous.

We will continue to update this document as we add support for new features and redirections. To suggest additional features or redirection support, please visit our [UserVoice page](https://aka.ms/wvd/linuxsdk/feedback).

## Get started with the Linux SDK

### Prerequisites

Before developing a Linux client for Windows Virtual Desktop, we ask that our partners take the following steps:

1. Build and deploy a Windows Virtual Desktop environment for testing or production use.
2. Test the available first-party clients to familiarize yourself with the Windows Virtual Desktop end user experience.

### Next steps

To get started working with the Linux SDK, reach out on our [Tech Community forum](https://aka.ms/wvdtc).
