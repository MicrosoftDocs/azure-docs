---
title: Call setup issues - Overview
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of call setup issues
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 04/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of call setup issues
When an application makes a call with Azure Communication Services WebJS SDK, the first step is to create a `CallClient` instance and use it to create a call agent.
When a call agent is created, the SDK registers the user with the service, allowing other users to reach them.
When the user joins or accepts a call, the SDK establishes media sessions between the two endpoints.
If a user is unable to connect to a call, it's important to determine at which stage the issue is occurring.

## Common issues in call setup
Here we list several common call setup issues, along with potential causes for each issue:

### Invalid or expired tokens
* The application doesn't provide a valid token.
* The application doesn't implement token refresh correctly.

### Failed to create callAgent
* The application doesn't provide a valid token.
* The application creates multiple call agents with a `CallClient` instance.
* The application creates multiple call agents with the same ACS identity on the same page.
* The SDK fails to connect to the service infrastructure.

### The user doesn't receive incoming call notifications
* There's an expired token.
* There's an issue with the signaling connection.

### The call setup takes too long
* The user is experiencing network issues.
* The browser takes a long time to acquire the stream.
