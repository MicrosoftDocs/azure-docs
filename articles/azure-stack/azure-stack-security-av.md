---
title: How to update Windows Defender Antivirus on Azure Stack
description: Details on how antivirus is kept up to date on Azure Stack
services: azure-stack
author: PatAltimore
manager: femila

ms.service: azure-stack
ms.topic: article
ms.date: 06/11/2018
ms.author: patricka
ms.reviewer: fiseraci

#Customer intent: As an Azure AD Administrator, I want to understand how antivirus is kept up to date on Azure Stack.
---
# Update Windows Defender Antivirus on Azure Stack

Windows Defender Antivirus is a built-in antimalware solution that provides security and antimalware management for desktops, portable computers, and servers. Every Azure Stack component including Hyper-V hosts and Virtual Machines is protected with Windows Defender Antivirus.

There are three AV components that update

Definitions
Engine
Platform

Updates are applied depending on your configuration.

## Connected

In connected scenarios, antivirus definitions and engine upates are applied multiple times a day.

Platform updates occur in monthly updates.

## Disconnected

In disconnected scenarios, signature updates are released as part of [monthly Azure Stack updates](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-apply-updates).

