---
title: 'Tutorial: Azure Active Directory integration with Five9 Plus Adapter (CTI, Contact Center Agents) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Five9 Plus Adapter (CTI, Contact Center Agents).
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 88dc82ab-be0b-4017-8335-c47d00775d7b
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/18/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Five9 Plus Adapter (CTI, Contact Center Agents)

In this tutorial, you learn how to integrate Five9 Plus Adapter (CTI, Contact Center Agents) with Azure Active Directory (Azure AD).

Integrating Five9 Plus Adapter (CTI, Contact Center Agents) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Five9 Plus Adapter (CTI, Contact Center Agents)
- You can enable your users to automatically get signed-on to Five9 Plus Adapter (CTI, Contact Center Agents) (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Five9 Plus Adapter (CTI, Contact Center Agents), you need the following items:

- An Azure AD subscription
- A Five9 Plus Adapter (CTI, Contact Center Agents) single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial here: [Trial offer](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery
To configure the integration of Five9 Plus Adapter (CTI, Contact Center Agents) into Azure AD, you need to add Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery to your list of managed SaaS apps.

**To add Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Five9 Plus Adapter (CTI, Contact Center Agents)**.

	![Creating an Azure AD test user](./media/active-directory-saas-five9-tutorial/tutorial_five9_search.png)

5. In the results panel, select **Five9 Plus Adapter (CTI, Contact Center Agents)**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-five9-tutorial/tutorial_five9_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Five9 Plus Adapter (CTI, Contact Center Agents) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Five9 Plus Adapter (CTI, Contact Center Agents) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Five9 Plus Adapter (CTI, Contact Center Agents) needs to be established.

In Five9 Plus Adapter (CTI, Contact Center Agents), assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Five9 Plus Adapter (CTI, Contact Center Agents), you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Five9 Plus Adapter (CTI, Contact Center Agents) test user](#creating-a-five9-plus-adapter-cti-contact-center-agents-test-user)** - to have a counterpart of Britta Simon in Five9 Plus Adapter (CTI, Contact Center Agents) that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Five9 Plus Adapter (CTI, Contact Center Agents) application.

**To configure Azure AD single sign-on with Five9 Plus Adapter (CTI, Contact Center Agents), perform the following steps:**

1. In the Azure portal, on the **Five9 Plus Adapter (CTI, Contact Center Agents)** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-five9-tutorial/tutorial_five9_samlbase.png)

3. On the **Five9 Plus Adapter (CTI, Contact Center Agents) Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-five9-tutorial/tutorial_five9_url.png)
	
	a. In the **Identifier** textbox, type a URL using the following patterns:

	|    Environment      |       URL      |
	| :-- | :-- |
	| For “Five9 Plus Adapter for Microsoft Dynamics CRM” | `https://app.five9.com/appsvcs/saml/metadata/alias/msdc` |
	| For “Five9 Plus Adapter for Zendesk” | `https://app.five9.com/appsvcs/saml/metadata/alias/zd` |
	| For “Five9 Plus Adapter for Agent Desktop Toolkit” | `https://app.five9.com/appsvcs/saml/metadata/alias/adt` |

	b. In the **Reply URL** textbox, type a URL using the following pattern:

	|      Environment     |      URL      |
	| :--                  | :--           |
	| For “Five9 Plus Adapter for Microsoft Dynamics CRM” | `https://app.five9.com/appsvcs/saml/SSO/alias/msdc` |
	| For “Five9 Plus Adapter for Zendesk” | `https://app.five9.com/appsvcs/saml/SSO/alias/zd` |
	| For “Five9 Plus Adapter for Agent Desktop Toolkit” | `https://app.five9.com/appsvcs/saml/SSO/alias/adt` |

4. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-five9-tutorial/tutorial_five9_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-five9-tutorial/tutorial_general_400.png)

6. On the **Five9 Plus Adapter (CTI, Contact Center Agents) Configuration** section, click **Configure Five9 Plus Adapter (CTI, Contact Center Agents)** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-five9-tutorial/tutorial_five9_configure.png) 

7. To configure single sign-on on **Five9 Plus Adapter (CTI, Contact Center Agents)** side, you need to send the downloaded **Certificate(Base64), Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Five9 Plus Adapter (CTI, Contact Center Agents) support team](https://www.five9.com/about/contact). Also additionally, for configuring SSO further please follow the below steps according to the adapter:

	a. “Five9 Plus Adapter for Agent Desktop Toolkit” Admin Guide: [http://webapps.five9.com/assets/files/for_customers/documentation/integrations/agent-desktop-toolkit/plus-agent-desktop-toolkit-administrators-guide.pdf](http://webapps.five9.com/assets/files/for_customers/documentation/integrations/agent-desktop-toolkit/plus-agent-desktop-toolkit-administrators-guide.pdf)
	
	b. “Five9 Plus Adapter for Microsoft Dynamics CRM” Admin Guide: [http://webapps.five9.com/assets/files/for_customers/documentation/integrations/microsoft/microsoft-administrators-guide.pdf](http://webapps.five9.com/assets/files/for_customers/documentation/integrations/microsoft/microsoft-administrators-guide.pdf)
	
	c. “Five9 Plus Adapter for Zendesk” Admin Guide: [http://webapps.five9.com/assets/files/for_customers/documentation/integrations/zendesk/zendesk-plus-administrators-guide.pdf](http://webapps.five9.com/assets/files/for_customers/documentation/integrations/zendesk/zendesk-plus-administrators-guide.pdf)


> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-five9-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-five9-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-five9-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-five9-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Five9 Plus Adapter (CTI, Contact Center Agents) test user

In this section, you create a user called Britta Simon in Five9 Plus Adapter (CTI, Contact Center Agents). Work with [Five9 Plus Adapter (CTI, Contact Center Agents) support team](https://www.five9.com/about/contact) to add the users in the Five9 Plus Adapter (CTI, Contact Center Agents) platform. Users must be created and activated before you use single sign-on.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Five9 Plus Adapter (CTI, Contact Center Agents).

![Assign User][200] 

**To assign Britta Simon to Five9 Plus Adapter (CTI, Contact Center Agents), perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Five9 Plus Adapter (CTI, Contact Center Agents)**.

	![Configure Single Sign-On](./media/active-directory-saas-five9-tutorial/tutorial_five9_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Five9 Plus Adapter (CTI, Contact Center Agents) tile in the Access Panel, you should get automatically signed-on to your Five9 Plus Adapter (CTI, Contact Center Agents) application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-five9-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-five9-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-five9-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-five9-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-five9-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-five9-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-five9-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-five9-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-five9-tutorial/tutorial_general_203.png

