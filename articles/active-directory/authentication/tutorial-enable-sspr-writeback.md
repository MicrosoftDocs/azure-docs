---
title: Enable Azure Active Directory self-service password reset writeback 
description: In this tutorial, you learn how to enable Azure AD self-service password reset writeback using Azure AD Connect to synchronize changes back to an on-premises Active Directory Domain Services environment.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 02/12/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sahenry

# Customer intent: As an Azure AD Administrator, I want to learn how to enable and use self-service password reset writeback so that when end-users reset their password through a web browser their updated password is synchronized back to my on-premises AD environment.
ms.collection: M365-identity-device-management
---
# Tutorial: Enabling password writeback

In this tutorial, you will enable password writeback for your hybrid environment. Password writeback is used to synchronize password changes in Azure Active Directory (Azure AD) back to your on-premises Active Directory Domain Services (AD DS) environment. Password writeback is enabled as part of Azure AD Connect to provide a secure mechanism to send password changes back to an existing on-premises directory from Azure AD. You can find more detail about the inner workings of password writeback in the article, [What is password writeback](concept-sspr-writeback.md).

> [!div class="checklist"]
> * Enable password writeback option in Azure AD Connect
> * Enable password writeback option in self-service password reset (SSPR)

## Prerequisites

* Access to a working Azure AD tenant with at least a trial license assigned.
* An account with Global Administrator privileges in your Azure AD tenant.
* An existing server configured running a current version of [Azure AD Connect](../hybrid/how-to-connect-install-express.md).
* Previous self-service password reset (SSPR) tutorials have been completed.

## Licensing requirements for password writeback

**Self-Service Password Reset/Change/Unlock with on-premises writeback is a premium feature of Azure AD**. For more information about licensing, see the [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/).

To use password writeback, you must have one of the following licenses assigned on your tenant:

* Azure AD Premium P1
* Azure AD Premium P2
* Enterprise Mobility + Security E3 or A3
* Enterprise Mobility + Security E5 or A5
* Microsoft 365 E3 or A3
* Microsoft 365 E5 or A5
* Microsoft 365 F1
* Microsoft 365 Business

> [!WARNING]
> Standalone Office 365 licensing plans *don't support "Self-Service Password Reset/Change/Unlock with on-premises writeback"* and require that you have one of the preceding plans for this functionality to work.

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

## Enable password writeback option in Azure AD Connect

To enable password writeback we will first need to enable the feature from the server that you have installed Azure AD Connect on.

The following steps assume you have already configured Azure AD Connect in your environment by using the [Express](../hybrid/how-to-connect-install-express.md) or [Custom](../hybrid/how-to-connect-install-custom.md) settings.

1. To configure and enable password writeback, sign in to your Azure AD Connect server and start the **Azure AD Connect** configuration wizard.
2. On the **Welcome** page, select **Configure**.
3. On the **Additional tasks** page, select **Customize synchronization options**, and then select **Next**.
4. On the **Connect to Azure AD** page, enter a global administrator credential, and then select **Next**.
5. On the **Connect directories** and **Domain/OU** filtering pages, select **Next**.
6. On the **Optional features** page, select the box next to **Password writeback** and select **Next**.
7. On the **Ready to configure** page, select **Configure** and wait for the process to finish.
8. When you see the configuration finish, select **Exit**.

For common troubleshooting tasks related to password writeback, see the section [Troubleshoot password writeback](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback) in our troubleshooting article.

> [!WARNING]
> Password writeback will stop working for customers who are using Azure AD Connect versions 1.0.8641.0 and older when the [Azure Access Control service (ACS) is retired on November 7th, 2018](../azuread-dev/active-directory-acs-migration.md). Azure AD Connect versions 1.0.8641.0 and older will no longer allow password writeback at that time because they depend on ACS for that functionality.
>
> To avoid a disruption in service, upgrade from a previous version of Azure AD Connect to a newer version, see the article [Azure AD Connect: Upgrade from a previous version to the latest](../hybrid/how-to-upgrade-previous-version.md)

## Enable password writeback option in SSPR

Enabling the password writeback feature in Azure AD Connect is only half of the story. Allowing SSPR to use password writeback completes the loop thereby allowing users who change or reset their password to have that password set on-premises as well.

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global Administrator account.
2. Browse to **Azure Active Directory**, click on **Password Reset**, then choose **On-premises integration**.
3. Set the option for **Write back passwords to your on-premises directory**, to **Yes**.
4. Set the option for **Allow users to unlock accounts without resetting their password**, to **Yes**.
5. Click **Save**

## Next steps

In this tutorial, you have enabled password writeback for self-service password reset. Leave the Azure portal window open and continue to the next tutorial to configure additional settings related to self-service password reset before you roll out the solution in a pilot.

> [!div class="nextstepaction"]
> [Evaluate risk at sign in](tutorial-risk-based-sspr-mfa.md)
