---
title: Azure Virtual Desktop user sessions - Azure
description: Learn about the three types of user sessions in Azure Virtual Desktop host pools.
author: Heidilohr
ms.topic: conceptual
ms.date: 04/05/2022
ms.author: helohr
manager: femila
---
# Types of user sessions

This brief article describes the types of user sessions that exist in an Azure Virtual Desktop deployment.

## Active user session

A user session is considered "active" when the user signs in and connects to their remote app or desktop resource.

## Disconnected user session

A disconnected user session is an inactive session that the user hasn't signed out of yet. When a user closes the remote session window without signing out, the session becomes disconnected. When a user reconnects to their remote resources, they'll be redirected to their disconnected session on the session host they were working on. At this point, the disconnected session becomes an active session again.

## Pending user session

A pending user session is a placeholder session that reserves a spot on the load-balanced virtual machine for the user. Because the sign-in process can take anywhere from 30 seconds to five minutes depending on the user profile, this reservation ensures that the user won't be kicked out of the virtual machine if another user profile completes their sign-in process first.

## Next steps

