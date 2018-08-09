---
title: 'Tutorial: Azure Active Directory integration with ProMaster (by Inlogik) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ProMaster (by Inlogik).
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 348dbd37-dc4f-49df-bb90-53d249d456b3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ProMaster (by Inlogik)

In this tutorial, you learn how to integrate ProMaster (by Inlogik) with Azure Active Directory (Azure AD).

Integrating ProMaster (by Inlogik) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to ProMaster (by Inlogik).
- You can enable your users to automatically get signed-on to ProMaster (by Inlogik) (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with ProMaster (by Inlogik), you need the following items:

- An Azure AD subscription
- A ProMaster (by Inlogik) single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding ProMaster (by Inlogik) from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding ProMaster (by Inlogik) from the gallery

To configure the integration of ProMaster (by Inlogik) into Azure AD, you need to add ProMaster (by Inlogik) from the gallery to your list of managed SaaS apps.

**To add ProMaster (by Inlogik) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **ProMaster (by Inlogik)**, select **ProMaster (by Inlogik)** from result panel then click **Add** button to add the application.

	![ProMaster (by Inlogik) in the results list](./media/promaster-tutorial/tutorial_promaster_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with ProMaster (by Inlogik) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in ProMaster (by Inlogik) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in ProMaster (by Inlogik) needs to be established.

To configure and test Azure AD single sign-on with ProMaster (by Inlogik), you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a ProMaster (by Inlogik) test user](#create-a-promaster-by-inlogik-test-user)** - to have a counterpart of Britta Simon in ProMaster (by Inlogik) that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your ProMaster (by Inlogik) application.

**To configure Azure AD single sign-on with ProMaster (by Inlogik), perform the following steps:**

1. In the Azure portal, on the **ProMaster (by Inlogik)** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as **SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/promaster-tutorial/tutorial_promaster_samlbase.png)

3. On the **ProMaster (by Inlogik) Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![ProMaster (by Inlogik) Domain and URLs single sign-on information](./media/promaster-tutorial/tutorial_promaster_url1.png)

    a. In the **Identifier** textbox, use one of the following URL pattern:
	| |
	| - |-|
	|  `https://secure.inlogik.com/<COMPANYNAME>`|
	| `https://<CUSTOMDOMAIN>/SAMLBASE`|
	| |

	b. In the **Reply URL** textbox, use one of the following URL pattern:
	| |
	| - |-|
	| `https://secure.inlogik.com/<COMPANYNAME>/saml/acs`|
	| `https://<CUSTOMDOMAIN>/SAMLBASE/saml/acs`|
	| |

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![ProMaster (by Inlogik) Domain and URLs single sign-on information](./media/promaster-tutorial/tutorial_promaster_url2.png)

    In the **Sign-on URL** textbox, use one of the following URL pattern:
	| |
	| - |-|
	| `https://secure.inlogik.com/<COMPANYNAME>/saml/acs `|
	| `https://<CUSTOMDOMAIN>/SAMLBASE/saml/acs`|
	| |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Contact [ProMaster (by Inlogik) Client support team](mailto:michael.boldiston@inlogik.com) to get these values.

5. On the **SAML Signing Certificate** section, click the co button to copy **App Federation Metadata Url** and paste it into Notepad.

	![The Certificate download link](./media/promaster-tutorial/tutorial_promaster_certificate.png)

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/promaster-tutorial/tutorial_general_400.png)

7. To configure single sign-on on **ProMaster (by Inlogik)** side, you need to send the **App Federation Metadata Url** to [ProMaster (by Inlogik) support team](mailto:michael.boldiston@inlogik.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/promaster-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/promaster-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/promaster-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/promaster-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a ProMaster (by Inlogik) test user

In this section, you create a user called Britta Simon in ProMaster (by Inlogik). Work with [ProMaster (by Inlogik) support team](mailto:michael.boldiston@inlogik.com) to add the users in the ProMaster (by Inlogik) platform. Users must be created and activated before you use single sign-on.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ProMaster (by Inlogik).

![Assign the user role][200]

**To assign Britta Simon to ProMaster (by Inlogik), perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **ProMaster (by Inlogik)**.

	![The ProMaster (by Inlogik) link in the Applications list](./media/promaster-tutorial/tutorial_promaster_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ProMaster (by Inlogik) tile in the Access Panel, you should get automatically signed-on to your ProMaster (by Inlogik) application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/promaster-tutorial/tutorial_general_01.png
[2]: ./media/promaster-tutorial/tutorial_general_02.png
[3]: ./media/promaster-tutorial/tutorial_general_03.png
[4]: ./media/promaster-tutorial/tutorial_general_04.png

[100]: ./media/promaster-tutorial/tutorial_general_100.png

[200]: ./media/promaster-tutorial/tutorial_general_200.png
[201]: ./media/promaster-tutorial/tutorial_general_201.png
[202]: ./media/promaster-tutorial/tutorial_general_202.png
[203]: ./media/promaster-tutorial/tutorial_general_203.png

