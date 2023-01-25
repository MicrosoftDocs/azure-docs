---
title: 'Tutorial:  Set up password hash sync as backup for AD FS in Azure AD Connect'
description: Learn how to turn on password hash sync as a backup for Azure Directory Federation Services (AD FS) in Azure Active Directory (Azure AD) Connect.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Tutorial:  Set up password hash sync as backup for Azure Directory Federation Services

This tutorial walks you through the steps to set up password hash sync as a backup and failover for Azure Directory Federation Services (AD FS) in Azure Active Directory Connect. The tutorial also demonstrates how to set password hash sync as the primary authentication method if AD FS fails or becomes unavailable.

> [!NOTE]
> Although these steps typically are taken in an emergency or outage situation, we recommend that you test these steps and verify your procedures before an outage occurs.

## Prerequisites

This tutorial builds upon the [Tutorial: Federate a single AD forest environment to the cloud](tutorial-federation.md) and is a per-requisite before attempting this tutorial.  If you have not completed this tutorial, do so before attempting the steps in this document.

>[!NOTE]
>In the event that you do not have access to Azure AD Connect server or the server does not have access to the internet, you can contact [Microsoft Support](https://support.microsoft.com/contactus/) to assist with the changes to the Azure AD side.

## Enable PHS in Azure AD Connect

The first step, now that we have an Azure AD Connect environment that is using federation, is to turn on password hash sync and allow Azure AD Connect to synchronize the hashes.

Do the following:

1. Double-click the Azure AD Connect icon that was created on the desktop
1. Select **Configure**.
1. On the Additional tasks page, select **Customize synchronization options** and select **Next**.
1. Enter the username and password for your Hybrid Identity Administrator or your hybrid identity administrator.  This account was created [here](tutorial-federation.md#create-a-hybrid-identity-administrator-in-azure-ad) in the previous tutorial.
1. On the **Connect your directories** screen, select **Next**.
1. On the **Domain and OU filtering** screen, select **Next**.
1. On the **Optional features** screen, check **Password hash synchronization** and select **Next**.

   ![Select](media/tutorial-phs-backup/backup1.png)

1. On the **Ready to configure** screen select **Configure**.
1. Once the configuration completes, select **Exit**.
1. That's it!  You are done.  Password hash synchronization will now occur and can be used as a backup if AD FS becomes unavailable.

## Switch to password hash sync

> [!IMPORTANT]
>
> - Before you switch to password hash sync, create a backup of your AD FS environment. You can create a backup by using the [AD FS Rapid Restore Tool](/windows-server/identity/ad-fs/operations/ad-fs-rapid-restore-tool#how-to-use-the-tool).
>
> - It takes some time for the password hashes to sync to Azure AD.  It might be up to 3 hours before the sync finishes and you can start authenticating by using the password hashes.

Now, we will show you how to switch over to password hash synchronization. Before you start, consider under which conditions should you make the switch. Don't make the switch for temporary reasons, like a network outage, a minor AD FS problem, or a problem that affects a subset of your users. If you decide to make the switch because fixing the problem will take too long, do the following:

1. Double-click the Azure AD Connect icon that was created on the desktop.
1. Select **Configure**.
1. Select **Change user sign-in**, and then select **Next**.

   ![Change](media/tutorial-phs-backup/backup2.png)

1. Enter the username and password for your Hybrid Identity Administratoristrator or your hybrid identity administrator.  This account was created [here](tutorial-federation.md#create-a-hybrid-identity-administrator-in-azure-ad) in the previous tutorial.
1. On the **User sign-in** screen, select **Password Hash Synchronization** and place a check in the **Do not convert user accounts** box.  
1. Leave the default **Enable single sign-on** selected and select **Next**.
1. On the **Enable single sign-on** screen select **Next**.
1. On the **Ready to configure** screen, select **Configure**.
1. Once configuration is complete, select **Exit**.
1. Users can now use their passwords to sign in to Azure and Azure services.

## Test signing in with one of our users

1. Browse to [https://myapps.microsoft.com](https://myapps.microsoft.com)
1. Sign in with a user account that was created in our new tenant.  You will need to sign in using the following format: (user@domain.onmicrosoft.com). Use the same password that the user uses to sign in on-premises.

   ![Screenshot that shows a successful message when testing the sign in. ](media/tutorial-password-hash-sync/verify1.png)

## Switch back to federation

Now, we will show you how to switch back to federation.  To do this, do the following:

1. Double-click the Azure AD Connect icon that was created on the desktop
1. Select **Configure**.
1. Select **Change user sign-in** and select **Next**.
1. Enter the username and password for your Hybrid Identity Administrator or your hybrid identity administrator.  This is the account that was created [here](tutorial-federation.md#create-a-hybrid-identity-administrator-in-azure-ad) in the previous tutorial.
1. On the **User sign-in** screen, select **Federation with AD FS** and select **Next**.  
1. On the Domain Administrator credentials page, enter the contoso\Administrator username and password and select **Next.**
1. On the AD FS farm screen, select **Next**.
1. On the **Azure AD domain** screen, select the domain from the drop-down and select **Next**.
1. On the **Ready to configure** screen, select **Configure**.
1. Once configuration is complete, select **Next**.

   ![Configure](media/tutorial-phs-backup/backup4.png)

1. On the **Verify federation connectivity** screen, select **Verify**.  You may need to configure DNS records (add A and AAAA records) for this to complete successfully.

   ![Screenshot that shows the Verify federation connectivity screen and the Verify button.](media/tutorial-phs-backup/backup5.png)

1. Select **Exit**.

## Reset the AD FS and Azure trust

Now we need to reset the trust between AD FS and Azure.

1. Double-click the Azure AD Connect icon that was created on the desktop
1. Select **Configure**.
1. Select **Manage Federation** and select **Next**.
1. Select **Reset Azure AD trust** and select **Next**.

   ![Reset](media/tutorial-phs-backup/backup6.png)</br>
1. On the **Connect to Azure AD** screen enter the username and password for your global administrator or your hybrid identity administrator.
1. On the **Connect to AD FS** screen, enter the contoso\Administrator username and password and select **Next.**
1. On the **Certificates** screen, select **Next**.

## Test signing in with a user

1. Browse to [https://myapps.microsoft.com](https://myapps.microsoft.com)
1. Sign-in with a user account that was created in our new tenant.  You will need to sign-in using the following format: (user@domain.onmicrosoft.com). Use the same password that the user uses to sign-in on-premises.

   ![Verify](media/tutorial-password-hash-sync/verify1.png)

You have now successfully setup a hybrid identity environment that you can use to test and familiarize yourself with what Azure has to offer.

## Next steps

- [Hardware and prerequisites](how-to-connect-install-prerequisites.md)
- [Express settings](how-to-connect-install-express.md)
- [Password hash synchronization](how-to-connect-password-hash-synchronization.md)
