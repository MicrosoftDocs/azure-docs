---
title: Azure Communication Services UI Framework capabilities
titleSuffix: An Azure Communication Services conceptual document
description: Learn about UI Framework capabilities
author: ddematheu2
ms.author: dademath
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services

---

# UI Framework capabilities

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

The Azure Communication Services UI Framework lets you build communication experiences using a set of reusable components. These components come in two flavors: **Base** components are the most basic building blocks of your UI experience, while combinations of these base components are called **composite** components.

## UI Framework composite components

| Composite               | Description                                               | Web   | Android | iOS   |
|-------------------------|-----------------------------------------------------------|-------|---------|-------|
| Group Calling Composite | Light-weight voice and video outbound calling experience for Azure Communication Services calling using Fluent UI design assets. Supports group calling using Azure Communication Services Group ID. The composite allows for one-to-one calling to be used by referencing an Azure Communication Services identity or a phone number for PSTN using a phone number procured through Azure.                                    | React |  |  |
| Group Chat Composite    | Light-weight chat experience for Azure Communication Services using Fluent UI design assets. This experience concentrates on delivering a simple chat client that can connect to Azure Communication Services threads. It allows users to send messages and see received messages with typing indicators and read receipts. It scales from 1:1 to group chat scenarios. Supports a single chat thread.                         | React |  |  |

## UI Framework base components

| Component             | Description                                                                                                                                                                                                                                                                        | Web   | Android | iOS |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|---------|-----|
| Calling Provider    | Core initializing component for calling. Required component to then initialize other components on top of it. Handles core logic to initialize the calling client using Azure Communication Services access tokens. Supports Group join. | React | N/A     | N/A |
| Media Controls   | Allows users to manage the current call by toggling mute, turning video on/off and end the call.                                                                                                                                                              | React | N/A     | N/A |
| Media Gallery   | Showcase all call participants in a single gallery. Gallery supports both video-enabled and static participants. For video-enabled participants, video is rendered.                                                                                                                | React | N/A     | N/A |
| Microphone Settings | Pick the microphone to be used for calling. This control can be used before and during a call to select the microphone device.                                                                                                                                               | React | N/A     | N/A |
| Camera Settings     | Pick the camera to be used for video calling. This control can be used before and during a call to select the video device.                                                                                                                                             | React | N/A     | N/A |
| Device Settings     | Combines microphone and camera settings into a single component                                                                                                 | React | N/A     | N/A |
| Chat Provider       | Core initializing component for chat. Required component to then initialize other components on top of it. Handles core logic to initialize the chat client with an Azure Communication Services access token and the thread that it will join.                                     | React | N/A     | N/A |
| Send Box          | Input component that allows users to send messages to the chat thread. Input supports text, hyperlinks, emojis and other Unicode characters including other alphabets.                                                                                                                         | React | N/A     | N/A |
| Chat Thread           | Thread component that shows the user both received and sent messages with their sender information. The thread supports typing indicators and read receipts. You can scroll these threads to review chat history.
| Participant List      | Show all the participants of the call or chat thread as a list.  | React | N/A     | N/A |

## UI Framework capabilities

| Feature                                                             | Group Calling Composite | Group Chat Composite | Base Components |
|---------------------------------------------------------------------|-------------------------|----------------------|-----------------|
| Join Teams Meeting                                                  |                         |                      |           
| Join Teams Live Event                                               |                         |                      | 
| Start VoIP call to Teams user                                       |                         |                      | 
| Join a Teams Meeting Chat                                           |                         |                      |            
| Join Azure Communication Services call with Group Id                | ✔                      |                      | ✔
| Start a VoIP call to one or more Azure communication Services users |                         |                      |           
| Join an Azure Communication Services chat thread                    |                         | ✔                   | ✔
| Mute/unmute call                                                    | ✔                       |                      | ✔
| Video on/off on call                                                | ✔                       |                      | ✔
| Screen Sharing                                                      | ✔                       |                      | ✔
| Participant gallery                                                 | ✔                       |                      | ✔
| Microphone management                                               | ✔                       |                      | ✔
| Camera management                                                   | ✔                       |                      | ✔
| Call Lobby                                                          |                         |                      | ✔
| Send chat message                                                   |                         | ✔                   |            
| Receive chat message                                                |                         | ✔                   | ✔
| Typing Indicators                                                   |                         | ✔                   | ✔
| Read Receipt                                                        |                         | ✔                   | ✔
| Participant List                                                    |                         |                      | ✔


## Customization support

| Component Type            | Themes     | Layout                                                              | Data Models |
|---------------------------|------------|---------------------------------------------------------------------|-------------|
| Composite Component       |     N/A    | N/A                                                                 |     N/A     |
| Base Component            |     N/A    | Layout of components can be modified using external styling         |     N/A     |


## Platform support

| SDK    | Windows            | macOS                | Ubuntu   | Linux    | Android  | iOS        |
|--------|--------------------|----------------------|----------|----------|----------|------------|
| UI SDK | Chrome\*, new Edge | Chrome\*, Safari\*\* | Chrome\* | Chrome\* | Chrome\* | Safari\*\* |

\*Note that the latest version of Chrome is supported in addition to the
previous two releases.

\*\*Note that Safari versions 13.1+ are supported. Outgoing video for Safari
macOS is not yet supported, but it is supported on iOS. Outgoing screen sharing
is only supported on desktop iOS.
