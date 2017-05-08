---
title: Configure Azure AD SSO for applications | Microsoft Docs
description: Learn how to self-service connect apps to Azure Active Directory using SAML and password-based SSO
services: active-directory
author: asmalser-msft
documentationcenter: na
manager: femila

ms.assetid: 0d42eb0c-6d3f-4557-9030-e88e86709a19
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/27/2017
ms.author: asmalser

ms.custom: H1Hack27Feb2017

---
# Configuring single sign-on to applications that are not in the Azure Active Directory application gallery
This article is about a feature that enables administrators to configure single sign-on to applications not present in the Azure Active Directory app gallery *without writing code*. This feature was released from technical preview on November 18th, 2015 and is included in [Azure Active Directory Premium](active-directory-editions.md). If you are instead looking for developer guidance on how to integrate custom apps with Azure AD through code, see [Authentication Scenarios for Azure AD](active-directory-authentication-scenarios.md).

The Azure Active Directory application gallery provides a listing of applications that are known to support a form of single sign-on with Azure Active Directory, as described in [this article](active-directory-appssoaccess-whatis.md). Once you (as an IT specialist or system integrator in your organization) have found the application you want to connect, you can get started by follow the step-by-step instructions presented in the Azure management portal to enable single sign-on.

Customers with [Azure Active Directory Premium](active-directory-editions.md) licenses also get these additional capabilities:

