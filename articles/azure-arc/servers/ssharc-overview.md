---
title: SSH access to Azure Arc-enabled servers
description: Leverage SSH remoting to access and manage Azure Arc-enabled servers.
ms.date: 02/18/2022
ms.topic: conceptual
---

# SSH access to Azure Arc-enabled servers
SSH for Arc-enabled servers enables SSH based connections to Arc-enabled servers without requiring a public IP address or additional open ports.
This functionality can be used interactively, automated, or with existing SSH based tooling,
allowing existing management tools to have a greater impact on hybrid servers.

## Key benefits
SSH access to  Arc-enabled servers provides the following key benefits:
 - No public IP address or open SSH ports required
 - Access to Windows and Linux machines
 - Ability to log-in as a local user or an Azure user (Linux only)
 - Support for other OpenSSH based tooling with config file support

