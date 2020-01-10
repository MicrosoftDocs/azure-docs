---
title: Using shared device mode with MSAL Android | Azure
description: Learn how to prepare an Android device to run in shared mode and run a firstline worker app.
services: active-directory
documentationcenter: dev-center-name
author: tylermsft
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 1/15/2020
ms.author: hahamil
ms.reviewer: brandwe
ms.custom: aaddev, identityplatformtop40
ms.collection: M365-identity-device-management
---
> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

# Tutorial: Using Shared Device Mode in your Android Application

## Download the sample

Clone https://github.com/brandwe/GlobalSignoutSample

## Overview of shared device mode code changes

Point out the build.gradle changes to integrate the MSAL SDK (p. 7-8 in the spec)
Point out the configuration changes (p. 8 in the spec)
Point out the code to globally sign in/out (p. 30), detect an account change (p. 29), detect if the device is in shared mode (p. 28), get the signed in user (p. 29), initialize the app object (p.27)

## Register the sample in Azure Active Directory (p. 9-10 in the spec)

## Setup a tenant (p.12 in the spec)

## Setup an Android device in shared mode (p. 12-18 in the spec)

## Register the device in the cloud (p. 18-22 in the spec)

## View the shared device in the Azure portal (p. 22-23 in the spec)

# Next steps

Get more background on working with shared mode at [Shared device mode for Android devices](shared-device-mode.md)