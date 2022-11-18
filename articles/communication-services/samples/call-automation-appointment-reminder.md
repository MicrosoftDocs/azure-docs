---
title: Call Automation Appointment Reminder
titleSuffix: An Azure Communication Services sample overview
description: Learn about creating a simple outbound call with Call Automation  
author: Kunaal
manager: visho
services: azure-communication-services

ms.author: kpunjabi
ms.date: 11/17/2022
ms.topic: overview
ms.service: azure-communication-services
ms.subservice: call automation
zone_pivot_groups: acs-csharp-java
---

# Call Automation - Appointment Reminder

> [!IMPORTANT]
> This sample is available **on GitHub** for [C#](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallAutomation_AppointmentReminder) and [Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/CallAutomation_AppointmentReminder)

This Azure Communication Services Call Automation - Appointment Reminder sample demonstrates how your application can use the Call Automation SDK to build automated workflows that create outbound calls to proactively reach out to your customers. 

## Overview

This sample application makes an outbound call to a phone number performs dtmf recognition and then plays the next audio file based on the key pressed by the callee. This sample application is configured for accepting tone 1 (tone1), 2 (tone2), if the callee presses any key other than what is expected, an invalid audio tone will be played and then the call will be disconnected.

This sample application is also capable of making multiple concurrent outbound calls.

## Design

![Call flow](./media/call-automation/appointment-reminder.png)

::: zone pivot="programming-language-csharp"
[!INCLUDE [CA csharp sample]](./includes/ca-appointment-reminder-csharp.md)
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [CA java sample]](./includes/ca-appointment-reminder-java.md)
::: zone-end
