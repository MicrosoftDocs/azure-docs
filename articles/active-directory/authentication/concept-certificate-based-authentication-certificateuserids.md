---
title: CertificateUserIds for Azure AD certificate-based authentication - Azure Active Directory 
description: Learn about CertificateUserIds for Azure AD certificate-based authentication without federation

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/20/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# CertificateUserIds 

Azure AD has added a new user object attribute **CertificateUserIds**, which is multivalued. The attribute allows up to four values and each value can be of 120-character length. This attribute can store any value and doesn't need to be in email Id format. It can store non-routable UPNs like _bob@woodgrove or _bob@local_.
 
## Supported patterns for certificateUserIds
 
The values stored in certificateUserIds should be in the format described in the following table.
 
|Certificate mapping ield | Examples of values in CertificateUserIds |
|--------------------------|--------------------------------------|
|PrincipalName | “X509:\<PN\>bob@woodgrove.com” |
|PrincipalName | “X509:\<PN>bob@woodgrove”     | 
|RFC822Name	| “X509:\<RFC822\>user@woodgrove.com” |
| X509SKI | “X509:\<SKI\>123456789abcdef”|
|X509SHA1PublicKey |“X509:\<SHA1-PUKEY\>123456789abcdef” |
 
## Update CertificateUserIds in the Azure portal
 
Tenant admins can use Azure portal to update the CertificateUserIds attribute for a user account:

1. In the Azure AD portal, click **All users (preview)**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/user.png" alt-text="Screenshot of test user account.":::

1. Select a user, click the **Properties** tab, and click **Edit Properties**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/view.png" alt-text="Screenshot of how to edit Properties.":::

1. Next to **Authorization info**, click **View**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/view.png" alt-text="Screenshot of View authorization info.":::

1. Click **Edit Certificate user IDs**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/edit-cert.png" alt-text="Screenshot of Edit Certificate user IDs.":::

1. Click **Add**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/add.png" alt-text="Screenshot of how to add a CertificateUserID.":::

1. Enter the value of the certificateUserIds and click **Save**. You can add up to four values, each of 120 characters.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/add.png" alt-text="Screenshot of a value to enter for CertificateUserId.":::
 
## Update CertificateUserIds using Azure AD Connect for federated users

To update CertificateUserIds for federated users, configure Azure AD Connect to sync UserPrincipalName to CertificateUserIds. 

1. On the Azure AD Connect server, find and start the **Synchronization Rules Editor**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/sync-rules-editor.png" alt-text="Screenshot of Synchronization Rules Editor.":::

1. Click **Direction**, and click **Outbound**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/outbound.png" alt-text="Screenshot of outbound synchronization rule.":::

1. Find the rule **Out to AAD – User Identity**, click **Edit**, and click **Yes** to confirm. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/user-identity.png" alt-text="Screenshot of user identity.":::

1. Enter a high number in the **Precedence** field, and then click **Next**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/precedence.png" alt-text="Screenshot of a precedence value.":::

1. Click **Transformations** > **Add transformation**. You may need to scroll down the list of transformations before you can create a new one. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/add-transformation.png" alt-text="Screenshot of how to add a transformation.":::

1. Click **Target Attribute**, select **CertificateUserIds**, click **Source**, select **UserPrincipalName**, and then click **Save**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/edit-rule.png" alt-text="Screenshot of how to edit a rule.":::

1. Click **OK** to confirm. 

## One certificate to multiple accounts support
certificateUserIds attribute is a unique constraint multi valued attribute. An admin can use multiple bindings and add appropriate values into the multi values and achieve authenticating into multiple accounts using one certificate.

The Azure AD user object lookup happens with the Azure AD UPN the user enters ( on in case of Windows login the Azure AD UPN that windows send) and the username bindings is used to validate the certificate to successfully authenticate the user. Also, if the admin has configured multiple bindings, Azure AD will evaluate all the bindings until a successful authentication, or all the bindings are evaluated. This helps the admin use specific configurations to achieve one certificate to multiple accounts.

By default, Azure AD CBA has a single user binding configured. The Principal Name attribute in the Subject Alternative Name of a certificate presented to Azure AD. Some administrators require the ability for Azure AD to be able to map a single certificate to multiple Azure AD accounts. We refer to this as 1:M mapping. Azure AD CBA supports this implementation via administrators adding additional mapping methods to the policy. 

An example of this would be a developer use case. In this example Bob has a regular productivity account that is used to accomplish his everyday tasks and a developer account to use when he is doing task related to his developer job roles. The organization issues a single high assurance certificate to Bob and wishes for him to be able to use this same certificate for both his productivity and developer accounts. 

This 1:M implementation could be implemented in Azure AD CBA by configuring the policy as follows. 

**Certificate Information**

Principal Name in SAN = Bob.Smith@Contoso.com

Certificate Subject Key Identifier (SKI) = 89b0f468c1abea65ec22f0a882b8fda6fdd6750p

**Bobs Productivity Account**

AAD User Principal Name = Bob.Smith@Contoso.com

certificateUserIDs = Empty

**Bobs Developer Account**

AAD UserPrincipalName = Bob.Smith-dev@contoso.com

certificateUserIds = x509:<SKI>89b0f468c1abea65ec22f0a882b8fda6fdd6750p

**Tenant User Binding Policy**
 
Priority 1 Principal Name in SAN -> Azure AD UPN
 
Priority 2 Certificate SKI -> certificateUserIds

The above configuration would allow the same certificate to be used by Bob for both his productivity and developer account.

**How can I scope 1:M for only specific group of users?**
 
If the tenant Admin wishes for that certificate to ONLY be used for Bob productivity account and block the use of the certificate on other accounts, they would configure Bob's productivity account to hold all of the values available in the username mapping policy. 

In this example to lock Bobs certificate to only Bob's productivity account as certificateUserIds attribute has unique constraint and no other user account can have the same values.
 
**Bobs Productivity Account**
AAD User Principal Name = Bob.Smith@Contoso.com
 
certificateUserIDs = x509:<PN>Bob.Smith@Contoso.com; x509:<SKI>89b0f468c1abea65ec22f0a882b8fda6fdd6750p

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Windows SmartCard logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Azure AD CBA on mobile devices (Android and iOS)](concept-certificate-based-authentication-mobile.md)
- [FAQ](certificate-based-authentication-faq.yml)
