---
title: CertificateUserIds for Azure AD certificate-based authentication (Preview) - Azure Active Directory 
description: Learn about CertificateUserIds for Azure AD certificate-based authentication without federation

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/15/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# CertificateUserIds 

Azure AD has added a new user object attribute **CertificateUserIds**, which is multivalued. The attribute allows up to four values and each value can be of 120-character length. This attribute can store any value and doesn't need to be in email Id format. It can store non-routable UPNs like _bob@contoso_ or _bob@local_.
 
## Supported patterns for certificateUserIds
 
The values stored in certificateUserIds should be in the format described in the following table.
 
|Certificate mapping ield | Examples of values in CertificateUserIds |
|--------------------------|--------------------------------------|
|PrincipalName | “X509:\<PN\>bob@contoso.com” |
|PrincipalName | “X509:\<P\N>bob@contoso”     | 
|RFC822Name	| “X509:\<RFC822\>user@contoso.com” |
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

