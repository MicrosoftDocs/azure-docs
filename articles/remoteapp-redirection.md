<properties title="Using redirection in Azure RemoteApp" pageTitle="Using redirection in Azure RemoteApp" description="Learn how to configure and use redirection in RemoteApp" metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo" manager="mbaldwin" />

<tags ms.service="remoteapp" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/23/2015" ms.author="elizapo" />

#Using redirection in Azure RemoteAppp

Device redirection lets your users interact with remote apps using the devices attached to their local computer, phone, or tablet. For example, if you have provided Skype through RemoteApp, your users need the camera installed on their phone to work with Skype. This is also true for printers, speakers, monitors, and a range of USB-connected peripherals.

RemoteApp leverages the Remote Desktop Protocol (RDP) and RemoteFX to provide redirection.

##What redirection is enabled by default?
When you use RemoteApp, the following redirections are enabled by default. The information in parentheses show the RDP setting.

- Play sounds on the local computer (**Play on this computer**). (audiomode:i:0)
- Capture audio from the local computer and send to the remote computer (**Record from this computer**). (audiocapturemode:i:1)
- Print to local printers (redirectprinters:i:1)
- COM ports (redirectcomports:i:1)
- Smart card device (redirectsmartcards:i:1)
- Clipboard (ability to copy and paste) (redirectclipboard:i:1)
- Clear type font smoothing (allow font smoothing:i:1)
- Redirect all supported Plug and Play devices. (devicestoredirect:s:*)

##What other redirection is available?
Two redirection options are disabled by default:

- Drive redirection (drive mapping): Your local computer's drives become mapped drives in the remote session. This lets you save or open files from your local drives while you work in the remote session. 
- USB redirection: You can use the USB devices attached to your local computer within the remote session.

##Change your redirection settings in RemoteApp
Right now, only Microsoft Support can change your redirection settings. Contact support or send us an [email](mailto:remoteappforum@microsoft.com).

   

