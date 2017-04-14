---
title: 'Tutorial: Configuring LinkedIn Elevate for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to LinkedIn Elevate.
services: active-directory
documentationcenter: ''
author: asmalser-msft
writer: asmalser-msft
manager: stevenpo

ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/15/2017
ms.author: asmalser-msft
---

# Tutorial: Configuring LinkedIn Elevate for Automatic User Provisioning


The objective of this tutorial is to show you the steps you need to perform in LinkedIn Elevate and Azure AD to automatically provision and de-provision user accounts from Azure AD to LinkedIn Elevate. 

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active Active directory tenant
*   A LinkedIn Elevate tenant 
*   An administrator account in LinkedIn Elevate with access to the LinkedIn Account Center

Note: Azure Active Directory integrates with LinkedIn Elevate using the [SCIM](http://www.simplecloud.info/) protocol.

## Assigning users to Slack

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD will be synchronized. 

Before configuring and enabling the provisioning service, you will need to decide what users and/or groups in Azure AD represent the users who need access to LinkedIn Elevate. Once decided, you can assign these users to LinkedIn Elevate by following the instructions here:

[Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Slack

*	It is recommended that a single Azure AD user be assigned to LinkedIn Elevate to test the provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Slack, you must select the **User** role in the assignment dialog. The "Default Access" role does not work for provisioning.


## Configuring user provisioning to LinkedIn Elevate

This section guides you through connecting your Azure AD to LinkedIn Elevate's SCIM user account provisioning API, and configuring the provisioning service to create, update and disable assigned user accounts in LinkedIn Elevate based on user and group assignment in Azure AD.

**Tip:** You may also choose to enabled SAML-based Single Sign-On for LinkedIn Elevate, following the instructions provided in (Azure portal)[https://portal.azure.com]. Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.


### To configure automatic user account provisioning to LinkedIn Elevate in Azure AD:


The first step is to retrive your LinkedIn access token. If you are an Enterprise administrator, you can self provision an
    access token. In your account center, go to **Settings &gt; Global Settings** and open the **SCIM Setup** panel.
>
> **Note:** If you are accessing the account center directly rather than
> through a link, you can reach it using the following steps.

1)  Sign in to Liu.

2)  Select **Admin &gt; Admin Settings** .

3)  Click **Advanced Integrations** on the left sidebar. You are
    directed to the account center.

4)  Click **+ Add new SCIM configuration** and follow the procedure by
    filling in each field.

> When auto­assign licenses is not enabled, it means that only user
> data is synced.

![](media/image1.png){width="5.276667760279965in"
height="3.0866666666666664in"}

> When auto­license assignment is enabled, you need to note the
> application instance and license type. Licenses are assigned on a
> first­come first­serve basis until all the licenses are taken.

![](media/image2.png){width="5.483333333333333in" height="1.65in"}

5)  Click **Generate token** . You should see your access token display
    under the **Access token** field.

6)  Save your access token to your clipboard or computer before leaving
    the page.

7) Next, sign in to th [Azure portal](https://portal.azure.com), and browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

8) If you have already configured LinkedIn Elevate for single sign-on, search for your instance of LinkedIn Elevate using the search field. Otherwise, select **Add** and search for **LinkedIn Elevate** in the application gallery. Select LinkedIn Elevate from the search results, and add it to your list of applications.

9)	Select your instance of LinkedIn Elevate, then select the **Provisioning** tab.

10)	Set the **Provisioning Mode** to **Automatic**.

![Slack Provisioning](./media/active-directory-saas-slack-provisioning-tutorial/Slack1.PNG)

11)  Fill in the following fields under **Admin Credentials** :

* In the **Tenant URL** field, enter https://api.linkedin.com.

* In the **Secret Token** field, enter the access token you generated in step 1 and click **Test Connection** .

![](media/image3.png){width="4.9in" height="3.066666666666667in"}

* You should see a success notification on the upper­right side of
    your portal.

12)  Under Mappings, click **Synchronize Azure Active Directory Groups to
    LinkedIn Elevate** and delete the following Attribute Mappings: mail,
    mailEnabled, and securityEnabled.

13)  Under Attribute Mappings, you should only have displayName,
    mailNickname, and members.

![](media/image4.jpg){width="5.604166666666667in"
height="2.3752909011373577in"}

14) Under Mappings, click **Synchronize Azure Active Directory Users to
    LinkedIn Elevate** , and under Attribute Mappings, click **mail** . A
    new window displays.

15) In the new window, change the Source Attribute to
    **userPrincipleName** and click **OK** .

17) To enable the Azure AD provisioning service for Slack, change the **Provisioning Status** to **On** in the **Settings** section

18) Click **Save**. 

This will start the initial synchronization of any users and/or groups assigned to LinkedIn Elevate in the Users and Groups section. Note that the initial sync will take longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service on your Slack app.


## Additional Resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)