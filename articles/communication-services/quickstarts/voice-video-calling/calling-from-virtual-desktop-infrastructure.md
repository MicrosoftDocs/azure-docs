---
title: Optimize audio calling from within an azure virtual desktop VDI environment
titleSuffix: An Azure Communication Services article
description: This article describes how to place audio Calls that are hosted and managed on an Azure Virtual Desktop. Environment and use VDI technologies to manage the full call workflow.
author: sloanster
ms.author: micahvivion
services: azure-communication-services
ms.date: 10/30/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Place audio calls from Azure Virtual Desktop

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

This document explains how to enable and optimize calling scenarios using Azure Communication Services (ACS) within Virtual Desktop Infrastructure (VDI). It covers setup, workflows, limitations, requirements, and troubleshooting for IT professionals, business leaders, and technical teams.

## What is VDI?

VDI stands for **Virtual Desktop Infrastructure** — a technology that allows users to access a desktop operating system hosted on a centralized server. Instead of running the OS locally on your device, you're essentially streaming a desktop experience from the cloud or a data center.

## What VDI Does

-   **Centralizes desktop environments**: All desktops are hosted on virtual machines in a data center.
-   **Delivers remote access**: Users connect to their virtual desktops via a client device (PC, tablet, thin client, etc.).
-   **Separates hardware from experience**: You can run a powerful Windows desktop on a lightweight device.

## Why Businesses Use VDI

Businesses adopt Virtual Desktop Infrastructure (VDI) for a wide range of strategic and operational benefits. By centralizing desktop environments on secure servers, VDI enhances data protection—user IP addresses are masked, and sensitive information remains within the corporate network, reducing exposure to external threats. It streamlines software deployment and updates, allowing IT teams to roll out applications or patches across hundreds of virtual desktops simultaneously, without needing to touch individual devices. VDI also simplifies compliance with regulatory standards by enabling centralized control over data access, storage, and auditing, which is especially critical in industries like healthcare, finance, and legal services. Moreover, VDI supports scalability and flexibility, making it easy to onboard new employees, support seasonal workloads, or enable remote work without investing in high-end hardware. With built-in disaster recovery options and centralized management, VDI empowers organizations to maintain business continuity while reducing operational complexity and cost

## **Common Use Cases for VDI Calling**

| **Scenario**                        | **Description**                                                                |
|-------------------------------------|--------------------------------------------------------------------------------|
| Contact Centers & Customer Support  | Secure access to CRM and call management; centralized analytics and compliance |
| Remote & Hybrid Workforces          | Softphone apps (Teams, Zoom, Jabber) from any device; secure call data         |
| Healthcare & Telemedicine           | Secure video consultations; HIPAA compliance                                   |
| Financial Services & Trading Floors | High-volume calls; multi-monitor setups; secure platforms                      |
| Legal & Compliance Teams            | Confidential calls; centralized call logs and recordings                       |
| Global Teams & Offshore Ops         | Seamless collaboration; unified communications; privacy protection             |

## Enabling Calling Experiences on Azure Virtual Desktop

To support real-time calling functionality from an Azure Virtual Desktop (AVD) virtual machine, several components must be installed and configured across both the local endpoint and the virtual desktop environment. The key components required for optimized media redirection and seamless communication include:

### Remote Desktop Client (Windows App)
- Installed on the **local endpoint device**. This is the computer that the local user connects to their AVD instance.
- Establishes the remote session and **redirects local peripherals** (microphone, camera, speakers)
- Enables **optimized media redirection (OMR)** for low-latency, high-quality real-time communication
- To enable Azure Communication Services (ACS) calling from a Virtual Desktop Infrastructure (VDI) environment, the Remote Desktop Client (Windows App) must be properly installed and configured on the local endpoint device — the physical machine used by the end user to connect to their Azure Virtual Desktop (AVD) session.See [here](/windows-app/overview) for more details on the Windows App.
> [!NOTE]
> Calling to an Azure Virtual Desktop using the Azure Communication Services WebJS Calling SDK is only supported on the Windows version of the Windows App. Other platform versions (e.g., macOS, web, mobile) do not support this functionality.

