<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Projectplace | Microsoft Azure" 
    description="Learn how to use Projectplace with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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
    ms.date="07/07/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with Projectplace
  
The objective of this tutorial is to show the integration of Azure and Projectplace.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Projectplace single sign-on enabled subscription
  
After completing this tutorial, the Azure AD users you have assigned to Projectplace will be able to single sign into the application at your Projectplace company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Projectplace
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-projectplace-tutorial/IC790217.png "Scenario")
##Enabling the application integration for Projectplace
  
The objective of this section is to outline how to enable the application integration for Projectplace.

###To enable the application integration for Projectplace, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-projectplace-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-projectplace-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-projectplace-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-projectplace-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Projectplace**.

    ![Application Gallery](./media/active-directory-saas-projectplace-tutorial/IC790218.png "Application Gallery")

7.  In the results pane, select **Projectplace**, and then click **Complete** to add the application.

    ![ProjectPlace](./media/active-directory-saas-projectplace-tutorial/IC790219.png "ProjectPlace")
##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Projectplace with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Projectplace** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single SignOn](./media/active-directory-saas-projectplace-tutorial/IC790220.png "Configure Single SignOn")

2.  On the **How would you like users to sign on to Projectplace** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single SignOn](./media/active-directory-saas-projectplace-tutorial/IC790221.png "Configure Single SignOn")

3.  On the **Configure App URL** page, in the **Projectplace Sign On URL** textbox, type your ProjectPlace tenant URL (e.g.: "*http://company.projectplace.com*"), and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-projectplace-tutorial/IC790222.png "Configure App URL")

4.  On the **Configure single sign-on at Projectplace** page, click **Download metadata**, and then save the metadata file on your computer.

    ![Configure Single SignOn](./media/active-directory-saas-projectplace-tutorial/IC790223.png "Configure Single SignOn")

5.  Send the metadatafile to the Projectplace support team.

    >[AZURE.NOTE] The single sign-on configuration has to be performed by the Projectplace support team. You will get a notification as soon as the configuration has been completed.

6.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single SignOn](./media/active-directory-saas-projectplace-tutorial/IC790227.png "Configure Single SignOn")
##Configuring user provisioning
  
In order to enable Azure AD users to log into Projectplace, they must be provisioned into Projectplace.  
In the case of Projectplace, provisioning is a manual task.

###To provision a user accounts, perform the following steps:

1.  Log in to your **Projectplace** company site as an administrator.

2.  Go to **People**, and then click **Members**.

    ![People](./media/active-directory-saas-projectplace-tutorial/IC790228.png "People")

3.  Click **Add Member**.

    ![Add Members](./media/active-directory-saas-projectplace-tutorial/IC790232.png "Add Members")

4.  In the **Add Member** section, perform the following steps:

    ![New Members](./media/active-directory-saas-projectplace-tutorial/IC790233.png "New Members")

    1.  In the **New Members** textbox, type the email address of a valid AAD account you want to provision into the related textboxes.
    2.  Click **Send**

	    >[AZURE.NOTE] An email including a link to confirm the account before it becomes active is sent to the Azure Active Directory account holder.
    
>[AZURE.NOTE]You can use any other Projectplace user account creation tools or APIs provided by Projectplace to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Projectplace, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Projectplace **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-projectplace-tutorial/IC790234.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-projectplace-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).