---
title: 'Tutorial: Microsoft Entra SSO integration with Work.com'
description: Learn how to configure single sign-on between Microsoft Entra ID and Work.com.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Microsoft Entra integration with Work.com

In this tutorial, you'll learn how to integrate Work.com with Microsoft Entra ID. When you integrate Work.com with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Work.com.
* Enable your users to be automatically signed-in to Work.com with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with Work.com, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/)
* Work.com single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Work.com supports **SP** initiated SSO.

## Add Work.com from the gallery

To configure the integration of Work.com into Microsoft Entra ID, you need to add Work.com from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Work.com** in the search box.
1. Select **Work.com** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-workcom'></a>

## Configure and test Microsoft Entra SSO for Work.com

Configure and test Microsoft Entra SSO with Work.com using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Work.com.

To configure and test Microsoft Entra SSO with Work.com, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    2. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
2. **[Configure Work.com SSO](#configure-workcom-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Work.com test user](#create-workcom-test-user)** - to have a counterpart of B.Simon in Work.com that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Work.com** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `http://<companyname>.my.salesforce.com`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [Work.com Client support team](https://help.salesforce.com/articleView?id=000159855&type=3) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Work.com** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to Work.com.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Work.com**.
3. In the app's overview page, find the **Manage** section and select **Users and groups**.
4. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
5. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
6. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
7. In the **Add Assignment** dialog, click the **Assign** button.


## Configure Work.com SSO

1. Sign in to your Work.com tenant as administrator.

2. Go to **Setup**.
   
    ![Screenshot shows Setup selected from the user menu.](./media/work-com-tutorial/setup.png "Setup")

3. On the left navigation pane, in the **Administer** section, click **Domain Management** to expand the related section, and then click **My Domain** to open the **My Domain** page. 
   
    ![Screenshot shows My Domain selected Domain Management in the Administer pane.](./media/work-com-tutorial/administer.png "My Domain")

4. To verify that your domain has been set up correctly, make sure that it is in “**Step 4 Deployed to Users**” and review your “**My Domain Settings**”.
   
    ![Screenshot shows Domain Deployed to User.](./media/work-com-tutorial/domain-settings.png "Domain Deployed to User")

5. Sign in to your Work.com tenant.

6. Go to **Setup**.
    
    ![Screenshot shows Setup selected from the user menu.](./media/work-com-tutorial/setup.png "Setup")

7. Expand the **Security Controls** menu, and then click **Single Sign-On Settings**.
    
    ![Screenshot shows Single Sign-On Settings.](./media/work-com-tutorial/security-controls.png "Single Sign-On Settings")

8. On the **Single Sign-On Settings** dialog page, perform the following steps:
    
    ![Screenshot shows SAML Enabled.](./media/work-com-tutorial/sso-settings.png "SAML Enabled")
    
    a. Select **SAML Enabled**.
    
    b. Click **New**.

9. In the **SAML Single Sign-On Settings** section, perform the following steps:
    
    ![Screenshot shows SAML Single Sign-On Setting.](./media/work-com-tutorial/configuration.png "SAML Single Sign-On Setting")
    
    a. In the **Name** textbox, type a name for your configuration.  
       
    > [!NOTE]
    > Providing a value for **Name** does automatically populate the **API Name** textbox.
    
    b. In **Issuer** textbox, paste the value of **Microsoft Entra Identifier**..
    
    c. To upload the downloaded certificate from Azure portal, click **Browse**.
    
    d. In the **Entity Id** textbox, type `https://salesforce-work.com`.
    
    e. As **SAML Identity Type**, select **Assertion contains the Federation ID from the User object**.
    
    f. As **SAML Identity Location**, select **Identity is in the NameIdentfier element of the Subject statement**.
    
    g. In **Identity Provider Login URL** textbox, paste the value of **Login URL**..

    h. In **Identity Provider Logout URL** textbox, paste the value of **Logout URL**..
    
    i. As **Service Provider Initiated Request Binding**, select **HTTP Post**.
    
    j. Click **Save**.

10. In your Work.com classic portal, on the left navigation pane, click **Domain Management** to expand the related section, and then click **My Domain** to open the **My Domain** page. 
    
    ![Screenshot shows My Domain selected from Domain Management.](./media/work-com-tutorial/my-domain.png "My Domain")

11. On the **My Domain** page, in the **Login Page Branding** section, click **Edit**.
    
    ![Screenshot shows the Login Page Branding section where you can select edit.](./media/work-com-tutorial/edit.png "Login Page Branding")

12. On the **Login Page Branding** page, in the **Authentication Service** section, the name of your **SAML SSO Settings** is displayed. Select it, and then click **Save**.
    
    ![Screenshot shows Login Page Branding where you can select the name of your setting, which is P P E.](./media/work-com-tutorial/save.png "Login Page Branding")

### Create Work.com test user

For Microsoft Entra users to be able to sign in, they must be provisioned to Work.com. In the case of Work.com, provisioning is a manual task.

### To configure user provisioning, perform the following steps:

1. Sign on to your Work.com company site as an administrator.

2. Go to **Setup**.
   
    ![Screenshot shows Setup selected from the user menu.](./media/work-com-tutorial/setup.png "Setup")

3. Go to **Manage Users \> Users**.
   
    ![Screenshot shows Manage Users.](./media/work-com-tutorial/users.png "Manage Users")

4. Click **New User**.
   
    ![Screenshot shows All Users.](./media/work-com-tutorial/new-user.png "All Users")

5. In the User Edit section, perform the following steps, in attributes of a valid Microsoft Entra account you want to provision into the related textboxes:
   
    ![Screenshot shows User Edit.](./media/work-com-tutorial/create-user.png "User Edit")
   
    a. In the **First Name** textbox, type the **first name** of the user **Britta**.
	
	b. In the **Last Name** textbox, type the **last name** of the user **Simon**.
	
	c. In the **Alias** textbox, type the **name** of the user **BrittaS**.
    
    d. In the **Email** textbox, type the **email address** of user Brittasimon@contoso.com.
    
    e. In the **User Name** textbox, type a user name of user like Brittasimon@contoso.com.
    
    f. In the **Nick Name** textbox, type a **nick name** of user **Simon**.
    
    g. Select **Role**, **User License**, and **Profile**.
	
	h. Click **Save**.  
      
    > [!NOTE]
    > The Microsoft Entra account holder will get an email including a link to confirm the account before it becomes active.
    > 

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Work.com Sign-on URL where you can initiate the login flow. 

* Go to Work.com Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Work.com tile in the My Apps, this will redirect to Work.com Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Work.com you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
