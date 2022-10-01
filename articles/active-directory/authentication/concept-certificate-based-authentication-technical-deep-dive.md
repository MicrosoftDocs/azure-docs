---
title: Azure AD certificate-based authentication technical deep dive - Azure Active Directory
description: Learn how Azure AD certificate-based authentication works

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/23/2022


ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Azure AD certificate-based authentication technical deep dive

This article explains how Azure Active Directory (Azure AD) certificate-based authentication (CBA) works, with background information and testing scenarios.

## How does Azure AD certificate-based authentication work?

Let's start by looking at what happens when a user tries to sign in to an application in a tenant where Azure AD CBA is enabled.

:::image type="content" border="false" source="./media/concept-certificate-based-authentication-technical-deep-dive/how-it-works.png" alt-text="Illustration with steps about how Azure AD certificate-based authentication works." :::

Now we'll walk through each step:

1. The user tries to access an application, such as [MyApps portal](https://myapps.microsoft.com/).
1. If the user is not already signed in, the user is redirected to the Azure AD **User Sign-in** page at [https://login.microsoftonline.com/](https://login.microsoftonline.com/).
1. The user enters their username into the Azure AD sign-in page, and then clicks **Next**. Their username is used to look them up in Azure AD.
   
   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in.png" alt-text="Screenshot of the Sign-in for MyApps portal.":::
  
1. Azure AD checks whether CBA is enabled for the tenant. If CBA is enabled, the user sees a link to **Sign in with a certificate** on the password page. If the user doesn't see the sign-in link, make sure CBA is enabled on the tenant. For more information, see [How do I enable Azure AD CBA?](certificate-based-authentication-faq.yml#how-can-an-administrator-enable-azure-ad-cba-).
   
   >[!NOTE]
   > If CBA is enabled on the tenant, all users will see the link to **Use a certificate or smart card** on the password page. However, only the users in scope for CBA will be able to authenticate successfully against an application that uses Azure AD as their Identity provider (IdP).

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-cert.png" alt-text="Screenshot of the Use a certificate or smart card.":::

   If you enabled other authentication methods like **Phone sign-in** or **FIDO2**, users may see a different sign-in screen.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-alt.png" alt-text="Screenshot of the Sign-in if FIDO2 is also enabled.":::

1. After the user clicks the link, the client is redirected to the certauth endpoint, which is [https://certauth.login.microsoftonline.com](https://certauth.login.microsoftonline.com) for Azure Global. For [Azure Government](../../azure-government/compare-azure-government-global-azure.md#guidance-for-developers), the certauth endpoint is [https://certauth.login.microsoftonline.us](https://certauth.login.microsoftonline.us).  

   The endpoint performs mutual authentication, and requests the client certificate as part of the TLS handshake. You'll see an entry for this request in the Sign-in logs.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-log.png" alt-text="Screenshot of the Sign-in log in Azure AD." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-log.png":::
   
   >[!NOTE]
   >The network administrator should allow access to the User sign-in page and certauth endpoint for the customer’s cloud environment. Disable TLS inspection on the certauth endpoint to make sure the client certificate request succeeds as part of the TLS handshake.

   Click the log entry to bring up **Activity Details** and click **Authentication Details**. You'll see an entry for the X.509 certificate.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/entry.png" alt-text="Screenshot of the entry for X.509 certificate.":::

1. Azure AD will request a client certificate, the user picks the client certificate, and clicks **Ok**.

   >[!NOTE] 
   >TrustedCA hints are not supported, so the list of certificates can't be further scoped. We're looking into adding this functionality in the future.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/cert-picker.png" alt-text="Screenshot of the certificate picker." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/cert-picker.png":::

1. Azure AD verifies the certificate revocation list to make sure the certificate is not revoked and is valid. Azure AD identifies the user in the tenant by using the [username binding configured](how-to-certificate-based-authentication.md#step-4-configure-username-binding-policy) on the tenant by mapping the certificate field value to user attribute value.
1. If a unique user is found and the user has a conditional access policy and needs multifactor authentication (MFA) and the [certificate authentication binding rule](how-to-certificate-based-authentication.md#step-3-configure-authentication-binding-policy) satisfies MFA, then Azure AD signs the user in immediately. If the certificate satisfies only a single factor, then it requests the user for a second factor to complete Azure AD Multi-Factor Authentication.
1. Azure AD completes the sign-in process by sending a primary refresh token back to indicate successful sign-in.
1. If the user sign-in is successful, the user can access the application.

## Understanding the authentication binding policy

The authentication binding policy helps determine the strength of authentication as either single-factor or multi-factor. An administrator can change the default value from single factor to multifactor or set up custom policy configurations either by issuer subject or policy OID fields in the certificate.

** Certificate strengths **

An admin can determine whether the certificates are single-factor or multi-factor strength. More information can be found at the documentation that maps [NIST Authentication Assurance Levels to Azure AD Auth Methods](https://aka.ms/AzureADNISTAAL) which builds off NIST 800-63B SP 800-63B, Digital Identity Guidelines: Authentication and Lifecycle Mgmt | CSRC (nist.gov)

** Single-factor certificatre authentication **

When a user has a single factor certificate, they will not be able to do Multifactor authentication. There is no support for a second factor when the first factor is single factor certificates. We are working on adding support for second factors soon.

      :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/mfa-notallowed.png" alt-text="Screenshot of the revoked user certificate in the CRL." :::  

** Multifactor certificate authentication **

When a user has a multi-factor certificate, they will be able to do Multifactor authentication just with certificates. However, the tenant admin should make sure the certificates are protected with a PIN or hardware module to be considered multi factor.

** How does Azure AD resolve multiple authentication policy binding rules? **

Since multiple authentication binding policy rules can be created with different certificate fields, there are some rules that determine the authentication protection level. They are as follows:

1. Exact match is used for strong authentication via policy OID. If you have a certificate A with policy OID **1.2.3.4.5** and a derived credential B based on that certificate has a policy OID **1.2.3.4.5.6** and the custom rule is defined as **Policy OID** with value **1.2.3.4.5** with MFA, only certificate A will satisfy MFA and credential B will satisfy only single-factor authentication. If the user used derived credential during sign-in and was configured to have MFA, the user will be asked for a second factor for successful authentication.
1. Policy OID rules will take precedence over certificate issuer rules. If a certificate has both policy OID and Issuer, the policy OID is always checked first and if no policy rule is found then the issuer subject bindings are checked. Policy OID has a higher strong authentication binding priority than the issuer.
1. If one CA binds to MFA, all user certificates that the CA issues qualify as MFA. The same logic applies for single-factor authentication.
1. If one policy OID binds to MFA, all user certificates that include this policy OID as one of the OIDs (A user certificate could have multiple policy OIDs) qualify as MFA.
1. If there is a conflict between multiple policy OIDs (such as when a certificate has two policy OIDs, where one binds to single-factor authentication and the other binds to MFA) then treat the certificate as a single-factor authentication.
1. One certificate can only have one valid strong authentication binding (that is, a certificate cannot bind to both single-factor and MFA).

## Understanding the username binding policy

The username binding policy helps validate the certificate of the user. By default, Subject Alternate Name (SAN) Principal Name in the certificate is mapped to onPremisesUserPrincipalName attribute of the user object to determine the user.

An administrator can override the default and create a custom mapping. Currently, we support two certificate fields SAN Principal Name and SAN RFC822Name to map against the user object attribute userPrincipalName and onPremisesUserPrincipalName.

**Certificate bindings**

There are four supported values for this attribute, with two mappings considered low-affinity (insecure) and the other two considered high-affinity binding. In general, mapping types are considered high-affinity if they are based on identifiers that you cannot reuse. Therefore, all mapping types based on usernames and email addresses are considered low-affinity.

|Certificate mapping Field | Examples of values in CertificateUserIds | User object attributes | Type | 
|--------------------------|--------------------------------------|------------------------|----------|
|PrincipalName | “X509:\<PN>bob@woodgrove.com” | userPrincipalName <br> onPremisesUserPrincipalName <br> certificateUserIds | low-affinity |
|RFC822Name	| “X509:\<RFC822>user@woodgrove.com” | userPrincipalName <br> onPremisesUserPrincipalName <br> certificateUserIds | low-affinity |
|X509SKI | “X509:\<SKI>123456789abcdef”| certificateUserIds | high-affinity |
|X509SHA1PublicKey |“X509:\<SHA1-PUKEY>123456789abcdef” | certificateUserIds | high-affinity |

**How does Azure AD resolve multiple username policy binding rules?**

Use the highest priority (lowest number) binding.

1. Look up the user object by using the username or User Principal Name.
1. If the X.509 certificate field is on the presented certificate, Azure AD will match the value in the certificate field to the user object attribute value.
   1. If a match is found, user authentication is successful.
   1. If a match is not found, move to the next priority binding.
1. If the X.509 certificate field is not on the presented certificate, move to the next priority binding.
1. Validate all the configured username bindings until one of them results in a match and user authentication is successful.
1. If a match is not found on all the configured username bindings, user authentication fails.

## Certificate-based authentication in MostRecentlyUsed (MRU) methods
 
Once a user authenticates successfully using CBA, the user's MostRecentlyUsed (MRU) authentication method will be CBA. Next time, when the user enters their UPN and clicks **Next**, the user will be taken to the CBA method directly, and doesn't need to select **Use the certificate or smart card** to use CBA.

To reset the MRU method, the user needs to cancel the certificate picker, click **Other ways to sign in**, and select another method available to the user and authenticate successfully.

## Understanding the certificate revocation process

The certificate revocation process allows the admin to revoke a previously issued certificate from being used for future authentication. The certificate revocation will not revoke already issued tokens of the user. Follow the steps to manually revoke tokens at [Configure revocation](active-directory-certificate-based-authentication-get-started.md#step-3-configure-revocation).

Azure AD downloads and caches the customers certificate revocation list (CRL) from their certificate authority to check if certificates are revoked during the authentication of the user.

An admin can configure the CRL distribution point during the setup process of the trusted issuers in the Azure AD tenant. Each trusted issuer should have a CRL that can be referenced by using an internet-facing URL.
 
>[!IMPORTANT]
>The maximum size of a CRL for Azure AD to successfully download on an interactive sign-in and cache is 20MB in Azure Global and 45MB in Azure US Government clouds, and the time required to download the CRL must not exceed 10 seconds. If Azure AD can't download a CRL, certificate-based authentications using certificates issued by the corresponding CA will fail. As a best practice to keep CRL files within size limits, keep certificate lifetimes within reasonable limits and to clean up expired certificates. For more information, see [Is there a limit for CRL size?](certificate-based-authentication-faq.yml#is-there-a-limit-for-crl-size-).

When a user performs an interactive sign-in with a certificate, and the CRL exceeds the interactive limit for a cloud, their initial sign-in will fail with the following error:

"The Certificate Revocation List (CRL) downloaded from {uri} has exceeded the maximum allowed size ({size} bytes) for CRLs in Azure Active Directory. Try again in few minutes. If the issue persists, contact your tenant administrators."

After the error, Azure AD will attempt to download the CRL subject to the service-side limits (45MB in Azure Global and 150MB in Azure US Government clouds).

>[!IMPORTANT]
>If the admin skips the configuration of the CRL, Azure AD will not perform any CRL checks during the certificate-based authentication of the user. This can be helpful for initial troubleshooting, but shouldn't be considered for production use.

As of now, we don't support Online Certificate Status Protocol (OCSP) because of performance and reliability reasons. Instead of downloading the CRL at every connection by the client browser for OCSP, Azure AD downloads once at the first sign-in and caches it, thereby improving the performance and reliability of CRL verification. We also index the cache so the search is much faster every time. Customers must publish CRLs for certificate revocation.

**Typical flow of the CRL check:**

1. Azure AD will attempt to download the CRL at the first sign-in event of any user with a certificate of the corresponding trusted issuer or certificate authority. 
1. Azure AD will cache and re-use the CRL for any subsequent usage. It will honor the **Next update date** and, if available, **Next CRL Publish date** (used by Windows Server CAs) in the CRL document.
1. The user certificate-based authentication will fail if:
   - A CRL has been configured for the trusted issuer and Azure AD cannot download the CRL, due to availability, size, or latency constraints.
   - The user's certificate is listed as revoked on the CRL.
   
      :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/user-cert.png" alt-text="Screenshot of the revoked user certificate in the CRL." :::  

   - Azure AD will attempt to download a new CRL from the distribution point if the cached CRL document is expired. 

>[!NOTE]
>Azure AD will check the CRL of the issuing CA and other CAs in the PKI trust chain up to the root CA. We have a limit of up to 5 CAs from the leaf client certificate for CRL validation in the PKI chain. The limitation is to make sure a bad actor will not bring down the service by uploading a PKI chain with a huge number of CAs with a bigger CRL size.
If the tenant’s PKI chain has more than 5 CAs and in case of a CA compromise, the administrator should remove the compromised trusted issuer from the Azure AD tenant configuration.
 

>[!IMPORTANT]
>Due to the nature of CRL caching and publishing cycles, it is highly recommended in case of a certificate revocation to also revoke all sessions of the affected user in Azure AD.

As of now, there is no way for the administrator to manually force or re-trigger the download of the CRL. 

### How to configure revocation

[!INCLUDE [Configure revocation](../../../includes/active-directory-authentication-configure-revocation.md)]

## Understanding Sign-in logs

Sign-in logs provide information about sign-ins and how your resources are used by your users. For more information about sign-in logs, see [Sign-in logs in Azure Active Directory](../reports-monitoring/concept-all-sign-ins.md).

Let's walk through two scenarios, one where the certificate satisfies single-factor authentication and another where the certificate satisfies MFA.

**Test scenario configuration** 

For the test scenarios, choose a user with a conditional access policy that requires MFA. 
Configure the user binding policy by mapping SAN Principal Name to UserPrincipalName.

The user certificate should be configured like this screenshot:

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/user-certificate.png" alt-text="Screenshot of the user certificate." :::  

### Test single-factor authentication 

For the first test scenario, configure the authentication policy where the Issuer subject rule satisfies single-factor authentication.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/single-factor.png" alt-text="Screenshot of the Authentication policy configuration showing single-factor authentication required." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/single-factor.png":::  

1. Sign in to the Azure portal as the test user by using CBA. The authentication policy is set where Issuer subject rule satisfies single-factor authentication.
1. After sign-in was succeeds, click **Azure Active Directory** > **Sign-in logs**.

   Let's look closer at some of the entries you can find in the **Sign-in logs**.

   The first entry requests the X.509 certificate from the user. The status **Interrupted** means that Azure AD validated that CBA is enabled in the tenant and a certificate is requested for authentication.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/entry-one.png" alt-text="Screenshot of single-factor authentication entry in the sign-in logs." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/entry-one.png":::  

   The **Activity Details** shows this is just part of the expected login flow where the user selects a certificate. 
   
   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/cert-activity-details.png" alt-text="Screenshot of activity details in the sign-in logs." :::  

   The **Additional Details** show the certificate information.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/additional-details.png" alt-text="Screenshot of multifactor additional details in the sign-in logs." :::  

   These additional entries show that the authentication is complete, a primary refresh token is sent back to the browser, and user is given access to the resource.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/refresh-token.png" alt-text="Screenshot of refresh token entry in the sign-in logs." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/refresh-token.png":::  

### Test multifactor authentication

For the next test scenario, configure the authentication policy where the **policyOID** rule satisfies multifactor authentication.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/multifactor.png" alt-text="Screenshot of the Authentication policy configuration showing multifactor authentication required." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/multifactor.png":::  

1. Sign in to the Azure portal using CBA. Since the policy was set to satisfy multifactor authentication, the user sign-in is successful without a second factor.
1. Click **Azure Active Directory** > **Sign-in logs**.

   You'll see several entries in the Sign-in logs, including an entry with **Interrupted** status. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/several-entries.png" alt-text="Screenshot of several entries in the sign-in logs." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/several-entries.png":::  

    The **Activity Details** shows this is just part of the expected login flow where the user selects a certificate. 
   
   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/mfacert-activity-details.png" alt-text="Screenshot of second-factor sign-in details in the sign-in logs." :::  
   
   The entry with **Interrupted** status has more diagnostic info on the **Additional Details** tab. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/interrupted-user-details.png" alt-text="Screenshot of interrupted attempt details in the sign-in logs." :::  

   The following table has a description of each field.

   | Field   | Description  |
   |---------|--------------|
   | User certificate subject name | Refers to the subject name field in the certificate. |
   | User certificate binding | Certificate: Principal Name; User Attribute: userPrincipalName; Rank: 1<br>This shows which SAN PrincipalName certificate field was mapped to userPrincipalName user attribute and was priority 1. |
   | User certificate authentication level | multiFactorAuthentication |
   | User certificate authentication level type | PolicyId<br>This shows policy OID was used to determine the authentication strength. |
   | User certificate authentication level identifier | 1.2.3.4<br>This shows the value of the identifier policy OID from the certificate. |

## Known issues

- There is a double prompt for iOS because iOS only supports pushing certificates to a device storage. When an organization pushes user certificates to an iOS device through Mobile Device Management (MDM) or when a user accesses first-party or native apps, there is no access to device storage. Only Safari can access device storage.

  When an iOS client sees a client TLS challenge and the user clicks **Sign in with certificate**, iOS client knows it cannot handle it and sends a completely new authorization request using the Safari browser. The user clicks **Sign in with certificate** again, at which point Safari which has access to certificates for authentication in device storage. This requires users to click **Sign in with certificate** twice, once in app’s WKWebView and once in Safari’s System WebView.

  We're aware of the UX experience issue and we're working to fix this on iOS to have a seamless UX experience.

## Understanding the certificate-based authentication error page

Certificate-based authentication can fail for reasons such as the certificate being invalid, or the user selected the wrong certificate or an expired certificate, or because of a Certificate Revocation List (CRL) issue. When certificate validation fails, the user sees this error:

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/validation-error.png" alt-text="Screenshot of a certificate validation error." :::  

If CBA fails on a browser, even if the failure is because you cancel the certificate picker, you need to close the browser session and open a new session to try CBA again. A new session is required because browsers cache the certificate. When CBA is re-tried, the browser will send the cached certificate during the TLS challenge, which causes sign-in failure and the validation error.
 
Click **More details** to get logging information that can be sent to an administrator, who in turn can get more information from the Sign-in logs.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/details.png" alt-text="Screenshot of error details." :::  

Click **Other ways to sign in** to try other methods available to the user to sign in. 
 
>[!NOTE]
>If you retry CBA in a browser, it'll keep failing due to the browser caching issue. Users need to open a new browser session and sign in again.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/new-sign-in.png" alt-text="Screenshot of a new sign-in attempt." :::  

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Azure AD CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [Advanced features](concept-certificate-based-authentication-advanced-features.md)
- [FAQ](certificate-based-authentication-faq.yml)
