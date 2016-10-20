<properties
    pageTitle="Single sign-on management for enterprise apps in the Azure Active Directory preview | Microsoft Azure"
    description="Learn how to manage single sign on for enterprise apps using the Azure Active Directory"
    services="active-directory"
    documentationCenter=""
    authors="asmalser"
    manager="femila"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="09/30/2016"
    ms.author="asmalser"/>

# Preview: Managing single sign-on for enterprise apps in the new Azure portal

> [AZURE.SELECTOR]
- [Azure portal](active-directory-enterprise-apps-manage-sso.md)
- [Azure classic portal](active-directory-sso-integrate-saas-apps.md)

This article describes how to use the [Azure portal](https://portal.azure.com) to manage single sign-on settings for applications, particularly ones that have been added from the [Azure Active Directory (Azure AD) application gallery](active-directory-appssoaccess-whatis.md#get-started-with-the-azure-ad-application-gallery). The Azure AD management experience for single sign-on is currently in public preview, and this article describes the new features as well as a few temporary limitations that will be in place only during the preview period. [What's in the preview?](active-directory-preview-explainer.md)

##Finding your apps in the new portal

As of September 2016, all applications that have been configured for single sign-on in a directory, by a directory administrator using the [Azure Active Directory application gallery](active-directory-appssoaccess-whatis.md#get-started-with-the-azure-ad-application-gallery) inside the [Azure classic portal](https://manage.windowsazure.com), can now be viewed and managed in the Azure portal.

These applications can be found in the **Enterprise Applications** section of the Azure portal, a link to which can be found in the **More Services** list in the [portal](https://portal.azure.com). Enterprise apps are apps that have been deployed and are being used by users within your organization.

![Enterprise Applications blade][1]

Select **All applications** to view a list of all apps that have been configured, including apps that had been added from the gallery. Selecting an app loads the resource blade for that app, where reports can be viewed for that app and a variety of settings can be managed.

To manage single sign-on settings, select **Single sign-on**.

![Application resource blade][2]


##Single sign-on modes

The **Single sign-on** blade begins with a **Mode** menu, which allows the single sign-on mode to be configured. The available options include:

* **SAML-based sign on** - This option is available if the application supports full federated single sign-on with Azure Active Directory using the SAML 2.0 protocol. This

* **Password-based sign on** - This option is available if Azure AD supports password form filling for this application.

* **Linked sign on** - Formerly known as "Existing single sign-on", this option allows administrators to place a link to this application in their user's Azure AD Access Panel or Office 3645 application launcher.

For more information about these modes, see [How does single sign-on with Azure Active Directory work](active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work).


##SAML-based sign on

The **SAML-based sign on** option displays a blade that is divided in four sections:

###Domains and URLs
This is where all details about the application's domain and URLs are added to your Azure AD directory. All inputs required to make single sign-on work app are displayed directly on the screen, whereas all optional inputs can be viewed by selecting the **Show advanced URL settings** checkbox. The full list of supported inputs includes:

* **Sign On URL** – Where the user goes to sign-in to this application. If the application is configured to perform service provider-initiated single sign on, then when a user navigates to this URL, the service provider does the necessary redirection to Azure AD to authenticate and sign the user in. If this field is populated, then Azure AD will use this URL to launch the application from Office 365 and the Azure AD Access Panel. If this field is omitted, then Azure AD instead performs identity provider -initiated sign on when the app is launched from Office 365, the Azure AD Access Panel, or from the Azure AD single sign-on URL.

* **Identifier** - This URI should uniquely identify the application for which single sign on is being configured. This is the value that Azure AD sends back to application as the Audience parameter of the SAML token, and the application is expected to validate it. This value also appears as the Entity ID in any SAML metadata provided by the application.

* **Reply URL** - The reply URL is where the application expects to receive the SAML token. This is also referred to as the Assertion Consumer Service (ACS) URL. After these have been entered, click Next to proceed to the next screen. This screen provides information about what needs to be configured on the application side to enable it to accept a SAML token from Azure AD.

* **Relay State** -  The relay state is an optional parameter that can help tell the application where to redirect the user after authentication is completed. Typically the value is a valid URL at the application, however some applications use this field differently (see the app's single sign on documentation for details). The ability to set the relay state is a new feature that is unique to the new Azure portal.

###User Attributes
This is where admins can view and edit the attributes that are sent in the SAML token that Azure AD issues to the application each time users sign in.

For the first preview release, the only editable attribute supported is the **User Identifier** attribute. The value of this attribute is the field in Azure AD that uniquely identifies each user within the application. For example, if the app was deployed using the "Email address" as the username and unique identifier, then the value would be set to the "user.mail" field in Azure AD.

Editing of additional attributes will be supported in a subsequent preview.

###SAML Signing Certificate
This section shows the details of the certificate that Azure AD uses to sign the SAML tokens that are issued to the application each time the user authenticates. It allows the properties of the current certificate to be inspected, including the expiration date.

The ability to rollover the certificate and manage additional certificate options will be supported in a subsequent preview release. Note that full management of certificates can still be performed in the [Azure classic portal](active-directory-sso-certs.md).

###Application Configuration
The final section provides the documentation and/or controls required to configure the application itself to use Azure Active Directory as an identity provider.

The **Configure Application** fly-out menu provides new concise, embedded instructions for configuring the application. This is another new feature unique to the new Azure portal.

> [AZURE.NOTE] For a complete example of embedded documentation, see the Salesforce.com application. Documentation for additional apps is being continually added during the preview.

![Embedded docs][3]

##Password-based sign on
If supported for the application, selecting the password-based SSO mode and selecting **Save** instantly configures it to do password-based SSO. For more information about deploying password-based SSO, see [How does single sign-on with Azure Active Directory work](active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work).

![Password-based sign on][4]


##Linked sign on
If supported for the application, selecting the linked SSO mode allows you to enter the URL that you want the Azure AD Access Panel or Office 365 to redirect to when users click on this app. For more information about linked SSO (formerly known as "existing SSO"), see [How does single sign-on with Azure Active Directory work](active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work).

![Linked sign-on][5]

[1]: ./media/active-directory-enterprise-apps-manage-sso/enterprise-apps-blade.PNG
[2]: ./media/active-directory-enterprise-apps-manage-sso/enterprise-apps-sso-blade.PNG
[3]: ./media/active-directory-enterprise-apps-manage-sso/enterprise-apps-blade-embedded-docs.PNG
[4]: ./media/active-directory-enterprise-apps-manage-sso/enterprise-apps-blade-password-sso.PNG
[5]: ./media/active-directory-enterprise-apps-manage-sso/enterprise-apps-blade-linked-sso.PNG
