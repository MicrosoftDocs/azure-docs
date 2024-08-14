---
title: What's new in the Azure Virtual Desktop SxS Network Stack? - Azure
description: New features and product updates for the Azure Virtual Desktop SxS Network Stack.
author: sipastak
ms.topic: release-notes
ms.date: 08/13/2024
ms.author: sipastak
ms.custom: references_regions
---

# What's new in the Azure Virtual Desktop SxS Network Stack?

The Azure Virtual Desktop agent links your session hosts with the Azure Virtual Desktop service. It also includes a component called the SxS Network Stack. The Azure Virtual Desktop agent acts as the intermediate communicator between the service and the virtual machines, enabling connectivity. The SxS Network Stack component is required for users to securely establish reverse server-to-client connections.

The Azure Virtual Desktop SxS Network Stack is updated regularly. New versions of the Azure Virtual Desktop SxS Network Stack are installed automatically. When new versions are released, they're rolled out progressively to session hosts. This process is called *flighting* and it enables Microsoft to monitor the rollout in [validation environments](create-validation-host-pool.md) first.

A rollout might take several weeks before the agent is available in all environments. Some agent versions might not reach nonvalidation environments, so you might see multiple versions of the agent deployed across your environments.

This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

Make sure to check back here often to keep up with new updates.

## Latest available versions

Here's information about the SxS Network Stack.

| Release | Latest version |
|--|--|
| Production | 1.0.9103.3700 |
| Validation | 1.0.9103.5000 |

> [!TIP]
> The Azure Virtual Desktop Agent is automatically installed when adding session hosts in most scenarios. If you need to install the agent manually, you can download it at [Register session hosts to a host pool](add-session-hosts-host-pool.md#register-session-hosts-to-a-host-pool), together with the steps to install it.

Here's information about the SxS Network Stack.

## Latest available versions

| Release | Latest version |
|--|--|
| Production | 1.0.2404.16760  |
| Validation | 1.0.2404.16760  |

## Version 1.0.2404.16760

*Published: July 2024*

In this release, we've made the following changes:

- General improvements and bug fixes mainly around `rdpshell` and RemoteApp. 

## Version 1.0.2402.09880

*Published: July 2024*

In this release, we've made the following changes:

- General improvements and bug fixes mainly around `rdpshell` and RemoteApp. 
- The default chroma value has been changed from 4:4:4 to 4:2:0. 
- Reduce chance of progressive update blocking real updates from driver. 
- Improve user experience when bad credentials are saved. 
- Improve session switching to avoid hangs.  
- Update Intune version numbers for the granular clipboard feature. 
- Bug fixes for RemoteApp V2 decoder. 
- Bug fixes for RemoteApp.  
- Fix issue with caps lock state when using the on-screen keyboard. 

