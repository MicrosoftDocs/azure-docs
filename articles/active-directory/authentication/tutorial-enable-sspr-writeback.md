---
title: Enable Azure Active Directory password writeback
description: In this tutorial, you learn how to enable Azure AD self-service password reset writeback using Azure AD Connect to synchronize changes back to an on-premises Active Directory Domain Services environment.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 02/12/2020

ms.author: iainfou
author: iainfoulds
ms.reviewer: rhicock

ms.collection: M365-identity-device-management

# Customer intent: As an Azure AD Administrator, I want to learn how to enable and use password writeback so that when end-users reset their password through a web browser their updated password is synchronized back to my on-premises AD environment.
---
# Tutorial: Enable Azure Active Directory self-service password reset writeback to an on-premises environment

With Azure Active Directory (Azure AD) self-service password reset (SSPR), users can update their password or unlock their account using a web browser. In a hybrid environment where Azure AD is connected to an on-premises Active Directory Domain Services (AD DS) environment, this scenario can cause passwords to be be different between the two directories. Password writeback can be used to synchronize password changes in Azure AD back to your on-premises AD DS environment. Azure AD Connect provides a secure mechanism to send password changes back to an existing on-premises directory from Azure AD.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the required permissions for password writeback
> * Enable the password writeback option in Azure AD Connect
> * Enable password writeback in Azure AD SSPR

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* A working Azure AD tenant with at least a trial license enabled.
    * If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
    * For more information, see [Licensing requirements for Azure AD SSPR](concept-sspr-licensing.md).
* An account with *global administrator* privileges.
* Azure AD configured for self-service password reset.
    * If needed, [complete the previous tutorial to enable Azure AD SSPR](tutorial-enable-sspr.md).
* An existing on-premises AD DS environment configured with a current version of Azure AD Connect.
    * If needed, configure Azure AD Connect using the [Express](../hybrid/how-to-connect-install-express.md) or [Custom](../hybrid/how-to-connect-install-custom.md) settings.

## Active Directory permissions and on-premises password complexity policies 

The account specified in the Azure AD Connect utility must have the following items set if you want to be in scope for SSPR:

* **Reset password** 
* **Change password** 
* **Write permissions** on `lockoutTime`
* **Write permissions** on `pwdLastSet`
* **Extended rights** on either:
   * The root object of *each domain* in that forest
   * The user organizational units (OUs) you want to be in scope for SSPR

If you're not sure what account the described account refers to, open the Azure Active Directory Connect configuration UI and select the **View current configuration** option. The account that you need to add permission to is listed under **Synchronized Directories**.

If you set these permissions, the MA service account for each forest can manage passwords on behalf of the user accounts within that forest. 

> [!IMPORTANT]
> If you neglect to assign these permissions, then, even though writeback appears to be configured correctly, users will encounter errors when they attempt to manage their on-premises passwords from the cloud.
>

> [!NOTE]
> It might take up to an hour or more for these permissions to replicate to all the objects in your directory.
>

To set up the appropriate permissions for password writeback to occur, complete the following steps:

1. Open Active Directory Users and Computers with an account that has the appropriate domain administration permissions.
2. From the **View** menu, make sure **Advanced features** is turned on.
3. In the left panel, right-click the object that represents the root of the domain and select **Properties** > **Security** > **Advanced**.
4. From the **Permissions** tab, select **Add**.
5. Pick the account that permissions are being applied to (from the Azure AD Connect setup).
6. In the **Applies to** drop-down list, select **Descendant User objects**.
7. Under **Permissions**, select the boxes for the following options:
    * **Change password**
    * **Reset password**
8. Under **Properties**, select the boxes for the following options:
    * **Write lockoutTime**
    * **Write pwdLastSet**
9. Select **Apply/OK** to apply the changes and exit any open dialog boxes.

Since the source of authority is on premises, the password complexity policies apply from the same connected data source. Make sure you've changed the existing group policies for "Minimum password age". The group policy shouldn't be set to 1, which means password should be at least a day old before it can be updated. You need make sure it's set to 0. These settings can be found in `gpmc.msc` under **Computer Configuration > Policies > Windows Settings > Security Settings > Account Policies**. Run `gpupdate /force` to ensure that the change takes effect.

## Enable password writeback in Azure AD Connect

Azure AD Connect lets you synchronize users, groups, and credential between an on-premises AD DS environment and Azure AD. You typically install Azure AD Connect on a Windows Server 2012 or later computer that's joined to the on-premises AD DS domain. One of the configuration options in Azure AD Connect is for password writeback. When this option is enabled, self-service password reset events cause Azure AD Connect to synchronize the updated credentials back to the on-premises AD DS environment.

To enable self-service password reset writeback, enable the writeback in Azure AD Connect. From your Azure AD Connect server, complete the following steps:

1. Sign in to your Azure AD Connect server and start the **Azure AD Connect** configuration wizard.
2. On the **Welcome** page, select **Configure**.
3. On the **Additional tasks** page, select **Customize synchronization options**, and then select **Next**.
4. On the **Connect to Azure AD** page, enter a global administrator credential for your Azure tenant, and then select **Next**.
5. On the **Connect directories** and **Domain/OU** filtering pages, select **Next**.
6. On the **Optional features** page, select the box next to **Password writeback** and select **Next**.

    ![Configure Azure AD Connect for password writeback](media/tutorial-enable-sspr-writeback/enable-password-writeback.png)

7. On the **Ready to configure** page, select **Configure** and wait for the process to finish.
8. When you see the configuration finish, select **Exit**.

## Enable password writeback option in SSPR

With password writeback enabled in Azure AD Connect, now configure Azure AD SSPR for writeback. When you enable SSPR to use password writeback, users who change or reset their password have that updated password synchronized back to the on-premises AD DS environment as well.

To enable password writeback in SSPR, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) using a global administrator account.
2. Search for and select **Azure Active Directory**, select **Password reset**, then choose **On-premises integration**.
3. Set the option for **Write back passwords to your on-premises directory?**, to **Yes**.
4. Set the option for **Allow users to unlock accounts without resetting their password?**, to **Yes**.

    ![Enable Azure AD self-service password reset for password writeback](media/tutorial-enable-sspr-writeback/enable-sspr-writeback.png)

5. When ready, select **Save**.

## Next steps

In this tutorial, you have enabled password writeback for self-service password reset. Leave the Azure portal window open and continue to the next tutorial to configure additional settings related to self-service password reset before you roll out the solution in a pilot.

> [!div class="nextstepaction"]
> [Evaluate risk at sign in](tutorial-risk-based-sspr-mfa.md)
