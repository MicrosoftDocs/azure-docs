---
title: Build a custom event management platform with Microsoft Teams, Graph and Azure Communication Services
titleSuffix: An Azure Communication Services tutorial
description: Learn how to leverage Microsoft Teams, Graph and Azure Communication Services to build a custom event management platform.
author: ddematheu2
manager: chpalm
services: azure-communication-services

ms.author: dademath
ms.date: 03/31/2022
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: interop
---

# Build a custom event management platform with Microsoft Teams, Graph and Azure Communication Services

The goal of this document is to reduce the time it takes for Event Management Platforms to leverage the power of Microsoft Teams Webinars through integration with Microsoft Graph APIs and Azure Communication Services. The target audience is developers and decision makers. To achieve the goal, this document provides the following three functions: 1) an aid to help event management platforms quickly decide what level of integration would be right for them and 2) a step-by-step end-to-end QuickStart to speed up implementation.

## What are virtual events and event management platforms?

Microsoft empowers event platforms to integrate event capabilities leveraging [Microsoft Teams](https://docs.microsoft.com/microsoftteams/quick-start-meetings-live-events), [Graph](https://docs.microsoft.com/graph/api/application-post-onlinemeetings?view=graph-rest-beta&tabs=http) and [Azure Communication Services](https://docs.microsoft.com/azure/communication-services/overview). Virtual Events are a communication modality where event organizers schedule and configure a virtual environment for event presenters and participants to engage with content through voice, video, and chat. Event management platforms enable users to configure events and for attendees to participate in those events, within their platform, leveraging in-platform capabilities and gamification. Learn more about[ Teams Meetings, Webinars and Live Events](https://docs.microsoft.com/en-us/microsoftteams/quick-start-meetings-live-events) which are leveraged throughout this article to enable virtual event scenarios. 

## What are the building blocks of an event management platform?

Event platforms require 3 core building blocks to deliver a virtual event experience. 

### 1. Event Scheduling and Management

To get started, event organizers must schedule and configure the event. This process creates the virtual container which event attendees and presenters will enter to participate in an event. As part of configuration, organizers might choose to add registration requirements for the event. Microsoft provides two patterns for organizers to create events:

- Teams Client (Web or Desktop): Organizers can directly create events using their Teams client where they can choose a time and place, configure registration, and send to a list of attendees.

- Microsoft Graph: Programmatically, event platforms can schedule and configure a Teams event on behalf of a user by leveraging their M365 license. 

### 2. Attendee experience

For event attendees, they are presented with an experience that enables them to attend, participate, and engage with an event’s content. This experience might include capabilities like watching content, sharing their camera stream, asking questions, responding to polls, and more. Microsoft provides two options for attendees to consume events powered by Teams and Azure Communication Services:

- Teams Client (Web or Desktop): Attendees can directly join events using a Teams Client by using a provided join link. They get access to the full Teams experience.
  
- Azure Communication Services: Attendees can join events through a custom client powered by [Azure Communication Services](https://docs.microsoft.com/azure/communication-services/overview) leveraging [Teams Interoperability](https://docs.microsoft.com/azure/communication-services/concepts/join-teams-meeting). This client can be directly embedded into an Event Platform so that attendees never need to leave the experience. This experience can be built from the ground up using Azure Communication Services SDKs for [calling](https://docs.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-interop?pivots=platform-web) and [chat](https://docs.microsoft.com/azure/communication-services/quickstarts/chat/meeting-interop?pivots=platform-web) or by leveraging our low-code [UI Library](https://docs.microsoft.com/azure/communication-services/quickstarts/ui-library/get-started-composites?tabs=kotlin&pivots=platform-web).

### 3. Host & Organizer experience

For event hosts and organizers, they can join a virtual experience that enables them to present content, manage attendees (mute, change roles, etc.) and manage the event (start, end, etc.).

- Teams Client (Web or Desktop): Presenters can join using the fully fledged Teams client for web or mobile. The Teams client provides presenters a full set of capabilities to deliver their content. Learn more about [presenter capabilities for Teams](https://support.microsoft.com/office/present-in-a-live-event-in-teams-d58fc9db-ff5b-4633-afb3-b4b2ddef6c0a). 
