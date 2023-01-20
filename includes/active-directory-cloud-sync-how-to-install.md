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

1. Sign in to the domain-joined server with enterprise admin permissions.
1. In a web browser, sign in to the [Azure portal](https://portal.azure.com) by using cloud-only global admin credentials.
1. On the left pane, select **Azure Active Directory**.
1. Select **Azure AD Connect**, and then select **Manage Azure AD cloud sync**.
    
    ![Screenshot that shows how to download the Azure AD cloud sync.](./media/active-directory-cloud-sync-how-to-install/azure-ad-select-cloud-sync.png)

1. Select **Download agent**, and then select **Accept terms & download**.

   [![Screenshot that shows how to accept the terms and start the download of Azure AD cloud sync.](./media/active-directory-cloud-sync-how-to-install/azure-ad-download-cloud-sync.png)](./media/active-directory-cloud-sync-how-to-install/azure-ad-download-cloud-sync.png#lightbox)

1. After the **Azure AD Connect Provisioning Agent Package** download is completed, run the *AADConnectProvisioningAgentSetup.exe* installation file from your *Downloads* folder.

1. On the splash screen, select **I agree to the license and conditions**, and then select **Install**.

    ![Screenshot that shows the "Microsoft Azure AD Connect Provisioning Agent Package" splash screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-splash-screen.png)

    After the installation operation is completed, the configuration wizard opens. 
    
1. In the wizard, select **Next** to start the configuration.

    ![Screenshot that shows the "Welcome to Azure AD Connect provisioning agent configuration wizard".](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-config-splash-screen.png)

1. Sign in with your Azure AD global administrator account.  

    If you have Internet Explorer enhanced security enabled, it will block the sign-in.  If the sign-in is blocked, close the installation, [disable Internet Explorer enhanced security](/troubleshoot/developer/browsers/security-privacy/enhanced-security-configuration-faq), and then restart the **Azure AD Connect Provisioning Agent Package**  installation.

   ![Screenshot of the "Connect Azure AD" page.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-sign-in-to-azure.png)

1. On the **Configure Service Account** page, select a group Managed Service Account (gMSA). This account is used to run the agent service. If a Managed Service Account is already configured in your domain, you can skip this page. If prompted, select either of the following:

    - **Create gMSA** which lets the agent create the *provAgentgMSA$* Managed Service Account for you. The group Managed Service Account (for example, CONTOSO\provAgentgMSA$) will be created in the same Active Directory domain where the host server has joined. To use this option, enter the Active Directory domain administrator credentials. 
    - **Use custom gMSA**, and then provide the name of the Managed Service Account.
    
   ![Screenshot of the "Configure Service Account" page.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-configure-service-account.png)

   To continue, select **Next**.

1. On the **Connect Active Directory** page, if your domain name appears under **Configured domains**, skip to the next step. If your domain name doesn't appear, type your Active Directory domain name, and then select **Add directory**.  

    ![Screenshot that shows how to add an Active Directory domain.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-add-domain.png)

    Sign in with your Active Directory domain administrator account.  The domain administrator account shouldn't have password change requirements. If the password expires or changes, you'll need to reconfigure the agent with the new credentials. This operation will add your on-premises directory. Select **OK**, and then select **Next** to continue. 

    ![Screenshot that shows how to enter the domain admin credentials.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-sign-in-to-active-directory.png)

    The following screenshot shows an example of a contoso.com configured domain. Select **Next** to continue.

    ![Screenshot of the "Connect Active Directory" page.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-configured-domains.png)

1. On the **Configuration complete** page, select **Confirm**.  This operation registers and restarts the agent.

   ![Screenshot that shows the "Configuration complete" page.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-confirm-screen.png)

1. After this operation is completed, you should be notified that **Your agent configuration was successfully verified**.  Select **Exit**.

    ![Screenshot that shows the "configuration complete" page.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-complete-screen.png)

1. If you still get the initial splash screen, select **Close**.


