---
title: 'Tutorial: Configure Workplace by Facebook for user provisioning | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Workplace by Facebook.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 6341e67e-8ce6-42dc-a4ea-7295904a53ef
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: jeedes

---
# Tutorial: Configure Workplace by Facebook for user provisioning

This tutorial shows you the steps necessary to automatically provision and de-provision user accounts from Azure Active Directory (Azure AD) to Workplace by Facebook.

## Prerequisites

To configure Azure AD integration with Workplace by Facebook, you need the following:

- An Azure AD subscription
- A Workplace by Facebook single sign-on (SSO) enabled subscription

To test the steps in this tutorial, follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a [one-month trial offer](https://azure.microsoft.com/pricing/free-trial/).

## Assign users to Workplace by Facebook

Azure AD uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling the provisioning service, decide what users and groups in Azure AD represent the users who need access to your Workplace by Facebook app. You can then assign these users to your Workplace by Facebook app by following the instructions in 
[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal).

>[!IMPORTANT]
>*   Test the provisioning configuration by assigning a single Azure AD user to Workplace by Facebook. Assign additional users and groups later.
>*   When you assign a user to Workplace by Facebook, you must select a valid user role. The Default Access role does not work for provisioning.

## Enable automated user provisioning

This section guides you through connecting your Azure AD to the user account provisioning API of Workplace by Facebook. You also learn how to configure the provisioning service to create, update, and disable assigned user accounts in Workplace by Facebook. This is based on user and group assignment in Azure AD.

>[!Tip]
>You can also choose to enabled SAML-based SSO for Workplace by Facebook, by following the instructions provided in the [Azure portal](https://portal.azure.com). SSO can be configured independently of automatic provisioning, though these two features complement each other.

### Configure user account provisioning to Workplace by Facebook in Azure AD

Azure AD supports the ability to automatically synchronize the account details of assigned users to Workplace by Facebook. This automatic synchronization enables Workplace by Facebook to get the data it needs to authorize users for access, before them attempting to sign in for the first time. It also de-provisions users from Workplace by Facebook when access has been revoked in Azure AD.

1. In the [Azure portal](https://portal.azure.com), select **Azure Active Directory** > **Enterprise Apps** > **All applications**.

2. If you have already configured Workplace by Facebook for SSO, search for your instance of Workplace by Facebook by using the search field. Otherwise, select **Add** and search for **Workplace by Facebook** in the application gallery. Select **Workplace by Facebook** from the search results, and add it to your list of applications.

3. Select your instance of Workplace by Facebook, and then select the **Provisioning** tab.

4. Set **Provisioning Mode** to **Automatic**. 

    ![Screenshot of Workplace by Facebook provisioning options](./media/active-directory-saas-facebook-at-work-provisioning-tutorial/provisioning.png)

5. Under the **Admin Credentials** section, enter the **Secret Token** and the **Tenant URL** of your Workplace by Facebook administrator.

6. In the Azure portal, select **Test Connection** to ensure Azure AD can connect to your Workplace by Facebook app. If the connection fails, ensure that your Workplace by Facebook account has Team Admin permissions.

7. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the check box.

8. Select **Save**.

9. Under the Mappings section, select **Synchronize Azure Active Directory Users to Workplace by Facebook**.

10. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Workplace by Facebook. The attributes selected as **Matching** properties are used to match the user accounts in Workplace by Facebook for update operations. To commit any changes, select **Save**.

11. To enable the Azure AD provisioning service for Workplace by Facebook, in the **Settings** section, change the **Provisioning Status** to **On**.

12. Select **Save**.

For more information on how to configure automatic provisioning, see [the Facebook documentation](https://developers.facebook.com/docs/facebook-at-work/provisioning/cloud-providers).

You can now create a test account. Wait for up to 20 minutes to verify that the account has been synchronized to Workplace by Facebook.

## Additional resources

* [Managing user account provisioning for enterprise apps](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
* [Configure single sign-on](active-directory-saas-facebook-at-work-tutorial.md)

