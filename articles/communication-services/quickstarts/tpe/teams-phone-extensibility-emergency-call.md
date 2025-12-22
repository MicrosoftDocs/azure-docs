---
title: Teams Phone Extensibility Emergency Call
titleSuffix: An Azure Communication Services article
description: This article describes how emergency calls work for Teams Phone Extensibility User
author: cnwankwo
manager: ansrin
services: azure-communication-services
ms.author: ansrin
ms.date: 08/28/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: identity
---

# Teams Phone Extensibility: Emergency Calling

This article describes how emergency calls work for Teams Phone Extensibility users, and how different calling policies affect the handling of emergency calls.  

## Overview  
In Microsoft Teams and Azure Communication Services (ACS) telephony, calling policies determine how phone numbers are used, assigned, and managed for users, resource accounts, and services. Two important policy models are **primary calling policies** and **shared calling policies**.  

Understanding the difference between these policies is critical for assigning phone numbers, maintaining compliance, and ensuring that emergency calls function as expected.  



## Primary Calling Policy  

A **primary calling policy** is directly tied to a single user account (or a dedicated resource account). It represents the default and individual assignment of a phone number to a user or resource.  

### Emergency Call Behavior for Primary Calling Policy  
- When a user is assigned a primary calling policy, a unique phone number is associated with that user.  
- If the user places an emergency call (for example, 911 in the U.S.), the call is routed to the emergency services provider along with the user’s number and registered emergency location.  
- If the emergency call drops, the emergency call agent can call back the user’s number directly. Because the number is uniquely assigned, the callback routes back to the same user who initiated the emergency call.  

This model ensures that emergency services can reliably identify and reconnect with the individual caller.  



## Shared Calling Policy  

A **shared calling policy** allows multiple users or endpoints to share a pool of phone numbers through a central routing model. Instead of being tied to a specific user, the number is associated with a shared service such as a call queue or auto attendant.  

For more details on shared calling plans, see [Shared Calling Plan](/microsoftteams/shared-calling-plan).  

### Emergency Call Behavior for Shared Calling Policy  
- In a shared calling policy, a **temporary emergency callback number** must be configured.  
- If no temporary emergency callback number is assigned and a user places an emergency call, the emergency services provider sees the shared service number (associated with a resource account).  
  - If the call drops, the callback would route to the resource account, not to the individual user who made the emergency call.  
- When a temporary emergency callback number is assigned, emergency calls from a user are automatically associated with that callback number.  
  - The callback number is mapped to the individual user for **one hour** (time-to-live).  
  - Any return calls from the emergency services provider to the callback number within that one-hour period are routed back to the correct user.  

This ensures that emergency services can reconnect directly with the user, even though they are operating under a shared calling policy. 

## Restricted Emergency Calling Capabilities  

During an active emergency call, certain mid-call operations are restricted. The following features are **not available** while an emergency call is in progress:

| Operation          |
|--------------------|
| Hold               |
| Local Mute         |
| Transfer           |
| Start Recording    |
| Stop Recording     |
| Remote Mute        |
| Add Participant    |
| Remove Participant |



## Related articles

- [Teams Phone extensibility overview](../../concepts/interop/tpe/teams-phone-extensibility-overview.md)
- [Teams Phone System extensibility quick start](./teams-phone-extensibility-quickstart.md)
