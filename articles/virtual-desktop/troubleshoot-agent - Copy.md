---
title: Troubleshoot Windows Virtual Desktop Agent Issues - Azure
description: How to diagnose and resolve common agent and connectivity issues.
author: Sefriend
ms.topic: troubleshooting
ms.date: 12/16/2020
ms.author: sefriend
manager: clarkn
---
# Troubleshoot common Windows Virtual Desktop Agent issues

The Windows Virtual Desktop Agent can cause connection issues because of multiple factors:
   - An error on the broker that causes the agent stop the service.
   - Problems with updates.
   - Issues with installing the stack while the agent is being installed, thus interfering with connecting to the session host.

This article will guide you through these common scenarios and more to address connection issues.

## The agent status is stuck in upgrading or unavailable, or failed during installation.

