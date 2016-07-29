<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Clever | Microsoft Azure" 
    description="Learn how to use Clever with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
    services="active-directory" 
    authors="jeevansd"  
    documentationCenter="na" 
    manager="femila"/>
<tags 
    ms.service="active-directory" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
    ms.date="07/11/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with Clever

The objective of this tutorial is to show the integration of Azure and Clever. The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Clever tenant

After completing this tutorial, the Azure AD users you have assigned to Clever will be able to single sign into the application at your Clever company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Clever
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-clever-tutorial/IC798977.png "Scenario")
##Enabling the application integration for Clever

The objective of this section is to outline how to enable the application integration for Clever.

###To enable the application integration for Clever, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-clever-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-clever-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-clever-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-clever-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Clever**.

    ![Application Gallery](./media/active-directory-saas-clever-tutorial/IC798978.png "Application Gallery")

7.  In the results pane, select **Clever**, and then click **Complete** to add the application.

    ![Clever](./media/active-directory-saas-clever-tutorial/IC798979.png "Clever")
##Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to Clever with their account in Azure AD using federation based on the SAML protocol.  
Your Clever application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your **saml token attributes** configuration.  
The following screenshot shows an example for this.

![Attributes](./media/active-directory-saas-clever-tutorial/IC798980.png "Attributes")

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Clever** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/IC784682.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to Clever** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/IC798981.png "Configure Single Sign-On")

3.  On the **Configure App URL** page, in the **Clever Sign On URL** textbox, type the URL used by your users to sign-on to your Clever application (e.g.: *https://clever.com/in/azsandbox*), and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-clever-tutorial/IC798982.png "Configure App URL")

4.  On the **Configure single sign-on at Clever** page, to download your metadata, click **Download metadata**, and then save the metadata file locally on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/IC798983.png "Configure Single Sign-On")

5.  In a different web browser window, log into your Clever company site as an administrator.

6.  In the toolbar, click **Instant Login**.

    ![Instant Login](./media/active-directory-saas-clever-tutorial/IC798984.png "Instant Login")

7.  On the **Instant Login** page, perform the following steps:

    ![Instant Login](./media/active-directory-saas-clever-tutorial/IC798985.png "Instant Login")

    1.  Type the **Login URL**.  

        >[AZURE.NOTE] The **Login URL** is a custom value.
         You can get the actual value from your Clever support team.

    2.  As **Identity System**, select **ADFS**.
    3.  Click **Save**.

8.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/IC798986.png "Configure Single Sign-On")

9.  In the menu on the top, click **Attributes** to open the **SAML Token Attributes** dialog.

    ![Attributes](./media/active-directory-saas-clever-tutorial/IC795920.png "Attributes")

10. To add the required attribute mappings, perform the following steps:

    ![saml token attributes](./media/active-directory-saas-clever-tutorial/IC795921.png "saml token attributes")

	|Attribute Name|Attribute Value|
    |---|---|
    |clever.student.credentials.district\_username|User.userprincipalname|

    1.  For each data row in the table above, click **add user attribute**.
    2.  In the **Attribute Name** textbox, type the attribute name shown for that row.
    3.  In the **Attribute Value** textbox, select the attribute value shown for that row.
    4.  Click **Complete**.

11. Click **Apply Changes**.

##Configuring user provisioning

In order to enable Azure AD users to log into Clever, they must be provisioned into Clever.  
In the case of Clever, provisioning is a manual task that needs to be performed by your Clever support team.

>[AZURE.NOTE] You can use any other Clever user account creation tools or APIs provided by Clever to provision AAD user accounts.

##Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Clever, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Clever **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-clever-tutorial/IC798987.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-clever-tutorial/IC767830.png "Yes")

If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
