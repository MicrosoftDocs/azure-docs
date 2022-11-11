---
title: Tutorial - Integrate a single forest with a single Azure AD tenant
description: This topic describes the pre-requisites and the hardware requirements cloud sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 11/10/2022
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Tutorial: Integrate a single forest with a single Azure AD tenant

This tutorial walks you through creating a hybrid identity environment using Azure Active Directory (Azure AD) Connect cloud sync.

![Diagram that shows the Azure AD Connect cloud sync flow](media/tutorial-single-forest/diagram-2.png)

You can use the environment you create in this tutorial for testing or for getting more familiar with cloud sync.

## Prerequisites

### In the Azure Active Directory admin center

1. Create a cloud-only global administrator account on your Azure AD tenant. This way, you can manage the configuration of your tenant should your on-premises services fail or become unavailable. Learn about [adding a cloud-only global administrator account](../fundamentals/add-users-azure-active-directory.md). Completing this step is critical to ensure that you don't get locked out of your tenant.
2. Add one or more [custom domain names](../fundamentals/add-custom-domain.md) to your Azure AD tenant. Your users can sign in with one of these domain names.

### In your on-premises environment

1. Identify a domain-joined host server running Windows Server 2016 or greater with minimum of 4-GB RAM and .NET 4.7.1+ runtime 

2. If there's a firewall between your servers and Azure AD, configure the following items:
   - Ensure that agents can make *outbound* requests to Azure AD over the following ports:

     | Port number | How it's used |
     | --- | --- |
     | **80** | Downloads the certificate revocation lists (CRLs) while validating the TLS/SSL certificate |
     | **443** | Handles all outbound communication with the service |
     | **8080** (optional) | Agents report their status every 10 minutes over port 8080, if port 443 is unavailable. This status is displayed on the Azure AD portal. |
     
     If your firewall enforces rules according to the originating users, open these ports for traffic from Windows services that run as a network service.
   - If your firewall or proxy allows you to specify safe suffixes, then add  connections t to **\*.msappproxy.net** and **\*.servicebus.windows.net**. If not, allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly.
   - Your agents need access to **login.windows.net** and **login.microsoftonline.com** for initial registration. Open your firewall for those URLs as well.
   - For certificate validation, unblock the following URLs: **mscrl.microsoft.com:80**, **crl.microsoft.com:80**, **ocsp.msocsp.com:80**, and **www\.microsoft.com:80**. Since these URLs are used for certificate validation with other Microsoft products, you may already have these URLs unblocked.

## Install the Azure AD Connect provisioning agent

1. Sign in to the domain joined server.  If you're using the  [Basic AD and Azure environment](tutorial-basic-ad-azure.md) tutorial, it would be DC1.

1. Sign in to the Azure portal using cloud-only global admin credentials.

1. On the left, select **Azure Active Directory**. 

1. Select **Azure AD Connect**, and in the center select **Manage Azure AD cloud sync**.

   ![Screenshot that shows how to download the Azure AD cloud sync.](media/how-to-install/install-6.png)

