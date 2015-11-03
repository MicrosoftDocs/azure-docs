<properties pageTitle="Tutorial: Azure Active Directory integration with Box | Microsoft Azure" description="Learn how to use Box with Azure Active Directory to enable single sign-on, automated provisioning, and more!." services="active-directory" authors="MarkusVi"  documentationCenter="na" manager="stevenpo"/>
<tags ms.service="active-directory" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="identity" ms.date="08/01/2015" ms.author="markvi" />




#Tutorial: Azure Active Directory integration with Box


>[AZURE.TIP]For feedback, click [here](http://go.microsoft.com/fwlink/?LinkId=522410).
  
The objective of this tutorial is to show the integration of Azure and Box.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A test tenant in Box
  
After completing this tutorial, the Azure AD users you have assigned to Box will be able to single sign into the application at your Box company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md)
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Box
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-box-tutorial/IC769537.png "Scenario")



##Enabling the application integration for Box
  
The objective of this section is to outline how to enable the application integration for Box.

###To enable the application integration for Box, perform the following steps:

1.  In the Azure Management Portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-box-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-box-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-box-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-box-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Box**.

    ![Application gallery](./media/active-directory-saas-box-tutorial/IC701023.png "Application gallery")

7.  In the results pane, select **box**, and then click **Complete** to add the application.

    ![Box](./media/active-directory-saas-box-tutorial/IC701024.png "Box")



##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Box with their account in Azure AD using federation based on the SAML protocol. <br>
As part of this procedure, you are required to upload metadata to Box.com.

###To configure single sign-on, perform the following steps:

1.  In the Azure AD portal, on the **Box** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure single sign-on](./media/active-directory-saas-box-tutorial/IC769538.png "Configure single sign-on")

2.  On the **How would you like users to sign on to Box** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure single sign-on](./media/active-directory-saas-box-tutorial/IC769539.png "Configure single sign-on")

3.  On the **Configure App URL** page, in the **Box Tenant URL** textbox, type your Box tenant URL (e.g.: https://<mydomainname>.box.com), and then click **Next**.

    ![Configure app URL](./media/active-directory-saas-box-tutorial/IC669826.png "Configure app URL")

4.  On the **Configure single sign-on at Box** page, to download your metadata, click **Download metadata**, and then the data file locally on your computer.

    ![Configure single sign-on](./media/active-directory-saas-box-tutorial/IC669824.png "Configure single sign-on")

5.  Forward that metadata file to Box support team. The support team needs configures single sign-on for you.

6.  Select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure single sign-on](./media/active-directory-saas-box-tutorial/IC769540.png "Configure single sign-on")
##Configuring user provisioning
  
The objective of this section is to outline how to enable provisioning of Active Directory user accounts to Box.

###To configure single sign-on, perform the following steps:

1. In the Azure Management Portal, on the **Box** application integration page, click **Configure user provisioning** to open the **Configure User Provisioning** dialog. <br> <br> ![Enable automatic user provisioning](./media/active-directory-saas-box-tutorial/IC769541.png "Enable automatic user provisioning")

2. On the **Enable user provisioning to Box** dialog page, click **Enable user provisioning**. <br><br>  ![Enable automatic user provisioning](./media/active-directory-saas-box-tutorial/IC769544.png "Enable automatic user provisioning")

3. On the **Log in to grant access to Box** page, provide the required credentials, and then click **Authorize**. <br><br> ![Enable automatic user provisioning](./media/active-directory-saas-box-tutorial/IC769546.png "Enable automatic user provisioning")


4. Click **Grant access to Box** to authorize this operation and to return to the Azure Management Portal. <br><br> ![Enable automatic user provisioning](./media/active-directory-saas-box-tutorial/IC769549.png "Enable automatic user provisioning")

5. To finish the configuration, click the Complete button. <br><br> ![Enable automatic user provisioning](./media/active-directory-saas-box-tutorial/IC769551.png "Enable automatic user provisioning")



##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Box, perform the following steps:

1. In the Azure AD portal, create a test account.

2. On the **Box **application integration page, click **Assign users**. <br><br> ![Assign users](./media/active-directory-saas-box-tutorial/IC769552.png "Assign users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment. <br><br> ![Yes](./media/active-directory-saas-box-tutorial/IC767830.png "Yes")
  

You should now wait for 10 minutes and verify that the account has been synchronized to Box.

As a first verification step, you can check the provisioning status, by clicking Dashboard in the D on the Box application integration page on the Azure Management Portal.

<br><br> ![Dashboard](./media/active-directory-saas-box-tutorial/IC769553.png "Dashboard")

A successfully completed user provisioning cycle is indicated by a related status:

<br><br> ![Integration status](./media/active-directory-saas-box-tutorial/IC769555.png "Integration status")


In your Box tenant, synchronized users are listed under **Managed Users** in the **Admin Console**.

<br><br> ![Integration status](./media/active-directory-saas-box-tutorial/IC769556.png "Integration status")


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)