* Self-service integration of any application that supports SAML 2.0 identity providers (SP-initiated or IdP-initiated)
* Self-service integration of any web application that has an HTML-based sign-in page using [password-based SSO](active-directory-appssoaccess-whatis.md#password-based-single-sign-on)
* Self-service connection of applications that use the SCIM protocol for user provisioning ([described here](active-directory-scim-provisioning.md))
* Ability to add links to any application in the [Office 365 app launcher](https://blogs.office.com/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users)

This can include not only SaaS applications that you use but have not yet been on-boarded to the Azure AD application gallery, but third-party web applications that your organization has deployed to servers you control, either in the cloud or on-premises.

These capabilities, also known as *app integration templates*, provide standards-based connection points for apps that support SAML, SCIM, or forms-based authentication, and include flexible options and settings for compatibility with a broad number of applications. 

## Adding an unlisted application
To connect an application using an app integration template, sign into the Azure management portal using your Azure Active Directory administrator account, and browse to the **Active Directory > [Directory] > Applications** section, select **Add**, and then **Add an application from the gallery**. 

![][1]

In the app gallery, you can add an unlisted app using the **Custom** category on the left, or by selecting the **Add an unlisted application** link that is shown in the search results if your desired app wasn't found. After entering a Name for your application, you can configure the single sign-on options and behavior. 

**Quick tip**:  As a best practice, use the search function to check to see if the application already exists in the application gallery. If the app is found and its description mentions "single sign on", then the application is already supported for federated single sign-on. 

![][2]

Adding an application this way provides a very similar experience to the one available for pre-integrated applications. To start, select **Configure Single Sign-On**. The next screen presents the following three options for configuring single sign on, which are described in the following sections.

![][3]

## Azure AD Single Sign-On
Select this option to configure SAML-based authentication for the application. This requires that the application support SAML 2.0, and you should collect information on how to use the SAML capabilities of the application before continuing. After selecting **Next**, you will be prompted to enter three different URLs corresponding to the SAML endpoints for the application. 

![][4]

These are:

* **Sign On URL (SP-initiated only)** – Where the user goes to sign-in to this application. If the application is configured to perform service provider-initiated single sign on, then when a user navigates to this URL, the service provider will do the necessary redirection to Azure AD to authenticate and log on the user in. If this field is populated, then Azure AD will use this URL to launch the application from Office 365 and the Azure AD Access Panel. If this field is ommited, then Azure AD will instead perform identity provider -initiated sign on when the app is launched from Office 365, the Azure AD Access Panel, or from the Azure AD single sign-on URL (copiable from the Dashboard tab).
* **Issuer URL** - The issuer URL should uniquely identify the application for which single sign on is being configured. This is the value that Azure AD sends back to application as the **Audience** parameter of the SAML token, and the application is expected to validate it. This value also appears as the **Entity ID** in any SAML metadata provided by the application. Check the application’s SAML documentation for details on what it's Entity ID or Audience value is. Below is an example of how the Audience URL appears in the SAML token returned to the application:

```
    <Subject>
    <NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:unspecificed">chad.smith@example.com</NameID>
        <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer" />
      </Subject>
      <Conditions NotBefore="2014-12-19T01:03:14.278Z" NotOnOrAfter="2014-12-19T02:03:14.278Z">
        <AudienceRestriction>
          <Audience>https://tenant.example.com</Audience>
        </AudienceRestriction>
      </Conditions>
```

* **Reply URL** - The reply URL is where the application expects to receive the SAML token. This is also referred to as the **Assertion Consumer Service (ACS) URL**. Check the application’s SAML documentation for details on what its SAML token reply URL or ACS URL is.
  After these have been entered, click **Next** to proceed to the next screen. This screen provides information about what needs to be configured on the application side to enable it to accept a SAML token from Azure AD. 

![][5]

Which values are required will vary depending on the application, so check the application's SAML documentation for details. The **Sign-On** and **Sign-Out** service URL both resolve to the same endpoint, which is the SAML request-handling endpoint for your instance of Azure AD. The Issuer URL is the value that appears as the "Issuer" inside the SAML token issued to the application. 

After your application has been configured, click **Next** button and then the **Complete** to close the dialog. 

## Assigning users and groups to your SAML application
Once your application has been configured to use Azure AD as a SAML-based identity provider, then it is almost ready to test. As a security control, Azure AD will not issue a token allowing them to sign into the application unless they have been granted access using Azure AD. Users may be granted access directly, or through a group that they are a member of. 

To assign a user or group to your application, click the **Assign Users** button. Select the user or group you wish to assign, and then select the **Assign** button. 

![][6]

Assigning a user will allow Azure AD to issue a token for the user, as well as causing a tile for this application to appear in the user's Access Panel. An application tile will also appear in the Office 365 application launcher if the user is using Office 365. 

You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application. 

### Customizing the claims issued in the SAML token
When a user authenticates to the application, Azure AD will issue a SAML token to the app that contains information (or claims) about the user that uniquely identifies them. By default this includes the user's username, email address, first name, and last name. 

You can view or edit the claims sent in the SAML token to the application under the **Attributes** tab. 

![][7]

There are two possible reasons why you might need to edit the claims issued in the SAML token: 
•The application has been written to require a different set of claim URIs or claim values 
•Your application has been deployed in a way that requires the NameIdentifier claim to be something other than the username (AKA user principal name) stored in Azure Active Directory. 

For information on how to add and edit claims for these scenarios, check out this [article on claims customization](active-directory-saml-claims-customization.md). 

### Testing the SAML application
Once the SAML URLs and certificate have been configured in Azure AD and in the application, users or groups have been assigned to the application in Azure, and the claims have been reviewed and edited if necessary, then the user is ready to sign into the application. 

To test, simply sign-into the Azure AD access panel at https://myapps.microsoft.com using a user account you assigned to the application, and then click on the tile for the application to kick off the single sign-on process. Alternately, you can browse directly to the Sign-On URL for the application and sign-in from there. 

For debugging tips, see this [article on how to debug SAML-based single sign-on to applications](active-directory-saml-debugging.md) 

## Password Single Sign-On
Select this option to configure [password-based single sign-on](active-directory-appssoaccess-whatis.md) for a web application that has an HTML sign-in page. Password-based SSO, also referred to as password vaulting, enables you to manage user access and passwords to web applications that don't support identity federation. It is also useful for scenarios where several users need to share a single account, such as to your organization's social media app accounts. 

After selecting **Next**, you will be prompted to enter the URL of the application's web-based sign-in page. Note that this must be the page that includes the username and password input fields. Once entered, Azure AD starts a process to parse the sign-in page for a username input and a password input. If the process is not successful, then it guides you through an alternate process of installing a browser extension (requires Internet Explorer, Chrome, or Firefox) that will allow you to manually capture the fields.

Once the sign-in page is captured, users and groups may be assigned and credential policies can be set just like regular [password SSO apps](active-directory-appssoaccess-whatis.md).

Note: You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application. 

## Existing Single Sign-On
Select this option to add a link to an application to your organization's Azure AD Access Panel or Office 365 portal. You can use this to add links to custom web apps that currently use Azure Active Directory Federation Services (or other federation service) instead of Azure AD for authentication. Or, you can add deep links to specific SharePoint pages or other web pages that you just want to appear on your user's Access Panels. 

After selecting **Next**, you will be prompted to enter the URL of the application to link to. Once completed, users and groups may be assigned to the application, which causes the application to appear in the [Office 365 app launcher](https://blogs.office.com/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users) for those users.

Note: You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

## Related Articles
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [How to Customize Claims Issued in the SAML Token for Pre-Integrated Apps](active-directory-saml-claims-customization.md)
* [Troubleshooting SAML-Based Single Sign-On](active-directory-saml-debugging.md)

<!--Image references-->
[1]: ./media/active-directory-saas-custom-apps/customapp1.png
[2]: ./media/active-directory-saas-custom-apps/customapp2.png
[3]: ./media/active-directory-saas-custom-apps/customapp3.png
[4]: ./media/active-directory-saas-custom-apps/customapp4.png
[5]: ./media/active-directory-saas-custom-apps/customapp5.png
[6]: ./media/active-directory-saas-custom-apps/customapp6.png
[7]: ./media/active-directory-saas-custom-apps/customapp7.png
