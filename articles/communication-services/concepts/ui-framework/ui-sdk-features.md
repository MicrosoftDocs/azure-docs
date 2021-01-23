---
title: Create your Own UI Framework Component
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# UI Framework Capabilities

UI Framework is a client-side solution for developers to build communication
experiences. It supports both Base and Composite Components for
developers to build experiences. In addition, the Framework features pre-defined 
state interface for developers to build their own Components on top of.

## UI Framework Composite Components Overview

| Composite               | Description                                               | Web   | Android | iOS   |
|-------------------------|-----------------------------------------------------------|-------|---------|-------|
| Meeting Composite | An experience built to support developers looking to enable scenarios where a user on a client device join a Teams Meeting experience using Azure Communication Services. This composite had the look and feel of a Teams client along all the features you would expect to have in a Teams Meeting. This composite supports other Teams related scenarios such as Teams Live Events and calling a Teams user from the tenant. | *Coming* | Java | Swift |
| Group Calling Composite | Light-weight voice and video outbound calling experience for Azure Communication Services calling using Fluent UI design assets. Supports group calling using Azure Communication Services Group ID. The composite allows for one-to-one calling to be used by referencing an Azure Communication Services identity or a phone number for PSTN using a procured phone number through Azure.                                    | React | *Coming* | *Coming* |
| Group Chat Composite    | Light-weight chat experience for Azure Communication Services using Fluent UI design assets. This experience concentrates on delivering a simple chat client that can connect to Azure Communication Services threads. It allows users to send messages and see received messages with typing indicators and read receipts. It scales from 1:1 to group chat scenarios. Supports a single chat thread.                         | React | *Coming* | *Coming* |

## UI Framework Base Components

| Component             | Description                                                                                                                                                                                                                                                                        | Web   | Android | iOS |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|---------|-----|
| Calling Provider    | Core initializing component for calling. Required component to then initialize other components on top of it. Handles core logic to initialize the calling client using Azure Communication Services Access Tokens. Support Group join. | React | N/A     | N/A |
| Call Controls   | Allows users to manage the current call by toggling mute, turning video on/off and end the call.                                                                                                                                                              | React | N/A     | N/A |
| Participant Gallery   | Showcase all call participants in a single gallery. Gallery supports both video enabled and static participants. For video enabled participants, video is rendered.                                                                                                                | React | N/A     | N/A |
| Microphone Settings | Pick the microphone to be used for calling. This control can be used at the start of a call or during to pick the device to be used.                                                                                                                                               | React | N/A     | N/A |
| Camera Settings     | Pick the camera to be used for video calling. This control can be used at the start of a call or during to pick the device to be used.                                                                                                                                             | React | N/A     | N/A |
| Device Settings     | Combines microphone and camera settings into a single component                                                                                                 | React | N/A     | N/A |
| Chat Provider       | Core initializing component for chat. Required component to then initialize other components on top of it. Handles core logic to initialize the chat client with an Azure Communication Services access token and the thread that it will join.                                     | React | N/A     | N/A |
| Chat Input            | Input component that allows users to send messages to the chat thread. Input supports text, hyperlinks, emojis and other Unicode characters including other alphabets.                                                                                                                         | React | N/A     | N/A |
| Chat Thread           | Thread components shows the user both received and sent messages with their sender information. The thread supports typing indicators and read receipts. The thread is scrollable to see chat history.
| Participant List      | Show all the participants of the call or chat thread as a list.  | React | N/A     | N/A |

## UI Framework Capabilities

|                                                                     | Meeting Composite | Group Calling Composite | Group Chat Composite | Base Components |
|---------------------------------------------------------------------|-------------------|-------------------------|----------------------|-----------------|
| Join Teams Meeting                                                  | ✔                | *Coming*                |                      | *Coming* 
| Join Teams Live Event                                               | ✔                |                         |                      | 
| Start VoIP call to Teams user                                       | ✔                |                         |                      | 
| Join a Teams Meeting Chat                                           | ✔                |                         |  *Coming*            | *Coming*  
| Join Azure Communication Services call with Group Id                |                   | ✔                      |                      | ✔
| Start a VoIP call to one or more Azure communication Services users |                   | *Coming*                |                      | *Coming* 
| Join an Azure Communication Services chat thread                    |                   |                         | ✔                   | ✔
| Mute/unmute call                                                    | ✔                | ✔                       |                      | ✔
| Video on/off on call                                                | ✔                | ✔                       |                      | ✔
| Screen Sharing                                                      | ✔                | ✔                       |                      | ✔
| Participant gallery                                                 | ✔                | ✔                       |                      | ✔
| Microphone management                                               | ✔                | ✔                       |                      | ✔
| Camera management                                                   | ✔                | ✔                       |                      | ✔
| Call Lobby                                                          | ✔                | *Coming*                |                      | ✔
| Send chat message                                                   |                   |                         | ✔                   | ✔
| Receive chat message                                                |                   |                         | ✔                   | ✔
| Typing Indicators                                                   |                   |                         | ✔                   | ✔
| Read Receipt                                                        |                   |                         | ✔                   | ✔
| Participant List                                                    |                   | ✔                      | ✔                    | ✔
| Together Mode                                                       | ✔                |                         |                      |
| Blur Background                                                     | ✔                |                         |                      |
| Raised Hand                                                         | ✔                |                         |                      |

## Customization Support

|                           | Themes          | Layout                                                          | Data Models |
|------------|--------|--------------|-------------|
| Mobile Meeting Composites | N/A             | N/A                                                             | *Coming*    |
| Open Source Composites    | Fluent Themes   | N/A                                                             | *Coming*    |
| Base Components           | Fluent Themes   | Components can be organized any layout desired by the developer | *Coming*    |

See [How to customize UI Framework Components](../../quickstarts/ui-framework/how-to-customize-components.md) for more information on customization.

## Error Handling

UI Framework Components and Composite allow developers to handle errors related to the communication experience.
- **Base Components** provide the greatest control over error handling. Developers can consume individual component error and handle them accordingly.
- **Composite** provide less control. Composite handle part of the error logic internally to maintain the experience working. They only surface up a handful of error that require developer management.

## Platform Support

|        | Windows            | macOS                | Ubuntu   | Linux    | Android  | iOS        |
|--------|--------------------|----------------------|----------|----------|----------|------------|
| UI SDK | Chrome\*, new Edge | Chrome\*, Safari\*\* | Chrome\* | Chrome\* | Chrome\* | Safari\*\* |

\*Note that the latest version of Chrome is supported in addition to the
previous two releases.

\*\*Note that Safari versions 13.1+ are supported. Outgoing video for Safari
macOS is not yet supported, but it is supported on iOS. Outgoing screen sharing
is only supported on desktop iOS.
