---
title: How-to configure password writeback for Azure AD SSPR - Azure Active Directory
description: Use Azure AD and Azure AD Connect to writeback passwords to an on-premises directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/11/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# How-to: Configure password writeback

The following steps assume you have already configured Azure AD Connect in your environment by using the [Express](../hybrid/how-to-connect-install-express.md) or [Custom](../hybrid/how-to-connect-install-custom.md) settings.

1. To configure and enable password writeback, sign in to your Azure AD Connect server and start the **Azure AD Connect** configuration wizard.
2. On the **Welcome** page, select **Configure**.
3. On the **Additional tasks** page, select **Customize synchronization options**, and then select **Next**.
4. On the **Connect to Azure AD** page, enter a global administrator credential, and then select **Next**.
5. On the **Connect directories** and **Domain/OU** filtering pages, select **Next**.
6. On the **Optional features** page, select the box next to **Password writeback** and select **Next**.
   ![Enable password writeback in Azure AD Connect][Writeback]
7. On the **Ready to configure** page, select **Configure** and wait for the process to finish.
8. When you see the configuration finish, select **Exit**.

For common troubleshooting tasks related to password writeback, see the section [Troubleshoot password writeback](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback) in our troubleshooting article.

> [!WARNING]
> Password writeback will stop working for customers who are using Azure AD Connect versions 1.0.8641.0 and older when the [Azure Access Control service (ACS) is retired on November 7th, 2018](../develop/active-directory-acs-migration.md). Azure AD Connect versions 1.0.8641.0 and older will no longer allow password writeback at that time because they depend on ACS for that functionality.
>
> To avoid a disruption in service, upgrade from a previous version of Azure AD Connect to a newer version, see the article [Azure AD Connect: Upgrade from a previous version to the latest](../hybrid/how-to-upgrade-previous-version.md)
>

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
>

## Active Directory permissions

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

## Next steps

[What is password writeback?](concept-sspr-writeback.md)

[Writeback]: ./media/howto-sspr-writeback/enablepasswordwriteback.png "Enable password writeback in Azure AD Connect"
