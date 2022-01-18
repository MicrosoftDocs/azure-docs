---
title: Cloud-native certificate-based authentication technical deep dive - Azure Active Directory
description: Learn how cloud-native certificate-based authentication works in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/18/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Cloud-native certificate-based authentication technical deep dive

This article is an overview of how cloud-native certificate-based authentication (CBA) against Azure Active Directory (Azure AD) works.

## How does Azure Active Directory certificate-based authentication work?

When a user tries to sign into an application secured by Azure AD, and if Certificate-based Authentication is enabled on the tenant, the following steps occur:

1. The user tries to access an application, such as [MyApps portal](https://myapps.microsoft.com/).
1. If the user is not already signed in, the user is redirected to the Azure AD **User Sign-in** page at [https://login.microsoftonline.com/](https://login.microsoftonline.com/).
1. The user enters their username into the Azure AD sign in page, and then clicks **Next**.
1. If Azure AD checks whether CBA is enabled for the tenant. If CBA is enabled for the tenant, the user sees a link to **Sign in with a certificate** on the password page. If you do not see the sign in link, make sure CBA is enabled on the tenant. For more information, see [Frequently asked questions about Cloud native certificate authentication](cloud-native-certificate-based-authentication-faq.yml).
   
   >[!NOTE]
   > If CBA is enabled, all users see the link to **Sign in with a certificate** on the password page. CBA cannot be enabled for specific users. 

1. After the user clicks the link, the client is redirected to [http://certauth.login.microsoftonline.com](http://certauth.login.microsoftonline.com). The endpoint performs mutual authentication and requests the client certificate as part of the TLS handshake. You will see an entry for this request in the sign in logs. There is a known issue where User ID is displayed instead of Username.

   :::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/sign-in-log.png" alt-text="Screenshot of the Sign-in log in Azure AD.":::
   
   Click the log entry to bring up **Activity Details** and click **Authentication Details**. You will see an entry for X.509 certificate.

   :::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/entry.png" alt-text="Screenshot of the entry for X.509 certificate.":::

1. Azure AD will request a client certificate and the user picks the client certificate and clicks **Ok**.

   >[!NOTE] 
   >Certificate authority (CA) hints are not supported so the list of certificates can't be further scoped.

1. Azure AD does the certificate revocation to make sure the certificate is valid. Azure AD identifies the user in the tenant by using the [username binding configured](how-to-certificate-based-authentication.md) on the tenant by mapping the certificate field value to user attribute value.
1. If a unique user is found and the user has a conditional access policy and needs multifactor authentication (MFA) and the [certificate authentication binding rule](how-to-certificate-based-authentication.md) satisfies MFA, then Azure AD signs the user in immediately. If the certificate satisfies only a single factor, then it requests the user for a second factor to complete Azure AD MFA.
1. Azure AD completes the sign-in process by sending a primary refresh token back to indicate successful sign-in.
1. If the user sign-in is successful, the user can access the application.

The following diagram illustrates all the components and the steps involved.

:::image type="content" border="false" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/how-it-works.png" alt-text="Illustration with steps about how cloud-native certificate-based authentication works in Azure AD.":::

## Understanding the authentication binding policy

The authentication binding policy helps determine the strength of authentication as either single-factor or multifactor. An administrator can change the default value from single factor to multifactor or set up custom policy configurations either by issuer subject or policy OID fields in the certificate.

Since multiple authentication binding rules can be created with different certificate fields, there are some rules that determine the authentication protection level. They are as follows:

1. Exact match is used for strong authentication via policy OID. If you have a certificate A with policy OID **1.2.3.4.5** and a derived credential B based on that certificate has a policy OID **1.2.3.4.5.6** and the custom rule is defined as **Policy OID** with value **1.2.3.4.5** with MFA, only certificate A will satisfy MFA and credential B will satisfy only single-factor authentication. If the user used derived credential during sign-in and was configured to have MFA, the user will be asked for a second factor for successful authentication.
1. Policy OID rules will take precedence over certificate issuer rules. If a certificate has both policy OID and Issuer, the policy OID is always checked first and if no policy rule is found then the issuer subject bindings are checked. Policy OID has a higher strong authentication binding priority than the issuer.
1. If one CA binds to MFA, all user certificates that this CA issues qualify as MFA. The same logic applies for single-factor authentication.
1. If one policy OID binds to MFA, all user certificates that include this policy OID as one of the OIDs (A user certificate could have multiple policy OIDs) qualify as MFA.
1. If there is a conflict between multiple policy OIDs (such as when a certificate has two policy OIDs, where one binds to single-factor authentication and the other binds to MFA) then treat the certificate as a single-factor authentication.
1. One certificate can only have one valid strong authentication binding (that is, a certificate cannot bind to both single-factor and MFA).

## Understanding the username binding policy

The username binding policy helps locate the user in the tenant. By default, Principal Name in the certificate is mapped to onPremisesUserPrincipalName attribute of the user object to determine the user.

An administrator can override the default and create a custom mapping. Currently, we support two certificate fields SAN (Subject Alternate Name) Principal Name and SAN RFC822Name to map against the user object attribute userPrincipalName and onPremisesUserPrincipalName.

**Rules applied for user bindings:**

Use the highest priority (lowest number) binding.

1. If the X.509 certificate field is on the presented certificate, try to look up the user by using the value in the specified field.
   1. If a unique user is found, authenticate the user.
   1. If a unique user is not found, authentication fails.
1. If the X.509 certificate field is not on the presented certificate, move to the next priority binding.
1. If the specified X.509 certificate field is found on the certificate, but Azure AD does not find a user object in the directory matching that value, the authentication fails. Azure AD does not attempt to use the next binding in the list in this case. Only if the X.509 certificate field is not on the certificate does it tries the next binding, as mentioned in Step 2.

## Understanding the certificate revocation process

The certificate revocation process allows the admin to revoke a previously issued certificate from being used for future authentication. The certificate revocation will not revoke already issued tokens of the user. Follow the steps to manually revoke tokens at [Configure revocation](active-directory-certificate-based-authentication-get-started.md#step-3-configure-revocation).

Azure AD downloads and caches the customers certificate revocation list (CRL) from their certificate authority to check if certificates are revoked during the authentication of the user.

An admin can configure the CRL distribution point during the setup process of the trusted issuers in the Azure AD tenant. Each trusted issuer should have a certificate revocation list (CRL) that can be referenced via an internet-facing URL.
 
>[!IMPORTANT]
>The maximum size of a CRL for Azure Active Directory to successfully download and cache is 20MB, and the time required to download the CRL must not exceed 10 seconds. If Azure Active Directory can't download a CRL, certificate-based authentications using certificates issued by the corresponding CA will fail. Best practices to ensure CRL files are within size constraints are to keep certificate lifetimes to within reasonable limits and to clean up expired certificates. 

>[!IMPORTANT]
>If the admin skips the configuration of the CRL, Azure AD will not perform any CRL checks during the certificate-based authentication of the user. This can be helpful for initial troubleshooting but should not be considered for production use.


**Typical flow of the CRL check:**

1. Azure AD will attempt to download the CRL at the first sign in event of any user with a certificate of the corresponding trusted issuer/certificate authority. 
1. Azure AD will cache and re-use the CRL for any subsequent usage. It will honor the **Next update date** and if available **Next CRL Publish date** (used by Windows Server CAs) in the CRL document.
1. The user certificate-based authentication will fail if:
   1. A CRL has been configured for the trusted issuer and Azure AD cannot download the CRL, due to availability, size or latency constraints.
   1. The users certificate is listed as revoked on the CRL.
   
      :::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/user-cert.png" alt-text="Screenshot of the revoked user certificate in the CRL.":::  

   1. Azure AD will attempt to download a new CRL from the distribution point if the cached CRL document is expired. 

>[!NOTE]
>Azure AD will only check the CRL of the issuing CA but not of the entire PKI trust chain up to the root CA. In case of a CA compromise, the administrator should remove the compromised trusted issuer from the Azure AD tenant configuration. 

>[!IMPORTANT]
>Due to the nature of CRL caching and publishing cycles, it is highly recommended in case of a certificate revocation to also revoke all sessions of the affected user in Azure AD.

There is no way for the administrator to manually force or re-trigger the download of the CRL. 

## Understanding Sign in logs

Sign-in logs provide information about sign-ins and how your resources are used by your users. For more information about sign-in logs, see [Sign-in logs in Azure Active Directory](../reports-monitoring/concept-all-sign-ins.md).

Let's walk through two scenarios, one where the certificate satisfies single-factor authentication and another where the certificate satisfies MFA.

**Test scenario configuration** 
User: MFA User with a conditional access policy requiring MFA
User Binding policy: SAN Principal Name > UserPrincipalName
User Certificate:

:::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/user-certificate.png" alt-text="Screenshot of the user certificate.":::  

### Test Scenario 1

Authentication policy configuration: Issuer subject rule satisfies single factor authentication.

:::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/single-factor.png" alt-text="Screenshot of the Authentication policy configuration showing single-factor authentication required.":::  

1. Sign in using CBA and since the policy was set to satisfy single factor and the user required MFA (via conditional access policy), a second factor was requested.
1. Sign in was successful.
1. Sign in to the Azure portal and click your tenant > **Sign in logs**.

You will see several entries in the sign in logs.

:::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/entries-single.png" alt-text="Screenshot of single-factor authentication entries in the sign-in logs.":::  

Entry 1: This is an entry that requests the X.509 certificate from the user. The status success just means that Azure AD validated that CBA is enabled in the tenant and a certificate is requested for authentication.

:::image type="content" border="true" source="./media/concept-cloud-native-certificate-based-authentication-technical-deep-dive/entry-one.png" alt-text="Screenshot of single-factor authentication entry in the sign-in logs.":::  



## Next steps

- [Overview of cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication.md)
- [Limitations with cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication-limitations.md)
- [Get started with cloud-native certificate-based authentication](how-to-certificate-based-authentication.md)
- [FAQ](cloud-native-certificate-based-authentication-faq.yml)
- [Troubleshoot cloud-native certificate-based authentication](troubleshoot-cloud-native-certificate-based-authentication.md)

