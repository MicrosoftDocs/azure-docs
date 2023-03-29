---
title: Manage calls for Teams users
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage calls for Teams users
author: xixian73
ms.author: xixian
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 12/01/2021
ms.custom: template-how-to
---

# Manage calls for Teams users with Communication Services calling SDK

Learn how to manage calls with the Azure Communication Services SDKS. We'll learn how to place calls, manage their participants and properties.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/manage-teams-identity.md)
- Optional: Complete the quickstart for [getting started with adding video calling to your application](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)

[!INCLUDE [Manage Calls JavaScript](./includes/manage-calls/manage-calls-web.md)]
