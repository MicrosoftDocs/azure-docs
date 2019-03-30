---
title: Manage federation certificates in Azure AD | Microsoft Docs
description: Learn how to customize the expiration date for your federation certificates, and how to renew certificates that will soon expire.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/26/2019
ms.author: celested
ms.reviewer: jeedes

ms.collection: M365-identity-device-management
---
# Manage certificates for federated single sign-on in Azure Active Directory

This article covers common questions and information related to the certificates that Azure Active Directory (Azure AD) creates to establish federated single sign-on (SSO) to your software as a service (SaaS) applications. Add applications from the Azure AD app gallery or by using a non-gallery application template. Configure the application by using the federated SSO option.

This article is relevant only to apps that are configured to use Azure AD SSO through [Security Assertion Markup Language](https://wikipedia.org/wiki/Security_Assertion_Markup_Language) (SAML) federation.

## Auto-generated certificate for gallery and non-gallery applications

When you add a new application from the gallery and configure a SAML-based sign-on, Azure AD generates a certificate for the application that is valid for three years. You can download this certificate from the **SAML Signing Certificate** section. For gallery applications, this section might show an option to download the certificate or metadata, depending on the requirement of the application.

To download a certificate for an existing application:

1. In the [Azure Active Directory admin center](https://aad.portal.azure.com/), select **Enterprise application** in the left pane. The **Enterprise applications - All applications** page appears.

2. Select an application. An overview page for the application appears.

3. In the left pane of the application overview page, select **Single sign-on**.

4. If the **Select a single sign-on method** page appears, select **SAML**.

5. In the **Set up Single Sign-On with SAML - Preview** page, find the **SAML Signing Certificate** heading and select its **Edit** icon (a pencil). The SAML Signing Certificate section appears.

6. In the list of certificates, find the certificate row that has the **Status** column set to **Active**, and select its ellipsis (**...**).

7. In the shortcut menu, choose a command to download the certificate in the encoding format required by the SaaS application. You may choose from these commands:
   - **Base64 certificate download**
   - **PEM certificate download**
   - **Raw certificate download**
   - **Download federated certificate XML**

## Customize the expiration date for your federation certificate and roll it over to a new certificate

By default, certificates are set to expire after three years. Because you can't change the date of a certificate after you save it, you have to create a new certificate with the desired date, and then make it active. You can choose a different expiration date for your certificate by completing the following steps.
The screenshots use Salesforce for the sake of example, but these steps can apply to any federated SaaS app.

To add a new application and set it up for SAML-based sign-on:

1. In the [Azure Active Directory admin center](https://aad.portal.azure.com/), select **Enterprise application** in the left pane. The **Enterprise applications - All applications** page appears.

2. Select **New application**. The **Categories** pane and the **Add an application** page appear.

3. Search for the gallery application and select the application that you want. A description of the application appears on the right. (If you cannot find the required application, add the application by using the **Non-gallery application** option. This feature is available only in the Azure AD Premium (P1 and P2) SKU.)

4. If the **Single Sign-On Mode** heading (or **Supports** heading for a non-gallery application) lists **SAML-based sign-on** as an option, select **Add**. (Otherwise, SAML-based sign-on is unsupported, and this article doesn't apply to this particular application.) The overview page for the application appears.

5. In the left pane of the overview page, select **Single sign-on**. The **Select a single sign-on method** page appears.

6. Select **SAML-based Sign-on**. The **SAML-based sign-on** page appears. This step generates a three-year certificate for your application.

   ![SAML-based sign-on page](./media/manage-certificates-for-federated-single-sign-on/saml-based-sign-on.png)

To create a new certificate:

1. Find the **SAML Signing Certificate** section and select its **Edit** icon (a pencil). The **SAML Signing Certificate** page appears, which displays the status (**Active** or **Inactive**), expiration date, and thumbprint (a hash string) of each certificate.

2. Select **New Certificate**. A new row appears at the bottom of the certificate list, with the expiration date defaulting to exactly three years ahead of the current date.

3. In the new certificate row, select the **Select Date** icon (a calendar). A calendar control appears, displaying the days of a month of the new row's current expiration date.

4. If you want, use the calendar control to set a new date. You can set any date and time up to three years from the current date.

5. Select **Save**. The new certificate now appears with a status of **Inactive**, the expiration date that you chose, and a thumbprint.

To download a certificate and upload it to a SaaS application:

1. In another browser tab or window, go to [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md) and find the tutorial for the SaaS application that you want to use.

2. Read the tutorial instructions to determine which encoding format the SaaS application requires when you upload the SAML signing certificate.

3. Follow the instructions for downloading a certificate, choosing the encoding format required by the SaaS application.

4. In the certificate row, select the ellipsis (**...**), select **Make certificate active**, and select **Yes** when prompted to activate the certificate. The new certificate's status changes to **Active**, and the previously active certificate's status changes to **Inactive**. From this moment, Azure AD starts using the new certificate for signing the response.

5. Return to the SaaS application tutorial and follow the instructions to set up the SaaS application integration, including the upload of the SAML signing certificate.

## Add email notification addresses for certificate expiration

Azure AD will send an email notification 60, 30, and seven days before the SAML certificate expires. You may add more than one email address to receive notifications. To specify the email address(es) for where to send the notification:

1. In the **SAML Signing Certificate** page, go to the **NOTIFICATION EMAIL ADDRESSES** field. By default, this field uses only the email address of the admin who added the application.

2. In the blank text box below the final email address, type the email address that should receive the certificate's expiration email notice and press **Enter**.

3. Repeat the previous step for each email address you want to add.

4. For each email address you want to delete, select the **Delete** icon (a garbage can) next to the email address.

5. Select **Save**.

You will receive the notification email from aadnotification@microsoft.com. To avoid the email going to your spam location, add this email to your contacts.

## Renew a certificate that will soon expire

The following renewal steps should result in no significant downtime for your users. The screenshots in this section feature Salesforce as an example, but these steps can apply to any federated SaaS app.

1. On the **Azure Active Directory** application **Single sign-on** page, generate the new certificate for your application. You can do this by clicking the **Create new certificate** link in the **SAML Signing Certificate** section.

    ![Generate a new certificate](./media/manage-certificates-for-federated-single-sign-on/create_new_certficate.png)

2. Select the desired expiration date and time for your new certificate and click **Save**. Selecting a date that overlaps with the existing certificate will ensure that any downtime due to cert expiry is limited. 

3. If the app can automatically roll over a certificate, set the new certificate to active.  Sign in to the app to check that it works.

4. If the app doesn’t automatically pickup the new cert, but can handle more than one signing cert, before the old one expires, upload the new one to the app, then go back to the portal and make it the active certificate. 

5. If the app can only handle one certificate at a time, pick a downtime window, download the new certificate, upload it to the application, come back to the Azure Portal and set the new certificate as active. 

6. To activate the new certificate in Azure AD, select the **Make new certificate active** check box and click the **Save** button at the top of the page. This rolls over the new certificate on the Azure AD side. The status of the certificate changes from **New** to **Active**. From that point, Azure AD starts using the new certificate for signing the response. 

    ![Generate a new certificate](./media/manage-certificates-for-federated-single-sign-on/new_certificate_download.png)

## Related articles

* [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md)
* [Application Management in Azure Active Directory](what-is-application-management.md)
* [Application access and single sign-on with Azure Active Directory](what-is-single-sign-on.md)
* [Troubleshooting SAML-based single sign-on](../develop/howto-v1-debug-saml-sso-issues.md)
