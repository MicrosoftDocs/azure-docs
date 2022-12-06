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

 1.  In the Azure portal, select **Azure Active Directory**.
 2.  On the left, select **Azure AD Connect**.
 3.  On the left, select **Cloud sync**.
 
 :::image type="content" source="media/active-directory-cloud-sync-how-to-install/new-ux-1.png" alt-text="Screenshot of new UX screen" lightbox="media/active-directory-cloud-sync-how-to-install/new-ux-1.png":::

 4. On the left, select **Agent**.
 5. Select **Download agent**, and select **Accept terms & download**.
 
 :::image type="content" source="media/active-directory-cloud-sync-how-to-install/new-ux-2.png" alt-text="Screenshot of download agent" lightbox="media/active-directory-cloud-sync-how-to-install/new-ux-2.png":::

 6. Once the **Azure AD Connect Provisioning Agent Package** has completed downloading, run the *AADConnectProvisioningAgentSetup.exe* installation file from your downloads folder.
 7. On the splash screen, select **I agree to the license and conditions**, and then select **Install**.

    ![Screenshot that shows the "Microsoft Azure AD Connect Provisioning Agent Package" splash screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-splash-screen.png)

 8. Once the installation operation completes, the configuration wizard will launch. Select **Next** to start the configuration.
 :::image type="content" source="media/active-directory-cloud-sync-how-to-install/new-ux-3.png" alt-text="Screenshot of the welcome screen" lightbox="media/active-directory-cloud-sync-how-to-install/new-ux-3.png":::
 9. On the **Select Extension** screen, select **HR-driven provsisioning (Workday and SuccessFactors) / Azure AD Connect Cloud Sync** and click **Next**.
 :::image type="content" source="media/active-directory-cloud-sync-how-to-install/new-ux-5.png" alt-text="Screenshot of the select extensions screen" lightbox="media/active-directory-cloud-sync-how-to-install/new-ux-5.png":::

 >[!NOTE]
 >If you are installing the provisioning agent for use with [on-premsise app provisioning](../articles/active-directory/app-provisioning/on-premises-application-provisioning-architecture.md) then select **On-premises application provisioning (Azure AD to application)**.

 10. Sign in with your Azure AD global administrator account.  If you have Internet Explorer enhanced security enabled, it will block the sign-in.  If so, close the installation, [disable Internet Explorer enhanced security](/troubleshoot/developer/browsers/security-privacy/enhanced-security-configuration-faq), and restart the **Azure AD Connect Provisioning Agent Package**  installation.

   ![Screenshot of the "Connect Azure AD" screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-sign-in-to-azure.png)

 11. On the **Configure Service Account** screen, select a group Managed Service Account (gMSA). This account is used to run the agent service. If a managed service account is already configured in your domain, you might skip this screen. If prompted, choose either:

    - **Create gMSA** which lets the agent create the **provAgentgMSA$** managed service account for you. The group managed service account (for example, CONTOSO\provAgentgMSA$) will be created in the same Active Directory domain where the host server has joined. To use this option, enter the Active Directory domain administrator credentials. 
    - **Use custom gMSA** and provide the name of the managed service account.
    
   ![Screenshot of the "Configure Service Account" screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-configure-service-account.png)

   To continue, select **Next**.

 12. On the **Connect Active Directory** screen, if your domain name appears under **Configured domains**, skip to the next step. Otherwise, type your Active Directory domain name, and select **Add directory**.  

    ![Screenshot that shows to add an Active Directory domain.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-add-domain.png)

    Sign in with your Active Directory domain administrator account.  The domain administrator account shouldn't have password change requirements. In case the password expires or changes, you'll need to reconfigure the agent with the new credentials. This operation will add your on-premises directory. Select **OK**, then select **Next** to continue. 

    ![Screenshot that shows how to enter the domain admin credentials.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-sign-in-to-active-directory.png)

    The following screenshot shows an example of contoso.com configured domain. Select **Next** to continue.

    ![Screenshot of the "Connect Active Directory" screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-configured-domains.png)

 13. On the **Configuration complete** screen, select **Confirm**.  This operation will register and restart the agent.

   ![Screenshot that shows the "Configuration complete" screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-confirm-screen.png)

 14. Once this operation completes, you should be notified that **Your agent configuration was successfully verified.**  You can select **Exit**.

    ![Screenshot that shows the "configuration complete" screen.](./media/active-directory-cloud-sync-how-to-install/azure-ad-cloud-sync-complete-screen.png)

 15. If you still get the initial splash screen, select **Close**.


