<properties
	pageTitle="How does single sign-on with Azure Active Directory work?"
	description="Use Azure Active Directory to enable single sign-on to all of the SaaS and web applications that you need for business."
	services="active-directory"
	documentationCenter=""
	authors="asmalser-msft"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/15/2015"
	ms.author="asmalser-msft"/>


#How does single sign-on with Azure Active Directory work?


###Other articles on this topic
[What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)<br>
[Get started with the Azure AD application gallery](active-directory-appssoaccess-get-started.md)<br>
[Deploying applications to users](active-directory-appssoaccess-deployapps.md)<br>

When a user “signs in” to an application, they go through an authentication process where they are required to prove that they are who they say they are. Without single sign-on, this is typically done by entering a password that is stored at the application, and the user is required to know this password.

Azure AD supports three different ways to sign in to applications:

*	**Federated Single Sign-On** enables applications to redirect to Azure AD for user authentication instead of prompting for its own password. This is supported for applications that support protocols such as SAML 2.0, WS-Federation, or OpenID Connect, and is the richest mode of single sign-on.

*	**Password-based Single Sign-On** enables secure application password storage and replay using a web browser extension or mobile app. This leverages the existing sign-in process provided by the application, but enables an administrator to manage the passwords and does not require the user to know the password.

*	**Existing Single Sign-On** enables Azure AD to leverage any existing single sign-on that has been set up for the application, but enables these applications to be linked to the Office 365 or Azure AD access panel portals, and also enables additional reporting in Azure AD when the applications are launched there.

Once a user have authenticated with an application, they also need to have an account record provisioned at the application that tells the application where there permissions and level of access are inside the application. The provisioning of this account record can either occur automatically, or it can occur manually by an administrator before the user is provided single sign-on access.

 More details on these single sign-on modes and provisioning below.

##Federated Single Sign-On

Federated Single Sign-On enables sign-on enables the users in your organization to be automatically signed in to a third-party SaaS application by Azure AD using the user account information from Azure AD.

In this scenario, when you have already been logged into Azure AD, and you want to access resources that are controlled by a third-party SaaS application, federation eliminates the need for a user to be re-authenticated.

Azure AD can support federated single sign-on with applications that support the SAML 2.0, WS-Federation, or OpenID connect protocols.

##Password-based Single Sign-On

Configuring password-based single sign-on enables the users in your organization to be automatically signed in to a third-party SaaS application by Azure AD using the user account information from the third-party SaaS application. When you enable this feature, Azure AD collects and securely stores the user account information and the related password.

Azure AD can support password-based single sign on for any cloud-based app that has an HTML-based sign-in page. By using a custom browser plugin, AAD automates the user’s sign in process via securely retrieving application credentials such as the username and the password from the directory, and enters these credentials into the application’s sign in page on behalf of the user. There are two use cases:

1.	**Administrator manages credentials** – Administrators can create and manage application credentials, and assign those credentials to users or groups who need access to the application. In these cases, the end user does not need to know the credentials, but still gains single sign-on access to the application simply by clicking on it in their access panel or via a provided link. This enables both, lifecycle management of the credentials by the administrator, as well as convenience for end users whereby they do not need to remember or manage app-specific passwords. The credentials are obfuscated from the end user during the automated sign in process; however they are technically discoverable by the user using web-debugging tools, and users and administrators should follow the same security policies as if the credentials were presented directly by the user. Administrator-provided credentials are very useful when providing account access that is shared among many users, such as social media or document sharing applications.

2.	**User manages credentials** – Administrators can assign applications to end users or groups, and allow the end users to enter their own credentials directly upon accessing the application for the first time in their access panel. This creates a convenience for end users whereby they do not need to continually enter the app-specific passwords each time they access the application. This use case can also be used as a stepping stone to administrative management of the credentials, whereby the administrator can set new credentials for the application at a future date without changing the app access experience of the end user.

In both cases, credentials are stored in an encrypted state in the directory, and are only passed over HTTPS during the automated sign-in process. Using password-based single sign on, Azure AD offers a convenient identity access management solution for apps that are not capable of supporting federation protocols.

Password-based SSO relies on a browser extension to securely retrieve the application and user specific information from Azure AD and apply it to the service. Most third-party SaaS applications that are supported by Azure AD support this feature.

For password-based SSO, the end user’s browsers can be:
*	IE 8, IE9 and IE10 on Windows 7 or later
*	Chrome on Windows 7 or later or MacOS X or later

##Existing Single Sign-On

When configuring single sign-on for an application, the Azure management portal provides a third option of “Existing Single Sign-On”. This option simply allows the administrator to create a link to an application, and place it on the access panel for selected users.

For example, if there is an application that is configured to authenticate users using Active Directory Federation Services 2.0, an administrator can use the “Existing Single Sign-On” option to create a link to it on the access panel. When users access the link, they are authenticated using Active Directory Federation Services 2.0, or whatever existing single sign-on solution is provided by the application.

##User Provisioning

For select applications, Azure AD enables automated user provisioning and de-provisioning of accounts in third-party SaaS applications from within the Azure Management Portal, using your Windows Server Active Directory or Azure AD identity information. When a user is given permissions in Azure AD for one of these applications, an account can be automatically created (provisioned) in the target SaaS application.

When a user is deleted or their information changes in Azure AD, these changes are also reflected in the SaaS application. This means, configuring automated identity lifecycle management enables administrators to control and provide automated provisioning and de-provisioning from SaaS applications. In Azure AD, this automation of identity lifecycle management is enabled by user provisioning.


[Next: Get started with the Azure AD application gallery](active-directory-appssoaccess-get-started.md)
