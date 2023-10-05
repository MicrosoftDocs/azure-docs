---
title: 'Verify your version of cloud sync or connect sync'
description: This article describes the steps to verify the version of the provisioning agent or connect sync.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/17/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Verify your version of the provisioning agent or connect sync
This article describes the steps to verify the installed version of the provisioning agent and connect sync.

## Verify the provisioning agent
To see what version of the provisioning agent your using, use the following steps:

[!INCLUDE [active-directory-cloud-sync-how-to-verify-installation](../../../includes/active-directory-cloud-sync-how-to-verify-installation.md)]

## Verfiy connect sync
To see what version of connect sync your using, use the following steps:

### On the local server

To verify that the agent is running, follow these steps:

 1. Sign in to the server with an administrator account.
 2. Open **Services** either by navigating to it or by going to *Start/Run/Services.msc*.
 3. Under **Services**, make sure that **Microsoft Entra ID Sync** is present and the status is **Running**.


### Verify the connect sync version

To verify that the version of the agent running, follow these steps:

1.  Navigate to 'C:\Program Files\Microsoft Azure AD Connect'
2.  Right-click on **AzureADConnect.exe** and select **properties**.
3.  Click the **details** tab and the version number ID next to the Product version.

## Next steps
- [Common scenarios](common-scenarios.md)
- [Choosing the right sync tool](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad)
- [Steps to start](get-started.md)
- [Prerequisites](prerequisites.md)
