---
title: 'Tutorial:  Set up password hash sync as backup for AD FS in Microsoft Entra Connect'
description: Learn how to turn on password hash sync as a backup for Azure Directory Federation Services (AD FS) in Microsoft Entra Connect.
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

This tutorial walks you through the steps to set up password hash sync as a backup and failover for Azure Directory Federation Services (AD FS) in Microsoft Entra Connect. The tutorial also demonstrates how to set password hash sync as the primary authentication method if AD FS fails or becomes unavailable.

> [!NOTE]
> Although these steps usually are taken in an emergency or outage situation, we recommend that you test these steps and verify your procedures before an outage occurs.

## Prerequisites

This tutorial builds on [Tutorial: Use federation for hybrid identity in a single Active Directory forest](tutorial-federation.md). Completing the tutorial is a prerequisite to completing the steps in this tutorial.

> [!NOTE]
> If you don't have access to a Microsoft Entra Connect server or the server doesn't have internet access, you can contact [Microsoft Support](https://support.microsoft.com/contactus/) to assist with the changes to Microsoft Entra ID.

<a name='enable-password-hash-sync-in-azure-ad-connect'></a>

## Enable password hash sync in Microsoft Entra Connect

In [Tutorial: Use federation for hybrid identity in a single Active Directory forest](tutorial-federation.md), you created a Microsoft Entra Connect environment that's using federation.

Your first step in setting up your backup for federation is to turn on password hash sync and set Microsoft Entra Connect to sync the hashes:

1. Double-click the Microsoft Entra Connect icon that was created on the desktop during installation.
1. Select **Configure**.
1. In **Additional tasks**, select **Customize synchronization options**, and then select **Next**.

      :::image type="content" source="media/tutorial-phs-backup/backup2.png" alt-text="Screenshot that shows the Additional tasks pane, with Customize synchronization options selected.":::
1. Enter the username and password for the  [Hybrid Identity Administrator account you created](tutorial-federation.md#create-a-hybrid-identity-administrator-account-in-azure-ad) in the tutorial to set up federation.
1. In **Connect your directories**, select **Next**.
1. In **Domain and OU filtering**, select **Next**.
1. In **Optional features**, select **Password hash synchronization**, and then select **Next**.

   :::image type="content" source="media/tutorial-phs-backup/backup1.png" alt-text="Screenshot that shows the Optional features pane, with Password hash synchronization selected.":::
1. In **Ready to configure**, select **Configure**.
1. When configuration is finished, select **Exit**.

That's it!  You're done. Password hash sync will now occur, and it can be used as a backup if AD FS becomes unavailable.

## Switch to password hash sync

> [!IMPORTANT]
>
> - Before you switch to password hash sync, create a backup of your AD FS environment. You can create a backup by using the [AD FS Rapid Restore Tool](/windows-server/identity/ad-fs/operations/ad-fs-rapid-restore-tool#how-to-use-the-tool).
>
> - It takes some time for the password hashes to sync to Microsoft Entra ID.  It might be up to three hours before the sync finishes and you can start authenticating by using the password hashes.

Next, switch over to password hash synchronization. Before you start, consider in which conditions you should make the switch. Don't make the switch for temporary reasons, like a network outage, a minor AD FS problem, or a problem that affects a subset of your users.

If you decide to make the switch because fixing the problem will take too long, complete these steps:

1. In Microsoft Entra Connect, select **Configure**.
1. Select **Change user sign-in**, and then select **Next**.
1. Enter the username and password for the  [Hybrid Identity Administrator account you created](tutorial-federation.md#create-a-hybrid-identity-administrator-account-in-azure-ad) in the tutorial to set up federation.
1. In **User sign-in**, select **Password hash synchronization**, and then select the **Do not convert user accounts** checkbox.  
1. Leave the default **Enable single sign-on** selected and select **Next**.
1. In **Enable single sign-on**, select **Next**.
1. In **Ready to configure**, select **Configure**.
1. When configuration is finished, select **Exit**.

Users can now use their passwords to sign in to Azure and Azure services.

## Sign in with a user account to test sync

1. In a new web browser window, go to [https://myapps.microsoft.com](https://myapps.microsoft.com).
1. Sign in with a user account that was created in your new tenant.

   For the username, use the format `user@domain.onmicrosoft.com`. Use the same password the user uses to sign in to on-premises Active Directory.

   :::image type="content" source="media/tutorial-federation/verify1.png" alt-text="Screenshot that shows a successful message when testing the sign-in.":::

## Switch back to federation

Now, switch back to federation:

1. In Microsoft Entra Connect, select **Configure**.
1. Select **Change user sign-in**, and then select **Next**.
1. Enter the username and password for your Hybrid Identity Administrator account.
1. In  **User sign-in**, select **Federation with AD FS**, and then select **Next**.  
1. In **Domain Administrator credentials**, enter the contoso\Administrator username and password, and then select **Next.**
1. In **AD FS farm**, select **Next**.
1. In **Microsoft Entra domain**, select the domain and select **Next**.
1. In **Ready to configure**, select **Configure**.
1. When configuration is finished, select **Next**.

   :::image type="content" source="media/tutorial-phs-backup/backup4.png" alt-text="Screenshot that shows the Configuration complete pane.":::
1. In **Verify federation connectivity**, select **Verify**.  You might need to configure DNS records (add A and AAAA records) for verification to finish successfully.

   :::image type="content" source="media/tutorial-phs-backup/backup5.png" alt-text="Screenshot that shows the Verify federation connectivity dialog and the Verify button.":::
1. Select **Exit**.

## Reset the AD FS and Azure trust

The final task is to reset the trust between AD FS and Azure:

1. In Microsoft Entra Connect, select **Configure**.
1. Select **Manage federation**, and then select **Next**.
1. Select **Reset Microsoft Entra ID trust**, and then select **Next**.

   :::image type="content" source="media/tutorial-phs-backup/backup6.png" alt-text="Screenshot that shows the Manage federation pane, with Reset Microsoft Entra ID selected.":::
1. In **Connect to Microsoft Entra ID**, enter the username and password for your Global Administrator account or your Hybrid Identity Administrator account.
1. In **Connect to AD FS**, enter the contoso\Administrator username and password, and then select **Next.**
1. In **Certificates**, select **Next**.
1. Repeat the steps in [Sign in with a user account to test sync](#sign-in-with-a-user-account-to-test-sync).

You've successfully set up a hybrid identity environment that you can use to test and to get familiar with what Azure has to offer.

## Next steps

- Review [Microsoft Entra Connect hardware and prerequisites](how-to-connect-install-prerequisites.md).
- Learn how to use [Express settings](how-to-connect-install-express.md) in Microsoft Entra Connect.
- Learn more about [password hash sync](how-to-connect-password-hash-synchronization.md) with Microsoft Entra Connect.
