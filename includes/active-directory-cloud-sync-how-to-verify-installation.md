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

Agent verification occurs in the Azure portal and on the local server that is running the agent.

### Azure portal agent verification

To verify the agent is being registered by Azure AD, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left menu, select **Azure Active Directory**.
1. Select **Azure AD Connect** and then select **Manage Azure AD cloud sync**.

    [![Screenshot that shows how to manage the Azure AD could sync.](./media/active-directory-cloud-sync-how-to-verify-installation/azure-ad-select-cloud-sync.png)](./media/active-directory-cloud-sync-how-to-verify-installation/azure-ad-select-cloud-sync.png#lightbox)
    

1. On the **Azure AD Connect cloud sync** screen, select 
**Review all agents**.
    
   [![Screenshot that shows the Azure AD provisioning agents.](./media/active-directory-cloud-sync-how-to-verify-installation/azure-ad-cloud-sync-review-agents.png)](./media/active-directory-cloud-sync-how-to-verify-installation/azure-ad-cloud-sync-review-agents.png#lightbox)
 
1. On the **On-premises provisioning agents screen**, you'll see the agents you've installed.  Verify that the agent in question is there and is marked **active**.

    [![Screenshot that shows the status of a provisioning agent.](./media/active-directory-cloud-sync-how-to-verify-installation/azure-ad-cloud-sync-agents-status.png)](./media/active-directory-cloud-sync-how-to-verify-installation/azure-ad-cloud-sync-agents-status.png#lightbox)

### On the local server

To verify that the agent is running, follow these steps:

1. Sign in the server with an administrator account

1. Open **Services** by either navigating to it or by going to Start/Run/Services.msc.

1. Under **Services**, make sure **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are present and the status is **Running**.

    [![Screenshot that shows the Windows services.](./media/active-directory-cloud-sync-how-to-verify-installation/windows-services.png)](./media/active-directory-cloud-sync-how-to-verify-installation/windows-services.png#lightbox)
