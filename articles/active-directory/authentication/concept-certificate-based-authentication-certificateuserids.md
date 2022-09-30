---
title: Certificate user IDs for Azure AD certificate-based authentication - Azure Active Directory 
description: Learn about certificate user IDs for Azure AD certificate-based authentication without federation

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/30/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Certificate user IDs 

You can add certificate user IDs to users in Azure AD can have certificate user IDs. a multivalued attribute named **certificateUserIds**. The attribute allows up to four values, and each value can be of 120-character length. It can store any value, and doesn't require email ID format. It can store non-routable User Principal Names (UPNs) like _bob@woodgrove_ or _bob@local_.
 
## Supported patterns for certificate user IDs
 
The values stored in **certificateUserIds** should be in the format described in the following table.
 
|Certificate mapping Field | Examples of values in CertificateUserIds |
|--------------------------|--------------------------------------|
|PrincipalName | “X509:\<PN>bob@woodgrove.com” |
|PrincipalName | “X509:\<PN>bob@woodgrove”     | 
|RFC822Name	| “X509:\<RFC822>user@woodgrove.com” |
|X509SKI | “X509:\<SKI>123456789abcdef”|
|X509SHA1PublicKey |“X509:\<SHA1-PUKEY>123456789abcdef” |
 
## Update certificate user IDs in the Azure portal
 
Tenant admins can use the following steps Azure portal to update certificate user IDs for a user account:

1. In the Azure AD portal, click **All users (preview)**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/user.png" alt-text="Screenshot of test user account.":::

1. Select a user, click the **Properties** tab, and click **Edit Properties**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/view.png" alt-text="Screenshot of how to edit Properties.":::

1. Next to **Authorization info**, click **View**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/view.png" alt-text="Screenshot of View authorization info.":::

1. Click **Edit certificate user IDs**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/edit-cert.png" alt-text="Screenshot of Edit certificate user IDs.":::

1. Click **Add**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/add.png" alt-text="Screenshot of how to add a CertificateUserID.":::

1. Enter the value and click **Save**. You can add up to four values, each of 120 characters.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/save.png" alt-text="Screenshot of a value to enter for CertificateUserId.":::
 
## Update certificate user IDs using Azure AD Connect for federated users

To update certificate user IDs for federated users, configure Azure AD Connect to sync userPrincipalName to certificateUserIds. 

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

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/edit-rule.png" alt-text="Screenshot of how to save a rule.":::

1. Click **OK** to confirm. 

> [!NOTE]
> Make sure you use the latest version of [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594). 

## Complex transformation using sync rule expressions

You can use declarative provisioning expressions in the Azure AD Connect Sync rule editor to manipulate values that are synchronized to Azure AD, or construct more complex values from multiple sources.  

For more information about declarative provisioning expressions, see [Azure AD Connect: Declarative Provisioning Expressions](../hybrid/concept-azure-ad-connect-sync-declarative-provisioning-expressions).

### Synchronize X509:\<PN>PrincipalNameValue
 
To synchronize X509:\<PN>PrincipalNameValue, create an outbound synchronization rule, and choose **Expression** in the flow type. Choose the target attribute as \<certificateUserIds>, and in the source field, add the expression <"X509:\<PN>"&[userPrincipalName]>. If your source attribute isn't userPrincipalName, you can change the expression accordingly.
 
:::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/pnexpression.png" alt-text="Screenshot of how to sync x509.":::
 
### Synchronize X509:\<RFC822>RFC822Name

To synchronize X509:\<RFC822>RFC822Name, create an outbound synchronization rule, choose **Expression** in the flow type. Choose the target attribute as \<certificateUserIds>, and in the source field, add the expression <"X509:\<RFC822>"&[userPrincipalName]>. If your source attribute isn't userPrincipalName, you can change the expression accordingly.  

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/rfc822expression.png" alt-text="Screenshot of how to sync RFC822Name.":::

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Azure AD CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [Advanced features](concept-certificate-based-authentication-advanced-features.md)
- [FAQ](certificate-based-authentication-faq.yml)
