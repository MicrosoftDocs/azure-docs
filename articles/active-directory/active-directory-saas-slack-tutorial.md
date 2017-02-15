---
title: 'Tutorial: Azure Active Directory integration with Slack | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Slack.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: ffc5e73f-6c38-4bbb-876a-a7dd269d4e1c
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/25/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Slack

In this tutorial, you learn how to integrate Slack with Azure Active Directory (Azure AD).

Integrating Slack with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Slack
- You can enable your users to automatically get signed-on to Slack (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Slack, you need the following items:

- An Azure AD subscription
- A Slack single-sign on enabled subscription


> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get an one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Slack from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding Slack from the gallery
To configure the integration of Slack into Azure AD, you need to add Slack from the gallery to your list of managed SaaS apps.

**To add Slack from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **Slack**.

	![Creating an Azure AD test user](./media/active-directory-saas-slack-tutorial/tutorial_slack_000.png)

5. In the results panel, select **Slack**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-slack-tutorial/tutorial_slack_0001.png)


##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Slack based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Slack is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Slack needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Slack.

To configure and test Azure AD single sign-on with Slack, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Slack test user](#creating-a-slack-test-user)** - to have a counterpart of Britta Simon in Slack that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your Slack application.

**To configure Azure AD single sign-on with Slack, perform the following steps:**

1. In the Azure Management portal, on the **Slack** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_01.png)

3. On the **Slack Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_02.png)

    a. In the **Sign On URL** textbox, type a URL using the following pattern: `https://<company name>.slack.com`

	b. In the **Identifier** textbox, type: `https://slack.com`

	> [!NOTE] 
	> Please note that these are not the real values. You have to update these values with the actual Sign On URL and Identifier. Here we suggest you to use the unique value of URL in the Identifier. Contact [Slack support team](https://slack.com/help/contact) to get these values. 

4. Slack application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. The following screenshot shows an example for this.
	
	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_03.png)

5. In the **User Attributes** section on the **Single sign-on** dialog, select **user.mail**  as **User Identifier** and for each row shown in the table below, perform the following steps:
    
	| Attribute Name | Attribute Value |
	| --- | --- |    
    | User.Email | user.userprincipalname |
	| first_name | user.givenname |
	| last_name | user.surname |
	| User.Username | extractmailprefix([userprincipalname]) |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_04.png)

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.
	
	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **OK**

6. On the **SAML Signing Certificate** section, click **Create new certificate**.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_06.png) 	

7. On the **Create New Certificate** dialog, click the calendar icon and select an **expiry date**. Then click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_general_300.png)

8. On the **SAML Signing Certificate** section, select **Make new certificate active** and click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_07.png)

9. On the pop-up **Rollover certificate** window, click **OK**.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_general_400.png)

10. On the **SAML Signing Certificate** section, click **Certificate (base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_08.png) 

11. On the **Slack Configuration** section, click **Configure Slack** to open **Configure sign-on** window.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_09.png) 

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_10.png)

12.  In a different web browser window, log into your Slack company site as an administrator.

13.  Navigate to **Microsoft Azure AD** then go to **Team Settings**.

    ![Configure Single Sign-On On App Side](./media/active-directory-saas-slack-tutorial/tutorial_slack_001.png)

14.  In the **Team Settings** section, click the **Authentication** tab, and then click **Change Settings**.

    ![Configure Single Sign-On On App Side](./media/active-directory-saas-slack-tutorial/tutorial_slack_002.png)

15. On the **SAML Authentication Settings** dialog, perform the following steps:

    ![Configure Single Sign-On On App Side](./media/active-directory-saas-slack-tutorial/tutorial_slack_003.png)

    a.  In the **SAML 2.0 Endpoint (HTTP)** textbox, put the value of **SAML Single Sign-On Service URL** from Azure AD application configuration window.

    b.  In the **Identity Provider Issuer** textbox, put the value of **SAML Entity ID** from Azure AD application configuration window.

    c.  Open your downloaded certificate file in notepad, copy the content of it into your clipboard, and then paste it to the **Public Certificate** textbox.

    d. Configure the above three settings as appropriate for your Slack team. For more information about the settings, please find the **Slack's SSO configuration guide** here. `https://get.slack.help/hc/en-us/articles/220403548-Guide-to-single-sign-on-with-Slack`

    e.  Click **Save Configuration**.
	 
	<!-- Deselect **Allow users to change their email address**.

    e.  Select **Allow users to choose their own username**.

    f.  As **Authentication for your team must be used by**, select **It’s optional**. -->
  

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-slack-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/active-directory-saas-slack-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-slack-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-slack-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**. 



### Creating a Slack test user

The objective of this section is to create a user called Britta Simon in Slack. Slack supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user will be created during an attempt to access Slack if it doesn't exist yet.

> [!NOTE]
> If you need to create an user manually, you need to Contact [Slack support team](https://slack.com/help/contact).


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Slack.

![Assign User][200] 

**To assign Britta Simon to Slack, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Slack**.

	![Configure Single Sign-On](./media/active-directory-saas-slack-tutorial/tutorial_slack_50.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	


### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Slack tile in the Access Panel, you should get automatically signed-on to your Slack application.


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-slack-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-slack-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-slack-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-slack-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-slack-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-slack-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-slack-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-slack-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-slack-tutorial/tutorial_general_203.png