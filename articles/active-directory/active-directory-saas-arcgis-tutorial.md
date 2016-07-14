<properties 
    pageTitle="Tutorial: Azure Active Directory Integration with ArcGIS | Microsoft Azure" 
    description="Learn how to use ArcGIS with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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

#Tutorial: Azure Active Directory Integration with ArcGIS

The objective of this tutorial is to show the integration of Azure and ArcGIS. The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   An ArcGIS single sign-on enabled subscription

After completing this tutorial, the Azure AD users you have assigned to ArcGIS will be able to single sign into the application at your ArcGIS company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for ArcGIS
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-arcgis-tutorial/IC784735.png "Scenario")
##Enabling the application integration for ArcGIS

The objective of this section is to outline how to enable the application integration for ArcGIS.

###To enable the application integration for ArcGIS, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-arcgis-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-arcgis-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-arcgis-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-arcgis-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **ArcGIS**.

    ![Applcation Gallery](./media/active-directory-saas-arcgis-tutorial/IC784736.png "Applcation Gallery")

7.  In the results pane, select **ArcGIS**, and then click **Complete** to add the application.

    ![ArcGIS](./media/active-directory-saas-arcgis-tutorial/IC784737.png "ArcGIS")
##Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to ArcGIS with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **ArcGIS** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-arcgis-tutorial/IC784738.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to ArcGIS** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-arcgis-tutorial/IC784739.png "Configure Single Sign-On")

3.  On the **Configure App URL** page, in the **ArcGIS Sign In URL** textbox, type the URL used by your users to sign in using the following pattern "*https://company.maps.arcgis.com*", and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-arcgis-tutorial/IC784740.png "Configure App URL")

4.  On the **Configure single sign-on at ArcGIS** page, click **Download metadata**, and then save the metadata file locally on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-arcgis-tutorial/IC784741.png "Configure Single Sign-On")

5.  In a different web browser window, log into your ArcGIS company site as an administrator.

6.  Click **Edit Settings**.

    ![Edit Settings](./media/active-directory-saas-arcgis-tutorial/IC784742.png "Edit Settings")

7.  Click **Security**.

    ![Security](./media/active-directory-saas-arcgis-tutorial/IC784743.png "Security")

8.  Under **Enterprise Logins**, click **Set Identity Provider**.

    ![Enterprise Logins](./media/active-directory-saas-arcgis-tutorial/IC784744.png "Enterprise Logins")

9.  On the **Set Identity Provider** configuration page, perform the following steps:

    ![Set Identity Provider](./media/active-directory-saas-arcgis-tutorial/IC784745.png "Set Identity Provider")

    1.  In the Name textbox, type your organization’s name.
    2.  For **Metadata for the Enterprise Identity Provider will be supplied using**, select **A File**.
    3.  To upload your downloaded metadata file, click **Choose file**.
    4.  Click **Set Identity Provider**.

10. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-arcgis-tutorial/IC784746.png "Configure Single Sign-On")
##Configuring user provisioning

In order to enable Azure AD users to log into ArcGIS, they must be provisioned into ArcGIS.  
In the case of ArcGIS, provisioning is a manual task.

###To configure user provisioning, perform the following steps:

1.  Log in to your **ArcGIS** tenant.

2.  Click **Invite Members**.

    ![Invite Members](./media/active-directory-saas-arcgis-tutorial/IC784747.png "Invite Members")

3.  Select **Add members automatically without sending an email**, and then click **Next**.

    ![Add Members Automatically](./media/active-directory-saas-arcgis-tutorial/IC784748.png "Add Members Automatically")

4.  On the **Members** dialog page, perform the following steps:

    ![Add and review](./media/active-directory-saas-arcgis-tutorial/IC784749.png "Add and review")

    1.  Enter the **First Name**, **Last Name** and **Email** of a valid AAD account you want to provision.
    2.  Click **Add And Review**.

5.  Review the data you have entered, and then click **Add Members**.

    ![Add member](./media/active-directory-saas-arcgis-tutorial/IC784750.png "Add member")

>[AZURE.NOTE] You can use any other ArcGIS user account creation tools or APIs provided by ArcGIS to provision AAD user accounts.

##Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to ArcGIS, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **ArcGIS **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-arcgis-tutorial/IC784751.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-arcgis-tutorial/IC767830.png "Yes")

If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
