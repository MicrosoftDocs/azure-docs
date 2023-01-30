---
title: Tutorial - Integrate an existing forest and a new forest with a single Azure AD tenant by using Azure AD Connect cloud sync
description: Learn how to add cloud sync to an existing hybrid identity environment.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 11/11/2022
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Tutorial: Integrate an existing forest and a new forest with a single Azure AD tenant

This tutorial walks you through adding cloud sync to an existing hybrid identity environment. 

![Diagram that shows the Azure AD Connect cloud sync flow.](media/tutorial-existing-forest/existing-forest-new-forest-2.png)

You can use the environment you create in this tutorial for testing or for getting more familiar with how a hybrid identity works. 

In this scenario, you sync an existing forest with an Azure AD tenant by using Azure Active Directory (Azure AD) Connect. You want to sync a new forest with the same Azure AD tenant. You'll set up cloud sync for the new forest. 

## Prerequisites

Before you begin, set up your environments.

### In the Azure AD admin center

1. Create a cloud-only global administrator account on your Azure AD tenant. 

   This way, you can manage the configuration of your tenant if your on-premises services fail or become unavailable. [Learn how to add a cloud-only global administrator account](../fundamentals/add-users-azure-active-directory.md). Complete this step to ensure that you don't get locked out of your tenant.

1. Add one or more [custom domain names](../fundamentals/add-custom-domain.md) to your Azure AD tenant. Your users can sign in with one of these domain names.

### In your on-premises environment

1. Identify a domain-joined host server that's running Windows Server 2012 R2 or later, with at least 4 GB of RAM and .NET 4.7.1+ runtime. 

1. If there's a firewall between your servers and Azure AD, configure the following items:

   - Ensure that agents can make *outbound* requests to Azure AD over the following ports:

     | Port number | How it's used |
     | --- | --- |
     | **80** | Downloads the certificate revocation lists (CRLs) while it validates the TLS/SSL certificate. |
     | **443** | Handles all outbound communication with the service. |
     | **8080** (optional) | Agents report their status every 10 minutes over port 8080, if port 443 is unavailable. This status is displayed in the Azure AD portal. |
     
     If your firewall enforces rules according to the originating users, open these ports for traffic from Windows services that run as a network service.

   - If your firewall or proxy allows you to specify safe suffixes, add connections to **\*.msappproxy.net** and **\*.servicebus.windows.net**. If it doesn't, allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly.

   - Your agents need access to **login.windows.net** and **login.microsoftonline.com** for initial registration. Open your firewall for those URLs as well.

   - For certificate validation, unblock the following URLs: **mscrl.microsoft.com:80**, **crl.microsoft.com:80**, **ocsp.msocsp.com:80**, and **www\.microsoft.com:80**. Because these URLs are used to validate certificates for other Microsoft products, you might already have these URLs unblocked.

## Install the Azure AD Connect provisioning agent

If you're using the [Basic Active Directory and Azure environment](tutorial-basic-ad-azure.md) tutorial, the agent is DC1. To install the agent, do the following: 

[!INCLUDE [active-directory-cloud-sync-how-to-install](../../../includes/active-directory-cloud-sync-how-to-install.md)]


## Verify agent installation

[!INCLUDE [active-directory-cloud-sync-how-to-verify-installation](../../../includes/active-directory-cloud-sync-how-to-verify-installation.md)]

## Configure Azure AD Connect cloud sync

To configure the cloud sync setup, do the following:

1.  Sign in to the Azure AD portal.
1.  Select **Azure Active Directory**.
1.  Select **Azure AD Connect**.
1.  Select **Manage cloud sync**.

    ![Screenshot that highlights the "Manage cloud sync" link.](media/how-to-configure/manage-1.png)

1.  Select **New Configuration**.

    ![Screenshot of the Azure AD Connect cloud sync page, with the "New configuration" link highlighted.](media/tutorial-single-forest/configure-1.png)

1.  On the **Configuration** page, enter a **Notification email**, move the selector to **Enable**, and then select **Save**.

    ![Screenshot of the "Edit provisioning configuration" page.](media/how-to-configure/configure-2.png)

1.  The configuration status should now be **Healthy**.

    ![Screenshot of Azure AD Connect cloud sync page, showing a "Healthy" status.](media/how-to-configure/manage-4.png)

## Verify that users are created and synchronization is occurring

You'll now verify that the users in your on-premises Active Directory have been synchronized and exist in your Azure AD tenant. This process might take a few hours to complete. To verify that the users are synchronized, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that has an Azure subscription.
1. On the left pane, select **Azure Active Directory**.
1. Under **Manage**, select **Users**.
1. Verify that the new users are displayed in your tenant.

## Test signing in with one of your users

1. Go to the [Microsoft My Apps](https://myapps.microsoft.com) page.
1. Sign in with a user account that was created in your new tenant.  You'll need to sign in by using the following format: *user@domain.onmicrosoft.com*. Use the same password that the user uses to sign in on-premises.

   ![Screenshot that shows the My Apps portal with signed-in users.](media/tutorial-single-forest/verify-1.png)

You have now successfully set up a hybrid identity environment that you can use to test and familiarize yourself with what Azure has to offer.

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
