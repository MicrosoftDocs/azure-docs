---
title: Azure Communication Services Rooms overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Rooms.
author: nmurav
manager: antval
services: azure-communication-services

ms.author: nmurav
ms.date: 11/24/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Rooms Overview

Azure Communication services provide a concept of rooms for developers who are building structured conversations. Rooms support voice and video calling with chat coming later.
Here are main scenarios where Rooms are useful:

- **Service-managed communication.** Rooms helps service platforms deliver meeting-style experiences while still being suitably generic for a wide variety of industry applications. Services can create and manage Rooms for patients seeking medical advice, financial planners working with clients, and lawyers providing legal services. 
- **Ability to have Invite-only experiences.** Rooms allow your services to control which users can join the Rooms. Board members can discuss sensitive topics confidentially.
- **Pre-built roles and permissions (coming soon).** Roles can drive customization of end-user experience and capabilities, such as restricting attendee ability to add additional users, turning on video, or muting others.

# When to use Rooms
Not every solution, you are building with Azure Communication Services needs a Room. Some scenarios, like building basic one-to-one or one-to-few ad-hoc interactions, can be created using the Calling or Chat SDKs without the need for Rooms.

Use Rooms when you need:
- Contol who can access a calling session on server side
- Need coordinates that can be expired at a specific moment of time
- Have a call to which only invited users can join