1. Select **Download agent**, and select **Accept terms & download**.

   [![Screenshot that shows how to accept the terms and start the download of Azure AD cloud sync.](media/how-to-install/install-6a.png)](media/how-to-install/install-6a.png#lightbox)

1. Run the **Azure AD Connect Provisioning Agent Package** AADConnectProvisioningAgentSetup.exe in your downloads folder.

1. On the splash screen, select **I agree to the license and conditions**, and select **Install**.

   ![Screenshot that shows the "Microsoft Azure AD Connect Provisioning Agent Package" splash screen.](media/how-to-install/install-1.png)

1. Once this operation completes, the configuration wizard will launch.  Sign in with your Azure AD global administrator account.  If you have Internet Explorer enhanced security enabled, it will block the sign-in.  If so, close the installation, [disable Internet Explorer enhanced security](/troubleshoot/developer/browsers/security-privacy/enhanced-security-configuration-faq), and restart the **Azure AD Connect Provisioning Agent Package**  installation.

1. On the **Connect Active Directory** screen, select **Authenticate** and then sign in with your Active Directory domain administrator account.  NOTE: The domain administrator account shouldn't have password change requirements. If the password expires or changes, you'll need to reconfigure the agent with the new credentials. 

   ![Screenshot of the "Connect Active Directory" screen.](media/how-to-install/install-3.png)

1. On the **Configure Service Account screen**, select  **Create gMSA** and enter the Active Directory domain administrator credentials to create the group Managed Service Account. This account will be used to run the agent service. To continue, select **Next**.

    [![Screenshot that shows create service account.](media/how-to-install/new-install-7.png)](media/how-to-install/new-install-7.png#lightbox)

1. On the **Connect Active Directory** screen, select **Next**.  Your current domain has been added automatically.  

    [![Screenshot that shows connecting to the Active Directory.](media/how-to-install/new-install-8.png)](media/how-to-install/new-install-8.png#lightbox)

1. On the **Configuration complete** screen, select **Confirm**.  This operation will register and restart the agent.

   ![Screenshot that shows the "Configuration complete" screen.](media/how-to-install/install-4a.png)

1. Once this operation completes, you should see a notice: **Your agent configuration was successfully verified.**  You can select **Exit**.

    ![Screenshot that shows the "configuration complete" screen.](media/how-to-install/install-5.png)

1. If you still get the initial splash screen, select **Close**.


## Verify agent installation

Agent verification occurs in the Azure portal and on the local server that is running the agent.

### Azure portal agent verification

To verify the agent is being registered by Azure AD, follow these steps:

1. Sign in to the Azure portal.
1. On the left, select **Azure Active Directory**, select **Azure AD Connect** and in the center select **Manage Azure AD cloud sync**.

    ![Screenshot that shows how to manage the Azure AD could sync.](media/how-to-install/install-6.png)

1. On the **Azure AD Connect cloud sync** screen, select 
**Review all agents**.
    
   [![Screenshot that shows the Azure AD provisioning agents.](media/how-to-install/install-7.png)](media/how-to-install/install-7.png#lightbox)
 
1. On the **On-premises provisioning agents screen**, you'll see the agents you've installed.  Verify that the agent in question is there and is marked **active**.

    [![Screenshot that shows the status of a provisioning agent.](media/how-to-install/verify-1.png)](media/how-to-install/verify-1.png#lightbox)

### On the local server

To verify that the agent is running, follow these steps:

1. Log on to the server with an administrator account

1. Open **Services** by either navigating to it or by going to Start/Run/Services.msc.

1. Under **Services**, make sure **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are present and the status is **Running**.

    [![Screenshot that shows the Windows services.](media/how-to-install/troubleshoot-1.png)](media/how-to-install/troubleshoot-1.png#lightbox)

## Configure Azure AD Connect cloud sync

Use the following steps to configure and start the provisioning:

1. Sign in to the Azure AD portal.
1. Select **Azure Active Directory**
1. Select **Azure AD Connect**
1. Select **Manage cloud sync**

    ![Screenshot showing "Manage cloud sync" link.](media/how-to-configure/manage-1.png)

1. Select **New Configuration**
    
    [![Screenshot of Azure AD Connect cloud sync screen with "New configuration" link highlighted.](media/tutorial-single-forest/configure-1.png)](media/tutorial-single-forest/configure-1.png#lightbox)

1. On the configuration screen, enter a **Notification email**, move the selector to **Enable** and select **Save**.

    [![Screenshot of Configure screen with Notification email filled in and Enable selected.](media/how-to-configure/configure-2.png)](media/how-to-configure/configure-2.png#lightbox)

1. The configuration status should now be **Healthy**.

    [![Screenshot of Azure AD Connect cloud sync screen showing Healthy status.](media/how-to-configure/manage-4.png)](media/how-to-configure/manage-4.png#lightbox)

## Verify users are created and synchronization is occurring

You'll now verify that the users that you had in your on-premises directory have been synchronized and now exist in your Azure AD tenant. The sync operation may take a few hours to complete. To verify users are synchronized, follow these steps:


1. Browse to the [Azure portal](https://portal.azure.com) and sign in with an account that has an Azure subscription.
2. On the left, select **Azure Active Directory**
3. Under **Manage**, select **Users**.
4. Verify that the new users appear in your tenant

## Test signing in with one of your users

1. Browse to [https://myapps.microsoft.com](https://myapps.microsoft.com)

1. Sign in with a user account that was created in your tenant.  You'll need to sign in using the following format: (user@domain.onmicrosoft.com). Use the same password that the user uses to sign in on-premises.

   ![Screenshot that shows the my apps portal with a signed in users.](media/tutorial-single-forest/verify-1.png)

You've now successfully configured a hybrid identity environment using Azure AD Connect cloud sync.

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-sync.md)
