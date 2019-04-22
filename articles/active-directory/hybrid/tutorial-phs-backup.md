---
title: 'Tutorial:  Setting up PHS as backup for AD FS in Azure AD Connect | Microsoft Docs'
description: Demonstrates how to turn on password hash sync as a backup and for AD FS.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 01/30/2019
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Tutorial:  Setting up PHS as backup for AD FS in Azure AD Connect

The following tutorial will walk you through setting up password hash sync as a backup and fail-over for AD FS.  This document will also demonstrate how to enable password hash sync as the primary authentication method, if AD FS has failed or become unavailable.

## Prerequisites
This tutorial builds upon the [Tutorial: Federate a single AD forest environment to the cloud](tutorial-federation.md) and is a per-requisite before attempting this tutorial.  If you have not completed this tutorial, do so before attempting the steps in this document.

## Enable PHS in Azure AD Connect
The first step, now that we have an Azure AD Connect environment that is using federation, is to turn on password hash sync and allow Azure AD Connect to synchronize the hashes.

Do the following:

1.  Double-click the Azure AD Connect icon that was created on the desktop
2.  Click **Configure**.
3.  On the Additional tasks page, select **Customize synchronization options** and click **Next**.
4.  Enter the username and password for your global administrator.  This account was created [here](tutorial-federation.md#create-a-global-administrator-in-azure-ad) in the previous tutorial.
5.  On the **Connect your directories** screen, click **Next**.
6.  On the **Domain and OU filtering** screen, click **Next**.
7.  On the **Optional features** screen, check **Password hash synchronization** and click **Next**.
![Select](media/tutorial-phs-backup/backup1.png)</br>
8.  On the **Ready to configure** screen click **Configure**.
9.  Once the configuration completes, click **Exit**.
10. That's it!  You are done.  Password hash synchronization will now occur and can be used as a backup if AD FS becomes unavailable.

## Switch to password hash synchronization
Now, we will show you how to switch over to password hash synchronization. Before you start, consider under which conditions should you make the switch. Don't make the switch for temporary reasons, like a network outage, a minor AD FS problem, or a problem that affects a subset of your users. If you decide to make the switch because fixing the problem will take too long, do the following:

1. Double-click the Azure AD Connect icon that was created on the desktop
2.  Click **Configure**.
3.  Select **Change user sign-in** and click **Next**.
![Change](media/tutorial-phs-backup/backup2.png)</br>
4.  Enter the username and password for your global administrator.  This account was created [here](tutorial-federation.md#create-a-global-administrator-in-azure-ad) in the previous tutorial.
5.  On the **User sign-in** screen, select **Password Hash Synchronization** and place a check in the **Do not convert user accounts** box.  
6.  Leave the default **Enable single sign-on** selected and click **Next**.
7.  On the **Enable single sign-on** screen click **Next**.
8.  On the **Ready to configure** screen, click **Configure**.
9.  Once configuration is complete, click **Exit**.
10. Users can now use their passwords to sign in to Azure and Azure services.

## Test signing in with one of our users

1. Browse to [https://myapps.microsoft.com](https://myapps.microsoft.com)
2. Sign in with a user account that was created in our new tenant.  You will need to sign in using the following format: (user@domain.onmicrosoft.com). Use the same password that the user uses to sign in on-premises.</br>
   ![Verify](media/tutorial-password-hash-sync/verify1.png)</br>

## Next Steps


- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Password hash synchronization](how-to-connect-password-hash-synchronization.md)|
