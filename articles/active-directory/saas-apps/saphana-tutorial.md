---
title: 'Tutorial: Azure Active Directory integration with SAP HANA | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SAP HANA.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: cef4a146-f4b0-4e94-82de-f5227a4b462c
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/27/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SAP HANA

In this tutorial, you learn how to integrate SAP HANA with Azure Active Directory (Azure AD).

When you integrate SAP HANA with Azure AD, you get the following benefits:

- You can control in Azure AD who has access to SAP HANA.
- You can enable your users to automatically get signed into SAP HANA with their Azure AD accounts.
- You can manage your accounts in one central location--the Azure portal.

For more information about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with SAP HANA, you need the following items:

- An Azure AD subscription
- A SAP HANA subscription that's single sign-on (SSO) enabled
- A HANA instance that's running on any public IaaS, on-premises, Azure VM, or SAP large instances in Azure
- The XSA Administration web interface, as well as HANA Studio installed on the HANA instance

> [!NOTE]
> We do not recommend using a production environment of SAP HANA to test the steps in this tutorial. Test the integration first in the development or staging environment of the application, and then use the production environment.

To test the steps in this tutorial, follow these recommendations:

- Don't use your production environment unless it's necessary.
- [Get a one-month free trial](https://azure.microsoft.com/pricing/free-trial/) of Azure AD if you don't already have an Azure AD trial environment.

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario that's outlined in this tutorial consists of two main building blocks:

1. Adding SAP HANA from the gallery
1. Configuring and testing Azure AD single sign-on

## Add SAP HANA from the gallery
To configure the integration of SAP HANA into Azure AD, add SAP HANA from the gallery to your list of managed SaaS apps.

**To add SAP HANA from the gallery, take the following steps:**

1. In the [Azure portal](https://portal.azure.com), in the left pane, select the **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Go to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add the new application, select the **New application** button on the top of dialog box.

	![The new application button][3]

1. In the search box, type **SAP HANA**. Then select **SAP HANA** from the results panel. Finally, select the **Add** button to add the application. 

	![The new application](./media/saphana-tutorial/tutorial_saphana_addfromgallery.png)

## Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with SAP HANA based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know who the counterpart user in SAP HANA is to a user in Azure AD. In other words, you need to establish a link  between an Azure AD user and the related user in SAP HANA.

In SAP HANA, give the **Username** value the same value of the **user name** in Azure AD. This step establishes the link between the two users.

To configure and test Azure AD single sign-on with SAP HANA, complete the following building blocks:

1. [Configure Azure AD single sign-on](#configuring-azure-ad-single-sign-on) to enable your users to use this feature.
1. [Create an Azure AD test user](#creating-an-azure-ad-test-user) to test Azure AD single sign-on with Britta Simon.
1. [Create a SAP HANA test user](#creating-a-sap-hana-test-user) to have a counterpart of Britta Simon in SAP HANA that is linked to the Azure AD representation of the user.
1. [Assign the Azure AD test user](#assigning-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.
1. [Test single sign-on](#testing-single-sign-on) to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your SAP HANA application.

**To configure Azure AD single sign-on with SAP HANA, take the following steps:**

1. In the Azure portal, on the **SAP HANA** application integration page, select **Single sign-on**.

	![Configure single sign-on][4]

1. In the **Single sign-on** dialog box, under **SAML-based Sign-on**, select **Mode**.
 
	![Single sign-on dialog box](./media/saphana-tutorial/tutorial_saphana_samlbase.png)

1. In the **SAP HANA Domain and URLs** section, take the following steps:

	![Domain and URLs single sign-on information](./media/saphana-tutorial/tutorial_saphana_url.png)

	a. In the **Identifier** box, type the following: `HA100` 

	b. In the **Reply URL** box, type a URL with the following pattern: `https://<Customer-SAP-instance-url>/sap/hana/xs/saml/login.xscfunc`

	> [!NOTE] 
	> These values aren't real. Update these values with the actual Identifier and reply URL. Contact the [SAP HANA client support team](https://cloudplatform.sap.com/contact.html) to get these values. 

1. In the **SAML Signing Certificate** section, select **Metadata XML**. Then save the metadata file on your computer.

	![The Certificate download link](./media/saphana-tutorial/tutorial_saphana_certificate.png) 

	>[!Note]
	>If the certificate isn't active, then make it active by selecting the **Make new certificate active** check box in Azure AD. 

1. The SAP HANA application expects the SAML assertions in a specific format. The following screenshot shows an example of this format. 

	Here we've mapped the **User Identifier** with the **ExtractMailPrefix()** function of **user.mail**. This gives the prefix value of the user's email, which is the unique user ID. This user ID is sent to the SAP HANA application in every successful response.

	![Configure single sign-on](./media/saphana-tutorial/attribute.png)

1. In the **User Attributes** section of the **Single sign-on** dialog box, take the following steps:

	a. In the **User Identifier** drop-down list, select **ExtractMailPrefix**.
	
	b. In the **Mail** drop-down list, select **user.mail**.

1. Select the **Save** button.

	![Configure the single sign-on Save button](./media/saphana-tutorial/tutorial_general_400.png)
	
1. To configure single sign-on on the SAP HANA side, sign in to your **HANA XSA Web Console**  by going to the respective HTTPS endpoint.

	> [!NOTE]
	> In the default configuration, the URL redirects the request to a sign-in screen, which requires the credentials of an authenticated SAP HANA database user. The user who signs in must have permissions to perform SAML administration tasks.

1. In the XSA Web Interface, go to **SAML Identity Provider**. From there, select the **+** button on the bottom of the screen to display the **Add Identity Provider Info** pane. Then take the following steps:

	![Add Identity Provider](./media/saphana-tutorial/sap1.png)

	a. In the **Add Identity Provider Info** pane, paste the contents of the Metadata XML (which you downloaded from the Azure portal) into the **Metadata** box.

	![Add Identity Provider settings](./media/saphana-tutorial/sap2.png)

	b. If the contents of the XML document are valid, the parsing process extracts the information that's required for the **Subject, Entity ID, and Issuer** fields in the **General data** screen area. It also extracts the information that's necessary for the URL fields in the **Destination** screen area, for example, the **Base URL and SingleSignOn URL (*)** fields.

	![Add Identity Provider settings](./media/saphana-tutorial/sap3.png)

	c. In the **Name** box of the **General Data** screen area, enter a name for the new SAML SSO identity provider.

	> [!NOTE]
	> The name of the SAML IDP is mandatory and must be unique. It appears in the list of available SAML IDPs that is displayed when you select SAML as the authentication method for SAP HANA XS applications to use. For example, you can do this in the **Authentication** screen area of the XS Artifact Administration tool.

1. Select **Save** to save the details of the SAML identity provider and to add the new SAML IDP to the list of known SAML IDPs.

	![Save button](./media/saphana-tutorial/sap4.png)

1. In HANA Studio, within the system properties of the **Configuration** tab,  filter the settings by **saml**. Then adjust the **assertion_timeout** from **10 sec** to **120 sec**.

	![assertion_timeout setting](./media/saphana-tutorial/sap7.png)

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com) while you are setting up the app! After you add this app from the **Active Directory** > **Enterprise Applications** section,  select the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature in the [Azure AD embedded documentation](https://go.microsoft.com/fwlink/?linkid=845985).
> 

### Create an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD user][100]

**To create a test user in Azure AD, take the following steps:**

1. In the **Azure portal**, in the left pane, select the **Azure Active Directory** icon.

	![The Azure Active Directory button](./media/saphana-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups**. Then select **All users**.
	
	![The "Users and groups" and "All users" links](./media/saphana-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog box, select **Add** at the top of the dialog box.
 
	![The Add button](./media/saphana-tutorial/create_aaduser_03.png) 

1. On the **User** dialog box, take the following steps:
 
	![The User dialog box](./media/saphana-tutorial/create_aaduser_04.png) 

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the **email address** of BrittaSimon.

	c. Select **Show Password**, and then write down the password.

    d. Select **Create**.
 
### Create a SAP HANA test user

To enable Azure AD users to sign in to SAP HANA, you must provision them in SAP HANA.
SAP HANA supports just-in-time provisioning, which is by enabled by default.

If you need to create a user manually, take the following steps:

>[!NOTE]
>You can change the external authentication that the user uses. They can authenticate with an external system such as Kerberos. For detailed information about external identities, contact your [domain administrator](https://cloudplatform.sap.com/contact.html).

1. Open the [SAP HANA Studio](https://help.sap.com/viewer/a2a49126a5c546a9864aae22c05c3d0e/2.0.01/en-us) as an administrator, and then enable the DB-User for SAML SSO.

	![Create user](./media/saphana-tutorial/sap5.png)

1. Select the invisible check box to the left of **SAML**, and then select the **Configure** link.

1. Select **Add** to add the SAML IDP.  Select the appropriate SAML IDP, and then select **OK**.

1. Add the **External Identity** (in this case, BrittaSimon) or choose **Any**. Then select **OK**.

	>[!Note]
	>If  the **Any** check box is not selected, then the user name in HANA needs to exactly match the name of the user in the UPN before the domain suffix. (For example, BrittaSimon@contoso.com becomes BrittaSimon in HANA.)

1. For testing purposes, assign all **XS** roles to the user.

	![Assigning roles](./media/saphana-tutorial/sap6.png)

 	> [!TIP]
  	> You should give permissions that are appropriate for your use cases only.

1. Save the user.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SAP HANA.

![Assign the user role][200] 

**To assign Britta Simon to SAP HANA, perform the following steps:**

1. In the Azure portal, open the applications view. Go to the directory view, and go to **Enterprise applications**. Select **All applications**.

	![Assign user][201] 

1. In the applications list, select **SAP HANA**.

	![Assign user](./media/saphana-tutorial/tutorial_saphana_app.png) 

1. In the menu on the left, select **Users and groups**.

	![The "Users and groups" link][202] 

1. Select the **Add** button. In the **Add Assignment** dialog box, select **Users and groups**.

	![The Add Assignment pane][203]

1. In the **Users and groups** dialog box, select **Britta Simon** in the **Users** list.

1. Click the **Select** button in the **Users and groups** dialog box.

1. Select the **Assign** button in the **Add Assignment** dialog box.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the access panel.

When you select the SAP HANA tile in the access panel, you should get automatically signed into your SAP HANA application.
For more information about the access panel, see [Introduction to the access panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of tutorials on how to integrate SaaS apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/saphana-tutorial/tutorial_general_01.png
[2]: ./media/saphana-tutorial/tutorial_general_02.png
[3]: ./media/saphana-tutorial/tutorial_general_03.png
[4]: ./media/saphana-tutorial/tutorial_general_04.png

[100]: ./media/saphana-tutorial/tutorial_general_100.png

[200]: ./media/saphana-tutorial/tutorial_general_200.png
[201]: ./media/saphana-tutorial/tutorial_general_201.png
[202]: ./media/saphana-tutorial/tutorial_general_202.png
[203]: ./media/saphana-tutorial/tutorial_general_203.png

