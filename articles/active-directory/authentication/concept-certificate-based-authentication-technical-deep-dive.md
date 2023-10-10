---
title: Microsoft Entra certificate-based authentication technical deep dive
description: Learn how Microsoft Entra certificate-based authentication works

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 10/02/2023


ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
ms.localizationpriority: high
---

# Microsoft Entra certificate-based authentication technical deep dive

This article explains how Microsoft Entra certificate-based authentication (CBA) works, and dives into technical details on Microsoft Entra CBA configurations.

<a name='how-does-azure-ad-certificate-based-authentication-work'></a>

## How does Microsoft Entra certificate-based authentication work?

The following image describes what happens when a user tries to sign in to an application in a tenant where Microsoft Entra CBA is enabled.

:::image type="content" border="false" source="./media/concept-certificate-based-authentication-technical-deep-dive/how-it-works.png" alt-text="Illustration with steps about how Microsoft Entra certificate-based authentication works." :::

Now we'll walk through each step:

1. The user tries to access an application, such as [MyApps portal](https://myapps.microsoft.com/).
1. If the user isn't already signed in, the user is redirected to the Microsoft Entra ID **User Sign-in** page at [https://login.microsoftonline.com/](https://login.microsoftonline.com/).
1. The user enters their username into the Microsoft Entra sign-in page, and then clicks **Next**. Microsoft Entra ID does home realm discovery using the tenant name and the username is used to look up the user in Microsoft Entra tenant.
   
   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in.png" alt-text="Screenshot of the Sign-in for MyApps portal.":::
  
1. Microsoft Entra ID checks whether CBA is enabled for the tenant. If CBA is enabled, the user sees a link to **Use a certificate or smartcard** on the password page. If the user doesn't see the sign-in link, make sure CBA is enabled on the tenant. For more information, see [How do I enable Microsoft Entra CBA?](./certificate-based-authentication-faq.yml#how-can-an-administrator-enable-microsoft-entra-cba-).
   
   >[!NOTE]
   > If CBA is enabled on the tenant, all users see the link to **Use a certificate or smart card** on the password page. However, only the users in scope for CBA can authenticate successfully against an application that uses Microsoft Entra ID as their Identity provider (IdP).

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-cert.png" alt-text="Screenshot of the Use a certificate or smart card.":::

   If you enabled other authentication methods like **Phone sign-in** or **FIDO2**, users may see a different sign-in screen.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-alt.png" alt-text="Screenshot of the Sign-in if FIDO2 is also enabled.":::

1. Once the user selects certificate-based authentication, the client is redirected to the certauth endpoint, which is [https://certauth.login.microsoftonline.com](https://certauth.login.microsoftonline.com) for Azure Global. For [Azure Government](../../azure-government/compare-azure-government-global-azure.md#guidance-for-developers), the certauth endpoint is [https://certauth.login.microsoftonline.us](https://certauth.login.microsoftonline.us).  

However, with the issue hints feature enabled (coming soon), the new certauth endpoint will change to `https://t{tenantid}.certauth.login.microsoftonline.com`.

The endpoint performs TLS mutual authentication, and requests the client certificate as part of the TLS handshake. You'll see an entry for this request in the sign-in log.

   >[!NOTE]
   >The network administrator should allow access to the User sign-in page and certauth endpoint `*.certauth.login.microsoftonline.com` for the customer's cloud environment. Disable TLS inspection on the certauth endpoint to make sure the client certificate request succeeds as part of the TLS handshake.

   Customers should make sure their TLS inspection disablement also work for the new url with issuer hints. Our recommendation is not to hardcode the url with tenantId as for B2B users the tenantId might change. Use a regular expression to allow both the old and new URL to work for TLS inspection disablement. For example, use `*.certauth.login.microsoftonline.com` or `*certauth.login.microsoftonline.com`for Azure Global tenants, and `*.certauth.login.microsoftonline.us` or `*certauth.login.microsoftonline.us` for Azure Government tenants, depending on the proxy used.

   Without this change, certificate-based authentication will fail when you enable Issuer Hints feature.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-log.png" alt-text="Screenshot of the sign-in log in Microsoft Entra ID." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-log.png":::
   
   Click the log entry to bring up **Activity Details** and click **Authentication Details**. You'll see an entry for the X.509 certificate.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/entry.png" alt-text="Screenshot of the entry for X.509 certificate.":::

1. Microsoft Entra ID requests a client certificate, the user picks the client certificate, and clicks **Ok**.

   >[!NOTE] 
   >Trusted CA hints are not supported, so the list of certificates can't be further scoped. We're looking into adding this functionality in the future.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/cert-picker.png" alt-text="Screenshot of the certificate picker." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/cert-picker.png":::

1. Microsoft Entra ID verifies the certificate revocation list to make sure the certificate isn't revoked and is valid. Microsoft Entra ID identifies the user by using the [username binding configured](how-to-certificate-based-authentication.md#step-4-configure-username-binding-policy) on the tenant to map the certificate field value to the user attribute value.
1. If a unique user is found with a Conditional Access policy that requires multifactor authentication, and the [certificate authentication binding rule](how-to-certificate-based-authentication.md#step-3-configure-authentication-binding-policy) satisfies MFA, then Microsoft Entra ID signs the user in immediately. If MFA is required but the certificate satisfies only a single factor, either passwordless sign-in or FIDO2 are offered as a second factor if they are already registered.
1. Microsoft Entra ID completes the sign-in process by sending a primary refresh token back to indicate successful sign-in.
1. If the user sign-in is successful, the user can access the application.

## Certificate-based authentication is MFA capable

Microsoft Entra CBA is capable of multifactor authentication (MFA) method. Microsoft Entra CBA can be either single-factor (SF) or multifactor (MF) depending on the tenant configuration. Enabling CBA makes a user potentially capable to complete MFA. A user may need more configuration to complete MFA, and proof up to register other authentication methods when the user is in scope for CBA.

If the CBA-enabled user only has a Single Factor (SF) certificate and needs to complete MFA:
   1. Use a password and SF certificate.
   1. Issue a Temporary Access Pass.
   1. Authentication Policy Administrator adds a phone number and allows voice/text message authentication for the user account.

If the CBA-enabled user hasn't yet been issued a certificate and needs to complete MFA:
   1. Issue a Temporary Access Pass.
   1. Authentication Policy Administrator adds a phone number and allows voice/text message authentication for the user account.

If the CBA-enabled user can't use an MF cert, such as on mobile device without smart card support, and needs to complete MFA:
   1. Issue a Temporary Access Pass.
   1. User needs to register another MFA method (when user can use MF cert).
   1. Use password and MF cert (when user can use MF cert).
   1. Authentication Policy Administrator adds a phone number and allows voice/text message authentication for the user account.


## MFA with Single-factor certificate-based authentication

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Microsoft Entra CBA can be used as a second factor to meet MFA requirements with single-factor certificates. 
Some of the supported combinations are

1. CBA (first factor) and passwordless phone sign-in (PSI as second factor)
1. CBA (first factor) and FIDO2 security keys (second factor) 
1. Password (first factor) and CBA (second factor) 

Users need to have another way to get MFA and register passwordless sign-in or FIDO2 in advance to signing in with Microsoft Entra CBA.

>[!IMPORTANT]
>A user is considered MFA capable when they are included in the CBA method settings. This means the user can't use proof up as part of their authentication to register other available methods. Make sure users without a valid certificate aren't included in the CBA method settings. For more information about how authentication works, see [Microsoft Entra multifactor authentication](../authentication/concept-mfa-howitworks.md).

**Steps to set up passwordless phone signin(PSI) with CBA**

For passwordless sign-in to work, users should disable legacy notification through mobile app.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).

1. Follow the steps at [Enable passwordless phone sign-in authentication](../authentication/howto-authentication-passwordless-phone.md#enable-passwordless-phone-sign-in-authentication-methods).

   >[!IMPORTANT]
   >In the above configuration under step 4, please choose **Passwordless** option. Change the mode for each groups added for PSI for **Authentication mode**, choose **Passwordless** for passwordless sign-in to work with CBA. If the admin configures "Any", CBA and PSI don't work.

1. Select **Protection** > **Multifactor authentication** > **Additional cloud-based multifactor authentication settings**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/configure.png" alt-text="Screenshot of how to configure multifactor authentication settings.":::

1. Under **Verification options**, clear the **Notification through mobile app** checkbox and click **Save**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/clear-notification.png" alt-text="Screenshot of how to remove notification through mobile app.":::

## MFA authentication flow using single factor certificates and passwordless sign in

Let's look at an example of a user who has single factor certificates and has configured passwordless sign in. 

1. Enter your User Principal Name (UPN) and click **Next**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/user-principal-name.png" alt-text="Screenshot of how to enter a user principal name.":::

1. Select **Sign in with a certificate**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-cert.png" alt-text="Screenshot of how to sign in with a certificate.":::

   If you enabled other authentication methods like Phone sign-in or FIDO2 security keys, users may see a different sign-in screen.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/sign-in-alt.png" alt-text="Screenshot of alternate way to sign in with a certificate.":::

1. Pick the correct user certificate in the client certificate picker and click **OK**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/cert-picker.png" alt-text="Screenshot of how to select a certificate.":::

1. Because the certificate is configured to be single-factor authentication strength, the user needs a second factor to meet MFA requirements. The user sees available second factors, which in this case is passwordless sign-in. Select **Approve a request on my Microsoft Authenticator app**.
   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/second-factor-request.png" alt-text="Screenshot of second factor request.":::

1. You'll get a notification on your phone. Select **Approve Sign-in?**.
   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/approve.png" alt-text="Screenshot of approval request.":::

1. Enter the number you see on the browser or app screen into Microsoft Authenticator.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/number.png" alt-text="Screenshot of number match.":::

1. Select **Yes** and user can authenticate and sign in.

## Understanding the authentication binding policy

The authentication binding policy helps determine the strength of authentication as either single-factor or multifactor. An administrator can change the default value from single-factor to multifactor, or set up custom policy configurations either by using issuer subject or policy OID fields in the certificate.

### Certificate strengths

An admin can determine whether the certificates are single-factor or multifactor strength. For more information, see the documentation that maps [NIST Authentication Assurance Levels to Microsoft Entra auth Methods](https://aka.ms/AzureADNISTAAL), which builds upon [NIST 800-63B SP 800-63B, Digital Identity Guidelines: Authentication and Lifecycle Mgmt](https://csrc.nist.gov/publications/detail/sp/800-63b/final).

### Multifactor certificate authentication 

When a user has a multifactor certificate, they can perform multifactor authentication only with certificates. However, the tenant admin should make sure the certificates are protected with a PIN or hardware module to be considered multifactor.

<a name='how-azure-ad-resolves-multiple-authentication-policy-binding-rules'></a>

### How Microsoft Entra ID resolves multiple authentication policy binding rules

Because multiple authentication binding policy rules can be created with different certificate fields, there are some rules that determine the authentication protection level. They are as follows:

1. Exact match is used for strong authentication by using policy OID. If you have a certificate A with policy OID **1.2.3.4.5** and a derived credential B based on that certificate has a policy OID **1.2.3.4.5.6**, and the custom rule is defined as **Policy OID** with value **1.2.3.4.5** with MFA, only certificate A satisfies MFA, and credential B satisfies only single-factor authentication. If the user used derived credential during sign-in and was configured to have MFA, the user is asked for a second factor for successful authentication.
1. Policy OID rules take precedence over certificate issuer rules. If a certificate has both policy OID and Issuer, the policy OID is always checked first, and if no policy rule is found then the issuer subject bindings are checked. Policy OID has a higher strong authentication binding priority than the issuer.
1. If one CA binds to MFA, all user certificates that the CA issues qualify as MFA. The same logic applies for single-factor authentication.
1. If one policy OID binds to MFA, all user certificates that include this policy OID as one of the OIDs (A user certificate could have multiple policy OIDs) qualify as MFA.
1. If there's a conflict between multiple policy OIDs (such as when a certificate has two policy OIDs, where one binds to single-factor authentication and the other binds to MFA) then treat the certificate as a single-factor authentication.
1. One certificate can only have one valid strong authentication binding (that is, a certificate can't bind to both single-factor and MFA).

## Understanding the username binding policy

The username binding policy helps validate the certificate of the user. By default, Subject Alternate Name (SAN) Principal Name in the certificate is mapped to UserPrincipalName attribute of the user object to determine the user.

### Achieve higher security with certificate bindings

There are four supported methods for certificate bindings. In general, mapping types are considered high-affinity if they're based on identifiers that you can't reuse, such as Subject Key Identifiers or SHA1 Public Key. These identifiers convey a higher assurance that only a single certificate can be used to authenticate the respective user. All mapping types based on usernames and email addresses are considered low-affinity. Microsoft Entra ID implements two mappings considered low-affinity based on reusable identifiers. The other two are considered high-affinity bindings. For more information, see [certificateUserIds](concept-certificate-based-authentication-certificateuserids.md). 

|Certificate mapping field | Examples of values in certificateUserIds | User object attributes | Type | 
|--------------------------|--------------------------------------|------------------------|----------|
|PrincipalName | X509:\<PN>bob@woodgrove.com | userPrincipalName <br> onPremisesUserPrincipalName <br> certificateUserIds | low-affinity |
|RFC822Name	| X509:\<RFC822>user@woodgrove.com | userPrincipalName <br> onPremisesUserPrincipalName <br> certificateUserIds | low-affinity |
|X509SKI | X509:\<SKI>123456789abcdef| certificateUserIds | high-affinity |
|X509SHA1PublicKey |X509:\<SHA1-PUKEY>123456789abcdef | certificateUserIds | high-affinity |

<a name='how-azure-ad-resolves-multiple-username-policy-binding-rules'></a>

### How Microsoft Entra ID resolves multiple username policy binding rules

Use the highest priority (lowest number) binding.

1. Look up the user object by using the username or User Principal Name.
1. If the X.509 certificate field is on the presented certificate, Microsoft Entra ID matches the value in the certificate field to the user object attribute value.
   1. If a match is found, user authentication is successful.
   1. If a match isn't found, move to the next priority binding.
1. If the X.509 certificate field isn't on the presented certificate, move to the next priority binding.
1. Validate all the configured username bindings until one of them results in a match and user authentication is successful.
1. If a match isn't found on any of the configured username bindings, user authentication fails.

<a name='securing-azure-ad-configuration-with-multiple-username-bindings'></a>

## Securing Microsoft Entra configuration with multiple username bindings

Each of the Microsoft Entra attributes (userPrincipalName, onPremiseUserPrincipalName, certificateUserIds) available to bind certificates to Microsoft Entra user accounts has unique constraint to ensure a certificate only matches a single Microsoft Entra user account. However, Microsoft Entra CBA does support configuring multiple binding methods in the username binding policy. This allows an administrator to accommodate multiple certificate configurations. However the combination of some methods can also potentially permit one certificate to match to multiple Microsoft Entra user accounts. 

>[!IMPORTANT]
>When using multiple bindings, Microsoft Entra CBA authentication is only as secure as your low-affinity binding as Microsoft Entra CBA validates each of the bindings to authenticate the user. In order to eliminate a scenario where a single certificate matching multiple Microsoft Entra accounts, the tenant administrator should:
>- Configure a single binding method in the username binding policy.
>- If a tenant has multiple binding methods configured and doesn't want to allow one certificate to multiple accounts, the tenant admin must ensure all allowable methods configured in the policy map to the same Microsoft Entra account, i.e all user accounts should have values matching all the bindings.
>- If a tenant has multiple binding methods configured, the admin should make sure that they do not have more than one low-affinity binding 

For example, if the tenant admin has two username bindings on PrincipalName mapped to Microsoft Entra UPN and SubjectKeyIdentifier (SKI) to certificateUserIds and wants a certificate to only be used for a single Microsoft Entra account, the admin must make sure that account has the UPN that is present in the certificate and implements the SKI mapping in the same account certificateUserId attribute.

Here's an example of potential values for UPN and certificateUserIDs:

Microsoft Entra user Principal Name = Bob.Smith@Contoso.com <br>
certificateUserIDs = [x509:\<SKI>89b0f468c1abea65ec22f0a882b8fda6fdd6750p]<br>

Having both PrincipalName and SKI values from the user's certificate mapped to the same account ensures that while the tenant policy permits mapping PrincipalName to Microsoft Entra UPN & SKI values in certificateUserIds, that certificate can only match a single Microsoft Entra account. With unique constraint on both UserPrincipalName and certificateUserIds, no other user account can have the same values and can't successfully authenticate with the same certificate. 

## Understanding the certificate revocation process

The certificate revocation process allows the admin to revoke a previously issued certificate from being used for future authentication. The certificate revocation won't revoke already issued tokens of the user. Follow the steps to manually revoke tokens at [Configure revocation](./certificate-based-authentication-federation-get-started.md#step-3-configure-revocation).

Microsoft Entra ID downloads and caches the customers certificate revocation list (CRL) from their certificate authority to check if certificates are revoked during the authentication of the user.

An admin can configure the CRL distribution point during the setup process of the trusted issuers in the Microsoft Entra tenant. Each trusted issuer should have a CRL that can be referenced by using an internet-facing URL.
 
>[!IMPORTANT]
>The maximum size of a CRL for Microsoft Entra ID to successfully download on an interactive sign-in and cache is 20 MB in Azure Global and 45 MB in Azure US Government clouds, and the time required to download the CRL must not exceed 10 seconds. If Microsoft Entra ID can't download a CRL, certificate-based authentications using certificates issued by the corresponding CA fail. As a best practice to keep CRL files within size limits, keep certificate lifetimes within reasonable limits and to clean up expired certificates. For more information, see [Is there a limit for CRL size?](certificate-based-authentication-faq.yml#is-there-a-limit-for-crl-size-).

When a user performs an interactive sign-in with a certificate, and the CRL exceeds the interactive limit for a cloud, their initial sign-in fails with the following error:

"The Certificate Revocation List (CRL) downloaded from {uri} has exceeded the maximum allowed size ({size} bytes) for CRLs in Microsoft Entra ID. Try again in few minutes. If the issue persists, contact your tenant administrators."

After the error, Microsoft Entra ID attempts to download the CRL subject to the service-side limits (45 MB in Azure Global and 150 MB in Azure US Government clouds).

>[!IMPORTANT]
>If the admin skips the configuration of the CRL, Microsoft Entra ID doesn't perform any CRL checks during the certificate-based authentication of the user. This can be helpful for initial troubleshooting, but shouldn't be considered for production use.

As of now, we don't support Online Certificate Status Protocol (OCSP) because of performance and reliability reasons. Instead of downloading the CRL at every connection by the client browser for OCSP, Microsoft Entra ID downloads once at the first sign-in and caches it, thereby improving the performance and reliability of CRL verification. We also index the cache so the search is much faster every time. Customers must publish CRLs for certificate revocation.

The following steps are a typical flow of the CRL check:

1. Microsoft Entra ID attempts to download the CRL at the first sign-in event of any user with a certificate of the corresponding trusted issuer or certificate authority. 
1. Microsoft Entra ID caches and re-uses the CRL for any subsequent usage. It honors the **Next update date** and, if available, **Next CRL Publish date** (used by Windows Server CAs) in the CRL document.
1. The user certificate-based authentication fails if:
   - A CRL has been configured for the trusted issuer and Microsoft Entra ID can't download the CRL, due to availability, size, or latency constraints.
   - The user's certificate is listed as revoked on the CRL.
   
     :::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/user-cert.png" alt-text="Screenshot of the revoked user certificate in the CRL." :::  

   - Microsoft Entra ID attempts to download a new CRL from the distribution point if the cached CRL document is expired. 

>[!NOTE]
>Microsoft Entra ID checks the CRL of the issuing CA and other CAs in the PKI trust chain up to the root CA. We have a limit of up to 10 CAs from the leaf client certificate for CRL validation in the PKI chain. The limitation is to make sure a bad actor doesn't bring down the service by uploading a PKI chain with a huge number of CAs with a bigger CRL size.
If the tenant's PKI chain has more than 5 CAs and in case of a CA compromise, the administrator should remove the compromised trusted issuer from the Microsoft Entra tenant configuration.
 

>[!IMPORTANT]
>Due to the nature of CRL caching and publishing cycles, it is highly recommended in case of a certificate revocation to also revoke all sessions of the affected user in Microsoft Entra ID.

As of now, there's no way for the administrator to manually force or re-trigger the download of the CRL. 

### How to configure revocation

[!INCLUDE [Configure revocation](../../../includes/active-directory-authentication-configure-revocation.md)]

## Understanding Sign-in logs

Sign-in logs provide information about sign-ins and how your resources are used by your users. For more information about sign-in logs, see [Sign-in logs in Microsoft Entra ID](../reports-monitoring/concept-all-sign-ins.md).

Let's walk through two scenarios, one where the certificate satisfies single-factor authentication and another where the certificate satisfies MFA.

For the test scenarios, choose a user with a Conditional Access policy that requires MFA. 
Configure the user binding policy by mapping SAN Principal Name to UserPrincipalName.

The user certificate should be configured like this screenshot:

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/user-certificate.png" alt-text="Screenshot of the user certificate." :::  

### Test single-factor authentication 

For the first test scenario, configure the authentication policy where the Issuer subject rule satisfies single-factor authentication.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/single-factor.png" alt-text="Screenshot of the Authentication policy configuration showing single-factor authentication required." lightbox="./media/concept-certificate-based-authentication-technical-deep-dive/single-factor.png":::  

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as the test user by using CBA. The authentication policy is set where Issuer subject rule satisfies single-factor authentication.
1. Search for and select **Sign-in logs**.

   Let's look closer at some of the entries you can find in the **Sign-in logs**.

   The first entry requests the X.509 certificate from the user. The status **Interrupted** means that Microsoft Entra ID validated that CBA is enabled in the tenant and a certificate is requested for authentication.

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

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) using CBA. Since the policy was set to satisfy multifactor authentication, the user sign-in is successful without a second factor.
1. Search for and select **Sign-ins**.

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

## Understanding the certificate-based authentication error page

Certificate-based authentication can fail for reasons such as the certificate being invalid, or the user selected the wrong certificate or an expired certificate, or because of a Certificate Revocation List (CRL) issue. When certificate validation fails, the user sees this error:

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/validation-error.png" alt-text="Screenshot of a certificate validation error." :::  

If CBA fails on a browser, even if the failure is because you cancel the certificate picker, you need to close the browser session and open a new session to try CBA again. A new session is required because browsers cache the certificate. When CBA is re-tried, the browser sends the cached certificate during the TLS challenge, which causes sign-in failure and the validation error.
 
Click **More details** to get logging information that can be sent to an administrator, who in turn can get more information from the Sign-in logs.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/details.png" alt-text="Screenshot of error details." :::  

Click **Other ways to sign in** to try other methods available to the user to sign in. 
 
>[!NOTE]
>If you retry CBA in a browser, it'll keep failing due to the browser caching issue. Users need to open a new browser session and sign in again.

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-technical-deep-dive/new-sign-in.png" alt-text="Screenshot of a new sign-in attempt." :::  

## Certificate-based authentication in MostRecentlyUsed (MRU) methods
 
Once a user authenticates successfully using CBA, the user's MostRecentlyUsed (MRU) authentication method is set to CBA. Next time, when the user enters their UPN and clicks **Next**, the user is taken to the CBA method directly, and need not select **Use the certificate or smart card**.

To reset the MRU method, the user needs to cancel the certificate picker, click **Other ways to sign in**, and select another method available to the user and authenticate successfully.

## External identity support

An external identity can't perform multifactor authentication to the resource tenant with Microsoft Entra CBA. Instead, have the user perform MFA using CBA in the home tenant, and set up cross tenant settings for the resource tenant to trust MFA from the home tenant.

For more information about how to enable **Trust multifactor authentication from Microsoft Entra tenants**, see [Configure B2B collaboration cross-tenant access](../external-identities/cross-tenant-access-settings-b2b-collaboration.md#to-change-inbound-trust-settings-for-mfa-and-device-claims).

## Known issues

- On iOS clients, there's a double prompt issue as part of the Microsoft Entra CBA flow where the user needs to click **Use the certificate or smart card** twice. We're aware of the UX experience issue and working on fixing this for a seamless UX experience.

## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Microsoft Entra CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
- [Troubleshoot Microsoft Entra CBA](./certificate-based-authentication-faq.yml)
