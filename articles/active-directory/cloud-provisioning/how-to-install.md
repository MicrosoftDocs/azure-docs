---
title: 'Install the Azure AD Connect cloud provisioning agent'
description: This article describes how to install the Azure AD Connect cloud provisioning agent.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/19/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Install the Azure AD Connect cloud provisioning agent
This document walks you through the installation process for the Azure Active Directory (Azure AD) Connect provisioning agent and how to initially configure it in the Azure portal.

>[!IMPORTANT]
>The following installation instructions assume that all of the [Prerequisites](how-to-prerequisites.md) have been met.

Installing and configuring Azure AD Connect provisioning is accomplished in the following steps:
	
- [Install the agent](#install-the-agent)
- [Verify agent installation](#verify-agent-installation)


## Install the agent
To install the agent, follow these steps.

1. Sign in to the server you'll use with enterprise admin permissions.
1. Sign in to the Azure portal, and then go to **Azure Active Directory**.
1. In the left menu, select **Azure AD Connect**.
1. Select **Manage provisioning (preview)** > **Review all agents**.
1. Download the Azure AD Connect provisioning agent from the Azure portal.

   ![Download on-premises agent](media/how-to-install/install9.png)</br>
1. Run the Azure AD Connect provisioning installer (AADConnectProvisioningAgent.Installer).
1. On the **Microsoft Azure AD Connect Provisioning Agent Package** screen, accept the licensing terms and select **Install**.

   ![Microsoft Azure AD Connect Provisioning Agent Package screen](media/how-to-install/install1.png)</br>

1. After this operation finishes, the configuration wizard starts. Sign in with your Azure AD global administrator account.
1. On the **Connect Active Directory** screen, select **Add Directory**. Then sign in with your Active Directory administrator account. This operation adds your on-premises directory. Select **Next**.

   ![Connect Active Directory screen](media/how-to-install/install3.png)</br>

1. On the **Configuration complete** screen, select **Confirm**. This operation registers and restarts the agent.

   ![Configuration complete screen](media/how-to-install/install4.png)</br>

1. After this operation finishes, you should see the notice **Your agent configuration was successfully verified.** Select **Exit**.

   ![Exit button](media/how-to-install/install5.png)</br>
1. If you still see the initial **Microsoft Azure AD Connect Provisioning Agent Package** screen, select **Close**.

## Verify agent installation
Agent verification occurs in the Azure portal and on the local server that's running the agent.

### Azure portal agent verification
To verify the agent is being seen by Azure, follow these steps.

1. Sign in to the Azure portal.
1. On the left, select **Azure Active Directory** > **Azure AD Connect**. In the center, select **Manage provisioning (preview)**.

   ![Azure portal](media/how-to-install/install6.png)</br>

1.  On the **Azure AD Provisioning (preview)** screen, select **Review all agents**.

    ![Review all agents option](media/how-to-install/install7.png)</br>
 
1. On the **On-premises provisioning agents** screen, you see the agents you installed. Verify that the agent in question is there and is marked *active*.

   ![On-premises provisioning agents screen](media/how-to-install/verify1.png)</br>



### On the local server
To verify that the agent is running, follow these steps.

1.  Sign in to the server with an administrator account.
1.  Open **Services** by either navigating to it or by going to **Start** > **Run** > **Services.msc**.
1.  Under **Services**, make sure **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are there and their status is *Running*.

    ![Services screen](media/how-to-troubleshoot/troubleshoot1.png)

>[!IMPORTANT]
>The agent has been installed but it must be configured and enabled before it will start synchronizing users. To configure a new agent, see [Create a new configuration for Azure AD Connect cloud-based provisioning](how-to-configure.md).



## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
 
