---
title: 'Tutorial: Azure Active Directory integration with Proofpoint on Demand | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Proofpoint on Demand.
services: active-directory
documentationcenter: ''
author: jeevansd
manager: femila
editor: ''

ms.assetid: 773e7f7d-ec31-411b-860d-6a6633335d43
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Proofpoint on Demand
In this tutorial, you learn how to integrate Proofpoint on Demand with Azure Active Directory (Azure AD).

Integrating Proofpoint on Demand with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Proofpoint on Demand.
* You can enable your users to automatically get signed on to Proofpoint on Demand (single sign-on, or SSO) with their Azure AD accounts.
* You can manage your accounts in one central location, the Azure classic portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Prerequisites
To configure Azure AD integration with Proofpoint on Demand, you need the following items:

* An Azure AD subscription
* A Proofpoint on Demand single sign-on (SSO) subscription

To test the steps in this tutorial, follow these recommendations:

* Don't use your production environment, unless this is necessary.
* If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

* Add Proofpoint on Demand from the gallery.
* Configure and test Azure AD single sign-on.

## Add Proofpoint on Demand from the gallery
To configure the integration of Proofpoint on Demand into Azure AD, you need to add Proofpoint on Demand from the gallery to your list of managed SaaS apps.

1. In the Azure classic portal, in the left navigation pane, click **Active Directory**.
   
    ![Active Directory icon][1]
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To open the applications view, in the directory view, click **APPLICATIONS** on the menu at the top.
   
    ![APPLICATIONS menu item][2]
4. Click **ADD** at the bottom of the page.
   
    ![ADD button][3]
5. In the **What do you want to do** dialog box, click **Add an application from the gallery**.
   
    ![Choice of adding an application from the gallery][4]
6. In the search box, type **Proofpoint on Demand**.
   
    ![Box where you type "Proofpoint on Demand"](./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_proofpointondemand_01.png)
7. In the results pane, select **Proofpoint on Demand**, and then click **Complete** to add the application.

## Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Proofpoint on Demand based on a test user named Britta Simon.

For single sign-on to work, Azure AD needs to know what the counterpart user in Proofpoint on Demand is to a user in Azure AD. In other words, you need to establish a link relationship between an Azure AD user and the related user in Proofpoint on Demand.

You establish this link relationship by assigning the value of **user name** in Azure AD as the value of **Username** in Proofpoint on Demand.

To configure and test Azure AD single sign-on with Proofpoint on Demand, complete the following procedures:

