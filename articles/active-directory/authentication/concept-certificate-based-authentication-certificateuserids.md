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
 
|Certificate mapping Field | Examples of values in CertificateUserIds |
|--------------------------|--------------------------------------|
|PrincipalName | “X509:\<PN\>bob@woodgrove.com” |
|PrincipalName | “X509:\<PN>bob@woodgrove”     | 
|RFC822Name	| “X509:\<RFC822\>user@woodgrove.com” |
|X509SKI | “X509:\<SKI\>123456789abcdef”|
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

> [!NOTE]
> Customers should use latest version of Azure ADConnect. Please visit [Download latest AADConnect](https://www.microsoft.com/en-us/download/details.aspx?id=47594) for downloading latest version. 

## Complex transformation using syn rule Expressions

If you want to manipulate values to be synchronized to Azure AD or you have to construct more complex values which are sources out of multiple sources, you can use declarative provisioning expressions in AADConnect Sync rule editor.  

If you want to learn more on declarative provisioning expressions, please look at [Azure AD Connect: Declarative Provisioning Expressions](https://learn.microsoft.com/en-us/azure/active-directory/hybrid/concept-azure-ad-connect-sync-declarative-provisioning-expressions)

**Synchronizing X509:<PN>PrincipalNameValue**
 
Create an outbound synchronization rule. Choose “Expression” in the flow type. Choose the target attribute as <certificateUserIds>, and in the source field you add the expression <"X509:<PN>"&[userPrincipalName]>. If your source attribute is not UserPrincipalName, you can change the expression accordingly.
 
    :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/pnexpression.png" alt-text="Screenshot of how to edit a rule.":::
 
**Synchronizing X509:<RFC822>RFC822Name**

Create an outbound synchronization rule. Choose “Expression” in the flow type. Choose the target attribute as <certificateUserIds>, and in the source field you add the expression <"X509:<RFC822>"&[userPrincipalName]>. If your source attribute is not UserPrincipalName, you can change the expression accordingly.  

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/rfc822expression.png" alt-text="Screenshot of how to edit a rule.":::


## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Windows SmartCard logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Azure AD CBA on mobile devices (Android and iOS)](concept-certificate-based-authentication-mobile.md)
- [FAQ](certificate-based-authentication-faq.yml)
