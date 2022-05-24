---
title: Known issues
description: Known issues that the Dev Box team is working to fix. 
services: dev-box
ms.service: dev-box
ms.topic: reference
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/21/2022
adobe-target: true
---

# Known Issues

These are issues that the Microsoft Dev Box team is aware of and working to fix:

- Azure Compute Galleries with names that contain underscore or period are treated as invalid.
    -  Symptom: Add button is disabled when attaching a Gallery to the DevCenter.
    -  Workaround: Use the [CLI](/Documentation/CLI-reference.md) to attach a Gallery to a DevCenter.
    -  Fix: Team is working on resolving the issue.
- Power state on dev box remains in Running state after executing a Stop action.
    - Symptom: Clicking on Stop on your dev box in the developer portal will Stop your dev box, but the state will continue to show as Running. The dev box stopped in this way cannot be restarted using the Start button.
    - Workaround: Do not Stop the dev box. If you do by accident, you can start it by directly connecting to it, which will invoke AVD's start-on-connect. 
    - Fix: Team is deploying a hot fix for April.

- Developer portal 'Open in Remote Desktop' disabled.
    - Symptom: You cannot directly connect to your dev box via the Remote Desktop app from the developer portal
    - Workaround: Install the Remote Desktop App from [Get started with the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop) and subscribe via your email address.
    - Fix: Pass URL handler that will enable direct connection to dev box RD session in remote desktop app from developer portal, expected in May.
