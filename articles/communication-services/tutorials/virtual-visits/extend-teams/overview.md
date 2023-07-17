---
title: Overview of extensibility options for  Microsoft Teams Virtual appointments
description: Overview of how to extend Microsoft Teams Virtual appointments with Azure Communication Services and Microsoft Graph API
author: tchladek
manager: chpalm
services: azure-communication-services

ms.author: tchladek
ms.date: 05/22/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Extend Microsoft Teams Virtual appointments with Azure Communication Services

This article focuses on the available options for extending Microsoft Teams out-of-the-box experience for Virtual appointments with Azure Communication Services and Microsoft Graph. To learn more about the current experience provided by Microsoft Teams, click [here](https://guidedtour.microsoft.com/guidedtour/industry-longform/virtual-appointments/1/1). 

Microsoft provides three main approaches to Virtual appointments:
-	Microsoft Teams out-of-the-box experience – This ready-to-use solution integrated into the Microsoft Teams application allows you to schedule and manage Virtual appointments from Microsoft Teams.
-	Extend Microsoft Teams Virtual appointments experience – With this approach, you learn the tools needed to customize and integrate individual phases of Virtual appointments.`
-	Build your own Virtual appointments solution – With this approach, you build your own experience for Virtual appointments customized to your processes and products using Azure Communication Services.


## Overview of Virtual appointments
 
Virtual appointments consist of the following phases:
-	Scheduling: Creation of calendar events and online meetings based on a template that assigns business representatives and customers for the Virtual appointment. 
-	Before appointment: Send reminders before the Virtual appointment to prevent no-shows and provide access to documents that are prerequisites for the session.
-	Precall: Provide tools and guidance to ensure device readiness for the session. Once the device is ready and the customer is in the lobby, you can provide engaging activities to prevent early drop-offs.
-	Call: Business representatives and customers engage in real-time audio, video, and chat experience to communicate and interact.
-	After appointment: Send a session summary, inform the customer of the next steps, or define your process to handle no-shows.

## Next steps
You can learn more about individual phases in the following sections:
-	[Scheduling](./schedule.md)
-	[Before and after appointment](./before-and-after-appointment.md)
-	[Precall](./precall.md)
-	[Call](./call.md)