1. [Configure Azure AD single sign-on](#configuring-azure-ad-single-sign-on), to enable your users to use this feature.
2. [Create an Azure AD test user](#creating-an-azure-ad-test-user), to test Azure AD single sign-on with Britta Simon.
3. [Create a Proofpoint on Demand test user](#creating-a-proofpoint-ondemand-test-user), to have a counterpart of Britta Simon in Proofpoint on Demand that is linked to the Azure AD representation of her.
4. [Assign the Azure AD test user](#assigning-the-azure-ad-test-user), to enable Britta Simon to use Azure AD single sign-on.
5. [Test single sign-on](#testing-single-sign-on), to verify that the configuration works.

### Configure Azure AD single sign-on
In this section, you enable Azure AD single sign-on in the classic portal and configure single sign-on in your Proofpoint on Demand application.

1. In the classic portal, on the **Proofpoint on Demand** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On** dialog box.
   
    !["Configure single sign-on" button][6]
2. On the **How would you like users to sign on to Proofpoint on Demand** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.
   
    !["Microsoft Azure AD Single Sign-On" option button](./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_proofpointondemand_03.png)
3. On the **Configure App Settings** page, perform the following steps:
   
    !["Configure App Settings" page with boxes filled in](./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_proofpointondemand_04.png)
   1. In the **SIGN ON URL** box, type the URL where users sign on to your Proofpoint on Demand application. Use the following pattern: **https://\<hostname\>.pphosted.com/ppssamlsp_hostname**
   2. In the **IDENTIFIER** box, type the URL by using the following pattern: **https://\<hostname/>.pphosted.com/ppssamlsp**
   3. In the **REPLY URL** box, type the URL by using the following pattern: **https://\<hostname/>.pphosted.com:portnumber/v1/samlauth/samlconsumer**  
   4. Click **Next**.
4. On the **Configure single sign-on at Proofpoint on Demand** page, perform the following steps:
   
    !["Configure single sign-on at Proofpoint on Demand" page with "Download certificate" button](./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_proofpointondemand_05.png)
   1. Click **Download certificate**, and then save the file on your computer.   
   2. Click **Next**.
5. To get SSO configured for your application, contact the Proofpoint on Demand support team and provide them with the following:
   * The downloaded certificate
   * The entity ID
   * The SAML SSO URL
6. In the classic portal, select the single sign-on configuration confirmation, and then click **Next**.
   
    ![Check box that confirms that you have configured single sign-on][10]
7. On the **Single sign-on confirmation** page, click **Complete**.  
   
    ![Confirmation page][11]

### Create an Azure AD test user
In this section, you create a test user named Britta Simon in the classic portal.

![The test user in the list of users][20]

1. In the Azure classic portal, in the left navigation pane, click **Active Directory**.
   
    ![Active Directory icon](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_09.png)
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To display the list of users, on the menu at the top, click **USERS**.
   
    ![USERS menu item](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_03.png)
4. To open the **Add User** dialog box, on the toolbar at the bottom, click **ADD USER**.
   
    ![ADD USER button](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_04.png)
5. On the **Tell us about this user** page, perform the following steps:

    !["Tell us about this user" page with boxes filled in](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_05.png)   
   1. In the **TYPE OF USER** box, select **New user in your organization**.
   2. In the **USER NAME** box, type **BrittaSimon**.
   3. Click **Next**.
6. On the **user profile** page, perform the following steps:

  ![The "user profile" page with boxes filled in](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_06.png)   
   1. In the **FIRST NAME** box, type **Britta**.  
   2. In the **LAST NAME** box, type **Simon**.
   3. In the **DISPLAY NAME** box, type **Britta Simon**.
   4. In the **ROLE** list, select **User**.
   5. Click **Next**.
7. On the **Get temporary password** page, click **create**.
   
   ![Button for creating a temporary password](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_07.png)
8. On the **Get temporary password** page, perform the following steps:
   
   !["Get temporary password" page with password info](./media/active-directory-saas-proofpoint-ondemand-tutorial/create_aaduser_08.png)  
   1. Write down the value in the **NEW PASSWORD** box.
   2. Click **Complete**.   

### Create a Proofpoint on Demand test user
In this section, you create a user called Britta Simon in Proofpoint on Demand. Please work with Proofpoint on Demand support team to add users in the Proofpoint on Demand platform.

### Assign the Azure AD test user
In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Proofpoint on Demand.

![User info, showing access enabled through the direct method][200]

1. In the classic portal, in the directory view, click **APPLICATIONS** on the menu at the top to open the applications view.
   
    ![APPLICATIONS menu item][201]
2. In the list of applications, select **Proofpoint on Demand**.
   
    ![List of applications with Proofpoint on Demand selected](./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_proofpointondemand_50.png)
3. On the menu at the top, click **USERS**.
   
    ![USERS menu item][203]
4. In the list of users, select **Britta Simon**.
5. On the toolbar at the bottom, click **ASSIGN**.
   
    ![Assign button][205]

### Test single sign-on
In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you click the **Proofpoint on Demand** tile on the Access Panel, you should be automatically signed on to your Proofpoint on Demand application.

## Additional resources
* [List of tutorials on how to integrate SaaS apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-proofpoint-ondemand-tutorial/tutorial_general_205.png
