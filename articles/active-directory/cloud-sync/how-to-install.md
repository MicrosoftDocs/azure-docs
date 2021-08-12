---
title: 'Install the Azure AD Connect provisioning agent'
description: Learn how to install the Azure AD Connect provisioning agent and how to configure it in the Azure portal.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/16/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Install the Azure AD Connect provisioning agent
This article walks you through the installation process for the Azure Active Directory (Azure AD) Connect provisioning agent and how to initially configure it in the Azure portal.

>[!IMPORTANT]
>The following installation instructions assume that all the [prerequisites](how-to-prerequisites.md) were met.

>[!NOTE]
>This article deals with installing the provisioning agent by using the wizard. For information on installing the Azure AD Connect provisioning agent by using a command-line interface (CLI), see [Install the Azure AD Connect provisioning agent by using a CLI and PowerShell](how-to-install-pshell.md).

## Group Managed Service Accounts
A group Managed Service Account (gMSA) is a managed domain account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators. It also extends this functionality over multiple servers. Azure AD Connect cloud sync supports and recommends the use of a group Managed Service Account for running the agent. For more information on a group Managed Service Account, see [Group Managed Service Accounts](/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview).


### Upgrade an existing agent to use the gMSA
To upgrade an existing agent to use the group Managed Service Account created during installation, update the agent service to the latest version by running AADConnectProvisioningAgent.msi. Now run through the installation wizard again and provide the credentials to create the account when prompted.

## Install the agent

To install the agent:

 1. Sign in to the server you'll use with enterprise admin permissions.
 1. Sign in to the Azure portal, and then go to **Azure Active Directory**.
 1. On the menu on the left, select **Azure AD Connect**.
 1. Select **Manage cloud sync** > **Review all agents**.
 1. Download the Azure AD Connect provisioning agent from the Azure portal.
 
    ![Screenshot that shows Download on-premises agent.](media/how-to-install/install-9.png)</br>
 1. Accept the terms and select **Download**.
 1. Run the Azure AD Connect provisioning installer AADConnectProvisioningAgentSetup.msi.
 1. On the **Microsoft Azure AD Connect Provisioning Agent Package** screen, accept the licensing terms and select **Install**.
 
    ![Screenshot that shows the Microsoft Azure AD Connect Provisioning Agent Package screen.](media/how-to-install/install-1.png)</br>
 1. After this operation finishes, the configuration wizard starts. Sign in with your Azure AD global administrator account.
 1. On the **Configure Service Account** screen, select either **Create gMSA** or **Use custom gMSA**. If you allow the agent to create the account, it will be named provAgentgMSA$. If you specify **Use custom gMSA**, you're prompted to provide this account.
 1. Enter the domain admin credentials to create the group Managed Service account that will be used to run the agent service. Select **Next**.
  
    ![Screenshot that shows the Create gMSA option.](media/how-to-install/install-12.png)</br>
 1. On the **Connect Active Directory** screen, select **Add Directory**. Then sign in with your Active Directory administrator account. This operation adds your on-premises directory. 
 1. Optionally, you can manage the preference of domain controllers the agent will use by selecting the **Select domain controller priority** checkbox and ordering the list of domain controllers. Select **OK**.
 
    ![Screenshot that shows ordering the domain controllers.](media/how-to-install/install-2a.png)</br>
 1. Select **Next**.
 
    ![Screenshot that shows the Connect Active Directory screen.](media/how-to-install/install-3a.png)</br>
 1. On the **Agent installation** screen, confirm settings and the account that will be created and select **Confirm**.
 
    ![Screenshot that shows the Confirm settings.](media/how-to-install/install-11.png)</br>
 1. After this operation finishes, you should see **Your agent installation is complete.** Select **Exit**.
 
    ![Screenshot that shows the Configuration complete screen.](media/how-to-install/install-4a.png)</br>
 1. If you still see the initial **Microsoft Azure AD Connect Provisioning Agent Package** screen, select **Close**.

## Verify agent installation
Agent verification occurs in the Azure portal and on the local server that's running the agent.

### Azure portal agent verification
To verify the agent is being seen by Azure:

 1. Sign in to the Azure portal.
 1. On the left, select **Azure Active Directory** > **Azure AD Connect**. In the center, select **Manage cloud sync**.

    ![Screenshot that shows the Azure portal.](media/how-to-install/install-6.png)</br>

 1. On the **Azure AD Connect cloud sync** screen, select **Review all agents**.

    ![Screenshot that shows the Review all agents option.](media/how-to-install/install-7.png)</br>
 
 1. On the **On-premises provisioning agents** screen, you see the agents you installed. Verify that the agent in question is there and is marked *active*.

    ![Screenshot that shows On-premises provisioning agents screen.](media/how-to-install/verify-1.png)</br>

### On the local server
To verify that the agent is running:

1. Sign in to the server with an administrator account.
1. Open **Services** by going to it or by selecting **Start** > **Run** > **Services.msc**.
1. Under **Services**, make sure **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are there and their status is *Running*.

    ![Screenshot that shows the Services screen.](media/how-to-install/troubleshoot-1.png)

>[!IMPORTANT]
>The agent has been installed, but it must be configured and enabled before it will start synchronizing users. To configure a new agent, see [Create a new configuration for Azure AD Connect cloud sync](how-to-configure.md).

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
- [Create a new configuration for Azure AD Connect cloud sync](how-to-configure.md).