### Media Optimization Host (MMR Host)
- Installed on the **AVD virtual machine**
- Acts as a bridge between the Remote Desktop Client and the browser extension
- Offloads media processing to the local endpoint, reducing **latency** and **CPU usage** on the VM
- **Installing the Media Optimization Host for AVD** To enable media optimization for calling scenarios using Azure Communication Services (ACS) on Azure Virtual Desktop (AVD), you must install the Media Optimization component on the AVD session host. For detailed installation steps and prerequisites, refer to the [installation instructions for multimedia redirection on session hosts](/azure/virtual-desktop/multimedia-redirection-video-playback-calls?tabs=intune&pivots=azure-virtual-desktop#install-multimedia-redirection-on-session-hosts).

### Web Plugin Browser Extension
- Installed in the **browser** (Microsoft Edge or Google Chrome) on the AVD VM.
- Interfaces with the MMR Host to support **device enumeration** and **media routing**
- Required for enabling calling features in browser-based communication platforms
- **Install the Web Plugin Extension on the Azure Virtual Desktop VM** The Web plugin must be installed directly on the AVD VM instance. For complete installation instructions and guidance on managing the browser extension centrally, please refer to the official Microsoft documentation on how to [enable and manage the browser extension centrally](/azure/virtual-desktop/multimedia-redirection-video-playback-calls?tabs=intune&pivots=azure-virtual-desktop#enable-and-manage-the-browser-extension-centrally).

## Supported Features & Limitations

| **Feature**              | **Supported in VDI?** | **Notes**                                                                                                                                                                                                                                                                                                                                          |
|--------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Audio Calling            | Yes                   | Advanced audio effects (noise suppression, echo cancellation) supported |
| Video Calling            | No                    | Not currently supported with ACS over VDI                               |
| Raw Media Stream         | No                    | Real-time volume visualization not available |
| Media Capture/WebRTC API | No                    | Direct access not supported; affects low-level device control           |

> [!IMPORTANT]
> Using Azure Communication Service WebJS  to make calls to an Azure Virtual Desktop is in **public preview**. You must use calling versions [1.42.2-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.42.2-beta.1) version or higher.

## VDI Communication Workflow

The following outlines the process of a standard ACS Calling session within a VDI-enabled environment in a step-by-step procedure:

1.  **User Launches Remote Desktop Session**
    -   The user opens the Remote Desktop Client (Windows App) on their local machine.
    -   A session is initiated with the VM where the ACS Calling application is hosted.
2.  **Device Redirection**
    -   The Remote Desktop Client redirects local audio/video devices (mic, camera, speakers) to the VM.
    -   These devices become available to the browser inside the VM.
3.  **ACS Calling SDK Initialization**
    -   The user opens a browser on the VM and navigates to the ACS Calling-enabled web app.
    -   The Web Plugin Extension activates and interfaces with the MMR host.
4.  **Call Setup**
    -   The ACS Calling SDK initiates a call using Azure Communication Services.
5.  **Media Optimization**
    -   The SDK forwards call operations API to the local endpoint via MMR host.
    -   Audio is rendered locally, reducing latency and improving quality.
6.  **In-Call Experience**
    -   The user experiences real-time communication with minimal delay.
    -   Device switching and other features are supported via the plugin and MMR host.
7.  **Call Termination**
-   When ending the call, the SDK cleans up media sessions.
-   The MMR host and plugin gracefully disconnect and release resources.

## Audio Effects Support in VDI audio calling scenarios

Azure Communication Services (ACS) supports advanced **audio effects** such as **noise suppression** and **echo cancellation**, which are  valuable in **call center environments running on Virtual Desktop Infrastructure (VDI)**. **Deep Noise Suppression**. These enhancements help improve audio quality during calls and recordings, even within the constraints of VDI.

## System & Infrastructure Requirements

-   **Operating System:** Windows 11 or later (latest stable release recommended)
-   **Virtual Machine:** Hosted on Azure Virtual Desktop (AVD); only supported versions compatible
-   **Remote Desktop Client:** Latest supported version required; must allow network access to res.public.onecdn.static.microsoft
-   **ACS SDK:** Use supported versions validated for VDI scenarios; update regularly

## How to enable VDI optimization from the VM perspective

**Enable the VDI3**

```javascript
new CallClient({
vdi3: {
enabled: true
}

});
```
The default value is false.

**The call object isn't immediately accessible when the call is created with synchronous functions**

There are two ACS APIs that create a call object but are synchronous functions *startCall* and *join* :
```javascript
startCall(participants: (CommunicationUserIdentifier \| PhoneNumberIdentifier \| MicrosoftTeamsAppIdentifier \| UnknownIdentifier)[], options?: StartCallOptions): Call;
startCall(participants: (CommunicationIdentifier)[], options?: StartCallOptions): Call;
join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
join(groupChatCallLocator: GroupChatCallLocator, options?: JoinCallOptions): Call;
join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): Call;
join(meetingLocator: TeamsMeetingIdLocator, options?: JoinCallOptions): Call;
join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
join(roomLocator: RoomLocator, options?: JoinCallOptions): Call;
```
These two APIs return a call object. However, due to the asynchronous nature of VDI remoting, some of the properties in the call object aren't available when the function call returns.

To address this issue, the ACS Calling SDK blocks the operation by throwing an error until the call object is fully initialized.
```javascript
"CALL_INITIALIZING": {
message": "The call object is initializing",
"code": 400,
"subCode": 46604,
"resultCategories": [
"ExpectedError"
]
}
```
The app should subscribe to callsUpdated event.  
In VDI3 scenario, when the call is initiated, the SDK fires callsUpdated event and put the call object in the added argument.
```javascript
callAgent.on('callsUpdated', e => {
  e.added.forEach(call => {
    // call object has been initialized
  });
});
//...
// join() returns a call object, but don't use the call object now

callAgent.join({ groupId: this.destinationGroup.value }, callOptions);

**The callAgent cannot be used after the RDP recovers from disconnection**
```
Currently, the MMR doesn't keep the state after RDP connection has dropped. The states between the thin client and VM aren't synchronized in this case.  
If the RDP is disconnected during an ACS call, the SDK fires stateChanged event and marks the call as disconnected.  
The code/subcode is 0/4521
```javascript
{
    callControllerCode: 0,
    callControllerSubCode: 4521,
    phrase: 'call ended due to RDP disconnection',
    resultCategories: [skype.calling.ResultCategory.ExpectedError]
}
```

Any operation on the Call/CallAgent/DeviceManager object results in an error.
```javascript
"REMOTE_STACK_TERMINATED": {
message": "The remote stack has been terminated. Re-initialize the CallClient",
"code": 500,
"subCode": 46605,
"resultCategories": [
"UnexpectedClientError"
]
}
```

The application has to create a new CallClient and a CallAgent.

## FAQ

### Error: **The MMR extension isn't loaded** (Browser Debug Console)

This error indicates that the Microsoft Multimedia Redirection (MMR) extension is either not installed, not enabled, or not properly configured.

1. **Verify Extension Installation**
   - Ensure the MMR browser extension is installed and enabled in your browser (Chrome or Edge).
   - You can find installation links in the FAQ section for missing extensions.

2. **Enable Call Redirection**
   - Confirm that the **"Enable call redirection for all sites"** setting is turned on.

3. **Check Registry Key (Thin Clients)**
   - If the call redirection option is missing, verify that the required registry key is set on the thin client.

   - For detailed instructions, refer to the official documentation:  
     [Multimedia redirection for video playback and calls in a remote session – Microsoft Learn](/azure/virtual-desktop/multimedia-redirection-video-playback-calls?tabs=intune&pivots=azure-virtual-desktop#enable-call-redirection-for-all-sites-for-testing)
     
4. **Restart Browser or Restart the Remote Desktop Client app**
   - If you update registry key, you need to close existing Remote Desktop Client app and reopen it
   - If you update the browser extension or extension configuration, you need to restart the browser.

### **MsMMRHostInstaller_...msi installation failed**  
This error isn't expected and typically indicates an issue during the installation process. To help us diagnose the problem, collect and share the relevant log files.
Where to Find the Logs. The default location to navigate to:
C:\Users\<your-username>\AppData\Local\Temp
- Look for files with the prefix MSI (example MSI37700.LOG)
- Sort the folder by timestamp to locate the most recent logs related to the failed installation.
- Additionally, check for the presence of:
MsRDCMMRHostInstall.log
- If this file exists, include it as well—it contains detailed information about the host installer process.

Once you've gathered the logs, share them with your support contact or engineering team for further analysis. These files are essential for identifying the root cause and determining the appropriate fix

### **The MMR extension isn't installed**  
The Microsoft Multimedia Redirection (MMR) browser extension is required for proper functionality and should be installed automatically when running the `MsMMRHostInstaller`.

1. **Ensure Browsers Are Closed During Installation**
   - Before running `MsMMRHostInstaller`, make sure all browser windows (Chrome, Edge, etc.) are closed.
   - Open browsers can prevent the extension from being installed correctly.
2. **Manual Installation (if automatic install fails)**
   - If the extension is still missing after installation, you can install it manually from the appropriate browser store:

     - **Chrome**:  
       [Microsoft Multimedia Redirection – Chrome Web Store](https://chromewebstore.google.com/detail/microsoft-multimedia-redi/lfmemoeeciijgkjkgbgikoonlkabmlno)

     - **Edge**:  
       [Microsoft Multimedia Redirection – Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/microsoft-multimedia-redi/joeclbldhdmoijbaagobkhlpfjglcihd)

3. **Verify Installation**
   - After installation, restart your browser and confirm the extension appears in your browser’s extension list.

### **Errors thrown after Remote Desktop has been disconnected and reconnected**  
You may encounter errors after reconnecting to a Remote Desktop session. This behavior is **expected** due to how the Azure Communication Services (ACS) SDK handles connection timeouts.

- When a Remote Desktop session is disconnected or ACS messages time out (typically after 30 seconds), the SDK triggers a **call disconnect event**.
- After this event, any further operations on the existing `CallClient` or `CallAgent` will fail.

To recover from this state:

1. Create a new instance of `CallClient`.
2. Use the new `CallClient` to create a fresh `CallAgent`.

This guarantees that your application reestablishes communication seamlessly after a Remote Desktop reconnection.
