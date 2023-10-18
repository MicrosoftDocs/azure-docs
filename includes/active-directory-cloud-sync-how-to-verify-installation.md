---
title: include file
description: include file
services: active-directory
author: billmath
ms.service: active-directory
ms.topic: include
ms.date: 11/11/2022
ms.author: billmath
ms.custom: include file
---

Agent verification occurs in the Azure portal and on the local server that's running the agent.

### Azure portal agent verification

To verify that the agent is being registered by Azure AD, follow these steps:

 1. Sign in to the [Azure portal](https://portal.azure.com).
 2. Select **Azure Active Directory**.
 3. Select **Azure AD Connect**, and then select **Cloud sync**.
     :::image type="content" source="media/active-directory-cloud-sync-how-to-install/new-ux-1.png" alt-text="Screenshot of new UX screen." lightbox="media/active-directory-cloud-sync-how-to-install/new-ux-1.png":::
 4. On the **cloud sync** page, you'll see the agents you've installed.  Verify that the agent is displayed and the status is **healthy**.

### On the local server

To verify that the agent is running, follow these steps:

 1. Sign in to the server with an administrator account.
 2. Open **Services** either by navigating to it or by going to *Start/Run/Services.msc*.
 3. Under **Services**, make sure that **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are present and the status is **Running**.
     [![Screenshot that shows the Windows services.](./media/active-directory-cloud-sync-how-to-verify-installation/windows-services.png)](./media/active-directory-cloud-sync-how-to-verify-installation/windows-services.png#lightbox)

### Verify the provisioning agent version

To verify that the version of the agent running, follow these steps:

1.  Navigate to 'C:\Program Files\Microsoft Azure AD Connect Provisioning Agent'
2.  Right-click on 'AADConnectProvisioningAgent.exe' and select properties.
3.  Click the details tab and the version number will be displayed next to Product version.

