---
title: 'Tutorial: Azure Active Directory integration with IBM Kenexa Survey Enterprise | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and IBM Kenexa Survey Enterprise.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: c7aac6da-f4bf-419e-9e1a-16b460641a52
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/30/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with IBM Kenexa Survey Enterprise

In this tutorial, you learn how to integrate IBM Kenexa Survey Enterprise with Azure Active Directory (Azure AD).

Integrating IBM Kenexa Survey Enterprise with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to IBM Kenexa Survey Enterprise.
- You can enable your users to automatically sign in to IBM Kenexa Survey Enterprise by using single sign-on (SSO) with their Azure AD accounts.
- You can manage your accounts in one central location: the Azure portal.

If you want to know more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with IBM Kenexa Survey Enterprise, you need the following items:

- An Azure AD subscription
- An IBM Kenexa Survey Enterprise SSO-enabled subscription

> [!NOTE]
> When you test the steps in this tutorial, we recommend that you do not use a production environment.

To test the steps in this tutorial, follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD SSO in a test environment. The scenario outlined in the tutorial consists of two main building blocks:

* Adding IBM Kenexa Survey Enterprise from the gallery
* Configuring and testing Azure AD SSO

## Add IBM Kenexa Survey Enterprise from the gallery
To configure the integration of IBM Kenexa Survey Enterprise into Azure AD, add IBM Kenexa Survey Enterprise from the gallery to your list of managed SaaS apps.

To add IBM Kenexa Survey Enterprise from the gallery, do the following:

1. In the [Azure portal](https://portal.azure.com), in the left pane, click the **Azure Active Directory** button. 

	![The Azure Active Directory button][1]

2. Select **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade][2]
	
3. To add an application, click the **New application** button.

	![The New application button][3]

4. In the search box, type **IBM Kenexa Survey Enterprise**.

	![Creating an Azure AD test user](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_search.png)

5. In the results list, select **IBM Kenexa Survey Enterprise**, and then click the **Add** button to add the application.

	![IBM Kenexa Survey Enterprise in the results list](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_addfromgallery.png)

##  Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD SSO with IBM Kenexa Survey Enterprise based on a test user called "Britta Simon."

For SSO to work, Azure AD needs to identify the IBM Kenexa Survey Enterprise user counterpart in Azure AD. In other words, Azure AD must establish a link relationship between an Azure AD user and a related user in IBM Kenexa Survey Enterprise.

To establish the link relationship, assign the value of the **user name** in IBM Kenexa Survey Enterprise as the value of the **Username** in Azure AD.

To configure and test Azure AD SSO with IBM Kenexa Survey Enterprise, complete the building blocks in the next two sections:

### Configure Azure AD SSO

In this section, you enable Azure AD SSO in the Azure portal and configure SSO in your IBM Kenexa Survey Enterprise application by doing the following:

1. In the Azure portal, on the **IBM Kenexa Survey Enterprise** application integration page, click **Single sign-on**.

	![IBM Kenexa Survey Enterprise Configure single sign-on link][4]

2. In the **Single sign-on** dialog box, in the **Mode** box, select **SAML-based Sign-on** to enable SSO.
 
	![Single sign-on dialog box](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_samlbase.png)

3. In the **IBM Kenexa Survey Enterprise Domain and URLs** section, perform the following steps:

	![IBM Kenexa Survey Enterprise Domain and URLs single sign-on information](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_url.png)

    a. In the **Identifier** textbox, type a URL with the following pattern: `https://surveys.kenexa.com/<companycode>`

	b. In the **Reply URL** textbox, type a URL with the following pattern: `https://surveys.kenexa.com/<companycode>/tools/sso.asp`

	> [!NOTE] 
	> The preceding values are not real. Update them with the actual identifier and reply URL. To obtain the actual values, contact the [IBM Kenexa Survey Enterprise support team](https://www.ibm.com/support/home/?lnk=fcw).

4. Under **SAML Signing Certificate**, click **Certificate Base64)**, and then save the certificate file to your computer.

	![The Certificate (Base64) download link](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_certificate.png) 

The IBM Kenexa Survey Enterprise application expects to receive the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The user identifier claim value in the response has to match the SSO ID that's configured in the Kenexa system. To map the appropriate user identifier in your organization as SSO IDP, work with [IBM Kenexa Survey Enterprise support team](https://www.ibm.com/support/home/?lnk=fcw). 

By default, Azure AD sets the user identifier as the UPN value. You can change this value on the **Attribute** tab, as shown in the following screenshot. The integration works only after you've completed the mapping correctly.
	
![The User Attributes dialog box](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_attribute.png)	

5. Click **Save**.

	![The configure single sign-on Save button](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_400.png)

6. Under **IBM Kenexa Survey Enterprise Configuration**, click **Configure IBM Kenexa Survey Enterprise** to open the **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML single sign-on Service URL** from the **Quick Reference section.**

	![Configure single sign-on](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_configure.png)

7. In the **Configure sign-on** window, under **Quick Reference**, copy the **Sign-Out URL**, **SAML Entity ID**, and **SAML single sign-on Service URL**.

8. To configure SSO on the **IBM Kenexa Survey Enterprise** side, send the downloaded **Certificate (Base64)**, **Sign-Out URL**, **SAML Entity ID**, and **SAML single sign-on Service URL** to the [IBM Kenexa Survey Enterprise support team](https://www.ibm.com/support/home/?lnk=fcw).

> [!TIP]
> You can refer to a concise version of these instructions in the [Azure portal](https://portal.azure.com) while you are setting up the app. After you add the app from the **Active Directory** > **Enterprise Applications** section, simply click the **single sign-on** tab, and then access the embedded documentation through the **Configuration** section at the end To learn more about the embedded documentation feature, see [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985).
> 

### Create an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create an Azure AD test user][100]

To create a test user in Azure AD, perform the following steps:

1. In the **Azure portal**, in the left pane, click the **Azure Active Directory** button.

	![The Azure Active Directory button](./media/active-directory-saas-kenexasurvey-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-kenexasurvey-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-kenexasurvey-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-kenexasurvey-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Create an IBM Kenexa Survey Enterprise test user

In this section, you create a user called Britta Simon in IBM Kenexa Survey Enterprise. 

You can work with [IBM Kenexa Survey Enterprise support team](https://www.ibm.com/support/home/?lnk=fcw) to create the users in their system and map the SSO Id for them. Also this SSO ID value should be mapped to the User Identifier value from Azure AD. You can change this default setting in the Attribute tab.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure SSO by granting access to IBM Kenexa Survey Enterprise.

![Assign User][200] 

**To assign Britta Simon to IBM Kenexa Survey Enterprise, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **IBM Kenexa Survey Enterprise**.

	![Configure single sign-on](./media/active-directory-saas-kenexasurvey-tutorial/tutorial_kenexasurvey_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD SSO configuration using the Access Panel.

When you click the IBM Kenexa Survey Enterprise tile in the Access Panel, you should get automatically signed-on to your IBM Kenexa Survey Enterprise application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-kenexasurvey-tutorial/tutorial_general_203.png

 