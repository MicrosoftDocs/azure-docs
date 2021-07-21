---
title: 'Azure AD ECMA Connector Host installation'
description: This article describes how to install the Azure AD ECMA Connector Host.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/28/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Installation of the Azure AD ECMA Connector Host

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability.

The Azure Active Directory (Azure AD) ECMA Connector Host is included as part of the Azure AD Connect Provisioning Agent Package. The provisioning agent and Azure AD ECMA Connector Host are two separate Windows services. They're installed by using one installer, which is deployed on the same machine.

This flow guides you through the process of installing and configuring the Azure AD ECMA Connector Host.

 ![Diagram that shows the installation flow.](./media/on-premises-ecma-install/flow-1.png)

For more installation and configuration information, see:

   - [Prerequisites for the Azure AD ECMA Connector Host](on-premises-ecma-prerequisites.md)
   - [Configure the Azure AD ECMA Connector Host and the provisioning agent](on-premises-ecma-configure.md)
   - [Azure AD ECMA Connector Host generic SQL connector configuration](on-premises-sql-connector-configure.md)

## Download and install the Azure AD Connect Provisioning Agent Package

 1. Sign in to the Azure portal.
 1. Go to **Enterprise applications** > **Add a new application**.
 1. Search for the **On-premises provisioning** application, and add it to your tenant image.
 1. Go to the **Provisioning** pane.
 1. Select **On-premises connectivity**.
 1. Download the agent installer.
 1. Run the Azure AD Connect provisioning installer **AADConnectProvisioningAgentSetup.msi**.
 1. On the **Microsoft Azure AD Connect Provisioning Agent Package** screen, accept the licensing terms, and select **Install**.
 
    ![Microsoft Azure AD Connect Provisioning Agent Package screen.](media/on-premises-ecma-install/install-1.png)</br>
 1. After this operation finishes, the configuration wizard starts. Select **Next**.
 
    ![Screenshot that shows the Welcome screen.](media/on-premises-ecma-install/install-2.png)</br>

 1. On the **Select Extension** screen, select **On-premises application provisioning (Azure AD to application)**. Select **Next**. 
 
    ![Screenshot that shows Select extension.](media/on-premises-ecma-install/install-3.png)</br>
 1. Use your global administrator account to sign in to Azure AD.
 
     ![Screenshot that shows Azure sign-in.](media/on-premises-ecma-install/install-4.png)</br>
 1. On the **Agent configuration** screen, select **Confirm**.
 
     ![Screenshot that shows Confirm installation.](media/on-premises-ecma-install/install-5.png)</br>
 1. After the installation is complete, you should see a message at the bottom of the wizard. Select **Exit**.
 
     ![Screenshot that shows finishing.](media/on-premises-ecma-install/install-6.png)</br>
 

Now that the agent package has been successfully installed, you need to configure the Azure AD ECMA Connector Host and create or import connectors.
 
## Next steps

- [Azure AD ECMA Connector Host prerequisites](on-premises-ecma-prerequisites.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Generic SQL connector](on-premises-sql-connector-configure.md)
