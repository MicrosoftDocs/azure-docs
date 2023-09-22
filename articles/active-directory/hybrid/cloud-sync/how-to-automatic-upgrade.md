---
title: 'Microsoft Entra Connect cloud provisioning agent: Automatic upgrade'
description: This article describes the built-in automatic upgrade feature in the Microsoft Entra Connect cloud provisioning agent.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect cloud provisioning agent: Automatic upgrade

Making sure your Microsoft Entra Connect cloud provisioning agent installation is always up to date is easy with the automatic upgrade feature.

The agent is installed here: "Program files\Azure AD Connect Provisioning Agent\AADConnectProvisioningAgent.exe"

To verify your version, right-click the executable and select properties and then details.

![Agent file version](media/how-to-automatic-upgrade/agent-1.png)

The agent updater is installed here: "Program files\Azure AD Connect Provisioning Agent Updater\AzureADConnectAgentUpdater.exe"

To verify your version, right-click the executable and select properties and then details.

![Agent updater version](media/how-to-automatic-upgrade/agent-2.png)

## Uninstall the agent
To remove the agent, go to **Uninstall or change a program** and uninstall the following:

- **Microsoft Entra Connect Agent Updater**
- **Microsoft Entra Connect Provisioning Agent**
- **Microsoft Entra Connect Provisioning Agent Package**

![Agent removal](media/how-to-automatic-upgrade/agent-3.png)

## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Connect cloud sync?](what-is-cloud-sync.md)
